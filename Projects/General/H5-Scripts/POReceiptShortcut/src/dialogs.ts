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
  maxLength: number,
  placeholder?: string
): { field: HTMLElement; input: HTMLInputElement } {
  const field = element('div', 'po-receipt-field');
  const label = element('label', 'inforLabel', labelText);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'inforTextBox';
  input.maxLength = maxLength;
  input.autocomplete = 'off';
  if (placeholder) input.placeholder = placeholder;
  // H5 swallows contextmenu on the panel beneath, which takes the native
  // paste menu with it. V6 stopped propagation for the same reason; operators
  // paste serials from a packing list.
  input.addEventListener('contextmenu', (event) => event.stopPropagation());
  field.appendChild(label);
  field.appendChild(input);
  return { field, input };
}

/**
 * Enter moves to the next field, and submits on the last one.
 *
 * Barcode scanners emit Enter after each scan, so without this a five-serial
 * receipt means clicking into every field by hand. `submit` is the same code
 * the OK button runs.
 */
function wireEnterKey(inputs: HTMLInputElement[], submit: () => void): void {
  inputs.forEach((input, index) => {
    input.addEventListener('keydown', (event) => {
      if ((event as KeyboardEvent).key !== 'Enter') return;
      event.preventDefault();
      const next = inputs[index + 1];
      if (next) {
        next.focus();
        // The list scrolls once there are more serials than fit.
        if (typeof next.scrollIntoView === 'function') {
          next.scrollIntoView({ block: 'nearest' });
        }
      } else {
        submit();
      }
    });
  });
}

/**
 * Copies text without depending on the async Clipboard API, which H5 runs in
 * an iframe where it is often blocked. Same approach V6 used.
 */
