# M3 Odin SDK Development Guide

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
- **H5 Script SDK** (`/H5ScriptSDK_10.4.1_20240208`): Create TypeScript scripts that run **inside** M3 H5 panels/screens. Uses global interfaces (`IInstanceController`, `IContentElement`, etc.), manipulates existing H5 UI elements directly.

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
