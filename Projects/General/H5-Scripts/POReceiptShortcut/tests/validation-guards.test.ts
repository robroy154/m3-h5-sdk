/**
 * The validation harness's safety rails.
 *
 * These are the two guarantees that make it acceptable to point a write-
 * capable script at someone's tenant at all, so they are tested rather than
 * documented. The rest of the harness needs a tenant to exercise; these do
 * not, which is exactly why they are the parts worth pinning down in CI.
 */

import { describe, expect, it } from 'vitest';

import {
  ALLOWED_ENVIRONMENTS,
  DENIED_TRANSACTIONS,
  DeniedTransactionError,
  MiClient,
  ProductionGuardError,
  applyCompanyScope,
  assertEnvironmentSafe,
  assertTransactionAllowed,
  buildRequestUrl,
  classifyIonApiConfig,
  normalizeResponse,
} from '../validation/ionapi.mjs';

describe('the PrcWhsTran deny-list', () => {
  it('refuses MHS850MI/PrcWhsTran', () => {
    expect(() => assertTransactionAllowed('MHS850MI', 'PrcWhsTran')).toThrow(DeniedTransactionError);
  });

  it('names PrcWhsTran explicitly, so the list cannot be emptied silently', () => {
    expect(DENIED_TRANSACTIONS).toContain('MHS850MI/PrcWhsTran');
  });

  it('matches case-insensitively, so a differently-cased call cannot slip past', () => {
    expect(() => assertTransactionAllowed('mhs850mi', 'prcwhstran')).toThrow(DeniedTransactionError);
    expect(() => assertTransactionAllowed('MHS850MI', 'PRCWHSTRAN')).toThrow(DeniedTransactionError);
  });

  it('refuses the other MHS850MI transactions that post a movement directly', () => {
    for (const transaction of ['AddPOReceipt', 'AddDOReceipt', 'AddMOReceipt', 'AddCOPick', 'AddPOPutaway']) {
      expect(() => assertTransactionAllowed('MHS850MI', transaction)).toThrow(DeniedTransactionError);
    }
  });

  it('allows the staging trio the write probe depends on', () => {
    for (const transaction of ['AddWhsHead', 'AddWhsPack', 'AddWhsLine', 'LstWhsLine', 'DeleteWhsTran']) {
      expect(() => assertTransactionAllowed('MHS850MI', transaction)).not.toThrow();
    }
  });

  it('allows the transactions the equipment probes need', () => {
    expect(() => assertTransactionAllowed('MMS240MI', 'Add')).not.toThrow();
    expect(() => assertTransactionAllowed('MMS240MI', 'Del')).not.toThrow();
    expect(() => assertTransactionAllowed('CMS474MI', 'DltEqInfo')).not.toThrow();
  });

  it('explains why, so whoever hits it does not simply delete the list', () => {
    expect(() => assertTransactionAllowed('MHS850MI', 'PrcWhsTran')).toThrow(/posts stock/i);
  });
});

describe('the deny-list inside the MI wrapper', () => {
  function client(): any {
    return new MiClient({
      raw: { iu: 'https://mingle-ionapi.example.com', ti: 'TENANT_TST' },
      token: { tokenType: 'Bearer', accessToken: 'x' },
      companyContext: {},
      log: () => {},
      fetchImpl: () => {
        throw new Error('a denied transaction reached the network');
      },
    });
  }

  it('blocks a denied transaction before any request is made', async () => {
    await expect(client().call({
      program: 'MHS850MI',
      transaction: 'PrcWhsTran',
      record: { MSGN: '123', PRFL: '*EXE' },
    })).rejects.toThrow(DeniedTransactionError);
  });

  it('records nothing in the transcript for a call it refused', async () => {
    const mi = client();
    await expect(mi.call({ program: 'MHS850MI', transaction: 'PrcWhsTran', record: {} })).rejects.toThrow();
    expect(mi.transcript).toHaveLength(0);
  });

  it('blocks it in dry-run too, where nothing would have been sent anyway', async () => {
    const mi: any = new MiClient({
      raw: { iu: 'https://x', ti: 'T' }, token: null, dryRun: true, log: () => {},
    });
    await expect(mi.call({ program: 'MHS850MI', transaction: 'PrcWhsTran', record: {} }))
      .rejects.toThrow(DeniedTransactionError);
  });
});

