/**
 * Token acquisition and the MI call wrapper.
 *
 * Everything that talks to a tenant goes through `MiClient.call`, which is
 * also where the safety rails live. They are enforced here rather than in the
 * probes so that a new probe cannot route around them by forgetting to ask.
 *
 * No dependencies: Node's built-in `fetch` and `node:module` hooks only.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve as resolvePath } from 'node:path';

/* ─── Safety rail 1: the transaction deny-list ───────────────────────────── */

/**
 * Transactions this harness will never send, whatever a probe asks for.
 *
 * `MHS850MI/PrcWhsTran` is the one that matters: the AddWhsHead/Pack/Line trio
 * only *stages* a warehouse message, and staged messages move no stock and can
 * be deleted. PrcWhsTran is what posts them. Probe 11's entire value is that it
 * exercises the write path's field acceptance and then stops, so the single
 * call that would turn it into a real inventory movement is unreachable.
 *
 * The rest of the list is the same hazard by another name. MHS850MI carries
 * around thirty Add* transactions that post a movement *immediately* rather
 * than staging one — AddPOReceipt, AddDOReceipt, the Pick and PutAway families.
 * None is needed here, all of them move stock, and several are one letter away
 * from a transaction that is needed. Naming them costs nothing and removes a
 * class of typo that would otherwise post inventory in someone's sandbox.
 *
 * Keys are `PROGRAM/TRANSACTION`, matched case-insensitively.
 */
export const DENIED_TRANSACTIONS = Object.freeze([
  // Posts a staged warehouse message. The rail this harness is built around.
  'MHS850MI/PrcWhsTran',
  // Post a movement directly, with no staging step to inspect or delete.
  'MHS850MI/AddPOReceipt',
  'MHS850MI/AddPOPutaway',
  'MHS850MI/AddPOInspect',
  'MHS850MI/AddPOPackInsp',
  'MHS850MI/AddPOClose',
  'MHS850MI/AddDOReceipt',
  'MHS850MI/AddDOPick',
  'MHS850MI/AddDOPackRec',
  'MHS850MI/AddDORecOther',
  'MHS850MI/AddDORecViaPack',
  'MHS850MI/AddMOReceipt',
  'MHS850MI/AddMOPick',
  'MHS850MI/AddMORecBy',
  'MHS850MI/AddMOReqIssue',
  'MHS850MI/AddCOPick',
  'MHS850MI/AddCOReturn',
  'MHS850MI/AddROReceipt',
  'MHS850MI/AddROPick',
  'MHS850MI/AddWOPick',
  'MHS850MI/AddReplPick',
  'MHS850MI/AddPutAwayConf',
  'MHS850MI/AddPutAwayPack',
  'MHS850MI/AddCfmPickList',
  'MHS850MI/AddCorrPickLine',
  'MHS850MI/DeletePickList',
  'MHS850MI/SndPOReceipt',
]);

const DENIED_SET = new Set(DENIED_TRANSACTIONS.map((key) => key.toLowerCase()));

export class DeniedTransactionError extends Error {
  constructor(program, transaction) {
    super(
      `Refusing to send ${program}/${transaction}: it is on the validation ` +
        `harness deny-list because it posts stock. This harness stages and ` +
        `reads only. If you genuinely need to post, do it by hand in M3 with ` +
        `your eyes open, not from a script that was written to be safe.`
    );
    this.name = 'DeniedTransactionError';
    this.program = program;
    this.transaction = transaction;
  }
}

/** Throws when the transaction is on the deny-list. Pure; unit-tested. */
export function assertTransactionAllowed(program, transaction) {
  const key = `${program}/${transaction}`.toLowerCase();
  if (DENIED_SET.has(key)) {
    throw new DeniedTransactionError(program, transaction);
  }
}

/* ─── Safety rail 2: the production guard ────────────────────────────────── */

/** The only environments this harness will run against without an override. */
export const ALLOWED_ENVIRONMENTS = Object.freeze(['DEV', 'TST', 'SANDBOX']);

