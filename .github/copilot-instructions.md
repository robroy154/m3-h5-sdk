# M3 Odin SDK Development Guide

## SDK Folder Reference Requirement (Global Compliance)
- Always reference the relevant SDK folder in this repository before suggesting implementation details.
- Use folder-specific examples as the primary source of truth to ensure platform compliance:
    - Odin app patterns: `SDKs/H5 Angular/`
    - H5 in-panel scripting patterns: `SDKs/M3 H5 Scripting/`
    - Homepages widget patterns: `SDKs/Widget SDKs/`
- When uncertain, prefer existing sample implementations in these SDK folders over introducing new patterns.
- If no matching sample exists, explicitly state that and follow documented public APIs only.

## Project Overview
The M3 Odin SDK is a framework for building web applications for Infor M3 ERP. It consists of three NPM packages that work together:
- **@infor-up/m3-odin-cli**: Command-line interface for project scaffolding and build tooling
- **@infor-up/m3-odin**: Core API with RxJS-based services for M3 integration (framework-agnostic)
- **@infor-up/m3-odin-angular**: Angular-specific wrappers and DI integration

## Architecture

### Monorepo Structure
- `/cli`: CLI tool with boilerplate templates and build scripts
- `/m3-odin`: Angular workspace containing library sources and samples
  - `/projects/infor-up/m3-odin`: Core library (RxJS only, no Angular deps)
  - `/projects/infor-up/m3-odin-angular`: Angular wrapper services
  - `/src`: Sample applications demonstrating SDK usage
- `/H5ScriptSDK_10.4.1_20251022`: **Separate H5 Script SDK** (Oct 2025 release) - for scripts that run inside H5 panels/screens (different use case than Odin)

### H5 Script SDK vs Odin SDK
**Important distinction**: This repo contains TWO different SDKs with different purposes:
- **Odin SDK** (`/m3-odin`, `/cli`): Build standalone web applications deployed as H5 apps at `/mne/apps/{name}`. Uses RxJS services, runs in its own context.
- **H5 Script SDK** (`/H5ScriptSDK_10.4.1_20251022`): Create TypeScript/JavaScript scripts that run **inside** M3 H5 panels/screens. Uses global interfaces (`IInstanceController`, `IContentElement`, `IScriptArgs`, etc.), manipulates existing H5 UI elements directly.

Use Odin for new applications with custom UI. Use H5 Script SDK only when extending/customizing existing M3 screens.

### Core vs Angular Pattern
**Critical distinction**: The core library (`@infor-up/m3-odin`) implements "Core" classes with RxJS Observables that have NO Angular dependencies. Angular services in `@infor-up/m3-odin-angular` wrap these core classes and provide DI integration:
- `MIServiceCore` (core) → `MIService` (Angular)
- `UserServiceCore` (core) → `UserService` (Angular)
- `ApplicationServiceCore` (core) → `ApplicationService` (Angular)
- `FormServiceCore` (core) → `FormService` (Angular)
- `IonApiServiceCore` (core) → `IonApiService` (Angular)

Use Core classes for vanilla JS/TS projects; use Angular services when working with Angular projects.

### Key Services
- **MIService**: Execute M3 MI (Machine Interface) programs. Uses `MIRecord` for input/output with proper date formatting (yyyyMMdd) and decimal handling (dot separator)
- **UserService**: Retrieve user context (USID, company, division, language) from MNS150
- **FormService**: Execute M3 bookmarks (saved queries/transactions)
- **ApplicationService**: Launch M3 programs within H5 client tabs
- **IonApiService**: Call Infor ION APIs with OAuth2 bearer tokens

## Development Workflows

### Building the SDK
From `/m3-odin` directory:
```bash
npm run build:libs              # Build both core and angular libraries
npm run build:lib-core          # Build @infor-up/m3-odin only
npm run build:lib-angular       # Build @infor-up/m3-odin-angular only
```

### CLI Development
From `/cli` directory:
```bash
npm run build                   # Compile TypeScript to dist/
npm run build:watch             # Watch mode for CLI development
```
CLI entry point is `dist/cli.js` (see package.json bin field)

