/**
 * Turning MI failures into something a receiving clerk can act on.
 */

import { describeMiMessage, messageMatchesCatalogue } from './mi-messages';

/** Shape of the bits of IMIResponse this module reads. */
export interface MiErrorLike {
  errorMessage?: string;
  message?: string;
  errorCode?: string;
  errorField?: string;
  program?: string;
  transaction?: string;
  /** MI response objects carry statusCode; jQuery XHR rejections carry status. */
  statusCode?: number;
  status?: number;
}

/* ─── MHS850 message status (MHS850MI/GetWhsHead -> STAT) ────────────────── */

interface StatusInfo {
  /** M3's own name for the status. */
  label: string;
  /** What to do about it. Absent means there is nothing useful to say. */
  advice?: string;
  /** Whether a per-line lookup will add anything. */
  lines?: boolean;
}

const TRANSACTION_STATUS: Record<string, StatusInfo> = {
  '10': {
    label: 'Entered',
    advice: 'Warehouse transaction message was created but has not been validated yet.',
  },
  '15': {
    label: 'Error on message header',
    advice: 'Header validation failed. Check MHS850 for the header error.',
  },
  '20': {
    label: 'Header validated, no errors',
    advice:
      'Header validated, but package processing did not start. Check MHS850 for the message details.',
  },
  '25': {
    label: 'Error on message packages/IDs',
    advice: 'Package validation failed. Check MHS851 for the package error.',
    lines: true,
  },
  '30': {
    label: 'Package/ID validated, no errors',
    advice:
      'Package validated, but line processing did not complete. Check MHS851 for the package details.',
    lines: true,
  },
  '35': {
    label: 'Error on message lines/instructions',
    advice: 'Line validation failed. Check MHS851 for the failing line.',
    lines: true,
  },
  '40': {
    label: 'Line/instructions validated, no errors',
    advice:
      'Lines validated, but downstream processing did not finish. Check MHS851 for the failing line.',
    lines: true,
  },
  '45': {
    label: 'Error from business component',
    advice: 'Business validation failed during receipt processing.',
    lines: true,
  },
  '90': { label: 'Processed, no errors' },
  '92': {
    label: 'Processed, test message, no update performed',
    advice: 'The transaction ran in test mode, so no inventory update was performed.',
  },
  '99': {
    label: 'Archived',
    advice: 'The warehouse transaction message is archived.',
  },
};

/** The only status that means the goods actually moved. */
export const STATUS_PROCESSED_OK = '90';

export function getTransactionStatusDescription(status: string): string {
  const info = TRANSACTION_STATUS[status];
  return info ? info.label : 'Unknown status';
}

/** Statuses where a per-line lookup will explain what failed. */
export function statusWarrantsLineLookup(status: string): boolean {
  const info = TRANSACTION_STATUS[status];
  return !!(info && info.lines);
}

export function getTroubleshootingInfo(
  status: string,
  lineFailureDetail = ''
): string {
  const info = TRANSACTION_STATUS[status];
  const advice =
    info && info.advice
      ? info.advice
      : 'Warehouse transaction ended in status ' +
        status +
        '. Check MHS850/MHS851 for details.';
  // Line detail is appended whenever the caller found any, rather than only for
  // a hand-picked set of statuses: if a lookup returned something, it is worth
  // showing under whichever status prompted it.
  return [advice, lineFailureDetail].filter(Boolean).join('\n');
}

/* ─── MI error formatting ────────────────────────────────────────────────── */

function getTechnicalDetails(error: MiErrorLike, headline: string): string {
  const errorCode = error.errorCode || '';
  const errorMessage = error.errorMessage || '';
  const errorField = error.errorField || '';
  const program = error.program || '';
  const transaction = error.transaction || '';

  if (!(errorCode || errorMessage || errorField || program)) {
    return '';
  }

  let details = '\n\nTechnical Details:';
  if (program && transaction) {
    details += '\n• API: ' + program + '/' + transaction;
  }
  if (errorCode && errorMessage) {
    details += '\n• Error: ' + errorCode + ': ' + errorMessage;
  } else if (errorMessage) {
    details += '\n• Error: ' + errorMessage;
  } else if (errorCode) {
    details += '\n• Error Code: ' + errorCode;
  }
  if (errorField) {
    details += '\n• Field: ' + errorField;
  }

  // What the code means, when the headline has not already said it. Testing the
  // headline rather than errorMessage matters: when M3 sends a bare code the
  // headline IS the catalogued text, and repeating it here printed the same
  // sentence twice.
  const meaning = describeMiMessage(errorCode);
  if (meaning && !messageMatchesCatalogue(errorCode, headline)) {
    details += '\n• Means: ' + meaning;
  }
  return details;
}

/**
 * Builds the operator-facing message: a readable headline, then the API,
 * error code and field for whoever has to chase it in M3.
 */
export function extractErrorMessage(
  error: MiErrorLike | null | undefined,
  operation = 'operation'
): string {
  const fallback = operation + ' failed';
  if (!error) {
    return fallback;
  }
  // The catalogued text stands in as the headline when M3 sent none, which is
  // the difference between "Receipt failed" and "Purchase order U/M is invalid".
  const headline =
    error.errorMessage ||
    error.message ||
    describeMiMessage(error.errorCode) ||
    fallback;
  return headline + getTechnicalDetails(error, headline);
}

/**
 * Whether a failure means "no such record".
 *
 * V6 treated HTTP 400 as not-found. MI returns 400 both for a genuinely
 * missing record AND for a malformed request — an unknown field, a value past
 * its length, a bad program name. V6 could not tell them apart, so a broken
 * call read as "that serial is free" and the receipt continued on a false
 * premise, creating equipment against a serial nobody had actually checked.
 *
 * Now the wording decides. Refusing a receipt that might have been fine costs
 * a retry; posting one against an unverified serial costs an inventory
 * correction.
 */
export function isRecordMissingError(error: MiErrorLike | null | undefined): boolean {
  if (!error) return false;
  const message = (error.errorMessage || error.message || '').toLowerCase();
  return message.indexOf('no record') !== -1 || message.indexOf('not found') !== -1;
}

/**
 * Whether a failure is a transient lock or busy condition worth retrying.
 *
 * Only ever guards PrcWhsTran. Kept narrow on purpose: a retry is safe only on
 * an operation that is idempotent or has not yet taken effect, and processing a
 * warehouse message that failed to start is both.
 */
const TRANSIENT_KEYWORDS = [
  'locked', 'record lock', 'busy', 'in use',
  'try again', 'temporary', 'timeout', 'deadlock',
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
const TRANSIENT_ERROR_CODES = ['XO_1130'];

export function isTransientProcessLock(
  error: MiErrorLike | null | undefined
): boolean {
  if (!error) return false;

  const status = error.statusCode ?? error.status;
  // 409 Conflict and 503 Unavailable are the two HTTP shapes M3 uses here.
  if (status === 409 || status === 503) return true;

  const code = String(error.errorCode || '').toUpperCase();
  if (TRANSIENT_ERROR_CODES.indexOf(code) !== -1) return true;

  const message = String(error.errorMessage || error.message || '').toLowerCase();
  return TRANSIENT_KEYWORDS.some((k) => message.indexOf(k) !== -1);
}
