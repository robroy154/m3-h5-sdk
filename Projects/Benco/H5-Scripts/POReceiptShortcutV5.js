/*─────────────────────────────────────────────────────────────────────────────
    POReceiptShortcutV5.js
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

/*──────────────────────────────────────────────────────────────────────────*/
var POReceiptShortcutV5 = class {
  constructor(args) {
    // Initialize base properties following H5 SDK patterns
    this.typeName = 'POReceiptShortcutV5';
    // Event namespace for safe attach/remove lifecycle handling
    this.eventNamespace = '.poReceiptV4';
    this.dialogInstanceIdCounter = 0;

    // Use appropriate MIService version based on H5 compatibility
    this.mi = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;
    this.ctrl = args.controller; // H5 controller for UI interactions
    this.log = args.log; // H5 logging service

    // Capture user context for downstream MI calls (company/division are needed for CMS474MI)
    try {
      const userContext =
        typeof ScriptUtil.GetUserContext === 'function'
          ? ScriptUtil.GetUserContext()
          : {};
      this.userContext = userContext || {};
      this.company =
        this.userContext.CurrentCompany || this.userContext.CONO || '';
      this.division =
        this.userContext.CurrentDivision || this.userContext.DIVI || '';
    } catch (e) {
      // User context capture failed; continue with empty values
      const errorMessage = e?.message || e;
      this.log.Warning(`User context capture failed: ${errorMessage}`);
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
    this.log.Info('POReceiptShortcutV5 initialized successfully');
  }

  static Init(args) {
    // Entry point: Initialize script (supports fallbacks for < 2.0)
    try {
      const self = new POReceiptShortcutV5(args);
      self.busy(true); // Show loading indicator during processing
      // Execute main workflow with cleanup regardless of success/failure
      self.run().finally(() => self.busy(false));
    } catch (error) {
      if (args?.log) {
        args.log.Error(
          `POReceiptShortcutV5 initialization failed: ${error.message || error}`
        );
      }
      // Re-throw so H5 system knows there was an error
      throw error;
    }
  }

  get isNonMaterial() {
    return this.INDI === '0' && this.TPCD === '13';
  }

  applyCompanyContext(record) {
    if (this.company) {
      record.CONO = this.company;
    }
    return record;
  }

  applyCompanyDivisionContext(record) {
    this.applyCompanyContext(record);
    if (this.division) {
      record.DIVI = this.division;
    }
    return record;
  }

  getTransactionStatusDescription(transactionStatus) {
    const statusDescriptions = {
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
  }

  async getWhsLineFailureDetail(packNumber) {
    const request = new MIRequest();
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

    try {
      const response = await this.mi.executeRequest(request);
      let items = [];
      if (Array.isArray(response?.items)) {
        items = response.items;
      } else if (response?.item) {
        items = [response.item];
      }

      const failingLine =
        items.find((item) => item?.STAT && item.STAT !== '90') || items[0];
      if (!failingLine) {
        return '';
      }

      const detailLines = [];
      const lineMessage = failingLine.REMK || failingLine.BREM || '';

      if (lineMessage) detailLines.push(lineMessage);
      if (failingLine.MSLN) detailLines.push(`Line no: ${failingLine.MSLN}`);
      if (failingLine.ITNO) detailLines.push(`Item: ${failingLine.ITNO}`);
      if (failingLine.BANO) detailLines.push(`Lot/Serial: ${failingLine.BANO}`);

      return detailLines.join('\n');
    } catch (error) {
      this.log.Warning(
        `getWhsLineFailureDetail: Unable to read line diagnostics for message ${this.MSGN}: ${error.message || error}`
      );
      return '';
    }
  }

  _getTroubleshootingInfo(
    transactionStatus,
    packNumber,
    lineFailureDetail = ''
  ) {
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
        return `Warehouse transaction ended in status ${transactionStatus}. Check MHS850/MHS851 for details.`;
    }
  }

  _resolveDialog(dialogContent, resolve, dialogModel = null) {
    try {
      if (
        ScriptUtil.version >= 2.0 &&
        dialogModel &&
        typeof dialogModel.close === 'function'
      ) {
        dialogModel.close(true);
      } else if (dialogContent?.inforDialog) {
        dialogContent.inforDialog('close');
      }
    } catch (closeError) {
      this.log.Warning(
        `Dialog close fallback triggered: ${closeError.message || closeError}`
      );
    }
    resolve();
  }

  createScopedId(prefix) {
    this.dialogInstanceIdCounter += 1;
    return `${prefix}_${Date.now()}_${this.dialogInstanceIdCounter}`;
  }

  async copyToClipboard(text, focusElement = null) {
    const value = (text ?? '').toString();
    if (!value) {
      return false;
    }

    const canUseClipboardApi = () => {
      if (typeof document === 'undefined') {
        return false;
      }

      // Some hosted shells apply Permissions Policy that blocks clipboard-write.
      // Check policy before calling writeText to avoid runtime policy violations.
      const policy = document.permissionsPolicy || document.featurePolicy;
      if (policy && typeof policy.allowsFeature === 'function') {
        return policy.allowsFeature('clipboard-write');
      }

      // If policy API is not exposed, attempt modern API and rely on catch.
      return true;
    };

    // Modern API first
    try {
      if (
        canUseClipboardApi() &&
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(value);
        return true;
      }

      if (!canUseClipboardApi()) {
        this.log.Warning(
          'copyToClipboard: Clipboard API blocked by permissions policy, using fallback'
        );
      }
    } catch (error) {
      this.log.Warning(
        `copyToClipboard: navigator.clipboard failed: ${error.message || error}`
      );
    }

    // Fallback for embedded/legacy contexts
    let tempArea = null;
    try {
      if (typeof document === 'undefined' || !document.body) {
        return false;
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

      const copied = !!document.execCommand?.('copy');
      return copied;
    } catch (error) {
      this.log.Error(
        `copyToClipboard: fallback copy failed: ${error.message || error}`
      );
      return false;
    } finally {
      if (tempArea?.parentNode) {
        tempArea.remove();
      }
      if (focusElement && typeof focusElement.focus === 'function') {
        focusElement.focus();
      }
    }
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
      originalSerial,
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
      [this.customFieldConfig.valueField]: originalSerial,
    };

    // Note: CONO/DIVI are injected by the H5 MIService session (matrix params);
    // adding them here would duplicate them in the URL and cause a 400 Bad Request.

    return record;
  }

  // Deletes custom field record used during rollback cleanup.
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
      SQNR: this.customFieldConfig.sequenceNum,
    };

    // Note: CONO/DIVI are injected by the H5 MIService session (matrix params);
    // adding them here would duplicate them in the URL and cause a 400 Bad Request.

    try {
      await this.mi.executeRequest(deleteRequest);
    } catch (error) {
      // Ignore not-found errors during cleanup, as the record might not have been created
      if (!this.isRecordMissingError(error)) {
        // For any other error during rollback, log it but do not re-throw,
        // to allow the rest of the rollback to proceed.
        this.log.Error(
          `deleteEquipmentCustomField failed for SERN ${sern} during rollback`
        );
      }
    }
  }

  isRecordMissingError(error) {
    if (!error) return false;
    const message = (error.errorMessage || error.message || '').toLowerCase();
    // Check both .statusCode (MI response object) and .status (jQuery XHR rejection)
    const httpStatus = error.statusCode ?? error.status;
    return (
      httpStatus === 400 ||
      message.includes('no record') ||
      message.includes('not found')
    );
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
      const derivedSerial = needsDerive
        ? this.deriveBoundedSerial(trimmed, index)
        : trimmed;

      return {
        originalSerial: trimmed,
        derivedSerial,
        index,
      };
    });

    // Verify uniqueness of derived serials
    const uniqueDerived = new Set(entries.map((e) => e.derivedSerial));
    if (uniqueDerived.size !== entries.length) {
      throw new Error(
        'Hash collision: derived serials are not unique. Try again or contact support.'
      );
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
    const prefix = this.derivedSerialPrefix; // 'BSN'
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
      hash = (hash << 5) + hash + str.codePointAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Extract user-friendly error message from MI response
  extractErrorMessage(error, operation = 'operation') {
    let errorMsg = `${operation} failed`;

    if (!error) return errorMsg;

    // Get primary error message (user-friendly)
    errorMsg = this.getPrimaryErrorMessage(error, errorMsg);

    // Get technical details for troubleshooting
    const technicalDetails = this.getTechnicalDetails(error);

    return errorMsg + technicalDetails;
  }

  getPrimaryErrorMessage(error, defaultMsg) {
    if (error.errorMessage) return error.errorMessage;
    if (error.message) return error.message;
    return defaultMsg;
  }

  getTechnicalDetails(error) {
    const errorCode = error.errorCode || '';
    const errorMessage = error.errorMessage || '';
    const errorField = error.errorField || '';
    const program = error.program || '';
    const transaction = error.transaction || '';

    if (!this.hasErrorDetails(errorCode, errorMessage, errorField, program)) {
      return '';
    }

    let details = '\n\nTechnical Details:';

    if (program && transaction) {
      details += `\n• API: ${program}/${transaction}`;
    }

    details += this.formatErrorCode(errorCode, errorMessage);

    if (errorField) {
      details += `\n• Field: ${errorField}`;
    }

    return details;
  }

  hasErrorDetails(errorCode, errorMessage, errorField, program) {
    return errorCode || errorMessage || errorField || program;
  }

  formatErrorCode(errorCode, errorMessage) {
    if (errorCode && errorMessage) {
      return `\n• Error: ${errorCode}: ${errorMessage}`;
    }
    if (errorMessage) {
      return `\n• Error: ${errorMessage}`;
    }
    if (errorCode) {
      return `\n• Error Code: ${errorCode}`;
    }
    return '';
  }

  /*───────────────── PROGRESS UI (Enterprise Pattern) ─────────────────*/
  initProgress(steps) {
    this.steps = steps; // array of labels
    this.idx = 0;

    // Create progress dialog content
    const progressHtml = `
            <div style="padding: 20px;">
                <div class="po-receipt-progress-wrap" style="width: 100%; height: 18px; background: #ddd; border-radius: 4px; overflow: hidden;">
                    <div class="po-receipt-progress-fill" style="height: 100%; width: 0; background: #0072C6; transition: width .25s;"></div>
                </div>
                <div class="po-receipt-progress-msg" style="text-align: center; margin-top: 8px; font-size: 13px;">Starting…</div>
            </div>
        `;

    this.progressContent = $(progressHtml);

    const dialogOptions = {
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
      this.progressDialog = H5ControlUtil.H5Dialog.CreateDialogElement(
        this.progressContent[0],
        dialogOptions
      );
    } else {
      this.progressDialog =
        this.progressContent.inforMessageDialog(dialogOptions);
    }

    this.updateProgress('Starting…');
  }

  addProgressStep(label) {
    this.steps.push(label);
  }

  updateProgress(msg) {
    const pct = Math.round((this.idx / this.steps.length) * 100);
    this.progressContent
      ?.find('.po-receipt-progress-fill')
      .css('width', pct + '%');
    if (msg) this.progressContent?.find('.po-receipt-progress-msg').text(msg);
  }

  async advance(label) {
    this.updateProgress(label + ' ✓');
    this.idx++;
    await this.sleep(60); // tiny delay so UI repaints
  }

  progressDone() {
    this.progressContent
      ?.find('.po-receipt-progress-fill')
      .css('width', '100%');
    this.progressContent?.find('.po-receipt-progress-msg').text('Done!');
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
        if (
          ScriptUtil.version >= 2.0 &&
          typeof this.progressDialog.close === 'function'
        ) {
          this.progressDialog.close(true);
        } else {
          // For pre‑2.0 dialogs use the inforDialog API on the element
          try {
            $(this.progressDialog).inforDialog('close');
          } catch (e) {
            this.log.Warning(
              `closeProgress: primary dialog close failed, using content fallback: ${e?.message || e}`
            );
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
      this.log.Warning(
        `closeProgress: error closing progress dialog: ${err.message}`
      );
    }

    // Remove the content element from the DOM
    if (this.progressContent) {
      this.progressContent.remove();
      this.progressContent = null;
    }
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /*───────────────── MAIN FLOW ─────────────────*/
  async run() {
    try {
      // Initialize progress tracking with predefined steps
      this.initProgress([
        'Validate',
        'Get PO line',
        'Lookups',
        'Warnings',
        'Process',
      ]);

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
      if (this.INDI === '2') {
        // Serial controlled items
        const userSerials = await this.promptSerials(); // User interaction - NO busy

        // Prepare derived serial/BANO values that comply with MMS240 limits
        const serialEntries = this.prepareSerialEntries(userSerials);

        // Add additional progress steps for serial processing
        this.addProgressStep('Adding equipment records');
        this.addProgressStep('Queueing transactions');
        this.addProgressStep('Finalizing message');

        await this.checkSer(serialEntries); // Validate derived serials don't already exist
        await this.addEquip(serialEntries); // Create equipment records in M3
        await this.advance('Adding equipment records');

        try {
          await this.sleep(50);
          // Create single pack with multiple lines (one per serial)
          const serialLines = serialEntries.map((entry) => ({
            BANO: entry.derivedSerial,
            RVQA: '1',
            EXPI: null,
          }));
          await this.process(serialLines);
          await this.advance('Queueing transactions');

          // Clear equipment tracking since process succeeded
          this.createdEquipment = [];
        } catch (processError) {
          // Receipt processing failed - rollback equipment records to maintain data consistency
          this.log.Error(
            'Receipt processing failed after equipment creation, initiating rollback'
          );
          await this.rollbackEquipment();
          throw processError;
        }

        await this.advance('Finalizing message');
      } else if (this.INDI === '3') {
        // Lot controlled items
        const { lot, expi } = await this.promptLot(); // User interaction - NO busy
        await this.checkLot(lot); // Validate lot doesn't already exist
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
      this.showErrorDialog(
        e.message || 'An unexpected error occurred during processing',
        e
      );
    }
  }

  /*───────────────── SUCCESS/ERROR DIALOGS (Original Pattern) ─────────────────*/
  showSuccessDialog() {
    this.alert('Success', 'PO line received!', true); // Refresh screen on success
  }

  showErrorDialog(message, error = null) {
    // Enhanced error dialog with MI error details
    let displayMessage =
      message || 'An unexpected error occurred during processing';

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
    this.PUNO = ScriptUtil.GetFieldValue('WWPUNO'); // Purchase Order Number
    this.SUNO = ScriptUtil.GetFieldValue('WWSUNO'); // Supplier Number
    this.WHLO = ScriptUtil.GetFieldValue('WWWHLO'); // Warehouse
    this.PNLI = ScriptUtil.GetFieldValue('PNLI'); // PO Line Number
    this.PNLS = ScriptUtil.GetFieldValue('PNLS'); // PO Line Suffix
    this.RVQA = this.ctrl.GetValue('RVQA'); // Received Quantity
    this.WHSL = ScriptUtil.GetFieldValue('WHSL'); // Location
    this.ITNO = ScriptUtil.GetFieldValue('ITNO'); // Item Number
    this.OEND = ScriptUtil.GetFieldValue('OEND'); // Flag Completed

    // Validate mandatory fields are populated
    // Note: WHSL validation is deferred to lookups() after item type determination
    const missingFields = [
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

    try {
      const response = await this.mi.executeRequest(request);

      if (!response?.item) {
        const errorMessage = this.extractErrorMessage(
          response,
          'PO line retrieval'
        );
        throw new Error(errorMessage);
      }

      const poLineData = {
        PUPR: response.item.PUPR,
        RORC: response.item.RORC,
        RORN: response.item.RORN,
        RORL: response.item.RORL,
        ITDS: response.item.ITDS,
        GETY: response.item.GETY,
        PUUN: response.item.PUUN,
      };

      Object.assign(this, poLineData);
    } catch (error) {
      this.log.Error(
        `Failed to retrieve PO line data: ${error.message || error}`
      );
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
        const errorMessage = this.extractErrorMessage(
          header,
          'PO header retrieval'
        );
        throw new Error(errorMessage);
      }
      // Store key header fields for downstream processing
      Object.assign(this, {
        PUDT: header.item.PUDT, // Order Date
        CUCD: header.item.CUCD, // Currency Code
        FACI: header.item.FACI, // Facility
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
        const errorMessage = this.extractErrorMessage(
          itm,
          'Item details retrieval'
        );
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
        throw new Error(
          'Warehouse location (WHSL) is required for material items'
        );
      }

      this.log.Info(
        `Item validation completed - INDI: ${this.INDI}, TPCD: ${this.TPCD}, isNonMaterial: ${this.isNonMaterial}`
      );

      /* remaining qty - Get outstanding quantity on PO line */
      const remRequest = new MIRequest();
      remRequest.program = 'PPS001MI';
      remRequest.transaction = 'GetBasicData2';
      remRequest.record = { PUNO: this.PUNO, PNLI: this.PNLI, PNLS: this.PNLS };
      remRequest.maxReturnedRecords = 1;
      remRequest.outputFields = ['RSTQ'];

      const rem = await this.mi.executeRequest(remRequest);

      if (!rem?.item) {
        const errorMessage = this.extractErrorMessage(
          rem,
          'Remaining quantity retrieval'
        );
        throw new Error(errorMessage);
      }
      this.RMQA = rem.item.RSTQ; // Remaining Quantity

      /* Order initiated COs (optional) - Only for COs */
      if (this.RORC === '3' && this.RORN) {
        // RORC=3 indicates link to customer order
        const customerRequest = new MIRequest();
        customerRequest.program = 'OIS100MI';
        customerRequest.transaction = 'GetOrderHead';
        customerRequest.record = { ORNO: this.RORN }; // Related Order Number
        customerRequest.maxReturnedRecords = 1;
        customerRequest.outputFields = ['CUNO'];

        const c = await this.mi.executeRequest(customerRequest);

        if (!c?.item) {
          const errorMessage = this.extractErrorMessage(
            c,
            'Customer order details retrieval'
          );
          throw new Error(errorMessage);
        }
        this.CUNO = c.item.CUNO; // Customer Number for equipment records
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
      let dialogModel = null;
      this.log.Info(`Displaying warning dialog: ${msg}`);

      const dialogContent = $(
        `<div><label class='inforLabel noColon'>${msg}</label></div>`
      );

      // Helper to close dialog and resolve promise
      const handleProceed = () => {
        closedByButton = true;
        this._resolveDialog(dialogContent, resolve, dialogModel);
      };

      // Add Enter key handling for warning dialog
      dialogContent.on(`keydown${this.eventNamespace}`, function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Trigger Proceed button (default action)
          const proceedButton = dialogContent
            .closest('.ui-dialog-content')
            .siblings('.ui-dialog-buttonpane')
            .find('button')
            .filter(function () {
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
          text: 'Proceed',
          isDefault: true,
          width: 80,
          click: function (event, model) {
            closedByButton = true;
            if (ScriptUtil.version >= 2.0) {
              model.close(true);
            } else {
              $(this).inforDialog('close');
            }
            resolve();
          },
        },
        {
          text: 'Cancel',
          width: 80,
          click: function (event, model) {
            closedByButton = true;
            if (ScriptUtil.version >= 2.0) {
              model.close(true);
            } else {
              $(this).inforDialog('close');
            }
            reject(new Error('Operation cancelled by user'));
          },
        },
      ];

      const dialogOptions = {
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
        }.bind(this),
        buttons: dialogButtons,
      };

      // Show dialog with proper version handling (H5SampleCustomDialog pattern)
      if (ScriptUtil.version >= 2.0) {
        dialogModel = H5ControlUtil.H5Dialog.CreateDialogElement(
          dialogContent[0],
          dialogOptions
        );
      } else {
        dialogContent.inforMessageDialog(dialogOptions);
      }
    });
  }

  promptConfirm() {
    return new Promise((resolve, reject) => {
      let closedByButton = false;
      let dialogModel = null;

      const dialogContent = $(
        `<div><label class='inforLabel noColon'>Receive ${this.RVQA} unit(s)?</label></div>`
      );

      // Helper to close dialog and resolve promise
      const handleConfirm = () => {
        closedByButton = true;
        this._resolveDialog(dialogContent, resolve, dialogModel);
      };

      // Add Enter key handling for confirm dialog
      dialogContent.on(`keydown${this.eventNamespace}`, function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Trigger Confirm button
          const confirmButton = dialogContent
            .closest('.ui-dialog-content')
            .siblings('.ui-dialog-buttonpane')
            .find('button')
            .filter(function () {
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
          text: 'Confirm',
          isDefault: true,
          width: 80,
          click: function (event, model) {
            closedByButton = true;
            if (ScriptUtil.version >= 2.0) {
              model.close(true);
            } else {
              $(this).inforDialog('close');
            }
            resolve();
          },
        },
        {
          text: 'Cancel',
          width: 80,
          click: function (event, model) {
            closedByButton = true;
            if (ScriptUtil.version >= 2.0) {
              model.close(true);
            } else {
              $(this).inforDialog('close');
            }
            reject(new Error('Receipt cancelled by user'));
          },
        },
      ];

      const dialogOptions = {
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
        }.bind(this),
        buttons: dialogButtons,
      };

      if (ScriptUtil.version >= 2.0) {
        dialogModel = H5ControlUtil.H5Dialog.CreateDialogElement(
          dialogContent[0],
          dialogOptions
        );
      } else {
        dialogContent.inforMessageDialog(dialogOptions);
      }
    });
  }

  promptSerials() {
    return new Promise((resolve, reject) => {
      let closedByButton = false;
      let dialogModel = null;
      const qty = this.num(this.RVQA);
      const dialogId = this.createScopedId('serialDlg');
      const poNumberDisplayId = `poNumberDisplay_${dialogId}`;
      const copyPoNumberId = `copyPoNumber_${dialogId}`;
      const generateSerialsId = `generateSerials_${dialogId}`;
      const serialInputsContainerId = `serialInputsContainer_${dialogId}`;
      const serialInputId = (index) => `serial_${dialogId}_${index}`;

      // Safety check: Prevent excessive quantity that could crash browser
      const MAX_SERIALS = 25; // Reasonable limit for manual entry
      if (qty > MAX_SERIALS) {
        this.log.Error(
          `Serial quantity ${qty} exceeds maximum allowed ${MAX_SERIALS}`
        );
        reject(
          new Error(
            `Cannot process ${qty} serials. Maximum allowed is ${MAX_SERIALS}. Please use batch import for large quantities.`
          )
        );
        return;
      }

      let formHtml = '<div style="padding: 15px;">';

      // Add PO number display with copy functionality (fixed at top, outside scroll area)
      formHtml += `<div style="margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;">
                <label class="inforLabel" style="font-weight: bold; font-size: 11px;">PO:</label>
                <div style="display: flex; align-items: center; margin-top: 2px;">
                    <input id="${poNumberDisplayId}" type="text" readonly value="${this.PUNO}" 
                           style="flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;">
                    <button type="button" id="${copyPoNumberId}" style="margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;" title="Copy PO number">📋</button>
                    <button type="button" id="${generateSerialsId}" style="margin-left: 6px; padding: 3px 6px; background: #2C8C3E; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;" title="Generate serials">🔢</button>
                </div>
                <div style="margin-top: 4px; font-size: 11px; color: #666;">
                    <strong>Quantity:</strong> ${qty} serial${qty === 1 ? '' : 's'} required
                </div>
            </div>`;

      // Scrollable container for serial inputs - prevents off-screen bleeding
      // Max height ensures dialog fits on screen while allowing smooth scrolling
      const maxSerialLength = this.maxSerialInputLength || 20;
      formHtml += `<div id="${serialInputsContainerId}" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; padding-right: 5px;"><form>`;

      for (let i = 0; i < qty; i++) {
        formHtml += `<div style="margin-bottom: 10px;">
                    <label class="inforLabel" for="${serialInputId(i)}">Serial ${i + 1}:</label>
                    <input id="${serialInputId(i)}" type="text" class="inforTextBox" maxlength="${maxSerialLength}" 
                           placeholder="Enter serial number (max ${maxSerialLength} chars)" style="width: 100%; text-transform: uppercase;" 
                           ${i === 0 ? 'autofocus' : ''}>
                </div>`;
      }
      formHtml += '</form></div></div>';

      const dialogContent = $(formHtml);

      // Method to show validation errors within the dialog context
      // Helper to remove error div after fade out
      const removeErrorDiv = (errorDiv) => {
        errorDiv.remove();
      };

      // Helper to fade out error message
      const fadeOutError = (errorDiv) => {
        errorDiv.fadeOut(() => removeErrorDiv(errorDiv));
      };

      // Error message appears above the scrollable area for visibility
      dialogContent.showValidationError = function (message) {
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
        dialogContent.find(`#${serialInputsContainerId}`).before(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => fadeOutError(errorDiv), 5000);
      };

      // Bind the validation error method to the correct context
      const showValidationError = dialogContent.showValidationError;

      // Add copy functionality for PO number
      dialogContent
        .find(`#${copyPoNumberId}`)
        .on(`click${this.eventNamespace}`, async (e) => {
          const poNumber = dialogContent.find(`#${poNumberDisplayId}`).val();
          const btn = $(e.currentTarget);
          const poInput = dialogContent.find(`#${poNumberDisplayId}`)[0];
          const originalText = btn.text();

          const copied = await this.copyToClipboard(poNumber, poInput);
          if (copied) {
            btn.text('✓ Copied!').css('background', '#28a745');
            setTimeout(
              () => btn.text(originalText).css('background', '#0072C6'),
              1500
            );
          } else {
            btn.text('✗ Failed').css('background', '#dc3545');
            setTimeout(
              () => btn.text(originalText).css('background', '#0072C6'),
              1800
            );
          }
        });

      // Helper function to remove success message
      const fadeOutAndRemove = (element) => {
        element.fadeOut(300, function () {
          $(this).remove();
        });
      };

      // Helper function to reset button style
      const resetGenerateButtonStyle = (btn, originalText) => {
        btn.text(originalText).css('background', '#2C8C3E');
      };

      // Add auto-generate functionality for sequential serials
      dialogContent
        .find(`#${generateSerialsId}`)
        .on(`click${this.eventNamespace}`, function () {
          const poNumber = dialogContent.find(`#${poNumberDisplayId}`).val();

          // Clear any existing error messages
          dialogContent.find('.validation-error').remove();

          // Populate each input field with PO-N format
          for (let i = 0; i < qty; i++) {
            const serialValue = `${poNumber}-${i + 1}`;
            const inputField = dialogContent.find(`#${serialInputId(i)}`);
            inputField.val(serialValue);
            // Clear any error styling
            inputField.css('border-color', '');
            inputField.css('background-color', '');
          }

          // Show success feedback
          const successMsg = $(
            '<div class="validation-success" style="padding: 6px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 3px; margin-bottom: 10px; font-size: 12px;">✓ Generated ' +
              qty +
              ' sequential serial' +
              (qty === 1 ? '' : 's') +
              ': ' +
              poNumber +
              '-1 through ' +
              poNumber +
              '-' +
              qty +
              '</div>'
          );
          dialogContent.find(`#${serialInputsContainerId}`).before(successMsg);

          // Auto-remove success message after 3 seconds
          setTimeout(() => fadeOutAndRemove(successMsg), 3000);

          // Visual feedback on button
          const btn = $(this);
          const originalText = btn.text();
          btn.text('✓ Done!').css('background', '#28a745');
          setTimeout(() => resetGenerateButtonStyle(btn, originalText), 1500);

          // Focus on the first input for immediate review/editing
          dialogContent.find(`#${serialInputId(0)}`).focus();
        });

      // Add input validation and uppercase conversion
      dialogContent
        .find('input')
        .on(`input${this.eventNamespace}`, function () {
          this.value = this.value.toUpperCase();
          $(this).css('border', ''); // Clear any error styling
        });

      // Enable right-click context menu for all input fields (for paste functionality)
      dialogContent
        .find('input')
        .on(`contextmenu${this.eventNamespace}`, function (e) {
          e.stopPropagation(); // Allow default right-click menu on inputs
        });

      // Helper to validate and collect serials from input fields
      const validateAndCollectSerials = () => {
        const serials = [];
        let invalid = [];

        // Validate all serial inputs - check format and presence first
        for (let i = 0; i < qty; i++) {
          const $field = dialogContent.find(`#${serialInputId(i)}`);
          const val = $field.val().trim();

          if (!val) {
            $field.css('border', '2px solid red');
            invalid.push(`Serial ${i + 1} (blank)`);
          } else if (val.length > maxSerialLength) {
            $field.css('border', '2px solid red');
            invalid.push(`Serial ${i + 1} (too long)`);
          } else if (/^[A-Z0-9-]+$/.test(val)) {
            serials.push(val);
          } else {
            $field.css('border', '2px solid red');
            invalid.push(`Serial ${i + 1} (invalid characters)`);
          }
        }

        // Show validation errors if any invalid entries found
        if (invalid.length) {
          showValidationError(
            `Invalid or blank input in: ${invalid.join(', ')}\nSerials must be alphanumeric (A-Z, 0-9, hyphen allowed), max ${maxSerialLength} characters.`
          );
          return null;
        }

        // Check for duplicates only after all serials are validated
        if (new Set(serials).size !== qty) {
          const seen = new Set();
          const duplicates = [];
          serials.forEach((serial, idx) => {
            if (seen.has(serial)) {
              dialogContent
                .find(`#${serialInputId(idx)}`)
                .css('border', '2px solid orange');
              if (!duplicates.includes(serial)) duplicates.push(serial);
            } else {
              seen.add(serial);
            }
          });
          showValidationError(
            `Duplicates detected: ${duplicates.join(', ')}\nEnsure each serial is unique.`
          );
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
          if (ScriptUtil.version >= 2.0) {
            model.close(true);
          } else {
            $(dialogContent).inforDialog('close');
          }
        } else if (
          ScriptUtil.version >= 2.0 &&
          dialogModel &&
          typeof dialogModel.close === 'function'
        ) {
          dialogModel.close(true);
        } else {
          $(dialogContent).inforDialog('close');
        }
        resolve(serials);
      };

      // Add Enter key handling for serial inputs
      dialogContent
        .find(`input[id^="serial_${dialogId}_"]`)
        .on(`keydown${this.eventNamespace}`, function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            const currentIndex = Number.parseInt(
              this.id.replace(`serial_${dialogId}_`, '')
            );

            if (qty > 1 && currentIndex < qty - 1) {
              // Multiple serials: move to next input and scroll it into view
              const nextInput = dialogContent.find(
                `#${serialInputId(currentIndex + 1)}`
              );
              nextInput.focus();
              // Ensure the next input is visible in the scrollable container
              const container = dialogContent.find(
                `#${serialInputsContainerId}`
              );
              const nextInputOffset = nextInput.position().top;
              if (nextInputOffset > container.height() - 60) {
                container.scrollTop(container.scrollTop() + 60);
              }
            } else {
              // Last serial or single serial: trigger Save button
              const saveButton = dialogContent
                .closest('.ui-dialog-content')
                .siblings('.ui-dialog-buttonpane')
                .find('button')
                .filter(function () {
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
            } else {
              $(this).inforDialog('close');
            }
            reject(new Error('Serial input cancelled by user'));
          },
        },
      ];

      const dialogOptions = {
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
        }.bind(this),
        buttons: dialogButtons,
      };

      // Show dialog with proper version handling (H5SampleCustomDialog pattern)
      if (ScriptUtil.version >= 2.0) {
        dialogModel = H5ControlUtil.H5Dialog.CreateDialogElement(
          dialogContent[0],
          dialogOptions
        );
      } else {
        dialogContent.inforMessageDialog(dialogOptions);
      }
    });
  }

  promptLot() {
    return new Promise((resolve, reject) => {
      let closedByButton = false;
      const dialogId = this.createScopedId('lotDlg');
      const poNumberDisplayId = `poNumberDisplay_${dialogId}`;
      const copyPoNumberId = `copyPoNumber_${dialogId}`;
      const lotNumberId = `lotNumber_${dialogId}`;
      const expirationDateId = `expirationDate_${dialogId}`;
      const expirationDateRequired = this.EXPD === '1';

      // Create form content for lot number and optional expiration date
      let formHtml = '<div style="padding: 15px;"><form>';

      // Add PO number display with copy functionality (smaller version)
      formHtml += `<div style="margin-bottom: 10px; padding: 6px; background: #f5f5f5; border-radius: 3px; font-size: 12px;">
                <label class="inforLabel" style="font-weight: bold; font-size: 11px;">PO:</label>
                <div style="display: flex; align-items: center; margin-top: 2px;">
                    <input id="${poNumberDisplayId}" type="text" readonly value="${this.PUNO}" 
                           style="flex: 1; background: white; border: 1px solid #ccc; padding: 3px 5px; font-family: monospace; font-size: 12px;">
                    <button type="button" id="${copyPoNumberId}" style="margin-left: 6px; padding: 3px 6px; background: #0072C6; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 11px;">📋</button>
                </div>
            </div>`;

      formHtml += `<div style="margin-bottom: 15px;">
                <label class="inforLabel" for="${lotNumberId}">Lot Number:</label>
                <input id="${lotNumberId}" type="text" class="inforTextBox" maxlength="20" 
                       placeholder="Enter lot number" style="width: 100%; text-transform: uppercase;" autofocus>
            </div>`;

      if (expirationDateRequired) {
        formHtml += `<div style="margin-bottom: 15px;">
                    <label class="inforLabel" for="${expirationDateId}">Expiration Date:</label>
                    <input id="${expirationDateId}" type="date" class="inforTextBox" 
                           style="width: 100%;" title="Date cannot be today's date.">
                    <small style="color: #666;">Date cannot be today's date.</small>
                </div>`;
      }

      formHtml += '</form></div>';

      const dialogContent = $(formHtml);

      // Method to show validation errors within the dialog context
      dialogContent.showValidationError = function (message) {
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
        const removeErrorDiv = () => errorDiv.remove();
        setTimeout(() => errorDiv.fadeOut(removeErrorDiv), 5000);
      };

      // Bind the validation error method to the correct context
      const showValidationError = dialogContent.showValidationError;

      // Add copy functionality for PO number
      dialogContent
        .find(`#${copyPoNumberId}`)
        .on(`click${this.eventNamespace}`, async (e) => {
          const poNumber = dialogContent.find(`#${poNumberDisplayId}`).val();
          const btn = $(e.currentTarget);
          const poInput = dialogContent.find(`#${poNumberDisplayId}`)[0];
          const originalText = btn.text();

          const copied = await this.copyToClipboard(poNumber, poInput);
          if (copied) {
            btn.text('✓ Copied!').css('background', '#28a745');
            setTimeout(
              () => btn.text(originalText).css('background', '#0072C6'),
              1500
            );
          } else {
            btn.text('✗ Failed').css('background', '#dc3545');
            setTimeout(
              () => btn.text(originalText).css('background', '#0072C6'),
              1800
            );
          }
        });

      // Add input validation and uppercase conversion for lot number
      dialogContent
        .find(`#${lotNumberId}`)
        .on(`input${this.eventNamespace}`, function () {
          this.value = this.value.toUpperCase();
          $(this).css('border', ''); // Clear any error styling
        });

      // Enable right-click context menu for all input fields (for paste functionality)
      dialogContent
        .find('input')
        .on(`contextmenu${this.eventNamespace}`, function (e) {
          e.stopPropagation(); // Allow default right-click menu on inputs
        });

      const validateLotInputs = () => {
        const $lot = dialogContent.find(`#${lotNumberId}`);
        const lot = $lot.val().trim();
        const expi = expirationDateRequired
          ? dialogContent.find(`#${expirationDateId}`).val() || null
          : null;
        const errors = [];

        this.validateLotNumber(lot, $lot, errors);
        this.validateExpirationDate(expi, errors);

        if (errors.length) {
          showValidationError(errors.join('\n'));
          return null;
        }

        return { lot, expi };
      };

      const handleLotFieldKeyDown = (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const currentFieldId = e.currentTarget?.id;
        if (currentFieldId === lotNumberId && expirationDateRequired) {
          dialogContent.find(`#${expirationDateId}`).focus();
          return;
        }
        this.handleLotSaveAction(
          dialogContent,
          lotNumberId,
          expirationDateRequired,
          validateLotInputs
        );
      };

      // Add Enter key handling for lot inputs
      dialogContent
        .find(`#${lotNumberId}, #${expirationDateId}`)
        .on(`keydown${this.eventNamespace}`, handleLotFieldKeyDown);

      const dialogButtons = [
        {
          text: 'Save',
          isDefault: true,
          width: 80,
          click: function (event, model) {
            const lotData = validateLotInputs();
            if (!lotData) {
              return;
            }

            // Close dialog and return lot data
            closedByButton = true;
            if (ScriptUtil.version >= 2.0) {
              model.close(true);
            } else {
              $(this).inforDialog('close');
            }
            resolve(lotData);
          }.bind(this),
        },
        {
          text: 'Cancel',
          width: 80,
          click: function (event, model) {
            closedByButton = true;
            if (ScriptUtil.version >= 2.0) {
              model.close(true);
            } else {
              $(this).inforDialog('close');
            }
            reject(new Error('Lot input cancelled by user'));
          },
        },
      ];

      const dialogOptions = {
        title: '📦 Enter Lot Number',
        dialogType: 'General',
        modal: true,
        width: 450,
        minHeight: this.EXPD === '1' ? 280 : 220, // Dynamic height based on expiration requirement
        icon: 'info',
        closeOnEscape: true,
        close: function () {
          dialogContent.off(this.eventNamespace);
          dialogContent.find('*').off(this.eventNamespace);
          dialogContent.remove();
          if (!closedByButton) {
            reject(new Error('Lot input cancelled by user')); // Handle escape/X button same as Cancel
          }
        }.bind(this),
        buttons: dialogButtons,
      };

      // Show dialog with proper version handling (H5SampleCustomDialog pattern)
      if (ScriptUtil.version >= 2.0) {
        H5ControlUtil.H5Dialog.CreateDialogElement(
          dialogContent[0],
          dialogOptions
        );
      } else {
        dialogContent.inforMessageDialog(dialogOptions);
      }
    });
  }

  /*───────────────── VALIDATION / EQUIPMENT ─────────────────*/
  async checkSer(entries) {
    // Validate each derived serial number doesn't already exist in M3
    return Promise.all(
      entries.map((entry) => {
        const derivedSerial = entry.derivedSerial;
        const rq = Object.assign(new MIRequest(), {
          program: 'MMS235MI', // Item Lot API
          transaction: 'GetItmLot',
          record: { ITNO: this.ITNO, BANO: derivedSerial }, // BANO = Batch/Serial Number (derived)
          maxReturnedRecords: 1,
        });

        //consider validating custom field as well

        return this.mi.executeRequest(rq).then(
          (r) => {
            // Check both ITNO and BANO match - if found, serial already exists
            if (
              r?.item?.ITNO === this.ITNO &&
              r?.item?.BANO === derivedSerial
            ) {
              const error = `Derived serial ${derivedSerial} for item ${this.ITNO} already exists (original: ${entry.originalSerial}).`;
              this.log.Warning(`checkSer: ${error}`);
              throw new Error(error);
            }
          },
          (e) => {
            // Status 400 = Record not found (expected for new serials)
            if (e.statusCode === 400) {
              return;
            }
            this.log.Error(
              `checkSer: Error checking derived serial ${derivedSerial}: ${e.message || e}`
            );
            throw e;
          }
        );
      })
    );
  }

  async checkLot(lot) {
    // Similar validation for lot numbers
    const rq = Object.assign(new MIRequest(), {
      program: 'MMS235MI',
      transaction: 'GetItmLot',
      record: { ITNO: this.ITNO, BANO: lot },
      maxReturnedRecords: 1,
    });
    return this.mi.executeRequest(rq).then(
      (r) => {
        // Check both ITNO and BANO match - if found, lot already exists
        if (r?.item?.ITNO === this.ITNO && r?.item?.BANO === lot) {
          const error = `Lot ${lot} for item ${this.ITNO} already exists.`;
          this.log.Warning(`checkLot: ${error}`);
          throw new Error(error);
        }
      },
      (e) => {
        if (e.statusCode === 400) {
          return;
        }
        this.log.Error(
          `checkLot: Error checking lot ${lot}: ${e.message || e}`
        );
        throw e;
      }
    );
  }

  validateLotNumber(lot, $lot, errors) {
    if (!lot) {
      $lot.css('border', '2px solid red');
      errors.push('Lot number is required');
    } else if (!/^[A-Z0-9-]+$/.test(lot)) {
      $lot.css('border', '2px solid red');
      errors.push(
        'Lot number must contain only A-Z, 0-9, or hyphen'
      );
    } else {
      $lot.css('border', '');
    }
  }

  validateExpirationDate(expi, errors) {
    if (this.EXPD === '1') {
      if (!expi) {
        errors.push('Expiration date is required');
        return;
      }
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      if (expi <= today) {
        errors.push('Expiration date cannot be today or in the past');
      }
    }
  }

  handleLotSaveAction(dialogContent) {
    // Trigger Save button click (matches serial dialog Enter-key pattern)
    const saveButton = dialogContent
      .closest('.ui-dialog-content')
      .siblings('.ui-dialog-buttonpane')
      .find('button')
      .filter(function () {
        return $(this).text().trim() === 'Save';
      });
    if (saveButton.length > 0) {
      saveButton.click();
    }
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

        const result = await this.mi.executeRequest(rq);

        if (!result?.item) {
          const errorMsg = this.extractErrorMessage(
            result,
            `Equipment creation for derived serial ${derivedSerial}`
          );
          throw new Error(errorMsg);
        }

        const eqNumber = result.item.EQNO || result.item.EQNR || null;
        const createdContext = {
          ITNO: this.ITNO,
          SERN: derivedSerial,
          EQNO: eqNumber,
          originalSerial: entry.originalSerial,
        };

        // Track successful equipment creation for potential rollback
        this.createdEquipment.push(createdContext);

        // Persist the original (long) serial in CMS474 custom fields
        if (this.customFieldConfig?.enabled) {
          try {
            await this.storeFullSerialCustomField(createdContext);
          } catch (cfError) {
            this.log.Error(
              `addEquip: Failed to persist long serial for ${derivedSerial}: ${cfError.message || cfError}`
            );
            throw cfError;
          }
        }
      }
    } catch (error) {
      // If any equipment creation fails, rollback the ones that succeeded
      this.log.Error(
        `addEquip: Equipment creation failed, initiating rollback: ${error.message || error}`
      );
      await this.rollbackEquipment();
      throw error;
    }
  }

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
  async rollbackEquipment() {
    if (!this.createdEquipment || this.createdEquipment.length === 0) {
      return;
    }

    this.log.Warning(
      `rollbackEquipment: Rolling back ${this.createdEquipment.length} equipment records`
    );

    // Use Promise.allSettled to continue rollback even if some deletions fail
    const rollbackPromises = this.createdEquipment.map(async (equip) => {
      try {
        if (this.customFieldConfig?.enabled) {
          try {
            await this.deleteEquipmentCustomField(equip);
          } catch (cfDeleteError) {
            this.log.Error(
              `rollbackEquipment: Failed to delete CMS474 record for EQNO ${equip.EQNO || 'N/A'}: ${cfDeleteError.message || cfDeleteError}`
            );
          }
        }

        const deleteRequest = new MIRequest();
        deleteRequest.program = 'MMS240MI'; // Equipment API
        deleteRequest.transaction = 'Del'; // Delete transaction
        deleteRequest.maxReturnedRecords = 1;
        deleteRequest.record = {
          ITNO: equip.ITNO, // Item Number
          SERN: equip.SERN, // Serial Number (equivalent to BANO)
        };

        await this.mi.executeRequest(deleteRequest);
      } catch (rollbackError) {
        // Log rollback failure but continue with other deletions
        this.log.Error(
          `rollbackEquipment: Failed to delete equipment for serial ${equip.SERN}: ${rollbackError.message || rollbackError}`
        );
        // Note: Individual rollback failures are logged but don't stop the overall process
      }
    });

    // Wait for all rollback operations to complete (successful or failed)
    const results = await Promise.allSettled(rollbackPromises);

    // Log summary if any failures
    const failed = results.filter((r) => r.status === 'rejected').length;
    if (failed > 0) {
      const successful = results.length - failed;
      this.log.Warning(
        `rollbackEquipment: Completed with ${successful} successful, ${failed} failed deletions`
      );
    }

    // Clear the tracking array
    this.createdEquipment = [];
  }

  /*───────────────── RECEIPT ENGINE ─────────────────*/
  async process(lines) {
    try {
      this.MSGN = await this._createWarehouseHeader();
      const resolvedPackNumber = await this._createWarehousePackage();
      await this._addWarehouseLines(lines, resolvedPackNumber);
      await this._processAndValidateTransaction(resolvedPackNumber);
      this.log.Info('Receipt processing completed successfully');
    } catch (e) {
      this.log.Error(`process: Receipt processing failed: ${e.message || e}`);
      throw e;
    }
  }

  async _createWarehouseHeader() {
    const head = Object.assign(new MIRequest(), {
      program: 'MHS850MI',
      transaction: 'AddWhsHead',
      maxReturnedRecords: 1,
      record: this.applyCompanyDivisionContext({
        WHLO: this.WHLO,
        QLFR: '20',
        E0PA: 'WS',
        E0PB: 'WS',
        E007: '20',
        E065: 'PPS300',
      }),
    });

    const h = await this.mi.executeRequest(head);
    if (!h?.item?.MSGN) {
      throw new Error(
        this.extractErrorMessage(h, 'Warehouse transaction header creation')
      );
    }
    return h.item.MSGN;
  }

  async _createWarehousePackage() {
    const packNumber = `${this.PUNO}_${this.PNLI}`;
    const pack = new MIRequest();
    pack.program = 'MHS850MI';
    pack.transaction = 'AddWhsPack';
    pack.maxReturnedRecords = 1;
    pack.record = this.applyCompanyDivisionContext({
      WHLO: this.WHLO,
      MSGN: this.MSGN,
      PACN: packNumber,
      QLFR: '20',
    });

    const packResult = await this.mi.executeRequest(pack);
    if (
      packResult?.errorCode ||
      packResult?.errorMessage ||
      !packResult?.item?.PACN
    ) {
      throw new Error(
        this.extractErrorMessage(packResult, 'Warehouse package creation')
      );
    }
    return packResult.item.PACN || packNumber;
  }

  async _addWarehouseLines(lines, resolvedPackNumber) {
    for (const rec of lines) {
      const line = new MIRequest();
      line.program = 'MHS850MI';
      line.transaction = 'AddWhsLine';
      line.maxReturnedRecords = 100;
      line.record = this.applyCompanyDivisionContext({
        WHLO: this.WHLO,
        MSGN: this.MSGN,
        PACN: resolvedPackNumber,
        QLFR: '20',
        ITNO: this.ITNO,
        RVQA: rec.RVQA,
        PUUN: this.PUUN,
        RIDN: this.PUNO,
        RIDL: this.PNLI,
        RIDX: this.PNLS,
        OEND: this.OEND,
      });

      this._addOptionalLineFields(line, rec);

      const lineResult = await this.mi.executeRequest(line);
      if (lineResult?.errorCode || lineResult?.errorMessage) {
        const lineId = rec.BANO || rec.RVQA || 'unknown';
        throw new Error(
          this.extractErrorMessage(
            lineResult,
            `Warehouse transaction line ${lineId}`
          )
        );
      }
    }

    if (lines.length > 1) {
      await this.sleep(200);
    }
  }

  _addOptionalLineFields(line, rec) {
    if (!this.isNonMaterial) {
      line.record.WHSL = this.WHSL;
    }
    if (rec.BANO) {
      line.record.BANO = rec.BANO;
      line.record.BREM = `Orig Loc: ${this.WHSL}`;
    }
    if (rec.EXPI) {
      line.record.EXPI = rec.EXPI;
    }
  }

  async _processAndValidateTransaction(resolvedPackNumber) {
    const pr = new MIRequest();
    pr.program = 'MHS850MI';
    pr.transaction = 'PrcWhsTran';
    pr.maxReturnedRecords = 1;
    pr.record = this.applyCompanyContext({
      MSGN: this.MSGN,
      PRFL: '*EXE',
    });

    const prc = await this.prcWhsTranWithRetry(pr);
    if (prc?.errorCode || prc?.errorMessage) {
      throw new Error(this.extractErrorMessage(prc, 'Transaction processing'));
    }

    await this.sleep(100);
    const statusResult = await this._getTransactionStatus();
    const transactionStatus = statusResult.item.STAT;

    if (transactionStatus !== '90') {
      await this._handleTransactionFailure(
        transactionStatus,
        resolvedPackNumber,
        statusResult
      );
    }
  }

  async _getTransactionStatus() {
    const statusCheck = new MIRequest();
    statusCheck.program = 'MHS850MI';
    statusCheck.transaction = 'GetWhsHead';
    statusCheck.maxReturnedRecords = 1;
    statusCheck.outputFields = ['STAT', 'TRSL', 'TRSH'];
    statusCheck.record = this.applyCompanyContext({
      MSGN: this.MSGN,
    });

    const statusResult = await this.mi.executeRequest(statusCheck);
    if (!statusResult?.item) {
      throw new Error('Failed to retrieve transaction status for validation');
    }
    return statusResult;
  }

  async _handleTransactionFailure(
    transactionStatus,
    resolvedPackNumber,
    statusResult
  ) {
    const lineFailureDetail = ['25', '30', '35', '40', '45'].includes(
      transactionStatus
    )
      ? await this.getWhsLineFailureDetail(resolvedPackNumber)
      : '';
    const errorMessage = this._buildStatusErrorMessage(
      transactionStatus,
      resolvedPackNumber,
      lineFailureDetail,
      statusResult
    );

    const statusDesc = this.getTransactionStatusDescription(transactionStatus);
    this.log.Error(
      `process: Transaction failed with status ${transactionStatus} (${statusDesc})`
    );

    if (this.createdEquipment?.length > 0) {
      this.log.Warning('Transaction failed, initiating equipment rollback');
      await this.rollbackEquipment();
    }

    throw new Error(errorMessage);
  }

  _buildStatusErrorMessage(
    transactionStatus,
    resolvedPackNumber,
    lineFailureDetail,
    statusResult
  ) {
    const statusDesc = this.getTransactionStatusDescription(transactionStatus);
    const troubleshootingInfo = this._getTroubleshootingInfo(
      transactionStatus,
      resolvedPackNumber,
      lineFailureDetail
    );

    const statusLines = [];
    const trimmedTroubleshooting = troubleshootingInfo?.trim();
    if (trimmedTroubleshooting) {
      statusLines.push(trimmedTroubleshooting);
    }

    statusLines.push(
      `Status: ${transactionStatus} (${statusDesc})`,
      `Message no: ${this.MSGN}`
    );

    if (resolvedPackNumber !== undefined) {
      statusLines.push(`Package no: ${resolvedPackNumber}`);
    }
    if (statusResult.item.TRSL) {
      statusLines.push(`Lowest line status: ${statusResult.item.TRSL}`);
    }
    if (statusResult.item.TRSH) {
      statusLines.push(`Highest line status: ${statusResult.item.TRSH}`);
    }

    return statusLines.join('\n');
  }

  /*───────────────── HELPER METHODS (Enterprise H5 Patterns) ─────────────────*/
  // Enterprise-grade alert using H5ControlUtil.H5Dialog
  alert(title, message, shouldRefresh = false) {
    this.log.Info(`Displaying alert: ${title} - ${message}`);

    // Build dialog content using DOM methods to avoid injecting raw text as HTML
    const dialogContent = $(
      '<div style="max-width: 500px; word-wrap: break-word;"><label class="inforLabel noColon"></label></div>'
    );
    const label = dialogContent.find('label');
    message.split('\n').forEach((line, idx) => {
      if (idx > 0) label.append('<br>');
      label.append(document.createTextNode(line));
    });

    const dialogButtons = [
      {
        text: 'OK',
        isDefault: true,
        width: 80,
        click: function (event, model) {
          if (ScriptUtil.version >= 2.0) {
            model.close(true);
          } else {
            $(this).inforDialog('close');
          }
          if (shouldRefresh) {
            this.refresh();
          }
        }.bind(this),
      },
    ];

    const dialogOptions = {
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
      H5ControlUtil.H5Dialog.CreateDialogElement(
        dialogContent[0],
        dialogOptions
      );
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
      this.log.Warning(
        `busy: Failed to set busy indicator: ${error.message || error}`
      );
    }
  }

  refresh() {
    // Refresh H5 screen to show updated data
    if (this.ctrl?.PressKey) {
      this.ctrl.PressKey('F5');
    } else {
      this.log.Warning('Screen refresh requested but controller not available');
    }
  }

  num(value) {
    // Convert string to number, removing non-numeric characters
    return (
      Number.parseFloat((value || '0').toString().replaceAll(/[^\d.-]/g, '')) ||
      0
    );
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
      const msg = (e?.errorMessage || e?.message || '')
        .toString()
        .toLowerCase();

      // HTTP-style transient signals
      if (status === 409 || status === 503) return true;

      // Common lock/busy keywords
      const keywords = [
        'locked',
        'record lock',
        'busy',
        'in use',
        'try again',
        'temporary',
        'timeout',
        'deadlock',
      ];
      if (keywords.some((k) => msg.includes(k))) return true;

      // Known MI error codes that often indicate transient state
      if (['WPU0901', 'M3LOCK'].includes(code)) return true;
    } catch {
      return false;
    }
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
        const backoff =
          300 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
        this.log.Warning(
          `Transient error on PrcWhsTran attempt ${attempt}/${maxAttempts}, retrying in ${backoff}ms`
        );
        await this.sleep(backoff);
        attempt++;
      }
    }
    throw lastError || new Error('Unknown error executing PrcWhsTran');
  }
};
