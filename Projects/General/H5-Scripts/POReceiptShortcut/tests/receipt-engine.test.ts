import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG } from '../src/config';
import { MiRequestSpec, MiResponse } from '../src/mi-gateway';
import {
  ReceiptDependencies,
  ReceiptLog,
  ReceiptOutcome,
  ReceiptPlan,
  rollbackEquipment,
  runReceipt,
} from '../src/receipt-engine';

/** Narrows to the outcomes that carry a message, failing loudly otherwise. */
function failureMessage(outcome: ReceiptOutcome): string {
  if (outcome.kind === 'posted') {
    throw new Error('Expected a failure outcome, got a posted receipt');
  }
  return outcome.message;
}

/* ─── Fakes ──────────────────────────────────────────────────────────────── */

type Reply = MiResponse | Error;

/**
 * A fake M3. Replies are keyed program/transaction; an Error value rejects,
 * and an array is consumed one call at a time so a retry can see a different
 * answer from the attempt before it.
 */
function fakeM3(replies: Record<string, Reply | Reply[]>) {
  const calls: MiRequestSpec[] = [];
  const execute = (spec: MiRequestSpec): Promise<MiResponse> => {
    calls.push(spec);
    const key = spec.program + '/' + spec.transaction;
    let reply = replies[key];
    if (Array.isArray(reply)) {
      reply = reply.length > 1 ? reply.shift()! : reply[0];
    }
    if (reply instanceof Error) return Promise.reject(reply);
    return Promise.resolve(reply || { item: {} });
  };
  const of = (program: string, transaction: string): MiRequestSpec[] =>
    calls.filter((c) => c.program === program && c.transaction === transaction);
  return { execute, calls, of };
}

function fakeLog(): ReceiptLog & { lines: string[] } {
  const lines: string[] = [];
  return {
    lines,
    Error: (m) => lines.push('ERROR ' + m),
    Warning: (m) => lines.push('WARN ' + m),
    Info: (m) => lines.push('INFO ' + m),
    Debug: (m) => lines.push('DEBUG ' + m),
  };
}

const HAPPY: Record<string, Reply> = {
  'MMS240MI/Add': { item: { ITNO: 'ITEM1', SERN: 'SER1' } },
  'MHS850MI/AddWhsHead': { item: { MSGN: 'MSG001' } },
  'MHS850MI/AddWhsPack': { item: { PACN: 'PO1_10' } },
  'MHS850MI/AddWhsLine': { item: { MSLN: '00001' } },
  'MHS850MI/PrcWhsTran': {},
  'MHS850MI/GetWhsHead': { item: { STAT: '90' } },
};

function deps(
  execute: ReceiptDependencies['execute'],
  log = fakeLog(),
  config = DEFAULT_CONFIG
): ReceiptDependencies & { log: ReceiptLog & { lines: string[] } } {
  return {
    execute,
    log: log as ReceiptLog & { lines: string[] },
    config,
    retry: { maxAttempts: 3, delay: () => Promise.resolve(), random: () => 0 },
    delay: () => Promise.resolve(),
    reference: 'POReceiptShortcutV7',
  };
}

const poLine = {
  ITNO: 'ITEM1', PUNO: 'PO1', PNLI: '10', PNLS: '0',
  price: '12.50', currency: 'EUR', FACI: '001', purchaseDate: '20260101',
  SUNO: 'SUP1', CUNO: '', poItemName: 'Widget', itemDescription: 'A widget',
  PROD: 'ACME',
};

const lineCtx = {
  WHLO: 'REG', ITNO: 'ITEM1', PUUN: 'EA', PUNO: 'PO1', PNLI: '10',
  PNLS: '0', WHSL: 'A01', OEND: '1', PROD: 'ACME',
};

function plan(overrides: Partial<ReceiptPlan> = {}): ReceiptPlan {
  return {
    lines: [{ RVQA: '1', BANO: 'SER1' }],
    entries: [{ originalSerial: 'SER1', derivedSerial: 'SER1', index: 0 }],
    equipmentPlan: 'add-with-serial',
    poLine,
    line: lineCtx,
    ...overrides,
  };
}

/* ─── The happy path ─────────────────────────────────────────────────────── */

