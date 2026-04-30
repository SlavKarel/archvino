import { test, expect } from '@playwright/test';

test('localized home renders header, footer, and locale switcher', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await page.getByRole('link', { name: /en/i }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
});
