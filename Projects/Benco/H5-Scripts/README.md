# Benco — H5 Scripts

Customer-specific H5 Script customizations. All of these run inside M3 H5
panels and deploy via H5 Administration Tools → Data Files → H5 Script.

Reusable, customer-agnostic scripts live in
[`Projects/General/H5-Scripts/`](../../General/H5-Scripts/) instead.

SDK reference: `SDKs/M3 H5 Scripting/`

---

## File status

### PO Receipt Shortcut

| File | Status | Notes |
| --- | --- | --- |
| `POReceiptShortcutV4.ts` | ✅ **Live — frozen** | Deployed in production. The rollback path. Do not change it. |
| `POReceiptShortcutV6.ts` | 🚧 Superseded, never released | The working draft that V7 was built from. Kept for reference while V7 is validated. |
| `archive/POReceiptShortcutV5.ts` | 📦 Archived | |
| `archive/POReceiptShortcutV3.ts` | 📦 Archived | Was a shim delegating to V4. |
| `archive/POReceiptShortcutV2.ts` | 📦 Archived | |
| `archive/POReceiptShortcutV2_Claude.js` | 📦 Archived | AI-assisted refactor of V2; never deployed, no `.ts`. |
| `archive/POReceiptShortcut.ts` | 📦 Archived | The original. |
| `archive/POReceiptShortcut_UsingConsole.js` | 📦 Archived | Debug variant, no `.ts`. |

> **New work on the PO receipt flow goes to
> [`Projects/General/H5-Scripts/POReceiptShortcut/`](../../General/H5-Scripts/POReceiptShortcut/)**,
> which is the customer-agnostic V7. V4 stays frozen here until V7 has been
> exercised against a test tenant — see that asset's `CHANGELOG.md` for the
> scenarios to cover.
>
> If V4 genuinely has to be patched before then, edit `POReceiptShortcutV4.ts`
> and recompile. **Never edit a `.js` directly** — it is generated.

### Other scripts

| File | Status | Notes |
| --- | --- | --- |
| `BEN_H5_AutoComplete.ts` | ✅ Active | Autocomplete for M3 input fields. |
| `BEN_H5_CTS100B1.ts` | ✅ Active | Panel customization for CTS100 panel B1. |
| `AddLotControlColumn.ts` | 🧪 Experimental | Adds a lot-control column to a list panel. |
| `AddLotControlColumn_v2.ts` | 🧪 Experimental | Batched, cached rewrite of the above. Neither is deployed. |

---

## TypeScript workflow

`.ts` files are the **source of truth**. The `.js` and `.js.map` beside them
are compiled output — never edit them.

```bash
npm run build:h5     # from the repository root
```

That runs `tsc --project Projects/Benco/H5-Scripts/tsconfig.json`, which
compiles every `.ts` in this folder in place. `archive/` is not included.

Both `.ts` and `.js` are committed so an H5 admin can deploy without running a
build.

## Deploying

Upload the compiled `.js` to H5 Administration Tools → Data Files → H5 Script.
Never the `.ts`. Then `Ctrl+F5` in the H5 client to clear the script cache.

Minify before a production deploy, and keep the `.ts` in version control — a
minified file cannot be debugged.

## Local type augmentations

`typings/h5.script.d.ts` is a copy of the SDK baseline with one change:
`declare module infor.companyon` became `declare namespace`, because TypeScript
5+ rejects `module` for a dotted name. The `SDKs/` tree is vendored and is
never modified, which is why this is a copy.

`typings/h5.benco.d.ts` merges in members present in the H5 2.0+ runtime but
missing from that baseline — `IActiveGrid.setData()`,
`getPosFieldElement()`, `IInstanceController.ShowBusyIndicator()` /
`HideBusyIndicator()`, and `ScriptUtil.version`.

This is not a staleness problem: the vendored SDK is current. Infor's `.d.ts`
has simply never declared several APIs that the developer guide documents. See
the "Type Definitions" section of the root `AGENTS.md`.

## Development notes

- **Class name must match the file name**, excluding the extension.
- **Declare the top-level class as `var ClassName = class { ... }`** — with
  `const` or `let` the H5 loader cannot find the class and the script fails to
  load silently, with no error.
- **Use `.then(onSuccess, onError)`**, never `.catch()` — `catch` is a reserved
  word and some M3 minifiers break on the member form.

Full rules: the root [`AGENTS.md`](../../../AGENTS.md), which is the single
source of truth.

## SDK reference

- API guide: `SDKs/M3 H5 Scripting/Documentation/H5ScriptDevelopersGuide.md`
- Samples: `SDKs/M3 H5 Scripting/Samples/Samples/`
