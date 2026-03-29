# M3 H5 Scripting SDK

SDK for creating TypeScript/JavaScript scripts that run **inside** existing M3 H5 panels. Use this when you need to extend or customize an existing M3 screen — not for building standalone apps (use the Odin SDK for that).

**Version:** 10.4.1 (October 2025)

---

## Folder Contents

```
M3 H5 Scripting/
├── Documentation/
│   ├── H5ScriptDevelopersGuide.md    ← Full API reference — start here
│   ├── H5ScriptDevelopersGuide.pdf   ← Same content, printable format
│   ├── H5ScriptDevelopersGuide.docx  ← Same content, Word format
│   └── CHANGELOG.txt                 ← Version history
├── Samples/
│   ├── Samples/                      ← TypeScript + compiled JS sample scripts
│   ├── Nodejs/                       ← Node.js dev server for running samples
│   └── Samples.sln                   ← Visual Studio solution (alternative setup)
└── Templates/
    └── H5ScriptsProjectTemplate/     ← VS project template for new scripts
```

---

## Quick Start

```bash
# Option 1: VS Code + Node.js (recommended)
cd "Samples/Nodejs"
npm install
node webserver.js
# Open http://localhost:8080

# Option 2: Visual Studio
# Open Samples/Samples.sln and run with IIS Express
```

---

## Critical Rules

1. **Class name must exactly match the file name** (case-sensitive, no extension)  
   The H5 runtime locates the class by file name — a mismatch causes silent failure.

2. **Entry point is always:**
   ```typescript
   public static Init(args: IScriptArgs): void
   ```

3. Write in **TypeScript**, compile to JS, minify for production, keep the `.ts` source.

---

## Key APIs at a Glance

| API | How to call | Returns |
|---|---|---|
| Get/set field value | `controller.GetValue("FIELD")` / `controller.SetValue("FIELD", val)` | `string` |
| Execute MI transaction | `MIService.Current.executeRequest(request)` | jQuery Deferred |
| Call ION API | `IonApiService.Current.execute(request)` | Promise |
| Launch M3 program | `ScriptUtil.Launch("/mforms/MMS200")` | — |
| Get user context | `ScriptUtil.GetUserContext()` | `IUserContext` |
| Log a message | `this.log.Info("msg")` / `.Error()` / `.Debug()` | — |

> ⚠️ `MIService` here uses jQuery Deferred (`.done()/.fail()`), not RxJS Observables. This is different from the Odin SDK's `MIService`.

---

## Full Documentation

`Documentation/H5ScriptDevelopersGuide.md`

## Sample Scripts

`Samples/Samples/` — 15+ TypeScript examples covering field validation, custom buttons, list column customization, MI calls, ION API integration, MForms automation, and drillback.
