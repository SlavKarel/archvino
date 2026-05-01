import { getCollection } from 'astro:content';

import { type Locale, getLocalizedValue, type LocalizedString } from './i18n';

type ImageReference = {
  src: string;
  alt: LocalizedString;
};

type SiteSettings = {
  studioName: string;
  logo: ImageReference;
  navigation: Record<'home' | 'projects' | 'about' | 'services' | 'contact', LocalizedString>;
  footerText: LocalizedString;
  localeLabels: Record<Locale, LocalizedString>;
  defaultSeo: {
    title: LocalizedString;
    description: LocalizedString;
  };
  contact: {
    email: string;
    phone: string;
    address: LocalizedString;
    mapUrl: string;
  };
  socialLinks: Array<{
    label: LocalizedString;
    url: string;
  }>;
};

type HomePage = {
  id: 'home';
  headline: LocalizedString;
  intro: LocalizedString;
  featuredProjectSlugs: string[];
  aboutPreview?: Partial<LocalizedString>;
  servicesPreview?: Partial<LocalizedString>;
  contactCta: {
    heading: LocalizedString;
    body: LocalizedString;
    label: LocalizedString;
  };
};

type AboutPage = {
  id: 'about';
  title: LocalizedString;
  biography: LocalizedString;
  approach: LocalizedString;
  credentials: LocalizedString;
  portrait: ImageReference;
};

type ServicesPage = {
  id: 'services';
  title: LocalizedString;
  intro: LocalizedString;
  items: LocalizedString[];
  cta: LocalizedString;
};

type ContactPage = {
  id: 'contact';
  heading: LocalizedString;
  intro: LocalizedString;
  email: string;
  phone: string;
  address: LocalizedString;
  mapUrl: string;
  socialLinks: Array<{
    label: LocalizedString;
    url: string;
  }>;
  formHelper: LocalizedString;
  formLabels: Record<'name' | 'email' | 'message' | 'submit', LocalizedString>;
  formMessages: Record<'required' | 'invalidEmail' | 'success' | 'error' | 'sending', LocalizedString>;
};

type PageById = {
  home: HomePage;
  about: AboutPage;
  services: ServicesPage;
  contact: ContactPage;
};

type PageId = keyof PageById;

export async function getSiteSettings(): Promise<SiteSettings> {
  const entries = await getCollection('settings');
  const entry = entries.find((item) => item.id === 'site');

  if (!entry) {
    throw new Error('missing site settings content');
  }

  return entry.data as SiteSettings;
}

export async function getHomePageContent(locale: Locale) {
  const [homeEntry, aboutEntry, servicesEntry] = await Promise.all([
    getPageEntry('home'),
    getPageEntry('about'),
    getPageEntry('services'),
  ]);

  const aboutPreview = getOptionalLocalizedValue(homeEntry.aboutPreview, locale);
  const servicesPreview = getOptionalLocalizedValue(homeEntry.servicesPreview, locale);

  return {
    headline: getLocalizedValue(homeEntry.headline, locale),
    intro: getLocalizedValue(homeEntry.intro, locale),
    featuredProjectSlugs: [...homeEntry.featuredProjectSlugs],
    aboutPreview: aboutPreview || buildExcerpt([aboutEntry.biography, aboutEntry.approach], locale),
    servicesPreview: servicesPreview || buildExcerpt([servicesEntry.intro, servicesEntry.cta], locale),
    contactCta: {
      heading: getLocalizedValue(homeEntry.contactCta.heading, locale),
      body: getLocalizedValue(homeEntry.contactCta.body, locale),
      label: getLocalizedValue(homeEntry.contactCta.label, locale),
    },
  };
}

export async function getDefaultSeo(locale: Locale) {
  const settings = await getSiteSettings();

  return {
    title: getLocalizedValue(settings.defaultSeo.title, locale),
    description: getLocalizedValue(settings.defaultSeo.description, locale),
  };
}

async function getPageEntry<T extends PageId>(id: T): Promise<PageById[T]> {
  const entries = await getCollection('pages');
  const entry = entries.find((item) => item.id === id);

  if (!entry) {
    throw new Error(`missing ${id} page content`);
  }

  return entry.data as PageById[T];
}

function getOptionalLocalizedValue(
  value: Partial<Record<Locale, string>> | undefined,
  locale: Locale,
): string {
  return value?.[locale]?.trim() || '';
}

function buildExcerpt(values: Array<Record<Locale, string>>, locale: Locale): string {
  const text = values
    .map((value) => getLocalizedValue(value, locale).trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.slice(0, 180).trim();
}

export type { SiteSettings, HomePage, AboutPage, ServicesPage, ContactPage, ImageReference };
