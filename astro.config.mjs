import { defineConfig } from 'astro/config';

export default defineConfig({
  // Allow overriding the site origin for local preview/tests using the SITE env var.
  site: process.env.SITE || 'https://archvino.ru',
  redirects: {
    '/admin': '/admin/index.html',
    '/admin/': '/admin/index.html',
    '/keystatic': '/admin/index.html',
  },
});
