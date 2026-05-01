import { test, expect } from '@playwright/test';

test('invalid submission shows required validation message', async ({ page }) => {
  await page.goto('/ru/contact');
  await page.getByRole('button', { name: /send|отправить/i }).click();
  await expect(page.locator('[data-field-error="name"]')).toHaveText(/required|обязательно/i);
  await expect(page.locator('[data-form-status]')).toHaveText(/required|обязательно/i);
});

test('invalid email shows the localized email validation message', async ({ page }) => {
  await page.goto('/ru/contact');
  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('invalid-email');
  await page.locator('textarea[name="message"]').fill('Test inquiry');
  await page.getByRole('button', { name: /send|отправить/i }).click();
  await expect(page.locator('[data-field-error="email"]')).toHaveText(/корректный email|valid email/i);
  await expect(page.locator('[data-form-status]')).toHaveText(/корректный email|valid email/i);
});

test('valid submission posts to PUBLIC_CONTACT_FORM_ENDPOINT and shows success message', async ({ page }) => {
  await page.route('**/contact-test-endpoint', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto('/ru/contact');
  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Test inquiry');
  await page.getByRole('button', { name: /send|отправить/i }).click();
  await expect(page.locator('[data-form-status]')).toHaveText(/sent|отправлено/i);
});

test('failed submission shows the localized error message', async ({ page }) => {
  await page.route('**/contact-test-endpoint', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false }),
    });
  });

  await page.goto('/ru/contact');
  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('Test inquiry');
  await page.getByRole('button', { name: /send|отправить/i }).click();
  await expect(page.locator('[data-form-status]')).toHaveText(/попробуйте снова|try again/i);
});
