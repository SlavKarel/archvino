import { describe, expect, it } from 'vitest';

import { getHomePageContent, getSiteSettings } from '../../src/lib/content';

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
});
