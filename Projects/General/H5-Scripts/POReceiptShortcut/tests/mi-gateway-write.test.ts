import { describe, it, expect } from 'vitest';
import {
  MiRequestSpec,
  MiResponse,
  RETRY_BASE_MS,
  computeBackoff,
  createEquipment,
  getTransactionStatus,
  getWhsLineFailureDetail,
  postWarehouseHeader,
  postWarehouseLine,
  postWarehousePack,
  processWarehouseTransaction,
  specCustomFieldAdd,
  specCustomFieldDelete,
  specEquipmentAdd,
  specEquipmentDelete,
  specProcessTransaction,
  specTransactionStatus,
  specWarehouseHeader,
  specWarehouseLine,
  specWarehouseLines,
  specWarehousePack,
} from '../src/mi-gateway';

/** Replies from a canned table, keyed program/transaction, recording calls. */
function fakeExecutor(replies: Record<string, MiResponse | (() => Promise<MiResponse>)>) {
  const calls: MiRequestSpec[] = [];
  const execute = (spec: MiRequestSpec): Promise<MiResponse> => {
    calls.push(spec);
    const reply = replies[spec.program + '/' + spec.transaction];
    if (typeof reply === 'function') return reply();
    return Promise.resolve(reply || { item: {} });
  };
  return { execute, calls };
}

const noWait = {
  maxAttempts: 3,
  delay: () => Promise.resolve(),
  random: () => 0,
};

describe('company scope', () => {
  /**
   * The scope is the reviewable form of a rule that only the MI catalog
   * settles. Each expectation below corresponds to one transaction's input
   * list, so a wrong value fails here rather than in a tenant.
   */
  it('matches what each transaction actually accepts', () => {
    expect(specWarehouseHeader({}).scope).toBe('company-division');
    expect(specWarehousePack({}).scope).toBe('company-division');
    expect(specWarehouseLine({}).scope).toBe('company-division');
    // PrcWhsTran and GetWhsHead have a CONO input and no DIVI input.
    expect(specProcessTransaction('M1').scope).toBe('company');
    expect(specTransactionStatus('M1').scope).toBe('company');
    // LstWhsLine takes MSGN, PACN, MSLN, UTCM — no company keys at all.
    expect(specWarehouseLines('M1', 'P1').scope).toBe('none');
    expect(specEquipmentAdd({}).scope).toBe('company');
    expect(specEquipmentDelete('I', 'S').scope).toBe('company');
    // CMS474MI/AddEqInfo accepts neither CONO nor DIVI.
    expect(specCustomFieldAdd({}).scope).toBe('none');
    expect(specCustomFieldDelete('I', 'S', 'G', 'F', '1').scope).toBe('none');
  });
});

describe('custom field transaction names', () => {
  it('deletes with DltEqInfo, the name CMS474MI actually has', () => {
    // V4 and V6 both send DelEqInfo, which does not exist, so their CMS474
    // rollback silently never ran.
    expect(specCustomFieldDelete('I', 'S', 'G', 'F', '1').transaction).toBe('DltEqInfo');
    expect(specCustomFieldAdd({}).transaction).toBe('AddEqInfo');
  });

  it('sends every key DltEqInfo marks mandatory', () => {
    const spec = specCustomFieldDelete('ITEM1', 'SER1', 'GRP', 'FLD', '1');
    expect(spec.record).toEqual({
      ITNO: 'ITEM1', SERN: 'SER1', CFMG: 'GRP', CFMF: 'FLD', SQNR: '1',
    });
  });
});

