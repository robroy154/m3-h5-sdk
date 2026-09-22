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

/** Maps to IConfirmDialogOptions.dialogType. */
export type DialogType = 'Information' | 'Warning' | 'Error';

export interface ReceiptSummary {
  mode: 'serial' | 'lot' | 'plain';
  /** Derived serials actually posted. */
  serials?: string[];
  lot?: string;
  expiry?: string;
  quantity?: number;
  /** Blank when M3 assigned the location itself. */
  location?: string;
}

/**
 * What to say when the operator supplied no number because M3 generates it.
 * Printing a bare "Lot:" with nothing after it reads like a missing value.
 */
export const ASSIGNED_BY_M3 = {
  lot: 'Lot number assigned by M3',
  serial: 'Serial numbers assigned by M3',
};

function locationPhrase(location: string | undefined): string {
  return location ? 'to ' + location : 'to the location M3 assigned';
}

function plural(count: number, word: string): string {
  return count + ' ' + word + (count === 1 ? '' : 's');
}

/**
 * The success message.
 *
 * V6 rendered "(no location)" when WHSL was blank, which reads like something
 * went wrong. A blank location is normal under direct put-away, so it now says
 * what actually happened.
 */
export function buildReceiptSummary(summary: ReceiptSummary): string {
  const where = locationPhrase(summary.location);
  const units = plural(summary.quantity || 0, 'unit') + ' received ' + where;

  if (summary.mode === 'serial') {
    const serials = summary.serials || [];
    // No serials collected means M3 generated them (an automatic BACD). Saying
    // "0 serials received" would report a successful receipt as a failure.
    if (serials.length === 0) {
      return units + '.\n' + ASSIGNED_BY_M3.serial + '.';
    }
    return plural(serials.length, 'serial') + ' received ' + where +
      '.\nSerials: ' + serials.join(', ') + '.';
  }

  if (summary.mode === 'lot') {
    const lines = [
      units + '.',
      (summary.lot ? 'Lot ' + summary.lot : ASSIGNED_BY_M3.lot) + '.',
    ];
    if (summary.expiry) {
      lines.push('Expiry ' + summary.expiry + '.');
    }
    return lines.join('\n');
  }

  return units + '.';
}

/**
 * Titles carry no emoji.
 *
 * V6 used 📋 ⚠️ 🔄 📦 in dialog titles. `dialogType` already conveys severity
 * through H5's own iconography, which stays legible in high contrast and does
 * not depend on the operator's font having colour emoji.
 */
export const DIALOG_TITLES = {
  serialEntry: 'Enter serial numbers',
  lotEntry: 'Enter lot number',
  confirmReceipt: 'Confirm receipt',
  warning: 'Warning',
  error: 'Receipt failed',
  success: 'Receipt complete',
  progress: 'Processing order line',
} as const;

/**
 * Styles for the two custom form dialogs.
 *
 * Every colour resolves through an IDS token with V6's literal as the
 * fallback, so this is a strict improvement: themed where tokens exist,
 * unchanged where they do not. Injected once per dialog rather than repeated
 * inline on 30 elements as V6 did.
 */
export const DIALOG_STYLES = [
  '.po-receipt-form { padding: 15px; }',
  '.po-receipt-header {',
  '  margin-bottom: 10px; padding: 6px; border-radius: 3px; font-size: 12px;',
  '  background: var(--ids-color-background-secondary, #f5f5f5);',
  '  color: var(--ids-color-text-default, inherit);',
  '}',
  '.po-receipt-po-number {',
  '  flex: 1; padding: 3px 5px; font-family: monospace; font-size: 12px;',
  '  background: var(--ids-color-background-default, #fff);',
  '  border: 1px solid var(--ids-color-border-default, #ccc);',
  '}',
  '.po-receipt-action {',
  '  margin-left: 6px; padding: 3px 6px; border: none; border-radius: 2px;',
  '  cursor: pointer; font-size: 11px;',
  '  background: var(--ids-button-primary-color-background-default, #0072C6);',
  '  color: var(--ids-button-primary-color-text-default, #fff);',
  '}',
  '.po-receipt-action--generate {',
  '  background: var(--ids-alert-color-success-default, #2C8C3E);',
  '}',
  '.po-receipt-serials { max-height: 400px; overflow-y: auto; overflow-x: hidden; padding-right: 5px; }',
  '.po-receipt-tools { display: flex; gap: 6px; margin-bottom: 10px; }',
  '.po-receipt-tool {',
  '  padding: 4px 8px; border-radius: 2px; cursor: pointer; font-size: 12px;',
  '  color: var(--ids-button-primary-color-text-default, #fff);',
  '  background: var(--ids-button-primary-color-background-default, #0072C6);',
  '  border: 1px solid var(--ids-button-primary-color-border-default, #0072C6);',
  '}',
  '.po-receipt-field { margin-bottom: 10px; }',
  '.po-receipt-field input { width: 100%; text-transform: uppercase; }',
  '.po-receipt-field--invalid input {',
  '  border: 2px solid var(--ids-alert-color-error-default, #f44336);',
  '}',
  '.po-receipt-field--duplicate input {',
  '  border: 2px solid var(--ids-alert-color-warning-default, orange);',
  '}',
  '.po-receipt-message {',
  '  padding: 8px 12px; margin: 10px 0; border-radius: 4px; font-size: 12px;',
  '  white-space: pre-line;',
  '}',
  '.po-receipt-message--error {',
  '  background: var(--ids-alert-color-error-disabled, #ffebee);',
  '  border: 1px solid var(--ids-alert-color-error-default, #f44336);',
  '  color: var(--ids-alert-color-error-default, #c62828);',
  '}',
  '.po-receipt-message--success {',
  '  background: var(--ids-alert-color-success-disabled, #d4edda);',
  '  border: 1px solid var(--ids-alert-color-success-default, #c3e6cb);',
  '  color: var(--ids-alert-color-success-default, #155724);',
  '}',
  '.po-receipt-progress-msg {',
  '  margin-bottom: 10px;',
  '}',
  '.po-receipt-progress-track {',
  '  width: 100%; height: 18px; border-radius: 4px; overflow: hidden;',
  '  background: var(--ids-color-background-secondary, #ddd);',
  '}',
  '.po-receipt-progress-fill {',
  '  height: 100%; width: 0; transition: width .25s;',
  '  background: var(--ids-button-primary-color-background-default, #0072C6);',
  '}',
].join('\n');

/** Formats the validation feedback shown above the serial list. */
export function buildValidationMessage(
  issues: Array<{ label: string; reason: string }>,
  duplicates: string[],
  maxLength: number
): string {
  if (duplicates.length > 0) {
    return (
      'Duplicates detected: ' + duplicates.join(', ') +
      '\nEnsure each serial is unique.'
    );
  }
  if (issues.length > 0) {
    const listed = issues.map((i) => i.label + ' (' + i.reason + ')').join(', ');
    return (
      'Check these entries: ' + listed +
      '\nSerials may contain A-Z, 0-9 and hyphen, up to ' + maxLength + ' characters.'
    );
  }
  return '';
}
