/*─────────────────────────────────────────────────────────────────────────────
  POReceiptShortcut.js
  H5-compliant script for PO receipt processing
  Author: GitHub Copilot   Date: 05-Aug-2025 9:55PM
  Version: 7.0            Compatible with: H5 2.0+

  FEATURES
  • Enterprise-grade H5 SDK compliance using H5ControlUtil.H5Dialog API
  • Promise-based MI service calls with comprehensive error handling
  • Proper H5 logging patterns following SDK guidelines
  • Future-proof dialog implementation with version fallback support
  • Single pack with multiple lines for INDI = 2 (PACN = PUNO_PNLI), single pack otherwise
  • Pushes only one PrcWhsTran (message-level)
  • "T for today" in Expiration date input
  • Performance timing and monitoring
  • Consistent error reporting and user feedback
  • Transaction rollback for equipment records on failure

  ARCHITECTURE
  • Follows official H5 SDK sample patterns (H5SampleCustomDialog.ts)
  • Uses H5ControlUtil.H5Dialog.CreateDialogElement for H5 >= 2.0
  • Falls back to inforMessageDialog for H5 < 2.0
  • Implements enterprise logging standards with this.log
  • Uses proper IMIResponse error handling patterns
  • Follows H5 SDK naming conventions and structure
─────────────────────────────────────────────────────────────────────────────*/

