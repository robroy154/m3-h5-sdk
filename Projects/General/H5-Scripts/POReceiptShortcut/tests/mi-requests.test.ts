import { describe, it, expect } from 'vitest';
import {
  ALII_MAX_LENGTH,
  LINE_DIAGNOSTIC_FIELDS,
  PoLineContext,
  SKEY_MAX_LENGTH,
  buildCustomFieldRecord,
  buildEquipmentRecord,
  chooseOversizeTarget,
  describeLineFailure,
} from '../src/mi-requests';
import { CFMA_MAX_LENGTH, SerialEntry } from '../src/serial-policy';

const ctx: PoLineContext = {
  ITNO: 'ITEM-1',
  PUNO: '2000000150',
  PNLI: '10',
  PNLS: '0',
  price: '123.45',
  currency: 'EUR',
  FACI: '100',
  purchaseDate: '20260921',
  SUNO: '00001',
  CUNO: 'CUST-9',
  poItemName: 'PO item name',
  itemDescription: 'Item master description',
  PROD: 'ACME',
  ECVE: 'A1',
};

const entry = (original: string, derived = original, index = 0): SerialEntry => ({
  originalSerial: original,
  derivedSerial: derived,
  index,
});

describe('chooseOversizeTarget', () => {
  it('needs no overflow storage at or under SERN 20', () => {
    expect(chooseOversizeTarget('A'.repeat(20))).toBe('none');
    expect(chooseOversizeTarget('')).toBe('none');
  });
  it('uses EEQN for 21..40, which needs no customer setup', () => {
    expect(chooseOversizeTarget('A'.repeat(21))).toBe('eeqn');
    expect(chooseOversizeTarget('A'.repeat(40))).toBe('eeqn');
  });
  it('falls back to CMS474 past 40', () =>
    expect(chooseOversizeTarget('A'.repeat(41))).toBe('cms474'));
});

describe('buildEquipmentRecord', () => {
  it('uses the resolved currency, never a hardcoded one', () => {
    const r = buildEquipmentRecord(entry('S1'), ctx);
    expect(r.CUCD).toBe('EUR');
    expect(JSON.stringify(r)).not.toContain('USD');
  });

  it('writes the supplier, which V6 never did', () =>
    expect(buildEquipmentRecord(entry('S1'), ctx).SUNO).toBe('00001'));

  it('prefers the PO item name for ALII so nothing is truncated', () =>
    expect(buildEquipmentRecord(entry('S1'), ctx).ALII).toBe('PO item name'));

  it('falls back to the item description when no PO item name exists', () => {
    const r = buildEquipmentRecord(entry('S1'), { ...ctx, poItemName: '' });
    expect(r.ALII).toBe('Item master description');
  });

  it('never exceeds ALII 40, where V6 sent ITDS 60 unbounded', () => {
    const r = buildEquipmentRecord(entry('S1'), {
      ...ctx,
      poItemName: '',
      itemDescription: 'D'.repeat(60),
    });
    expect(r.ALII).toHaveLength(ALII_MAX_LENGTH);
  });

  it('puts the operator serial in SKEY so a derived value stays findable', () => {
    const r = buildEquipmentRecord(entry('VENDOR-SERIAL-123', 'BSN0921261407001'), ctx);
    expect(r.SKEY).toBe('VENDOR-SERIAL-123');
    expect(r.SERN).toBe('BSN0921261407001');
  });

  it('truncates SKEY at 20', () => {
    const r = buildEquipmentRecord(entry('V'.repeat(30), 'BSN1'), ctx);
    expect(r.SKEY).toHaveLength(SKEY_MAX_LENGTH);
  });

  it('sets EEQN only for a 21..40 serial', () => {
    const short = buildEquipmentRecord(entry('S1'), ctx);
    expect(short.EEQN).toBeUndefined();

    const mid = buildEquipmentRecord(entry('V'.repeat(30), 'BSN1'), ctx);
    expect(mid.EEQN).toBe('V'.repeat(30));

    const long = buildEquipmentRecord(entry('V'.repeat(50), 'BSN1'), ctx);
    expect(long.EEQN).toBeUndefined(); // goes to CMS474 instead
  });

  it('captures PROD and ECVE, which M3 sets on ILOMA and V6 dropped', () => {
    const r = buildEquipmentRecord(entry('S1'), ctx);
    expect(r.PROD).toBe('ACME');
    expect(r.ECVE).toBe('A1');
  });

  it('keeps PUNO/PNLI even though chkIndiv overwrites them', () => {
    // chkIndiv only runs for INDI 2; omitting them would lose the linkage on
    // any path where it does not fire.
    const r = buildEquipmentRecord(entry('S1'), ctx);
    expect(r.PUNO).toBe('2000000150');
    expect(r.PNLI).toBe('10');
    expect(r.PNLS).toBe('0');
  });

  it('omits empty fields rather than sending blanks', () => {
    const r = buildEquipmentRecord(entry('S1'), { ...ctx, CUNO: '', PROD: '', ECVE: '' });
    expect(r).not.toHaveProperty('CUNO');
    expect(r).not.toHaveProperty('PROD');
    expect(r).not.toHaveProperty('ECVE');
    expect(r.ITNO).toBe('ITEM-1'); // populated ones survive
  });

  it('always carries the mandatory FACI', () =>
    expect(buildEquipmentRecord(entry('S1'), ctx).FACI).toBe('100'));
});

