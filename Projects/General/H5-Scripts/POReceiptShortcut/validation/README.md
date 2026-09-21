# Tenant validation harness

The 281 unit tests assert what POReceiptShortcutV7 **sends**. This harness
asserts what M3 **accepts**. Those are different questions, and only the second
one can refute the corrections in [CHANGELOG.md](../CHANGELOG.md).

Every probe builds its request with the real builders out of `../build/`. None
re-implements a record shape — a harness that rebuilds the payload it is
testing proves only that it agrees with itself.

## Where the credentials go

Put the downloaded file here:

```text
Projects/General/H5-Scripts/POReceiptShortcut/validation/tenant.ionapi
```

`*.ionapi` is gitignored repo-wide, so it will not be committed from there. Any
other location works too — pass `--ionapi <path>`, or set `ionApiFile` in
`tenant.local.json`. Nothing outside the repo is required.

The tenant string is never written into a config file. It is read from the
`ti` field of the `.ionapi` at runtime.

## The app must be a Backend Service

ION API issues a different credential file per Authorized App type, and they
are not interchangeable. Only an app of type **Backend Service** carries the
`saak` / `sask` service-account key pair that allows a token to be fetched with
no browser. Every other type — Web Application, Native/Desktop, Hybrid — is
built around a redirect and is useless to a headless process.

In Infor ION API:

1. **Authorized Apps** → **+**
2. Type: **Backend Service**
3. Save, then **Download Credentials** with **Create Service Account** ticked.
4. Save the file as `validation/tenant.ionapi`.

The harness checks for `saak`/`sask` before it does anything else and fails
with that instruction if they are absent, rather than surfacing an opaque 401
ten steps later.

This is deliberately *not* the flow `odin login` uses. That command drives
Puppeteer through an OAuth implicit grant against a browser-facing app, which
cannot run headlessly. `RawIonApiConfig` in
`SDKs/H5 Angular/cli/src/commands/login/models.ts` does not even list
`saak`/`sask` for that reason.

## Setup

```bash
git checkout claude/adoring-mayer-nqca8e
npm ci
cp Projects/General/H5-Scripts/POReceiptShortcut/validation/tenant.example.json \
   Projects/General/H5-Scripts/POReceiptShortcut/validation/tenant.local.json
```

Then edit `tenant.local.json`: set `environment`, and fill in a PO to read. The
item fixtures come from the survey below. `tenant.local.json` is gitignored;
`tenant.example.json` is committed and must stay free of tenant values.

## Running it

```bash
# 1. Read-only scan. Run this FIRST — it finds the fixture items.
npm run validate:tenant -- --survey

# 2. Print every request, send nothing.
npm run validate:tenant -- --dry-run

# 3. The probes.
npm run validate:tenant
```

The npm script compiles first, because `build/` is gitignored and the probes
import from it.

### Survey mode

The sandbox's master data is unknown, and finding items by `INDI`/`BACD` by
hand means opening MMS001 once per item. `MMS200MI/LstItmByChgDate` returns
both and has no mandatory input, which makes an unknown tenant surveyable at
all. The survey scans it over a range of last-changed dates and buckets what it
finds into the five roles the write probes need:

| Role | Selector | Used by |
| --- | --- | --- |
| serial + manual numbering | `INDI` 2, `BACD` 0 | probe 7 |
| serial + auto numbering | `INDI` 2, `BACD` 1/2/3/6/7 | probe 8 |
| serial + `Add` forbidden | `INDI` 2, `BACD` 4/5/8/9 | probe 9 |
| lot, unregistered | `INDI` 1 | probe 11 |
| uncontrolled | `INDI` 0 | probe 11 |

It **names the empty buckets**. Those are items that have to be created in
MMS001 before the matching probes can run, and until they exist the matching
CHANGELOG scenarios stay unproven rather than quietly passing. Output is
printed ready to paste into `tenant.local.json`.

MI list transactions have no offset, so paging is done by narrowing the date
range. A window that returns exactly the record cap is reported as truncated.
`LstItmByItm`, `LstItmByItmGr` and `LstItmByProdGr` also carry `INDI`/`BACD` if
a scan needs narrowing further.

## The probes

`read` is safe · `probe` is a write **expected to fail** · `dry` is a write
that is staged and never processed.

