import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  minify: true,
  target: 'es2022',
  format: ['esm', 'cjs'],
  treeshake: true,
  shims: false,
  dts: true,
});
