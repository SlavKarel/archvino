import { type Locale, type LocalizedString, getLocalizedValue } from './i18n';
import { resolveAssetPath } from './assets';
import { getDefaultSeo, getHomePageContent, getSiteSettings } from './content';
import { getProjectBySlug } from './projects';

type SeoInput = {
  title?: string;
  description?: string;
  image?: string;
};

type ProjectSeoInput = {
  title: string;
  summary: string;
  location: string;
  year: number;
  status: string;
  image?: string;
};

export async function buildDefaultSeo(locale: Locale) {
  const [settings, defaults] = await Promise.all([getSiteSettings(), getDefaultSeo(locale)]);
  const image = await getDefaultSeoImage(locale, settings.logo.src);

  return {
    title: defaults.title,
    description: defaults.description,
    image,
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

export async function buildProjectSeo(locale: Locale, input: ProjectSeoInput) {
  const defaults = await buildDefaultSeo(locale);
  const title = `${input.title} | ${defaults.title}`;
  const details = `${input.location}, ${input.year}. ${input.status}.`;

  return buildSeo(locale, {
    title,
    description: `${input.summary} ${details}`,
    image: input.image,
  });
}

export function localizeSeoField(value: LocalizedString, locale: Locale): string {
  return getLocalizedValue(value, locale);
}

async function getDefaultSeoImage(locale: Locale, logoSource: string): Promise<string> {
  const resolvedLogo = resolveAssetPath(logoSource);

  if (!logoSource.toLowerCase().endsWith('.svg')) {
    return resolvedLogo;
  }

  const home = await getHomePageContent(locale);
  const featuredSlug = home.featuredProjectSlugs[0];

  if (!featuredSlug) {
    return resolvedLogo;
  }

  const featuredProject = await getProjectBySlug(featuredSlug, locale);

  if (!featuredProject) {
    return resolvedLogo;
  }

  return featuredProject.cover.src;
}
