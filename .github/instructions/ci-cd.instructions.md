---
applyTo: ".github/**"
---

# CI/CD and GitHub Configuration Guide

## Workflow: `.github/workflows/main.yml`
Runs on push and PR to `master`. Jobs run on `ubuntu-latest` with Node.js 18.19.

### Job: `build`
Builds the CLI and Odin libraries. Required by `odin_new`.
```
SDKs/H5 Angular/cli/   → npm ci && npm run build
SDKs/H5 Angular/m3-odin/ → npm ci && npm run build:libs
```
Uploads a `cli.zip` artifact for use by subsequent jobs.

### Job: `odin_new` (depends on `build`)
Tests `odin new` for all three project templates and confirms each builds:
- `--angular --soho` (Angular + IDS Enterprise)
- `--soho none --angular` (Angular without Soho)
- `--soho --angular false` (Basic/Webpack + IDS Enterprise)

### Job: `test`
Runs unit tests: `npm run ng -- test @infor-up/m3-odin --code-coverage --browsers=ChromeHeadlessCI`  
Uses `PUPPETEER_SKIP_DOWNLOAD: true` to avoid Puppeteer binary downloads.

### Job: `lint`
Runs ESLint across `Projects/` scripts to catch issues in H5 and widget code:
```
npx eslint "Projects/**/*.{ts,js}" --max-warnings=0
```

## Adding New Workflow Steps
- Always use `actions/checkout@v4` and `actions/setup-node@v4`
- Pin Node.js to `"18.19"` to match the SDK engine requirement
- Set `PUPPETEER_SKIP_DOWNLOAD: true` for any job that installs Odin dependencies
- Use `npm ci` (not `npm install`) in CI for reproducible installs

## Issue Templates (`.github/ISSUE_TEMPLATE/`)
Three templates are available:
- `bug_report.md` — captures SDK versions, reproduction steps, expected behavior
- `feature_request.md` — feature proposals
- `support.md` — general questions

When adding new templates, include the relevant SDK version fields:
- `@infor-up/m3-odin` / `@infor-up/m3-odin-angular` / `@infor-up/m3-odin-cli`
- H5 Script SDK version (from `SDKs/M3 H5 Scripting/Documentation/CHANGELOG.txt`)
- Widget SDK version (`3.0.1` or `3.34.0`)

## Copilot Instructions Structure
Scoped instruction files live in `.github/instructions/` with `applyTo` frontmatter:
- `odin-angular.instructions.md` → `SDKs/H5 Angular/**`
- `h5-scripting.instructions.md` → `SDKs/M3 H5 Scripting/**`, `Projects/**/*.{ts,js}`
- `widget.instructions.md` → `SDKs/Widget SDKs/**`, `Projects/**/Widgets/**`
- `sonarqube_mcp.instructions.md` → `**/*` (global — SonarQube MCP tool rules)
- `ci-cd.instructions.md` → `.github/**` (this file)

The main `copilot-instructions.md` provides repo-level context and routing only.