describe('buildCustomFieldRecord', () => {
  it('sends no CONO or DIVI — AddEqInfo does not accept them', () => {
    const r = buildCustomFieldRecord(entry('V'.repeat(50), 'BSN1'), 'I1', 'G', 'F', '1');
    expect(r).not.toHaveProperty('CONO');
    expect(r).not.toHaveProperty('DIVI');
  });

  it('stores the original serial against the derived SERN', () => {
    const r = buildCustomFieldRecord(entry('V'.repeat(50), 'BSN1'), 'I1', 'G', 'F', '1');
    expect(r.CFMA).toBe('V'.repeat(50));
    expect(r.SERN).toBe('BSN1');
  });

  it('truncates at CFMA 60 rather than letting MI reject the call', () => {
    const r = buildCustomFieldRecord(entry('V'.repeat(80), 'BSN1'), 'I1', 'G', 'F', '1');
    expect(r.CFMA).toHaveLength(CFMA_MAX_LENGTH);
  });
});

describe('line failure diagnostics', () => {
  it('requests MSGD and MSID, not the nonexistent REMK', () => {
    expect(LINE_DIAGNOSTIC_FIELDS).toContain('MSGD');
    expect(LINE_DIAGNOSTIC_FIELDS).toContain('MSID');
    expect(LINE_DIAGNOSTIC_FIELDS).not.toContain('REMK');
  });

  it("leads with M3's message rather than the script's own note", () => {
    const out = describeLineFailure({
      MSGD: 'Quantity exceeds remaining',
      BREM: 'Orig Loc: A1',
      MSLN: '1',
    });
    expect(out.split('\n')[0]).toBe('Quantity exceeds remaining');
  });

  it('falls back to BREM only when MSGD is absent', () => {
    const out = describeLineFailure({ BREM: 'Orig Loc: A1' });
    expect(out).toContain('Orig Loc: A1');
  });

  it('includes the identifying fields when present', () => {
    const out = describeLineFailure({
      MSGD: 'boom', MSID: 'WW1234', MSLN: '2', ITNO: 'I1', BANO: 'B1',
    });
    expect(out).toContain('WW1234');
    expect(out).toContain('Line no: 2');
    expect(out).toContain('Item: I1');
    expect(out).toContain('Lot/Serial: B1');
  });

  it('returns nothing for an absent or empty line', () => {
    expect(describeLineFailure(null as any)).toBe('');
    expect(describeLineFailure({})).toBe('');
  });
});
