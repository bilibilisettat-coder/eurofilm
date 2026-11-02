// Which TMDB movie each EuroFilm review is about (looked up on TMDB by title and year, October 2026). A movie with a review here gets an indexable
// /movie/ page that links to the review, and the review links back to the movie page.
export const REVIEW_MOVIES: Record<string, number> = {
  'the-odyssey-2026-review-cast': 1368337,
  'project-hail-mary-movie-review': 687163,
  'spider-man-brand-new-day-review': 969681,
  'avatar-fire-and-ash-review': 83533,
  'sinners-2025-review-cast': 1233413,
  'the-housemaid-movie-review': 1368166,
  'marty-supreme-review': 1317288,
  'superman-2025-review': 1061474,
  'weapons-movie-review': 1078605,
  'wicked-for-good-review': 967941,
  'mortal-kombat-2-review': 931285,
  'the-long-walk-movie-review': 604079,
};

export const reviewSlugForMovie = (id: number): string | null => Object.entries(REVIEW_MOVIES).find(([, mid]) => mid === id)?.[0] ?? null;
