import { describe, expect, it } from 'vitest';

import { submitContactPayload, validateContactPayload } from '../../src/lib/contact';

describe('contact validation', () => {
  it('rejects empty required fields', () => {
    expect(validateContactPayload({ name: '', email: '', message: '' }).ok).toBe(false);
  });

  it('rejects invalid email addresses with the configured message', () => {
    const result = validateContactPayload(
      { name: 'test', email: 'invalid-email', message: 'hello' },
      { required: 'required', invalidEmail: 'invalid email' },
    );

    expect(result).toEqual({
      ok: false,
      errors: {
        email: 'invalid email',
      },
    });
  });

  it('returns a trimmed valid payload', () => {
    const result = validateContactPayload({
      name: ' Test User ',
      email: ' test@example.com ',
      message: ' Hello ',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello',
      },
    });
  });
});

describe('contact submission', () => {
  it('throws when the endpoint responds with an error', async () => {
    await expect(
      submitContactPayload(
        '/contact-test-endpoint',
        { name: 'test', email: 'test@example.com', message: 'hello' },
        async () => new Response(null, { status: 500 }),
      ),
    ).rejects.toThrow('contact submission failed');
  });
});
