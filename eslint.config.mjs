import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * Globals provided by the M3 H5 runtime. Declared here rather than per-file so
 * that plain .js deliverables (which have no /// <reference> to the typings)
 * do not trip no-undef. Mirrors typings/h5.script.d.ts.
 */
const h5Globals = {
  $: "readonly",
  jQuery: "readonly",
  ConfirmDialog: "readonly",
  ContentElement: "readonly",
  ControlFactory: "readonly",
  H5ControlUtil: "readonly",
  InstanceCache: "readonly",
  SessionCache: "readonly",
  IonApiService: "readonly",
  ListControl: "readonly",
  MFormsAutomation: "readonly",
  MIRequest: "readonly",
  MIService: "readonly",
  ScriptUtil: "readonly",
  Configuration: "readonly",
  infor: "readonly",
};

export default defineConfig([
  // Vendored upstream SDKs, bulk M3 metadata, and build artifacts are not ours to lint.
  globalIgnores([
    "SDKs/**",
    "MI catalog and Data Dictionary/**",
    "**/node_modules/**",
    "**/*.js.map",
    "logs/**",
    // Compiled H5 output — the .ts files are the source of truth.
    "Projects/**/H5-Scripts/**/*.js",
    "Projects/**/H5-Scripts/**/archive/**",
    // Vendored widget packages shipped by Infor/partners.
    "Projects/General/Widgets/**",
    // Infor-supplied typings — vendored verbatim, not ours to restyle.
    "**/typings/h5.script.d.ts",
    // npm lockfiles legitimately use "" as the root package key.
    "package-lock.json",
  ]),

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...h5Globals },
    },
  },
  tseslint.configs.recommended,

  // H5 scripts target the ES5-era runtime and lean on the untyped H5 surface.
  {
    files: ["Projects/**/H5-Scripts/**/*.ts"],
    rules: {
      // The H5 script loader resolves the entry class off the global object and
      // only finds it when the top-level declaration uses `var`. With `const` or
      // `let` the script silently fails to load, with no error. This is a hard
      // runtime requirement of the H5 framework, not a style preference, so
      // no-var cannot apply here. See AGENTS.md -> H5 Script Development Rules.
      "no-var": "off",
      // The H5 surface (H5ControlUtil.H5Dialog, grid rows, MI payloads) is
      // largely untyped in Infor's own .d.ts, so `any` is unavoidable at the
      // boundary.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Surfaced, not enforced: the frozen V4 script is live and must not be
      // edited for style alone.
      "prefer-const": "warn",
      // AGENTS.md: use the IScriptLog `log` object, never console.* — console
      // output cannot be switched off in a deployed script.
      "no-console": "error",
    },
  },

  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
]);
