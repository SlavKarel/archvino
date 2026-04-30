# Architect Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual minimal architect portfolio website in Astro with smooth restrained motion, easy project editing, a filterable project archive, and a Git-backed visual CMS.

**Architecture:** Build a static-first Astro site with locale-prefixed routes (`/ru` and `/en`), structured YAML content files, shared rendering helpers, and only small client-side scripts for filtering and motion. Default CMS is Keystatic with the same content paths used by the public site; if Keystatic blocks implementation, switch to Decap without changing the public page architecture.

**Tech Stack:** Astro, TypeScript, Astro Content Collections, YAML content files, CSS tokens, Keystatic, Vitest, Playwright.

---

## Inputs

- Spec: `docs/superpowers/specs/2026-04-30-architect-portfolio-design.md`
- Task brief: `TASK.md`
- Current repo state: empty application repo with only planning artifacts

## Global Execution Protocol

Use this protocol for every task below.

- Implementation subagent: receive only the current task section, modify only the listed files, stop after running the listed checks.
- Review subagent: inspect only the current task changes, compare them against the spec and current task, call out regressions or scope creep before the next task starts.
- Verification rule: after each task, confirm both of these before moving on:
  - the site runs locally
  - the changed page looks correct on desktop and mobile
- Visual rule: capture at least one desktop view and one mobile view during each UI-facing task.
- Commit rule: create one commit per task after review passes.
- Deviation rule: if Keystatic integration or contact delivery blocks progress for more than 45 minutes, use the fallback defined in the relevant task and document the deviation in the commit message and review handoff.

### Standard Subagent Prompts

Implementation subagent prompt template:

```text
Implement only Task N from PLAN.md in /Users/gsenkevich/Personal/archvino.
Respect the listed files, steps, and verification commands.
Do not continue to the next task.
Stop after the required checks pass and summarize changed files, commands run, and any open risks.
```

Review subagent prompt template:

```text
Review only Task N changes in /Users/gsenkevich/Personal/archvino.
Use PLAN.md Task N and docs/superpowers/specs/2026-04-30-architect-portfolio-design.md as the source of truth.
Check for correctness, regressions, scope creep, missing verification, and whether the current UI still matches the minimal architect-portfolio direction.
Return blocking issues first, then brief advisory notes.
```

## Target File Structure

### Root And Tooling

- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `playwright.config.ts`
- `vitest.config.ts`
- `.gitignore`
- `src/env.d.ts`

### Content And CMS

- `keystatic.config.ts`
- `src/content.config.ts`
- `src/content/settings/site.yaml`
- `src/content/pages/home.yaml`
- `src/content/pages/about.yaml`
- `src/content/pages/services.yaml`
- `src/content/pages/contact.yaml`
- `src/content/taxonomy/project-categories.yaml`
- `src/content/projects/villa-moscow.yaml`
- `src/content/projects/gallery-house.yaml`
- `src/content/projects/studio-loft.yaml`

### Shared Helpers

- `src/lib/i18n.ts`
- `src/lib/routes.ts`
- `src/lib/content.ts`
- `src/lib/projects.ts`
- `src/lib/seo.ts`
- `src/lib/contact.ts`

### Layouts And Components

- `src/layouts/BaseLayout.astro`
- `src/layouts/PageLayout.astro`
- `src/layouts/ProjectLayout.astro`
- `src/components/site/Header.astro`
- `src/components/site/Nav.astro`
- `src/components/site/Footer.astro`
- `src/components/site/LocaleSwitcher.astro`
- `src/components/site/SeoHead.astro`
- `src/components/site/ContactLinks.astro`
- `src/components/projects/ProjectGrid.astro`
- `src/components/projects/ProjectCard.astro`
- `src/components/projects/ProjectFilters.astro`
- `src/components/projects/ProjectFacts.astro`
- `src/components/projects/ProjectGallery.astro`
- `src/components/projects/ProjectSections.astro`
- `src/components/sections/HomeIntro.astro`
- `src/components/sections/ServicesPreview.astro`
- `src/components/sections/AboutPreview.astro`
- `src/components/sections/ContactCta.astro`
- `src/components/contact/ContactForm.astro`

### Routes

- `src/pages/index.astro`
- `src/pages/[locale]/index.astro`
- `src/pages/[locale]/about.astro`
- `src/pages/[locale]/services.astro`
- `src/pages/[locale]/contact.astro`
- `src/pages/[locale]/projects/[slug].astro`

### Client Scripts And Styles

- `src/scripts/project-filters.ts`
- `src/scripts/motion.ts`
- `src/styles/global.css`
- `src/styles/tokens.css`
- `src/styles/layout.css`
- `src/styles/components.css`
- `src/styles/motion.css`

