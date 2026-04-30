import { test, expect } from '@playwright/test';

test('root redirects to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ru\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('archvino');
});
