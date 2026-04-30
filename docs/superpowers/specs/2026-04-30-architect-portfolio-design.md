# Architect Portfolio Website Design Specification

## Goal

Create a minimalistic bilingual portfolio website for an architect that feels concise and elegant, uses smooth restrained animations, and makes it easy to add and edit projects through a Git-backed visual CMS.

## Product Direction

- Positioning: balanced between portfolio showcase and client-acquisition site
- Visual character: minimal, quiet, image-led, typography-driven
- Editing model: Git-backed visual CMS
- Languages: Russian and English
- Project browsing: filterable grid
- Project detail depth: balanced case study
- Motion: subtle and performance-conscious
- Launch scope: portfolio only, with no press, journal, or blog

## Success Criteria

- The site clearly presents the architect's work first, with supporting about, services, and contact content.
- Editors can create, update, reorder, feature, and translate projects without changing code.
- The site remains visually restrained even as content grows.
- The website works well on desktop and mobile.
- Motion enhances polish without reducing clarity, speed, or accessibility.
- Russian and English content are both first-class and easy to maintain.

## Reference Direction

The design direction should borrow from minimal architecture portfolio patterns:

- light backgrounds
- strong use of whitespace
- crisp sans-serif typography
- sparse navigation chrome
- large project imagery
- limited accent color use
- subtle transitions instead of expressive motion-heavy storytelling

The implementation should not copy any one reference site directly. The goal is to match the level of restraint and visual confidence, not to reproduce specific layouts.

## Scope

### In Scope

- homepage with studio intro and project discovery
- bilingual navigation and page rendering
- filterable project archive behavior
- project detail pages
- about page
- services page
- contact page
- contact form and direct contact links
- Git-backed CMS for editing content
- responsive layouts
- subtle motion system
- accessibility baseline
- local and production build verification

### Out Of Scope For Launch

- blog, journal, press, or news sections
- complex editorial publishing workflows
- user accounts
- heavy visual experimentation, parallax, or cinematic scroll choreography
- freeform page-builder editing
- advanced search
- custom backend beyond what is needed for contact form handling and CMS workflow

## Information Architecture

### Primary Pages

- `/` home
- `/projects/[slug]` project detail pages
- `/about`
- `/services`
- `/contact`

### Optional Route Decision

The project grid can live directly on the home page. A separate `/projects` route is optional and should be added only if the home page later needs to become more editorial.

### Navigation

- logo or wordmark
- projects or home entry
- about
- services
- contact
- locale switcher

Navigation should remain compact and unobtrusive.

## Page Requirements

### Home

Purpose:
Present the architect's identity quickly and lead visitors into the project archive.

Sections:

- short intro or positioning statement
- filterable project grid or list
- compact services preview
- short about preview
- contact call to action

Notes:

- project content should dominate the page visually
- supporting text should stay concise
- filtering should feel immediate and light

### Project Detail

Purpose:
Show a project with enough structure to feel considered, without turning into a long-form editorial article.

Required elements:

- hero image
- compact project facts
- image gallery
- short summary
- a few structured text sections such as concept, context, process, or challenge

Content density:

- balanced, not minimal one-screen only
- balanced, not fully documentary

### About

Purpose:
Explain the architect or studio identity, approach, and credentials.

Required elements:

- portrait or representative image
- concise biography
- design approach statement
- credentials or relevant background

### Services

Purpose:
Support client acquisition without overpowering the portfolio.

Required elements:

- short intro
- clear list of services
- restrained call to action

### Contact

Purpose:
Make it easy to start a conversation.

Required elements:

- direct contact details
- social links
- inquiry form
- short framing text

The page should support both quick direct outreach and structured lead capture.

## Content Model

The content model should stay structured and opinionated so editors can update content safely without affecting layout quality.

### Site Settings

Fields:

- studio name
- logo or wordmark asset
- default SEO fields
- contact details
- social links
- navigation labels in RU and EN
- footer text in RU and EN
- locale labels

### Home Page

Fields:

- intro copy in RU and EN
- selected featured projects
- about preview content in RU and EN, with the ability to default to a short excerpt derived from the about page
- services preview content in RU and EN, with the ability to default to a short excerpt derived from the services page
- contact CTA text in RU and EN
- optional section ordering controls if needed later

### Projects

Shared fields:

- slug
- cover image
- gallery images
- category
- year
- location
- status
- featured flag
- sort order

Localized fields:

- title RU
- title EN
- summary RU
- summary EN
- structured description sections RU as a repeatable list of labeled sections
- structured description sections EN as a repeatable list of labeled sections

Optional localized fields:

- process text
- challenge text
- additional facts if needed

Structured section guidance:

- each section should have a label, heading, and body
- editors can add, remove, and reorder sections
- the presentation layer should render them in one consistent project-page pattern rather than allowing arbitrary layout control

### About Page

Fields:

- portrait or image
- biography RU and EN
- approach RU and EN
- credentials RU and EN

### Services Page

Fields:

- section title RU and EN
- short intro RU and EN
- service list RU and EN
- CTA copy RU and EN

### Contact Page

Fields:

- heading RU and EN
- intro text RU and EN
- form labels RU and EN
- email
- phone
- address
- map link
- social links

