# Library Utilities Reference

This document provides reference documentation for all utility functions in `src/lib/`.

## Table of Contents

- [i18n.ts](#1-i18nts)
- [content.ts](#2-contentts)
- [projects.ts](#3-projectsts)
- [seo.ts](#4-seots)
- [routes.ts](#5-routests)
- [assets.ts](#6-assetsts)
- [contact.ts](#7-contactts)

---

## 1. i18n.ts

Internationalization utilities for locale handling.

### Constants

```typescript
export const LOCALES = ['ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number]; // 'ru' | 'en'
export const DEFAULT_LOCALE: Locale = 'ru';
```

### Types

```typescript
export type LocalizedString = Record<Locale, string>;
```

A record that maps each locale to its corresponding string value.

---

### isLocale

Validates if a string is a valid locale.

**Signature:**
```typescript
function isLocale(value: string): value is Locale
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `value` | `string` | The value to validate |

**Return Type:** `value is Locale` (type guard)

**Usage Example:**
```typescript
const lang = 'en';
if (isLocale(lang)) {
  console.log(`Selected language: ${lang}`); // lang is typed as Locale
}
```

---

### getLocalizedValue

Retrieves the localized string for a specific locale.

**Signature:**
```typescript
function getLocalizedValue(value: LocalizedString, locale: Locale): string
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `value` | `LocalizedString` | The localized string record |
| `locale` | `Locale` | The target locale |

**Return Type:** `string`

**Usage Example:**
```typescript
const title: LocalizedString = { ru: 'Главная', en: 'Home' };
const titleRu = getLocalizedValue(title, 'ru'); // 'Главная'
const titleEn = getLocalizedValue(title, 'en'); // 'Home'
```

---

### getAlternateLocale

Returns the alternate locale (switches between 'ru' and 'en').

**Signature:**
```typescript
function getAlternateLocale(locale: Locale): Locale
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The current locale |

**Return Type:** `Locale`

**Usage Example:**
```typescript
const next = getAlternateLocale('ru'); // 'en'
const prev = getAlternateLocale('en'); // 'ru'
```

---

### buildLocalePath

Builds a localized path by prepending the locale.

**Signature:**
```typescript
function buildLocalePath(locale: Locale, pathname?: string): string
```

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | `Locale` | - | The locale to use |
| `pathname` | `string` | `'/'` | The pathname to localize |

**Return Type:** `string`

**Usage Example:**
```typescript
buildLocalePath('en', '/about');    // '/en/about'
buildLocalePath('ru', '/');         // '/ru/'
buildLocalePath('en', 'services');  // '/en/services'
```

---

## 2. content.ts

Content retrieval utilities for site pages and settings.

### Types

```typescript
type SiteSettings = {
  studioName: string;
  logo: ImageReference;
  navigation: Record<'home' | 'projects' | 'about' | 'services' | 'contact', LocalizedString>;
  footerText: LocalizedString;
  localeLabels: Record<Locale, LocalizedString>;
  defaultSeo: { title: LocalizedString; description: LocalizedString; };
  contact: { email: string; phone: string; address: LocalizedString; mapUrl: string; };
  socialLinks: Array<{ label: LocalizedString; url: string; }>;
};

type HomePage = {
  id: 'home';
  headline: LocalizedString;
  intro: LocalizedString;
  featuredProjectSlugs: string[];
  aboutPreview?: Partial<LocalizedString>;
  servicesPreview?: Partial<LocalizedString>;
  contactCta: { heading: LocalizedString; body: LocalizedString; label: LocalizedString; };
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
  socialLinks: Array<{ label: LocalizedString; url: string; }>;
  formHelper: LocalizedString;
  formLabels: Record<'name' | 'email' | 'message' | 'submit', LocalizedString>;
  formMessages: Record<'required' | 'invalidEmail' | 'success' | 'error' | 'sending', LocalizedString>;
};

type ImageReference = {
  src: string;
  alt: LocalizedString;
};
```

---

### getSiteSettings

Retrieves site settings from the content collection.

**Signature:**
```typescript
async function getSiteSettings(): Promise<SiteSettings>
```

**Return Type:** `Promise<SiteSettings>`

**Usage Example:**
```typescript
const settings = await getSiteSettings();
console.log(settings.studioName); // 'ArchVino'
console.log(settings.contact.email); // 'info@archvino.ru'
```

---

### getHomePageContent

Retrieves and localizes home page content with auto-generated excerpts.

**Signature:**
```typescript
async function getHomePageContent(locale: Locale): Promise<{
  headline: string;
  intro: string;
  featuredProjectSlugs: string[];
  aboutPreview: string;
  servicesPreview: string;
  contactCta: { heading: string; body: string; label: string; };
}>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |

**Return Type:** `Promise<HomePage>`

**Usage Example:**
```typescript
const home = await getHomePageContent('en');
console.log(home.headline);
console.log(home.contactCta.label);
```

---

### getDefaultSeo

Retrieves default SEO settings for a locale.

**Signature:**
```typescript
async function getDefaultSeo(locale: Locale): Promise<{ title: string; description: string; }>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |

**Return Type:** `Promise<{ title: string; description: string; }>`

**Usage Example:**
```typescript
const seo = await getDefaultSeo('ru');
console.log(seo.title);
```

---

## 3. projects.ts

Project-related utilities for retrieving and filtering portfolio projects.

### Types

```typescript
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
  cover: { src: string; alt: string; };
  gallery: Array<{ src: string; alt: string; }>;
  sections: Array<{ label: string; heading: string; body: string; }>;
};
```

---

### sortProjects

Sorts projects by featured status (featured first) then by order.

**Signature:**
```typescript
function sortProjects<T extends SortableProject>(projects: T[]): T[]
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `projects` | `T[]` | Array of projects to sort |

**Return Type:** `T[]` - New sorted array

**Type Parameters:**
```typescript
type SortableProject = { featured: boolean; order: number; };
```

**Usage Example:**
```typescript
const sorted = sortProjects(projects);
// Featured projects first, then sorted by order ascending
```

---

### filterProjectsByCategory

Filters projects by category.

**Signature:**
```typescript
function filterProjectsByCategory<T extends CategorizableProject>(projects: T[], category?: string): T[]
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `projects` | `T[]` | Array of projects to filter |
| `category` | `string \| undefined` | Category to filter by (returns all if undefined) |

**Return Type:** `T[]`

**Usage Example:**
```typescript
const residential = filterProjectsByCategory(allProjects, 'residential');
const all = filterProjectsByCategory(allProjects); // Returns all
```

---

### getProjects

Retrieves all projects sorted and localized.

**Signature:**
```typescript
async function getProjects(locale: Locale): Promise<LocalizedProject[]>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |

**Return Type:** `Promise<LocalizedProject[]>`

**Usage Example:**
```typescript
const projects = await getProjects('en');
// Returns sorted (featured first), localized projects
```

---

### getProjectSlugs

Retrieves all project slugs.

**Signature:**
```typescript
async function getProjectSlugs(): Promise<string[]>
```

**Return Type:** `Promise<string[]>`

**Usage Example:**
```typescript
const slugs = await getProjectSlugs();
```

---

### getProjectBySlug

Retrieves a single project by slug, localized.

**Signature:**
```typescript
async function getProjectBySlug(slug: string, locale: Locale): Promise<LocalizedProject | undefined>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `slug` | `string` | Project slug |
| `locale` | `Locale` | The target locale |

**Return Type:** `Promise<LocalizedProject | undefined>`

**Usage Example:**
```typescript
const project = await getProjectBySlug('villa-sunset', 'ru');
if (project) {
  console.log(project.title);
}
```

---

### getProjectCategories

Retrieves all project categories with localized labels.

**Signature:**
```typescript
async function getProjectCategories(locale: Locale): Promise<Array<{ slug: string; label: string; }>>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |

**Return Type:** `Promise<Array<{ slug: string; label: string; }>>`

**Usage Example:**
```typescript
const categories = await getProjectCategories('en');
// [{ slug: 'residential', label: 'Residential' }, ...]
```

---

## 4. seo.ts

SEO utilities for building meta tags and social share data.

### Types

```typescript
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
```

---

### buildDefaultSeo

Builds default SEO data from site settings.

**Signature:**
```typescript
async function buildDefaultSeo(locale: Locale): Promise<{ title: string; description: string; image: string; }>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |

**Return Type:** `Promise<SeoData>`

**Usage Example:**
```typescript
const seo = await buildDefaultSeo('ru');
// { title: '...', description: '...', image: '...' }
```

---

### buildSeo

Builds SEO data with optional overrides.

**Signature:**
```typescript
async function buildSeo(locale: Locale, input?: SeoInput): Promise<{ title: string; description: string; image: string; }>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |
| `input` | `SeoInput` | Optional overrides |

**Return Type:** `Promise<SeoData>`

**Usage Example:**
```typescript
const seo = await buildSeo('en', {
  title: 'Custom Title',
  description: 'Custom description'
});
// Returns custom title/description, falls back to defaults for missing fields
```

---

### buildProjectSeo

Builds SEO data for a project page.

**Signature:**
```typescript
async function buildProjectSeo(locale: Locale, input: ProjectSeoInput): Promise<{ title: string; description: string; image: string; }>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |
| `input` | `ProjectSeoInput` | Project-specific SEO data |

**Return Type:** `Promise<SeoData>`

**Usage Example:**
```typescript
const seo = await buildProjectSeo('en', {
  title: 'Villa Sunset',
  summary: 'Modern coastal villa',
  location: 'Spain',
  year: 2024,
  status: 'Completed'
});
// title: 'Villa Sunset | ArchVino'
// description: 'Modern coastal villa Spain, 2024. Completed.'
```

---

## 5. routes.ts

URL building utilities for localized routes.

---

### buildHomePath

Builds the home page path for a locale.

**Signature:**
```typescript
function buildHomePath(locale: Locale): string
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |

**Return Type:** `string`

**Usage Example:**
```typescript
buildHomePath('ru'); // '/ru/'
buildHomePath('en'); // '/en/'
```

---

### buildPagePath

Builds a page path for a locale.

**Signature:**
```typescript
function buildPagePath(locale: Locale, pageSlug: string): string
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |
| `pageSlug` | `string` | Page identifier |

**Return Type:** `string`

**Usage Example:**
```typescript
buildPagePath('en', 'about');    // '/en/about'
buildPagePath('ru', 'services'); // '/ru/services'
```

---

### buildProjectPath

Builds a project page path for a locale.

**Signature:**
```typescript
function buildProjectPath(locale: Locale, projectSlug: string): string
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `locale` | `Locale` | The target locale |
| `projectSlug` | `string` | Project identifier |

**Return Type:** `string`

**Usage Example:**
```typescript
buildProjectPath('en', 'villa-sunset'); // '/en/projects/villa-sunset'
```

---

### buildProjectStaticPaths

Generates static paths for all locale/project combinations (Astro).

**Signature:**
```typescript
function buildProjectStaticPaths(projectSlugs: string[]): Array<{ params: { locale: Locale; slug: string; } }>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `projectSlugs` | `string[]` | Array of project slugs |

**Return Type:** `Array<{ params: { locale: Locale; slug: string; } }>`

**Usage Example:**
```typescript
const paths = buildProjectStaticPaths(['villa-sunset', 'urban-loft']);
// [{ params: { locale: 'ru', slug: 'villa-sunset' } }, { params: { locale: 'en', slug: 'villa-sunset' } }, ...]
```

---

### buildLocaleSwitchPath

Converts a path from one locale to another (preserves page).

**Signature:**
```typescript
function buildLocaleSwitchPath(currentPath: string, targetLocale: Locale): string
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `currentPath` | `string` | Current pathname |
| `targetLocale` | `Locale` | Target locale |

**Return Type:** `string`

**Usage Example:**
```typescript
buildLocaleSwitchPath('/en/about', 'ru');   // '/ru/about'
buildLocaleSwitchPath('/projects/villa', 'en'); // '/en/projects/villa'
buildLocaleSwitchPath('/ru', 'en');         // '/en/'
```

---

## 6. assets.ts

Asset path resolution utilities.

---

### resolveAssetPath

Resolves an asset module path to its runtime URL.

**Signature:**
```typescript
function resolveAssetPath(source: string): string
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `source` | `string` | Asset source path (e.g., '/src/assets/logo.svg') |

**Return Type:** `string` - Resolved asset URL

**Usage Example:**
```typescript
const logoUrl = resolveAssetPath('/src/assets/logo.svg');
// Returns the bundled asset URL
```

**Notes:**
- Supports paths starting with `/src/` or direct paths
- Uses Astro's import.meta.glob for asset resolution
- Falls back to source if asset not found

---

## 7. contact.ts

Contact form validation and submission utilities.

### Types

```typescript
type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

type ContactValidationMessages = {
  required: string;
  invalidEmail: string;
};

type ContactValidationResult =
  | { ok: true; value: ContactPayload; }
  | { ok: false; errors: Partial<Record<keyof ContactPayload, string>>; };
```

---

### validateContactPayload

Validates a contact form payload.

**Signature:**
```typescript
function validateContactPayload(
  payload: ContactPayload,
  messages?: ContactValidationMessages
): ContactValidationResult
```

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `payload` | `ContactPayload` | - | Form data to validate |
| `messages` | `ContactValidationMessages` | `{ required: 'required', invalidEmail: 'invalid email' }` | Custom error messages |

**Return Type:** `ContactValidationResult`

**Usage Example:**
```typescript
const result = validateContactPayload({
  name: 'John',
  email: 'john@example.com',
  message: 'Hello!'
});

if (result.ok) {
  console.log('Valid:', result.value);
} else {
  console.log('Errors:', result.errors);
}
```

---

### submitContactPayload

Submits contact form payload to an endpoint.

**Signature:**
```typescript
async function submitContactPayload(
  endpoint: string,
  payload: ContactPayload,
  fetchFn?: typeof fetch
): Promise<void>
```

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | `string` | - | Submission endpoint URL |
| `payload` | `ContactPayload` | - | Validated form data |
| `fetchFn` | `typeof fetch` | `fetch` | Optional custom fetch function |

**Return Type:** `Promise<void>`

**Throws:** `Error` if submission fails

**Usage Example:**
```typescript
try {
  await submitContactPayload('/api/contact', {
    name: 'John',
    email: 'john@example.com',
    message: 'Hello!'
  });
  console.log('Message sent!');
} catch (e) {
  console.error('Failed to send');
}
```

**Notes:**
- Uses FormData for request body
- Handles both server-side and client-side URLs
- Returns void on success, throws on failure