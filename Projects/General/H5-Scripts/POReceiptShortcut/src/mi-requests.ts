/**
 * Construction of the MI record payloads.
 *
 * Kept pure and separate from the calls that send them so the corrections
 * below are reviewable as data — every one of them is a change to what lands
 * in M3, and none can be verified without a tenant.
 */

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
  /** Manufacturer. */
  PROD: string;
  /** Revision number. */
  ECVE: string;
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
 * - PROD and ECVE are captured; M3 sets both on ILOMA and V6 captured neither.
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
    PROD: ctx.PROD,
    ECVE: ctx.ECVE,
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

/** Picks the most useful failure text available on a returned line. */
export function describeLineFailure(line: Record<string, string>): string {
  if (!line) return '';
  const parts: string[] = [];
  const message = line.MSGD || line.BREM || '';
  if (message) parts.push(message);
  if (line.MSID) parts.push('Message id: ' + line.MSID);
  if (line.MSLN) parts.push('Line no: ' + line.MSLN);
  if (line.ITNO) parts.push('Item: ' + line.ITNO);
  if (line.BANO) parts.push('Lot/Serial: ' + line.BANO);
  return parts.join('\n');
}
