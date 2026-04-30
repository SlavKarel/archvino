import { describe, expect, it } from 'vitest';

import {
  buildHomePath,
  buildLocaleSwitchPath,
  buildPagePath,
  buildProjectPath,
} from '../../src/lib/routes';

describe('route helpers', () => {
  it('builds localized home, page, and project paths', () => {
    expect(buildHomePath('ru')).toBe('/ru/');
    expect(buildPagePath('en', 'about')).toBe('/en/about');
    expect(buildProjectPath('ru', 'villa-moscow')).toBe('/ru/projects/villa-moscow');
  });

  it('switches locale while preserving the localized route tail', () => {
    expect(buildLocaleSwitchPath('/ru/', 'en')).toBe('/en/');
    expect(buildLocaleSwitchPath('/ru/services', 'en')).toBe('/en/services');
    expect(buildLocaleSwitchPath('/en/projects/studio-loft', 'ru')).toBe('/ru/projects/studio-loft');
  });
});
