import { describe, it, expect } from 'vitest';
import {
  LotControl,
  autoLotNo,
  classifyReceiptMode,
  equipmentAddPermitted,
  equipmentSerialMustBeBlank,
  planEquipmentCreation,
  isDirectPutAway,
  lotMustPreExist,
  manualLotNo,
} from '../src/receiving-policy';

/**
 * These assert M3's behaviour, not V6's — the predicates are ported from
 * PPS300_MVX.java. The truth tables below are the contract: if a test here
 * fails, either the port drifted or M3's rule was misread.
 */

const ALL_INDI = ['0', '1', '2', '3', '5'];
const ALL_BACD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** BACD values PPS300 treats as automatic: 1-4, 6, 7. */
const AUTO_BACD = [1, 2, 3, 4, 6, 7];
const MANUAL_BACD = [0, 5, 8, 9];

describe('autoLotNo — ported from PPS300_MVX.java AutoLotNo()', () => {
  it('is always false when lot control is off, whatever the numbering method', () => {
    for (const bacd of ALL_BACD) {
      expect(autoLotNo(LotControl.NONE, bacd)).toBe(false);
    }
  });

  it('is true for BACD 1-4, 6, 7 on any controlled item', () => {
    for (const indi of ['1', '2', '3', '5']) {
      for (const bacd of AUTO_BACD) {
        expect(autoLotNo(indi, bacd)).toBe(true);
      }
    }
  });

  it('is false for BACD 0, 5, 8, 9', () => {
    for (const indi of ['1', '2', '3', '5']) {
      for (const bacd of MANUAL_BACD) {
        expect(autoLotNo(indi, bacd)).toBe(false);
      }
    }
  });

  it('treats BACD 4 as automatic, matching M3 despite its help text', () => {
    // "Goods receiving number generated during goods receipt, but this must be
    // entered manually" — yet PPS300 groups 4 with the automatic methods.
    expect(autoLotNo(LotControl.SERIAL, 4)).toBe(true);
  });

  it('treats BACD 5 as NOT automatic — it is manufacturing-order only', () => {
    expect(autoLotNo(LotControl.SERIAL, 5)).toBe(false);
  });
});

describe('which gate decides whether to collect a number', () => {
  // Found receiving PO 2007775 in H5: item 651103, INDI 2 / BACD 0, under
  // receiving method A11 (CRBN 1, DSTO 1). The script collected no serial and
  // told the operator M3 would assign one. BACD 0 means it will not.
  it('autoLotNo is false for BACD 0, so a serial must be collected', () => {
    expect(autoLotNo(LotControl.SERIAL, 0)).toBe(false);
  });

  it('manualLotNo disagrees, because it also asks PPS300 panel questions', () => {
    // PPS300's own comment: "Check if Manual numbering Lot No and not
    // mandantory in PPS300". CRBN/DSTO decide whether that PANEL prompts.
    // This script stages to MHS850MI and never goes through PPS300, so using
    // manualLotNo as the gate skipped a serial the item genuinely needs.
    expect(manualLotNo(LotControl.SERIAL, 0, 1, 1)).toBe(false);
  });

  it('still collects nothing when M3 really does generate the number', () => {
    // PO 2007774, item Y21002: INDI 3 / BACD 6. This one is genuinely auto.
    expect(autoLotNo('3', 6)).toBe(true);
  });
});

describe('manualLotNo — ported from PPS300_MVX.java ManualLotNo()', () => {
  it('is true only when nothing else supplies the number', () => {
    expect(manualLotNo(LotControl.SERIAL, 0, 0, 0)).toBe(true);
  });

  it('is false whenever M3 numbers automatically', () => {
    for (const bacd of AUTO_BACD) {
      expect(manualLotNo(LotControl.SERIAL, bacd, 0, 0)).toBe(false);
    }
  });

  it('is false when lot control is off', () => {
    expect(manualLotNo(LotControl.NONE, 0, 0, 0)).toBe(false);
  });

  it('is false under direct put-away (DSTO = 1)', () => {
    expect(manualLotNo(LotControl.SERIAL, 0, 0, 1)).toBe(false);
  });

  it('is false when CRBN = 1', () => {
    expect(manualLotNo(LotControl.SERIAL, 0, 1, 0)).toBe(false);
  });

  it('autoLotNo and manualLotNo are never both true', () => {
    for (const indi of ALL_INDI) {
      for (const bacd of ALL_BACD) {
        for (const crbn of [0, 1]) {
          for (const dsto of [0, 1]) {
            const both = autoLotNo(indi, bacd) && manualLotNo(indi, bacd, crbn, dsto);
            expect(both).toBe(false);
          }
        }
      }
    }
  });

  it('an uncontrolled item is never asked for a number by either route', () => {
    for (const bacd of ALL_BACD) {
      expect(autoLotNo('0', bacd)).toBe(false);
      expect(manualLotNo('0', bacd, 0, 0)).toBe(false);
    }
  });
});

