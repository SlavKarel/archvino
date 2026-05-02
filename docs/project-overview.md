# Project Overview

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Key Concepts](#key-concepts)
- [Getting Started](#getting-started)

---

## Introduction

**archvino** is an architect portfolio website built with Astro. It serves as a personal portfolio platform for showcasing architectural projects with a modern, performant, and easy-to-manage approach.

The project combines static site generation for optimal performance with a Git-backed CMS (Decap CMS) for content management, making it easy for the architect to update project information without requiring technical expertise.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | v6.2.1 | Static site framework |
| **TypeScript** | — | Type-safe JavaScript |
| **Vitest** | — | Unit testing |
| **Playwright** | — | End-to-end testing |
| **Decap CMS** | — | Git-backed CMS for content editing |
| **Sharp** | — | Image processing |
| **CSS** | — | Styling with custom properties |

### Why These Technologies?

**Astro** provides excellent performance by shipping zero JavaScript by default. It uses a component-based architecture that supports multiple frameworks while generating static HTML for optimal loading times.

**Decap CMS** provides a Git-backed editing flow. Content stays in YAML files and assets in the repository, which keeps version control and avoids a separate database.

**Sharp** handles image optimization automatically, ensuring portfolio images are served in optimal formats and sizes.

---

## Directory Structure

```
archvino/
├── src/
│   ├── components/     # Reusable Astro components
│   ├── content/        # Content collections and YAML data
│   ├── layouts/        # Page layout templates
│   ├── lib/            # Utility functions and helpers
│   ├── pages/          # Astro file-based routing
│   ├── scripts/        # Client-side JavaScript
│   └── styles/         # Global CSS styles
├── public/             # Static assets (favicon, images, fonts)
├── ops/                # Operations configuration (oauth-proxy)
├── tests/              # Test fixtures and configurations
├── docs/               # Project documentation
├── astro.config.mjs    # Astro framework configuration
├── keystatic.config.ts # Lightweight editor metadata used by tests
├── vitest.config.ts    # Vitest unit testing configuration
├── playwright.config.ts # Playwright e2e testing configuration
└── package.json        # Project dependencies
```

---

## Key Concepts

### Astro Components

Astro components (`.astro` files) are the building blocks of pages. They combine HTML-like template syntax with JavaScript/TypeScript for dynamic functionality.

```astro
---
// Component script (runs at build time)
const title = "My Project";
---
<!-- Template -->
<h1>{title}</h1>
<p>This is an Astro component</p>
```

Components are located in `src/components/` and include:
- **UI components**: Reusable interface elements
- **Layout components**: Page wrapper templates
- **Project components**: Portfolio-specific elements

### Content Collections

Decap CMS edits the YAML content under `src/content/` and assets referenced by the site.

Content is stored in `src/content/` as Markdown or JSON files. Collections provide:
- Type-safe content schemas
- Automatic validation
- Easy content management via `/admin` panel

### Layouts

Layouts in `src/layouts/` provide the HTML shell for pages. They typically include:
- `<head>` meta tags
- Navigation
- Footer
- Global styles

### File-Based Routing

Astro uses file-based routing in `src/pages/`. Each `.astro` file becomes a route:

| File | Route |
|------|-------|
| `src/pages/index.astro` | `/` |
| `src/pages/projects.astro` | `/projects` |
| `src/pages/about.astro` | `/about` |

### Internationalization (i18n)

The project supports multiple languages through Astro's i18n routing. Language-specific content is organized in content collections with locale prefixes.

---

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build:prod

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run all tests
npm run test:all
```

### Content Management

Access the admin panel at `/admin` to manage content. Decap CMS provides a visual interface for:
- Creating and editing projects
- Managing portfolio items
- Updating site content

---

## Project Features

- **Project Gallery**: Filterable portfolio showcase
- **Multi-language Support**: i18n for international audiences
- **Contact Form**: Static form with backend integration
- **Admin Panel**: Decap CMS at `/admin`
- **Image Optimization**: Automatic processing via Sharp
- **Type Safety**: Full TypeScript support throughout

---

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
