# 3.0.1

## all

- Dependencies like Angular and IDS are now locked to the same patch versions as the Portal client.

# 3.0.0

## **BREAKING CHANGES**

- Custom Settings dialogs use `<ids-modal>` by default. If you experience issues (e.g with legacy Soho components), you can opt out by setting `"enableWebComponentSettings": false` in the manifest.
- KPI widgets with `"target": "top"` are no longer headerless or centered by default. In the future, they may not be quarter sized by default either. We are working towards a future where quarter-sized "top" widgets requires less special handling by the Portal runtime, and leaving more control to the widgets. In order to make KPI widgets look like they did before, make the following changes:
  - The `"header": "none"` manifest property removes the header.
  - CSS flexbox to center the content.
  - Specify the intended size through `"minSize": "0.5,0.5"` and `"defaultSize": "0.5,0.5"` in the manifest.
  - For multi-target widgets, use `IWidgetContext.getSize()`, `IWidgetContext.isTop()`, `IWidgetContext.setHeader()` if you wish to have different behavior depending on the size of the widget.

## core

- Added the `enableWebComponentSettings` manifest property which causes custom settings to be rendered inside an `<ids-modal>`. The default value when packing a widget is `true`, but you can set this to `false` to opt out.
- Added `IWidgetContext.setHeader` for setting the widget header state dynamically.
- Added the `minSize` manifest property. When widgets are added to the Workspace Sidebar (and other future areas that support it), it will be possible for widgets to be smaller than the classic 1 row and 1 column. This includes half, quarter, and auto sizes (0.5, 0.25 and 0 respectively).
- The `defaultSize` manifest property now supports smaller sizes, similar to `minSize`.

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 20.0.x  |
| `ids-enterprise-ng` | 20.1.x  |
| `ids-enterprise`    | 4.109.x |
| `ids-enterprise-wc` | 1.15.x  |

# 2.3.0

## cli

- Added `--override-runtime-dependencies` option to `lime serve`, which can be used to load your own version of `ids-enterprise` and `ids-enterprise-wc` instead of the bundled versions.
- `lime serve` and `lime pack` will now error if the widget has a title/description that doesn't follow the guidelines. This has historically been caught in the manual widget review process, but it should now be caught earlier.

## samples

- Added a `utils/formUtils.ts` module that contains various directives that may be used when working with forms and ids-enterprise-wc.

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 19.2.x  |
| `ids-enterprise-ng` | 19.2.x  |
| `ids-enterprise`    | 4.105.x |
| `ids-enterprise-wc` | 1.11.x  |

# 2.2.1

## cli

- Updated the Homepages runtime (`lime serve --runtime homepages`) to 12.0.71, which is the LTR version for April 2025.

# 2.2.0

## cli

- `lime docs` now includes IDS Web Components documentation.

## runtime

- Fixed an issue where a hidden primary action showed when the widget also uses `enableRefresh: true`.
- Fixed an issue where 'Reset to default' did not reset the widget correctly.

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 19.2.x  |
| `ids-enterprise-ng` | 19.1.x  |
| `ids-enterprise`    | 4.104.x |
| `ids-enterprise-wc` | 1.10.x  |

# 2.1.1

## cli

- Fixed an issue where implicitly standalone components that used `templateUrl` or `styleUrl` wasn't getting the explicit `standalone: true` flag.
- Fixed an issue where `lime serve` couldn't find widgets when the absolute path contained "git".

# 2.1.0

## General

- Adds support for top bar / "KPI Ribbon" widgets
- Angular & IDS version 19

## core

- Added a new manifest target `"top"`, which is used to create top bar widgets.
- Added `IWidgetContext.isTop` which can be used for multi-target widgets to check if they are in a top bar.

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 19.1.x  |
| `ids-enterprise-ng` | 19.0.x  |
| `ids-enterprise`    | 4.103.x |
| `ids-enterprise-wc` | 1.9.x   |

# 2.0.0

## cli

- **BREAKING:** Standalone components are now mandatory, and `lime serve` and `lime pack` will treat the use of `@NgModule` as an error.
- A new command `lime migrate` has been added to help with various migrations, including:
  - Standalone components, directives and pipes.
  - `inject()` syntax for DI.
  - New control-flow syntax `@for` and `@if` instead of `*ngFor` and `*ngIf`.
- Added a new `@infor-lime/cli/config/tsconfig.strict.json` file that enables strict type checking. This will be used by default in new projects. To opt out, extend the old `@infor-lime/cli/config/tsconfig.json` instead.

## core

- Updated documentation for `IWidgetContext.send` and `IWidgetContext.receive` to reflect new behavior introduced in OS Portal 2024.10.
- Added `IWidgetContext.appendStandardParameters`

