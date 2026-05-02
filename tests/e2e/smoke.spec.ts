import { test, expect } from '@playwright/test';

test('root redirects to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ru\/?$/);

  const heading = page.getByRole('heading', { level: 1 });

  await expect(heading).toBeVisible();
  await expect(heading).toContainText(/[А-Яа-яЁё]/);
  await expect(heading).not.toHaveText(/archvino/i);
});

test('cms routes resolve to the static admin entrypoint', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/index\.html(?:#\/)?$/);
  await expect(page).toHaveTitle('Archvino CMS');

  await page.goto('/keystatic');
  await expect(page).toHaveURL(/\/admin\/index\.html(?:#\/)?$/);
  await expect(page).toHaveTitle('Archvino CMS');
});