export class ProductionGuardError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProductionGuardError';
  }
}

/**
 * Refuses to run against production.
 *
 * Two independent checks, because either one alone is weak. The declared
 * `environment` is a statement of intent that can be stale or copied from
 * another config; the ION API URL is what the requests actually reach. A
 * tenant whose URL says PRD is treated as production no matter what the
 * config claims, and the override has to be typed on the command line —
 * it cannot be set in a file that someone might copy without reading.
 *
 * Pure; unit-tested.
 */
export function assertEnvironmentSafe({ ionApiUrl, environment, tenant, allowProduction }) {
  const declared = String(environment || '').toUpperCase();

  if (!ALLOWED_ENVIRONMENTS.includes(declared)) {
    throw new ProductionGuardError(
      `Config must declare "environment" as one of ` +
        `${ALLOWED_ENVIRONMENTS.join(', ')}. Found ${JSON.stringify(environment ?? null)}. ` +
        `This is a deliberate speed bump: the harness writes to M3, and an ` +
        `unstated environment is not a sandbox.`
    );
  }

  // `_PRD`, `-PRD`, `/PRD`, `PRD.` — a bounded token, so a tenant that merely
  // contains the letters (PRDTEST, SPRDEV) is not caught by accident.
  const prodPattern = /(^|[^A-Z0-9])PRD([^A-Z0-9]|$)/i;
  const haystack = `${ionApiUrl || ''} ${tenant || ''}`;

  if (prodPattern.test(haystack) && !allowProduction) {
    throw new ProductionGuardError(
      `The ION API URL or tenant looks like PRODUCTION:\n  ${ionApiUrl}\n` +
        `  tenant: ${tenant}\n` +
        `Declared environment was ${declared}, which contradicts it.\n` +
        `Refusing to run. If this really is a non-production tenant that just ` +
        `has PRD in its name, re-run with --allow-production.`
    );
  }

  return { declared, looksLikeProduction: prodPattern.test(haystack) };
}

/* ─── The .ionapi file: app type detection ───────────────────────────────── */

export class AppTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AppTypeError';
  }
}

/**
 * Classifies the downloaded .ionapi credential file.
 *
 * ION API hands out a different file per Authorized App type, and they are not
 * interchangeable. Only a **Backend Service** app carries `saak`/`sask` — the
 * service-account key pair that allows a non-interactive token grant. Every
 * other type (Web Application, Native/Desktop, Hybrid) is built for a browser
 * redirect and carries no usable secret for a headless process.
 *
 * `RawIonApiConfig` in the H5 CLI does not even list saak/sask, because that
 * CLI drives the interactive flow through Puppeteer. That is the flow this
 * harness must not copy, so the distinction is checked up front: a missing key
 * pair is reported here, by name, instead of surfacing as an opaque 401 after
 * ten steps of setup.
 *
 * Pure; unit-tested.
 */
export function classifyIonApiConfig(raw) {
  const missing = ['ti', 'ci', 'cs', 'iu', 'pu', 'ot'].filter((k) => !raw?.[k]);
  if (missing.length) {
    throw new AppTypeError(
      `The .ionapi file is missing required keys: ${missing.join(', ')}.\n` +
        `Expected the fields documented on RawIonApiConfig ` +
        `(SDKs/H5 Angular/cli/src/commands/login/models.ts): ` +
        `ti, cn, ci, cs, iu, pu, oa, ot, or, ru.`
    );
  }

  const hasServiceAccount = Boolean(raw.saak && raw.sask);

  if (!hasServiceAccount) {
    throw new AppTypeError(
      `This .ionapi file has no "saak"/"sask" keys, so it cannot be used ` +
        `non-interactively.\n\n` +
        `  App name : ${raw.cn || '(unnamed)'}\n` +
        `  Tenant   : ${raw.ti}\n\n` +
        `WHAT TO DO: in Infor ION API -> Authorized Apps, create an app of ` +
        `type "Backend Service" (not "Web Application", not "Native/Desktop", ` +
        `not "Hybrid"). Only a Backend Service app issues a service-account ` +
        `key pair, and only its downloaded .ionapi file contains saak and ` +
        `sask. Every other type is built for a browser redirect and cannot ` +
        `authenticate a headless process.\n\n` +
        `Do NOT work around this by reusing an interactive app's file — that ` +
        `is the Puppeteer implicit-grant path the H5 CLI takes, and it cannot ` +
        `run in this harness.`
    );
  }

  return {
    appName: raw.cn || '(unnamed)',
    tenant: raw.ti,
    appType: 'Backend Service',
    hasServiceAccount,
  };
}

