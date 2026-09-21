/**
 * The MI calls, behind an injected executor.
 *
 * The executor seam is what makes this testable: the H5 adapter wraps
 * MIService, while tests pass a fake that records requests and returns canned
 * responses. No H5 global appears in this file.
 */

import {
  MiErrorLike,
  STATUS_PROCESSED_OK,
  extractErrorMessage,
  isTransientProcessLock,
} from './errors';
import {
  LINE_DIAGNOSTIC_FIELDS,
  PROCESS_FLAG_EXECUTE,
  PoLineContext,
  describeLineFailure,
} from './mi-requests';

/**
 * Which company keys a transaction accepts in its record.
 *
 * V6 encoded this by choosing between two helpers at each call site, which was
 * correct but invisible — the rule only existed in which helper got picked.
 * Declaring it per spec makes it reviewable against the MI catalog, which is
 * the only place the answer actually lives:
 *
 *   AddWhsHead / AddWhsPack / AddWhsLine   CONO and DIVI
 *   PrcWhsTran / GetWhsHead                CONO only, no DIVI input exists
 *   LstWhsLine                             neither; its inputs are MSGN,
 *                                          PACN, MSLN, UTCM. V6 sent CONO here.
 *   MMS240MI/Add, /Del                     CONO only
 *   CMS474MI/*EqInfo                       neither
 */
export type CompanyScope = 'none' | 'company' | 'company-division';

export interface MiRequestSpec {
  program: string;
  transaction: string;
  record: Record<string, string>;
  /** Defaults to 'none'; the H5 adapter injects from the user context. */
  scope?: CompanyScope;
  /** Always set. Limits what M3 serialises back; the repo standard. */
  outputFields?: string[];
  maxReturnedRecords?: number;
}

export interface MiResponse extends MiErrorLike {
  item?: Record<string, string>;
  items?: Record<string, string>[];
}

export type MiExecutor = (spec: MiRequestSpec) => Promise<MiResponse>;

/** Normalises the two shapes MI uses for list results. */
export function toItems(response: MiResponse | null | undefined): Record<string, string>[] {
  if (!response) return [];
  if (Array.isArray(response.items)) return response.items;
  return response.item ? [response.item] : [];
}

function requireItem(
  response: MiResponse,
  operation: string
): Record<string, string> {
  if (!response || !response.item) {
    throw new Error(extractErrorMessage(response, operation));
  }
  return response.item;
}

/* ─── Stage 1: four parallel reads ───────────────────────────────────────── */

/**
 * PPS001MI/GetBasicData2.
 *
 * V6 called this and requested RSTQ alone. Source (PPS001MI_MVX.java) shows 25
 * YD* outputs, including every field the numbering and location decisions
 * need. This is the same call, finally asked for what it already returns.
 */
export const BASIC_DATA_FIELDS = [
  'RSTQ', 'INDI', 'BACD', 'DSTO', 'FLCD', 'GRMT',
  'WHSL', 'ITDS', 'SITE', 'PUUN', 'ORCO', 'OWHL',
];

export function specBasicData(puno: string, pnli: string, pnls: string): MiRequestSpec {
  return {
    program: 'PPS001MI',
    transaction: 'GetBasicData2',
    record: { PUNO: puno, PNLI: pnli, PNLS: pnls },
    outputFields: BASIC_DATA_FIELDS,
    maxReturnedRecords: 1,
  };
}

/** PPS200MI/GetLine. RORL is requested again; V6 declared it and dropped it. */
export const PO_LINE_FIELDS = [
  'PUPR', 'CPPR', 'RORC', 'RORN', 'RORL', 'GETY',
  'FACI', 'RGDT', 'PROD', 'PITD', 'POTC',
];

export function specPoLine(puno: string, pnli: string, pnls: string): MiRequestSpec {
  return {
    program: 'PPS200MI',
    transaction: 'GetLine',
    record: { PUNO: puno, PNLI: pnli, PNLS: pnls },
    outputFields: PO_LINE_FIELDS,
    maxReturnedRecords: 1,
  };
}

/**
 * PPS200MI/GetHead — restored.
 *
 * V6 deleted this call, which is why CUCD had to be hardcoded to 'USD': CUCD
 * is not on GetLine, only on GetHead. GetHead needs nothing but PUNO, already
 * on screen, so it runs in the same parallel batch and costs no extra latency.
 * V6's "optimisation" did not even save a round trip.
 */
