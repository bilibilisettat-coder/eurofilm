// Real entertainment headlines. scripts/prerender.ts fetches trade RSS feeds at build time
// and writes /news.json; the app reads it here. Only headline, source, date and link are shown,
// and every item links to the original article.

export interface NewsHeadline {
  title: string;
  link: string;
  source: string;
  /** ISO date string */
  date: string;
  category: 'Film News' | 'Box Office' | 'Streaming' | 'Casting' | 'Awards' | 'Reviews';
}

let cache: Promise<NewsHeadline[]> | null = null;

export function loadNews(): Promise<NewsHeadline[]> {
  if (!cache) {
    cache = fetch('/news.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => (Array.isArray(data) ? (data as NewsHeadline[]) : []))
      .catch(() => []);
  }
  return cache;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} hours ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