### Taxonomy Rules

- categories must use a predefined controlled list
- project ordering must be editable without code changes
- featured state must be a simple toggle
- editors must not control arbitrary layout variants

## Editing Workflow

- Use a Git-backed visual CMS.
- Keep content in the repository.
- Allow non-technical editing through a structured admin interface.
- Store each project as one record with shared media and metadata plus RU and EN text fields.
- Keep layout controls out of the CMS to preserve a minimal visual system.
- Support content previews before publishing.
- Keep project ordering and featuring easy to manage.

## Technical Direction

### Framework

Use Astro as the primary framework.

Reasons:

- strong fit for content-first, image-heavy static sites
- good performance by default
- low runtime complexity
- enough flexibility for lightweight interactivity such as filtering and transitions

### Rendering Model

- static-first architecture
- server-rendered content pages
- small client-side islands only where needed
- no app-like client architecture unless a specific later requirement justifies it

### Internationalization

- both Russian and English must be first-class
- content should come from one structured source, not duplicated template trees
- locale switch must be present across core pages
- use locale-prefixed routes for both languages, for example `/ru/...` and `/en/...`
- keep one shared project slug per entry unless implementation discovery reveals a strong SEO or editorial reason to separate localized slugs

### CMS Recommendation

Preferred direction: Keystatic.

Rationale:

- strong fit for structured content editing
- modern developer experience
- good match for a content model with bilingual fields and media

Fallback option:

- Decap CMS if the implementation needs a lighter and more conventional admin setup

The plan should treat Keystatic as the default unless implementation discovery reveals a blocking limitation.

## Design System Direction

- one primary sans-serif type system
- restrained spacing scale
- light or neutral backgrounds
- minimal accent color usage
- reusable layout primitives
- strong focus on image-to-title rhythm
- compact unobtrusive navigation

The interface should remain visually quiet so the projects do the work.

## Motion Direction

Motion must be subtle and performance-conscious.

Allowed patterns:

- fade and slight slide reveals
- gentle hover behavior
- smooth filter transitions
- restrained page transition feel where appropriate

Avoid:

- heavy scroll choreography
- decorative animation that competes with the work
- motion that delays access to content

Accessibility requirements:

- honor `prefers-reduced-motion`
- do not rely on motion to communicate core meaning
- keep interactions usable with reduced motion enabled

## Filter Behavior

- visitors can browse projects in a clean grid
- filters use a small set of predefined categories
- filter changes should be visually smooth but immediate
- filtered states should preserve clarity on both desktop and mobile

The filtering implementation should remain lightweight and should not require a large client-side state system.

## Contact Behavior

- show direct contact methods visibly
- include a structured inquiry form
- keep the form visually restrained
- form handling can use a lightweight backend or platform-native submission path

The form implementation must not introduce unnecessary backend complexity.

## Accessibility Baseline

- semantic heading structure
- keyboard navigation support
- visible focus states
- alt text support for project imagery where appropriate
- adequate contrast
- reduced-motion support

## Performance Baseline

- fast initial render
- optimized responsive images
- minimal JavaScript
- static rendering wherever practical
- animations that do not compromise perceived performance

## Verification Requirements

Each meaningful implementation step must include both functional and visual verification.

### Functional Checks

- dependencies install successfully
- local development server starts
- production build succeeds
- navigation works
- locale switching works
- project grid renders correctly
- filters work
- project detail pages render expected data
- about, services, and contact pages render correctly
- contact form flow works
- CMS edits update the site correctly

### Visual Checks

- desktop layout looks correct
- mobile layout looks correct
- typography hierarchy is consistent
- spacing is consistent
- imagery uses correct aspect ratios
- motion feels smooth and restrained

## Execution Model Required By Task

The implementation plan must explicitly use subagents.

Required workflow:

- one implementation subagent performs the current task
- one review subagent reviews that task continuously
- after each task, verify the site runs and looks correct before moving on

The review subagent should validate:

- alignment with this specification
- code quality and maintainability
- whether the website still runs
- whether the visible result still matches the minimal design direction
- whether the change introduced regressions

## Suggested Implementation Phases

1. Bootstrap Astro project and base tooling.
2. Create the design foundation: layout, typography, spacing, and tokens.
3. Build the bilingual content model.
4. Build the shared shell: header, navigation, footer, locale switch.
5. Build the home page and project grid.
6. Add filtering behavior.
7. Build project detail pages.
8. Build about, services, and contact pages.
9. Integrate the Git-backed CMS.
10. Add contact form handling.
11. Polish motion and responsive behavior.
12. Run final verification and cleanup.

## Risks And Planning Notes

- The repository is currently almost empty, so the plan must include project bootstrap tasks.
- CMS choice must stay structured and lightweight to avoid overbuilding.
- Bilingual content editing must be designed clearly from the beginning to avoid duplication.
- Image handling and responsive presentation will be central to perceived quality.
- The site should remain minimal even as editable content grows.

## Planning Constraints

- The implementation plan should stay focused on a single website project, not multiple subsystems.
- The plan should prefer minimal correct solutions over generalized abstractions.
- The plan should include explicit verification commands and manual visual checks after each phase.
- The final plan must be written in detail to `PLAN.md` as required by `TASK.md`.