### Tests

- `tests/unit/i18n.test.ts`
- `tests/unit/routes.test.ts`
- `tests/unit/content.test.ts`
- `tests/unit/projects.test.ts`
- `tests/unit/contact.test.ts`
- `tests/e2e/smoke.spec.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/home.spec.ts`
- `tests/e2e/projects.spec.ts`
- `tests/e2e/contact.spec.ts`

### Media Conventions

- Keep all seed imagery in `src/assets/` so Astro, the public site, and the CMS all reference committed local files.
- Use `src/assets/site/logo.svg` for the wordmark or placeholder mark.
- Use `src/assets/about/portrait.jpg` for the about page portrait.
- Use `src/assets/projects/<slug>/cover.jpg` for each project cover image.
- Use `src/assets/projects/<slug>/gallery-1.jpg`, `gallery-2.jpg`, and `gallery-3.jpg` for each sample project gallery.
- Add alt-text fields alongside every referenced image in the content files.
- Do not rely on remote placeholder URLs for the main layout, CMS, or visual verification tasks.

### CMS Fallback Files

- `public/admin/index.html`
- `public/admin/config.yml`

## Task 1: Bootstrap Astro Workspace And Test Harness

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`
- Create: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

Pass Task 1 and the global execution protocol.

- [ ] **Step 2: Create the initial failing smoke test**

```ts
import { test, expect } from '@playwright/test';

test('root redirects to the default locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/ru\/?$/);
});
```

- [ ] **Step 3: Install the minimum app and test dependencies**

Run: `npm install astro @astrojs/check sharp keystatic && npm install -D typescript @types/node vitest @playwright/test`

Expected: install completes without removing `docs/` or `TASK.md`

- [ ] **Step 4: Run the smoke test and confirm it fails**

Run: `npx playwright test tests/e2e/smoke.spec.ts`

Expected: FAIL because no runnable Astro page exists yet

- [ ] **Step 5: Create the minimal Astro shell and default locale redirect**

Implementation notes:
- `src/pages/index.astro` should redirect to `/ru/`
- `package.json` should expose `dev`, `build`, `preview`, `check`, `test:unit`, and `test:e2e`
- `.gitignore` should include `node_modules`, `.astro`, `dist`, `playwright-report`, `test-results`, and `.superpowers/`

- [ ] **Step 6: Re-run build and smoke checks**

Run: `npm run build && npx playwright test tests/e2e/smoke.spec.ts`

Expected: build passes and smoke test passes

- [ ] **Step 7: Start the site and verify the placeholder route visually**

Run: `npm run dev`

Manual check:
- open `http://localhost:4321/`
- confirm redirect to `/ru/`
- confirm the placeholder page loads on desktop and mobile widths without broken markup

- [ ] **Step 8: Dispatch the review subagent for Task 1**

Reviewer must confirm:
- the repo is bootstrapped cleanly
- scripts are present
- redirect behavior is correct
- no unnecessary packages or framework code were introduced

- [ ] **Step 9: Commit Task 1**

Run: `git add package.json astro.config.mjs tsconfig.json .gitignore src/env.d.ts src/pages/index.astro playwright.config.ts vitest.config.ts tests/e2e/smoke.spec.ts && git commit -m "feat: bootstrap astro portfolio workspace"`

## Task 2: Create The Bilingual Content Model And Shared Helpers

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/settings/site.yaml`
- Create: `src/content/pages/home.yaml`
- Create: `src/content/pages/about.yaml`
- Create: `src/content/pages/services.yaml`
- Create: `src/content/pages/contact.yaml`
- Create: `src/content/taxonomy/project-categories.yaml`
- Create: `src/content/projects/villa-moscow.yaml`
- Create: `src/content/projects/gallery-house.yaml`
- Create: `src/content/projects/studio-loft.yaml`
- Create: `src/lib/i18n.ts`
- Create: `src/lib/routes.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/projects.ts`
- Create: `src/lib/seo.ts`
- Create: `tests/unit/i18n.test.ts`
- Create: `tests/unit/routes.test.ts`
- Create: `tests/unit/content.test.ts`
- Create: `tests/unit/projects.test.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Write failing unit tests for locale and content behavior**

