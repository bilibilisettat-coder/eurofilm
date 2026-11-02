// Movie pages at /movie/<title-slug>-<tmdb-id>: URL rules, TMDB fetch, and the server-rendered page (title, description, H1, trailer, JSON-LD).
// Shared by the build-time prerenderer (scripts/prerender.ts) and the Worker (src/worker.ts). Everything on a page comes from TMDB data or from
// EuroFilm's own review of the film; nothing is invented (no ratings of our own, no reviews, no fake counts).
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../data/routes';
import { esc, type PageSpec } from './pageShell';

export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMG = 'https://image.tmdb.org/t/p';
const TMDB_KEY = 'a9df3024ecdd6c3ed103bb998df53110'; // the same public v3 key the site already uses in the browser
export const MOVIE_BASE = '/movie';

export interface MovieData {
  id: number;
  title: string;
  releaseDate: string; // YYYY-MM-DD or ''
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number | null; // TMDB audience score out of 10, only when it has real votes
  voteCount: number;
  runtime: number | null;
  genres: string[];
  tagline: string;
  director: string;
  cast: string[];
  trailer: { key: string; name: string; publishedAt: string } | null;
}

/** lower-case ASCII, hyphens, at most ~50 characters of title (cut at a word) */
export function slugify(s: string, max = 50): string {
  const base = String(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length <= max) return base;
  const cut = base.slice(0, max + 1);
  const at = cut.lastIndexOf('-');
  return (at > 20 ? cut.slice(0, at) : base.slice(0, max)).replace(/-+$/, '');
}
export const movieSlug = (title: string, id: number) => `${slugify(title) || 'movie'}-${id}`;
export const moviePath = (title: string, id: number) => `${MOVIE_BASE}/${movieSlug(title, id)}`;
export const movieUrl = (title: string, id: number) => `${SITE_URL}${moviePath(title, id)}`;
/** /movie/<slug>-<id> -> { slug, id }, or null */
export function parseMoviePath(pathname: string): { slug: string; id: number } | null {
  const m = pathname.match(/^\/movie\/((?:[a-z0-9]+-)*?(\d{1,9}))\/?$/);
  return m ? { slug: m[1], id: Number(m[2]) } : null;
}