### Publishing Workflow
From `/m3-odin` directory:
```bash
npm run odin-update-version 7.2.0  # Update version in all packages
npm run odin-pack                  # Create .tgz packages in /dist
npm run odin-publish               # Publish to NPM (requires npm login)
```

### Testing
From `/m3-odin` directory:
```bash
npm run test         # Karma tests in watch mode
npm run test:once    # Single run tests for CI
```

## CLI Usage Patterns

### Creating Projects
```bash
odin new                        # Interactive wizard for Angular/basic projects
```
Boilerplate templates in `/cli/boilerplate/`:
- `angular-soho`: Angular + IDS Enterprise components
- `angular`: Angular without UI framework
- `basic`: Vanilla TypeScript with Webpack

### Development Server
```bash
odin serve                      # Start webpack-dev-server (basic) or ng serve (Angular)
odin serve --multi-tenant       # Enable cloud auth with saved ION tokens
odin serve --ion-api            # Include ION API proxy routes
```
**Key behavior**: Server uses `odin.json` for proxy configuration. All M3 API requests route through dev server proxy to avoid CORS issues.

### Authentication Flow
```bash
odin login                                    # OAuth2 flow for cloud environments
odin login --m3                               # Also fetch M3 session cookie
odin login --update-config                    # Update odin.json proxy targets
```
On-premise M3 uses basic auth (no `odin login` needed). Cloud environments require OAuth2 bearer tokens saved via `odin login`.

### Building for Deployment
```bash
odin build                      # Creates dist/{projectName}.zip for H5 upload
```
The ZIP file name becomes the app context root in H5 (e.g., `/mne/apps/{projectName}`)

### Configuration
```bash
odin set m3-proxy https://m3server
odin set ion-proxy https://ionserver/TENANT
```
Modifies `/odin.json` proxy configuration

## Code Conventions

### Base Class Pattern
All SDK classes extend `CoreBase` for consistent error handling:
```typescript
export class MyClass extends CoreBase {
   constructor() {
      super('MyClass');  // Component name for logging
   }
}
```
`CoreBase` extends `ErrorState` which implements `IErrorState` for error tracking.

### MI Transaction Patterns
```typescript
const request: IMIRequest = {
   program: 'MMS200MI',
   transaction: 'GetItmBasic',
   record: { ITNO: 'ABC123' },      // Input as plain object
   outputFields: ['ITDS', 'UNMS'],  // Limit fields returned
   typedOutput: true,                // Enable type conversion for dates/numbers
};

miService.execute(request).subscribe((response: IMIResponse) => {
   const items: MIRecord[] = response.items;  // Always an array
   items.forEach(item => {
      const desc = item.ITDS;  // Typed if typedOutput: true
   });
});
```
**Important**: Use `MIRecord` class methods (`setDateString`, `setNumberString`) when building input to ensure proper formatting.

### Date Handling
M3 requires `yyyyMMdd` format. Use `MIUtil.getDateFormatted(date)` or `MIRecord.setDateString()` for input dates.

### User Context Pattern
Always load and cache `IUserContext` during app initialization. `MIService` automatically uses `currentCompany` and `currentDivision` as matrix parameters unless overridden in `IMIRequest`.

## Dependencies & Versioning
- **Node.js**: >=18.19.0 (see package.json engines)
- **Angular**: 18.2.4 (major version bump in v7.0.0)
- **IDS Enterprise**: 18.2.4 (Infor Design System, optional)
- **TypeScript**: ~5.4.0
- **RxJS**: ^7.8.0

Breaking change in v7.0.0: Angular 18 + Node 18+ required. Material Design support removed.

## Common Pitfalls
- **Don't import Angular services in core library**: Core packages must remain Angular-agnostic
- **Proxy auth confusion**: Cloud environments need `odin login`, on-premise uses basic auth
- **Date format errors**: Always use `yyyyMMdd` for MI date inputs, not ISO strings
- **Missing matrix parameters**: CONO/DIVI are auto-added from UserContext unless explicitly set in MIRequest
- **Project name rules**: Must be lowercase, URL-safe, start with letter (npm package name rules)

## Testing Locally
1. Build libraries: `cd m3-odin && npm run build:libs`
2. Link CLI globally: `cd ../cli && npm link`
3. Test CLI commands: `odin new test-project`
4. Update proxy: `cd test-project && odin set m3-proxy https://your-m3-server`
5. Serve: `odin serve`

