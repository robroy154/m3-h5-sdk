# Infor Widget SDK

Infor Widget SDK distributions for building Ming.le / OS Portal Homepages widgets.

---

## Active Version

**Use `Infor_WidgetSDK_3.34.0` for all new development.**

This is the current release and includes:
- Updated widget manifest schema with `targets` array support
- Improved TypeScript type definitions
- Latest `homepages.js` framework bindings
- Full documentation in `Infor_WidgetSDK_3.34.0/Documentation/`

---

## Legacy Version

`Infor_WidgetSDK_3.0.1` is retained for reference only.

Reasons you might look here:
- Auditing an older deployed widget's compatibility
- Understanding what changed between versions (see `Infor_WidgetSDK_3.34.0/ChangeLog.txt`)

Do **not** use `Infor_WidgetSDK_3.0.1` as a base for new widgets.

---

## Quick Start (3.34.0)

```bash
cd Infor_WidgetSDK_3.34.0
node install-cli.mjs           # install the widget CLI tools
```

Then reference the samples:
```
Infor_WidgetSDK_3.34.0/Samples/Widgets/   # example widget implementations
Infor_WidgetSDK_3.34.0/Documentation/     # full developer guide
```

---

## widget.manifest Checklist

Every widget package must include a valid `widget.manifest`. Required fields:

- `widgetId` — lowercase dotted namespace (tenant widgets must start with `tenant.`)
- `type` — `inline` or `external`
- `version` — numeric dot format (e.g., `1.0.0`)
- `name` — internal identifier
- `title` + `description` **or** `localization` with at least `en-US.widgetTitle` and `en-US.widgetDescription`
- For inline widgets: `moduleName` and `framework` (`angular` or `jquery`)
- For external widgets: `url`
- For tenant/customer widgets: `author`

See Copilot instructions (`.github/instructions/widget.instructions.md`) for full manifest rules.
