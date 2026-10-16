// External multi-API integration service:
// 1. Jikan API v4 + Curated Anime (with Souryo to Majiwaru Shikiyoku, The Simpsons, Demon Slayer, etc.)
// 2. TV Shows (Watch What Happens Live with Andy Cohen, Tonight Show, Jimmy Kimmel, SNL, etc.)
// 3. TV Series (Game of Thrones, Breaking Bad, Stranger Things, Succession, etc.)
// 4. TMDB Indian Cinema API (Bollywood, Tollywood, Kollywood)
// 5. TMDB Popular People API (Trending Celebs & StarMeter)
// 6. Live RSS Movie News Feeds

import { Movie } from './tmdb';

const TMDB_KEY = 'a9df3024ecdd6c3ed103bb998df53110';

export interface AnimeItem {
  id: number;
  title: string;
  titleEnglish?: string;
  synopsis: string;
  imageUrl: string;
  trailerYoutubeId?: string;
  score?: number;
  year?: number;
  episodes?: number;
  genres: string[];
  status?: string;
}

export interface TVShowItem {
  id: number;
  title: string;
  overview: string;
  imageUrl: string;
  backdropUrl?: string;
  voteAverage: number;
  firstAirDate?: string;
  genres: string[];
  tmdbId?: number;
}

export interface CelebPerson {
  id: number;
  name: string;
  popularity: number;
  profilePath: string | null;
  knownForDepartment: string;
  knownFor: string[];
}

export interface ExternalNewsArticle {
  id: string;
  title: string;
  summary: string;
  pubDate: string;
  link: string;
  source: string;
  imageUrl: string;
}

import { filterOnlyCartoonsAndAnimes } from '../utils/animeFilter';

// 1. Fetch Anime & Anime Trailers (Anime Movies + Series from TMDB & Jikan v4)
export async function fetchTopAnime(page = 1): Promise<AnimeItem[]> {
  try {
    // 1A. Fetch TMDB Japanese Anime Movies to guarantee genuine theatrical anime movies
    let tmdbAnimeMovies: AnimeItem[] = [];
    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=${page}`
      );
      if (tmdbRes.ok) {
        const tmdbData = await tmdbRes.json();
        if (Array.isArray(tmdbData.results)) {
          tmdbAnimeMovies = tmdbData.results.map((m: any) => ({
            id: m.id + 8000000,
            title: m.title,
            titleEnglish: m.original_title,
            synopsis: m.overview || 'Acclaimed Japanese anime theatrical release.',
            imageUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
            trailerYoutubeId: undefined,
            score: m.vote_average || 8.5,
            year: m.release_date ? new Date(m.release_date).getFullYear() : 2024,
            episodes: 1,
            genres: ['Anime Movie', 'Animation', 'Japanese Cinema'],
            status: 'Released in Theaters',
          }));
        }
      }
    } catch {
      // Continue to Jikan and Curated
    }

    // 1B. Fetch Jikan anime
    let jikanList: AnimeItem[] = [];
    try {
      const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          jikanList = data.data.map((item: any) => ({
            id: item.mal_id,
            title: item.title_english || item.title,
            titleEnglish: item.title_english,
            synopsis: item.synopsis || 'Popular anime streaming worldwide.',
            imageUrl: item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || '',
            trailerYoutubeId: item.trailer?.youtube_id || undefined,
            score: item.score || 8.5,
            year: item.year || (item.aired?.from ? new Date(item.aired.from).getFullYear() : 2024),
            episodes: item.type === 'Movie' ? 1 : item.episodes || 12,
            genres: item.type === 'Movie'
              ? ['Anime Movie', ...(item.genres?.map((g: any) => g.name) || [])]
              : item.genres?.map((g: any) => g.name) || ['Anime', 'Action'],
            status: item.status || 'Finished Airing',
          }));
        }
      }
    } catch {
      // Continue
    }

    // Combine top curated anime movies + TMDB anime movies + Jikan list
    const combined: AnimeItem[] = [...CURATED_ANIME_LIST];

    for (const m of tmdbAnimeMovies) {
      if (!combined.some((c) => c.title.toLowerCase() === m.title.toLowerCase())) {
        combined.push(m);
      }
    }

    for (const item of jikanList) {
      if (!combined.some((c) => c.id === item.id || c.title.toLowerCase() === item.title.toLowerCase())) {
        combined.push(item);
      }
    }

    return filterOnlyCartoonsAndAnimes(combined);
  } catch (err) {
    console.warn('Anime fetch error, using curated anime movies & series:', err);
    return filterOnlyCartoonsAndAnimes(CURATED_ANIME_LIST);
  }
}

// 2. Fetch TV Shows (Talk shows, late night, reality TV, broadcast variety - showing MORE TV shows)
export async function fetchTalkAndVarietyTVShows(page = 1): Promise<TVShowItem[]> {
  try {
    // Query TMDB for popular talk shows, reality, and broadcast television (genres 10767, 10764, 10763)
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_genres=10767,10764,10763&sort_by=popularity.desc&page=${page}`
    );
    let liveShows: TVShowItem[] = [];
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        liveShows = data.results.map((item: any) => ({
          id: item.id,
          title: item.name,
          overview: item.overview || 'Popular television broadcast show.',
          imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
          backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : undefined,
          voteAverage: item.vote_average || 7.8,
          firstAirDate: item.first_air_date || '2024',
          genres: ['Talk Show', 'Variety TV', 'Broadcast'],
          tmdbId: item.id,
        }));
      }
    }

    // Merge curated comprehensive TV shows with liveShows to show plenty of TV shows
    const merged: TVShowItem[] = [...TALK_AND_VARIETY_TV_SHOWS];
    for (const s of liveShows) {
      if (!merged.some((m) => m.id === s.id || m.title.toLowerCase() === s.title.toLowerCase())) {
        merged.push(s);
      }
    }
    return merged;
  } catch {
    return TALK_AND_VARIETY_TV_SHOWS;
  }
}

