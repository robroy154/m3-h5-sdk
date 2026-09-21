"use strict";
/*─────────────────────────────────────────────────────────────────────────────
    POReceiptShortcutV3.ts
    Compatibility shim that delegates to POReceiptShortcutV4
    Author: Rob Roy   Date: 30-Mar-2026
─────────────────────────────────────────────────────────────────────────────*/
var POReceiptShortcutV3 = /** @class */ (function () {
    function class_1() {
    }
    class_1.Init = function (args) {
        if (typeof POReceiptShortcutV4 !== 'undefined' && typeof POReceiptShortcutV4.Init === 'function') {
            POReceiptShortcutV4.Init(args);
            return;
        }
        if (args === null || args === void 0 ? void 0 : args.log) {
            args.log.Error('POReceiptShortcutV4 is required. Attach POReceiptShortcutV4.js to this panel.');
        }
        throw new Error('POReceiptShortcutV4 is not loaded.');
    };
    return class_1;
}());
//# sourceMappingURL=POReceiptShortcutV3.js.map