## H5 Deployment
Applications are deployed as ZIP files to H5 Administration:
1. Build: `odin build` → creates `dist/{projectName}.zip`
2. Upload via H5 Admin → Applications tab → Install
3. Access at `/mne/apps/{projectName}` or via Ctrl+R in H5 client

---

## H5 Script SDK (In-Panel Customization)

### Overview
The H5 Script SDK (version 10.4.1, Oct 2025) allows developers to create TypeScript/JavaScript scripts that run **inside** existing M3 H5 panels to extend or customize their functionality. Unlike Odin apps, these scripts don't create standalone applications but instead enhance existing M3 forms.

**Location**: `/H5ScriptSDK_10.4.1_20251022/`

### Script File Requirements
Scripts must follow specific rules to be executed by the H5 framework:
- **Class name must match file name** (excluding extension) - this is critical
- Must have a `public static Init(args: IScriptArgs): void` method
- TypeScript is preferred over JavaScript for type safety and IDE support
- Scripts can leverage jQuery (though future platform updates may impact availability)

### Basic Script Structure
```typescript
class MyScript {
    private controller: IInstanceController;
    private log: IScriptLog;
    private args: string;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
    }

    /**
     * Script initialization function - required entry point
     */
    public static Init(args: IScriptArgs): void {
        new MyScript(args);
        // Initialization code here
    }
}
```

### IScriptArgs Interface
The Init method receives an `IScriptArgs` object containing:
- **controller**: `IInstanceController` - Access to the M3 form/panel
- **log**: `IScriptLog` - Logging utility for browser console
- **args**: `string` - Script arguments passed during attachment
- **elem**: Element - The control the script is attached to (null if not element-specific)

### Key H5 Script APIs

#### InstanceController
Primary interface for interacting with M3 forms:
- **Properties**:
  - `Cache: SessionCache` - Session-level cache
  - `ParentWindow: JQuery` - Parent window element
  - `RenderEngine: RenderEngine` - Access to content rendering
  - `Response: ResponseElement` - Current response data
  - Event properties: `Requesting`, `Requested`, `RequestCompleted`
  
- **Key Methods**:
  - `GetValue(fieldName: string): string` - Get field value
  - `SetValue(fieldName: string, value: string)` - Set field value
  - `GetContentElement(): ContentElement` - Access form content
  - `GetGrid(): ListControl` - Access list/grid control
  - `PressKey(key: string)` - Simulate key press (e.g., "ENTER", "F3")
  - `ShowMessage(message: string)` - Display message to user
  - `ExportToExcel()` - Export list data to Excel
  - `GetProgramName(): string` - Current M3 program name
  - `GetPanelName(): string` - Current panel name

#### ContentElement
Access and modify form layout:
- `Add(element: any)` - Add element to form
- `CreateElement(type: string, properties: any)` - Create new UI element
- `GetElement(name: string)` - Find element by name
- `RemoveScriptComponents()` - Clean up script-added elements

#### ListControl / ListView
Work with M3 list panels:
- `GetColumnIndexByName(name: string): number`
- `GetListColumnData(): any[]` - Get all column data
- `GetValueByColumnName(columnName: string): string`
- `SetValueByColumnName(columnName: string, value: string)`
- `SelectedItem()` - Get selected list item

#### ScriptLog
Logging utility with severity levels:
```typescript
this.log.Error("Error message");
this.log.Warning("Warning message");
this.log.Info("Info message");
this.log.Debug("Debug message");
this.log.Trace("Trace message");
```

#### ScriptUtil
Utility functions for common tasks:
- `GetFieldValue(controller, fieldName)` - Safe field value retrieval
- `SetFieldValue(controller, fieldName, value)` - Safe field value setting
- `Launch(link: string)` - Launch M3 program
- `OpenMenu(menuName: string)` - Open M3 menu
- `GetUserContext(): IUserContext` - Get user/company/division context
- `DoEnterpriseSearch(query)` - Trigger M3 search
- `LoadScript(scriptName: string)` - Dynamically load another script
- `UnloadScript(scriptName: string)` - Unload a script

