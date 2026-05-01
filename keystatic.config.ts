import { collection, config, fields, singleton } from 'keystatic';

const projectCategoryOptions = [
  { label: 'Residential', value: 'residential' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Interiors', value: 'interiors' },
] as const;

const pageOptions = [
  { label: 'Home', value: 'home' },
  { label: 'About', value: 'about' },
  { label: 'Services', value: 'services' },
  { label: 'Contact', value: 'contact' },
] as const;

function localizedText(label: string, multiline = false) {
  return fields.object({
    ru: fields.text({ label: `${label} (RU)`, multiline }),
    en: fields.text({ label: `${label} (EN)`, multiline }),
  });
}

function localizedImage(label: string) {
  return fields.object({
    src: fields.image({ label }),
    alt: localizedText('Alt text'),
  });
}

function projectSection() {
  return fields.object({
    label: localizedText('Section label'),
    heading: localizedText('Section heading'),
    body: localizedText('Section body', true),
  });
}

const siteSingleton = singleton({
  label: 'Site settings',
  directory: 'src/content/settings',
  format: 'yaml',
  schema: {
    studioName: fields.text({ label: 'Studio name' }),
    logo: localizedImage('Logo'),
    navigation: fields.object({
      home: localizedText('Home label'),
      projects: localizedText('Projects label'),
      about: localizedText('About label'),
      services: localizedText('Services label'),
      contact: localizedText('Contact label'),
    }),
    footerText: localizedText('Footer text', true),
    localeLabels: fields.object({
      ru: localizedText('Russian locale label'),
      en: localizedText('English locale label'),
    }),
    defaultSeo: fields.object({
      title: localizedText('SEO title'),
      description: localizedText('SEO description', true),
    }),
    contact: fields.object({
      email: fields.text({ label: 'Email' }),
      phone: fields.text({ label: 'Phone' }),
      address: localizedText('Address', true),
      mapUrl: fields.url({ label: 'Map URL' }),
    }),
    socialLinks: fields.array(
      fields.object({
        label: localizedText('Social label'),
        url: fields.url({ label: 'Social URL' }),
      }),
      { label: 'Social links' },
    ),
  },
});

const homeSingleton = singleton({
  label: 'Home page',
  directory: 'src/content/pages',
  format: 'yaml',
  schema: {
    id: fields.select({ label: 'Page id', options: pageOptions, defaultValue: 'home' }),
    headline: localizedText('Headline', true),
    intro: localizedText('Intro', true),
    aboutPreview: localizedText('About preview', true),
    servicesPreview: localizedText('Services preview', true),
    featuredProjectSlugs: fields.relationship({
      listKey: 'projects',
      label: 'Featured projects',
      many: true,
    }),
    contactCta: fields.object({
      heading: localizedText('CTA heading'),
      body: localizedText('CTA body', true),
      label: localizedText('CTA label'),
    }),
  },
});

const aboutSingleton = singleton({
  label: 'About page',
  directory: 'src/content/pages',
  format: 'yaml',
  schema: {
    id: fields.select({ label: 'Page id', options: pageOptions, defaultValue: 'about' }),
    title: localizedText('Title'),
    biography: localizedText('Biography', true),
    approach: localizedText('Approach', true),
    credentials: localizedText('Credentials', true),
    portrait: localizedImage('Portrait'),
  },
});

const servicesSingleton = singleton({
  label: 'Services page',
  directory: 'src/content/pages',
  format: 'yaml',
  schema: {
    id: fields.select({ label: 'Page id', options: pageOptions, defaultValue: 'services' }),
    title: localizedText('Title'),
    intro: localizedText('Intro', true),
    items: fields.array(localizedText('Service item', true), { label: 'Service items' }),
    cta: localizedText('CTA', true),
  },
});

const contactSingleton = singleton({
  label: 'Contact page',
  directory: 'src/content/pages',
  format: 'yaml',
  schema: {
    id: fields.select({ label: 'Page id', options: pageOptions, defaultValue: 'contact' }),
    heading: localizedText('Heading'),
    intro: localizedText('Intro', true),
    email: fields.text({ label: 'Email' }),
    phone: fields.text({ label: 'Phone' }),
    address: localizedText('Address', true),
    mapUrl: fields.url({ label: 'Map URL' }),
    socialLinks: fields.array(
      fields.object({
        label: localizedText('Social label'),
        url: fields.url({ label: 'Social URL' }),
      }),
      { label: 'Social links' },
    ),
    formHelper: localizedText('Form helper', true),
    formLabels: fields.object({
      name: localizedText('Name label'),
      email: localizedText('Email label'),
      message: localizedText('Message label'),
      submit: localizedText('Submit label'),
    }),
    formMessages: fields.object({
      required: localizedText('Required message'),
      invalidEmail: localizedText('Invalid email message'),
      success: localizedText('Success message'),
      error: localizedText('Error message'),
      sending: localizedText('Sending message'),
    }),
  },
});

const taxonomySingleton = singleton({
  label: 'Project taxonomy',
  directory: 'src/content/taxonomy',
  format: 'yaml',
  schema: {
    categories: fields.array(
      fields.object({
        slug: fields.select({
          label: 'Category slug',
          options: projectCategoryOptions,
          defaultValue: 'residential',
        }),
        label: localizedText('Category label'),
      }),
      { label: 'Categories' },
    ),
  },
});

const projectsCollection = collection({
  label: 'Projects',
  directory: 'src/content/projects',
  format: 'yaml',
  getItemSlug: (value) => value.slug,
  schema: {
    slug: fields.text({ label: 'Slug' }),
    category: fields.select({
      label: 'Category',
      options: projectCategoryOptions,
      defaultValue: 'residential',
    }),
    year: fields.integer({ label: 'Year' }),
    location: localizedText('Location'),
    status: localizedText('Status'),
    featured: fields.checkbox({ label: 'Featured on archive' }),
    order: fields.integer({ label: 'Order' }),
    title: localizedText('Title'),
    summary: localizedText('Summary', true),
    cover: localizedImage('Cover image'),
    gallery: fields.array(localizedImage('Gallery image'), { label: 'Gallery' }),
    sections: fields.array(projectSection(), { label: 'Sections' }),
  },
});

export const cmsCollections = {
  settings: siteSingleton,
  pages: {
    home: homeSingleton,
    about: aboutSingleton,
    services: servicesSingleton,
    contact: contactSingleton,
  },
  taxonomy: taxonomySingleton,
  projects: projectsCollection,
};

export default config({
  storage: { kind: 'local' },
  collections: {
    projects: projectsCollection,
  },
  singletons: {
    site: siteSingleton,
    home: homeSingleton,
    about: aboutSingleton,
    services: servicesSingleton,
    contact: contactSingleton,
    'project-categories': taxonomySingleton,
  },
});
