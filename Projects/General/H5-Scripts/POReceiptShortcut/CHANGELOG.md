# Changelog

## V7 — unreleased

First customer-agnostic release. Rebuilt from `POReceiptShortcutV6` as focused
modules with unit tests, and relocated out of the customer folder.

> **Exercised against a sandbox tenant.** 11 probes, 0 failures: 8 of the 12
> scenarios below are proven, 3 are not yet proven because the sandbox has no
> fixture for them, and 1 was skipped. No correction in the table below was
> contradicted. See [validation/README.md](validation/README.md); re-run with
> `npm run validate:tenant`.

### Corrections that change what lands in M3

Each of these was found by checking a transaction against the catalog rather
than against what the previous version did.

| Defect in V4/V6 | Correction |
| --- | --- |
| `CUCD` hardcoded to `'USD'` in `MMS240MI/Add`. V6 deleted the `PPS200MI/GetHead` call, and `CUCD` is not on `GetLine`. `Add` does no validation on it, so a non-USD tenant got **wrong currency data rather than an error**. | `GetHead` restored — it needs only `PUNO`, so it runs in the same parallel batch at no extra latency. Currency comes from the PO. |
| `ALII: this.ITDS` — `ITDS` is 60 characters, `ALII` accepts 40, and `Add` truncates **silently**. | Prefers `PITD` (30, fits), truncates only as a fallback. |
| `MMS240MI/Add` always sent a `SERN`. The transaction rejects a supplied serial for `BACD` 1/2/3/6/7 (`MM24031`) and refuses entirely for 4/5/8/9 (`MM24032`), **so equipment creation only ever worked on `BACD 0`**. | `planEquipmentCreation()` sends the serial, omits it, or skips `Add`, per numbering method. |
| `CMS474MI/DelEqInfo` — **that transaction does not exist.** The real name is `DltEqInfo`. The CMS474 half of the rollback has therefore never run: it fails as an unknown transaction, the failure is swallowed as best-effort cleanup, and the custom-field row is orphaned against a deleted serial. | `DltEqInfo`. |
| `getWhsLineFailureDetail` requested `REMK`, which `LstWhsLine` does not return, then fell through to `BREM` — a 20-char field the script itself wrote. **A failed receipt echoed the script's own "Orig Loc:" note instead of M3's error.** | Requests `MSID` and `MSGD` (78 chars, the message text) and leads with `MSGD`. |
| `BREM` carried `Orig Loc: {WHSL}` — 10 + 10 = **exactly 20**, its full width, with no headroom. | Moved to `REMK` (30). Same "Remark" semantics on the same transaction. |
| `SUNO` was validated off the screen and never written to the equipment record, though M3's own `createMILOIN` sets it. | Written. |
| No searchable link from a derived `BSN…` serial back to the vendor's. | `SKEY` carries the original, truncated to 20. |
| HTTP 400 read as "record not found". MI returns 400 for a missing record **and** for a malformed request, so a broken call read as "that serial is free" and the receipt proceeded against an unverified serial. | Only not-found wording counts. A 400 without it fails the receipt loudly. |
| `PPS001MI/GetBasicData2` was called for `RSTQ` alone. It returns 25 fields, including every numbering and location field the script needed. | Asks for the 12 it uses, on a call it was already paying for. |
| `AddWhsLine` asked for 100 records from an `Add` that returns one, and discarded the `MSLN` it does return. | Asks for one, keeps `MSLN`. |
| `result.item.EQNO` read after every `Add`. `EQNO` is an *input*; `Add` returns only `ITNO`, `SERN`, `BIRT`. It was **always null**, so every rollback log read "EQNO N/A". | Removed. Rollback keys on `ITNO` + `SERN`, which is what it always actually used. |
| `MHS850MI/LstWhsLine` was sent `CONO`. It has no `CONO` input. | Company scope is declared per transaction against the catalog. |
| `PROD` and `ECVE` were set on the equipment record during this rewrite. `MMS240MI/Add` accepts neither. | `PROD` moved to `AddWhsLine`, which does. `ECVE` has no home in either write transaction and is no longer read. |