#### MIService
Execute M3 MI (Machine Interface) transactions:
```typescript
const request = new MIRequest();
request.program = "MMS200MI";
request.transaction = "GetItmBasic";
request.record = { ITNO: "ABC123" };
request.outputFields = ["ITDS", "UNMS"];

MIService.Current.executeRequest(request)
    .done((response: MIResponse) => {
        // Process response.items array
    })
    .fail((error: MIResponse) => {
        this.log.Error("MI call failed: " + error.errorMessage);
    });
```

#### IonApiService
Call Infor ION APIs with OAuth2:
```typescript
const request: IonApiRequest = {
    url: "/TENANT/M3/m3api-rest/execute/CRS610MI/GetBasicData",
    method: "POST",
    data: { CUNO: "ABC123" }
};

IonApiService.Current.execute(request)
    .then((response: IonApiResponse) => {
        // Process response
    })
    .catch((error) => {
        this.log.Error("ION API failed");
    });
```

### MForms Automation
Execute automated sequences of M3 transactions:
```typescript
const automation = new MFormsAutomation();
automation.addStep()
    .addField("ITNO", "ABC123")
    .addField("WHLO", "001")
    .setFocus("STQT");

const uri = automation.toEncodedURI();
// Launch program with automation
ScriptUtil.Launch(`/mforms/CMS100?automation=${uri}`);
```

### Drillback Integration
Launch M3 bookmarks from external applications:
```typescript
infor.companyon.client.sendPrepareDrillbackMessage({
    logicalId: "lid://infor.m3.CRS610",
    parameters: {
        "infor.m3.parameter.company": "001",
        "infor.m3.parameter.CUNO": "ABC123"
    }
});
```

### Development Setup
Two recommended approaches:

**Option 1: Visual Studio + IIS Express**
- Open `/H5ScriptSDK_10.4.1_20251022/Samples/Samples.sln`
- Run samples on built-in IIS Express server
- Debugging with breakpoints supported

**Option 2: VS Code + Node.js (Recommended)**
```bash
cd H5ScriptSDK_10.4.1_20251022/Samples/Nodejs
npm install
node webserver.js
# Access at http://localhost:8080
```

### Script Deployment
1. Write script in TypeScript and compile to JavaScript
2. Minify JavaScript for production (remove comments, obfuscate)
3. Deploy via M3 H5 Administration tool → Script Management
4. Attach script to M3 form/panel or add as shortcut
5. Scripts are cached; use Ctrl+F5 to reload during development

### Best Practices
- **Always match class name to file name** - critical for script execution
- **Use TypeScript** - provides typing, compilation, refactoring support
- **Minimize global scope pollution** - wrap code in IIFE if needed
- **Proper error handling** - use try/catch and log errors appropriately
- **Avoid ES6+ features without transpilation** - not all M3 H5 environments support modern JS
- **Use relative URLs** - when calling M3 URLs sharing the same base URL
- **Store original source files** - minified scripts are not maintainable
- **Test in target environment** - browser differences can cause issues
- **Clean up event handlers** - prevent memory leaks in long-running sessions
- **Respect platform limitations**:
  - No file system access
  - Cross-domain calls restricted by CORS
  - Browser security sandbox applies

### Sample Scripts Location
`/H5ScriptSDK_10.4.1_20251022/Samples/Samples/`
- `H5SampleAddElements.ts` - Adding custom UI elements
- `H5SampleCancelRequest.ts` - Intercepting form requests
- `H5SampleCustomColumns.ts` - Modifying list columns
- `H5SampleMIService.ts` - MI transaction examples
- `H5SampleIonApiService.ts` - ION API integration
- `H5SampleMFormsAutomation.ts` - Automation sequences
- `H5SampleDrillback.ts` - Drillback integration
- Plus 15+ additional examples

### Common Script Use Cases
- Field validation and auto-population
- Custom buttons and actions
- List column customization and formatting
- Integration with external systems via ION API
- Workflow automation across multiple panels
- Custom dialogs and user interactions
- Data enrichment from external sources
- Export functionality extensions

---

## Infor Widget SDK (Ming.le Homepages) Best Practices

