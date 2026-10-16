import { Language, getTmdbLanguageCode } from '../i18n/translations';

const TMDB_API_KEY = 'a9df3024ecdd6c3ed103bb998df53110';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

let currentTmdbLanguage = 'en-US';

export function setTmdbLanguage(lang: Language) {
  currentTmdbLanguage = getTmdbLanguageCode(lang);
  cache.clear(); // Clear cache to allow fetching localized movie overviews
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult?: boolean;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieDetail extends Movie {
  videos?: {
    results: VideoResult[];
  };
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  recommendations?: {
    results: Movie[];
  };
  similar?: {
    results: Movie[];
  };
  tagline?: string;
  budget?: number;
  revenue?: number;
  status?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export const FALLBACK_POPULAR: Movie[] = [
  {
    id: 1561726,
    title: 'Masterplan',
    original_title: 'Masterplan',
    overview: 'When a legendary thief sets his sights on the Mona Lisa, he recruits two young strangers to help him before revealing they are long-lost siblings... and oh yes, by the way, he is their father. Thrown into a chaotic reunion, this new family must pull off the heist of the century.',
    poster_path: '/5xmXVd7nCK3tAo34XkO58SxUCip.jpg',
    backdrop_path: '/dgUDj84BWtW6EZzee8BkgKnjDhh.jpg',
    release_date: '2026-10-16',
    vote_average: 6.8,
    vote_count: 5,
    popularity: 110.9,
    genre_ids: [28, 53],
  },
  {
    id: 969681,
    title: 'Spider-Man: Brand New Day',
    original_title: 'Spider-Man: Brand New Day',
    overview: "Fighting crime full-time as Spider-Man in a world that doesn't remember him sparks a change in Peter Parker he may not have the power to control. But that transformation might also be the only thing that can stop a shocking new threat.",
    poster_path: '/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg',
    backdrop_path: '/4tjxYg2AbOzzG9G1YuiT2NzYhlH.jpg',
    release_date: '2026-07-29',
    vote_average: 8.5,
    vote_count: 5535,
    popularity: 713.4,
    genre_ids: [878, 28, 12],
  },
  {
    id: 1153576,
    title: 'Street Fighter',
    original_title: 'Street Fighter',
    overview: 'In 1993, estranged Street Fighters Ryu and Ken Masters are thrown back into combat when the mysterious Chun-Li recruits them for the next World Warrior Tournament: a brutal clash of fists, fate, and fury.',
    poster_path: '/dJPT2Uf12X6aFg8i5N67NTpIZ9t.jpg',
    backdrop_path: '/zDE9hd1SG9695YncbZGjSf7Z9Jk.jpg',
    release_date: '2026-10-13',
    vote_average: 6.4,
    vote_count: 34,
    popularity: 117.2,
    genre_ids: [28, 14],
  },
  {
    id: 1623256,
    title: 'The Storm',
    original_title: 'Stormen',
    overview: 'When a storm traps old university pals at a luxury lodge, their civilized birthday bash spirals into a cyclone of betrayals, grudges and unfiltered chaos.',
    poster_path: '/5YNjTi5AhbSM4hDOynJcgFfvKRn.jpg',
    backdrop_path: '/zN5mRDu6jOYt5EJGYGjhWgOGwor.jpg',
    release_date: '2026-10-15',
    vote_average: 8.3,
    vote_count: 10,
    popularity: 39.5,
    genre_ids: [35, 18],
  },
  {
    id: 1058424,
    title: 'Hope',
    original_title: '호프',
    overview: 'In the remote South Korean village of Hope Harbor, police chief Bum-seok and officer Sung-ae are called to investigate a mysterious creature wreaking havoc on the community.',
    poster_path: '/bcK5naYzzfY0JBCgrPrsrbV6NO1.jpg',
    backdrop_path: '/ujUwzNV8ZkOzZonvhhHsc9KOKDf.jpg',
    release_date: '2026-07-15',
    vote_average: 7.0,
    vote_count: 191,
    popularity: 214.2,
    genre_ids: [878, 9648, 28],
  },
  {
    id: 1288069,
    title: 'Tenzing',
    original_title: 'Tenzing',
    overview: 'A determined man embarks on a high-stakes quest—and defies seemingly impossible odds—to fulfill his dream of being the first to reach the summit of Mount Everest.',
    poster_path: '/eI0QW02PYqhnmIvLRdn9vrfVVP7.jpg',
    backdrop_path: '/wUe0QbbPDU2BD3L2QnsZlAr55Je.jpg',
    release_date: '2026-10-09',
    vote_average: 6.3,
    vote_count: 7,
    popularity: 70.5,
    genre_ids: [18, 36],
  },
  {
    id: 1381078,
    title: 'Love of Your Life',
    original_title: 'Love of Your Life',
    overview: 'After a chance encounter sparks a sweeping romance, Maya’s future is suddenly upended, sending her on an unexpected journey to love and live again.',
    poster_path: '/pJ8RXWNO7aB19B0tUvLQqXTt7Yo.jpg',
    backdrop_path: '/mqYqKvrKTgMvK50VtEDZlYFsnHz.jpg',
    release_date: '2026-10-07',
    vote_average: 6.5,
    vote_count: 40,
    popularity: 90.0,
    genre_ids: [10749, 18],
  },
  {
    id: 1255833,
    title: 'Whalefall',
    original_title: 'Whalefall',
    overview: 'Following the death of his father, Jay Gardiner goes diving off the central Coast of California in search of his remains, but is swallowed by a massive sperm whale with only one hour of oxygen left.',
    poster_path: '/vjTYUTgh9nO88i6HZ4YPRhiFL05.jpg',
    backdrop_path: '/shW2jHkQLZVv4Fko2rJDqTGU0gx.jpg',
    release_date: '2026-10-14',
    vote_average: 7.5,
    vote_count: 20,
    popularity: 67.2,
    genre_ids: [53],
  },
  {
    id: 1302904,
    title: 'Practical Magic 2',
    original_title: 'Practical Magic 2',
    overview: 'The Owens sisters must confront the dark curse that threatens to unravel their family once and for all.',
    poster_path: '/ogwQOLbCfncjvBhFb5l0OmQH8KC.jpg',
    backdrop_path: '/oIglj0Jy9duG4LnrRUpH8n001Pk.jpg',
    release_date: '2026-09-09',
    vote_average: 6.7,
    vote_count: 182,
    popularity: 142.9,
    genre_ids: [10749, 14, 35],
  },
  {
    id: 1284186,
    title: 'Sacrifice',
    original_title: 'Sacrifice',
    overview: 'During a star-studded charity gala brimming with celebrities and billionaires, a movie star in the midst of an existential crisis is taken hostage by a radical warrior.',
    poster_path: '/SGH7mlgfDyGgRCi2At62Ljg3zV.jpg',
    backdrop_path: '/oAUf1pvGlafCZVlEuPt1JyONHR1.jpg',
    release_date: '2026-04-09',
    vote_average: 5.7,
    vote_count: 33,
    popularity: 40.9,
    genre_ids: [12, 35, 28],
  },
  {
    id: 1234139,
    title: 'Jailer 2',
    original_title: 'ஜெயிலர் 2',
    overview: 'When a dangerous syndicate expands its reach to threaten his family’s peace, retired jailer Tiger Muthuvel Pandian goes undercover as a driver to protect his home.',
    poster_path: '/upwdEyhhYZ7pT2hD535fr2MGfpx.jpg',
    backdrop_path: '/zpHTOdRl7GEPqFsDGqsN6Hi9Ylt.jpg',
    release_date: '2026-10-14',
    vote_average: 8.0,
    vote_count: 4,
    popularity: 69.9,
    genre_ids: [28, 35],
  },
  {
    id: 1400940,
    title: 'Clayface',
    original_title: 'Clayface',
    overview: 'Matt Hagen’s meteoric rise from Gotham street kid to Hollywood leading man is tragically cut short when a local crime boss leaves him disfigured, leading to a path of revenge.',
    poster_path: '/5jCpQnWPikggmQZoDp1eAi6BI6w.jpg',
    backdrop_path: '/kVtOcoUJ68chBD2tmERkdWz7lK5.jpg',
    release_date: '2026-10-21',
    vote_average: 8.6,
    vote_count: 6,
    popularity: 41.6,
    genre_ids: [27, 53, 878],
  },
];

const FALLBACK_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
];

// In-memory cache to enhance performance and meet GTmetrix speed standards
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const urlParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: currentTmdbLanguage,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${urlParams.toString()}`;

  // Check cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

export const FALLBACK_ANIME_MOVIES: Movie[] = [
  {
    id: 129,
    title: 'Spirited Away',
    original_title: '千と千尋の神隠し',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: '/bQXAqRx2Fgc46uCVWgo36554urO.jpg',
    release_date: '2001-07-20',
    vote_average: 8.5,
    vote_count: 16500,
    popularity: 92.4,
    genre_ids: [16, 10751, 14],
  },
  {
    id: 372058,
    title: 'Your Name.',
    original_title: '君の名は。',
    overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives until they suddenly switch places. Their connection becomes even more complex when the boy and girl decide to meet in person.',
    poster_path: '/q719jXXEzOoYaps6qFsC8llRaQ.jpg',
    backdrop_path: '/dIWwZW7dJJ1742qSYElLqYYr3Ka.jpg',
    release_date: '2016-08-26',
    vote_average: 8.5,
    vote_count: 11200,
    popularity: 88.0,
    genre_ids: [16, 18, 10749],
  },
  {
    id: 916224,
    title: 'Suzume',
    original_title: 'すずめの戸締まり',
    overview: 'Suzume, a 17-year-old girl who lives in a quiet town, meets a young man traveling on a journey in search of mystical doors. Together, they embark on an emotional adventure across Japan to prevent disaster.',
    poster_path: '/vIeu8WysZrTS7vxajZwYJy4Gv7Y.jpg',
    backdrop_path: '/7TNYdE3gZ2bB4m42D6W81lG7fA8.jpg',
    release_date: '2022-11-11',
    vote_average: 8.0,
    vote_count: 2100,
    popularity: 85.5,
    genre_ids: [16, 12, 14],
  },
  {
    id: 508883,
    title: 'The Boy and the Heron',
    original_title: '君たちはどう生きるか',
    overview: 'While the Second World War rages, teenage Mahito struggles with grief and relocates to the countryside where he encounters a talking heron and enters a fantastical world shared by the living and the dead.',
    poster_path: '/jDQPkg03xd3ywmtPh9qp9JR29ht.jpg',
    backdrop_path: '/5Eip60UDiPLASyKjmHsvruggga4.jpg',
    release_date: '2023-07-14',
    vote_average: 7.5,
    vote_count: 1950,
    popularity: 76.2,
    genre_ids: [16, 12, 14],
  },
  {
    id: 635302,
    title: 'Demon Slayer: Mugen Train',
    original_title: '劇場版「鬼滅の刃」無限列車編',
    overview: 'Tanjiro and the group have completed their rehabilitation training and arrive at their next mission on the Mugen Train, where over 40 people have disappeared in a very short period of time.',
    poster_path: '/h8Rb9gBr48ODIwYUttZNYeMWeoc.jpg',
    backdrop_path: '/xPpXYnCWcuZ3nG0RpHryOz4LtKX.jpg',
    release_date: '2020-10-16',
    vote_average: 8.3,
    vote_count: 3800,
    popularity: 84.1,
    genre_ids: [16, 28, 12, 14],
  },
  {
    id: 4935,
    title: "Howl's Moving Castle",
    original_title: 'ハウルの動く城',
    overview: 'Sophie, a young milliner, is cursed with the body of an old woman by a spiteful witch. Her only chance of breaking the spell lies with a self-indulgent yet talented young wizard named Howl and his walking castle.',
    poster_path: '/6pT915r1G8114oFmX335D2u3F8o.jpg',
    backdrop_path: '/8Ue6Wj7Wb1cE8F6rX8t9g0sF1a.jpg',
    release_date: '2004-11-20',
    vote_average: 8.4,
    vote_count: 9800,
    popularity: 79.5,
    genre_ids: [16, 14, 12],
  },
  {
    id: 8392,
    title: 'My Neighbor Totoro',
    original_title: 'となりのトトロ',
    overview: 'Two sisters move to the country with their father to be closer to their hospitalized mother and discover that the surrounding trees are inhabited by friendly forest spirits called Totoros.',
    poster_path: '/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg',
    backdrop_path: '/2lBOcnhggrk2aL0m3lJv9mB7o.jpg',
    release_date: '1988-04-16',
    vote_average: 8.1,
    vote_count: 7700,
    popularity: 72.8,
    genre_ids: [16, 10751, 14],
  },
  {
    id: 378064,
    title: 'A Silent Voice: The Movie',
    original_title: '映画 聲の形',
    overview: 'Shoya Ishida starts bullying the deaf Shoko Nishimiya in elementary school. Years later, haunted by his past behavior, he seeks her out to make amends and finds redemption through friendship.',
    poster_path: '/tuFaWiqX0TXRWuNWKu7Ir8rbMGv.jpg',
    backdrop_path: '/5LpqNn9Q3D8y7m9uK0sL7.jpg',
    release_date: '2016-09-17',
    vote_average: 8.4,
    vote_count: 4100,
    popularity: 70.0,
    genre_ids: [16, 18],
  },
  {
    id: 610150,
    title: 'Dragon Ball Super: Super Hero',
    original_title: 'ドラゴンボール超 スーパーヒーロー',
    overview: 'The Red Ribbon Army from Goku past has returned with newly designed androids, Gamma 1 and Gamma 2, seeking vengeance. Piccolo and Gohan rise to protect Earth.',
    poster_path: '/rugyJfaCrAnsrFlhKJKPlDTvvRF.jpg',
    backdrop_path: '/ugS5xPkJOOXBYx0bduu7m7yUbe.jpg',
    release_date: '2022-06-11',
    vote_average: 7.9,
    vote_count: 2900,
    popularity: 78.0,
    genre_ids: [16, 28, 878],
  },
  {
    id: 900667,
    title: 'One Piece Film: Red',
    original_title: 'ONE PIECE FILM RED',
    overview: 'Uta, the most beloved singer in the world, renowned for concealing her identity, is about to reveal herself to the world at a live concert on the island of Elegia.',
    poster_path: '/m80kPdrmmtEh9whLekL1iexMR4m.jpg',
    backdrop_path: '/7ZO9596hIq5WfGjJ2m8sL1.jpg',
    release_date: '2022-08-06',
    vote_average: 7.3,
    vote_count: 1400,
    popularity: 71.5,
    genre_ids: [16, 28, 12],
  },
];

export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'day',
  page = 1
): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>(
      `/trending/movie/${timeWindow}`,
      { page: String(page) }
    );
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data;
    }
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  } catch (err) {
    console.warn('Using fallback trending movies:', err);
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  }
}

export async function getLatestMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    const [trending, nowPlaying] = await Promise.allSettled([
      getTrendingMovies('day', page),
      fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/movie/now_playing', { page: String(page) }),
    ]);

    const results: Movie[] = [];
    const seen = new Set<number>();

    if (trending.status === 'fulfilled' && trending.value.results) {
      for (const m of trending.value.results) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          results.push(m);
        }
      }
    }

    if (nowPlaying.status === 'fulfilled' && nowPlaying.value.results) {
      for (const m of nowPlaying.value.results) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          results.push(m);
        }
      }
    }

    if (results.length > 0) {
      return { results, total_pages: 10 };
    }
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  } catch (err) {
    console.warn('Error fetching latest movies:', err);
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  }
}

export async function getPopularMovies(page = 1, count = 25): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    // When on page 1, always fetch latest trending & now playing movies so homepage displays freshest latest movies
    if (page === 1) {
      try {
        const [trendingData, popularData] = await Promise.allSettled([
          fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/trending/movie/day', { page: '1' }),
          fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/movie/now_playing', { page: '1' }),
        ]);

        const combined: Movie[] = [];
        const seen = new Set<number>();

        if (trendingData.status === 'fulfilled' && trendingData.value.results) {
          for (const m of trendingData.value.results) {
            if (!seen.has(m.id)) {
              seen.add(m.id);
              combined.push(m);
            }
          }
        }

        if (popularData.status === 'fulfilled' && popularData.value.results) {
          for (const m of popularData.value.results) {
            if (!seen.has(m.id)) {
              seen.add(m.id);
              combined.push(m);
            }
          }
        }

        if (combined.length > 0) {
          const totalPages =
            trendingData.status === 'fulfilled' ? trendingData.value.total_pages : 50;
          return { results: combined.slice(0, Math.max(count, combined.length)), total_pages: totalPages };
        }
      } catch {
        // fallback to standard popular
      }
    }

    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/movie/popular', { page: String(page) });
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      if (count > 20 && page === 1) {
        try {
          const page2 = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/movie/popular', { page: '2' });
          if (page2 && Array.isArray(page2.results)) {
            const combined = [...data.results, ...page2.results].slice(0, count);
            return { results: combined, total_pages: data.total_pages };
          }
        } catch {
          // keep page 1
        }
      }
      return data;
    }
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  } catch (err) {
    console.warn('Using fallback popular movies:', err);
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  }
}

export async function getAnimeMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/discover/movie', {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
      page: String(page),
    });
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      // Merge with fallback verified classics if on page 1 so Spirited Away & Your Name always appear
      if (page === 1) {
        const combined = [...data.results];
        for (const item of FALLBACK_ANIME_MOVIES) {
          if (!combined.some((c) => c.id === item.id || c.title.toLowerCase() === item.title.toLowerCase())) {
            combined.push(item);
          }
        }
        return { results: combined, total_pages: Math.max(data.total_pages, 10) };
      }
      return data;
    }
    return { results: FALLBACK_ANIME_MOVIES, total_pages: 5 };
  } catch (err) {
    console.warn('Using fallback anime movies:', err);
    return { results: FALLBACK_ANIME_MOVIES, total_pages: 5 };
  }
}

export async function getNowPlayingMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/movie/now_playing', { page: String(page) });
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data;
    }
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  } catch (err) {
    console.warn('Using fallback now playing movies:', err);
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  }
}

export async function getTopRatedMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/movie/top_rated', { page: String(page) });
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data;
    }
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  } catch (err) {
    console.warn('Using fallback top rated movies:', err);
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  }
}

export async function getUpcomingMovies(page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  try {
    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/movie/upcoming', { page: String(page) });
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data;
    }
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  } catch (err) {
    console.warn('Using fallback upcoming movies:', err);
    return { results: FALLBACK_POPULAR, total_pages: 1 };
  }
}

export async function searchMovies(query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  if (!query.trim()) return { results: [], total_pages: 0 };
  try {
    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number }>('/search/movie', {
      query: query.trim(),
      page: String(page),
    });
    if (data && Array.isArray(data.results)) {
      return data;
    }
    return { results: [], total_pages: 0 };
  } catch (err) {
    console.warn('Search fallback error:', err);
    const filtered = FALLBACK_POPULAR.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    return { results: filtered, total_pages: 1 };
  }
}

export async function getMovieVideos(movieId: number): Promise<VideoResult[]> {
  try {
    const data = await fetchFromTMDB<{ results: VideoResult[] }>(`/movie/${movieId}/videos`);
    return data.results || [];
  } catch {
    return [];
  }
}

export async function getMovieDetails(movieId: number): Promise<MovieDetail> {
  return fetchFromTMDB<MovieDetail>(`/movie/${movieId}`, {
    append_to_response: 'videos,credits,recommendations,similar',
  });
}

export async function discoverMovies(
  page = 1,
  sortBy = 'popularity.desc',
  withGenres?: number
): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: sortBy,
    'vote_count.gte': '15',
  };
  if (withGenres) params.with_genres = String(withGenres);

  try {
    const data = await fetchFromTMDB<{ results: Movie[]; total_pages: number; total_results: number }>(
      '/discover/movie',
      params
    );
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data;
    }
    return { results: FALLBACK_POPULAR, total_pages: 500, total_results: 10000 };
  } catch (err) {
    console.warn('Discover fallback error:', err);
    return { results: FALLBACK_POPULAR, total_pages: 500, total_results: 10000 };
  }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const data = await fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
    if (data && Array.isArray(data.genres)) {
      return data.genres;
    }
    return FALLBACK_GENRES;
  } catch {
    return FALLBACK_GENRES;
  }
}

export function getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342'): string {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string {
  if (!path) return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&auto=format&fit=crop&q=80';
  return `${IMAGE_BASE_URL}/${size}${path}`;
}
