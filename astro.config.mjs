import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sheephome.nsir.uk',
  base: '/',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
