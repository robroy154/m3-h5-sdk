import { describe, it, expect } from 'vitest';
import {
  BASIC_DATA_FIELDS,
  MiRequestSpec,
  MiResponse,
  PO_HEAD_FIELDS,
  buildLineContext,
  fetchLineData,
  lotOrSerialExists,
  resolvePrice,
  resolvePurchaseDate,
  specBasicData,
  specItem,
  specPoHead,
  specPoLine,
  toItems,
} from '../src/mi-gateway';

/** Records every request and replies from a canned table. */
function fakeExecutor(replies: Record<string, MiResponse>) {
  const calls: MiRequestSpec[] = [];
  const execute = (spec: MiRequestSpec): Promise<MiResponse> => {
    calls.push(spec);
    const key = spec.program + '/' + spec.transaction;
    return Promise.resolve(replies[key] || { item: {} });
  };
  return { execute, calls };
}

describe('request specs', () => {
  it('always set outputFields, per the repo standard', () => {
    const specs = [
      specBasicData('P', '10', '0'),
      specPoLine('P', '10', '0'),
      specPoHead('P'),
      specItem('I'),
    ];
    for (const spec of specs) {
      expect(spec.outputFields).toBeDefined();
      expect(spec.outputFields!.length).toBeGreaterThan(0);
    }
  });

  it('asks GetBasicData2 for the fields it already returns', () => {
    // V6 requested RSTQ alone from a call returning 25 fields.
    for (const f of ['RSTQ', 'INDI', 'BACD', 'DSTO', 'FLCD', 'GRMT']) {
      expect(BASIC_DATA_FIELDS).toContain(f);
    }
  });

  it('restores GetHead and asks it for CUCD, which GetLine cannot give', () => {
    expect(PO_HEAD_FIELDS).toContain('CUCD');
    expect(specPoHead('P').record).toEqual({ PUNO: 'P' });
  });

  it('GetHead needs only PUNO, so it parallelises with the rest', () =>
    expect(Object.keys(specPoHead('P').record)).toEqual(['PUNO']));

  it('no spec carries a hardcoded company or division', () => {
    // The H5 MIService injects company scope; repeating it caused the CMS474
    // 400s V6 documented.
    const all = [specBasicData('P','10','0'), specPoLine('P','10','0'), specPoHead('P'), specItem('I')];
    for (const spec of all) {
      expect(spec.record).not.toHaveProperty('CONO');
      expect(spec.record).not.toHaveProperty('DIVI');
    }
  });
});

describe('toItems', () => {
  it('normalises both MI list shapes', () => {
    expect(toItems({ items: [{ A: '1' }, { A: '2' }] })).toHaveLength(2);
    expect(toItems({ item: { A: '1' } })).toHaveLength(1);
    expect(toItems({})).toHaveLength(0);
    expect(toItems(null)).toHaveLength(0);
  });
});

describe('fetchLineData', () => {
  const replies: Record<string, MiResponse> = {
    'PPS001MI/GetBasicData2': { item: { RSTQ: '5', INDI: '2', BACD: '0', ITDS: 'Desc' } },
    'PPS200MI/GetLine': { item: { PUPR: '10', CPPR: '', FACI: '100', RGDT: '20260901' } },
    'PPS200MI/GetHead': { item: { CUCD: 'EUR', PUDT: '20260801', SUNO: 'S1' } },
    'MMS200MI/Get': { item: { TPCD: '1', EXPD: '0' } },
  };

  it('issues exactly four reads', async () => {
    const { execute, calls } = fakeExecutor(replies);
    await fetchLineData(execute, 'P', '10', '0', 'I');
    expect(calls).toHaveLength(4);
  });

  it('includes GetHead, which V6 dropped', async () => {
    const { execute, calls } = fakeExecutor(replies);
    await fetchLineData(execute, 'P', '10', '0', 'I');
    expect(calls.map((c) => c.program + '/' + c.transaction)).toContain('PPS200MI/GetHead');
  });

  it('names the failing lookup rather than reporting a generic error', async () => {
    const { execute } = fakeExecutor({ ...replies, 'PPS200MI/GetHead': { errorMessage: 'gone' } });
    await expect(fetchLineData(execute, 'P', '10', '0', 'I')).rejects.toThrow(/gone/);
  });

  it('fails when a lookup returns no item at all', async () => {
    const { execute } = fakeExecutor({ ...replies, 'MMS200MI/Get': {} });
    await expect(fetchLineData(execute, 'P', '10', '0', 'I')).rejects.toThrow(/Item lookup/);
  });
});

