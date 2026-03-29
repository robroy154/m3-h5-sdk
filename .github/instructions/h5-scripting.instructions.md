---
applyTo: "{SDKs/M3 H5 Scripting/**,Projects/**/*.{ts,js}}"
---

# H5 Script SDK — In-Panel Customization Guide

## Folder Reference
Always check `SDKs/M3 H5 Scripting/Samples/Samples/` for existing TypeScript patterns before introducing new ones.  
Full API documentation: `SDKs/M3 H5 Scripting/Documentation/H5ScriptDevelopersGuide.md`

## What This SDK Does
Scripts built with this SDK run **inside** existing M3 H5 panels — they are not standalone apps. They are deployed via M3 H5 Administration → Script Management.

## Critical File Requirements
- **Class name must exactly match the file name** (case-sensitive, no extension) — the H5 runtime uses this to locate the class
- Must expose: `public static Init(args: IScriptArgs): void`
- TypeScript preferred; compile to JS before deploying
- Minify JS for production; retain the original TypeScript source

## Basic Script Structure
```typescript
class MyScript {
    private controller: IInstanceController;
    private log: IScriptLog;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
    }

    public static Init(args: IScriptArgs): void {
        new MyScript(args);
    }
}
```

## IScriptArgs
| Property | Type | Description |
|---|---|---|
| `controller` | `IInstanceController` | Access to M3 form/panel |
| `log` | `IScriptLog` | Browser console logging |
| `args` | `string` | Arguments passed at script attachment |
| `elem` | `Element` | Control the script is attached to (null if global) |

## Key APIs

### InstanceController
```typescript
this.controller.GetValue("ITNO")          // Get field value
this.controller.SetValue("ITNO", "ABC")   // Set field value
this.controller.PressKey("ENTER")         // Simulate key press
this.controller.ShowMessage("Done")       // Show message to user
this.controller.GetProgramName()          // e.g. "MMS200"
this.controller.GetPanelName()            // e.g. "B"
this.controller.GetContentElement()       // Access form layout
this.controller.GetGrid()                 // Access list/grid (list panels only)
```

### MIService (jQuery Deferred — NOT RxJS)
```typescript
const request = new MIRequest();
request.program = "MMS200MI";
request.transaction = "GetItmBasic";
request.record = { ITNO: "ABC123" };
request.outputFields = ["ITDS", "UNMS"];

MIService.Current.executeRequest(request)
    .done((response: MIResponse) => {
        const items = response.items;
    })
    .fail((error: MIResponse) => {
        this.log.Error("MI call failed: " + error.errorMessage);
    });
```
⚠️ This uses jQuery Deferred (`.done()/.fail()`), not RxJS Observables — different from the Odin SDK.

### IonApiService (Promise)
```typescript
IonApiService.Current.execute({
    url: "/TENANT/M3/m3api-rest/execute/CRS610MI/GetBasicData",
    method: "POST",
    data: { CUNO: "ABC123" }
}).then((response) => {
    // handle response
}).catch((error) => {
    this.log.Error("ION API failed");
});
```

### ScriptUtil
```typescript
ScriptUtil.GetFieldValue(this.controller, "ITNO")
ScriptUtil.SetFieldValue(this.controller, "ITNO", "ABC")
ScriptUtil.Launch("/mforms/MMS200")
ScriptUtil.GetUserContext()              // Returns IUserContext (USID, company, division)
ScriptUtil.LoadScript("OtherScript")
```

### ScriptLog
```typescript
this.log.Error("message");
this.log.Warning("message");
this.log.Info("message");
this.log.Debug("message");
this.log.Trace("message");
```

### MForms Automation
```typescript
const automation = new MFormsAutomation();
automation.addStep()
    .addField("ITNO", "ABC123")
    .addField("WHLO", "001")
    .setFocus("STQT");
ScriptUtil.Launch(`/mforms/CMS100?automation=${automation.toEncodedURI()}`);
```

## Development Setup
```bash
# Option 1: VS Code + Node (recommended)
cd "SDKs/M3 H5 Scripting/Samples/Nodejs"
npm install && node webserver.js     # http://localhost:8080

# Option 2: Visual Studio
# Open SDKs/M3 H5 Scripting/Samples/Samples.sln
```

## Best Practices
- Always match class name to file name — this is non-negotiable
- Use try/catch around controller interactions; log errors at appropriate level
- Avoid ES6+ features without transpilation — not all H5 environments run modern JS
- Clean up event handlers to prevent memory leaks in long-running sessions
- Do not pollute global scope — wrap logic inside the class
- Use relative URLs when calling M3 endpoints on the same host
- Ctrl+F5 in the H5 client clears the script cache after deployment

## Sample Scripts (SDKs/M3 H5 Scripting/Samples/Samples/)
- `H5SampleAddElements.ts` — Adding custom UI elements
- `H5SampleCancelRequest.ts` — Intercepting form requests
- `H5SampleCustomColumns.ts` — Modifying list columns
- `H5SampleMIService.ts` — MI transaction examples
- `H5SampleIonApiService.ts` — ION API integration
- `H5SampleMFormsAutomation.ts` — Automation sequences
- `H5SampleDrillback.ts` — Drillback integration

## Projects/Benco/ — Current File Status
See `Projects/Benco/README.md` for which POReceiptShortcut version is current and which files are deprecated.