### When to Use Widget SDK vs Odin vs H5 Script
- **Widget SDK**: Build Homepages widgets (inline/external/banner/mobile) for Ming.le/OS Portal.
- **Odin SDK**: Build standalone M3 web apps deployed as H5 applications.
- **H5 Script SDK**: Customize existing M3 H5 panels from inside the panel runtime.

If user asks for a Homepages widget (`widget.manifest`, widget catalog, publish settings), prefer **Widget SDK** guidance and samples.

### SDK Folder Reference Requirement (Compliance)
- Always reference the relevant SDK folder in this repository before suggesting implementation details.
- Use folder-specific examples as the primary source of truth to ensure platform compliance:
    - Odin app patterns: `SDKs/H5 Angular/`
    - H5 in-panel scripting patterns: `SDKs/M3 H5 Scripting/`
    - Homepages widget patterns: `SDKs/Widget SDKs/`
- When uncertain, prefer existing sample implementations in these SDK folders over introducing new patterns.
- If no matching sample exists, explicitly state that and follow documented public APIs only.

### Supported Patterns and Technology Choices
- Prefer **inline widgets** over external/hybrid for performance and tighter framework integration.
- Use only supported technologies: **TypeScript/JavaScript** with **Angular** or **jQuery** (no AngularJS).
- Do not use undocumented/internal Homepages APIs or undocumented framework CSS classes.
- Do not introduce unsupported UI frameworks (for example React) in shared modules.

### Manifest Rules (Critical)
Every widget package must include a valid `widget.manifest` with required properties.

Key rules to enforce:
- `widgetId`: lowercase dotted namespace, unique; tenant widgets must start with `tenant.`
- `type`: `inline` or `external`
- `version`: semantic-like numeric dot format
- `name` plus either:
    - `title` + `description`, or
    - `localization` with at least `en-US.widgetTitle` and `en-US.widgetDescription`
- Inline widgets require `moduleName` and `framework` (`angular` or `jquery`)
- External widgets require `url`
- Tenant/customer widgets require `author`

Also validate commonly used optional properties when applicable:
- `frameworkVersion` for forward-compat deployment gating
- `targets` (`default`, `banner`, `mobile`, `application`) instead of legacy single-target patterns
- `requiresConfig` only when widget actually uses settings/config flow
- `applicationLogicalId` (and related app properties) when widget depends on a specific application

### Theme, UX, and Accessibility Requirements
- Widgets must support **Light**, **Dark**, and **HighContrast** themes.
- Prefer IDS Enterprise styling; minimize custom CSS.
- If custom CSS is needed, structure styles so theme-specific differences are isolated.
- Keep widget title/description concise, meaningful, and catalog-search friendly.

### Inline Widget Implementation Guidance
- Export a module with `widgetFactory(context: IWidgetContext): IWidgetInstance`.
- Use only documented `IWidgetContext`/`IWidgetInstance` capabilities.
- Implement lifecycle callbacks (`activated`, `deactivated`, `refreshed`) when polling, timers, or refresh behavior exists.
- Use widget state (`running`, `busy`, `error`) to reflect long-running operations and failures.

### External/Hybrid Widget Guidance
- Use cautiously; IFrame-heavy widgets can negatively impact browser performance.
- Support theme propagation through URL replacement variables (for example `inforThemeName`).
- Use standard/replacement parameters intentionally; avoid over-fetching resources.

### Mobile and Banner Targets
- Use `targets` to explicitly declare support (`mobile`, `banner`, `default`).
- Mobile widgets must be responsive and should not assume settings are editable at runtime.
- Banner widgets must render correctly across banner background colors and variable widths.

### Testing and Automation Conventions
- Prefer stable test selectors (`name` or data attributes like `data-lmw-id`) over dynamic IDs.
- Keep selector values readable and namespaced to avoid collisions across widgets.
- Test behavior across themes, locale/language variants, activation/deactivation, and publish/config scenarios.

### Security and Stability Expectations
- Follow secure web development practices (OWASP guidance).
- Avoid DOM/global pollution in inline widgets (shared DOM with Homepages).
- Treat undocumented APIs as unstable and subject to removal.

### Packaging and Deployment Hygiene
- Keep widget package structure compliant (no unsupported folder layouts in final package).
- Keep icon/screenshot assets within platform constraints and stable file naming.
- For tenant widgets, ensure cloud restrictions and certification requirements are respected.
