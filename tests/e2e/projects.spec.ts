import { expect, test } from '@playwright/test';

test('project filters narrow the grid without reloading the page', async ({ page }) => {
  await page.goto('/ru/');

  await page.getByRole('button', { name: /интерьеры/i }).click();

  await expect(page).toHaveURL(/\/ru\/?$/);
  await expect(page.locator('[data-project-card]:visible')).toHaveCount(1);
});

test('project filters still work with reduced motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ru/');

  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  await expect(page.locator('[data-project-item]').first()).toHaveCSS('transition-duration', '0s');

  await page.getByRole('button', { name: /интерьеры/i }).click();

  await expect(page).toHaveURL(/\/ru\/?$/);
  await expect(page.locator('[data-project-card]:visible')).toHaveCount(1);
});
