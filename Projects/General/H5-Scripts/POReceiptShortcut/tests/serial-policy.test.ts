import { describe, it, expect } from 'vitest';
import {
  CFMA_MAX_LENGTH,
  DERIVED_SERIAL_LENGTH,
  EEQN_MAX_LENGTH,
  SERN_MAX_LENGTH,
  computeHashSuffix,
  deriveBoundedSerial,
  generateEpochSeed,
  prepareSerialEntries,
  simpleHash,
} from '../src/serial-policy';

/**
 * Characterisation tests: these lock in POReceiptShortcutV6's CURRENT
 * behaviour, correct or not, so that later changes have to be deliberate.
 * Where a test documents something questionable it says so rather than
 * asserting the behaviour is right.
 */

// 2026-09-21T14:07:03 local -> MM=09 DD=21 YY=26 hh=14 mm=07 ss=03
const NOW = new Date(2026, 8, 21, 14, 7, 3);
const SEED = '123456';

describe('field limits match the MI catalog', () => {
  it('SERN is 20 (MMS240MI/Add)', () => expect(SERN_MAX_LENGTH).toBe(20));
  it('EEQN is 40 (MMS240MI/Add)', () => expect(EEQN_MAX_LENGTH).toBe(40));
  it('CFMA is 60 (CMS474MI/AddEqInfo)', () => expect(CFMA_MAX_LENGTH).toBe(60));
  it('a derived serial always fits inside SERN', () =>
    expect(DERIVED_SERIAL_LENGTH).toBeLessThanOrEqual(SERN_MAX_LENGTH));
});

describe('simpleHash', () => {
  it('is deterministic', () =>
    expect(simpleHash('ABC-123')).toBe(simpleHash('ABC-123')));
  it('separates inputs differing by one character', () =>
    expect(simpleHash('ABC-123')).not.toBe(simpleHash('ABC-124')));
  it('returns a non-negative 32-bit-derived value', () => {
    for (const s of ['', 'A', 'x'.repeat(200), '~~~', '0']) {
      expect(simpleHash(s)).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(simpleHash(s))).toBe(true);
    }
  });
  it('handles the empty string without throwing', () =>
    expect(simpleHash('')).toBe(5381));
});

describe('generateEpochSeed', () => {
  it('keeps the low six digits of the epoch, zero padded', () => {
    expect(generateEpochSeed(1_000_000)).toBe('000000');
    expect(generateEpochSeed(1_000_123)).toBe('000123');
    expect(generateEpochSeed(1_758_465_123_456)).toBe('123456');
  });
  it('always returns six characters', () => {
    for (const ms of [0, 1, 999_999, 1_234_567_890_123]) {
      expect(generateEpochSeed(ms)).toHaveLength(6);
    }
  });
});

describe('computeHashSuffix', () => {
  it('is four digits', () =>
    expect(computeHashSuffix(SEED, 'SERIAL', 0)).toMatch(/^\d{4}$/));
  it('varies with the index, so duplicate input still separates', () =>
    expect(computeHashSuffix(SEED, 'SAME', 0)).not.toBe(
      computeHashSuffix(SEED, 'SAME', 1)
    ));
  it('varies with the seed, so two runs differ', () =>
    expect(computeHashSuffix('111111', 'SAME', 0)).not.toBe(
      computeHashSuffix('222222', 'SAME', 0)
    ));
});

describe('deriveBoundedSerial', () => {
  it('builds BSN + MMDDYY + hhmmss + hash', () => {
    const d = deriveBoundedSerial('A'.repeat(30), 0, SEED, NOW);
    expect(d).toMatch(/^BSN092126140703\d{4}$/);
  });
  it('is exactly the documented 19 characters', () =>
    expect(deriveBoundedSerial('A'.repeat(30), 0, SEED, NOW)).toHaveLength(
      DERIVED_SERIAL_LENGTH
    ));
  it('never exceeds the SERN limit', () =>
    expect(
      deriveBoundedSerial('Z'.repeat(250), 7, SEED, NOW).length
    ).toBeLessThanOrEqual(SERN_MAX_LENGTH));
  it('zero-pads single-digit date parts', () => {
    const jan = new Date(2026, 0, 5, 9, 8, 7);
    expect(deriveBoundedSerial('A'.repeat(30), 0, SEED, jan)).toMatch(
      /^BSN010526090807\d{4}$/
    );
  });
});

describe('prepareSerialEntries', () => {
  it('rejects an empty batch', () => {
    expect(() => prepareSerialEntries([], SEED, NOW)).toThrow('No serials to prepare');
    expect(() => prepareSerialEntries(null as any, SEED, NOW)).toThrow();
  });

  it('passes a serial of exactly 20 through untouched', () => {
    const s = 'A'.repeat(SERN_MAX_LENGTH);
    const [e] = prepareSerialEntries([s], SEED, NOW);
    expect(e.derivedSerial).toBe(s);
    expect(e.originalSerial).toBe(s);
  });

  it('derives at 21 — the boundary is strictly greater than', () => {
    const s = 'A'.repeat(SERN_MAX_LENGTH + 1);
    const [e] = prepareSerialEntries([s], SEED, NOW);
    expect(e.derivedSerial).not.toBe(s);
    expect(e.derivedSerial).toHaveLength(DERIVED_SERIAL_LENGTH);
    expect(e.originalSerial).toBe(s); // original is preserved in full
  });

  it('trims before measuring length', () => {
    const [e] = prepareSerialEntries(['  ABC  '], SEED, NOW);
    expect(e.originalSerial).toBe('ABC');
    expect(e.derivedSerial).toBe('ABC');
  });

  it('keeps a long original intact for storage elsewhere', () => {
    const long = 'V'.repeat(55);
    const [e] = prepareSerialEntries([long], SEED, NOW);
    expect(e.originalSerial).toBe(long);
    expect(e.originalSerial.length).toBeLessThanOrEqual(CFMA_MAX_LENGTH);
  });

  it('assigns a positional index to every entry', () => {
    const entries = prepareSerialEntries(['A', 'B', 'C'], SEED, NOW);
    expect(entries.map((e) => e.index)).toEqual([0, 1, 2]);
  });

  it('separates two identical long serials via the index', () => {
    const long = 'D'.repeat(30);
    const [a, b] = prepareSerialEntries([long, long], SEED, NOW);
    expect(a.derivedSerial).not.toBe(b.derivedSerial);
  });

  it('rejects duplicate short serials, though the error names a hash collision', () => {
    // Two identical short serials both pass through untouched, so the
    // uniqueness check fires. The guard is correct, but the message blames a
    // "hash collision" when no hashing happened — misleading for whoever reads
    // it at 6am on a receiving dock. Behaviour locked in here; wording is worth
    // fixing later.
    expect(() => prepareSerialEntries(['SAME', 'SAME'], SEED, NOW)).toThrow(
      'Hash collision'
    );
  });

  it('mixed short and long serials each take the right path', () => {
    const entries = prepareSerialEntries(
      ['SHORT-1', 'L'.repeat(40), 'SHORT-2'],
      SEED,
      NOW
    );
    expect(entries[0].derivedSerial).toBe('SHORT-1');
    expect(entries[1].derivedSerial).toMatch(/^BSN\d{12}\d{4}$/);
    expect(entries[2].derivedSerial).toBe('SHORT-2');
  });
});
