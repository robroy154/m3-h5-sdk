/**
 * The MI calls, behind an injected executor.
 *
 * The executor seam is what makes this testable: the H5 adapter wraps
 * MIService, while tests pass a fake that records requests and returns canned
 * responses. No H5 global appears in this file.
 */

import { MiErrorLike, extractErrorMessage } from './errors';
import { PoLineContext } from './mi-requests';

export interface MiRequestSpec {
  program: string;
  transaction: string;
  record: Record<string, string>;
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
  'FACI', 'RGDT', 'PROD', 'ECVE', 'PITD', 'POTC',
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
    ECVE: raw.line.ECVE || '',
  };
}
