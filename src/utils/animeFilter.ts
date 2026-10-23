import { AnimeItem } from '../services/externalApis';

/**
 * Requirement 2:
 * When users choose Anime Trailers & Top Series, display only cartoons/animes.
 * If can't decide use an internal website keyword filter to display results that using
 * or having similar keywords to: anime, children, child, boy, girl, manga and toddler, cartoon.
 */

export const ANIME_FILTER_KEYWORDS = [
  'anime',
  'children',
  'child',
  'boy',
  'girl',
  'manga',
  'toddler',
  'cartoon',
  'animation',
  'animated',
  'otaku',
  'shonen',
  'shoujo',
  'seinen',
  'chibi',
  'ghibli',
  'toon',
  'disney animation',
  'pixar',
];

export function isAnimeOrCartoon(item: {
  title?: string;
  titleEnglish?: string;
  original_title?: string;
  synopsis?: string;
  overview?: string;
  genres?: string[] | number[];
}): boolean {
  const title = (item.title || item.titleEnglish || item.original_title || '').toLowerCase();
  const synopsis = (item.synopsis || item.overview || '').toLowerCase();
  const genresStr = Array.isArray(item.genres)
    ? item.genres.map((g) => (typeof g === 'string' ? g.toLowerCase() : String(g))).join(' ')
    : '';

  // 1. Direct genre check for animation / anime / cartoon / manga
  if (
    genresStr.includes('anime') ||
    genresStr.includes('animation') ||
    genresStr.includes('cartoon') ||
    genresStr.includes('manga') ||
    genresStr.includes('16') // TMDB genre 16 = Animation
  ) {
    return true;
  }

  // 2. Specific verified cartoons & animes
  const famousAnimeCartoons = [
    'simpsons',
    'demon slayer',
    'attack on titan',
    'jujutsu kaisen',
    'spirited away',
    'one piece',
    'naruto',
    'dragon ball',
    'my hero academia',
    'pokemon',
    'spider-verse',
    'zootopia',
    'toy story',
    'chainsaw man',
    'bleach',
    'death note',
    'hunter x hunter',
    'sailor moon',
    'avatar: the last airbender',
    'family guy',
    'south park',
    'rick and morty',
    'spongebob',
    'looney tunes',
    'tom and jerry',
    'shrek',
    'frozen',
    'moana',
    'inside out',
  ];

  if (famousAnimeCartoons.some((term) => title.includes(term))) {
    return true;
  }

  // 3. Fallback: Internal website keyword filter (anime, children, child, boy, girl, manga, toddler, cartoon)
  const fullText = `${title} ${synopsis} ${genresStr}`;
  const matchesKeyword = ANIME_FILTER_KEYWORDS.some((kw) => {
    const regex = new RegExp(`\\b${kw}`, 'i');
    return regex.test(fullText);
  });

  return matchesKeyword;
}

/**
 * Filter an array of AnimeItems or any media items strictly to cartoons/animes only
 */
export function filterOnlyCartoonsAndAnimes(items: AnimeItem[]): AnimeItem[] {
  return items.filter((item) =>
    isAnimeOrCartoon({
      title: item.title,
      titleEnglish: item.titleEnglish,
      synopsis: item.synopsis,
      genres: item.genres,
    })
  );
}
