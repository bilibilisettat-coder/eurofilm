import { SITE_URL, blogSlugFromPath, blogPath, sectionForPath } from '../data/routes';

// Canonical rules:
//  - /blog/<slug> and the clean section paths are canonical to themselves
//  - ?watch=<id> trailer pages are canonical to themselves
//  - anything else (non-indexed tab aliases like /?tab=born-today) points at the home page
export function getCanonicalUrl(): string {
  if (typeof window === 'undefined') return `${SITE_URL}/`;
  const { pathname, search } = window.location;
  const watch = new URLSearchParams(search).get('watch');
  if (watch && /^\d+$/.test(watch)) {
    const base = sectionForPath(pathname)?.path ?? '/';
    return `${SITE_URL}${base}?watch=${watch}`;
  }
  const slug = blogSlugFromPath(pathname);
  if (slug) return `${SITE_URL}${blogPath(slug)}`;
  const section = sectionForPath(pathname);
  return `${SITE_URL}${section ? section.path : '/'}`;
}

export function syncCanonical(): void {
  if (typeof document === 'undefined') return;
  const href = getCanonicalUrl();
  let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
  document.querySelector("meta[property='og:url']")?.setAttribute('content', href);
}

/** Sets title + description + social tags in one place. */
export function setPageMeta(title: string, description: string): void {
  if (typeof document === 'undefined') return;
  document.title = title;
  const set = (sel: string, value: string) => document.querySelector(sel)?.setAttribute('content', value);
  set("meta[name='description']", description);
  set("meta[property='og:title']", title);
  set("meta[property='og:description']", description);
  set("meta[name='twitter:title']", title);
  set("meta[name='twitter:description']", description);
  syncCanonical();
}
