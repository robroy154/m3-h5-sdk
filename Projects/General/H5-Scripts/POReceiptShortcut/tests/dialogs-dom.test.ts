/**
 * @vitest-environment jsdom
 *
 * Real DOM tests for the two input dialogs.
 *
 * These exist because a `form.insertBefore(tools, list)` shipped against a
 * node that had not been appended yet, so every BACD 0 receipt died with
 * "Failed to execute 'insertBefore' on 'Node'". Nothing caught it: the dialogs
 * touch H5 globals and the DOM, so they had no coverage at all. H5ControlUtil
 * is stubbed below, which is enough to exercise everything this file builds.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { promptSerials, promptLot, openProgress } from '../src/dialogs';

interface Captured {
  content: HTMLElement;
  options: any;
}

let captured: Captured[] = [];

/** Clicks the named button on the most recently opened dialog. */
function clickButton(text: string): void {
  const dialog = captured[captured.length - 1];
  const button = dialog.options.buttons.find((b: any) => b.text === text);
  if (!button) throw new Error('No button labelled ' + text);
  button.click({}, { close: () => dialog.options.close && dialog.options.close() });
}

function inputs(): HTMLInputElement[] {
  const dialog = captured[captured.length - 1];
  return Array.from(dialog.content.querySelectorAll('input'));
}

function pressEnter(input: HTMLInputElement): void {
  input.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
}

beforeEach(() => {
  captured = [];
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  (globalThis as any).H5ControlUtil = {
    H5Dialog: {
      CreateDialogElement: (content: HTMLElement, options: any) => {
        captured.push({ content, options });
        // H5 attaches the content to the page; do the same so the tests see
        // the same tree the operator would.
        document.body.appendChild(content);
        return { close: vi.fn() };
      },
    },
  };
});

const serialOptions = {
  count: 3,
  maxLength: 20,
  itemNumber: '651103',
  poNumber: '2007775',
  allowGenerate: true,
  today: '20260921',
};

describe('promptSerials — DOM construction', () => {
  it('builds the dialog without throwing, tools above the list', () => {
    // This is the regression. insertBefore against a not-yet-appended list
    // threw here and the receipt reported "Receipt failed".
    void promptSerials(serialOptions);

    const form = captured[0].content;
    const children = Array.from(form.children).map((c) => c.className);
    expect(children).toContain('po-receipt-tools');
    expect(children).toContain('po-receipt-serials');
    expect(children.indexOf('po-receipt-tools'))
      .toBeLessThan(children.indexOf('po-receipt-serials'));
  });

  it('renders one input per unit', () => {
    void promptSerials(serialOptions);
    expect(inputs()).toHaveLength(3);
  });

  it('omits the tools entirely when generating is not allowed', () => {
    void promptSerials({ ...serialOptions, allowGenerate: false });
    const form = captured[0].content;
    expect(form.querySelector('.po-receipt-tools')).toBeNull();
    expect(form.querySelector('.po-receipt-serials')).not.toBeNull();
  });

  it('fills every field from the PO number when Generate is pressed', () => {
    void promptSerials(serialOptions);
    const form = captured[0].content;
    const generate = Array.from(form.querySelectorAll('button'))
      .find((b) => b.textContent === 'Generate serials');
    expect(generate).toBeDefined();
    generate!.click();
    expect(inputs().map((i) => i.value))
      .toEqual(['2007775-1', '2007775-2', '2007775-3']);
  });

  it('resolves the typed serials when OK is pressed', async () => {
    const promise = promptSerials(serialOptions);
    inputs().forEach((input, i) => { input.value = 'sn-' + (i + 1); });
    clickButton('OK');
    // Upper-cased on submit, and the close callback that follows must not
    // turn a completed entry into a cancellation.
    await expect(promise).resolves.toEqual(['SN-1', 'SN-2', 'SN-3']);
  });

  it('resolves null when Cancel is pressed', async () => {
    const promise = promptSerials(serialOptions);
    clickButton('Cancel');
    captured[0].options.close();
    await expect(promise).resolves.toBeNull();
  });

  it('stays open and explains when a serial is missing', async () => {
    const promise = promptSerials(serialOptions);
    inputs()[0].value = 'ONLY-ONE';
    clickButton('OK');

    const message = captured[0].content.querySelector('.po-receipt-message') as HTMLElement;
    expect(message.style.display).toBe('');
    expect(message.textContent).toBeTruthy();

    // Still unsettled, and what was typed is still there.
    inputs().forEach((input, i) => { input.value = 'sn-' + (i + 1); });
    clickButton('OK');
    await expect(promise).resolves.toEqual(['SN-1', 'SN-2', 'SN-3']);
  });

  it('moves focus to the next field on Enter, and submits on the last', async () => {
    const promise = promptSerials(serialOptions);
    const fields = inputs();

    fields[0].value = 'a';
    pressEnter(fields[0]);
    expect(document.activeElement).toBe(fields[1]);

    fields[1].value = 'b';
    pressEnter(fields[1]);
    expect(document.activeElement).toBe(fields[2]);

    fields[2].value = 'c';
    pressEnter(fields[2]);
    await expect(promise).resolves.toEqual(['A', 'B', 'C']);
  });

  it('lets a right-click through, so native paste survives', () => {
    void promptSerials(serialOptions);
    const event = new window.MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const stop = vi.spyOn(event, 'stopPropagation');
    inputs()[0].dispatchEvent(event);
    expect(stop).toHaveBeenCalled();
  });

  it('injects its stylesheet once, however many dialogs open', () => {
    void promptSerials(serialOptions);
    void promptSerials(serialOptions);
    expect(document.querySelectorAll('style#po-receipt-shortcut-styles')).toHaveLength(1);
  });
});

