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

test('project detail page renders hero, facts, gallery, and sections', async ({ page }) => {
  await page.goto('/ru/projects/villa-moscow');

  const imageSources = await page.locator('main img').evaluateAll((images) =>
    images.map((image) => image.getAttribute('src') || ''),
  );
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-project-summary]')).toBeVisible();
  await expect(page.locator('[data-project-facts]')).toBeVisible();
  await expect(page.locator('[data-project-gallery] img')).toHaveCount(3);
  await expect(page.locator('[data-project-section]')).toHaveCount(2);
  expect(imageSources).toHaveLength(4);
  expect(imageSources).not.toContain('[object Object]');
  expect(imageSources.some((src) => /^\/src\/assets\//.test(src))).toBe(false);
  expect(ogImage).toBeTruthy();
  expect(new URL(ogImage || '').origin).toBe(new URL(page.url()).origin);
  expect(ogImage).not.toContain('[object Object]');
  expect(ogImage?.toLowerCase()).not.toContain('.svg');
});

test('about page renders the portrait with a public asset url', async ({ page }) => {
  await page.goto('/ru/about');

  const portraitSrc = await page.locator('.about-page__portrait img').getAttribute('src');
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

  expect(portraitSrc).toBeTruthy();
  expect(portraitSrc).not.toBe('[object Object]');
  expect(/^\/src\/assets\//.test(portraitSrc || '')).toBe(false);
  expect(ogImage).toBeTruthy();
  expect(new URL(ogImage || '').origin).toBe(new URL(page.url()).origin);
  expect(ogImage).not.toContain('[object Object]');
  expect(ogImage?.toLowerCase()).not.toContain('.svg');
});
