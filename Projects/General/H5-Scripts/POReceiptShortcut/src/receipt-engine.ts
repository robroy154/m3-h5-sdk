/**
 * The receipt, start to finish.
 *
 * Everything here is sequencing and failure policy; the calls themselves live
 * in mi-gateway and the records in mi-requests. Nothing in this file touches
 * H5, the DOM, or the clock directly — the executor, the log and the waits all
 * arrive by injection, which is what lets the whole sequence be exercised
 * against a fake M3.
 *
 * Two things V6 got structurally wrong are fixed here rather than tidied:
 *
 * 1. Rollback had three trigger points — addEquip()'s catch, run()'s inner
 *    catch, and _handleTransactionFailure(). The second and third were no-ops
 *    only because the tracking array had already been cleared, which meant the
 *    control flow could not be reasoned about locally. There is exactly one
 *    trigger here, in runReceipt, and it is the only place rollback is called.
 *
 * 2. Rollback ran on any failure, including one where nobody could tell
 *    whether the goods had moved. See ReceiptOutcome.
 */

import { ReceiptConfig, canStoreOversizeSerial } from './config';
import {
  STATUS_PROCESSED_OK,
  extractErrorMessage,
  getTransactionStatusDescription,
  getTroubleshootingInfo,
  statusWarrantsLineLookup,
} from './errors';
import {
  CreatedEquipment,
  MiExecutor,
  RetryOptions,
  createEquipment,
  getTransactionStatus,
  getWhsLineFailureDetail,
  postWarehouseHeader,
  postWarehouseLine,
  postWarehousePack,
  processWarehouseTransaction,
  specCustomFieldAdd,
  specCustomFieldDelete,
  specEquipmentDelete,
} from './mi-gateway';
import {
  PoLineContext,
  WhsLineContext,
  WhsLineInput,
  buildCustomFieldRecord,
  buildEquipmentRecord,
  buildWarehouseHeaderRecord,
  buildWarehouseLineRecord,
  buildWarehousePackRecord,
  chooseOversizeTarget,
} from './mi-requests';
import { EquipmentPlan } from './receiving-policy';
import { SerialEntry } from './serial-policy';

/** The subset of H5's IScriptLog this module uses. */
export interface ReceiptLog {
  Error(message: string): void;
  Warning(message: string): void;
  Info(message: string): void;
  Debug(message: string): void;
}

export interface ReceiptDependencies {
  execute: MiExecutor;
  log: ReceiptLog;
  config: ReceiptConfig;
  retry: RetryOptions;
  /** Injected so tests do not wait and the engine owns no timer. */
  delay: (ms: number) => Promise<void>;
  /** Stamped into YREF so a receipt can be traced back to this script. */
  reference: string;
}

export interface ReceiptPlan {
  /** One per lot or serial, or a single line for an uncontrolled item. */
  lines: WhsLineInput[];
  /** Serials to pre-create in MMS240. Empty when none are needed. */
  entries: SerialEntry[];
  /** What MMS240MI/Add will accept for this item's numbering method. */
  equipmentPlan: EquipmentPlan;
  /** Context for the equipment records. */
  poLine: PoLineContext;
  /** Context for the warehouse lines, minus the ids the engine fills in. */
  line: Omit<WhsLineContext, 'MSGN' | 'PACN'>;
}

/**
 * How a receipt ended, and whether undoing the equipment is safe.
 *
 * The distinction matters more than it looks. Deleting equipment for a receipt
 * that actually posted leaves received stock with no serial records, which is
 * an inventory correction someone has to unpick by hand. Leaving equipment for
 * a receipt that did not post leaves a visible, deletable row in MMS240. So
 * when the outcome cannot be established, the engine keeps the records and
 * says exactly what to check — it does not guess in the destructive direction.
 */
export type ReceiptOutcome =
  | { kind: 'posted'; msgn: string; packNumber: string; lineNumbers: string[] }
  /** Established that nothing posted. Undoing the equipment is safe. */
  | { kind: 'failed'; msgn: string; message: string }
  /** Cannot establish whether it posted. Nothing is undone. */
  | { kind: 'indeterminate'; msgn: string; message: string };

export interface ReceiptResult {
  outcome: ReceiptOutcome;
  /** What was created, after any rollback. Empty when rollback succeeded. */
  createdEquipment: CreatedEquipment[];
  rolledBack: boolean;
}

/** M3 processes the message on the PrcWhsTran call; this is slack, not a poll. */
const STATUS_SETTLE_MS = 100;
/** V6's pause between a multi-line batch and processing it. */
const MULTI_LINE_SETTLE_MS = 200;

/* ─── Equipment creation ─────────────────────────────────────────────────── */

