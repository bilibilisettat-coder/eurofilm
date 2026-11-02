// Worker in front of the static assets (dist/). It does what static assets cannot:
//  - 301 /?watch=<id> (and /now-playing?watch=<id>, ...) to /movie/<title-slug>-<id>, and a wrong slug to the right one
//  - serve /movie/ pages for movies that were not prerendered (noindex,follow, rendered from TMDB on demand)
//  - X-Robots-Tag: noindex on *.workers.dev so only eurofilm.xyz is indexed
import { renderPage } from './seo/pageShell';
import { buildMoviePage, fetchMovie, movieSlug, parseMoviePath } from './seo/movieSeo';

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
}

// Paths where ?watch=<id> means a TMDB movie id (anime and TV use other id spaces).
const MOVIE_WATCH_PATHS = new Set(['/', '/now-playing', '/upcoming', '/top-rated', '/bollywood']);
const HIDDEN = new Set(['/_shell.html', '/_movies.json']);
const SYNTHETIC_ID_FROM = 8_000_000;

type MovieMap = Record<string, string>;
let movieMap: Promise<MovieMap> | null = null;
const loadMap = (env: Env, origin: string): Promise<MovieMap> =>
  (movieMap ??= env.ASSETS.fetch(new Request(`${origin}/_movies.json`)).then((r): Promise<MovieMap> | MovieMap => (r.ok ? r.json() : {})).catch((): MovieMap => ({})));

// dist/404.html with a real 404 status
const notFound = async (env: Env, origin: string) => new Response((await env.ASSETS.fetch(new Request(`${origin}/404.html`))).body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
const redirect = (to: string) => new Response(null, { status: 301, headers: { Location: to, 'Cache-Control': 'public, max-age=3600' } });

async function handle(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  if (HIDDEN.has(path)) return notFound(env, url.origin);

  const watch = url.searchParams.get('watch');
  if (watch && /^\d{1,9}$/.test(watch) && MOVIE_WATCH_PATHS.has(path.replace(/\/$/, '') || '/') && Number(watch) < SYNTHETIC_ID_FROM) {
    const id = Number(watch);
    let slug = (await loadMap(env, url.origin))[watch];
    if (!slug) {
      const m = await fetchMovie(id, AbortSignal.timeout(5000)).catch(() => null);
      if (m) slug = movieSlug(m.title, id);
    }
    if (slug) return redirect(`/movie/${slug}`);
  }

  const parsed = parseMoviePath(path);
  if (parsed) {
    const known = (await loadMap(env, url.origin))[String(parsed.id)];
    if (known) return known === parsed.slug && !path.endsWith('/') ? env.ASSETS.fetch(req) : redirect(`/movie/${known}`);
    const movie = await fetchMovie(parsed.id, AbortSignal.timeout(5000)).catch(() => null);
    if (!movie) return notFound(env, url.origin);
    const slug = movieSlug(movie.title, movie.id);
    if (slug !== parsed.slug || path.endsWith('/')) return redirect(`/movie/${slug}`);
    const shell = await env.ASSETS.fetch(new Request(`${url.origin}/_shell.html`)).then((r) => r.text());
    const spec = buildMoviePage(movie, { indexable: false, review: null, shell: (main) => `<main>${main}</main>` });
    return new Response(renderPage(shell, spec), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  }
  return env.ASSETS.fetch(req);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const res = await handle(req, env);
    if (!new URL(req.url).hostname.endsWith('.workers.dev')) return res;
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return out;
  },
};