describe('promptLot — DOM construction', () => {
  const lotOptions = { itemNumber: 'Y21002', expiryRequired: false, today: '20260921' };

  it('always renders both the lot and the expiry field', () => {
    void promptLot(lotOptions);
    expect(inputs()).toHaveLength(2);
  });

  it('resolves the lot and expiry on OK', async () => {
    const promise = promptLot(lotOptions);
    const [lot, expiry] = inputs();
    lot.value = 'lot-1';
    expiry.value = '20271231';
    clickButton('OK');
    await expect(promise).resolves.toEqual({ lot: 'LOT-1', expiry: '20271231' });
  });

  it('accepts a lot with no expiry when the item needs none', async () => {
    const promise = promptLot(lotOptions);
    inputs()[0].value = 'lot-2';
    clickButton('OK');
    await expect(promise).resolves.toEqual({ lot: 'LOT-2', expiry: '' });
  });

  it('moves from the lot field to the expiry on Enter', () => {
    void promptLot(lotOptions);
    const [lot, expiry] = inputs();
    lot.value = 'lot-3';
    pressEnter(lot);
    expect(document.activeElement).toBe(expiry);
  });
});

describe('openProgress', () => {
  it('builds a bar and advances it', () => {
    const progress = openProgress(2);
    const fill = captured[0].content.querySelector('.po-receipt-progress-fill') as HTMLElement;
    const label = captured[0].content.querySelector('.po-receipt-progress-msg') as HTMLElement;

    progress.step('Transaction queued');
    expect(label.textContent).toBe('Transaction queued');
    expect(fill.style.width).toBe('50%');

    progress.done();
    expect(fill.style.width).toBe('100%');
  });

  it('cannot take a receipt down when the dialog will not open', () => {
    // Progress is decoration; the empty buttons array is untested against real
    // H5, so a throw here must not surface as a failed receipt.
    (globalThis as any).H5ControlUtil.H5Dialog.CreateDialogElement = () => {
      throw new Error('H5 refused the dialog');
    };
    const progress = openProgress(3);
    expect(() => { progress.step('x'); progress.done(); progress.close(); }).not.toThrow();
  });
});
