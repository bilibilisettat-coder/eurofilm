// Keeps <link rel="canonical"> and og:url pointing at the URL actually being shown.
// Only one meaningful query param is kept (blog > watch > tab) so every sitemap URL
// declares itself as canonical instead of pointing everything at /free-movie-stream.
const SITE = 'https://eurofilm.xyz';
const KEPT_PARAMS = ['blog', 'watch', 'tab'] as const;

export function getCanonicalUrl(): string {
  if (typeof window === 'undefined') return `${SITE}/`;
  const params = new URLSearchParams(window.location.search);
  let path = window.location.pathname.replace(/\/index\.html$/, '/') || '/';
  if (path.length > 1) path = path.replace(/\/+$/, '');
  for (const key of KEPT_PARAMS) {
    const value = params.get(key);
    if (value && !(key === 'tab' && value === 'popular')) {
      return `${SITE}${path}?${key}=${encodeURIComponent(value)}`;
    }
  }
  return `${SITE}${path}`;
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