describe('runReceipt, posting cleanly', () => {
  it('reports posted and rolls nothing back', async () => {
    const m3 = fakeM3(HAPPY);
    const result = await runReceipt(deps(m3.execute), plan());
    expect(result.outcome.kind).toBe('posted');
    expect(result.rolledBack).toBe(false);
    expect(m3.of('MMS240MI', 'Del')).toHaveLength(0);
  });

  it('runs the four MHS850 steps in order', async () => {
    const m3 = fakeM3(HAPPY);
    await runReceipt(deps(m3.execute), plan());
    const sequence = m3.calls
      .filter((c) => c.program === 'MHS850MI')
      .map((c) => c.transaction);
    expect(sequence).toEqual([
      'AddWhsHead', 'AddWhsPack', 'AddWhsLine', 'PrcWhsTran', 'GetWhsHead',
    ]);
  });

  it('uses the package number M3 returned on every line', async () => {
    const m3 = fakeM3({ ...HAPPY, 'MHS850MI/AddWhsPack': { item: { PACN: 'M3PACK' } } });
    await runReceipt(deps(m3.execute), plan({
      lines: [{ RVQA: '1', BANO: 'S1' }, { RVQA: '1', BANO: 'S2' }],
    }));
    for (const call of m3.of('MHS850MI', 'AddWhsLine')) {
      expect(call.record.PACN).toBe('M3PACK');
    }
  });

  it('creates one equipment record per serial', async () => {
    const m3 = fakeM3(HAPPY);
    await runReceipt(deps(m3.execute), plan({
      entries: [
        { originalSerial: 'S1', derivedSerial: 'S1', index: 0 },
        { originalSerial: 'S2', derivedSerial: 'S2', index: 1 },
      ],
      lines: [{ RVQA: '1', BANO: 'S1' }, { RVQA: '1', BANO: 'S2' }],
    }));
    expect(m3.of('MMS240MI', 'Add')).toHaveLength(2);
  });

  it('skips MMS240 entirely when the numbering method forbids Add', async () => {
    // BACD 4,5,8,9 return MM24032; the receipt still posts through MHS850.
    const m3 = fakeM3(HAPPY);
    const result = await runReceipt(deps(m3.execute), plan({ equipmentPlan: 'skip' }));
    expect(m3.of('MMS240MI', 'Add')).toHaveLength(0);
    expect(result.outcome.kind).toBe('posted');
  });

  it('omits SERN when M3 owns the numbering', async () => {
    const m3 = fakeM3({ ...HAPPY, 'MMS240MI/Add': { item: { SERN: 'AUTO9' } } });
    await runReceipt(deps(m3.execute), plan({ equipmentPlan: 'add-generated-serial' }));
    expect(m3.of('MMS240MI', 'Add')[0].record.SERN).toBeUndefined();
  });

  it('stamps YREF so the receipt is traceable to the script', async () => {
    const m3 = fakeM3(HAPPY);
    await runReceipt(deps(m3.execute), plan());
    expect(m3.of('MHS850MI', 'AddWhsHead')[0].record.YREF).toBe('POReceiptShortcutV7');
  });
});

/* ─── Failure before processing: rollback is safe ────────────────────────── */

describe('runReceipt, failing before anything processed', () => {
  it('rolls back equipment when a warehouse line is rejected', async () => {
    const m3 = fakeM3({
      ...HAPPY,
      'MHS850MI/AddWhsLine': { errorMessage: 'Location A01 does not exist' },
    });
    const result = await runReceipt(deps(m3.execute), plan());
    expect(result.outcome.kind).toBe('failed');
    expect(result.rolledBack).toBe(true);
    expect(m3.of('MMS240MI', 'Del')).toHaveLength(1);
    expect(m3.of('MMS240MI', 'Del')[0].record).toEqual({ ITNO: 'ITEM1', SERN: 'SER1' });
  });

  it('never reaches PrcWhsTran when the header fails', async () => {
    const m3 = fakeM3({ ...HAPPY, 'MHS850MI/AddWhsHead': { errorMessage: 'No partner' } });
    const result = await runReceipt(deps(m3.execute), plan());
    expect(m3.of('MHS850MI', 'PrcWhsTran')).toHaveLength(0);
    expect(failureMessage(result.outcome)).toContain('No partner');
  });

  it('rolls back the records that succeeded when a later Add fails', async () => {
    const m3 = fakeM3({
      ...HAPPY,
      'MMS240MI/Add': [
        { item: { ITNO: 'ITEM1', SERN: 'S1' } },
        { errorCode: 'MM24031', errorMessage: 'Serial number must be blank' },
      ],
    });
    const result = await runReceipt(deps(m3.execute), plan({
      entries: [
        { originalSerial: 'S1', derivedSerial: 'S1', index: 0 },
        { originalSerial: 'S2', derivedSerial: 'S2', index: 1 },
      ],
    }));
    expect(result.outcome.kind).toBe('failed');
    expect(m3.of('MMS240MI', 'Del')).toHaveLength(1);
    expect(m3.of('MMS240MI', 'Del')[0].record.SERN).toBe('S1');
  });

  it('rolls back on a non-90 status and explains it', async () => {
    const m3 = fakeM3({
      ...HAPPY,
      'MHS850MI/GetWhsHead': { item: { STAT: '45' } },
      'MHS850MI/LstWhsLine': {
        items: [{ STAT: '45', MSGD: 'Lot number does not exist', MSID: 'WW10305' }],
      },
    });
    const result = await runReceipt(deps(m3.execute), plan());
    expect(result.outcome.kind).toBe('failed');
    expect(failureMessage(result.outcome)).toContain('Lot number does not exist');
    expect(failureMessage(result.outcome)).toContain('Status 45');
    expect(result.rolledBack).toBe(true);
  });

  it('skips the line lookup for a status it cannot explain', async () => {
    const m3 = fakeM3({ ...HAPPY, 'MHS850MI/GetWhsHead': { item: { STAT: '15' } } });
    await runReceipt(deps(m3.execute), plan());
    expect(m3.of('MHS850MI', 'LstWhsLine')).toHaveLength(0);
  });
});

