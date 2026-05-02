import { test, expect } from '@playwright/test';

test('home page renders intro, featured projects, and contact cta', async ({ page }) => {
  await page.goto('/ru/');

  const main = page.getByRole('main');
  const imageSources = await page.locator('[data-project-card] img').evaluateAll((images) =>
    images.map((image) => image.getAttribute('src') || ''),
  );
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-project-card]')).toHaveCount(3);
  expect(imageSources).toHaveLength(3);
  expect(imageSources).not.toContain('[object Object]');
  expect(imageSources.some((src) => /^\/src\/assets\//.test(src))).toBe(false);
  expect(ogImage).toBeTruthy();
  expect(new URL(ogImage || '').origin).toBe(new URL(page.url()).origin);
  expect(ogImage).not.toContain('[object Object]');
  expect(ogImage?.toLowerCase()).not.toContain('.svg');
  expect(twitterImage).toBe(ogImage);
  await expect(main.getByText('Услуги')).toBeVisible();
  await expect(main.getByText('О студии')).toBeVisible();
  await expect(main.getByText('Избранное')).toBeVisible();
  await expect(main.getByText('Контакты')).toBeVisible();
  await expect(page.getByRole('link', { name: /связаться/i })).toBeVisible();
  await expect(main.getByText('selected work')).toHaveCount(0);
  await expect(main.getByText('contact')).toHaveCount(0);
});
