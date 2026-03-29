# Benco H5 Scripts

H5 Script SDK customizations for the Benco client. All scripts run inside M3 H5 panels via the H5 Script SDK (`SDKs/M3 H5 Scripting/`).

---

## File Status

### PO Receipt Shortcut

| File | Status | Notes |
|---|---|---|
| `POReceiptShortcutV3.js` | ✅ **Current** | Production version — use this for all edits and deployments |
| `POReceiptShortcutV2.js` | ⚠️ Superseded | Kept for rollback reference only |
| `POReceiptShortcutV2_Claude.js` | 🧪 Experimental | AI-assisted refactor of V2; not deployed |
| `POReceiptShortcut.js` | ❌ Deprecated | Original version — do not edit |
| `POReceiptShortcut_UsingConsole.js` | ❌ Deprecated | Console-based debugging variant — do not deploy |

> **When asked to update or fix the PO Receipt script, always edit `POReceiptShortcutV3.js`.**

---

### Other Scripts

| File | Status | Notes |
|---|---|---|
| `BEN_H5_AutoComplete.js` | ✅ Active | Autocomplete enhancement for M3 input fields |
| `BEN_H5_CTS100B1.js` | ✅ Active | Panel customization for CTS100 panel B1 |

---

## Development Notes

- These are plain JavaScript files — TypeScript source should be maintained separately and compiled before committing the `.js` output.
- Follow the H5 Script SDK rule: **class name must match the file name** (excluding `.js` extension).
- Deploy via M3 H5 Administration → Script Management.
- Use `Ctrl+F5` in the H5 client to clear the script cache after deploying changes.

## SDK Reference

See `SDKs/M3 H5 Scripting/Documentation/H5ScriptDevelopersGuide.md` for full API documentation.
