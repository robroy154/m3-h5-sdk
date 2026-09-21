# Configuration

Every tenant-specific value is a script argument. Nothing customer-specific has
a default, and an optional feature you do not configure is **skipped**, not
guessed at.

Set the arguments in **H5 Administration Tools → Script Management**, on the
shortcut that launches the script.

## Format

Comma-separated `key:value` pairs. Order does not matter, every key is
omittable, and unknown keys are logged and ignored.

```text
wms:true,whgr:WMSGROUP,maxserials:40,cfmg:EQUIPMENT,cfmf:FULLSERIAL
```

Keys are used rather than positional arguments because with a dozen optional
settings, positional degrades into runs of empty commas where a mis-ordered
value fails silently.

## Arguments

| Key | Required | Default | Meaning |
| --- | --- | --- | --- |
| `wms` | no | `false` | Warn before receiving into a WMS-managed warehouse. Off unless set: most M3 customers do not run WMS. |
| `whgr` | **only when `wms:true`** | — | MMS009 warehouse group holding the WMS warehouses. |
| `maxserials` | no | `25` | Most serials collected in one dialog. A line for more than this is refused with a message rather than partially received. |
| `cfmg` | no | — | CMS474 custom field **group**, for serials longer than 40 characters. |
| `cfmf` | no | — | CMS474 custom field **name**. Needed with `cfmg`. |
| `sqnr` | no | `1` | CMS474 sequence number. |
| `e0pa` | no | `WS` | MHS850 partner A. |
| `e0pb` | no | `WS` | MHS850 partner B. |
| `e0qa` | no | — | Partner qualifier A. Omitted entirely when unset. |
| `e0qb` | no | — | Partner qualifier B. |
| `e065` | no | `WMS` | MHS850 message type. |

### The only fatal misconfiguration

`wms:true` without `whgr`. A check against an unnamed warehouse group either
does nothing or matches the wrong warehouses, so the script refuses to start
and names the missing argument. Everything else degrades safely.

## Serial number storage

Where a vendor's serial ends up depends only on its length. The operator's
original is never discarded and never silently truncated.

| Length | `SERN` | Original stored in | Setup needed |
| --- | --- | --- | --- |
| 1–20 | the serial itself | — | none |
| 21–40 | derived `BSN…` value | `EEQN` (standard MMS240 field) | none |
| 41–60 | derived `BSN…` value | `CFMA` via CMS474 | `cfmg` + `cfmf` |
| 61+ | — | — | not supported |

`SKEY` ("search key equipment") always carries the first 20 characters of the
original, so a derived serial stays findable by what the vendor actually
printed.

**If a serial longer than 40 characters arrives and `cfmg`/`cfmf` are not set,
the receipt is refused** with a message naming the arguments. That is
deliberate: the alternative is writing a truncated serial that looks correct.
Nothing is checked at start-up, so a customer who never sees such a serial
never has to configure CMS474.

## Partner records (`e0pa`, `e0pb`, `e065`)

These three resolve the MMS865 partner record M3 uses to interpret the
warehouse message. The defaults are the record M3 ships, so no customer has to
create one. Override them together, not individually.

## What is *not* configurable, on purpose

- **Currency.** Read from the purchase order head (`PPS200MI/GetHead`).
- **Purchase date.** PO line registration date, then the head's order date.
- **Price.** Confirmed price when populated, otherwise the ordered price.
- **Whether a lot or serial number is collected.** Driven by M3's own
  `AutoLotNo()`/`ManualLotNo()` rules from the item's `INDI`, `BACD`, and the
  goods receiving method's `CRBN`/`DSTO`.
- **Whether a location is required.** Driven by direct put-away (`DSTO`) and
  the line's own default location.
- **Optional equipment fields** (supplier, manufacturer, warranty, project,
  asset tag). Populated when they resolve, omitted when they do not. There is
  no gate and no argument for them.

## Prerequisites

- M3 H5 2.0 or later.
- The user needs authority to `MHS850MI`, `PPS001MI`, `PPS200MI`, `PPS345MI`,
  `MMS200MI`, `MMS235MI`, and — for serialised items — `MMS240MI`.
- `OIS100MI` for purchase orders linked to a customer order.
- `MMS009MI` only when `wms:true`.
- `CMS474MI` only when `cfmg`/`cfmf` are configured.
