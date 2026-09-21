/**
 * One function per check.
 *
 * Every probe builds its request with the REAL builders out of `../build/`.
 * None of them re-implements a record shape: a harness that rebuilds the
 * payload it is meant to be testing proves only that it agrees with itself.
 *
 * Probes evaluate the raw normalised response directly and never go through
 * the gateway's error-throwing wrappers. Three of these probes assert that a
 * call FAILS with a specific code; routing them through a wrapper that throws
 * on failure would mean catching an exception in order to report success, and
 * would make a transport fault indistinguishable from the expected refusal.
 */

import { ERROR_TYPES } from './ionapi.mjs';

/** Verdicts a probe can return. */
export const PASS = 'PASS';
export const FAIL = 'FAIL';
export const SKIP = 'SKIP';
export const INCONCLUSIVE = 'INCONCLUSIVE';

/**
 * Errors that mean "the fixture is wrong", not "the claim is wrong".
 *
 * `WIT0101` is the one that bites on MHS850MI/AddWhsLine: the item exists in
 * MITMAS but has no balance record in the warehouse being written to, so M3
 * calls it invalid. That is a statement about the configured warehouse, not
 * about whether the field under test is accepted, and scoring it as a
 * refutation would send someone to rewrite documentation over a missing
 * MITBAL row.
 */
export const FIXTURE_ERRORS = Object.freeze({
  WIT0101: 'the item is not valid in this warehouse (no balance record) — ' +
           'pick an item that exists in the configured WHLO',
  WIT0103: 'the item does not exist at all',
  WWH0103: 'the warehouse does not exist',
});

/**
 * Classifies the outcome of a probe that EXPECTS M3 to refuse.
 *
 * The distinction this draws is the one that decides whether someone goes and
 * rewrites the CHANGELOG. Three outcomes are possible and only one of them is
 * a refutation:
 *
 *   - M3 returned the expected code        -> PASS, the claim holds.
 *   - M3 accepted the call                 -> FAIL, the claim is wrong.
 *   - M3 refused for a different reason    -> INCONCLUSIVE.
 *
 * The third case is the subtle one. If probe 8 expects MM24031 ("serial may
 * not be entered") and gets MM24009 ("item does not exist"), the transaction
 * never reached the numbering-method check at all — the configured fixture
 * item is wrong. That is a broken test, not a disproved claim, and reporting
 * it as FAIL would send someone to "correct" documentation that was right.
 */
/**
 * Errors MMS240MI/Add raises BEFORE it ever reaches the numbering-method check.
 *
 * Taken from the transaction's own source (MMS240MI_MVX.java, `Add()`), which
 * validates in a fixed order: company, item, facility, INDI, item type, status,
 * work centre, customer, supplier, the numeric and date fields, brand,
 * equipment type/group/class, serial return code, registration number, owner,
 * address, the EQNO/EEQN/RFIA uniqueness checks, and finally the purchase-order
 * line — and only THEN tests BACD against the supplied SERN.
 *
 * So any of these codes means the call was rejected before the behaviour under
 * test was reached. That is a broken fixture, not a disproved claim, and the
 * difference decides whether someone goes and rewrites the CHANGELOG.
 *
 * `WIND401` (item is not INDI 2) and `WPN0103` (the PO line does not exist) are
 * overwhelmingly the two that will show up in practice, because both come
 * straight from the configured fixtures.
 */
export const ADD_PRE_BACD_ERRORS = Object.freeze({
  WIT0102: 'item number was blank',
  WIT0103: 'the item does not exist',
  XIT0107: 'the item status is above 80',
  WIFNO02: 'facility was blank — MMS240MI/Add requires FACI',
  WFAC303: 'the facility does not exist, or the service account cannot access it',
  WIND401: 'the item is NOT serial-controlled (INDI is not 2) — wrong fixture item',
  WIT0403: 'the item type does not exist',
  WST0301: 'the status sent is invalid',
  MM24013: 'the status change is not allowed manually for this model',
  WPL0203: 'the work centre does not exist',
  WPL0301: 'the work centre resource type is invalid',
  WCU0203: 'the customer does not exist',
  WSU0103: 'the supplier does not exist',
  WBR1103: 'the brand does not exist',
  WEQ0403: 'the equipment type does not exist',
  WEQ0503: 'the equipment group does not exist',
  WEQCL03: 'the equipment class does not exist',
  WSN1A01: 'the serial number return code is invalid',
  WTA1A04: 'that registration number already exists',
  WCUOW03: 'the equipment owner does not exist',
  WAD1003: 'the address ID does not exist for that customer',
  WOWTP01: 'the owner type is invalid',
  WPUEX01: 'publish-external is invalid',
  WEQ1B04: 'that equipment number already exists',
  WEEQN04: 'that equipment number reference (EEQN) already exists',
  WRFIA04: 'that asset tag already exists',
  SO64004: 'a date sent is in the future',
  WPN0103: 'the PURCHASE ORDER LINE does not exist — check fixtures.puno/pnli/pnls',
  WSE1704: 'that serial already exists on this item',
  WSE1701: 'the serial contains lower-case characters (Add upper-cases and rejects)',
});

/**
 * Classifies the outcome of a probe that EXPECTS M3 to refuse.
 *
 * Three outcomes are possible and only one of them refutes the documentation:
 *
 *   - M3 returned the expected code        -> PASS, the claim holds.
 *   - M3 accepted the call                 -> FAIL, the claim is wrong.
 *   - M3 refused for a different reason    -> INCONCLUSIVE.
 *
 * The third case is the subtle one, and the transaction's source is what makes
 * it nameable rather than a shrug: see ADD_PRE_BACD_ERRORS.
 */
export function classifyExpectedFailure(response, expectedCode) {
  if (response.ok) {
    return {
      status: FAIL,
      detail:
        `M3 ACCEPTED this call. ${expectedCode} was expected. The CHANGELOG ` +
        `claim that M3 refuses it is wrong and must be corrected.`,
    };
  }

  const code = String(response.errorCode || '').toUpperCase();
  if (code === expectedCode.toUpperCase()) {
    return { status: PASS, detail: `M3 refused with ${expectedCode}, as claimed.` };
  }

  const known = ADD_PRE_BACD_ERRORS[code];
  if (known) {
    return {
      status: INCONCLUSIVE,
      detail:
        `M3 refused with ${code} — ${known}. Per MMS240MI's own source that ` +
        `check runs BEFORE the numbering-method test, so the call never reached ` +
        `the behaviour under test. Fix the fixture and re-run; this says nothing ` +
        `about whether ${expectedCode} is correct.`,
    };
  }

  return {
    status: INCONCLUSIVE,
    detail:
      `M3 refused with ${response.errorCode || response.errorType || 'an unnamed error'} ` +
      `("${response.errorMessage || ''}") instead of ${expectedCode}. That code is not ` +
      `one of the documented pre-BACD checks, so it cannot be said whether the ` +
      `transaction reached the numbering-method test. Inspect the raw response.`,
  };
}