function copyText(value: string): void {
  const area = document.createElement('textarea');
  area.value = value;
  area.setAttribute('readonly', 'readonly');
  area.style.position = 'fixed';
  area.style.top = '-1000px';
  area.style.opacity = '0';
  document.body.appendChild(area);
  try {
    area.select();
    area.setSelectionRange(0, value.length);
    document.execCommand('copy');
  } catch {
    // Nothing to do: copying is a convenience, never a step the receipt needs.
  } finally {
    if (area.parentNode) area.parentNode.removeChild(area);
  }
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
  onClose: () => void,
  closeOnEscape = true
): DialogHandle {
  ensureStyles();

  // The model is needed outside the button handlers too, so the Enter key can
  // submit. CreateDialogElement returns it, which is how V6 closed its own
  // dialogs; the guard is there because H5Dialog is untyped.
  let model: any = null;
  const closeModel = (): void => {
    if (model && typeof model.close === 'function') model.close();
  };

  model = H5ControlUtil.H5Dialog.CreateDialogElement(content, {
    title,
    dialogType: 'General',
    modal: true,
    width: 460,
    minHeight: 200,
    closeOnEscape,
    close: onClose,
    buttons: buttons.map((button) => ({
      text: button.text,
      isDefault: !!button.isDefault,
      width: 90,
      click: (_event: any, buttonModel: any) => {
        // The model handed to a click is known good; prefer it.
        model = buttonModel || model;
        button.click({ close: closeModel });
      },
    })),
  });

  return { close: closeModel };
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
  /** Seeds the generated serials, as V6 did: PUNO-1, PUNO-2, … */
  poNumber: string;
  /**
   * Whether the "Generate serials" shortcut is offered.
   *
   * Only for BACD 0, the one numbering method where M3 requires and accepts an
   * operator-supplied SERN. This dialog also opens for BACD 5, 8 and 9, where
   * MMS240MI/Add refuses outright (MM24032) and equipment creation is skipped
   * — filling those with PUNO-1, PUNO-2 would fabricate serials M3 never
   * expected anyone to assign. Typing one is a decision; having the script
   * invent five is not.
   */
  allowGenerate: boolean;
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
      const { field, input } = labelledInput(
        'Serial ' + (i + 1),
        options.maxLength,
        'max ' + options.maxLength + ' characters'
      );
      list.appendChild(field);
      inputs.push(input);
    }
    if (options.allowGenerate) {
      // Text label, not V6's emoji: dialogType carries the iconography and
      // emoji do not survive high contrast.
      const tools = element('div', 'po-receipt-tools');

      const generate = element('button', 'po-receipt-tool', 'Generate serials');
      (generate as HTMLButtonElement).type = 'button';
      generate.addEventListener('click', () => {
        inputs.forEach((input, index) => {
          input.value = options.poNumber + '-' + (index + 1);
          const field = input.parentElement;
          if (field) field.className = 'po-receipt-field';
        });
        message.className = 'po-receipt-message po-receipt-message--success';
        message.textContent =
          'Filled ' + inputs.length + ' serials from ' + options.poNumber + '.';
        message.style.display = '';
        if (inputs.length > 0) inputs[0].focus();
      });
      tools.appendChild(generate);

      const copy = element('button', 'po-receipt-tool', 'Copy PO number');
      (copy as HTMLButtonElement).type = 'button';
      copy.addEventListener('click', () => copyText(options.poNumber));
      tools.appendChild(copy);

      form.insertBefore(tools, list);
    }

    form.appendChild(list);

    const finish = settleOnce<string[]>(resolve);

    let dialog: DialogHandle | null = null;
    const submit = (): void => {
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
        message.className = 'po-receipt-message po-receipt-message--error';
        message.textContent = text;
        message.style.display = '';
        return; // stay open; the operator keeps what they typed
      }
      // finish BEFORE close. model.close() fires the dialog's `close`
      // callback synchronously, which calls finish(null); settling the real
      // value first makes that a no-op instead of a cancellation.
      finish(values);
      if (dialog) dialog.close();
    };

    dialog = openDialog(
      form,
      DIALOG_TITLES.serialEntry,
      [
        { text: 'OK', isDefault: true, click: () => submit() },
        { text: 'Cancel', click: (handle) => handle.close() },
      ],
      () => finish(null)
    );

    wireEnterKey(inputs, submit);
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

    const lotField = labelledInput('Lot number', 20, 'Enter lot number');
    form.appendChild(lotField.field);

    const expiryField = labelledInput(
      'Expiration date (YYYYMMDD)' + (options.expiryRequired ? '' : ' — optional'),
      8,
      'YYYYMMDD'
    );
    form.appendChild(expiryField.field);

    const finish = settleOnce<LotPromptResult>(resolve);

    let dialog: DialogHandle | null = null;
    const submit = (): void => {
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
      if (dialog) dialog.close();
    };

    dialog = openDialog(
      form,
      DIALOG_TITLES.lotEntry,
      [
        { text: 'OK', isDefault: true, click: () => submit() },
        { text: 'Cancel', click: (handle) => handle.close() },
      ],
      () => finish(null)
    );

    // Enter on the lot field moves to the expiry, and submits from there.
    wireEnterKey([lotField.input, expiryField.input], submit);
    lotField.input.focus();
  });
}

export interface ProgressHandle {
  /** Marks the named step done and moves the bar on. */
  step(label: string): void;
  /** Fills the bar and dismisses it. */
  done(): void;
  /** Dismisses without completing, for a failure. */
  close(): void;
}

/**
 * A stepped progress dialog, as V6 had.
 *
 * A receipt is several MI round trips, and a bare spinner says nothing about
 * which one is running or whether it is stuck. `steps` is the expected count,
 * used only to size the bar; an extra step past it just holds at full.
 */
export function openProgress(steps: number): ProgressHandle {
  ensureStyles();

  const form = element('div', 'po-receipt-form');
  const label = element('div', 'po-receipt-progress-msg', 'Starting…');
  const track = element('div', 'po-receipt-progress-track');
  const fill = element('div', 'po-receipt-progress-fill');
  track.appendChild(fill);
  form.appendChild(label);
  form.appendChild(track);

  // closeOnEscape false: dismissing this would hide a receipt that is still
  // in flight, and there is no button because there is nothing to decide.
  const dialog = openDialog(form, DIALOG_TITLES.progress, [], () => undefined, false);

  let index = 0;
  const total = Math.max(steps, 1);

  return {
    step(text: string): void {
      index++;
      fill.style.width = Math.min(Math.round((index / total) * 100), 100) + '%';
      label.textContent = text;
    },
    done(): void {
      fill.style.width = '100%';
      label.textContent = 'Done';
      dialog.close();
    },
    close(): void {
      dialog.close();
    },
  };
}
