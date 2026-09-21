"use strict";
/*─────────────────────────────────────────────────────────────────────────────
  POReceiptShortcut.js
  H5-compliant script for PO receipt processing
  Author: GitHub Copilot   Date: 02-Dec-2025 LATEST V1 as of 12/31/25
  Version: 7.1            Compatible with: H5 2.0+

  FEATURES
  • Enterprise-grade H5 SDK compliance using H5ControlUtil.H5Dialog API
  • Promise-based MI service calls with comprehensive error handling
  • Enhanced error messages with errorCode:errorMessage format
  • Retry logic with exponential backoff for transient lock/busy errors
  • Proper H5 logging patterns following SDK guidelines
  • Future-proof dialog implementation with version fallback support
  • Single pack with multiple lines for INDI = 2 (PACN = PUNO_PNLI), single pack otherwise
  • Pushes only one PrcWhsTran (message-level)
  • "T for today" in Expiration date input
  • Auto-generate sequential serial numbers (PO-1, PO-2, etc.)
  • Scrollable serial input dialog (handles 1-25 serials)
  • Performance timing and monitoring
  • Consistent error reporting and user feedback
  • Transaction rollback for equipment records on failure

  ARCHITECTURE
  • Follows official H5 SDK sample patterns (H5SampleCustomDialog.ts)
  • Uses H5ControlUtil.H5Dialog.CreateDialogElement for H5 >= 2.0
  • Falls back to inforMessageDialog for H5 < 2.0
  • Implements enterprise logging standards with this.log
  • Uses proper IMIResponse error handling patterns
  • Transient error detection with retry/backoff (up to 3 attempts)
  • Follows H5 SDK naming conventions and structure

  DOES NOT INCLUDE EXTENDED SERIAL FUNCTIONALITY LOGIC (v2 does)
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
/*──────────────────────────────────────────────────────────────────────────*/
var POReceiptShortcut = /** @class */ (function () {
    function class_1(args) {
        // Initialize base properties following H5 SDK patterns
        this.typeName = 'POReceiptShortcut';
        // Use appropriate MIService version based on H5 compatibility
        this.mi = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;
        this.ctrl = args.controller; // H5 controller for UI interactions
        this.log = args.log; // H5 logging service
        // Log initialization following SDK patterns
        this.log.Info('POReceiptShortcut initialized successfully');
    }
    class_1.Init = function (args) {
        // Entry point: Initialize script (supports fallbacks for < 2.0)
        var self = new POReceiptShortcut(args);
        self.busy(true); // Show loading indicator during processing
        // Execute main workflow with cleanup regardless of success/failure
        self.run().finally(function () { return self.busy(false); });
    };
    /*───────────────── LOGGING METHODS (H5 SDK Standard) ─────────────────*/
    // Enterprise logging following H5 SDK sample patterns
    // All samples use this.log.Info, this.log.Error, etc. directly
    class_1.prototype.logDebug = function (message) {
        console.log("[DEBUG] ".concat(message));
        this.log.Info("[DEBUG] ".concat(message));
    };
    class_1.prototype.logInfo = function (message) {
        console.log("[INFO] ".concat(message));
        this.log.Info(message);
    };
    class_1.prototype.logWarning = function (message) {
        console.log("[WARNING] ".concat(message));
        this.log.Info("[WARNING] ".concat(message));
    };
    class_1.prototype.logError = function (message, error) {
        if (error === void 0) { error = null; }
        if (error) {
            console.error("[ERROR] ".concat(message, ": ").concat(error.message || error), error);
            this.log.Error("".concat(message, ": ").concat(error.message || error));
        }
        else {
            console.error("[ERROR] ".concat(message));
            this.log.Error(message);
        }
    };
    // Enhanced MI transaction logging
    class_1.prototype.logMIRequest = function (program, transaction, record) {
        console.log("[MI-REQUEST] ".concat(program, "/").concat(transaction, ":"), JSON.stringify(record, null, 2));
        this.logDebug("MI Request: ".concat(program, "/").concat(transaction, " - ").concat(JSON.stringify(record)));
    };
    class_1.prototype.logMIResponse = function (program, transaction, response, success) {
        if (success === void 0) { success = true; }
        if (success) {
            console.log("[MI-RESPONSE] ".concat(program, "/").concat(transaction, " SUCCESS:"), JSON.stringify(response, null, 2));
            this.logDebug("MI Response: ".concat(program, "/").concat(transaction, " - ").concat(JSON.stringify(response)));
        }
        else {
            console.error("[MI-RESPONSE] ".concat(program, "/").concat(transaction, " ERROR:"), JSON.stringify(response, null, 2));
            this.logError("MI Response Error: ".concat(program, "/").concat(transaction, " - ").concat(JSON.stringify(response)));
        }
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
        this.log.Info("Starting progress tracking with ".concat(steps.length, " steps: ").concat(steps.join(', ')));
        // Create progress dialog content
        var progressHtml = "\n            <div style=\"padding: 20px;\">\n                <div id=\"progressWrap\" style=\"width: 100%; height: 18px; background: #ddd; border-radius: 4px; overflow: hidden;\">\n                    <div id=\"progressFill\" style=\"height: 100%; width: 0; background: #0072C6; transition: width .25s;\"></div>\n                </div>\n                <div id=\"progressMsg\" style=\"text-align: center; margin-top: 8px; font-size: 13px;\">Starting\u2026</div>\n            </div>\n        ";
        this.progressContent = $(progressHtml);
        var dialogOptions = {
            title: "Processing PO Line...",
            dialogType: "General",
            modal: true, // Disallow background interaction
            width: 400,
            minHeight: 150,
            icon: "info",
            closeOnEscape: false, // Prevent manual closing during processing
            close: function () {
                // Don't allow manual closing during processing
            },
            buttons: [] // No buttons during processing
        };
        // Show progress dialog with proper version handling
        if (ScriptUtil.version >= 2.0) {
            this.progressDialog = H5ControlUtil.H5Dialog.CreateDialogElement(this.progressContent[0], dialogOptions);
        }
        else {
            this.progressDialog = this.progressContent.inforMessageDialog(dialogOptions);
        }
        this.updateProgress('Starting…');
    };
    class_1.prototype.addProgressStep = function (label) { this.steps.push(label); };
    class_1.prototype.updateProgress = function (msg) {
        var pct = Math.round((this.idx / this.steps.length) * 100);
        $('#progressFill').css('width', pct + '%');
        if (msg)
            $('#progressMsg').text(msg);
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
        $('#progressFill').css('width', '100%');
        $('#progressMsg').text('Done!');
        this.log.Info('Progress completed successfully');
        setTimeout(function () { return _this.closeProgress(); }, 300);
    };
    class_1.prototype.closeProgress = function () {
        // Close the underlying H5 dialog and clean up the DOM. Without this
        // explicit close call the modal/backdrop created by H5Dialog will
        // remain on screen, which is why the "Processing PO Line…" dialog
        // appears when the user cancels out of a serial/lot entry dialog.
        try {
            if (this.progressDialog) {
                // H5 2.0+ dialogs expose a close() function on the model
                if (ScriptUtil.version >= 2.0 && typeof this.progressDialog.close === 'function') {
                    this.progressDialog.close(true);
                }
                else {
                    // For pre‑2.0 dialogs use the inforDialog API on the element
                    try {
                        $(this.progressDialog).inforDialog('close');
                    }
                    catch (e) {
                        // Fallback: attempt to close using the content element
                        if (this.progressContent && this.progressContent.inforDialog) {
                            this.progressContent.inforDialog('close');
                        }
                    }
                }
                this.progressDialog = null;
            }
        }
        catch (err) {
            // Log any errors but continue cleaning up content
            this.log.Info("closeProgress: error closing progress dialog: ".concat(err.message));
        }
        // Remove the content element from the DOM
        if (this.progressContent) {
            this.progressContent.remove();
            this.progressContent = null;
        }
        this.log.Info('Progress dialog closed');
    };
    class_1.prototype.sleep = function (ms) { return new Promise(function (r) { return setTimeout(r, ms); }); };
    /*───────────────── MAIN FLOW ─────────────────*/
    class_1.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var t0, t1, t2, t3, t4, t5, t6, t7, serials, t8, t9, t10, serialLines, t11, processError_1, _a, lot, expi, t8, t9, t8, t9, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 30, , 31]);
                        // Initialize progress tracking with predefined steps
                        this.initProgress(['Validate', 'Get PO line', 'Lookups', 'Warnings', 'Process']);
                        t0 = performance.now();
                        return [4 /*yield*/, this.validateFields()];
                    case 1:
                        _b.sent();
                        t1 = performance.now();
                        return [4 /*yield*/, this.advance('Validate')];
                    case 2:
                        _b.sent();
                        console.log("[Timing] validateFields: ".concat((t1 - t0).toFixed(1), " ms"));
                        t2 = performance.now();
                        return [4 /*yield*/, this.getPOLine()];
                    case 3:
                        _b.sent();
                        t3 = performance.now();
                        return [4 /*yield*/, this.advance('Get PO line')];
                    case 4:
                        _b.sent();
                        console.log("[Timing] getPOLine: ".concat((t3 - t2).toFixed(1), " ms"));
                        t4 = performance.now();
                        return [4 /*yield*/, this.lookups()];
                    case 5:
                        _b.sent();
                        t5 = performance.now();
                        return [4 /*yield*/, this.advance('Lookups')];
                    case 6:
                        _b.sent();
                        console.log("[Timing] lookups: ".concat((t5 - t4).toFixed(1), " ms"));
                        t6 = performance.now();
                        return [4 /*yield*/, this.warnings()];
                    case 7:
                        _b.sent();
                        t7 = performance.now();
                        return [4 /*yield*/, this.advance('Warnings')];
                    case 8:
                        _b.sent();
                        console.log("[Timing] warnings: ".concat((t7 - t6).toFixed(1), " ms"));
                        /* ─── Branch by control method ─── */
                        // Process based on item lot control method (INDI field)
                        console.log("[CONTROL-METHOD] Processing item with INDI=".concat(this.INDI, " (").concat(this.INDI === '2' ? 'Serial' : this.INDI === '3' ? 'Lot' : 'Non-lotted', ")"));
                        if (!(this.INDI === '2')) return [3 /*break*/, 21];
                        console.log('[SERIAL-CONTROL] Starting serial processing workflow');
                        return [4 /*yield*/, this.promptSerials()];
                    case 9:
                        serials = _b.sent();
                        console.log('[SERIAL-INPUT] User provided serials:', serials);
                        // Add additional progress steps for serial processing
                        this.addProgressStep('Adding equipment records');
                        this.addProgressStep('Queueing transactions');
                        this.addProgressStep('Finalizing message');
                        t8 = performance.now();
                        console.log('[SERIAL-VALIDATION] Starting serial validation and equipment creation');
                        return [4 /*yield*/, this.checkSer(serials)];
                    case 10:
                        _b.sent(); // Validate serials don't already exist
                        console.log('[SERIAL-VALIDATION] ✓ All serials validated successfully');
                        return [4 /*yield*/, this.addEquip(serials)];
                    case 11:
                        _b.sent(); // Create equipment records in M3
                        console.log('[EQUIPMENT-CREATION] ✓ All equipment records created successfully');
                        return [4 /*yield*/, this.advance('Adding equipment records')];
                    case 12:
                        _b.sent();
                        t9 = performance.now();
                        console.log("[Timing] checkSer+addEquip: ".concat((t9 - t8).toFixed(1), " ms"));
                        _b.label = 13;
                    case 13:
                        _b.trys.push([13, 17, , 19]);
                        return [4 /*yield*/, this.sleep(50)];
                    case 14:
                        _b.sent();
                        t10 = performance.now();
                        console.log('[SERIAL-RECEIPT] Starting receipt transaction processing');
                        serialLines = serials.map(function (s) { return ({ BANO: s, RVQA: '1', EXPI: null }); });
                        console.log('[SERIAL-LINES] Processing lines:', JSON.stringify(serialLines, null, 2));
                        return [4 /*yield*/, this.process(serialLines, false)];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, this.advance('Queueing transactions')];
                    case 16:
                        _b.sent();
                        t11 = performance.now();
                        console.log("[Timing] process (serial): ".concat((t11 - t10).toFixed(1), " ms"));
                        // Clear equipment tracking since process succeeded
                        console.log('[SERIAL-SUCCESS] Receipt completed successfully, clearing equipment tracking');
                        this.createdEquipment = [];
                        return [3 /*break*/, 19];
                    case 17:
                        processError_1 = _b.sent();
                        // Receipt processing failed - rollback equipment records to maintain data consistency
                        console.error('[SERIAL-FAILURE] Receipt processing failed after equipment creation, initiating rollback:', processError_1);
                        this.log.Error('Receipt processing failed after equipment creation, initiating rollback', processError_1);
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
                        console.log('[LOT-CONTROL] Starting lot processing workflow');
                        return [4 /*yield*/, this.promptLot()];
                    case 22:
                        _a = _b.sent(), lot = _a.lot, expi = _a.expi;
                        console.log('[LOT-INPUT] User provided lot:', { lot: lot, expi: expi });
                        t8 = performance.now();
                        return [4 /*yield*/, this.checkLot(lot)];
                    case 23:
                        _b.sent(); // Validate lot doesn't already exist
                        console.log('[LOT-VALIDATION] ✓ Lot validated successfully');
                        return [4 /*yield*/, this.process([{ BANO: lot, RVQA: this.RVQA, EXPI: expi }], false)];
                    case 24:
                        _b.sent();
                        console.log('[LOT-SUCCESS] ✓ Lot receipt completed successfully');
                        t9 = performance.now();
                        console.log("[Timing] checkLot+process (lot): ".concat((t9 - t8).toFixed(1), " ms"));
                        return [3 /*break*/, 28];
                    case 25:
                        console.log('[NON-LOTTED] Starting non-lotted item processing workflow');
                        return [4 /*yield*/, this.promptConfirm()];
                    case 26:
                        _b.sent(); // Simple confirmation dialog - NO busy
                        console.log("[NON-LOTTED-CONFIRMED] User confirmed receipt");
                        t8 = performance.now();
                        return [4 /*yield*/, this.process([{ BANO: null, RVQA: this.RVQA, EXPI: null }], false)];
                    case 27:
                        _b.sent();
                        console.log("[NON-LOTTED-SUCCESS] ✓ Non-lotted receipt completed successfully");
                        t9 = performance.now();
                        console.log("[Timing] process (non-lotted): ".concat((t9 - t8).toFixed(1), " ms"));
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
            var fieldValues, missingFields, error;
            return __generator(this, function (_a) {
                this.log.Info('Starting field validation');
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
                fieldValues = {
                    PUNO: this.PUNO, SUNO: this.SUNO, WHLO: this.WHLO,
                    PNLI: this.PNLI, PNLS: this.PNLS, RVQA: this.RVQA,
                    WHSL: this.WHSL, ITNO: this.ITNO, OEND: this.OEND
                };
                console.log('[FIELD-VALUES] Extracted from H5 screen:', JSON.stringify(fieldValues, null, 2));
                this.logDebug("Field values extracted: ".concat(JSON.stringify(fieldValues)));
                missingFields = [
                    !this.PUNO && 'PUNO', !this.PNLI && 'PNLI',
                    !this.PNLS && 'PNLS', !this.RVQA && 'RVQA',
                    !this.ITNO && 'ITNO', !this.WHLO && 'WHLO',
                    !this.SUNO && 'SUNO', !this.OEND && 'OEND'
                ].filter(Boolean);
                if (missingFields.length > 0) {
                    error = "Missing required fields: ".concat(missingFields.join(', '));
                    console.error('[VALIDATION-ERROR]', error);
                    this.log.Error(error);
                    throw new Error(error);
                }
                console.log('[VALIDATION-SUCCESS] All required fields present');
                this.log.Info('Field validation completed successfully');
                return [2 /*return*/];
            });
        });
    };
    /*───────────────── MI LOOK‑UPS (Enterprise Error Handling) ─────────────────*/
    class_1.prototype.getPOLine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, errorMessage, poLineData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.Info('Starting PO line lookup');
                        request = new MIRequest();
                        request.program = 'PPS200MI';
                        request.transaction = 'GetLine';
                        request.record = {
                            PUNO: this.PUNO,
                            PNLI: this.PNLI,
                            PNLS: this.PNLS
                        };
                        request.maxReturnedRecords = 1;
                        this.logMIRequest(request.program, request.transaction, request.record);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.mi.executeRequest(request)];
                    case 2:
                        response = _a.sent();
                        this.logMIResponse(request.program, request.transaction, response, true);
                        if (!response || !response.item) {
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
                            PUUN: response.item.PUUN
                        };
                        Object.assign(this, poLineData);
                        console.log('[PO-LINE-DATA] Retrieved:', JSON.stringify(poLineData, null, 2));
                        this.log.Info('PO line data retrieved successfully');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logMIResponse(request.program, request.transaction, error_1, false);
                        this.log.Error('Failed to retrieve PO line data', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.lookups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var headerRequest, header, errorMessage, headerData, whsRequest, whs, itemRequest, itm, errorMessage, itemData, isNonMaterial, remRequest, rem, errorMessage, customerRequest, c, errorMessage, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        this.log.Info('Starting comprehensive data lookups');
                        headerRequest = new MIRequest();
                        headerRequest.program = 'PPS200MI';
                        headerRequest.transaction = 'GetHead';
                        headerRequest.record = { PUNO: this.PUNO };
                        headerRequest.maxReturnedRecords = 1;
                        this.logMIRequest(headerRequest.program, headerRequest.transaction, headerRequest.record);
                        return [4 /*yield*/, this.mi.executeRequest(headerRequest)];
                    case 1:
                        header = _a.sent();
                        this.logMIResponse(headerRequest.program, headerRequest.transaction, header, true);
                        if (!header || !header.item) {
                            errorMessage = this.extractErrorMessage(header, 'PO header retrieval');
                            throw new Error(errorMessage);
                        }
                        headerData = {
                            PUDT: header.item.PUDT, // Order Date
                            CUCD: header.item.CUCD, // Currency Code
                            FACI: header.item.FACI // Facility
                        };
                        Object.assign(this, headerData);
                        console.log('[HEADER-DATA] Retrieved:', JSON.stringify(headerData, null, 2));
                        whsRequest = new MIRequest();
                        whsRequest.program = 'MMS009MI';
                        whsRequest.transaction = 'Get';
                        whsRequest.record = { WHGR: 'WMSWHSE', WHLO: this.WHLO };
                        whsRequest.maxReturnedRecords = 1;
                        this.logMIRequest(whsRequest.program, whsRequest.transaction, whsRequest.record);
                        return [4 /*yield*/, this.mi.executeRequest(whsRequest)];
                    case 2:
                        whs = _a.sent();
                        this.logMIResponse(whsRequest.program, whsRequest.transaction, whs, true);
                        // If record exists, warehouse is WMS-managed
                        this.isWmsWhs = !!(whs && whs.item);
                        console.log("[WMS-CHECK] Warehouse ".concat(this.WHLO, " is WMS-managed: ").concat(this.isWmsWhs));
                        this.log.Info("WMS warehouse check completed - isWmsWhs: ".concat(this.isWmsWhs));
                        itemRequest = new MIRequest();
                        itemRequest.program = 'MMS200MI';
                        itemRequest.transaction = 'GetItmBasic';
                        itemRequest.record = { ITNO: this.ITNO, ALFM: '1' };
                        itemRequest.maxReturnedRecords = 1;
                        this.logMIRequest(itemRequest.program, itemRequest.transaction, itemRequest.record);
                        return [4 /*yield*/, this.mi.executeRequest(itemRequest)];
                    case 3:
                        itm = _a.sent();
                        this.logMIResponse(itemRequest.program, itemRequest.transaction, itm, true);
                        if (!itm || !itm.item) {
                            errorMessage = this.extractErrorMessage(itm, 'Item details retrieval');
                            throw new Error(errorMessage);
                        }
                        itemData = {
                            EXPD: itm.item.EXPD, // Expiration Date Required (0/1)
                            INDI: itm.item.INDI, // Lot Control Method (0=None, 1=Manual, 2=Serial, 3=Lot)
                            TPCD: itm.item.TPCD // Item Category (13=Non-material)
                        };
                        Object.assign(this, itemData);
                        console.log('[ITEM-DATA] Retrieved:', JSON.stringify(itemData, null, 2));
                        isNonMaterial = this.INDI === '0' && this.TPCD === '13';
                        console.log("[ITEM-ANALYSIS] isNonMaterial: ".concat(isNonMaterial, ", WHSL: ").concat(this.WHSL));
                        if (!isNonMaterial && !this.WHSL) {
                            throw new Error('Warehouse location (WHSL) is required for material items');
                        }
                        this.log.Info("Item validation completed - INDI: ".concat(this.INDI, ", TPCD: ").concat(this.TPCD, ", isNonMaterial: ").concat(isNonMaterial));
                        remRequest = new MIRequest();
                        remRequest.program = 'PPS001MI';
                        remRequest.transaction = 'GetBasicData2';
                        remRequest.record = { PUNO: this.PUNO, PNLI: this.PNLI, PNLS: this.PNLS };
                        remRequest.maxReturnedRecords = 1;
                        this.logMIRequest(remRequest.program, remRequest.transaction, remRequest.record);
                        return [4 /*yield*/, this.mi.executeRequest(remRequest)];
                    case 4:
                        rem = _a.sent();
                        this.logMIResponse(remRequest.program, remRequest.transaction, rem, true);
                        if (!rem || !rem.item) {
                            errorMessage = this.extractErrorMessage(rem, 'Remaining quantity retrieval');
                            throw new Error(errorMessage);
                        }
                        this.RMQA = rem.item.RSTQ; // Remaining Quantity
                        console.log("[REMAINING-QTY] RMQA: ".concat(this.RMQA, ", RVQA: ").concat(this.RVQA));
                        if (!(this.RORC === '3' && this.RORN)) return [3 /*break*/, 6];
                        customerRequest = new MIRequest();
                        customerRequest.program = 'OIS100MI';
                        customerRequest.transaction = 'GetOrderHead';
                        customerRequest.record = { ORNO: this.RORN }; // Related Order Number
                        customerRequest.maxReturnedRecords = 1;
                        this.logMIRequest(customerRequest.program, customerRequest.transaction, customerRequest.record);
                        return [4 /*yield*/, this.mi.executeRequest(customerRequest)];
                    case 5:
                        c = _a.sent();
                        this.logMIResponse(customerRequest.program, customerRequest.transaction, c, true);
                        if (!c || !c.item) {
                            errorMessage = this.extractErrorMessage(c, 'Customer order details retrieval');
                            throw new Error(errorMessage);
                        }
                        this.CUNO = c.item.CUNO; // Customer Number for equipment records
                        console.log("[CUSTOMER-DATA] CO customer: ".concat(this.CUNO));
                        _a.label = 6;
                    case 6:
                        console.log('[LOOKUPS-COMPLETE] All data lookups successful');
                        this.log.Info('All lookups completed successfully');
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        this.log.Error('Data lookup failed', error_2);
                        throw error_2;
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
            _this.log.Info("Displaying warning dialog: ".concat(msg));
            // Create dialog content following H5SampleCustomDialog pattern
            var dialogContent = $("<div><label class='inforLabel noColon'>".concat(msg, "</label></div>"));
            // Helper to close dialog and resolve promise
            var handleProceed = function () {
                closedByButton = true;
                if (ScriptUtil.version >= 2.0) {
                    $('.ui-dialog-content:visible').dialog('close');
                }
                else {
                    $(dialogContent).inforDialog("close");
                }
                resolve(undefined);
            };
            // Add Enter key handling for warning dialog
            dialogContent.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Trigger Proceed button (default action)
                    var proceedButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function () {
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
                    text: "Proceed",
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                        resolve(undefined);
                    }
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Operation cancelled by user'));
                    }
                }
            ];
            var dialogOptions = {
                title: "⚠️ Warning",
                dialogType: "General",
                modal: true, // Changed back to true
                width: 500,
                minHeight: 200,
                icon: "warning",
                closeOnEscape: true,
                close: function () {
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Operation cancelled by user')); // Handle escape/X button same as Cancel
                    }
                },
                buttons: dialogButtons
            };
            // Show dialog with proper version handling (H5SampleCustomDialog pattern)
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
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
            _this.log.Info("Requesting confirmation to receive ".concat(_this.RVQA, " units"));
            // Create dialog content following H5SampleCustomDialog pattern
            var dialogContent = $("<div><label class='inforLabel noColon'>Receive ".concat(_this.RVQA, " unit(s)?</label></div>"));
            // Helper to close dialog and resolve promise
            var handleConfirm = function () {
                closedByButton = true;
                if (ScriptUtil.version >= 2.0) {
                    $('.ui-dialog-content:visible').dialog('close');
                }
                else {
                    $(dialogContent).inforDialog("close");
                }
                resolve(undefined);
            };
            // Add Enter key handling for confirm dialog
            dialogContent.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Trigger Confirm button
                    var confirmButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function () {
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
                    text: "Confirm",
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                        resolve(undefined);
                    }
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Receipt cancelled by user'));
                    }
                }
            ];
            var dialogOptions = {
                title: "🔄 Confirm Receipt",
                dialogType: "General",
                modal: true, // Changed back to true
                width: 400,
                minHeight: 180,
                icon: "info",
                closeOnEscape: true,
                close: function () {
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Receipt cancelled by user')); // Handle escape/X button same as Cancel
                    }
                },
                buttons: dialogButtons
            };
            // Show dialog with proper version handling (H5SampleCustomDialog pattern)
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
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
            var qty = _this.num(_this.RVQA);
            _this.log.Info("Prompting for ".concat(qty, " serial numbers"));
            // Safety check: Prevent excessive quantity that could crash browser
            var MAX_SERIALS = 25; // Reasonable limit for manual entry
            if (qty > MAX_SERIALS) {
                _this.logError("Serial quantity ".concat(qty, " exceeds maximum allowed ").concat(MAX_SERIALS));
                reject(new Error("Cannot process ".concat(qty, " serials. Maximum allowed is ").concat(MAX_SERIALS, ". Please use batch import for large quantities.")));
                return;
            }
            // Create scrollable form content with input fields for each serial
            // Using a scrollable container to handle large quantities without bleeding off-screen
            var formHtml = '<div style="padding: 15px;">';
            // Add PO number display with copy functionality (fixed at top, outside scroll area)
            formHtml += "<div style=\"margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;\">\n                <label class=\"inforLabel\" style=\"font-weight: bold; font-size: 11px;\">PO:</label>\n                <div style=\"display: flex; align-items: center; margin-top: 2px;\">\n                    <input id=\"poNumberDisplay\" type=\"text\" readonly value=\"".concat(_this.PUNO, "\" \n                           style=\"flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;\">\n                    <button type=\"button\" id=\"copyPoNumber\" style=\"margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;\" title=\"Copy PO number\">\uD83D\uDCCB</button>\n                    <button type=\"button\" id=\"generateSerials\" style=\"margin-left: 6px; padding: 3px 6px; background: #2C8C3E; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;\" title=\"Generate serials\">\uD83D\uDD22</button>\n                </div>\n                <div style=\"margin-top: 4px; font-size: 11px; color: #666;\">\n                    <strong>Quantity:</strong> ").concat(qty, " serial").concat(qty !== 1 ? 's' : '', " required\n                </div>\n            </div>");
            // Scrollable container for serial inputs - prevents off-screen bleeding
            // Max height ensures dialog fits on screen while allowing smooth scrolling
            formHtml += '<div id="serialInputsContainer" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; padding-right: 5px;"><form>';
            for (var i = 0; i < qty; i++) {
                formHtml += "<div style=\"margin-bottom: 10px;\">\n                    <label class=\"inforLabel\" for=\"serial".concat(i, "\">Serial ").concat(i + 1, ":</label>\n                    <input id=\"serial").concat(i, "\" type=\"text\" class=\"inforTextBox\" maxlength=\"20\" \n                           placeholder=\"Enter serial number\" style=\"width: 100%; text-transform: uppercase;\" \n                           ").concat(i === 0 ? 'autofocus' : '', ">\n                </div>");
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
                dialogContent.find('#serialInputsContainer').before(errorDiv);
                // Auto-remove after 5 seconds
                setTimeout(function () { return errorDiv.fadeOut(function () { return errorDiv.remove(); }); }, 5000);
            };
            // Bind the validation error method to the correct context
            var showValidationError = dialogContent.showValidationError;
            // Add copy functionality for PO number
            dialogContent.find('#copyPoNumber').on('click', function () {
                var poInput = dialogContent.find('#poNumberDisplay')[0];
                poInput.select();
                document.execCommand('copy');
                // Visual feedback
                var btn = $(this);
                var originalText = btn.text();
                btn.text('✓ Copied!').css('background', '#28a745');
                setTimeout(function () {
                    btn.text(originalText).css('background', '#0072C6');
                }, 1500);
            });
            // Add auto-generate functionality for sequential serials
            dialogContent.find('#generateSerials').on('click', function () {
                var poNumber = dialogContent.find('#poNumberDisplay').val();
                console.log("[GENERATE-SERIALS] Auto-generating ".concat(qty, " sequential serials based on PO: ").concat(poNumber));
                // Clear any existing error messages
                dialogContent.find('.validation-error').remove();
                // Populate each input field with PO-N format
                for (var i = 0; i < qty; i++) {
                    var serialValue = "".concat(poNumber, "-").concat(i + 1);
                    var inputField = dialogContent.find("#serial".concat(i));
                    inputField.val(serialValue);
                    // Clear any error styling
                    inputField.css('border-color', '');
                    inputField.css('background-color', '');
                }
                console.log("[GENERATE-SERIALS] \u2713 Generated serials: ".concat(poNumber, "-1 through ").concat(poNumber, "-").concat(qty));
                // Show success feedback
                var successMsg = $('<div class="validation-success" style="padding: 6px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 3px; margin-bottom: 10px; font-size: 12px;">✓ Generated ' + qty + ' sequential serial' + (qty !== 1 ? 's' : '') + ': ' + poNumber + '-1 through ' + poNumber + '-' + qty + '</div>');
                dialogContent.find('#serialInputsContainer').before(successMsg);
                // Auto-remove success message after 3 seconds
                setTimeout(function () { return successMsg.fadeOut(300, function () { $(this).remove(); }); }, 3000);
                // Visual feedback on button
                var btn = $(this);
                var originalText = btn.text();
                btn.text('✓ Done!').css('background', '#28a745');
                setTimeout(function () {
                    btn.text(originalText).css('background', '#2C8C3E');
                }, 1500);
                // Focus on the first input for immediate review/editing
                dialogContent.find('#serial0').focus();
            });
            // Add input validation and uppercase conversion
            dialogContent.find('input').on('input', function () {
                this.value = this.value.toUpperCase();
                $(this).css('border', ''); // Clear any error styling
            });
            // Enable right-click context menu for all input fields (for paste functionality)
            dialogContent.find('input').on('contextmenu', function (e) {
                e.stopPropagation(); // Allow default right-click menu on inputs
            });
            // Helper to validate and collect serials from input fields
            var validateAndCollectSerials = function () {
                var serials = [];
                var invalid = [];
                // Validate all serial inputs - check format and presence first
                for (var i = 0; i < qty; i++) {
                    var $field = dialogContent.find("#serial".concat(i));
                    var val = $field.val().trim();
                    if (!val) {
                        $field.css('border', '2px solid red');
                        invalid.push("Serial ".concat(i + 1, " (blank)"));
                    }
                    else if (val.length > 20) {
                        $field.css('border', '2px solid red');
                        invalid.push("Serial ".concat(i + 1, " (too long)"));
                    }
                    else if (!/^[A-Z0-9\-]+$/.test(val)) {
                        $field.css('border', '2px solid red');
                        invalid.push("Serial ".concat(i + 1, " (invalid characters)"));
                    }
                    else {
                        serials.push(val);
                    }
                }
                // Show validation errors if any invalid entries found
                if (invalid.length) {
                    showValidationError("Invalid or blank input in: ".concat(invalid.join(', '), "\nSerials must be alphanumeric (A-Z, 0-9, hyphen allowed), max 20 characters."));
                    return null;
                }
                // Check for duplicates only after all serials are validated
                if (new Set(serials).size !== qty) {
                    var seen_1 = new Set();
                    var duplicates_1 = [];
                    serials.forEach(function (serial, idx) {
                        if (seen_1.has(serial)) {
                            dialogContent.find("#serial".concat(idx)).css('border', '2px solid orange');
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
                        $(dialogContent).inforDialog("close");
                    }
                }
                else {
                    // Called from keydown fallback - use DOM method
                    if (ScriptUtil.version >= 2.0) {
                        $('.ui-dialog-content:visible').dialog('close');
                    }
                    else {
                        $(dialogContent).inforDialog("close");
                    }
                }
                resolve(serials);
            };
            // Add Enter key handling for serial inputs
            dialogContent.find('input[id^="serial"]').on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var currentIndex = parseInt(this.id.replace('serial', ''));
                    if (qty > 1 && currentIndex < qty - 1) {
                        // Multiple serials: move to next input and scroll it into view
                        var nextInput = dialogContent.find("#serial".concat(currentIndex + 1));
                        nextInput.focus();
                        // Ensure the next input is visible in the scrollable container
                        var container = dialogContent.find('#serialInputsContainer');
                        var nextInputOffset = nextInput.position().top;
                        if (nextInputOffset > container.height() - 60) {
                            container.scrollTop(container.scrollTop() + 60);
                        }
                    }
                    else {
                        // Last serial or single serial: trigger Save button
                        var saveButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function () {
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
                    text: "Save",
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        handleSaveSerials(model);
                    }
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Serial input cancelled by user'));
                    }
                }
            ];
            var dialogOptions = {
                title: "📋 Enter Serial Numbers",
                dialogType: "General",
                modal: true,
                width: 500, // Increased width for better readability with scrollbar
                height: Math.min(600, 250 + (Math.min(qty, 10) * 40)), // Dynamic height, capped at 600px
                maxHeight: 600, // Enforce maximum height to prevent off-screen dialogs
                icon: "info",
                closeOnEscape: true,
                close: function () {
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Serial input cancelled by user')); // Handle escape/X button same as Cancel
                    }
                },
                buttons: dialogButtons
            };
            // Show dialog with proper version handling (H5SampleCustomDialog pattern)
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
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
            _this.log.Info('Prompting for lot number and expiration date');
            // Create form content for lot number and optional expiration date
            var formHtml = '<div style="padding: 15px;"><form>';
            // Add PO number display with copy functionality (smaller version)
            formHtml += "<div style=\"margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;\">\n                <label class=\"inforLabel\" style=\"font-weight: bold; font-size: 11px;\">PO:</label>\n                <div style=\"display: flex; align-items: center; margin-top: 2px;\">\n                    <input id=\"poNumberDisplay\" type=\"text\" readonly value=\"".concat(_this.PUNO, "\" \n                           style=\"flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;\">\n                    <button type=\"button\" id=\"copyPoNumber\" style=\"margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;\">\uD83D\uDCCB</button>\n                </div>\n            </div>");
            formHtml += "<div style=\"margin-bottom: 15px;\">\n                <label class=\"inforLabel\" for=\"lotNumber\">Lot Number:</label>\n                <input id=\"lotNumber\" type=\"text\" class=\"inforTextBox\" maxlength=\"20\" \n                       placeholder=\"Enter lot number\" style=\"width: 100%; text-transform: uppercase;\" autofocus>\n            </div>";
            if (_this.EXPD === '1') {
                formHtml += "<div style=\"margin-bottom: 15px;\">\n                    <label class=\"inforLabel\" for=\"expirationDate\">Expiration Date:</label>\n                    <input id=\"expirationDate\" type=\"date\" class=\"inforTextBox\" \n                           style=\"width: 100%;\" title=\"Press 'T' for today's date\">\n                    <small style=\"color: #666;\">Press 'T' for today's date</small>\n                </div>";
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
            dialogContent.find('#copyPoNumber').on('click', function () {
                var poInput = dialogContent.find('#poNumberDisplay')[0];
                poInput.select();
                document.execCommand('copy');
                // Visual feedback
                var btn = $(this);
                var originalText = btn.text();
                btn.text('✓ Copied!').css('background', '#28a745');
                setTimeout(function () {
                    btn.text(originalText).css('background', '#0072C6');
                }, 1500);
            });
            // Add input validation and uppercase conversion for lot number
            dialogContent.find('#lotNumber').on('input', function () {
                this.value = this.value.toUpperCase();
                $(this).css('border', ''); // Clear any error styling
            });
            // Enable right-click context menu for all input fields (for paste functionality)
            dialogContent.find('input').on('contextmenu', function (e) {
                e.stopPropagation(); // Allow default right-click menu on inputs
            });
            // Add Enter key handling for lot inputs
            dialogContent.find('#lotNumber, #expirationDate').on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.id === 'lotNumber' && this.EXPD === '1') {
                        // Move to expiration date if it exists
                        dialogContent.find('#expirationDate').focus();
                    }
                    else {
                        // Trigger Save button
                        var saveButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function () {
                            return $(this).text().trim() === 'Save';
                        });
                        if (saveButton.length > 0) {
                            saveButton.click();
                        }
                        else {
                            // Fallback: simulate Save button click with proper validation
                            var $lot = dialogContent.find('#lotNumber');
                            var lot = $lot.val().trim();
                            var expi = null;
                            var errors = [];
                            // Validate lot number
                            if (!lot || lot.length > 20 || !/^[A-Z0-9\-]+$/.test(lot)) {
                                $lot.css('border', '2px solid red');
                                errors.push('Lot number required (alphanumeric, max 20 chars)');
                            }
                            // Validate expiration date if required
                            if (this.EXPD === '1') {
                                var $exp = dialogContent.find('#expirationDate');
                                var expDate = $exp.val();
                                if (!expDate) {
                                    $exp.css('border', '2px solid red');
                                    errors.push('Expiration date required');
                                }
                                else {
                                    expi = expDate.replace(/-/g, ''); // Convert YYYY-MM-DD to YYYYMMDD
                                }
                            }
                            // Show validation errors if any
                            if (errors.length) {
                                showValidationError(errors.join('\n'));
                                return;
                            }
                            // Close dialog and return lot data (duplicate the Save button success logic)
                            closedByButton = true;
                            if (ScriptUtil.version >= 2.0) {
                                $('.ui-dialog-content:visible').dialog('close');
                            }
                            else {
                                $(dialogContent).inforDialog("close");
                            }
                            resolve({ lot: lot, expi: expi });
                        }
                    }
                }
            }.bind(_this));
            // Add 'T' for today shortcut for expiration date
            if (_this.EXPD === '1') {
                dialogContent.find('#expirationDate').on('keydown', function (e) {
                    if (e.key.toLowerCase() === 't') {
                        e.preventDefault();
                        $(this).val(new Date().toISOString().slice(0, 10));
                        $(this).css('border', ''); // Clear any error styling
                    }
                });
                dialogContent.find('#expirationDate').on('change', function () {
                    $(this).css('border', ''); // Clear any error styling
                });
            }
            var dialogButtons = [
                {
                    text: "Save",
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        var $lot = dialogContent.find('#lotNumber');
                        var lot = $lot.val().trim();
                        var expi = null;
                        var errors = [];
                        // Validate lot number
                        if (!lot || lot.length > 20 || !/^[A-Z0-9\-]+$/.test(lot)) {
                            $lot.css('border', '2px solid red');
                            errors.push('Lot number required (alphanumeric, max 20 chars)');
                        }
                        // Validate expiration date if required
                        if (this.EXPD === '1') {
                            var $exp = dialogContent.find('#expirationDate');
                            var expDate = $exp.val();
                            if (!expDate) {
                                $exp.css('border', '2px solid red');
                                errors.push('Expiration date required');
                            }
                            else {
                                expi = expDate.replace(/-/g, ''); // Convert YYYY-MM-DD to YYYYMMDD
                            }
                        }
                        // Show validation errors if any
                        if (errors.length) {
                            showValidationError(errors.join('\n'));
                            return;
                        }
                        // Close dialog and return lot data
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                        resolve({ lot: lot, expi: expi });
                    }.bind(_this)
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Lot input cancelled by user'));
                    }
                }
            ];
            var dialogOptions = {
                title: "📦 Enter Lot Number",
                dialogType: "General",
                modal: true, // Changed back to true
                width: 450,
                minHeight: _this.EXPD === '1' ? 280 : 220, // Dynamic height based on expiration requirement
                icon: "info",
                closeOnEscape: true,
                close: function () {
                    dialogContent.remove();
                    if (!closedByButton) {
                        reject(new Error('Lot input cancelled by user')); // Handle escape/X button same as Cancel
                    }
                },
                buttons: dialogButtons
            };
            // Show dialog with proper version handling (H5SampleCustomDialog pattern)
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            }
            else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    };
    /*───────────────── VALIDATION / EQUIPMENT ─────────────────*/
    class_1.prototype.checkSer = function (arr) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("[SERIAL-CHECK] Starting validation for ".concat(arr.length, " serial numbers:"), arr);
                this.logDebug("checkSer: Validating ".concat(arr.length, " serial numbers"));
                // Validate each serial number doesn't already exist in M3
                return [2 /*return*/, Promise.all(arr.map(function (s, index) {
                        var rq = Object.assign(new MIRequest(), {
                            program: 'MMS235MI', // Item Lot API
                            transaction: 'GetItmLot',
                            record: { ITNO: _this.ITNO, BANO: s }, // BANO = Batch/Serial Number
                            maxReturnedRecords: 1
                        });
                        console.log("[SERIAL-CHECK-".concat(index + 1, "] Checking serial: ").concat(s));
                        _this.logMIRequest(rq.program, rq.transaction, rq.record);
                        return _this.mi.executeRequest(rq).then(function (r) {
                            _this.logMIResponse(rq.program, rq.transaction, r, true);
                            // Check both ITNO and BANO match - if found, serial already exists
                            if (r && r.item && r.item.ITNO === _this.ITNO && r.item.BANO === s) {
                                var error = "Serial ".concat(s, " for item ").concat(_this.ITNO, " already exists.");
                                console.error("[SERIAL-CHECK-".concat(index + 1, "] DUPLICATE FOUND:"), error);
                                _this.logWarning("checkSer: ".concat(error));
                                throw new Error(error);
                            }
                            console.log("[SERIAL-CHECK-".concat(index + 1, "] \u2713 Serial ").concat(s, " available"));
                            _this.logDebug("checkSer: Serial ".concat(s, " validation passed"));
                        }, function (e) {
                            _this.logMIResponse(rq.program, rq.transaction, e, false);
                            // Status 400 = Record not found (expected for new serials)
                            if (e.statusCode === 400) {
                                console.log("[SERIAL-CHECK-".concat(index + 1, "] \u2713 Serial ").concat(s, " does not exist (expected)"));
                                _this.logDebug("checkSer: Serial ".concat(s, " does not exist (expected)"));
                                return;
                            }
                            console.error("[SERIAL-CHECK-".concat(index + 1, "] ERROR checking serial ").concat(s, ":"), e);
                            _this.logError("checkSer: Error checking serial ".concat(s), e);
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
                this.logDebug("checkLot: Validating lot ".concat(lot));
                rq = Object.assign(new MIRequest(), {
                    program: 'MMS235MI',
                    transaction: 'GetItmLot',
                    record: { ITNO: this.ITNO, BANO: lot },
                    maxReturnedRecords: 1
                });
                return [2 /*return*/, this.mi.executeRequest(rq).then(function (r) {
                        // Check both ITNO and BANO match - if found, lot already exists
                        if (r && r.item && r.item.ITNO === _this.ITNO && r.item.BANO === lot) {
                            var error = "Lot ".concat(lot, " for item ").concat(_this.ITNO, " already exists.");
                            _this.logWarning("checkLot: ".concat(error));
                            throw new Error(error);
                        }
                        _this.logDebug("checkLot: Lot ".concat(lot, " validation passed"));
                    }, function (e) {
                        if (e.statusCode === 400) {
                            _this.logDebug("checkLot: Lot ".concat(lot, " does not exist (expected)"));
                            return;
                        }
                        _this.logError("checkLot: Error checking lot ".concat(lot), e);
                        throw e;
                    })];
            });
        });
    };
    class_1.prototype.addEquip = function (arr) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Create equipment records for serial controlled items
                        // Initialize tracking array for potential rollback operations
                        this.createdEquipment = [];
                        console.log("[EQUIPMENT-ADD] Starting creation of ".concat(arr.length, " equipment records"));
                        this.logDebug("addEquip: Creating equipment records for ".concat(arr.length, " serials"));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, Promise.all(arr.map(function (s, index) { return __awaiter(_this, void 0, void 0, function () {
                                var rq, result, errorMsg;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            rq = new MIRequest();
                                            rq.program = 'MMS240MI'; // Equipment API
                                            rq.transaction = 'Add';
                                            rq.maxReturnedRecords = 1;
                                            rq.record = {
                                                ITNO: this.ITNO, // Item Number
                                                SERN: s, // Serial Number
                                                STAT: "20", // Status (20 = In Stock)
                                                CUNO: this.CUNO, // Customer Number (hard referenced for order initiated orders)
                                                PUPR: this.PUPR, // Purchase Price
                                                CUCD: this.CUCD, // Currency Code
                                                PPDT: this.today(), // Purchase Date (today)
                                                FACI: this.FACI, // Facility
                                                CUOW: this.CUNO, // Current Owner
                                                OWTP: "0", // Owner Type (0 = Company)
                                                PUNO: this.PUNO, // Purchase Order Number
                                                PNLI: this.PNLI, // PO Line Number
                                                PNLS: this.PNLS, // PO Line Suffix
                                                ALII: this.ITDS, // Item Description
                                            };
                                            console.log("[EQUIPMENT-ADD-".concat(index + 1, "] Creating equipment for serial: ").concat(s));
                                            this.logMIRequest(rq.program, rq.transaction, rq.record);
                                            return [4 /*yield*/, this.mi.executeRequest(rq)];
                                        case 1:
                                            result = _a.sent();
                                            this.logMIResponse(rq.program, rq.transaction, result, true);
                                            if (!result || !result.item) {
                                                errorMsg = this.extractErrorMessage(result, "Equipment creation for serial ".concat(s));
                                                throw new Error(errorMsg);
                                            }
                                            // Track successful equipment creation for potential rollback
                                            this.createdEquipment.push({
                                                ITNO: this.ITNO,
                                                SERN: s // SERN is equivalent to BANO for rollback operations
                                            });
                                            console.log("[EQUIPMENT-ADD-".concat(index + 1, "] \u2713 Successfully created equipment for serial: ").concat(s));
                                            this.logDebug("addEquip: Successfully added equipment record for serial ".concat(s));
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        console.log("[EQUIPMENT-ADD-COMPLETE] All ".concat(arr.length, " equipment records created successfully"));
                        return [3 /*break*/, 5];
                    case 3:
                        error_3 = _a.sent();
                        // If any equipment creation fails, rollback the ones that succeeded
                        console.error('[EQUIPMENT-ADD-FAILED] Equipment creation failed, initiating rollback:', error_3);
                        this.logError("addEquip: Equipment creation failed, initiating rollback", error_3);
                        return [4 /*yield*/, this.rollbackEquipment()];
                    case 4:
                        _a.sent();
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Rollback equipment records if receipt processing fails after equipment creation
     * Uses MMS240MI.Del to remove orphaned equipment records
     */
    class_1.prototype.rollbackEquipment = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rollbackPromises, results, successful, failed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.createdEquipment || this.createdEquipment.length === 0) {
                            console.log('[ROLLBACK] No equipment records to rollback');
                            this.logDebug('rollbackEquipment: No equipment records to rollback');
                            return [2 /*return*/];
                        }
                        console.log("[ROLLBACK] Rolling back ".concat(this.createdEquipment.length, " equipment records:"), this.createdEquipment);
                        this.logWarning("rollbackEquipment: Rolling back ".concat(this.createdEquipment.length, " equipment records"));
                        rollbackPromises = this.createdEquipment.map(function (equip, index) { return __awaiter(_this, void 0, void 0, function () {
                            var deleteRequest, result, rollbackError_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        deleteRequest = new MIRequest();
                                        deleteRequest.program = 'MMS240MI'; // Equipment API
                                        deleteRequest.transaction = 'Del'; // Delete transaction
                                        deleteRequest.maxReturnedRecords = 1;
                                        deleteRequest.record = {
                                            ITNO: equip.ITNO, // Item Number
                                            SERN: equip.SERN // Serial Number (equivalent to BANO)
                                        };
                                        console.log("[ROLLBACK-".concat(index + 1, "] Deleting equipment for serial: ").concat(equip.SERN));
                                        this.logMIRequest(deleteRequest.program, deleteRequest.transaction, deleteRequest.record);
                                        return [4 /*yield*/, this.mi.executeRequest(deleteRequest)];
                                    case 1:
                                        result = _a.sent();
                                        this.logMIResponse(deleteRequest.program, deleteRequest.transaction, result, true);
                                        console.log("[ROLLBACK-".concat(index + 1, "] \u2713 Successfully deleted equipment for serial: ").concat(equip.SERN));
                                        this.logDebug("rollbackEquipment: Successfully deleted equipment record for serial ".concat(equip.SERN));
                                        return [3 /*break*/, 3];
                                    case 2:
                                        rollbackError_1 = _a.sent();
                                        // Log rollback failure but continue with other deletions
                                        console.error("[ROLLBACK-".concat(index + 1, "] \u2717 Failed to delete equipment for serial: ").concat(equip.SERN), rollbackError_1);
                                        this.logMIResponse('MMS240MI', 'Del', rollbackError_1, false);
                                        this.logError("rollbackEquipment: Failed to delete equipment for serial ".concat(equip.SERN), rollbackError_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.allSettled(rollbackPromises)];
                    case 1:
                        results = _a.sent();
                        successful = results.filter(function (r) { return r.status === 'fulfilled'; }).length;
                        failed = results.filter(function (r) { return r.status === 'rejected'; }).length;
                        if (failed > 0) {
                            console.log("[ROLLBACK-SUMMARY] Completed with ".concat(successful, " successful, ").concat(failed, " failed deletions"));
                            this.logWarning("rollbackEquipment: Completed with ".concat(successful, " successful, ").concat(failed, " failed deletions"));
                        }
                        else {
                            console.log("[ROLLBACK-SUMMARY] Successfully rolled back all ".concat(successful, " equipment records"));
                            this.logInfo("rollbackEquipment: Successfully rolled back all ".concat(successful, " equipment records"));
                        }
                        // Clear the tracking array
                        this.createdEquipment = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    /*───────────────── RECEIPT ENGINE ─────────────────*/
    class_1.prototype.process = function (lines, onePackPerSerial) {
        return __awaiter(this, void 0, void 0, function () {
            var head, h, errorMessage, packNumber_1, pack, packResult, pr, prc, errorMessage, statusCheck, statusResult, transactionStatus, errorMessage, troubleshootingInfo, extracted, statusDescriptions, statusDesc, lines_1, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("[RECEIPT-PROCESS] Starting with ".concat(lines.length, " line(s), onePackPerSerial: ").concat(onePackPerSerial));
                        console.log('[RECEIPT-LINES] Processing lines:', JSON.stringify(lines, null, 2));
                        this.logDebug("process: Starting receipt with ".concat(lines.length, " lines"));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 15]);
                        head = Object.assign(new MIRequest(), {
                            program: "MHS850MI", // Interface Transaction Processing API
                            transaction: "AddWhsHead", // Create transaction header
                            maxReturnedRecords: 1,
                            record: {
                                WHLO: this.WHLO, // Warehouse
                                QLFR: "20", // Qualifier (20 = Purchase Receipt)
                                E0PA: "WS", // WS Partner (MMS865)
                                E0PB: "WS", // WS Partner (MMS865)
                                E007: "20", // Qualifier (20 = Purchase Receipt)
                                E065: "PPS300", // Message Type (MMS865)
                            },
                        });
                        console.log('[WHS-HEAD] AddWhsHead payload:', JSON.stringify(head.record, null, 2));
                        this.logMIRequest(head.program, head.transaction, head.record);
                        return [4 /*yield*/, this.mi.executeRequest(head)];
                    case 2:
                        h = _a.sent();
                        this.logMIResponse(head.program, head.transaction, h, true);
                        // Validate header creation was successful
                        if (!h || !h.item || !h.item.MSGN) {
                            console.error('[WHS-HEAD-ERROR] AddWhsHead failed response:', JSON.stringify(h, null, 2));
                            errorMessage = this.extractErrorMessage(h, 'Warehouse transaction header creation');
                            throw new Error(errorMessage);
                        }
                        // Store message number for subsequent WMS transactions
                        this.MSGN = h.item.MSGN;
                        console.log('[WHS-HEAD-SUCCESS] → MSGN received:', this.MSGN);
                        packNumber_1 = "".concat(this.PUNO, "_").concat(this.PNLI);
                        pack = new MIRequest();
                        pack.program = 'MHS850MI';
                        pack.transaction = 'AddWhsPack';
                        pack.maxReturnedRecords = 1;
                        pack.record = {
                            WHLO: this.WHLO,
                            MSGN: this.MSGN,
                            PACN: packNumber_1, // Pack Number = PUNO_PNLI
                            QLFR: '20'
                        };
                        console.log('[WHS-PACK] AddWhsPack (unified):', JSON.stringify(pack.record, null, 2));
                        this.logMIRequest(pack.program, pack.transaction, pack.record);
                        return [4 /*yield*/, this.mi.executeRequest(pack)];
                    case 3:
                        packResult = _a.sent();
                        this.logMIResponse(pack.program, pack.transaction, packResult, true);
                        // Brief delay to ensure pack creation is committed before adding lines
                        return [4 /*yield*/, this.sleep(50)];
                    case 4:
                        // Brief delay to ensure pack creation is committed before adding lines
                        _a.sent();
                        // Add all line items to the single pack
                        console.log("[WHS-LINES] Adding ".concat(lines.length, " line(s) to pack ").concat(packNumber_1));
                        return [4 /*yield*/, Promise.all(lines.map(function (rec, index) {
                                var line = new MIRequest();
                                line.program = 'MHS850MI';
                                line.transaction = 'AddWhsLine';
                                line.maxReturnedRecords = 100;
                                line.record = {
                                    WHLO: _this.WHLO,
                                    MSGN: _this.MSGN,
                                    PACN: packNumber_1, // All lines use same pack number (PUNO_PNLI)
                                    QLFR: '20',
                                    ITNO: _this.ITNO, // Item Number
                                    RVQA: rec.RVQA, // Received Quantity (1 for serials, full qty for others)
                                    PUUN: _this.PUUN,
                                    RIDN: _this.PUNO, // Reference ID (PO Number)
                                    RIDL: _this.PNLI, // Reference Line (PO Line)
                                    RIDX: _this.PNLS, // Reference Suffix (PO Line Suffix)
                                    OEND: _this.OEND // Flag Completed signifier
                                };
                                // Add warehouse location only for material items (non-material items don't use WHSL)
                                var isNonMaterial = _this.INDI === '0' && _this.TPCD === '13';
                                if (!isNonMaterial) {
                                    line.record.WHSL = _this.WHSL; // Warehouse Location
                                }
                                // Conditionally add batch/lot/serial and expiration data
                                if (rec.BANO)
                                    line.record.BANO = rec.BANO; // Batch/Serial/Lot Number
                                if (rec.EXPI)
                                    line.record.EXPI = rec.EXPI; // Expiration Date
                                console.log("[WHS-LINE-".concat(index + 1, "] Adding line:"), JSON.stringify(line.record, null, 2));
                                _this.logMIRequest(line.program, line.transaction, line.record);
                                return _this.mi.executeRequest(line).then(function (result) {
                                    _this.logMIResponse(line.program, line.transaction, result, true);
                                    console.log("[WHS-LINE-".concat(index + 1, "] \u2713 Line added successfully"));
                                }, function (error) {
                                    _this.logMIResponse(line.program, line.transaction, error, false);
                                    console.error("[WHS-LINE-".concat(index + 1, "] \u2717 Line add failed:"), error);
                                    throw error;
                                });
                            }))];
                    case 5:
                        _a.sent();
                        if (!(lines.length > 1)) return [3 /*break*/, 7];
                        console.log("[WHS-LINES] Waiting for ".concat(lines.length, " lines to settle..."));
                        return [4 /*yield*/, this.sleep(200)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        pr = new MIRequest();
                        pr.program = 'MHS850MI';
                        pr.transaction = 'PrcWhsTran'; // Process Warehouse Transaction
                        pr.maxReturnedRecords = 1;
                        pr.record = {
                            MSGN: this.MSGN, // Message Number from header creation
                            PRFL: '*EXE' // Process Flag (*EXE = Execute immediately)
                        };
                        console.log('[WHS-PROCESS] PrcWhsTran payload:', JSON.stringify(pr.record, null, 2));
                        console.log("[WHS-PROCESS] [".concat(new Date().toISOString(), "] \u2192 Starting PrcWhsTran"));
                        this.logMIRequest(pr.program, pr.transaction, pr.record);
                        return [4 /*yield*/, this.prcWhsTranWithRetry(pr, 3)];
                    case 8:
                        prc = _a.sent();
                        // Validate transaction processing was successful
                        if (!prc || !prc.item) {
                            errorMessage = this.extractErrorMessage(prc, 'Transaction processing');
                            console.error('[WHS-PROCESS-ERROR] PrcWhsTran failed:', errorMessage);
                            throw new Error(errorMessage);
                        }
                        // ───────────── Final Status Validation ─────────────
                        // Check actual processing status using GetWhsHead to ensure transaction completed successfully
                        return [4 /*yield*/, this.sleep(100)];
                    case 9:
                        // ───────────── Final Status Validation ─────────────
                        // Check actual processing status using GetWhsHead to ensure transaction completed successfully
                        _a.sent(); // Brief delay to ensure status is updated
                        statusCheck = new MIRequest();
                        statusCheck.program = 'MHS850MI';
                        statusCheck.transaction = 'GetWhsHead';
                        statusCheck.maxReturnedRecords = 1;
                        statusCheck.record = {
                            MSGN: this.MSGN
                        };
                        console.log('[WHS-STATUS] GetWhsHead status check:', JSON.stringify(statusCheck.record, null, 2));
                        this.logMIRequest(statusCheck.program, statusCheck.transaction, statusCheck.record);
                        return [4 /*yield*/, this.mi.executeRequest(statusCheck)];
                    case 10:
                        statusResult = _a.sent();
                        this.logMIResponse(statusCheck.program, statusCheck.transaction, statusResult, true);
                        if (!statusResult || !statusResult.item) {
                            throw new Error('Failed to retrieve transaction status for validation');
                        }
                        transactionStatus = statusResult.item.STAT;
                        console.log("[WHS-STATUS] \u2192 Transaction Status: ".concat(transactionStatus));
                        if (!(transactionStatus !== '90')) return [3 /*break*/, 13];
                        errorMessage = 'Transaction processing failed.\n\n';
                        troubleshootingInfo = '';
                        extracted = this.extractErrorMessage(statusResult, 'Transaction processing');
                        if (extracted && extracted.trim() && !extracted.startsWith('Transaction processing failed')) {
                            // Use the actual API-provided error message/details
                            troubleshootingInfo = extracted;
                        }
                        else {
                            // Fallback: Determine error level based on status code
                            if (['15', '20'].includes(transactionStatus)) {
                                // Header level errors
                                troubleshootingInfo = "Header level error detected. Check MHS850 for details.\nMessage no = ".concat(this.MSGN);
                            }
                            else if (['25', '30', '35', '40'].includes(transactionStatus)) {
                                // Package or line level errors
                                troubleshootingInfo = "Package/Line level error detected. Check MHS851 for details.\nMessage no = ".concat(this.MSGN, "\nPackage no = ").concat(packNumber_1);
                            }
                            else {
                                // Other error statuses
                                troubleshootingInfo = "Processing error (Status: ".concat(transactionStatus, "). Check MHS850/MHS851 for details.\nMessage no = ").concat(this.MSGN);
                            }
                        }
                        statusDescriptions = {
                            '10': 'Entered',
                            '15': 'Error on message header',
                            '20': 'Header validated, no errors',
                            '25': 'Error on message packages/IDs',
                            '30': 'Package/ID validated, no errors',
                            '35': 'Error on message lines/instructions',
                            '40': 'Line/instructions validated, no errors',
                            '45': 'Error from business component',
                            '90': 'Processed, no errors',
                            '92': 'Processed, test message, no update performed',
                            '99': 'Archived'
                        };
                        statusDesc = statusDescriptions[transactionStatus] || 'Unknown status';
                        lines_1 = [];
                        // If troubleshootingInfo already includes a detailed API error, surface it on a dedicated line
                        if (troubleshootingInfo && troubleshootingInfo.trim()) {
                            lines_1.push("Error: ".concat(troubleshootingInfo.replace(/^[\n\s]+|[\n\s]+$/g, '')));
                        }
                        lines_1.push("Status: ".concat(transactionStatus, " (").concat(statusDesc, ")"));
                        lines_1.push("Message no: ".concat(this.MSGN));
                        if (typeof packNumber_1 !== 'undefined') {
                            lines_1.push("Package no: ".concat(packNumber_1));
                        }
                        errorMessage += lines_1.join('\n');
                        console.error('[WHS-STATUS-ERROR] Transaction failed with status:', transactionStatus, statusDesc);
                        if (!(this.createdEquipment && this.createdEquipment.length > 0)) return [3 /*break*/, 12];
                        console.log('[ROLLBACK] Transaction failed, initiating equipment rollback');
                        this.logError('Transaction failed, initiating equipment rollback', { status: transactionStatus });
                        return [4 /*yield*/, this.rollbackEquipment()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: throw new Error(errorMessage);
                    case 13:
                        console.log('[WHS-PROCESS-SUCCESS] → PrcWhsTran succeeded with status 90.');
                        this.logInfo('Receipt processing completed successfully');
                        return [3 /*break*/, 15];
                    case 14:
                        e_2 = _a.sent();
                        console.error('[RECEIPT-PROCESS-ERROR] Receipt processing failed:', e_2);
                        this.logError('process: Receipt processing failed', e_2);
                        throw e_2;
                    case 15: return [2 /*return*/];
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
        var formattedMessage = message.replace(/\n/g, '<br>');
        var dialogContent = $("<div style=\"max-width: 500px; word-wrap: break-word;\"><label class=\"inforLabel noColon\">".concat(formattedMessage, "</label></div>"));
        var dialogButtons = [
            {
                text: "OK",
                isDefault: true,
                width: 80,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    }
                    else {
                        $(this).inforDialog("close");
                    }
                    if (shouldRefresh) {
                        this.refresh();
                    }
                }.bind(this)
            }
        ];
        var dialogOptions = {
            title: title,
            dialogType: "General",
            modal: true,
            width: Math.min(600, Math.max(350, message.length * 8)), // Dynamic width based on message length
            minHeight: 150,
            maxHeight: 400,
            icon: title.toLowerCase().includes('error') ? "error" : "info",
            closeOnEscape: true,
            close: function () {
                dialogContent.remove();
            },
            buttons: dialogButtons
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
        if (v)
            this.ctrl.ShowBusyIndicator();
        else
            this.ctrl.HideBusyIndicator();
    };
    class_1.prototype.refresh = function () {
        var _a;
        // Refresh H5 screen to show updated data
        if ((_a = this.ctrl) === null || _a === void 0 ? void 0 : _a.PressKey) {
            this.ctrl.PressKey("F5");
        }
        else {
            this.log.Info('Screen refresh requested but controller not available');
        }
    };
    class_1.prototype.num = function (value) {
        // Convert string to number, removing non-numeric characters
        return parseFloat((value || '0').toString().replace(/[^\d.-]/g, '')) || 0;
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
            var status_1 = e && e.statusCode;
            var code = ((e && e.errorCode) || '').toString().toUpperCase();
            var msg_1 = ((e && (e.errorMessage || e.message)) || '').toString().toLowerCase();
            // HTTP-style transient signals
            if (status_1 === 409 || status_1 === 503)
                return true;
            // Common lock/busy keywords
            var keywords = ['locked', 'record lock', 'busy', 'in use', 'try again', 'temporary', 'timeout', 'deadlock'];
            if (keywords.some(function (k) { return msg_1.includes(k); }))
                return true;
            // Known MI error codes that often indicate transient state
            if (["WPU0901", "M3LOCK"].includes(code))
                return true;
        }
        catch (_) { }
        return false;
    };
    // Execute PrcWhsTran with limited retries and exponential backoff
    class_1.prototype.prcWhsTranWithRetry = function (pr_1) {
        return __awaiter(this, arguments, void 0, function (pr, maxRetries) {
            var attempt, lastError, result, e_3, backoff;
            if (maxRetries === void 0) { maxRetries = 2; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempt = 1;
                        lastError = null;
                        _a.label = 1;
                    case 1:
                        if (!(attempt <= maxRetries)) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.mi.executeRequest(pr)];
                    case 3:
                        result = _a.sent();
                        console.log("[WHS-PROCESS] [".concat(new Date().toISOString(), "] \u2192 Finished PrcWhsTran (attempt ").concat(attempt, ")"));
                        this.logMIResponse(pr.program, pr.transaction, result, true);
                        return [2 /*return*/, result];
                    case 4:
                        e_3 = _a.sent();
                        this.logMIResponse(pr.program, pr.transaction, e_3, false);
                        lastError = e_3;
                        if (!this.isTransientProcessLock(e_3) || attempt === maxRetries) {
                            console.error("[WHS-PROCESS] PrcWhsTran failed (final). No retry.", e_3);
                            throw e_3;
                        }
                        backoff = 300 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
                        console.warn("[WHS-PROCESS] Transient lock/busy detected. Retrying in ".concat(backoff, " ms (attempt ").concat(attempt + 1, "/").concat(maxRetries, ")"));
                        return [4 /*yield*/, this.sleep(backoff)];
                    case 5:
                        _a.sent();
                        attempt++;
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: 
                    // Should not reach here, but throw last error defensively
                    throw lastError || new Error('Unknown error executing PrcWhsTran');
                }
            });
        });
    };
    return class_1;
}());
//# sourceMappingURL=POReceiptShortcut.js.map