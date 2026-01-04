import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/index.ts'],
  format: ['esm'],
  outExtension: () => ({ js: '.mjs' }),
  clean: true,
  shims: true,
  target: 'es2020',
});