// ---------------------------------------------------------------- TMDB
export async function fetchMovie(id: number, signal?: AbortSignal): Promise<MovieData | null> {
  const res = await fetch(`${TMDB_BASE}/movie/${id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=videos,credits`, { signal, headers: { accept: 'application/json' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB ${res.status} for movie ${id}`);
  const d: any = await res.json();
  if (d.adult || !d.title) return null;
  const vids: any[] = (d.videos?.results || []).filter((v: any) => v.site === 'YouTube' && v.key);
  const trailers = vids.filter((v) => v.type === 'Trailer');
  const pick = trailers.find((v) => v.official) || trailers[0] || null;
  const crew: any[] = d.credits?.crew || [];
  return {
    id: d.id,
    title: String(d.title),
    releaseDate: String(d.release_date || ''),
    overview: String(d.overview || '').trim(),
    posterPath: d.poster_path || null,
    backdropPath: d.backdrop_path || null,
    rating: typeof d.vote_average === 'number' && d.vote_count >= 20 ? Math.round(d.vote_average * 10) / 10 : null,
    voteCount: Number(d.vote_count || 0),
    runtime: d.runtime ? Number(d.runtime) : null,
    genres: (d.genres || []).map((g: any) => String(g.name)),
    tagline: String(d.tagline || '').trim(),
    director: String(crew.find((c) => c.job === 'Director')?.name || ''),
    cast: (d.credits?.cast || []).slice(0, 6).map((c: any) => String(c.name)),
    trailer: pick ? { key: String(pick.key), name: String(pick.name || ''), publishedAt: String(pick.published_at || '') } : null,
  };
}

// ---------------------------------------------------------------- text
const year = (m: MovieData) => (m.releaseDate ? m.releaseDate.slice(0, 4) : '');
const long = (m: MovieData) => {
  if (!m.releaseDate) return '';
  const d = new Date(`${m.releaseDate}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? m.releaseDate : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};

/** <title>, 60 characters at most, brand only if it fits */
export function movieTitle(m: MovieData): string {
  const y = year(m);
  const options = [
    `${m.title}${y ? ` (${y})` : ''} Official Trailer | ${SITE_NAME}`,
    `${m.title}${y ? ` (${y})` : ''} Trailer | ${SITE_NAME}`,
    `${m.title} Trailer | ${SITE_NAME}`,
    `${m.title}${y ? ` (${y})` : ''} Trailer`,
    `${m.title} Trailer`,
  ];
  const hit = options.find((o) => o.length <= 60);
  if (hit) return hit;
  const cut = m.title.slice(0, 60).replace(/\s+\S*$/, '').replace(/[\s,;:&|-]+$/, '');
  return cut || m.title.slice(0, 60);
}

/** meta description, 120 to 160 characters: whole sentences of the TMDB overview, then facts from the same data; never cut mid-sentence */
export function movieDescription(m: MovieData): string {
  const stop = (t: string) => (/[.!?]$/.test(t) ? t : `${t}.`);
  let d = '';
  for (const part of m.overview.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean)) {
    const next = d ? `${d} ${stop(part)}` : stop(part);
    if (next.length > 160) break;
    d = next;
  }
  const extras: string[] = [];
  if (!d) extras.push(`${m.title}${year(m) ? ` (${year(m)})` : ''} official trailer, plot summary and cast.`);
  if (m.releaseDate) extras.push(`Released ${long(m)}.`);
  if (m.director) extras.push(`Directed by ${m.director}.`);
  if (m.genres.length) extras.push(`${m.genres.slice(0, 3).join(', ')}.`);
  extras.push(`Watch the official trailer on ${SITE_NAME}.`, `More trailers and reviews on ${SITE_NAME}.`);
  for (const e of extras) {
    if (d.length >= 120) break;
    if (`${d} ${e}`.length <= 160) d = `${d} ${e}`.trim();
  }
  return d;
}

// ---------------------------------------------------------------- page
export interface MoviePageOptions {
  indexable: boolean;
  review?: { slug: string; title: string } | null;
  shell: (main: string) => string; // site nav + footer, same as the other pages
}

export function buildMoviePage(m: MovieData, opts: MoviePageOptions): PageSpec {
  const url = movieUrl(m.title, m.id);
  const title = movieTitle(m);
  const description = movieDescription(m);
  const poster = m.posterPath ? `${TMDB_IMG}/w500${m.posterPath}` : null;
  const image = m.posterPath ? `${TMDB_IMG}/w780${m.posterPath}` : m.backdropPath ? `${TMDB_IMG}/w780${m.backdropPath}` : DEFAULT_OG_IMAGE;
  const y = year(m);
  const meta: string[] = [];
  if (m.releaseDate) meta.push(`<li>Release date: <time datetime="${esc(m.releaseDate)}">${esc(long(m))}</time></li>`);
  if (m.runtime) meta.push(`<li>Runtime: ${m.runtime} minutes</li>`);
  if (m.genres.length) meta.push(`<li>Genres: ${esc(m.genres.join(', '))}</li>`);
  if (m.director) meta.push(`<li>Directed by ${esc(m.director)}</li>`);
  if (m.cast.length) meta.push(`<li>Starring ${esc(m.cast.join(', '))}</li>`);
  if (m.rating !== null) meta.push(`<li>TMDB user rating: ${m.rating.toFixed(1)}/10 from ${m.voteCount.toLocaleString('en-US')} votes</li>`);
  const trailerHtml = m.trailer
    ? `<section><h2>Official trailer</h2><iframe src="https://www.youtube-nocookie.com/embed/${esc(m.trailer.key)}" title="${esc(m.title)} official trailer" width="560" height="315" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></section>`
    : '';
  const reviewHtml = opts.review ? `<p>Read the EuroFilm review: <a href="/blog/${esc(opts.review.slug)}">${esc(opts.review.title)}</a></p>` : '';
  const body = opts.shell(
    `<nav aria-label="Breadcrumb"><a href="/">${SITE_NAME}</a> / <a href="/">Movies</a> / <span>${esc(m.title)}</span></nav>` +
      `<article><h1>${esc(m.title)}${y ? ` (${esc(y)})` : ''}</h1>` +
      (m.tagline ? `<p><em>${esc(m.tagline)}</em></p>` : '') +
      (poster ? `<img src="${esc(poster)}" alt="${esc(m.title)} movie poster" width="300" height="450" loading="eager">` : '') +
      (meta.length ? `<ul>${meta.join('')}</ul>` : '') +
      trailerHtml +
      (m.overview ? `<section><h2>Plot summary</h2><p>${esc(m.overview)}</p></section>` : '') +
      reviewHtml +
      `</article><p><small>This product uses the TMDB API but is not endorsed or certified by <a href="https://www.themoviedb.org/" rel="noopener">TMDB</a>.</small></p>`,
  );
  const jsonLd: object[] = [
    {
      '@type': 'Movie',
      '@id': `${url}#movie`,
      url,
      name: m.title,
      description: m.overview || description,
      ...(poster || m.backdropPath ? { image: image } : {}),
      ...(m.releaseDate ? { datePublished: m.releaseDate } : {}),
      ...(m.genres.length ? { genre: m.genres } : {}),
      ...(m.director ? { director: { '@type': 'Person', name: m.director } } : {}),
      ...(m.cast.length ? { actor: m.cast.map((n) => ({ '@type': 'Person', name: n })) } : {}),
      ...(m.trailer && m.trailer.publishedAt ? { trailer: { '@id': `${url}#trailer` } } : {}),
    },
    ...(m.trailer && m.trailer.publishedAt
      ? [{
          '@type': 'VideoObject',
          '@id': `${url}#trailer`,
          name: `${m.title} official trailer`,
          description: m.overview || description,
          thumbnailUrl: [`https://i.ytimg.com/vi/${m.trailer.key}/hqdefault.jpg`],
          embedUrl: `https://www.youtube-nocookie.com/embed/${m.trailer.key}`,
          uploadDate: m.trailer.publishedAt,
        }]
      : []),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Movies', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 3, name: m.title, item: url },
      ],
    },
  ];
  return {
    url,
    title,
    description,
    ogType: 'video.movie',
    image,
    imageAlt: `${m.title} movie poster`,
    jsonLd,
    body,
    robots: opts.indexable ? undefined : 'noindex, follow',
  };
}
