import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LOCALE,
  LOCALES,
  buildLocalePath,
  getAlternateLocale,
  isLocale,
} from '../../src/lib/i18n';

describe('i18n helpers', () => {
  it('exposes ru and en locales', () => {
    expect(LOCALES).toEqual(['ru', 'en']);
    expect(DEFAULT_LOCALE).toBe('ru');
  });

  it('builds locale-prefixed paths', () => {
    expect(buildLocalePath('ru', '/about')).toBe('/ru/about');
    expect(buildLocalePath('en', '/projects/villa-moscow')).toBe('/en/projects/villa-moscow');
    expect(buildLocalePath('ru', '/')).toBe('/ru/');
  });

  it('validates locales and resolves alternates', () => {
    expect(isLocale('ru')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('de')).toBe(false);
    expect(getAlternateLocale('ru')).toBe('en');
    expect(getAlternateLocale('en')).toBe('ru');
  });
});