// 3. Fetch Scripted Dramatic TV Series (Game of Thrones, Breaking Bad, Stranger Things, etc.)
export async function fetchScriptedSeries(page = 1): Promise<TVShowItem[]> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_genres=18,10765&sort_by=popularity.desc&page=${page}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results.map((item: any) => ({
          id: item.id,
          title: item.name,
          overview: item.overview || 'Acclaimed dramatic television series.',
          imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500',
          backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : undefined,
          voteAverage: item.vote_average || 8.4,
          firstAirDate: item.first_air_date || '2023',
          genres: ['Dramatic Series', 'Television'],
          tmdbId: item.id,
        }));
      }
    }
    return SCRIPTED_SERIES_SHOWS;
  } catch {
    return SCRIPTED_SERIES_SHOWS;
  }
}

// 4. Backward-compatible popular TV alias
export async function fetchPopularTVShows(page = 1): Promise<TVShowItem[]> {
  return fetchTalkAndVarietyTVShows(page);
}

export async function fetchTop250TVShows(): Promise<TVShowItem[]> {
  return fetchScriptedSeries(1);
}

// 5. Fetch Indian Cinema Releases
export async function fetchIndianMovies(page = 1, sortBy = 'popularity.desc'): Promise<Movie[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_origin_country=IN&sort_by=${sortBy}&vote_count.gte=50&page=${page}`
    );
    if (!res.ok) throw new Error('Indian movies fetch failed');
    const data = await res.json();
    return data.results && data.results.length > 0 ? data.results : FALLBACK_INDIAN_MOVIES;
  } catch (err) {
    console.warn('Indian movies fetch error, using fallback:', err);
    return FALLBACK_INDIAN_MOVIES;
  }
}

// 6. Fetch Trending People (StarMeter)
export async function fetchTrendingPeople(page = 1): Promise<CelebPerson[]> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${TMDB_KEY}&page=${page}`);
    if (!res.ok) throw new Error('Popular people fetch error');
    const data = await res.json();
    return data.results.map((p: any) => ({
      id: p.id,
      name: p.name,
      popularity: p.popularity,
      profilePath: p.profile_path ? `https://image.tmdb.org/t/p/w342${p.profile_path}` : null,
      knownForDepartment: p.known_for_department || 'Acting',
      knownFor: p.known_for?.map((k: any) => k.title || k.name).filter(Boolean) || [],
    }));
  } catch {
    return [];
  }
}

