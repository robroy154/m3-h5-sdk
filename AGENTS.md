# AI Agent Instructions — m3-h5-sdk

This file provides context for AI agents (Claude, Cursor, Aider, etc.) working in this repository. GitHub Copilot users: see `.github/copilot-instructions.md` and `.github/instructions/` for scoped guidance.

---

## Repository Purpose

This is a **multi-SDK repository** for Infor M3 ERP development. It contains three distinct SDK tracks and a `Projects/` directory with real-world implementations. Do **not** assume all files target the same platform or use the same APIs.

---

## SDK Taxonomy — Always Route to the Correct SDK

| Task | SDK | Folder | Key Constraint |
|---|---|---|---|
| Build a standalone M3 web app | **Odin SDK** | `SDKs/H5 Angular/` | Angular 18, RxJS 7, Node ≥18.19 |
| Customize an existing M3 H5 panel | **H5 Script SDK** | `SDKs/M3 H5 Scripting/` | Class name must match file name; `Init(args)` entry point |
| Build a Ming.le / OS Portal widget | **Widget SDK** | `SDKs/Widget SDKs/Infor_WidgetSDK_3.34.0/` | `widget.manifest` required; inline preferred |

**Before suggesting any implementation**, identify which SDK track is in scope and reference the corresponding samples folder.

---

## Critical Rules by SDK

### Odin SDK (`SDKs/H5 Angular/`)
- Core library (`@infor-up/m3-odin`) must remain Angular-agnostic — no Angular imports in core
- Use `MIServiceCore` for vanilla JS/TS; use `MIService` (Angular) for Angular projects
- M3 date format is `yyyyMMdd` — never ISO strings
- CONO/DIVI matrix params are auto-injected from `IUserContext`; don't hardcode them
- Project names must be lowercase, URL-safe, start with a letter
- Cloud auth: `odin login`; on-premise: basic auth (no login needed)

### H5 Script SDK (`SDKs/M3 H5 Scripting/`)
- **Class name must exactly match the file name** (case-sensitive, no extension)
- Entry point: `public static Init(args: IScriptArgs): void`
- `MIService.executeRequest()` / `executeRequestV2()` — use `.then(success, error)`
  two-argument form. Do NOT use `.catch()` or `.done()/.fail()`
- `IonApiService.Current.execute()` returns a Promise — use `.then(success, error)`
  two-argument form for the same reason
- **Top-level class declaration MUST use `var`** — see H5 Script Development Rules below
- Avoid ES6+ features without transpilation — not all H5 environments support modern JS
- Scripts run in shared browser context — avoid polluting global scope
- Clean up event handlers on deactivation to prevent memory leaks

### Widget SDK (`SDKs/Widget SDKs/`)
- Active version: `Infor_WidgetSDK_3.34.0` — use this for all new development
- Every widget package requires a valid `widget.manifest`
- `widgetId` must be lowercase dotted namespace; tenant widgets must start with `tenant.`
- Inline widgets require `moduleName` and `framework` (`angular` or `jquery`)
- Widgets must support Light, Dark, and HighContrast themes
- Prefer IDS Enterprise styling over custom CSS
- Use `targets` array (`default`, `banner`, `mobile`) instead of legacy single-target patterns
- Do not use React or AngularJS — only Angular or jQuery are supported

---

## Projects Directory

### `Projects/Benco/`
Client-specific work for Benco, organized by SDK type:
- `H5-Scripts/` — H5 Script customizations; see `Projects/Benco/H5-Scripts/README.md` for which files are current vs. experimental vs. deprecated
- `Widgets/` — Homepages widgets (future)
- `Odin-Apps/` — Standalone M3 apps (future)

### `Projects/General/Widgets/`
Reusable Homepages widgets. Each widget subfolder contains a `widget.manifest`.

---

## Sample Reference Paths

When generating or reviewing code, always cross-reference the appropriate samples:

- **Odin samples:** `SDKs/H5 Angular/m3-odin/samples/`
- **H5 Script samples:** `SDKs/M3 H5 Scripting/Samples/Samples/` (TypeScript source files)
- **Widget samples:** `SDKs/Widget SDKs/Infor_WidgetSDK_3.34.0/Samples/Widgets/`

If no matching sample exists, state that explicitly and follow documented public APIs only.

---

## Common Pitfalls to Avoid

