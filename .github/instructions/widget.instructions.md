---
applyTo: "{SDKs/Widget SDKs/**,Projects/**/Widgets/**}"
---

# Widget SDK — Ming.le / OS Portal Homepages Guide

## Folder Reference
- **Active SDK:** `SDKs/Widget SDKs/Infor_WidgetSDK_3.34.0/` — use for all new development
- **Sample widgets:** `SDKs/Widget SDKs/Infor_WidgetSDK_3.34.0/Samples/Widgets/`
- **Documentation:** `SDKs/Widget SDKs/Infor_WidgetSDK_3.34.0/Documentation/`
- **Legacy SDK:** `SDKs/Widget SDKs/Infor_WidgetSDK_3.0.1/` — reference only, do not use for new work

Always verify against existing samples before introducing new patterns.

## When to Use This SDK
Build widgets for the Infor Ming.le / OS Portal **Homepages** — inline, external, banner, or mobile widgets. If the user wants a standalone M3 app, they need the Odin SDK instead.

## Supported Technologies
- **Angular** or **jQuery** only (no React, no AngularJS)
- TypeScript or JavaScript
- IDS Enterprise for UI components

## widget.manifest — Required Fields

Every widget package must have a valid `widget.manifest`. Key rules:

### Always Required
```json
{
  "widgetId": "tenant.company.module.widgetname",
  "type": "inline",
  "version": "1.0.0",
  "name": "MyWidget",
  "title": "My Widget Title",
  "description": "What this widget does"
}
```
- `widgetId`: lowercase dotted namespace; tenant/customer widgets **must** start with `tenant.`
- `type`: `"inline"` or `"external"`
- For inline: also add `"moduleName"` and `"framework"` (`"angular"` or `"jquery"`)
- For external: also add `"url"`
- For tenant/customer widgets: also add `"author"`

### Prefer `localization` over bare `title`/`description` for multi-language
```json
"localization": {
  "en-US": {
    "widgetTitle": "My Widget",
    "widgetDescription": "Short description for the catalog"
  }
}
```
Minimum: `en-US.widgetTitle` and `en-US.widgetDescription`

### Commonly Used Optional Fields
- `"frameworkVersion"` — forward-compat deployment gating
- `"targets": ["default", "banner", "mobile"]` — use array, not legacy single-target pattern
- `"requiresConfig": true` — only when the widget actually uses a settings/config flow
- `"applicationLogicalId"` — when the widget depends on a specific Infor application

## Inline Widget Implementation
```typescript
export function widgetFactory(context: IWidgetContext): IWidgetInstance {
    return {
        activated() {
            // start polling, timers, subscriptions
        },
        deactivated() {
            // clean up — this is called when widget leaves viewport
        },
        refreshed() {
            // called on manual refresh
        }
    };
}
```
- Use only documented `IWidgetContext` / `IWidgetInstance` APIs
- Set widget state (`running`, `busy`, `error`) to reflect long-running operations
- Implement all three lifecycle callbacks when using timers or subscriptions

## Theme Requirements
Widgets must support **Light**, **Dark**, and **HighContrast** themes:
- Prefer IDS Enterprise component styling — it handles themes automatically
- Minimize custom CSS; when needed, isolate theme differences into separate selectors
- Test in all three themes before considering a widget production-ready

## Mobile & Banner Targets
- Declare target support in `targets` array in `widget.manifest`
- Mobile: widget must be responsive; do not assume settings are editable at runtime
- Banner: must render correctly across variable widths and banner background colors

## Testing Conventions
- Use stable selectors — `name` attributes or `data-lmw-id` data attributes
- Test across: themes, locale/language variants, activation/deactivation, and config scenarios
- Avoid dynamic IDs as test selectors

## Security & Stability
- Follow OWASP secure web development practices
- Avoid polluting shared DOM — inline widgets share the page DOM with Homepages
- Treat any undocumented Homepages API as unstable and subject to removal without notice
- Do not use internal Homepages CSS classes not exposed in the SDK documentation

## Packaging & Deployment
- Widget package structure must match the format expected by the platform (no unsupported layouts)
- Keep icon and screenshot assets within platform size constraints
- For tenant widgets, ensure cloud certification requirements are met before publishing
