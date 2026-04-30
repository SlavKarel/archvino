import { test, expect } from '@playwright/test';

test('home page renders intro, featured projects, and contact cta', async ({ page }) => {
  await page.goto('/ru/');

   const main = page.getByRole('main');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-project-card]')).toHaveCount(3);
  await expect(main.getByText('Услуги')).toBeVisible();
  await expect(main.getByText('О студии')).toBeVisible();
  await expect(main.getByText('Избранное')).toBeVisible();
  await expect(main.getByText('Контакты')).toBeVisible();
  await expect(page.getByRole('link', { name: /связаться/i })).toBeVisible();
  await expect(main.getByText('selected work')).toHaveCount(0);
  await expect(main.getByText('contact')).toHaveCount(0);
});
