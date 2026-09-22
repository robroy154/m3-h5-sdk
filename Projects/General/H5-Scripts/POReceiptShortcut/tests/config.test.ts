import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CONFIG,
  buildConfig,
  canStoreOversizeSerial,
  parseArgumentString,
} from '../src/config';

describe('parseArgumentString', () => {
  it('reads comma-separated key:value pairs', () =>
    expect(parseArgumentString('wms:true,whgr:WMSGROUP')).toEqual({
      wms: 'true',
      whgr: 'WMSGROUP',
    }));

  it('is order-independent', () =>
    expect(parseArgumentString('b:2,a:1')).toEqual(parseArgumentString('a:1,b:2')));

  it('tolerates surrounding whitespace', () =>
    expect(parseArgumentString(' wms : true , whgr : WH1 ')).toEqual({
      wms: 'true',
      whgr: 'WH1',
    }));

  it('lowercases keys but preserves value case', () => {
    // Warehouse groups and custom field names are case-sensitive in M3.
    expect(parseArgumentString('WHGR:WmsWhse')).toEqual({ whgr: 'WmsWhse' });
  });

  it('returns nothing for empty or missing input', () => {
    expect(parseArgumentString('')).toEqual({});
    expect(parseArgumentString(null as any)).toEqual({});
  });

  it('ignores fragments with no separator rather than guessing', () =>
    expect(parseArgumentString('wms:true,garbage,whgr:WH1')).toEqual({
      wms: 'true',
      whgr: 'WH1',
    }));

  it('keeps colons inside a value', () =>
    expect(parseArgumentString('note:a:b:c')).toEqual({ note: 'a:b:c' }));

  it('allows an explicitly empty value', () =>
    expect(parseArgumentString('whgr:')).toEqual({ whgr: '' }));
});

describe('buildConfig defaults', () => {
  it('runs with no arguments at all', () => {
    const { config, errors } = buildConfig('');
    expect(errors).toHaveLength(0);
    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it('skips the WMS check unless asked — most customers do not run WMS', () => {
    expect(buildConfig('').config.wmsCheckEnabled).toBe(false);
  });

  it('defaults to the partner record M3 ships, so none has to be created', () => {
    const { config } = buildConfig('');
    expect(config.partnerA).toBe('WS');
    expect(config.partnerB).toBe('WS');
    expect(config.messageType).toBe('WMS');
  });

  it('leaves CMS474 unconfigured by default', () => {
    const { config, errors } = buildConfig('');
    expect(config.customFieldGroup).toBe('');
    expect(errors).toHaveLength(0); // legal until an oversize serial appears
  });

  it('leaves every tenant-specific default empty', () => {
    // Stronger than the deny-list of known strings this replaced, which could
    // only catch the handful of values someone remembered to enumerate — and
    // which named a customer inside a customer-agnostic asset. Asserting the
    // fields are empty catches ANY value, including one nobody anticipated.
    expect(DEFAULT_CONFIG.warehouseGroup).toBe('');
    expect(DEFAULT_CONFIG.customFieldGroup).toBe('');
    expect(DEFAULT_CONFIG.customFieldName).toBe('');
    expect(DEFAULT_CONFIG.partnerQualifierA).toBe('');
    expect(DEFAULT_CONFIG.partnerQualifierB).toBe('');
    expect(DEFAULT_CONFIG.wmsCheckEnabled).toBe(false);
  });

  it('has no currency field at all', () => {
    // The V6 regression this guards: CUCD was the literal 'USD'. Currency is
    // resolved from the purchase order head, so configuration must not offer a
    // place to hardcode one.
    expect(Object.keys(DEFAULT_CONFIG)).not.toContain('currency');
    expect(JSON.stringify(DEFAULT_CONFIG)).not.toContain('CUCD');
  });
});

describe('buildConfig overrides', () => {
  it('enables the WMS check when given a group', () => {
    const { config, errors } = buildConfig('wms:true,whgr:WMSGROUP');
    expect(config.wmsCheckEnabled).toBe(true);
    expect(config.warehouseGroup).toBe('WMSGROUP');
    expect(errors).toHaveLength(0);
  });

  it('accepts true, 1 and yes for booleans', () => {
    for (const v of ['true', 'TRUE', '1', 'yes']) {
      expect(buildConfig('wms:' + v + ',whgr:W').config.wmsCheckEnabled).toBe(true);
    }
  });

  it('treats anything else as false rather than erroring', () => {
    for (const v of ['false', '0', 'no', 'maybe', '']) {
      expect(buildConfig('wms:' + v).config.wmsCheckEnabled).toBe(false);
    }
  });

  it('overrides the partner keys together', () => {
    const { config } = buildConfig('e0pa:AB,e0pb:CD,e065:PPS300,e0qa:X,e0qb:Y');
    expect(config.partnerA).toBe('AB');
    expect(config.partnerB).toBe('CD');
    expect(config.messageType).toBe('PPS300');
    expect(config.partnerQualifierA).toBe('X');
    expect(config.partnerQualifierB).toBe('Y');
  });

  it('accepts a custom serial cap', () =>
    expect(buildConfig('maxserials:5').config.maxSerials).toBe(5));
});

describe('buildConfig refusals', () => {
  it('refuses wms:true without a warehouse group', () => {
    const { errors } = buildConfig('wms:true');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('whgr');
    expect(errors[0]).toContain('MMS009');
  });

  it('does not complain about a group supplied without the check', () =>
    expect(buildConfig('whgr:WMSGROUP').errors).toHaveLength(0));

  it('rejects a non-numeric or non-positive serial cap', () => {
    for (const v of ['abc', '0', '-1', '2.5']) {
      const { errors } = buildConfig('maxserials:' + v);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('maxserials');
    }
  });

  it('keeps the default cap when the supplied one is rejected', () =>
    expect(buildConfig('maxserials:abc').config.maxSerials).toBe(25));
});

describe('unknown keys', () => {
  it('reports a typo without refusing to run', () => {
    const { unknownKeys, errors } = buildConfig('wharehouse:X,wms:false');
    expect(unknownKeys).toEqual(['wharehouse']);
    expect(errors).toHaveLength(0);
  });

  it('reports nothing when every key is known', () =>
    expect(buildConfig('wms:true,whgr:W,cfmg:G,cfmf:F,sqnr:2').unknownKeys).toHaveLength(0));
});

describe('canStoreOversizeSerial', () => {
  it('is false until CMS474 is configured', () =>
    expect(canStoreOversizeSerial(buildConfig('').config)).toBe(false));

  it('needs both the group and the field name', () => {
    expect(canStoreOversizeSerial(buildConfig('cfmg:G').config)).toBe(false);
    expect(canStoreOversizeSerial(buildConfig('cfmf:F').config)).toBe(false);
    expect(canStoreOversizeSerial(buildConfig('cfmg:G,cfmf:F').config)).toBe(true);
  });
});
