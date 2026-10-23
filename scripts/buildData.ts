/**
 * Build-time data for the prerendered section pages and /news.json.
 * Every fetch has a timeout and fails soft: if a source is unreachable the page is still built,
 * just without that list. Set EUROFILM_DATA_FIXTURE=path/to/fixture.json to build offline.
 */
import fs from 'node:fs';

const TMDB_KEY = 'a9df3024ecdd6c3ed103bb998df53110'; // same public v3 key the site already uses client-side
const TMDB = 'https://api.themoviedb.org/3';
export const TMDB_IMG = 'https://image.tmdb.org/t/p';

export interface ListItem {
  id: number;
  title: string;
  year: string;
  rating: number | null;
  overview: string;
  image: string | null;
  url?: string;
}

export interface Headline {
  title: string;
  link: string;
  source: string;
  date: string;
  category: 'Film News' | 'Box Office' | 'Streaming' | 'Casting' | 'Awards' | 'Reviews';
}

export interface BuildData {
  lists: Record<string, ListItem[]>;
  news: Headline[];
}

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url.replace(TMDB_KEY, '***')}`);
  return res.json();
}

async function getText(url: string): Promise<string> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(12000),
    headers: { 'user-agent': 'EuroFilmBuild/1.0 (+https://eurofilm.xyz)', accept: 'application/rss+xml, application/xml, text/xml' },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const clip = (s: string, n = 220) => (s.length > n ? `${s.slice(0, n).replace(/\s+\S*$/, '')}…` : s);

async function tmdbList(path: string, kind: 'movie' | 'tv'): Promise<ListItem[]> {
  const sep = path.includes('?') ? '&' : '?';
  const data = await getJson(`${TMDB}${path}${sep}api_key=${TMDB_KEY}&language=en-US&page=1`);
  return (data.results || [])
    .filter((r: any) => !r.adult && (r.overview || '').trim())
    .slice(0, 20)
    .map((r: any) => ({
      id: r.id,
      title: kind === 'tv' ? r.name : r.title,
      year: String((kind === 'tv' ? r.first_air_date : r.release_date) || '').slice(0, 4),
      rating: typeof r.vote_average === 'number' && r.vote_count > 20 ? Math.round(r.vote_average * 10) / 10 : null,
      overview: clip(r.overview || ''),
      image: r.poster_path ? `${TMDB_IMG}/w185${r.poster_path}` : null,
    }));
}

async function jikanTopAnime(): Promise<ListItem[]> {
  const data = await getJson('https://api.jikan.moe/v4/top/anime?limit=20&sfw=true');
  return (data.data || []).map((a: any) => ({
    id: a.mal_id,
    title: a.title_english || a.title,
    year: String(a.year || a.aired?.prop?.from?.year || ''),
    rating: typeof a.score === 'number' ? a.score : null,
    overview: clip((a.synopsis || '').replace(/\s*\[Written by MAL Rewrite\]\s*/g, '')),
    image: a.images?.jpg?.image_url || null,
    url: a.url,
  }));
}

// ---------- RSS ----------
const FEEDS = [
  { source: 'Deadline', url: 'https://deadline.com/v/film/feed/' },
  { source: 'Variety', url: 'https://variety.com/v/film/feed/' },
  { source: 'The Hollywood Reporter', url: 'https://www.hollywoodreporter.com/c/movies/feed/' },
];

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#8217;|&#x2019;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .trim();

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
}

function categorise(title: string, cats: string[]): Headline['category'] {
  const hay = `${title} ${cats.join(' ')}`.toLowerCase();
  if (/\breview\b/.test(hay)) return 'Reviews';
  if (/box office|opening weekend|grosses/.test(hay)) return 'Box Office';
  if (/oscar|academy award|golden globe|bafta|awards/.test(hay)) return 'Awards';
  if (/\bcast(s|ing)?\b|to star|joins|boards/.test(hay)) return 'Casting';
  if (/netflix|prime video|disney\+|hbo max|streaming|peacock|apple tv/.test(hay)) return 'Streaming';
  return 'Film News';
}

export function parseRss(xml: string, source: string): Headline[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return items.flatMap((item) => {
    const title = tag(item, 'title');
    let link = tag(item, 'link');
    if (!/^https?:\/\//.test(link)) link = tag(item, 'guid');
    const dateRaw = tag(item, 'pubDate');
    const date = new Date(dateRaw);
    if (!title || !/^https:\/\//.test(link) || Number.isNaN(date.getTime())) return [];
    const cats = [...item.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map((m) => decode(m[1]));
    return [{ title, link, source, date: date.toISOString(), category: categorise(title, cats) }];
  });
}

async function fetchNews(): Promise<Headline[]> {
  const settled = await Promise.allSettled(FEEDS.map(async (f) => parseRss(await getText(f.url), f.source)));
  const all: Headline[] = [];
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') all.push(...r.value);
    else console.warn(`buildData: news feed ${FEEDS[i].source} failed: ${r.reason}`);
  });
  const seen = new Set<string>();
  return all
    .filter((h) => (seen.has(h.link) ? false : (seen.add(h.link), true)))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 60);
}

const LIST_SOURCES: Record<string, () => Promise<ListItem[]>> = {
  popular: () => tmdbList('/movie/popular', 'movie'),
  now_playing: () => tmdbList('/movie/now_playing', 'movie'),
  upcoming: () => tmdbList('/movie/upcoming', 'movie'),
  top_rated: () => tmdbList('/movie/top_rated', 'movie'),
  tv_shows: () => tmdbList('/tv/popular', 'tv'),
  indian_movies: () => tmdbList('/discover/movie?with_original_language=hi&sort_by=popularity.desc&include_adult=false', 'movie'),
  // Jikan rate-limits shared build IPs: retry once, then fall back to TMDB Japanese animation.
  anime: async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const list = await jikanTopAnime();
        if (list.length) return list;
      } catch (e) {
        console.warn(`buildData: jikan attempt ${attempt + 1} failed: ${e}`);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    return tmdbList('/discover/tv?with_genres=16&with_original_language=ja&sort_by=vote_count.desc', 'tv');
  },
};

export async function loadBuildData(): Promise<BuildData> {
  const fixture = process.env.EUROFILM_DATA_FIXTURE;
  if (fixture) return JSON.parse(fs.readFileSync(fixture, 'utf8')) as BuildData;

  const lists: Record<string, ListItem[]> = {};
  const entries = Object.entries(LIST_SOURCES);
  const results = await Promise.allSettled(entries.map(([, fn]) => fn()));
  results.forEach((r, i) => {
    const key = entries[i][0];
    if (r.status === 'fulfilled') lists[key] = r.value;
    else console.warn(`buildData: ${key} failed: ${r.reason}`);
  });
  const news = await fetchNews().catch((e) => {
    console.warn(`buildData: news failed: ${e}`);
    return [] as Headline[];
  });
  return { lists, news };
}
