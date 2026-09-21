/**
 * Which PPS300/B line the script is allowed to act on.
 *
 * Both POReceiptShortcutV4 (live) and V6 read the line identity through
 * `ScriptUtil.GetFieldValue('PNLI' | 'PNLS' | 'ITNO' | 'WHSL')`, which returns
 * the CURRENT row. Neither looks at the selection. So with three lines
 * selected the script receives one of them and reports success, while the
 * operator believes all three went through. There is no guard for this
 * anywhere in either version.
 *
 * Policy, confirmed with the owner:
 *   - block any explicit multi-selection, uniformly — not just for
 *     lot/serial items. Differing locations is one failure mode; differing
 *     UoM, differing items and partial-receipt semantics are others, and one
 *     refusal is safer than three conditional ones.
 *   - keep today's behaviour when exactly one line is addressable.
 *   - never auto-select a row. Auto-selecting and then posting a goods receipt
 *     is how a receipt lands on the wrong line, and unwinding one costs far
 *     more than the click it saves.
 *
 * Pure: the H5 adapter reads the selection via IActiveGrid.getSelectedGridRows()
 * and passes the count in.
 */

export type SelectionOutcome = 'proceed' | 'blocked';

export interface SelectionVerdict {
  outcome: SelectionOutcome;
  /** Operator-facing reason. Empty when proceeding. */
  reason: string;
}

const PROCEED: SelectionVerdict = { outcome: 'proceed', reason: '' };

/**
 * @param selectedRowCount  rows the operator explicitly selected. A grid with
 *                          a merely focused row reports 0 here.
 * @param hasAddressableLine whether the panel yields a usable line identity
 *                          (PNLI/PNLS present on the current row).
 */
export function evaluateSelection(
  selectedRowCount: number,
  hasAddressableLine: boolean
): SelectionVerdict {
  if (selectedRowCount > 1) {
    return {
      outcome: 'blocked',
      reason:
        'This shortcut receives one order line at a time. ' +
        selectedRowCount +
        ' lines are selected — select a single line and run it again.',
    };
  }

  if (!hasAddressableLine) {
    return {
      outcome: 'blocked',
      reason:
        'No order line is selected. Select the line to receive, then run the shortcut again.',
    };
  }

  // Exactly one selected row, or none selected but a current row is
  // addressable: the long-standing behaviour, and what operators expect when
  // they click straight into a line.
  return PROCEED;
}
