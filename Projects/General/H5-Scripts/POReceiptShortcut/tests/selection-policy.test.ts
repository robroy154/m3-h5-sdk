import { describe, it, expect } from 'vitest';
import { evaluateSelection } from '../src/selection-policy';

describe('evaluateSelection', () => {
  it('proceeds on exactly one selected line', () => {
    expect(evaluateSelection(1, true).outcome).toBe('proceed');
  });

  it('proceeds on a focused-but-unselected line, preserving V4/V6 behaviour', () => {
    // Operators click into a line without ticking it; the grid reports no
    // selection but the row is addressable. This is the common path today.
    expect(evaluateSelection(0, true).outcome).toBe('proceed');
  });

  it('blocks any explicit multi-selection', () => {
    for (const n of [2, 3, 10, 25]) {
      const v = evaluateSelection(n, true);
      expect(v.outcome).toBe('blocked');
      expect(v.reason).toContain(String(n));
    }
  });

  it('blocks multi-selection regardless of the item being controlled', () => {
    // The refusal is uniform: it does not depend on lot/serial control,
    // because differing locations, UoM and partial-receipt semantics fail too.
    expect(evaluateSelection(2, true).outcome).toBe('blocked');
  });

  it('blocks when no line is addressable, rather than picking one', () => {
    const v = evaluateSelection(0, false);
    expect(v.outcome).toBe('blocked');
    expect(v.reason).toContain('Select the line');
  });

  it('never returns proceed without an addressable line', () => {
    for (const n of [0, 1, 2, 5]) {
      expect(evaluateSelection(n, false).outcome).toBe('blocked');
    }
  });

  it('gives a reason whenever it blocks, and none when it proceeds', () => {
    expect(evaluateSelection(3, true).reason.length).toBeGreaterThan(0);
    expect(evaluateSelection(1, true).reason).toBe('');
  });
});