export const PO_HEAD_FIELDS = ['CUCD', 'PUDT', 'SUNO', 'ORTY'];

export function specPoHead(puno: string): MiRequestSpec {
  return {
    program: 'PPS200MI',
    transaction: 'GetHead',
    record: { PUNO: puno },
    outputFields: PO_HEAD_FIELDS,
    maxReturnedRecords: 1,
  };
}

/** MMS200MI/Get, slimmed: INDI and BACD now come from GetBasicData2. */
export const ITEM_FIELDS = ['TPCD', 'EXPD'];

export function specItem(itno: string): MiRequestSpec {
  return {
    program: 'MMS200MI',
    transaction: 'Get',
    record: { ITNO: itno },
    outputFields: ITEM_FIELDS,
    maxReturnedRecords: 1,
  };
}

/* ─── Stage 2: conditional reads ─────────────────────────────────────────── */

/**
 * PPS345MI/Get — the goods receiving method record.
 *
 * Supplies CRBN, the one input to M3's ManualLotNo() that GetBasicData2 does
 * not carry. Keyed on GRMT, which stage 1 returns, so it necessarily follows.
 */
export function specReceivingMethod(grmt: string): MiRequestSpec {
  return {
    program: 'PPS345MI',
    transaction: 'Get',
    record: { GRMT: grmt },
    outputFields: ['DSTO', 'FLCD', 'CRBN'],
    maxReturnedRecords: 1,
  };
}

/** OIS100MI/GetOrderHead, only when the PO is linked to a customer order. */
export function specCustomerOrder(orno: string): MiRequestSpec {
  return {
    program: 'OIS100MI',
    transaction: 'GetOrderHead',
    record: { ORNO: orno },
    outputFields: ['CUNO'],
    maxReturnedRecords: 1,
  };
}

/** MMS009MI/Get, only when the WMS check is configured on. */
export function specWarehouseGroup(whgr: string, whlo: string): MiRequestSpec {
  return {
    program: 'MMS009MI',
    transaction: 'Get',
    record: { WHGR: whgr, WHLO: whlo },
    outputFields: ['WHLO'],
    maxReturnedRecords: 1,
  };
}

/* ─── Existence checks ───────────────────────────────────────────────────── */

/**
 * Whether a lot or serial already exists.
 *
 * MMS235MI is the lot master and the serial master both: under INDI 2 a lot
 * number IS a serial number, so the same transaction answers for either.
 *
 * LstItmLot is used rather than GetItmLot because a list returns empty for a
 * missing record instead of erroring, which sidesteps the has-it-failed-or-is
 * -it-absent question that V6 answered by treating HTTP 400 as "absent".
 */
export function specLotExists(itno: string, bano: string): MiRequestSpec {
  return {
    program: 'MMS235MI',
    transaction: 'LstItmLot',
    record: { ITNO: itno, BANO: bano },
    outputFields: ['ITNO', 'BANO'],
    maxReturnedRecords: 1,
  };
}

export async function lotOrSerialExists(
  execute: MiExecutor,
  itno: string,
  bano: string
): Promise<boolean> {
  const response = await execute(specLotExists(itno, bano));
  return toItems(response).some((r) => r.ITNO === itno && r.BANO === bano);
}

/* ─── Assembling the line context ────────────────────────────────────────── */

export interface RawLineData {
  basic: Record<string, string>;
  line: Record<string, string>;
  head: Record<string, string>;
  item: Record<string, string>;
}

/** Issues the four stage-1 reads together and fails with a named operation. */
export async function fetchLineData(
  execute: MiExecutor,
  puno: string,
  pnli: string,
  pnls: string,
  itno: string
): Promise<RawLineData> {
  const [basic, line, head, item] = await Promise.all([
    execute(specBasicData(puno, pnli, pnls)),
    execute(specPoLine(puno, pnli, pnls)),
    execute(specPoHead(puno)),
    execute(specItem(itno)),
  ]);

  return {
    basic: requireItem(basic, 'Purchase order line lookup'),
    line: requireItem(line, 'Purchase order line detail'),
    head: requireItem(head, 'Purchase order header lookup'),
    item: requireItem(item, 'Item lookup'),
  };
}

