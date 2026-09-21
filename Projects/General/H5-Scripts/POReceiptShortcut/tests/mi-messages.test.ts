/**
 * The M3 message catalogue, and the two places it changes what an operator sees.
 *
 * The table itself is generated from Infor's sources, so these tests do not
 * re-assert its contents wholesale — they pin the entries the receipt path
 * actually depends on, the extraction rules that are easy to get wrong, and the
 * rule that M3's own text still wins when it has any.
 */

import { describe, expect, it } from 'vitest';

import {
  MI_MESSAGES,
  describeMiMessage,
  lookupMiMessage,
  messageMatchesCatalogue,
  miMessageCount,
} from '../src/mi-messages';
import { extractErrorMessage } from '../src/errors';
import { describeLineFailure } from '../src/mi-requests';

describe('the catalogue', () => {
  it('holds the codes the receipt path turns on', () => {
    // Each of these is a correction in the CHANGELOG or a failure a clerk hits.
    expect(MI_MESSAGES.MM24031.t).toBe(
      'Serial number must be blank, lot numbering method is &1'
    );
    expect(MI_MESSAGES.MM24032.t).toBe(
      'Adding serial number not permitted, lot numbering method is &1'
    );
    expect(MI_MESSAGES.WPU0201.t).toBe('Purchase order U/M &1 is invalid');
    expect(MI_MESSAGES.WRI0102.t).toContain('must be entered');
    expect(MI_MESSAGES.WWS0103.t).toBe('Location &1 does not exist');
    expect(MI_MESSAGES.WBA0402.t).toBe('Lot number must be entered');
  });

  it('records the code that is RAISED, not the one the comment names', () => {
    // MHILINPI comments `MSGID=MH85010` and then raises MH85210. A caller only
    // ever sees MH85210, so that is the key the text has to hang off.
    expect(MI_MESSAGES.MH85210.t).toContain('full quantity');
    // Same trap: MMS240MI comments WOWTP06 and raises WOWTP01.
    expect(MI_MESSAGES.WOWTP01.t).toBe('Owner type &1 is invalid');
    // And WSE1702 is commented where WSE1701 is raised.
    expect(MI_MESSAGES.WSE1701.t).toBe('Serial number invalid');
  });

  it('keeps the other wordings a code carries', () => {
    // WIT0101 is written three different ways across the sources.
    expect(MI_MESSAGES.WIT0101.alt).toBeDefined();
    expect((MI_MESSAGES.WIT0101.alt || []).length).toBeGreaterThan(0);
  });

  it('is large enough to be worth having and small enough to ship', () => {
    expect(miMessageCount()).toBeGreaterThan(250);
    expect(miMessageCount()).toBe(Object.keys(MI_MESSAGES).length);
  });

  it('gives every entry usable text under a well-formed code', () => {
    for (const code of Object.keys(MI_MESSAGES)) {
      expect(code, code).toMatch(/^[A-Z][A-Z0-9_]{2,8}$/);
      expect(MI_MESSAGES[code].t.length, code).toBeGreaterThan(5);
    }
  });
});

describe('describeMiMessage', () => {
  it('drops placeholders M3 would have filled in', () => {
    // "Location &1 does not exist" on screen reads as a defect.
    expect(describeMiMessage('WWS0103')).toBe('Location does not exist');
  });

  it('fills placeholders when the values are known', () => {
    expect(describeMiMessage('WWS0103', ['A-01-02'])).toBe(
      'Location A-01-02 does not exist'
    );
    expect(describeMiMessage('MM24031', ['1'])).toBe(
      'Serial number must be blank, lot numbering method is 1'
    );
  });

  it('marks text Infor truncated in its own comment', () => {
    expect(MI_MESSAGES.MM98502.cut).toBe(1);
    expect(describeMiMessage('MM98502')).toMatch(/…$/);
  });

  it('is case-insensitive and tolerates padding', () => {
    expect(describeMiMessage(' mm24031 ')).toBe(describeMiMessage('MM24031'));
  });

  it('returns nothing for a code it does not hold', () => {
    expect(describeMiMessage('ZZ99999')).toBe('');
    expect(describeMiMessage('')).toBe('');
    expect(describeMiMessage(null)).toBe('');
    expect(lookupMiMessage('ZZ99999')).toBeNull();
  });

  it('does not inherit from Object.prototype', () => {
    expect(lookupMiMessage('constructor')).toBeNull();
    expect(lookupMiMessage('toString')).toBeNull();
  });
});