/** Reads and classifies an .ionapi file from disk. */
export function loadIonApiFile(path) {
  const full = resolvePath(path);
  if (!existsSync(full)) {
    throw new AppTypeError(
      `No .ionapi file at ${full}.\n` +
        `Download one from Infor ION API -> Authorized Apps -> your Backend ` +
        `Service app -> Download Credentials (tick "Create Service Account").`
    );
  }
  let raw;
  try {
    raw = JSON.parse(readFileSync(full, 'utf8'));
  } catch (error) {
    throw new AppTypeError(`${full} is not valid JSON: ${error.message}`);
  }
  return { raw, info: classifyIonApiConfig(raw), path: full };
}

/* ─── Token acquisition ──────────────────────────────────────────────────── */

function joinUrl(base, path) {
  return `${String(base).replace(/\/+$/, '')}/${String(path).replace(/^\/+/, '')}`;
}

/**
 * OAuth2 `password` grant against the service-account key pair.
 *
 * This is the flow a Backend Service app exists for. Infor maps the grant onto
 * saak/sask rather than onto a human's credentials, so nothing interactive is
 * involved and no browser is needed.
 */
export async function acquireToken(raw, { fetchImpl = fetch } = {}) {
  const tokenUrl = joinUrl(raw.pu, raw.ot);
  const body = new URLSearchParams({
    grant_type: 'password',
    username: raw.saak,
    password: raw.sask,
    client_id: raw.ci,
    client_secret: raw.cs,
  });

  const response = await fetchImpl(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Token request failed: HTTP ${response.status} from ${tokenUrl}\n${text}\n\n` +
        (response.status === 400 || response.status === 401
          ? `A 400/401 here usually means the app is not really a Backend ` +
            `Service, or the service account was revoked. Re-download the ` +
            `credentials with "Create Service Account" ticked.`
          : '')
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Token endpoint returned non-JSON:\n${text.slice(0, 500)}`);
  }
  if (!parsed.access_token) {
    throw new Error(`Token response carried no access_token:\n${text.slice(0, 500)}`);
  }
  return {
    accessToken: parsed.access_token,
    tokenType: parsed.token_type || 'Bearer',
    expiresIn: Number(parsed.expires_in) || 0,
    acquiredAt: Date.now(),
  };
}

/* ─── Response normalisation ─────────────────────────────────────────────── */

/**
 * The error types m3api-rest reports, as an enum on the response.
 *
 * Probe 10 turns on this: asking for a transaction M3 does not have returns
 * `TransactionNotFound`, and asking for one it does have with a key that
 * matches nothing returns something else. That difference is the proof that
 * `DltEqInfo` exists and `DelEqInfo` does not.
 */
export const ERROR_TYPES = Object.freeze({
  TRANSACTION_NOT_FOUND: 'TransactionNotFound',
  MANDATORY_INPUT_FIELD_NOT_FOUND: 'MandatoryInputFieldNotFound',
  INPUT_FIELD_TOO_LONG: 'InputFieldTooLong',
  SERVER_RETURNED_NOK: 'ServerReturnedNOK',
});

/**
 * Flattens whatever m3api-rest returned into one shape the probes can read.
 *
 * The documented v2 contract is `results[0]` carrying either an error quartet
 * or `records[]` of flat `{FIELD: value}` objects, and that is handled first.
 * The older `MIRecord[]/NameValue[]` encoding is handled too, because which one
 * a tenant serves depends on its m3api-rest version, and a harness whose job is
 * to test assumptions should not assume its own transport. `shape` records
 * which one came back, so the run report can state whether this tenant matched
 * the contract the harness expected.
 */
