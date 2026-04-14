# Benco — H5 Scripts

H5 Script SDK customizations for Benco. All scripts run inside M3 H5 panels and are deployed via M3 H5 Administration → Script Management.

SDK reference: `SDKs/M3 H5 Scripting/`

---

## File Status

### PO Receipt Shortcut

| File | Status | Notes |
| --- | --- | --- |
| `POReceiptShortcutV4.js` | ✅ **Current** | Production version — use this for all edits and deployments |
| `POReceiptShortcutV3.js` | ℹ️ Compatibility shim | Delegates to V4 for backward compatibility |
| `POReceiptShortcutV2.js` | ⚠️ Superseded | Kept for rollback reference only |
| `POReceiptShortcutV2_Claude.js` | 🧪 Experimental | AI-assisted refactor of V2; not deployed |
| `POReceiptShortcut.js` | ❌ Deprecated | Original version — do not edit |
| `POReceiptShortcut_UsingConsole.js` | ❌ Deprecated | Console-based debugging variant — do not deploy |

> **When asked to update or fix the PO Receipt script, always edit `POReceiptShortcutV4.js`.**

### Other Scripts

| File | Status | Notes |
| --- | --- | --- |
| `BEN_H5_AutoComplete.js` | ✅ Active | Autocomplete enhancement for M3 input fields |
| `BEN_H5_CTS100B1.js` | ✅ Active | Panel customization for CTS100 panel B1 |

---

## TypeScript Workflow

`.ts` files are the **source of truth**. The `.js` and `.js.map` files in this directory are compiled output — never edit them directly.

### Compile

From the repo root:

```bash
npm run build:h5
```

This runs `tsc --project Projects/Benco/H5-Scripts/tsconfig.json` and overwrites the `.js` files in place.

### Source files

| Source | Compiled output |
| ------ | --------------- |
| `AddLotControlColumn.ts` | `AddLotControlColumn.js` |
| `AddLotControlColumn_v2.ts` | `AddLotControlColumn_v2.js` |
| `BEN_H5_AutoComplete.ts` | `BEN_H5_AutoComplete.js` |
| `BEN_H5_CTS100B1.ts` | `BEN_H5_CTS100B1.js` |
| `POReceiptShortcut.ts` | `POReceiptShortcut.js` |
| `POReceiptShortcutV2.ts` | `POReceiptShortcutV2.js` |
| `POReceiptShortcutV3.ts` | `POReceiptShortcutV3.js` |
| `POReceiptShortcutV4.ts` | `POReceiptShortcutV4.js` |
| `POReceiptShortcutV5.ts` | `POReceiptShortcutV5.js` |

### Local type augmentations

`typings/h5.benco.d.ts` extends the SDK's `h5.script.d.ts` with members present in the H5 2.0+ runtime but missing from the Templates baseline:

- `IActiveGrid.setData()` and `IActiveGrid.getPosFieldElement()`
- `IInstanceController.ShowBusyIndicator()`, `.HideBusyIndicator()`, `.GetValue()`, `.PressKey()`
- `ScriptUtil.version`

`typings/h5.script.d.ts` is a local copy of the SDK baseline with one fix: `declare module infor.companyon` → `declare namespace infor.companyon` (TypeScript 5.8 rejects the deprecated `module` syntax for dotted names).

### Deploy

Always deploy the compiled `.js` to H5 Administration → Script Management — **never the `.ts` source**. Both `.ts` and `.js` files are committed to version control so H5 admins can deploy without running a build.

Use `Ctrl+F5` in the H5 client to clear the script cache after deploying changes.

## Development Notes

- **Class name must match the file name** (excluding `.js`) — required by the H5 runtime.
- The top-level class must be declared as `var ClassName = class { ... }` in the `.ts` source. TypeScript compiles this to `var ClassName = (function() { ... }())` (IIFE), which satisfies the H5 loader's `var` requirement.
- Use `.then(onSuccess, onError)` two-argument form for Promise error handling — never `.catch()` (reserved word issue in some M3 minifiers).

## SDK Reference

- Full API: `SDKs/M3 H5 Scripting/Documentation/H5ScriptDevelopersGuide.md`
- Sample scripts: `SDKs/M3 H5 Scripting/Samples/Samples/`