/**
 * Records one probe result.
 *
 * `scenarios` is what a probe RELATES to; `proved` is what this particular run
 * actually demonstrated. They are not the same, and conflating them lets the
 * report overstate itself: probe 1 passes whenever GetHead returns a currency,
 * but it only proves the non-USD scenario when the PO was not in USD. A probe
 * that passes while proving nothing reports PASS for itself and leaves its
 * scenarios NOT PROVEN.
 */
function result(id, name, kind, scenarios, status, detail, evidence, proved) {
  return {
    id, name, kind, scenarios, status, detail,
    evidence: evidence || {},
    proved: proved || [],
  };
}

/** True when every named field is a key on the record, blank or not. */
function missingFields(record, fields) {
  return fields.filter((f) => !(f in (record || {})));
}

/* ─── Probe 0: auth and endpoint shape ───────────────────────────────────── */

/**
 * The precondition for every other probe. Also harvests CONO/DIVI/FACI/WHLO
 * from the service account, which later probes use as defaults, and records
 * which response shape this tenant actually serves.
 */
export async function probeUserData(ctx) {
  const response = await ctx.client.call({
    program: 'MNS150MI',
    transaction: 'GetUserData',
    record: {},
    scope: 'none',
    outputFields: ['USID', 'CONO', 'DIVI', 'FACI', 'WHLO', 'NAME'],
    maxReturnedRecords: 1,
  });

  if (ctx.dryRun) return result(0, 'MNS150MI/GetUserData', 'read', [], SKIP, 'dry-run');

  if (!response.ok) {
    return result(0, 'MNS150MI/GetUserData', 'read', [], FAIL,
      `Auth or endpoint shape is wrong: ${response.errorMessage} ` +
      `(HTTP ${response.httpStatus}, errorType ${response.errorType || 'none'})`,
      { response: response.raw });
  }

  const user = response.records[0] || {};
  ctx.userData = user;
  ctx.responseShape = response.shape;

  // The harness expected the documented `results[].records[]` contract. Say so
  // either way — the transport assumption is itself under test here.
  const shapeNote =
    response.shape === 'results'
      ? 'Response used the documented results[].records[] shape.'
      : `Response used the ${response.shape} shape, NOT the documented ` +
        `results[].records[] shape. The harness normalised it, but note this ` +
        `tenant's m3api-rest version differs from the one the docs describe.`;

  return result(0, 'MNS150MI/GetUserData', 'read', [], PASS,
    `Authenticated as ${user.USID || '(unknown)'} in company ${user.CONO || '?'}/` +
    `${user.DIVI || '?'}. ${shapeNote}`,
    { user, shape: response.shape });
}

/* ─── Probe 1: CUCD (the hardcoded-'USD' fix) ────────────────────────────── */

export async function probePoHead(ctx) {
  const { specPoHead } = ctx.gateway;
  const puno = ctx.config.fixtures.puno;
  if (!puno) return result(1, 'PPS200MI/GetHead', 'read', [1], SKIP, 'No fixtures.puno configured.');

  const response = await ctx.client.call(specPoHead(puno));
  if (ctx.dryRun) return result(1, 'PPS200MI/GetHead', 'read', [1], SKIP, 'dry-run');

  if (!response.ok) {
    return result(1, 'PPS200MI/GetHead', 'read', [1], FAIL,
      `GetHead failed for PUNO ${puno}: ${response.errorMessage}`, { response: response.raw });
  }

  const head = response.records[0] || {};
  ctx.poHead = head;

  if (!head.CUCD) {
    return result(1, 'PPS200MI/GetHead', 'read', [1], FAIL,
      `CUCD came back empty. The correction replacing the hardcoded 'USD' ` +
      `depends on this field carrying the order currency.`, { head });
  }

  const missing = missingFields(head, ctx.gateway.PO_HEAD_FIELDS);
  return result(1, 'PPS200MI/GetHead', 'read', [1],
    missing.length ? INCONCLUSIVE : PASS,
    `CUCD = ${head.CUCD}${head.CUCD === 'USD' ? ' (USD — to prove the fix, re-run against a non-USD PO)' : ''}.` +
    (missing.length ? ` Fields not returned: ${missing.join(', ')}.` : ''),
    { head, missing },
    // The fix replaces a hardcoded 'USD'. A USD order cannot show it working.
    head.CUCD && head.CUCD !== 'USD' ? [1] : []);
}

/* ─── Probe 2: all 12 BASIC_DATA_FIELDS ──────────────────────────────────── */

export async function probeBasicData(ctx) {
  const { specBasicData, BASIC_DATA_FIELDS } = ctx.gateway;
  const { puno, pnli, pnls } = ctx.config.fixtures;
  if (!puno || !pnli) {
    return result(2, 'PPS001MI/GetBasicData2', 'read', [], SKIP, 'No fixtures.puno/pnli configured.');
  }

  const response = await ctx.client.call(specBasicData(puno, pnli, pnls || '0'));
  if (ctx.dryRun) return result(2, 'PPS001MI/GetBasicData2', 'read', [], SKIP, 'dry-run');

  if (!response.ok) {
    return result(2, 'PPS001MI/GetBasicData2', 'read', [], FAIL,
      `GetBasicData2 failed: ${response.errorMessage}`, { response: response.raw });
  }

  const basic = response.records[0] || {};
  ctx.basicData = basic;
  const missing = missingFields(basic, BASIC_DATA_FIELDS);

  return result(2, 'PPS001MI/GetBasicData2', 'read', [],
    missing.length ? FAIL : PASS,
    missing.length
      ? `${missing.length} of ${BASIC_DATA_FIELDS.length} requested fields were ` +
        `not returned: ${missing.join(', ')}. The claim that this one call ` +
        `already carries every numbering and location field is overstated.`
      : `All ${BASIC_DATA_FIELDS.length} fields returned. INDI=${basic.INDI} ` +
        `BACD=${basic.BACD} GRMT=${basic.GRMT} WHSL=${basic.WHSL || '(blank)'}`,
    { basic, missing });
}

