/**
 * h5.benco.d.ts
 * Local type augmentations for the Benco H5 Scripts project.
 *
 * These declarations extend the SDK typings from:
 *   SDKs/M3 H5 Scripting/Templates/H5ScriptsProjectTemplate/
 *   H5ScriptsProjectTemplate/typings/h5.script.d.ts
 *
 * The Templates typings are the baseline. This file merges in members
 * that are present in the H5 2.0+ runtime but absent from that baseline.
 */

// ---------------------------------------------------------------------------
// IActiveGrid — add members that are missing from the Templates typings.
// Interface declarations can be merged freely.
// ---------------------------------------------------------------------------
interface IActiveGrid {
    /**
     * Replaces all rows in the grid with the supplied array and triggers a
     * re-render. Used after batch-populating custom columns to avoid N
     * individual re-renders.
     */
    setData(rows: any[]): void;

    /**
     * Returns the DOM element for the position field identified by fieldName.
     * Used by BEN_H5_AutoComplete to locate search input fields in grid headers.
     */
    getPosFieldElement(fieldName: string): any;
}

// ---------------------------------------------------------------------------
// IInstanceController — add methods present at runtime but missing from Templates typings.
// ---------------------------------------------------------------------------
interface IInstanceController {
    /**
     * Shows the H5 busy/loading indicator. Used while async operations are in progress.
     */
    ShowBusyIndicator(): void;

    /**
     * Hides the H5 busy/loading indicator.
     */
    HideBusyIndicator(): void;

    /**
     * Returns the current value of the named H5 screen field.
     */
    GetValue(fieldName: string): string;

    /**
     * Simulates a key press (e.g. "F5" to refresh) in the H5 host application.
     */
    PressKey(key: string): void;
}

// ---------------------------------------------------------------------------
// ScriptUtil — add the version property used for MIService detection.
// declare class cannot be re-opened, but a namespace with the same name
// merges into the class and adds static members.
// ---------------------------------------------------------------------------
declare namespace ScriptUtil {
    /**
     * The H5 runtime version number (e.g. 2.0).
     * Scripts use this to choose between MIService (v2+) and
     * MIService.Current (v1).
     */
    let version: number;
}
