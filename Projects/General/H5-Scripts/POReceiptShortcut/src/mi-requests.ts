/**
 * Construction of the MI record payloads.
 *
 * Kept pure and separate from the calls that send them so the corrections
 * below are reviewable as data — every one of them is a change to what lands
 * in M3, and none can be verified without a tenant.
 */

import { describeMiMessage, messageMatchesCatalogue } from './mi-messages';
import {
  CFMA_MAX_LENGTH,
  EEQN_MAX_LENGTH,
  SERN_MAX_LENGTH,
  SerialEntry,
} from './serial-policy';

/** MMS240MI/Add input lengths, from the MI catalog. */
export const ALII_MAX_LENGTH = 40;
export const SKEY_MAX_LENGTH = 20;

/** Equipment status 20 = in stock. Owner type 0 = company. M3 constants. */
const STATUS_IN_STOCK = '20';
const OWNER_TYPE_COMPANY = '0';

export interface PoLineContext {
  ITNO: string;
  PUNO: string;
  PNLI: string;
  PNLS: string;
  /** Confirmed price when populated, else the ordered price. */
  price: string;
  /** Order currency. Resolved from the PO head — never a literal. */
  currency: string;
  /** Facility. Mandatory on MMS240MI/Add. */
  FACI: string;
  /** PO registration date, used as the purchase date. */
  purchaseDate: string;
  /** Supplier. */
  SUNO: string;
  /** Customer, when the PO is linked to a customer order. */
  CUNO: string;
  /** Purchase order item name (PITD), preferred over the item description. */
  poItemName: string;
  /** Item master description (ITDS), the fallback. */
  itemDescription: string;
  /**
   * Manufacturer. Written to the warehouse LINE, not to the equipment record:
   * MMS240MI/Add does not accept PROD, MHS850MI/AddWhsLine does.
   */
  PROD: string;
}

function truncate(value: string, max: number): string {
  const v = value || '';
  return v.length > max ? v.slice(0, max) : v;
}

/** Drops keys with no value so MI is not sent empty strings it did not ask for. */
function compact(record: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(record)) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      out[key] = record[key];
    }
  }
  return out;
}

/**
 * Where a serial too long for SERN is stored.
 *
 * EEQN ("Equipment number reference", 40) is a standard MMS240 field needing
 * no setup, so it covers 21-40. Only past 40 does CMS474 become necessary,
 * which is why that custom field is optional configuration.
 */
export type OversizeTarget = 'none' | 'eeqn' | 'cms474';

export function chooseOversizeTarget(originalSerial: string): OversizeTarget {
  const length = (originalSerial || '').length;
  if (length <= SERN_MAX_LENGTH) return 'none';
  if (length <= EEQN_MAX_LENGTH) return 'eeqn';
  return 'cms474';
}

/**
 * MMS240MI/Add record.
 *
 * Corrections against V6, each verified against the MI catalog:
 *
 * - CUCD came from a hardcoded 'USD'. It is now the PO's own currency, which
 *   requires the PPS200MI/GetHead call V6 deleted. CUCD is not on GetLine.
 * - ALII was `this.ITDS` unbounded. ITDS is 60 and ALII is 40, so every long
 *   description silently overflowed. Now prefers PITD ("purchase order item
 *   name", 30) which fits, and truncates only as a fallback.
 * - SUNO was never written, though the script reads it off the screen to
 *   validate. M3's own createMILOIN sets it. Without it nothing on the serial
 *   records which vendor supplied it.
 * - SKEY ("search key equipment", 20) now carries the operator's serial, so a
 *   derived BSN value remains findable by what the vendor actually printed.
 * - PROD is captured, but on the warehouse line rather than here: the catalog
 *   shows MMS240MI/Add takes no PROD input, and no ECVE input either. An
 *   earlier draft of this file set both on the equipment record, where M3
 *   would have ignored them. ECVE has no home in either write transaction and
 *   is no longer fetched.
 *
 * PUNO and PNLI are kept even though PPS300's chkIndiv() overwrites them
 * during the receipt. chkIndiv only runs for INDI 2, so leaving them out would
 * lose the linkage on any path where it does not fire.
 */
