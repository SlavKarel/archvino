import { getCollection } from 'astro:content';

import { type Locale, getLocalizedValue, type LocalizedString } from './i18n';

const projectAssetModules = import.meta.glob('../assets/projects/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

type ImageReference = {
  src: string;
  alt: LocalizedString;
};

type ProjectSection = {
  label: LocalizedString;
  heading: LocalizedString;
  body: LocalizedString;
};

type ProjectData = {
  slug: string;
  category: string;
  year: number;
  location: LocalizedString;
  status: LocalizedString;
  featured: boolean;
  order: number;
  title: LocalizedString;
  summary: LocalizedString;
  cover: ImageReference;
  gallery: ImageReference[];
  sections: ProjectSection[];
};

type TaxonomyData = {
  categories: Array<{
    slug: string;
    label: LocalizedString;
  }>;
};

type SortableProject = {
  featured: boolean;
  order: number;
};

type CategorizableProject = {
  category: string;
};

type LocalizedProject = {
  slug: string;
  category: string;
  year: number;
  location: string;
  status: string;
  featured: boolean;
  order: number;
  title: string;
  summary: string;
  cover: {
    src: string;
    alt: string;
  };
  gallery: Array<{
    src: string;
    alt: string;
  }>;
  sections: Array<{
    label: string;
    heading: string;
    body: string;
  }>;
};

export function sortProjects<T extends SortableProject>(projects: T[]): T[] {
  return [...projects].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    return left.order - right.order;
  });
}

export function filterProjectsByCategory<T extends CategorizableProject>(projects: T[], category?: string): T[] {
  if (!category) {
    return [...projects];
  }

  return projects.filter((project) => project.category === category);
}

export async function getProjects(locale: Locale): Promise<LocalizedProject[]> {
  const entries = await getCollection('projects');

  return sortProjects(entries.map((entry) => localizeProject(entry.data as ProjectData, locale)));
}

export async function getProjectSlugs(): Promise<string[]> {
  const entries = await getCollection('projects');

  return entries.map((entry) => (entry.data as ProjectData).slug);
}

export async function getProjectBySlug(slug: string, locale: Locale): Promise<LocalizedProject | undefined> {
  const entries = await getCollection('projects');
  const entry = entries.find((item) => item.data.slug === slug);

  if (!entry) {
    return undefined;
  }

  return localizeProject(entry.data as ProjectData, locale);
}

export async function getProjectCategories(locale: Locale) {
  const entries = await getCollection('taxonomy');
  const entry = entries.find((item) => item.id === 'project-categories');

  if (!entry) {
    throw new Error('missing project categories content');
  }

  return (entry.data as TaxonomyData).categories.map((category) => ({
    slug: category.slug,
    label: getLocalizedValue(category.label, locale),
  }));
}

function localizeProject(project: ProjectData, locale: Locale): LocalizedProject {
  return {
    slug: project.slug,
    category: project.category,
    year: project.year,
    location: getLocalizedValue(project.location, locale),
    status: getLocalizedValue(project.status, locale),
    featured: project.featured,
    order: project.order,
    title: getLocalizedValue(project.title, locale),
    summary: getLocalizedValue(project.summary, locale),
    cover: {
      src: resolveProjectAssetPath(project.cover.src),
      alt: getLocalizedValue(project.cover.alt, locale),
    },
    gallery: project.gallery.map((image) => ({
      src: resolveProjectAssetPath(image.src),
      alt: getLocalizedValue(image.alt, locale),
    })),
    sections: project.sections.map((section) => ({
      label: getLocalizedValue(section.label, locale),
      heading: getLocalizedValue(section.heading, locale),
      body: getLocalizedValue(section.body, locale),
    })),
  };
}

function resolveProjectAssetPath(source: string): string {
  const moduleKey = source.startsWith('/src/') ? `../${source.slice('/src/'.length)}` : source;
  const asset = projectAssetModules[moduleKey];

  if (!asset) {
    return source;
  }

  return String(asset);
}

export type { LocalizedProject, ProjectData, TaxonomyData };
