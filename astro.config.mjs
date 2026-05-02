import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://archvino.ru',
  redirects: {
    '/admin': '/admin/index.html',
    '/admin/': '/admin/index.html',
    '/keystatic': '/admin/index.html',
  },
});
