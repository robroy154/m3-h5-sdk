import { describe, it, expect } from 'vitest';
import {
  LotControl,
  autoLotNo,
  classifyReceiptMode,
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
