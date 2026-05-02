import { test, expect } from '@playwright/test';

test('root redirects to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ru\/?$/);

  const heading = page.getByRole('heading', { level: 1 });

  await expect(heading).toBeVisible();
  await expect(heading).toContainText(/[А-Яа-яЁё]/);
  await expect(heading).not.toHaveText(/archvino/i);
});
