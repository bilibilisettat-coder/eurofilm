import { BlogPost } from './blogData';

// Helper function to accurately verify word count
export function calculateWordCount(content: string[]): number {
  return content.join(' ').trim().split(/\s+/).filter(Boolean).length;
}

// Internal & External Link Templates for Rich Hyperlinking
export const BLOG_LINKS = {
  freeMovieStream: '<a href="/" class="text-amber-600 hover:text-amber-700 underline font-semibold">free movie stream</a>',
  popularCatalog: '<a href="/" class="text-amber-600 hover:text-amber-700 underline font-semibold">popular movies catalog</a>',
  animeTrailers: '<a href="/anime" class="text-amber-600 hover:text-amber-700 underline font-semibold">Anime Trailers & Top Series</a>',
  eurofilmBlog: '<a href="/blog" class="text-amber-600 hover:text-amber-700 underline font-semibold">EuroFilm Critical Blog</a>',
  imdb: '<a href="https://www.imdb.com" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:text-amber-700 underline font-medium">IMDb official records</a>',
  rottenTomatoes: '<a href="https://www.rottentomatoes.com" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:text-amber-700 underline font-medium">Rotten Tomatoes Tomatometer</a>',
  boxOfficeMojo: '<a href="https://www.boxofficemojo.com" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:text-amber-700 underline font-medium">Box Office Mojo financials</a>',
  letterboxd: '<a href="https://letterboxd.com" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:text-amber-700 underline font-medium">Letterboxd cinephile diary</a>',
  tmdb: '<a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:text-amber-700 underline font-medium">TMDB database</a>',
};