describe('createEquipment', () => {
  const record = { ITNO: 'ITEM1', SERN: 'SER1', FACI: '001' };

  it('tracks the serial M3 returns, not the one sent', async () => {
    const { execute } = fakeExecutor({
      'MMS240MI/Add': { item: { ITNO: 'ITEM1', SERN: 'M3GENERATED' } },
    });
    const created = await createEquipment(execute, record, 'VENDOR-SERIAL', false);
    expect(created.SERN).toBe('M3GENERATED');
    expect(created.originalSerial).toBe('VENDOR-SERIAL');
    expect(created.customFieldWritten).toBe(false);
  });

  it('strips SERN when M3 owns the numbering', async () => {
    // BACD 1,2,3,6,7 return MM24031 if a serial is supplied.
    const { execute, calls } = fakeExecutor({
      'MMS240MI/Add': { item: { SERN: 'AUTO1' } },
    });
    await createEquipment(execute, record, '', true);
    expect(calls[0].record.SERN).toBeUndefined();
    expect(calls[0].record.ITNO).toBe('ITEM1');
  });

  it('does not mutate the caller record when stripping', async () => {
    const { execute } = fakeExecutor({ 'MMS240MI/Add': { item: { SERN: 'A' } } });
    await createEquipment(execute, record, '', true);
    expect(record.SERN).toBe('SER1');
  });

  it('falls back to the sent serial when Add echoes nothing', async () => {
    const { execute } = fakeExecutor({ 'MMS240MI/Add': { item: {} } });
    const created = await createEquipment(execute, record, 'VS', false);
    expect(created.SERN).toBe('SER1');
  });

  it('refuses a creation it could never roll back', async () => {
    // No serial sent and none returned means nothing keys the Del.
    const { execute } = fakeExecutor({ 'MMS240MI/Add': { item: {} } });
    await expect(createEquipment(execute, record, '', true)).rejects.toThrow(
      /cannot be rolled back/
    );
  });

  it('reports the MI error when Add returns no item', async () => {
    const { execute } = fakeExecutor({
      'MMS240MI/Add': {
        errorCode: 'MM24031',
        errorMessage: 'Serial number must be blank, lot numbering method is 2',
      },
    });
    await expect(createEquipment(execute, record, '', false)).rejects.toThrow(
      /Serial number must be blank/
    );
  });

  it('asks for only the two fields Add returns', () => {
    // EQNO is an input, never an output, so V6's read of it was always null.
    expect(specEquipmentAdd({}).outputFields).toEqual(['ITNO', 'SERN']);
  });
});

describe('warehouse posting', () => {
  it('returns the message number from the header', async () => {
    const { execute } = fakeExecutor({
      'MHS850MI/AddWhsHead': { item: { MSGN: 'MSG001' } },
    });
    expect(await postWarehouseHeader(execute, { WHLO: 'REG' })).toBe('MSG001');
  });

  it('fails the header when no message number comes back', async () => {
    const { execute } = fakeExecutor({
      'MHS850MI/AddWhsHead': { errorMessage: 'Partner not found' },
    });
    await expect(postWarehouseHeader(execute, {})).rejects.toThrow(/Partner not found/);
  });

  it('prefers the package number M3 settled on', async () => {
    const { execute } = fakeExecutor({
      'MHS850MI/AddWhsPack': { item: { PACN: 'M3CHOICE' } },
    });
    expect(await postWarehousePack(execute, { PACN: 'REQUESTED' })).toBe('M3CHOICE');
  });

  it('treats a resolved response carrying an error code as a failure', async () => {
    // MI returns business errors on a resolved promise, not a rejection.
    const { execute } = fakeExecutor({
      'MHS850MI/AddWhsPack': { item: { PACN: 'P1' }, errorCode: 'WW10203' },
    });
    await expect(postWarehousePack(execute, {})).rejects.toThrow();
  });

  it('captures the line number so a failure can name the line', async () => {
    const { execute, calls } = fakeExecutor({
      'MHS850MI/AddWhsLine': { item: { MSLN: '00001' } },
    });
    expect(await postWarehouseLine(execute, { ITNO: 'I' }, 'SER1')).toBe('00001');
    // V6 asked for 100 records back from an Add that returns one.
    expect(calls[0].maxReturnedRecords).toBe(1);
  });

  it('names the failing line in its error', async () => {
    const { execute } = fakeExecutor({
      'MHS850MI/AddWhsLine': { errorMessage: 'Location is invalid' },
    });
    await expect(postWarehouseLine(execute, {}, 'SER9')).rejects.toThrow(
      /Location is invalid/
    );
  });
});

