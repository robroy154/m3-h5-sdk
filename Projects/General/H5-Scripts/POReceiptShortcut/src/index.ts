/**
 * POReceiptShortcutV7 — PO receipt shortcut for PPS300/B.
 *
 * Receives a purchase order line from the panel the operator is already
 * looking at: reads the line, works out what M3 needs collected for it,
 * collects it, pre-creates equipment records for serialised items, and posts
 * the receipt as an MHS850 warehouse transaction.
 *
 * Customer agnostic. Every tenant-specific value is a script argument, and an
 * unsupplied optional feature is skipped rather than guessed at. See
 * CONFIGURATION.md.
 *
 * The class name has to match the file the H5 loader deploys, and the top
 * level has to be `var` — the bundle emits `var POReceiptShortcutV7 = (...)()`,
 * which satisfies both. The V7 suffix is forced by that deploy model, not
 * chosen: H5 keys on filename, so V4 and V7 cannot share one name during
 * cutover.
 */

import { ReceiptConfig, buildConfig, canStoreOversizeSerial } from './config';
import { promptLot, promptSerials } from './dialogs';
import {
  confirm,
  createExecutor,
  delay,
  readCompanyContext,
  readSelectedRows,
  showError,
  showMessage,
  withBusyIndicator,
} from './h5-adapter';
import {
  MiExecutor,
  buildLineContext,
  fetchLineData,
  lotOrSerialExists,
  specCustomerOrder,
  specReceivingMethod,
  specWarehouseGroup,
  toItems,
} from './mi-gateway';
import { WhsLineInput } from './mi-requests';
import { ASSIGNED_BY_M3, DIALOG_TITLES, buildReceiptSummary } from './presentation';
import {
  ReceiptLog,
  ReceiptPlan,
  runReceipt,
} from './receipt-engine';
import {
  classifyReceiptMode,
  isDirectPutAway,
  lotMustPreExist,
  autoLotNo,
  planEquipmentCreation,
} from './receiving-policy';
import { evaluateSelection } from './selection-policy';
import {
  CFMA_MAX_LENGTH,
  EEQN_MAX_LENGTH,
  SERN_MAX_LENGTH,
  generateEpochSeed,
  prepareSerialEntries,
} from './serial-policy';
import { findMissingFields } from './validation';

const SCRIPT_NAME = 'POReceiptShortcutV7';

/**
 * The operator's entered quantity.
 *
 * Read through the controller, not ScriptUtil.GetFieldValue: RVQA is an input
 * on the detail panel rather than a header field, and GetFieldValue does not
 * see it. V6 used controller.GetValue('RVQA') for exactly this reason.
 */
const ENTERED_QUANTITY_FIELD = 'RVQA';

/** PPS300/B field names. WW-prefixed fields are the panel header. */
const PANEL_FIELDS = {
  PUNO: 'WWPUNO',
  SUNO: 'WWSUNO',
  WHLO: 'WWWHLO',
  PNLI: 'PNLI',
  PNLS: 'PNLS',
  WHSL: 'WHSL',
  ITNO: 'ITNO',
  OEND: 'OEND',
};

interface LineIdentity {
  PUNO: string;
  SUNO: string;
  WHLO: string;
  PNLI: string;
  PNLS: string;
  WHSL: string;
  ITNO: string;
  OEND: string;
}