/* ─── Probe 3: GetLine — RORC/RORN/PITD/PROD present, ECVE absent ────────── */

export async function probePoLine(ctx) {
  const { specPoLine } = ctx.gateway;
  const { puno, pnli, pnls } = ctx.config.fixtures;
  if (!puno || !pnli) return result(3, 'PPS200MI/GetLine', 'read', [], SKIP, 'No fixtures.puno/pnli configured.');

  const spec = specPoLine(puno, pnli, pnls || '0');
  const response = await ctx.client.call(spec);

  // Second call, asking for ECVE on top of the real field list. The claim is
  // that ECVE has no home here; the way to establish that is to ask for it and
  // see what M3 does, not to omit it and call the silence agreement.
  const ecveResponse = await ctx.client.call({
    ...spec,
    outputFields: [...spec.outputFields, 'ECVE'],
  });

  if (ctx.dryRun) return result(3, 'PPS200MI/GetLine', 'read', [2, 9], SKIP, 'dry-run');

  if (!response.ok) {
    return result(3, 'PPS200MI/GetLine', 'read', [], FAIL,
      `GetLine failed: ${response.errorMessage}`, { response: response.raw });
  }

  const line = response.records[0] || {};
  ctx.poLine = line;

  const required = ['RORC', 'RORN', 'PITD', 'PROD'];
  const missing = missingFields(line, required);

  const ecveRecord = ecveResponse.ok ? ecveResponse.records[0] || {} : {};
  const ecvePresent = 'ECVE' in ecveRecord && ecveRecord.ECVE !== '';
  const ecveNote = ecveResponse.ok
    ? ecvePresent
      ? `ECVE WAS returned (${ecveRecord.ECVE}) when asked for — it exists on ` +
        `GetLine after all, though it still has no home on either write transaction.`
      : 'ECVE not returned even when explicitly requested, as claimed.'
    : `Asking for ECVE made the call fail: ${ecveResponse.errorMessage}.`;

  const gety = line.GETY || '';
  const materialNote = gety
    ? `GETY=${gety} (${gety === '1' ? 'material' : 'NON-material'} line).`
    : 'GETY not returned, so whether this is a material line cannot be established.';

  return result(3, 'PPS200MI/GetLine', 'read', [2, 9],
    missing.length ? FAIL : PASS,
    missing.length
      ? `Not returned: ${missing.join(', ')}.  ${ecveNote}`
      : `RORC=${line.RORC || '(blank)'} RORN=${line.RORN || '(blank)'} ` +
        `PITD="${line.PITD || ''}" (${(line.PITD || '').length} chars) ` +
        `PROD=${line.PROD || '(blank)'}. ${materialNote}  ${ecveNote}`,
    { line, missing, ecvePresent, ecveRecord, gety },
    missing.length ? [] : [...(line.RORC === '3' ? [2] : []), ...(gety && gety !== '1' ? [9] : [])]);
}

/* ─── Probe 4: CUNO on a CO-linked PO ────────────────────────────────────── */

export async function probeCustomerOrder(ctx) {
  const { specCustomerOrder } = ctx.gateway;
  const line = ctx.poLine || {};
  const orno = ctx.config.fixtures.coLinkedOrno || (line.RORC === '3' ? line.RORN : '');

  if (!orno) {
    return result(4, 'OIS100MI/GetOrderHead', 'read', [2], SKIP,
      `No customer-order link available. The configured PO line has RORC=` +
      `${line.RORC || '(none)'}, and no fixtures.coLinkedOrno was set. ` +
      `Scenario 2 (RORC 3 -> CUNO) is NOT covered by this run.`);
  }

  const response = await ctx.client.call(specCustomerOrder(orno));
  if (ctx.dryRun) return result(4, 'OIS100MI/GetOrderHead', 'read', [2], SKIP, 'dry-run');

  if (!response.ok) {
    return result(4, 'OIS100MI/GetOrderHead', 'read', [2], FAIL,
      `GetOrderHead failed for ORNO ${orno}: ${response.errorMessage}`, { response: response.raw });
  }

  const head = response.records[0] || {};
  return result(4, 'OIS100MI/GetOrderHead', 'read', [2],
    head.CUNO ? PASS : FAIL,
    head.CUNO ? `CUNO = ${head.CUNO} for customer order ${orno}.`
              : `CUNO came back empty for ORNO ${orno}.`,
    { head, orno },
    head.CUNO ? [2] : []);
}

/* ─── Probe 5: PPS345MI/Get — CRBN/DSTO ──────────────────────────────────── */

export async function probeReceivingMethod(ctx) {
  const { specReceivingMethod } = ctx.gateway;
  const grmt = ctx.config.fixtures.grmt || (ctx.basicData || {}).GRMT;
  if (!grmt) {
    return result(5, 'PPS345MI/Get', 'read', [10], SKIP,
      'No GRMT available — probe 2 did not return one and none was configured.');
  }

  const response = await ctx.client.call(specReceivingMethod(grmt));
  if (ctx.dryRun) return result(5, 'PPS345MI/Get', 'read', [10], SKIP, 'dry-run');

  if (!response.ok) {
    return result(5, 'PPS345MI/Get', 'read', [10], FAIL,
      `PPS345MI/Get failed for GRMT ${grmt}: ${response.errorMessage}`, { response: response.raw });
  }

  const method = response.records[0] || {};
  const missing = missingFields(method, ['CRBN', 'DSTO']);
  ctx.receivingMethod = method;

  return result(5, 'PPS345MI/Get', 'read', [10],
    missing.length ? FAIL : PASS,
    missing.length
      ? `Not returned: ${missing.join(', ')}. CRBN is the one input to M3's ` +
        `ManualLotNo() that GetBasicData2 does not carry.`
      : `GRMT ${grmt}: CRBN=${method.CRBN || '(blank)'} DSTO=${method.DSTO || '(blank)'} ` +
        `(DSTO 1 = direct put-away, which is what makes a blank WHSL normal).`,
    { method, missing }, missing.length ? [] : [10]);
}

/* ─── Probe 6: MMS009MI/Get — WMS warehouse group ────────────────────────── */