/* ─── The distinction that matters ───────────────────────────────────────── */

describe('runReceipt, when the outcome cannot be established', () => {
  it('keeps the equipment rather than guess destructively', async () => {
    // Deleting equipment for a receipt that did post leaves received stock
    // with no serial records — worse than a visible orphan in MMS240.
    const m3 = fakeM3({ ...HAPPY, 'MHS850MI/GetWhsHead': { item: {} } });
    const result = await runReceipt(deps(m3.execute), plan());
    expect(result.outcome.kind).toBe('indeterminate');
    expect(result.rolledBack).toBe(false);
    expect(m3.of('MMS240MI', 'Del')).toHaveLength(0);
    expect(result.createdEquipment).toHaveLength(1);
  });

  it('names the message to check', async () => {
    const m3 = fakeM3({ ...HAPPY, 'MHS850MI/GetWhsHead': { item: {} } });
    const result = await runReceipt(deps(m3.execute), plan());
    expect(failureMessage(result.outcome)).toContain('MSG001');
    expect(failureMessage(result.outcome)).toContain('left in place');
  });

  it('lets the status decide, not the PrcWhsTran error', async () => {
    // A failed-looking PrcWhsTran whose message reached 90 did post.
    const m3 = fakeM3({
      ...HAPPY,
      'MHS850MI/PrcWhsTran': { errorMessage: 'Connection reset' },
      'MHS850MI/GetWhsHead': { item: { STAT: '90' } },
    });
    const result = await runReceipt(deps(m3.execute), plan());
    expect(result.outcome.kind).toBe('posted');
    expect(result.rolledBack).toBe(false);
  });

  it('rolls back when PrcWhsTran failed and the status confirms it', async () => {
    const m3 = fakeM3({
      ...HAPPY,
      'MHS850MI/PrcWhsTran': { errorMessage: 'Message not found' },
      'MHS850MI/GetWhsHead': { item: { STAT: '20' } },
    });
    const result = await runReceipt(deps(m3.execute), plan());
    expect(result.outcome.kind).toBe('failed');
    expect(result.rolledBack).toBe(true);
  });
});

/* ─── Oversize serials ───────────────────────────────────────────────────── */

