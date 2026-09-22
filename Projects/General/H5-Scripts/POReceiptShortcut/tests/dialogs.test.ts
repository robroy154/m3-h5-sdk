import { describe, it, expect } from 'vitest';
import { settleOnce } from '../src/dialogs';

describe('settleOnce', () => {
  it('keeps the first value and ignores the cancellation that follows', () => {
    // Seen receiving PO 2007775 in H5. The OK handler called handle.close()
    // and THEN resolved. close() fires H5's `close` callback synchronously,
    // that callback resolves null, so three typed serials were thrown away and
    // the log read "Receipt cancelled by the operator".
    const seen: unknown[] = [];
    const finish = settleOnce<string[]>((v) => seen.push(v));

    finish(['S1', 'S2', 'S3']); // OK, settling before it closes the dialog
    finish(null);               // the close callback, arriving right after

    expect(seen).toEqual([['S1', 'S2', 'S3']]);
  });

  it('still cancels when nothing settled first', () => {
    const seen: unknown[] = [];
    settleOnce<string[]>((v) => seen.push(v))(null);
    expect(seen).toEqual([null]);
  });

  it('resolves exactly once however many times it is called', () => {
    let calls = 0;
    const finish = settleOnce<string>(() => { calls++; });
    finish('a'); finish('b'); finish(null);
    expect(calls).toBe(1);
  });
});
