import { defineConfig } from 'astro/config';

export default defineConfig({
  redirects: {
    '/admin': '/admin/index.html',
    '/admin/': '/admin/index.html',
    '/keystatic': '/admin/index.html',
  },
});
