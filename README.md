# Infor M3 General SDK Repository

A multi-purpose development repository for building and extending Infor M3 ERP integrations. Despite the repository name, this is not limited to H5 scripts — it houses three distinct SDK tracks and a `Projects/` directory containing real-world implementations.

> Forked from [`infor-cloud/m3-h5-sdk`](https://github.com/infor-cloud/m3-h5-sdk).
> Everything under `SDKs/` is Infor's material, vendored verbatim and **never
> modified here** — upstream owns it. This fork's own work lives in
> `Projects/`, with the repository-level tooling and documentation adapted to
> suit it.

---

## Repository Map

```text
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
├── Projects/                      # This fork's own work
│   ├── General/                   # Reusable, customer-agnostic assets
│   │   ├── H5-Scripts/            #   H5 scripts, one folder per asset
│   │   └── Widgets/               #   Homepages widgets
│   └── Benco/                     # Customer-specific scripts and API notes
├── MI catalog and Data Dictionary/# Generated M3 metadata (~175 MB): the MI
│                                  # transaction catalog and table dictionary
└── logs/                          # Scratch output, not part of the build
```

`SDKs/` and `MI catalog and Data Dictionary/` are reference material. Neither
is built, linted, or analysed by CI.

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

**Getting started:** `Infor_WidgetSDK_3.34.0/Documentation/DevelopersGuide.pdf`,
with working packages under `Infor_WidgetSDK_3.34.0/Samples/Widgets/`.

Note that the `install-cli.mjs` bootstrap script exists **only in 3.0.1**;
3.34.0 ships documentation and samples rather than a CLI installer, so a
quick-start that starts with that command will not work against the current
version.

See `SDKs/Widget SDKs/README.md` for full version guidance.

---

## Projects

### `Projects/General/` — reusable, customer-agnostic assets
Start here for anything not specific to one customer. Every tenant-specific
value is a script argument, so the same build deploys anywhere.

- [`H5-Scripts/`](Projects/General/H5-Scripts/) — reusable H5 scripts, each a
  self-contained folder with its own tests, build and configuration reference
- `Widgets/` — reusable Homepages widgets

### `Projects/Benco/` — customer-specific work
See [`Projects/Benco/README.md`](Projects/Benco/README.md) for current file
status.

---

## Development Setup

### Prerequisites
- Node.js ≥18.19 (CI uses 20)
- npm ≥9

TypeScript is a devDependency, so `npm ci` is all the setup a clean clone
needs. Do not rely on a global `tsc`.

### Commands
```bash
npm ci

npm run lint          # ESLint over JS, TS, JSON, Markdown and CSS
npm run typecheck     # tsc --noEmit over the H5 projects and their tests
npm test              # Vitest
npm run build         # compiles every H5 project
```

`npm run lint` deliberately skips `SDKs/`, `MI catalog and Data Dictionary/`,
compiled `.js` output and `archive/` — see `eslint.config.mjs`.

### CI/CD
GitHub Actions (`.github/workflows/main.yml`) runs on push/PR to `master`:
`lint`, `typecheck` and `test`, each on Node 20 with read-only token scope.

It deliberately does **not** build anything under `SDKs/`. The upstream
workflow's `build`, `odin_new` and `test` jobs ran `cd ./cli` and
`cd ./m3-odin`, which exist at the repository root upstream but at
`SDKs/H5 Angular/` in this fork — so every one of those jobs failed at its
first step on every run after the fork was restructured.

---

## AI Assistant Instructions
- Copilot: `.github/copilot-instructions.md` + scoped files in `.github/instructions/`
- Other agents (Claude, Cursor, etc.): `AGENTS.md`
