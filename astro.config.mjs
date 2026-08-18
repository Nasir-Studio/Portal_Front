import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://lamb.nsir.uk',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/components/life', import.meta.url)),
        $lib: fileURLToPath(new URL('./src/badges/lib', import.meta.url)),
        $ntub: fileURLToPath(new URL('./src/ntub/lib', import.meta.url)),
      },
    },
  },
});
