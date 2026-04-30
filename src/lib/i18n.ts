export const LOCALES = ['ru', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

export type LocalizedString = Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getAlternateLocale(locale: Locale): Locale {
  if (locale === 'ru') {
    return 'en';
  }

  return 'ru';
}

export function buildLocalePath(locale: Locale, pathname = '/'): string {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === '/') {
    return `/${locale}/`;
  }

  return `/${locale}${normalizedPath}`;
}

export function getLocalizedValue(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

function normalizePathname(pathname: string): string {
  if (pathname === '') {
    return '/';
  }

  if (pathname === '/') {
    return pathname;
  }

  if (pathname.startsWith('/')) {
    return pathname.replace(/\/+$/, '');
  }

  return `/${pathname.replace(/\/+$/, '')}`;
}