/**
 * Pre-creates the MMS240 records for a serialised item.
 *
 * PPS300's chkIndiv() updates an existing INDIV record during the receipt and
 * never creates one, so a serial with no equipment record gets received with
 * nothing to enrich. That gap is why this step exists.
 *
 * Each created record is pushed to `created` before the next call, so a
 * failure part-way through leaves the caller holding everything that did
 * succeed.
 */
async function createEquipmentRecords(
  deps: ReceiptDependencies,
  plan: ReceiptPlan,
  created: CreatedEquipment[]
): Promise<void> {
  if (plan.equipmentPlan === 'skip' || plan.entries.length === 0) {
    deps.log.Debug('Equipment creation skipped for this numbering method');
    return;
  }

  const omitSerial = plan.equipmentPlan === 'add-generated-serial';

  for (const entry of plan.entries) {
    const record = buildEquipmentRecord(entry, plan.poLine);
    const equipment = await createEquipment(
      deps.execute,
      record,
      entry.originalSerial,
      omitSerial
    );
    created.push(equipment);
    await storeOversizeSerial(deps, equipment, entry);
  }

  deps.log.Info('Created ' + created.length + ' equipment record(s)');
}

/**
 * Stores a serial too long for SERN and too long for EEQN.
 *
 * Up to 40 characters the original rides along in EEQN on the Add itself, so
 * nothing extra is needed. Past 40 it needs CMS474, which is customer setup,
 * and refusing here is deliberate: the alternative is writing a truncated
 * serial that looks correct and is not.
 */
async function storeOversizeSerial(
  deps: ReceiptDependencies,
  equipment: CreatedEquipment,
  entry: SerialEntry
): Promise<void> {
  if (chooseOversizeTarget(entry.originalSerial) !== 'cms474') {
    return;
  }
  if (!canStoreOversizeSerial(deps.config)) {
    throw new Error(
      'Serial "' + entry.originalSerial + '" is longer than 40 characters and ' +
        'cannot be stored without a CMS474 custom field. Add cfmg:<group> and ' +
        'cfmf:<field> to the script arguments, or receive this line in M3.'
    );
  }

  const record = buildCustomFieldRecord(
    { ...entry, derivedSerial: equipment.SERN },
    equipment.ITNO,
    deps.config.customFieldGroup,
    deps.config.customFieldName,
    deps.config.customFieldSequence
  );
  const response = await deps.execute(specCustomFieldAdd(record));
  if (response && (response.errorCode || response.errorMessage)) {
    throw new Error(
      extractErrorMessage(response, 'Storing full serial for ' + equipment.SERN)
    );
  }
  equipment.customFieldWritten = true;
}

/* ─── Posting ────────────────────────────────────────────────────────────── */

interface PostedMessage {
  msgn: string;
  packNumber: string;
  lineNumbers: string[];
}

async function postWarehouseMessage(
  deps: ReceiptDependencies,
  plan: ReceiptPlan
): Promise<PostedMessage> {
  const msgn = await postWarehouseHeader(
    deps.execute,
    buildWarehouseHeaderRecord(plan.line.WHLO, deps.config, deps.reference)
  );

  // The package groups this PO line's receipt lines under one message.
  const packNumber = await postWarehousePack(
    deps.execute,
    buildWarehousePackRecord(
      plan.line.WHLO,
      msgn,
      plan.line.PUNO + '_' + plan.line.PNLI
    )
  );

  const lineNumbers: string[] = [];
  for (const input of plan.lines) {
    const record = buildWarehouseLineRecord(input, {
      ...plan.line,
      MSGN: msgn,
      PACN: packNumber,
    });
    const label = input.BANO || input.RVQA || 'unknown';
    lineNumbers.push(await postWarehouseLine(deps.execute, record, label));
  }

  if (plan.lines.length > 1) {
    await deps.delay(MULTI_LINE_SETTLE_MS);
  }

  return { msgn, packNumber, lineNumbers };
}

/**
 * Processes the message and reads back what happened.
 *
 * Returns an outcome instead of throwing, because whether the caller may undo
 * the equipment depends on which failure this was — and that decision belongs
 * to exactly one place, in runReceipt.
 */