describe('resolvePrice', () => {
  it('prefers the confirmed price when populated', () =>
    expect(resolvePrice({ CPPR: '99', PUPR: '10' })).toBe('99'));
  it('falls back to the ordered price', () =>
    expect(resolvePrice({ CPPR: '', PUPR: '10' })).toBe('10'));
  it('treats whitespace as unpopulated', () =>
    expect(resolvePrice({ CPPR: '   ', PUPR: '10' })).toBe('10'));
  it('does not throw when both are missing', () =>
    expect(resolvePrice({})).toBe(''));
});

describe('resolvePurchaseDate', () => {
  it("uses the line's registration date", () =>
    expect(resolvePurchaseDate({ RGDT: '20260901' }, { PUDT: '20260801' })).toBe('20260901'));
  it('falls back to the PO order date', () =>
    expect(resolvePurchaseDate({}, { PUDT: '20260801' })).toBe('20260801'));
  it('returns empty rather than inventing today', () =>
    expect(resolvePurchaseDate({}, {})).toBe(''));
});

describe('buildLineContext', () => {
  const raw = {
    basic: { ITDS: 'Item master description' },
    line: { CPPR: '99', PUPR: '10', FACI: '100', RGDT: '20260901', PITD: 'PO name', PROD: 'ACME', ECVE: 'A1' },
    head: { CUCD: 'EUR', PUDT: '20260801', SUNO: 'S1' },
    item: { TPCD: '1', EXPD: '0' },
  };
  const id = { PUNO: 'P', PNLI: '10', PNLS: '0', ITNO: 'I' };

  it('takes the currency from the PO head', () =>
    expect(buildLineContext(raw, id, 'C1').currency).toBe('EUR'));

  it('never falls back to a literal currency', () => {
    const ctx = buildLineContext({ ...raw, head: { SUNO: 'S1' } }, id, 'C1');
    expect(ctx.currency).toBe('');  // empty, so the caller can refuse
    expect(ctx.currency).not.toBe('USD');
  });

  it('carries the supplier through, which V6 never wrote', () =>
    expect(buildLineContext(raw, id, 'C1').SUNO).toBe('S1'));

  it('keeps both the PO item name and the item description', () => {
    const ctx = buildLineContext(raw, id, 'C1');
    expect(ctx.poItemName).toBe('PO name');
    expect(ctx.itemDescription).toBe('Item master description');
  });
});

describe('lotOrSerialExists', () => {
  it('is true on an exact item and lot match', async () => {
    const { execute } = fakeExecutor({
      'MMS235MI/LstItmLot': { items: [{ ITNO: 'I', BANO: 'B' }] },
    });
    expect(await lotOrSerialExists(execute, 'I', 'B')).toBe(true);
  });

  it('is false on an empty list, without needing an error to mean absent', async () => {
    // The reason LstItmLot is used rather than GetItmLot: absence is a normal
    // empty result, not an HTTP 400 that also means "malformed request".
    const { execute } = fakeExecutor({ 'MMS235MI/LstItmLot': { items: [] } });
    expect(await lotOrSerialExists(execute, 'I', 'B')).toBe(false);
  });

  it('ignores a row for a different item', async () => {
    const { execute } = fakeExecutor({
      'MMS235MI/LstItmLot': { items: [{ ITNO: 'OTHER', BANO: 'B' }] },
    });
    expect(await lotOrSerialExists(execute, 'I', 'B')).toBe(false);
  });
});
