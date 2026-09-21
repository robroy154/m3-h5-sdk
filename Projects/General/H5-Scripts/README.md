# Reusable H5 Scripts

Customer-agnostic M3 H5 scripts. Anything here should be deployable at any
tenant with no source change — every tenant-specific value is a script
argument, and an optional feature that is not configured is skipped rather
than guessed at.

Customer-specific scripts live under `Projects/<Customer>/H5-Scripts/`.

## Assets

| Asset | Panel | What it does |
| --- | --- | --- |
| [`POReceiptShortcut/`](POReceiptShortcut/) | PPS300/B | Receives a purchase order line in place, handling serial, lot and uncontrolled items. |

## Layout

Each asset is a self-contained folder:

```text
<AssetName>/
  src/*.ts               source modules
  tests/*.test.ts        Vitest unit tests
  typings/               local .d.ts copies and augmentations
  build/                 tsc intermediate (gitignored)
  <AssetName>V<n>.js     the bundle H5 deploys, committed
  <AssetName>V<n>.js.map committed, resolves back to src/*.ts
  tsconfig.json          build
  tsconfig.tests.json    typechecks the tests too
  rolldown.config.mjs    bundles to a single IIFE
  README.md CONFIGURATION.md CHANGELOG.md
```

## Conventions

- **Authored as ES modules, shipped as one file.** `tsc` emits ES5 into
  `build/`, then rolldown bundles it to an IIFE. That gives exactly one new
  browser global — the entry class — which is what the H5 loader resolves by
  filename, and satisfies the `var ClassName = ...` requirement.
- **Only one module may touch an H5 global.** Everything else takes its
  dependencies by injection, so the logic is testable with no browser and no
  M3 tenant. Put that module at the edge and keep it thin.
- **Version suffix in the filename is intentional.** H5 deploys by filename and
  requires filename to equal class name, so two versions cannot share a name
  during cutover.
- **Both `.ts` and the built `.js` are committed**, so an H5 admin can deploy
  without running a build. The `.ts` is the source of truth; never edit the
  `.js`.

## Commands

```bash
npm run build:poreceipt   # one asset
npm run build             # every H5 project
npm test                  # all unit tests
npm run typecheck         # sources and tests
npm run lint
```

## Adding an asset

1. Copy the layout above.
2. Reference the SDK typings from the asset's `tsconfig.json`. Note the depth:
   from `Projects/General/H5-Scripts/<Asset>/` the SDK is **four** levels up,
   not three as it is from `Projects/<Customer>/H5-Scripts/`.
3. Add `build:<asset>` to `package.json` and chain it into `build`.
4. Write `CONFIGURATION.md` first. If you cannot describe every tenant-specific
   value as an argument, the asset is not reusable yet.
