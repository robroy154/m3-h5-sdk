"use strict";
/*─────────────────────────────────────────────────────────────────────────────
    POReceiptShortcutV4.js
    H5 script for PO receipt processing with extended serial support
    Author: Rob Roy   Date: 02-Dec-2025
    Version: 8.0

  FEATURES
  • H5 SDK compliance using H5ControlUtil.H5Dialog API
  • Promise-based MI service calls with comprehensive error handling
  • Enhanced error messages with errorCode:errorMessage format
  • Retry logic with exponential backoff for transient lock/busy errors
  • Proper H5 logging patterns following SDK guidelines
  • Dialog implementation with version fallback
  • Serial policy: <=20 chars stays as-is in SERN and CFMA; >20 chars gets BSN epoch-derived SERN with original kept in CFMA
  • Single pack with multiple lines for INDI = 2 (PACN = PUNO_PNLI), single pack otherwise
  • Pushes only one PrcWhsTran (message-level)
    • "T for today" shortcut in Expiration date input with validation (today is not allowed)
  • Auto-generate sequential serial numbers (PO-1, PO-2, etc.)
  • Scrollable serial input dialog (handles 1-25 serials)
  • Consistent error reporting and user feedback
  • Transaction rollback for equipment records on failure
─────────────────────────────────────────────────────────────────────────────*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/*──────────────────────────────────────────────────────────────────────────*/
var POReceiptShortcutV4 = /** @class */ (function () {
    function class_1(args) {
        // Initialize base properties following H5 SDK patterns
        this.typeName = 'POReceiptShortcutV4';
        // Event namespace for safe attach/remove lifecycle handling
        this.eventNamespace = '.poReceiptV4';
        this.dialogInstanceIdCounter = 0;
        // Use appropriate MIService version based on H5 compatibility
        this.mi = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;
        this.ctrl = args.controller; // H5 controller for UI interactions
        this.log = args.log; // H5 logging service
        // Capture user context for downstream MI calls (company/division are needed for CMS474MI)
        try {
            var userContext = typeof ScriptUtil.GetUserContext === 'function'
                ? ScriptUtil.GetUserContext()
                : {};
            this.userContext = userContext || {};
            this.company =
                this.userContext.CurrentCompany || this.userContext.CONO || '';
            this.division =
                this.userContext.CurrentDivision || this.userContext.DIVI || '';
        }
        catch (e) {
            // User context capture failed; continue with empty values
            var errorMessage = (e === null || e === void 0 ? void 0 : e.message) || e;
            this.log.Warning("User context capture failed: ".concat(errorMessage));
            this.userContext = {};
            this.company = '';
            this.division = '';
        }
        // Serial handling configuration
        this.maxSerialInputLength = 60; // Allow up to 60 characters from the operator
        this.derivedSerialLength = 19; // MMS240 upper limit: BSN(3) + MM(2) + DD(2) + YY(2) + hh(2) + mm(2) + ss(2) + hash(4) = 19 chars
        this.derivedSerialPrefix = 'BSN'; // Epoch serial prefix (BSN = batch serial number)
        this.hashSuffixLength = 4; // Hash suffix to guarantee uniqueness across runs
        this.epochSeed = null; // Lazily generated once per batch for deterministic hashing
        // CMS474 custom field configuration (full serial storage)
        this.customFieldConfig = {
            enabled: true,
            group: 'EQUIPMENT', // Custom field group
            field: 'FULLSERNUM', // Custom field identifier
            sequenceNum: '1', // Sequence number
            valueField: 'CFMA', // CFMA holds the original serial
        };
        // Log initialization following SDK patterns
        this.log.Info('POReceiptShortcutV4 initialized successfully');
    }
    class_1.Init = function (args) {
        // Entry point: Initialize script (supports fallbacks for < 2.0)
        try {
            var self_1 = new POReceiptShortcutV4(args);
            self_1.busy(true); // Show loading indicator during processing
            // Execute main workflow with cleanup regardless of success/failure
            self_1.run().finally(function () { return self_1.busy(false); });
        }
        catch (error) {
            if (args === null || args === void 0 ? void 0 : args.log) {
                args.log.Error("POReceiptShortcutV4 initialization failed: ".concat(error.message || error));
            }
            // Re-throw so H5 system knows there was an error
            throw error;
        }
    };
    Object.defineProperty(class_1.prototype, "isNonMaterial", {
        get: function () {
            return this.INDI === '0' && this.TPCD === '13';
        },
        enumerable: false,
        configurable: true
    });
    class_1.prototype.applyCompanyContext = function (record) {
        if (this.company) {
            record.CONO = this.company;
        }
        return record;
    };
    class_1.prototype.applyCompanyDivisionContext = function (record) {
        this.applyCompanyContext(record);
        if (this.division) {
            record.DIVI = this.division;
        }
        return record;
    };
    class_1.prototype.getTransactionStatusDescription = function (transactionStatus) {
        var statusDescriptions = {
            10: 'Entered',
            15: 'Error on message header',
            20: 'Header validated, no errors',
            25: 'Error on message packages/IDs',
            30: 'Package/ID validated, no errors',
            35: 'Error on message lines/instructions',
            40: 'Line/instructions validated, no errors',
            45: 'Error from business component',
            90: 'Processed, no errors',
            92: 'Processed, test message, no update performed',
            99: 'Archived',
        };
        return statusDescriptions[transactionStatus] || 'Unknown status';
    };
    class_1.prototype.getWhsLineFailureDetail = function (packNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, items, failingLine, detailLines, lineMessage, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'MHS850MI';
                        request.transaction = 'LstWhsLine';
                        request.maxReturnedRecords = 25;
                        request.outputFields = [
                            'MSLN',
                            'STAT',
                            'ITNO',
                            'BANO',
                            'REMK',
                            'BREM',
                            'PACN',
                        ];
                        request.record = this.applyCompanyContext({
                            MSGN: this.MSGN,
                            PACN: packNumber,
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mi.executeRequest(request)];
                    case 2:
                        response = _a.sent();
                        items = [];
                        if (Array.isArray(response === null || response === void 0 ? void 0 : response.items)) {
                            items = response.items;
                        }
                        else if (response === null || response === void 0 ? void 0 : response.item) {
                            items = [response.item];
                        }
                        failingLine = items.find(function (item) { return (item === null || item === void 0 ? void 0 : item.STAT) && item.STAT !== '90'; }) || items[0];
                        if (!failingLine) {
                            return [2 /*return*/, ''];
                        }
                        detailLines = [];
                        lineMessage = failingLine.REMK || failingLine.BREM || '';
                        if (lineMessage)
                            detailLines.push(lineMessage);
                        if (failingLine.MSLN)
                            detailLines.push("Line no: ".concat(failingLine.MSLN));
                        if (failingLine.ITNO)
                            detailLines.push("Item: ".concat(failingLine.ITNO));
                        if (failingLine.BANO)
                            detailLines.push("Lot/Serial: ".concat(failingLine.BANO));
                        return [2 /*return*/, detailLines.join('\n')];
                    case 3:
                        error_1 = _a.sent();
                        this.log.Warning("getWhsLineFailureDetail: Unable to read line diagnostics for message ".concat(this.MSGN, ": ").concat(error_1.message || error_1));
                        return [2 /*return*/, ''];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype._getTroubleshootingInfo = function (transactionStatus, packNumber, lineFailureDetail) {
        if (lineFailureDetail === void 0) { lineFailureDetail = ''; }
        switch (transactionStatus) {
            case '10':
                return 'Warehouse transaction message was created but has not been validated yet.';
            case '15':
                return 'Header validation failed. Check MHS850 for the header error.';
            case '20':
                return 'Header validated, but package processing did not start. Check MHS850 for the message details.';
            case '25':
                return 'Package validation failed. Check MHS851 for the package error.';
            case '30':
                return 'Package validated, but line processing did not complete. Check MHS851 for the package details.';
            case '35':
                return [
                    'Line validation failed. Check MHS851 for the failing line.',
                    lineFailureDetail,
                ]
                    .filter(Boolean)
                    .join('\n');
            case '40':
                return [
                    'Lines validated, but downstream processing did not finish. Check MHS851 for the failing line.',
                    lineFailureDetail,
                ]
                    .filter(Boolean)
                    .join('\n');
            case '45':
                return [
                    'Business validation failed during receipt processing.',
                    lineFailureDetail,
                ]
                    .filter(Boolean)
                    .join('\n');
            case '92':
                return 'The transaction ran in test mode, so no inventory update was performed.';
            case '99':
                return 'The warehouse transaction message is archived.';
            default:
                return "Warehouse transaction ended in status ".concat(transactionStatus, ". Check MHS850/MHS851 for details.");
        }
    };
    class_1.prototype._resolveDialog = function (dialogContent, resolve, dialogModel) {
        if (dialogModel === void 0) { dialogModel = null; }
        try {
            if (ScriptUtil.version >= 2.0 &&
                dialogModel &&
                typeof dialogModel.close === 'function') {
                dialogModel.close(true);
            }
            else if (dialogContent === null || dialogContent === void 0 ? void 0 : dialogContent.inforDialog) {
                dialogContent.inforDialog('close');
            }
        }
        catch (closeError) {
            this.log.Warning("Dialog close fallback triggered: ".concat(closeError.message || closeError));
        }
        resolve(undefined);
    };
    class_1.prototype.createScopedId = function (prefix) {
        this.dialogInstanceIdCounter += 1;
        return "".concat(prefix, "_").concat(Date.now(), "_").concat(this.dialogInstanceIdCounter);
    };
    class_1.prototype.copyToClipboard = function (text_1) {
        return __awaiter(this, arguments, void 0, function (text, focusElement) {
            var value, canUseClipboardApi, error_2, tempArea, copied;
            var _a;
            if (focusElement === void 0) { focusElement = null; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        value = (text !== null && text !== void 0 ? text : '').toString();
                        if (!value) {
                            return [2 /*return*/, false];
                        }
                        canUseClipboardApi = function () {
                            if (typeof document === 'undefined') {
                                return false;
                            }
                            // Some hosted shells apply Permissions Policy that blocks clipboard-write.
                            // Check policy before calling writeText to avoid runtime policy violations.
                            var policy = document.permissionsPolicy || document.featurePolicy;
                            if (policy && typeof policy.allowsFeature === 'function') {
                                return policy.allowsFeature('clipboard-write');
                            }
                            // If policy API is not exposed, attempt modern API and rely on catch.
                            return true;
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!(canUseClipboardApi() &&
                            typeof navigator !== 'undefined' &&
                            navigator.clipboard &&
                            typeof navigator.clipboard.writeText === 'function')) return [3 /*break*/, 3];
                        return [4 /*yield*/, navigator.clipboard.writeText(value)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 3:
                        if (!canUseClipboardApi()) {
                            this.log.Warning('copyToClipboard: Clipboard API blocked by permissions policy, using fallback');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        this.log.Warning("copyToClipboard: navigator.clipboard failed: ".concat(error_2.message || error_2));
                        return [3 /*break*/, 5];
                    case 5:
                        tempArea = null;
                        try {
                            if (typeof document === 'undefined' || !document.body) {
                                return [2 /*return*/, false];
                            }
                            tempArea = document.createElement('textarea');
                            tempArea.value = value;
                            tempArea.setAttribute('readonly', 'readonly');
                            tempArea.style.position = 'fixed';
                            tempArea.style.top = '-1000px';
                            tempArea.style.left = '-1000px';
                            tempArea.style.opacity = '0';
                            document.body.appendChild(tempArea);
                            tempArea.focus();
                            tempArea.select();
                            tempArea.setSelectionRange(0, tempArea.value.length);
                            copied = !!((_a = document.execCommand) === null || _a === void 0 ? void 0 : _a.call(document, 'copy'));
                            return [2 /*return*/, copied];
                        }
                        catch (error) {
                            this.log.Error("copyToClipboard: fallback copy failed: ".concat(error.message || error));
                            return [2 /*return*/, false];
                        }
                        finally {
                            if (tempArea === null || tempArea === void 0 ? void 0 : tempArea.parentNode) {
                                tempArea.remove();
                            }
                            if (focusElement && typeof focusElement.focus === 'function') {
                                focusElement.focus();
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Stores the full original serial in CMS474MI custom field (audit trail).
     *
     * ALWAYS writes the original user-entered serial to CFMA regardless of:
     * - Whether SERN contains pass-through (<=20) or derived BSN serial (>20)
     * - This preserves complete operator intent in the system for compliance/traceability
     *
     * CRITICAL: Any failure here throws immediately to trigger rollbackEquipment()
     * which will delete the already-created equipment record (MMS240MI) + this custom field record.
     * This ensures no orphaned records on failure.
     */
    class_1.prototype.storeFullSerialCustomField = function (equipmentContext) {
        return __awaiter(this, void 0, void 0, function () {
            var originalSerial, SERN, addRequest;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.customFieldConfig) === null || _a === void 0 ? void 0 : _a.enabled)) {
                            return [2 /*return*/];
                        }
                        originalSerial = equipmentContext.originalSerial, SERN = equipmentContext.SERN;
                        addRequest = new MIRequest();
                        addRequest.program = 'CMS474MI';
                        addRequest.transaction = 'AddEqInfo';
                        addRequest.maxReturnedRecords = 1;
                        addRequest.record = this.buildCms474Record({
                            derivedSerial: SERN,
                            originalSerial: originalSerial,
                        });
                        return [4 /*yield*/, this.mi.executeRequest(addRequest)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.buildCms474Record = function (_a) {
        var _b;
        var derivedSerial = _a.derivedSerial, originalSerial = _a.originalSerial;
        // CMS474MI/AddEqInfo API inputs
        var record = (_b = {
                ITNO: this.ITNO,
                SERN: derivedSerial,
                CFMG: this.customFieldConfig.group,
                CFMF: this.customFieldConfig.field,
                SQNR: this.customFieldConfig.sequenceNum
            },
            _b[this.customFieldConfig.valueField] = originalSerial,
            _b);
        // Note: CONO/DIVI are injected by the H5 MIService session (matrix params);
        // adding them here would duplicate them in the URL and cause a 400 Bad Request.
        return record;
    };
    // Deletes custom field record used during rollback cleanup.
    class_1.prototype.deleteEquipmentCustomField = function (equipmentContext) {
        return __awaiter(this, void 0, void 0, function () {
            var sern, deleteRequest, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.customFieldConfig) === null || _a === void 0 ? void 0 : _a.enabled)) {
                            return [2 /*return*/];
                        }
                        sern = equipmentContext.SERN;
                        if (!sern) {
                            return [2 /*return*/];
                        }
                        deleteRequest = new MIRequest();
                        deleteRequest.program = 'CMS474MI';
                        deleteRequest.transaction = 'DelEqInfo';
                        deleteRequest.maxReturnedRecords = 1;
                        deleteRequest.record = {
                            ITNO: this.ITNO,
                            SERN: sern,
                            CFMG: this.customFieldConfig.group,
                            CFMF: this.customFieldConfig.field,
                            SQNR: this.customFieldConfig.sequenceNum,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mi.executeRequest(deleteRequest)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        // Ignore not-found errors during cleanup, as the record might not have been created
                        if (!this.isRecordMissingError(error_3)) {
                            // For any other error during rollback, log it but do not re-throw,
                            // to allow the rest of the rollback to proceed.
                            this.log.Error("deleteEquipmentCustomField failed for SERN ".concat(sern, " during rollback"));
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.isRecordMissingError = function (error) {
        var _a;
        if (!error)
            return false;
        var message = (error.errorMessage || error.message || '').toLowerCase();
        // Check both .statusCode (MI response object) and .status (jQuery XHR rejection)
        var httpStatus = (_a = error.statusCode) !== null && _a !== void 0 ? _a : error.status;
        return (httpStatus === 400 ||
            message.includes('no record') ||
            message.includes('not found'));
    };
    /**
     * Prepares serial entries for processing.
     *
     * SERIAL STRATEGY (New in V7.2):
     * - If input length <= 20: Use original serial as-is (pass-through to SERN and CFMA)
     * - If input length > 20: Generate BSN[MM][DD][YY][hh][mm][ss][hash] serial for SERN; store original in CFMA
     *
     * This ensures M3 MMS240 compatibility while preserving full user-entered serial in custom field audit trail.
     */
    class_1.prototype.prepareSerialEntries = function (userSerials) {
        var _this = this;
        if (!Array.isArray(userSerials) || userSerials.length === 0) {
            throw new Error('No serials to prepare');
        }
        // Generate epoch seed once per batch to ensure consistent (but unique per run) hashing
        if (!this.epochSeed) {
            this.epochSeed = this.generateEpochSeed();
        }
        var entries = userSerials.map(function (rawSerial, index) {
            var trimmed = (rawSerial || '').trim();
            var serialLimit = 20; // MMS240 limit for SERN
            var needsDerive = trimmed.length > serialLimit;
            // RULE: If input <=20 chars, pass through as-is; if >20 chars, derive BSN epoch serial
            var derivedSerial = needsDerive
                ? _this.deriveBoundedSerial(trimmed, index)
                : trimmed;
            return {
                originalSerial: trimmed,
                derivedSerial: derivedSerial,
                index: index,
            };
        });
        // Verify uniqueness of derived serials
        var uniqueDerived = new Set(entries.map(function (e) { return e.derivedSerial; }));
        if (uniqueDerived.size !== entries.length) {
            throw new Error('Hash collision: derived serials are not unique. Try again or contact support.');
        }
        return entries;
    };
    class_1.prototype.generateEpochSeed = function () {
        // Generate a seed for hashing using current epoch time
        // This ensures unique hash suffixes across different receipt runs
        var now = Date.now();
        var seedValue = (now % 1000000).toString().padStart(6, '0');
        return seedValue;
    };
    class_1.prototype.deriveBoundedSerial = function (originalSerial, index) {
        // Epoch format: BSN[MM][DD][YY][hh][mm][ss][hash]
        // Generates a deterministic, compact serial for items with input >20 chars
        // Used ONLY when input length exceeds MMS240 limit (20 chars)
        // BSN = fixed prefix (3 chars)
        // MM = month (2 chars, 01-12)
        // DD = day (2 chars, 01-31)
        // YY = year last 2 digits (2 chars, 00-99)
        // hh = hour (2 chars, 00-23)
        // mm = minute (2 chars, 00-59)
        // ss = second (2 chars, 00-59)
        // hash = 4-char hash for uniqueness
        // Total: 3 + 2 + 2 + 2 + 2 + 2 + 2 + 4 = 19 chars
        var now = new Date();
        var prefix = this.derivedSerialPrefix; // 'BSN'
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        var year = String(now.getFullYear()).slice(-2).padStart(2, '0');
        var hour = String(now.getHours()).padStart(2, '0');
        var minute = String(now.getMinutes()).padStart(2, '0');
        var second = String(now.getSeconds()).padStart(2, '0');
        var hashSuffix = this.computeHashSuffix(originalSerial, index);
        var derived = "".concat(prefix).concat(month).concat(day).concat(year).concat(hour).concat(minute).concat(second).concat(hashSuffix);
        // Sanity check: must fit within MMS240 limit
        if (derived.length > this.derivedSerialLength) {
            throw new Error("Derived serial exceeds ".concat(this.derivedSerialLength, " chars: ").concat(derived, " (len=").concat(derived.length, ")"));
        }
        return derived;
    };
    class_1.prototype.computeHashSuffix = function (originalSerial, index) {
        // Deterministic hash: combine epoch seed, serial content, and index
        // Produces a 4-digit numeric suffix for uniqueness across the batch
        // Ensures no collisions even if two operators enter similar serials in the same minute
        var combined = "".concat(this.epochSeed, "|").concat(originalSerial, "|").concat(index);
        var hash = this.simpleHash(combined);
        var hashValue = hash % 10000;
        return hashValue.toString().padStart(4, '0');
    };
    class_1.prototype.simpleHash = function (str) {
        // Deterministic hash function (djb2 variant)
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = (hash << 5) + hash + str.codePointAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    };
    // Extract user-friendly error message from MI response
    class_1.prototype.extractErrorMessage = function (error, operation) {
        if (operation === void 0) { operation = 'operation'; }
        var errorMsg = "".concat(operation, " failed");
        var technicalDetails = '';
        if (error) {
            // Primary error message (user-friendly)
            if (error.errorMessage) {
                errorMsg = error.errorMessage;
            }
            else if (error.message) {
                errorMsg = error.message;
            }
            // Technical details for troubleshooting
            var errorCode = error.errorCode || '';
            var errorMessage = error.errorMessage || '';
            var errorField = error.errorField || '';
            var program = error.program || '';
            var transaction = error.transaction || '';
            if (errorCode || errorMessage || errorField || program) {
                technicalDetails = '\n\nTechnical Details:';
                if (program && transaction)
                    technicalDetails += "\n\u2022 API: ".concat(program, "/").concat(transaction);
                if (errorCode && errorMessage) {
                    technicalDetails += "\n\u2022 Error: ".concat(errorCode, ": ").concat(errorMessage);
                }
                else if (errorMessage) {
                    technicalDetails += "\n\u2022 Error: ".concat(errorMessage);
                }
                else if (errorCode) {
                    technicalDetails += "\n\u2022 Error Code: ".concat(errorCode);
                }
                if (errorField)
                    technicalDetails += "\n\u2022 Field: ".concat(errorField);
            }
        }
        return errorMsg + technicalDetails;
    };
    /*───────────────── PROGRESS UI (Enterprise Pattern) ─────────────────*/
    class_1.prototype.initProgress = function (steps) {
        this.steps = steps; // array of labels
        this.idx = 0;
        // Create progress dialog content
        var progressHtml = "\n            <div style=\"padding: 20px;\">\n                <div class=\"po-receipt-progress-wrap\" style=\"width: 100%; height: 18px; background: #ddd; border-radius: 4px; overflow: hidden;\">\n                    <div class=\"po-receipt-progress-fill\" style=\"height: 100%; width: 0; background: #0072C6; transition: width .25s;\"></div>\n                </div>\n                <div class=\"po-receipt-progress-msg\" style=\"text-align: center; margin-top: 8px; font-size: 13px;\">Starting\u2026</div>\n            </div>\n        ";
        this.progressContent = $(progressHtml);
        var dialogOptions = {
            title: 'Processing PO Line...',
            dialogType: 'General',
            modal: true, // Disallow background interaction
            width: 400,
            minHeight: 150,
            icon: 'info',
            closeOnEscape: false, // Prevent manual closing during processing
            close: function () {
                // Don't allow manual closing during processing
            },
            buttons: [], // No buttons during processing
        };
        // Show progress dialog with proper version handling
        if (ScriptUtil.version >= 2.0) {
            this.progressDialog = H5ControlUtil.H5Dialog.CreateDialogElement(this.progressContent[0], dialogOptions);
        }
        else {
            this.progressDialog =
                this.progressContent.inforMessageDialog(dialogOptions);
        }
        this.updateProgress('Starting…');
    };
    class_1.prototype.addProgressStep = function (label) {
        this.steps.push(label);
    };
    class_1.prototype.updateProgress = function (msg) {
        var _a, _b;
        var pct = Math.round((this.idx / this.steps.length) * 100);
        (_a = this.progressContent) === null || _a === void 0 ? void 0 : _a.find('.po-receipt-progress-fill').css('width', pct + '%');
        if (msg)
            (_b = this.progressContent) === null || _b === void 0 ? void 0 : _b.find('.po-receipt-progress-msg').text(msg);
    };
    class_1.prototype.advance = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.updateProgress(label + ' ✓');
                        this.idx++;
                        return [4 /*yield*/, this.sleep(60)];
                    case 1:
                        _a.sent(); // tiny delay so UI repaints
                        return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.progressDone = function () {
        var _this = this;
        var _a, _b;
        (_a = this.progressContent) === null || _a === void 0 ? void 0 : _a.find('.po-receipt-progress-fill').css('width', '100%');
        (_b = this.progressContent) === null || _b === void 0 ? void 0 : _b.find('.po-receipt-progress-msg').text('Done!');
        setTimeout(function () { return _this.closeProgress(); }, 300);
    };
    class_1.prototype.closeProgress = function () {
        var _a;
        // Close the underlying H5 dialog and clean up the DOM. Without this
        // explicit close call the modal/backdrop created by H5Dialog will
        // remain on screen, which is why the "Processing PO Line…" dialog
        // appears when the user cancels out of a serial/lot entry dialog.
        try {
            if (this.progressDialog) {
                // H5 2.0+ dialogs expose a close() function on the model
                if (ScriptUtil.version >= 2.0 &&
                    typeof this.progressDialog.close === 'function') {
                    this.progressDialog.close(true);
                }
                else {
                    // For pre‑2.0 dialogs use the inforDialog API on the element
                    try {
                        $(this.progressDialog).inforDialog('close');
                    }
                    catch (e) {
                        this.log.Warning("closeProgress: primary dialog close failed, using content fallback: ".concat((e === null || e === void 0 ? void 0 : e.message) || e));
                        // Fallback: attempt to close using the content element
                        if ((_a = this.progressContent) === null || _a === void 0 ? void 0 : _a.inforDialog) {
                            this.progressContent.inforDialog('close');
                        }
                    }
                }
                this.progressDialog = null;
            }
        }
        catch (err) {
            // Log any errors but continue cleaning up content
            this.log.Warning("closeProgress: error closing progress dialog: ".concat(err.message));
        }
        // Remove the content element from the DOM
        if (this.progressContent) {
            this.progressContent.remove();
            this.progressContent = null;
        }
    };
    class_1.prototype.sleep = function (ms) {
        return new Promise(function (r) { return setTimeout(r, ms); });
    };
    /*───────────────── MAIN FLOW ─────────────────*/
    class_1.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userSerials, serialEntries, serialLines, processError_1, _a, lot, expi, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 30, , 31]);
                        // Initialize progress tracking with predefined steps
                        this.initProgress([
                            'Validate',
                            'Get PO line',
                            'Lookups',
                            'Warnings',
                            'Process',
                        ]);
                        // Step 1: Validate required input fields
                        return [4 /*yield*/, this.validateFields()];
                    case 1:
                        // Step 1: Validate required input fields
                        _b.sent();
                        return [4 /*yield*/, this.advance('Validate')];
                    case 2:
                        _b.sent();
                        // Step 2: Retrieve PO line details from M3
                        return [4 /*yield*/, this.getPOLine()];
                    case 3:
                        // Step 2: Retrieve PO line details from M3
                        _b.sent();
                        return [4 /*yield*/, this.advance('Get PO line')];
                    case 4:
                        _b.sent();
                        // Step 3: Gather supporting data (header, warehouse, item, etc.)
                        return [4 /*yield*/, this.lookups()];
                    case 5:
                        // Step 3: Gather supporting data (header, warehouse, item, etc.)
                        _b.sent();
                        return [4 /*yield*/, this.advance('Lookups')];
                    case 6:
                        _b.sent();
                        // Step 4: Check for business warnings (WMS, over-receipt)
                        return [4 /*yield*/, this.warnings()];
                    case 7:
                        // Step 4: Check for business warnings (WMS, over-receipt)
                        _b.sent();
                        return [4 /*yield*/, this.advance('Warnings')];
                    case 8:
                        _b.sent();
                        if (!(this.INDI === '2')) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.promptSerials()];
                    case 9:
                        userSerials = _b.sent();
                        serialEntries = this.prepareSerialEntries(userSerials);
                        // Add additional progress steps for serial processing
                        this.addProgressStep('Adding equipment records');
                        this.addProgressStep('Queueing transactions');
                        this.addProgressStep('Finalizing message');
                        return [4 /*yield*/, this.checkSer(serialEntries)];
                    case 10:
                        _b.sent(); // Validate derived serials don't already exist
                        return [4 /*yield*/, this.addEquip(serialEntries)];
                    case 11:
                        _b.sent(); // Create equipment records in M3
                        return [4 /*yield*/, this.advance('Adding equipment records')];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13:
                        _b.trys.push([13, 17, , 19]);
                        return [4 /*yield*/, this.sleep(50)];
                    case 14:
                        _b.sent();
                        serialLines = serialEntries.map(function (entry) { return ({
                            BANO: entry.derivedSerial,
                            RVQA: '1',
                            EXPI: null,
                        }); });
                        return [4 /*yield*/, this.process(serialLines)];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, this.advance('Queueing transactions')];
                    case 16:
                        _b.sent();
                        // Clear equipment tracking since process succeeded
                        this.createdEquipment = [];
                        return [3 /*break*/, 19];
                    case 17:
                        processError_1 = _b.sent();
                        // Receipt processing failed - rollback equipment records to maintain data consistency
                        this.log.Error('Receipt processing failed after equipment creation, initiating rollback');
                        return [4 /*yield*/, this.rollbackEquipment()];
                    case 18:
                        _b.sent();
                        throw processError_1;
                    case 19: return [4 /*yield*/, this.advance('Finalizing message')];
                    case 20:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 21:
                        if (!(this.INDI === '3')) return [3 /*break*/, 25];
                        return [4 /*yield*/, this.promptLot()];
                    case 22:
                        _a = _b.sent(), lot = _a.lot, expi = _a.expi;
                        return [4 /*yield*/, this.checkLot(lot)];
                    case 23:
                        _b.sent(); // Validate lot doesn't already exist
                        return [4 /*yield*/, this.process([{ BANO: lot, RVQA: this.RVQA, EXPI: expi }])];
                    case 24:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 25: return [4 /*yield*/, this.promptConfirm()];
                    case 26:
                        _b.sent(); // Simple confirmation dialog - NO busy
                        return [4 /*yield*/, this.process([{ BANO: null, RVQA: this.RVQA, EXPI: null }])];
                    case 27:
                        _b.sent();
                        _b.label = 28;
                    case 28: return [4 /*yield*/, this.advance('Process')];
                    case 29:
                        _b.sent();
                        this.progressDone();
                        // Show success dialog with enterprise pattern
                        this.showSuccessDialog();
                        return [3 /*break*/, 31];
                    case 30:
                        e_1 = _b.sent();
                        this.closeProgress();
                        // Enhanced error dialog with MI error details
                        this.showErrorDialog(e_1.message || 'An unexpected error occurred during processing', e_1);
                        return [3 /*break*/, 31];
                    case 31: return [2 /*return*/];
                }
            });
        });
    };
    /*───────────────── SUCCESS/ERROR DIALOGS (Original Pattern) ─────────────────*/
    class_1.prototype.showSuccessDialog = function () {
        this.alert('Success', 'PO line received!', true); // Refresh screen on success
    };
    class_1.prototype.showErrorDialog = function (message, error) {
        if (error === void 0) { error = null; }
        // Enhanced error dialog with MI error details
        var displayMessage = message || 'An unexpected error occurred during processing';
        // If we have an error object, extract detailed information
        if (error) {
            var detailedMessage = this.extractErrorMessage(error, 'Processing');
            displayMessage = detailedMessage;
        }
        this.alert('Error', displayMessage);
    };
    /*───────────────── FIELD VALIDATION ─────────────────*/
    class_1.prototype.validateFields = function () {
        return __awaiter(this, void 0, void 0, function () {
            var missingFields, error;
            return __generator(this, function (_a) {
                // Extract key PO receipt fields from H5 screen
                this.PUNO = ScriptUtil.GetFieldValue('WWPUNO'); // Purchase Order Number
                this.SUNO = ScriptUtil.GetFieldValue('WWSUNO'); // Supplier Number
                this.WHLO = ScriptUtil.GetFieldValue('WWWHLO'); // Warehouse
                this.PNLI = ScriptUtil.GetFieldValue('PNLI'); // PO Line Number
                this.PNLS = ScriptUtil.GetFieldValue('PNLS'); // PO Line Suffix
                this.RVQA = this.ctrl.GetValue('RVQA'); // Received Quantity
                this.WHSL = ScriptUtil.GetFieldValue('WHSL'); // Location
                this.ITNO = ScriptUtil.GetFieldValue('ITNO'); // Item Number
                this.OEND = ScriptUtil.GetFieldValue('OEND'); // Flag Completed
                missingFields = [
                    !this.PUNO && 'PUNO',
                    !this.PNLI && 'PNLI',
                    !this.PNLS && 'PNLS',
                    !this.RVQA && 'RVQA',
                    !this.ITNO && 'ITNO',
                    !this.WHLO && 'WHLO',
                    !this.SUNO && 'SUNO',
                    !this.OEND && 'OEND',
                ].filter(Boolean);
                if (missingFields.length > 0) {
                    error = "Missing required fields: ".concat(missingFields.join(', '));
                    this.log.Error(error);
                    throw new Error(error);
                }
                return [2 /*return*/];
            });
        });
    };
    /*───────────────── MI LOOK‑UPS (Enterprise Error Handling) ─────────────────*/
    class_1.prototype.getPOLine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, errorMessage, poLineData, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'PPS200MI';
                        request.transaction = 'GetLine';
                        request.record = {
                            PUNO: this.PUNO,
                            PNLI: this.PNLI,
                            PNLS: this.PNLS,
                        };
                        request.maxReturnedRecords = 1;
                        request.outputFields = [
                            'PUPR',
                            'RORC',
                            'RORN',
                            'RORL',
                            'ITDS',
                            'GETY',
                            'PUUN',
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mi.executeRequest(request)];
                    case 2:
                        response = _a.sent();
                        if (!(response === null || response === void 0 ? void 0 : response.item)) {
                            errorMessage = this.extractErrorMessage(response, 'PO line retrieval');
                            throw new Error(errorMessage);
                        }
                        poLineData = {
                            PUPR: response.item.PUPR,
                            RORC: response.item.RORC,
                            RORN: response.item.RORN,
                            RORL: response.item.RORL,
                            ITDS: response.item.ITDS,
                            GETY: response.item.GETY,
                            PUUN: response.item.PUUN,
                        };
                        Object.assign(this, poLineData);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        this.log.Error("Failed to retrieve PO line data: ".concat(error_4.message || error_4));
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.lookups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headerRequest, header, errorMessage, whsRequest, whs, itemRequest, itm, errorMessage, remRequest, rem, errorMessage, customerRequest, c, errorMessage, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        headerRequest = new MIRequest();
                        headerRequest.program = 'PPS200MI';
                        headerRequest.transaction = 'GetHead';
                        headerRequest.record = { PUNO: this.PUNO };
                        headerRequest.maxReturnedRecords = 1;
                        headerRequest.outputFields = ['PUDT', 'CUCD', 'FACI'];
                        return [4 /*yield*/, this.mi.executeRequest(headerRequest)];
                    case 1:
                        header = _a.sent();
                        if (!(header === null || header === void 0 ? void 0 : header.item)) {
                            errorMessage = this.extractErrorMessage(header, 'PO header retrieval');
                            throw new Error(errorMessage);
                        }
                        // Store key header fields for downstream processing
                        Object.assign(this, {
                            PUDT: header.item.PUDT, // Order Date
                            CUCD: header.item.CUCD, // Currency Code
                            FACI: header.item.FACI, // Facility
                        });
                        whsRequest = new MIRequest();
                        whsRequest.program = 'MMS009MI';
                        whsRequest.transaction = 'Get';
                        whsRequest.record = { WHGR: 'WMSWHSE', WHLO: this.WHLO };
                        whsRequest.maxReturnedRecords = 1;
                        whsRequest.outputFields = ['WHLO'];
                        return [4 /*yield*/, this.mi.executeRequest(whsRequest)];
                    case 2:
                        whs = _a.sent();
                        // If record exists, warehouse is WMS-managed
                        this.isWmsWhs = !!(whs === null || whs === void 0 ? void 0 : whs.item);
                        itemRequest = new MIRequest();
                        itemRequest.program = 'MMS200MI';
                        itemRequest.transaction = 'GetItmBasic';
                        itemRequest.record = { ITNO: this.ITNO, ALFM: '1' };
                        itemRequest.maxReturnedRecords = 1;
                        itemRequest.outputFields = ['EXPD', 'INDI', 'TPCD'];
                        return [4 /*yield*/, this.mi.executeRequest(itemRequest)];
                    case 3:
                        itm = _a.sent();
                        if (!(itm === null || itm === void 0 ? void 0 : itm.item)) {
                            errorMessage = this.extractErrorMessage(itm, 'Item details retrieval');
                            throw new Error(errorMessage);
                        }
                        // Store control method and expiration flags
                        Object.assign(this, {
                            EXPD: itm.item.EXPD, // Expiration Date Required (0/1)
                            INDI: itm.item.INDI, // Lot Control Method (0=None, 1=Manual, 2=Serial, 3=Lot)
                            TPCD: itm.item.TPCD, // Item Category (13=Non-material)
                        });
                        // Additional validation: Check if WHSL is required based on item type
                        // Non-material items (INDI=0 and TPCD=13) don't require warehouse location
                        if (!this.isNonMaterial && !this.WHSL) {
                            throw new Error('Warehouse location (WHSL) is required for material items');
                        }
                        this.log.Info("Item validation completed - INDI: ".concat(this.INDI, ", TPCD: ").concat(this.TPCD, ", isNonMaterial: ").concat(this.isNonMaterial));
                        remRequest = new MIRequest();
                        remRequest.program = 'PPS001MI';
                        remRequest.transaction = 'GetBasicData2';
                        remRequest.record = { PUNO: this.PUNO, PNLI: this.PNLI, PNLS: this.PNLS };
                        remRequest.maxReturnedRecords = 1;
                        remRequest.outputFields = ['RSTQ'];
                        return [4 /*yield*/, this.mi.executeRequest(remRequest)];
                    case 4:
                        rem = _a.sent();
                        if (!(rem === null || rem === void 0 ? void 0 : rem.item)) {
                            errorMessage = this.extractErrorMessage(rem, 'Remaining quantity retrieval');
                            throw new Error(errorMessage);
                        }
                        this.RMQA = rem.item.RSTQ; // Remaining Quantity
                        if (!(this.RORC === '3' && this.RORN)) return [3 /*break*/, 6];
                        customerRequest = new MIRequest();
                        customerRequest.program = 'OIS100MI';
                        customerRequest.transaction = 'GetOrderHead';
                        customerRequest.record = { ORNO: this.RORN }; // Related Order Number
                        customerRequest.maxReturnedRecords = 1;
                        customerRequest.outputFields = ['CUNO'];
                        return [4 /*yield*/, this.mi.executeRequest(customerRequest)];
                    case 5:
                        c = _a.sent();
                        if (!(c === null || c === void 0 ? void 0 : c.item)) {
                            errorMessage = this.extractErrorMessage(c, 'Customer order details retrieval');
                            throw new Error(errorMessage);
                        }
                        this.CUNO = c.item.CUNO; // Customer Number for equipment records
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_5 = _a.sent();
                        this.log.Error("Data lookup failed: ".concat(error_5.message || error_5));
                        throw error_5;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.warnings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var diff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.isWmsWhs && this.GETY !== '24')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dialogWarn('WMS Warehouse Detected; Receiving in M3 instead of WMS may result in balance discrepancy.')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.num(this.RVQA) > this.num(this.RMQA))) return [3 /*break*/, 4];
                        diff = this.num(this.RVQA) - this.num(this.RMQA);
                        return [4 /*yield*/, this.dialogWarn("Over\u2011receipt of ".concat(diff, "."))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /*───────────────── USER‑INTERACTION DIALOGS (Enterprise H5 Pattern) ─────────────────*/
    class_1.prototype.dialogWarn = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var closedByButton = false;
            var dialogModel = null;
            _this.log.Info("Displaying warning dialog: ".concat(msg));
            var dialogContent = $("<div><label class='inforLabel noColon'>".concat(msg, "</label></div>"));
            // Helper to close dialog and resolve promise
            var handleProceed = function () {
                closedByButton = true;
                _this._resolveDialog(dialogContent, resolve, dialogModel);
            };
            // Add Enter key handling for warning dialog
            dialogContent.on("keydown".concat(_this.eventNamespace), function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Trigger Proceed button (default action)
                    var proceedButton = dialogContent
                        .closest('.ui-dialog-content')
                        .siblings('.ui-dialog-buttonpane')
                        .find('button')
                        .filter(function () {
                        return $(this).text().trim() === 'Proceed';
                    });
                    if (proceedButton.length > 0) {
                        proceedButton.click();
                    }
                    else {
                        // Fallback: manually trigger the proceed logic
                        handleProceed();
                    }
                }
            });
            var dialogButtons = [
                {
                    text: 'Proceed',
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                        resolve(undefined);
                    },
                },
                {
                    text: 'Cancel',
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                        reject(new Error('Operation cancelled by user'));
                    },
                },
            ];
            var dialogOptions = {
                title: '⚠️ Warning',
                dialogType: 'General',
                modal: true,
                width: 500,
                minHeight: 200,
                icon: 'warning',
                closeOnEscape: true,
                close: function () {
                    dialogContent.off(this.eventNamespace);
                    dialogContent.find('*').off(this.eventNamespace);
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Operation cancelled by user')); // Handle escape/X button same as Cancel
                    }
                }.bind(_this),
                buttons: dialogButtons,
            };
            // Show dialog with proper version handling (H5SampleCustomDialog pattern)
            if (ScriptUtil.version >= 2.0) {
                dialogModel = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            }
            else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    };
    class_1.prototype.promptConfirm = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var closedByButton = false;
            var dialogModel = null;
            var dialogContent = $("<div><label class='inforLabel noColon'>Receive ".concat(_this.RVQA, " unit(s)?</label></div>"));
            // Helper to close dialog and resolve promise
            var handleConfirm = function () {
                closedByButton = true;
                _this._resolveDialog(dialogContent, resolve, dialogModel);
            };
            // Add Enter key handling for confirm dialog
            dialogContent.on("keydown".concat(_this.eventNamespace), function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Trigger Confirm button
                    var confirmButton = dialogContent
                        .closest('.ui-dialog-content')
                        .siblings('.ui-dialog-buttonpane')
                        .find('button')
                        .filter(function () {
                        return $(this).text().trim() === 'Confirm';
                    });
                    if (confirmButton.length > 0) {
                        confirmButton.click();
                    }
                    else {
                        // Fallback: manually trigger the confirm logic
                        handleConfirm();
                    }
                }
            });
            var dialogButtons = [
                {
                    text: 'Confirm',
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                        resolve(undefined);
                    },
                },
                {
                    text: 'Cancel',
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                        reject(new Error('Receipt cancelled by user'));
                    },
                },
            ];
            var dialogOptions = {
                title: '🔄 Confirm Receipt',
                dialogType: 'General',
                modal: true,
                width: 400,
                minHeight: 180,
                icon: 'info',
                closeOnEscape: true,
                close: function () {
                    dialogContent.off(this.eventNamespace);
                    dialogContent.find('*').off(this.eventNamespace);
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Receipt cancelled by user')); // Handle escape/X button same as Cancel
                    }
                }.bind(_this),
                buttons: dialogButtons,
            };
            if (ScriptUtil.version >= 2.0) {
                dialogModel = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            }
            else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    };
    class_1.prototype.promptSerials = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var closedByButton = false;
            var dialogModel = null;
            var qty = _this.num(_this.RVQA);
            var dialogId = _this.createScopedId('serialDlg');
            var poNumberDisplayId = "poNumberDisplay_".concat(dialogId);
            var copyPoNumberId = "copyPoNumber_".concat(dialogId);
            var generateSerialsId = "generateSerials_".concat(dialogId);
            var serialInputsContainerId = "serialInputsContainer_".concat(dialogId);
            var serialInputId = function (index) { return "serial_".concat(dialogId, "_").concat(index); };
            // Safety check: Prevent excessive quantity that could crash browser
            var MAX_SERIALS = 25; // Reasonable limit for manual entry
            if (qty > MAX_SERIALS) {
                _this.log.Error("Serial quantity ".concat(qty, " exceeds maximum allowed ").concat(MAX_SERIALS));
                reject(new Error("Cannot process ".concat(qty, " serials. Maximum allowed is ").concat(MAX_SERIALS, ". Please use batch import for large quantities.")));
                return;
            }
            var formHtml = '<div style="padding: 15px;">';
            // Add PO number display with copy functionality (fixed at top, outside scroll area)
            formHtml += "<div style=\"margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;\">\n                <label class=\"inforLabel\" style=\"font-weight: bold; font-size: 11px;\">PO:</label>\n                <div style=\"display: flex; align-items: center; margin-top: 2px;\">\n                    <input id=\"".concat(poNumberDisplayId, "\" type=\"text\" readonly value=\"").concat(_this.PUNO, "\" \n                           style=\"flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;\">\n                    <button type=\"button\" id=\"").concat(copyPoNumberId, "\" style=\"margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;\" title=\"Copy PO number\">\uD83D\uDCCB</button>\n                    <button type=\"button\" id=\"").concat(generateSerialsId, "\" style=\"margin-left: 6px; padding: 3px 6px; background: #2C8C3E; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;\" title=\"Generate serials\">\uD83D\uDD22</button>\n                </div>\n                <div style=\"margin-top: 4px; font-size: 11px; color: #666;\">\n                    <strong>Quantity:</strong> ").concat(qty, " serial").concat(qty === 1 ? '' : 's', " required\n                </div>\n            </div>");
            // Scrollable container for serial inputs - prevents off-screen bleeding
            // Max height ensures dialog fits on screen while allowing smooth scrolling
            var maxSerialLength = _this.maxSerialInputLength || 20;
            formHtml += "<div id=\"".concat(serialInputsContainerId, "\" style=\"max-height: 400px; overflow-y: auto; overflow-x: hidden; padding-right: 5px;\"><form>");
            for (var i = 0; i < qty; i++) {
                formHtml += "<div style=\"margin-bottom: 10px;\">\n                    <label class=\"inforLabel\" for=\"".concat(serialInputId(i), "\">Serial ").concat(i + 1, ":</label>\n                    <input id=\"").concat(serialInputId(i), "\" type=\"text\" class=\"inforTextBox\" maxlength=\"").concat(maxSerialLength, "\" \n                           placeholder=\"Enter serial number (max ").concat(maxSerialLength, " chars)\" style=\"width: 100%; text-transform: uppercase;\" \n                           ").concat(i === 0 ? 'autofocus' : '', ">\n                </div>");
            }
            formHtml += '</form></div></div>';
            var dialogContent = $(formHtml);
            // Method to show validation errors within the dialog context
            // Error message appears above the scrollable area for visibility
            dialogContent.showValidationError = function (message) {
                // Remove any existing error messages
                dialogContent.find('.validation-error').remove();
                // Create error message element
                var errorDiv = $("\n                    <div class=\"validation-error\" style=\"\n                        background: #ffebee; \n                        border: 1px solid #f44336; \n                        color: #c62828; \n                        padding: 8px 12px; \n                        margin: 10px 0; \n                        border-radius: 4px; \n                        font-size: 12px;\n                        white-space: pre-line;\n                    \">\n                        <strong>\u26A0\uFE0F Validation Error:</strong><br>".concat(message, "\n                    </div>\n                "));
                // Insert error message before the scrollable container (stays visible while scrolling)
                dialogContent.find("#".concat(serialInputsContainerId)).before(errorDiv);
                // Auto-remove after 5 seconds
                setTimeout(function () { return errorDiv.fadeOut(function () { return errorDiv.remove(); }); }, 5000);
            };
            // Bind the validation error method to the correct context
            var showValidationError = dialogContent.showValidationError;
            // Add copy functionality for PO number
            dialogContent
                .find("#".concat(copyPoNumberId))
                .on("click".concat(_this.eventNamespace), function (e) { return __awaiter(_this, void 0, void 0, function () {
                var poNumber, btn, poInput, originalText, copied;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            poNumber = dialogContent.find("#".concat(poNumberDisplayId)).val();
                            btn = $(e.currentTarget);
                            poInput = dialogContent.find("#".concat(poNumberDisplayId))[0];
                            originalText = btn.text();
                            return [4 /*yield*/, this.copyToClipboard(poNumber, poInput)];
                        case 1:
                            copied = _a.sent();
                            if (copied) {
                                btn.text('✓ Copied!').css('background', '#28a745');
                                setTimeout(function () { return btn.text(originalText).css('background', '#0072C6'); }, 1500);
                            }
                            else {
                                btn.text('✗ Failed').css('background', '#dc3545');
                                setTimeout(function () { return btn.text(originalText).css('background', '#0072C6'); }, 1800);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            // Add auto-generate functionality for sequential serials
            dialogContent
                .find("#".concat(generateSerialsId))
                .on("click".concat(_this.eventNamespace), function () {
                var poNumber = dialogContent.find("#".concat(poNumberDisplayId)).val();
                // Clear any existing error messages
                dialogContent.find('.validation-error').remove();
                // Populate each input field with PO-N format
                for (var i = 0; i < qty; i++) {
                    var serialValue = "".concat(poNumber, "-").concat(i + 1);
                    var inputField = dialogContent.find("#".concat(serialInputId(i)));
                    inputField.val(serialValue);
                    // Clear any error styling
                    inputField.css('border-color', '');
                    inputField.css('background-color', '');
                }
                // Show success feedback
                var successMsg = $('<div class="validation-success" style="padding: 6px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 3px; margin-bottom: 10px; font-size: 12px;">✓ Generated ' +
                    qty +
                    ' sequential serial' +
                    (qty === 1 ? '' : 's') +
                    ': ' +
                    poNumber +
                    '-1 through ' +
                    poNumber +
                    '-' +
                    qty +
                    '</div>');
                dialogContent.find("#".concat(serialInputsContainerId)).before(successMsg);
                // Auto-remove success message after 3 seconds
                setTimeout(function () {
                    return successMsg.fadeOut(300, function () {
                        $(this).remove();
                    });
                }, 3000);
                // Visual feedback on button
                var btn = $(this);
                var originalText = btn.text();
                btn.text('✓ Done!').css('background', '#28a745');
                setTimeout(function () {
                    btn.text(originalText).css('background', '#2C8C3E');
                }, 1500);
                // Focus on the first input for immediate review/editing
                dialogContent.find("#".concat(serialInputId(0))).focus();
            });
            // Add input validation and uppercase conversion
            dialogContent
                .find('input')
                .on("input".concat(_this.eventNamespace), function () {
                this.value = this.value.toUpperCase();
                $(this).css('border', ''); // Clear any error styling
            });
            // Enable right-click context menu for all input fields (for paste functionality)
            dialogContent
                .find('input')
                .on("contextmenu".concat(_this.eventNamespace), function (e) {
                e.stopPropagation(); // Allow default right-click menu on inputs
            });
            // Helper to validate and collect serials from input fields
            var validateAndCollectSerials = function () {
                var serials = [];
                var invalid = [];
                // Validate all serial inputs - check format and presence first
                for (var i = 0; i < qty; i++) {
                    var $field = dialogContent.find("#".concat(serialInputId(i)));
                    var val = $field.val().trim();
                    if (!val) {
                        $field.css('border', '2px solid red');
                        invalid.push("Serial ".concat(i + 1, " (blank)"));
                    }
                    else if (val.length > maxSerialLength) {
                        $field.css('border', '2px solid red');
                        invalid.push("Serial ".concat(i + 1, " (too long)"));
                    }
                    else if (/^[A-Z0-9-]+$/.test(val)) {
                        serials.push(val);
                    }
                    else {
                        $field.css('border', '2px solid red');
                        invalid.push("Serial ".concat(i + 1, " (invalid characters)"));
                    }
                }
                // Show validation errors if any invalid entries found
                if (invalid.length) {
                    showValidationError("Invalid or blank input in: ".concat(invalid.join(', '), "\nSerials must be alphanumeric (A-Z, 0-9, hyphen allowed), max ").concat(maxSerialLength, " characters."));
                    return null;
                }
                // Check for duplicates only after all serials are validated
                if (new Set(serials).size !== qty) {
                    var seen_1 = new Set();
                    var duplicates_1 = [];
                    serials.forEach(function (serial, idx) {
                        if (seen_1.has(serial)) {
                            dialogContent
                                .find("#".concat(serialInputId(idx)))
                                .css('border', '2px solid orange');
                            if (!duplicates_1.includes(serial))
                                duplicates_1.push(serial);
                        }
                        else {
                            seen_1.add(serial);
                        }
                    });
                    showValidationError("Duplicates detected: ".concat(duplicates_1.join(', '), "\nEnsure each serial is unique."));
                    return null;
                }
                return serials;
            };
            // Helper to close dialog and resolve with validated serials
            var handleSaveSerials = function (model) {
                var serials = validateAndCollectSerials();
                if (serials === null)
                    return; // Validation failed
                closedByButton = true;
                if (model) {
                    // Called from button handler - use model.close()
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    }
                    else {
                        $(dialogContent).inforDialog('close');
                    }
                }
                else if (ScriptUtil.version >= 2.0 &&
                    dialogModel &&
                    typeof dialogModel.close === 'function') {
                    dialogModel.close(true);
                }
                else {
                    $(dialogContent).inforDialog('close');
                }
                resolve(serials);
            };
            // Add Enter key handling for serial inputs
            dialogContent
                .find("input[id^=\"serial_".concat(dialogId, "_\"]"))
                .on("keydown".concat(_this.eventNamespace), function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var currentIndex = Number.parseInt(this.id.replace("serial_".concat(dialogId, "_"), ''));
                    if (qty > 1 && currentIndex < qty - 1) {
                        // Multiple serials: move to next input and scroll it into view
                        var nextInput = dialogContent.find("#".concat(serialInputId(currentIndex + 1)));
                        nextInput.focus();
                        // Ensure the next input is visible in the scrollable container
                        var container = dialogContent.find("#".concat(serialInputsContainerId));
                        var nextInputOffset = nextInput.position().top;
                        if (nextInputOffset > container.height() - 60) {
                            container.scrollTop(container.scrollTop() + 60);
                        }
                    }
                    else {
                        // Last serial or single serial: trigger Save button
                        var saveButton = dialogContent
                            .closest('.ui-dialog-content')
                            .siblings('.ui-dialog-buttonpane')
                            .find('button')
                            .filter(function () {
                            return $(this).text().trim() === 'Save';
                        });
                        if (saveButton.length > 0) {
                            saveButton.click();
                        }
                        else {
                            // Fallback: use shared validation and save logic
                            handleSaveSerials();
                        }
                    }
                }
            });
            var dialogButtons = [
                {
                    text: 'Save',
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        handleSaveSerials(model);
                    },
                },
                {
                    text: 'Cancel',
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                        reject(new Error('Serial input cancelled by user'));
                    },
                },
            ];
            var dialogOptions = {
                title: '📋 Enter Serial Numbers',
                dialogType: 'General',
                modal: true,
                width: 500, // Increased width for better readability with scrollbar
                height: Math.min(600, 250 + Math.min(qty, 10) * 40), // Dynamic height, capped at 600px
                maxHeight: 600, // Enforce maximum height to prevent off-screen dialogs
                icon: 'info',
                closeOnEscape: true,
                close: function () {
                    dialogContent.off(this.eventNamespace);
                    dialogContent.find('*').off(this.eventNamespace);
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Serial input cancelled by user')); // Handle escape/X button same as Cancel
                    }
                }.bind(_this),
                buttons: dialogButtons,
            };
            // Show dialog with proper version handling (H5SampleCustomDialog pattern)
            if (ScriptUtil.version >= 2.0) {
                dialogModel = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            }
            else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    };
    class_1.prototype.promptLot = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var closedByButton = false;
            var dialogModel = null;
            var dialogId = _this.createScopedId('lotDlg');
            var poNumberDisplayId = "poNumberDisplay_".concat(dialogId);
            var copyPoNumberId = "copyPoNumber_".concat(dialogId);
            var lotNumberId = "lotNumber_".concat(dialogId);
            var expirationDateId = "expirationDate_".concat(dialogId);
            var expirationDateRequired = _this.EXPD === '1';
            // Create form content for lot number and optional expiration date
            var formHtml = '<div style="padding: 15px;"><form>';
            // Add PO number display with copy functionality (smaller version)
            formHtml += "<div style=\"margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;\">\n                <label class=\"inforLabel\" style=\"font-weight: bold; font-size: 11px;\">PO:</label>\n                <div style=\"display: flex; align-items: center; margin-top: 2px;\">\n                    <input id=\"".concat(poNumberDisplayId, "\" type=\"text\" readonly value=\"").concat(_this.PUNO, "\" \n                           style=\"flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;\">\n                    <button type=\"button\" id=\"").concat(copyPoNumberId, "\" style=\"margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;\">\uD83D\uDCCB</button>\n                </div>\n            </div>");
            formHtml += "<div style=\"margin-bottom: 15px;\">\n                <label class=\"inforLabel\" for=\"".concat(lotNumberId, "\">Lot Number:</label>\n                <input id=\"").concat(lotNumberId, "\" type=\"text\" class=\"inforTextBox\" maxlength=\"20\" \n                       placeholder=\"Enter lot number\" style=\"width: 100%; text-transform: uppercase;\" autofocus>\n            </div>");
            if (expirationDateRequired) {
                formHtml += "<div style=\"margin-bottom: 15px;\">\n                    <label class=\"inforLabel\" for=\"".concat(expirationDateId, "\">Expiration Date:</label>\n                    <input id=\"").concat(expirationDateId, "\" type=\"date\" class=\"inforTextBox\" \n                           style=\"width: 100%;\" title=\"Date cannot be today's date.\">\n                    <small style=\"color: #666;\">Date cannot be today's date.</small>\n                </div>");
            }
            formHtml += '</form></div>';
            var dialogContent = $(formHtml);
            // Method to show validation errors within the dialog context
            dialogContent.showValidationError = function (message) {
                // Remove any existing error messages
                dialogContent.find('.validation-error').remove();
                // Create error message element
                var errorDiv = $("\n                    <div class=\"validation-error\" style=\"\n                        background: #ffebee; \n                        border: 1px solid #f44336; \n                        color: #c62828; \n                        padding: 8px 12px; \n                        margin: 10px 0; \n                        border-radius: 4px; \n                        font-size: 12px;\n                        white-space: pre-line;\n                    \">\n                        <strong>\u26A0\uFE0F Validation Error:</strong><br>".concat(message, "\n                    </div>\n                "));
                // Insert error message at the top of the form
                dialogContent.find('form').prepend(errorDiv);
                // Auto-remove after 5 seconds
                setTimeout(function () { return errorDiv.fadeOut(function () { return errorDiv.remove(); }); }, 5000);
            };
            // Bind the validation error method to the correct context
            var showValidationError = dialogContent.showValidationError;
            // Add copy functionality for PO number
            dialogContent
                .find("#".concat(copyPoNumberId))
                .on("click".concat(_this.eventNamespace), function (e) { return __awaiter(_this, void 0, void 0, function () {
                var poNumber, btn, poInput, originalText, copied;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            poNumber = dialogContent.find("#".concat(poNumberDisplayId)).val();
                            btn = $(e.currentTarget);
                            poInput = dialogContent.find("#".concat(poNumberDisplayId))[0];
                            originalText = btn.text();
                            return [4 /*yield*/, this.copyToClipboard(poNumber, poInput)];
                        case 1:
                            copied = _a.sent();
                            if (copied) {
                                btn.text('✓ Copied!').css('background', '#28a745');
                                setTimeout(function () { return btn.text(originalText).css('background', '#0072C6'); }, 1500);
                            }
                            else {
                                btn.text('✗ Failed').css('background', '#dc3545');
                                setTimeout(function () { return btn.text(originalText).css('background', '#0072C6'); }, 1800);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            // Add input validation and uppercase conversion for lot number
            dialogContent
                .find("#".concat(lotNumberId))
                .on("input".concat(_this.eventNamespace), function () {
                this.value = this.value.toUpperCase();
                $(this).css('border', ''); // Clear any error styling
            });
            // Enable right-click context menu for all input fields (for paste functionality)
            dialogContent
                .find('input')
                .on("contextmenu".concat(_this.eventNamespace), function (e) {
                e.stopPropagation(); // Allow default right-click menu on inputs
            });
            var validateLotInputs = function () {
                var $lot = dialogContent.find("#".concat(lotNumberId));
                var lot = $lot.val().trim();
                var expi = null;
                var errors = [];
                if (!lot || lot.length > 20 || !/^[A-Z0-9-]+$/.test(lot)) {
                    $lot.css('border', '2px solid red');
                    errors.push('Lot number required (alphanumeric, max 20 chars)');
                }
                if (expirationDateRequired) {
                    var $exp = dialogContent.find("#".concat(expirationDateId));
                    var expDate = $exp.val();
                    if (expDate) {
                        expi = expDate.replaceAll('-', ''); // Convert YYYY-MM-DD to YYYYMMDD
                        if (expi === _this.today()) {
                            $exp.css('border', '2px solid red');
                            errors.push('Expiration date cannot be today. Please use a future date.');
                        }
                    }
                    else {
                        $exp.css('border', '2px solid red');
                        errors.push('Expiration date required');
                    }
                }
                if (errors.length) {
                    showValidationError(errors.join('\n'));
                    return null;
                }
                return { lot: lot, expi: expi };
            };
            // Add Enter key handling for lot inputs
            dialogContent
                .find("#".concat(lotNumberId, ", #").concat(expirationDateId))
                .on("keydown".concat(_this.eventNamespace), function (e) {
                var _a;
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var currentFieldId = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.id;
                    if (currentFieldId === lotNumberId && expirationDateRequired) {
                        // Move to expiration date if it exists
                        dialogContent.find("#".concat(expirationDateId)).focus();
                    }
                    else {
                        // Trigger Save button
                        var saveButton = dialogContent
                            .closest('.ui-dialog-content')
                            .siblings('.ui-dialog-buttonpane')
                            .find('button')
                            .filter(function () {
                            return $(this).text().trim() === 'Save';
                        });
                        if (saveButton.length > 0) {
                            saveButton.click();
                        }
                        else {
                            var lotData = validateLotInputs();
                            if (!lotData) {
                                return;
                            }
                            // Close dialog and return lot data
                            closedByButton = true;
                            if (ScriptUtil.version >= 2.0 &&
                                dialogModel &&
                                typeof dialogModel.close === 'function') {
                                dialogModel.close(true);
                            }
                            else {
                                $(dialogContent).inforDialog('close');
                            }
                            resolve(lotData);
                        }
                    }
                }
            });
            var dialogButtons = [
                {
                    text: 'Save',
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        var lotData = validateLotInputs();
                        if (!lotData) {
                            return;
                        }
                        // Close dialog and return lot data
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                        resolve(lotData);
                    }.bind(_this),
                },
                {
                    text: 'Cancel',
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                        reject(new Error('Lot input cancelled by user'));
                    },
                },
            ];
            var dialogOptions = {
                title: '📦 Enter Lot Number',
                dialogType: 'General',
                modal: true,
                width: 450,
                minHeight: _this.EXPD === '1' ? 280 : 220, // Dynamic height based on expiration requirement
                icon: 'info',
                closeOnEscape: true,
                close: function () {
                    dialogContent.off(this.eventNamespace);
                    dialogContent.find('*').off(this.eventNamespace);
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Lot input cancelled by user')); // Handle escape/X button same as Cancel
                    }
                }.bind(_this),
                buttons: dialogButtons,
            };
            // Show dialog with proper version handling (H5SampleCustomDialog pattern)
            if (ScriptUtil.version >= 2.0) {
                dialogModel = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            }
            else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    };
    /*───────────────── VALIDATION / EQUIPMENT ─────────────────*/
    class_1.prototype.checkSer = function (entries) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Validate each derived serial number doesn't already exist in M3
                return [2 /*return*/, Promise.all(entries.map(function (entry) {
                        var derivedSerial = entry.derivedSerial;
                        var rq = Object.assign(new MIRequest(), {
                            program: 'MMS235MI', // Item Lot API
                            transaction: 'GetItmLot',
                            record: { ITNO: _this.ITNO, BANO: derivedSerial }, // BANO = Batch/Serial Number (derived)
                            maxReturnedRecords: 1,
                        });
                        //consider validating custom field as well
                        return _this.mi.executeRequest(rq).then(function (r) {
                            var _a, _b;
                            // Check both ITNO and BANO match - if found, serial already exists
                            if (((_a = r === null || r === void 0 ? void 0 : r.item) === null || _a === void 0 ? void 0 : _a.ITNO) === _this.ITNO &&
                                ((_b = r === null || r === void 0 ? void 0 : r.item) === null || _b === void 0 ? void 0 : _b.BANO) === derivedSerial) {
                                var error = "Derived serial ".concat(derivedSerial, " for item ").concat(_this.ITNO, " already exists (original: ").concat(entry.originalSerial, ").");
                                _this.log.Warning("checkSer: ".concat(error));
                                throw new Error(error);
                            }
                        }, function (e) {
                            // Status 400 = Record not found (expected for new serials)
                            if (e.statusCode === 400) {
                                return;
                            }
                            _this.log.Error("checkSer: Error checking derived serial ".concat(derivedSerial, ": ").concat(e.message || e));
                            throw e;
                        });
                    }))];
            });
        });
    };
    class_1.prototype.checkLot = function (lot) {
        return __awaiter(this, void 0, void 0, function () {
            var rq;
            var _this = this;
            return __generator(this, function (_a) {
                rq = Object.assign(new MIRequest(), {
                    program: 'MMS235MI',
                    transaction: 'GetItmLot',
                    record: { ITNO: this.ITNO, BANO: lot },
                    maxReturnedRecords: 1,
                });
                return [2 /*return*/, this.mi.executeRequest(rq).then(function (r) {
                        var _a, _b;
                        // Check both ITNO and BANO match - if found, lot already exists
                        if (((_a = r === null || r === void 0 ? void 0 : r.item) === null || _a === void 0 ? void 0 : _a.ITNO) === _this.ITNO && ((_b = r === null || r === void 0 ? void 0 : r.item) === null || _b === void 0 ? void 0 : _b.BANO) === lot) {
                            var error = "Lot ".concat(lot, " for item ").concat(_this.ITNO, " already exists.");
                            _this.log.Warning("checkLot: ".concat(error));
                            throw new Error(error);
                        }
                    }, function (e) {
                        if (e.statusCode === 400) {
                            return;
                        }
                        _this.log.Error("checkLot: Error checking lot ".concat(lot, ": ").concat(e.message || e));
                        throw e;
                    })];
            });
        });
    };
    /**
     * Creates equipment records for serial-controlled items with custom field persistence.
     *
     * WORKFLOW:
     * 1. Create MMS240MI equipment record with SERN (either pass-through <=20 or derived BSN >20)
     * 2. Store original serial in CMS474MI custom field (CFMA) for complete audit trail
     * 3. Track each creation in this.createdEquipment array for rollback if needed
     *
     * ROLLBACK TRIGGER: If ANY equipment creation or custom field storage fails:
     * - Immediately call rollbackEquipment() to delete ALL previously created equipment + custom fields
     * - This ensures batch-level atomic success/failure (no orphaned records on failure)
     */
    class_1.prototype.addEquip = function (entries) {
        return __awaiter(this, void 0, void 0, function () {
            var entries_1, entries_1_1, entry, derivedSerial, rq, result, errorMsg, eqNumber, createdContext, cfError_1, e_2_1, error_6;
            var e_2, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Initialize tracking array for potential rollback operations
                        this.createdEquipment = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 13, , 15]);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 10, 11, 12]);
                        entries_1 = __values(entries), entries_1_1 = entries_1.next();
                        _c.label = 3;
                    case 3:
                        if (!!entries_1_1.done) return [3 /*break*/, 9];
                        entry = entries_1_1.value;
                        derivedSerial = entry.derivedSerial;
                        rq = new MIRequest();
                        rq.program = 'MMS240MI'; // Equipment API
                        rq.transaction = 'Add';
                        rq.maxReturnedRecords = 1;
                        rq.record = {
                            ITNO: this.ITNO, // Item Number
                            SERN: derivedSerial, // Serial Number stored in MMS240 (<=20 chars)
                            STAT: '20', // Status (20 = In Stock)
                            CUNO: this.CUNO, // Customer Number (hard referenced for order initiated orders)
                            PUPR: this.PUPR, // Purchase Price
                            CUCD: this.CUCD, // Currency Code
                            PPDT: this.today(), // Purchase Date (today)
                            FACI: this.FACI, // Facility
                            CUOW: this.CUNO, // Current Owner
                            OWTP: '0', // Owner Type (0 = Company)
                            PUNO: this.PUNO, // Purchase Order Number
                            PNLI: this.PNLI, // PO Line Number
                            PNLS: this.PNLS, // PO Line Suffix
                            ALII: this.ITDS, // Item Description
                        };
                        return [4 /*yield*/, this.mi.executeRequest(rq)];
                    case 4:
                        result = _c.sent();
                        if (!(result === null || result === void 0 ? void 0 : result.item)) {
                            errorMsg = this.extractErrorMessage(result, "Equipment creation for derived serial ".concat(derivedSerial));
                            throw new Error(errorMsg);
                        }
                        eqNumber = result.item.EQNO || result.item.EQNR || null;
                        createdContext = {
                            ITNO: this.ITNO,
                            SERN: derivedSerial,
                            EQNO: eqNumber,
                            originalSerial: entry.originalSerial,
                        };
                        // Track successful equipment creation for potential rollback
                        this.createdEquipment.push(createdContext);
                        if (!((_b = this.customFieldConfig) === null || _b === void 0 ? void 0 : _b.enabled)) return [3 /*break*/, 8];
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.storeFullSerialCustomField(createdContext)];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        cfError_1 = _c.sent();
                        this.log.Error("addEquip: Failed to persist long serial for ".concat(derivedSerial, ": ").concat(cfError_1.message || cfError_1));
                        throw cfError_1;
                    case 8:
                        entries_1_1 = entries_1.next();
                        return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        error_6 = _c.sent();
                        // If any equipment creation fails, rollback the ones that succeeded
                        this.log.Error("addEquip: Equipment creation failed, initiating rollback: ".concat(error_6.message || error_6));
                        return [4 /*yield*/, this.rollbackEquipment()];
                    case 14:
                        _c.sent();
                        throw error_6;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rollback equipment records if receipt processing fails after equipment creation.
     *
     * ROLLBACK POLICY (Simplified):
     * - If addEquip() or process() fails, delete ALL equipment records created in this batch
     * - Delete CMS474MI custom field records first (if enabled) for explicit cleanup before equipment deletion
     * - Then delete MMS240MI equipment records via Del transaction
     * - Continue rollback even if individual deletions fail (best-effort cleanup)
     * - Clear createdEquipment array when complete
     *
     * This ensures no orphaned equipment or custom field entries if receipt fails.
     * Failures during rollback are logged but non-blocking (we continue cleanup).
     */
    class_1.prototype.rollbackEquipment = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rollbackPromises, results, failed, successful;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.createdEquipment || this.createdEquipment.length === 0) {
                            return [2 /*return*/];
                        }
                        this.log.Warning("rollbackEquipment: Rolling back ".concat(this.createdEquipment.length, " equipment records"));
                        rollbackPromises = this.createdEquipment.map(function (equip) { return __awaiter(_this, void 0, void 0, function () {
                            var cfDeleteError_1, deleteRequest, rollbackError_1;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 6, , 7]);
                                        if (!((_a = this.customFieldConfig) === null || _a === void 0 ? void 0 : _a.enabled)) return [3 /*break*/, 4];
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this.deleteEquipmentCustomField(equip)];
                                    case 2:
                                        _b.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        cfDeleteError_1 = _b.sent();
                                        this.log.Error("rollbackEquipment: Failed to delete CMS474 record for EQNO ".concat(equip.EQNO || 'N/A', ": ").concat(cfDeleteError_1.message || cfDeleteError_1));
                                        return [3 /*break*/, 4];
                                    case 4:
                                        deleteRequest = new MIRequest();
                                        deleteRequest.program = 'MMS240MI'; // Equipment API
                                        deleteRequest.transaction = 'Del'; // Delete transaction
                                        deleteRequest.maxReturnedRecords = 1;
                                        deleteRequest.record = {
                                            ITNO: equip.ITNO, // Item Number
                                            SERN: equip.SERN, // Serial Number (equivalent to BANO)
                                        };
                                        return [4 /*yield*/, this.mi.executeRequest(deleteRequest)];
                                    case 5:
                                        _b.sent();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        rollbackError_1 = _b.sent();
                                        // Log rollback failure but continue with other deletions
                                        this.log.Error("rollbackEquipment: Failed to delete equipment for serial ".concat(equip.SERN, ": ").concat(rollbackError_1.message || rollbackError_1));
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.allSettled(rollbackPromises)];
                    case 1:
                        results = _a.sent();
                        failed = results.filter(function (r) { return r.status === 'rejected'; }).length;
                        if (failed > 0) {
                            successful = results.length - failed;
                            this.log.Warning("rollbackEquipment: Completed with ".concat(successful, " successful, ").concat(failed, " failed deletions"));
                        }
                        // Clear the tracking array
                        this.createdEquipment = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    /*───────────────── RECEIPT ENGINE ─────────────────*/
    class_1.prototype.process = function (lines) {
        return __awaiter(this, void 0, void 0, function () {
            var head, h, errorMessage, packNumber, pack, packResult, errorMessage, resolvedPackNumber, lines_1, lines_1_1, rec, line, lineResult, lineId, e_3_1, pr, prc, errorMessage, statusCheck, statusResult, transactionStatus, lineFailureDetail, _a, troubleshootingInfo, statusDesc, statusLines, trimmedTroubleshooting, errorMessage, e_4;
            var e_3, _b;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 22, , 23]);
                        head = Object.assign(new MIRequest(), {
                            program: 'MHS850MI', // Interface Transaction Processing API
                            transaction: 'AddWhsHead', // Create transaction header
                            maxReturnedRecords: 1,
                            record: this.applyCompanyDivisionContext({
                                WHLO: this.WHLO, // Warehouse
                                QLFR: '20', // Qualifier (20 = Purchase Receipt)
                                E0PA: 'WS', // WS Partner (MMS865)
                                E0PB: 'WS', // WS Partner (MMS865)
                                E007: '20', // Qualifier (20 = Purchase Receipt)
                                E065: 'PPS300', // Message Type (MMS865)
                            }),
                        });
                        return [4 /*yield*/, this.mi.executeRequest(head)];
                    case 1:
                        h = _f.sent();
                        // Validate header creation was successful
                        if (!((_c = h === null || h === void 0 ? void 0 : h.item) === null || _c === void 0 ? void 0 : _c.MSGN)) {
                            errorMessage = this.extractErrorMessage(h, 'Warehouse transaction header creation');
                            throw new Error(errorMessage);
                        }
                        // Store message number for subsequent WMS transactions
                        this.MSGN = h.item.MSGN;
                        packNumber = "".concat(this.PUNO, "_").concat(this.PNLI);
                        pack = new MIRequest();
                        pack.program = 'MHS850MI';
                        pack.transaction = 'AddWhsPack';
                        pack.maxReturnedRecords = 1;
                        pack.record = this.applyCompanyDivisionContext({
                            WHLO: this.WHLO,
                            MSGN: this.MSGN,
                            PACN: packNumber, // Pack Number = PUNO_PNLI
                            QLFR: '20',
                        });
                        return [4 /*yield*/, this.mi.executeRequest(pack)];
                    case 2:
                        packResult = _f.sent();
                        if ((packResult === null || packResult === void 0 ? void 0 : packResult.errorCode) ||
                            (packResult === null || packResult === void 0 ? void 0 : packResult.errorMessage) ||
                            !((_d = packResult === null || packResult === void 0 ? void 0 : packResult.item) === null || _d === void 0 ? void 0 : _d.PACN)) {
                            errorMessage = this.extractErrorMessage(packResult, 'Warehouse package creation');
                            throw new Error(errorMessage);
                        }
                        resolvedPackNumber = packResult.item.PACN || packNumber;
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 8, 9, 10]);
                        lines_1 = __values(lines), lines_1_1 = lines_1.next();
                        _f.label = 4;
                    case 4:
                        if (!!lines_1_1.done) return [3 /*break*/, 7];
                        rec = lines_1_1.value;
                        line = new MIRequest();
                        line.program = 'MHS850MI';
                        line.transaction = 'AddWhsLine';
                        line.maxReturnedRecords = 100;
                        line.record = this.applyCompanyDivisionContext({
                            WHLO: this.WHLO,
                            MSGN: this.MSGN,
                            PACN: resolvedPackNumber, // All lines use same pack number (PUNO_PNLI)
                            QLFR: '20',
                            ITNO: this.ITNO, // Item Number
                            RVQA: rec.RVQA, // Received Quantity (1 for serials, full qty for others)
                            PUUN: this.PUUN,
                            RIDN: this.PUNO, // Reference ID (PO Number)
                            RIDL: this.PNLI, // Reference Line (PO Line)
                            RIDX: this.PNLS, // Reference Suffix (PO Line Suffix)
                            OEND: this.OEND, // Flag Completed signifier
                        });
                        // Add warehouse location only for material items (non-material items don't use WHSL)
                        if (!this.isNonMaterial) {
                            line.record.WHSL = this.WHSL; // Warehouse Location
                        }
                        // Conditionally add batch/lot/serial and expiration data
                        if (rec.BANO) {
                            line.record.BANO = rec.BANO; // Batch/Serial/Lot Number
                            line.record.BREM = "Orig Loc: ".concat(this.WHSL);
                        }
                        if (rec.EXPI)
                            line.record.EXPI = rec.EXPI; // Expiration Date
                        return [4 /*yield*/, this.mi.executeRequest(line)];
                    case 5:
                        lineResult = _f.sent();
                        if ((lineResult === null || lineResult === void 0 ? void 0 : lineResult.errorCode) || (lineResult === null || lineResult === void 0 ? void 0 : lineResult.errorMessage)) {
                            lineId = rec.BANO || rec.RVQA || 'unknown';
                            throw new Error(this.extractErrorMessage(lineResult, "Warehouse transaction line ".concat(lineId)));
                        }
                        _f.label = 6;
                    case 6:
                        lines_1_1 = lines_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_3_1 = _f.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (lines_1_1 && !lines_1_1.done && (_b = lines_1.return)) _b.call(lines_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        if (!(lines.length > 1)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.sleep(200)];
                    case 11:
                        _f.sent();
                        _f.label = 12;
                    case 12:
                        pr = new MIRequest();
                        pr.program = 'MHS850MI';
                        pr.transaction = 'PrcWhsTran'; // Process Warehouse Transaction
                        pr.maxReturnedRecords = 1;
                        pr.record = this.applyCompanyContext({
                            MSGN: this.MSGN, // Message Number from header creation
                            PRFL: '*EXE', // Process Flag (*EXE = Execute immediately)
                        });
                        return [4 /*yield*/, this.prcWhsTranWithRetry(pr)];
                    case 13:
                        prc = _f.sent();
                        // PrcWhsTran is a processor call and does not return item payloads on success.
                        // Only explicit MI error fields should fail the request at this stage.
                        if ((prc === null || prc === void 0 ? void 0 : prc.errorCode) || (prc === null || prc === void 0 ? void 0 : prc.errorMessage)) {
                            errorMessage = this.extractErrorMessage(prc, 'Transaction processing');
                            throw new Error(errorMessage);
                        }
                        // ───────────── Final Status Validation ─────────────
                        // Check actual processing status using GetWhsHead to ensure transaction completed successfully
                        return [4 /*yield*/, this.sleep(100)];
                    case 14:
                        // ───────────── Final Status Validation ─────────────
                        // Check actual processing status using GetWhsHead to ensure transaction completed successfully
                        _f.sent(); // Brief delay to ensure status is updated
                        statusCheck = new MIRequest();
                        statusCheck.program = 'MHS850MI';
                        statusCheck.transaction = 'GetWhsHead';
                        statusCheck.maxReturnedRecords = 1;
                        statusCheck.outputFields = ['STAT', 'TRSL', 'TRSH'];
                        statusCheck.record = this.applyCompanyContext({
                            MSGN: this.MSGN,
                        });
                        return [4 /*yield*/, this.mi.executeRequest(statusCheck)];
                    case 15:
                        statusResult = _f.sent();
                        if (!(statusResult === null || statusResult === void 0 ? void 0 : statusResult.item)) {
                            throw new Error('Failed to retrieve transaction status for validation');
                        }
                        transactionStatus = statusResult.item.STAT;
                        if (!(transactionStatus !== '90')) return [3 /*break*/, 21];
                        if (!['25', '30', '35', '40', '45'].includes(transactionStatus)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.getWhsLineFailureDetail(resolvedPackNumber)];
                    case 16:
                        _a = _f.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        _a = '';
                        _f.label = 18;
                    case 18:
                        lineFailureDetail = _a;
                        troubleshootingInfo = this._getTroubleshootingInfo(transactionStatus, resolvedPackNumber, lineFailureDetail);
                        statusDesc = this.getTransactionStatusDescription(transactionStatus);
                        statusLines = [];
                        trimmedTroubleshooting = troubleshootingInfo
                            ? troubleshootingInfo.trim()
                            : '';
                        if (trimmedTroubleshooting) {
                            statusLines.push(trimmedTroubleshooting);
                        }
                        statusLines.push("Status: ".concat(transactionStatus, " (").concat(statusDesc, ")"), "Message no: ".concat(this.MSGN));
                        if (resolvedPackNumber !== undefined) {
                            statusLines.push("Package no: ".concat(resolvedPackNumber));
                        }
                        if (statusResult.item.TRSL) {
                            statusLines.push("Lowest line status: ".concat(statusResult.item.TRSL));
                        }
                        if (statusResult.item.TRSH) {
                            statusLines.push("Highest line status: ".concat(statusResult.item.TRSH));
                        }
                        errorMessage = statusLines.join('\n');
                        this.log.Error("process: Transaction failed with status ".concat(transactionStatus, " (").concat(statusDesc, ")"));
                        if (!(((_e = this.createdEquipment) === null || _e === void 0 ? void 0 : _e.length) > 0)) return [3 /*break*/, 20];
                        this.log.Warning('Transaction failed, initiating equipment rollback');
                        return [4 /*yield*/, this.rollbackEquipment()];
                    case 19:
                        _f.sent();
                        _f.label = 20;
                    case 20: throw new Error(errorMessage);
                    case 21:
                        this.log.Info('Receipt processing completed successfully');
                        return [3 /*break*/, 23];
                    case 22:
                        e_4 = _f.sent();
                        this.log.Error("process: Receipt processing failed: ".concat(e_4.message || e_4));
                        throw e_4;
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    /*───────────────── HELPER METHODS (Enterprise H5 Patterns) ─────────────────*/
    // Enterprise-grade alert using H5ControlUtil.H5Dialog
    class_1.prototype.alert = function (title, message, shouldRefresh) {
        if (shouldRefresh === void 0) { shouldRefresh = false; }
        this.log.Info("Displaying alert: ".concat(title, " - ").concat(message));
        // Enhanced message formatting for better readability
        var formattedMessage = message.replaceAll('\n', '<br>');
        var dialogContent = $("<div style=\"max-width: 500px; word-wrap: break-word;\"><label class=\"inforLabel noColon\">".concat(formattedMessage, "</label></div>"));
        var dialogButtons = [
            {
                text: 'OK',
                isDefault: true,
                width: 80,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    }
                    else {
                        $(this).inforDialog('close');
                    }
                    if (shouldRefresh) {
                        this.refresh();
                    }
                }.bind(this),
            },
        ];
        var dialogOptions = {
            title: title,
            dialogType: 'General',
            modal: true,
            width: Math.min(600, Math.max(350, message.length * 8)), // Dynamic width based on message length
            minHeight: 150,
            maxHeight: 400,
            icon: title.toLowerCase().includes('error') ? 'error' : 'info',
            closeOnEscape: true,
            close: function () {
                dialogContent.remove();
            },
            buttons: dialogButtons,
        };
        // Show dialog with proper version handling (H5SampleCustomDialog pattern)
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
        }
        else {
            dialogContent.inforMessageDialog(dialogOptions);
        }
    };
    class_1.prototype.busy = function (v) {
        var _a, _b, _c, _d;
        try {
            if (!this.ctrl) {
                return;
            }
            if (v) {
                (_b = (_a = this.ctrl).ShowBusyIndicator) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            else {
                (_d = (_c = this.ctrl).HideBusyIndicator) === null || _d === void 0 ? void 0 : _d.call(_c);
            }
        }
        catch (error) {
            this.log.Warning("busy: Failed to set busy indicator: ".concat(error.message || error));
        }
    };
    class_1.prototype.refresh = function () {
        var _a;
        // Refresh H5 screen to show updated data
        if ((_a = this.ctrl) === null || _a === void 0 ? void 0 : _a.PressKey) {
            this.ctrl.PressKey('F5');
        }
        else {
            this.log.Warning('Screen refresh requested but controller not available');
        }
    };
    class_1.prototype.num = function (value) {
        // Convert string to number, removing non-numeric characters
        return (Number.parseFloat((value || '0').toString().replaceAll(/[^\d.-]/g, '')) ||
            0);
    };
    class_1.prototype.today = function () {
        // Return today's date in YYYYMMDD format for M3
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        return "".concat(year).concat(month).concat(day);
    };
    // Detect transient lock/busy errors for ProcessTran retry logic
    class_1.prototype.isTransientProcessLock = function (e) {
        try {
            var status_1 = e === null || e === void 0 ? void 0 : e.statusCode;
            var code = ((e === null || e === void 0 ? void 0 : e.errorCode) || '').toString().toUpperCase();
            var msg_1 = ((e === null || e === void 0 ? void 0 : e.errorMessage) || (e === null || e === void 0 ? void 0 : e.message) || '')
                .toString()
                .toLowerCase();
            // HTTP-style transient signals
            if (status_1 === 409 || status_1 === 503)
                return true;
            // Common lock/busy keywords
            var keywords = [
                'locked',
                'record lock',
                'busy',
                'in use',
                'try again',
                'temporary',
                'timeout',
                'deadlock',
            ];
            if (keywords.some(function (k) { return msg_1.includes(k); }))
                return true;
            // Known MI error codes that often indicate transient state
            if (['WPU0901', 'M3LOCK'].includes(code))
                return true;
        }
        catch (_a) {
            return false;
        }
        return false;
    };
    // Execute PrcWhsTran with limited retries and exponential backoff
    class_1.prototype.prcWhsTranWithRetry = function (pr_1) {
        return __awaiter(this, arguments, void 0, function (pr, maxAttempts) {
            var attempt, lastError, result, e_5, backoff;
            if (maxAttempts === void 0) { maxAttempts = 3; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempt = 1;
                        lastError = null;
                        _a.label = 1;
                    case 1:
                        if (!(attempt <= maxAttempts)) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.mi.executeRequest(pr)];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 4:
                        e_5 = _a.sent();
                        lastError = e_5;
                        if (!this.isTransientProcessLock(e_5) || attempt === maxAttempts) {
                            throw e_5;
                        }
                        backoff = 300 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
                        this.log.Warning("Transient error on PrcWhsTran attempt ".concat(attempt, "/").concat(maxAttempts, ", retrying in ").concat(backoff, "ms"));
                        return [4 /*yield*/, this.sleep(backoff)];
                    case 5:
                        _a.sent();
                        attempt++;
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: throw lastError || new Error('Unknown error executing PrcWhsTran');
                }
            });
        });
    };
    return class_1;
}());
//# sourceMappingURL=POReceiptShortcutV4.js.map