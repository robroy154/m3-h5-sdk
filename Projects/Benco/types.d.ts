// Ambient declarations for the H5 script runtime so TypeScript can transpile
// without needing full SDK typings. Refine these as you migrate to real types.
declare const ScriptUtil: any;
declare const MIService: any;
declare class MIRequest {
  [key: string]: any;
}
declare const H5ControlUtil: any;
declare const MIRecord: any;
declare const $: any;
declare const jQuery: any;
declare const window: any;
declare const document: any;
declare const performance: any;
