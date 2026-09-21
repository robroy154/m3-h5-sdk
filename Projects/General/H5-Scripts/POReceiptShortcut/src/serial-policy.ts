/**
 * Serial number policy.
 *
 * Pure logic, no H5 globals and no DOM. Extracted verbatim from
 * POReceiptShortcutV6 so that its behaviour can be characterised by tests
 * before any of it changes. The only difference from V6 is that the clock and
 * the batch seed are passed in rather than read from `Date` inside the
 * functions — V6 read them internally, which made every derived value
 * untestable.
 */

/* ─── Field limits, verified against the MI catalog ──────────────────────── */

/** `MMS240MI/Add` input `SERN`. A serial longer than this cannot be stored. */
export const SERN_MAX_LENGTH = 20;

/** `MMS240MI/Add` input `EEQN` ("Equipment number reference"). */
export const EEQN_MAX_LENGTH = 40;

/** `CMS474MI/AddEqInfo` input `CFMA`. The widest home available for a serial. */
export const CFMA_MAX_LENGTH = 60;

/* ─── Derived-serial shape ───────────────────────────────────────────────── */

/** `BSN` + MMDDYY + hhmmss + 4-char hash = 19, one under the SERN limit. */
export const DERIVED_SERIAL_LENGTH = 19;
export const DERIVED_SERIAL_PREFIX = 'BSN';
export const HASH_SUFFIX_LENGTH = 4;

export interface SerialEntry {
  /** Exactly what the operator typed, trimmed. Never truncated. */
  originalSerial: string;
  /** What goes into `SERN`: the original when it fits, else a derived value. */
  derivedSerial: string;
  index: number;
}

/**
 * djb2 variant. Deliberately not a cryptographic hash — it only has to spread
 * values within one receipt batch. Kept bit-for-bit identical to V6 so that
 * serials derived before and after this refactor match.
 */
export function simpleHash(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) + hash + value.codePointAt(i);
    hash = hash & hash; // force back to a 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Seed for a single receipt batch. Derived from the clock so two runs in the
 * same second still produce different suffixes.
 */
export function generateEpochSeed(nowMs: number): string {
  return (nowMs % 1000000).toString().padStart(6, '0');
}

/** Four-digit suffix that separates serials within one batch. */
export function computeHashSuffix(
  epochSeed: string,
  originalSerial: string,
  index: number
): string {
  const combined = epochSeed + '|' + originalSerial + '|' + index;
  return (simpleHash(combined) % 10000)
    .toString()
    .padStart(HASH_SUFFIX_LENGTH, '0');
}

/**
 * Builds a `SERN`-safe serial: BSN + MMDDYY + hhmmss + hash.
 *
 * Only called when the operator's serial exceeds `SERN_MAX_LENGTH`; the
 * original is never discarded, it is carried on the entry for storage
 * elsewhere.
 */
export function deriveBoundedSerial(
  originalSerial: string,
  index: number,
  epochSeed: string,
  now: Date
): string {
  const pad2 = (n: number): string => String(n).padStart(2, '0');

  const derived =
    DERIVED_SERIAL_PREFIX +
    pad2(now.getMonth() + 1) +
    pad2(now.getDate()) +
    String(now.getFullYear()).slice(-2).padStart(2, '0') +
    pad2(now.getHours()) +
    pad2(now.getMinutes()) +
    pad2(now.getSeconds()) +
    computeHashSuffix(epochSeed, originalSerial, index);

  if (derived.length > DERIVED_SERIAL_LENGTH) {
    throw new Error(
      'Derived serial exceeds ' + DERIVED_SERIAL_LENGTH + ' chars: ' +
      derived + ' (len=' + derived.length + ')'
    );
  }
  return derived;
}

/**
 * Turns operator input into the entries the receipt engine posts.
 *
 * A serial within `SERN_MAX_LENGTH` passes through untouched; anything longer
 * gets a derived stand-in. Throws if two entries would land on the same
 * derived value, because that would silently merge two physical items.
 */
export function prepareSerialEntries(
  userSerials: string[],
  epochSeed: string,
  now: Date
): SerialEntry[] {
  if (!Array.isArray(userSerials) || userSerials.length === 0) {
    throw new Error('No serials to prepare');
  }

  const entries: SerialEntry[] = userSerials.map((rawSerial, index) => {
    const trimmed = (rawSerial || '').trim();
    return {
      originalSerial: trimmed,
      derivedSerial:
        trimmed.length > SERN_MAX_LENGTH
          ? deriveBoundedSerial(trimmed, index, epochSeed, now)
          : trimmed,
      index,
    };
  });

  if (new Set(entries.map((e) => e.derivedSerial)).size !== entries.length) {
    throw new Error(
      'Hash collision: derived serials are not unique. Try again or contact support.'
    );
  }
  return entries;
}
