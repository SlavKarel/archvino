# Content Management with Decap CMS

This document describes how to manage content on the archvino website using Decap CMS, a Git-backed CMS.

## Overview

Decap CMS stores content as YAML files directly in the Git repository. This approach provides:

- **Version control**: All content changes are tracked in Git
- **Editorial workflow**: Production edits can commit directly to `master`
- **Local development**: Edit content locally with the dev server
- **No database**: Content lives alongside code in the repository

## Accessing the Admin Panel

The admin panel is available at two URLs:

| URL | Description |
|-----|-------------|
| `/admin` | Primary admin URL (redirects to index.html) |
| `/keystatic` | Legacy alias that redirects to `/admin/index.html` |

### Running Locally

To access the CMS locally:

```bash
npm run cms:proxy
```

This starts the CMS on port 8081 with local file storage. Access it at `http://localhost:8081/admin`.

### Production Access

In production, the CMS uses the GitHub backend behind the OAuth proxy. Access the admin panel at your deployed URL (for example `https://archvino.ru/admin`).

## Content Collections

### Projects

Projects are stored in `src/content/projects/*.yaml`.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `slug` | Text | URL-friendly identifier |
| `title` | Text | Project title |
| `location` | Text | Project location |
| `year` | Number | Year of completion |
| `category` | Reference | Links to project-categories taxonomy |
| `cover` | Image | Cover image for project listing |
| `gallery` | Images | Array of gallery images |
| `facts` | Array | Key facts about the project |
| `sections` | Array | Content sections with title and content |

**Example structure:**

```yaml
slug: my-project
title: My Project
location: Moscow, Russia
year: 2024
category: residential
cover: /images/projects/my-project/cover.jpg
gallery:
  - /images/projects/my-project/gallery/1.jpg
  - /images/projects/my-project/gallery/2.jpg
facts:
  - label: Area
    value: "500 m²"
  - label: Status
    value: Completed
sections:
  - title: Concept
    content: |
      Project description goes here...
```

### Pages

Pages are stored in `src/content/pages/*.yaml`.

**Available pages:**

- `home.yaml` - Homepage content
- `about.yaml` - About page content
- `services.yaml` - Services page content
- `contact.yaml` - Contact page content

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `slug` | Text | Page URL slug |
| `title` | Text | Page title |
| `sections` | Array | Page content sections |

### Taxonomy

Taxonomies provide controlled vocabularles for content.

**Project Categories** (`src/content/taxonomy/project-categories.yaml`):

```yaml
- id: residential
  name: Residential
  description: Residential projects
- id: commercial
  name: Commercial
  description: Commercial projects
- id: public
  name: Public
  description: Public buildings
```

### Site Settings

Site-wide settings stored in `src/content/settings/site.yaml`:

```yaml
siteName: Archvino
tagline: Architecture & Design
contact:
  email: info@archvino.com
  phone: "+7 (495) 123-45-67"
  address: Moscow, Russia
social:
  instagram: "@archvino"
  telegram: "@archvino"
```

## Development vs Production

### Development Mode

When running `npm run cms:proxy`:

- Uses local file storage
- Changes saved directly to filesystem
- No Git operations
- Fast and simple for development

### Production Mode

In production (`npm run build:prod` writes `config.production.yml` into `dist/admin/config.yml`):

- Uses the GitHub API for content storage
- Sends editors through the OAuth proxy at `/auth`
- Commits changes directly to the `master` branch
- Requires a rebuild/deploy on the VPS to publish the updated static files

**Production configuration (`public/admin/config.production.yml`):**

```yaml
backend:
  name: github
  repo: gavril-s/archvino
  branch: master

auth_endpoint: https://archvino.ru/auth
```

## Editing Content Workflow

### Local Development

1. Start the CMS proxy:
   ```bash
   npm run cms:proxy
   ```

2. Open `http://localhost:8081/admin` in your browser

3. Navigate to the content collection you want to edit

4. Make changes and save

5. Changes are saved directly to YAML files in `src/content/`

6. Review changes with `git diff`

7. Commit and push changes

### Production Editing

1. Open admin panel at your production URL

2. Make content changes through the CMS

3. Decap commits changes to the GitHub repository

4. The change lands on `master`

5. Rebuild and redeploy the site from the VPS with `npm run build:prod`

## Image Handling

### Image Storage

Images are stored in the `public/images/` directory:

```
public/images/
├── projects/
│   └── [project-slug]/
│       ├── cover.jpg
│       └── gallery/
│           ├── 1.jpg
│           └── 2.jpg
└── pages/
    └── [page-slug]/
        └── hero.jpg
```

### Using Images in Content

When adding images in Decap CMS:

1. **Cover images**: Select from `public/images/projects/[slug]/`
2. **Gallery images**: Add multiple images from the gallery folder
3. **Page images**: Select from `public/images/pages/`

### Image Requirements

- Use optimized formats (JPEG, WebP, PNG)
- Compress images before uploading
- Maintain consistent aspect ratios for galleries

## Configuration Files

### Main Configuration

**File**: `public/admin/config.yml`

Decap CMS configuration used for local development:

```yaml
backend:
  name: git-gateway

local_backend: true
```

### Production Configuration

**File**: `public/admin/config.production.yml`

Production-specific overrides:

```yaml
backend:
  name: github
  repo: gavril-s/archvino
  branch: master

auth_endpoint: https://archvino.ru/auth
```

### How Configuration Works

1. Decap loads `/admin/config.yml` in the admin UI
2. Local development serves `public/admin/config.yml`
3. `npm run build:prod` writes the production config to `dist/admin/config.yml`
4. The production build switches the backend to GitHub and keeps auth behind the OAuth proxy

## Best Practices

### Content Editing

- Use descriptive slugs (e.g., `my-project` not `mp`)
- Keep titles concise but meaningful
- Add factual information in the `facts` array
- Break long content into multiple sections

### Images

- Name files descriptively (e.g., `living-room-view.jpg`)
- Keep gallery images consistent in style and quality
- Update cover images when projects are updated

### Workflow

1. Use the CMS to make edits
2. Review the commit on `master`
3. Rebuild and redeploy the VPS with `npm run build:prod`

## Troubleshooting

### CMS not loading

- Ensure `npm run cms:proxy` is running
- Check if port 8081 is available
- Verify `config.yml` exists in `public/admin/`

### Images not displaying

- Check image path is correct in YAML
- Verify file exists in `public/images/`
- Ensure image is committed to Git

### GitHub sync issues

- Verify `GITHUB_TOKEN` is set in production
- Check repo permissions for the token
- Ensure base branch name is correct
