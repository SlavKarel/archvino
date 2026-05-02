# Agent Documentation

This document provides guidance for agents working on the archvino project.

## Project Overview

archvino is an Astro-based architect portfolio website. It features project galleries, multi-language support, a contact form, and Decap CMS for content management.

## Available Documentation

- [Project Overview](docs/project-overview.md) - Tech stack, directory structure, key concepts
- [Development](docs/development.md) - Local setup, npm commands, content management
- [Content Management](docs/content-management.md) - Decap CMS, content types, admin panel
- [Deployment](docs/deployment.md) - Build process, production deployment, oauth-proxy
- [Testing](docs/testing.md) - Unit tests (Vitest), e2e tests (Playwright)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start CMS locally
npm run cms:proxy

# Build for production
npm run build:prod

# Run tests
npm run test:unit
npm run test:e2e
```

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/` | Source code (components, pages, layouts, styles) |
| `src/content/` | Content collections (projects, pages, taxonomy) |
| `public/` | Static assets |
| `ops/` | Operations (oauth-proxy for admin) |
| `tests/` | Test fixtures |

## Common Tasks

### Adding a New Project
1. Add project YAML file in `src/content/projects/`
2. Add images to `src/assets/projects/`
3. Update project categories if needed in `src/content/taxonomy/`

### Adding a New Page
1. Add page YAML file in `src/content/pages/`
2. Create or update Astro component if custom layout needed

### Modifying Styles
- Global styles: `src/styles/`
- Component-specific styles are in component files

## Tech Stack

- **Framework**: Astro 6.2.1
- **Language**: TypeScript
- **Testing**: Vitest (unit), Playwright (e2e)
- **CMS**: Decap CMS

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [Playwright Documentation](https://playwright.dev)
