/*─────────────────────────────────────────────────────────────────────────────
    POReceiptShortcutV3.js
    H5-compliant script for PO receipt processing with extended serial support
    Author: Rob Roy   Date: 02-Dec-2025
    Version: 7.3            Compatible with: H5 2.0+

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
  • "T for today" in Expiration date input
  • Auto-generate sequential serial numbers (PO-1, PO-2, etc.)
  • Scrollable serial input dialog (handles 1-25 serials)
  • Consistent error reporting and user feedback
  • Transaction rollback for equipment records on failure

  ARCHITECTURE
  • Follows official H5 SDK sample patterns (H5SampleCustomDialog.ts)
  • Uses H5ControlUtil.H5Dialog.CreateDialogElement for H5 >= 2.0
  • Falls back to inforMessageDialog for H5 < 2.0
  • Uses this.log for H5-compliant logging
  • Uses proper IMIResponse error handling patterns
  • Transient error detection with retry/backoff (up to 3 attempts)
  • Follows H5 SDK naming conventions and structure
─────────────────────────────────────────────────────────────────────────────*/

/*──────────────────────────────────────────────────────────────────────────*/
const POReceiptShortcutV3 = class {

    constructor(args) {
        // Initialize base properties following H5 SDK patterns
        this.typeName = 'POReceiptShortcutV3';
        // Use appropriate MIService version based on H5 compatibility
        this.mi = ScriptUtil.version >= 2 ? MIService : MIService.Current;
        this.ctrl = args.controller;    // H5 controller for UI interactions
        this.log = args.log;           // H5 logging service

        // Capture user context for downstream MI calls (company/division are needed for CMS474MI)
        try {
            const userContext = typeof ScriptUtil.GetUserContext === 'function'
                ? ScriptUtil.GetUserContext()
                : {};
            this.userContext = userContext || {};
            this.company = this.userContext.CurrentCompany || this.userContext.CONO || '';
            this.division = this.userContext.CurrentDivision || this.userContext.DIVI || '';
        } catch (e) {
            // User context capture failed; continue with empty values
            this.lrg.Warning('User context capture failed');
            this.userContext = {};
            this.company = '';
            this.division = '';
        }

        // Serial handling configuration
        this.maxSerialInputLength = 60;             // Allow up to 60 characters from the operator
        this.derivedSerialLength = 19;              // MMS240 upper limit: BSN(3) + MM(2) + DD(2) + YY(2) + hh(2) + mm(2) + ss(2) + hash(4) = 19 chars
        this.derivedSerialPrefix = 'BSN';          // Epoch serial prefix (BSN = batch serial number)
        this.hashSuffixLength = 4;                  // Hash suffix to guarantee uniqueness across runs
        this.epochSeed = null;                     // Lazily generated once per batch for deterministic hashing

        // CMS474 custom field configuration (full serial storage)
        this.customFieldConfig = {
            enabled: true,
            group: 'EQUIPMENT',        // Custom field group
            field: 'FULLSERNUM',       // Custom field identifier
            sequenceNum: '1',          // Sequence number
            valueField: 'CFMA'         // CFMA holds the original serial
        };

        // Log initialization following SDK patterns
        this.log.Info('POReceiptShortcutV3 initialized successfully');
    }

    static Init(args) {
        // Entry point: Initialize script (supports fallbacks for < 2.0)
        try {
            const self = new POReceiptShortcutV3(args);
            self.busy(true);    // Show loading indicator during processing
            // Execute main workflow with cleanup regardless of success/failure
            self.run().finally(() => self.busy(false));
        } catch (error) {
            if (args?.log) {
                args.log.Error(`POReceiptShortcutV3 initialization failed: ${error.message || error}`);
            }
            // Re-throw so H5 system knows there was an error
            throw error;
        }
    }

    get isNonMaterial() { return this.INDI === '0' && this.TPCD === '13'; }

    _getTroubleshootingInfo(transactionStatus, statusResult, packNumber) {
        const extracted = this.extractErrorMessage(statusResult, 'Transaction processing');
        if (extracted?.trim() && !extracted.startsWith('Transaction processing failed')) {
            return extracted;
        }
        if (['15', '20'].includes(transactionStatus)) {
            return `Header level error detected. Check MHS850 for details.\nMessage no = ${this.MSGN}`;
        }
        if (['25', '30', '35', '40'].includes(transactionStatus)) {
            return `Package/Line level error detected. Check MHS851 for details.\nMessage no = ${this.MSGN}\nPackage no = ${packNumber}`;
        }
        return `Processing error (Status: ${transactionStatus}). Check MHS850/MHS851 for details.\nMessage no = ${this.MSGN}`;
    }

    _resolveDialog(dialogContent, resolve) {
        if (ScriptUtil.version >= 2) {
            $('.ui-dialog-content:visible').dialog('close');
        } else {
            $(dialogContent).inforDialog("close");
        }
        resolve();
    }

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
    async storeFullSerialCustomField(equipmentContext) {
        if (!this.customFieldConfig?.enabled) {
            return;
        }

        const { originalSerial, SERN } = equipmentContext;

        const addRequest = new MIRequest();
        addRequest.program = 'CMS474MI';
        addRequest.transaction = 'AddEqInfo';
        addRequest.maxReturnedRecords = 1;
        addRequest.record = this.buildCms474Record({
            derivedSerial: SERN,
            originalSerial
        });

        await this.mi.executeRequest(addRequest);
    }

    buildCms474Record({ derivedSerial, originalSerial }) {
        // CMS474MI/AddEqInfo API inputs
        const record = {
            ITNO: this.ITNO,
            SERN: derivedSerial,
            CFMG: this.customFieldConfig.group,
            CFMF: this.customFieldConfig.field,
            SQNR: this.customFieldConfig.sequenceNum,
            [this.customFieldConfig.valueField]: originalSerial
        };

        // Add optional company/division context if available
        if (this.company) record.CONO = this.company;
        if (this.division) record.DIVI = this.division;

        return record;
    }

    //Deletes custom field record. This is not needed since equipment deletion API also deletes custom record
    async deleteEquipmentCustomField(equipmentContext) {
        if (!this.customFieldConfig?.enabled) {
            return;
        }

        // Need SERN to delete the custom field record
        const sern = equipmentContext.SERN;
        if (!sern) {
            return;
        }

        const deleteRequest = new MIRequest();
        deleteRequest.program = 'CMS474MI';
        deleteRequest.transaction = 'DelEqInfo';
        deleteRequest.maxReturnedRecords = 1;
        deleteRequest.record = {
            ITNO: this.ITNO,
            SERN: sern,
            CFMG: this.customFieldConfig.group,
            CFMF: this.customFieldConfig.field,
            SQNR: this.customFieldConfig.sequenceNum
        };

        if (this.company) deleteRequest.record.CONO = this.company;
        if (this.division) deleteRequest.record.DIVI = this.division;

        try {
            await this.mi.executeRequest(deleteRequest);
        } catch (error) {
            // Ignore not-found errors during cleanup, as the record might not have been created
            if (!this.isRecordMissingError(error)) {
                // For any other error during rollback, log it but do not re-throw,
                // to allow the rest of the rollback to proceed.
                this.log.Error(`deleteEquipmentCustomField failed for SERN ${sern} during rollback`);
            }
        }
    }

    isRecordMissingError(error) {
        if (!error) return false;
        const message = (error.errorMessage || error.message || '').toLowerCase();
        return error.statusCode === 400 || message.includes('no record') || message.includes('not found');
    }

    /**
     * Prepares serial entries for processing.
     * 
     * SERIAL STRATEGY (New in V7.2):
     * - If input length <= 20: Use original serial as-is (pass-through to SERN and CFMA)
     * - If input length > 20: Generate BSN[MM][DD][YY][hh][mm][ss][hash] serial for SERN; store original in CFMA
     * 
     * This ensures M3 MMS240 compatibility while preserving full user-entered serial in custom field audit trail.
     */
    prepareSerialEntries(userSerials) {
        if (!Array.isArray(userSerials) || userSerials.length === 0) {
            throw new Error('No serials to prepare');
        }

        // Generate epoch seed once per batch to ensure consistent (but unique per run) hashing
        if (!this.epochSeed) {
            this.epochSeed = this.generateEpochSeed();
        }

        const entries = userSerials.map((rawSerial, index) => {
            const trimmed = (rawSerial || '').trim();
            const serialLimit = 20; // MMS240 limit for SERN
            const needsDerive = trimmed.length > serialLimit;
            // RULE: If input <=20 chars, pass through as-is; if >20 chars, derive BSN epoch serial
            const derivedSerial = needsDerive ? this.deriveBoundedSerial(trimmed, index) : trimmed;

            return {
                originalSerial: trimmed,
                derivedSerial,
                index
            };
        });

        // Verify uniqueness of derived serials
        const uniqueDerived = new Set(entries.map(e => e.derivedSerial));
        if (uniqueDerived.size !== entries.length) {
            throw new Error('Hash collision: derived serials are not unique. Try again or contact support.');
        }

        return entries;
    }

    generateEpochSeed() {
        // Generate a seed for hashing using current epoch time
        // This ensures unique hash suffixes across different receipt runs
        const now = Date.now();
        const seedValue = (now % 1000000).toString().padStart(6, '0');
        return seedValue;
    }

    deriveBoundedSerial(originalSerial, index) {
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

        const now = new Date();
        const prefix = this.derivedSerialPrefix;  // 'BSN'
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const hashSuffix = this.computeHashSuffix(originalSerial, index);

        const derived = `${prefix}${month}${day}${year}${hour}${minute}${second}${hashSuffix}`;

        // Sanity check: must fit within MMS240 limit
        if (derived.length > this.derivedSerialLength) {
            throw new Error(
                `Derived serial exceeds ${this.derivedSerialLength} chars: ${derived} (len=${derived.length})`
            );
        }

        return derived;
    }

    computeHashSuffix(originalSerial, index) {
        // Deterministic hash: combine epoch seed, serial content, and index
        // Produces a 4-digit numeric suffix for uniqueness across the batch
        // Ensures no collisions even if two operators enter similar serials in the same minute
        const combined = `${this.epochSeed}|${originalSerial}|${index}`;
        const hash = this.simpleHash(combined);
        const hashValue = hash % 10000;
        return hashValue.toString().padStart(4, '0');
    }

    simpleHash(str) {
        // Deterministic hash function (djb2 variant)
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.codePointAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Extract user-friendly error message from MI response
    extractErrorMessage(error, operation = 'operation') {
        let errorMsg = `${operation} failed`;
        let technicalDetails = '';

        if (error) {
            // Primary error message (user-friendly)
            if (error.errorMessage) {
                errorMsg = error.errorMessage;
            } else if (error.message) {
                errorMsg = error.message;
            }

            // Technical details for troubleshooting
            const errorCode = error.errorCode || '';
            const errorMessage = error.errorMessage || '';
            const errorField = error.errorField || '';
            const program = error.program || '';
            const transaction = error.transaction || '';

            if (errorCode || errorMessage || errorField || program) {
                technicalDetails = '\n\nTechnical Details:';
                if (program && transaction) technicalDetails += `\n• API: ${program}/${transaction}`;
                if (errorCode && errorMessage) {
                    technicalDetails += `\n• Error: ${errorCode}: ${errorMessage}`;
                } else if (errorMessage) {
                    technicalDetails += `\n• Error: ${errorMessage}`;
                } else if (errorCode) {
                    technicalDetails += `\n• Error Code: ${errorCode}`;
                }
                if (errorField) technicalDetails += `\n• Field: ${errorField}`;
            }
        }

        return errorMsg + technicalDetails;
    }

    /*───────────────── PROGRESS UI (Enterprise Pattern) ─────────────────*/
    initProgress(steps) {
        this.steps = steps;           // array of labels
        this.idx = 0;

        // Create progress dialog content
        const progressHtml = `
            <div style="padding: 20px;">
                <div id="progressWrap" style="width: 100%; height: 18px; background: #ddd; border-radius: 4px; overflow: hidden;">
                    <div id="progressFill" style="height: 100%; width: 0; background: #0072C6; transition: width .25s;"></div>
                </div>
                <div id="progressMsg" style="text-align: center; margin-top: 8px; font-size: 13px;">Starting…</div>
            </div>
        `;
        
        this.progressContent = $(progressHtml);
        
        const dialogOptions = {
            title: "Processing PO Line...",
            dialogType: "General",
            modal: true,  // Disallow background interaction
            width: 400,
            minHeight: 150,
            icon: "info",
            closeOnEscape: false,  // Prevent manual closing during processing
            close: function () {
                // Don't allow manual closing during processing
            },
            buttons: []  // No buttons during processing
        };

        // Show progress dialog with proper version handling
        if (ScriptUtil.version >= 2) {
            this.progressDialog = H5ControlUtil.H5Dialog.CreateDialogElement(this.progressContent[0], dialogOptions);
        } else {
            this.progressDialog = this.progressContent.inforMessageDialog(dialogOptions);
        }
        
        this.updateProgress('Starting…');
    }
    
    addProgressStep(label) { this.steps.push(label); }
    
    updateProgress(msg) {
        const pct = Math.round((this.idx / this.steps.length) * 100);
        $('#progressFill').css('width', pct + '%');
        if (msg) $('#progressMsg').text(msg);
    }
    
    async advance(label) {
        this.updateProgress(label + ' ✓');
        this.idx++;
        await this.sleep(60);            // tiny delay so UI repaints
    }
    
    progressDone() {
        $('#progressFill').css('width', '100%');
        $('#progressMsg').text('Done!');
        setTimeout(() => this.closeProgress(), 300);
    }
    
    closeProgress() { 
        // Close the underlying H5 dialog and clean up the DOM. Without this
        // explicit close call the modal/backdrop created by H5Dialog will
        // remain on screen, which is why the "Processing PO Line…" dialog
        // appears when the user cancels out of a serial/lot entry dialog.
        try {
            if (this.progressDialog) {
                // H5 2.0+ dialogs expose a close() function on the model
                if (ScriptUtil.version >= 2 && typeof this.progressDialog.close === 'function') {
                    this.progressDialog.close(true);
                } else {
                    // For pre‑2.0 dialogs use the inforDialog API on the element
                    try {
                        $(this.progressDialog).inforDialog('close');
                    } catch (e) {
                        // Fallback: attempt to close using the content element
                        if (this.progressContent?.inforDialog) {
                            this.progressContent.inforDialog('close');
                        }
                    }
                }
                this.progressDialog = null;
            }
        } catch (err) {
            // Log any errors but continue cleaning up content
            this.log.Warning(`closeProgress: error closing progress dialog: ${err.message}`);
        }

        // Remove the content element from the DOM
        if (this.progressContent) {
            this.progressContent.remove();
            this.progressContent = null;
        }
    }

    sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    /*───────────────── MAIN FLOW ─────────────────*/
    async run() {
        try {
            // Initialize progress tracking with predefined steps
            this.initProgress(['Validate', 'Get PO line', 'Lookups', 'Warnings', 'Process']);

            // Step 1: Validate required input fields
            await this.validateFields();
            await this.advance('Validate');

            // Step 2: Retrieve PO line details from M3
            await this.getPOLine();
            await this.advance('Get PO line');

            // Step 3: Gather supporting data (header, warehouse, item, etc.)
            await this.lookups();
            await this.advance('Lookups');

            // Step 4: Check for business warnings (WMS, over-receipt)
            await this.warnings();
            await this.advance('Warnings');

            /* ─── Branch by control method ─── */
            // Process based on item lot control method (INDI field)
            if (this.INDI === '2') {        // Serial controlled items
                const userSerials = await this.promptSerials();  // User interaction - NO busy

                // Prepare derived serial/BANO values that comply with MMS240 limits
                const serialEntries = this.prepareSerialEntries(userSerials);

                // Add additional progress steps for serial processing
                this.addProgressStep('Adding equipment records');
                this.addProgressStep('Queueing transactions');
                this.addProgressStep('Finalizing message');

                await this.checkSer(serialEntries);  // Validate derived serials don't already exist
                await this.addEquip(serialEntries);  // Create equipment records in M3
                await this.advance('Adding equipment records');

                try {
                    await this.sleep(50);
                    // Create single pack with multiple lines (one per serial)
                    const serialLines = serialEntries.map(entry => ({ BANO: entry.derivedSerial, RVQA: '1', EXPI: null }));
                    await this.process(serialLines);
                    await this.advance('Queueing transactions');

                    // Clear equipment tracking since process succeeded
                    this.createdEquipment = [];
                } catch (processError) {
                    // Receipt processing failed - rollback equipment records to maintain data consistency
                    this.log.Error('Receipt processing failed after equipment creation, initiating rollback');
                    await this.rollbackEquipment();
                    throw processError;
                }

                await this.advance('Finalizing message');
            } else if (this.INDI === '3') { // Lot controlled items
                const { lot, expi } = await this.promptLot();  // User interaction - NO busy
                await this.checkLot(lot);  // Validate lot doesn't already exist
                await this.process([{ BANO: lot, RVQA: this.RVQA, EXPI: expi }]);
            } else {
                await this.promptConfirm(); // Simple confirmation dialog - NO busy
                await this.process([{ BANO: null, RVQA: this.RVQA, EXPI: null }]);
            }

            await this.advance('Process');
            this.progressDone();
            
            // Show success dialog with enterprise pattern
            this.showSuccessDialog();
        } catch (e) {
            this.closeProgress();
            // Enhanced error dialog with MI error details
            this.showErrorDialog(e.message || 'An unexpected error occurred during processing', e);
        }
    }

    /*───────────────── SUCCESS/ERROR DIALOGS (Original Pattern) ─────────────────*/
    showSuccessDialog() {
        this.alert('Success', 'PO line received!', true);  // Refresh screen on success
    }

    showErrorDialog(message, error = null) {
        // Enhanced error dialog with MI error details
        let displayMessage = message || 'An unexpected error occurred during processing';
        
        // If we have an error object, extract detailed information
        if (error) {
            const detailedMessage = this.extractErrorMessage(error, 'Processing');
            displayMessage = detailedMessage;
        }
        
        this.alert('Error', displayMessage);
    }

    /*───────────────── FIELD VALIDATION ─────────────────*/
    async validateFields() {
        // Extract key PO receipt fields from H5 screen
        this.PUNO = ScriptUtil.GetFieldValue('WWPUNO');  // Purchase Order Number
        this.SUNO = ScriptUtil.GetFieldValue('WWSUNO');  // Supplier Number
        this.WHLO = ScriptUtil.GetFieldValue('WWWHLO');  // Warehouse
        this.PNLI = ScriptUtil.GetFieldValue('PNLI');    // PO Line Number
        this.PNLS = ScriptUtil.GetFieldValue('PNLS');    // PO Line Suffix
        this.RVQA = this.ctrl.GetValue('RVQA');          // Received Quantity
        this.WHSL = ScriptUtil.GetFieldValue('WHSL');    // Location
        this.ITNO = ScriptUtil.GetFieldValue('ITNO');    // Item Number
        this.OEND = ScriptUtil.GetFieldValue('OEND');    // Flag Completed

        // Validate mandatory fields are populated
        // Note: WHSL validation is deferred to lookups() after item type determination
        const missingFields = [
            !this.PUNO && 'PUNO', !this.PNLI && 'PNLI',
            !this.PNLS && 'PNLS', !this.RVQA && 'RVQA',
            !this.ITNO && 'ITNO', !this.WHLO && 'WHLO',
            !this.SUNO && 'SUNO', !this.OEND && 'OEND'
        ].filter(Boolean);
        
        if (missingFields.length > 0) {
            const error = `Missing required fields: ${missingFields.join(', ')}`;
            this.log.Error(error);
            throw new Error(error);
        }
    }

    /*───────────────── MI LOOK‑UPS (Enterprise Error Handling) ─────────────────*/
    async getPOLine() {
        const request = new MIRequest();
        request.program = 'PPS200MI';
        request.transaction = 'GetLine';
        request.record = {
            PUNO: this.PUNO,
            PNLI: this.PNLI,
            PNLS: this.PNLS
        };
        request.maxReturnedRecords = 1;
        request.outputFields = ['PUPR', 'RORC', 'RORN', 'RORL', 'ITDS', 'GETY', 'PUUN'];

        try {
            const response = await this.mi.executeRequest(request);

            if (!response?.item) {
                const errorMessage = this.extractErrorMessage(response, 'PO line retrieval');
                throw new Error(errorMessage);
            }

            const poLineData = {
              PUPR: response.item.PUPR,
              RORC: response.item.RORC,
              RORN: response.item.RORN,
              RORL: response.item.RORL,
              ITDS: response.item.ITDS,
              GETY: response.item.GETY,
              PUUN: response.item.PUUN
            };

            Object.assign(this, poLineData);
        } catch (error) {
            this.log.Error(`Failed to retrieve PO line data: ${error.message || error}`);
            throw error;
        }
    }

    async lookups() {
        try {
            /* header - Get PO header information */
            const headerRequest = new MIRequest();
            headerRequest.program = 'PPS200MI';
            headerRequest.transaction = 'GetHead';
            headerRequest.record = { PUNO: this.PUNO };
            headerRequest.maxReturnedRecords = 1;
            headerRequest.outputFields = ['PUDT', 'CUCD', 'FACI'];

            const header = await this.mi.executeRequest(headerRequest);

            if (!header?.item) {
                const errorMessage = this.extractErrorMessage(header, 'PO header retrieval');
                throw new Error(errorMessage);
            }
            // Store key header fields for downstream processing
            Object.assign(this, {
                PUDT: header.item.PUDT,  // Order Date
                CUCD: header.item.CUCD,  // Currency Code
                FACI: header.item.FACI   // Facility
            });

            /* whs - Check if warehouse is WMS-managed */
            const whsRequest = new MIRequest();
            whsRequest.program = 'MMS009MI';
            whsRequest.transaction = 'Get';
            whsRequest.record = { WHGR: 'WMSWHSE', WHLO: this.WHLO };
            whsRequest.maxReturnedRecords = 1;
            whsRequest.outputFields = ['WHLO'];

            const whs = await this.mi.executeRequest(whsRequest);

            // If record exists, warehouse is WMS-managed
            this.isWmsWhs = !!whs?.item;

            /* item - Get lot control method and expiration method */
            const itemRequest = new MIRequest();
            itemRequest.program = 'MMS200MI';
            itemRequest.transaction = 'GetItmBasic';
            itemRequest.record = { ITNO: this.ITNO, ALFM: '1' };
            itemRequest.maxReturnedRecords = 1;
            itemRequest.outputFields = ['EXPD', 'INDI', 'TPCD'];

            const itm = await this.mi.executeRequest(itemRequest);

            if (!itm?.item) {
                const errorMessage = this.extractErrorMessage(itm, 'Item details retrieval');
                throw new Error(errorMessage);
            }
            // Store control method and expiration flags
            Object.assign(this, {
                EXPD: itm.item.EXPD,  // Expiration Date Required (0/1)
                INDI: itm.item.INDI,  // Lot Control Method (0=None, 1=Manual, 2=Serial, 3=Lot)
                TPCD: itm.item.TPCD   // Item Category (13=Non-material)
            });

            // Additional validation: Check if WHSL is required based on item type
            // Non-material items (INDI=0 and TPCD=13) don't require warehouse location
            if (!this.isNonMaterial && !this.WHSL) {
                throw new Error('Warehouse location (WHSL) is required for material items');
            }

            this.log.Info(`Item validation completed - INDI: ${this.INDI}, TPCD: ${this.TPCD}, isNonMaterial: ${this.isNonMaterial}`);

            /* remaining qty - Get outstanding quantity on PO line */
            const remRequest = new MIRequest();
            remRequest.program = 'PPS001MI';
            remRequest.transaction = 'GetBasicData2';
            remRequest.record = { PUNO: this.PUNO, PNLI: this.PNLI, PNLS: this.PNLS };
            remRequest.maxReturnedRecords = 1;
            remRequest.outputFields = ['RSTQ'];

            const rem = await this.mi.executeRequest(remRequest);

            if (!rem?.item) {
                const errorMessage = this.extractErrorMessage(rem, 'Remaining quantity retrieval');
                throw new Error(errorMessage);
            }
            this.RMQA = rem.item.RSTQ;  // Remaining Quantity

            /* Order initiated COs (optional) - Only for COs */
            if (this.RORC === '3' && this.RORN) {  // RORC=3 indicates link to customer order
                const customerRequest = new MIRequest();
                customerRequest.program = 'OIS100MI';
                customerRequest.transaction = 'GetOrderHead';
                customerRequest.record = { ORNO: this.RORN };  // Related Order Number
                customerRequest.maxReturnedRecords = 1;
                customerRequest.outputFields = ['CUNO'];

                const c = await this.mi.executeRequest(customerRequest);

                if (!c?.item) {
                    const errorMessage = this.extractErrorMessage(c, 'Customer order details retrieval');
                    throw new Error(errorMessage);
                }
                this.CUNO = c.item.CUNO;  // Customer Number for equipment records
            }
        } catch (error) {
            this.log.Error(`Data lookup failed: ${error.message || error}`);
            throw error;
        }
    }

    async warnings() {
        // Business Rule: Warn if WMS-managed warehouse but not using WMS receipt (GETY≠24)
        if (this.isWmsWhs && this.GETY !== '24') {
            await this.dialogWarn(
                'WMS Warehouse Detected; Receiving in M3 instead of WMS may result in balance discrepancy.'
            );
        }

        // Business Rule: Warn if attempting to receive more than remaining quantity
        if (this.num(this.RVQA) > this.num(this.RMQA)) {
            const diff = this.num(this.RVQA) - this.num(this.RMQA);
            await this.dialogWarn(`Over‑receipt of ${diff}.`);
        }
    }

    /*───────────────── USER‑INTERACTION DIALOGS (Enterprise H5 Pattern) ─────────────────*/
    dialogWarn(msg) {
        return new Promise((resolve, reject) => {
            let closedByButton = false;
            this.log.Info(`Displaying warning dialog: ${msg}`);
            
            // Create dialog content following H5SampleCustomDialog pattern
            const dialogContent = $(`<div><label class='inforLabel noColon'>${msg}</label></div>`);
            
            // Helper to close dialog and resolve promise
            const handleProceed = () => {
                closedByButton = true;
                this._resolveDialog(dialogContent, resolve);
            };
            
            // Add Enter key handling for warning dialog
            dialogContent.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Trigger Proceed button (default action)
                    const proceedButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function() {
                        return $(this).text().trim() === 'Proceed';
                    });
                    if (proceedButton.length > 0) {
                        proceedButton.click();
                    } else {
                        // Fallback: manually trigger the proceed logic
                        handleProceed();
                    }
                }
            });
            
            const dialogButtons = [
                {
                    text: "Proceed",
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        resolve();
                    }
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Operation cancelled by user'));
                    }
                }
            ];
            
            const dialogOptions = {
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
            if (ScriptUtil.version >= 2) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            } else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    }

    promptConfirm() {
        return new Promise((resolve, reject) => {
            let closedByButton = false;
            
            // Create dialog content following H5SampleCustomDialog pattern
            const dialogContent = $(`<div><label class='inforLabel noColon'>Receive ${this.RVQA} unit(s)?</label></div>`);
            
            // Helper to close dialog and resolve promise
            const handleConfirm = () => {
                closedByButton = true;
                this._resolveDialog(dialogContent, resolve);
            };
            
            // Add Enter key handling for confirm dialog
            dialogContent.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Trigger Confirm button
                    const confirmButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function() {
                        return $(this).text().trim() === 'Confirm';
                    });
                    if (confirmButton.length > 0) {
                        confirmButton.click();
                    } else {
                        // Fallback: manually trigger the confirm logic
                        handleConfirm();
                    }
                }
            });
            
            const dialogButtons = [
                {
                    text: "Confirm",
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        resolve();
                    }
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Receipt cancelled by user'));
                    }
                }
            ];
            
            const dialogOptions = {
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
            if (ScriptUtil.version >= 2) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            } else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    }

    promptSerials() {
        return new Promise((resolve, reject) => {
            let closedByButton = false;
            const qty = this.num(this.RVQA);

            // Safety check: Prevent excessive quantity that could crash browser
            const MAX_SERIALS = 25;  // Reasonable limit for manual entry
            if (qty > MAX_SERIALS) {
                this.log.Error(`Serial quantity ${qty} exceeds maximum allowed ${MAX_SERIALS}`);
                reject(new Error(`Cannot process ${qty} serials. Maximum allowed is ${MAX_SERIALS}. Please use batch import for large quantities.`));
                return;
            }
            
            // Create scrollable form content with input fields for each serial
            // Using a scrollable container to handle large quantities without bleeding off-screen
            let formHtml = '<div style="padding: 15px;">';
            
            // Add PO number display with copy functionality (fixed at top, outside scroll area)
            formHtml += `<div style="margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;">
                <label class="inforLabel" style="font-weight: bold; font-size: 11px;">PO:</label>
                <div style="display: flex; align-items: center; margin-top: 2px;">
                    <input id="poNumberDisplay" type="text" readonly value="${this.PUNO}" 
                           style="flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;">
                    <button type="button" id="copyPoNumber" style="margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;" title="Copy PO number">📋</button>
                    <button type="button" id="generateSerials" style="margin-left: 6px; padding: 3px 6px; background: #2C8C3E; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;" title="Generate serials">🔢</button>
                </div>
                <div style="margin-top: 4px; font-size: 11px; color: #666;">
                    <strong>Quantity:</strong> ${qty} serial${qty !== 1 ? 's' : ''} required
                </div>
            </div>`;
            
            // Scrollable container for serial inputs - prevents off-screen bleeding
            // Max height ensures dialog fits on screen while allowing smooth scrolling
            const maxSerialLength = this.maxSerialInputLength || 20;
            formHtml += '<div id="serialInputsContainer" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; padding-right: 5px;"><form>';
            
            for (let i = 0; i < qty; i++) {
                formHtml += `<div style="margin-bottom: 10px;">
                    <label class="inforLabel" for="serial${i}">Serial ${i + 1}:</label>
                    <input id="serial${i}" type="text" class="inforTextBox" maxlength="${maxSerialLength}" 
                           placeholder="Enter serial number (max ${maxSerialLength} chars)" style="width: 100%; text-transform: uppercase;" 
                           ${i === 0 ? 'autofocus' : ''}>
                </div>`;
            }
            formHtml += '</form></div></div>';
            
            const dialogContent = $(formHtml);
            
            // Method to show validation errors within the dialog context
            // Error message appears above the scrollable area for visibility
            dialogContent.showValidationError = function(message) {
                // Remove any existing error messages
                dialogContent.find('.validation-error').remove();
                
                // Create error message element
                const errorDiv = $(`
                    <div class="validation-error" style="
                        background: #ffebee; 
                        border: 1px solid #f44336; 
                        color: #c62828; 
                        padding: 8px 12px; 
                        margin: 10px 0; 
                        border-radius: 4px; 
                        font-size: 12px;
                        white-space: pre-line;
                    ">
                        <strong>⚠️ Validation Error:</strong><br>${message}
                    </div>
                `);
                
                // Insert error message before the scrollable container (stays visible while scrolling)
                dialogContent.find('#serialInputsContainer').before(errorDiv);
                
                // Auto-remove after 5 seconds
                setTimeout(() => errorDiv.fadeOut(() => errorDiv.remove()), 5000);
            };
            
            // Bind the validation error method to the correct context
            const showValidationError = dialogContent.showValidationError;
            
            // Add copy functionality for PO number
            dialogContent.find('#copyPoNumber').on('click', function() {
                const poNumber = dialogContent.find('#poNumberDisplay').val();
                const btn = $(this);
                const originalText = btn.text();
                navigator.clipboard.writeText(poNumber).then(() => {
                    btn.text('✓ Copied!').css('background', '#28a745');
                    setTimeout(() => btn.text(originalText).css('background', '#0072C6'), 1500);
                }).catch(() => {});
            });

            // Add auto-generate functionality for sequential serials
            dialogContent.find('#generateSerials').on('click', function() {
                const poNumber = dialogContent.find('#poNumberDisplay').val();

                // Clear any existing error messages
                dialogContent.find('.validation-error').remove();

                // Populate each input field with PO-N format
                for (let i = 0; i < qty; i++) {
                    const serialValue = `${poNumber}-${i + 1}`;
                    const inputField = dialogContent.find(`#serial${i}`);
                    inputField.val(serialValue);
                    // Clear any error styling
                    inputField.css('border-color', '');
                    inputField.css('background-color', '');
                }
                
                // Show success feedback
                const successMsg = $('<div class="validation-success" style="padding: 6px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 3px; margin-bottom: 10px; font-size: 12px;">✓ Generated ' + qty + ' sequential serial' + (qty !== 1 ? 's' : '') + ': ' + poNumber + '-1 through ' + poNumber + '-' + qty + '</div>');
                dialogContent.find('#serialInputsContainer').before(successMsg);
                
                // Auto-remove success message after 3 seconds
                setTimeout(() => successMsg.fadeOut(300, function() { $(this).remove(); }), 3000);
                
                // Visual feedback on button
                const btn = $(this);
                const originalText = btn.text();
                btn.text('✓ Done!').css('background', '#28a745');
                setTimeout(() => {
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
            const validateAndCollectSerials = () => {
                const serials = [];
                let invalid = [];

                // Validate all serial inputs - check format and presence first
                for (let i = 0; i < qty; i++) {
                    const $field = dialogContent.find(`#serial${i}`);
                    const val = $field.val().trim();

                    if (!val) {
                        $field.css('border', '2px solid red');
                        invalid.push(`Serial ${i + 1} (blank)`);
                    } else if (val.length > maxSerialLength) {
                        $field.css('border', '2px solid red');
                        invalid.push(`Serial ${i + 1} (too long)`);
                    } else if (!/^[A-Z0-9-]+$/.test(val)) {
                        $field.css('border', '2px solid red');
                        invalid.push(`Serial ${i + 1} (invalid characters)`);
                    } else {
                        serials.push(val);
                    }
                }

                // Show validation errors if any invalid entries found
                if (invalid.length) {
                    showValidationError(`Invalid or blank input in: ${invalid.join(', ')}\nSerials must be alphanumeric (A-Z, 0-9, hyphen allowed), max ${maxSerialLength} characters.`);
                    return null;
                }

                // Check for duplicates only after all serials are validated
                if (new Set(serials).size !== qty) {
                    const seen = new Set();
                    const duplicates = [];
                    serials.forEach((serial, idx) => {
                        if (seen.has(serial)) {
                            dialogContent.find(`#serial${idx}`).css('border', '2px solid orange');
                            if (!duplicates.includes(serial)) duplicates.push(serial);
                        } else {
                            seen.add(serial);
                        }
                    });
                    showValidationError(`Duplicates detected: ${duplicates.join(', ')}\nEnsure each serial is unique.`);
                    return null;
                }

                return serials;
            };

            // Helper to close dialog and resolve with validated serials
            const handleSaveSerials = (model) => {
                const serials = validateAndCollectSerials();
                if (serials === null) return; // Validation failed
                
                closedByButton = true;
                if (model) {
                    // Called from button handler - use model.close()
                    if (ScriptUtil.version >= 2) {
                        model.close(true);
                    } else {
                        $(dialogContent).inforDialog("close");
                    }
                } else if (ScriptUtil.version >= 2) {
                    // Called from keydown fallback - use DOM method
                    $('.ui-dialog-content:visible').dialog('close');
                } else {
                    $(dialogContent).inforDialog("close");
                }
                resolve(serials);
            };

            // Add Enter key handling for serial inputs
            dialogContent.find('input[id^="serial"]').on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const currentIndex = Number.parseInt(this.id.replace('serial', ''));
                    
                    if (qty > 1 && currentIndex < qty - 1) {
                        // Multiple serials: move to next input and scroll it into view
                        const nextInput = dialogContent.find(`#serial${currentIndex + 1}`);
                        nextInput.focus();
                        // Ensure the next input is visible in the scrollable container
                        const container = dialogContent.find('#serialInputsContainer');
                        const nextInputOffset = nextInput.position().top;
                        if (nextInputOffset > container.height() - 60) {
                            container.scrollTop(container.scrollTop() + 60);
                        }
                    } else {
                        // Last serial or single serial: trigger Save button
                        const saveButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function() {
                            return $(this).text().trim() === 'Save';
                        });
                        if (saveButton.length > 0) {
                            saveButton.click();
                        } else {
                            // Fallback: use shared validation and save logic
                            handleSaveSerials();
                        }
                    }
                }
            });
            
            const dialogButtons = [
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
                        if (ScriptUtil.version >= 2) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Serial input cancelled by user'));
                    }
                }
            ];
            
            const dialogOptions = {
                title: "📋 Enter Serial Numbers",
                dialogType: "General",
                modal: true,
                width: 500,  // Increased width for better readability with scrollbar
                height: Math.min(600, 250 + (Math.min(qty, 10) * 40)),  // Dynamic height, capped at 600px
                maxHeight: 600,  // Enforce maximum height to prevent off-screen dialogs
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
            if (ScriptUtil.version >= 2) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            } else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    }

    promptLot() {
        return new Promise((resolve, reject) => {
            let closedByButton = false;
            
            // Create form content for lot number and optional expiration date
            let formHtml = '<div style="padding: 15px;"><form>';
            
            // Add PO number display with copy functionality (smaller version)
            formHtml += `<div style="margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;">
                <label class="inforLabel" style="font-weight: bold; font-size: 11px;">PO:</label>
                <div style="display: flex; align-items: center; margin-top: 2px;">
                    <input id="poNumberDisplay" type="text" readonly value="${this.PUNO}" 
                           style="flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;">
                    <button type="button" id="copyPoNumber" style="margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;">📋</button>
                </div>
            </div>`;
            
            formHtml += `<div style="margin-bottom: 15px;">
                <label class="inforLabel" for="lotNumber">Lot Number:</label>
                <input id="lotNumber" type="text" class="inforTextBox" maxlength="20" 
                       placeholder="Enter lot number" style="width: 100%; text-transform: uppercase;" autofocus>
            </div>`;
            
            if (this.EXPD === '1') {
                formHtml += `<div style="margin-bottom: 15px;">
                    <label class="inforLabel" for="expirationDate">Expiration Date:</label>
                    <input id="expirationDate" type="date" class="inforTextBox" 
                           style="width: 100%;" title="Press 'T' for today's date">
                    <small style="color: #666;">Press 'T' for today's date</small>
                </div>`;
            }
            
            formHtml += '</form></div>';
            
            const dialogContent = $(formHtml);
            
            // Method to show validation errors within the dialog context
            dialogContent.showValidationError = function(message) {
                // Remove any existing error messages
                dialogContent.find('.validation-error').remove();
                
                // Create error message element
                const errorDiv = $(`
                    <div class="validation-error" style="
                        background: #ffebee; 
                        border: 1px solid #f44336; 
                        color: #c62828; 
                        padding: 8px 12px; 
                        margin: 10px 0; 
                        border-radius: 4px; 
                        font-size: 12px;
                        white-space: pre-line;
                    ">
                        <strong>⚠️ Validation Error:</strong><br>${message}
                    </div>
                `);
                
                // Insert error message at the top of the form
                dialogContent.find('form').prepend(errorDiv);
                
                // Auto-remove after 5 seconds
                setTimeout(() => errorDiv.fadeOut(() => errorDiv.remove()), 5000);
            };
            
            // Bind the validation error method to the correct context
            const showValidationError = dialogContent.showValidationError;
            
            // Add copy functionality for PO number
            dialogContent.find('#copyPoNumber').on('click', function() {
                const poNumber = dialogContent.find('#poNumberDisplay').val();
                const btn = $(this);
                const originalText = btn.text();
                navigator.clipboard.writeText(poNumber).then(() => {
                    btn.text('✓ Copied!').css('background', '#28a745');
                    setTimeout(() => btn.text(originalText).css('background', '#0072C6'), 1500);
                }).catch(() => {});
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
                    } else {
                        // Trigger Save button
                        const saveButton = dialogContent.closest('.ui-dialog-content').siblings('.ui-dialog-buttonpane').find('button').filter(function() {
                            return $(this).text().trim() === 'Save';
                        });
                        if (saveButton.length > 0) {
                            saveButton.click();
                        } else {
                            // Fallback: simulate Save button click with proper validation
                            const $lot = dialogContent.find('#lotNumber');
                            const lot = $lot.val().trim();
                            let expi = null;
                            let errors = [];

                            // Validate lot number
                            if (!lot || lot.length > 20 || !/^[A-Z0-9-]+$/.test(lot)) {
                                $lot.css('border', '2px solid red');
                                errors.push('Lot number required (alphanumeric, max 20 chars)');
                            }

                            // Validate expiration date if required
                            if (this.EXPD === '1') {
                                const $exp = dialogContent.find('#expirationDate');
                                const expDate = $exp.val();
                                if (!expDate) {
                                    $exp.css('border', '2px solid red');
                                    errors.push('Expiration date required');
                                } else {
                                    expi = expDate.replaceAll('-', ''); // Convert YYYY-MM-DD to YYYYMMDD
                                }
                            }

                            // Show validation errors if any
                            if (errors.length) {
                                showValidationError(errors.join('\n'));
                                return;
                            }

                            // Close dialog and return lot data (duplicate the Save button success logic)
                            closedByButton = true;
                            if (ScriptUtil.version >= 2) {
                                $('.ui-dialog-content:visible').dialog('close');
                            } else {
                                $(dialogContent).inforDialog("close");
                            }
                            resolve({ lot, expi });
                        }
                    }
                }
            }.bind(this));
            
            // Add 'T' for today shortcut for expiration date
            if (this.EXPD === '1') {
                dialogContent.find('#expirationDate').on('keydown', function(e) {
                    if (e.key.toLowerCase() === 't') {
                        e.preventDefault();
                        $(this).val(new Date().toISOString().slice(0, 10));
                        $(this).css('border', ''); // Clear any error styling
                    }
                });
                
                dialogContent.find('#expirationDate').on('change', function() {
                    $(this).css('border', ''); // Clear any error styling
                });
            }
            
            const dialogButtons = [
                {
                    text: "Save",
                    isDefault: true,
                    width: 80,
                    click: function (event, model) {
                        const $lot = dialogContent.find('#lotNumber');
                        const lot = $lot.val().trim();
                        let expi = null;
                        let errors = [];

                        // Validate lot number
                        if (!lot || lot.length > 20 || !/^[A-Z0-9-]+$/.test(lot)) {
                            $lot.css('border', '2px solid red');
                            errors.push('Lot number required (alphanumeric, max 20 chars)');
                        }

                        // Validate expiration date if required
                        if (this.EXPD === '1') {
                            const $exp = dialogContent.find('#expirationDate');
                            const expDate = $exp.val();
                            if (!expDate) {
                                $exp.css('border', '2px solid red');
                                errors.push('Expiration date required');
                            } else {
                                expi = expDate.replaceAll('-', ''); // Convert YYYY-MM-DD to YYYYMMDD
                            }
                        }

                        // Show validation errors if any
                        if (errors.length) {
                            showValidationError(errors.join('\n'));
                            return;
                        }

                        // Close dialog and return lot data
                        closedByButton = true;
                        if (ScriptUtil.version >= 2) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        resolve({ lot, expi });
                    }.bind(this)
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        reject(new Error('Lot input cancelled by user'));
                    }
                }
            ];
            
            const dialogOptions = {
                title: "📦 Enter Lot Number",
                dialogType: "General",
                modal: true, // Changed back to true
                width: 450,
                minHeight: this.EXPD === '1' ? 280 : 220,  // Dynamic height based on expiration requirement
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
            if (ScriptUtil.version >= 2) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            } else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    }

    /*───────────────── VALIDATION / EQUIPMENT ─────────────────*/
    async checkSer(entries) {
        // Validate each derived serial number doesn't already exist in M3
        return Promise.all(entries.map((entry) => {
            const derivedSerial = entry.derivedSerial;
            const rq = Object.assign(new MIRequest(), {
                program: 'MMS235MI',           // Item Lot API
                transaction: 'GetItmLot',
                record: { ITNO: this.ITNO, BANO: derivedSerial },  // BANO = Batch/Serial Number (derived)
                maxReturnedRecords: 1
            });

            //consider validating custom field as well

            return this.mi.executeRequest(rq).then(
                r => {
                    // Check both ITNO and BANO match - if found, serial already exists
                    if (r?.item?.ITNO === this.ITNO && r?.item?.BANO === derivedSerial) {
                        const error = `Derived serial ${derivedSerial} for item ${this.ITNO} already exists (original: ${entry.originalSerial}).`;
                        this.log.Warning(`checkSer: ${error}`);
                        throw new Error(error);
                    }
                },
                e => {
                    // Status 400 = Record not found (expected for new serials)
                    if (e.statusCode === 400) {
                        return;
                    }
                    this.log.Error(`checkSer: Error checking derived serial ${derivedSerial}: ${e.message || e}`);
                    throw e;
                }
            );
        }));
    }

    async checkLot(lot) {
        // Similar validation for lot numbers
        const rq = Object.assign(new MIRequest(), {
            program: 'MMS235MI',
            transaction: 'GetItmLot',
            record: { ITNO: this.ITNO, BANO: lot },
            maxReturnedRecords: 1
        });
        return this.mi.executeRequest(rq).then(
            r => {
                // Check both ITNO and BANO match - if found, lot already exists
                if (r?.item?.ITNO === this.ITNO && r?.item?.BANO === lot) {
                    const error = `Lot ${lot} for item ${this.ITNO} already exists.`;
                    this.log.Warning(`checkLot: ${error}`);
                    throw new Error(error);
                }
            },
            e => {
                if (e.statusCode === 400) {
                    return;
                }
                this.log.Error(`checkLot: Error checking lot ${lot}: ${e.message || e}`);
                throw e;
            }
        );
    }

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
    async addEquip(entries) {
        // Initialize tracking array for potential rollback operations
        this.createdEquipment = [];

        try {
            for (const entry of entries) {
                const derivedSerial = entry.derivedSerial;
                const rq = new MIRequest();
                rq.program = 'MMS240MI';  // Equipment API
                rq.transaction = 'Add';
                rq.maxReturnedRecords = 1;
                rq.record = {
                    ITNO: this.ITNO,     // Item Number
                    SERN: derivedSerial, // Serial Number stored in MMS240 (<=20 chars)
                    STAT: '20',          // Status (20 = In Stock)
                    CUNO: this.CUNO,     // Customer Number (hard referenced for order initiated orders)
                    PUPR: this.PUPR,     // Purchase Price
                    CUCD: this.CUCD,     // Currency Code
                    PPDT: this.today(),  // Purchase Date (today)
                    FACI: this.FACI,     // Facility
                    CUOW: this.CUNO,     // Current Owner
                    OWTP: '0',           // Owner Type (0 = Company)
                    PUNO: this.PUNO,     // Purchase Order Number
                    PNLI: this.PNLI,     // PO Line Number
                    PNLS: this.PNLS,     // PO Line Suffix
                    ALII: this.ITDS      // Item Description
                };

                const result = await this.mi.executeRequest(rq);

                if (!result || !result.item) {
                    const errorMsg = this.extractErrorMessage(result, `Equipment creation for derived serial ${derivedSerial}`);
                    throw new Error(errorMsg);
                }

                const eqNumber = result.item.EQNO || result.item.EQNR || null;
                const createdContext = {
                    ITNO: this.ITNO,
                    SERN: derivedSerial,
                    EQNO: eqNumber,
                    originalSerial: entry.originalSerial
                };

                // Track successful equipment creation for potential rollback
                this.createdEquipment.push(createdContext);

                // Persist the original (long) serial in CMS474 custom fields
                if (this.customFieldConfig?.enabled) {
                    try {
                        await this.storeFullSerialCustomField(createdContext);
                    } catch (cfError) {
                        this.log.Error(`addEquip: Failed to persist long serial for ${derivedSerial}: ${cfError.message || cfError}`);
                        throw cfError;
                    }
                }
            }
        } catch (error) {
            // If any equipment creation fails, rollback the ones that succeeded
            this.log.Error(`addEquip: Equipment creation failed, initiating rollback: ${error.message || error}`);
            await this.rollbackEquipment();
            throw error;
        }
    }

    /**
     * Rollback equipment records if receipt processing fails after equipment creation.
     * 
     * ROLLBACK POLICY (Simplified):
     * - If addEquip() or process() fails, delete ALL equipment records created in this batch
     * - First delete CMS474MI custom field records (if enabled) to clean audit trail (THIS IS NOT NEEDED, but doesn't hurt to include. But does create unneccesary API calls)
     * - Then delete MMS240MI equipment records via Del transaction
     * - Continue rollback even if individual deletions fail (best-effort cleanup)
     * - Clear createdEquipment array when complete
     * 
     * This ensures no orphaned equipment or custom field entries if receipt fails.
     * Failures during rollback are logged but non-blocking (we continue cleanup).
     */
    async rollbackEquipment() {
        if (!this.createdEquipment || this.createdEquipment.length === 0) {
            return;
        }

        this.log.Warning(`rollbackEquipment: Rolling back ${this.createdEquipment.length} equipment records`);

        // Use Promise.allSettled to continue rollback even if some deletions fail
        const rollbackPromises = this.createdEquipment.map(async (equip) => {
            try {
                if (this.customFieldConfig?.enabled) {
                    try {
                        await this.deleteEquipmentCustomField(equip);
                    } catch (cfDeleteError) {
                        this.log.Error(`rollbackEquipment: Failed to delete CMS474 record for EQNO ${equip.EQNO || 'N/A'}: ${cfDeleteError.message || cfDeleteError}`);
                    }
                }

                const deleteRequest = new MIRequest();
                deleteRequest.program = 'MMS240MI';   // Equipment API
                deleteRequest.transaction = 'Del';    // Delete transaction
                deleteRequest.maxReturnedRecords = 1;
                deleteRequest.record = {
                    ITNO: equip.ITNO,  // Item Number
                    SERN: equip.SERN   // Serial Number (equivalent to BANO)
                };

                await this.mi.executeRequest(deleteRequest);
            } catch (rollbackError) {
                // Log rollback failure but continue with other deletions
                this.log.Error(`rollbackEquipment: Failed to delete equipment for serial ${equip.SERN}: ${rollbackError.message || rollbackError}`);
                // Note: Individual rollback failures are logged but don't stop the overall process
            }
        });

        // Wait for all rollback operations to complete (successful or failed)
        const results = await Promise.allSettled(rollbackPromises);

        // Log summary if any failures
        const failed = results.filter(r => r.status === 'rejected').length;
        if (failed > 0) {
            const successful = results.length - failed;
            this.log.Warning(`rollbackEquipment: Completed with ${successful} successful, ${failed} failed deletions`);
        }

        // Clear the tracking array
        this.createdEquipment = [];
    }

    /*───────────────── RECEIPT ENGINE ─────────────────*/
    async process(lines) {
        try {
            // ───────────── AddWhsHead ─────────────
            // Create warehouse transaction header for Interface processing
            const head = Object.assign(new MIRequest(), {
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

            const h = await this.mi.executeRequest(head);

            // Validate header creation was successful
            if (!h?.item?.MSGN) {
                const errorMessage = this.extractErrorMessage(h, 'Warehouse transaction header creation');
                throw new Error(errorMessage);
            }

            // Store message number for subsequent WMS transactions
            this.MSGN = h.item.MSGN;

            // ───────────── AddWhsPack + AddWhsLine ─────────────
            // Create single pack for all items (serial, lot, or non-lotted)
            const packNumber = `${this.PUNO}_${this.PNLI}`;  // Use PUNO_PNLI format for all scenarios

            const pack = new MIRequest();
            pack.program = 'MHS850MI';
            pack.transaction = 'AddWhsPack';
            pack.maxReturnedRecords = 1;
            pack.record = {
                WHLO: this.WHLO,
                MSGN: this.MSGN,
                PACN: packNumber,        // Pack Number = PUNO_PNLI
                QLFR: '20'
            };

            await this.mi.executeRequest(pack);

            // Brief delay to ensure pack creation is committed before adding lines
            await this.sleep(50);

            // Add all line items to the single pack
            await Promise.all(lines.map((rec) => {
                const line = new MIRequest();
                line.program = 'MHS850MI';
                line.transaction = 'AddWhsLine';
                line.maxReturnedRecords = 100;
                line.record = {
                  WHLO: this.WHLO,
                  MSGN: this.MSGN,
                  PACN: packNumber, // All lines use same pack number (PUNO_PNLI)
                  QLFR: "20",
                  ITNO: this.ITNO, // Item Number
                  RVQA: rec.RVQA, // Received Quantity (1 for serials, full qty for others)
                  PUUN: this.PUUN,
                  RIDN: this.PUNO, // Reference ID (PO Number)
                  RIDL: this.PNLI, // Reference Line (PO Line)
                  RIDX: this.PNLS, // Reference Suffix (PO Line Suffix)
                  OEND: this.OEND, // Flag Completed signifier
                };

                // Add warehouse location only for material items (non-material items don't use WHSL)
                if (!this.isNonMaterial) {
                    line.record.WHSL = this.WHSL;  // Warehouse Location
                }

                // Conditionally add batch/lot/serial and expiration data
                if (rec.BANO) line.record.BANO = rec.BANO;  // Batch/Serial/Lot Number
                if (rec.EXPI) line.record.EXPI = rec.EXPI;  // Expiration Date

                return this.mi.executeRequest(line);
            }));

            // Allow lines to settle before processing, especially important for multiple serials
            if (lines.length > 1) {
                await this.sleep(200);
            }

            // ───────────── PrcWhsTran ─────────────
            // Execute the warehouse transaction to complete the receipt
            const pr = new MIRequest();
            pr.program = 'MHS850MI';
            pr.transaction = 'PrcWhsTran';   // Process Warehouse Transaction
            pr.maxReturnedRecords = 1;
            pr.record = {
                MSGN: this.MSGN,             // Message Number from header creation
                PRFL: '*EXE'                 // Process Flag (*EXE = Execute immediately)
            };

            // Execute with retry/backoff to mitigate transient lock/busy errors
            const prc = await this.prcWhsTranWithRetry(pr);

            // Validate transaction processing was successful
            if (!prc?.item) {
                const errorMessage = this.extractErrorMessage(prc, 'Transaction processing');
                throw new Error(errorMessage);
            }

            // ───────────── Final Status Validation ─────────────
            // Check actual processing status using GetWhsHead to ensure transaction completed successfully
            await this.sleep(100); // Brief delay to ensure status is updated

            const statusCheck = new MIRequest();
            statusCheck.program = 'MHS850MI';
            statusCheck.transaction = 'GetWhsHead';
            statusCheck.maxReturnedRecords = 1;
            statusCheck.outputFields = ['STAT', 'STRD'];
            statusCheck.record = {
                MSGN: this.MSGN
            };

            const statusResult = await this.mi.executeRequest(statusCheck);

            if (!statusResult?.item) {
                throw new Error('Failed to retrieve transaction status for validation');
            }

            const transactionStatus = statusResult.item.STAT;

            // Only status 90 (Processed, no errors) indicates success
            if (transactionStatus !== '90') {
                // Transaction failed - determine error level and provide specific guidance
                let errorMessage = 'Transaction processing failed.\n\n';
                let troubleshootingInfo = '';

                troubleshootingInfo = this._getTroubleshootingInfo(transactionStatus, statusResult, packNumber);

                // Add status description for clarity
                const statusDescriptions = {
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

                const statusDesc = statusDescriptions[transactionStatus] || 'Unknown status';

                // Build a clearer, structured message
                const statusLines = [
                    ...(troubleshootingInfo?.trim() ? [`Error: ${troubleshootingInfo.trim()}`] : []),
                    `Status: ${transactionStatus} (${statusDesc})`,
                    `Message no: ${this.MSGN}`,
                    ...(packNumber !== undefined ? [`Package no: ${packNumber}`] : []),
                ];
                errorMessage += statusLines.join('\n');

                this.log.Error(`process: Transaction failed with status ${transactionStatus} (${statusDesc})`);

                // Initiate rollback for failed transaction
                if (this.createdEquipment?.length > 0) {
                    this.log.Warning('Transaction failed, initiating equipment rollback');
                    await this.rollbackEquipment();
                }

                throw new Error(errorMessage);
            }

            this.log.Info('Receipt processing completed successfully');

        } catch (e) {
            this.log.Error(`process: Receipt processing failed: ${e.message || e}`);
            throw e;
        }
    }

    /*───────────────── HELPER METHODS (Enterprise H5 Patterns) ─────────────────*/
    // Enterprise-grade alert using H5ControlUtil.H5Dialog
    alert(title, message, shouldRefresh = false) {
        this.log.Info(`Displaying alert: ${title} - ${message}`);
        
        // Enhanced message formatting for better readability
        const formattedMessage = message.replaceAll('\n', '<br>');
        const dialogContent = $(`<div style="max-width: 500px; word-wrap: break-word;"><label class="inforLabel noColon">${formattedMessage}</label></div>`);
        
        const dialogButtons = [
            {
                text: "OK",
                isDefault: true,
                width: 80,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2) {
                        model.close(true);
                    } else {
                        $(this).inforDialog("close");
                    }
                    if (shouldRefresh) {
                        this.refresh();
                    }
                }.bind(this)
            }
        ];
        
        const dialogOptions = {
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
        if (ScriptUtil.version >= 2) {
            H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
        } else {
            dialogContent.inforMessageDialog(dialogOptions);
        }
    }

    busy(v) {
        try {
            if (!this.ctrl) {
                return;
            }
            if (v) {
                this.ctrl.ShowBusyIndicator?.();
            } else {
                this.ctrl.HideBusyIndicator?.();
            }
        } catch (error) {
            this.log.Warning(`busy: Failed to set busy indicator: ${error.message || error}`);
        }
    }

    refresh() {
        // Refresh H5 screen to show updated data
        if (this.ctrl?.PressKey) {
            this.ctrl.PressKey("F5");
        } else {
            this.log.Warning('Screen refresh requested but controller not available');
        }
    }

    num(value) {
        // Convert string to number, removing non-numeric characters
        return Number.parseFloat((value || '0').toString().replace(/[^\d.-]/g, '')) || 0;
    }

    today() {
        // Return today's date in YYYYMMDD format for M3
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    // Detect transient lock/busy errors for ProcessTran retry logic
    isTransientProcessLock(e) {
        try {
            const status = e?.statusCode;
            const code = (e?.errorCode || '').toString().toUpperCase();
            const msg = (e?.errorMessage || e?.message || '').toString().toLowerCase();

            // HTTP-style transient signals
            if (status === 409 || status === 503) return true;

            // Common lock/busy keywords
            const keywords = ['locked', 'record lock', 'busy', 'in use', 'try again', 'temporary', 'timeout', 'deadlock'];
            if (keywords.some(k => msg.includes(k))) return true;

            // Known MI error codes that often indicate transient state
            if (["WPU0901", "M3LOCK"].includes(code)) return true;
        } catch { return false; }
        return false;
    }

    // Execute PrcWhsTran with limited retries and exponential backoff
    async prcWhsTranWithRetry(pr, maxAttempts = 3) {
        let attempt = 1;
        let lastError = null;
        while (attempt <= maxAttempts) {
            try {
                const result = await this.mi.executeRequest(pr);
                return result;
            } catch (e) {
                lastError = e;
                if (!this.isTransientProcessLock(e) || attempt === maxAttempts) {
                    throw e;
                }
                const backoff = 300 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
                this.log.Warning(`Transient error on PrcWhsTran attempt ${attempt}/${maxAttempts}, retrying in ${backoff}ms`);
                await this.sleep(backoff);
                attempt++;
            }
        }
        throw lastError || new Error('Unknown error executing PrcWhsTran');
    }

};