describe('messageMatchesCatalogue', () => {
  it('recognises M3 text that has the placeholder filled in', () => {
    expect(messageMatchesCatalogue('WWS0103', 'Location A-01-02 does not exist')).toBe(true);
  });

  it('ignores case and punctuation differences', () => {
    expect(messageMatchesCatalogue('WBA0402', 'LOT NUMBER MUST BE ENTERED.')).toBe(true);
  });

  it('recognises an alternate wording', () => {
    const alt = (MI_MESSAGES.WIT0101.alt || [])[0];
    expect(messageMatchesCatalogue('WIT0101', alt.replace('&1', 'ITEM-1'))).toBe(true);
  });

  it('is false when M3 said something else entirely', () => {
    expect(messageMatchesCatalogue('WWS0103', 'Something unrelated')).toBe(false);
    expect(messageMatchesCatalogue('WWS0103', '')).toBe(false);
    expect(messageMatchesCatalogue('ZZ99999', 'anything')).toBe(false);
  });
});

describe('extractErrorMessage with a catalogued code', () => {
  it('uses the catalogue as the headline when M3 sent a code and no text', () => {
    // This is the case that used to read "Receipt failed" and nothing else.
    const out = extractErrorMessage(
      { errorCode: 'WPU0201', program: 'MHS850MI', transaction: 'AddWhsLine' },
      'Receipt'
    );
    expect(out).toContain('Purchase order U/M is invalid');
    expect(out).not.toBe('Receipt failed');
  });

  it('explains a code that arrived without text', () => {
    const out = extractErrorMessage({ errorCode: 'WBA0402' }, 'Receipt');
    expect(out).toContain('Lot number must be entered');
  });

  it('does not repeat itself when M3 already explained the code', () => {
    const out = extractErrorMessage({
      errorCode: 'WWS0103',
      errorMessage: 'Location A-01-02 does not exist',
    });
    expect(out).toContain('Location A-01-02 does not exist');
    expect(out).not.toContain('• Means:');
  });

  it('adds the meaning when M3 sent unrelated or terser text', () => {
    const out = extractErrorMessage({ errorCode: 'MM24031', errorMessage: 'Failed' });
    expect(out).toContain('• Means:');
    expect(out).toContain('Serial number must be blank');
  });

  it('prints the catalogued sentence once, not twice', () => {
    // The headline and the "Means:" line both come from the catalogue when M3
    // sends a bare code, so the sentence used to appear in both.
    const out = extractErrorMessage({ errorCode: 'WBA0402', program: 'MHS850MI' });
    expect(out.split('Lot number must be entered').length - 1).toBe(1);
    expect(out).not.toContain('• Means:');
  });

  it('leaves an unknown code exactly as it behaved before', () => {
    const out = extractErrorMessage({ program: 'MMS240MI', errorCode: 'X1' });
    expect(out).not.toContain('• Means:');
  });
});

describe('describeLineFailure with MSID', () => {
  it('explains the line when MSGD came back blank', () => {
    // LstWhsLine returns MSID with an empty MSGD more often than not.
    const out = describeLineFailure({ MSID: 'WPU0201', MSGD: '', MSLN: '00002' });
    expect(out).toContain('Purchase order U/M is invalid');
    expect(out).toContain('Message id: WPU0201');
    expect(out).toContain('Line no: 00002');
  });

  it('keeps M3 text as the headline and attaches the fuller wording', () => {
    const out = describeLineFailure({ MSID: 'WWS0103', MSGD: 'Location A1 does not exist' });
    const lines = out.split('\n');
    expect(lines[0]).toBe('Location A1 does not exist');
    expect(out).toContain('WWS0103');
  });

  it('still falls back to BREM, and says nothing it cannot support', () => {
    expect(describeLineFailure({ BREM: 'Orig Loc: A-01' })).toContain('Orig Loc: A-01');
    expect(describeLineFailure({ MSID: 'ZZ99999' })).toBe('Message id: ZZ99999');
    expect(describeLineFailure(null as never)).toBe('');
  });
});
