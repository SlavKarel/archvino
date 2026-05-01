export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactValidationMessages = {
  required: string;
  invalidEmail: string;
};

type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

type ContactValidationResult =
  | {
      ok: true;
      value: ContactPayload;
    }
  | {
      ok: false;
      errors: ContactFieldErrors;
    };

export function validateContactPayload(
  payload: ContactPayload,
  messages: ContactValidationMessages = {
    required: 'required',
    invalidEmail: 'invalid email',
  },
): ContactValidationResult {
  const value = normalizeContactPayload(payload);
  const errors: ContactFieldErrors = {};

  if (!value.name) {
    errors.name = messages.required;
  }

  if (!value.email) {
    errors.email = messages.required;
  }

  if (value.email && !isValidEmail(value.email)) {
    errors.email = messages.invalidEmail;
  }

  if (!value.message) {
    errors.message = messages.required;
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    value,
  };
}

export async function submitContactPayload(
  endpoint: string,
  payload: ContactPayload,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const requestUrl = buildContactRequestUrl(endpoint);
  const body = new FormData();

  body.set('name', payload.name);
  body.set('email', payload.email);
  body.set('message', payload.message);

  const response = await fetchFn(requestUrl, {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.ok) {
    return;
  }

  throw new Error('contact submission failed');
}

function normalizeContactPayload(payload: ContactPayload): ContactPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
  };
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildContactRequestUrl(endpoint: string): string {
  if (typeof window === 'undefined') {
    return endpoint;
  }

  return new URL(endpoint, window.location.origin).toString();
}
