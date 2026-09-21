import { describe, it, expect } from 'vitest';
import {
  findMissingFields,
  validateExpirationDate,
  validateLotNumber,
  validateSerialBatch,
  validateSerialValue,
} from '../src/validation';

describe('validateSerialValue', () => {
  it('accepts A-Z, 0-9 and hyphen', () => {
    expect(validateSerialValue('ABC-123', 20)).toBeNull();
    expect(validateSerialValue('1234567890', 20)).toBeNull();
    expect(validateSerialValue('A-B-C', 20)).toBeNull();
  });

  it('reports blank and whitespace-only input', () => {
    expect(validateSerialValue('', 20)).toBe('blank');
    expect(validateSerialValue('   ', 20)).toBe('blank');
    expect(validateSerialValue(null as any, 20)).toBe('blank');
  });

  it('measures length after trimming', () => {
    expect(validateSerialValue('  ' + 'A'.repeat(20) + '  ', 20)).toBeNull();
    expect(validateSerialValue('A'.repeat(21), 20)).toBe('too long');
  });

  it('rejects lowercase, matching V6', () => {
    // Both dialogs force-uppercase on input, so lowercase can only arrive by
    // pasting past the handler. Widening this would change what lands in SERN.
    expect(validateSerialValue('abc-123', 20)).toBe('invalid characters');
  });

  it('rejects spaces and punctuation inside the value', () => {
    expect(validateSerialValue('AB 123', 20)).toBe('invalid characters');
    expect(validateSerialValue('AB_123', 20)).toBe('invalid characters');
    expect(validateSerialValue('AB.123', 20)).toBe('invalid characters');
  });

  it('checks blank before length, so an empty field is never "too long"', () =>
    expect(validateSerialValue('', 0)).toBe('blank'));
});

describe('validateSerialBatch', () => {
  it('returns every trimmed serial when the batch is clean', () => {
    const r = validateSerialBatch([' A1 ', 'B2', 'C3'], 20);
    expect(r.serials).toEqual(['A1', 'B2', 'C3']);
    expect(r.issues).toHaveLength(0);
    expect(r.duplicates).toHaveLength(0);
  });

  it('reports every bad field at once, not just the first', () => {
    const r = validateSerialBatch(['', 'OK', 'bad value', 'X'.repeat(30)], 20);
    expect(r.issues).toHaveLength(3);
    expect(r.issues.map((i) => i.label)).toEqual(['Serial 1', 'Serial 3', 'Serial 4']);
    expect(r.issues.map((i) => i.reason)).toEqual([
      'blank',
      'invalid characters',
      'too long',
    ]);
  });

  it('numbers fields from 1, matching the dialog labels', () =>
    expect(validateSerialBatch([''], 20).issues[0].label).toBe('Serial 1'));

  it('withholds serials while any field has an issue', () =>
    expect(validateSerialBatch(['GOOD', ''], 20).serials).toHaveLength(0));

  it('only looks for duplicates once every value is valid', () => {
    // An operator with one blank field is told about the blank, not about a
    // duplicate elsewhere.
    const r = validateSerialBatch(['SAME', 'SAME', ''], 20);
    expect(r.duplicates).toHaveLength(0);
    expect(r.issues).toHaveLength(1);
  });

  it('reports each duplicated value once, however many times it repeats', () => {
    const r = validateSerialBatch(['A', 'A', 'A', 'B'], 20);
    expect(r.duplicates).toEqual(['A']);
    expect(r.serials).toHaveLength(0);
  });

  it('reports multiple distinct duplicates', () =>
    expect(validateSerialBatch(['A', 'A', 'B', 'B'], 20).duplicates).toEqual(['A', 'B']));

  it('handles an empty batch without throwing', () => {
    const r = validateSerialBatch([], 20);
    expect(r.serials).toHaveLength(0);
    expect(r.issues).toHaveLength(0);
  });
});

describe('validateLotNumber', () => {
  it('accepts a well-formed lot', () => expect(validateLotNumber('LOT-001')).toBeNull());
  it('requires a value', () => expect(validateLotNumber('  ')).toContain('required'));
  it('rejects disallowed characters', () =>
    expect(validateLotNumber('lot 001')).toContain('A-Z, 0-9, or hyphen'));
});

describe('validateExpirationDate', () => {
  const TODAY = '2026-09-21';

  it('is skipped entirely when the item does not require one', () => {
    expect(validateExpirationDate(null, false, TODAY)).toBeNull();
    expect(validateExpirationDate('1999-01-01', false, TODAY)).toBeNull();
  });

  it('requires a date when the item demands one', () =>
    expect(validateExpirationDate(null, true, TODAY)).toContain('required'));

  it('rejects today, not just the past', () => {
    // Stock expiring today is not receivable.
    expect(validateExpirationDate(TODAY, true, TODAY)).toContain('today or in the past');
  });

  it('rejects a past date', () =>
    expect(validateExpirationDate('2026-09-20', true, TODAY)).toContain('past'));

  it('accepts tomorrow', () =>
    expect(validateExpirationDate('2026-09-22', true, TODAY)).toBeNull());

  it('compares correctly across month and year boundaries', () => {
    expect(validateExpirationDate('2027-01-01', true, '2026-12-31')).toBeNull();
    expect(validateExpirationDate('2026-12-31', true, '2027-01-01')).toContain('past');
  });
});

describe('findMissingFields', () => {
  it('names every empty field', () =>
    expect(
      findMissingFields({ PUNO: '123', PNLI: '', ITNO: null, WHLO: undefined })
    ).toEqual(['PNLI', 'ITNO', 'WHLO']));

  it('returns nothing when all are present', () =>
    expect(findMissingFields({ PUNO: '1', PNLI: '2' })).toHaveLength(0));

  it('treats the string "0" as present, not missing', () => {
    // Worth pinning: OEND ("flag completed") legitimately arrives as "0".
    // A falsy check on a string is safe here because "0" is a non-empty
    // string and therefore truthy — the trap would only bite if these were
    // ever read as numbers.
    expect(findMissingFields({ OEND: '0' })).toHaveLength(0);
  });
});
