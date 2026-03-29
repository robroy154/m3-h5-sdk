# Infor M3 General SDK Repository

A multi-purpose development repository for building and extending Infor M3 ERP integrations. Despite the repository name, this is not limited to H5 scripts — it houses three distinct SDK tracks and a `Projects/` directory containing real-world implementations.

---

## Repository Map

```
m3-h5-sdk/
├── SDKs/                          # SDK source distributions
│   ├── H5 Angular/                # Odin SDK — standalone M3 web applications
│   │   ├── cli/                   # @infor-up/m3-odin-cli (project scaffolding)
│   │   └── m3-odin/               # @infor-up/m3-odin + @infor-up/m3-odin-angular
│   ├── M3 H5 Scripting/           # H5 Script SDK — in-panel panel customization
│   │   ├── Documentation/         # Developer guide (PDF, DOCX, Markdown)
│   │   ├── Samples/               # TypeScript/JS sample scripts
│   │   └── Templates/             # VS project templates
│   └── Widget SDKs/               # Infor Widget SDK — Ming.le/OS Homepages widgets
│       ├── Infor_WidgetSDK_3.0.1/ # Legacy version (retained for reference)
│       └── Infor_WidgetSDK_3.34.0/# Current version — use for all new development
└── Projects/                      # Custom implementations
    ├── Benco/                     # Benco client scripts
    └── General/
        └── Widgets/               # Reusable Homepages widgets
```

---

## SDK Quick Reference

### When to use which SDK

| Goal | SDK | Location |
|---|---|---|
| Build a standalone M3 web app with custom UI | **Odin SDK** | `SDKs/H5 Angular/` |
| Customize / extend an existing M3 H5 panel | **H5 Script SDK** | `SDKs/M3 H5 Scripting/` |
| Build a Ming.le / OS Portal Homepages widget | **Widget SDK** | `SDKs/Widget SDKs/` |

---

### Odin SDK (`SDKs/H5 Angular/`)

Builds standalone web applications deployed to H5 at `/mne/apps/{name}`. Uses Angular 18, RxJS 7, and the IDS Enterprise design system.

**Key packages:**
- `@infor-up/m3-odin-cli` — project scaffolding and build tooling
- `@infor-up/m3-odin` — framework-agnostic core services (RxJS Observables)
- `@infor-up/m3-odin-angular` — Angular DI wrappers around core services

**Quick start:**
```bash
cd "SDKs/H5 Angular/cli"
npm install && npm run build
npm link                      # makes 'odin' available globally

odin new my-app --angular --soho --install
cd my-app && odin serve
```

**Requirements:** Node.js ≥18.19, Angular 18

---

### H5 Script SDK (`SDKs/M3 H5 Scripting/`)

Creates TypeScript/JavaScript scripts that run **inside** existing M3 H5 panels. Scripts are deployed via H5 Administration → Script Management and execute in the H5 panel runtime.

**Critical rules:**
- Class name **must** match the file name (excluding extension)
- Entry point must be `public static Init(args: IScriptArgs): void`

**Quick start (VS Code + Node.js):**
```bash
cd "SDKs/M3 H5 Scripting/Samples/Nodejs"
npm install
node webserver.js             # http://localhost:8080
```

**Reference:** `SDKs/M3 H5 Scripting/Documentation/H5ScriptDevelopersGuide.md`

---

### Widget SDK (`SDKs/Widget SDKs/`)

Builds inline, external, banner, and mobile widgets for the Infor Ming.le / OS Portal Homepages.

**Active version:** `Infor_WidgetSDK_3.34.0` — use for all new development.  
**Legacy version:** `Infor_WidgetSDK_3.0.1` — retained for reference only.

**Quick start:**
```bash
cd "SDKs/Widget SDKs/Infor_WidgetSDK_3.34.0"
node install-cli.mjs          # installs the widget CLI
```

See `SDKs/Widget SDKs/README.md` for full version guidance.

---

## Projects

### `Projects/Benco/`
H5 Script SDK customizations for Benco. See [`Projects/Benco/README.md`](Projects/Benco/README.md) for current file status.

### `Projects/General/Widgets/`
Reusable Homepages widgets built with the Widget SDK.

---

## Development Setup

### Prerequisites
- Node.js ≥18.19
- npm ≥9
- TypeScript (installed per-project)

### Linting
ESLint is configured at the repo root and covers JS, TS, JSON, Markdown, and CSS:
```bash
npx eslint .
```

### CI/CD
GitHub Actions (`.github/workflows/main.yml`) runs on push/PR to `master`:
- Builds CLI and Odin libraries
- Tests `odin new` for all three project templates
- Runs unit tests with ChromeHeadlessCI
- Lints `Projects/` scripts

---

## AI Assistant Instructions
- Copilot: `.github/copilot-instructions.md` + scoped files in `.github/instructions/`
- Other agents (Claude, Cursor, etc.): `AGENTS.md`