export function normalizeResponse(json) {
  const empty = { ok: true, records: [], shape: 'unknown', raw: json };

  if (!json || typeof json !== 'object') return { ...empty, shape: 'empty' };

  // Documented v2: { results: [ { errorMessage, errorCode, errorField,
  //                               errorType, records: [ {FIELD: value} ] } ] }
  const results = json.results || json.Results;
  if (Array.isArray(results)) {
    const first = results[0] || {};
    const errorMessage = first.errorMessage ?? first.ErrorMessage ?? null;
    const errorCode = first.errorCode ?? first.ErrorCode ?? null;
    const errorField = first.errorField ?? first.ErrorField ?? null;
    const errorType = first.errorType ?? first.ErrorType ?? null;
    const records = first.records ?? first.Records ?? [];

    if (errorMessage || errorCode || errorType) {
      return {
        ok: false,
        errorMessage,
        errorCode,
        errorField,
        errorType,
        records: [],
        shape: 'results',
        raw: json,
      };
    }
    return { ok: true, records: Array.isArray(records) ? records : [], shape: 'results', raw: json };
  }

  // Legacy v2: { MIRecord: [ { NameValue: [ {Name, Value} ] } ], Message, ErrorCode }
  if (Array.isArray(json.MIRecord)) {
    const errorMessage = json.Message || null;
    const errorCode = json.ErrorCode || null;
    if (errorCode || (errorMessage && !json.MIRecord.length)) {
      return {
        ok: false,
        errorMessage,
        errorCode,
        errorField: json.ErrorField || null,
        errorType: json.ErrorType || null,
        records: [],
        shape: 'mirecord',
        raw: json,
      };
    }
    const records = json.MIRecord.map((row) => {
      const flat = {};
      for (const nv of row.NameValue || []) flat[nv.Name] = nv.Value;
      return flat;
    });
    return { ok: true, records, shape: 'mirecord', raw: json };
  }

  // A bare error object, which is what a transport-level fault looks like.
  if (json.errorMessage || json.ErrorMessage || json.error) {
    return {
      ok: false,
      errorMessage: json.errorMessage || json.ErrorMessage || json.error_description || json.error,
      errorCode: json.errorCode || json.ErrorCode || null,
      errorField: json.errorField || null,
      errorType: json.errorType || null,
      records: [],
      shape: 'bare-error',
      raw: json,
    };
  }

  return empty;
}

/* ─── The MI client ──────────────────────────────────────────────────────── */

/**
 * Builds the request URL for one MI spec.
 *
 * Record fields become query parameters; `maxrecs` and `returncols` are matrix
 * parameters on the transaction path segment, which is how m3api-rest v2 takes
 * them. Exported so `--dry-run` can print exactly what would have been sent,
 * and so a test can assert the shape without a tenant.
 */
export function buildRequestUrl({ ionApiUrl, tenant, program, transaction, record, outputFields, maxReturnedRecords }) {
  const matrix = [];
  if (maxReturnedRecords !== undefined && maxReturnedRecords !== null) {
    matrix.push(`;maxrecs=${encodeURIComponent(String(maxReturnedRecords))}`);
  }
  if (outputFields && outputFields.length) {
    matrix.push(`;returncols=${encodeURIComponent(outputFields.join(','))}`);
  }

  const base = joinUrl(joinUrl(ionApiUrl, tenant), 'M3/m3api-rest/v2/execute');
  const path = `${base}/${encodeURIComponent(program)}/${encodeURIComponent(transaction)}${matrix.join('')}`;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(record || {})) {
    if (value === undefined || value === null || value === '') continue;
    query.append(key, String(value));
  }
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * Applies the company scope a gateway spec declares.
 *
 * Mirrors `applyCompanyScope` in h5-adapter.ts, which is the code that does
 * this in the real script. The values come from config rather than from the H5
 * user context; when they are absent the record is left alone and M3 resolves
 * the service account's own company, exactly as MI does for the script.
 */
