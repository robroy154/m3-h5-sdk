// Bundles the ES5 JavaScript that tsc emits into the single self-contained
// file H5 deploys. `format: iife` + `name` produces exactly the declaration the
// H5 loader requires:
//
//     var POReceiptShortcutV7 = (function () { ... })();
//
// The loader resolves the entry class off the global object by filename, so
// the `name` here must match the output filename and the class name.
//
// Paths are resolved against this file rather than the working directory: the
// build runs from the repository root via `npm run build:poreceipt`, so a
// relative input would look for build/index.js there and fail.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Chains tsc's per-file sourcemaps into the bundle's.
 *
 * Without this the published .js.map points at build/*.js — the downlevelled
 * ES5 intermediate, complete with __awaiter and __generator helpers — which is
 * close to useless to anyone debugging a deployed script. Handing rolldown the
 * upstream map in the `load` hook makes it compose the two, so a breakpoint in
 * the browser lands on the original TypeScript.
 */
const chainTypeScriptSourcemaps = {
  name: 'chain-tsc-sourcemaps',
  load(id) {
    if (!id.endsWith('.js')) return null;
    const code = readFileSync(id, 'utf8');
    try {
      const map = JSON.parse(readFileSync(id + '.map', 'utf8'));
      return { code, map };
    } catch {
      // No map emitted for this file; let rolldown map to the .js as before.
      return { code };
    }
  },
};

export default {
  input: join(here, 'build/index.js'),
  plugins: [chainTypeScriptSourcemaps],
  output: {
    file: join(here, 'POReceiptShortcutV7.js'),
    format: 'iife',
    name: 'POReceiptShortcutV7',
    sourcemap: true,
  },
};
