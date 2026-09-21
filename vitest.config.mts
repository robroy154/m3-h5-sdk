import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only this fork's own code. SDKs/ is Infor's vendored SDK material — it
    // ships its own Angular/karma specs that are not ours to run and whose
    // dependencies are not installed here.
    include: ['Projects/**/tests/**/*.{test,spec}.ts'],
    exclude: [
      '**/node_modules/**',
      'SDKs/**',
      'MI catalog and Data Dictionary/**',
      '**/archive/**',
    ],
    environment: 'node',
  },
});
