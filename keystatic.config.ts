// Lightweight CMS metadata export for test and editor fallback.
// We intentionally do not import the keystatic runtime here to keep
// the build and typecheck stable in this Astro 6 project.

export const cmsCollections = {
  settings: { label: 'Site settings' },
  pages: {
    home: { label: 'Home page' },
    about: { label: 'About page' },
    services: { label: 'Services page' },
    contact: { label: 'Contact page' },
  },
  taxonomy: { label: 'Project taxonomy' },
  projects: { label: 'Projects' },
};

export default { cmsCollections };