// 7. Fetch Live Movie News from Free RSS Feeds
export async function fetchLiveMovieNews(): Promise<ExternalNewsArticle[]> {
  try {
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fdeadline.com%2Fv%2Ffilm%2Ffeed%2F');
    if (!res.ok) throw new Error('RSS fetch error');
    const data = await res.json();
    if (data.status === 'ok' && Array.isArray(data.items)) {
      return data.items.slice(0, 12).map((item: any, i: number) => ({
        id: `rss-${i}`,
        title: item.title,
        summary: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : '',
        pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Today',
        link: item.link,
        source: 'Deadline Hollywood Film',
        imageUrl: item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
      }));
    }
    return FALLBACK_RSS_NEWS;
  } catch {
    return FALLBACK_RSS_NEWS;
  }
}

// Curated Anime Collection
export const CURATED_ANIME_LIST: AnimeItem[] = [
  {
    id: 34823,
    title: 'Souryo to Majiwaru Shikiyoku',
    titleEnglish: 'Souryo to Majiwaru Shikiyoku no Yoru ni...',
    synopsis: 'Mio reunites with her former school crush Kujo at a reunion, finding that he has inherited his family temple as a monk. An undeniable forbidden passion blooms behind sacred walls.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
    trailerYoutubeId: 'v8y2bSflq2A',
    score: 7.5,
    year: 2017,
    episodes: 12,
    genres: ['Romance', 'Ecchi', 'Drama', 'Anime Short'],
    status: 'Finished Airing',
  },
  {
    id: 99901,
    title: 'The Simpsons',
    titleEnglish: 'The Simpsons: Animation & Anime Parody',
    synopsis: 'The iconic satirical adventures of the Simpson family in Springfield, renowned for groundbreaking animation milestones and legendary anime parody episodes including the Death Tome special.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    trailerYoutubeId: 'HRqW5d3q0R0',
    score: 8.7,
    year: 1989,
    episodes: 770,
    genres: ['Animation', 'Comedy', 'Satire'],
    status: 'Currently Airing',
  },
  {
    id: 199,
    title: 'Spirited Away',
    titleEnglish: 'Sen to Chihiro no Kamikakushi',
    synopsis: 'Hayao Miyazaki Academy Award-winning theatrical masterpiece following young Chihiro trapped in an enchanted spirit realm.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    trailerYoutubeId: 'ByXuk9QqQkk',
    score: 8.9,
    year: 2001,
    episodes: 1,
    genres: ['Anime Movie', 'Animation', 'Adventure', 'Family'],
    status: 'Released in Theaters',
  },
  {
    id: 32281,
    title: 'Your Name.',
    titleEnglish: 'Kimi no Na wa',
    synopsis: 'Makoto Shinkai global sensation anime film where two high schoolers across Japan mysteriously swap bodies and search across time.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6qFsC8llRaQ.jpg',
    trailerYoutubeId: 'xU47nhruN-Q',
    score: 8.9,
    year: 2016,
    episodes: 1,
    genres: ['Anime Movie', 'Romance', 'Supernatural', 'Drama'],
    status: 'Released in Theaters',
  },
  {
    id: 916224,
    title: 'Suzume',
    titleEnglish: 'Suzume no Tojimari',
    synopsis: 'A 17-year-old girl journeys across Japan alongside a mystical traveling guardian to lock supernatural disaster doors.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/vIeu8WysZrTS7vxajZwYJy4Gv7Y.jpg',
    trailerYoutubeId: 'FV3bqvOHRQo',
    score: 8.5,
    year: 2022,
    episodes: 1,
    genres: ['Anime Movie', 'Animation', 'Adventure', 'Fantasy'],
    status: 'Released in Theaters',
  },
  {
    id: 635302,
    title: 'Demon Slayer: Mugen Train (The Movie)',
    titleEnglish: 'Kimetsu no Yaiba: Mugen Ressha-hen',
    synopsis: 'Tanjiro, Nezuko, and the Flame Hashira Kyojuro Rengoku battle demon Enmu aboard the speeding Mugen Train in historic cinema blockbuster.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODIwYUttZNYeMWeoc.jpg',
    trailerYoutubeId: 'bFwdl2PPPXM',
    score: 8.8,
    year: 2020,
    episodes: 1,
    genres: ['Anime Movie', 'Action', 'Supernatural'],
    status: 'Released in Theaters',
  },
  {
    id: 810693,
    title: 'Jujutsu Kaisen 0: The Movie',
    titleEnglish: 'Jujutsu Kaisen 0',
    synopsis: 'Yuta Okkotsu enrolls in Tokyo Jujutsu High after being haunted by his childhood friend Rika cursed spirit in theatrical prequel blockbuster.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/3pTwMAnsELubKnHGMWXxNVSaNF4.jpg',
    trailerYoutubeId: '2docezNyH5k',
    score: 8.7,
    year: 2021,
    episodes: 1,
    genres: ['Anime Movie', 'Action', 'Fantasy'],
    status: 'Released in Theaters',
  },
  {
    id: 508883,
    title: 'The Boy and the Heron',
    titleEnglish: 'Kimitachi wa Dou Ikiru ka',
    synopsis: 'Hayao Miyazaki Academy Award-winning film chronicling Mahito emotional odyssey into a fantastical realm with a talking grey heron.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/jDQPkg03xd3ywmtPh9qp9JR29ht.jpg',
    trailerYoutubeId: 'f7EDFdA8UVg',
    score: 8.6,
    year: 2023,
    episodes: 1,
    genres: ['Anime Movie', 'Animation', 'Adventure', 'Fantasy'],
    status: 'Released in Theaters',
  },
  {
    id: 4935,
    title: "Howl's Moving Castle",
    titleEnglish: 'Howl no Ugoku Shiro',
    synopsis: 'Sophie seeks refuge in wizard Howl magical walking castle after an envious witch curses her with an elderly body.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/6pT915r1G8114oFmX335D2u3F8o.jpg',
    trailerYoutubeId: 'iwROgK94zcM',
    score: 8.8,
    year: 2004,
    episodes: 1,
    genres: ['Anime Movie', 'Animation', 'Fantasy', 'Romance'],
    status: 'Released in Theaters',
  },
  {
    id: 378064,
    title: 'A Silent Voice: The Movie',
    titleEnglish: 'Koe no Katachi',
    synopsis: 'A former elementary school bully seeks redemption and reconciliation with a deaf classmate in emotionally profound cinema.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/tuFaWiqX0TXRWuNWKu7Ir8rbMGv.jpg',
    trailerYoutubeId: 'nfK6UgLra7g',
    score: 8.9,
    year: 2016,
    episodes: 1,
    genres: ['Anime Movie', 'Drama', 'Romance'],
    status: 'Released in Theaters',
  },
  {
    id: 523,
    title: 'My Neighbor Totoro',
    titleEnglish: 'Tonari no Totoro',
    synopsis: 'Two young sisters explore their rural countryside house and make friends with ancient forest spirits led by Totoro.',
    imageUrl: 'https://image.tmdb.org/t/p/w500/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg',
    trailerYoutubeId: '92a7Hj0ijLs',
    score: 8.7,
    year: 1988,
    episodes: 1,
    genres: ['Anime Movie', 'Animation', 'Family', 'Fantasy'],
    status: 'Released in Theaters',
  },
  {
    id: 38000,
    title: 'Demon Slayer: Kimetsu no Yaiba - Infinity Castle',
    titleEnglish: 'Demon Slayer: Kimetsu no Yaiba',
    synopsis: 'Tanjiro and the Demon Slayer Corps plunge into the labyrinthine Infinity Castle for the decisive theatrical war against the Demon King Muzan Kibutsuji.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
    trailerYoutubeId: '6vMuWuWlW4I',
    score: 9.1,
    year: 2024,
    episodes: 26,
    genres: ['Action', 'Fantasy', 'Supernatural'],
    status: 'Finished Airing',
  },
  {
    id: 16498,
    title: 'Attack on Titan',
    titleEnglish: 'Shingeki no Kyojin',
    synopsis: 'After his hometown is shattered and his mother murdered, Eren Yeager vows to cleanse the world of colossal man-eating Titans.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    trailerYoutubeId: 'MGRm4IzK1SQ',
    score: 9.0,
    year: 2013,
    episodes: 87,
    genres: ['Action', 'Dark Fantasy', 'Suspense'],
    status: 'Finished Airing',
  },
  {
    id: 40748,
    title: 'Jujutsu Kaisen',
    titleEnglish: 'Jujutsu Kaisen',
    synopsis: 'Yuji Itadori ingests a cursed talisman bearing Ryomen Sukuna soul and enters Tokyo Jujutsu High to exorcise dangerous cursed spirits.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500',
    trailerYoutubeId: 'pkZXflMmUlg',
    score: 8.8,
    year: 2020,
    episodes: 47,
    genres: ['Action', 'Supernatural'],
    status: 'Finished Airing',
  },
  {
    id: 44511,
    title: 'Chainsaw Man',
    titleEnglish: 'Chainsaw Man',
    synopsis: 'Denji lives an impoverished life harvesting devil corpses until a resurrection pact with his chainsaw dog Pochita transforms him into Chainsaw Man.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500',
    trailerYoutubeId: 'dflCAXyK-n0',
    score: 8.6,
    year: 2022,
    episodes: 12,
    genres: ['Action', 'Gore', 'Supernatural'],
    status: 'Finished Airing',
  },
  {
    id: 50265,
    title: 'Spy x Family',
    titleEnglish: 'Spy x Family',
    synopsis: 'Master spy Twilight adopts a telepathic girl and marries a deadly assassin to construct an unassuming fake family for a covert mission.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    trailerYoutubeId: 'ofXigq9aIpo',
    score: 8.6,
    year: 2022,
    episodes: 37,
    genres: ['Comedy', 'Action', 'Family'],
    status: 'Finished Airing',
  },
  {
    id: 1535,
    title: 'Death Note',
    titleEnglish: 'Death Note',
    synopsis: 'High school genius Light Yagami discovers a supernatural notebook that kills anyone whose name is inscribed, igniting a battle of wits against detective L.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    trailerYoutubeId: 'NlJZ-YgAt-c',
    score: 9.0,
    year: 2006,
    episodes: 37,
    genres: ['Mystery', 'Psychological', 'Supernatural'],
    status: 'Finished Airing',
  },
  {
    id: 21,
    title: 'One Piece',
    titleEnglish: 'One Piece',
    synopsis: 'Monkey D. Luffy eats a Devil Fruit gaining rubber powers and sets sail across the Grand Line to find the ultimate One Piece treasure.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
    trailerYoutubeId: 'l_98K4_6UQ0',
    score: 8.9,
    year: 1999,
    episodes: 1100,
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'Currently Airing',
  },
  {
    id: 1735,
    title: 'Naruto: Shippuden',
    titleEnglish: 'Naruto: Shippuden',
    synopsis: 'Naruto Uzumaki trains tirelessly to master the Nine-Tails Chakra, rescue his rogue friend Sasuke, and defend the ninja world against the Akatsuki.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
    trailerYoutubeId: '1dy2zP1BiTE',
    score: 8.7,
    year: 2007,
    episodes: 500,
    genres: ['Action', 'Adventure', 'Martial Arts'],
    status: 'Finished Airing',
  },
  {
    id: 5114,
    title: 'Fullmetal Alchemist: Brotherhood',
    titleEnglish: 'Fullmetal Alchemist: Brotherhood',
    synopsis: 'Two alchemist brothers seek the legendary Philosopher Stone to restore their bodies after a catastrophic taboo transmutation.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500',
    trailerYoutubeId: '--IcmZkvL0Q',
    score: 9.1,
    year: 2009,
    episodes: 64,
    genres: ['Action', 'Adventure', 'Fantasy'],
    status: 'Finished Airing',
  },
  {
    id: 41467,
    title: 'Bleach: Thousand-Year Blood War',
    titleEnglish: 'Bleach: Thousand-Year Blood War',
    synopsis: 'The Soul Reapers and substitute Soul Reaper Ichigo face extinction against the resurrected Quincy empire led by Yhwach.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    trailerYoutubeId: '78WIYzX_Bks',
    score: 9.0,
    year: 2022,
    episodes: 26,
    genres: ['Action', 'Supernatural'],
    status: 'Finished Airing',
  },
  {
    id: 199,
    title: 'Spirited Away',
    titleEnglish: 'Spirited Away',
    synopsis: 'Hayao Miyazaki masterpiece following young Chihiro trapped in an enchanted bathhouse world governed by the sorceress Yubaba.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    trailerYoutubeId: 'ByXuk9QqQkk',
    score: 8.9,
    year: 2001,
    episodes: 1,
    genres: ['Animation', 'Adventure', 'Family'],
    status: 'Finished Airing',
  },
  {
    id: 32281,
    title: 'Your Name (Kimi no Na wa)',
    titleEnglish: 'Your Name',
    synopsis: 'Makoto Shinkai romantic epic where two teenagers across Japan mysteriously swap bodies and embark on an unforgettable quest across time.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
    trailerYoutubeId: 'xU47nhruN-Q',
    score: 8.9,
    year: 2016,
    episodes: 1,
    genres: ['Romance', 'Supernatural', 'Drama'],
    status: 'Finished Airing',
  },
  {
    id: 813,
    title: 'Dragon Ball Z',
    titleEnglish: 'Dragon Ball Z',
    synopsis: 'Earth greatest warrior Goku defends humanity against Saiyan invaders, Frieza, Cell, and Majin Buu across legendary Super Saiyan sagas.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
    trailerYoutubeId: 'sFjK8RXZf9c',
    score: 8.7,
    year: 1989,
    episodes: 291,
    genres: ['Action', 'Martial Arts', 'Fantasy'],
    status: 'Finished Airing',
  },
  {
    id: 523,
    title: 'My Neighbor Totoro',
    titleEnglish: 'My Neighbor Totoro',
    synopsis: 'Satsuki and Mei move to a countryside house and encounter playful forest spirits led by the iconic gentle giant Totoro.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    trailerYoutubeId: '92a7Hj0ijLs',
    score: 8.6,
    year: 1988,
    episodes: 1,
    genres: ['Animation', 'Family', 'Fantasy'],
    status: 'Finished Airing',
  },
];

