# Changelog

## V7 — unreleased

First customer-agnostic release. Rebuilt from `POReceiptShortcutV6` as focused
modules with unit tests, and relocated out of the customer folder.

> **Not yet exercised against an M3 tenant.** Every MI change below is
> validated against the MI catalog and Infor's PPS300/MHS850MI/MMS240MI source
> only. See [Before this replaces a live script](#before-this-replaces-a-live-script).

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

No M3 tenant is reachable from CI, so exercise at minimum:

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

## Earlier versions

`POReceiptShortcutV4` is the live script this asset replaces. It stays frozen in
the originating customer's project folder under `Projects/`, as the rollback
path, alongside an `archive/` holding V1, V2, V3 and V5. V6 was never released.

One note for whoever reads V4: it sends `ALFM: '1'` to `MMS200MI/GetItmBasic`,
whose actual input is `AFLM`. Transposed, non-mandatory, therefore silently
ignored. Not worth patching a frozen script.