describe('processWarehouseTransaction', () => {
  it('succeeds on a clean response', async () => {
    const { execute, calls } = fakeExecutor({ 'MHS850MI/PrcWhsTran': {} });
    await processWarehouseTransaction(execute, 'MSG1', noWait);
    expect(calls).toHaveLength(1);
    expect(calls[0].record.PRFL).toBe('*EXE');
  });

  it('retries a transient lock and then succeeds', async () => {
    let attempts = 0;
    const waits: number[] = [];
    const execute = (): Promise<MiResponse> => {
      attempts++;
      if (attempts < 3) return Promise.reject({ errorMessage: 'Record locked' });
      return Promise.resolve({});
    };
    await processWarehouseTransaction(execute, 'MSG1', {
      ...noWait,
      delay: (ms) => { waits.push(ms); return Promise.resolve(); },
    });
    expect(attempts).toBe(3);
    expect(waits).toEqual([RETRY_BASE_MS, RETRY_BASE_MS * 2]);
  });

  it('does not retry a business error', async () => {
    // Retrying a non-transient failure risks a double receipt.
    let attempts = 0;
    const execute = (): Promise<MiResponse> => {
      attempts++;
      return Promise.reject({ errorMessage: 'Quantity exceeds order' });
    };
    await expect(
      processWarehouseTransaction(execute, 'MSG1', noWait)
    ).rejects.toEqual({ errorMessage: 'Quantity exceeds order' });
    expect(attempts).toBe(1);
  });

  it('gives up after maxAttempts even while transient', async () => {
    let attempts = 0;
    const execute = (): Promise<MiResponse> => {
      attempts++;
      return Promise.reject({ statusCode: 409 });
    };
    await expect(
      processWarehouseTransaction(execute, 'MSG1', { ...noWait, maxAttempts: 2 })
    ).rejects.toEqual({ statusCode: 409 });
    expect(attempts).toBe(2);
  });

  it('fails on an error carried by a resolved response', async () => {
    // PrcWhsTran declares no outputs, so this is its only failure signal.
    const { execute } = fakeExecutor({
      'MHS850MI/PrcWhsTran': { errorCode: 'WW10101', errorMessage: 'Message not found' },
    });
    await expect(
      processWarehouseTransaction(execute, 'MSG1', noWait)
    ).rejects.toThrow(/Message not found/);
  });

  it('reports each retry to the caller', async () => {
    const seen: number[] = [];
    let attempts = 0;
    const execute = (): Promise<MiResponse> => {
      attempts++;
      return attempts === 1
        ? Promise.reject({ errorMessage: 'Deadlock detected' })
        : Promise.resolve({});
    };
    await processWarehouseTransaction(execute, 'MSG1', {
      ...noWait,
      onRetry: (attempt) => seen.push(attempt),
    });
    expect(seen).toEqual([1]);
  });
});

describe('computeBackoff', () => {
  it('doubles per attempt', () => {
    expect(computeBackoff(1, () => 0)).toBe(300);
    expect(computeBackoff(2, () => 0)).toBe(600);
    expect(computeBackoff(3, () => 0)).toBe(1200);
  });

  it('adds jitter below the base step, so waits never reorder', () => {
    expect(computeBackoff(1, () => 0.99)).toBe(399);
    expect(computeBackoff(1, () => 0.99)).toBeLessThan(computeBackoff(2, () => 0));
  });
});

describe('getTransactionStatus', () => {
  it('returns the status', async () => {
    const { execute } = fakeExecutor({
      'MHS850MI/GetWhsHead': { item: { STAT: '90' } },
    });
    expect(await getTransactionStatus(execute, 'MSG1')).toBe('90');
  });

  it('warns that the receipt may have posted when the status is unreadable', async () => {
    // Silence here would be the worst outcome: the goods may have moved.
    const { execute } = fakeExecutor({ 'MHS850MI/GetWhsHead': {} });
    await expect(getTransactionStatus(execute, 'MSG1')).rejects.toThrow(
      /may have posted/
    );
  });
});

describe('getWhsLineFailureDetail', () => {
  it('leads with MSGD, M3s own message', async () => {
    // V6 asked for REMK, which LstWhsLine does not return, and fell through to
    // BREM — a field the script itself wrote — so a failed receipt echoed the
    // script's own note instead of the error.
    const { execute } = fakeExecutor({
      'MHS850MI/LstWhsLine': {
        items: [
          { STAT: '90', MSLN: '00001', ITNO: 'A' },
          { STAT: '45', MSLN: '00002', ITNO: 'B', BANO: 'SER2',
            MSID: 'WW10305', MSGD: 'Lot number does not exist',
            BREM: 'Orig Loc: A01' },
        ],
      },
    });
    const detail = await getWhsLineFailureDetail(execute, 'MSG1', 'P1');
    expect(detail).toContain('Lot number does not exist');
    expect(detail).toContain('WW10305');
    expect(detail).not.toContain('Orig Loc');
  });

  it('requests MSID and MSGD', () => {
    expect(specWarehouseLines('M', 'P').outputFields).toContain('MSGD');
    expect(specWarehouseLines('M', 'P').outputFields).toContain('MSID');
  });

  it('falls back to the first line when none is flagged', async () => {
    const { execute } = fakeExecutor({
      'MHS850MI/LstWhsLine': { item: { MSGD: 'Something went wrong' } },
    });
    expect(await getWhsLineFailureDetail(execute, 'M', 'P')).toContain(
      'Something went wrong'
    );
  });

  it('stays quiet when the lookup itself fails', async () => {
    // This runs while already reporting a failure; it must not replace it.
    const execute = (): Promise<MiResponse> => Promise.reject(new Error('boom'));
    expect(await getWhsLineFailureDetail(execute, 'M', 'P')).toBe('');
  });

  it('returns empty when there are no lines', async () => {
    const { execute } = fakeExecutor({ 'MHS850MI/LstWhsLine': { items: [] } });
    expect(await getWhsLineFailureDetail(execute, 'M', 'P')).toBe('');
  });
});