describe('the production guard', () => {
  const sandbox = { ionApiUrl: 'https://mingle-ionapi.inforcloudsuite.com', tenant: 'ACME_TST', environment: 'SANDBOX' };

  it('accepts a declared non-production environment', () => {
    expect(() => assertEnvironmentSafe(sandbox)).not.toThrow();
  });

  it('accepts each of DEV, TST and SANDBOX', () => {
    for (const environment of ALLOWED_ENVIRONMENTS) {
      expect(() => assertEnvironmentSafe({ ...sandbox, environment })).not.toThrow();
    }
  });

  it('refuses an undeclared environment', () => {
    expect(() => assertEnvironmentSafe({ ...sandbox, environment: undefined })).toThrow(ProductionGuardError);
    expect(() => assertEnvironmentSafe({ ...sandbox, environment: '' })).toThrow(ProductionGuardError);
  });

  it('refuses an environment that is not on the list, however plausible', () => {
    expect(() => assertEnvironmentSafe({ ...sandbox, environment: 'PRD' })).toThrow(ProductionGuardError);
    expect(() => assertEnvironmentSafe({ ...sandbox, environment: 'STAGING' })).toThrow(ProductionGuardError);
  });

  it('refuses a PRD url even when the config claims SANDBOX', () => {
    expect(() => assertEnvironmentSafe({
      ...sandbox,
      ionApiUrl: 'https://mingle-ionapi.inforcloudsuite.com/ACME_PRD',
    })).toThrow(ProductionGuardError);
  });

  it('refuses a PRD tenant even when the config claims SANDBOX', () => {
    expect(() => assertEnvironmentSafe({ ...sandbox, tenant: 'ACME_PRD' })).toThrow(ProductionGuardError);
  });

  it('yields to an explicit override, which only exists on the command line', () => {
    expect(() => assertEnvironmentSafe({
      ...sandbox, tenant: 'ACME_PRD', allowProduction: true,
    })).not.toThrow();
  });

  it('does not fire on a tenant that merely contains those letters', () => {
    for (const tenant of ['PRDTEST_TST', 'SPRDEV_TST', 'APRDX_TST']) {
      expect(() => assertEnvironmentSafe({ ...sandbox, tenant })).not.toThrow();
    }
  });

  it('fires on PRD as a bounded token, whatever separates it', () => {
    for (const tenant of ['ACME_PRD', 'ACME-PRD', 'ACME.PRD1'.replace('1', ''), 'PRD_ACME']) {
      expect(() => assertEnvironmentSafe({ ...sandbox, tenant })).toThrow(ProductionGuardError);
    }
  });

  it('reports what it saw, so the message is actionable', () => {
    expect(() => assertEnvironmentSafe({ ...sandbox, tenant: 'ACME_PRD' })).toThrow(/ACME_PRD/);
  });
});

describe('app type detection', () => {
  const backendService = {
    ti: 'ACME_TST', cn: 'Validation', ci: 'id', cs: 'secret',
    iu: 'https://iu', pu: 'https://pu', ot: 'token.oauth2',
    saak: 'key', sask: 'secret',
  };

  it('accepts a Backend Service file', () => {
    expect(classifyIonApiConfig(backendService).appType).toBe('Backend Service');
  });

  it('refuses a file with no service-account keys, naming the app type needed', () => {
    // What a Web Application / Native / Hybrid app's .ionapi actually looks
    // like: every documented RawIonApiConfig field, and no key pair.
    const browserApp = { ...backendService, saak: undefined, sask: undefined };
    expect(() => classifyIonApiConfig(browserApp)).toThrow(/Backend Service/);
    expect(() => classifyIonApiConfig(browserApp)).toThrow(/saak/);
  });

  it('refuses when only one of the pair is present', () => {
    expect(() => classifyIonApiConfig({ ...backendService, sask: '' })).toThrow(/Backend Service/);
  });

  it('names the missing fields when the file is not an .ionapi at all', () => {
    expect(() => classifyIonApiConfig({ ti: 'T' } as any)).toThrow(/ci, cs, iu, pu, ot/);
  });
});

describe('request construction', () => {
  const base = {
    ionApiUrl: 'https://mingle-ionapi.example.com',
    tenant: 'ACME_TST',
    program: 'MMS240MI',
    transaction: 'Add',
  };

  it('puts the tenant and execute path in place', () => {
    expect(buildRequestUrl({ ...base, record: { ITNO: 'A' } }))
      .toContain('https://mingle-ionapi.example.com/ACME_TST/M3/m3api-rest/v2/execute/MMS240MI/Add');
  });

  it('sends record fields as query parameters', () => {
    const url = buildRequestUrl({ ...base, record: { ITNO: 'ITEM-1', SERN: 'S 1' } });
    expect(url).toContain('ITNO=ITEM-1');
    expect(url).toContain('SERN=S+1');
  });

  it('sends maxrecs and returncols as matrix parameters on the transaction segment', () => {
    const url = buildRequestUrl({ ...base, record: {}, outputFields: ['ITNO', 'SERN'], maxReturnedRecords: 1 });
    expect(url).toContain('/MMS240MI/Add;maxrecs=1;returncols=ITNO%2CSERN');
  });

  it('drops empty record values rather than sending blanks M3 did not ask for', () => {
    const url = buildRequestUrl({ ...base, record: { ITNO: 'A', SERN: '', CUNO: undefined as any } });
    expect(url).toContain('ITNO=A');
    expect(url).not.toContain('SERN=');
    expect(url).not.toContain('CUNO=');
  });
});

