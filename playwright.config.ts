import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4323'
  },
  webServer: {
    command: 'PUBLIC_CONTACT_FORM_ENDPOINT=/contact-test-endpoint npm run dev -- --host 127.0.0.1 --port 4323',
    port: 4323,
    reuseExistingServer: false
  }
});
