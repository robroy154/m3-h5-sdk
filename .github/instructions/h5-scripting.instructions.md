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
// `var`, NOT `class`, `const` or `let`. The H5 loader resolves the class off
// the global object at init time; with `const`/`let` it cannot find it and the
// script fails to load silently, with no error.
var MyScript = class {
    private controller: IInstanceController;
    private log: IScriptLog;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
    }

    public static Init(args: IScriptArgs): void {
        // Guard against re-attaching when the operator returns to the panel.
        if (InstanceCache.ContainsKey(args.controller, "MyScript")) { return; }
        InstanceCache.Add(args.controller, "MyScript", true);
        new MyScript(args).run();
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

### MIService (Promise — NOT RxJS, and NOT jQuery Deferred)
```typescript
const request = new MIRequest();
request.program = "MMS200MI";
request.transaction = "GetItmBasic";
request.record = { ITNO: "ABC123" };
// Always set outputFields. Only ask for what the script reads.
request.outputFields = ["ITDS", "UNMS"];

// H5 2.0+ calls MIService statically; 1.x goes through MIService.Current.
const mi = ScriptUtil.version >= 2.0 ? MIService : MIService.Current;

mi.executeRequest(request).then(
    (response: IMIResponse) => {
        const items = response.items;
    },
    (error: IMIResponse) => {
        this.log.Error("MI call failed: " + error.errorMessage);
    }
);
```
⚠️ `executeRequest` returns a **Promise** — `h5.script.d.ts` declares
`executeRequest(request: IMIRequest): Promise<{}>`. `.done()/.fail()` is a
jQuery Deferred pattern and does not apply here.

⚠️ Use the two-argument `.then(success, error)`, never `.catch()`: `catch` is a
reserved word and some M3 minifiers break on the member form.

`executeRequestV2()` and `executeV2()` also exist and are documented in the
developer guide, though they are missing from `h5.script.d.ts`. `executeRequest()`
itself moved to the version 2 endpoint in October 2025. Neither returns metadata
unless the request sets `includeMetadata`.

### IonApiService (Promise)
```typescript
IonApiService.Current.execute({
    url: "/TENANT/M3/m3api-rest/execute/CRS610MI/GetBasicData",
    method: "POST",
    data: { CUNO: "ABC123" }
}).then(
    (response) => {
        // handle response
    },
    (error) => {
        this.log.Error("ION API failed");
    }
);
```
⚠️ Two-argument `.then()` here too, for the same minifier reason.

### ScriptUtil
```typescript
// Field name FIRST, controller optional and second.
ScriptUtil.GetFieldValue("ITNO")                    // uses the active controller
ScriptUtil.GetFieldValue("ITNO", this.controller)
ScriptUtil.SetFieldValue("ITNO", "ABC")             // name, value, optional controller
ScriptUtil.Launch("/mforms/MMS200")                 // relative URLs only
ScriptUtil.GetUserContext()                          // USID, company, division
ScriptUtil.LoadScript("scripts/Other.js", data => { })   // a URL, not a script name
ScriptUtil.AddEventHandler(element, "click.myScript", handler)
ScriptUtil.RemoveEventHandler(element, "click.myScript")
```
⚠️ `Launch()` and personalization shortcuts take **relative** URLs. Absolute
ones break when the tenant is migrated between dev, test and production.

⚠️ `h5.script.d.ts` declares `SetFieldValue(fieldName, controller): string`. The
developer guide documents `SetFieldValue(fieldName, value, controller?): void`,
which is the real signature — the typing is wrong.

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
// addStep() returns void — it does not chain.
const automation = new MFormsAutomation();
automation.addStep(ActionType.Run, "CMS100");
automation.addField("ITNO", "ABC123");
automation.addField("WHLO", "001");
automation.setFocus("STQT");
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
- Declare the top-level class with `var`, never `const`/`let`
- Use `InstanceCache` so a script attaches once per program instance
- Use `ScriptUtil.AddEventHandler`/`RemoveEventHandler` with a namespaced event
  type (`"click.myScript"`) so removal cannot disturb other handlers
- Use `InstanceController.ParentWindow` to reach the panel. Never CSS selectors
  like `$(".lawsonHost:visible")` — those are internal and break on H5 updates
- Use `ContentElement.AddElement()`, not `.Add()` or `ControlFactory`
- Use the `log` object, never `console.*` — log levels can be turned off
- Never use `ScriptUtil.ApiRequest()`; it is deprecated in favour of `MIService`
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

## Projects/ — Current File Status
- `Projects/General/H5-Scripts/` — reusable, customer-agnostic scripts. Start
  here for anything not specific to one customer.
- `Projects/Benco/H5-Scripts/` — customer-specific scripts. See that folder's
  `README.md` for which files are live, frozen or archived.

`AGENTS.md` at the repository root is the single source of truth for the H5
rules above. Where this file and `AGENTS.md` differ, `AGENTS.md` wins.
