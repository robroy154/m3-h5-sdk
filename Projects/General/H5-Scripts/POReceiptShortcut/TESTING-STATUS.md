# V7 testing status

Where H5 testing on **ICSGDENA002_TST** stopped, and what is still unproven.

Last updated 2026-09-21, at commit `be0a754`.

> The bundle in `dist/` is **two fixes ahead of anything that has run in H5**.
> The last thing tested was the serial dialog on PO 2007775, and it failed.
> That failure is fixed but unverified — start there.

## Deploy before testing anything

| File | Size | Use |
| --- | --- | --- |
| `POReceiptShortcutV7.js` | ~138 KB | TST, and anything you need to debug |
| `dist/POReceiptShortcutV7.js` | ~65 KB | production |

Upload in H5 Administration Tools → Data Files → H5 Script, then **Ctrl+F5**.
Without the cache clear you are testing the previous bundle. No script
arguments are needed on this tenant: the `AddWhsHead` partner record is
`E0PA=WS`, `E0PB=WS`, `E065=WMS`, which are the script's built-in defaults.

The minified bundle has never been deployed. Its global declaration, `Init`
static, catalogue keys and MI program names were checked mechanically and it
parses, but nothing has run it in H5.

## Confirmed working in H5

| Behaviour | Evidence |
| --- | --- |
| The entered `RVQA` is received, not the whole line | PO 2007774 line 001: entered 5 against Remain 50, `RSTQ` went 50 → 45 |
| The shortcut runs more than once per panel | Two receipts on one panel, transaction 123 then 124 |
| The serial dialog opens for `BACD 0` | PO 2007775 line 010, item 651103 |
| Read phase is not the slow part | 208–244 ms total; the four reads run in parallel (129/134/138/171 ms) plus `PPS345MI/Get` at 52–72 ms |

## Fixed but NOT verified in H5

Everything here is committed, built and unit-tested. None of it has been run
against M3.

1. **OK on the serial dialog was discarding the serials.** The handler closed
   the dialog before resolving, and `close()` fires H5's cancel callback
   synchronously. Three typed serials were thrown away and the log read
   "Receipt cancelled by the operator". This is why PO 2007775 never completed.
   `promptLot` had the same ordering.
2. **Collection is gated on `BACD 0`** (`operatorSuppliesNumber`). Two earlier
   gates were wrong — see the CHANGELOG section "Which BACD asks the operator
   for a number".
3. **Enter** advances through the serial fields and submits on the last. This is
   the barcode-scanner path and is worth testing with an actual scanner.
4. **Right-click paste** in the dialog inputs.
5. **Stepped progress dialog** while posting, replacing the bare spinner.
   Escape is disabled on it.
6. **Generate serials** and **Copy PO number** buttons. Generate is offered
   only for `BACD 0`.
7. **BACD-aware wording** — "assigned by M3" for the automatic methods, "not
   entered at goods receipt (numbering method N)" for 4, 5, 8 and 9.
8. **Over-receipt warning.** Enter more than the line has outstanding and a
   confirmation should appear. Never triggered.

## Never tested

**The blocker.** Does M3 accept a *supplied* serial under `CRBN=1 DSTO=1`?
PO 2007775 is `BACD 0` under receiving method `A11`, which is direct put-away.
The script now collects a serial and posts it as `BANO`. `AddWhsLine` accepts
`BANO` (proven by the harness), but nothing has driven `PrcWhsTran` on this
combination. If it is rejected, the error should name the code and explain it —
capture that text. **Start here: PO 2007775 line 010, `RSTQ` 5.**

| Path | Why it is unproven | What it needs |
| --- | --- | --- |
| Lot entry and the expiry date field | Every line tested was either automatic or direct put-away | A lot item (`INDI` 1/3/5) with `BACD 0`, under a receiving method with `CRBN≠1` and `DSTO≠1`. On this tenant: `004`, `CR1`, `CR2`, `GR4`–`GR7`, `OH2`–`OH7`, `PO1`, `RQP`. `F20`, `GR1` and `A11` all fail both conditions |
| `BACD 4` | No item found | M3's help says the goods receiving number is "generated during goods receipt, but this must be entered manually". PPS300 resolves that by defaulting `BANO` to the receiving number; this script has no `CCREPN` and posts blank. Reasoned from source, never run |
| Non-USD purchase order | Every PO tested was USD | The `CUCD` fix — CHANGELOG scenario 1 |
| PO linked to a customer order | No linked PO tested | `RORC 3` → `CUNO` — scenario 2 |
| `INDI 1` lot that does not pre-exist | Not reached | Scenario 8 |
| WMS warehouse | Off unless configured | `wms:true` plus `whgr` — scenario 11 |
| Equipment rollback | No failure induced after equipment creation | Scenario 12. A `BACD 0` serial that already exists should do it |
| `maxserials` refusal | Not attempted | A line for more than 25 units on a `BACD 0` serialised item |
| Posting duration | No receipt has completed since the timing log was added | The `Posting took Nms` line. Lines post sequentially, one round trip each, so this is where the reported slowness most likely is |

## Known-good test data

Warehouse `001`, facility `A01`.

| PO | Line | Item | `INDI`/`BACD` | `GRMT` | `RSTQ` now | Use |
| --- | --- | --- | --- | --- | --- | --- |
| 2007775 | 010 | 651103 Fuel Pump | 2 / 0 | `A11` | **5** | The blocker above. Serial entry |
| 2007774 | 001 | Y21002 | 3 / 6 | `F20` | 45 | Automatic numbering, confirm-only |
| 2007773 | 001 | Y21002 | 3 / 6 | `F20` | 0 | Exhausted by the `RVQA` bug. Not reusable |

Harness fixtures, in `validation/tenant.local.json`: PO 2007029 line 1, warehouse
`WEA`, location `LA`, facility `A01`; items `TIN001-1` (2/0), `TIN001` (2/1),
`000120` (2/5), `ART0099` (INDI 1), `TIN` (INDI 0).

## The harness

`npm run validate:tenant` — 11 pass, 0 fail, 2 skipped. It exercises the MI
contract and never calls `PrcWhsTran`, so it cannot tell you the UI works and
no stock ever moves through it. `--dry-run` sends nothing. Three CHANGELOG
scenarios report NOT PROVEN, which is the harness being honest about the gaps
in the table above, not a failure.

## Commits in this round

```
be0a754  Gate number collection on BACD 0, per M3's own field help
06787a1  Offer "Generate serials" only where BACD accepts a supplied one
2109478  Restore the V6 interaction behaviour the rewrite dropped
31abbf8  Emit a minified production bundle
a6b390c  Resolve the dialog before closing it, not after
f33d338  Collect the serial when BACD says manual, whatever the receiving method
467b63e  Stop printing a bare 'Lot:' when M3 assigns the number
23eafd9  Time every MI call in the debug log
1fa141d  Receive the entered quantity, and let the shortcut run more than once
```

361 unit tests, lint and typecheck clean. Note that the unit tests do not cover
`index.ts` or `dialogs.ts` beyond `settleOnce` — those need H5 globals and a
DOM, so the interaction behaviour in "Fixed but NOT verified" rests on reading
the code, not on a test.

## If something is wrong

`POReceiptShortcutV6.ts` in `Projects/Benco/H5-Scripts` is the script running
in production. Where V7 and V6 disagree, V6 is probably right — three bugs this
round came from V7 inventing logic V6 never had. Check it before reasoning from
the M3 sources.