export async function probeWarehouseGroup(ctx) {
  const { specWarehouseGroup } = ctx.gateway;
  const whgr = ctx.config.fixtures.wmsWarehouseGroup;
  const whlo = ctx.config.fixtures.whlo || (ctx.userData || {}).WHLO;

  if (!whgr) {
    return result(6, 'MMS009MI/Get', 'read', [11], SKIP,
      'No fixtures.wmsWarehouseGroup configured. The WMS check is off by ' +
      'default in the script too, so scenario 11 is NOT covered by this run.');
  }
  if (!whlo) return result(6, 'MMS009MI/Get', 'read', [11], SKIP, 'No warehouse available.');

  const response = await ctx.client.call(specWarehouseGroup(whgr, whlo));
  if (ctx.dryRun) return result(6, 'MMS009MI/Get', 'read', [11], SKIP, 'dry-run');

  // A miss is a legitimate answer here: it means this warehouse is not in the
  // WMS group, which is exactly what the script's check is asking.
  const found = response.ok && response.records.length > 0;
  return result(6, 'MMS009MI/Get', 'read', [11], PASS,
    found
      ? `Warehouse ${whlo} IS in WMS group ${whgr} — the script would treat it as WMS-managed.`
      : `Warehouse ${whlo} is NOT in WMS group ${whgr} (${response.errorCode || 'no records'}). ` +
        `The transaction answered cleanly, which is what the check needs.`,
    { whgr, whlo, found, response: response.raw });
}

/* ─── Probe 7: MMS240MI/Add on BACD 0, then Del ──────────────────────────── */

/** Builds the PoLineContext the real equipment builder takes. */
function lineContextFor(ctx, itno) {
  const head = ctx.poHead || {};
  const line = ctx.poLine || {};
  const basic = ctx.basicData || {};
  const f = ctx.config.fixtures;

  return {
    ITNO: itno,
    PUNO: f.puno || '',
    PNLI: f.pnli || '',
    PNLS: f.pnls || '0',
    price: line.PUPR || '0',
    currency: head.CUCD || '',
    FACI: line.FACI || f.faci || (ctx.userData || {}).FACI || '',
    purchaseDate: line.RGDT || head.PUDT || '',
    SUNO: head.SUNO || '',
    CUNO: '',
    poItemName: line.PITD || '',
    itemDescription: basic.ITDS || '',
    PROD: line.PROD || '',
  };
}

function serialEntry(value) {
  return { originalSerial: value, derivedSerial: value, index: 0 };
}

export async function probeEquipmentAddManual(ctx) {
  const { buildEquipmentRecord } = ctx.requests;
  const { specEquipmentAdd, specEquipmentDelete } = ctx.gateway;
  const itno = ctx.config.fixtures.serialManualItem;

  if (!itno) {
    return result(7, 'MMS240MI/Add (BACD 0) + GetBasic + Del', 'write', [3, 12], SKIP,
      'No fixtures.serialManualItem (INDI 2, BACD 0) configured. Run --survey ' +
      'to find one. Scenarios 3 and 12 are NOT covered by this run.');
  }

  const sern = ctx.serialFor('M');
  const entry = serialEntry(sern);
  const record = buildEquipmentRecord(entry, lineContextFor(ctx, itno));
  const response = await ctx.client.call(specEquipmentAdd(record));

  if (ctx.dryRun) return result(7, 'MMS240MI/Add (BACD 0) + GetBasic + Del', 'write', [3, 12], SKIP, 'dry-run');

  if (!response.ok) {
    return result(7, 'MMS240MI/Add (BACD 0) + GetBasic + Del', 'write', [3, 12], FAIL,
      `Add was refused on a BACD 0 item, where a supplied serial is supposed ` +
      `to be accepted: ${response.errorCode} ${response.errorMessage} ` +
      `(field ${response.errorField || 'n/a'})`,
      { record, response: response.raw });
  }

  const created = response.records[0] || {};
  const createdSern = created.SERN || sern;

  // Registered before the Del below, so that a crash between the two still
  // leaves a cleanup entry to run.
  ctx.registerCleanup(
    `MMS240MI/Del equipment ${itno} / ${createdSern}`,
    async () => ctx.client.call(specEquipmentDelete(itno, createdSern))
  );

  // Read the record back. Acceptance is not storage: every defect in the
  // CHANGELOG's correction table is a field M3 took without complaint and then
  // truncated, ignored, or replaced. GetBasic returns 11 of the 15 fields the
  // equipment builder writes, so most of that table can be checked directly
  // rather than inferred from a clean Add. (SUNO and FACI are written but not
  // returned by GetBasic, so they stay unverifiable here.)
  const readBack = await ctx.client.call({
    program: 'MMS240MI',
    transaction: 'GetBasic',
    record: { ITNO: itno, SERN: createdSern },
    scope: 'company',
    outputFields: ['ITNO', 'SERN', 'CUCD', 'ALII', 'SKEY', 'EEQN', 'OWTP',
                   'CUOW', 'CUNO', 'PUNO', 'PNLI', 'PNLS', 'STAT', 'PUPR'],
    maxReturnedRecords: 1,
  });

  const stored = readBack.ok ? readBack.records[0] || {} : {};
  const mismatches = [];
  const verified = [];

  if (readBack.ok) {
    // PNLI/PNLS come back numerically normalised ("010" for "10"), so those two
    // compare loosely. Everything else is compared exactly.
    const numeric = new Set(['PNLI', 'PNLS', 'PUPR']);
    for (const field of Object.keys(record)) {
      if (!(field in stored)) continue;
      const sent = String(record[field]);
      const got = String(stored[field] ?? '');
      const same = numeric.has(field)
        ? Number(sent) === Number(got)
        : sent === got;
      if (same) {
        verified.push(field);
      } else {
        mismatches.push(`${field}: sent "${sent}" (${sent.length}), stored "${got}" (${got.length})`);
      }
    }
  }

  // The Del is also the rollback path under test, so it runs as part of the
  // probe rather than only as cleanup, and its result is asserted.
  const delResponse = await ctx.client.call(specEquipmentDelete(itno, createdSern));
  const deleted = delResponse.ok;
  if (deleted) ctx.markCleanupDone(`MMS240MI/Del equipment ${itno} / ${createdSern}`);

  // EQNO is an input on Add, never an output. The CHANGELOG says V6 read it
  // back after every Add and always got null.
  const eqnoReturned = 'EQNO' in created;

  const status = !deleted || mismatches.length ? FAIL : PASS;

  return result(7, 'MMS240MI/Add (BACD 0) + GetBasic + Del', 'write', [3, 12], status,
    `Add accepted SERN "${sern}" on BACD 0 item ${itno}; M3 returned ` +
    `SERN=${created.SERN || '(none)'} BIRT=${created.BIRT || '(none)'}. ` +
    `EQNO ${eqnoReturned ? 'WAS' : 'was not'} returned (the CHANGELOG says it never is). ` +
    (readBack.ok
      ? mismatches.length
        ? `READ-BACK MISMATCH — M3 accepted these fields and then stored something ` +
          `else: ${mismatches.join('; ')}. That is the silent-truncation failure mode ` +
          `the corrections exist to prevent.`
        : `Read-back verified ${verified.length} field(s) stored exactly as sent: ` +
          `${verified.join(', ')}.`
      : `Read-back FAILED (${readBack.errorCode} ${readBack.errorMessage}), so what M3 ` +
        `actually stored could not be checked.`) +
    ' ' +
    (deleted
      ? `Del then removed it, so the rollback path works.`
      : `Del FAILED (${delResponse.errorCode} ${delResponse.errorMessage}) — the ` +
        `equipment record is still in the tenant and the rollback path does not work.`),
    { record, created, stored, verified, mismatches, eqnoReturned,
      delResponse: delResponse.raw },
    status === PASS ? [3, 12] : []);
}

