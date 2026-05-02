# SEO Implementation

This document describes how SEO is implemented in the archvino project.

## Overview

SEO in this project is handled through a combination of:
- `SeoHead` component for rendering meta tags
- `src/lib/seo.ts` utility functions for building SEO data
- Site settings in `src/content/settings/site.yaml` for default values

---

## 1. SeoHead Component

**Location:** `src/components/site/SeoHead.astro`

The `SeoHead` component renders all meta tags for a page.

### Props

```typescript
type Props = {
  title: string;
  description: string;
  image?: string;
};
```

### Implemented Tags

| Tag | Attributes |
|-----|------------|
| `<title>` | Page title |
| `<meta name="description">` | Meta description |
| `<meta property="og:title">` | Open Graph title |
| `<meta property="og:description">` | Open Graph description |
| `<meta property="og:image">` | Open Graph image (if provided) |
| `<meta name="twitter:title">` | Twitter Card title |
| `<meta name="twitter:description">` | Twitter Card description |
| `<meta name="twitter:card">` | Twitter Card type (`summary_large_image` if image exists, else `summary`) |
| `<meta name="twitter:image">` | Twitter Card image (if provided) |

### Image Handling

Images are normalized to absolute URLs:

```typescript
const imageBaseUrl = image?.startsWith('/@fs/') ? Astro.url : Astro.site ?? Astro.url;
const normalizedImage = image ? new URL(image, imageBaseUrl).toString() : undefined;
```

---

## 2. SEO Utility Functions

**Location:** `src/lib/seo.ts`

### buildDefaultSeo(locale)

Returns default SEO data from site settings.

```typescript
export async function buildDefaultSeo(locale: Locale) {
  const [settings, defaults] = await Promise.all([getSiteSettings(), getDefaultSeo(locale)]);
  const image = await getDefaultSeoImage(locale, settings.logo.src);

  return {
    title: defaults.title,
    description: defaults.description,
    image,
  };
}
```

### buildSeo(locale, input)

Returns SEO data with optional overrides. Falls back to defaults for any missing fields.

```typescript
export async function buildSeo(locale: Locale, input: SeoInput = {}) {
  const defaults = await buildDefaultSeo(locale);

  return {
    title: input.title || defaults.title,
    description: input.description || defaults.description,
    image: input.image || defaults.image,
  };
}

// Input type
type SeoInput = {
  title?: string;
  description?: string;
  image?: string;
};
```

### buildProjectSeo(locale, input)

Builds SEO specifically for project pages with project details in the description.

```typescript
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

// Input type
type ProjectSeoInput = {
  title: string;
  summary: string;
  location: string;
  year: number;
  status: string;
  image?: string;
};
```

### localizeSeoField(value, locale)

Extracts localized string from a localized field.

```typescript
export function localizeSeoField(value: LocalizedString, locale: Locale): string {
  return getLocalizedValue(value, locale);
}
```

---

## 3. SEO Data Sources

### Site Settings

Default SEO values come from `src/content/settings/site.yaml`:

```yaml
defaultSeo:
  title:
    ru: Archvino | Архитектурное портфолио
    en: Archvino | Architecture Portfolio
  description:
    ru: Билингвальное портфолио архитектора с частными и общественными проектами.
    en: Bilingual architect portfolio with residential and public projects.
```

### Data Access Functions

From `src/lib/content.ts`:

```typescript
// Get site settings (including defaultSeo)
export async function getSiteSettings(): Promise<SiteSettings>

// Get default SEO for a locale
export async function getDefaultSeo(locale: Locale) {
  const settings = await getSiteSettings();
  return {
    title: getLocalizedValue(settings.defaultSeo.title, locale),
    description: getLocalizedValue(settings.defaultSeo.description, locale),
  };
}
```

---

## 4. Default SEO Image

The default OG image is determined dynamically:

```typescript
async function getDefaultSeoImage(locale: Locale, logoSource: string): Promise<string> {
  const resolvedLogo = resolveAssetPath(logoSource);

  // SVG logos are not suitable for OG images
  if (!logoSource.toLowerCase().endsWith('.svg')) {
    return resolvedLogo;
  }

  // Fall back to the featured project's cover image
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
```

**Logic:**
1. If logo is not SVG (e.g., PNG), use the logo as OG image
2. If logo is SVG, use the first featured project's cover image
3. Fall back to logo if no featured project exists

---

## 5. Integration with Layouts

### BaseLayout

The `BaseLayout` receives SEO props and passes them to `SeoHead`:

```astro
---
// src/layouts/BaseLayout.astro
import SeoHead from '../components/site/SeoHead.astro';

type Props = {
  locale: Locale;
  title: string;
  description: string;
  image?: string;
};

const { locale, title, description, image } = Astro.props;
---

<!doctype html>
<html lang={locale}>
  <head>
    <SeoHead title={title} description={description} image={image} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Page Usage Example

```astro
---
// src/pages/[locale]/index.astro
import { buildSeo } from '../../lib/seo';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() { /* ... */ }

const { locale } = Astro.params;
const seo = await buildSeo(locale);
---

<BaseLayout {...seo} locale={locale}>
  <!-- Page content -->
</BaseLayout>
```

---

## 6. Schema Summary

| Field | Source | Type |
|-------|--------|------|
| `title` | `buildSeo()` / `buildProjectSeo()` | string |
| `description` | `buildSeo()` / `buildProjectSeo()` | string |
| `image` | `getDefaultSeoImage()` or override | string (URL) |
| `locale` | Page params | `Locale` (en/ru) |

The SEO system is fully integrated with the i18n system, supporting bilingual content (Russian and English).