// Curated Talk & Variety TV Shows (Watch What Happens Live with Andy Cohen, Tonight Show, SNL, etc.)
export const TALK_AND_VARIETY_TV_SHOWS: TVShowItem[] = [
  {
    id: 70001,
    title: 'Watch What Happens Live with Andy Cohen',
    overview: 'Bravo unfiltered late-night interactive clubhouse talk show hosted by Andy Cohen, serving up cocktails, exclusive celebrity tea, viewer call-ins, and pop-culture showdowns.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1280',
    voteAverage: 7.9,
    firstAirDate: '2009-07-16',
    genres: ['Talk Show', 'Late Night', 'Celebrity Dish'],
  },
  {
    id: 70002,
    title: 'The Tonight Show Starring Jimmy Fallon',
    overview: 'NBC flagship late-night broadcast starring Jimmy Fallon with high-energy celebrity interviews, musical impressions, Lip Sync Battles, and monologues.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1280',
    voteAverage: 7.8,
    firstAirDate: '2014-02-17',
    genres: ['Late Night', 'Talk Show', 'Comedy'],
  },
  {
    id: 70003,
    title: 'Jimmy Kimmel Live!',
    overview: 'Late-night comedy monologues, Mean Tweets, irreverent street pranks, and star interviews directly from Hollywood Boulevard on ABC.',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=1280',
    voteAverage: 7.7,
    firstAirDate: '2003-01-26',
    genres: ['Late Night', 'Talk Show', 'Comedy'],
  },
  {
    id: 70004,
    title: 'The Late Show with Stephen Colbert',
    overview: 'Stephen Colbert serves up razor-sharp political monologues, satirical wit, and conversations with world dignitaries and Hollywood icons from the Ed Sullivan Theater.',
    imageUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1280',
    voteAverage: 8.1,
    firstAirDate: '2015-09-08',
    genres: ['Late Night', 'Talk Show', 'Satire'],
  },
  {
    id: 70005,
    title: 'Saturday Night Live',
    overview: 'NBC legendary live sketch comedy and variety powerhouse originating from Studio 8H in Rockefeller Center, defining satirical pop culture for fifty years.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1280',
    voteAverage: 8.3,
    firstAirDate: '1975-10-11',
    genres: ['Sketch Comedy', 'Variety Show', 'Late Night'],
  },
  {
    id: 70006,
    title: 'Last Week Tonight with John Oliver',
    overview: 'John Oliver delivers hilarious half-hour deep-dive investigative journalism and satirical breakdowns of systemic politics and international news on HBO.',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1280',
    voteAverage: 8.7,
    firstAirDate: '2014-04-27',
    genres: ['News Satire', 'Talk Show', 'Investigative'],
  },
  {
    id: 70007,
    title: 'The Daily Show',
    overview: 'Emmy-winning satirical news and cultural talk show providing fearless commentary on contemporary politics, media hysteria, and world events.',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1280',
    voteAverage: 8.2,
    firstAirDate: '1996-07-22',
    genres: ['News Satire', 'Talk Show'],
  },
  {
    id: 70008,
    title: 'The Real Housewives of Beverly Hills',
    overview: 'Bravo reality TV phenomenon capturing luxury living, high-society gala drama, and volatile personal rivalries across Beverly Hills estates.',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1280',
    voteAverage: 7.6,
    firstAirDate: '2010-10-14',
    genres: ['Reality TV', 'Entertainment'],
  },
  {
    id: 70009,
    title: 'Hot Ones',
    overview: 'The show with hot questions and even hotter wings! Host Sean Evans grills superstar guests as they eat progressively scorching chicken wings.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1280',
    voteAverage: 8.8,
    firstAirDate: '2015-03-12',
    genres: ['Celebrity Interview', 'Talk Show', 'Entertainment'],
  },
  {
    id: 70010,
    title: 'The Graham Norton Show',
    overview: 'BBC iconic red couch talk show featuring Hollywood superstars trading side-splitting candid stories, alongside the infamous Big Red Chair.',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1280',
    voteAverage: 8.6,
    firstAirDate: '2007-02-22',
    genres: ['Talk Show', 'Celebrity Banter', 'Comedy'],
  },
  {
    id: 70011,
    title: "RuPaul's Drag Race",
    overview: 'RuPaul searches for America next drag superstar through unforgettable runway themes, acting challenges, and lip-sync battles for legacy.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1280',
    voteAverage: 8.4,
    firstAirDate: '2009-02-02',
    genres: ['Reality TV', 'Competition', 'Fashion'],
  },
  {
    id: 70012,
    title: 'The View',
    overview: 'Lively panel discussion on current politics, pop culture headlines, and exclusive interviews with prominent figures shaping the nation.',
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1280',
    voteAverage: 7.2,
    firstAirDate: '1997-08-11',
    genres: ['Talk Show', 'Panel Discussion'],
  },
  {
    id: 70013,
    title: 'Entertainment Tonight',
    overview: 'The definitive broadcast source for breaking Hollywood news, celebrity scoops, and exclusive movie trailer premieres.',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1280',
    voteAverage: 7.5,
    firstAirDate: '1981-09-14',
    genres: ['Entertainment News', 'Broadcast'],
  },
  {
    id: 70014,
    title: 'Survivor',
    overview: 'Castaways marooned on a deserted island outwit, outplay, and outlast through tribal councils to win a million-dollar prize.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1280',
    voteAverage: 8.1,
    firstAirDate: '2000-05-31',
    genres: ['Reality TV', 'Competition'],
  },
  {
    id: 70015,
    title: 'Jeopardy!',
    overview: 'America beloved quiz show where contestants test trivia knowledge, buzz-in speed, and betting nerve in the classic answer-and-question format.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
    backdropUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=1280',
    voteAverage: 8.5,
    firstAirDate: '1984-09-10',
    genres: ['Game Show', 'Trivia'],
  },
];

