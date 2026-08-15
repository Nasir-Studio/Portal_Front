import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://lamb.nsir.uk',
  base: '/',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [svelte()],
  vite: {
    resolve: {
      alias: {
        $lib: fileURLToPath(new URL('./src/badges/lib', import.meta.url)),
      },
    },
  },
});
