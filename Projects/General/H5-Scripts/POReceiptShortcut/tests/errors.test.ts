import { describe, it, expect } from 'vitest';
import {
  STATUS_PROCESSED_OK,
  extractErrorMessage,
  getTransactionStatusDescription,
  getTroubleshootingInfo,
  isRecordMissingError,
  isTransientProcessLock,
  statusWarrantsLineLookup,
} from '../src/errors';

/** Characterisation of POReceiptShortcutV6's error handling. */

describe('getTransactionStatusDescription', () => {
  it('names every documented MHS850 status', () => {
    const expected: Record<string, string> = {
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
    for (const [code, text] of Object.entries(expected)) {
      expect(getTransactionStatusDescription(code)).toBe(text);
    }
  });

  it('falls back rather than throwing on an unknown status', () =>
    expect(getTransactionStatusDescription('77')).toBe('Unknown status'));

  it('treats only 90 as success', () => {
    expect(STATUS_PROCESSED_OK).toBe('90');
    // 92 is a test-mode run: it "succeeded" but moved no stock.
    expect(getTransactionStatusDescription('92')).toContain('no update performed');
  });
});

describe('statusWarrantsLineLookup', () => {
  it('is true for the statuses where a line lookup explains the failure', () => {
    for (const s of ['25', '30', '35', '40', '45']) {
      expect(statusWarrantsLineLookup(s)).toBe(true);
    }
  });
  it('is false for header-level and terminal statuses', () => {
    for (const s of ['10', '15', '20', '90', '92', '99']) {
      expect(statusWarrantsLineLookup(s)).toBe(false);
    }
  });
});

describe('getTroubleshootingInfo', () => {
  it('appends the line detail for line-level failures', () => {
    const out = getTroubleshootingInfo('35', 'Item ABC rejected');
    expect(out).toContain('Line validation failed');
    expect(out).toContain('Item ABC rejected');
  });

  it('omits an empty line detail rather than leaving a blank line', () => {
    expect(getTroubleshootingInfo('35', '')).toBe(
      'Line validation failed. Check MHS851 for the failing line.'
    );
  });

  it('explains test mode for 92, which otherwise looks like success', () =>
    expect(getTroubleshootingInfo('92')).toContain('no inventory update'));

  it('names the status in its fallback', () =>
    expect(getTroubleshootingInfo('77')).toContain('status 77'));
});

describe('extractErrorMessage', () => {
  it('falls back to the operation name when there is no error object', () => {
    expect(extractErrorMessage(null, 'Receipt')).toBe('Receipt failed');
    expect(extractErrorMessage(undefined, 'Receipt')).toBe('Receipt failed');
  });

  it('prefers errorMessage over message', () => {
    const out = extractErrorMessage({ errorMessage: 'MI says no', message: 'generic' });
    expect(out).toContain('MI says no');
    expect(out).not.toContain('generic');
  });

  it('includes the API, error code and field for whoever chases it in M3', () => {
    const out = extractErrorMessage(
      {
        errorMessage: 'Item not found',
        errorCode: 'WW101',
        errorField: 'ITNO',
        program: 'MMS240MI',
        transaction: 'Add',
      },
      'Equipment creation'
    );
    expect(out).toContain('Item not found');
    expect(out).toContain('MMS240MI/Add');
    expect(out).toContain('WW101');
    expect(out).toContain('ITNO');
  });

  it('omits the technical block entirely when there is nothing to show', () => {
    expect(extractErrorMessage({ message: 'boom' }, 'Op')).toBe('boom');
  });

  it('does not print the API line when only the program is known', () => {
    // transaction is required too; a half-line would be worse than none.
    const out = extractErrorMessage({ program: 'MMS240MI', errorCode: 'X1' });
    expect(out).not.toContain('API:');
    expect(out).toContain('X1');
  });
});

describe('isRecordMissingError', () => {
  it('is false for no error', () => {
    expect(isRecordMissingError(null)).toBe(false);
    expect(isRecordMissingError(undefined)).toBe(false);
  });

  it('recognises the not-found wording', () => {
    expect(isRecordMissingError({ errorMessage: 'No record found' })).toBe(true);
    expect(isRecordMissingError({ message: 'Record not found' })).toBe(true);
  });

  it('FIXED: a malformed 400 is no longer read as "record missing"', () => {
    // MI returns 400 both for "no such record" and for a bad request. V6 could
    // not tell them apart, so a broken call read as "that serial is free" and
    // the receipt continued, creating equipment against an unverified serial.
    const malformed = { statusCode: 400, errorMessage: 'Field ITNO is invalid' };
    expect(isRecordMissingError(malformed)).toBe(false);
  });

  it('a bare 400 with no wording is treated as a real error', () => {
    // Failing loudly costs a retry. Proceeding costs an inventory correction.
    expect(isRecordMissingError({ statusCode: 400 })).toBe(false);
    expect(isRecordMissingError({ status: 400 })).toBe(false);
  });

  it('still recognises not-found whatever the HTTP status', () => {
    expect(isRecordMissingError({ statusCode: 400, errorMessage: 'No record found' })).toBe(true);
    expect(isRecordMissingError({ statusCode: 404, message: 'Record not found' })).toBe(true);
  });

  it('is false for a server error', () => {
    expect(isRecordMissingError({ statusCode: 500, errorMessage: 'boom' })).toBe(false);
  });
});

describe('isTransientProcessLock', () => {
  it('treats 409 and 503 as transient', () => {
    expect(isTransientProcessLock({ statusCode: 409 })).toBe(true);
    expect(isTransientProcessLock({ status: 503 })).toBe(true);
  });

  it('does not treat a business failure as transient', () => {
    // Retrying a non-transient PrcWhsTran risks receiving the goods twice.
    expect(isTransientProcessLock({ statusCode: 400 })).toBe(false);
    expect(isTransientProcessLock({ errorMessage: 'Quantity exceeds order' })).toBe(false);
    expect(isTransientProcessLock({ errorCode: 'WW10203' })).toBe(false);
  });

  it('recognises the lock and busy wordings', () => {
    for (const message of [
      'Record locked by another user',
      'Resource is busy',
      'Item in use',
      'Please try again',
      'Temporary failure',
      'Request timeout',
      'Deadlock detected',
    ]) {
      expect(isTransientProcessLock({ errorMessage: message })).toBe(true);
    }
  });

  it('matches the wording case-insensitively', () => {
    expect(isTransientProcessLock({ errorMessage: 'RECORD LOCKED' })).toBe(true);
  });

  it('recognises the receiving-number lock timeout', () => {
    // MHS870 raises XO_1130 when its receiving-number lock times out during
    // put-away. That is the one retryable failure on this path.
    expect(isTransientProcessLock({ errorCode: 'XO_1130' })).toBe(true);
    expect(isTransientProcessLock({ errorCode: 'xo_1130' })).toBe(true);
  });

  it('does not retry WPU0901, which V6 wrongly treated as a lock', () => {
    // "Lowest status - purchase order &1 is invalid" is permanent; retrying it
    // only delays the error.
    expect(isTransientProcessLock({ errorCode: 'WPU0901' })).toBe(false);
  });

  it('is false for nothing at all', () => {
    expect(isTransientProcessLock(null)).toBe(false);
    expect(isTransientProcessLock(undefined)).toBe(false);
    expect(isTransientProcessLock({})).toBe(false);
  });
});
