import { describe, it, expect } from 'vitest';
import { applyCompanyScope, readSelectedRows } from '../src/h5-adapter';

const context = { company: '100', division: 'AAA' };

describe('applyCompanyScope', () => {
  it('adds nothing when the transaction accepts neither key', () => {
    // CMS474MI/*EqInfo and MHS850MI/LstWhsLine take no company keys at all.
    const record = { ITNO: 'I1' };
    expect(applyCompanyScope(record, 'none', context)).toEqual({ ITNO: 'I1' });
    expect(applyCompanyScope(record, undefined, context)).toEqual({ ITNO: 'I1' });
  });

  it('adds CONO alone for a company-scoped transaction', () => {
    // PrcWhsTran and GetWhsHead have a CONO input and no DIVI input.
    expect(applyCompanyScope({ MSGN: 'M1' }, 'company', context)).toEqual({
      MSGN: 'M1', CONO: '100',
    });
  });

  it('adds both for a company-division transaction', () => {
    expect(applyCompanyScope({ WHLO: 'REG' }, 'company-division', context)).toEqual({
      WHLO: 'REG', CONO: '100', DIVI: 'AAA',
    });
  });

  it('omits a key the user context did not supply', () => {
    // An empty CONO is a value M3 would try to resolve, not an absence.
    expect(
      applyCompanyScope({ WHLO: 'REG' }, 'company-division', { company: '', division: '' })
    ).toEqual({ WHLO: 'REG' });
  });

  it('does not mutate the record it was given', () => {
    const record = { WHLO: 'REG' };
    applyCompanyScope(record, 'company-division', context);
    expect(record).toEqual({ WHLO: 'REG' });
  });
});

describe('readSelectedRows', () => {
  it('is empty when there is no grid', () => {
    expect(readSelectedRows(null)).toEqual([]);
  });

  it('is empty when the runtime lacks the accessor', () => {
    // getSelectedGridRows() is documented but absent from Infor's .d.ts, so
    // its presence at runtime is not guaranteed across H5 versions.
    expect(readSelectedRows({} as never)).toEqual([]);
  });

  it('passes an array straight through', () => {
    const grid = { getSelectedGridRows: () => [{ idx: 1 }, { idx: 2 }] };
    expect(readSelectedRows(grid as never)).toHaveLength(2);
  });

  it('wraps a single row, since the guide is ambiguous about arity', () => {
    const grid = { getSelectedGridRows: () => ({ idx: 1 }) };
    expect(readSelectedRows(grid as never)).toEqual([{ idx: 1 }]);
  });

  it('treats nothing selected as an empty selection, not one empty row', () => {
    for (const value of [null, undefined, 0, '']) {
      const grid = { getSelectedGridRows: () => value };
      expect(readSelectedRows(grid as never)).toEqual([]);
    }
  });

  it('survives an accessor that throws', () => {
    const grid = {
      getSelectedGridRows: () => { throw new Error('not a web component grid'); },
    };
    expect(readSelectedRows(grid as never)).toEqual([]);
  });
});