/**
 * Chooses the purchase price.
 *
 * Confirmed price wins when populated, otherwise the ordered price. This is
 * V6's rule and it is correct — kept, and now pinned by test.
 */
export function resolvePrice(line: Record<string, string>): string {
  const confirmed = (line.CPPR || '').trim();
  return confirmed !== '' ? confirmed : line.PUPR || '';
}

/**
 * Purchase date: the line's registration date, then the head's order date.
 *
 * V6 used RGDT with no fallback; V4 used today(). Neither is wrong, but a PO
 * that predates the receipt should carry its own date, not the day it happened
 * to be received.
 */
export function resolvePurchaseDate(
  line: Record<string, string>,
  head: Record<string, string>
): string {
  return line.RGDT || head.PUDT || '';
}

/** Builds the equipment-record context from the four reads. */
export function buildLineContext(
  raw: RawLineData,
  identity: { PUNO: string; PNLI: string; PNLS: string; ITNO: string },
  customerNumber: string
): PoLineContext {
  return {
    ITNO: identity.ITNO,
    PUNO: identity.PUNO,
    PNLI: identity.PNLI,
    PNLS: identity.PNLS,
    price: resolvePrice(raw.line),
    currency: raw.head.CUCD || '',
    FACI: raw.line.FACI || '',
    purchaseDate: resolvePurchaseDate(raw.line, raw.head),
    SUNO: raw.head.SUNO || '',
    CUNO: customerNumber,
    poItemName: raw.line.PITD || '',
    itemDescription: raw.basic.ITDS || '',
    PROD: raw.line.PROD || '',
  };
}

/* ═══ Write path ═════════════════════════════════════════════════════════ */

/**
 * Nothing below decides *whether* to do its work — that is receipt-engine's
 * job. These are the calls themselves, each one a spec the catalog can be
 * checked against plus the smallest wrapper that turns a failure into a
 * readable error.
 */

/* ─── Equipment (MMS240MI) ───────────────────────────────────────────────── */

/** What a created equipment record needs for its own rollback. */
export interface CreatedEquipment {
  ITNO: string;
  /** The serial as it exists in M3 — which for a generated one is M3's. */
  SERN: string;
  /** What the operator typed, if anything. Kept for logging and CMS474. */
  originalSerial: string;
  /** True when a CMS474 custom-field row was written alongside. */
  customFieldWritten: boolean;
}

export function specEquipmentAdd(record: Record<string, string>): MiRequestSpec {
  return {
    program: 'MMS240MI',
    transaction: 'Add',
    record,
    scope: 'company',
    // Add returns ITNO, SERN and BIRT only. EQNO is an *input*, never an
    // output — V6 read result.item.EQNO after every Add and always got null,
    // so its rollback log read "EQNO N/A" every time. AddEquipment is the
    // transaction that returns one.
    outputFields: ['ITNO', 'SERN'],
    maxReturnedRecords: 1,
  };
}

export function specEquipmentDelete(itno: string, sern: string): MiRequestSpec {
  return {
    program: 'MMS240MI',
    transaction: 'Del',
    record: { ITNO: itno, SERN: sern },
    scope: 'company',
    maxReturnedRecords: 1,
  };
}

/**
 * Creates one equipment record.
 *
 * `omitSerial` exists because MMS240MI/Add rejects a supplied SERN for the
 * automatic numbering methods (MM24031) — see planEquipmentCreation. Stripping
 * it here as well as at the caller means a mis-wired call fails a test rather
 * than an operator's receipt.
 *
 * The SERN that comes back is what gets tracked, not what was sent: for a
 * generated serial the two differ, and the rollback keys on ITNO + SERN.
 */
export async function createEquipment(
  execute: MiExecutor,
  record: Record<string, string>,
  originalSerial: string,
  omitSerial: boolean
): Promise<CreatedEquipment> {
  const payload = { ...record };
  if (omitSerial) {
    delete payload.SERN;
  }

  const response = await execute(specEquipmentAdd(payload));
  const item = response && response.item;
  if (!item) {
    throw new Error(
      extractErrorMessage(
        response,
        'Equipment creation for serial ' + (payload.SERN || originalSerial || '(generated)')
      )
    );
  }

  const sern = item.SERN || payload.SERN || '';
  if (!sern) {
    throw new Error(
      'Equipment was created but M3 returned no serial number, so it cannot ' +
        'be rolled back if the receipt fails. Check MMS240 for item ' +
        (payload.ITNO || '') + ' before retrying.'
    );
  }

  return {
    ITNO: payload.ITNO || '',
    SERN: sern,
    originalSerial,
    customFieldWritten: false,
  };
}