export function applyCompanyScope(record, scope, { company, division }) {
  if (!scope || scope === 'none') return { ...record };
  const scoped = { ...record };
  if (company) scoped.CONO = String(company);
  if (scope === 'company-division' && division) scoped.DIVI = String(division);
  return scoped;
}

export class MiClient {
  /**
   * @param {object} options
   * @param {object} options.raw        parsed .ionapi contents
   * @param {object} options.token      from acquireToken(); null in dry-run
   * @param {boolean} options.dryRun    print requests, send nothing
   * @param {object} options.companyContext { company, division }
   * @param {(msg: string) => void} options.log
   */
  constructor({ raw, token, dryRun = false, companyContext = {}, log = console.log, fetchImpl = fetch }) {
    this.raw = raw;
    this.token = token;
    this.dryRun = dryRun;
    this.companyContext = companyContext;
    this.log = log;
    this.fetchImpl = fetchImpl;
    /** Every request attempted, for the run report. */
    this.transcript = [];
  }

  /**
   * Sends one MI spec and returns the normalised response.
   *
   * Returns rather than throws on an MI-level error: the expect-failure probes
   * assert *on* the error quartet, and making them catch exceptions in order to
   * report success would invert the whole harness. Only transport faults and
   * rail violations throw.
   */
  async call(spec) {
    const { program, transaction } = spec;

    // Rail 1, before anything else can happen. A probe cannot reach a denied
    // transaction even by constructing the spec itself.
    assertTransactionAllowed(program, transaction);

    const record = applyCompanyScope(spec.record, spec.scope, this.companyContext);
    const url = buildRequestUrl({
      ionApiUrl: this.raw.iu,
      tenant: this.raw.ti,
      program,
      transaction,
      record,
      outputFields: spec.outputFields,
      maxReturnedRecords: spec.maxReturnedRecords,
    });

    const entry = {
      program,
      transaction,
      record,
      scope: spec.scope || 'none',
      url,
      at: new Date().toISOString(),
    };
    this.transcript.push(entry);

    if (this.dryRun) {
      this.log(`  [dry-run] GET ${url}`);
      entry.dryRun = true;
      return {
        ok: true,
        records: [],
        shape: 'dry-run',
        dryRun: true,
        raw: null,
      };
    }

    let response;
    try {
      response = await this.fetchImpl(url, {
        method: 'GET',
        headers: {
          Authorization: `${this.token.tokenType} ${this.token.accessToken}`,
          Accept: 'application/json',
          // Deliberately NO fnd-csrf-token. M3 rejects a CSRF token when the
          // call is routed through ION API; the H5 CLI's dev proxy strips the
          // header and fakes the /m3api-rest/csrf response for exactly this
          // reason (SDKs/H5 Angular/cli/src/mtauth.cts).
        },
      });
    } catch (error) {
      entry.transportError = error.message;
      throw new Error(`Transport failure on ${program}/${transaction}: ${error.message}`);
    }

    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    const normalized = normalizeResponse(json);
    normalized.httpStatus = response.status;

    // A non-2xx status is a failure, whatever the body did or did not parse to.
    //
    // This is the harness's own version of the defect the CHANGELOG describes:
    // an HTTP 400 whose body carries no recognisable error quartet would
    // otherwise normalise to `ok: true` and be read as a clean empty result.
    // It was found doing exactly that — ION API answers an unknown transaction
    // with a bare 400, and probe 10 scored it as a success.
    if (!response.ok) {
      normalized.ok = false;
      if (!normalized.errorMessage) {
        normalized.errorMessage =
          `HTTP ${response.status}` + (text ? `: ${text.slice(0, 300)}` : ' with an empty body');
      }
    }

    entry.httpStatus = response.status;
    entry.ok = normalized.ok;
    entry.errorCode = normalized.errorCode || null;
    entry.errorType = normalized.errorType || null;
    entry.recordCount = normalized.records.length;

    return normalized;
  }