```ts
import { describe, expect, it } from 'vitest';
import { buildLocalePath, DEFAULT_LOCALE, LOCALES } from '../../src/lib/i18n';

describe('i18n helpers', () => {
  it('exposes ru and en locales', () => {
    expect(LOCALES).toEqual(['ru', 'en']);
    expect(DEFAULT_LOCALE).toBe('ru');
  });

  it('builds locale-prefixed paths', () => {
    expect(buildLocalePath('ru', '/about')).toBe('/ru/about');
    expect(buildLocalePath('en', '/projects/villa-moscow')).toBe('/en/projects/villa-moscow');
  });
});
```

```ts
import { describe, expect, it } from 'vitest';
import { sortProjects, filterProjectsByCategory } from '../../src/lib/projects';

describe('project helpers', () => {
  it('sorts featured projects before regular ones', () => {
    const projects = [
      { slug: 'a', featured: false, order: 2 },
      { slug: 'b', featured: true, order: 3 },
      { slug: 'c', featured: true, order: 1 },
    ];

    expect(sortProjects(projects).map((item) => item.slug)).toEqual(['c', 'b', 'a']);
  });

  it('filters by category without mutating the source array', () => {
    const projects = [
      { slug: 'a', category: 'residential' },
      { slug: 'b', category: 'interiors' },
    ];

    expect(filterProjectsByCategory(projects, 'interiors')).toEqual([{ slug: 'b', category: 'interiors' }]);
  });
});
```

- [ ] **Step 3: Run the unit tests and confirm they fail**

Run: `npm run test:unit -- tests/unit/i18n.test.ts tests/unit/routes.test.ts tests/unit/content.test.ts tests/unit/projects.test.ts`

Expected: FAIL because helpers and content collections do not exist yet

- [ ] **Step 4: Implement the shared content schema and helper layer**

Implementation requirements:
- use one shared slug per project for both locales
- define `src/content/settings/site.yaml` with navigation labels, footer text, locale labels, default SEO fields, contact details, social links, and logo or wordmark asset reference
- model localized strings as nested `ru` and `en` fields
- model project sections as a repeatable list of `label`, `heading`, and `body`
- include at least three sample projects so filters and detail pages can be verified
- model `src/content/pages/home.yaml` with an explicit editor-controlled `featuredProjectSlugs` list instead of deriving homepage selection only from project-level flags
- make `aboutPreview` and `servicesPreview` fields optional in `src/content/pages/home.yaml`; if an editor leaves them empty, derive concise fallback excerpts from the localized about and services page content
- include image alt-text fields for project cover images, project galleries, and the about portrait so accessibility data is available from the start
- keep the taxonomy list controlled in `src/content/taxonomy/project-categories.yaml`

- [ ] **Step 5: Re-run sync, type, and unit checks**

Run: `npx astro sync && npm run check && npm run test:unit -- tests/unit/i18n.test.ts tests/unit/routes.test.ts tests/unit/content.test.ts tests/unit/projects.test.ts`

Expected: all checks pass

- [ ] **Step 6: Verify the app still boots after schema creation**

Run: `npm run build`

Expected: PASS

- [ ] **Step 7: Start the site and visually confirm no route is broken**

Run: `npm run dev`

Manual check:
- open `http://localhost:4321/ru/`
- confirm the placeholder still loads after content wiring
- confirm there are no collection or schema runtime errors in the browser or terminal

- [ ] **Step 8: Dispatch the review subagent for Task 2**

Reviewer must confirm:
- locale strategy matches the spec
- shared bilingual content model is not duplicated per locale
- sample content is sufficient for UI development

- [ ] **Step 9: Commit Task 2**

Run: `git add src/content.config.ts src/content src/lib/i18n.ts src/lib/routes.ts src/lib/content.ts src/lib/projects.ts src/lib/seo.ts tests/unit/i18n.test.ts tests/unit/routes.test.ts tests/unit/content.test.ts tests/unit/projects.test.ts && git commit -m "feat: add bilingual content model"`

## Task 3: Build The Shared Shell And Design Foundation

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PageLayout.astro`
- Create: `src/components/site/Header.astro`
- Create: `src/components/site/Nav.astro`
- Create: `src/components/site/Footer.astro`
- Create: `src/components/site/LocaleSwitcher.astro`
- Create: `src/components/site/SeoHead.astro`
- Create: `src/styles/global.css`
- Create: `src/styles/tokens.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/components.css`
- Create: `src/styles/motion.css`
- Modify: `src/pages/index.astro`
- Create: `src/pages/[locale]/index.astro`
- Create: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Write the failing navigation and locale-switch smoke test**

```ts
import { test, expect } from '@playwright/test';

