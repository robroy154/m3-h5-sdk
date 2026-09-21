# PO Receipt Shortcut (V7)

A reusable M3 H5 script that receives a purchase order line from **PPS300/B**
without leaving the panel. It reads the line, works out what M3 needs collected
for it, collects it, pre-creates equipment records for serialised items, and
posts the receipt as an MHS850 warehouse transaction.

Customer agnostic: every tenant-specific value is a script argument. See
[CONFIGURATION.md](CONFIGURATION.md).

## What it handles

| Item type | `INDI` | Behaviour |
| --- | --- | --- |
| Not lot controlled | `0` | Quantity only. |
| Lot controlled, lots need not pre-exist | `1` | Collects a lot number; creates the lot. |
| Serial controlled | `2` | Collects one serial per unit; pre-creates MMS240 equipment. |
| Lot controlled, lots must pre-exist | `3` | Collects a lot number; verifies it exists. |
| Lot controlled with serial specification | `5` | As `3`. |

Whether the operator is asked for a number at all depends on the item's
numbering method, not on the item being controlled — see
[Numbering](#numbering-and-locations).

## Deploying

1. `npm run build:poreceipt` from the repository root.
2. Upload **`POReceiptShortcutV7.js`** in H5 Administration Tools → Data Files
   → H5 Script. Never the `.ts`.
3. Attach it to PPS300/B as a shortcut and set the script arguments.
4. `Ctrl+F5` in H5 to clear the script cache.

The compiled `.js` and `.js.map` are committed so an H5 admin can deploy
without running a build.

> **Before a production deploy**, minify the `.js`. The H5 developer guide
> recommends it, and this bundle is ~132 KB unminified because it keeps its
> comments. Keep the `.ts` sources as the thing you maintain — a minified file
> cannot be debugged. The code uses `.then(success, error)` throughout and
> never `.catch()`, precisely so minifiers do not choke on the reserved word.

### Why the file name carries a version

H5 deploys by filename and requires the filename to match the class name, so
V4 and V7 cannot coexist under one name during a cutover. The suffix is forced
by the deploy model, not a naming habit — please do not "clean it up".

## Architecture

Only one file touches an H5 global. Everything else takes its dependencies by
injection, which is why 281 unit tests run with no browser and no M3 tenant.

| File | Role | H5 globals |
| --- | --- | --- |
| `src/serial-policy.ts` | Serial derivation and length rules | none |
| `src/receiving-policy.ts` | M3's `AutoLotNo`/`ManualLotNo`, `INDI`/`BACD` rules | none |
| `src/selection-policy.ts` | Which grid line the script may act on | none |
| `src/validation.ts` | Serial, lot and expiry rules | none |
| `src/errors.ts` | MI error and MHS850 status interpretation | none |
| `src/config.ts` | Script-argument parsing | none |
| `src/mi-requests.ts` | MI record construction | none |
| `src/mi-gateway.ts` | MI calls, behind an injected executor | none |
| `src/receipt-engine.ts` | Posting sequence, rollback policy | none |
| `src/presentation.ts` | Wording and theming tokens | none |
| `src/dialogs.ts` | The two form dialogs | DOM |
| `src/h5-adapter.ts` | MIService, ConfirmDialog, busy indicator, grid | **all of them** |
| `src/index.ts` | Entry class and flow | via the adapter |

## Numbering and locations

Both come from M3's own rules rather than the script's assumptions.

**Numbering** is `ManualLotNo()` as PPS300 defines it: the operator is asked
for a number only when `INDI != 0`, the numbering method is not automatic, and
neither `CRBN` nor `DSTO` is set. For automatic methods (`BACD` 1, 2, 3, 4, 6,
7) M3 generates the number and the script does not ask. Note `BACD 4` counts as
automatic in M3's grouping even though its description says "entered manually";
that is M3's rule, reproduced rather than second-guessed.

**Equipment creation** follows a *different* rule, because `MMS240MI/Add` and
PPS300 disagree — they diverge exactly on `BACD 4`:

| `BACD` | `MMS240MI/Add` |
| --- | --- |
| `0` | `SERN` required and accepted |
| `1, 2, 3, 6, 7` | `SERN` must be blank; M3 generates it. Supplying one returns `MM24031`. |
| `4, 5, 8, 9` | Refuses outright (`MM24032`). The receipt still posts; there is simply no record to pre-create. |

**Locations**: under direct put-away (`DSTO = 1`) M3 places the goods itself
and a blank location is correct. Otherwise the script uses the operator's
location, then the line's default, and only errors when one is genuinely
required and none resolves.

## Rollback

If the receipt fails, equipment records created for it are removed — CMS474
rows first, so nothing is orphaned.

If the outcome **cannot be established** (the message posted but its status
could not be read), nothing is removed and the operator is told which MHS850
message to check. Deleting equipment for a receipt that did post leaves
received stock with no serial records, which someone unpicks by hand; leaving
equipment for a receipt that did not post leaves a visible, deletable row in
MMS240.

## Testing

```bash
npm test          # 281 unit tests
npm run typecheck # sources and tests
npm run lint
```

Every MI change in this version is validated against the MI catalog only —
**no M3 tenant is reachable from CI.** See [CHANGELOG.md](CHANGELOG.md) for the
scenarios to exercise in a test environment before this replaces a live script.

## Extending

`RORC` (reference order category) is handled for `3` — customer order — which
resolves `CUNO`. Other categories (distribution, manufacturing) are a
deliberate gap. `src/index.ts::loadLine` is where the category is read; adding
one should be a branch there and a case in the tests, not a refactor.