/* ─── Oversize serial storage (CMS474MI) ─────────────────────────────────── */

/**
 * The delete transaction is DltEqInfo, not DelEqInfo.
 *
 * V4 (live) and V6 both send 'DelEqInfo', which CMS474MI does not have — its
 * transactions are AddEqInfo, DltEqInfo, GetEqInfo, LstEqInfo, UpdEqInfo. So
 * the CMS474 half of the rollback has never run: it fails with an unknown
 * transaction, the failure is caught and logged as best-effort cleanup, and
 * the custom-field row is left orphaned against a serial that no longer exists.
 */
export function specCustomFieldAdd(record: Record<string, string>): MiRequestSpec {
  return {
    program: 'CMS474MI',
    transaction: 'AddEqInfo',
    record,
    scope: 'none',
    maxReturnedRecords: 1,
  };
}

export function specCustomFieldDelete(
  itno: string,
  sern: string,
  group: string,
  field: string,
  sequence: string
): MiRequestSpec {
  return {
    program: 'CMS474MI',
    transaction: 'DltEqInfo',
    record: { ITNO: itno, SERN: sern, CFMG: group, CFMF: field, SQNR: sequence },
    scope: 'none',
    maxReturnedRecords: 1,
  };
}

/* ─── Warehouse transaction (MHS850MI) ───────────────────────────────────── */

export function specWarehouseHeader(record: Record<string, string>): MiRequestSpec {
  return {
    program: 'MHS850MI',
    transaction: 'AddWhsHead',
    record,
    scope: 'company-division',
    outputFields: ['MSGN'],
    maxReturnedRecords: 1,
  };
}

export function specWarehousePack(record: Record<string, string>): MiRequestSpec {
  return {
    program: 'MHS850MI',
    transaction: 'AddWhsPack',
    record,
    scope: 'company-division',
    outputFields: ['MSGN', 'PACN'],
    maxReturnedRecords: 1,
  };
}

export function specWarehouseLine(record: Record<string, string>): MiRequestSpec {
  return {
    program: 'MHS850MI',
    transaction: 'AddWhsLine',
    record,
    scope: 'company-division',
    // MSLN is the created line number. V6 discarded it and asked for 100
    // records back from an Add that returns one.
    outputFields: ['MSGN', 'PACN', 'MSLN'],
    maxReturnedRecords: 1,
  };
}

export function specProcessTransaction(msgn: string): MiRequestSpec {
  return {
    program: 'MHS850MI',
    transaction: 'PrcWhsTran',
    record: { MSGN: msgn, PRFL: PROCESS_FLAG_EXECUTE },
    scope: 'company',
    maxReturnedRecords: 1,
  };
}

export function specTransactionStatus(msgn: string): MiRequestSpec {
  return {
    program: 'MHS850MI',
    transaction: 'GetWhsHead',
    record: { MSGN: msgn },
    scope: 'company',
    outputFields: ['STAT', 'TRSL', 'TRSH'],
    maxReturnedRecords: 1,
  };
}

export function specWarehouseLines(msgn: string, pacn: string): MiRequestSpec {
  return {
    program: 'MHS850MI',
    transaction: 'LstWhsLine',
    record: { MSGN: msgn, PACN: pacn },
    scope: 'none',
    outputFields: LINE_DIAGNOSTIC_FIELDS,
    maxReturnedRecords: 25,
  };
}

/** Creates the message header and returns its number. */
export async function postWarehouseHeader(
  execute: MiExecutor,
  record: Record<string, string>
): Promise<string> {
  const response = await execute(specWarehouseHeader(record));
  const msgn = response && response.item ? response.item.MSGN : '';
  if (!msgn) {
    throw new Error(
      extractErrorMessage(response, 'Warehouse transaction header creation')
    );
  }
  return msgn;
}

/**
 * Creates the package and returns the number M3 settled on.
 *
 * M3 may return a package number other than the one requested, so the returned
 * value is authoritative for every line that follows and for the failure
 * lookup afterwards.
 */