### Behaviour

- **The operator is only asked for a lot or serial when M3 would ask.** Ported
  from PPS300's `AutoLotNo()`/`ManualLotNo()`. V6 asked on every controlled
  item regardless of numbering method — invisible where items use `BACD 0`,
  broken at the first customer who does not.
- **`INDI` 1 and 5 are handled.** V6 branched on `2`, `3` and "everything
  else", so both lot-controlled values fell through to the uncontrolled path
  and skipped lot handling entirely.
- **A blank location is normal.** Under direct put-away M3 places the goods
  itself. V6 threw whenever `WHSL` was empty.
- **An ambiguous multi-line selection is refused.** V4 and V6 read the current
  row and never look at the selection, so with three lines selected they
  receive one and report success.
- **Rollback has one trigger, not three**, and does not fire on an outcome it
  could not establish. See the README.
- **Cancelling is not an error.** V6 routed "Operation cancelled by user" into
  its error dialog.
- **The busy indicator is not held across prompts.** V6 held it for the whole
  run, contradicting its own "User interaction - NO busy" comments.
- **`InstanceCache` guards the attach**, which V6 never did.
- FRE3 follow-up prompt removed — it was a single-customer requirement.

### Configuration

Everything tenant-specific became a script argument, with no customer value as
a default: warehouse group, CMS474 custom field, partner records, serial limit.
The WMS check is off unless configured. See CONFIGURATION.md.

### Presentation

- Plain dialogs go through `ConfirmDialog`, which H5 themes itself.
- The two form dialogs resolve every colour through `var(--ids-token,
  fallback)` with V6's literal as the fallback — themed where tokens exist,
  unchanged where they do not.
- No IDS CSS is bundled. An H5 script runs inside the already-themed client;
  shipping a theme would add ~100 KB and pin the UI to one theme.
- Emoji removed from dialog titles in favour of `dialogType`.
- Dialog content is built from DOM nodes, not concatenated HTML.

### Known gaps

- `RORC` categories other than `3` (customer order) are not handled.
- `MHS850MI/AddPOReceipt` would collapse head + pack + line into one call, but
  does **not** process — its body stores `PRFL` and never acts on it, so
  `PrcWhsTran` is still required. Deferred: changing the posting mechanism of a
  script replacing a live one, on a path that cannot be exercised without a
  tenant, is not worth two saved round-trips.
- Field lengths are named constants checked against the catalog, not read from
  MI metadata at runtime.
- `LDAZD.MXMI` switches `INDIV` keying between `INNO` and `ITNO`+`BANO`
  depending on the maintenance module. Untested against a tenant with the
  alternative setting.

## Before this replaces a live script

No M3 tenant is reachable from CI. `validation/` automates the list below
against a sandbox — run `npm run validate:tenant -- --survey` first, which
finds the fixture items and names the ones that have to be created.

Exercise at minimum:

1. A non-USD purchase order (the `CUCD` fix).
2. A PO linked to a customer order (`RORC 3` → `CUNO`).
3. A serialised item with `BACD 0` (serial supplied).
4. A serialised item with `BACD` 1, 2, 3, 6 or 7 (serial generated).
5. A serialised item with `BACD` 4, 5, 8 or 9 (equipment creation skipped,
   receipt still posts).
6. A serial of 21–40 characters (`EEQN`) and one over 40 (CMS474, and the
   refusal when `cfmg`/`cfmf` are absent).
7. A lot-controlled item with an expiry date.
8. An `INDI 1` item, where the lot does not pre-exist.
9. A non-material line.
10. An item under direct put-away, with no location entered.
11. A WMS warehouse with `wms:true`.
12. A deliberate failure after equipment creation, to watch the rollback.

### Confirmed against a tenant

Run on a sandbox with `npm run validate:tenant`. Proven live:

- **`MMS240MI/Add` refuses a supplied `SERN` with `MM24031`** for `BACD`
  1/2/3/6/7, and **refuses outright with `MM24032`** for `BACD` 4/5/8/9. Both
  reproduced on real items. This is the defect that meant equipment creation
  only ever worked on `BACD 0`, and `planEquipmentCreation()` is correct.
