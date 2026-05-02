import { describe, expect, it } from 'vitest';

import { getHomePageContent, getSiteSettings } from '../../src/lib/content';
import { buildDefaultSeo } from '../../src/lib/seo';

describe('content helpers', () => {
  it('returns site settings with localized navigation and seo defaults', async () => {
    const settings = await getSiteSettings();

    expect(settings.navigation.home.ru).toBeTruthy();
    expect(settings.navigation.home.en).toBeTruthy();
    expect(settings.localeLabels.ru.ru).toBeTruthy();
    expect(settings.localeLabels.en.en).toBeTruthy();
    expect(settings.defaultSeo.title.ru).toBeTruthy();
    expect(settings.socialLinks.length).toBeGreaterThan(0);
  });

  it('derives home previews from about and services content when overrides are empty', async () => {
    const home = await getHomePageContent('ru');

    expect(home.featuredProjectSlugs).toEqual([
      'villa-moscow',
      'gallery-house',
      'studio-loft',
    ]);
    expect(home.aboutPreview.length).toBeGreaterThan(0);
    expect(home.servicesPreview.length).toBeGreaterThan(0);
    expect(home.aboutPreview).not.toContain('\n');
    expect(home.servicesPreview).not.toContain('\n');
  });

  it('resolves the default seo image to a public asset url', async () => {
    const seo = await buildDefaultSeo('ru');

    expect(seo.image).toBeTruthy();
    expect(seo.image).not.toContain('[object Object]');
    expect(seo.image).not.toMatch(/^\/src\/assets\//);
    expect(seo.image.toLowerCase()).not.toContain('.svg');
  });
});

describe('cms configuration', () => {
  it('exposes editable collections for settings, pages, taxonomy, and projects', async () => {
    const config = await import('../../keystatic.config');

    expect(Object.keys(config.cmsCollections)).toEqual(
      expect.arrayContaining(['settings', 'pages', 'taxonomy', 'projects']),
    );
  });
});
