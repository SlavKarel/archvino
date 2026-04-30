import { describe, expect, it } from 'vitest';

import {
  filterProjectsByCategory,
  getProjectBySlug,
  getProjects,
  sortProjects,
} from '../../src/lib/projects';

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
    expect(projects).toEqual([
      { slug: 'a', category: 'residential' },
      { slug: 'b', category: 'interiors' },
    ]);
  });

  it('returns localized project data while keeping one shared slug', async () => {
    const project = await getProjectBySlug('villa-moscow', 'en');

    expect(project?.slug).toBe('villa-moscow');
    expect(project?.title).toBeTruthy();
    expect(project?.cover.alt).toBeTruthy();
    expect(project?.gallery.length).toBeGreaterThan(0);
  });

  it('loads sample projects in display order', async () => {
    const projects = await getProjects('ru');

    expect(projects.map((project) => project.slug)).toEqual([
      'villa-moscow',
      'gallery-house',
      'studio-loft',
    ]);
  });
});