- **`CMS474MI/DltEqInfo` exists and `DelEqInfo` does not.** `DltEqInfo`
  answered HTTP 200 with the business error `WIT0103` — so it executed and got
  as far as validating the key — while `DelEqInfo`, the name V4 and V6 send,
  was rejected outright with HTTP 400. The CMS474 half of the rollback has
  never run.
- **`MHS850MI/LstWhsLine` returns `MSID` and `MSGD`, does not return `REMK`,
  and accepts a call carrying no `CONO`.** All three corrections confirmed in
  one call.
- **`MMS240MI/Add` stores what it is sent.** The record is read back with
  `GetBasic`: `ALII`, `SKEY`, `CUCD`, `PUNO`, `PNLI`, `PNLS`, `STAT`, `PUPR`
  and `OWTP` all came back byte-identical, so none is being silently truncated
  or ignored. `EQNO` was not returned, as stated above. `Del` then removed the
  record, so the rollback path works.
- **The staged write path accepts every field the receipt writes** —
  `RIDN`/`RIDL`/`RIDX`, `PUUN`, `OEND`, `REMK`, `EXPI`, and a blank `WHSL` —
  across three lines on one message, with no stock movement.

### Error messages name the code AND say what it means

A failed receipt reported whatever the MI response happened to carry, which is
often a bare code: `MSGD` is blank on a message that has not been processed,
several transactions report a code with no text at all, and `MSGD` is 78
characters so longer messages arrive cut off. `WPU0201` is not something a
clerk can act on, and it is not something the person they escalate to can act
on either.

`src/mi-messages.ts` holds **272 M3 message IDs with Infor's own text**,
generated by `validation/tools/extract-mi-messages.mjs` from the M3 sources for
`MHILINPI`, `MHIHEDPI`, `MHIPACPI`, `MHS870`, `PPS300BE`, `MHS850MI`,
`MMS235MI`, `MMS240MI`, `CMS474MI` and `PPS001MI` — the line, header and
package engines, the posting engine and PO-receipt business engine that
`PrcWhsTran` routes through, the transaction API, the lot master, equipment and
the PO read path. So `WPU0201` now reads *Purchase order U/M is invalid*.

M3's own text still wins wherever it sent any; the catalogue fills the gap and
is suppressed when it would only repeat what M3 already said.

**The catalogue is scoped to what these transactions can actually raise.** An
unscoped sweep of the same sources yields 363 codes; most of the surplus is
reachable only from transactions this script never calls. Two cuts, both
mechanical rather than judged:

- **Call reachability.** Each program's `isTransaction` dispatch is followed
  from the six transactions we call, through calls within the file. `MMS240MI`
  has 83 methods and we reach 21; `MHS850MI` has 111 and we reach 33;
  `PPS001MI` has 93 and we reach 6.
- **Qualifier.** We stage `QLFR` `'20'`. A block whose condition consists
  *entirely* of `QLFR.EQ(…)` terms, none of them ours, cannot run for our lines.
  The all-terms rule is deliberate — a condition mixing `QLFR` with anything
  else, or using `NE`, stays in scope.

Message *text* is still harvested from every line of every source, because a
code means the same thing wherever it is raised and the wording often lives on
a site we do not reach: `WIND401`'s text is on `MMS235MI/LstItmLot`, while
`MMS240MI/Add` raises it with no comment at all.

Two traps the generator handles, which reading the source casually does not:

- **Twelve comments name a different ID than the code raised.** `MHILINPI`
  comments `MSGID=MH85010` and raises `MH85210`; `MMS240MI` comments
  `MSGID=WOWTP06` and raises `WOWTP01`. The code that is *raised* is what
  arrives in a response, so that is the key the text hangs off.
- **A code can carry several wordings.** `WIT0101` has three. The most frequent
  is primary and the rest are kept, so a response matching any of them is still
  recognised rather than being treated as unexplained.

The built asset is 131,971 bytes, up from 110,989 before any of this — the
catalogue costs about 21 KB rather than the 40 KB an unscoped sweep cost.