/* ─── Probe 8: MMS240MI/Add with SERN on an auto-numbering item ──────────── */

export async function probeEquipmentAddAutoRejectsSerial(ctx) {
  const { buildEquipmentRecord } = ctx.requests;
  const { specEquipmentAdd, specEquipmentDelete } = ctx.gateway;
  const itno = ctx.config.fixtures.serialAutoItem;

  if (!itno) {
    return result(8, 'MMS240MI/Add auto BACD + SERN', 'probe', [4], SKIP,
      'No fixtures.serialAutoItem (INDI 2, BACD 1/2/3/6/7) configured. Run ' +
      '--survey. Scenario 4 is NOT covered, and neither is the MM24031 claim.');
  }

  const sern = ctx.serialFor('A');
  const record = buildEquipmentRecord(serialEntry(sern), lineContextFor(ctx, itno));
  const response = await ctx.client.call(specEquipmentAdd(record));

  if (ctx.dryRun) return result(8, 'MMS240MI/Add auto BACD + SERN', 'probe', [4], SKIP, 'dry-run');

  const verdict = classifyExpectedFailure(response, 'MM24031');

  // If M3 accepted it after all, something was created that must come back out.
  if (response.ok) {
    const created = response.records[0] || {};
    const createdSern = created.SERN || sern;
    ctx.registerCleanup(
      `MMS240MI/Del unexpectedly-created equipment ${itno} / ${createdSern}`,
      async () => ctx.client.call(specEquipmentDelete(itno, createdSern))
    );
  }

  return result(8, 'MMS240MI/Add auto BACD + SERN', 'probe', [4], verdict.status,
    `Item ${itno} (auto numbering), SERN "${sern}" supplied. ${verdict.detail}`,
    { record, response: response.raw, expected: 'MM24031' },
    verdict.status === PASS ? [4] : []);
}

/* ─── Probe 9: MMS240MI/Add on a BACD the transaction refuses outright ───── */

export async function probeEquipmentAddForbidden(ctx) {
  const { buildEquipmentRecord } = ctx.requests;
  const { specEquipmentAdd, specEquipmentDelete } = ctx.gateway;
  const itno = ctx.config.fixtures.serialForbiddenItem;

  if (!itno) {
    return result(9, 'MMS240MI/Add forbidden BACD', 'probe', [5], SKIP,
      'No fixtures.serialForbiddenItem (INDI 2, BACD 4/5/8/9) configured. Run ' +
      '--survey. Scenario 5 is NOT covered, and neither is the MM24032 claim.');
  }

  const sern = ctx.serialFor('F');
  const record = buildEquipmentRecord(serialEntry(sern), lineContextFor(ctx, itno));
  const response = await ctx.client.call(specEquipmentAdd(record));

  if (ctx.dryRun) return result(9, 'MMS240MI/Add forbidden BACD', 'probe', [5], SKIP, 'dry-run');

  const verdict = classifyExpectedFailure(response, 'MM24032');

  if (response.ok) {
    const created = response.records[0] || {};
    const createdSern = created.SERN || sern;
    ctx.registerCleanup(
      `MMS240MI/Del unexpectedly-created equipment ${itno} / ${createdSern}`,
      async () => ctx.client.call(specEquipmentDelete(itno, createdSern))
    );
  }

  return result(9, 'MMS240MI/Add forbidden BACD', 'probe', [5], verdict.status,
    `Item ${itno} (BACD 4/5/8/9). ${verdict.detail}`,
    { record, response: response.raw, expected: 'MM24032' },
    verdict.status === PASS ? [5] : []);
}

/* ─── Probe 10: DltEqInfo exists, DelEqInfo does not ─────────────────────── */

/**
 * The paired control is the whole point.
 *
 * Calling `DltEqInfo` with a key that matches nothing proves only that the
 * call was understood. What proves the CHANGELOG claim is calling it alongside
 * `DelEqInfo` — the name V4 and V6 both send — and showing that one reaches the
 * transaction while the other does not exist. Without the control, a tenant
 * that answered every unknown transaction the same way would look like a pass.
 */
