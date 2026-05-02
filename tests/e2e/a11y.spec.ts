import { test, expect } from '@playwright/test';

test('images have non-empty alt text', async ({ page }) => {
  await page.goto('/ru/');

  const empties = await page.locator('img').evaluateAll((imgs) =>
    imgs.filter((img) => !(img.getAttribute('alt') || '').trim()).map((img) => img.getAttribute('src')),
  );

  expect(empties).toHaveLength(0);
});

test('respects reduced-motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ru/');

  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
});

test('locale links are consistent and switch locales', async ({ page }) => {
  await page.goto('/ru/');

  const en = page.getByRole('link', { name: /en/i });
  await expect(en).toHaveAttribute('href', '/en/');
  await en.click();
  await expect(page).toHaveURL(/\/en\/?$/);
});

test('interactive elements expose :focus-visible when focused', async ({ page }) => {
  await page.goto('/ru/');

  const link = page.getByRole('navigation').locator('a').first();
  const handle = await link.elementHandle();

  if (!handle) {
    test.skip(true, 'no focusable nav link found');
    return;
  }

  await handle.focus();
  const matches = await handle.evaluate((el) => el.matches(':focus-visible'));
  expect(matches).toBeTruthy();
});