async function processAndConfirm(
  deps: ReceiptDependencies,
  posted: PostedMessage
): Promise<ReceiptOutcome> {
  let processingError = '';

  try {
    await processWarehouseTransaction(deps.execute, posted.msgn, deps.retry);
    await deps.delay(STATUS_SETTLE_MS);
  } catch (error) {
    // Do not conclude anything yet. The message may still have processed, so
    // the status below is what decides, not this error.
    processingError = extractErrorMessage(error as never, 'Transaction processing');
    deps.log.Warning('PrcWhsTran reported: ' + processingError);
  }

  let status: string;
  try {
    status = await getTransactionStatus(deps.execute, posted.msgn);
  } catch (error) {
    return {
      kind: 'indeterminate',
      msgn: posted.msgn,
      message: [
        processingError,
        extractErrorMessage(error as never, 'Transaction status check'),
        'The equipment records have been left in place because it cannot be ' +
          'confirmed whether the receipt posted. Check MHS850 for message ' +
          posted.msgn + '.',
      ]
        .filter(Boolean)
        .join('\n\n'),
    };
  }

  if (status === STATUS_PROCESSED_OK) {
    if (processingError) {
      // The call reported a failure but the message processed anyway — worth
      // a log line, not worth failing a receipt that demonstrably posted.
      deps.log.Warning(
        'PrcWhsTran reported an error but message ' + posted.msgn +
          ' reached status 90; treating the receipt as posted'
      );
    }
    return {
      kind: 'posted',
      msgn: posted.msgn,
      packNumber: posted.packNumber,
      lineNumbers: posted.lineNumbers,
    };
  }

  const detail = statusWarrantsLineLookup(status)
    ? await getWhsLineFailureDetail(deps.execute, posted.msgn, posted.packNumber)
    : '';

  return {
    kind: 'failed',
    msgn: posted.msgn,
    message: [
      getTroubleshootingInfo(status, detail),
      'Status ' + status + ' (' + getTransactionStatusDescription(status) + ')' +
        ', message ' + posted.msgn + '.',
      processingError,
    ]
      .filter(Boolean)
      .join('\n\n'),
  };
}

/* ─── Rollback — the one trigger ─────────────────────────────────────────── */

/**
 * Removes the equipment records this receipt created.
 *
 * Best-effort by design: a failure to delete one record must not stop the
 * others, because every one left behind is a row somebody has to find. The
 * CMS474 row goes first, since deleting the equipment first would orphan it.
 *
 * Returns the records it could not remove, so the caller can name them.
 */
export async function rollbackEquipment(
  deps: ReceiptDependencies,
  created: CreatedEquipment[]
): Promise<CreatedEquipment[]> {
  if (created.length === 0) return [];

  deps.log.Warning('Rolling back ' + created.length + ' equipment record(s)');

  const failures: CreatedEquipment[] = [];

  await Promise.all(
    created.map(async (equipment) => {
      if (equipment.customFieldWritten) {
        try {
          await deps.execute(
            specCustomFieldDelete(
              equipment.ITNO,
              equipment.SERN,
              deps.config.customFieldGroup,
              deps.config.customFieldName,
              deps.config.customFieldSequence
            )
          );
        } catch (error) {
          // Logged and continued: the equipment row is the one that blocks a
          // retry, so removing it still matters even if this leaves a stray.
          deps.log.Error(
            'Could not remove the stored serial for ' + equipment.SERN + ': ' +
              extractErrorMessage(error as never, 'Custom field cleanup')
          );
        }
      }

      try {
        await deps.execute(specEquipmentDelete(equipment.ITNO, equipment.SERN));
      } catch (error) {
        failures.push(equipment);
        deps.log.Error(
          'Could not remove equipment ' + equipment.ITNO + '/' + equipment.SERN +
            ': ' + extractErrorMessage(error as never, 'Equipment cleanup')
        );
      }
    })
  );

  if (failures.length > 0) {
    deps.log.Warning(
      'Rollback left ' + failures.length + ' of ' + created.length +
        ' equipment record(s) in place'
    );
  }
  return failures;
}

/* ─── Entry point ────────────────────────────────────────────────────────── */

/**
 * Runs the receipt and resolves the rollback question once.
 *
 * The shape is deliberate: every step either completes or produces an outcome,
 * and only this function decides what to undo. There is no path that rolls
 * back from inside a step, and no path that rolls back an outcome the engine
 * could not establish.
 */
export async function runReceipt(
  deps: ReceiptDependencies,
  plan: ReceiptPlan
): Promise<ReceiptResult> {
  const created: CreatedEquipment[] = [];
  let outcome: ReceiptOutcome;

  try {
    await createEquipmentRecords(deps, plan, created);
    const posted = await postWarehouseMessage(deps, plan);
    outcome = await processAndConfirm(deps, posted);
  } catch (error) {
    // Everything that throws does so before PrcWhsTran is reached, so nothing
    // has been processed and undoing the equipment is safe.
    outcome = {
      kind: 'failed',
      msgn: '',
      message: extractErrorMessage(error as never, 'Receipt'),
    };
  }

  if (outcome.kind === 'posted') {
    deps.log.Info('Receipt posted as message ' + outcome.msgn);
    return { outcome, createdEquipment: created, rolledBack: false };
  }

  if (outcome.kind === 'indeterminate') {
    deps.log.Error('Receipt outcome unknown: ' + outcome.message);
    return { outcome, createdEquipment: created, rolledBack: false };
  }

  deps.log.Error('Receipt failed: ' + outcome.message);
  const remaining = await rollbackEquipment(deps, created);
  return { outcome, createdEquipment: remaining, rolledBack: created.length > 0 };
}