export async function postWarehousePack(
  execute: MiExecutor,
  record: Record<string, string>
): Promise<string> {
  const response = await execute(specWarehousePack(record));
  if (hasFailed(response) || !response.item || !response.item.PACN) {
    throw new Error(extractErrorMessage(response, 'Warehouse package creation'));
  }
  return response.item.PACN;
}

/** Adds one line and returns its message line number, when M3 gives one. */
export async function postWarehouseLine(
  execute: MiExecutor,
  record: Record<string, string>,
  lineLabel: string
): Promise<string> {
  const response = await execute(specWarehouseLine(record));
  if (hasFailed(response)) {
    throw new Error(
      extractErrorMessage(response, 'Warehouse transaction line ' + lineLabel)
    );
  }
  return (response.item && response.item.MSLN) || '';
}

/**
 * An MI response that carries an error code or message but still resolved.
 *
 * The H5 adapter rejects on transport failures, but MI also returns business
 * errors on a resolved promise. IMIResponse.hasError() covers this where it
 * exists; the fields are checked directly so the gateway stays free of the H5
 * response class and remains testable with a plain object.
 */
function hasFailed(response: MiResponse | null | undefined): boolean {
  return !!(response && (response.errorCode || response.errorMessage));
}

/* ─── Processing, with the one retry the write path allows ───────────────── */

export interface RetryOptions {
  maxAttempts: number;
  /** Injected so tests do not actually wait. */
  delay: (ms: number) => Promise<void>;
  /** Injected so the jitter is deterministic under test. */
  random: () => number;
  onRetry?: (attempt: number, waitMs: number, error: unknown) => void;
}

export const RETRY_BASE_MS = 300;
export const RETRY_JITTER_MS = 100;

export function computeBackoff(attempt: number, random: () => number): number {
  return (
    RETRY_BASE_MS * Math.pow(2, attempt - 1) +
    Math.floor(random() * RETRY_JITTER_MS)
  );
}

/**
 * Processes the warehouse message, retrying only a transient lock.
 *
 * Retrying a write is only safe because PrcWhsTran that failed to acquire its
 * lock has not processed anything — the message is still sitting in MHS850
 * unprocessed. A retry on any other failure would risk a double receipt, which
 * is why isTransientProcessLock is deliberately narrow.
 */
export async function processWarehouseTransaction(
  execute: MiExecutor,
  msgn: string,
  options: RetryOptions
): Promise<void> {
  const spec = specProcessTransaction(msgn);
  let attempt = 1;

  for (;;) {
    try {
      const response = await execute(spec);
      // PrcWhsTran declares no output fields at all, so an error code or
      // message is the only signal it gives.
      if (hasFailed(response)) {
        throw new Error(extractErrorMessage(response, 'Transaction processing'));
      }
      return;
    } catch (error) {
      const transient = isTransientProcessLock(error as MiErrorLike);
      if (!transient || attempt >= options.maxAttempts) {
        throw error;
      }
      const waitMs = computeBackoff(attempt, options.random);
      if (options.onRetry) options.onRetry(attempt, waitMs, error);
      await options.delay(waitMs);
      attempt++;
    }
  }
}

/** Reads the message status. '90' is the only value that means goods moved. */
export async function getTransactionStatus(
  execute: MiExecutor,
  msgn: string
): Promise<string> {
  const response = await execute(specTransactionStatus(msgn));
  if (!response || !response.item || !response.item.STAT) {
    throw new Error(
      'The receipt was submitted but its status could not be read. Check ' +
        'MHS850 for message ' + msgn + ' before retrying — it may have posted.'
    );
  }
  return response.item.STAT;
}

/**
 * M3's own explanation of which line failed.
 *
 * Best-effort: this runs while already reporting a failure, so a second
 * failure here must not replace the first. Returns '' and lets the caller
 * report the status on its own.
 */
export async function getWhsLineFailureDetail(
  execute: MiExecutor,
  msgn: string,
  pacn: string
): Promise<string> {
  let lines: Record<string, string>[];
  try {
    lines = toItems(await execute(specWarehouseLines(msgn, pacn)));
  } catch {
    return '';
  }

  const failing =
    lines.filter((l) => l.STAT && l.STAT !== STATUS_PROCESSED_OK)[0] || lines[0];
  return failing ? describeLineFailure(failing) : '';
}
