/**
 * Receiving policy: when M3 wants a lot/serial number typed in, and how the
 * item's lot control method shapes the receipt.
 *
 * Unlike serial-policy.ts, this is NOT extracted from POReceiptShortcutV6 —
 * V6 has no equivalent. The predicates below are ported from M3's own
 * PPS300 business logic (PPS300_MVX.java, AutoLotNo() and ManualLotNo()), so
 * that the script asks for input exactly when the program it is driving would.
 *
 * V6 prompts for a serial or lot on every controlled item regardless of the
 * numbering method. For any customer whose items use automatic lot numbering
 * that asks the operator to invent a number M3 was going to generate.
 */

/* ─── MITMAS.INDI — lot control method ───────────────────────────────────── */
export const LotControl = {
  /** Lot control not used. */
  NONE: '0',
  /** Used; lots do NOT need to exist in the lot master beforehand. */
  LOT_UNREGISTERED: '1',
  /** Used; all lots in the lot master, and each lot number IS a serial number. */
  SERIAL: '2',
  /** Used; all lots must exist in the lot master. */
  LOT_REGISTERED: '3',
  /** Used; all lots in the lot master, with a serial specification per lot. */
  LOT_WITH_SERIAL_SPEC: '5',
} as const;

/** How the receipt has to be collected from the operator. */
export type ReceiptMode = 'serial' | 'lot' | 'plain';

/**
 * MITMAS.BACD values that mean M3 generates the number itself.
 *
 * Ported from PPS300_MVX.java AutoLotNo():
 *     BACD >= 1 && BACD <= 4 || BACD == 6 || BACD == 7
 *
 * Note 4 ("goods receiving number generated during goods receipt, but this
 * must be entered manually") counts as automatic in M3's own grouping. That
 * reads contradictory, but it is M3's rule and is reproduced rather than
 * second-guessed.
 */
function isAutoNumberingMethod(bacd: number): boolean {
  return (bacd >= 1 && bacd <= 4) || bacd === 6 || bacd === 7;
}

/** True when M3 generates the lot/serial number, so the operator must not. */
export function autoLotNo(indi: string, bacd: number): boolean {
  if (indi === LotControl.NONE) {
    return false;
  }
  return isAutoNumberingMethod(bacd);
}

/**
 * True when the operator has to supply the number.
 *
 * Ported from PPS300_MVX.java ManualLotNo():
 *     !AutoLotNo() && INDI != 0 && PGRMT.CRBN != 1 && PGRMT.DSTO != 1
 *
 * `CRBN` and `DSTO` come from the goods receiving method record
 * (PPS345MI/Get). `DSTO` is "Direct put-away": when set, M3 places the goods
 * itself and does not stop to ask.
 */
export function manualLotNo(
  indi: string,
  bacd: number,
  crbn: number,
  dsto: number
): boolean {
  return (
    !autoLotNo(indi, bacd) &&
    indi !== LotControl.NONE &&
    crbn !== 1 &&
    dsto !== 1
  );
}

/**
 * True when the operator supplies the lot/serial at goods receipt.
 *
 * From M3's own field help for BACD (MMBACD):
 *
 *   0        Manually.
 *   1,2,3,6  Automatically, from the series 11 sequence on CRS165/E.
 *   7        Automatically, from the numbering rules on CRS040.
 *   4        Goods receiving number generated during goods receipt. PPS300
 *            defaults BANO to the receiving number for this one.
 *   5        Order number — only used with manufacturing orders.
 *   8,9      Simple lot tracing for OUTBOUND deliveries; the lot reference is
 *            filled in when reporting picking lines, not at receipt.
 *
 * Only 0 asks the operator for a number during a purchase receipt. 5, 8 and 9
 * are not inbound numbering at all, which is why autoLotNo() is the wrong
 * question here: it is false for those three, so using it prompted for serials
 * an inbound receipt never assigns.
 */
export function operatorSuppliesNumber(indi: string, bacd: number): boolean {
  if (classifyReceiptMode(indi) === 'plain') return false;
  return bacd === MANUAL_NUMBERING;
}