export async function probeCustomFieldDeleteName(ctx) {
  const { specCustomFieldDelete } = ctx.gateway;
  const f = ctx.config.fixtures;
  const group = f.cms474Group || 'ZZZZ';
  const field = f.cms474Field || 'ZZZZ';

  const bogusItno = 'ZZ-NO-SUCH-ITEM';
  const bogusSern = 'ZZ-NO-SUCH-SERIAL';

  const real = specCustomFieldDelete(bogusItno, bogusSern, group, field, '1');
  const realResponse = await ctx.client.call(real);

  // The control: identical record, the name the live script sends.
  const controlResponse = await ctx.client.call({ ...real, transaction: 'DelEqInfo' });

  if (ctx.dryRun) return result(10, 'CMS474MI/DltEqInfo vs DelEqInfo', 'probe', [6], SKIP, 'dry-run');

  /**
   * "Does this transaction exist?" is answered at two different layers.
   *
   * The documented signal is `errorType: TransactionNotFound` in the response
   * body. This tenant does not use it: ION API rejects an unknown transaction
   * with a bare HTTP 400 and no parseable body, while a transaction that does
   * exist answers HTTP 200 and reports its business error in the quartet. Both
   * signals are therefore accepted, and which one fired is reported.
   */
  const missing = (r) =>
    r.errorType === ERROR_TYPES.TRANSACTION_NOT_FOUND ||
    r.httpStatus === 400 || r.httpStatus === 404;

  // Reaching the transaction means it ran far enough to raise a *business*
  // error — here, that the bogus item does not exist.
  const reached = (r) =>
    !missing(r) && (r.httpStatus === 200 || Boolean(r.errorCode));

  const realReached = reached(realResponse);
  const controlMissing = missing(controlResponse);

  const how = realResponse.errorType === ERROR_TYPES.TRANSACTION_NOT_FOUND || controlMissing
    ? (controlResponse.errorType === ERROR_TYPES.TRANSACTION_NOT_FOUND
        ? `errorType ${ERROR_TYPES.TRANSACTION_NOT_FOUND}`
        : `HTTP ${controlResponse.httpStatus}`)
    : 'no rejection at all';

  let status;
  let detail;

  if (!realReached) {
    status = FAIL;
    detail =
      `DltEqInfo did not reach the transaction (HTTP ${realResponse.httpStatus}, ` +
      `errorType ${realResponse.errorType || 'none'}). This tenant does not have ` +
      `it either, so the CHANGELOG's correction is wrong and the real name is ` +
      `something else again.`;
  } else if (!controlMissing) {
    status = INCONCLUSIVE;
    detail =
      `DltEqInfo reached the transaction (HTTP ${realResponse.httpStatus}, ` +
      `${realResponse.errorCode} "${realResponse.errorMessage}"), but DelEqInfo ` +
      `was NOT rejected either (HTTP ${controlResponse.httpStatus}, errorType ` +
      `${controlResponse.errorType || 'none'}). Without the control the ` +
      `comparison proves nothing — check the raw responses by hand.`;
  } else {
    status = PASS;
    detail =
      `DltEqInfo EXISTS: it executed and returned the business error ` +
      `${realResponse.errorCode} "${realResponse.errorMessage}" (HTTP ` +
      `${realResponse.httpStatus}), which means it got as far as validating the ` +
      `key. DelEqInfo — the name V4 and V6 both send — was rejected outright ` +
      `(${how}). The CMS474 half of the rollback has never run in the live script. ` +
      `Note this tenant signals an unknown transaction with HTTP ` +
      `${controlResponse.httpStatus}, not an errorType of ` +
      `${ERROR_TYPES.TRANSACTION_NOT_FOUND}.`;
  }

  return result(10, 'CMS474MI/DltEqInfo vs DelEqInfo', 'probe', [6], status, detail, {
    dltEqInfo: {
      errorType: realResponse.errorType, errorCode: realResponse.errorCode,
      errorMessage: realResponse.errorMessage, httpStatus: realResponse.httpStatus,
    },
    delEqInfo: {
      errorType: controlResponse.errorType, errorCode: controlResponse.errorCode,
      errorMessage: controlResponse.errorMessage, httpStatus: controlResponse.httpStatus,
    },
  }, status === PASS ? [6] : []);
}

/* ─── Probe 11: the staged write path, stopping before PrcWhsTran ────────── */

/**
 * The highest-value probe: it exercises every field the receipt writes and
 * moves no stock.
 *
 * AddWhsHead/Pack/Line only stage a warehouse message. Nothing is posted until
 * PrcWhsTran runs, and PrcWhsTran is on the deny-list inside the MI wrapper, so
 * this probe cannot complete the receipt even if it tried. The message is left
 * unprocessed in MHS850 and deleted in cleanup.
 */
