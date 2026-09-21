// Bundles the ES5 JavaScript that tsc emits into the single self-contained
// file H5 deploys. `format: iife` + `name` produces exactly the declaration the
// H5 loader requires:
//
//     var POReceiptShortcutV7 = (function () { ... })();
//
// The loader resolves the entry class off the global object by filename, so
// the `name` here must match the output filename and the class name.
export default {
  input: 'build/index.js',
  output: {
    file: 'POReceiptShortcutV7.js',
    format: 'iife',
    name: 'POReceiptShortcutV7',
    sourcemap: true,
  },
};