84 further codes are reachable with no message text anywhere in the available
sources, so those stay unexplained. `PPS200MI`, `MMS200MI`, `PPS345MI`,
`OIS100MI`, `MMS009MI`, `PPS360` and `PPS365` are not among the sources
available either.

### Corrected: two "lock" codes that were never lock codes

`isTransientProcessLock` decides whether `PrcWhsTran` is retried. V6 listed two
error codes as retryable, both carried into V7 unexamined:

- **`WPU0901` is not a lock.** Infor's text is *Lowest status - purchase order
  &1 is invalid* — a permanent rejection that no retry can clear. Retrying it
  spent the retry budget and delayed the error the clerk needed to see.
- **`M3LOCK` is not an M3 message ID.** Nothing in the sources raises it, and it
  does not match the format M3 uses.

The real code is **`XO_1130`** (*Please try again later*), which `MHS870` raises
when its receiving-number lock times out during put-away — the one genuinely
retryable failure on this path. That is now the only code in the list. The
keyword and HTTP 409/503 checks are unchanged.

### Removed: the same sentence printed twice

When M3 sent a bare code, the catalogued text became the headline *and* was
appended again as `• Means:`, because the suppression check compared against
`errorMessage`, which was empty. It now compares against the headline actually
used. `describeLineFailure` had the matching bug from the other direction: it
compared `MSGD` to the catalogue by equality, and since `MSGD` is M3's
filled-in text it never equals the `&1` template, so both wordings printed. Both
now go through `messageMatchesCatalogue`.

`errors.ts` also carried two tables keyed by the same MHS850 status — one for
labels, one for advice — plus a third hard-coded list of the statuses worth a
line lookup, which disagreed with the advice table about statuses 25 and 30.
These are now one table, and line detail is shown whenever the caller found any
rather than for a hand-picked subset.

### Found while validating

Two constraints on `MHS850MI/AddWhsLine` that the MI catalog does not state.
V7 already satisfies both, but neither was known when it was written:

- **`RIDN` is mandatory in practice.** A line without it is refused with
  `WRI0102 Order number must be entered`, although the catalog marks only
  `WHLO`, `MSGN`, `PACN` and `QLFR` as mandatory.
- **The item must match the referenced PO line.** With a `RIDN` present, a
  line whose `ITNO` is not the item on that PO line is refused with
  `WIT0101 Item number &1 is invalid` — which reads like "this item does not
  exist" and is not that at all.

`OWTP` is written as `'0'`, and the tenant stored it unchanged. That is not
evidence it is right: `MMS240MI_MVX.java` guards owner type with
`!OWTP.NE("O") && !OWTP.NE("R") && ...`, which reduces to *equals all five of
O, R, L, U and I at once* and can never be true, so `Add` never validates the
field. `'0'` is outside the set the source names, and M3 accepts it in silence
— the same failure mode as the `CUCD` defect. Left as written pending a
decision on the intended value.

### Not yet proven

The sandbox has no fixture for these, so they remain untested rather than
confirmed:

1. **A non-USD purchase order.** Every PO reachable was in USD, so the `CUCD`
   fix ran but could not be distinguished from the hardcoded `'USD'` it
   replaced.
2. **A PO linked to a customer order.** No `RORC 3` line was available, so the
   `CUNO` path never ran.
8. **An `INDI 1` item whose lot does not pre-exist.** `AddWhsLine` requires the
   item to match its PO line, and no PO for an `INDI 1` item was available. The
   `REMK` correction was proven on an `INDI 2` line instead.

Scenario 11 (a WMS warehouse) was skipped: the WMS check is off unless
configured, in the script and in the harness alike.

## Earlier versions

`POReceiptShortcutV4` is the live script and stays frozen in
`Projects/Benco/H5-Scripts/` as the rollback path. V1, V2, V3 and V5 are in
`archive/` there. V6 was never released.

One note for whoever reads V4: it sends `ALFM: '1'` to `MMS200MI/GetItmBasic`,
whose actual input is `AFLM`. Transposed, non-mandatory, therefore silently
ignored. Not worth patching a frozen script.
