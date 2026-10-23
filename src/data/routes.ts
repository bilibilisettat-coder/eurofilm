// Single source of truth for indexable URLs.
// Used by the app (routing, H1, meta), the build-time prerenderer and the sitemap generator.

export const SITE_URL = 'https://eurofilm.xyz';
export const SITE_NAME = 'EuroFilm';
export const CONTACT_EMAIL = 'contact@eurofilm.xyz';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-eurofilm-movie-trailers.jpg`;

export interface SectionRoute {
  tab: string;
  path: string;
  label: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  /** View renders its own <h1>; the app must not add another. */
  hasOwnH1?: boolean;
}

export const SECTION_ROUTES: SectionRoute[] = [
  {
    tab: 'popular',
    path: '/',
    label: 'Popular Movies',
    h1: 'Popular Movie Trailers Right Now',
    title: 'EuroFilm | Popular Movie Trailers, Reviews & What to Watch',
    description:
      'Watch official trailers for the most popular movies right now, with ratings, release dates, plot summaries and honest EuroFilm reviews.',
    intro:
      'EuroFilm tracks the movies people are watching this week. Browse official trailers, compare ratings and release dates, and read our longform reviews before you pick your next film.',
  },
  {
    tab: 'now_playing',
    path: '/now-playing',
    label: 'Now Playing',
    h1: 'Movies in Theaters Now',
    title: 'Movies in Theaters Now: Trailers & Showtimes Guide | EuroFilm',
    description:
      'See which movies are in theaters now. Official trailers, ratings, runtimes and release dates for every new release currently playing.',
    intro:
      'Every film currently in cinemas, with its official trailer, audience rating and release date, so you can decide what is worth a ticket this weekend.',
  },
  {
    tab: 'upcoming',
    path: '/upcoming',
    label: 'Upcoming Movies',
    h1: 'Upcoming Movies and New Trailers',
    title: 'Upcoming Movies 2026: New Trailers & Release Dates | EuroFilm',
    description:
      'The newest trailers for upcoming movies, with confirmed release dates and plot details for films arriving in theaters and on streaming soon.',
    intro:
      'New trailers land here first. Track release dates for the films coming to cinemas and streaming services over the next few months.',
  },
  {
    tab: 'top_rated',
    path: '/top-rated',
    label: 'Top Rated Movies',
    h1: 'Top Rated Movies of All Time',
    title: 'Top Rated Movies of All Time: Trailers & Ratings | EuroFilm',
    description:
      'The highest-rated movies of all time ranked by audience score, with official trailers, plot summaries and release years.',
    intro:
      'The films audiences rate highest, from classic cinema to modern favourites, each with its trailer and score so you can work through the essentials.',
  },
  {
    tab: 'anime',
    path: '/anime',
    label: 'Anime',
    h1: 'Anime Trailers and Top Anime Series',
    title: 'Best Anime Series & Anime Movie Trailers | EuroFilm',
    description:
      'Official trailers for the top-rated anime series and anime movies, with episode counts, scores, genres and synopses.',
    intro:
      'The best-rated anime series and films, from long-running shonen favourites to Studio Ghibli classics, with trailers, scores and episode counts.',
  },
  {
    tab: 'tv_shows',
    path: '/tv-shows',
    label: 'TV Shows',
    h1: 'Popular TV Shows and Series Trailers',
    title: 'Popular TV Shows: Series Trailers & Ratings | EuroFilm',
    description:
      'Trailers and ratings for the most popular TV shows and series right now, with first air dates and plot summaries.',
    intro:
      'The series everyone is talking about, with trailers, ratings and premiere dates to help you choose what to stream next.',
  },
  {
    tab: 'indian_movies',
    path: '/bollywood',
    label: 'Indian Movies',
    h1: 'Bollywood and Indian Movie Trailers',
    title: 'Bollywood & Indian Movie Trailers | EuroFilm',
    description:
      'Official trailers for new Bollywood and Indian movies, with release dates, cast and box office highlights.',
    intro:
      'New and popular Indian cinema in one place, from Bollywood blockbusters to Tamil and Telugu hits, with trailers and release dates.',
  },
  {
    tab: 'oscars',
    path: '/oscars',
    label: 'Oscars',
    h1: 'Oscar Winners: Best Picture and Academy Award History',
    title: 'Oscar Winners List: Best Picture & Academy Awards | EuroFilm',
    description:
      'Academy Award winners by year, including Best Picture, Best Director and acting winners, with trailers for each winning film.',
    intro:
      'A year-by-year record of Academy Award winners, with trailers for the films that took home Best Picture and the major acting prizes.',
    hasOwnH1: true,
  },
  {
    tab: 'top_news',
    path: '/news',
    label: 'Movie News',
    h1: 'Movie and Entertainment News',
    title: 'Movie News & Entertainment Headlines | EuroFilm',
    description:
      'The latest movie and entertainment news: casting, release dates, box office results and trailer drops.',
    intro:
      'Daily entertainment headlines covering casting news, release date changes, box office results and new trailer drops.',
    hasOwnH1: true,
  },
  {
    tab: 'eurofilm-blog',
    path: '/blog',
    label: 'EuroFilm Blog',
    h1: 'EuroFilm Blog: Movie Reviews and Film Essays',
    title: 'EuroFilm Blog: Movie Reviews & Film Essays',
    description:
      'Longform movie reviews and critical film essays on the biggest releases, from blockbusters to awards contenders.',
    intro:
      'Longform reviews and critical essays on the year’s biggest films. No star-rating shortcuts: each piece explains what works, what does not and why.',
    hasOwnH1: true,
  },
];

/** Old tab ids that should resolve to an indexable section. */
const TAB_ALIASES: Record<string, string> = {
  'most-popular-movies': 'popular',
  movies: 'popular',
  'india-movie-spotlight': 'indian_movies',
  'bollywood-movie-spotlight': 'indian_movies',
  'most-popular-tv-shows': 'tv_shows',
  tv: 'tv_shows',
  'movie-news': 'top_news',
  'imdb-podcasts': 'eurofilm-blog',
};

export function canonicalTab(tab: string): string {
  return TAB_ALIASES[tab] || tab;
}

export function sectionForTab(tab: string): SectionRoute | undefined {
  return SECTION_ROUTES.find((s) => s.tab === canonicalTab(tab));
}

export function sectionForPath(pathname: string): SectionRoute | undefined {
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  return SECTION_ROUTES.find((s) => s.path === clean);
}

export const BLOG_BASE = '/blog';
export function blogPath(slug: string): string {
  return `${BLOG_BASE}/${slug}`;
}
/** Returns the slug for /blog/<slug>, or null. */
export function blogSlugFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/blog\/([a-z0-9-]+)\/?$/);
  return m ? m[1] : null;
}

/** URL for a tab: indexable sections get their clean path, the rest stay on the home page. */
export function urlForTab(tab: string): string {
  const s = sectionForTab(tab);
  return s ? s.path : `/?tab=${encodeURIComponent(tab)}`;
}

/** Short <title> for an article (Google truncates around 60 chars); the full headline stays the H1. */
export function blogSeoTitle(title: string): string {
  // "Avatar: Fire and Ash – Pandora…" keeps the full film name; otherwise cut at the first colon.
  const beforeDash = title.split(/ – | - /)[0].trim();
  const film = beforeDash.length <= 30 && beforeDash !== title ? beforeDash : title.split(/:\s/)[0].trim();
  const full = `${film} Review | ${SITE_NAME}`;
  return full.length <= 60 ? full : `${film.slice(0, 60 - ` Review | ${SITE_NAME}`.length - 1).trim()}… Review | ${SITE_NAME}`;
}