const POReceiptShortcutV7 = class {
  private readonly controller: IInstanceController;
  private readonly log: ReceiptLog;
  private readonly rawArgs: string;
  private config: ReceiptConfig;
  private execute: MiExecutor;

  constructor(args: IScriptArgs) {
    this.controller = args.controller;
    this.log = args.log;
    this.rawArgs = args.args || '';
  }

  /**
   * Script entry point. H5 calls this every time the operator runs the
   * shortcut, and each call performs one receipt.
   *
   * There is deliberately no InstanceCache guard. V7 had one, on the theory
   * that it stopped handlers stacking across panel visits — but this script
   * attaches no handler for the receipt, it runs the flow inline. All the
   * guard did was make the second and every later run exit early with
   * "already attached", so one panel instance could receive exactly once.
   * V6, which runs in production, has no guard here either.
   */
  public static Init(args: IScriptArgs): void {
    try {
      const instance = new POReceiptShortcutV7(args);
      instance.start();
    } catch (error) {
      // Never console.*: the log object has levels that can be turned off.
      args.log.Error(
        SCRIPT_NAME + ' failed to start: ' +
          ((error && (error as Error).message) || error)
      );
    }
  }

  private start(): void {
    const parsed = buildConfig(this.rawArgs);
    for (const key of parsed.unknownKeys) {
      this.log.Warning('Ignoring unknown script argument "' + key + '"');
    }

    // Fail fast, before any MI call, and name the argument that is missing.
    if (parsed.errors.length > 0) {
      this.log.Error(SCRIPT_NAME + ' configuration rejected');
      void showError(
        'This shortcut is not configured correctly.\n\n' +
          parsed.errors.join('\n\n')
      );
      return;
    }

    this.config = parsed.config;
    this.execute = createExecutor(readCompanyContext(this.log), this.log);

    void this.run();
  }

  /* ─── Flow ─────────────────────────────────────────────────────────── */

  private async run(): Promise<void> {
    const identity = this.readIdentity();
    if (!identity) return;

    const entered = this.readEnteredQuantity();
    if (!entered) return;

    try {
      const readStartedAt = Date.now();
      const context = await withBusyIndicator(this.controller, () =>
        this.loadLine(identity, entered)
      );
      this.log.Debug('Reading the line took ' + (Date.now() - readStartedAt) + 'ms');
      if (!context) return;

      // V6 warned here and V7 dropped the check entirely. Receiving more than
      // the line has outstanding is legal in M3 but almost never intended, so
      // it is worth one confirmation before anything is staged.
      const remaining = Number(context.remaining || '0');
      if (remaining > 0 && Number(entered) > remaining) {
        const proceed = await confirm(
          DIALOG_TITLES.confirmReceipt,
          'This line has ' + context.remaining + ' outstanding, but ' + entered +
            ' has been entered — an over-receipt of ' +
            (Number(entered) - remaining) + '. Receive anyway?'
        );
        if (!proceed) {
          this.log.Info('Receipt cancelled by the operator');
          return;
        }
      }

      // Deliberately outside the busy indicator: the panel must not look
      // frozen while it is waiting on the operator.
      const collected = await this.collect(identity, context);
      if (!collected) {
        this.log.Info('Receipt cancelled by the operator');
        return;
      }

      const confirmed = await confirm(
        DIALOG_TITLES.confirmReceipt,
        this.describeIntent(identity, collected, entered)
      );
      if (!confirmed) {
        this.log.Info('Receipt cancelled by the operator');
        return;
      }

      const postStartedAt = Date.now();
      await this.post(identity, context, collected);
      this.log.Debug('Posting took ' + (Date.now() - postStartedAt) + 'ms');
    } catch (error) {
      const message = (error && (error as Error).message) || String(error);
      this.log.Error(SCRIPT_NAME + ': ' + message);
      await showError(message);
    }
  }

  /**
   * Reads the quantity the operator typed into RVQA.
   *
   * V7 used the line's outstanding quantity (RSTQ) here, which meant every
   * receipt took the whole line no matter what was entered. RSTQ is what is
   * LEFT on the line; RVQA is what the operator is receiving now.
   */
  private readEnteredQuantity(): string | null {
    let raw = '';
    try {
      const value = this.controller.GetValue(ENTERED_QUANTITY_FIELD);
      raw = value === undefined || value === null ? '' : String(value).trim();
    } catch (error) {
      this.log.Warning(
        'Could not read ' + ENTERED_QUANTITY_FIELD + ': ' +
          ((error && (error as Error).message) || error)
      );
    }

    const quantity = Number(raw);
    if (!raw || !isFinite(quantity) || quantity <= 0) {
      const reason =
        'Enter the quantity to receive in the Received quantity field, then ' +
        'run this shortcut again.';
      this.log.Warning('RVQA is missing or not a positive number: "' + raw + '"');
      void showMessage(DIALOG_TITLES.warning, reason, 'Warning');
      return null;
    }
    return raw;
  }

  /**
   * Reads the line the operator means, refusing anything ambiguous.
   *
   * V4 and V6 both read the CURRENT row and never look at the selection, so
   * with three lines selected they receive one and report success.
   */
  private readIdentity(): LineIdentity | null {
    const field = (name: string): string =>
      (ScriptUtil.GetFieldValue(name, this.controller) || '').trim();

    const identity: LineIdentity = {
      PUNO: field(PANEL_FIELDS.PUNO),
      SUNO: field(PANEL_FIELDS.SUNO),
      WHLO: field(PANEL_FIELDS.WHLO),
      PNLI: field(PANEL_FIELDS.PNLI),
      PNLS: field(PANEL_FIELDS.PNLS),
      WHSL: field(PANEL_FIELDS.WHSL),
      ITNO: field(PANEL_FIELDS.ITNO),
      OEND: field(PANEL_FIELDS.OEND),
    };

    const selectedRows = readSelectedRows(this.controller.GetGrid());
    const verdict = evaluateSelection(
      selectedRows.length,
      !!(identity.PNLI && identity.ITNO)
    );
    if (verdict.outcome === 'blocked') {
      this.log.Warning(verdict.reason);
      void showMessage(DIALOG_TITLES.warning, verdict.reason, 'Warning');
      return null;
    }

    // WHSL is absent whenever M3 presets or assigns the location itself, and
    // OEND is legitimately "0", so neither belongs in this list.
    const missing = findMissingFields({
      'Purchase order': identity.PUNO,
      'Line number': identity.PNLI,
      Warehouse: identity.WHLO,
      Item: identity.ITNO,
    });
    if (missing.length > 0) {
      const reason =
        'This line is missing ' + missing.join(', ') +
        '. Open the order line in PPS300 and try again.';
      this.log.Warning(reason);
      void showMessage(DIALOG_TITLES.warning, reason, 'Warning');
      return null;
    }

    return identity;
  }

  /** Stage 1 and the conditional stage 2 reads. */
  private async loadLine(
    identity: LineIdentity,
    enteredQuantity: string
  ): Promise<LineContext | null> {
    const raw = await fetchLineData(
      this.execute, identity.PUNO, identity.PNLI, identity.PNLS, identity.ITNO
    );

    const indi = raw.basic.INDI || '0';
    const bacd = Number(raw.basic.BACD || '0');
    const grmt = raw.basic.GRMT || '';

    // CRBN is the one ManualLotNo() input GetBasicData2 does not carry.
    let crbn = 0;
    let dsto = Number(raw.basic.DSTO || '0');
    if (grmt) {
      const method = await this.execute(specReceivingMethod(grmt));
      const item = (method && method.item) || {};
      crbn = Number(item.CRBN || '0');
      if (item.DSTO) dsto = Number(item.DSTO);
    }

    // CUNO only exists when the PO is linked to a customer order.
    let customerNumber = '';
    if (raw.line.RORC === '3' && raw.line.RORN) {
      const order = await this.execute(specCustomerOrder(raw.line.RORN));
      customerNumber = ((order && order.item) || {}).CUNO || '';
    }

    if (this.config.wmsCheckEnabled) {
      const proceed = await this.checkWmsWarehouse(identity.WHLO);
      if (!proceed) return null;
    }

    return {
      poLine: buildLineContext(raw, identity, customerNumber),
      indi,
      bacd,
      dsto,
      crbn,
      quantity: enteredQuantity,
      remaining: raw.basic.RSTQ || '',
      defaultLocation: raw.basic.WHSL || '',
      purchaseUnit: raw.basic.PUUN || '',
      expiryRequired: (raw.item.EXPD || '') !== '' && raw.item.EXPD !== '0',
    };
  }

  /**
   * Warns before receiving into a WMS-managed warehouse outside WMS.
   *
   * Off unless configured: most M3 customers do not run WMS, and V6 ran this
   * check unconditionally against a warehouse group name compiled into it.
   */
  private async checkWmsWarehouse(whlo: string): Promise<boolean> {
    try {
      const response = await this.execute(
        specWarehouseGroup(this.config.warehouseGroup, whlo)
      );
      if (toItems(response).length === 0) return true;
    } catch {
      // A failed lookup is not a reason to block a receipt.
      this.log.Warning('WMS warehouse check could not be completed; continuing');
      return true;
    }

    return confirm(
      DIALOG_TITLES.warning,
      'Warehouse ' + whlo + ' is managed by WMS. Receiving it here bypasses ' +
        'WMS putaway. Continue anyway?',
      'Warning'
    );
  }

  /* ─── Collection ───────────────────────────────────────────────────── */

  private async collect(
    identity: LineIdentity,
    context: LineContext
  ): Promise<Collected | null> {
    const mode = classifyReceiptMode(context.indi);
    const quantity = Number(context.quantity || '0');

    if (mode === 'plain') {
      return { mode, lines: [{ RVQA: context.quantity }], serials: [] };
    }

    // Gated on autoLotNo, NOT manualLotNo.
    //
    // autoLotNo asks the only question that matters here: does M3 generate the
    // number itself? If it does, asking the operator would be asking them to
    // invent what M3 overwrites.
    //
    // manualLotNo adds `CRBN != 1 && DSTO != 1` on top of that. Those come
    // from PPS300's ManualLotNo(), whose own comment reads "Check if Manual
    // numbering Lot No and not mandantory in PPS300" — it decides whether
    // PPS300's PANEL offers an optional prompt, not whether the number is
    // needed. This script does not go through PPS300; it stages to MHS850MI.
    // Using that gate meant a serialised item with BACD 0 under a direct
    // put-away receiving method collected no serial and claimed M3 would
    // assign one, which BACD 0 means it will not. V6, which runs in
    // production, branches on INDI alone and has no CRBN/DSTO check anywhere.
    if (autoLotNo(context.indi, context.bacd)) {
      this.log.Info(
        'M3 generates the number for this item (BACD ' + context.bacd +
          '); none collected'
      );
      return { mode, lines: [{ RVQA: context.quantity }], serials: [] };
    }

    return mode === 'serial'
      ? this.collectSerials(identity, context, quantity)
      : this.collectLot(identity, context);
  }

  private async collectSerials(
    identity: LineIdentity,
    context: LineContext,
    quantity: number
  ): Promise<Collected | null> {
    const count = Math.min(
      Math.max(Math.round(quantity) || 1, 1),
      this.config.maxSerials
    );
    if (quantity > this.config.maxSerials) {
      await showMessage(
        DIALOG_TITLES.warning,
        'This line is for ' + quantity + ' units, and this shortcut collects ' +
          'at most ' + this.config.maxSerials + ' serials at a time. Receive ' +
          'the rest in PPS300, or raise maxserials in the script arguments.',
        'Warning'
      );
      return null;
    }

    const maxLength = canStoreOversizeSerial(this.config)
      ? CFMA_MAX_LENGTH
      : EEQN_MAX_LENGTH;

    const values = await promptSerials({
      count,
      maxLength,
      itemNumber: identity.ITNO,
      today: todayAsM3Date(),
    });
    if (!values) return null;

    const now = new Date();
    const entries = prepareSerialEntries(values, generateEpochSeed(now.getTime()), now);

    for (const entry of entries) {
      if (entry.originalSerial.length <= SERN_MAX_LENGTH) {
        // A serial that fits SERN is used as-is, so it must be free.
        if (await lotOrSerialExists(this.execute, identity.ITNO, entry.derivedSerial)) {
          throw new Error(
            'Serial ' + entry.originalSerial + ' already exists for item ' +
              identity.ITNO + '.'
          );
        }
      }
    }

    return {
      mode: 'serial',
      serials: entries.map((e) => e.derivedSerial),
      entries,
      lines: entries.map((entry) => ({ RVQA: '1', BANO: entry.derivedSerial })),
    };
  }

  private async collectLot(
    identity: LineIdentity,
    context: LineContext
  ): Promise<Collected | null> {
    const result = await promptLot({
      itemNumber: identity.ITNO,
      expiryRequired: context.expiryRequired,
      today: todayAsM3Date(),
    });
    if (!result) return null;

    // INDI 1 creates lots on the fly; 2, 3 and 5 require them to pre-exist.
    if (lotMustPreExist(context.indi)) {
      const exists = await lotOrSerialExists(this.execute, identity.ITNO, result.lot);
      if (!exists) {
        throw new Error(
          'Lot ' + result.lot + ' does not exist for item ' + identity.ITNO +
            '. Create it in MMS235 first, or receive the line in PPS300.'
        );
      }
    }

    return {
      mode: 'lot',
      serials: [],
      lot: result.lot,
      expiry: result.expiry,
      lines: [{ RVQA: context.quantity, BANO: result.lot, EXPI: result.expiry }],
    };
  }

  /* ─── Posting ──────────────────────────────────────────────────────── */

  private async post(
    identity: LineIdentity,
    context: LineContext,
    collected: Collected
  ): Promise<void> {
    // Under direct put-away M3 places the goods itself; a blank location is
    // correct, not an error. V6 threw whenever WHSL was empty.
    const location = isDirectPutAway(context.dsto)
      ? ''
      : identity.WHSL || context.defaultLocation;

    const plan: ReceiptPlan = {
      lines: collected.lines,
      entries: collected.entries || [],
      equipmentPlan: planEquipmentCreation(context.indi, context.bacd),
      poLine: context.poLine,
      line: {
        WHLO: identity.WHLO,
        ITNO: identity.ITNO,
        PUUN: context.purchaseUnit,
        PUNO: identity.PUNO,
        PNLI: identity.PNLI,
        PNLS: identity.PNLS,
        WHSL: location,
        OEND: identity.OEND,
        PROD: context.poLine.PROD,
      },
    };

    const result = await withBusyIndicator(this.controller, () =>
      runReceipt(
        {
          execute: this.execute,
          log: this.log,
          config: this.config,
          retry: { maxAttempts: 3, delay, random: Math.random },
          delay,
          reference: SCRIPT_NAME,
        },
        plan
      )
    );

    if (result.outcome.kind === 'posted') {
      await showMessage(
        DIALOG_TITLES.success,
        buildReceiptSummary({
          mode: collected.mode,
          serials: collected.serials,
          lot: collected.lot,
          expiry: collected.expiry,
          quantity: Number(context.quantity || '0'),
          location,
        })
      );
      this.refresh();
      return;
    }

    await showError(result.outcome.message);
  }

  /** Refreshes the panel so the operator sees the new quantity. */
  private refresh(): void {
    try {
      this.controller.PressKey('F5');
    } catch (error) {
      this.log.Warning(
        'Could not refresh the panel: ' + ((error && (error as Error).message) || error)
      );
    }
  }

  private describeIntent(
    identity: LineIdentity,
    collected: Collected,
    quantity: string
  ): string {
    // Each fragment is a sentence because H5's ConfirmDialog collapses the
    // newlines, so the operator sees one run-on line. Punctuated this way it
    // reads correctly whether or not the breaks survive.
    const lines = [
      'Purchase order ' + identity.PUNO + ', line ' + identity.PNLI + '.',
      'Item ' + identity.ITNO + '.',
      // The quantity is the whole point of the confirmation, and it was the
      // one thing this dialog did not show.
      'Quantity ' + quantity + '.',
    ];
    if (collected.mode === 'serial') {
      lines.push(
        collected.serials.length > 0
          ? 'Serials: ' + collected.serials.join(', ') + '.'
          : ASSIGNED_BY_M3.serial + '.'
      );
    } else if (collected.mode === 'lot') {
      lines.push(
        collected.lot ? 'Lot ' + collected.lot + '.' : ASSIGNED_BY_M3.lot + '.'
      );
      if (collected.expiry) lines.push('Expiry ' + collected.expiry + '.');
    }
    return lines.join('\n');
  }
};

/* ─── Local helpers ──────────────────────────────────────────────────── */

interface LineContext {
  poLine: ReturnType<typeof buildLineContext>;
  indi: string;
  bacd: number;
  dsto: number;
  crbn: number;
  /** What the operator entered in RVQA. */
  quantity: string;
  /** RSTQ — what is still outstanding on the line. Used only to warn. */
  remaining: string;
  defaultLocation: string;
  purchaseUnit: string;
  expiryRequired: boolean;
}

interface Collected {
  mode: 'serial' | 'lot' | 'plain';
  lines: WhsLineInput[];
  serials: string[];
  entries?: ReturnType<typeof prepareSerialEntries>;
  lot?: string;
  expiry?: string;
}

/** M3 dates are yyyyMMdd. Never an ISO string. */
function todayAsM3Date(): string {
  const now = new Date();
  const pad = (n: number): string => (n < 10 ? '0' + n : String(n));
  return String(now.getFullYear()) + pad(now.getMonth() + 1) + pad(now.getDate());
}

export default POReceiptShortcutV7;