test('localized home renders header, footer, and locale switcher', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await page.getByRole('link', { name: /en/i }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
});
```

- [ ] **Step 3: Run the e2e check and confirm it fails**

Run: `npx playwright test tests/e2e/navigation.spec.ts`

Expected: FAIL because the localized shell does not exist yet

- [ ] **Step 4: Implement the shared shell and style tokens**

Implementation requirements:
- make the header compact and quiet
- use one sans-serif system and restrained spacing tokens
- add `prefers-reduced-motion` handling in `src/styles/motion.css`
- keep the home page intentionally minimal until real sections are added in the next task

- [ ] **Step 5: Run type, build, and navigation tests**

Run: `npm run check && npm run build && npx playwright test tests/e2e/navigation.spec.ts`

Expected: PASS

- [ ] **Step 6: Start the site and perform a visual shell review**

Run: `npm run dev`

Manual check:
- inspect `/ru/` and `/en/`
- confirm navigation labels localize correctly
- confirm spacing, typography, and header/footer balance look minimal on desktop and mobile
- confirm there is no heavy animation or layout shift

- [ ] **Step 7: Dispatch the review subagent for Task 3**

Reviewer must confirm:
- the design language is restrained
- locale switch logic is correct
- no layout duplication across locales

- [ ] **Step 8: Commit Task 3**

Run: `git add src/layouts src/components/site src/styles src/pages/index.astro src/pages/[locale]/index.astro tests/e2e/navigation.spec.ts && git commit -m "feat: add shared localized site shell"`

## Task 4: Build The Home Page And Project Grid

**Files:**
- Create: `src/components/sections/HomeIntro.astro`
- Create: `src/components/sections/ServicesPreview.astro`
- Create: `src/components/sections/AboutPreview.astro`
- Create: `src/components/sections/ContactCta.astro`
- Create: `src/components/projects/ProjectGrid.astro`
- Create: `src/components/projects/ProjectCard.astro`
- Create: `src/assets/site/logo.svg`
- Create: `src/assets/projects/villa-moscow/cover.jpg`
- Create: `src/assets/projects/gallery-house/cover.jpg`
- Create: `src/assets/projects/studio-loft/cover.jpg`
- Modify: `src/pages/[locale]/index.astro`
- Modify: `src/content/pages/home.yaml`
- Create: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Write the failing home page render test**

```ts
import { test, expect } from '@playwright/test';

test('home page shows intro, featured projects, and contact call to action', async ({ page }) => {
  await page.goto('/ru/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-project-card]')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /contact|связаться/i })).toBeVisible();
});
```

- [ ] **Step 3: Run the home page test and confirm it fails**

Run: `npx playwright test tests/e2e/home.spec.ts`

Expected: FAIL because the sections and project grid are not implemented yet

- [ ] **Step 4: Implement the home page sections and grid**

Implementation requirements:
- surface intro text from `src/content/pages/home.yaml`
- render homepage projects from the explicit `featuredProjectSlugs` references in `src/content/pages/home.yaml`
- show projects in a clean image-led grid
- keep services and about previews brief
- use the home-page preview fields when present, otherwise derive concise localized fallback excerpts from the about and services page content
- keep card metadata sparse: title, category, year, and one short summary line are enough
- create and wire local seed cover images before tuning layout or CMS behavior

- [ ] **Step 5: Run type, build, and home tests**

Run: `npm run check && npm run build && npx playwright test tests/e2e/home.spec.ts`

Expected: PASS

- [ ] **Step 6: Start the site and visually review the homepage**

Run: `npm run dev`

Manual check:
- inspect `/ru/` and `/en/`
- confirm the grid feels image-first and uncluttered
- confirm card spacing is even on desktop and mobile
- confirm preview sections do not overpower the projects

- [ ] **Step 7: Dispatch the review subagent for Task 4**

Reviewer must confirm:
- homepage hierarchy matches the spec
- the site still feels portfolio-first
- there is no accidental marketing-site bloat

- [ ] **Step 8: Commit Task 4**

Run: `git add src/components/sections src/components/projects/ProjectGrid.astro src/components/projects/ProjectCard.astro src/assets/site/logo.svg src/assets/projects src/pages/[locale]/index.astro src/content/pages/home.yaml tests/e2e/home.spec.ts && git commit -m "feat: add portfolio home page"`

## Task 5: Add Filters And Lightweight Motion

**Files:**
- Create: `src/components/projects/ProjectFilters.astro`
- Create: `src/scripts/project-filters.ts`
- Create: `src/scripts/motion.ts`
- Modify: `src/components/projects/ProjectGrid.astro`
- Modify: `src/styles/components.css`
- Modify: `src/styles/motion.css`
- Modify: `src/pages/[locale]/index.astro`
- Create: `tests/e2e/projects.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Write the failing filter and reduced-motion e2e test**