| # | Call | Kind | What it establishes |
| --- | --- | --- | --- |
| 0 | `MNS150MI/GetUserData` | read | Auth works and the endpoint shape is what the harness expects |
| 1 | `PPS200MI/GetHead` | read | `CUCD` returns — the fix for the hardcoded `'USD'` |
| 2 | `PPS001MI/GetBasicData2` | read | All 12 `BASIC_DATA_FIELDS` return from one call |
| 3 | `PPS200MI/GetLine` | read | `RORC`/`RORN`/`PITD`/`PROD` present, `GETY` readable, `ECVE` absent even when asked for |
| 4 | `OIS100MI/GetOrderHead` | read | `CUNO` on a CO-linked PO |
| 5 | `PPS345MI/Get` | read | `CRBN`/`DSTO` — the input to M3's `ManualLotNo()` |
| 6 | `MMS009MI/Get` | read | WMS warehouse group answers cleanly |
| 7 | `MMS240MI/Add` `BACD` 0 + `SERN`, then `Del` | write | A supplied serial is accepted on manual numbering, and `Del` works — which is also the rollback path |
| 8 | `MMS240MI/Add` auto `BACD` + `SERN` | probe | Must return **MM24031** |
| 9 | `MMS240MI/Add` forbidden `BACD` | probe | Must return **MM24032** |
| 10 | `CMS474MI/DltEqInfo` vs `DelEqInfo` | probe | `DltEqInfo` reaches the transaction; `DelEqInfo` returns `TransactionNotFound` |
| 11 | `AddWhsHead` → `AddWhsPack` → `AddWhsLine` | dry | The whole write path's field acceptance, with zero inventory impact |
| 12 | `MHS850MI/LstWhsLine` | read | `MSID` and `MSGD` return, and the call is accepted with no `CONO` |

### Probe 10 uses a paired control

Calling `DltEqInfo` with a key matching nothing proves only that the call was
understood. What proves the claim is calling it **alongside** `DelEqInfo` — the
name V4 and V6 both send — and showing that one reaches the transaction while
the other does not exist. Without the control, a tenant that answered every
unknown transaction identically would look like a pass.

### Probe 11 is the highest-value one

`AddWhsHead`/`Pack`/`Line` only *stage* a warehouse message. Nothing posts
until `PrcWhsTran` runs, and `PrcWhsTran` cannot be reached (see below). So the
probe exercises every field the receipt writes — `REMK`, `RIDN`/`RIDL`/`RIDX`,
`PUUN`, `OEND`, `EXPI`, a blank `WHSL` — and moves no stock. The message is
left unprocessed in MHS850 and deleted in cleanup.

It stages **several lines**, which is not redundancy:
`buildWarehouseLineRecord` only emits `REMK` when a line has both a `BANO` and
a `WHSL`, because the field carries `Orig Loc: {WHSL}`. One line can therefore
prove that a blank `WHSL` is accepted *or* that `REMK` is accepted, never both.
Each variant reports which claim it covers, and says so explicitly when a
missing fixture means a claim was **not exercised**.

## Safety rails

These are in code, not documentation, and are covered by
[`tests/validation-guards.test.ts`](../tests/validation-guards.test.ts).

- **`PrcWhsTran` is on a deny-list checked inside the MI wrapper**, so no probe
  can reach it even by constructing the spec itself. The list also names the
  other ~25 MHS850MI transactions that post a movement directly rather than
  staging one, because several are one letter away from a transaction that *is*
  needed. A denied call throws before any request is built and is not recorded
  in the transcript.
- **The config must declare `environment` as `DEV`, `TST` or `SANDBOX`.** An
  absent or unrecognised value aborts. Independently, a `PRD` token in the ION
  API URL or tenant aborts even when the config claims otherwise — the override
  exists only as a command-line flag, so it cannot be buried in a copied file.
- **`--dry-run` prints every request and sends nothing.** The runner counts
  what was actually transmitted and reports a non-zero exit if that count is
  not zero.
- **Every probe registers its cleanup**, cleanups run in reverse at the end,
  and anything that could not be cleaned is printed in a banner naming each
  record left behind.

## Output

A PASS/FAIL table mapped to the 12 scenarios in the CHANGELOG's
"Before this replaces a live script" section, plus `validation-result.json`
with every probe's evidence and a transcript of every request. That file is
gitignored — it contains real tenant data.

Verdicts are `PASS`, `FAIL`, `SKIP` and `INCONCLUSIVE`. The last one matters:
if probe 8 expects MM24031 and gets MM24009 ("item does not exist"), the
transaction never reached the numbering-method check, so the fixture is wrong
and the claim is untested. Reporting that as a failure would send someone to
"correct" documentation that was right.

**A genuine `FAIL` means the documented claim was wrong.** Correct the
CHANGELOG entry rather than defending it.

## Notes

- No CSRF token is sent. M3 rejects one when the call is routed through ION
  API; the H5 CLI's dev proxy strips `fnd-csrf-token` and fakes the
  `/m3api-rest/csrf` response for the same reason
  (`SDKs/H5 Angular/cli/src/mtauth.cts`).
- `--swagger` fetches the MHS850MI, MMS240MI and CMS474MI metadata from the
  tenant's own catalog into the result file, so the endpoint shape is read
  rather than assumed.
- The harness normalises both the documented `results[].records[]` response
  shape and the older `MIRecord`/`NameValue` encoding, and probe 0 reports
  which one the tenant actually served.
- No new dependency. Plain Node ESM, built-in `fetch`, and a
  `module.registerHooks()` resolver that lets Node import the compiled script,
  whose `moduleResolution: "bundler"` output keeps extensionless specifiers.
