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

import { DIALOG_STYLES, DIALOG_TITLES, buildValidationMessage } from './presentation';
import { validateExpirationDate, validateLotNumber, validateSerialBatch } from './validation';

const STYLE_ELEMENT_ID = 'po-receipt-shortcut-styles';

/** Injects the stylesheet once per page rather than inline on every element. */
function ensureStyles(): void {
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.appendChild(document.createTextNode(DIALOG_STYLES));
  document.head.appendChild(style);
}

function element(tag: string, className?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  // createTextNode, never innerHTML: the caller's text may be operator input.
  if (text) node.appendChild(document.createTextNode(text));
  return node;
}

function labelledInput(
  labelText: string,
  maxLength: number
): { field: HTMLElement; input: HTMLInputElement } {
  const field = element('div', 'po-receipt-field');
  const label = element('label', 'inforLabel', labelText);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'inforTextBox';
  input.maxLength = maxLength;
  input.autocomplete = 'off';
  field.appendChild(label);
  field.appendChild(input);
  return { field, input };
}

interface DialogHandle {
  close(): void;
}

/**
 * Opens an H5 dialog around a built element.
 *
 * `buttons[].click` receives the dialog model, which is how the dialog is
 * dismissed. V6 instead reached into `.ui-dialog-buttonpane` and matched
 * buttons by their visible label text — the same internal-DOM coupling the
 * repo's own rules ban for panels.
 */
function openDialog(
  content: HTMLElement,
  title: string,
  buttons: Array<{ text: string; isDefault?: boolean; click: (h: DialogHandle) => void }>,
  onClose: () => void
): void {
  ensureStyles();
  H5ControlUtil.H5Dialog.CreateDialogElement(content, {
    title,
    dialogType: 'General',
    modal: true,
    width: 460,
    minHeight: 200,
    closeOnEscape: true,
    close: onClose,
    buttons: buttons.map((button) => ({
      text: button.text,
      isDefault: !!button.isDefault,
      width: 90,
      click: (_event: any, model: any) => button.click({ close: () => model.close() }),
    })),
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
export function settleOnce<T>(resolve: (value: T | null) => void): (value: T | null) => void {
  let settled = false;
  return (value: T | null): void => {
    if (settled) return;
    settled = true;
    resolve(value);
  };
}

export interface SerialPromptOptions {
  /** How many serials to collect — the received quantity. */
  count: number;
  /** Longest serial the operator may enter, given where it can be stored. */
  maxLength: number;
  itemNumber: string;
  /** Today, as yyyyMMdd. Injected rather than read from the clock here. */
  today: string;
}

/**
 * Collects serial numbers.
 *
 * Validation runs on OK rather than per keystroke, and the dialog stays open
 * with the offending fields marked so the operator does not lose the ones they
 * already typed.
 */
export function promptSerials(
  options: SerialPromptOptions
): Promise<string[] | null> {
  return new Promise((resolve) => {
    const form = element('div', 'po-receipt-form');
    form.appendChild(
      element(
        'div',
        'po-receipt-header',
        'Item ' + options.itemNumber + ' — enter ' + options.count +
          (options.count === 1 ? ' serial number' : ' serial numbers')
      )
    );

    const message = element('div', 'po-receipt-message po-receipt-message--error');
    message.style.display = 'none';
    form.appendChild(message);

    const list = element('div', 'po-receipt-serials');
    const inputs: HTMLInputElement[] = [];
    for (let i = 0; i < options.count; i++) {
      const { field, input } = labelledInput('Serial ' + (i + 1), options.maxLength);
      list.appendChild(field);
      inputs.push(input);
    }
    form.appendChild(list);

    const finish = settleOnce<string[]>(resolve);

    openDialog(
      form,
      DIALOG_TITLES.serialEntry,
      [
        {
          text: 'OK',
          isDefault: true,
          click: (handle) => {
            const values = inputs.map((input) => input.value.trim().toUpperCase());
            const result = validateSerialBatch(values, options.maxLength);

            inputs.forEach((input, index) => {
              const field = input.parentElement;
              if (!field) return;
              const bad = result.issues.some((issue) => issue.index === index);
              field.className =
                'po-receipt-field' + (bad ? ' po-receipt-field--invalid' : '');
            });

            const text = buildValidationMessage(
              result.issues, result.duplicates, options.maxLength
            );
            if (text) {
              message.textContent = text;
              message.style.display = '';
              return; // stay open; the operator keeps what they typed
            }
            // finish BEFORE close. model.close() fires the dialog's `close`
            // callback synchronously, which calls finish(null); settling the
            // real value first makes that a no-op instead of a cancellation.
            finish(values);
            handle.close();
          },
        },
        { text: 'Cancel', click: (handle) => handle.close() },
      ],
      () => finish(null)
    );

    if (inputs.length > 0) inputs[0].focus();
  });
}

export interface LotPromptOptions {
  itemNumber: string;
  /** Whether M3 requires an expiry for this item (MMS200MI/Get EXPD). */
  expiryRequired: boolean;
  /** Today, as yyyyMMdd. */
  today: string;
}

export interface LotPromptResult {
  lot: string;
  /** yyyyMMdd, or '' when the item carries no expiry. */
  expiry: string;
}

/** Collects a lot number, and an expiry when the item master requires one. */
export function promptLot(
  options: LotPromptOptions
): Promise<LotPromptResult | null> {
  return new Promise((resolve) => {
    const form = element('div', 'po-receipt-form');
    form.appendChild(
      element('div', 'po-receipt-header', 'Item ' + options.itemNumber)
    );

    const message = element('div', 'po-receipt-message po-receipt-message--error');
    message.style.display = 'none';
    form.appendChild(message);

    const lotField = labelledInput('Lot number', 20);
    form.appendChild(lotField.field);

    const expiryField = labelledInput(
      'Expiration date (YYYYMMDD)' + (options.expiryRequired ? '' : ' — optional'),
      8
    );
    form.appendChild(expiryField.field);

    const finish = settleOnce<LotPromptResult>(resolve);

    openDialog(
      form,
      DIALOG_TITLES.lotEntry,
      [
        {
          text: 'OK',
          isDefault: true,
          click: (handle) => {
            const lot = lotField.input.value.trim().toUpperCase();
            const expiry = expiryField.input.value.trim();

            const problem =
              validateLotNumber(lot) ||
              validateExpirationDate(
                expiry || null,
                options.expiryRequired || !!expiry,
                options.today
              );

            lotField.field.className =
              'po-receipt-field' + (validateLotNumber(lot) ? ' po-receipt-field--invalid' : '');

            if (problem) {
              message.textContent = problem;
              message.style.display = '';
              return;
            }
            // finish BEFORE close — see the note in promptSerials.
            finish({ lot, expiry });
            handle.close();
          },
        },
        { text: 'Cancel', click: (handle) => handle.close() },
      ],
      () => finish(null)
    );

    lotField.input.focus();
  });
}
