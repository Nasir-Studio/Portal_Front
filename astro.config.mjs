import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lamb.nsir.uk',
  base: '/',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
