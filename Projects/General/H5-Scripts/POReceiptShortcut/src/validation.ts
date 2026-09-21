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

/**
 * Serials and lots are restricted to A-Z, 0-9 and hyphen.
 *
 * Uppercase only because both dialogs force-uppercase as the operator types;
 * a lowercase value can only arrive by pasting past the handler, and V6
 * rejects it. Reproduced rather than widened: silently accepting mixed case
 * would change what lands in SERN.
 */
const ALLOWED_PATTERN = /^[A-Z0-9-]+$/;

export interface FieldIssue {
  /** 1-based position shown to the operator, or the field name. */
  label: string;
  reason: string;
  /**
   * Zero-based position in the submitted batch, when there is one.
   *
   * The label already encodes it as "Serial 3", but a dialog that needs to
   * mark the offending input should not have to parse that back out — the
   * label is text for a person, not a key.
   */
  index?: number;
}

/** Reason the value is unusable, or null when it is fine. */
export function validateSerialValue(value: string, maxLength: number): string | null {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'blank';
  if (trimmed.length > maxLength) return 'too long';
  if (!ALLOWED_PATTERN.test(trimmed)) return 'invalid characters';
  return null;
}

export interface SerialBatchResult {
  /** Trimmed values, only when the whole batch is usable. */
  serials: string[];
  issues: FieldIssue[];
  duplicates: string[];
}

/**
 * Validates a whole dialog's worth of serials.
 *
 * Format problems are reported for every field at once rather than one per
 * attempt, and duplicates are only looked for once every value is individually
 * valid — matching V6, and meaning an operator is not told about a duplicate
 * while a neighbouring field is still blank.
 */
export function validateSerialBatch(
  values: string[],
  maxLength: number
): SerialBatchResult {
  const issues: FieldIssue[] = [];
  const serials: string[] = [];

  values.forEach((value, index) => {
    const reason = validateSerialValue(value, maxLength);
    if (reason) {
      issues.push({ label: 'Serial ' + (index + 1), reason, index });
    } else {
      serials.push((value || '').trim());
    }
  });

  if (issues.length > 0) {
    return { serials: [], issues, duplicates: [] };
  }

  const seen: Record<string, true> = {};
  const duplicates: string[] = [];
  for (const serial of serials) {
    if (seen[serial] && duplicates.indexOf(serial) === -1) {
      duplicates.push(serial);
    }
    seen[serial] = true;
  }

  return duplicates.length > 0
    ? { serials: [], issues: [], duplicates }
    : { serials, issues: [], duplicates: [] };
}

/** Reason the lot number is unusable, or null. */
export function validateLotNumber(lot: string): string | null {
  const trimmed = (lot || '').trim();
  if (!trimmed) return 'Lot number is required';
  if (!ALLOWED_PATTERN.test(trimmed)) {
    return 'Lot number must contain only A-Z, 0-9, or hyphen';
  }
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
export function validateExpirationDate(
  expiry: string | null,
  isRequired: boolean,
  today: string
): string | null {
  if (!isRequired) return null;
  if (!expiry) return 'Expiration date is required';
  if (expiry <= today) return 'Expiration date cannot be today or in the past';
  return null;
}

/** Screen fields the receipt cannot proceed without. */
export function findMissingFields(
  fields: Record<string, string | null | undefined>
): string[] {
  return Object.keys(fields).filter((name) => !fields[name]);
}