// Curated Scripted Dramatic TV Series
export const SCRIPTED_SERIES_SHOWS: TVShowItem[] = [
  {
    id: 1399,
    title: 'Game of Thrones',
    overview: 'Nine noble families fight for control over the Iron Throne of Westeros while an ancient icy menace threatens the realm.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    voteAverage: 8.4,
    firstAirDate: '2011-04-17',
    genres: ['Fantasy', 'Drama', 'Series'],
  },
  {
    id: 1396,
    title: 'Breaking Bad',
    overview: 'A chemistry teacher diagnosed with inoperable cancer turns to manufacturing methamphetamine with a former student.',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500',
    voteAverage: 8.9,
    firstAirDate: '2008-01-20',
    genres: ['Crime', 'Drama', 'Series'],
  },
  {
    id: 66732,
    title: 'Stranger Things',
    overview: 'When a boy vanishes, a small Indiana town uncovers secret experiments, terrifying monsters, and the Upside Down.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    voteAverage: 8.6,
    firstAirDate: '2016-07-15',
    genres: ['Sci-Fi', 'Horror', 'Mystery', 'Series'],
  },
  {
    id: 76331,
    title: 'Succession',
    overview: 'The Roy family battles for control of Waystar RoyCo when their patriarch contemplates retiring from the media conglomerate.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
    voteAverage: 8.9,
    firstAirDate: '2018-06-03',
    genres: ['Drama', 'Series'],
  },
  {
    id: 100088,
    title: 'The Last of Us',
    overview: 'A hardened survivor is tasked with escorting a 14-year-old immune girl across a fungal-ravaged post-apocalyptic United States.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
    voteAverage: 8.8,
    firstAirDate: '2023-01-15',
    genres: ['Drama', 'Sci-Fi', 'Series'],
  },
  {
    id: 94997,
    title: 'House of the Dragon',
    overview: 'The reign and internal succession struggle of House Targaryen 200 years before the events of Game of Thrones.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    voteAverage: 8.5,
    firstAirDate: '2022-08-21',
    genres: ['Drama', 'Fantasy', 'Series'],
  },
];