  /**
   * Fetches a program's Swagger document from this tenant's own ION API
   * catalog, so the endpoint shape is read rather than guessed.
   */
  async fetchSwagger(program) {
    const url = joinUrl(joinUrl(this.raw.iu, this.raw.ti), `M3/m3api-rest/v2/metadata/${program}`);
    if (this.dryRun) {
      this.log(`  [dry-run] GET ${url}`);
      return { dryRun: true, url };
    }
    const response = await this.fetchImpl(url, {
      method: 'GET',
      headers: {
        Authorization: `${this.token.tokenType} ${this.token.accessToken}`,
        Accept: 'application/json',
      },
    });
    const text = await response.text();
    if (!response.ok) {
      return { url, httpStatus: response.status, error: text.slice(0, 500) };
    }
    try {
      return { url, httpStatus: response.status, document: JSON.parse(text) };
    } catch {
      return { url, httpStatus: response.status, error: 'non-JSON metadata response' };
    }
  }
}

/* ─── Importing the real builders out of build/ ──────────────────────────── */

/**
 * Makes the compiled script importable by Node.
 *
 * `tsconfig.json` sets `moduleResolution: "bundler"`, so the emitted JS keeps
 * the source's extensionless specifiers (`import { X } from './serial-policy'`).
 * A bundler resolves those; Node's ESM loader does not, and requires a fully
 * specified path. Rather than edit the shipped script's imports for the
 * harness's convenience — which would change the deliverable to suit its test —
 * a resolve hook appends `.js` for relative specifiers inside `build/`.
 *
 * This is what lets the probes import the REAL builders. A re-implementation
 * here would prove only that the harness agrees with itself.
 */
let hooksRegistered = false;

export function registerBuildResolver() {
  if (hooksRegistered) return;
  hooksRegistered = true;
  registerHooks({
    resolve(specifier, context, nextResolve) {
      const parent = context.parentURL || '';
      if (specifier.startsWith('./') && !/\.[a-z]+$/i.test(specifier) && parent.includes('/build/')) {
        const candidate = new URL(`${specifier}.js`, parent);
        if (existsSync(candidate)) return nextResolve(candidate.href, context);
      }
      return nextResolve(specifier, context);
    },
  });
}

/**
 * Imports the compiled builders, with a legible failure when build/ is absent.
 *
 * build/ is gitignored, so it only exists after tsc has run. The npm script
 * runs tsc first; someone invoking node directly gets told why, rather than a
 * bare ERR_MODULE_NOT_FOUND.
 */
export async function importBuiltModules(validationDir) {
  registerBuildResolver();
  const buildDir = join(dirname(validationDir), 'build');

  if (!existsSync(join(buildDir, 'mi-gateway.js'))) {
    throw new Error(
      `No compiled output at ${buildDir}.\n` +
        `build/ is gitignored, so it has to be produced first. Run:\n\n` +
        `  npm run validate:tenant -- <args>\n\n` +
        `which compiles before it runs, or compile by hand with:\n\n` +
        `  npx tsc -p Projects/General/H5-Scripts/POReceiptShortcut/tsconfig.json`
    );
  }

  // tsc emits ES modules but writes no package.json, and the repo root does not
  // set "type": "module", so Node reparses each file as ESM after failing to
  // read it as CommonJS and warns about it. build/ is gitignored and rebuilt by
  // tsc every run, so the marker is written here rather than committed.
  const marker = join(buildDir, 'package.json');
  if (!existsSync(marker)) {
    writeFileSync(marker, JSON.stringify({ type: 'module' }, null, 2) + '\n');
  }

  const [requests, gateway] = await Promise.all([
    import(pathToFileURL(join(buildDir, 'mi-requests.js')).href),
    import(pathToFileURL(join(buildDir, 'mi-gateway.js')).href),
  ]);

  return { requests, gateway };
}