describe('oversize serials', () => {
  const longSerial = 'X'.repeat(45);
  const oversizePlan = plan({
    entries: [{ originalSerial: longSerial, derivedSerial: 'BSN0101260000001', index: 0 }],
    lines: [{ RVQA: '1', BANO: 'BSN0101260000001' }],
  });

  it('refuses rather than silently truncate when CMS474 is unconfigured', async () => {
    const m3 = fakeM3({
      ...HAPPY,
      'MMS240MI/Add': { item: { ITNO: 'ITEM1', SERN: 'BSN0101260000001' } },
    });
    const result = await runReceipt(deps(m3.execute), oversizePlan);
    expect(result.outcome.kind).toBe('failed');
    expect(failureMessage(result.outcome)).toContain('cfmg:');
    expect(m3.of('MHS850MI', 'AddWhsHead')).toHaveLength(0);
    // The equipment it had already created is removed.
    expect(m3.of('MMS240MI', 'Del')).toHaveLength(1);
  });

  it('stores the original in CMS474 when configured, against M3s serial', async () => {
    const m3 = fakeM3({
      ...HAPPY,
      'MMS240MI/Add': { item: { ITNO: 'ITEM1', SERN: 'BSN0101260000001' } },
    });
    const config = {
      ...DEFAULT_CONFIG, customFieldGroup: 'EQUIP', customFieldName: 'FULLSER',
    };
    const result = await runReceipt(
      deps(m3.execute, fakeLog(), config), oversizePlan
    );
    expect(result.outcome.kind).toBe('posted');
    const add = m3.of('CMS474MI', 'AddEqInfo')[0];
    expect(add.record.CFMA).toBe(longSerial);
    expect(add.record.SERN).toBe('BSN0101260000001');
  });

  it('removes the CMS474 row before the equipment on rollback', async () => {
    // Deleting the equipment first would orphan the custom-field row.
    const m3 = fakeM3({
      ...HAPPY,
      'MMS240MI/Add': { item: { ITNO: 'ITEM1', SERN: 'BSN0101260000001' } },
      'MHS850MI/AddWhsLine': { errorMessage: 'Rejected' },
    });
    const config = {
      ...DEFAULT_CONFIG, customFieldGroup: 'EQUIP', customFieldName: 'FULLSER',
    };
    await runReceipt(deps(m3.execute, fakeLog(), config), oversizePlan);
    const order = m3.calls
      .map((c) => c.program + '/' + c.transaction)
      .filter((t) => t === 'CMS474MI/DltEqInfo' || t === 'MMS240MI/Del');
    expect(order).toEqual(['CMS474MI/DltEqInfo', 'MMS240MI/Del']);
  });

  it('does not touch CMS474 for a serial that fits EEQN', async () => {
    // 21-40 characters ride along in EEQN on the Add itself.
    const m3 = fakeM3(HAPPY);
    const config = {
      ...DEFAULT_CONFIG, customFieldGroup: 'EQUIP', customFieldName: 'FULLSER',
    };
    await runReceipt(deps(m3.execute, fakeLog(), config), plan({
      entries: [{ originalSerial: 'Y'.repeat(35), derivedSerial: 'BSN1', index: 0 }],
    }));
    expect(m3.of('CMS474MI', 'AddEqInfo')).toHaveLength(0);
  });
});

/* ─── Rollback itself ────────────────────────────────────────────────────── */

describe('rollbackEquipment', () => {
  const created = [
    { ITNO: 'I1', SERN: 'S1', originalSerial: 'S1', customFieldWritten: false },
    { ITNO: 'I1', SERN: 'S2', originalSerial: 'S2', customFieldWritten: false },
  ];

  it('does nothing when nothing was created', async () => {
    const m3 = fakeM3({});
    expect(await rollbackEquipment(deps(m3.execute), [])).toEqual([]);
    expect(m3.calls).toHaveLength(0);
  });

  it('keeps deleting after one delete fails', async () => {
    let n = 0;
    const calls: MiRequestSpec[] = [];
    const execute = (spec: MiRequestSpec): Promise<MiResponse> => {
      calls.push(spec);
      n++;
      return n === 1 ? Promise.reject(new Error('locked')) : Promise.resolve({});
    };
    const failures = await rollbackEquipment(deps(execute), created);
    expect(calls).toHaveLength(2);
    expect(failures).toHaveLength(1);
  });

  it('reports what it could not remove', async () => {
    const execute = (): Promise<MiResponse> => Promise.reject(new Error('locked'));
    const log = fakeLog();
    const failures = await rollbackEquipment(deps(execute, log), created);
    expect(failures).toHaveLength(2);
    expect(log.lines.some((l) => l.indexOf('left 2 of 2') !== -1)).toBe(true);
  });

  it('survives a custom-field delete failure and still removes the equipment', async () => {
    const m3 = fakeM3({ 'CMS474MI/DltEqInfo': new Error('gone') });
    const failures = await rollbackEquipment(deps(m3.execute), [
      { ITNO: 'I1', SERN: 'S1', originalSerial: 'S1', customFieldWritten: true },
    ]);
    expect(m3.of('MMS240MI', 'Del')).toHaveLength(1);
    expect(failures).toHaveLength(0);
  });
});
