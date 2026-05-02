import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4323',
  },
  webServer: {
    // Build with SITE set so generated HTML uses the test origin, then preview the built output.
    command:
      'SITE=http://127.0.0.1:4323 PUBLIC_CONTACT_FORM_ENDPOINT=/contact-test-endpoint npm run build && SITE=http://127.0.0.1:4323 PUBLIC_CONTACT_FORM_ENDPOINT=/contact-test-endpoint npm run preview -- --host 127.0.0.1 --port 4323',
    port: 4323,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
