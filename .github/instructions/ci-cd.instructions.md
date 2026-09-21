---
applyTo: ".github/workflows/**"
---

# CI/CD

CI runs on push and pull request against `master`, and on manual dispatch.

## Scope

The workflow covers **this fork's own work only** — the H5 scripts under `Projects/`.
It deliberately does not build or test anything under `SDKs/`, which is Infor's
vendored SDK material, checked in verbatim and never modified here.

The upstream workflow had `build`, `odin_new`, and `test` jobs that ran `cd ./cli`
and `cd ./m3-odin`. Those directories sit at the repository root upstream, but at
`SDKs/H5 Angular/` in this fork, so every one of those jobs failed at its first step
on every run after the fork was restructured. They have been removed rather than
repointed: building Infor's vendored Angular SDK on every pull request costs several
minutes and verifies nothing this fork can change.

## Jobs

All three run on `ubuntu-latest` with Node 20 and npm caching, and begin with `npm ci`.

### `lint`

```bash
npm run lint    # eslint .
```

`eslint.config.mjs` ignores the vendored trees (`SDKs/`, the committed
`node_modules`, `MI catalog and Data Dictionary/`) and compiled `.js` output. It
declares the H5 runtime globals so plain `.js` deliverables do not trip `no-undef`.

Two H5-specific rule decisions live in that config:

- `no-var` is **off** for H5 scripts. The H5 loader resolves the entry class off the
  global object and only finds it when the top-level declaration uses `var`; with
  `const` or `let` the script silently fails to load. This is a runtime requirement
  of the framework, not a style preference.
- `no-console` is **on** for H5 scripts. Use the `IScriptLog` `log` object from
  `IScriptArgs` — console output cannot be switched off in a deployed script.

### `typecheck`

```bash
npm run typecheck
```

Three projects, in order:

| Config | Covers |
| --- | --- |
| `Projects/Benco/H5-Scripts/tsconfig.json` | customer scripts, including frozen V4 |
| `Projects/General/H5-Scripts/POReceiptShortcut/tsconfig.json` | the reusable asset's sources, at `target: es5` — the contract H5 needs |
| `Projects/General/H5-Scripts/POReceiptShortcut/tsconfig.tests.json` | the same sources **plus the tests** |

The third exists because the build config excludes `tests/`, and Vitest strips
types rather than checking them — so without it a test can drift from the API it
exercises and still pass. It raises `target` to `es2020` only because Vitest's own
`.d.ts` files use private identifiers; the es5 contract is still enforced by the
config that actually emits.

If you add a test config that `extends` a build config, override `exclude` as well
as `include`. An inherited `exclude` wins over `include`, which silently checks
nothing.

### `test`

```bash
npm test    # vitest run --passWithNoTests
```

`vitest.config.mts` scopes collection to `Projects/**/tests/**/*.{test,spec}.ts`.
Without that scope Vitest walks into `SDKs/H5 Angular/m3-odin/` and tries to collect
the vendored Angular specs, whose dependencies are not installed here.

## Local equivalent

Run the same three commands a contributor would before pushing:

```bash
npm ci
npm run lint
npm run typecheck
npm test
```

Gate on the exit code, not on the output — `npm run lint | tail` reports the exit
status of `tail`, which is always 0:

```bash
npm run lint >/dev/null 2>&1 && echo OK || { echo FAILED; exit 1; }
```

## Building the deliverables

CI does not build, because the compiled `.js` files are committed. Rebuild them
locally with `npm run build` before committing a `.ts` change.
