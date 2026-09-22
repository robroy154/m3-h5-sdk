import { describe, it, expect } from 'vitest';
import {
  DIALOG_STYLES,
  DIALOG_TITLES,
  buildReceiptSummary,
  buildValidationMessage,
} from '../src/presentation';

describe('buildReceiptSummary', () => {
  it('reports serials received and lists them', () => {
    const out = buildReceiptSummary({
      mode: 'serial', serials: ['A1', 'A2'], location: 'YDO',
    });
    expect(out).toContain('2 serials received to YDO');
    expect(out).toContain('Serials: A1, A2');
  });

  it('uses the singular for one serial', () =>
    expect(buildReceiptSummary({ mode: 'serial', serials: ['A1'], location: 'Y' }))
      .toContain('1 serial received'));

  it('explains a blank location instead of printing "(no location)"', () => {
    // A blank location is normal under direct put-away. V6 rendered
    // "(no location)", which reads like a failure.
    const out = buildReceiptSummary({ mode: 'plain', quantity: 5, location: '' });
    expect(out).toContain('the location M3 assigned');
    expect(out).not.toContain('(no location)');
  });

  it('reports a lot with its expiry', () => {
    const out = buildReceiptSummary({
      mode: 'lot', lot: 'LOT-1', expiry: '2027-01-01', quantity: 10, location: 'A1',
    });
    expect(out).toContain('10 units received to A1');
    expect(out).toContain('Lot LOT-1');
    expect(out).toContain('Expiry 2027-01-01');
  });

  it('omits the expiry line when the item has none', () =>
    expect(buildReceiptSummary({ mode: 'lot', lot: 'L', quantity: 1, location: 'A' }))
      .not.toContain('Expiry'));

  it('handles a plain receipt', () =>
    expect(buildReceiptSummary({ mode: 'plain', quantity: 1, location: 'A' }))
      .toBe('1 unit received to A.'));

  it('does not throw on missing counts', () => {
    expect(buildReceiptSummary({ mode: 'plain', location: 'A' })).toContain('0 units');
  });

  it('says M3 assigned the serials rather than reporting "0 serials"', () => {
    // An automatic BACD means M3 generates the numbers, so none are collected.
    // Reporting "0 serials received" made a successful receipt read as a
    // failure. Seen on PO 2007774 in H5.
    const out = buildReceiptSummary({ mode: 'serial', quantity: 5, location: '' });
    expect(out).toContain('5 units received');
    expect(out).toContain('Serial numbers assigned by M3');
    expect(out).not.toContain('0 serial');
  });

  it('never prints a bare "Lot:" when M3 assigned the number', () => {
    const out = buildReceiptSummary({ mode: 'lot', quantity: 5, location: '' });
    expect(out).toContain('5 units received');
    expect(out).toContain('Lot number assigned by M3');
    expect(out).not.toMatch(/Lot:/);
    expect(out).not.toMatch(/Lot:\s*$/m);
  });
});

describe('dialog titles', () => {
  it('carry no emoji — dialogType conveys severity, and emoji fail in high contrast', () => {
    // \p{Extended_Pictographic} covers the emoji ranges without putting a
    // variation selector inside a character class, which is misleading.
    const emoji = /\p{Extended_Pictographic}/u;
    for (const title of Object.values(DIALOG_TITLES)) {
      expect(title).not.toMatch(emoji);
    }
  });
});

describe('DIALOG_STYLES', () => {
  it('routes every colour through an IDS token', () => {
    // A bare hex outside var(...) would not follow the operator's theme.
    const bareHex = DIALOG_STYLES
      .split('\n')
      .filter((line) => /#[0-9a-fA-F]{3,6}/.test(line))
      .filter((line) => !/var\(--ids-/.test(line));
    expect(bareHex).toEqual([]);
  });

  it('keeps V6 literals as fallbacks, so nothing regresses without tokens', () => {
    expect(DIALOG_STYLES).toContain('#0072C6');
    expect(DIALOG_STYLES).toContain('#f5f5f5');
  });

  it('uses semantic class names rather than inline style attributes', () => {
    expect(DIALOG_STYLES).toContain('.po-receipt-');
    expect(DIALOG_STYLES).not.toContain('style=');
  });
});

describe('buildValidationMessage', () => {
  it('leads with duplicates when there are any', () => {
    const out = buildValidationMessage([], ['A1'], 20);
    expect(out).toContain('Duplicates detected: A1');
  });

  it('lists each bad field with its reason', () => {
    const out = buildValidationMessage(
      [{ label: 'Serial 1', reason: 'blank' }, { label: 'Serial 3', reason: 'too long' }],
      [], 20
    );
    expect(out).toContain('Serial 1 (blank)');
    expect(out).toContain('Serial 3 (too long)');
    expect(out).toContain('up to 20 characters');
  });

  it('is empty when there is nothing to report', () =>
    expect(buildValidationMessage([], [], 20)).toBe(''));
});
