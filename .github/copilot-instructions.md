# Infor M3 General SDK — Copilot Instructions

## Repository Purpose
This is a **multi-SDK repository** for Infor M3 ERP development. It is NOT limited to H5 scripts. Three SDK tracks coexist here alongside a `Projects/` directory of real-world implementations.

## SDK Routing — Identify the Track First

| Task | SDK | Folder | Scoped instructions |
|---|---|---|---|
| Build a standalone M3 web app | **Odin SDK** | `SDKs/H5 Angular/` | `.github/instructions/odin-angular.instructions.md` |
| Customize an existing M3 H5 panel | **H5 Script SDK** | `SDKs/M3 H5 Scripting/` | `.github/instructions/h5-scripting.instructions.md` |
| Build a Ming.le / OS Portal widget | **Widget SDK** | `SDKs/Widget SDKs/` | `.github/instructions/widget.instructions.md` |
| CI/CD or GitHub config | — | `.github/` | `.github/instructions/ci-cd.instructions.md` |

**Before suggesting any implementation**, identify which SDK track is in scope. Scoped instruction files above provide the full API details, patterns, and best practices for each track. Load the relevant one.

## SDK Folder Reference (Global Compliance)
- Always reference the relevant SDK folder before suggesting implementation details.
- Use folder-specific samples as the primary source of truth:
    - Odin app patterns: `SDKs/H5 Angular/m3-odin/samples/`
    - H5 in-panel scripting patterns: `SDKs/M3 H5 Scripting/Samples/Samples/`
    - Homepages widget patterns: `SDKs/Widget SDKs/Infor_WidgetSDK_3.34.0/Samples/Widgets/`
- When uncertain, prefer existing samples over introducing new patterns.
- If no matching sample exists, state that explicitly and follow documented public APIs only.

## Cross-SDK Pitfalls (Apply to All Tracks)
- `MIService` in Odin = RxJS Observable (`.subscribe()`); in H5 Scripts = jQuery Deferred (`.done()/.fail()`) — they are NOT interchangeable
- M3 date format is always `yyyyMMdd` — never ISO strings
- Do not hardcode CONO/DIVI — both SDKs inject them from user context automatically
- Widget SDK: always use `Infor_WidgetSDK_3.34.0`; `3.0.1` is legacy/reference only
- H5 Script: class name must exactly match file name (case-sensitive)
- Odin core library must remain Angular-agnostic (no Angular imports in `@infor-up/m3-odin`)

## Projects Directory
- `Projects/Benco/` — H5 Script customizations; see `Projects/Benco/H5-Scripts/README.md` for current file status
- `Projects/General/Widgets/` — Reusable Homepages widgets

---
<!-- Full SDK details are in the scoped instruction files in .github/instructions/ -->
<!-- SonarQube MCP tool rules are in .github/instructions/sonarqube_mcp.instructions.md -->