describe('classifyReceiptMode', () => {
  it('maps INDI 2 to the serial flow', () =>
    expect(classifyReceiptMode('2')).toBe('serial'));

  it('maps INDI 1, 3 and 5 to the lot flow', () => {
    expect(classifyReceiptMode('1')).toBe('lot');
    expect(classifyReceiptMode('3')).toBe('lot');
    expect(classifyReceiptMode('5')).toBe('lot');
  });

  it('REGRESSION vs V6: INDI 1 and 5 are lot-controlled, not plain', () => {
    // V6 branched on '2' and '3' only, so 1 and 5 fell through to the
    // uncontrolled path and skipped lot handling entirely.
    expect(classifyReceiptMode('1')).not.toBe('plain');
    expect(classifyReceiptMode('5')).not.toBe('plain');
  });

  it('maps INDI 0 and anything unrecognised to plain', () => {
    expect(classifyReceiptMode('0')).toBe('plain');
    expect(classifyReceiptMode('')).toBe('plain');
    expect(classifyReceiptMode('9')).toBe('plain');
  });
});

describe('lotMustPreExist', () => {
  it('is false for INDI 1 — lots need not be registered in advance', () =>
    expect(lotMustPreExist('1')).toBe(false));

  it('is true for INDI 2, 3 and 5 — all lots live in the lot master', () => {
    expect(lotMustPreExist('2')).toBe(true);
    expect(lotMustPreExist('3')).toBe(true);
    expect(lotMustPreExist('5')).toBe(true);
  });

  it('is false when lot control is off', () =>
    expect(lotMustPreExist('0')).toBe(false));
});

describe('isDirectPutAway', () => {
  it('is true only for DSTO = 1', () => {
    expect(isDirectPutAway(1)).toBe(true);
    expect(isDirectPutAway(0)).toBe(false);
    expect(isDirectPutAway(2)).toBe(false);
  });
});

describe('MMS240MI/Add rules — from MMS240MI_MVX.java', () => {
  it('rejects a supplied SERN for BACD 1,2,3,6,7 (MM24031)', () => {
    for (const bacd of [1, 2, 3, 6, 7]) {
      expect(equipmentSerialMustBeBlank(bacd)).toBe(true);
    }
  });

  it('accepts a supplied SERN for BACD 0 and 4', () => {
    // 4 is the set that differs from PPS300's AutoLotNo, which DOES include it.
    expect(equipmentSerialMustBeBlank(0)).toBe(false);
    expect(equipmentSerialMustBeBlank(4)).toBe(false);
  });

  it('refuses Add entirely for BACD 4,5,8,9 (MM24032)', () => {
    for (const bacd of [4, 5, 8, 9]) {
      expect(equipmentAddPermitted(bacd)).toBe(false);
    }
  });

  it('permits Add for BACD 0,1,2,3,6,7', () => {
    for (const bacd of [0, 1, 2, 3, 6, 7]) {
      expect(equipmentAddPermitted(bacd)).toBe(true);
    }
  });

  it('the two MMS240 sets differ from PPS300 AutoLotNo exactly on BACD 4', () => {
    // PPS300 treats 4 as automatic (do not prompt); MMS240MI neither requires
    // a blank SERN for it nor permits Add at all. Conflating the rules is the
    // bug.
    expect(autoLotNo('2', 4)).toBe(true);
    expect(equipmentSerialMustBeBlank(4)).toBe(false);
    expect(equipmentAddPermitted(4)).toBe(false);
  });
});

describe('planEquipmentCreation', () => {
  it('sends the serial only on manual numbering (BACD 0)', () =>
    expect(planEquipmentCreation('2', 0)).toBe('add-with-serial'));

  it('omits the serial where M3 generates it', () => {
    for (const bacd of [1, 2, 3, 6, 7]) {
      expect(planEquipmentCreation('2', bacd)).toBe('add-generated-serial');
    }
  });

  it('skips Add where M3 forbids it, rather than failing the receipt', () => {
    // The receipt still posts through MHS850; there is simply no MMS240
    // record to pre-create.
    for (const bacd of [4, 5, 8, 9]) {
      expect(planEquipmentCreation('2', bacd)).toBe('skip');
    }
  });

  it('skips Add for any non-serial item', () => {
    for (const indi of ['0', '1', '3', '5']) {
      expect(planEquipmentCreation(indi, 0)).toBe('skip');
    }
  });

  it('REGRESSION: V6 would call Add with a serial on every INDI 2 item', () => {
    // Only BACD 0 is actually valid for that. Every other numbering method
    // returns MM24031 or MM24032 and trips V6's rollback.
    const v6WouldSucceed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (bacd) => planEquipmentCreation('2', bacd) === 'add-with-serial'
    );
    expect(v6WouldSucceed).toEqual([0]);
  });
});

describe('when the "Generate serials" shortcut may be offered', () => {
  // The serial dialog opens whenever numbering is not automatic, which since
  // the gate fix includes BACD 5, 8 and 9 — methods where MMS240MI/Add refuses
  // the item (MM24032) and equipment creation is skipped. Auto-filling
  // PUNO-1..N there would invent serials M3 never expected to be assigned.
  const offered = (bacd: number): boolean =>
    planEquipmentCreation(LotControl.SERIAL, bacd) === 'add-with-serial';

  it('is offered for BACD 0, where SERN is required and accepted', () => {
    expect(offered(0)).toBe(true);
  });

  it('is withheld for BACD 4, 5, 8 and 9, where Add refuses the item', () => {
    for (const bacd of [4, 5, 8, 9]) {
      expect(offered(bacd), 'BACD ' + bacd).toBe(false);
    }
  });

  it('is withheld for the methods where M3 generates the serial', () => {
    for (const bacd of [1, 2, 3, 6, 7]) {
      expect(offered(bacd), 'BACD ' + bacd).toBe(false);
    }
  });
});