export function buildEquipmentRecord(
  entry: SerialEntry,
  ctx: PoLineContext
): Record<string, string> {
  const target = chooseOversizeTarget(entry.originalSerial);

  return compact({
    ITNO: ctx.ITNO,
    SERN: entry.derivedSerial,
    STAT: STATUS_IN_STOCK,
    SUNO: ctx.SUNO,
    CUNO: ctx.CUNO,
    CUOW: ctx.CUNO,
    OWTP: OWNER_TYPE_COMPANY,
    PUPR: ctx.price,
    CUCD: ctx.currency,
    PPDT: ctx.purchaseDate,
    FACI: ctx.FACI,
    PUNO: ctx.PUNO,
    PNLI: ctx.PNLI,
    PNLS: ctx.PNLS,
    ALII: truncate(ctx.poItemName || ctx.itemDescription, ALII_MAX_LENGTH),
    SKEY: truncate(entry.originalSerial, SKEY_MAX_LENGTH),
    // Only when the original does not fit SERN but does fit EEQN.
    EEQN: target === 'eeqn' ? entry.originalSerial : '',
  });
}

/**
 * CMS474MI/AddEqInfo record, for a serial past EEQN's 40 characters.
 *
 * CONO and DIVI are deliberately absent: AddEqInfo does not accept them (its
 * inputs are ITNO, SERN, CFMG, CFMF, SQNR, CFMA, CFMN, CFMD), and the H5
 * MIService injects company scope itself.
 */
export function buildCustomFieldRecord(
  entry: SerialEntry,
  itno: string,
  group: string,
  field: string,
  sequence: string
): Record<string, string> {
  return {
    ITNO: itno,
    SERN: entry.derivedSerial,
    CFMG: group,
    CFMF: field,
    SQNR: sequence,
    CFMA: truncate(entry.originalSerial, CFMA_MAX_LENGTH),
  };
}

/**
 * Output fields for MHS850MI/LstWhsLine when diagnosing a failed receipt.
 *
 * V6 asked for REMK, which LstWhsLine does not return — confirmed twice, once
 * against the MI catalog and once in MHS850MI_MVX.java, where
 * `MICommon.setError("", X0MSID, X0MSGD)` appears 40 times. MSGD (78 chars) is
 * the message text and MSID its identifier. V6 fell through to BREM, a 20-char
 * field the script itself wrote, so a failed receipt echoed the script's own
 * "Orig Loc:" note back instead of M3's error.
 */
export const LINE_DIAGNOSTIC_FIELDS = [
  'MSLN', 'STAT', 'ITNO', 'BANO', 'MSID', 'MSGD', 'BREM', 'PACN',
];

/**
 * Picks the most useful failure text available on a returned line.
 *
 * `MSGD` is 78 characters and is often blank — M3 fills it when the line
 * engine records an error, not when the line simply has not run. `MSID` is
 * always there when something failed, so when the text is missing or cut off
 * the catalogue supplies the sentence that goes with the id. Without that, a
 * failed receipt reports `WPU0201` and stops.
 */
export function describeLineFailure(line: Record<string, string>): string {
  if (!line) return '';
  const parts: string[] = [];
  const message = line.MSGD || line.BREM || '';
  const meaning = describeMiMessage(line.MSID);

  if (message) {
    parts.push(message);
  } else if (meaning) {
    parts.push(meaning);
  }

  if (line.MSID) {
    // The id keeps its explanation attached unless MSGD already said the same
    // thing. Compared through the catalogue rather than by equality: MSGD is
    // M3's filled-in text, so it is never byte-equal to the &1 template and a
    // strict compare printed both wordings.
    const explain = meaning && !messageMatchesCatalogue(line.MSID, message);
    parts.push(
      explain
        ? 'Message id: ' + line.MSID + ' (' + meaning + ')'
        : 'Message id: ' + line.MSID
    );
  }
  if (line.MSLN) parts.push('Line no: ' + line.MSLN);
  if (line.ITNO) parts.push('Item: ' + line.ITNO);
  if (line.BANO) parts.push('Lot/Serial: ' + line.BANO);
  return parts.join('\n');
}

/* ─── MHS850MI record builders ───────────────────────────────────────────── */

/**
 * M3 protocol constants for this transaction shape. Named, not configurable:
 * these identify what kind of warehouse message is being written, and a
 * different value would describe a different operation.
 */
const QUALIFIER_RECEIPT = '20';
const DIRECTION_INBOUND = '20';
/** PrcWhsTran processing flag: execute rather than validate. */
export const PROCESS_FLAG_EXECUTE = '*EXE';

