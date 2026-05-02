import { test, expect } from '@playwright/test';

test('localized home renders header, footer, and locale switcher', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await page.getByRole('link', { name: /en/i }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
});

test('projects navigation link resolves to a localized projects index page', async ({ page }) => {
  await page.goto('/ru/');

  await page.getByRole('navigation').getByRole('link', { name: 'Проекты' }).click();

  await expect(page).toHaveURL(/\/ru\/projects\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Проекты' })).toBeVisible();
  await expect(page.locator('[data-project-card]')).toHaveCount(4);
});

test('secondary pages render localized content', async ({ page }) => {
  await page.goto('/ru/about');
  await expect(page).toHaveURL(/\/ru\/about\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'О студии' })).toBeVisible();
  await expect(page.getByRole('img', { name: /портрет архитектора/i })).toBeVisible();

  await page.goto('/ru/services');
  await expect(page).toHaveURL(/\/ru\/services\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Услуги' })).toBeVisible();
  await expect(page.locator('.services-page__list li')).toHaveCount(4);

  await page.goto('/ru/contact');
  await expect(page).toHaveURL(/\/ru\/contact\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
