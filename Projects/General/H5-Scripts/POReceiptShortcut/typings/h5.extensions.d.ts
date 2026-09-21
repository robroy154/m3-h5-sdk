/*
 * Type augmentations for the H5 runtime.
 *
 * Not a staleness workaround. The vendored SDK is current — its CHANGELOG runs
 * to October 2025 — but Infor's own h5.script.d.ts has never declared several
 * APIs that H5ScriptDevelopersGuide.md documents in detail. Without this file
 * those calls are either invisible to the compiler or force an `any` cast at
 * every site.
 *
 * Every declaration below is taken from the guide, with the section named. A
 * documented API whose exact signature the guide does not pin down is left out
 * rather than guessed at — a wrong declaration is worse than none, because it
 * type-checks.
 *
 * Supersedes the per-customer augmentation file this asset grew out of, whose
 * GetValue and PressKey declarations were redundant because h5.script.d.ts
 * already has them.
 */

interface IActiveGrid {
    /**
     * The selected grid row(s). Guide §getSelectedGridRows().
     *
     * The guide's name is plural but its return description is singular ("The
     * selected row of the datagrid"), so the runtime shape is genuinely
     * ambiguous. Typed as an array for convenience; readSelectedRows() in the
     * adapter normalises whatever actually comes back, and selection-policy
     * handles zero, one and many regardless.
     */
    getSelectedGridRows(): any[];

    /** Replaces every row and re-renders once. */
    setData(rows: any[]): void;

    /** Guide §getCellElement(). Web components only. */
    getCellElement(row: number, columnId: string): HTMLElement;

    /** Guide §getRowElement(). Web components only. */
    getRowElement(row: number): HTMLElement;

    /** Guide §getPosFieldElement(). Web components only. */
    getPosFieldElement(posFieldId: string): HTMLElement;
}

interface IInstanceController {
    /** Guide §ShowBusyIndicator(). Must be paired with HideBusyIndicator(). */
    ShowBusyIndicator(): void;

    /** Guide §HideBusyIndicator(). */
    HideBusyIndicator(): void;
}

declare namespace ScriptUtil {
    /** H5 runtime version, e.g. 2.0. Used to pick the MIService shape. */
    let version: number;
}

/**
 * Guide §executeRequest()/executeRequestV2() and §execute()/executeV2().
 *
 * Merged into the existing `declare class MIService` rather than declared as a
 * separate type: an interface with the same name adds instance members to the
 * class.
 *
 * Returns Promise<IMIResponse>, not the Promise<{}> the SDK baseline uses for
 * executeRequest. `{}` accepts any non-nullish value, including a number or a
 * string, so it documents nothing and type-checks everything. IMIResponse is
 * what MI actually resolves.
 *
 * V2 is the more robust implementation; executeRequest() itself moved to the
 * version 2 endpoint in October 2025. Neither returns metadata unless the
 * request sets includeMetadata.
 */
interface MIService {
    executeRequestV2(request: IMIRequest): Promise<IMIResponse>;
    executeV2(
        program: string,
        transaction: string,
        record?: any,
        outputfields?: string[],
        timeout?: number
    ): Promise<IMIResponse>;
}

/**
 * The same three calls as statics.
 *
 * On H5 2.0+ scripts call `MIService.executeRequest(...)` directly; on 1.x they
 * go through `MIService.Current`. The baseline only declares the instance form.
 */
declare namespace MIService {
    function executeRequest(request: IMIRequest): Promise<IMIResponse>;
    function executeRequestV2(request: IMIRequest): Promise<IMIResponse>;
    function executeV2(
        program: string,
        transaction: string,
        record?: any,
        outputfields?: string[],
        timeout?: number
    ): Promise<IMIResponse>;
}
