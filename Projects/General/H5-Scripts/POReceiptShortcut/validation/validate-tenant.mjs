#!/usr/bin/env node
/**
 * Tenant validation harness for POReceiptShortcutV7.
 *
 * The unit tests assert what the script SENDS. This asserts what M3 ACCEPTS.
 * Those are different questions, and only the second one can refute the
 * corrections listed in CHANGELOG.md.
 *
 *   node validate-tenant.mjs --survey            read-only master-data scan
 *   node validate-tenant.mjs --dry-run           print every request, send none
 *   node validate-tenant.mjs                     run the probes
 *
 * See README.md. Run --survey first: the write probes need fixture items that
 * the survey is what finds.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  MiClient,
  acquireToken,
  assertEnvironmentSafe,
  importBuiltModules,
  loadIonApiFile,
} from './ionapi.mjs';
import { PROBES, PASS, FAIL, SKIP, INCONCLUSIVE } from './probes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

/* ─── CLI ────────────────────────────────────────────────────────────────── */

function parseArgs(argv) {
  const args = {
    survey: false,
    dryRun: false,
    allowProduction: false,
    swagger: false,
    config: join(HERE, 'tenant.local.json'),
    ionapi: null,
    out: join(HERE, 'validation-result.json'),
    surveyWindowYears: 8,
    surveyMaxRecs: 2000,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[++i];
    switch (arg) {
      case '--survey': args.survey = true; break;
      case '--dry-run': args.dryRun = true; break;
      case '--allow-production': args.allowProduction = true; break;
      case '--swagger': args.swagger = true; break;
      case '--config': args.config = resolvePath(next()); break;
      case '--ionapi': args.ionapi = resolvePath(next()); break;
      case '--out': args.out = resolvePath(next()); break;
      case '--survey-years': args.surveyWindowYears = Number(next()); break;
      case '--survey-maxrecs': args.surveyMaxRecs = Number(next()); break;
      case '--help': case '-h': args.help = true; break;
      default:
        if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}. Try --help.`);
    }
  }
  return args;
}

const HELP = `
POReceiptShortcutV7 tenant validation harness

  --survey              Read-only. Scans MMS200MI/LstItmByChgDate and buckets
                        items into the five roles the write probes need, then
                        prints a block to paste into tenant.local.json.
                        RUN THIS FIRST.
  --dry-run             Print every request that would be sent, send nothing.
  --swagger             Fetch the MHS850MI / MMS240MI / CMS474MI metadata from
                        this tenant's own catalog and save it next to the
                        results, so the endpoint shape is read, not guessed.
  --allow-production    Override the production guard. Do not use this.
  --config <path>       Default: ./tenant.local.json
  --ionapi <path>       Default: config.ionApiFile, else ./tenant.ionapi
  --out <path>          Default: ./validation-result.json
  --survey-years <n>    How far back the survey scans. Default 8.
  --survey-maxrecs <n>  Records per scan window. Default 2000. A window that
                        comes back full is split and re-read automatically.
`;

/* ─── Config ─────────────────────────────────────────────────────────────── */

function loadConfig(path) {
  if (!existsSync(path)) {
    throw new Error(
      `No config at ${path}.\n` +
        `Copy tenant.example.json to tenant.local.json and fill it in. ` +
        `tenant.local.json is gitignored; the example is not, so keep tenant ` +
        `values out of the example.`
    );
  }
  const config = JSON.parse(readFileSync(path, 'utf8'));
  config.fixtures = config.fixtures || {};
  config.whsHeader = {
    partnerA: '', partnerB: '', partnerQualifierA: '', partnerQualifierB: '',
    messageType: '', reference: 'POReceiptShortcutV7-validation',
    ...(config.whsHeader || {}),
  };
  return config;
}

/* ─── Output helpers ─────────────────────────────────────────────────────── */

const ICON = { [PASS]: '  PASS', [FAIL]: '  FAIL', [SKIP]: '  SKIP', [INCONCLUSIVE]: '  ????' };

function hr(char = '─') { return char.repeat(78); }

function wrap(text, indent = 8) {
  const width = 78 - indent;
  const pad = ' '.repeat(indent);
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > width) { lines.push(line.trim()); line = word; }
    else line += ' ' + word;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.map((l) => pad + l).join('\n');
}

/* ─── The 12 CHANGELOG scenarios ─────────────────────────────────────────── */

const SCENARIOS = [
  'A non-USD purchase order (the CUCD fix)',
  'A PO linked to a customer order (RORC 3 -> CUNO)',
  'A serialised item with BACD 0 (serial supplied)',
  'A serialised item with BACD 1, 2, 3, 6 or 7 (serial generated)',
  'A serialised item with BACD 4, 5, 8 or 9 (equipment creation skipped)',
  'A serial of 21-40 characters (EEQN) and one over 40 (CMS474)',
  'A lot-controlled item with an expiry date',
  'An INDI 1 item, where the lot does not pre-exist',
  'A non-material line',
  'An item under direct put-away, with no location entered',
  'A WMS warehouse with wms:true',
  'A deliberate failure after equipment creation, to watch the rollback',
];

/* ─── Survey mode ────────────────────────────────────────────────────────── */

/**
 * Buckets an item by its numbering method.
 *
 * BACD is M3's batch/serial numbering method and the whole reason probes 7-9
 * exist: 0 means the operator supplies the number, 1/2/3/6/7 mean M3 generates
 * it and rejects a supplied one, and 4/5/8/9 mean MMS240MI/Add refuses outright.
 */
export function bucketItem(item) {
  const indi = String(item.INDI || '').trim();
  const bacd = String(item.BACD || '').trim();

  if (indi === '2') {
    if (bacd === '0') return 'serialManualItem';
    if (['1', '2', '3', '6', '7'].includes(bacd)) return 'serialAutoItem';
    if (['4', '5', '8', '9'].includes(bacd)) return 'serialForbiddenItem';
    return null;
  }
  if (indi === '1') return 'lotUnregisteredItem';
  if (indi === '0') return 'uncontrolledItem';
  return null;
}

const BUCKET_LABELS = {
  serialManualItem: 'serial + manual numbering   (INDI 2, BACD 0)',
  serialAutoItem: 'serial + auto numbering     (INDI 2, BACD 1/2/3/6/7)',
  serialForbiddenItem: 'serial + Add forbidden      (INDI 2, BACD 4/5/8/9)',
  lotUnregisteredItem: 'lot, unregistered           (INDI 1)',
  uncontrolledItem: 'uncontrolled                (INDI 0)',
};

function yyyymmdd(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Scans item master by last-changed date.
 *
 * `LstItmByChgDate` is the only MMS200MI list that returns INDI and BACD
 * together with no mandatory input, which is what makes an unknown tenant
 * surveyable at all. Finding these items by hand means opening MMS001 once per
 * item.
 *
 * MI list transactions have no offset, so paging is done by narrowing the key
 * range: the scan walks backwards a year at a time, and a window that comes
 * back exactly at the maxrecs cap is reported as truncated rather than
 * silently treated as complete.
 */
async function runSurvey(client, args, log) {
  const buckets = {
    serialManualItem: [], serialAutoItem: [], serialForbiddenItem: [],
    lotUnregisteredItem: [], uncontrolledItem: [],
  };
  const seen = new Set();
  const cappedWindows = [];
  let calls = 0;

  /**
   * Reads one date window, and splits it when it comes back full.
   *
   * A window that returns exactly `maxrecs` rows has been truncated, and an
   * item the scan needed may be sitting just past the cut. That matters more
   * than it sounds: an empty bucket is reported as "create this item in
   * MMS001", so a silently truncated scan sends someone to build master data
   * that already exists. Splitting until no window is full makes the EMPTY
   * verdict mean what it says.
   */
  async function scan(from, to, depth) {
    const response = await client.call({
      program: 'MMS200MI',
      transaction: 'LstItmByChgDate',
      record: { FLMD: from, TLMD: to },
      scope: 'company',
      outputFields: ['ITNO', 'ITDS', 'INDI', 'BACD'],
      maxReturnedRecords: args.surveyMaxRecs,
    });
    calls += 1;

    if (args.dryRun) return;

    if (!response.ok) {
      log(`  ${from}-${to}: ${response.errorCode || ''} ${response.errorMessage || ''}`);
      return;
    }

    const full = response.records.length >= args.surveyMaxRecs;

    if (full && depth < 2) {
      // Split the window in half and re-read both halves.
      const mid = midpointDate(from, to);
      if (mid) {
        log(`  ${from}-${to}: ${response.records.length} (cap hit — splitting)`);
        await scan(from, mid, depth + 1);
        await scan(nextDay(mid), to, depth + 1);
        return;
      }
    }

    if (full) cappedWindows.push(`${from}-${to}`);
    log(`  ${from}-${to}: ${response.records.length} items${full ? '  (STILL AT CAP)' : ''}`);

    for (const item of response.records) {
      if (!item.ITNO || seen.has(item.ITNO)) continue;
      seen.add(item.ITNO);
      const bucket = bucketItem(item);
      if (bucket && buckets[bucket].length < 10) buckets[bucket].push(item);
    }
  }

  const now = new Date();
  for (let year = 0; year < args.surveyWindowYears; year += 1) {
    const y = now.getFullYear() - year;
    await scan(`${y}0101`, `${y}1231`, 0);
  }

  return { buckets, scanned: seen.size, cappedWindows, calls };
}

/** Midpoint of two yyyyMMdd strings, as yyyyMMdd. */
function midpointDate(from, to) {
  const a = parseYmd(from);
  const b = parseYmd(to);
  if (!a || !b || b <= a) return null;
  const mid = new Date((a.getTime() + b.getTime()) / 2);
  const s = yyyymmdd(mid);
  return s > from && s < to ? s : null;
}

function parseYmd(value) {
  const text = String(value);
  const date = new Date(
    Number(text.slice(0, 4)),
    Number(text.slice(4, 6)) - 1,
    Number(text.slice(6, 8))
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function nextDay(value) {
  const date = parseYmd(value);
  date.setDate(date.getDate() + 1);
  return yyyymmdd(date);
}

function reportSurvey(survey, log) {
  log('');
  log(hr('='));
  log(`SURVEY — ${survey.scanned} distinct items scanned`);
  log(hr('='));

  const empty = [];
  for (const [key, label] of Object.entries(BUCKET_LABELS)) {
    const found = survey.buckets[key];
    log('');
    log(`${label}`);
    if (!found.length) {
      empty.push(key);
      log('    (EMPTY)');
      continue;
    }
    for (const item of found.slice(0, 5)) {
      log(`    ${(item.ITNO || '').padEnd(18)} INDI=${item.INDI} BACD=${item.BACD}  ${(item.ITDS || '').slice(0, 34)}`);
    }
  }

  log('');
  log(hr());
  if (empty.length) {
    log('EMPTY BUCKETS — these must be created in MMS001 before the write probes');
    log('can cover their scenarios:');
    for (const key of empty) log(`    ${key.padEnd(22)} ${BUCKET_LABELS[key]}`);
    log('');
    log('Until they exist, the matching probes will SKIP and the corresponding');
    log('CHANGELOG scenarios stay unproven.');
  } else {
    log('All five buckets have candidates. No master data needs creating.');
  }
  if (survey.cappedWindows.length) {
    log('');
    log(`${survey.cappedWindows.length} window(s) were STILL at the record cap after`);
    log(`splitting: ${survey.cappedWindows.join(', ')}.`);
    log('An EMPTY bucket above may therefore be a truncated scan rather than');
    log('missing master data. Raise --survey-maxrecs, or narrow with');
    log('LstItmByItmGr / LstItmByProdGr, which also carry INDI and BACD.');
  } else {
    log('');
    log(`No window hit the record cap (${survey.calls} calls), so the EMPTY buckets`);
    log('above are genuinely absent from this tenant, not an artefact of paging.');
  }

  log('');
  log(hr());
  log('Paste into tenant.local.json under "fixtures":');
  log(hr());
  const picks = {};
  for (const key of Object.keys(BUCKET_LABELS)) {
    const first = survey.buckets[key][0];
    picks[key] = first ? first.ITNO : '';
  }
  log(JSON.stringify({ fixtures: picks }, null, 2));
  log('');
  return empty;
}

/* ─── Cleanup registry ───────────────────────────────────────────────────── */

/**
 * Cleanups run in reverse registration order, because later probes build on
 * what earlier ones created. Anything that could not be cleaned is printed
 * loudly at the end: a sandbox left with stray records is a smaller problem
 * than a sandbox left with stray records nobody was told about.
 */
class CleanupRegistry {
  constructor(log) { this.entries = []; this.log = log; }

  register(description, fn) { this.entries.push({ description, fn, done: false }); }

  markDone(description) {
    const entry = [...this.entries].reverse().find((e) => e.description === description && !e.done);
    if (entry) { entry.done = true; entry.note = 'already removed by its probe'; }
  }

  async runAll() {
    const failures = [];
    const pending = [...this.entries].reverse().filter((e) => !e.done);

    if (!pending.length) {
      this.log('  Nothing to clean up.');
      return failures;
    }

    for (const entry of pending) {
      try {
        const response = await entry.fn();
        if (response && response.ok === false) {
          entry.error = `${response.errorCode || ''} ${response.errorMessage || ''}`.trim();
          failures.push(entry);
          this.log(`  FAILED   ${entry.description} — ${entry.error}`);
        } else {
          entry.done = true;
          this.log(`  cleaned  ${entry.description}`);
        }
      } catch (error) {
        entry.error = error.message;
        failures.push(entry);
        this.log(`  FAILED   ${entry.description} — ${error.message}`);
      }
    }
    return failures;
  }
}

/* ─── Main ───────────────────────────────────────────────────────────────── */

async function main() {
  const args = parseArgs(process.argv);
  const log = (...parts) => console.log(...parts);

  if (args.help) { log(HELP); return 0; }

  log(hr('='));
  log('POReceiptShortcutV7 — tenant validation');
  log(hr('='));

  const config = loadConfig(args.config);
  const ionapiPath = args.ionapi || (config.ionApiFile
    ? resolvePath(dirname(args.config), config.ionApiFile)
    : join(HERE, 'tenant.ionapi'));

  // App type is checked before anything else, so a browser-redirect app fails
  // here with a name rather than as a 401 ten steps later.
  const { raw, info } = loadIonApiFile(ionapiPath);
  log(`Credentials : ${ionapiPath}`);
  log(`App         : ${info.appName}  (type: ${info.appType})`);
  log(`Tenant      : ${info.tenant}`);
  log(`ION API     : ${raw.iu}`);

  const guard = assertEnvironmentSafe({
    ionApiUrl: raw.iu,
    tenant: raw.ti,
    environment: config.environment,
    allowProduction: args.allowProduction,
  });
  log(`Environment : ${guard.declared}${args.allowProduction ? '  (PRODUCTION GUARD OVERRIDDEN)' : ''}`);
  log(`Mode        : ${args.dryRun ? 'DRY RUN — nothing will be sent' : args.survey ? 'SURVEY (read-only)' : 'PROBES'}`);
  log('');

  const token = args.dryRun ? null : await acquireToken(raw);
  if (token) log(`Token acquired, expires in ${token.expiresIn}s.\n`);

  const client = new MiClient({
    raw,
    token,
    dryRun: args.dryRun,
    companyContext: { company: config.company || '', division: config.division || '' },
    log,
  });

  /* Survey mode ends here. */
  if (args.survey) {
    log('Scanning MMS200MI/LstItmByChgDate...');
    const survey = await runSurvey(client, args, log);
    if (args.dryRun) { log('\nDry run: no requests were sent.'); return 0; }
    const empty = reportSurvey(survey, log);
    writeFileSync(args.out, JSON.stringify({
      mode: 'survey', at: new Date().toISOString(), tenant: raw.ti,
      scanned: survey.scanned, buckets: survey.buckets, emptyBuckets: empty,
      cappedWindows: survey.cappedWindows, calls: survey.calls,
    }, null, 2));
    log(`Written to ${args.out}`);
    return 0;
  }

  /* Optional: read the endpoint shape from the tenant's own catalog. */
  let swagger = null;
  if (args.swagger) {
    log('Fetching MI metadata from this tenant\'s catalog...');
    swagger = {};
    for (const program of ['MHS850MI', 'MMS240MI', 'CMS474MI']) {
      const doc = await client.fetchSwagger(program);
      swagger[program] = doc;
      log(`  ${program}: ${doc.document ? 'retrieved' : doc.error || 'dry-run'}`);
    }
    log('');
  }

  /* Probe mode. */
  const cleanup = new CleanupRegistry(log);
  let serialCounter = 0;

  const ctx = {
    client,
    config,
    dryRun: args.dryRun,
    ...(await importBuiltModules(HERE).then((m) => ({ requests: m.requests, gateway: m.gateway }))),
    registerCleanup: (description, fn) => cleanup.register(description, fn),
    markCleanupDone: (description) => cleanup.markDone(description),
    /** A serial unlikely to collide with anything real in the sandbox. */
    serialFor: (tag) => `VAL${tag}${Date.now().toString(36).toUpperCase()}${serialCounter++}`.slice(0, 20),
  };

  const results = [];
  for (const probe of PROBES) {
    try {
      const outcome = await probe(ctx);
      results.push(outcome);
      log(`${ICON[outcome.status] || '  ????'}  ${String(outcome.id).padStart(2)}  ${outcome.name}`);
      if (outcome.detail) log(wrap(outcome.detail));
    } catch (error) {
      results.push({
        id: results.length, name: probe.name, kind: 'error', scenarios: [],
        status: FAIL, detail: `Threw: ${error.message}`, evidence: { stack: error.stack },
      });
      log(`  FAIL      ${probe.name}`);
      log(wrap(`Threw: ${error.message}`));
    }
  }

  /* Cleanup, in reverse. */
  log('');
  log(hr('='));
  log('CLEANUP (reverse order)');
  log(hr('='));
  const cleanupFailures = args.dryRun ? [] : await cleanup.runAll();

  if (cleanupFailures.length) {
    log('');
    log('!'.repeat(78));
    log('!!  COULD NOT CLEAN UP THE FOLLOWING. They are still in the tenant:');
    for (const entry of cleanupFailures) log(`!!    ${entry.description}\n!!      ${entry.error}`);
    log('!!  Remove them by hand before re-running.');
    log('!'.repeat(78));
  }

  /* Report. */
  log('');
  log(hr('='));
  log('RESULTS BY CHANGELOG SCENARIO  ("Before this replaces a live script")');
  log(hr('='));

  /**
   * A scenario is PASS only when some probe actually demonstrated it.
   *
   * Earlier this aggregated on which probes *relate* to a scenario, which
   * reported three scenarios as proven that the run had not tested: the
   * non-USD currency scenario against a USD order, the customer-order scenario
   * while its probe skipped, and the INDI 1 scenario on an INDI 2 item. A
   * green row that means "nothing contradicted this" is worse than no row.
   */
  const byScenario = SCENARIOS.map((text, index) => {
    const number = index + 1;
    const covering = results.filter((r) => (r.scenarios || []).includes(number));
    const proving = results.filter((r) => (r.proved || []).includes(number));

    let status;
    if (!covering.length) status = 'NOT COVERED';
    else if (covering.some((r) => r.status === FAIL)) status = FAIL;
    else if (proving.length) status = PASS;
    else if (covering.every((r) => r.status === SKIP)) status = SKIP;
    else status = 'NOT PROVEN';

    return {
      number, text, status,
      probes: covering.map((r) => r.id),
      provenBy: proving.map((r) => r.id),
    };
  });

  for (const row of byScenario) {
    log(`  ${String(row.number).padStart(2)}. ${row.status.padEnd(12)} ${row.text}`);
    if (row.probes.length) {
      log(`      probes: ${row.probes.join(', ')}` +
          (row.provenBy.length ? `  (proven by ${row.provenBy.join(', ')})` : ''));
    }
  }

  const counts = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});
  log('');
  log(hr());
  log(`Probes: ${counts[PASS] || 0} pass, ${counts[FAIL] || 0} fail, ` +
      `${counts[INCONCLUSIVE] || 0} inconclusive, ${counts[SKIP] || 0} skipped.`);

  const notProven = byScenario.filter((r) => r.status === 'NOT PROVEN');
  if (notProven.length) {
    log('');
    log('NOT PROVEN — a probe ran and passed, but did not exercise this scenario.');
    log('Nothing here contradicts the documentation; nothing here supports it either:');
    for (const row of notProven) log(`  ${String(row.number).padStart(2)}. ${row.text}`);
  }

  const failed = results.filter((r) => r.status === FAIL);
  if (failed.length) {
    log('');
    log('A FAILING PROBE MEANS THE DOCUMENTED CLAIM WAS WRONG.');
    log('Correct the CHANGELOG entry rather than defending it:');
    for (const r of failed) log(`  - probe ${r.id} (${r.name})`);
  }

  const report = {
    mode: 'probes',
    at: new Date().toISOString(),
    tenant: raw.ti,
    environment: guard.declared,
    dryRun: args.dryRun,
    responseShape: ctx.responseShape || null,
    results,
    scenarios: byScenario,
    cleanup: {
      attempted: cleanup.entries.length,
      failures: cleanupFailures.map((e) => ({ description: e.description, error: e.error })),
    },
    swagger,
    transcript: client.transcript,
  };
  writeFileSync(args.out, JSON.stringify(report, null, 2));
  log(`\nWritten to ${args.out}`);

  if (args.dryRun) {
    const sent = client.transcript.filter((e) => !e.dryRun).length;
    log(`\nDry run complete. Requests printed: ${client.transcript.length}. Requests sent: ${sent}.`);
    if (sent !== 0) { log('DRY RUN LEAKED REQUESTS — this is a bug.'); return 1; }
  }

  return failed.length || cleanupFailures.length ? 1 : 0;
}

/**
 * Only runs when invoked directly, so the module can be imported by a test
 * without executing a tenant run as a side effect.
 */
if (process.argv[1] && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then(
    (code) => { process.exitCode = code; },
    (error) => {
      console.error(`\n${error.name || 'Error'}: ${error.message}`);
      process.exitCode = 1;
    }
  );
}

export { main, parseArgs, loadConfig, SCENARIOS };