/*──────────────────────────────────────────────────────────────────────────*/
var POReceiptShortcut = class {

    constructor(args) {
        // Initialize base properties following H5 SDK patterns
        this.typeName = 'POReceiptShortcut';
        // Use appropriate MIService version based on H5 compatibility
        this.mi = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;
        this.ctrl = args.controller;    // H5 controller for UI interactions
        this.log = args.log;           // H5 logging service
        
        // Log initialization following SDK patterns
        this.log.Info('POReceiptShortcut initialized successfully');
    }

    static Init(args) {
        // Entry point: Initialize script (supports fallbacks for < 2.0)
        const self = new POReceiptShortcut(args);
        self.busy(true);    // Show loading indicator during processing
        // Execute main workflow with cleanup regardless of success/failure
        self.run().finally(() => self.busy(false));
    }

    /*───────────────── LOGGING METHODS (H5 SDK Standard) ─────────────────*/
    // Enterprise logging following H5 SDK sample patterns
    // All samples use this.log.Info, this.log.Error, etc. directly
    
    logDebug(message) { 
        console.log(`[DEBUG] ${message}`);
        this.log.Info(`[DEBUG] ${message}`); 
    }
    logInfo(message) { 
        console.log(`[INFO] ${message}`);
        this.log.Info(message); 
    }
    logWarning(message) { 
        console.log(`[WARNING] ${message}`);
        this.log.Info(`[WARNING] ${message}`); 
    }
    logError(message, error = null) { 
        if (error) {
            console.error(`[ERROR] ${message}: ${error.message || error}`, error);
            this.log.Error(`${message}: ${error.message || error}`);
        } else {
            console.error(`[ERROR] ${message}`);
            this.log.Error(message);
        }
    }

    // Enhanced MI transaction logging
    logMIRequest(program, transaction, record) {
        console.log(`[MI-REQUEST] ${program}/${transaction}:`, JSON.stringify(record, null, 2));
        this.logDebug(`MI Request: ${program}/${transaction} - ${JSON.stringify(record)}`);
    }

    logMIResponse(program, transaction, response, success = true) {
        if (success) {
            console.log(`[MI-RESPONSE] ${program}/${transaction} SUCCESS:`, JSON.stringify(response, null, 2));
            this.logDebug(`MI Response: ${program}/${transaction} - ${JSON.stringify(response)}`);
        } else {
            console.error(`[MI-RESPONSE] ${program}/${transaction} ERROR:`, JSON.stringify(response, null, 2));
            this.logError(`MI Response Error: ${program}/${transaction} - ${JSON.stringify(response)}`);
        }
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
        this.log.Info(`Starting progress tracking with ${steps.length} steps: ${steps.join(', ')}`);

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
            modal: false,  // Allow background interaction
            width: 400,
            minHeight: 150,
            icon: "info",
            closeOnEscape: true,  // Prevent manual closing during processing
            close: function () {
                // Don't allow manual closing during processing
            },
            buttons: []  // No buttons during processing
        };

        // Show progress dialog with proper version handling
        if (ScriptUtil.version >= 2.0) {
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
        this.log.Info('Progress completed successfully');
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
                if (ScriptUtil.version >= 2.0 && typeof this.progressDialog.close === 'function') {
                    this.progressDialog.close(true);
                } else {
                    // For pre‑2.0 dialogs use the inforDialog API on the element
                    try {
                        $(this.progressDialog).inforDialog('close');
                    } catch (e) {
                        // Fallback: attempt to close using the content element
                        if (this.progressContent && this.progressContent.inforDialog) {
                            this.progressContent.inforDialog('close');
                        }
                    }
                }
                this.progressDialog = null;
            }
        } catch (err) {
            // Log any errors but continue cleaning up content
            this.log.Info(`closeProgress: error closing progress dialog: ${err.message}`);
        }

        // Remove the content element from the DOM
        if (this.progressContent) {
            this.progressContent.remove();
            this.progressContent = null;
        }
        this.log.Info('Progress dialog closed');
    }
    
    sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    /*───────────────── MAIN FLOW ─────────────────*/
    async run() {
        try {
            // Initialize progress tracking with predefined steps
            this.initProgress(['Validate', 'Get PO line', 'Lookups', 'Warnings', 'Process']);

            // Step 1: Validate required input fields
            const t0 = performance.now();
            await this.validateFields();
            const t1 = performance.now();
            await this.advance('Validate');
            console.log(`[Timing] validateFields: ${(t1-t0).toFixed(1)} ms`);

            // Step 2: Retrieve PO line details from M3
            const t2 = performance.now();
            await this.getPOLine();
            const t3 = performance.now();
            await this.advance('Get PO line');
            console.log(`[Timing] getPOLine: ${(t3-t2).toFixed(1)} ms`);

            // Step 3: Gather supporting data (header, warehouse, item, etc.)
            const t4 = performance.now();
            await this.lookups();
            const t5 = performance.now();
            await this.advance('Lookups');
            console.log(`[Timing] lookups: ${(t5-t4).toFixed(1)} ms`);

            // Step 4: Check for business warnings (WMS, over-receipt)
            const t6 = performance.now();
            await this.warnings();
            const t7 = performance.now();
            await this.advance('Warnings');
            console.log(`[Timing] warnings: ${(t7-t6).toFixed(1)} ms`);

            /* ─── Branch by control method ─── */
            // Process based on item lot control method (INDI field)
            console.log(`[CONTROL-METHOD] Processing item with INDI=${this.INDI} (${this.INDI === '2' ? 'Serial' : this.INDI === '3' ? 'Lot' : 'Non-lotted'})`);
            
            if (this.INDI === '2') {        // Serial controlled items
                console.log('[SERIAL-CONTROL] Starting serial processing workflow');
                const serials = await this.promptSerials();  // User interaction - NO busy
                console.log('[SERIAL-INPUT] User provided serials:', serials);
                
                // Add additional progress steps for serial processing
                this.addProgressStep('Adding equipment records');
                this.addProgressStep('Queueing transactions');
                this.addProgressStep('Finalizing message');

                const t8 = performance.now();
                console.log('[SERIAL-VALIDATION] Starting serial validation and equipment creation');
                await this.checkSer(serials);  // Validate serials don't already exist
                console.log('[SERIAL-VALIDATION] ✓ All serials validated successfully');
                
                await this.addEquip(serials);  // Create equipment records in M3
                console.log('[EQUIPMENT-CREATION] ✓ All equipment records created successfully');
                await this.advance('Adding equipment records');
                const t9 = performance.now();
                console.log(`[Timing] checkSer+addEquip: ${(t9-t8).toFixed(1)} ms`);

                try {
                    await this.sleep(50);
                    const t10 = performance.now();
                    console.log('[SERIAL-RECEIPT] Starting receipt transaction processing');
                    // Create single pack with multiple lines (one per serial)
                    const serialLines = serials.map(s => ({ BANO: s, RVQA: '1', EXPI: null }));
                    console.log('[SERIAL-LINES] Processing lines:', JSON.stringify(serialLines, null, 2));
                    await this.process(serialLines, false);
                    await this.advance('Queueing transactions');
                    const t11 = performance.now();
                    console.log(`[Timing] process (serial): ${(t11-t10).toFixed(1)} ms`);

                    // Clear equipment tracking since process succeeded
                    console.log('[SERIAL-SUCCESS] Receipt completed successfully, clearing equipment tracking');
                    this.createdEquipment = [];
                } catch (processError) {
                    // Receipt processing failed - rollback equipment records to maintain data consistency
                    console.error('[SERIAL-FAILURE] Receipt processing failed after equipment creation, initiating rollback:', processError);
                    this.log.Error('Receipt processing failed after equipment creation, initiating rollback', processError);
                    await this.rollbackEquipment();
                    throw processError;
                }

                await this.advance('Finalizing message');
            } else if (this.INDI === '3') { // Lot controlled items
                console.log('[LOT-CONTROL] Starting lot processing workflow');
                const { lot, expi } = await this.promptLot();  // User interaction - NO busy
                console.log('[LOT-INPUT] User provided lot:', { lot, expi });
                
                const t8 = performance.now();
                await this.checkLot(lot);  // Validate lot doesn't already exist
                console.log('[LOT-VALIDATION] ✓ Lot validated successfully');
                await this.process([{ BANO: lot, RVQA: this.RVQA, EXPI: expi }], false);
                console.log('[LOT-SUCCESS] ✓ Lot receipt completed successfully');
                const t9 = performance.now();
                console.log(`[Timing] checkLot+process (lot): ${(t9-t8).toFixed(1)} ms`);
            } else {                        
                console.log('[NON-LOTTED] Starting non-lotted item processing workflow');
                await this.promptConfirm(); // Simple confirmation dialog - NO busy
                console.log("[NON-LOTTED-CONFIRMED] User confirmed receipt");
                
                const t8 = performance.now();
                await this.process([{ BANO: null, RVQA: this.RVQA, EXPI: null }], false);
                console.log(
                  "[NON-LOTTED-SUCCESS] ✓ Non-lotted receipt completed successfully"
                );
                const t9 = performance.now();
                console.log(`[Timing] process (non-lotted): ${(t9-t8).toFixed(1)} ms`);
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

    alert(t, m, refresh) {
        // Display non-modal dialog with title, message, and optional refresh
        const dialogContent = $(`<div><label class='inforLabel noColon'>${m}</label></div>`);
        
        const dialogButtons = [
            {
                text: "OK",
                isDefault: true,
                width: 80,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    } else {
                        $(this).inforDialog("close");
                    }
                    if (refresh) this.refresh();  // Refresh H5 screen if requested
                }.bind(this)
            }
        ];
        
        const dialogOptions = {
            title: t,
            dialogType: "General",
            modal: false,  // Allow user to interact with other windows
            width: 360,
            minHeight: 150,
            icon: t === "Error" ? "error" : "info",
            closeOnEscape: true,
            close: function () {
                dialogContent.remove();
            },
            buttons: dialogButtons
        };

        // Show dialog with proper version handling
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
        } else {
            dialogContent.inforMessageDialog(dialogOptions);
        }
    }

    /*───────────────── FIELD VALIDATION ─────────────────*/
    async validateFields() {
        this.log.Info('Starting field validation');
        
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

        // Log all extracted field values
        const fieldValues = {
            PUNO: this.PUNO, SUNO: this.SUNO, WHLO: this.WHLO,
            PNLI: this.PNLI, PNLS: this.PNLS, RVQA: this.RVQA,
            WHSL: this.WHSL, ITNO: this.ITNO, OEND: this.OEND
        };
        console.log('[FIELD-VALUES] Extracted from H5 screen:', JSON.stringify(fieldValues, null, 2));
        this.logDebug(`Field values extracted: ${JSON.stringify(fieldValues)}`);

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
            console.error('[VALIDATION-ERROR]', error);
            this.log.Error(error);
            throw new Error(error);
        }
        
        console.log('[VALIDATION-SUCCESS] All required fields present');
        this.log.Info('Field validation completed successfully');
    }

    /*───────────────── MI LOOK‑UPS (Enterprise Error Handling) ─────────────────*/
    async getPOLine() {
        this.log.Info('Starting PO line lookup');
        
        const request = new MIRequest();
        request.program = 'PPS200MI';
        request.transaction = 'GetLine';
        request.record = { 
            PUNO: this.PUNO, 
            PNLI: this.PNLI, 
            PNLS: this.PNLS 
        };
        request.maxReturnedRecords = 1;

        this.logMIRequest(request.program, request.transaction, request.record);

        try {
            const response = await this.mi.executeRequest(request);
            this.logMIResponse(request.program, request.transaction, response, true);
            
            if (!response || !response.item) {
                const errorMessage = this.extractErrorMessage(response, 'PO line retrieval');
                throw new Error(errorMessage);
            }
            
            const poLineData = {
                PUPR: response.item.PUPR, 
                RORC: response.item.RORC, 
                RORN: response.item.RORN,
                RORL: response.item.RORL, 
                ITDS: response.item.ITDS, 
                GETY: response.item.GETY
            };
            
            Object.assign(this, poLineData);
            
            console.log('[PO-LINE-DATA] Retrieved:', JSON.stringify(poLineData, null, 2));
            this.log.Info('PO line data retrieved successfully');
        } catch (error) {
            this.logMIResponse(request.program, request.transaction, error, false);
            this.log.Error('Failed to retrieve PO line data', error);
            throw error;
        }
    }

    async lookups() {
        try {
            this.log.Info('Starting comprehensive data lookups');
            
            /* header - Get PO header information */
            const headerRequest = new MIRequest();
            headerRequest.program = 'PPS200MI';
            headerRequest.transaction = 'GetHead';
            headerRequest.record = { PUNO: this.PUNO };
            headerRequest.maxReturnedRecords = 1;
            
            this.logMIRequest(headerRequest.program, headerRequest.transaction, headerRequest.record);
            const header = await this.mi.executeRequest(headerRequest);
            this.logMIResponse(headerRequest.program, headerRequest.transaction, header, true);
            
            if (!header || !header.item) {
                const errorMessage = this.extractErrorMessage(header, 'PO header retrieval');
                throw new Error(errorMessage);
            }
            // Store key header fields for downstream processing
            const headerData = {
                PUDT: header.item.PUDT,  // Order Date
                CUCD: header.item.CUCD,  // Currency Code
                FACI: header.item.FACI   // Facility
            };
            Object.assign(this, headerData);
            console.log('[HEADER-DATA] Retrieved:', JSON.stringify(headerData, null, 2));
            
            /* whs - Check if warehouse is WMS-managed */
            const whsRequest = new MIRequest();
            whsRequest.program = 'MMS009MI';
            whsRequest.transaction = 'Get';
            whsRequest.record = { WHGR: 'WMSWHSE', WHLO: this.WHLO };
            whsRequest.maxReturnedRecords = 1;
            
            this.logMIRequest(whsRequest.program, whsRequest.transaction, whsRequest.record);
            const whs = await this.mi.executeRequest(whsRequest);
            this.logMIResponse(whsRequest.program, whsRequest.transaction, whs, true);
            
            // If record exists, warehouse is WMS-managed
            this.isWmsWhs = !!(whs && whs.item);
            console.log(`[WMS-CHECK] Warehouse ${this.WHLO} is WMS-managed: ${this.isWmsWhs}`);
            this.log.Info(`WMS warehouse check completed - isWmsWhs: ${this.isWmsWhs}`);
            
            /* item - Get item control and expiration details */
            const itemRequest = new MIRequest();
            itemRequest.program = 'MMS200MI';
            itemRequest.transaction = 'GetItmBasic';
            itemRequest.record = { ITNO: this.ITNO, ALFM: '1' };
            itemRequest.maxReturnedRecords = 1;
            
            this.logMIRequest(itemRequest.program, itemRequest.transaction, itemRequest.record);
            const itm = await this.mi.executeRequest(itemRequest);
            this.logMIResponse(itemRequest.program, itemRequest.transaction, itm, true);
            
            if (!itm || !itm.item) {
                const errorMessage = this.extractErrorMessage(itm, 'Item details retrieval');
                throw new Error(errorMessage);
            }
            // Store control method and expiration flags
            const itemData = {
                EXPD: itm.item.EXPD,  // Expiration Date Required (0/1)
                INDI: itm.item.INDI,  // Control Method (0=None, 1=Manual, 2=Serial, 3=Lot)
                TPCD: itm.item.TPCD   // Item Category (13=Non-material)
            };
            Object.assign(this, itemData);
            console.log('[ITEM-DATA] Retrieved:', JSON.stringify(itemData, null, 2));
            
            // Additional validation: Check if WHSL is required based on item type
            // Non-material items (INDI=0 and TPCD=13) don't require warehouse location
            const isNonMaterial = this.INDI === '0' && this.TPCD === '13';
            console.log(`[ITEM-ANALYSIS] isNonMaterial: ${isNonMaterial}, WHSL: ${this.WHSL}`);
            if (!isNonMaterial && !this.WHSL) {
                throw new Error('Warehouse location (WHSL) is required for material items');
            }
            
            this.log.Info(`Item validation completed - INDI: ${this.INDI}, TPCD: ${this.TPCD}, isNonMaterial: ${isNonMaterial}`);
            
            /* remaining qty - Get outstanding quantity on PO line */
            const remRequest = new MIRequest();
            remRequest.program = 'PPS001MI';
            remRequest.transaction = 'GetBasicData2';
            remRequest.record = { PUNO: this.PUNO, PNLI: this.PNLI, PNLS: this.PNLS };
            remRequest.maxReturnedRecords = 1;
            
            this.logMIRequest(remRequest.program, remRequest.transaction, remRequest.record);
            const rem = await this.mi.executeRequest(remRequest);
            this.logMIResponse(remRequest.program, remRequest.transaction, rem, true);
            
            if (!rem || !rem.item) {
                const errorMessage = this.extractErrorMessage(rem, 'Remaining quantity retrieval');
                throw new Error(errorMessage);
            }
            this.RMQA = rem.item.RSTQ;  // Remaining Quantity
            console.log(`[REMAINING-QTY] RMQA: ${this.RMQA}, RVQA: ${this.RVQA}`);
            
            /* drop-ship customer (optional) - Only for drop-ship orders */
            if (this.RORC === '3' && this.RORN) {  // RORC=3 indicates link to customer order
                const customerRequest = new MIRequest();
                customerRequest.program = 'OIS100MI';
                customerRequest.transaction = 'GetOrderHead';
                customerRequest.record = { ORNO: this.RORN };  // Related Order Number
                customerRequest.maxReturnedRecords = 1;
                
                this.logMIRequest(customerRequest.program, customerRequest.transaction, customerRequest.record);
                const c = await this.mi.executeRequest(customerRequest);
                this.logMIResponse(customerRequest.program, customerRequest.transaction, c, true);
                
                if (!c || !c.item) {
                    const errorMessage = this.extractErrorMessage(c, 'Customer order details retrieval');
                    throw new Error(errorMessage);
                }
                this.CUNO = c.item.CUNO;  // Customer Number for equipment records
                console.log(`[CUSTOMER-DATA] Drop-ship customer: ${this.CUNO}`);
            }
            
            console.log('[LOOKUPS-COMPLETE] All data lookups successful');
            this.log.Info('All lookups completed successfully');
        } catch (error) {
            this.log.Error('Data lookup failed', error);
            throw error;
        }
    }

    async warnings() {
        // Business Rule: Warn if WMS-managed warehouse but not using WMS receipt (GETY≠24)
        if (this.isWmsWhs && this.GETY !== '24') {
            await this.dialogWarn(
                'WMS‑managed Receipt; Receiving this line in M3 instead of WMS may result in balance discrepancy.'
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
                        closedByButton = true;
                        resolve();
                        if (ScriptUtil.version >= 2.0) {
                            $('.ui-dialog-content:visible').dialog('close');
                        } else {
                            $(dialogContent).inforDialog("close");
                        }
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
                        if (ScriptUtil.version >= 2.0) {
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
                        if (ScriptUtil.version >= 2.0) {
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
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            } else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    }

    promptConfirm() {
        return new Promise((resolve, reject) => {
            let closedByButton = false;
            this.log.Info(`Requesting confirmation to receive ${this.RVQA} units`);
            
            // Create dialog content following H5SampleCustomDialog pattern
            const dialogContent = $(`<div><label class='inforLabel noColon'>Receive ${this.RVQA} unit(s)?</label></div>`);
            
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
                        closedByButton = true;
                        resolve();
                        if (ScriptUtil.version >= 2.0) {
                            $('.ui-dialog-content:visible').dialog('close');
                        } else {
                            $(dialogContent).inforDialog("close");
                        }
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
                        if (ScriptUtil.version >= 2.0) {
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
                        if (ScriptUtil.version >= 2.0) {
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
            if (ScriptUtil.version >= 2.0) {
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
            this.log.Info(`Prompting for ${qty} serial numbers`);
            
            // Safety check: Prevent excessive quantity that could crash browser
            const MAX_SERIALS = 25;  // Reasonable limit for manual entry
            if (qty > MAX_SERIALS) {
                this.logError(`Serial quantity ${qty} exceeds maximum allowed ${MAX_SERIALS}`);
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
            formHtml += '<div id="serialInputsContainer" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; padding-right: 5px;"><form>';
            
            for (let i = 0; i < qty; i++) {
                formHtml += `<div style="margin-bottom: 10px;">
                    <label class="inforLabel" for="serial${i}">Serial ${i + 1}:</label>
                    <input id="serial${i}" type="text" class="inforTextBox" maxlength="20" 
                           placeholder="Enter serial number" style="width: 100%; text-transform: uppercase;" 
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
                const poInput = dialogContent.find('#poNumberDisplay')[0];
                poInput.select();
                document.execCommand('copy');
                
                // Visual feedback
                const btn = $(this);
                const originalText = btn.text();
                btn.text('✓ Copied!').css('background', '#28a745');
                setTimeout(() => {
                    btn.text(originalText).css('background', '#0072C6');
                }, 1500);
            });
            
            // Add auto-generate functionality for sequential serials
            dialogContent.find('#generateSerials').on('click', function() {
                const poNumber = dialogContent.find('#poNumberDisplay').val();
                console.log(`[GENERATE-SERIALS] Auto-generating ${qty} sequential serials based on PO: ${poNumber}`);
                
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
                
                console.log(`[GENERATE-SERIALS] ✓ Generated serials: ${poNumber}-1 through ${poNumber}-${qty}`);
                
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
            
            // Add Enter key handling for serial inputs
            dialogContent.find('input[id^="serial"]').on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const currentIndex = parseInt(this.id.replace('serial', ''));
                    
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
                            // Fallback: simulate Save button click with updated validation logic
                            const serials = [];
                            let invalid = [];

                            // Validate all serial inputs - check format and presence first
                            for (let i = 0; i < qty; i++) {
                                const $field = dialogContent.find(`#serial${i}`);
                                const val = $field.val().trim();

                                if (!val) {
                                    $field.css('border', '2px solid red');
                                    invalid.push(`Serial ${i + 1} (blank)`);
                                } else if (val.length > 20) {
                                    $field.css('border', '2px solid red');
                                    invalid.push(`Serial ${i + 1} (too long)`);
                                } else if (!/^[A-Z0-9\-]+$/.test(val)) {
                                    $field.css('border', '2px solid red');
                                    invalid.push(`Serial ${i + 1} (invalid characters)`);
                                } else {
                                    serials.push(val);
                                }
                            }

                            // Show validation errors if any invalid entries found
                            if (invalid.length) {
                                showValidationError(`Invalid or blank input in: ${invalid.join(', ')}\nSerials must be alphanumeric (A-Z, 0-9, hyphen allowed), max 20 characters.`);
                                return;
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
                                return;
                            }

                            // Close dialog and return serials (duplicate the Save button success logic)
                            closedByButton = true;
                            if (ScriptUtil.version >= 2.0) {
                                $('.ui-dialog-content:visible').dialog('close');
                            } else {
                                $(dialogContent).inforDialog("close");
                            }
                            resolve(serials);
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
                        const serials = [];
                        let invalid = [];

                        // Validate all serial inputs - check format and presence first
                        for (let i = 0; i < qty; i++) {
                            const $field = dialogContent.find(`#serial${i}`);
                            const val = $field.val().trim();

                            if (!val) {
                                $field.css('border', '2px solid red');
                                invalid.push(`Serial ${i + 1} (blank)`);
                            } else if (val.length > 20) {
                                $field.css('border', '2px solid red');
                                invalid.push(`Serial ${i + 1} (too long)`);
                            } else if (!/^[A-Z0-9\-]+$/.test(val)) {
                                $field.css('border', '2px solid red');
                                invalid.push(`Serial ${i + 1} (invalid characters)`);
                            } else {
                                serials.push(val);
                            }
                        }

                        // Show validation errors if any invalid entries found
                        if (invalid.length) {
                            showValidationError(`Invalid or blank input in: ${invalid.join(', ')}\nSerials must be alphanumeric (A-Z, 0-9, hyphen allowed), max 20 characters.`);
                            return;
                        }

                        // Check for duplicates only after all serials are validated
                        if (new Set(serials).size !== qty) {
                            // Find and highlight duplicate serials
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
                            return;
                        }

                        // Close dialog and return serials
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                        resolve(serials);
                    }
                },
                {
                    text: "Cancel",
                    width: 80,
                    click: function (event, model) {
                        closedByButton = true;
                        if (ScriptUtil.version >= 2.0) {
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
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            } else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    }

    promptLot() {
        return new Promise((resolve, reject) => {
            let closedByButton = false;
            this.log.Info('Prompting for lot number and expiration date');
            
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
                const poInput = dialogContent.find('#poNumberDisplay')[0];
                poInput.select();
                document.execCommand('copy');
                
                // Visual feedback
                const btn = $(this);
                const originalText = btn.text();
                btn.text('✓ Copied!').css('background', '#28a745');
                setTimeout(() => {
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
                            if (!lot || lot.length > 20 || !/^[A-Z0-9\-]+$/.test(lot)) {
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
                        if (!lot || lot.length > 20 || !/^[A-Z0-9\-]+$/.test(lot)) {
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
                        if (ScriptUtil.version >= 2.0) {
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
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
            } else {
                dialogContent.inforMessageDialog(dialogOptions);
            }
        });
    }

    /*───────────────── VALIDATION / EQUIPMENT ─────────────────*/
    async checkSer(arr) {
        console.log(`[SERIAL-CHECK] Starting validation for ${arr.length} serial numbers:`, arr);
        this.logDebug(`checkSer: Validating ${arr.length} serial numbers`);
        
        // Validate each serial number doesn't already exist in M3
        return Promise.all(arr.map((s, index) => {
            const rq = Object.assign(new MIRequest(), {
                program: 'MMS235MI',           // Item Lot API
                transaction: 'GetItmLot',
                record: { ITNO: this.ITNO, BANO: s },  // BANO = Batch/Serial Number
                maxReturnedRecords: 1
            });
            
            console.log(`[SERIAL-CHECK-${index + 1}] Checking serial: ${s}`);
            this.logMIRequest(rq.program, rq.transaction, rq.record);
            
            return this.mi.executeRequest(rq).then(
                r => {
                    this.logMIResponse(rq.program, rq.transaction, r, true);
                    // Check both ITNO and BANO match - if found, serial already exists
                    if (r && r.item && r.item.ITNO === this.ITNO && r.item.BANO === s) {
                        const error = `Serial ${s} for item ${this.ITNO} already exists.`;
                        console.error(`[SERIAL-CHECK-${index + 1}] DUPLICATE FOUND:`, error);
                        this.logWarning(`checkSer: ${error}`);
                        throw new Error(error);
                    }
                    console.log(`[SERIAL-CHECK-${index + 1}] ✓ Serial ${s} available`);
                    this.logDebug(`checkSer: Serial ${s} validation passed`);
                },
                e => { 
                    this.logMIResponse(rq.program, rq.transaction, e, false);
                    // Status 400 = Record not found (expected for new serials)
                    if (e.statusCode === 400) {
                        console.log(`[SERIAL-CHECK-${index + 1}] ✓ Serial ${s} does not exist (expected)`);
                        this.logDebug(`checkSer: Serial ${s} does not exist (expected)`);
                        return; 
                    }
                    console.error(`[SERIAL-CHECK-${index + 1}] ERROR checking serial ${s}:`, e);
                    this.logError(`checkSer: Error checking serial ${s}`, e);
                    throw e; 
                }
            );
        }));
    }

    async checkLot(lot) {
        this.logDebug(`checkLot: Validating lot ${lot}`);
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
                if (r && r.item && r.item.ITNO === this.ITNO && r.item.BANO === lot) {
                    const error = `Lot ${lot} for item ${this.ITNO} already exists.`;
                    this.logWarning(`checkLot: ${error}`);
                    throw new Error(error);
                }
                this.logDebug(`checkLot: Lot ${lot} validation passed`);
            },
            e => { 
                if (e.statusCode === 400) {
                    this.logDebug(`checkLot: Lot ${lot} does not exist (expected)`);
                    return; 
                }
                this.logError(`checkLot: Error checking lot ${lot}`, e);
                throw e; 
            }
        );
    }

    async addEquip(arr) {
        // Create equipment records for serial controlled items
        // Initialize tracking array for potential rollback operations
        this.createdEquipment = [];
        
        console.log(`[EQUIPMENT-ADD] Starting creation of ${arr.length} equipment records`);
        this.logDebug(`addEquip: Creating equipment records for ${arr.length} serials`);
        
        try {
            await Promise.all(arr.map(async (s, index) => {
                const rq = new MIRequest();
                rq.program = 'MMS240MI';  // Equipment API
                rq.transaction = 'Add'; 
                rq.maxReturnedRecords = 1;
                rq.record = {
                    ITNO: this.ITNO,     // Item Number
                    SERN: s,             // Serial Number
                    STAT: '20',          // Status (20 = In Stock)
                    CUNO: this.CUNO,     // Customer Number (hard referenced for drop-ship)
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
                
                console.log(`[EQUIPMENT-ADD-${index + 1}] Creating equipment for serial: ${s}`);
                this.logMIRequest(rq.program, rq.transaction, rq.record);
                
                const result = await this.mi.executeRequest(rq);
                this.logMIResponse(rq.program, rq.transaction, result, true);
                
                if (!result || !result.item) {
                    const errorMsg = this.extractErrorMessage(result, `Equipment creation for serial ${s}`);
                    throw new Error(errorMsg);
                }
                
                // Track successful equipment creation for potential rollback
                this.createdEquipment.push({
                    ITNO: this.ITNO,
                    SERN: s  // SERN is equivalent to BANO for rollback operations
                });
                
                console.log(`[EQUIPMENT-ADD-${index + 1}] ✓ Successfully created equipment for serial: ${s}`);
                this.logDebug(`addEquip: Successfully added equipment record for serial ${s}`);
            }));
            
            console.log(`[EQUIPMENT-ADD-COMPLETE] All ${arr.length} equipment records created successfully`);
        } catch (error) {
            // If any equipment creation fails, rollback the ones that succeeded
            console.error('[EQUIPMENT-ADD-FAILED] Equipment creation failed, initiating rollback:', error);
            this.logError(`addEquip: Equipment creation failed, initiating rollback`, error);
            await this.rollbackEquipment();
            throw error;
        }
    }

    /**
     * Rollback equipment records if receipt processing fails after equipment creation
     * Uses MMS240MI.Del to remove orphaned equipment records
     */
    async rollbackEquipment() {
        if (!this.createdEquipment || this.createdEquipment.length === 0) {
            console.log('[ROLLBACK] No equipment records to rollback');
            this.logDebug('rollbackEquipment: No equipment records to rollback');
            return;
        }
        
        console.log(`[ROLLBACK] Rolling back ${this.createdEquipment.length} equipment records:`, this.createdEquipment);
        this.logWarning(`rollbackEquipment: Rolling back ${this.createdEquipment.length} equipment records`);
        
        // Use Promise.allSettled to continue rollback even if some deletions fail
        const rollbackPromises = this.createdEquipment.map(async (equip, index) => {
            try {
                const deleteRequest = new MIRequest();
                deleteRequest.program = 'MMS240MI';   // Equipment API
                deleteRequest.transaction = 'Del';    // Delete transaction
                deleteRequest.maxReturnedRecords = 1;
                deleteRequest.record = {
                    ITNO: equip.ITNO,  // Item Number
                    SERN: equip.SERN   // Serial Number (equivalent to BANO)
                };
                
                console.log(`[ROLLBACK-${index + 1}] Deleting equipment for serial: ${equip.SERN}`);
                this.logMIRequest(deleteRequest.program, deleteRequest.transaction, deleteRequest.record);
                
                const result = await this.mi.executeRequest(deleteRequest);
                this.logMIResponse(deleteRequest.program, deleteRequest.transaction, result, true);
                
                console.log(`[ROLLBACK-${index + 1}] ✓ Successfully deleted equipment for serial: ${equip.SERN}`);
                this.logDebug(`rollbackEquipment: Successfully deleted equipment record for serial ${equip.SERN}`);
            } catch (rollbackError) {
                // Log rollback failure but continue with other deletions
                console.error(`[ROLLBACK-${index + 1}] ✗ Failed to delete equipment for serial: ${equip.SERN}`, rollbackError);
                this.logMIResponse('MMS240MI', 'Del', rollbackError, false);
                this.logError(`rollbackEquipment: Failed to delete equipment for serial ${equip.SERN}`, rollbackError);
                // Note: Individual rollback failures are logged but don't stop the overall process
            }
        });
        
        // Wait for all rollback operations to complete (successful or failed)
        const results = await Promise.allSettled(rollbackPromises);
        
        // Log summary of rollback operations
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        if (failed > 0) {
            console.log(`[ROLLBACK-SUMMARY] Completed with ${successful} successful, ${failed} failed deletions`);
            this.logWarning(`rollbackEquipment: Completed with ${successful} successful, ${failed} failed deletions`);
        } else {
            console.log(`[ROLLBACK-SUMMARY] Successfully rolled back all ${successful} equipment records`);
            this.logInfo(`rollbackEquipment: Successfully rolled back all ${successful} equipment records`);
        }
        
        // Clear the tracking array
        this.createdEquipment = [];
    }

    /*───────────────── RECEIPT ENGINE ─────────────────*/
    async process(lines, onePackPerSerial) {
        console.log(`[RECEIPT-PROCESS] Starting with ${lines.length} line(s), onePackPerSerial: ${onePackPerSerial}`);
        console.log('[RECEIPT-LINES] Processing lines:', JSON.stringify(lines, null, 2));
        this.logDebug(`process: Starting receipt with ${lines.length} lines`);
        
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

            console.log('[WHS-HEAD] AddWhsHead payload:', JSON.stringify(head.record, null, 2));
            this.logMIRequest(head.program, head.transaction, head.record);

            const h = await this.mi.executeRequest(head);
            this.logMIResponse(head.program, head.transaction, h, true);

            // Validate header creation was successful
            if (!h || !h.item || !h.item.MSGN) {
                console.error('[WHS-HEAD-ERROR] AddWhsHead failed response:', JSON.stringify(h, null, 2));

                // Extract error message using enhanced error handling
                const errorMessage = this.extractErrorMessage(h, 'Warehouse transaction header creation');
                throw new Error(errorMessage);
            }

            // Store message number for subsequent WMS transactions
            this.MSGN = h.item.MSGN;
            console.log('[WHS-HEAD-SUCCESS] → MSGN received:', this.MSGN);

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

            console.log('[WHS-PACK] AddWhsPack (unified):', JSON.stringify(pack.record, null, 2));
            this.logMIRequest(pack.program, pack.transaction, pack.record);
            
            const packResult = await this.mi.executeRequest(pack);
            this.logMIResponse(pack.program, pack.transaction, packResult, true);
            
            // Brief delay to ensure pack creation is committed before adding lines
            await this.sleep(50);

            // Add all line items to the single pack
            console.log(`[WHS-LINES] Adding ${lines.length} line(s) to pack ${packNumber}`);
            await Promise.all(lines.map((rec, index) => {
                const line = new MIRequest();
                line.program = 'MHS850MI';
                line.transaction = 'AddWhsLine';
                line.maxReturnedRecords = 1;
                line.record = {
                    WHLO: this.WHLO,
                    MSGN: this.MSGN,
                    PACN: packNumber,    // All lines use same pack number (PUNO_PNLI)
                    QLFR: '20',
                    ITNO: this.ITNO,     // Item Number
                    RVQA: rec.RVQA,      // Received Quantity (1 for serials, full qty for others)
                    //TTYP: '25',          // Transaction Type (25 = Putaway)
                    RIDN: this.PUNO,     // Reference ID (PO Number)
                    RIDL: this.PNLI,     // Reference Line (PO Line)
                    RIDX: this.PNLS,     // Reference Suffix (PO Line Suffix)
                    OEND: this.OEND      // Flag Completed signifier
                };
                
                // Add warehouse location only for material items (non-material items don't use WHSL)
                const isNonMaterial = this.INDI === '0' && this.TPCD === '13';
                if (!isNonMaterial) {
                    line.record.WHSL = this.WHSL;  // Warehouse Location
                }
                
                // Conditionally add batch/lot/serial and expiration data
                if (rec.BANO) line.record.BANO = rec.BANO;  // Batch/Serial/Lot Number
                if (rec.EXPI) line.record.EXPI = rec.EXPI;  // Expiration Date

                console.log(`[WHS-LINE-${index + 1}] Adding line:`, JSON.stringify(line.record, null, 2));
                this.logMIRequest(line.program, line.transaction, line.record);
                
                return this.mi.executeRequest(line).then(result => {
                    this.logMIResponse(line.program, line.transaction, result, true);
                    console.log(`[WHS-LINE-${index + 1}] ✓ Line added successfully`);
                }).catch(error => {
                    this.logMIResponse(line.program, line.transaction, error, false);
                    console.error(`[WHS-LINE-${index + 1}] ✗ Line add failed:`, error);
                    throw error;
                });
            }));

            // Allow lines to settle before processing, especially important for multiple serials
            if (lines.length > 1) {
                console.log(`[WHS-LINES] Waiting for ${lines.length} lines to settle...`);
                await this.sleep(50);
            }

            // ───────────── PrcWhsTran ─────────────
            // Execute the warehouse transaction to complete the receipt
            const pr = new MIRequest();
            pr.program = 'MHS850MI';
            pr.transaction = 'PrcWhsTran';   // Process Warehouse Transaction
            pr.maxReturnedRecords = 100;
            pr.record = {
                MSGN: this.MSGN,             // Message Number from header creation
                PRFL: '*EXE'                 // Process Flag (*EXE = Execute immediately)
            };

            console.log('[WHS-PROCESS] PrcWhsTran payload:', JSON.stringify(pr.record, null, 2));
            console.log(`[WHS-PROCESS] [${new Date().toISOString()}] → Starting PrcWhsTran`);
            this.logMIRequest(pr.program, pr.transaction, pr.record);
            
            const prc = await this.mi.executeRequest(pr);
            console.log(`[WHS-PROCESS] [${new Date().toISOString()}] → Finished PrcWhsTran`);
            this.logMIResponse(pr.program, pr.transaction, prc, true);

            // Validate transaction processing was successful
            if (!prc || !prc.item) {
                const errorMessage = this.extractErrorMessage(prc, 'Transaction processing');
                console.error('[WHS-PROCESS-ERROR] PrcWhsTran failed:', errorMessage);
                throw new Error(errorMessage);
            }

            // ───────────── Final Status Validation ─────────────
            // Check actual processing status using GetWhsHead to ensure transaction completed successfully
            await this.sleep(100); // Brief delay to ensure status is updated
            
            const statusCheck = new MIRequest();
            statusCheck.program = 'MHS850MI';
            statusCheck.transaction = 'GetWhsHead';
            statusCheck.maxReturnedRecords = 1;
            statusCheck.record = {
                MSGN: this.MSGN
            };

            console.log('[WHS-STATUS] GetWhsHead status check:', JSON.stringify(statusCheck.record, null, 2));
            this.logMIRequest(statusCheck.program, statusCheck.transaction, statusCheck.record);
            
            const statusResult = await this.mi.executeRequest(statusCheck);
            this.logMIResponse(statusCheck.program, statusCheck.transaction, statusResult, true);

            if (!statusResult || !statusResult.item) {
                throw new Error('Failed to retrieve transaction status for validation');
            }

            const transactionStatus = statusResult.item.STAT;
            console.log(`[WHS-STATUS] → Transaction Status: ${transactionStatus}`);

            // Only status 90 (Processed, no errors) indicates success
            if (transactionStatus !== '90') {
                // Transaction failed - determine error level and provide specific guidance
                let errorMessage = 'Transaction processing failed.\n\n';
                let troubleshootingInfo = '';

                // Determine error level based on status code
                if (['15', '20'].includes(transactionStatus)) {
                    // Header level errors
                    troubleshootingInfo = `Header level error detected. Check MHS850 for details.\nMessage no = ${this.MSGN}`;
                } else if (['25', '30', '35', '40'].includes(transactionStatus)) {
                    // Package or line level errors
                    troubleshootingInfo = `Package/Line level error detected. Check MHS851 for details.\nMessage no = ${this.MSGN}\nPackage no = ${packNumber}`;
                } else {
                    // Other error statuses
                    troubleshootingInfo = `Processing error (Status: ${transactionStatus}). Check MHS850/MHS851 for details.\nMessage no = ${this.MSGN}`;
                }

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
                errorMessage += `Status: ${transactionStatus} (${statusDesc})\n\n${troubleshootingInfo}`;

                console.error('[WHS-STATUS-ERROR] Transaction failed with status:', transactionStatus, statusDesc);
                
                // Initiate rollback for failed transaction
                if (this.createdEquipment && this.createdEquipment.length > 0) {
                    console.log('[ROLLBACK] Transaction failed, initiating equipment rollback');
                    this.logError('Transaction failed, initiating equipment rollback', { status: transactionStatus });
                    await this.rollbackEquipment();
                }

                throw new Error(errorMessage);
            }

            console.log('[WHS-PROCESS-SUCCESS] → PrcWhsTran succeeded with status 90.');
            this.logInfo('Receipt processing completed successfully');
            
        } catch (e) {
            console.error('[RECEIPT-PROCESS-ERROR] Receipt processing failed:', e);
            this.logError('process: Receipt processing failed', e);
            throw e;
        }
    }

    /*───────────────── HELPER METHODS (Enterprise H5 Patterns) ─────────────────*/
    // Enterprise-grade alert using H5ControlUtil.H5Dialog
    alert(title, message, shouldRefresh = false) {
        this.log.Info(`Displaying alert: ${title} - ${message}`);
        
        // Enhanced message formatting for better readability
        const formattedMessage = message.replace(/\n/g, '<br>');
        const dialogContent = $(`<div style="max-width: 500px; word-wrap: break-word;"><label class="inforLabel noColon">${formattedMessage}</label></div>`);
        
        const dialogButtons = [
            {
                text: "OK",
                isDefault: true,
                width: 80,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
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
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
        } else {
            dialogContent.inforMessageDialog(dialogOptions);
        }
    }

    busy(v) {
        if (v) this.ctrl.ShowBusyIndicator();
        else this.ctrl.HideBusyIndicator();
    }

    refresh() {
        // Refresh H5 screen to show updated data
        if (this.ctrl?.PressKey) {
            this.ctrl.PressKey("F5");
        } else {
            this.log.Info('Screen refresh requested but controller not available');
        }
    }

    num(value) {
        // Convert string to number, removing non-numeric characters
        return parseFloat((value || '0').toString().replace(/[^\d.-]/g, '')) || 0;
    }

    today() {
        // Return today's date in YYYYMMDD format for M3
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

};