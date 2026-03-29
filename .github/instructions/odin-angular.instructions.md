---
applyTo: "SDKs/H5 Angular/**"
---

# Odin SDK — Angular Development Guide

## Folder Reference
Always check `SDKs/H5 Angular/m3-odin/samples/` for existing patterns before introducing new ones.

## Monorepo Structure
- `SDKs/H5 Angular/cli/` — `@infor-up/m3-odin-cli` (project scaffolding and build tooling)
- `SDKs/H5 Angular/m3-odin/projects/infor-up/m3-odin/` — Core library (RxJS only, no Angular deps)
- `SDKs/H5 Angular/m3-odin/projects/infor-up/m3-odin-angular/` — Angular DI wrappers
- `SDKs/H5 Angular/m3-odin/samples/` — Sample applications

## Core vs Angular Pattern
**Critical**: Core classes are Angular-agnostic (RxJS Observables only). Angular services wrap them for DI:

| Core class | Angular service |
|---|---|
| `MIServiceCore` | `MIService` |
| `UserServiceCore` | `UserService` |
| `ApplicationServiceCore` | `ApplicationService` |
| `FormServiceCore` | `FormService` |
| `IonApiServiceCore` | `IonApiService` |

Use Core classes for vanilla JS/TS projects. Use Angular services for Angular projects.

**Never import Angular packages into the core library** — `@infor-up/m3-odin` must remain framework-agnostic.

## Base Class Pattern
All SDK classes extend `CoreBase`:
```typescript
export class MyClass extends CoreBase {
   constructor() {
      super('MyClass');  // component name for logging
   }
}
```

## MI Transaction Pattern
```typescript
const request: IMIRequest = {
   program: 'MMS200MI',
   transaction: 'GetItmBasic',
   record: { ITNO: 'ABC123' },
   outputFields: ['ITDS', 'UNMS'],
   typedOutput: true,
};

miService.execute(request).subscribe((response: IMIResponse) => {
   const items: MIRecord[] = response.items;
});
```

## Date Handling
- M3 requires `yyyyMMdd` — **never** ISO strings
- Use `MIUtil.getDateFormatted(date)` or `MIRecord.setDateString()` for inputs

## User Context
- Load and cache `IUserContext` at app startup
- `MIService` auto-injects `currentCompany` and `currentDivision` as matrix params
- Do not hardcode CONO/DIVI unless you explicitly need to override them

## CLI Commands
From `SDKs/H5 Angular/cli/`:
```bash
npm run build                        # Compile CLI TypeScript → dist/
npm run build:watch                  # Watch mode
```

From `SDKs/H5 Angular/m3-odin/`:
```bash
npm run build:libs                   # Build both core and angular libraries
npm run build:lib-core               # Build @infor-up/m3-odin only
npm run build:lib-angular            # Build @infor-up/m3-odin-angular only
npm run test:once                    # Single-run tests (CI)
```

## Project Scaffolding (after CLI is linked)
```bash
odin new                             # Interactive wizard
odin new my-app --angular --soho --install
odin serve                           # Dev server with proxy
odin serve --multi-tenant            # Cloud auth with ION tokens
odin build                           # Creates dist/{name}.zip for H5 upload
```

## Authentication
- **Cloud:** `odin login` (OAuth2); `odin login --m3` to also fetch M3 session cookie
- **On-premise:** Basic auth — no `odin login` needed
- Config: `odin set m3-proxy https://m3server` modifies `odin.json`

## Deployment
```
odin build → dist/{projectName}.zip
Upload via H5 Admin → Applications → Install
Access at /mne/apps/{projectName}
```

## Dependencies
- Node.js ≥18.19, Angular 18.2.4, TypeScript ~5.4.0, RxJS ^7.8.0
- Breaking change in v7.0.0: Angular 18 + Node 18+ required; Material Design removed

## Common Pitfalls
- Project names must be lowercase, URL-safe, start with a letter
- Cloud vs on-premise auth are completely different flows — confirm environment first
- `typedOutput: true` enables automatic type conversion for dates and numbers in responses
