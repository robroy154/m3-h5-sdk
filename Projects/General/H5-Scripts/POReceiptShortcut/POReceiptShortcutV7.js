var POReceiptShortcutV7 = (function() {
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/config.js
	/**
	* Per-deployment configuration, read from the H5 script argument string.
	*
	* This is what makes the asset customer-agnostic. Its predecessor compiled one
	* tenant's warehouse group, CMS474 custom field and currency into the source,
	* which is exactly what stops a script being reusable. Nothing tenant-specific
	* has a default here: a value is either supplied, or the feature it drives is
	* skipped, or the script refuses to run.
	*
	* Format is comma-separated `key:value`, order-independent, every key
	* omittable:
	*
	*     wms:true,whgr:WMSGROUP,e065:WMS,maxserials:25
	*
	* Other scripts in this repository take positional arguments, but with a dozen
	* optional settings that degrades into runs of empty commas where a mis-ordered
	* value fails silently. Keys are worth the small departure.
	*/
	var __values$4 = function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var DEFAULT_CONFIG = {
		wmsCheckEnabled: false,
		warehouseGroup: "",
		partnerA: "WS",
		partnerB: "WS",
		partnerQualifierA: "",
		partnerQualifierB: "",
		messageType: "WMS",
		maxSerials: 25,
		customFieldGroup: "",
		customFieldName: "",
		customFieldSequence: "1"
	};
	var KNOWN_KEYS = [
		"wms",
		"whgr",
		"e0pa",
		"e0pb",
		"e0qa",
		"e0qb",
		"e065",
		"maxserials",
		"cfmg",
		"cfmf",
		"sqnr"
	];
	/** Splits the raw argument string. Unparseable pairs are ignored, not guessed at. */
	function parseArgumentString(raw) {
		var e_1, _a;
		var values = {};
		if (!raw) return values;
		try {
			for (var _b = __values$4(raw.split(",")), _c = _b.next(); !_c.done; _c = _b.next()) {
				var pair = _c.value;
				var separator = pair.indexOf(":");
				if (separator < 1) continue;
				var key = pair.slice(0, separator).trim().toLowerCase();
				var value = pair.slice(separator + 1).trim();
				if (key) values[key] = value;
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
		return values;
	}
	function parseBoolean(value) {
		var v = (value || "").toLowerCase();
		return v === "true" || v === "1" || v === "yes";
	}
	/**
	* Builds the config, reporting anything that makes the script unsafe to run.
	*
	* The only fatal case at startup is asking for the WMS check without naming
	* the warehouse group — enabling a check against an unnamed group would either
	* do nothing or match the wrong warehouses. Everything else degrades: an
	* omitted feature is skipped, not guessed.
	*/
	function buildConfig(raw) {
		var values = parseArgumentString(raw);
		var errors = [];
		var unknownKeys = Object.keys(values).filter(function(k) {
			return KNOWN_KEYS.indexOf(k) === -1;
		});
		var config = {
			wmsCheckEnabled: parseBoolean(values.wms),
			warehouseGroup: values.whgr || "",
			partnerA: values.e0pa || DEFAULT_CONFIG.partnerA,
			partnerB: values.e0pb || DEFAULT_CONFIG.partnerB,
			partnerQualifierA: values.e0qa || "",
			partnerQualifierB: values.e0qb || "",
			messageType: values.e065 || DEFAULT_CONFIG.messageType,
			maxSerials: DEFAULT_CONFIG.maxSerials,
			customFieldGroup: values.cfmg || "",
			customFieldName: values.cfmf || "",
			customFieldSequence: values.sqnr || DEFAULT_CONFIG.customFieldSequence
		};
		if (values.maxserials !== void 0) {
			var parsed = Number(values.maxserials);
			if (!Number.isInteger(parsed) || parsed < 1) errors.push("maxserials must be a whole number of 1 or more (got \"" + values.maxserials + "\").");
			else config.maxSerials = parsed;
		}
		if (config.wmsCheckEnabled && !config.warehouseGroup) errors.push("wms:true requires whgr:<warehouse group>. The group must exist in MMS009 with the WMS warehouses assigned to it.");
		return {
			config,
			errors,
			unknownKeys
		};
	}
	/**
	* Whether a serial too long for EEQN can be stored at all.
	*
	* Checked when such a serial appears rather than at startup, so a customer who
	* never receives one never has to configure CMS474.
	*/
	function canStoreOversizeSerial(config) {
		return !!(config.customFieldGroup && config.customFieldName);
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/presentation.js
	/**
	* What the operator reads, and how it is styled.
	*
	* Kept free of jQuery and of H5 globals so the wording can be tested. The thin
	* adapter that actually opens a dialog lives with the orchestrator.
	*
	* Styling, per the H5 developer guide and the SDK samples:
	*
	*  - Plain text dialogs go through `ConfirmDialog.Show`/`ShowMessageDialog`,
	*    which H5 renders and themes itself. That removes three of V6's five
	*    dialogs from the theming problem entirely, and is already proven in
	*    production elsewhere in this repository.
	*  - The two dialogs that genuinely need form content keep a custom element,
	*    but every colour is `var(--ids-token, fallback)` rather than a hex
	*    literal. If the host defines the token the dialog follows the operator's
	*    theme; if not, the fallback renders what V6 rendered. Safe either way.
	*
	* Deliberately NOT done: bundling ids-theme CSS. An H5 script runs inside the
	* already-themed H5 client. Shipping a theme file would add ~100 KB and pin
	* the UI to one theme, breaking dark and high-contrast rather than supporting
	* them. The SDK's scantool sample loads a theme only because it is a
	* standalone page.
	*/
	/**
	* What to say when the operator supplied no number because M3 generates it.
	* Printing a bare "Lot:" with nothing after it reads like a missing value.
	*/
	var ASSIGNED_BY_M3 = {
		lot: "Lot number assigned by M3",
		serial: "Serial numbers assigned by M3"
	};
	function locationPhrase(location) {
		return location ? "to " + location : "to the location M3 assigned";
	}
	function plural(count, word) {
		return count + " " + word + (count === 1 ? "" : "s");
	}
	/**
	* The success message.
	*
	* V6 rendered "(no location)" when WHSL was blank, which reads like something
	* went wrong. A blank location is normal under direct put-away, so it now says
	* what actually happened.
	*/
	function buildReceiptSummary(summary) {
		var where = locationPhrase(summary.location);
		var units = plural(summary.quantity || 0, "unit") + " received " + where;
		if (summary.mode === "serial") {
			var serials = summary.serials || [];
			if (serials.length === 0) return units + ".\n" + ASSIGNED_BY_M3.serial + ".";
			return plural(serials.length, "serial") + " received " + where + ".\nSerials: " + serials.join(", ") + ".";
		}
		if (summary.mode === "lot") {
			var lines = [units + ".", (summary.lot ? "Lot " + summary.lot : ASSIGNED_BY_M3.lot) + "."];
			if (summary.expiry) lines.push("Expiry " + summary.expiry + ".");
			return lines.join("\n");
		}
		return units + ".";
	}
	/**
	* Titles carry no emoji.
	*
	* V6 used 📋 ⚠️ 🔄 📦 in dialog titles. `dialogType` already conveys severity
	* through H5's own iconography, which stays legible in high contrast and does
	* not depend on the operator's font having colour emoji.
	*/
	var DIALOG_TITLES = {
		serialEntry: "Enter serial numbers",
		lotEntry: "Enter lot number",
		confirmReceipt: "Confirm receipt",
		warning: "Warning",
		error: "Receipt failed",
		success: "Receipt complete",
		progress: "Processing order line"
	};
	/**
	* Styles for the two custom form dialogs.
	*
	* Every colour resolves through an IDS token with V6's literal as the
	* fallback, so this is a strict improvement: themed where tokens exist,
	* unchanged where they do not. Injected once per dialog rather than repeated
	* inline on 30 elements as V6 did.
	*/
	var DIALOG_STYLES = [
		".po-receipt-form { padding: 15px; }",
		".po-receipt-header {",
		"  margin-bottom: 10px; padding: 6px; border-radius: 3px; font-size: 12px;",
		"  background: var(--ids-color-background-secondary, #f5f5f5);",
		"  color: var(--ids-color-text-default, inherit);",
		"}",
		".po-receipt-po-number {",
		"  flex: 1; padding: 3px 5px; font-family: monospace; font-size: 12px;",
		"  background: var(--ids-color-background-default, #fff);",
		"  border: 1px solid var(--ids-color-border-default, #ccc);",
		"}",
		".po-receipt-action {",
		"  margin-left: 6px; padding: 3px 6px; border: none; border-radius: 2px;",
		"  cursor: pointer; font-size: 11px;",
		"  background: var(--ids-button-primary-color-background-default, #0072C6);",
		"  color: var(--ids-button-primary-color-text-default, #fff);",
		"}",
		".po-receipt-action--generate {",
		"  background: var(--ids-alert-color-success-default, #2C8C3E);",
		"}",
		".po-receipt-serials { max-height: 400px; overflow-y: auto; overflow-x: hidden; padding-right: 5px; }",
		".po-receipt-field { margin-bottom: 10px; }",
		".po-receipt-field input { width: 100%; text-transform: uppercase; }",
		".po-receipt-field--invalid input {",
		"  border: 2px solid var(--ids-alert-color-error-default, #f44336);",
		"}",
		".po-receipt-field--duplicate input {",
		"  border: 2px solid var(--ids-alert-color-warning-default, orange);",
		"}",
		".po-receipt-message {",
		"  padding: 8px 12px; margin: 10px 0; border-radius: 4px; font-size: 12px;",
		"  white-space: pre-line;",
		"}",
		".po-receipt-message--error {",
		"  background: var(--ids-alert-color-error-disabled, #ffebee);",
		"  border: 1px solid var(--ids-alert-color-error-default, #f44336);",
		"  color: var(--ids-alert-color-error-default, #c62828);",
		"}",
		".po-receipt-message--success {",
		"  background: var(--ids-alert-color-success-disabled, #d4edda);",
		"  border: 1px solid var(--ids-alert-color-success-default, #c3e6cb);",
		"  color: var(--ids-alert-color-success-default, #155724);",
		"}",
		".po-receipt-progress-track {",
		"  width: 100%; height: 18px; border-radius: 4px; overflow: hidden;",
		"  background: var(--ids-color-background-secondary, #ddd);",
		"}",
		".po-receipt-progress-fill {",
		"  height: 100%; width: 0; transition: width .25s;",
		"  background: var(--ids-button-primary-color-background-default, #0072C6);",
		"}"
	].join("\n");
	/** Formats the validation feedback shown above the serial list. */
	function buildValidationMessage(issues, duplicates, maxLength) {
		if (duplicates.length > 0) return "Duplicates detected: " + duplicates.join(", ") + "\nEnsure each serial is unique.";
		if (issues.length > 0) return "Check these entries: " + issues.map(function(i) {
			return i.label + " (" + i.reason + ")";
		}).join(", ") + "\nSerials may contain A-Z, 0-9 and hyphen, up to " + maxLength + " characters.";
		return "";
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/validation.js
	/**
	* Input rules for the serial and lot dialogs.
	*
	* In V6 these live inside the dialog closures, tangled with jQuery element
	* lookups and CSS border colours, so none of them can be exercised without a
	* DOM. Pulled out here as plain functions returning reasons, leaving the
	* dialogs to do nothing but render what they are told.
	*
	* Behaviour is V6's, including the quirks called out below.
	*/
	var __values$3 = function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	/**
	* Serials and lots are restricted to A-Z, 0-9 and hyphen.
	*
	* Uppercase only because both dialogs force-uppercase as the operator types;
	* a lowercase value can only arrive by pasting past the handler, and V6
	* rejects it. Reproduced rather than widened: silently accepting mixed case
	* would change what lands in SERN.
	*/
	var ALLOWED_PATTERN = /^[A-Z0-9-]+$/;
	/** Reason the value is unusable, or null when it is fine. */
	function validateSerialValue(value, maxLength) {
		var trimmed = (value || "").trim();
		if (!trimmed) return "blank";
		if (trimmed.length > maxLength) return "too long";
		if (!ALLOWED_PATTERN.test(trimmed)) return "invalid characters";
		return null;
	}
	/**
	* Validates a whole dialog's worth of serials.
	*
	* Format problems are reported for every field at once rather than one per
	* attempt, and duplicates are only looked for once every value is individually
	* valid — matching V6, and meaning an operator is not told about a duplicate
	* while a neighbouring field is still blank.
	*/
	function validateSerialBatch(values, maxLength) {
		var e_1, _a;
		var issues = [];
		var serials = [];
		values.forEach(function(value, index) {
			var reason = validateSerialValue(value, maxLength);
			if (reason) issues.push({
				label: "Serial " + (index + 1),
				reason,
				index
			});
			else serials.push((value || "").trim());
		});
		if (issues.length > 0) return {
			serials: [],
			issues,
			duplicates: []
		};
		var seen = {};
		var duplicates = [];
		try {
			for (var serials_1 = __values$3(serials), serials_1_1 = serials_1.next(); !serials_1_1.done; serials_1_1 = serials_1.next()) {
				var serial = serials_1_1.value;
				if (seen[serial] && duplicates.indexOf(serial) === -1) duplicates.push(serial);
				seen[serial] = true;
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (serials_1_1 && !serials_1_1.done && (_a = serials_1.return)) _a.call(serials_1);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
		return duplicates.length > 0 ? {
			serials: [],
			issues: [],
			duplicates
		} : {
			serials,
			issues: [],
			duplicates: []
		};
	}
	/** Reason the lot number is unusable, or null. */
	function validateLotNumber(lot) {
		var trimmed = (lot || "").trim();
		if (!trimmed) return "Lot number is required";
		if (!ALLOWED_PATTERN.test(trimmed)) return "Lot number must contain only A-Z, 0-9, or hyphen";
		return null;
	}
	/**
	* Expiry rule, applied only when the item demands one (MITMAS.EXPD = '1').
	*
	* Both dates are ISO yyyy-mm-dd, which compares correctly as a string. V6
	* rejects today as well as the past — stock expiring today is not receivable.
	*
	* @param today ISO date, injected so this is testable and so the rule cannot
	*              drift with the machine clock mid-session.
	*/
	function validateExpirationDate(expiry, isRequired, today) {
		if (!isRequired) return null;
		if (!expiry) return "Expiration date is required";
		if (expiry <= today) return "Expiration date cannot be today or in the past";
		return null;
	}
	/** Screen fields the receipt cannot proceed without. */
	function findMissingFields(fields) {
		return Object.keys(fields).filter(function(name) {
			return !fields[name];
		});
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/dialogs.js
	/**
	* The two dialogs that need form content.
	*
	* Everything else goes through ConfirmDialog, which H5 renders and themes
	* itself. These two collect input, so they need real controls — but they are
	* built from DOM nodes rather than concatenated HTML.
	*
	* That is not stylistic. V6's dialogWarn() interpolated its message into an
	* HTML string while its alert() carefully used document.createTextNode for the
	* same class of content. Building nodes makes the safe path the only path: a
	* serial containing markup becomes text, never elements.
	*
	* Each resolves to null on cancel. A cancel is an answer — V6 routed
	* "Operation cancelled by user" into its error dialog, so backing out
	* deliberately looked like a failure.
	*/
	var STYLE_ELEMENT_ID = "po-receipt-shortcut-styles";
	/** Injects the stylesheet once per page rather than inline on every element. */
	function ensureStyles() {
		if (document.getElementById(STYLE_ELEMENT_ID)) return;
		var style = document.createElement("style");
		style.id = STYLE_ELEMENT_ID;
		style.appendChild(document.createTextNode(DIALOG_STYLES));
		document.head.appendChild(style);
	}
	function element(tag, className, text) {
		var node = document.createElement(tag);
		if (className) node.className = className;
		if (text) node.appendChild(document.createTextNode(text));
		return node;
	}
	function labelledInput(labelText, maxLength) {
		var field = element("div", "po-receipt-field");
		var label = element("label", "inforLabel", labelText);
		var input = document.createElement("input");
		input.type = "text";
		input.className = "inforTextBox";
		input.maxLength = maxLength;
		input.autocomplete = "off";
		field.appendChild(label);
		field.appendChild(input);
		return {
			field,
			input
		};
	}
	/**
	* Opens an H5 dialog around a built element.
	*
	* `buttons[].click` receives the dialog model, which is how the dialog is
	* dismissed. V6 instead reached into `.ui-dialog-buttonpane` and matched
	* buttons by their visible label text — the same internal-DOM coupling the
	* repo's own rules ban for panels.
	*/
	function openDialog(content, title, buttons, onClose) {
		ensureStyles();
		H5ControlUtil.H5Dialog.CreateDialogElement(content, {
			title,
			dialogType: "General",
			modal: true,
			width: 460,
			minHeight: 200,
			closeOnEscape: true,
			close: onClose,
			buttons: buttons.map(function(button) {
				return {
					text: button.text,
					isDefault: !!button.isDefault,
					width: 90,
					click: function(_event, model) {
						return button.click({ close: function() {
							return model.close();
						} });
					}
				};
			})
		});
	}
	/**
	* Wraps a promise `resolve` so only the FIRST call counts.
	*
	* H5's dialog fires its `close` callback synchronously from `model.close()`,
	* and that callback cancels. So an OK handler must settle its real value
	* BEFORE closing, and this guard turns the cancellation that follows into a
	* no-op. Doing it the other way round discards whatever the operator typed and
	* reports a completed entry as "cancelled by the operator".
	*/
	function settleOnce(resolve) {
		var settled = false;
		return function(value) {
			if (settled) return;
			settled = true;
			resolve(value);
		};
	}
	/**
	* Collects serial numbers.
	*
	* Validation runs on OK rather than per keystroke, and the dialog stays open
	* with the offending fields marked so the operator does not lose the ones they
	* already typed.
	*/
	function promptSerials(options) {
		return new Promise(function(resolve) {
			var form = element("div", "po-receipt-form");
			form.appendChild(element("div", "po-receipt-header", "Item " + options.itemNumber + " — enter " + options.count + (options.count === 1 ? " serial number" : " serial numbers")));
			var message = element("div", "po-receipt-message po-receipt-message--error");
			message.style.display = "none";
			form.appendChild(message);
			var list = element("div", "po-receipt-serials");
			var inputs = [];
			for (var i = 0; i < options.count; i++) {
				var _a = labelledInput("Serial " + (i + 1), options.maxLength), field = _a.field, input = _a.input;
				list.appendChild(field);
				inputs.push(input);
			}
			form.appendChild(list);
			var finish = settleOnce(resolve);
			openDialog(form, DIALOG_TITLES.serialEntry, [{
				text: "OK",
				isDefault: true,
				click: function(handle) {
					var values = inputs.map(function(input) {
						return input.value.trim().toUpperCase();
					});
					var result = validateSerialBatch(values, options.maxLength);
					inputs.forEach(function(input, index) {
						var field = input.parentElement;
						if (!field) return;
						field.className = "po-receipt-field" + (result.issues.some(function(issue) {
							return issue.index === index;
						}) ? " po-receipt-field--invalid" : "");
					});
					var text = buildValidationMessage(result.issues, result.duplicates, options.maxLength);
					if (text) {
						message.textContent = text;
						message.style.display = "";
						return;
					}
					finish(values);
					handle.close();
				}
			}, {
				text: "Cancel",
				click: function(handle) {
					return handle.close();
				}
			}], function() {
				return finish(null);
			});
			if (inputs.length > 0) inputs[0].focus();
		});
	}
	/** Collects a lot number, and an expiry when the item master requires one. */
	function promptLot(options) {
		return new Promise(function(resolve) {
			var form = element("div", "po-receipt-form");
			form.appendChild(element("div", "po-receipt-header", "Item " + options.itemNumber));
			var message = element("div", "po-receipt-message po-receipt-message--error");
			message.style.display = "none";
			form.appendChild(message);
			var lotField = labelledInput("Lot number", 20);
			form.appendChild(lotField.field);
			var expiryField = labelledInput("Expiration date (YYYYMMDD)" + (options.expiryRequired ? "" : " — optional"), 8);
			form.appendChild(expiryField.field);
			var finish = settleOnce(resolve);
			openDialog(form, DIALOG_TITLES.lotEntry, [{
				text: "OK",
				isDefault: true,
				click: function(handle) {
					var lot = lotField.input.value.trim().toUpperCase();
					var expiry = expiryField.input.value.trim();
					var problem = validateLotNumber(lot) || validateExpirationDate(expiry || null, options.expiryRequired || !!expiry, options.today);
					lotField.field.className = "po-receipt-field" + (validateLotNumber(lot) ? " po-receipt-field--invalid" : "");
					if (problem) {
						message.textContent = problem;
						message.style.display = "";
						return;
					}
					finish({
						lot,
						expiry
					});
					handle.close();
				}
			}, {
				text: "Cancel",
				click: function(handle) {
					return handle.close();
				}
			}], function() {
				return finish(null);
			});
			lotField.input.focus();
		});
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/h5-adapter.js
	/**
	* The only file in this asset that touches an H5 global.
	*
	* Everything else takes its dependencies by injection, which is what makes the
	* rest of the script testable without a browser or a tenant. This file is the
	* boundary: it wraps MIService, ConfirmDialog, the busy indicator and the grid
	* behind the small interfaces the other modules expect, and is deliberately
	* thin enough that reading it is an adequate substitute for testing it.
	*/
	var __assign$2 = function() {
		__assign$2 = Object.assign || function(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign$2.apply(this, arguments);
	};
	var __awaiter$3 = function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __generator$3 = function(thisArg, body) {
		var _ = {
			label: 0,
			sent: function() {
				if (t[0] & 1) throw t[1];
				return t[1];
			},
			trys: [],
			ops: []
		}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
		return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
			return this;
		}), g;
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (g && (g = 0, op[0] && (_ = 0)), _) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0:
					case 1:
						t = op;
						break;
					case 4:
						_.label++;
						return {
							value: op[1],
							done: false
						};
					case 5:
						_.label++;
						y = op[1];
						op = [0];
						continue;
					case 7:
						op = _.ops.pop();
						_.trys.pop();
						continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
							_ = 0;
							continue;
						}
						if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
							_.label = op[1];
							break;
						}
						if (op[0] === 6 && _.label < t[1]) {
							_.label = t[1];
							t = op;
							break;
						}
						if (t && _.label < t[2]) {
							_.label = t[2];
							_.ops.push(op);
							break;
						}
						if (t[2]) _.ops.pop();
						_.trys.pop();
						continue;
				}
				op = body.call(thisArg, _);
			} catch (e) {
				op = [6, e];
				y = 0;
			} finally {
				f = t = 0;
			}
			if (op[0] & 5) throw op[1];
			return {
				value: op[0] ? op[1] : void 0,
				done: true
			};
		}
	};
	/**
	* Reads CONO/DIVI from the H5 user context.
	*
	* Both spellings are tried because the runtime has used both. A failure is not
	* fatal: MI resolves the user's own company when the record omits it, so an
	* empty context degrades to M3's default rather than stopping the script.
	*/
	function readCompanyContext(log) {
		try {
			var context = typeof ScriptUtil.GetUserContext === "function" ? ScriptUtil.GetUserContext() || {} : {};
			return {
				company: context.CurrentCompany || context.CONO || "",
				division: context.CurrentDivision || context.DIVI || ""
			};
		} catch (error) {
			log.Warning("Could not read the user context; MI will resolve company and division itself: " + (error && error.message || error));
			return {
				company: "",
				division: ""
			};
		}
	}
	/** Applies the scope the spec declares. See CompanyScope for why it varies. */
	function applyCompanyScope(record, scope, context) {
		if (!scope || scope === "none") return record;
		var scoped = __assign$2({}, record);
		if (context.company) scoped.CONO = context.company;
		if (scope === "company-division" && context.division) scoped.DIVI = context.division;
		return scoped;
	}
	/**
	* Builds the executor the gateway and engine run on.
	*
	* `.then(onSuccess, onError)` rather than `.catch()`: `catch` is a reserved
	* word and some M3 minifiers break on the member form. The rejection is
	* re-thrown as-is so the error classifiers upstream still see the MI response
	* shape rather than a wrapper.
	*/
	function createExecutor(context, log) {
		var service = ScriptUtil.version >= 2 ? MIService : MIService.Current;
		return function(spec) {
			var request = new MIRequest();
			request.program = spec.program;
			request.transaction = spec.transaction;
			request.record = applyCompanyScope(spec.record, spec.scope, context);
			if (spec.outputFields) request.outputFields = spec.outputFields;
			request.maxReturnedRecords = spec.maxReturnedRecords === void 0 ? 1 : spec.maxReturnedRecords;
			var startedAt = Date.now();
			var elapsed = function() {
				return " (" + (Date.now() - startedAt) + "ms)";
			};
			log.Debug(spec.program + "/" + spec.transaction);
			return service.executeRequest(request).then(function(response) {
				log.Debug(spec.program + "/" + spec.transaction + " ok" + elapsed());
				return response;
			}, function(error) {
				log.Debug(spec.program + "/" + spec.transaction + " failed" + elapsed());
				throw error;
			});
		};
	}
	/**
	* A themed message dialog.
	*
	* ConfirmDialog is H5's own, so it follows the operator's theme with no CSS
	* from this script. V6 hand-rolled every dialog with hardcoded hex, which is
	* why it rendered the same under Light, Dark and HighContrast.
	*/
	function showMessage(header, message, dialogType) {
		if (dialogType === void 0) dialogType = "Information";
		return new Promise(function(resolve) {
			ConfirmDialog.ShowMessageDialog({
				header,
				message,
				dialogType,
				closed: function() {
					return resolve();
				}
			});
		});
	}
	/**
	* Asks the operator to confirm.
	*
	* Resolves false on cancel. A cancel is an answer, not a failure — V6 routed
	* "Operation cancelled by user" into its error dialog, so deliberately backing
	* out looked like something had gone wrong.
	*/
	function confirm(header, message, dialogType) {
		if (dialogType === void 0) dialogType = "Information";
		return new Promise(function(resolve) {
			ConfirmDialog.Show({
				header,
				message,
				dialogType,
				withCancelButton: true,
				closed: function(args) {
					return resolve(!!(args && args.ok));
				}
			});
		});
	}
	/** Reports a failure. Titles carry no emoji; dialogType conveys severity. */
	function showError(message) {
		return showMessage(DIALOG_TITLES.error, message, "Error");
	}
	/**
	* Runs work with the busy indicator up, and always takes it down.
	*
	* Scoped to one operation on purpose. V6 raised it once across the whole run,
	* including the serial and lot prompts, which left the panel looking frozen
	* while it was in fact waiting on the operator — contradicting its own three
	* "User interaction - NO busy" comments.
	*/
	function withBusyIndicator(controller, work) {
		return __awaiter$3(this, void 0, void 0, function() {
			return __generator$3(this, function(_a) {
				switch (_a.label) {
					case 0:
						controller.ShowBusyIndicator();
						_a.label = 1;
					case 1:
						_a.trys.push([
							1,
							,
							3,
							4
						]);
						return [4, work()];
					case 2: return [2, _a.sent()];
					case 3:
						controller.HideBusyIndicator();
						return [7];
					case 4: return [2];
				}
			});
		});
	}
	/**
	* The selected rows, whatever shape the runtime returns.
	*
	* getSelectedGridRows() is documented in the developer guide but absent from
	* Infor's .d.ts, and the guide is ambiguous about arity — a plural name with a
	* singular return description. Rather than pick a reading, this normalises
	* both, and selection-policy decides what zero, one or many mean.
	*/
	function readSelectedRows(grid) {
		if (!grid || typeof grid.getSelectedGridRows !== "function") return [];
		try {
			var rows = grid.getSelectedGridRows();
			if (Array.isArray(rows)) return rows;
			return rows ? [rows] : [];
		} catch (_a) {
			return [];
		}
	}
	/** The one place this script owns a timer. Injected everywhere else. */
	function delay(ms) {
		return new Promise(function(resolve) {
			setTimeout(resolve, ms);
		});
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/mi-messages.js
	/**
	* M3 message text, keyed by message ID. GENERATED — do not edit by hand.
	*
	* Regenerate with validation/tools/extract-mi-messages.mjs, which reads Infor's
	* sources and keeps only codes reachable from the transactions this script
	* calls. M3 usually sends its own text; this fills the gap when it sends a bare
	* code, which is the normal case for MSID on an unprocessed line.
	*
	* `t` is the text, `&1` placeholders as Infor writes them. `cut` marks text
	* Infor's own comment truncates. `alt` holds other wordings the same code
	* carries, so a response matching any of them is still recognised.
	*/
	/** 272 codes. */
	var MI_MESSAGES = {
		CO30008: { t: "Item is not lot controlled" },
		CR41847: { t: "Agreement &1 does not exist for customer &2" },
		DR_0122: { t: "Issues must be confirmed on the shipment level when load building is used" },
		DR_0149: { t: "Option is not permitted. Freight cost header status is &1" },
		ED01016: {
			t: "Message type does not exist for partner",
			alt: ["Message Type does not exist for Partner"]
		},
		MH80301: { t: "Package detail record does not exist" },
		MH85008: { t: "Overreporting not allowed" },
		MH85009: { t: "Processing allowed status is 90" },
		MH85101: { t: "pre-pack number is only allowed with qualifier 29" },
		MH85205: { t: "Put-away number does not exist" },
		MH85210: { t: "The full quantity on the combination of location/item/lot number/container is different than the transaction quantity" },
		MH85401: { t: "Number of sublots must be equal to the Delivered quantity for a message line in Message Line record" },
		MH87004: { t: "Wrong item number" },
		MH87005: { t: "Delivery note data does nor match" },
		MH87006: { t: "Partial movements not permitted for packed items" },
		MH87007: { t: "Cannot add order line" },
		MM17704: { t: "Item &1 is not a catch weight item" },
		MM24013: {
			t: "Status can not be changed to &1 manually for models (in",
			cut: 1
		},
		MM24031: { t: "Serial number must be blank, lot numbering method is &1" },
		MM24032: { t: "Adding serial number not permitted, lot numbering method is &1" },
		MM24044: { t: "Serial number &1 already exists in status 99" },
		MM42103: { t: "Available quantity qty is &1 for the line" },
		MM98501: { t: "Individual item is not defined" },
		MM98502: {
			t: "The item has lot control method 2 - transaction qty can",
			cut: 1
		},
		MM98504: { t: "Individual item already exists" },
		MM_0100: { t: "Cannot allocate more than allocable per bal ID" },
		MO10006: { t: "Open WO's on the old Item/Serial number must be closed first" },
		MO48302: { t: "Field length is too long, may not exceed &2 caracters" },
		MW15503: { t: "More than one lot exists in the 'To' location" },
		MW41079: { t: "Option not allowed. The delivery &1 has been stopped with stop code &2" },
		MW42027: { t: "Completion flag is not allowed for dispatch policy &1" },
		MW42028: { t: "No balance ID found for specified lot number/location/container" },
		MW42050: { t: "Reporting date cannot be prior to pick list creation date" },
		MW42209: { t: "Report or delete not allowed - &1 units are packed already" },
		MW42220: { t: "Delivery not fully packed" },
		MW42222: {
			t: "Overissues not allowed for soft allocated pick line",
			alt: ["Overissues not allowed for dispatch policy &1"]
		},
		MW42223: { t: "Available quantity is &1 for the line" },
		MW42310: { t: "Package number &1 does not exist" },
		MW42332: { t: "Destination for package and shipment package is not the same" },
		MW42334: { t: "Reference sublot ID &1 is already packed" },
		MW44502: { t: "Receiving more than delivered is not possible" },
		MW46005: { t: "Enter new location" },
		MW_0008: { t: "Delivery &1 invoiced - correction not allowed" },
		MW_0009: { t: "Allocation does not exist" },
		MW_0028: { t: "Correction not allowed - costing/production statistics" },
		MW_0031: { t: "Proof of delivery performed on delivery &1 - correction not allowed" },
		MW_0032: { t: "Correct picking list not allowed when packing actions are performed" },
		OI10192: { t: "Individual item already exists on location" },
		OI_0165: { t: "A sublot controlled item is not allowed" },
		PP25010: { t: "Warehouse &1 on PO is not the same as the one selected" },
		PP30002: { t: "Order number or item number must be entered" },
		PP30003: { t: "Order status is 50 or higher, entry not permitted" },
		PP30004: { t: "Order category is 10, entry not permitted" },
		PP30005: { t: "Quantity must be entered" },
		PP30006: { t: "Transaction date is a future date" },
		PP30010: { t: "Quantity must be left blank" },
		PP30014: { t: "Item number cannot be entered" },
		PP30017: { t: "Display To delivery date &1 is not permitted" },
		PP30019: { t: "Quantity received is greater than quantity remaining" },
		PP30025: { t: "No PO or delivery schedule exists for item &1 warehouse" },
		PP30029: { t: "Lot number cannot be entered" },
		PP30031: { t: "The lot is connected to another reference" },
		PP30039: { t: "According to the agreement lot number may not be changed" },
		PP30041: { t: "Containers are not allowed" },
		PP30045: { t: "Component is not in supplier location" },
		PP30048: { t: "Negative CO delivery must be invoiced before reporting n" },
		PP30052: { t: "Inspection point &1 is not allowed on non-stocked items" },
		PP30061: { t: "Req/Distr order line is not completed" },
		PP30062: { t: "Goods receipt for an advised order with a delivery note is not allowed in this program, use PPS360" },
		PP30063: { t: "Inspection point &1 is not allowed for repair order" },
		PP30065: { t: "Balance ID already exists" },
		PP30066: { t: "A stock location with status 1 is not allowed - the stock location must have status 2" },
		PP30069: { t: "Goods receiving method with inspection point &1 is not allowed for subcontracted order" },
		PP30071: { t: "Two step put-away is not allowed for PO &1 line &2" },
		PP31032: { t: "Manufacturing date is later than current date" },
		PP36501: { t: "A package already exists with SSCC number &1" },
		PP_0014: { t: "Direct putaway must be used for direct delivery" },
		RP_0004: { t: "The function is not permitted in simulation mode" },
		SO11008: { t: "Agreement &1 cannot be used - the status is &2" },
		SO12090: { t: "The transaction is not available in this version" },
		S_00148: { t: "UTC time conversion failed" },
		S_00167: { t: "Deletion not permitted - equipment is installed in site &1. Equipment removal needs to be done using MOS125" },
		S_00573: { t: "Partial reporting of CO returns not allowed" },
		S_00647: { t: "To maintain or report a PO with category &1, is not allowed" },
		S_00781: { t: ": The package is included in a package structure - reverse not allowed" },
		S_00871: { t: "Reported quantity &1 in &2 is invalid and will be zero when converted to basic U/M in &3" },
		S_00964: { t: "Move to pack or dock location is not allowed for transaction type &1" },
		S_01111: { t: "Cannot process PO line with a broken receipt" },
		S_01139: { t: "Import registration is not allowed for the country code of the receiving warehouse" },
		S_01157: { t: "No container management at location &1. Item &2 cannot be moved to container managed location &3" },
		S_01195: { t: "Receipt is not allowed, maximum number of receipts for a PO line (999) have already been reported" },
		S_01302: { t: "Manufacturer &1 is not approved for item &2" },
		S_01322: { t: "Manufacturer &1 not approved for item &1, goods receiving method must include quality inspection" },
		S_01339: { t: "Manufacturer &1 not approved for item &2, change to status 1 location" },
		S_01397: { t: "Package &1 already exists in warehouse &2" },
		S_01400: { t: "An internal purchase order must be advised via a delivery note before received" },
		S_01484: { t: "Balance ID entered not found in package &1" },
		S_01603: { t: "Item &1 warehouse &2 is flagged for reporting of full balance ID allocation. Quantity mismatch" },
		S_01604: { t: "Move not allowed. To balance ID already exists. Item flagged for processing in full balance ID mode" },
		S_01697: { t: "Receipt is not allowed against sts 1 location when PO line is order initiated/includes supply chain policy" },
		S_01699: { t: "Receipt is not allowed against sts 1 location for items with aging settings enabled" },
		S_02005: { t: "No allocated balance IDs found for package &1 on delivery &2" },
		S_02475: { t: ": Shipment packages are not eligible for reverse" },
		S_02532: { t: "Packaging actions are performed - reverse not allowed" },
		S_02537: { t: ": Delivery &1 invoiced - reverse not allowed" },
		S_02641: { t: "Package(s) already exist in stock" },
		S_02642: { t: ": Non-container managed items found" },
		S_02728: { t: "Packaging &1 is a crate" },
		S_03062: { t: ": Proof of delivery performed on delivery &1 - reverse not allowed" },
		S_03150: { t: ": Status is &1 - reverse not allowed" },
		WAA1803: { t: "Agreement number does not exist" },
		WAD1001: { t: "Address number &1 is invalid" },
		WAD1003: { t: "Address number &1 does not exist" },
		WAG1103: { t: "Agreement number &1 does not exist" },
		WARD101: { t: "Arrival date &1 is invalid" },
		WAS3004: { t: "Fixed asset already exists" },
		WAT8003: { t: "Atribute identity &1 does not exist" },
		WBA0402: { t: "Lot number must be entered" },
		WBANT03: { t: "Reference sublot ID &1 does not exist" },
		WBBDT01: { t: "Best before date &1 is invalid" },
		WBR1103: { t: "Brand &1 does not exist" },
		WCA1E02: { t: "Catch weight must be entered" },
		WCF8002: { t: "Custom field must be entered" },
		WCF8003: { t: "Custom field &1 does not exist" },
		WCF8101: { t: "Custom field Alpha &1 is invalid" },
		WCF8102: { t: "Custom field Alpha must be entered" },
		WCF8201: { t: "Custom field Numeric &1 is invalid" },
		WCF8202: {
			t: "Custom field Numeric must be entered",
			alt: ["Custom field alpha must be entered"]
		},
		WCF8301: { t: "Custom field Date &1 is invalid" },
		WCF8302: {
			t: "Custom field Date must be entered",
			alt: ["Custom field numeric must be entered"]
		},
		WCF8502: { t: "Custom field group must be entered" },
		WCF8503: { t: "Custom field group &1 does not exist" },
		WCOB701: { t: "Controlling object &1 is invalid" },
		WCOTB03: { t: "Condition table &1 does not exist" },
		WCU0203: { t: "Customer number &1 does not exist" },
		WDE0403: { t: "Department &1 does not exist" },
		WDL0202: { t: "Delivery number must be entered" },
		WDL0203: {
			t: "Delivery number &1 does not exist",
			alt: ["Delivery number does not exist"]
		},
		WDL0701: { t: "Planned delivery date &1 is invalid" },
		WDL0801: { t: "Time of delivery &1 is invalid" },
		WDL1801: { t: "Changed delivery &1 is invalid" },
		WDN2001: { t: "Delivery note date &1 is invalid" },
		WDN2002: { t: "Delivery note date must be entered" },
		WDN2201: { t: "Delivery note time &1 is invalid" },
		WDS0101: { t: "Status proposal &1 is invalid" },
		WDSD101: { t: "Departure date &1 is invalid" },
		WE00A03: { t: "Partner &1 does not exist" },
		WE03501: { t: "Test indicator &1 is invalid" },
		WE06502: {
			t: "Message type must be entered",
			alt: ["Message Type must be entered"]
		},
		WEEQN04: { t: "Equipment number reference &1 already exists" },
		WEQ0403: { t: "Equipment type &1 does not exist" },
		WEQ0503: { t: "Equipment group &1 does not exist" },
		WEQ1B04: { t: "Equipment no &1 already exists" },
		WEQCL03: { t: "Equipment class &1 does not exist" },
		WEX2501: { t: "Expiration date &1 is invalid" },
		WFA3103: { t: "Fixed asset type &1 does not exist" },
		WFAC302: { t: "Facility must be entered" },
		WFAC303: { t: "Facility &1 does not exist" },
		WGED101: { t: "Date generated &1 is invalid" },
		WGED102: { t: "Date generated must be entered" },
		WGR0601: { t: "Package number &1 is invalid" },
		WGR0603: { t: "Package number &1 does not exist" },
		WGR0803: { t: "Goods receiving method &1 does not exist" },
		WHL0401: { t: "Holder &1 is invalid" },
		WHVDT01: { t: "Harvested date &1 is invalid" },
		WICDN01: {
			t: "Customs import declaration number &1 is invalid",
			alt: ["Import declaration number &1 is invalid"]
		},
		WICDN03: { t: "Customs import declaration number &1 does not exist" },
		WIND401: { t: "Lot control method &1 is invalid" },
		WIT0101: {
			t: "Item no &1 is invalid",
			alt: ["Item &1 does not exist", "Item number &1 is invalid"]
		},
		WIT0102: {
			t: "Item number must be entered",
			alt: ["Item number &1 does not exist"]
		},
		WIT0103: { t: "Item number &1 does not exist" },
		WLKST01: { t: "Like kind status &1 is invalid" },
		WLPC102: { t: "Potency must be entered" },
		WMF1203: { t: "Manufacturing order number &1 does not exist" },
		WMF4901: { t: "Manufacturing date &1 is invalid" },
		WMO0101: { t: "Delivery method &1 is invalid" },
		WMO0103: { t: "Delivery method &1 does not exist" },
		WMRCT01: { t: "Manual reclassification time &1 is invalid" },
		WMREC01: { t: "Manual reclassification date &1 is invalid" },
		WMS3703: { t: "Message number &1 does not exist" },
		WMS3804: { t: "Message Number &1 already exists" },
		WMS3902: { t: "External message number must be entered" },
		WMS4003: { t: "Message line number &1 does not exist" },
		WMS4301: { t: "Qualifier &1 is invalid" },
		WMS4302: { t: "Qualifier must be entered" },
		WMS4303: { t: "Qualifier &1 does not exist" },
		WMS5003: { t: "Connected function &1 does not exist" },
		WMUAV01: { t: "Multiple attribute values &1 is invalid" },
		WOE0101: { t: "Flagged as completed &1 is invalid" },
		WOR0303: { t: "Customer order number &1 does not exist" },
		WOWTP01: {
			t: "Owner type &1 is invalid",
			alt: ["Ownership type &1 is invalid"]
		},
		WPA0903: { t: "Packaging &1 does not exist" },
		WPA2501: { t: "Included in package number &1 is invalid" },
		WPA5103: { t: "Package number &1 does not exist" },
		WPL0203: { t: "Work center &1 does not exist" },
		WPL0301: { t: "Resourcetype &1 is invalid" },
		WPL1803: { t: "Picking list suffix &1 does not exist" },
		WPN0101: { t: "Purchase order line &1 is invalid" },
		WPN0103: { t: "Purchase order line &1 does not exist" },
		WPO0301: { t: "Order line number &1 is invalid" },
		WPO0303: { t: "Order line number &1 does not exist" },
		WPO0403: { t: "Alias number &1 does not exist" },
		WPPNB03: { t: "pre-pack number &1 does not exist" },
		WPR2101: { t: "Manufacturer &1 is invalid" },
		WPR2103: { t: "Manufacturer &1 does not exist" },
		WPU0201: { t: "Purchase order U/M &1 is invalid" },
		WPU0803: { t: "Purchase order number &1 does not exist" },
		WPU0901: { t: "Lowest status - purchase order &1 is invalid" },
		WRCD101: { t: "Receipt date &1 is invalid" },
		WRCD501: { t: "Receipt time &1 is invalid" },
		WRD1901: { t: "Received Time &1 is invalid" },
		WRE0103: { t: "Responsible &1 does not exist" },
		WRI0102: {
			t: "Purchase order number must be entered",
			alt: ["Order number must be entered"]
		},
		WRI0103: { t: "Purchase order number &1 does not exist" },
		WRP3501: { t: "Reporting time &1 is invalid" },
		WRV0302: { t: "Received quantity must be entered" },
		WSE1701: { t: "Serial number invalid" },
		WSE1702: { t: "Serial number must be entered" },
		WSE1704: { t: "Serial number &1 already exists" },
		WSE4402: { t: "Serial number must be entered" },
		WSE4403: { t: "Serial number &1 does not exist" },
		WSH3001: { t: "Requested departure date &1 is invalid" },
		WSH3101: { t: "Requested departure time &1 is invalid" },
		WSN1A01: { t: "Serial number return code &1 is invalid" },
		WSP0401: { t: "Issue method &1 is invalid" },
		WSPTB03: { t: "Specification table &1 does not exist" },
		WSQ0602: { t: "Sequence number must be entered" },
		WST0301: { t: "Status &1 is invalid" },
		WSTA101: { t: "Status - balance ID &1 is invalid" },
		WSU0101: {
			t: "Supplier number &1 is invalid",
			alt: ["Supplier &1 is invalid"]
		},
		WSU0102: { t: "Supplier number must be entered" },
		WSU0103: {
			t: "Supplier number &1 does not exist",
			alt: ["Supplier does not match PO"]
		},
		WSU2101: { t: "Supplier type &1 is invalid" },
		WSUD202: { t: "Delivery note number must be entered" },
		WTA1A04: { t: "Registration number/site &1 already exists" },
		WTE0101: { t: "Delivery terms &1 is invalid" },
		WTE0103: { t: "Delivery terms &1 does not exist" },
		WTR0901: { t: "Order number &1 is invalid" },
		WTR0903: { t: "Order number &1 does not exist" },
		WTRD101: { t: "Transaction date &1 is invalid" },
		WTT0403: { t: "Order type &1 does not exist" },
		WTW0402: { t: "To location must be entered" },
		WUS0503: { t: "User &1 does not exist" },
		WWH0101: { t: "Warehouse &1 is invalid" },
		WWH0102: { t: "Warehouse must be entered" },
		WWH0103: { t: "Warehouse &1 does not exist" },
		WWO0201: { t: "Reporting number &1 is invalid" },
		WWO0203: { t: "Reporting number &1 does not exist" },
		WWS0101: { t: "Location &1 is invalid" },
		WWS0102: { t: "Location must be entered" },
		WWS0103: { t: "Location &1 does not exist" },
		XAD0001: { t: "A record has been entered by user &1" },
		XBA0003: { t: "Lot no. &1 does not exist for item no. &2 in the lotfile" },
		XDE0001: { t: "The record has been deleted by another user" },
		XDT0001: { t: "Incorrect date" },
		XIM0039: { t: "Order line does not exist" },
		XIT0107: { t: "Item number is not permitted - status is &1" },
		XMB9730: { t: "The allocation attribute did not match demand" },
		XMO0041: { t: "The operation status is &1. A change is not permitted" },
		XMO0047: { t: "Work order status is &1. Option &2 is not permitted" },
		XNU0000: { t: "Numeric error" },
		XNU0003: { t: "Negative value is not permitted" },
		XOPC001: { t: "Invalid operation code &1" },
		XO_1130: { t: "Please try again later" },
		XPC0001: { t: "The lot has potency &1" },
		XPO0002: { t: "The status of the PO line is &1, change is not permitted" },
		XRE0103: {
			t: "Record does not exists",
			alt: ["Record does not exist"]
		},
		XRE0104: {
			t: "Record already exists",
			alt: ["Record already exist"]
		},
		XST0020: { t: "Status change are not permitted any longer" },
		XUP0001: { t: "The record has been changed by user &1" },
		X_00200: { t: "The identifier may not contain a restricted character: &1" },
		X_01003: { t: "User &1 is not active" }
	};
	function lookupMiMessage(code) {
		if (!code) return null;
		var key = String(code).trim().toUpperCase();
		return Object.prototype.hasOwnProperty.call(MI_MESSAGES, key) ? MI_MESSAGES[key] : null;
	}
	/**
	* The operator-facing sentence for a code, or '' when unknown.
	*
	* Unfilled `&1` placeholders are stripped: M3 substitutes them itself, so one
	* surviving here means the text came from this table, and "Location does not
	* exist" reads better than "Location &1 does not exist".
	*/
	function describeMiMessage(code, substitutions) {
		var entry = lookupMiMessage(code);
		if (!entry) return "";
		var text = entry.t;
		if (substitutions) for (var i = 0; i < substitutions.length; i++) {
			var value = substitutions[i];
			if (value === void 0 || value === null || value === "") continue;
			text = text.split("&" + (i + 1)).join(String(value));
		}
		text = text.replace(/&\d/g, "").replace(/\s{2,}/g, " ").trim();
		if (!text) return "";
		return entry.cut ? text + "…" : text;
	}
	/**
	* Whether `message` already says what the catalogue would say, so the dialog
	* does not print both. Compared on letters and digits only, because M3 fills in
	* `&1` and may punctuate differently.
	*/
	function messageMatchesCatalogue(code, message) {
		var entry = lookupMiMessage(code);
		if (!entry || !message) return false;
		var normalise = function(s) {
			return s.toLowerCase().replace(/[^a-z0-9]/g, "");
		};
		var actual = normalise(message);
		if (!actual) return false;
		var candidates = [entry.t].concat(entry.alt || []);
		for (var i = 0; i < candidates.length; i++) {
			var parts = candidates[i].split(/&\d/).map(normalise).filter(function(p) {
				return p.length > 3;
			});
			if (parts.length && parts.every(function(p) {
				return actual.indexOf(p) !== -1;
			})) return true;
		}
		return false;
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/errors.js
	/**
	* Turning MI failures into something a receiving clerk can act on.
	*/
	var TRANSACTION_STATUS = {
		"10": {
			label: "Entered",
			advice: "Warehouse transaction message was created but has not been validated yet."
		},
		"15": {
			label: "Error on message header",
			advice: "Header validation failed. Check MHS850 for the header error."
		},
		"20": {
			label: "Header validated, no errors",
			advice: "Header validated, but package processing did not start. Check MHS850 for the message details."
		},
		"25": {
			label: "Error on message packages/IDs",
			advice: "Package validation failed. Check MHS851 for the package error.",
			lines: true
		},
		"30": {
			label: "Package/ID validated, no errors",
			advice: "Package validated, but line processing did not complete. Check MHS851 for the package details.",
			lines: true
		},
		"35": {
			label: "Error on message lines/instructions",
			advice: "Line validation failed. Check MHS851 for the failing line.",
			lines: true
		},
		"40": {
			label: "Line/instructions validated, no errors",
			advice: "Lines validated, but downstream processing did not finish. Check MHS851 for the failing line.",
			lines: true
		},
		"45": {
			label: "Error from business component",
			advice: "Business validation failed during receipt processing.",
			lines: true
		},
		"90": { label: "Processed, no errors" },
		"92": {
			label: "Processed, test message, no update performed",
			advice: "The transaction ran in test mode, so no inventory update was performed."
		},
		"99": {
			label: "Archived",
			advice: "The warehouse transaction message is archived."
		}
	};
	function getTransactionStatusDescription(status) {
		var info = TRANSACTION_STATUS[status];
		return info ? info.label : "Unknown status";
	}
	/** Statuses where a per-line lookup will explain what failed. */
	function statusWarrantsLineLookup(status) {
		var info = TRANSACTION_STATUS[status];
		return !!(info && info.lines);
	}
	function getTroubleshootingInfo(status, lineFailureDetail) {
		if (lineFailureDetail === void 0) lineFailureDetail = "";
		var info = TRANSACTION_STATUS[status];
		return [info && info.advice ? info.advice : "Warehouse transaction ended in status " + status + ". Check MHS850/MHS851 for details.", lineFailureDetail].filter(Boolean).join("\n");
	}
	function getTechnicalDetails(error, headline) {
		var errorCode = error.errorCode || "";
		var errorMessage = error.errorMessage || "";
		var errorField = error.errorField || "";
		var program = error.program || "";
		var transaction = error.transaction || "";
		if (!(errorCode || errorMessage || errorField || program)) return "";
		var details = "\n\nTechnical Details:";
		if (program && transaction) details += "\n• API: " + program + "/" + transaction;
		if (errorCode && errorMessage) details += "\n• Error: " + errorCode + ": " + errorMessage;
		else if (errorMessage) details += "\n• Error: " + errorMessage;
		else if (errorCode) details += "\n• Error Code: " + errorCode;
		if (errorField) details += "\n• Field: " + errorField;
		var meaning = describeMiMessage(errorCode);
		if (meaning && !messageMatchesCatalogue(errorCode, headline)) details += "\n• Means: " + meaning;
		return details;
	}
	/**
	* Builds the operator-facing message: a readable headline, then the API,
	* error code and field for whoever has to chase it in M3.
	*/
	function extractErrorMessage(error, operation) {
		if (operation === void 0) operation = "operation";
		var fallback = operation + " failed";
		if (!error) return fallback;
		var headline = error.errorMessage || error.message || describeMiMessage(error.errorCode) || fallback;
		return headline + getTechnicalDetails(error, headline);
	}
	/**
	* Whether a failure is a transient lock or busy condition worth retrying.
	*
	* Only ever guards PrcWhsTran. Kept narrow on purpose: a retry is safe only on
	* an operation that is idempotent or has not yet taken effect, and processing a
	* warehouse message that failed to start is both.
	*/
	var TRANSIENT_KEYWORDS = [
		"locked",
		"record lock",
		"busy",
		"in use",
		"try again",
		"temporary",
		"timeout",
		"deadlock"
	];
	/**
	* XO_1130 ("Please try again later") is what MHS870 raises when its
	* receiving-number lock times out during put-away — the one genuinely
	* retryable failure on this path.
	*
	* V6 listed WPU0901 and M3LOCK here instead. WPU0901 is
	* "Lowest status - purchase order &1 is invalid", a permanent rejection that
	* no retry can clear, and M3LOCK is not an M3 message ID at all.
	*/
	var TRANSIENT_ERROR_CODES = ["XO_1130"];
	function isTransientProcessLock(error) {
		var _a;
		if (!error) return false;
		var status = (_a = error.statusCode) !== null && _a !== void 0 ? _a : error.status;
		if (status === 409 || status === 503) return true;
		var code = String(error.errorCode || "").toUpperCase();
		if (TRANSIENT_ERROR_CODES.indexOf(code) !== -1) return true;
		var message = String(error.errorMessage || error.message || "").toLowerCase();
		return TRANSIENT_KEYWORDS.some(function(k) {
			return message.indexOf(k) !== -1;
		});
	}
	/**
	* djb2 variant. Deliberately not a cryptographic hash — it only has to spread
	* values within one receipt batch. Kept bit-for-bit identical to V6 so that
	* serials derived before and after this refactor match.
	*/
	function simpleHash(value) {
		var hash = 5381;
		for (var i = 0; i < value.length; i++) {
			hash = (hash << 5) + hash + value.codePointAt(i);
			hash = hash & hash;
		}
		return Math.abs(hash);
	}
	/**
	* Seed for a single receipt batch. Derived from the clock so two runs in the
	* same second still produce different suffixes.
	*/
	function generateEpochSeed(nowMs) {
		return (nowMs % 1e6).toString().padStart(6, "0");
	}
	/** Four-digit suffix that separates serials within one batch. */
	function computeHashSuffix(epochSeed, originalSerial, index) {
		return (simpleHash(epochSeed + "|" + originalSerial + "|" + index) % 1e4).toString().padStart(4, "0");
	}
	/**
	* Builds a `SERN`-safe serial: BSN + MMDDYY + hhmmss + hash.
	*
	* Only called when the operator's serial exceeds `SERN_MAX_LENGTH`; the
	* original is never discarded, it is carried on the entry for storage
	* elsewhere.
	*/
	function deriveBoundedSerial(originalSerial, index, epochSeed, now) {
		var pad2 = function(n) {
			return String(n).padStart(2, "0");
		};
		var derived = "BSN" + pad2(now.getMonth() + 1) + pad2(now.getDate()) + String(now.getFullYear()).slice(-2).padStart(2, "0") + pad2(now.getHours()) + pad2(now.getMinutes()) + pad2(now.getSeconds()) + computeHashSuffix(epochSeed, originalSerial, index);
		if (derived.length > 19) throw new Error("Derived serial exceeds 19 chars: " + derived + " (len=" + derived.length + ")");
		return derived;
	}
	/**
	* Turns operator input into the entries the receipt engine posts.
	*
	* A serial within `SERN_MAX_LENGTH` passes through untouched; anything longer
	* gets a derived stand-in. Throws if two entries would land on the same
	* derived value, because that would silently merge two physical items.
	*/
	function prepareSerialEntries(userSerials, epochSeed, now) {
		if (!Array.isArray(userSerials) || userSerials.length === 0) throw new Error("No serials to prepare");
		var entries = userSerials.map(function(rawSerial, index) {
			var trimmed = (rawSerial || "").trim();
			return {
				originalSerial: trimmed,
				derivedSerial: trimmed.length > 20 ? deriveBoundedSerial(trimmed, index, epochSeed, now) : trimmed,
				index
			};
		});
		if (new Set(entries.map(function(e) {
			return e.derivedSerial;
		})).size !== entries.length) throw new Error("Hash collision: derived serials are not unique. Try again or contact support.");
		return entries;
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/mi-requests.js
	/**
	* Construction of the MI record payloads.
	*
	* Kept pure and separate from the calls that send them so the corrections
	* below are reviewable as data — every one of them is a change to what lands
	* in M3, and none can be verified without a tenant.
	*/
	var __values$2 = function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	/** Equipment status 20 = in stock. Owner type 0 = company. M3 constants. */
	var STATUS_IN_STOCK = "20";
	var OWNER_TYPE_COMPANY = "0";
	function truncate(value, max) {
		var v = value || "";
		return v.length > max ? v.slice(0, max) : v;
	}
	/** Drops keys with no value so MI is not sent empty strings it did not ask for. */
	function compact(record) {
		var e_1, _a;
		var out = {};
		try {
			for (var _b = __values$2(Object.keys(record)), _c = _b.next(); !_c.done; _c = _b.next()) {
				var key = _c.value;
				if (record[key] !== void 0 && record[key] !== null && record[key] !== "") out[key] = record[key];
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
		return out;
	}
	function chooseOversizeTarget(originalSerial) {
		var length = (originalSerial || "").length;
		if (length <= 20) return "none";
		if (length <= 40) return "eeqn";
		return "cms474";
	}
	/**
	* MMS240MI/Add record.
	*
	* Corrections against V6, each verified against the MI catalog:
	*
	* - CUCD came from a hardcoded 'USD'. It is now the PO's own currency, which
	*   requires the PPS200MI/GetHead call V6 deleted. CUCD is not on GetLine.
	* - ALII was `this.ITDS` unbounded. ITDS is 60 and ALII is 40, so every long
	*   description silently overflowed. Now prefers PITD ("purchase order item
	*   name", 30) which fits, and truncates only as a fallback.
	* - SUNO was never written, though the script reads it off the screen to
	*   validate. M3's own createMILOIN sets it. Without it nothing on the serial
	*   records which vendor supplied it.
	* - SKEY ("search key equipment", 20) now carries the operator's serial, so a
	*   derived BSN value remains findable by what the vendor actually printed.
	* - PROD is captured, but on the warehouse line rather than here: the catalog
	*   shows MMS240MI/Add takes no PROD input, and no ECVE input either. An
	*   earlier draft of this file set both on the equipment record, where M3
	*   would have ignored them. ECVE has no home in either write transaction and
	*   is no longer fetched.
	*
	* PUNO and PNLI are kept even though PPS300's chkIndiv() overwrites them
	* during the receipt. chkIndiv only runs for INDI 2, so leaving them out would
	* lose the linkage on any path where it does not fire.
	*/
	function buildEquipmentRecord(entry, ctx) {
		var target = chooseOversizeTarget(entry.originalSerial);
		return compact({
			ITNO: ctx.ITNO,
			SERN: entry.derivedSerial,
			STAT: STATUS_IN_STOCK,
			SUNO: ctx.SUNO,
			CUNO: ctx.CUNO,
			CUOW: ctx.CUNO,
			OWTP: OWNER_TYPE_COMPANY,
			PUPR: ctx.price,
			CUCD: ctx.currency,
			PPDT: ctx.purchaseDate,
			FACI: ctx.FACI,
			PUNO: ctx.PUNO,
			PNLI: ctx.PNLI,
			PNLS: ctx.PNLS,
			ALII: truncate(ctx.poItemName || ctx.itemDescription, 40),
			SKEY: truncate(entry.originalSerial, 20),
			EEQN: target === "eeqn" ? entry.originalSerial : ""
		});
	}
	/**
	* CMS474MI/AddEqInfo record, for a serial past EEQN's 40 characters.
	*
	* CONO and DIVI are deliberately absent: AddEqInfo does not accept them (its
	* inputs are ITNO, SERN, CFMG, CFMF, SQNR, CFMA, CFMN, CFMD), and the H5
	* MIService injects company scope itself.
	*/
	function buildCustomFieldRecord(entry, itno, group, field, sequence) {
		return {
			ITNO: itno,
			SERN: entry.derivedSerial,
			CFMG: group,
			CFMF: field,
			SQNR: sequence,
			CFMA: truncate(entry.originalSerial, 60)
		};
	}
	/**
	* Output fields for MHS850MI/LstWhsLine when diagnosing a failed receipt.
	*
	* V6 asked for REMK, which LstWhsLine does not return — confirmed twice, once
	* against the MI catalog and once in MHS850MI_MVX.java, where
	* `MICommon.setError("", X0MSID, X0MSGD)` appears 40 times. MSGD (78 chars) is
	* the message text and MSID its identifier. V6 fell through to BREM, a 20-char
	* field the script itself wrote, so a failed receipt echoed the script's own
	* "Orig Loc:" note back instead of M3's error.
	*/
	var LINE_DIAGNOSTIC_FIELDS = [
		"MSLN",
		"STAT",
		"ITNO",
		"BANO",
		"MSID",
		"MSGD",
		"BREM",
		"PACN"
	];
	/**
	* Picks the most useful failure text available on a returned line.
	*
	* `MSGD` is 78 characters and is often blank — M3 fills it when the line
	* engine records an error, not when the line simply has not run. `MSID` is
	* always there when something failed, so when the text is missing or cut off
	* the catalogue supplies the sentence that goes with the id. Without that, a
	* failed receipt reports `WPU0201` and stops.
	*/
	function describeLineFailure(line) {
		if (!line) return "";
		var parts = [];
		var message = line.MSGD || line.BREM || "";
		var meaning = describeMiMessage(line.MSID);
		if (message) parts.push(message);
		else if (meaning) parts.push(meaning);
		if (line.MSID) {
			var explain = meaning && !messageMatchesCatalogue(line.MSID, message);
			parts.push(explain ? "Message id: " + line.MSID + " (" + meaning + ")" : "Message id: " + line.MSID);
		}
		if (line.MSLN) parts.push("Line no: " + line.MSLN);
		if (line.ITNO) parts.push("Item: " + line.ITNO);
		if (line.BANO) parts.push("Lot/Serial: " + line.BANO);
		return parts.join("\n");
	}
	/**
	* M3 protocol constants for this transaction shape. Named, not configurable:
	* these identify what kind of warehouse message is being written, and a
	* different value would describe a different operation.
	*/
	var QUALIFIER_RECEIPT = "20";
	var DIRECTION_INBOUND = "20";
	/** PrcWhsTran processing flag: execute rather than validate. */
	var PROCESS_FLAG_EXECUTE = "*EXE";
	/**
	* MHS850MI/AddWhsHead record.
	*
	* E0PA/E0PB (partner) and E065 (message type) together resolve the MMS865
	* partner record M3 uses to interpret the message. V6 hardcoded E065 to
	* 'PPS300', which requires the customer to have created that partner record by
	* hand; the default here is the record M3 ships, and all five keys are
	* configurable for a tenant that has its own.
	*
	* YREF ("Your reference", 30) stamps the message with what wrote it, so a
	* receipt can be traced back to this script rather than to a person.
	*/
	function buildWarehouseHeaderRecord(whlo, config, reference) {
		return compact({
			WHLO: whlo,
			QLFR: QUALIFIER_RECEIPT,
			E0PA: config.partnerA,
			E0PB: config.partnerB,
			E0QA: config.partnerQualifierA,
			E0QB: config.partnerQualifierB,
			E007: DIRECTION_INBOUND,
			E065: config.messageType,
			YREF: truncate(reference, 30)
		});
	}
	/** MHS850MI/AddWhsPack record. The package groups the lines of one PO line. */
	function buildWarehousePackRecord(whlo, msgn, packNumber) {
		return compact({
			WHLO: whlo,
			MSGN: msgn,
			PACN: packNumber,
			QLFR: QUALIFIER_RECEIPT
		});
	}
	/**
	* MHS850MI/AddWhsLine record.
	*
	* RIDN/RIDL/RIDX are the reference-order keys: PO number, line, and suffix.
	* That linkage is what tells M3 this is a receipt against that PO line rather
	* than an unreferenced inbound movement.
	*
	* The origin-location note moves from BREM to REMK. Both are "Remark" on this
	* transaction, but BREM is 20 characters and the note is `Orig Loc: ` (10)
	* plus WHSL (10) — exactly 20, with no headroom at all. REMK is 30. Same
	* field semantics, no boundary to trip over.
	*/
	function buildWarehouseLineRecord(input, ctx) {
		var record = {
			WHLO: ctx.WHLO,
			MSGN: ctx.MSGN,
			PACN: ctx.PACN,
			QLFR: QUALIFIER_RECEIPT,
			ITNO: ctx.ITNO,
			RVQA: input.RVQA,
			PUUN: ctx.PUUN,
			RIDN: ctx.PUNO,
			RIDL: ctx.PNLI,
			RIDX: ctx.PNLS,
			OEND: ctx.OEND,
			WHSL: ctx.WHSL,
			PROD: ctx.PROD
		};
		if (input.BANO) {
			record.BANO = input.BANO;
			if (ctx.WHSL) record.REMK = truncate("Orig Loc: " + ctx.WHSL, 30);
		}
		if (input.EXPI) record.EXPI = input.EXPI;
		return compact(record);
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/mi-gateway.js
	/**
	* The MI calls, behind an injected executor.
	*
	* The executor seam is what makes this testable: the H5 adapter wraps
	* MIService, while tests pass a fake that records requests and returns canned
	* responses. No H5 global appears in this file.
	*/
	var __assign$1 = function() {
		__assign$1 = Object.assign || function(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign$1.apply(this, arguments);
	};
	var __awaiter$2 = function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __generator$2 = function(thisArg, body) {
		var _ = {
			label: 0,
			sent: function() {
				if (t[0] & 1) throw t[1];
				return t[1];
			},
			trys: [],
			ops: []
		}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
		return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
			return this;
		}), g;
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (g && (g = 0, op[0] && (_ = 0)), _) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0:
					case 1:
						t = op;
						break;
					case 4:
						_.label++;
						return {
							value: op[1],
							done: false
						};
					case 5:
						_.label++;
						y = op[1];
						op = [0];
						continue;
					case 7:
						op = _.ops.pop();
						_.trys.pop();
						continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
							_ = 0;
							continue;
						}
						if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
							_.label = op[1];
							break;
						}
						if (op[0] === 6 && _.label < t[1]) {
							_.label = t[1];
							t = op;
							break;
						}
						if (t && _.label < t[2]) {
							_.label = t[2];
							_.ops.push(op);
							break;
						}
						if (t[2]) _.ops.pop();
						_.trys.pop();
						continue;
				}
				op = body.call(thisArg, _);
			} catch (e) {
				op = [6, e];
				y = 0;
			} finally {
				f = t = 0;
			}
			if (op[0] & 5) throw op[1];
			return {
				value: op[0] ? op[1] : void 0,
				done: true
			};
		}
	};
	var __read = function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	/** Normalises the two shapes MI uses for list results. */
	function toItems(response) {
		if (!response) return [];
		if (Array.isArray(response.items)) return response.items;
		return response.item ? [response.item] : [];
	}
	function requireItem(response, operation) {
		if (!response || !response.item) throw new Error(extractErrorMessage(response, operation));
		return response.item;
	}
	/**
	* PPS001MI/GetBasicData2.
	*
	* V6 called this and requested RSTQ alone. Source (PPS001MI_MVX.java) shows 25
	* YD* outputs, including every field the numbering and location decisions
	* need. This is the same call, finally asked for what it already returns.
	*/
	var BASIC_DATA_FIELDS = [
		"RSTQ",
		"INDI",
		"BACD",
		"DSTO",
		"FLCD",
		"GRMT",
		"WHSL",
		"ITDS",
		"SITE",
		"PUUN",
		"ORCO",
		"OWHL"
	];
	function specBasicData(puno, pnli, pnls) {
		return {
			program: "PPS001MI",
			transaction: "GetBasicData2",
			record: {
				PUNO: puno,
				PNLI: pnli,
				PNLS: pnls
			},
			outputFields: BASIC_DATA_FIELDS,
			maxReturnedRecords: 1
		};
	}
	/** PPS200MI/GetLine. RORL is requested again; V6 declared it and dropped it. */
	var PO_LINE_FIELDS = [
		"PUPR",
		"CPPR",
		"RORC",
		"RORN",
		"RORL",
		"GETY",
		"FACI",
		"RGDT",
		"PROD",
		"PITD",
		"POTC"
	];
	function specPoLine(puno, pnli, pnls) {
		return {
			program: "PPS200MI",
			transaction: "GetLine",
			record: {
				PUNO: puno,
				PNLI: pnli,
				PNLS: pnls
			},
			outputFields: PO_LINE_FIELDS,
			maxReturnedRecords: 1
		};
	}
	/**
	* PPS200MI/GetHead — restored.
	*
	* V6 deleted this call, which is why CUCD had to be hardcoded to 'USD': CUCD
	* is not on GetLine, only on GetHead. GetHead needs nothing but PUNO, already
	* on screen, so it runs in the same parallel batch and costs no extra latency.
	* V6's "optimisation" did not even save a round trip.
	*/
	var PO_HEAD_FIELDS = [
		"CUCD",
		"PUDT",
		"SUNO",
		"ORTY"
	];
	function specPoHead(puno) {
		return {
			program: "PPS200MI",
			transaction: "GetHead",
			record: { PUNO: puno },
			outputFields: PO_HEAD_FIELDS,
			maxReturnedRecords: 1
		};
	}
	/** MMS200MI/Get, slimmed: INDI and BACD now come from GetBasicData2. */
	var ITEM_FIELDS = ["TPCD", "EXPD"];
	function specItem(itno) {
		return {
			program: "MMS200MI",
			transaction: "Get",
			record: { ITNO: itno },
			outputFields: ITEM_FIELDS,
			maxReturnedRecords: 1
		};
	}
	/**
	* PPS345MI/Get — the goods receiving method record.
	*
	* Supplies CRBN, the one input to M3's ManualLotNo() that GetBasicData2 does
	* not carry. Keyed on GRMT, which stage 1 returns, so it necessarily follows.
	*/
	function specReceivingMethod(grmt) {
		return {
			program: "PPS345MI",
			transaction: "Get",
			record: { GRMT: grmt },
			outputFields: [
				"DSTO",
				"FLCD",
				"CRBN"
			],
			maxReturnedRecords: 1
		};
	}
	/** OIS100MI/GetOrderHead, only when the PO is linked to a customer order. */
	function specCustomerOrder(orno) {
		return {
			program: "OIS100MI",
			transaction: "GetOrderHead",
			record: { ORNO: orno },
			outputFields: ["CUNO"],
			maxReturnedRecords: 1
		};
	}
	/** MMS009MI/Get, only when the WMS check is configured on. */
	function specWarehouseGroup(whgr, whlo) {
		return {
			program: "MMS009MI",
			transaction: "Get",
			record: {
				WHGR: whgr,
				WHLO: whlo
			},
			outputFields: ["WHLO"],
			maxReturnedRecords: 1
		};
	}
	/**
	* Whether a lot or serial already exists.
	*
	* MMS235MI is the lot master and the serial master both: under INDI 2 a lot
	* number IS a serial number, so the same transaction answers for either.
	*
	* LstItmLot is used rather than GetItmLot because a list returns empty for a
	* missing record instead of erroring, which sidesteps the has-it-failed-or-is
	* -it-absent question that V6 answered by treating HTTP 400 as "absent".
	*/
	function specLotExists(itno, bano) {
		return {
			program: "MMS235MI",
			transaction: "LstItmLot",
			record: {
				ITNO: itno,
				BANO: bano
			},
			outputFields: ["ITNO", "BANO"],
			maxReturnedRecords: 1
		};
	}
	function lotOrSerialExists(execute, itno, bano) {
		return __awaiter$2(this, void 0, void 0, function() {
			var response;
			return __generator$2(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, execute(specLotExists(itno, bano))];
					case 1:
						response = _a.sent();
						return [2, toItems(response).some(function(r) {
							return r.ITNO === itno && r.BANO === bano;
						})];
				}
			});
		});
	}
	/** Issues the four stage-1 reads together and fails with a named operation. */
	function fetchLineData(execute, puno, pnli, pnls, itno) {
		return __awaiter$2(this, void 0, void 0, function() {
			var _a, basic, line, head, item;
			return __generator$2(this, function(_b) {
				switch (_b.label) {
					case 0: return [4, Promise.all([
						execute(specBasicData(puno, pnli, pnls)),
						execute(specPoLine(puno, pnli, pnls)),
						execute(specPoHead(puno)),
						execute(specItem(itno))
					])];
					case 1:
						_a = __read.apply(void 0, [_b.sent(), 4]), basic = _a[0], line = _a[1], head = _a[2], item = _a[3];
						return [2, {
							basic: requireItem(basic, "Purchase order line lookup"),
							line: requireItem(line, "Purchase order line detail"),
							head: requireItem(head, "Purchase order header lookup"),
							item: requireItem(item, "Item lookup")
						}];
				}
			});
		});
	}
	/**
	* Chooses the purchase price.
	*
	* Confirmed price wins when populated, otherwise the ordered price. This is
	* V6's rule and it is correct — kept, and now pinned by test.
	*/
	function resolvePrice(line) {
		var confirmed = (line.CPPR || "").trim();
		return confirmed !== "" ? confirmed : line.PUPR || "";
	}
	/**
	* Purchase date: the line's registration date, then the head's order date.
	*
	* V6 used RGDT with no fallback; V4 used today(). Neither is wrong, but a PO
	* that predates the receipt should carry its own date, not the day it happened
	* to be received.
	*/
	function resolvePurchaseDate(line, head) {
		return line.RGDT || head.PUDT || "";
	}
	/** Builds the equipment-record context from the four reads. */
	function buildLineContext(raw, identity, customerNumber) {
		return {
			ITNO: identity.ITNO,
			PUNO: identity.PUNO,
			PNLI: identity.PNLI,
			PNLS: identity.PNLS,
			price: resolvePrice(raw.line),
			currency: raw.head.CUCD || "",
			FACI: raw.line.FACI || "",
			purchaseDate: resolvePurchaseDate(raw.line, raw.head),
			SUNO: raw.head.SUNO || "",
			CUNO: customerNumber,
			poItemName: raw.line.PITD || "",
			itemDescription: raw.basic.ITDS || "",
			PROD: raw.line.PROD || ""
		};
	}
	function specEquipmentAdd(record) {
		return {
			program: "MMS240MI",
			transaction: "Add",
			record,
			scope: "company",
			outputFields: ["ITNO", "SERN"],
			maxReturnedRecords: 1
		};
	}
	function specEquipmentDelete(itno, sern) {
		return {
			program: "MMS240MI",
			transaction: "Del",
			record: {
				ITNO: itno,
				SERN: sern
			},
			scope: "company",
			maxReturnedRecords: 1
		};
	}
	/**
	* Creates one equipment record.
	*
	* `omitSerial` exists because MMS240MI/Add rejects a supplied SERN for the
	* automatic numbering methods (MM24031) — see planEquipmentCreation. Stripping
	* it here as well as at the caller means a mis-wired call fails a test rather
	* than an operator's receipt.
	*
	* The SERN that comes back is what gets tracked, not what was sent: for a
	* generated serial the two differ, and the rollback keys on ITNO + SERN.
	*/
	function createEquipment(execute, record, originalSerial, omitSerial) {
		return __awaiter$2(this, void 0, void 0, function() {
			var payload, response, item, sern;
			return __generator$2(this, function(_a) {
				switch (_a.label) {
					case 0:
						payload = __assign$1({}, record);
						if (omitSerial) delete payload.SERN;
						return [4, execute(specEquipmentAdd(payload))];
					case 1:
						response = _a.sent();
						item = response && response.item;
						if (!item) throw new Error(extractErrorMessage(response, "Equipment creation for serial " + (payload.SERN || originalSerial || "(generated)")));
						sern = item.SERN || payload.SERN || "";
						if (!sern) throw new Error("Equipment was created but M3 returned no serial number, so it cannot be rolled back if the receipt fails. Check MMS240 for item " + (payload.ITNO || "") + " before retrying.");
						return [2, {
							ITNO: payload.ITNO || "",
							SERN: sern,
							originalSerial,
							customFieldWritten: false
						}];
				}
			});
		});
	}
	/**
	* The delete transaction is DltEqInfo, not DelEqInfo.
	*
	* V4 (live) and V6 both send 'DelEqInfo', which CMS474MI does not have — its
	* transactions are AddEqInfo, DltEqInfo, GetEqInfo, LstEqInfo, UpdEqInfo. So
	* the CMS474 half of the rollback has never run: it fails with an unknown
	* transaction, the failure is caught and logged as best-effort cleanup, and
	* the custom-field row is left orphaned against a serial that no longer exists.
	*/
	function specCustomFieldAdd(record) {
		return {
			program: "CMS474MI",
			transaction: "AddEqInfo",
			record,
			scope: "none",
			maxReturnedRecords: 1
		};
	}
	function specCustomFieldDelete(itno, sern, group, field, sequence) {
		return {
			program: "CMS474MI",
			transaction: "DltEqInfo",
			record: {
				ITNO: itno,
				SERN: sern,
				CFMG: group,
				CFMF: field,
				SQNR: sequence
			},
			scope: "none",
			maxReturnedRecords: 1
		};
	}
	function specWarehouseHeader(record) {
		return {
			program: "MHS850MI",
			transaction: "AddWhsHead",
			record,
			scope: "company-division",
			outputFields: ["MSGN"],
			maxReturnedRecords: 1
		};
	}
	function specWarehousePack(record) {
		return {
			program: "MHS850MI",
			transaction: "AddWhsPack",
			record,
			scope: "company-division",
			outputFields: ["MSGN", "PACN"],
			maxReturnedRecords: 1
		};
	}
	function specWarehouseLine(record) {
		return {
			program: "MHS850MI",
			transaction: "AddWhsLine",
			record,
			scope: "company-division",
			outputFields: [
				"MSGN",
				"PACN",
				"MSLN"
			],
			maxReturnedRecords: 1
		};
	}
	function specProcessTransaction(msgn) {
		return {
			program: "MHS850MI",
			transaction: "PrcWhsTran",
			record: {
				MSGN: msgn,
				PRFL: PROCESS_FLAG_EXECUTE
			},
			scope: "company",
			maxReturnedRecords: 1
		};
	}
	function specTransactionStatus(msgn) {
		return {
			program: "MHS850MI",
			transaction: "GetWhsHead",
			record: { MSGN: msgn },
			scope: "company",
			outputFields: [
				"STAT",
				"TRSL",
				"TRSH"
			],
			maxReturnedRecords: 1
		};
	}
	function specWarehouseLines(msgn, pacn) {
		return {
			program: "MHS850MI",
			transaction: "LstWhsLine",
			record: {
				MSGN: msgn,
				PACN: pacn
			},
			scope: "none",
			outputFields: LINE_DIAGNOSTIC_FIELDS,
			maxReturnedRecords: 25
		};
	}
	/** Creates the message header and returns its number. */
	function postWarehouseHeader(execute, record) {
		return __awaiter$2(this, void 0, void 0, function() {
			var response, msgn;
			return __generator$2(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, execute(specWarehouseHeader(record))];
					case 1:
						response = _a.sent();
						msgn = response && response.item ? response.item.MSGN : "";
						if (!msgn) throw new Error(extractErrorMessage(response, "Warehouse transaction header creation"));
						return [2, msgn];
				}
			});
		});
	}
	/**
	* Creates the package and returns the number M3 settled on.
	*
	* M3 may return a package number other than the one requested, so the returned
	* value is authoritative for every line that follows and for the failure
	* lookup afterwards.
	*/
	function postWarehousePack(execute, record) {
		return __awaiter$2(this, void 0, void 0, function() {
			var response;
			return __generator$2(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, execute(specWarehousePack(record))];
					case 1:
						response = _a.sent();
						if (hasFailed(response) || !response.item || !response.item.PACN) throw new Error(extractErrorMessage(response, "Warehouse package creation"));
						return [2, response.item.PACN];
				}
			});
		});
	}
	/** Adds one line and returns its message line number, when M3 gives one. */
	function postWarehouseLine(execute, record, lineLabel) {
		return __awaiter$2(this, void 0, void 0, function() {
			var response;
			return __generator$2(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, execute(specWarehouseLine(record))];
					case 1:
						response = _a.sent();
						if (hasFailed(response)) throw new Error(extractErrorMessage(response, "Warehouse transaction line " + lineLabel));
						return [2, response.item && response.item.MSLN || ""];
				}
			});
		});
	}
	/**
	* An MI response that carries an error code or message but still resolved.
	*
	* The H5 adapter rejects on transport failures, but MI also returns business
	* errors on a resolved promise. IMIResponse.hasError() covers this where it
	* exists; the fields are checked directly so the gateway stays free of the H5
	* response class and remains testable with a plain object.
	*/
	function hasFailed(response) {
		return !!(response && (response.errorCode || response.errorMessage));
	}
	function computeBackoff(attempt, random) {
		return 300 * Math.pow(2, attempt - 1) + Math.floor(random() * 100);
	}
	/**
	* Processes the warehouse message, retrying only a transient lock.
	*
	* Retrying a write is only safe because PrcWhsTran that failed to acquire its
	* lock has not processed anything — the message is still sitting in MHS850
	* unprocessed. A retry on any other failure would risk a double receipt, which
	* is why isTransientProcessLock is deliberately narrow.
	*/
	function processWarehouseTransaction(execute, msgn, options) {
		return __awaiter$2(this, void 0, void 0, function() {
			var spec, attempt, response, error_1, transient, waitMs;
			return __generator$2(this, function(_a) {
				switch (_a.label) {
					case 0:
						spec = specProcessTransaction(msgn);
						attempt = 1;
						_a.label = 1;
					case 1:
						_a.trys.push([
							1,
							3,
							,
							5
						]);
						return [4, execute(spec)];
					case 2:
						response = _a.sent();
						if (hasFailed(response)) throw new Error(extractErrorMessage(response, "Transaction processing"));
						return [2];
					case 3:
						error_1 = _a.sent();
						transient = isTransientProcessLock(error_1);
						if (!transient || attempt >= options.maxAttempts) throw error_1;
						waitMs = computeBackoff(attempt, options.random);
						if (options.onRetry) options.onRetry(attempt, waitMs, error_1);
						return [4, options.delay(waitMs)];
					case 4:
						_a.sent();
						attempt++;
						return [3, 5];
					case 5: return [3, 1];
					case 6: return [2];
				}
			});
		});
	}
	/** Reads the message status. '90' is the only value that means goods moved. */
	function getTransactionStatus(execute, msgn) {
		return __awaiter$2(this, void 0, void 0, function() {
			var response;
			return __generator$2(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, execute(specTransactionStatus(msgn))];
					case 1:
						response = _a.sent();
						if (!response || !response.item || !response.item.STAT) throw new Error("The receipt was submitted but its status could not be read. Check MHS850 for message " + msgn + " before retrying — it may have posted.");
						return [2, response.item.STAT];
				}
			});
		});
	}
	/**
	* M3's own explanation of which line failed.
	*
	* Best-effort: this runs while already reporting a failure, so a second
	* failure here must not replace the first. Returns '' and lets the caller
	* report the status on its own.
	*/
	function getWhsLineFailureDetail(execute, msgn, pacn) {
		return __awaiter$2(this, void 0, void 0, function() {
			var lines, _a, failing;
			return __generator$2(this, function(_c) {
				switch (_c.label) {
					case 0:
						_c.trys.push([
							0,
							2,
							,
							3
						]);
						_a = toItems;
						return [4, execute(specWarehouseLines(msgn, pacn))];
					case 1:
						lines = _a.apply(void 0, [_c.sent()]);
						return [3, 3];
					case 2:
						_c.sent();
						return [2, ""];
					case 3:
						failing = lines.filter(function(l) {
							return l.STAT && l.STAT !== "90";
						})[0] || lines[0];
						return [2, failing ? describeLineFailure(failing) : ""];
				}
			});
		});
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/receipt-engine.js
	/**
	* The receipt, start to finish.
	*
	* Everything here is sequencing and failure policy; the calls themselves live
	* in mi-gateway and the records in mi-requests. Nothing in this file touches
	* H5, the DOM, or the clock directly — the executor, the log and the waits all
	* arrive by injection, which is what lets the whole sequence be exercised
	* against a fake M3.
	*
	* Two things V6 got structurally wrong are fixed here rather than tidied:
	*
	* 1. Rollback had three trigger points — addEquip()'s catch, run()'s inner
	*    catch, and _handleTransactionFailure(). The second and third were no-ops
	*    only because the tracking array had already been cleared, which meant the
	*    control flow could not be reasoned about locally. There is exactly one
	*    trigger here, in runReceipt, and it is the only place rollback is called.
	*
	* 2. Rollback ran on any failure, including one where nobody could tell
	*    whether the goods had moved. See ReceiptOutcome.
	*/
	var __assign = function() {
		__assign = Object.assign || function(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	var __awaiter$1 = function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __generator$1 = function(thisArg, body) {
		var _ = {
			label: 0,
			sent: function() {
				if (t[0] & 1) throw t[1];
				return t[1];
			},
			trys: [],
			ops: []
		}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
		return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
			return this;
		}), g;
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (g && (g = 0, op[0] && (_ = 0)), _) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0:
					case 1:
						t = op;
						break;
					case 4:
						_.label++;
						return {
							value: op[1],
							done: false
						};
					case 5:
						_.label++;
						y = op[1];
						op = [0];
						continue;
					case 7:
						op = _.ops.pop();
						_.trys.pop();
						continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
							_ = 0;
							continue;
						}
						if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
							_.label = op[1];
							break;
						}
						if (op[0] === 6 && _.label < t[1]) {
							_.label = t[1];
							t = op;
							break;
						}
						if (t && _.label < t[2]) {
							_.label = t[2];
							_.ops.push(op);
							break;
						}
						if (t[2]) _.ops.pop();
						_.trys.pop();
						continue;
				}
				op = body.call(thisArg, _);
			} catch (e) {
				op = [6, e];
				y = 0;
			} finally {
				f = t = 0;
			}
			if (op[0] & 5) throw op[1];
			return {
				value: op[0] ? op[1] : void 0,
				done: true
			};
		}
	};
	var __values$1 = function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	/** M3 processes the message on the PrcWhsTran call; this is slack, not a poll. */
	var STATUS_SETTLE_MS = 100;
	/** V6's pause between a multi-line batch and processing it. */
	var MULTI_LINE_SETTLE_MS = 200;
	/**
	* Pre-creates the MMS240 records for a serialised item.
	*
	* PPS300's chkIndiv() updates an existing INDIV record during the receipt and
	* never creates one, so a serial with no equipment record gets received with
	* nothing to enrich. That gap is why this step exists.
	*
	* Each created record is pushed to `created` before the next call, so a
	* failure part-way through leaves the caller holding everything that did
	* succeed.
	*/
	function createEquipmentRecords(deps, plan, created) {
		return __awaiter$1(this, void 0, void 0, function() {
			var omitSerial, _a, _b, entry, record, equipment, e_1_1;
			var e_1, _c;
			return __generator$1(this, function(_d) {
				switch (_d.label) {
					case 0:
						if (plan.equipmentPlan === "skip" || plan.entries.length === 0) {
							deps.log.Debug("Equipment creation skipped for this numbering method");
							return [2];
						}
						omitSerial = plan.equipmentPlan === "add-generated-serial";
						_d.label = 1;
					case 1:
						_d.trys.push([
							1,
							7,
							8,
							9
						]);
						_a = __values$1(plan.entries), _b = _a.next();
						_d.label = 2;
					case 2:
						if (!!_b.done) return [3, 6];
						entry = _b.value;
						record = buildEquipmentRecord(entry, plan.poLine);
						return [4, createEquipment(deps.execute, record, entry.originalSerial, omitSerial)];
					case 3:
						equipment = _d.sent();
						created.push(equipment);
						return [4, storeOversizeSerial(deps, equipment, entry)];
					case 4:
						_d.sent();
						_d.label = 5;
					case 5:
						_b = _a.next();
						return [3, 2];
					case 6: return [3, 9];
					case 7:
						e_1_1 = _d.sent();
						e_1 = { error: e_1_1 };
						return [3, 9];
					case 8:
						try {
							if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
						} finally {
							if (e_1) throw e_1.error;
						}
						return [7];
					case 9:
						deps.log.Info("Created " + created.length + " equipment record(s)");
						return [2];
				}
			});
		});
	}
	/**
	* Stores a serial too long for SERN and too long for EEQN.
	*
	* Up to 40 characters the original rides along in EEQN on the Add itself, so
	* nothing extra is needed. Past 40 it needs CMS474, which is customer setup,
	* and refusing here is deliberate: the alternative is writing a truncated
	* serial that looks correct and is not.
	*/
	function storeOversizeSerial(deps, equipment, entry) {
		return __awaiter$1(this, void 0, void 0, function() {
			var record, response;
			return __generator$1(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (chooseOversizeTarget(entry.originalSerial) !== "cms474") return [2];
						if (!canStoreOversizeSerial(deps.config)) throw new Error("Serial \"" + entry.originalSerial + "\" is longer than 40 characters and cannot be stored without a CMS474 custom field. Add cfmg:<group> and cfmf:<field> to the script arguments, or receive this line in M3.");
						record = buildCustomFieldRecord(__assign(__assign({}, entry), { derivedSerial: equipment.SERN }), equipment.ITNO, deps.config.customFieldGroup, deps.config.customFieldName, deps.config.customFieldSequence);
						return [4, deps.execute(specCustomFieldAdd(record))];
					case 1:
						response = _a.sent();
						if (response && (response.errorCode || response.errorMessage)) throw new Error(extractErrorMessage(response, "Storing full serial for " + equipment.SERN));
						equipment.customFieldWritten = true;
						return [2];
				}
			});
		});
	}
	function postWarehouseMessage(deps, plan) {
		return __awaiter$1(this, void 0, void 0, function() {
			var msgn, packNumber, lineNumbers, _a, _b, input, record, label, _c, _d, e_2_1;
			var e_2, _e;
			return __generator$1(this, function(_f) {
				switch (_f.label) {
					case 0: return [4, postWarehouseHeader(deps.execute, buildWarehouseHeaderRecord(plan.line.WHLO, deps.config, deps.reference))];
					case 1:
						msgn = _f.sent();
						return [4, postWarehousePack(deps.execute, buildWarehousePackRecord(plan.line.WHLO, msgn, plan.line.PUNO + "_" + plan.line.PNLI))];
					case 2:
						packNumber = _f.sent();
						lineNumbers = [];
						_f.label = 3;
					case 3:
						_f.trys.push([
							3,
							8,
							9,
							10
						]);
						_a = __values$1(plan.lines), _b = _a.next();
						_f.label = 4;
					case 4:
						if (!!_b.done) return [3, 7];
						input = _b.value;
						record = buildWarehouseLineRecord(input, __assign(__assign({}, plan.line), {
							MSGN: msgn,
							PACN: packNumber
						}));
						label = input.BANO || input.RVQA || "unknown";
						_d = (_c = lineNumbers).push;
						return [4, postWarehouseLine(deps.execute, record, label)];
					case 5:
						_d.apply(_c, [_f.sent()]);
						_f.label = 6;
					case 6:
						_b = _a.next();
						return [3, 4];
					case 7: return [3, 10];
					case 8:
						e_2_1 = _f.sent();
						e_2 = { error: e_2_1 };
						return [3, 10];
					case 9:
						try {
							if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
						} finally {
							if (e_2) throw e_2.error;
						}
						return [7];
					case 10:
						if (!(plan.lines.length > 1)) return [3, 12];
						return [4, deps.delay(MULTI_LINE_SETTLE_MS)];
					case 11:
						_f.sent();
						_f.label = 12;
					case 12: return [2, {
						msgn,
						packNumber,
						lineNumbers
					}];
				}
			});
		});
	}
	/**
	* Processes the message and reads back what happened.
	*
	* Returns an outcome instead of throwing, because whether the caller may undo
	* the equipment depends on which failure this was — and that decision belongs
	* to exactly one place, in runReceipt.
	*/
	function processAndConfirm(deps, posted) {
		return __awaiter$1(this, void 0, void 0, function() {
			var processingError, error_1, status, error_2, detail, _a;
			return __generator$1(this, function(_b) {
				switch (_b.label) {
					case 0:
						processingError = "";
						_b.label = 1;
					case 1:
						_b.trys.push([
							1,
							4,
							,
							5
						]);
						return [4, processWarehouseTransaction(deps.execute, posted.msgn, deps.retry)];
					case 2:
						_b.sent();
						return [4, deps.delay(STATUS_SETTLE_MS)];
					case 3:
						_b.sent();
						return [3, 5];
					case 4:
						error_1 = _b.sent();
						processingError = extractErrorMessage(error_1, "Transaction processing");
						deps.log.Warning("PrcWhsTran reported: " + processingError);
						return [3, 5];
					case 5:
						_b.trys.push([
							5,
							7,
							,
							8
						]);
						return [4, getTransactionStatus(deps.execute, posted.msgn)];
					case 6:
						status = _b.sent();
						return [3, 8];
					case 7:
						error_2 = _b.sent();
						return [2, {
							kind: "indeterminate",
							msgn: posted.msgn,
							message: [
								processingError,
								extractErrorMessage(error_2, "Transaction status check"),
								"The equipment records have been left in place because it cannot be confirmed whether the receipt posted. Check MHS850 for message " + posted.msgn + "."
							].filter(Boolean).join("\n\n")
						}];
					case 8:
						if (status === "90") {
							if (processingError) deps.log.Warning("PrcWhsTran reported an error but message " + posted.msgn + " reached status 90; treating the receipt as posted");
							return [2, {
								kind: "posted",
								msgn: posted.msgn,
								packNumber: posted.packNumber,
								lineNumbers: posted.lineNumbers
							}];
						}
						if (!statusWarrantsLineLookup(status)) return [3, 10];
						return [4, getWhsLineFailureDetail(deps.execute, posted.msgn, posted.packNumber)];
					case 9:
						_a = _b.sent();
						return [3, 11];
					case 10:
						_a = "";
						_b.label = 11;
					case 11:
						detail = _a;
						return [2, {
							kind: "failed",
							msgn: posted.msgn,
							message: [
								getTroubleshootingInfo(status, detail),
								"Status " + status + " (" + getTransactionStatusDescription(status) + "), message " + posted.msgn + ".",
								processingError
							].filter(Boolean).join("\n\n")
						}];
				}
			});
		});
	}
	/**
	* Removes the equipment records this receipt created.
	*
	* Best-effort by design: a failure to delete one record must not stop the
	* others, because every one left behind is a row somebody has to find. The
	* CMS474 row goes first, since deleting the equipment first would orphan it.
	*
	* Returns the records it could not remove, so the caller can name them.
	*/
	function rollbackEquipment(deps, created) {
		return __awaiter$1(this, void 0, void 0, function() {
			var failures;
			var _this = this;
			return __generator$1(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (created.length === 0) return [2, []];
						deps.log.Warning("Rolling back " + created.length + " equipment record(s)");
						failures = [];
						return [4, Promise.all(created.map(function(equipment) {
							return __awaiter$1(_this, void 0, void 0, function() {
								var error_3, error_4;
								return __generator$1(this, function(_a) {
									switch (_a.label) {
										case 0:
											if (!equipment.customFieldWritten) return [3, 4];
											_a.label = 1;
										case 1:
											_a.trys.push([
												1,
												3,
												,
												4
											]);
											return [4, deps.execute(specCustomFieldDelete(equipment.ITNO, equipment.SERN, deps.config.customFieldGroup, deps.config.customFieldName, deps.config.customFieldSequence))];
										case 2:
											_a.sent();
											return [3, 4];
										case 3:
											error_3 = _a.sent();
											deps.log.Error("Could not remove the stored serial for " + equipment.SERN + ": " + extractErrorMessage(error_3, "Custom field cleanup"));
											return [3, 4];
										case 4:
											_a.trys.push([
												4,
												6,
												,
												7
											]);
											return [4, deps.execute(specEquipmentDelete(equipment.ITNO, equipment.SERN))];
										case 5:
											_a.sent();
											return [3, 7];
										case 6:
											error_4 = _a.sent();
											failures.push(equipment);
											deps.log.Error("Could not remove equipment " + equipment.ITNO + "/" + equipment.SERN + ": " + extractErrorMessage(error_4, "Equipment cleanup"));
											return [3, 7];
										case 7: return [2];
									}
								});
							});
						}))];
					case 1:
						_a.sent();
						if (failures.length > 0) deps.log.Warning("Rollback left " + failures.length + " of " + created.length + " equipment record(s) in place");
						return [2, failures];
				}
			});
		});
	}
	/**
	* Runs the receipt and resolves the rollback question once.
	*
	* The shape is deliberate: every step either completes or produces an outcome,
	* and only this function decides what to undo. There is no path that rolls
	* back from inside a step, and no path that rolls back an outcome the engine
	* could not establish.
	*/
	function runReceipt(deps, plan) {
		return __awaiter$1(this, void 0, void 0, function() {
			var created, outcome, posted, error_5, remaining;
			return __generator$1(this, function(_a) {
				switch (_a.label) {
					case 0:
						created = [];
						_a.label = 1;
					case 1:
						_a.trys.push([
							1,
							5,
							,
							6
						]);
						return [4, createEquipmentRecords(deps, plan, created)];
					case 2:
						_a.sent();
						return [4, postWarehouseMessage(deps, plan)];
					case 3:
						posted = _a.sent();
						return [4, processAndConfirm(deps, posted)];
					case 4:
						outcome = _a.sent();
						return [3, 6];
					case 5:
						error_5 = _a.sent();
						outcome = {
							kind: "failed",
							msgn: "",
							message: extractErrorMessage(error_5, "Receipt")
						};
						return [3, 6];
					case 6:
						if (outcome.kind === "posted") {
							deps.log.Info("Receipt posted as message " + outcome.msgn);
							return [2, {
								outcome,
								createdEquipment: created,
								rolledBack: false
							}];
						}
						if (outcome.kind === "indeterminate") {
							deps.log.Error("Receipt outcome unknown: " + outcome.message);
							return [2, {
								outcome,
								createdEquipment: created,
								rolledBack: false
							}];
						}
						deps.log.Error("Receipt failed: " + outcome.message);
						return [4, rollbackEquipment(deps, created)];
					case 7:
						remaining = _a.sent();
						return [2, {
							outcome,
							createdEquipment: remaining,
							rolledBack: created.length > 0
						}];
				}
			});
		});
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/receiving-policy.js
	/**
	* Receiving policy: when M3 wants a lot/serial number typed in, and how the
	* item's lot control method shapes the receipt.
	*
	* Unlike serial-policy.ts, this is NOT extracted from POReceiptShortcutV6 —
	* V6 has no equivalent. The predicates below are ported from M3's own
	* PPS300 business logic (PPS300_MVX.java, AutoLotNo() and ManualLotNo()), so
	* that the script asks for input exactly when the program it is driving would.
	*
	* V6 prompts for a serial or lot on every controlled item regardless of the
	* numbering method. For any customer whose items use automatic lot numbering
	* that asks the operator to invent a number M3 was going to generate.
	*/
	var LotControl = {
		/** Lot control not used. */
		NONE: "0",
		/** Used; lots do NOT need to exist in the lot master beforehand. */
		LOT_UNREGISTERED: "1",
		/** Used; all lots in the lot master, and each lot number IS a serial number. */
		SERIAL: "2",
		/** Used; all lots must exist in the lot master. */
		LOT_REGISTERED: "3",
		/** Used; all lots in the lot master, with a serial specification per lot. */
		LOT_WITH_SERIAL_SPEC: "5"
	};
	/**
	* MITMAS.BACD values that mean M3 generates the number itself.
	*
	* Ported from PPS300_MVX.java AutoLotNo():
	*     BACD >= 1 && BACD <= 4 || BACD == 6 || BACD == 7
	*
	* Note 4 ("goods receiving number generated during goods receipt, but this
	* must be entered manually") counts as automatic in M3's own grouping. That
	* reads contradictory, but it is M3's rule and is reproduced rather than
	* second-guessed.
	*/
	function isAutoNumberingMethod(bacd) {
		return bacd >= 1 && bacd <= 4 || bacd === 6 || bacd === 7;
	}
	/** True when M3 generates the lot/serial number, so the operator must not. */
	function autoLotNo(indi, bacd) {
		if (indi === LotControl.NONE) return false;
		return isAutoNumberingMethod(bacd);
	}
	/**
	* Which collection flow the item needs.
	*
	* V6 branched on '2' and '3' only, so INDI 1 and 5 fell through to the
	* uncontrolled path and skipped lot handling entirely. Both are lot-controlled.
	*/
	function classifyReceiptMode(indi) {
		switch (indi) {
			case LotControl.SERIAL: return "serial";
			case LotControl.LOT_UNREGISTERED:
			case LotControl.LOT_REGISTERED:
			case LotControl.LOT_WITH_SERIAL_SPEC: return "lot";
			default: return "plain";
		}
	}
	/**
	* Whether the lot has to already exist in the lot master.
	*
	* Drives what "lot not found" means: for INDI 1 a missing lot is normal and
	* gets created, for 2/3/5 it is an error.
	*/
	function lotMustPreExist(indi) {
		return indi === LotControl.SERIAL || indi === LotControl.LOT_REGISTERED || indi === LotControl.LOT_WITH_SERIAL_SPEC;
	}
	/**
	* Direct put-away: M3 assigns the stock location itself, so the operator is
	* not asked for one and a blank location is not an error.
	*/
	function isDirectPutAway(dsto) {
		return dsto === 1;
	}
	/**
	* These are NOT the same rule as autoLotNo(), and conflating them is how V6
	* fails. PPS300 decides whether to PROMPT; MMS240MI decides what its Add
	* transaction will ACCEPT, and the two sets differ on BACD 4.
	*
	* MMS240MI_MVX.java, the Add transaction:
	*
	*   BACD 1,2,3,6,7  SERN must be blank; M3 generates it via RTVBAN().
	*                   Supplying one returns MM24031 "Serial number must be
	*                   blank, lot numbering method is &1" and Add returns early.
	*
	*   BACD 4,5,8,9    MM24032 "Adding serial number not permitted, lot
	*                   numbering method is &1". Add refuses outright.
	*
	*   BACD 0          Manual. SERN is required and accepted.
	*
	* So V6, which always supplies a SERN and always calls Add for INDI 2, only
	* works on BACD 0. Everything else fails at equipment creation and trips its
	* rollback path.
	*/
	/** BACD values where MMS240MI/Add rejects a supplied SERN (MM24031). */
	var SERN_MUST_BE_BLANK = [
		1,
		2,
		3,
		6,
		7
	];
	/** BACD values where MMS240MI/Add refuses entirely (MM24032). */
	var ADD_NOT_PERMITTED = [
		4,
		5,
		8,
		9
	];
	/** True when MMS240MI/Add will generate the serial and must not be given one. */
	function equipmentSerialMustBeBlank(bacd) {
		return SERN_MUST_BE_BLANK.indexOf(bacd) !== -1;
	}
	/** True when MMS240MI/Add cannot be used for this item at all. */
	function equipmentAddPermitted(bacd) {
		return ADD_NOT_PERMITTED.indexOf(bacd) === -1;
	}
	/**
	* How equipment creation must be approached for an item.
	*
	* Returning 'skip' is not a failure: for BACD 4/5/8/9 the receipt still posts
	* through MHS850, there simply is no MMS240 record to pre-create.
	*/
	function planEquipmentCreation(indi, bacd) {
		if (classifyReceiptMode(indi) !== "serial") return "skip";
		if (!equipmentAddPermitted(bacd)) return "skip";
		return equipmentSerialMustBeBlank(bacd) ? "add-generated-serial" : "add-with-serial";
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/selection-policy.js
	/**
	* Which PPS300/B line the script is allowed to act on.
	*
	* Both POReceiptShortcutV4 (live) and V6 read the line identity through
	* `ScriptUtil.GetFieldValue('PNLI' | 'PNLS' | 'ITNO' | 'WHSL')`, which returns
	* the CURRENT row. Neither looks at the selection. So with three lines
	* selected the script receives one of them and reports success, while the
	* operator believes all three went through. There is no guard for this
	* anywhere in either version.
	*
	* Policy, confirmed with the owner:
	*   - block any explicit multi-selection, uniformly — not just for
	*     lot/serial items. Differing locations is one failure mode; differing
	*     UoM, differing items and partial-receipt semantics are others, and one
	*     refusal is safer than three conditional ones.
	*   - keep today's behaviour when exactly one line is addressable.
	*   - never auto-select a row. Auto-selecting and then posting a goods receipt
	*     is how a receipt lands on the wrong line, and unwinding one costs far
	*     more than the click it saves.
	*
	* Pure: the H5 adapter reads the selection via IActiveGrid.getSelectedGridRows()
	* and passes the count in.
	*/
	var PROCEED = {
		outcome: "proceed",
		reason: ""
	};
	/**
	* @param selectedRowCount  rows the operator explicitly selected. A grid with
	*                          a merely focused row reports 0 here.
	* @param hasAddressableLine whether the panel yields a usable line identity
	*                          (PNLI/PNLS present on the current row).
	*/
	function evaluateSelection(selectedRowCount, hasAddressableLine) {
		if (selectedRowCount > 1) return {
			outcome: "blocked",
			reason: "This shortcut receives one order line at a time. " + selectedRowCount + " lines are selected — select a single line and run it again."
		};
		if (!hasAddressableLine) return {
			outcome: "blocked",
			reason: "No order line is selected. Select the line to receive, then run the shortcut again."
		};
		return PROCEED;
	}
	//#endregion
	//#region Projects/General/H5-Scripts/POReceiptShortcut/build/index.js
	/**
	* POReceiptShortcutV7 — PO receipt shortcut for PPS300/B.
	*
	* Receives a purchase order line from the panel the operator is already
	* looking at: reads the line, works out what M3 needs collected for it,
	* collects it, pre-creates equipment records for serialised items, and posts
	* the receipt as an MHS850 warehouse transaction.
	*
	* Customer agnostic. Every tenant-specific value is a script argument, and an
	* unsupplied optional feature is skipped rather than guessed at. See
	* CONFIGURATION.md.
	*
	* The class name has to match the file the H5 loader deploys, and the top
	* level has to be `var` — the bundle emits `var POReceiptShortcutV7 = (...)()`,
	* which satisfies both. The V7 suffix is forced by that deploy model, not
	* chosen: H5 keys on filename, so V4 and V7 cannot share one name during
	* cutover.
	*/
	var __awaiter = function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __generator = function(thisArg, body) {
		var _ = {
			label: 0,
			sent: function() {
				if (t[0] & 1) throw t[1];
				return t[1];
			},
			trys: [],
			ops: []
		}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
		return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
			return this;
		}), g;
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (g && (g = 0, op[0] && (_ = 0)), _) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0:
					case 1:
						t = op;
						break;
					case 4:
						_.label++;
						return {
							value: op[1],
							done: false
						};
					case 5:
						_.label++;
						y = op[1];
						op = [0];
						continue;
					case 7:
						op = _.ops.pop();
						_.trys.pop();
						continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
							_ = 0;
							continue;
						}
						if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
							_.label = op[1];
							break;
						}
						if (op[0] === 6 && _.label < t[1]) {
							_.label = t[1];
							t = op;
							break;
						}
						if (t && _.label < t[2]) {
							_.label = t[2];
							_.ops.push(op);
							break;
						}
						if (t[2]) _.ops.pop();
						_.trys.pop();
						continue;
				}
				op = body.call(thisArg, _);
			} catch (e) {
				op = [6, e];
				y = 0;
			} finally {
				f = t = 0;
			}
			if (op[0] & 5) throw op[1];
			return {
				value: op[0] ? op[1] : void 0,
				done: true
			};
		}
	};
	var __values = function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var SCRIPT_NAME = "POReceiptShortcutV7";
	/**
	* The operator's entered quantity.
	*
	* Read through the controller, not ScriptUtil.GetFieldValue: RVQA is an input
	* on the detail panel rather than a header field, and GetFieldValue does not
	* see it. V6 used controller.GetValue('RVQA') for exactly this reason.
	*/
	var ENTERED_QUANTITY_FIELD = "RVQA";
	/** PPS300/B field names. WW-prefixed fields are the panel header. */
	var PANEL_FIELDS = {
		PUNO: "WWPUNO",
		SUNO: "WWSUNO",
		WHLO: "WWWHLO",
		PNLI: "PNLI",
		PNLS: "PNLS",
		WHSL: "WHSL",
		ITNO: "ITNO",
		OEND: "OEND"
	};
	var POReceiptShortcutV7 = function() {
		function class_1(args) {
			this.controller = args.controller;
			this.log = args.log;
			this.rawArgs = args.args || "";
		}
		/**
		* Script entry point. H5 calls this every time the operator runs the
		* shortcut, and each call performs one receipt.
		*
		* There is deliberately no InstanceCache guard. V7 had one, on the theory
		* that it stopped handlers stacking across panel visits — but this script
		* attaches no handler for the receipt, it runs the flow inline. All the
		* guard did was make the second and every later run exit early with
		* "already attached", so one panel instance could receive exactly once.
		* V6, which runs in production, has no guard here either.
		*/
		class_1.Init = function(args) {
			try {
				new POReceiptShortcutV7(args).start();
			} catch (error) {
				args.log.Error(SCRIPT_NAME + " failed to start: " + (error && error.message || error));
			}
		};
		class_1.prototype.start = function() {
			var e_1, _a;
			var parsed = buildConfig(this.rawArgs);
			try {
				for (var _b = __values(parsed.unknownKeys), _c = _b.next(); !_c.done; _c = _b.next()) {
					var key = _c.value;
					this.log.Warning("Ignoring unknown script argument \"" + key + "\"");
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
			if (parsed.errors.length > 0) {
				this.log.Error(SCRIPT_NAME + " configuration rejected");
				showError("This shortcut is not configured correctly.\n\n" + parsed.errors.join("\n\n"));
				return;
			}
			this.config = parsed.config;
			this.execute = createExecutor(readCompanyContext(this.log), this.log);
			this.run();
		};
		class_1.prototype.run = function() {
			return __awaiter(this, void 0, void 0, function() {
				var identity, entered, readStartedAt, context, remaining, proceed, collected, confirmed, postStartedAt, error_1, message;
				var _this = this;
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0:
							identity = this.readIdentity();
							if (!identity) return [2];
							entered = this.readEnteredQuantity();
							if (!entered) return [2];
							_a.label = 1;
						case 1:
							_a.trys.push([
								1,
								8,
								,
								10
							]);
							readStartedAt = Date.now();
							return [4, withBusyIndicator(this.controller, function() {
								return _this.loadLine(identity, entered);
							})];
						case 2:
							context = _a.sent();
							this.log.Debug("Reading the line took " + (Date.now() - readStartedAt) + "ms");
							if (!context) return [2];
							remaining = Number(context.remaining || "0");
							if (!(remaining > 0 && Number(entered) > remaining)) return [3, 4];
							return [4, confirm(DIALOG_TITLES.confirmReceipt, "This line has " + context.remaining + " outstanding, but " + entered + " has been entered — an over-receipt of " + (Number(entered) - remaining) + ". Receive anyway?")];
						case 3:
							proceed = _a.sent();
							if (!proceed) {
								this.log.Info("Receipt cancelled by the operator");
								return [2];
							}
							_a.label = 4;
						case 4: return [4, this.collect(identity, context)];
						case 5:
							collected = _a.sent();
							if (!collected) {
								this.log.Info("Receipt cancelled by the operator");
								return [2];
							}
							return [4, confirm(DIALOG_TITLES.confirmReceipt, this.describeIntent(identity, collected, entered))];
						case 6:
							confirmed = _a.sent();
							if (!confirmed) {
								this.log.Info("Receipt cancelled by the operator");
								return [2];
							}
							postStartedAt = Date.now();
							return [4, this.post(identity, context, collected)];
						case 7:
							_a.sent();
							this.log.Debug("Posting took " + (Date.now() - postStartedAt) + "ms");
							return [3, 10];
						case 8:
							error_1 = _a.sent();
							message = error_1 && error_1.message || String(error_1);
							this.log.Error(SCRIPT_NAME + ": " + message);
							return [4, showError(message)];
						case 9:
							_a.sent();
							return [3, 10];
						case 10: return [2];
					}
				});
			});
		};
		/**
		* Reads the quantity the operator typed into RVQA.
		*
		* V7 used the line's outstanding quantity (RSTQ) here, which meant every
		* receipt took the whole line no matter what was entered. RSTQ is what is
		* LEFT on the line; RVQA is what the operator is receiving now.
		*/
		class_1.prototype.readEnteredQuantity = function() {
			var raw = "";
			try {
				var value = this.controller.GetValue(ENTERED_QUANTITY_FIELD);
				raw = value === void 0 || value === null ? "" : String(value).trim();
			} catch (error) {
				this.log.Warning("Could not read " + ENTERED_QUANTITY_FIELD + ": " + (error && error.message || error));
			}
			var quantity = Number(raw);
			if (!raw || !isFinite(quantity) || quantity <= 0) {
				var reason = "Enter the quantity to receive in the Received quantity field, then run this shortcut again.";
				this.log.Warning("RVQA is missing or not a positive number: \"" + raw + "\"");
				showMessage(DIALOG_TITLES.warning, reason, "Warning");
				return null;
			}
			return raw;
		};
		/**
		* Reads the line the operator means, refusing anything ambiguous.
		*
		* V4 and V6 both read the CURRENT row and never look at the selection, so
		* with three lines selected they receive one and report success.
		*/
		class_1.prototype.readIdentity = function() {
			var _this = this;
			var field = function(name) {
				return (ScriptUtil.GetFieldValue(name, _this.controller) || "").trim();
			};
			var identity = {
				PUNO: field(PANEL_FIELDS.PUNO),
				SUNO: field(PANEL_FIELDS.SUNO),
				WHLO: field(PANEL_FIELDS.WHLO),
				PNLI: field(PANEL_FIELDS.PNLI),
				PNLS: field(PANEL_FIELDS.PNLS),
				WHSL: field(PANEL_FIELDS.WHSL),
				ITNO: field(PANEL_FIELDS.ITNO),
				OEND: field(PANEL_FIELDS.OEND)
			};
			var verdict = evaluateSelection(readSelectedRows(this.controller.GetGrid()).length, !!(identity.PNLI && identity.ITNO));
			if (verdict.outcome === "blocked") {
				this.log.Warning(verdict.reason);
				showMessage(DIALOG_TITLES.warning, verdict.reason, "Warning");
				return null;
			}
			var missing = findMissingFields({
				"Purchase order": identity.PUNO,
				"Line number": identity.PNLI,
				Warehouse: identity.WHLO,
				Item: identity.ITNO
			});
			if (missing.length > 0) {
				var reason = "This line is missing " + missing.join(", ") + ". Open the order line in PPS300 and try again.";
				this.log.Warning(reason);
				showMessage(DIALOG_TITLES.warning, reason, "Warning");
				return null;
			}
			return identity;
		};
		/** Stage 1 and the conditional stage 2 reads. */
		class_1.prototype.loadLine = function(identity, enteredQuantity) {
			return __awaiter(this, void 0, void 0, function() {
				var raw, indi, bacd, grmt, crbn, dsto, method, item, customerNumber, order, proceed;
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0: return [4, fetchLineData(this.execute, identity.PUNO, identity.PNLI, identity.PNLS, identity.ITNO)];
						case 1:
							raw = _a.sent();
							indi = raw.basic.INDI || "0";
							bacd = Number(raw.basic.BACD || "0");
							grmt = raw.basic.GRMT || "";
							crbn = 0;
							dsto = Number(raw.basic.DSTO || "0");
							if (!grmt) return [3, 3];
							return [4, this.execute(specReceivingMethod(grmt))];
						case 2:
							method = _a.sent();
							item = method && method.item || {};
							crbn = Number(item.CRBN || "0");
							if (item.DSTO) dsto = Number(item.DSTO);
							_a.label = 3;
						case 3:
							customerNumber = "";
							if (!(raw.line.RORC === "3" && raw.line.RORN)) return [3, 5];
							return [4, this.execute(specCustomerOrder(raw.line.RORN))];
						case 4:
							order = _a.sent();
							customerNumber = (order && order.item || {}).CUNO || "";
							_a.label = 5;
						case 5:
							if (!this.config.wmsCheckEnabled) return [3, 7];
							return [4, this.checkWmsWarehouse(identity.WHLO)];
						case 6:
							proceed = _a.sent();
							if (!proceed) return [2, null];
							_a.label = 7;
						case 7: return [2, {
							poLine: buildLineContext(raw, identity, customerNumber),
							indi,
							bacd,
							dsto,
							crbn,
							quantity: enteredQuantity,
							remaining: raw.basic.RSTQ || "",
							defaultLocation: raw.basic.WHSL || "",
							purchaseUnit: raw.basic.PUUN || "",
							expiryRequired: (raw.item.EXPD || "") !== "" && raw.item.EXPD !== "0"
						}];
					}
				});
			});
		};
		/**
		* Warns before receiving into a WMS-managed warehouse outside WMS.
		*
		* Off unless configured: most M3 customers do not run WMS, and V6 ran this
		* check unconditionally against a warehouse group name compiled into it.
		*/
		class_1.prototype.checkWmsWarehouse = function(whlo) {
			return __awaiter(this, void 0, void 0, function() {
				var response;
				return __generator(this, function(_b) {
					switch (_b.label) {
						case 0:
							_b.trys.push([
								0,
								2,
								,
								3
							]);
							return [4, this.execute(specWarehouseGroup(this.config.warehouseGroup, whlo))];
						case 1:
							response = _b.sent();
							if (toItems(response).length === 0) return [2, true];
							return [3, 3];
						case 2:
							_b.sent();
							this.log.Warning("WMS warehouse check could not be completed; continuing");
							return [2, true];
						case 3: return [2, confirm(DIALOG_TITLES.warning, "Warehouse " + whlo + " is managed by WMS. Receiving it here bypasses WMS putaway. Continue anyway?", "Warning")];
					}
				});
			});
		};
		class_1.prototype.collect = function(identity, context) {
			return __awaiter(this, void 0, void 0, function() {
				var mode, quantity;
				return __generator(this, function(_a) {
					mode = classifyReceiptMode(context.indi);
					quantity = Number(context.quantity || "0");
					if (mode === "plain") return [2, {
						mode,
						lines: [{ RVQA: context.quantity }],
						serials: []
					}];
					if (autoLotNo(context.indi, context.bacd)) {
						this.log.Info("M3 generates the number for this item (BACD " + context.bacd + "); none collected");
						return [2, {
							mode,
							lines: [{ RVQA: context.quantity }],
							serials: []
						}];
					}
					return [2, mode === "serial" ? this.collectSerials(identity, context, quantity) : this.collectLot(identity, context)];
				});
			});
		};
		class_1.prototype.collectSerials = function(identity, context, quantity) {
			return __awaiter(this, void 0, void 0, function() {
				var count, maxLength, values, now, entries, entries_1, entries_1_1, entry, e_2_1;
				var e_2, _a;
				return __generator(this, function(_b) {
					switch (_b.label) {
						case 0:
							count = Math.min(Math.max(Math.round(quantity) || 1, 1), this.config.maxSerials);
							if (!(quantity > this.config.maxSerials)) return [3, 2];
							return [4, showMessage(DIALOG_TITLES.warning, "This line is for " + quantity + " units, and this shortcut collects at most " + this.config.maxSerials + " serials at a time. Receive the rest in PPS300, or raise maxserials in the script arguments.", "Warning")];
						case 1:
							_b.sent();
							return [2, null];
						case 2:
							maxLength = canStoreOversizeSerial(this.config) ? 60 : 40;
							return [4, promptSerials({
								count,
								maxLength,
								itemNumber: identity.ITNO,
								today: todayAsM3Date()
							})];
						case 3:
							values = _b.sent();
							if (!values) return [2, null];
							now = /* @__PURE__ */ new Date();
							entries = prepareSerialEntries(values, generateEpochSeed(now.getTime()), now);
							_b.label = 4;
						case 4:
							_b.trys.push([
								4,
								9,
								10,
								11
							]);
							entries_1 = __values(entries), entries_1_1 = entries_1.next();
							_b.label = 5;
						case 5:
							if (!!entries_1_1.done) return [3, 8];
							entry = entries_1_1.value;
							if (!(entry.originalSerial.length <= 20)) return [3, 7];
							return [4, lotOrSerialExists(this.execute, identity.ITNO, entry.derivedSerial)];
						case 6:
							if (_b.sent()) throw new Error("Serial " + entry.originalSerial + " already exists for item " + identity.ITNO + ".");
							_b.label = 7;
						case 7:
							entries_1_1 = entries_1.next();
							return [3, 5];
						case 8: return [3, 11];
						case 9:
							e_2_1 = _b.sent();
							e_2 = { error: e_2_1 };
							return [3, 11];
						case 10:
							try {
								if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
							} finally {
								if (e_2) throw e_2.error;
							}
							return [7];
						case 11: return [2, {
							mode: "serial",
							serials: entries.map(function(e) {
								return e.derivedSerial;
							}),
							entries,
							lines: entries.map(function(entry) {
								return {
									RVQA: "1",
									BANO: entry.derivedSerial
								};
							})
						}];
					}
				});
			});
		};
		class_1.prototype.collectLot = function(identity, context) {
			return __awaiter(this, void 0, void 0, function() {
				var result, exists;
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0: return [4, promptLot({
							itemNumber: identity.ITNO,
							expiryRequired: context.expiryRequired,
							today: todayAsM3Date()
						})];
						case 1:
							result = _a.sent();
							if (!result) return [2, null];
							if (!lotMustPreExist(context.indi)) return [3, 3];
							return [4, lotOrSerialExists(this.execute, identity.ITNO, result.lot)];
						case 2:
							exists = _a.sent();
							if (!exists) throw new Error("Lot " + result.lot + " does not exist for item " + identity.ITNO + ". Create it in MMS235 first, or receive the line in PPS300.");
							_a.label = 3;
						case 3: return [2, {
							mode: "lot",
							serials: [],
							lot: result.lot,
							expiry: result.expiry,
							lines: [{
								RVQA: context.quantity,
								BANO: result.lot,
								EXPI: result.expiry
							}]
						}];
					}
				});
			});
		};
		class_1.prototype.post = function(identity, context, collected) {
			return __awaiter(this, void 0, void 0, function() {
				var location, plan, result;
				var _this = this;
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0:
							location = isDirectPutAway(context.dsto) ? "" : identity.WHSL || context.defaultLocation;
							plan = {
								lines: collected.lines,
								entries: collected.entries || [],
								equipmentPlan: planEquipmentCreation(context.indi, context.bacd),
								poLine: context.poLine,
								line: {
									WHLO: identity.WHLO,
									ITNO: identity.ITNO,
									PUUN: context.purchaseUnit,
									PUNO: identity.PUNO,
									PNLI: identity.PNLI,
									PNLS: identity.PNLS,
									WHSL: location,
									OEND: identity.OEND,
									PROD: context.poLine.PROD
								}
							};
							return [4, withBusyIndicator(this.controller, function() {
								return runReceipt({
									execute: _this.execute,
									log: _this.log,
									config: _this.config,
									retry: {
										maxAttempts: 3,
										delay,
										random: Math.random
									},
									delay,
									reference: SCRIPT_NAME
								}, plan);
							})];
						case 1:
							result = _a.sent();
							if (!(result.outcome.kind === "posted")) return [3, 3];
							return [4, showMessage(DIALOG_TITLES.success, buildReceiptSummary({
								mode: collected.mode,
								serials: collected.serials,
								lot: collected.lot,
								expiry: collected.expiry,
								quantity: Number(context.quantity || "0"),
								location
							}))];
						case 2:
							_a.sent();
							this.refresh();
							return [2];
						case 3: return [4, showError(result.outcome.message)];
						case 4:
							_a.sent();
							return [2];
					}
				});
			});
		};
		/** Refreshes the panel so the operator sees the new quantity. */
		class_1.prototype.refresh = function() {
			try {
				this.controller.PressKey("F5");
			} catch (error) {
				this.log.Warning("Could not refresh the panel: " + (error && error.message || error));
			}
		};
		class_1.prototype.describeIntent = function(identity, collected, quantity) {
			var lines = [
				"Purchase order " + identity.PUNO + ", line " + identity.PNLI + ".",
				"Item " + identity.ITNO + ".",
				"Quantity " + quantity + "."
			];
			if (collected.mode === "serial") lines.push(collected.serials.length > 0 ? "Serials: " + collected.serials.join(", ") + "." : ASSIGNED_BY_M3.serial + ".");
			else if (collected.mode === "lot") {
				lines.push(collected.lot ? "Lot " + collected.lot + "." : ASSIGNED_BY_M3.lot + ".");
				if (collected.expiry) lines.push("Expiry " + collected.expiry + ".");
			}
			return lines.join("\n");
		};
		return class_1;
	}();
	/** M3 dates are yyyyMMdd. Never an ISO string. */
	function todayAsM3Date() {
		var now = /* @__PURE__ */ new Date();
		var pad = function(n) {
			return n < 10 ? "0" + n : String(n);
		};
		return String(now.getFullYear()) + pad(now.getMonth() + 1) + pad(now.getDate());
	}
	//#endregion
	return POReceiptShortcutV7;
})();

//# sourceMappingURL=POReceiptShortcutV7.js.map