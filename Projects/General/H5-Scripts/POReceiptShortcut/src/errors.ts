/**
 * Turning MI failures into something a receiving clerk can act on.
 *
 * Extracted from POReceiptShortcutV6 with its behaviour preserved, so the
 * tests can pin it before any of it changes. Two known problems are carried
 * over deliberately and marked; both are fixed in a later, visible commit
 * rather than smuggled in here.
 */

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

const TRANSACTION_STATUS: Record<string, string> = {
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
  '99': 'Archived',
};

/** The only status that means the goods actually moved. */
export const STATUS_PROCESSED_OK = '90';

export function getTransactionStatusDescription(status: string): string {
  return TRANSACTION_STATUS[status] || 'Unknown status';
}

/** Statuses where a per-line lookup will explain what failed. */
export function statusWarrantsLineLookup(status: string): boolean {
  return ['25', '30', '35', '40', '45'].indexOf(status) !== -1;
}

export function getTroubleshootingInfo(
  status: string,
  lineFailureDetail = ''
): string {
  const withDetail = (lead: string): string =>
    [lead, lineFailureDetail].filter(Boolean).join('\n');

  switch (status) {
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
      return withDetail('Line validation failed. Check MHS851 for the failing line.');
    case '40':
      return withDetail(
        'Lines validated, but downstream processing did not finish. Check MHS851 for the failing line.'
      );
    case '45':
      return withDetail('Business validation failed during receipt processing.');
    case '92':
      return 'The transaction ran in test mode, so no inventory update was performed.';
    case '99':
      return 'The warehouse transaction message is archived.';
    default:
      return (
        'Warehouse transaction ended in status ' +
        status +
        '. Check MHS850/MHS851 for details.'
      );
  }
}

/* ─── MI error formatting ────────────────────────────────────────────────── */

function formatErrorCode(errorCode: string, errorMessage: string): string {
  if (errorCode && errorMessage) return '\n• Error: ' + errorCode + ': ' + errorMessage;
  if (errorMessage) return '\n• Error: ' + errorMessage;
  if (errorCode) return '\n• Error Code: ' + errorCode;
  return '';
}

function getTechnicalDetails(error: MiErrorLike): string {
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
  details += formatErrorCode(errorCode, errorMessage);
  if (errorField) {
    details += '\n• Field: ' + errorField;
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
  const headline = error.errorMessage || error.message || fallback;
  return headline + getTechnicalDetails(error);
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
 * Now the wording decides. A 400 carrying no not-found text is treated as a
 * real error, which fails the receipt loudly instead of proceeding on an
 * assumption. That is the safe direction: refusing a receipt that might have
 * been fine costs a retry, whereas posting one against an unverified serial
 * costs an inventory correction.
 */
export function isRecordMissingError(error: MiErrorLike | null | undefined): boolean {
  if (!error) return false;
  const message = (error.errorMessage || error.message || '').toLowerCase();
  return message.indexOf('no record') !== -1 || message.indexOf('not found') !== -1;
}

/**
 * Whether a failure is a transient lock or busy condition worth retrying.
 *
 * Ported from V6's isTransientProcessLock(), which only ever guarded
 * PrcWhsTran. Kept narrow on purpose: a retry is only safe on an operation
 * that is idempotent or has not yet taken effect, and processing a warehouse
 * message that failed to start is both. Nothing else in the write path retries.
 */
const TRANSIENT_KEYWORDS = [
  'locked', 'record lock', 'busy', 'in use',
  'try again', 'temporary', 'timeout', 'deadlock',
];

/** MI error codes that in practice mean "held elsewhere, come back". */
const TRANSIENT_ERROR_CODES = ['WPU0901', 'M3LOCK'];

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
