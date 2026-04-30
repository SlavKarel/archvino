import { type Locale, type LocalizedString, getLocalizedValue } from './i18n';
import { getDefaultSeo, getSiteSettings } from './content';

type SeoInput = {
  title?: string;
  description?: string;
  image?: string;
};

export async function buildDefaultSeo(locale: Locale) {
  const [settings, defaults] = await Promise.all([getSiteSettings(), getDefaultSeo(locale)]);

  return {
    title: defaults.title,
    description: defaults.description,
    image: settings.logo.src,
  };
}

export async function buildSeo(locale: Locale, input: SeoInput = {}) {
  const defaults = await buildDefaultSeo(locale);

  return {
    title: input.title || defaults.title,
    description: input.description || defaults.description,
    image: input.image || defaults.image,
  };
}

export function localizeSeoField(value: LocalizedString, locale: Locale): string {
  return getLocalizedValue(value, locale);
}
