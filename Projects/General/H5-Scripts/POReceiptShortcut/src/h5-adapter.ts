/**
 * The only file in this asset that touches an H5 global.
 *
 * Everything else takes its dependencies by injection, which is what makes the
 * rest of the script testable without a browser or a tenant. This file is the
 * boundary: it wraps MIService, ConfirmDialog, the busy indicator and the grid
 * behind the small interfaces the other modules expect, and is deliberately
 * thin enough that reading it is an adequate substitute for testing it.
 */

import { CompanyScope, MiRequestSpec, MiResponse } from './mi-gateway';
import { DIALOG_TITLES, DialogType } from './presentation';
import { ReceiptLog } from './receipt-engine';

/** Company keys read once at start-up and injected per transaction. */
export interface CompanyContext {
  company: string;
  division: string;
}

/**
 * Reads CONO/DIVI from the H5 user context.
 *
 * Both spellings are tried because the runtime has used both. A failure is not
 * fatal: MI resolves the user's own company when the record omits it, so an
 * empty context degrades to M3's default rather than stopping the script.
 */
export function readCompanyContext(log: ReceiptLog): CompanyContext {
  try {
    const context =
      typeof ScriptUtil.GetUserContext === 'function'
        ? ScriptUtil.GetUserContext() || {}
        : {};
    return {
      company: context.CurrentCompany || context.CONO || '',
      division: context.CurrentDivision || context.DIVI || '',
    };
  } catch (error) {
    log.Warning(
      'Could not read the user context; MI will resolve company and division ' +
        'itself: ' + ((error && (error as Error).message) || error)
    );
    return { company: '', division: '' };
  }
}

/** Applies the scope the spec declares. See CompanyScope for why it varies. */
export function applyCompanyScope(
  record: Record<string, string>,
  scope: CompanyScope | undefined,
  context: CompanyContext
): Record<string, string> {
  if (!scope || scope === 'none') return record;

  const scoped = { ...record };
  if (context.company) scoped.CONO = context.company;
  if (scope === 'company-division' && context.division) {
    scoped.DIVI = context.division;
  }
  return scoped;
}

/**
 * Builds the executor the gateway and engine run on.
 *
 * `.then(onSuccess, onError)` rather than `.catch()`: `catch` is a reserved
 * word and some M3 minifiers break on the member form. The rejection is
 * re-thrown as-is so the error classifiers upstream still see the MI response
 * shape rather than a wrapper.
 */
export function createExecutor(
  context: CompanyContext,
  log: ReceiptLog
): (spec: MiRequestSpec) => Promise<MiResponse> {
  // Static on H5 2.0+, an instance on 1.x.
  const service: any = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;

  return (spec: MiRequestSpec): Promise<MiResponse> => {
    const request = new MIRequest();
    request.program = spec.program;
    request.transaction = spec.transaction;
    request.record = applyCompanyScope(spec.record, spec.scope, context);
    if (spec.outputFields) request.outputFields = spec.outputFields;
    request.maxReturnedRecords =
      spec.maxReturnedRecords === undefined ? 1 : spec.maxReturnedRecords;

    log.Debug(spec.program + '/' + spec.transaction);

    return service.executeRequest(request).then(
      (response: MiResponse) => response,
      (error: MiResponse) => {
        throw error;
      }
    );
  };
}

/* ─── Dialogs ────────────────────────────────────────────────────────────── */

/**
 * A themed message dialog.
 *
 * ConfirmDialog is H5's own, so it follows the operator's theme with no CSS
 * from this script. V6 hand-rolled every dialog with hardcoded hex, which is
 * why it rendered the same under Light, Dark and HighContrast.
 */
export function showMessage(
  header: string,
  message: string,
  dialogType: DialogType = 'Information'
): Promise<void> {
  return new Promise((resolve) => {
    ConfirmDialog.ShowMessageDialog({
      header,
      message,
      dialogType,
      closed: () => resolve(),
    });
  });
}

/**
 * Asks the operator to confirm.
 *
 * Resolves false on cancel. A cancel is an answer, not a failure — V6 routed
 * "Operation cancelled by user" into its error dialog, so deliberately backing
 * out looked like something had gone wrong.
 */
export function confirm(
  header: string,
  message: string,
  dialogType: DialogType = 'Information'
): Promise<boolean> {
  return new Promise((resolve) => {
    ConfirmDialog.Show({
      header,
      message,
      dialogType,
      withCancelButton: true,
      closed: (args) => resolve(!!(args && args.ok)),
    });
  });
}

/** Reports a failure. Titles carry no emoji; dialogType conveys severity. */
export function showError(message: string): Promise<void> {
  return showMessage(DIALOG_TITLES.error, message, 'Error');
}

/* ─── Busy indicator ─────────────────────────────────────────────────────── */

/**
 * Runs work with the busy indicator up, and always takes it down.
 *
 * Scoped to one operation on purpose. V6 raised it once across the whole run,
 * including the serial and lot prompts, which left the panel looking frozen
 * while it was in fact waiting on the operator — contradicting its own three
 * "User interaction - NO busy" comments.
 */
export async function withBusyIndicator<T>(
  controller: IInstanceController,
  work: () => Promise<T>
): Promise<T> {
  controller.ShowBusyIndicator();
  try {
    return await work();
  } finally {
    controller.HideBusyIndicator();
  }
}

/* ─── Grid selection ─────────────────────────────────────────────────────── */

/**
 * The selected rows, whatever shape the runtime returns.
 *
 * getSelectedGridRows() is documented in the developer guide but absent from
 * Infor's .d.ts, and the guide is ambiguous about arity — a plural name with a
 * singular return description. Rather than pick a reading, this normalises
 * both, and selection-policy decides what zero, one or many mean.
 */
export function readSelectedRows(grid: IActiveGrid | null): any[] {
  if (!grid || typeof grid.getSelectedGridRows !== 'function') return [];
  try {
    const rows = grid.getSelectedGridRows();
    if (Array.isArray(rows)) return rows;
    return rows ? [rows] : [];
  } catch {
    return [];
  }
}

/* ─── Timing ─────────────────────────────────────────────────────────────── */

/** The one place this script owns a timer. Injected everywhere else. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
