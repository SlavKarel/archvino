import { type Locale, buildLocalePath, isLocale } from './i18n';

export function buildHomePath(locale: Locale): string {
  return buildLocalePath(locale, '/');
}

export function buildPagePath(locale: Locale, pageSlug: string): string {
  return buildLocalePath(locale, pageSlug);
}

export function buildProjectPath(locale: Locale, projectSlug: string): string {
  return buildLocalePath(locale, `/projects/${projectSlug}`);
}

export function buildLocaleSwitchPath(currentPath: string, targetLocale: Locale): string {
  const normalizedPath = normalizePath(currentPath);
  const segments = normalizedPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return buildHomePath(targetLocale);
  }

  if (!isLocale(segments[0])) {
    return buildLocalePath(targetLocale, normalizedPath);
  }

  const nextPath = segments.slice(1).join('/');

  if (nextPath === '') {
    return buildHomePath(targetLocale);
  }

  return buildLocalePath(targetLocale, nextPath);
}

function normalizePath(path: string): string {
  if (path === '') {
    return '/';
  }

  if (path === '/') {
    return path;
  }

  return path.endsWith('/') ? path.slice(0, -1) : path;
}