## runtime

- Implemented missing `IWidgetContext.resolveAndReplace` methods.

## eslint-plugin

- A new rule has been added to check for `@NgModule` and `IWidgetInstance.angularConfig.moduleType`.

# 1.5.0

## core

- Added ability to track certain `attributes` with `IWidgetContext.trackView` and `IWidetContext.trackEvent`.
- Added `Neutral` option to `BadgeType` enum

## runtime

- Fixed an issue with `setBorder` on `IWidgetContext` where border was not updated correctly.

# 1.4.0

## runtime

- Fixed an issue where external widgets did not display correctly.

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `ids-enterprise-wc` | 1.5.x   |

# 1.3.0

## cli

- Fixed an issue where commands failed with `EINVAL` error on Windows because of a [breaking change in Node](https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2#command-injection-via-args-parameter-of-child_processspawn-without-shell-option-enabled-on-windows-cve-2024-27980---high).

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 18.2.x  |
| `ids-enterprise-ng` | 18.2.x  |
| `ids-enterprise`    | 4.98.x  |
| `ids-enterprise-wc` | 1.4.x   |

# 1.2.0

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 18.0.x  |
| `ids-enterprise-ng` | 18.1.x  |
| `ids-enterprise`    | 4.97.x  |
| `ids-enterprise-wc` | 1.3.x   |

# 1.0.0-rc.11

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `ids-enterprise-wc` | 1.0.0   |

# 1.0.0-rc.10

## Dependencies

| Package             | Version       |
| ------------------- | ------------- |
| `@angular/*`        | 17.3.x        |
| `ids-enterprise-ng` | 17.6.x        |
| `ids-enterprise`    | 4.94.x        |
| `ids-enterprise-wc` | 1.0.0-beta.22 |

# 1.0.0-rc.9

## cli

- The `widgetDirectories` option for `lime serve` is now optional. If no arguments are provided, all widgets in the project are served.
- Fixed an issue with `lime serve` where the server would exit when certain build errors occurred.

## Dependencies

| Package             | Version       |
| ------------------- | ------------- |
| `@angular/*`        | 17.3.x        |
| `ids-enterprise-ng` | 17.5.x        |
| `ids-enterprise`    | 4.93.x        |
| `ids-enterprise-wc` | 1.0.0-beta.22 |

# 1.0.0-rc.8

- Initial support for `@birst/infor-visual-insights`

# 1.0.0-rc.7

## Dependencies

| Package             | Version       |
| ------------------- | ------------- |
| `@angular/*`        | 17.2.x        |
| `ids-enterprise-ng` | 17.4.x        |
| `ids-enterprise`    | 4.92.x        |
| `ids-enterprise-wc` | 1.0.0-beta.20 |

# 1.0.0-rc.6

## cli

- Removed the `--local-package` init option. Local packages are now copied into new projects by default. This might change in the future if/when packages are published to an NPM registry.
- `lime pack` can pack multiple widgets at once.
- `lime pack` can now output to a given directory with `--output-dir <dir>`.
- Added `lime update` command that updates a project to the same as the globally installed CLI version.

## runtime

- Support `"framework": "webcomponent"` in widget manifest.

## core

- Added method `getTenantSetting` to `IPortalShell`, which can be used to get a tenant setting from a limited set of tenant settings available to a widget

## Dependencies

| Package             | Version       |
| ------------------- | ------------- |
| `@angular/*`        | 17.1.x        |
| `ids-enterprise-ng` | 17.4.x        |
| `ids-enterprise`    | 4.92.x        |
| `ids-enterprise-wc` | 1.0.0-beta.18 |

# 1.0.0-rc.5

## core

- Added `view` to `IWidgetAction`. Setting this to `detail` will make the action show in the details view instead,
  as a primary action, if the widget uses navigation (`IWidgetContext` `navigate`)

# 1.0.0-rc.4

## runtime

- Removed accent color selection from Development Tools, as that color has no effect on widgets

## Dependencies

| Package             | Version      |
| ------------------- | ------------ |
| `@angular/*`        | 16.2.x       |
| `ids-enterprise-ng` | 16.9.0-dev.1 |
| `ids-enterprise`    | 4.89.0-dev.0 |

# 1.0.0-rc.3

## core

- Added `tags` property to `ITrackViewOptions`

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 16.2.x  |
| `ids-enterprise-ng` | 16.8.x  |
| `ids-enterprise`    | 4.88.x  |

# 1.0.0-rc.1

## Dependencies

| Package             | Version |
| ------------------- | ------- |
| `@angular/*`        | 16.1.x  |
| `ids-enterprise-ng` | 16.5.x  |
| `ids-enterprise`    | 4.85.x  |