const FALLBACK_INDIAN_MOVIES: Movie[] = [
  {
    id: 579974,
    title: 'RRR',
    original_title: 'RRR',
    overview: 'A fearless warrior and an ambitious officer in British India become close friends unaware of each other secret missions.',
    poster_path: '/nEufeZlyAOLqO2brrs0yeMu1Qje.jpg',
    backdrop_path: '/m03b30hB0P8Cg9pXw8p4hE5e33n.jpg',
    release_date: '2022-03-24',
    vote_average: 8.2,
    vote_count: 1400,
    popularity: 92.4,
    genre_ids: [28, 18],
  },
  {
    id: 693134,
    title: 'Kalki 2898 AD',
    original_title: 'Kalki 2898 AD',
    overview: 'In a dystopian post-apocalyptic future, an immortal warrior protects the mother of the destined avatar Kalki.',
    poster_path: '/4b161358z2H1iK91e9t8y5h7k.jpg',
    backdrop_path: '/kalkiBackdrop2898.jpg',
    release_date: '2024-06-27',
    vote_average: 7.9,
    vote_count: 890,
    popularity: 110.5,
    genre_ids: [28, 878],
  },
  {
    id: 1124704,
    title: 'Devara: Part 1',
    original_title: 'Devara: Part 1',
    overview: 'A sea-faring chieftain battles corrupt smuggler factions to safeguard his coastal clan.',
    poster_path: '/devaraPoster1.jpg',
    backdrop_path: '/devaraBackdrop.jpg',
    release_date: '2024-09-27',
    vote_average: 7.6,
    vote_count: 420,
    popularity: 88.0,
    genre_ids: [28, 53],
  },
  {
    id: 1079091,
    title: 'Stree 2',
    original_title: 'Stree 2',
    overview: 'The town of Chanderi faces a terrifying new headless apparition, and the gang reunites to seek the legendary protector.',
    poster_path: '/stree2Poster.jpg',
    backdrop_path: '/stree2Backdrop.jpg',
    release_date: '2024-08-15',
    vote_average: 7.8,
    vote_count: 510,
    popularity: 94.2,
    genre_ids: [35, 27],
  },
];

const FALLBACK_RSS_NEWS: ExternalNewsArticle[] = [
  {
    id: 'rss-1',
    title: 'Christopher Nolan Sets Next Mystery Epic at Universal for IMAX 2026',
    summary: 'Universal confirms July 2026 release with Matt Damon in advanced talks.',
    pubDate: 'Today',
    link: 'https://deadline.com',
    source: 'Deadline Hollywood',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
  },
  {
    id: 'rss-2',
    title: 'Spider-Man 4 Officially Sets Summer 2026 Release Date',
    summary: 'Tom Holland returns under director Destin Daniel Cretton following Avengers: Doomsday.',
    pubDate: 'Yesterday',
    link: 'https://deadline.com',
    source: 'Variety Cinema',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
  },
  {
    id: 'rss-3',
    title: 'Demon Slayer: Infinity Castle Trilogy Confirms Global Sony Theatrical Distribution',
    summary: 'The historic anime franchise will conclude with three feature-length theatrical releases.',
    pubDate: '2 days ago',
    link: 'https://deadline.com',
    source: 'Anime News Network',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
  },
];
