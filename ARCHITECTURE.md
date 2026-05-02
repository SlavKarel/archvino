# Architecture Documentation

This document provides a detailed architectural overview of the archvino project.

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Core Concepts](#core-concepts)
5. [Content System](#content-system)
6. [Component Architecture](#component-architecture)
7. [Routing and i18n](#routing-and-i18n)
8. [Styling System](#styling-system)
9. [Data Flow](#data-flow)
10. [Build and Deployment](#build-and-deployment)

---

## High-Level Architecture

archvino is a **static site generator (SSG)** built with Astro that generates a multi-language architect portfolio website. The architecture follows a layered pattern:

```
┌─────────────────────────────────────────────────────────┐
│                    Pages (src/pages/)                    │
│           File-based routing with [locale]              │
├─────────────────────────────────────────────────────────┤
│                Layouts (src/layouts/)                    │
│        BaseLayout → PageLayout / ProjectLayout          │
├─────────────────────────────────────────────────────────┤
│            Components (src/components/)                  │
│    Header, Footer, Nav, ProjectGrid, ContactForm...     │
├─────────────────────────────────────────────────────────┤
│              Lib Utilities (src/lib/)                    │
│      i18n, content, projects, seo, routes, assets       │
├─────────────────────────────────────────────────────────┤
│         Content Collections (src/content/)               │
│         Settings, Pages, Projects, Taxonomy             │
├─────────────────────────────────────────────────────────┤
│            Decap CMS (public/admin/)                    │
│        Git-backed admin UI and content commits          │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Astro | 6.2.1 | Static site generation |
| Language | TypeScript | 5.9.3 | Type safety |
| CMS | Decap CMS | Latest | Content management |
| Styling | CSS | - | Custom properties design system |
| Testing | Vitest | 4.1.5 | Unit tests |
| E2E Testing | Playwright | 1.59.1 | End-to-end tests |
| Images | Sharp | 0.34.5 | Image optimization |

---

## Directory Structure

```
/Users/gsenkevich/Personal/archvino/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── site/             # Site-wide components
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Nav.astro
│   │   │   ├── LocaleSwitcher.astro
│   │   │   └── SeoHead.astro
│   │   ├── sections/         # Section components
│   │   │   ├── HomeIntro.astro
│   │   │   ├── AboutPreview.astro
│   │   │   ├── ServicesPreview.astro
│   │   │   └── ContactCta.astro
│   │   ├── projects/         # Project-related components
│   │   │   ├── ProjectCard.astro
│   │   │   ├── ProjectGrid.astro
│   │   │   ├── ProjectGallery.astro
│   │   │   ├── ProjectFilters.astro
│   │   │   ├── ProjectFacts.astro
│   │   │   └── ProjectSections.astro
│   │   └── contact/          # Contact form components
│   │       └── ContactForm.astro
│   ├── content/              # Content collections (YAML)
│   │   ├── settings/         # Site settings
│   │   │   └── site.yaml
│   │   ├── pages/            # Static pages content
│   │   │   ├── home.yaml
│   │   │   ├── about.yaml
│   │   │   ├── services.yaml
│   │   │   └── contact.yaml
│   │   ├── projects/         # Portfolio projects
│   │   │   ├── villa-moscow.yaml
│   │   │   ├── gallery-house.yaml
│   │   │   └── studio-loft.yaml
│   │   └── taxonomy/         # Category definitions
│   │       └── project-categories.yaml
│   ├── layouts/              # Page layouts
│   │   ├── BaseLayout.astro      # Root HTML wrapper
│   │   ├── PageLayout.astro      # Standard pages
│   │   └── ProjectLayout.astro   # Project detail pages
│   ├── lib/                  # Core utilities
│   │   ├── i18n.ts           # Internationalization
│   │   ├── content.ts        # Page content fetching
│   │   ├── projects.ts       # Project content fetching
│   │   ├── seo.ts            # SEO metadata building
│   │   ├── routes.ts         # URL building utilities
│   │   ├── assets.ts         # Asset path resolution
│   │   └── contact.ts        # Contact form handling
│   ├── pages/                # Astro pages (routing)
│   │   ├── index.astro           # Root redirect
│   │   └── [locale]/             # Dynamic locale routes
│   │       ├── index.astro       # Homepage
│   │       ├── about.astro       # About page
│   │       ├── contact.astro     # Contact page
│   │       ├── services.astro    # Services page
│   │       └── projects/
│   │           ├── index.astro   # Projects listing
│   │           └── [slug].astro  # Project detail
│   ├── scripts/              # Client-side scripts
│   │   ├── motion.ts
│   │   └── project-filters.ts
│   └── styles/               # CSS design system
│       ├── tokens.css        # Design tokens
│       ├── global.css        # Global styles
│       ├── layout.css        # Layout utilities
│       ├── components.css    # Component styles
│       └── motion.css        # Animations
├── public/                   # Static assets
│   └── admin/                # Decap CMS admin panel
├── ops/                      # Operations
│   └── oauth-proxy/          # Admin panel protection
├── tests/                    # Test fixtures
├── docs/                     # Documentation
├── astro.config.mjs          # Astro configuration
├── keystatic.config.ts       # Lightweight editor metadata used by tests
├── vitest.config.ts          # Vitest config
└── playwright.config.ts      # Playwright config
```

---

## Core Concepts

### 1. Astro Content Collections

The project uses **Astro Content Collections** (`src/content.config.ts`) to define type-safe content schemas:

```typescript
// src/content.config.ts
const collections = {
  settings: defineCollection({ schema: ... }),
  pages: defineCollection({ schema: ... }),
  projects: defineCollection({ schema: ... }),
  taxonomy: defineCollection({ schema: ... }),
};
```

### 2. Bilingual Support (i18n)

All text content supports Russian (`ru`) and English (`en`) through a `LocalizedString` type:

```typescript
type LocalizedString = Record<Locale, string>;
// Example: { ru: "Главная", en: "Home" }
```

### 3. Static Site Generation (SSG)

All pages are pre-rendered at build time using `getStaticPaths()`:

```typescript
export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}
```

### 4. File-Based Routing

Astro's directory-based routing creates routes from file paths:
- `src/pages/[locale]/index.astro` → `/ru/`, `/en/`
- `src/pages/[locale]/projects/[slug].astro` → `/ru/projects/villa-moscow`

---

## Content System

### Content Collections

| Collection | Source File | Purpose |
|------------|-------------|---------|
| `settings` | `src/content/settings/site.yaml` | Site configuration |
| `pages` | `src/content/pages/*.yaml` | Page content |
| `projects` | `src/content/projects/*.yaml` | Portfolio items |
| `taxonomy` | `src/content/taxonomy/*.yaml` | Categories |

### Data Fetching Pattern

```typescript
// lib/content.ts
import { getCollection } from 'astro:content';

async function getSiteSettings() {
  const settings = await getCollection('settings');
  return settings[0].data;
}
```

---

## Component Architecture

### Layout Hierarchy

```
BaseLayout (root)
├── <html lang={locale}>
├── <SeoHead />
├── <Header />
│   ├── Nav
│   └── LocaleSwitcher
├── <main>{children}</main>
└── <Footer />

PageLayout (extends BaseLayout)
├── BaseLayout
├── .shell container
└── page-specific content

ProjectLayout (extends BaseLayout)
├── BaseLayout
├── hero section (image + info)
└── <slot /> for sections
```

### Component Categories

| Category | Components | Purpose |
|----------|------------|---------|
| **Site** | Header, Footer, Nav, LocaleSwitcher, SeoHead | Shell elements |
| **Sections** | HomeIntro, AboutPreview, ServicesPreview, ContactCta | Page sections |
| **Projects** | ProjectCard, ProjectGrid, ProjectGallery, ProjectFilters | Portfolio display |
| **Contact** | ContactForm | Form handling |

### Props Interface Pattern

```typescript
type Props = {
  locale: Locale;
  pathname: string;
  settings: SiteSettings;
  title: string;
  description: string;
  image?: string;
};
```

---

## Routing and i18n

### Locale System

```typescript
// src/lib/i18n.ts
const LOCALES = ['ru', 'en'] as const;
type Locale = 'ru' | 'en';
const DEFAULT_LOCALE: Locale = 'ru';
```

### Route Generation

```typescript
// src/lib/routes.ts
function buildLocalePath(locale: Locale, pathname?: string): string {
  return pathname ? `/${locale}${pathname}` : `/${locale}/`;
}

function buildLocaleSwitchPath(currentPath: string, targetLocale: Locale): string {
  // Removes source locale, adds target locale
}
```

### URL Patterns

| Page | URL Pattern | Example |
|------|-------------|---------|
| Home | `/{locale}/` | `/ru/`, `/en/` |
| About | `/{locale}/about` | `/ru/about` |
| Projects | `/{locale}/projects` | `/ru/projects` |
| Project Detail | `/{locale}/projects/{slug}` | `/ru/projects/villa-moscow` |

---

## Styling System

### Design Tokens (tokens.css)

```css
:root {
  /* Colors */
  --color-bg: #f6f3ee;
  --color-text: #20201b;
  --color-muted: #666358;
  --color-line: rgba(32, 32, 27, 0.14);

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;

  /* Typography */
  --font-sans: system-ui, sans-serif;

  /* Layout */
  --width-shell: 72rem;
  --radius-card: 1rem;

  /* Motion */
  --duration-base: 180ms;
  --ease-base: ease;
}
```

### CSS Architecture

```
global.css (entry point)
  ├── tokens.css     → Design tokens
  ├── layout.css     → Layout utilities (.shell, .site-frame)
  ├── components.css → Component styles
  └── motion.css     → Animations + reduced-motion support
```

### BEM-Inspired Naming

```css
.site-header { }
.site-header__inner { }
.site-header__brand { }
.site-header__controls { }
```

### Accessibility

- Respects `prefers-reduced-motion` media query
- Uses `data-motion` attribute for manual control
- ARIA attributes (`aria-pressed`, `aria-current`)

---

## Data Flow

### Page Rendering Flow

```
1. Request → getStaticPaths()
                    ↓
2. Fetch Content → Promise.all([
                      getSiteSettings(),
                      getProjects(locale),
                      getProjectCategories(locale),
                      buildSeo(locale)
                    ])
                    ↓
3. Select Locale → getLocalizedValue(value, locale)
                    ↓
4. Render Layout → <PageLayout locale={locale}>
                      <Component />
                    </PageLayout>
                    ↓
5. Output → Static HTML
```

### Content Processing Pipeline

```
YAML File (src/content/projects/*.yaml)
         ↓
Astro Content Collection (getCollection('projects'))
         ↓
TypeScript Types (ProjectData → LocalizedProject)
         ↓
Template Rendering ({project.title})
         ↓
Static HTML
```

---

## Build and Deployment

### Build Commands

```bash
# Development build
npm run build              # Standard build

# Production build
npm run build:prod         # Builds and injects the production CMS config into dist/admin/config.yml

# Preview build
npm run preview            # Preview production build
```

### Build Output

The `dist/` directory contains:
- Static HTML files
- Optimized images
- CSS bundles
- Client-side scripts

### Deployment

The site is deployed on a VPS and served by nginx from the generated `dist/` directory.

---

## Configuration Files

### astro.config.mjs

```javascript
export default defineConfig({
  site: process.env.SITE || 'https://archvino.ru',
  redirects: {
    '/admin': '/admin/index.html',
    '/keystatic': '/admin/index.html', // legacy alias to the Decap admin entry
  },
});
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SITE` | `https://archvino.ru` | Override site URL for local testing |

---

## Testing Strategy

### Unit Tests (Vitest)

```bash
npm run test:unit
```

Tests utilities, validation logic, and helper functions.

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

Tests full page flows, navigation, and interactions.

---

## Security

### Admin Panel Protection

The `/admin` route is protected via `ops/oauth-proxy/`:
- GitHub OAuth authentication
- Session-based authorization
- Nginx configuration for auth gate

---

## Summary

The archvino architecture follows these principles:

1. **Static First** - All pages pre-rendered at build time for performance
2. **Type Safety** - Full TypeScript with Astro content collection schemas
3. **Bilingual** - Built-in support for Russian and English
4. **Modular** - Clear separation between layouts, components, and utilities
5. **Maintainable** - Design tokens, consistent patterns, comprehensive docs
6. **Accessible** - Reduced motion support, ARIA attributes, semantic HTML
