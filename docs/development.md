# Development Guide

This guide covers everything you need to know to develop, build, and maintain the archvino portfolio website.

## Prerequisites

- Node.js (LTS version)
- npm

## Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:4321 in your browser.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the site for development |
| `npm run preview` | Preview the built site locally |
| `npm run check` | Run Astro type checking |
| `npm run cms:proxy` | Start Keystatic CMS on port 8081 |
| `npm run build:prod` | Build for production (uses production CMS config) |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:e2e` | Run end-to-end tests with Playwright |

## Running the CMS Locally

Keystatic CMS provides a web interface for managing content.

1. Start the CMS proxy:
   ```bash
   npm run cms:proxy
   ```

2. Open http://localhost:8081 in your browser.

The CMS allows you to edit:
- **Projects** - Portfolio items
- **Pages** - About, Services, Contact, Home pages
- **Taxonomy** - Project categories
- **Settings** - Site settings

## Working with Content

Content is stored as YAML files in `src/content/`.

### Projects

Location: `src/content/projects/*.yaml`

Example project file:
```yaml
title: "Project Name"
slug: "project-slug"
description: "Project description"
category: "residential"
featured: true
year: 2024
images:
  - /images/projects/project-slug/main.jpg
  - /images/projects/project-slug/detail.jpg
```

### Pages

Location: `src/content/pages/*.yaml`

Available pages:
- `home.yaml`
- `about.yaml`
- `services.yaml`
- `contact.yaml`

### Categories

Location: `src/content/taxonomy/*.yaml`

### Site Settings

Location: `src/content/settings/*.yaml`

## Type Checking and Validation

Run type checking to validate TypeScript and Astro files:

```bash
npm run check
```

This command runs `astro check` which validates:
- TypeScript types
- Astro component syntax
- Prop types

## Environment Variables

### SITE

Override the site domain for local development or build:

```bash
SITE=http://localhost:4321 npm run dev
```

This is useful when testing URL-dependent features like canonical URLs or sitemap generation.

## Building for Production

To create a production build:

```bash
npm run build:prod
```

This command:
1. Copies the production CMS config (`public/admin/config.production.yml` → `public/admin/config.yml`)
2. Runs `astro build`

## Testing

### Unit Tests

```bash
npm run test:unit
```

### End-to-End Tests

```bash
npm run test:e2e
```

## Project Structure

```
archvino/
├── src/
│   ├── content/
│   │   ├── projects/     # Portfolio items (YAML)
│   │   ├── pages/        # Site pages (YAML)
│   │   ├── taxonomy/     # Categories (YAML)
│   │   └── settings/     # Site settings (YAML)
│   ├── components/       # Astro components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Astro pages
│   └── styles/           # CSS styles
├── public/
│   └── admin/            # Keystatic CMS configuration
└── docs/                 # Documentation
```