/** MHS850MI/AddWhsHead input lengths that need guarding. */
export const YREF_MAX_LENGTH = 30;
/** MHS850MI/AddWhsLine REMK. V6 used BREM, which is 20 — see below. */
export const REMK_MAX_LENGTH = 30;

export interface WhsHeaderConfig {
  partnerA: string;
  partnerB: string;
  partnerQualifierA: string;
  partnerQualifierB: string;
  messageType: string;
}

/**
 * MHS850MI/AddWhsHead record.
 *
 * E0PA/E0PB (partner) and E065 (message type) together resolve the MMS865
 * partner record M3 uses to interpret the message. V6 hardcoded E065 to
 * 'PPS300', which requires the customer to have created that partner record by
 * hand; the default here is the record M3 ships, and all five keys are
 * configurable for a tenant that has its own.
 *
 * YREF ("Your reference", 30) stamps the message with what wrote it, so a
 * receipt can be traced back to this script rather than to a person.
 */
export function buildWarehouseHeaderRecord(
  whlo: string,
  config: WhsHeaderConfig,
  reference: string
): Record<string, string> {
  return compact({
    WHLO: whlo,
    QLFR: QUALIFIER_RECEIPT,
    E0PA: config.partnerA,
    E0PB: config.partnerB,
    E0QA: config.partnerQualifierA,
    E0QB: config.partnerQualifierB,
    E007: DIRECTION_INBOUND,
    E065: config.messageType,
    YREF: truncate(reference, YREF_MAX_LENGTH),
  });
}

/** MHS850MI/AddWhsPack record. The package groups the lines of one PO line. */
export function buildWarehousePackRecord(
  whlo: string,
  msgn: string,
  packNumber: string
): Record<string, string> {
  return compact({
    WHLO: whlo,
    MSGN: msgn,
    PACN: packNumber,
    QLFR: QUALIFIER_RECEIPT,
  });
}

/** One receipt line: a quantity, optionally against a lot or serial. */
export interface WhsLineInput {
  /** Received quantity, in the purchase unit. */
  RVQA: string;
  /** Lot or serial number, for a lot-controlled item. */
  BANO?: string;
  /** Expiration date, yyyyMMdd. */
  EXPI?: string;
}

export interface WhsLineContext {
  WHLO: string;
  MSGN: string;
  PACN: string;
  ITNO: string;
  /** Purchase unit of measure. */
  PUUN: string;
  PUNO: string;
  PNLI: string;
  PNLS: string;
  /**
   * Stock location. Blank is legitimate: under direct put-away, or a goods
   * receiving method that presets one, M3 places the goods itself.
   */
  WHSL: string;
  /** Flagged as completed. */
  OEND: string;
  /** Manufacturer, when the PO line carries one. */
  PROD: string;
}

/**
 * MHS850MI/AddWhsLine record.
 *
 * RIDN/RIDL/RIDX are the reference-order keys: PO number, line, and suffix.
 * That linkage is what tells M3 this is a receipt against that PO line rather
 * than an unreferenced inbound movement.
 *
 * The origin-location note moves from BREM to REMK. Both are "Remark" on this
 * transaction, but BREM is 20 characters and the note is `Orig Loc: ` (10)
 * plus WHSL (10) — exactly 20, with no headroom at all. REMK is 30. Same
 * field semantics, no boundary to trip over.
 */
export function buildWarehouseLineRecord(
  input: WhsLineInput,
  ctx: WhsLineContext
): Record<string, string> {
  const record: Record<string, string> = {
    WHLO: ctx.WHLO,
    MSGN: ctx.MSGN,
    PACN: ctx.PACN,
    QLFR: QUALIFIER_RECEIPT,
    ITNO: ctx.ITNO,
    RVQA: input.RVQA,
    PUUN: ctx.PUUN,
    RIDN: ctx.PUNO,
    RIDL: ctx.PNLI,
    RIDX: ctx.PNLS,
    OEND: ctx.OEND,
    WHSL: ctx.WHSL,
    PROD: ctx.PROD,
  };

  if (input.BANO) {
    record.BANO = input.BANO;
    if (ctx.WHSL) {
      record.REMK = truncate('Orig Loc: ' + ctx.WHSL, REMK_MAX_LENGTH);
    }
  }
  if (input.EXPI) {
    record.EXPI = input.EXPI;
  }

  return compact(record);
}