```ts
import { test, expect } from '@playwright/test';

test('project filters narrow the grid without reloading the page', async ({ page }) => {
  await page.goto('/ru/');
  await page.getByRole('button', { name: /interiors/i }).click();
  await expect(page.locator('[data-project-card]:visible')).toHaveCount(1);
});
```

- [ ] **Step 3: Run the projects test and confirm it fails**

Run: `npx playwright test tests/e2e/projects.spec.ts`

Expected: FAIL because filter UI and behavior do not exist yet

- [ ] **Step 4: Implement the filter UI and subtle motion script**

Implementation requirements:
- keep filtering client-side and lightweight
- do not introduce a large state library
- use CSS and small JS for transitions
- honor `prefers-reduced-motion`
- avoid decorative entrance choreography

- [ ] **Step 5: Run type, build, and projects tests**

Run: `npm run check && npm run build && npx playwright test tests/e2e/projects.spec.ts`

Expected: PASS

- [ ] **Step 6: Start the site and visually review filter behavior**

Run: `npm run dev`

Manual check:
- inspect `/ru/`
- click each filter category
- confirm results change smoothly without feeling animated for animation's sake
- confirm the layout remains stable on mobile

- [ ] **Step 7: Dispatch the review subagent for Task 5**

Reviewer must confirm:
- no unnecessary framework island was introduced
- motion is restrained and accessible
- filter state is clear and fast

- [ ] **Step 8: Commit Task 5**

Run: `git add src/components/projects/ProjectFilters.astro src/scripts/project-filters.ts src/scripts/motion.ts src/components/projects/ProjectGrid.astro src/styles/components.css src/styles/motion.css src/pages/[locale]/index.astro tests/e2e/projects.spec.ts && git commit -m "feat: add project filtering and motion polish"`

## Task 6: Build Project Detail Pages