export async function probeWarehouseWritePath(ctx) {
  const { buildWarehouseHeaderRecord, buildWarehousePackRecord, buildWarehouseLineRecord } = ctx.requests;
  const { specWarehouseHeader, specWarehousePack, specWarehouseLine } = ctx.gateway;
  const f = ctx.config.fixtures;
  const scenarios = [7, 8, 10];

  const whlo = f.whlo || (ctx.userData || {}).WHLO;
  const plainItem = f.uncontrolledItem || f.serialManualItem;

  if (!whlo || !plainItem) {
    return result(11, 'MHS850MI AddWhsHead/Pack/Line', 'dry', scenarios, SKIP,
      'Needs fixtures.whlo and an item (fixtures.uncontrolledItem). Run --survey.');
  }

  const puun = f.puun || (ctx.basicData || {}).PUUN || 'EA';
  const location = f.whsl || (ctx.basicData || {}).WHSL || '';

  /**
   * Each variant exists to make one claim reachable, and they cannot be
   * collapsed into a single line.
   *
   * `buildWarehouseLineRecord` only emits REMK when a line has BOTH a BANO and
   * a WHSL — the field carries `Orig Loc: {WHSL}`, so with no location there is
   * nothing to remark on. One line therefore proves that a blank WHSL is
   * accepted OR that REMK is accepted, never both. Staging several lines under
   * one message costs one call each and still posts nothing.
   */
  /**
   * Every line is written against the PURCHASE ORDER LINE's own item.
   *
   * Established against a tenant, and it corrects an assumption this probe
   * started with. `AddWhsLine` rejects a line whose `RIDN` is absent with
   * `WRI0102 Order number must be entered` — the order reference is mandatory
   * in practice, though the MI catalog does not mark it so. And once a PO
   * reference IS supplied, M3 checks the item against that PO line and answers
   * `WIT0101 Item number X is invalid` when they disagree.
   *
   * So the item on a receipt line is not a free choice: it is whatever the PO
   * ordered. Picking an item independently of the PO — which is what the survey
   * buckets encourage — cannot produce a line M3 will take.
   */
  // Resolving the PO line's item is fixture setup, not a claim under test, so
  // it gets its own call rather than being folded into BASIC_DATA_FIELDS —
  // that list is asserted verbatim by probe 2 and must not grow to suit this.
  let lineItem = f.poLineItem || '';
  if (!lineItem && f.puno && f.pnli) {
    const lookup = await ctx.client.call({
      program: 'PPS001MI',
      transaction: 'GetBasicData2',
      record: { PUNO: f.puno, PNLI: f.pnli, PNLS: f.pnls || '0' },
      scope: 'company',
      outputFields: ['ITNO'],
      maxReturnedRecords: 1,
    });
    if (lookup.ok) lineItem = (lookup.records[0] || {}).ITNO || '';
  }
  const indi = String((ctx.basicData || {}).INDI || '');
  const lotControlled = ['1', '2', '3', '5'].includes(indi);

  if (!lineItem) {
    return result(11, 'MHS850MI AddWhsHead/Pack/Line', 'dry', scenarios, SKIP,
      'The PO line item could not be resolved (probe 2 returned no ITNO), and ' +
      'AddWhsLine will only accept a line whose item matches its PO line.');
  }

  const variants = [
    {
      key: 'blank-location',
      itno: lineItem,
      whsl: '',
      input: { RVQA: String(f.quantity || '1') },
      proves: 'a blank WHSL is accepted (direct put-away, scenario 10)',
      enabled: true,
      skipNote: '',
    },
    {
      key: 'remark-and-fresh-lot',
      itno: lineItem,
      whsl: location,
      input: { RVQA: String(f.quantity || '1'), BANO: ctx.serialFor('L') },
      proves: `REMK (30 chars, replacing the 20-char BREM) is accepted, with a ` +
              `lot/serial that does not pre-exist on an INDI ${indi} item` +
              (indi === '1' ? ' (scenario 8)' : ''),
      enabled: lotControlled && Boolean(location),
      skipNote: !lotControlled
        ? `the PO line's item is INDI ${indi}, which takes no BANO, so REMK ` +
          `cannot be exercised on this PO — point fixtures.puno at a PO line ` +
          `for a lot- or serial-controlled item`
        : 'no WHSL is available, and the builder emits REMK only when a line ' +
          'has both a BANO and a WHSL',
    },
    {
      key: 'lot-with-expiry',
      itno: lineItem,
      whsl: '',
      input: {
        RVQA: String(f.quantity || '1'),
        BANO: f.testLot || ctx.serialFor('E'),
        EXPI: f.expiryDate || '',
      },
      proves: 'EXPI is accepted on a lot-controlled line (scenario 7)',
      enabled: lotControlled && Boolean(f.expiryDate),
      skipNote: !lotControlled
        ? `the PO line's item is INDI ${indi} and takes no BANO/EXPI`
        : 'fixtures.expiryDate is not set',
    },
  ];

  const header = buildWarehouseHeaderRecord(whlo, ctx.config.whsHeader, ctx.config.whsHeader.reference);
  const headResponse = await ctx.client.call(specWarehouseHeader(header));

  if (ctx.dryRun) {
    const pack = buildWarehousePackRecord(whlo, 'DRYRUN', '1');
    await ctx.client.call(specWarehousePack(pack));
    for (const variant of variants) {
      if (!variant.enabled) continue;
      const record = buildWarehouseLineRecord(
        { ...variant.input, EXPI: variant.input.EXPI || undefined },
        { WHLO: whlo, MSGN: 'DRYRUN', PACN: '1', ITNO: variant.itno, PUUN: puun,
          PUNO: f.puno || '', PNLI: f.pnli || '', PNLS: f.pnls || '0',
          WHSL: variant.whsl, OEND: '1', PROD: (ctx.poLine || {}).PROD || '' }
      );
      await ctx.client.call(specWarehouseLine(record));
    }
    return result(11, 'MHS850MI AddWhsHead/Pack/Line', 'dry', scenarios, SKIP, 'dry-run');
  }

  if (!headResponse.ok) {
    return result(11, 'MHS850MI AddWhsHead/Pack/Line', 'dry', scenarios, FAIL,
      `AddWhsHead refused: ${headResponse.errorCode} ${headResponse.errorMessage} ` +
      `(field ${headResponse.errorField || 'n/a'}). E0PA/E0PB/E065 must match an ` +
      `MMS865 partner record on this tenant — see CONFIGURATION.md.`,
      { header, response: headResponse.raw });
  }

  const msgn = (headResponse.records[0] || {}).MSGN;
  if (!msgn) {
    return result(11, 'MHS850MI AddWhsHead/Pack/Line', 'dry', scenarios, FAIL,
      'AddWhsHead succeeded but returned no MSGN, so nothing can be attached to it.',
      { header, response: headResponse.raw });
  }

  // Registered as soon as the message exists, so a failure on any line below
  // still leaves the staged message scheduled for deletion.
  ctx.registerCleanup(
    `MHS850MI/DeleteWhsTran message ${msgn}`,
    async () => ctx.client.call({
      program: 'MHS850MI', transaction: 'DeleteWhsTran',
      record: { MSGN: msgn }, scope: 'company', maxReturnedRecords: 1,
    })
  );

  const pack = buildWarehousePackRecord(whlo, msgn, '1');
  const packResponse = await ctx.client.call(specWarehousePack(pack));
  if (!packResponse.ok) {
    return result(11, 'MHS850MI AddWhsHead/Pack/Line', 'dry', scenarios, FAIL,
      `AddWhsPack refused: ${packResponse.errorCode} ${packResponse.errorMessage}`,
      { msgn, pack, response: packResponse.raw });
  }
  const pacn = (packResponse.records[0] || {}).PACN || '1';

  const lines = [];
  const notes = [];
  const fixtureProblems = [];
  let anyFailed = false;

  for (const variant of variants) {
    if (!variant.enabled) {
      notes.push(`${variant.key}: NOT RUN — ${variant.skipNote}. ${variant.proves} stays unproven.`);
      continue;
    }

    const record = buildWarehouseLineRecord(
      { ...variant.input, EXPI: variant.input.EXPI || undefined },
      { WHLO: whlo, MSGN: msgn, PACN: pacn, ITNO: variant.itno, PUUN: puun,
        PUNO: f.puno || '', PNLI: f.pnli || '', PNLS: f.pnls || '0',
        WHSL: variant.whsl, OEND: '1', PROD: (ctx.poLine || {}).PROD || '' }
    );
    const response = await ctx.client.call(specWarehouseLine(record));
    const msln = response.ok ? (response.records[0] || {}).MSLN : null;

    lines.push({ variant: variant.key, fields: Object.keys(record), ok: response.ok, msln,
                 errorCode: response.errorCode || null, errorMessage: response.errorMessage || null });

    if (response.ok) {
      notes.push(`${variant.key}: accepted as line ${msln || '(no MSLN)'} — ` +
                 `${variant.proves}. Sent ${Object.keys(record).join(', ')}.`);
      if (!ctx.staged) ctx.staged = { msgn, pacn, msln };
    } else {
      const code = String(response.errorCode || '').toUpperCase();
      const fixture = FIXTURE_ERRORS[code];
      if (fixture) {
        // Not a refutation: the line never got as far as the fields under test.
        fixtureProblems.push(variant.key);
        notes.push(`${variant.key}: NOT TESTED — ${response.errorCode} ` +
                   `"${response.errorMessage}", i.e. ${fixture}. ${variant.proves} ` +
                   `remains unproven; this says nothing about the claim.`);
      } else {
        anyFailed = true;
        notes.push(`${variant.key}: REFUSED (${response.errorCode} ${response.errorMessage}, ` +
                   `field ${response.errorField || 'n/a'}) — ${variant.proves} is DISPROVED. ` +
                   `Sent ${Object.keys(record).join(', ')}.`);
      }
    }
  }

  if (!ctx.staged) ctx.staged = { msgn, pacn, msln: null };

  const accepted = lines.filter((l) => l.ok);
  const remkProven = accepted.some((l) => l.fields.includes('REMK'));
  const expiProven = accepted.some((l) => l.fields.includes('EXPI'));
  const blankWhslProven = accepted.some((l) => !l.fields.includes('WHSL'));
  const refKeysProven = accepted.some((l) => ['RIDN', 'RIDL', 'RIDX'].every((k) => l.fields.includes(k)));

  const status = anyFailed
    ? FAIL
    : accepted.length
      ? (fixtureProblems.length ? INCONCLUSIVE : PASS)
      : INCONCLUSIVE;

  return result(11, 'MHS850MI AddWhsHead/Pack/Line', 'dry', scenarios, status,
    `Staged message ${msgn} / package ${pacn}, ${accepted.length} of ${lines.length} ` +
    `line(s) accepted. Proven: ` +
    `RIDN/RIDL/RIDX ${refKeysProven ? 'yes' : 'NO'}, PUUN ${accepted.length ? 'yes' : 'NO'}, ` +
    `OEND ${accepted.length ? 'yes' : 'NO'}, blank WHSL ${blankWhslProven ? 'yes' : 'NO'}, ` +
    `REMK ${remkProven ? 'yes' : 'NOT EXERCISED'}, EXPI ${expiProven ? 'yes' : 'NOT EXERCISED'}. ` +
    `Nothing was processed — PrcWhsTran is on the wrapper's deny-list — so no stock moved. ` +
    notes.join(' | '),
    { msgn, pacn, lines, notes, fixtureProblems, remkProven, expiProven, blankWhslProven, refKeysProven },
    [
      ...(blankWhslProven ? [10] : []),
      ...(expiProven ? [7] : []),
      // Scenario 8 is specifically an INDI 1 item. A fresh lot on an INDI 2
      // serial item exercises REMK, but it is not that scenario.
      ...(indi === '1' && accepted.some((l) => l.fields.includes('BANO')) ? [8] : []),
    ]);
}