describe('company scope', () => {
  const context = { company: '100', division: 'ABC' };

  it('adds nothing when the spec declares none', () => {
    expect(applyCompanyScope({ ITNO: 'A' }, 'none', context)).toEqual({ ITNO: 'A' });
  });

  it('adds CONO only for company scope', () => {
    expect(applyCompanyScope({ ITNO: 'A' }, 'company', context)).toEqual({ ITNO: 'A', CONO: '100' });
  });

  it('adds CONO and DIVI for company-division scope', () => {
    expect(applyCompanyScope({ ITNO: 'A' }, 'company-division', context))
      .toEqual({ ITNO: 'A', CONO: '100', DIVI: 'ABC' });
  });

  it('leaves the record alone when no context is configured, as MI resolves it', () => {
    expect(applyCompanyScope({ ITNO: 'A' }, 'company-division', {})).toEqual({ ITNO: 'A' });
  });
});

describe('an HTTP failure is never reported as success', () => {
  function clientReturning(status: number, body: string): any {
    return new MiClient({
      raw: { iu: 'https://x', ti: 'T' },
      token: { tokenType: 'Bearer', accessToken: 'x' },
      log: () => {},
      fetchImpl: async () => ({ ok: status >= 200 && status < 300, status, text: async () => body }),
    });
  }

  // Found against a real tenant: ION API answers an unknown transaction with a
  // bare 400 whose body carries no error quartet. Normalising that to ok:true
  // made probe 10 score a missing transaction as a success — the same defect
  // the CHANGELOG records in the script itself ("HTTP 400 read as record not
  // found"), reproduced in the harness built to catch it.
  it('treats a 400 with an unparseable body as a failure', async () => {
    const response: any = await clientReturning(400, 'Bad Request').call({
      program: 'CMS474MI', transaction: 'DelEqInfo', record: { ITNO: 'X' },
    });
    expect(response.ok).toBe(false);
    expect(response.httpStatus).toBe(400);
    expect(response.errorMessage).toMatch(/400/);
  });

  it('treats a 400 with an empty body as a failure', async () => {
    const response: any = await clientReturning(400, '').call({
      program: 'CMS474MI', transaction: 'DelEqInfo', record: {},
    });
    expect(response.ok).toBe(false);
    expect(response.errorMessage).toMatch(/empty body/);
  });

  it('treats a 500 carrying valid but errorless JSON as a failure', async () => {
    const response: any = await clientReturning(500, '{"results":[{"records":[]}]}').call({
      program: 'MNS150MI', transaction: 'GetUserData', record: {},
    });
    expect(response.ok).toBe(false);
  });

  it('still reports a 200 business error through the quartet, not as transport', async () => {
    const body = JSON.stringify({ results: [{ errorCode: 'MM24031', errorMessage: 'no', errorType: 'ServerReturnedNOK' }] });
    const response: any = await clientReturning(200, body).call({
      program: 'MMS240MI', transaction: 'Add', record: {},
    });
    expect(response.ok).toBe(false);
    expect(response.errorCode).toBe('MM24031');
    expect(response.httpStatus).toBe(200);
  });
});

describe('response normalisation', () => {
  it('reads the documented results[].records[] shape', () => {
    const result = normalizeResponse({ results: [{ records: [{ ITNO: 'A', SERN: 'S' }] }] });
    expect(result.ok).toBe(true);
    expect(result.records).toEqual([{ ITNO: 'A', SERN: 'S' }]);
    expect(result.shape).toBe('results');
  });

  it('surfaces the error quartet without throwing, which the expect-failure probes need', () => {
    const result = normalizeResponse({
      results: [{ errorMessage: 'Serial may not be entered', errorCode: 'MM24031', errorField: 'SERN', errorType: 'ServerReturnedNOK' }],
    });
    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe('MM24031');
    expect(result.errorType).toBe('ServerReturnedNOK');
  });

  it('recognises TransactionNotFound, which is how probe 10 tells the two names apart', () => {
    const result = normalizeResponse({ results: [{ errorMessage: 'no such transaction', errorType: 'TransactionNotFound' }] });
    expect(result.ok).toBe(false);
    expect(result.errorType).toBe('TransactionNotFound');
  });

  it('also reads the older MIRecord/NameValue encoding', () => {
    const result = normalizeResponse({
      MIRecord: [{ NameValue: [{ Name: 'ITNO', Value: 'A' }, { Name: 'SERN', Value: 'S' }] }],
    });
    expect(result.records).toEqual([{ ITNO: 'A', SERN: 'S' }]);
    expect(result.shape).toBe('mirecord');
  });
});