**Files:**
- Create: `src/layouts/ProjectLayout.astro`
- Create: `src/components/projects/ProjectFacts.astro`
- Create: `src/components/projects/ProjectGallery.astro`
- Create: `src/components/projects/ProjectSections.astro`
- Create: `src/assets/projects/villa-moscow/gallery-1.jpg`
- Create: `src/assets/projects/villa-moscow/gallery-2.jpg`
- Create: `src/assets/projects/villa-moscow/gallery-3.jpg`
- Create: `src/assets/projects/gallery-house/gallery-1.jpg`
- Create: `src/assets/projects/gallery-house/gallery-2.jpg`
- Create: `src/assets/projects/gallery-house/gallery-3.jpg`
- Create: `src/assets/projects/studio-loft/gallery-1.jpg`
- Create: `src/assets/projects/studio-loft/gallery-2.jpg`
- Create: `src/assets/projects/studio-loft/gallery-3.jpg`
- Create: `src/pages/[locale]/projects/[slug].astro`
- Modify: `src/lib/projects.ts`
- Modify: `src/lib/routes.ts`
- Modify: `src/lib/seo.ts`
- Modify: `tests/e2e/projects.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Extend the projects e2e suite with a failing detail-page test**

```ts
test('project detail page renders hero, facts, gallery, and sections', async ({ page }) => {
  await page.goto('/ru/projects/villa-moscow');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('[data-project-summary]')).toBeVisible();
  await expect(page.locator('[data-project-facts]')).toBeVisible();
  await expect(page.locator('[data-project-gallery] img')).toHaveCount(3);
  await expect(page.locator('[data-project-section]')).toHaveCount(2);
});
```

- [ ] **Step 3: Run the projects suite and confirm the new test fails**

Run: `npx playwright test tests/e2e/projects.spec.ts`

Expected: FAIL because the project route and detail components do not exist yet

- [ ] **Step 4: Implement the project template**

Implementation requirements:
- generate paths for both locales from the shared project slug
- render facts sparsely and consistently
- keep gallery behavior simple and touch-friendly
- render repeatable structured sections in one consistent pattern
- add localized SEO titles and descriptions
- store all gallery media under `src/assets/projects/<slug>/` and reference those files from the content entries

- [ ] **Step 5: Run type, build, and projects tests**

Run: `npm run check && npm run build && npx playwright test tests/e2e/projects.spec.ts`

Expected: PASS

- [ ] **Step 6: Start the site and visually review a project page**

Run: `npm run dev`

Manual check:
- inspect `/ru/projects/villa-moscow` and `/en/projects/villa-moscow`
- confirm hero image is dominant
- confirm facts are compact and readable
- confirm the gallery stacks cleanly on mobile
- confirm long text never overwhelms the page

- [ ] **Step 7: Dispatch the review subagent for Task 6**

Reviewer must confirm:
- project pages feel balanced, not too bare and not too editorial
- SEO and locale routing remain correct
- gallery and section rendering stay simple

- [ ] **Step 8: Commit Task 6**

Run: `git add src/layouts/ProjectLayout.astro src/components/projects/ProjectFacts.astro src/components/projects/ProjectGallery.astro src/components/projects/ProjectSections.astro src/assets/projects src/pages/[locale]/projects/[slug].astro src/lib/projects.ts src/lib/routes.ts src/lib/seo.ts tests/e2e/projects.spec.ts && git commit -m "feat: add project detail pages"`

## Task 7: Build About, Services, And Contact Pages

**Files:**
- Create: `src/components/site/ContactLinks.astro`
- Create: `src/assets/about/portrait.jpg`
- Create: `src/pages/[locale]/about.astro`
- Create: `src/pages/[locale]/services.astro`
- Create: `src/pages/[locale]/contact.astro`
- Modify: `src/content/pages/about.yaml`
- Modify: `src/content/pages/services.yaml`
- Modify: `src/content/pages/contact.yaml`
- Modify: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Add failing navigation checks for the secondary pages**

```ts
test('secondary pages render localized content', async ({ page }) => {
  await page.goto('/ru/about');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/ru/services');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/ru/contact');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

- [ ] **Step 3: Run the navigation suite and confirm the new checks fail**

Run: `npx playwright test tests/e2e/navigation.spec.ts`

Expected: FAIL because the pages do not exist yet

- [ ] **Step 4: Implement the three secondary pages**

Implementation requirements:
- About: portrait, concise biography, approach, credentials
- Services: short intro, clear services list, restrained CTA
- Contact: short framing intro text, direct contact details, social links, then the form block
- keep all three pages visually quiet and lighter than the project pages
- create and use a local about portrait so the page is reviewed with real media, not an empty placeholder
- source all contact-page form labels and helper copy from the localized contact content entry rather than hardcoding UI strings

- [ ] **Step 5: Run type, build, and navigation tests**

Run: `npm run check && npm run build && npx playwright test tests/e2e/navigation.spec.ts`

Expected: PASS

- [ ] **Step 6: Start the site and visually review the secondary pages**

Run: `npm run dev`

Manual check:
- inspect `/ru/about`, `/ru/services`, `/ru/contact`
- repeat spot checks in `/en/...`
- confirm text blocks stay concise and well spaced
- confirm the contact page clearly presents both direct links and the form area

- [ ] **Step 7: Dispatch the review subagent for Task 7**

Reviewer must confirm:
- the balanced portfolio-plus-services positioning matches the spec
- these pages support the portfolio instead of competing with it

- [ ] **Step 8: Commit Task 7**

Run: `git add src/components/site/ContactLinks.astro src/assets/about/portrait.jpg src/layouts/PageLayout.astro src/pages/[locale]/about.astro src/pages/[locale]/services.astro src/pages/[locale]/contact.astro src/content/pages/about.yaml src/content/pages/services.yaml src/content/pages/contact.yaml tests/e2e/navigation.spec.ts && git commit -m "feat: add secondary marketing pages"`

## Task 8: Add Contact Form Validation And Delivery Wiring

**Files:**
- Create: `src/components/contact/ContactForm.astro`
- Create: `src/lib/contact.ts`
- Modify: `src/pages/[locale]/contact.astro`
- Create: `tests/unit/contact.test.ts`
- Create: `tests/e2e/contact.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Write the failing unit and e2e tests**

```ts
import { describe, expect, it } from 'vitest';
import { validateContactPayload } from '../../src/lib/contact';

describe('contact validation', () => {
  it('rejects empty required fields', () => {
    expect(validateContactPayload({ name: '', email: '', message: '' }).ok).toBe(false);
  });
});
```

```ts
import { test, expect } from '@playwright/test';

test('contact form blocks invalid submission', async ({ page }) => {
  await page.goto('/ru/contact');
  await page.getByRole('button', { name: /send|отправить/i }).click();
  await expect(page.getByText(/required|обязательно/i)).toBeVisible();
});
```

```ts
import { test, expect } from '@playwright/test';

test('contact form posts valid data and shows a success message', async ({ page }) => {
  await page.route('**/contact-test-endpoint', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto('/ru/contact');
  await page.getByLabel(/name|имя/i).fill('Test User');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/message|сообщение/i).fill('Test inquiry');
  await page.getByRole('button', { name: /send|отправить/i }).click();
  await expect(page.getByText(/sent|отправлено/i)).toBeVisible();
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npm run test:unit -- tests/unit/contact.test.ts && PUBLIC_CONTACT_FORM_ENDPOINT=/contact-test-endpoint npx playwright test tests/e2e/contact.spec.ts`

Expected: FAIL because the form and validator do not exist yet

- [ ] **Step 4: Implement a minimal host-agnostic delivery strategy**

Implementation requirements:
- validate fields locally in `src/lib/contact.ts`
- submit to a configurable external endpoint via `PUBLIC_CONTACT_FORM_ENDPOINT`
- use `PUBLIC_CONTACT_FORM_ENDPOINT=/contact-test-endpoint` during e2e runs and intercept it in Playwright so the success state is verified deterministically without a live provider
- keep the site statically deployable by default
- show success and error states without page reload if practical
- avoid adding a custom backend unless hosting is already known during execution
- render form labels, validation copy, and success or error messages from localized content fields in `src/content/pages/contact.yaml`

- [ ] **Step 5: Run type, build, and contact tests**

Run: `npm run check && npm run build && npm run test:unit -- tests/unit/contact.test.ts && PUBLIC_CONTACT_FORM_ENDPOINT=/contact-test-endpoint npx playwright test tests/e2e/contact.spec.ts`

Expected: PASS

- [ ] **Step 6: Start the site and visually review the form**

Run: `npm run dev`

Manual check:
- inspect `/ru/contact`
- trigger validation states
- confirm spacing, button states, and success/error messages fit the minimal design
- confirm the form is usable on mobile

- [ ] **Step 7: Dispatch the review subagent for Task 8**

Reviewer must confirm:
- the form path is lightweight and static-host friendly
- validation is correct
- the UI does not look like a generic SaaS form dropped into the page

- [ ] **Step 8: Commit Task 8**

Run: `git add src/components/contact/ContactForm.astro src/lib/contact.ts src/pages/[locale]/contact.astro tests/unit/contact.test.ts tests/e2e/contact.spec.ts && git commit -m "feat: add contact form flow"`

## Task 9: Integrate The Git-Backed CMS

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Create: `keystatic.config.ts`
- Create if needed: `src/pages/keystatic/[...params].ts`
- Modify: `src/content.config.ts`
- Modify: `src/content/settings/site.yaml`
- Modify: `src/content/pages/home.yaml`
- Modify: `src/content/pages/about.yaml`
- Modify: `src/content/pages/services.yaml`
- Modify: `src/content/pages/contact.yaml`
- Modify: `src/content/projects/*.yaml`
- Modify: `src/content/taxonomy/project-categories.yaml`
- Modify: `tests/unit/content.test.ts`
- Create if needed: `public/admin/index.html`
- Create if needed: `public/admin/config.yml`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Write a failing workflow check for editable content**

Use a simple content-integrity test instead of full CMS browser automation.

```ts
import { describe, expect, it } from 'vitest';
import { getHomePageContent } from '../../src/lib/content';

describe('cms-backed content', () => {
  it('loads all localized home fields from content files', async () => {
    const home = await getHomePageContent();
    expect(home.intro.ru.length).toBeGreaterThan(0);
    expect(home.intro.en.length).toBeGreaterThan(0);
  });
});

describe('cms configuration', () => {
  it('exposes editable collections for settings, pages, taxonomy, and projects', async () => {
    const config = await import('../../keystatic.config');
    expect(Object.keys(config.default.collections)).toEqual(
      expect.arrayContaining(['settings', 'pages', 'taxonomy', 'projects']),
    );
  });
});
```

- [ ] **Step 3: Run the content check and confirm it fails if CMS metadata is still missing**

Run: `npm run test:unit -- tests/unit/content.test.ts`

Expected: FAIL because `keystatic.config.ts` and its collection wiring do not exist yet

- [ ] **Step 4: Implement Keystatic first**

Implementation requirements:
- expose editable collections for settings, pages, taxonomy, and projects
- keep bilingual text fields structured, not duplicated per locale entry
- make project ordering and featured state editable
- make homepage featured-project selection editable through explicit references in the home-page entry
- support cover image and gallery asset selection
- expose a concrete editor entry at `/keystatic` or the minimal equivalent route required by the installed Keystatic version
- support previewing draft edits before publish through the CMS UI while `npm run dev` is running, with the preview resolving against the local Astro site rather than requiring a remote staging deployment
- do not expose arbitrary layout builders

- [ ] **Step 5: If Keystatic blocks progress, switch immediately to Decap fallback**

Fallback rule:
- create `public/admin/index.html`
- create `public/admin/config.yml`
- keep the exact same content file paths under `src/content/`
- configure Decap preview behavior so editors can preview draft content against the running local site before publishing
- do not change public routes or page components during the fallback

- [ ] **Step 6: Run content, build, and manual CMS checks**

Run: `npm run check && npm run build && npm run test:unit -- tests/unit/content.test.ts`

Expected: PASS

Manual check:
- open the CMS admin route
- edit one non-critical field in a sample project or page
- confirm the editor can preview the draft result before publishing or finalizing the change
- create one temporary project entry and confirm it appears in the project grid and detail routing
- reorder at least two projects and confirm the homepage/project order changes locally
- toggle featured state or featured-project references and confirm homepage selection changes locally
- edit both RU and EN fields for one project and confirm both locale routes reflect the updates
- confirm the content file changes in git
- confirm the public page reflects the change locally
- revert the sample content edit before commit unless it improves the seed content

- [ ] **Step 7: Start the site and visually confirm nothing regressed**

Run: `npm run dev`

Manual check:
- inspect `/ru/` and one project detail page after a CMS edit
- confirm layout stability and field rendering remain correct

- [ ] **Step 8: Dispatch the review subagent for Task 9**

Reviewer must confirm:
- editors can change content without code edits
- the CMS did not introduce layout sprawl
- fallback was used only if necessary

- [ ] **Step 9: Commit Task 9**

Run: `git add package.json astro.config.mjs keystatic.config.ts src/pages/keystatic src/content.config.ts src/content public/admin tests/unit/content.test.ts && git commit -m "feat: add repo-backed content editing"`

If fallback was not used, omit `public/admin` from `git add`. If the installed Keystatic version does not need `src/pages/keystatic/[...params].ts`, omit `src/pages/keystatic` as well.

## Task 10: Final Polish, Accessibility, And Release Verification

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`
- Modify: `src/styles/motion.css`
- Modify: `src/components/**/*`
- Modify: `src/pages/**/*`
- Modify: `tests/e2e/*.spec.ts`

- [ ] **Step 1: Hand off only this task to the implementation subagent**

- [ ] **Step 2: Add any missing failing regression checks before polishing**

Focus areas:
- keyboard focus visibility
- locale link consistency
- reduced-motion behavior
- image alt text presence
- mobile spacing regressions

- [ ] **Step 3: Run the full suite and capture the baseline**

Run: `npm run check && npm run test:unit && npx playwright test && npm run build`

Expected: PASS or a short list of polish gaps to fix immediately

- [ ] **Step 4: Apply final UI and accessibility polish**

Implementation requirements:
- fix any spacing, contrast, or focus-state issues
- ensure animations stay subtle
- ensure desktop and mobile layouts are both calm and clean
- ensure English and Russian content fit without awkward wrapping or overflow

- [ ] **Step 5: Re-run the full suite after polish**

Run: `npm run check && npm run test:unit && npx playwright test && npm run build`

Expected: full PASS

- [ ] **Step 6: Start the site and perform the final manual review**

Run: `npm run dev`

Manual check:
- review `/ru/`, `/en/`, one RU project, one EN project, `/ru/about`, `/ru/services`, `/ru/contact`
- review desktop and mobile widths
- confirm motion, spacing, and typography all feel consistent
- confirm the site feels architect-portfolio minimal rather than template-like

- [ ] **Step 7: Dispatch the review subagent for Task 10**

Reviewer must confirm:
- spec coverage is complete
- final UI quality is consistent across routes and locales
- there are no leftover placeholders, dead links, or obvious regressions

- [ ] **Step 8: Commit Task 10**

Run: `git add src tests && git commit -m "fix: polish portfolio experience and verification"`

## Final Acceptance Checklist

- [ ] `/` redirects to `/ru/`
- [ ] `/ru/` and `/en/` both work
- [ ] homepage project grid renders and filters correctly
- [ ] project detail pages exist in both locales
- [ ] about, services, and contact pages exist in both locales
- [ ] contact links and form both work
- [ ] editors can update content through a Git-backed UI
- [ ] reduced-motion support is present
- [ ] desktop and mobile layouts both look correct
- [ ] `npm run check` passes
- [ ] `npm run test:unit` passes
- [ ] `npx playwright test` passes
- [ ] `npm run build` passes

## Execution Notes

- Keep sample content realistic enough to judge layout quality.
- Do not add extra sections such as blog, press, journal, or fancy scroll storytelling.
- Prefer small Astro components and helper files over giant route files.
- If a task reveals the need for a new shared helper, add it only when two consumers already need it.
- If a fallback is used for CMS or contact delivery, note it clearly in the review handoff so the next worker does not accidentally “fix” it back without context.