1. **Mixing SDK APIs** — `MIService` in Odin uses RxJS Observables; in H5 Scripts it uses `.then(success, error)`. They are not interchangeable.
2. **Wrong date format** — Always `yyyyMMdd` for M3 inputs.
3. **Hardcoding CONO/DIVI** — Both SDKs inject these from user context automatically.
4. **Importing Angular in core** — `@infor-up/m3-odin` must stay framework-agnostic.
5. **Editing deprecated script versions** — Check `Projects/Benco/H5-Scripts/README.md` before editing any `POReceiptShortcut` variant.
6. **Using Widget SDK 3.0.1** — Always use `Infor_WidgetSDK_3.34.0` for new work.
7. **Using `const` or `let` for top-level class declarations in H5 scripts** — Scripts will silently fail to load. Always use `var` at the top level.
8. **Editing .js files directly in Projects/Benco/H5-Scripts/** — The .ts files are the source of truth. Always edit .ts and recompile.

---

## H5 Script Development Rules

### TypeScript Authoring
All H5 scripts in `Projects/` are authored in TypeScript (`.ts`) and compiled to
JavaScript (`.js`) using `tsc`. The `.ts` files are the source of truth. The compiled
`.js` files are what get deployed to M3 H5 via Administration Tools.

Never edit `.js` files directly. Always edit the `.ts` source and recompile.

### Top-Level Class Declaration
The H5 script loader requires the following pattern for class declarations:

```typescript
var ClassName = class {
  constructor(args: IScriptArgs) { ... }
  public static Init(args: IScriptArgs): void { ... }
}
```

NEVER use `const` or `let` for the top-level class declaration. The H5 framework
cannot find the class at initialization time if `const` or `let` is used, and the
script will silently fail to load with no error. This is a hard runtime requirement
of the H5 framework, not a style preference.

Use `const` and `let` freely inside methods and functions.

### Compile Command
```bash
tsc --project Projects/Benco/H5-Scripts/tsconfig.json
```

### Deployment
Always upload the compiled `.js` file to H5 Administration Tools > Data Files > H5 Script.
Never upload the `.ts` source file.

### Promise and Deferred Error Handling
Use the two-argument form of `.then()` for both MIService and IonApiService:

```typescript
// Correct
MIService.executeRequest(request).then(
  (response: IMIResponse) => { /* success */ },
  (response: IMIResponse) => { /* error */ }
);

// Wrong — .catch() breaks some minifiers because catch is a reserved word
MIService.executeRequest(request).catch((response: IMIResponse) => { });

// Also wrong — .done()/.fail() are jQuery Deferred patterns, now outdated
MIService.executeRequest(request).done(() => { }).fail(() => { });
```

### TypeScript Version
TypeScript 5.8.3 is installed globally. Do not reinstall or change the version.

### Type Definitions
Infor's official `.d.ts` files are located at:

### Best Practices and Recommendations

#### Preferred API Usage

- Use `InstanceController.ParentWindow` to get the current panel. Never use CSS class
  selectors like `$(".lawsonHost:visible")` or `$(".visible-tab-host")` as these are
  internal and will break on H5 updates.
- Use `ContentElement.AddElement()` to add elements to a panel. This aligns elements
  automatically to the panel row. Do NOT use `ContentElement.Add()` (requires exact
  pixel positioning) or `ControlFactory` (not part of the public API).
- Use `MIService` for all M3 API requests. Never use `ScriptUtil.ApiRequest()` which
  is deprecated.
- Use the `log` object from `IScriptArgs` for all logging. Never use `console.log()`
  directly. The `log` object supports log levels (Error, Warning, Info, Debug, Trace)
  that can be toggled on and off. `console.log()` cannot be turned off.

#### Event Handler Management

- Always unsubscribe from events when a panel navigates away or a script deactivates.
  Failure to do so causes memory leaks and multiple invocations of the same handler
  across different panel instances.
- Use `ScriptUtil.AddEventHandler()` and `ScriptUtil.RemoveEventHandler()` with
  namespaced event types (e.g. "click.myScriptName") so you can remove only your
  handler without affecting others.
- Pass data into event callbacks via the paramData argument rather than using anonymous
  functions that close over variables, as anonymous functions can cause memory leaks.

#### Script Instance Management

- Use `InstanceCache` to ensure a script only attaches once per program instance.
  Without this guard, navigating between panels can cause the script to attach
  multiple times, resulting in duplicate handlers and unpredictable behavior.

Example:
const key = "MyScriptName";
if (InstanceCache.ContainsKey(this.controller, key)) {
  return;
}
InstanceCache.Add(this.controller, key, true);

#### URL Handling

- Always use relative URLs when calling `ScriptUtil.Launch()` or adding personalization
  shortcuts that reference H5 or other M3 URLs sharing the same base URL as M3 H5.
  Using absolute URLs causes broken links when migrating between environments
  (dev, test, production).

#### Script Minification

- Before deploying any H5 script to production, minify the compiled .js file to reduce
  download size, remove comments, and obfuscate code.
- Always keep the original .ts source files in version control before minifying.
  Minified files cannot be debugged or maintained. The .ts files are your source of
  truth.
- Several open-source minifiers are available. The choice of minifier is up to the
  developer but verify it does not break on Promise.catch syntax — use the
  .then(success, error) pattern to avoid this entirely.

#### outputFields Usage in MIService

- Always specify the outputFields array on MIRequest to limit data transferred from
  the server. Only request fields you actually use in the script logic.
- This directly improves script performance, especially on list panels with many rows.

Example:
const request = new MIRequest();
request.program = "MNS150MI";
request.transaction = "GetUserData";
request.outputFields = ["USID", "CONO", "DIVI"];
