import { describe, it, expect } from 'vitest';
import {
  ALII_MAX_LENGTH,
  LINE_DIAGNOSTIC_FIELDS,
  PoLineContext,
  REMK_MAX_LENGTH,
  SKEY_MAX_LENGTH,
  YREF_MAX_LENGTH,
  buildCustomFieldRecord,
  buildEquipmentRecord,
  buildWarehouseHeaderRecord,
  buildWarehouseLineRecord,
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

  it('sets no PROD or ECVE, because MMS240MI/Add accepts neither', () => {
    // An earlier draft set both here on the strength of M3's own createMILOIN
    // writing them to ILOMA. The catalog is clear that Add's input list has
    // no PROD and no ECVE, so M3 would have ignored both. PROD moves to the
    // warehouse line, which does accept it; ECVE has no home in either write
    // transaction and is no longer read.
    const r = buildEquipmentRecord(entry('S1'), ctx);
    expect(r.PROD).toBeUndefined();
    expect(r.ECVE).toBeUndefined();
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
    const r = buildEquipmentRecord(entry('S1'), { ...ctx, CUNO: '', PROD: '' });
    expect(r).not.toHaveProperty('CUNO');
    expect(r).not.toHaveProperty('PROD');
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

  it('does not repeat MSGD as the MSID explanation', () => {
    // MSGD is M3's filled-in text, so it never equals the '&1' template. A
    // strict compare printed the same sentence twice.
    const out = describeLineFailure({
      MSID: 'WWS0103',
      MSGD: 'Location A-01-02 does not exist',
    });
    expect(out).toContain('Message id: WWS0103');
    expect(out).not.toContain('WWS0103 (');
  });

  it('attaches the catalogued meaning when the line carries only an id', () => {
    const out = describeLineFailure({ MSID: 'WPU0201' });
    expect(out).toContain('Purchase order U/M is invalid');
  });

  it('returns nothing for an absent or empty line', () => {
    expect(describeLineFailure(null as any)).toBe('');
    expect(describeLineFailure({})).toBe('');
  });
});

describe('buildWarehouseHeaderRecord', () => {
  const config = {
    partnerA: 'WS',
    partnerB: 'WS',
    partnerQualifierA: '',
    partnerQualifierB: '',
    messageType: 'WMS',
  };

  it('sends every key AddWhsHead marks mandatory', () => {
    const record = buildWarehouseHeaderRecord('REG', config, 'ref');
    for (const key of ['WHLO', 'QLFR', 'E0PA', 'E0PB', 'E065']) {
      expect(record[key]).toBeTruthy();
    }
  });

  it('omits the partner qualifiers when not configured', () => {
    // An empty E0QA would be a value M3 tries to resolve, not an absence.
    const record = buildWarehouseHeaderRecord('REG', config, 'ref');
    expect(record.E0QA).toBeUndefined();
    expect(record.E0QB).toBeUndefined();
  });

  it('passes the qualifiers through when they are configured', () => {
    const record = buildWarehouseHeaderRecord(
      'REG', { ...config, partnerQualifierA: 'A1', partnerQualifierB: 'B1' }, 'ref'
    );
    expect(record.E0QA).toBe('A1');
    expect(record.E0QB).toBe('B1');
  });

  it('truncates the reference to YREF:30', () => {
    const record = buildWarehouseHeaderRecord('REG', config, 'X'.repeat(45));
    expect(record.YREF).toHaveLength(YREF_MAX_LENGTH);
  });
});

describe('buildWarehouseLineRecord', () => {
  const ctx = {
    WHLO: 'REG', MSGN: 'MSG1', PACN: 'PO1_10', ITNO: 'ITEM1',
    PUUN: 'EA', PUNO: 'PO1', PNLI: '10', PNLS: '0',
    WHSL: 'A01', OEND: '1', PROD: 'ACME',
  };

  it('links the line back to the PO through RIDN/RIDL/RIDX', () => {
    // That linkage is what makes this a receipt rather than a loose inbound.
    const record = buildWarehouseLineRecord({ RVQA: '5' }, ctx);
    expect(record.RIDN).toBe('PO1');
    expect(record.RIDL).toBe('10');
    expect(record.RIDX).toBe('0');
  });

  it('carries the manufacturer, which the equipment record cannot', () => {
    // MMS240MI/Add has no PROD input; AddWhsLine does.
    expect(buildWarehouseLineRecord({ RVQA: '1' }, ctx).PROD).toBe('ACME');
  });

  it('omits the location when none resolved', () => {
    // Blank is legitimate under direct put-away: M3 places the goods itself.
    const record = buildWarehouseLineRecord({ RVQA: '1' }, { ...ctx, WHSL: '' });
    expect(record.WHSL).toBeUndefined();
  });

  it('writes the origin-location note to REMK, not BREM', () => {
    // BREM is 20 and the note is exactly 20 at a full-width WHSL. REMK is 30.
    const record = buildWarehouseLineRecord({ RVQA: '1', BANO: 'SER1' }, ctx);
    expect(record.REMK).toBe('Orig Loc: A01');
    expect(record.BREM).toBeUndefined();
  });

  it('keeps the note inside REMK:30 at a full-width location', () => {
    const record = buildWarehouseLineRecord(
      { RVQA: '1', BANO: 'SER1' }, { ...ctx, WHSL: 'L'.repeat(10) }
    );
    expect(record.REMK!.length).toBeLessThanOrEqual(REMK_MAX_LENGTH);
  });

  it('adds no note for an uncontrolled line', () => {
    expect(buildWarehouseLineRecord({ RVQA: '1' }, ctx).REMK).toBeUndefined();
  });

  it('includes the expiry only when one was collected', () => {
    expect(buildWarehouseLineRecord({ RVQA: '1' }, ctx).EXPI).toBeUndefined();
    expect(
      buildWarehouseLineRecord({ RVQA: '1', EXPI: '20260101' }, ctx).EXPI
    ).toBe('20260101');
  });
});