/**
 * Which collection flow the item needs.
 *
 * V6 branched on '2' and '3' only, so INDI 1 and 5 fell through to the
 * uncontrolled path and skipped lot handling entirely. Both are lot-controlled.
 */
export function classifyReceiptMode(indi: string): ReceiptMode {
  switch (indi) {
    case LotControl.SERIAL:
      return 'serial';
    case LotControl.LOT_UNREGISTERED:
    case LotControl.LOT_REGISTERED:
    case LotControl.LOT_WITH_SERIAL_SPEC:
      return 'lot';
    default:
      // Includes '0' and any value M3 adds later: collect nothing rather than
      // guess at a flow.
      return 'plain';
  }
}

/**
 * Whether the lot has to already exist in the lot master.
 *
 * Drives what "lot not found" means: for INDI 1 a missing lot is normal and
 * gets created, for 2/3/5 it is an error.
 */
export function lotMustPreExist(indi: string): boolean {
  return (
    indi === LotControl.SERIAL ||
    indi === LotControl.LOT_REGISTERED ||
    indi === LotControl.LOT_WITH_SERIAL_SPEC
  );
}

/**
 * Direct put-away: M3 assigns the stock location itself, so the operator is
 * not asked for one and a blank location is not an error.
 */
export function isDirectPutAway(dsto: number): boolean {
  return dsto === 1;
}

/* ─── MMS240MI/Add rules, from MMS240MI_MVX.java ─────────────────────────── */

/**
 * These are NOT the same rule as autoLotNo(), and conflating them is how V6
 * fails. PPS300 decides whether to PROMPT; MMS240MI decides what its Add
 * transaction will ACCEPT, and the two sets differ on BACD 4.
 *
 * MMS240MI_MVX.java, the Add transaction:
 *
 *   BACD 1,2,3,6,7  SERN must be blank; M3 generates it via RTVBAN().
 *                   Supplying one returns MM24031 "Serial number must be
 *                   blank, lot numbering method is &1" and Add returns early.
 *
 *   BACD 4,5,8,9    MM24032 "Adding serial number not permitted, lot
 *                   numbering method is &1". Add refuses outright.
 *
 *   BACD 0          Manual. SERN is required and accepted.
 *
 * So V6, which always supplies a SERN and always calls Add for INDI 2, only
 * works on BACD 0. Everything else fails at equipment creation and trips its
 * rollback path.
 */

/** The one BACD where M3 expects the operator to supply the number. */
const MANUAL_NUMBERING = 0;

/** BACD values where MMS240MI/Add rejects a supplied SERN (MM24031). */
const SERN_MUST_BE_BLANK = [1, 2, 3, 6, 7];

/** BACD values where MMS240MI/Add refuses entirely (MM24032). */
const ADD_NOT_PERMITTED = [4, 5, 8, 9];

/** True when MMS240MI/Add will generate the serial and must not be given one. */
export function equipmentSerialMustBeBlank(bacd: number): boolean {
  return SERN_MUST_BE_BLANK.indexOf(bacd) !== -1;
}

/** True when MMS240MI/Add cannot be used for this item at all. */
export function equipmentAddPermitted(bacd: number): boolean {
  return ADD_NOT_PERMITTED.indexOf(bacd) === -1;
}

export type EquipmentPlan =
  /** Call Add with the operator's serial. */
  | 'add-with-serial'
  /** Call Add with SERN omitted; M3 assigns it. */
  | 'add-generated-serial'
  /** Do not call Add; M3 does not permit it for this numbering method. */
  | 'skip';

/**
 * How equipment creation must be approached for an item.
 *
 * Returning 'skip' is not a failure: for BACD 4/5/8/9 the receipt still posts
 * through MHS850, there simply is no MMS240 record to pre-create.
 */
export function planEquipmentCreation(indi: string, bacd: number): EquipmentPlan {
  if (classifyReceiptMode(indi) !== 'serial') return 'skip';
  if (!equipmentAddPermitted(bacd)) return 'skip';
  return equipmentSerialMustBeBlank(bacd) ? 'add-generated-serial' : 'add-with-serial';
}