/* ─── Probe 12: LstWhsLine returns MSID and MSGD ─────────────────────────── */

export async function probeWarehouseLineDiagnostics(ctx) {
  const { specWarehouseLines } = ctx.gateway;
  const staged = ctx.staged;

  if (!staged) {
    return result(12, 'MHS850MI/LstWhsLine', 'read', [12], SKIP,
      'Probe 11 did not stage a message, so there is nothing to list.');
  }

  const spec = specWarehouseLines(staged.msgn, staged.pacn);
  const response = await ctx.client.call(spec);
  if (ctx.dryRun) return result(12, 'MHS850MI/LstWhsLine', 'read', [12], SKIP, 'dry-run');

  if (!response.ok) {
    return result(12, 'MHS850MI/LstWhsLine', 'read', [12], FAIL,
      `LstWhsLine failed: ${response.errorCode} ${response.errorMessage}. ` +
      `Note the spec sends no CONO — the catalog shows this transaction has no ` +
      `CONO input, which is one of the corrections.`,
      { spec, response: response.raw });
  }

  // No rows is not evidence. If probe 11 staged no lines, LstWhsLine correctly
  // returns nothing, and concluding "MSID and MSGD are not returned" from an
  // empty list would accuse the documentation of a fault this run never tested.
  if (!response.records.length) {
    return result(12, 'MHS850MI/LstWhsLine', 'read', [12], INCONCLUSIVE,
      `LstWhsLine returned no rows for message ${staged.msgn} / package ` +
      `${staged.pacn}, because probe 11 staged no accepted lines. Whether MSID ` +
      `and MSGD come back is therefore untested — fix probe 11's fixtures first. ` +
      `The call itself was accepted with no CONO, which is one of the corrections.`,
      { spec, staged, fieldsReturned: [] });
  }

  const line = response.records[0] || {};
  const missing = missingFields(line, ['MSID', 'MSGD']);
  const remkReturned = 'REMK' in line;

  return result(12, 'MHS850MI/LstWhsLine', 'read', [12],
    missing.length ? FAIL : PASS,
    missing.length
      ? `${missing.join(' and ')} not returned by LstWhsLine. The diagnostics ` +
        `correction depends on them.`
      : `MSID and MSGD both returned (MSID="${line.MSID || ''}" MSGD="${line.MSGD || ''}"` +
        `; blank is expected on an unprocessed message). REMK was ` +
        `${remkReturned ? 'ALSO returned, contradicting the claim that LstWhsLine does not return it' : 'not returned, as claimed'}. ` +
        `The call carried no CONO and was accepted.`,
    { line, missing, remkReturned, fieldsReturned: Object.keys(line) },
    missing.length ? [] : [12]);
}

/** Probes in run order. Later ones depend on state earlier ones set. */
export const PROBES = Object.freeze([
  probeUserData,
  probePoHead,
  probeBasicData,
  probePoLine,
  probeCustomerOrder,
  probeReceivingMethod,
  probeWarehouseGroup,
  probeEquipmentAddManual,
  probeEquipmentAddAutoRejectsSerial,
  probeEquipmentAddForbidden,
  probeCustomFieldDeleteName,
  probeWarehouseWritePath,
  probeWarehouseLineDiagnostics,
]);
