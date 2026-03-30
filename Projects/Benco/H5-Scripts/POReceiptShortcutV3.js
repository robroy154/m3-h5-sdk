/*─────────────────────────────────────────────────────────────────────────────
    POReceiptShortcutV3.js
    Compatibility shim that delegates to POReceiptShortcutV4
    Author: Rob Roy   Date: 30-Mar-2026
─────────────────────────────────────────────────────────────────────────────*/

var POReceiptShortcutV3 = class {
    static Init(args) {
        if (typeof POReceiptShortcutV4 !== 'undefined' && typeof POReceiptShortcutV4.Init === 'function') {
            POReceiptShortcutV4.Init(args);
            return;
        }

        if (args?.log) {
            args.log.Error('POReceiptShortcutV4 is required. Attach POReceiptShortcutV4.js to this panel.');
        }
        throw new Error('POReceiptShortcutV4 is not loaded.');
    }
};
