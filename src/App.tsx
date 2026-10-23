import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_RAW_KEYWORDS } from './data/keywords';
import { setPageMeta, syncCanonical } from './utils/canonical';
import { LEGACY_BLOG_SLUGS } from './data/blogData';
import {
  SECTION_ROUTES,
  blogPath,
  blogSlugFromPath,
  canonicalTab,
  sectionForPath,
  sectionForTab,
  urlForTab,
} from './data/routes';

/** Views that render their own <h1>. Everything else gets the section H1 from App. */
const VIEWS_WITH_OWN_H1 = new Set([
  'oscars', 'top_news', 'movie-news', 'celebrity-news', 'tv-news', 'top_box_office', 'top-box-office',
  'eurofilm-blog', 'imdb-podcasts', 'polls', 'community-polls', 'contributor-zone', 'help-center', 'eurofilm-labs',
]);
function pageHasOwnH1(tab: string): boolean {
  return VIEWS_WITH_OWN_H1.has(tab);
}

/** Tab for the current URL: /blog/*, clean section paths, or /?tab= for non-indexed views. */
function tabFromLocation(): string {
  const { pathname, search } = window.location;
  if (blogSlugFromPath(pathname)) return 'eurofilm-blog';
  const section = sectionForPath(pathname);
  if (section && section.path !== '/') return section.tab;
  return new URLSearchParams(search).get('tab') || 'popular';
}

/** Resolves the first tab and upgrades legacy ?blog= / ?tab= URLs to clean paths. */
function resolveInitialTab(): string {
  const params = new URLSearchParams(window.location.search);
  const legacyBlog = params.get('blog');
  if (legacyBlog && /^[a-z0-9-]+$/.test(legacyBlog)) {
    window.history.replaceState({}, '', blogPath(LEGACY_BLOG_SLUGS[legacyBlog] || legacyBlog));
    return 'eurofilm-blog';
  }
  const legacyTab = params.get('tab');
  if (legacyTab && sectionForTab(legacyTab) && !params.get('watch')) {
    window.history.replaceState({}, '', urlForTab(legacyTab));
  }
  return tabFromLocation();
}
import {
  Movie,
  Genre,
  getPopularMovies,
  getTrendingMovies,
  getLatestMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  discoverMovies,
  getGenres,
  getBackdropUrl,
  setTmdbLanguage,
  FALLBACK_POPULAR,
} from './services/tmdb';
import {
  fetchTopAnime,
  fetchTalkAndVarietyTVShows,
  fetchScriptedSeries,
  fetchPopularTVShows,
  fetchTop250TVShows,
  fetchIndianMovies,
  fetchTrendingPeople,
  AnimeItem,
  TVShowItem,
  CelebPerson,
} from './services/externalApis';
import {
  isTargetedForUnder18,
  isTargetedForOver18,
  VERIFIED_UNDER_18_MOVIES,
} from './utils/ageRatingFilter';
import { Navbar, MediaTypeFilterType, AgeRatingFilterType } from './components/Navbar';
import { MovieCard } from './components/MovieCard';
import { MovieWatchPage } from './components/MovieWatchPage';
import { HamburgerMenu } from './components/HamburgerMenu';
import {
  BornTodaySection,
  TopNewsSection,
  BoxOfficeSection,
  CommunityPollsSection,
} from './components/EntertainmentSections';
import {
  AnimeCatalogView,
  TVShowsCatalogView,
  TrendingPeopleView,
} from './components/ExternalViews';
import { EuroFilmBlogView } from './components/EuroFilmBlogView';
import { OscarsView } from './components/OscarsView';
import { EntertainmentNewsView } from './components/EntertainmentNewsView';
import { HelpCenterChatView } from './components/HelpCenterChatView';
import { ContributorZoneView } from './components/ContributorZoneView';
import { CommunityPollsAndDebatesView } from './components/CommunityPollsAndDebatesView';
import { EuroFilmDislikedLabsView } from './components/EuroFilmDislikedLabsView';
import { ContactModal } from './components/ContactModal';
import { AboutModal } from './components/AboutModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Footer } from './components/Footer';
import { getMovieInteractions } from './services/interactionStore';
import { Language, TRANSLATIONS } from './i18n/translations';
import { getUiStrings, localizeGenre, getHamburgerItemLabel } from './i18n/localize';
import { AdBanner } from './components/AdBanner';
import { StickyAdBar } from './components/StickyAdBar';
import { trackCategorySelect, trackFilterSelect, trackSearchQuery, trackPageView } from './utils/analytics';
import {
  Play,
  Star,
  Calendar,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Clock,
} from 'lucide-react';

export default function App() {
  const fullText = ALL_RAW_KEYWORDS.join(', ');

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  // Movie Catalog State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  // 12-Hour Trending Trailer State (Rotates every 12H through latest trending movies)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingIndexOffset, setTrendingIndexOffset] = useState<number>(0);
  const [now, setNow] = useState<number>(() => Date.now());
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      return resolveInitialTab();
    } catch {
      return 'popular';
    }
  });
  const [activeTabLabel, setActiveTabLabel] = useState<string>('Popular Movies');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(500);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // External Free APIs State (Anime, TV Shows, Trending Celebs)
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [tvShowsList, setTvShowsList] = useState<TVShowItem[]>([]);
  const [trendingCelebs, setTrendingCelebs] = useState<CelebPerson[]>([]);

  // Header filter states (Requirement 9: movies, TV shows, anime, series, and -18, +18)
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilterType>('all');
  const [ageRatingFilter, setAgeRatingFilter] = useState<AgeRatingFilterType>('all');

  // Hamburger drawer
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

  // Dedicated full-page trailer watch state
  const [watchingMovieId, setWatchingMovieId] = useState<number | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const watchParam = params.get('watch');
      return watchParam ? parseInt(watchParam, 10) : null;
    } catch {
      return null;
    }
  });
  const [watchingMovieInitial, setWatchingMovieInitial] = useState<Movie | null>(null);

  // Modal states for Contact, About, Privacy
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Per-section title, description and self-referencing canonical
  useEffect(() => {
    if (watchingMovieId) {
      syncCanonical();
      return;
    }
    if (canonicalTab(activeTab) === 'eurofilm-blog') return; // blog view sets its own meta
    const section = sectionForTab(activeTab) || SECTION_ROUTES[0];
    setPageMeta(section.title, section.description);
  }, [activeTab, watchingMovieId]);

  // Sync URL on history change (back / forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const watchParam = params.get('watch');
      setWatchingMovieId(watchParam ? parseInt(watchParam, 10) : null);
      setActiveTab(tabFromLocation());
      syncCanonical();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch genres, latest trending movies, and anime on initial load and when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    setTmdbLanguage(currentLanguage);
    getGenres()
      .then((data) => setGenres(data))
      .catch((err) => console.error('Failed to load genres:', err));
    getTrendingMovies('day', 1)
      .then((data) => {
        if (data && Array.isArray(data.results) && data.results.length > 0) {
          setTrendingMovies(data.results);
        }
      })
      .catch((err) => console.warn('Failed to load trending movies for 12H trailer:', err));
    fetchTopAnime(1)
      .then((data) => setAnimeList(data))
      .catch(() => {});
  }, [currentLanguage]);

  // Keep 12H clock synchronized to automatically transition at 12H mark
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const genreMap = useMemo(() => {
    const map = new Map<number, string>();
    genres.forEach((g) => map.set(g.id, g.name));
    return map;
  }, [genres]);

  // Load external data or TMDB movies depending on tab
  const loadDataForTab = useCallback(
    async (
      tab: string,
      query: string,
      page = 1,
      genre: number | null = null,
      sort = 'popularity.desc',
      append = false
    ) => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      setTmdbLanguage(currentLanguage);

      try {
        if (query.trim()) {
          const data = await searchMovies(query.trim(), page);
          setMovies((prev) => (append ? [...prev, ...data.results] : data.results));
          setTotalPages(Math.min(data.total_pages || 1, 500));
          setCurrentPage(page);
          return;
        }

        // Branch 1: ANIME (Jikan API v4 sfw + curated anime)
        if (tab === 'anime' || mediaTypeFilter === 'anime') {
          const list = await fetchTopAnime(page);
          const filtered = query.trim()
            ? list.filter(
                (a) =>
                  a.title.toLowerCase().includes(query.toLowerCase()) ||
                  (a.titleEnglish && a.titleEnglish.toLowerCase().includes(query.toLowerCase())) ||
                  a.synopsis.toLowerCase().includes(query.toLowerCase())
              )
            : list;
          setAnimeList(filtered);
          setTotalPages(50);
          setCurrentPage(page);
          return;
        }

        // Branch 2A: TV SHOWS (Talk & Reality: Andy Cohen, Tonight Show, SNL, etc. - all TV show sections)
        if (
          tab === 'tv_shows' ||
          tab === 'whats-on-tv-streaming' ||
          tab === 'top-250-tv-shows' ||
          tab === 'most-popular-tv-shows' ||
          tab === 'browse-tv-genre' ||
          mediaTypeFilter === 'tv'
        ) {
          const shows = await fetchTalkAndVarietyTVShows(page);
          let filtered = query.trim()
            ? shows.filter(
                (s) =>
                  s.title.toLowerCase().includes(query.toLowerCase()) ||
                  s.overview.toLowerCase().includes(query.toLowerCase())
              )
            : shows;

          // Requirement 2: Disorder the results displayed for whats on tv & streaming, Top 250 TV shows, Most popular TV shows, and Browse TV shows by genre
          if (
            tab === 'whats-on-tv-streaming' ||
            tab === 'top-250-tv-shows' ||
            tab === 'most-popular-tv-shows' ||
            tab === 'browse-tv-genre'
          ) {
            filtered = [...filtered];
            // Deterministic shift offset per tab so every section starts with different shows
            const shiftMap: Record<string, number> = {
              'whats-on-tv-streaming': 3,
              'top-250-tv-shows': 7,
              'most-popular-tv-shows': 11,
              'browse-tv-genre': 15,
            };
            const shift = (shiftMap[tab] || 5) % Math.max(filtered.length, 1);
            filtered = [...filtered.slice(shift), ...filtered.slice(0, shift)];

            // Full Fisher-Yates disorder shuffle
            for (let i = filtered.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
            }
          }

          setTvShowsList(filtered);
          setTotalPages(50);
          setCurrentPage(page);
          return;
        }

        // Branch 2B: SCRIPTED TV SERIES (Only when explicitly navigating to tv-series)
        if (tab === 'tv-series') {
          const shows = await fetchScriptedSeries(page);
          const filtered = query.trim()
            ? shows.filter(
                (s) =>
                  s.title.toLowerCase().includes(query.toLowerCase()) ||
                  s.overview.toLowerCase().includes(query.toLowerCase())
              )
            : shows;
          setTvShowsList(filtered);
          setTotalPages(50);
          setCurrentPage(page);
          return;
        }

        // Branch 3: BOLLYWOOD & INDIAN CINEMA TRAILERS (Renamed as requested)
        if (
          tab === 'indian_movies' ||
          tab === 'india-movie-spotlight' ||
          tab === 'bollywood-movie-spotlight'
        ) {
          const indMovies = await fetchIndianMovies(page, sort);
          setMovies((prev) => (append ? [...prev, ...indMovies] : indMovies));
          setTotalPages(50);
          setCurrentPage(page);
          return;
        }

        // Branch 4: TRENDING PEOPLE & STARMETER
        if (tab === 'trending-people' || tab === 'starmeter-awards') {
          const people = await fetchTrendingPeople(page);
          setTrendingCelebs(people);
          setTotalPages(20);
          setCurrentPage(page);
          return;
        }

        // Branch 5: SPECIAL STATIC/FEED TABS (Born Today, News, Box Office, Polls, Oscars, Blog, Labs, Contributor, Help Center)
        if (
          tab === 'born_today' ||
          tab === 'born-today' ||
          tab === 'top_news' ||
          tab === 'movie-news' ||
          tab === 'celebrity-news' ||
          tab === 'tv-news' ||
          tab === 'top_box_office' ||
          tab === 'top-box-office' ||
          tab === 'polls' ||
          tab === 'community-polls' ||
          tab === 'contributor-zone' ||
          tab === 'help-center' ||
          tab === 'eurofilm-labs' ||
          tab === 'oscars' ||
          tab === 'eurofilm-blog' ||
          tab === 'imdb-podcasts'
        ) {
          return;
        }

        // Branch 6: MOVIES CATALOG DISCOVERY
        let data: { results: Movie[]; total_pages: number };
        if (genre !== null || sort !== 'popularity.desc') {
          data = await discoverMovies(page, sort, genre || undefined);
        } else {
          switch (tab) {
            case 'now_playing':
            case 'showtimes-tickets':
              data = await getNowPlayingMovies(page);
              break;
            case 'top_rated':
            case 'top-250-movies':
            case 'top_rated_visitors':
              data = await getTopRatedMovies(page);
              break;
            case 'upcoming':
            case 'release-calendar':
            case 'coming_soon':
              data = await getUpcomingMovies(page);
              break;
            case 'top10_week':
              data = await getPopularMovies(1);
              data.results = data.results.slice(0, 10);
              break;
            case 'fan_favorites':
            case 'top_liked_visitors':
              data = await discoverMovies(page, 'vote_count.desc');
              break;
            case 'eurofilm-picks':
            case 'imdb-picks':
              data = await getPopularMovies(page);
              break;
            case 'browse-movies-genre':
            case 'what-to-watch':
              data = await discoverMovies(page, 'vote_count.desc');
              break;
            case 'popular':
            default:
              data = await getPopularMovies(page, 25);
              break;
          }
        }

        // Apply visitor custom sorts, EuroFilm picks sorting, or genre disordering
        let finalResults = data.results;
        if (tab === 'eurofilm-picks' || tab === 'imdb-picks') {
          // Requirement 7: EuroFilm Picks displays the top liked and heart (love) emojis movies by users
          finalResults = [...finalResults].sort((a, b) => {
            const intA = getMovieInteractions(a.id);
            const intB = getMovieInteractions(b.id);
            const scoreA = intA.reactions.like + intA.reactions.love;
            const scoreB = intB.reactions.like + intB.reactions.love;
            return scoreB - scoreA;
          });
        } else if (
          tab === 'browse-movies-genre' ||
          tab === 'what-to-watch' ||
          (genre !== null && tab !== 'popular')
        ) {
          // Requirement 2: for Browse movies, What to watch, by genre when clicked do NOT show same movies as in Most popular movies but disorder them
          finalResults = [...finalResults];
          for (let i = finalResults.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalResults[i], finalResults[j]] = [finalResults[j], finalResults[i]];
          }
        } else if (tab === 'top_rated_visitors') {
          finalResults = [...finalResults].sort((a, b) => {
            const intA = getMovieInteractions(a.id);
            const intB = getMovieInteractions(b.id);
            return intB.averageRating - intA.averageRating;
          });
        } else if (tab === 'top_liked_visitors') {
          finalResults = [...finalResults].sort((a, b) => {
            const intA = getMovieInteractions(a.id);
            const intB = getMovieInteractions(b.id);
            return intB.reactions.like - intA.reactions.like;
          });
        }

        setMovies((prev) => (append ? [...prev, ...finalResults] : finalResults));
        const effectiveTotalPages = Math.min(Math.max(data.total_pages || 1, 1), 500);
        setTotalPages(effectiveTotalPages);
        setCurrentPage(page);
        setJumpPageInput(String(page));
      } catch (err: unknown) {
        console.error('API Error:', err);
        const message = err instanceof Error ? err.message : 'Failed to retrieve media.';
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentLanguage]
  );

  useEffect(() => {
    loadDataForTab(activeTab, searchQuery, 1, selectedGenre, sortBy, false);
  }, [activeTab, searchQuery, selectedGenre, sortBy, currentLanguage, loadDataForTab]);

  const handleTabSelect = (tab: string, label?: string) => {
    setActiveTab(tab);
    setTrendingIndexOffset(0);
    const resolvedLabel = label || tab.replace(/[-_]/g, ' ');
    setActiveTabLabel(resolvedLabel);
    trackCategorySelect(tab, resolvedLabel);
    trackPageView(resolvedLabel, `/${tab}`);
    setSearchQuery('');
    setSelectedGenre(null);
    setSortBy('popularity.desc');
    if (watchingMovieId) {
      setWatchingMovieId(null);
      setWatchingMovieInitial(null);
    }
    window.history.pushState({ tab }, '', urlForTab(tab));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackSearchQuery(searchQuery);
      setSelectedGenre(null);
      if (watchingMovieId) handleCloseWatchPage();
      loadDataForTab(activeTab, searchQuery, 1, null, sortBy, false);
    }
  };

  // Open dedicated watch page (NEVER opens modal, NEVER redirects to YouTube)
  const handleOpenWatchPage = (movie: Movie) => {
    setWatchingMovieInitial(movie);
    setWatchingMovieId(movie.id);
    const newUrl = `${window.location.pathname}?watch=${movie.id}`;
    window.history.pushState({ movieId: movie.id }, '', newUrl);
  };

  // Anime trailer watch launcher
  const handleWatchAnimeTrailer = (anime: AnimeItem) => {
    const movieObj: Movie = {
      id: anime.id + 9000000,
      title: anime.title,
      original_title: anime.title,
      overview: anime.synopsis,
      poster_path: null,
      backdrop_path: null,
      release_date: `${anime.year || 2024}-01-01`,
      vote_average: anime.score || 8.5,
      vote_count: 1200,
      popularity: 150,
      genre_ids: [16, 28],
    };
    handleOpenWatchPage(movieObj);
  };

  // TV show trailer watch launcher
  const handleWatchShowTrailer = (show: TVShowItem) => {
    const movieObj: Movie = {
      id: show.tmdbId || show.id + 8000000,
      title: show.title,
      original_title: show.title,
      overview: show.overview,
      poster_path: null,
      backdrop_path: null,
      release_date: show.firstAirDate || '2023-01-01',
      vote_average: show.voteAverage,
      vote_count: 850,
      popularity: 120,
      genre_ids: [18],
    };
    handleOpenWatchPage(movieObj);
  };

  const handleCloseWatchPage = () => {
    setWatchingMovieId(null);
    setWatchingMovieInitial(null);
    const newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };

  const handlePageJump = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    loadDataForTab(activeTab, searchQuery, target, selectedGenre, sortBy, false);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleJumpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p)) {
      handlePageJump(p);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      loadDataForTab(activeTab, searchQuery, currentPage + 1, selectedGenre, sortBy, true);
    }
  };

  // Filtered anime according to Age Rating (-18, +18)
  const displayedAnime = useMemo(() => {
    if (ageRatingFilter === 'under18') {
      return animeList.filter((a) =>
        isTargetedForUnder18({
          title: a.title,
          original_title: a.titleEnglish,
          overview: a.synopsis,
          genres: a.genres,
        })
      );
    }
    if (ageRatingFilter === 'over18') {
      return animeList.filter((a) =>
        isTargetedForOver18({
          title: a.title,
          original_title: a.titleEnglish,
          overview: a.synopsis,
          genres: a.genres,
        })
      );
    }
    return animeList;
  }, [animeList, ageRatingFilter]);

  // Filtered TV shows according to Age Rating (Watch What Happens Live, Tonight Show, etc.)
  const displayedTVShows = useMemo(() => {
    if (ageRatingFilter === 'under18') {
      return tvShowsList.filter((s) =>
        isTargetedForUnder18({
          title: s.title,
          overview: s.overview,
          genres: s.genres,
        })
      );
    }
    return tvShowsList;
  }, [tvShowsList, ageRatingFilter]);

  // Filtered movies according to Age Rating (-18, +18)
  const displayedMovies = useMemo(() => {
    if (ageRatingFilter === 'under18') {
      // Intelligently guess & sort movies targeted for -18 audience
      const apiFiltered = movies.filter((m) =>
        isTargetedForUnder18({
          title: m.title,
          original_title: m.original_title,
          overview: m.overview,
          genre_ids: m.genre_ids,
          adult: m.adult,
        })
      );
      const combined = [...VERIFIED_UNDER_18_MOVIES];
      for (const m of apiFiltered) {
        if (!combined.some((c) => c.id === m.id || c.title.toLowerCase() === m.title.toLowerCase())) {
          combined.push(m);
        }
      }
      if (activeTab === 'popular' && !searchQuery) {
        return combined.slice(0, 25);
      }
      return combined;
    }
    if (ageRatingFilter === 'over18') {
      // +18: Mature, horror, crime, thriller
      return movies.filter((m) =>
        isTargetedForOver18({
          title: m.title,
          original_title: m.original_title,
          overview: m.overview,
          genre_ids: m.genre_ids,
          adult: m.adult,
        })
      );
    }
    if (activeTab === 'popular' && !searchQuery && movies.length >= 25) {
      return movies.slice(0, 25);
    }
    return movies;
  }, [movies, ageRatingFilter, activeTab, searchQuery]);

  // 12-hour period calculation (12 hours = 43,200,000 ms)
  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
  const current12HSlot = Math.floor(now / TWELVE_HOURS_MS);

  // Time remaining until the next 12-hour rotation
  const msUntilNext12H = TWELVE_HOURS_MS - (now % TWELVE_HOURS_MS);
  const hoursRemaining12H = Math.max(0, Math.floor(msUntilNext12H / (60 * 60 * 1000)));
  const minutesRemaining12H = Math.max(0, Math.floor((msUntilNext12H % (60 * 60 * 1000)) / (60 * 1000)));

  // Candidate pool of top trending movies with valid visual backdrops and posters
  const trendingCandidates = useMemo(() => {
    const source =
      trendingMovies.length > 0
        ? trendingMovies
        : displayedMovies.length > 0
        ? displayedMovies
        : FALLBACK_POPULAR;
    const withVisuals = source.filter((m) => m.backdrop_path && m.poster_path);
    return withVisuals.length > 0 ? withVisuals : source;
  }, [trendingMovies, displayedMovies]);

  // Deterministic 12-hour rotation index + optional interactive user offset
  const activeFeaturedIndex = useMemo(() => {
    if (trendingCandidates.length === 0) return 0;
    const baseIndex = current12HSlot % trendingCandidates.length;
    const target = (baseIndex + trendingIndexOffset) % trendingCandidates.length;
    return target < 0 ? target + trendingCandidates.length : target;
  }, [trendingCandidates.length, current12HSlot, trendingIndexOffset]);

  // Featured hero movie (rotates every 12H through latest trending movies)
  const featuredMovie = useMemo(() => {
    if (searchQuery || currentPage !== 1 || (activeTab !== 'popular' && activeTab !== 'trending')) return null;
    if (trendingCandidates.length === 0) return null;
    return trendingCandidates[activeFeaturedIndex] || trendingCandidates[0];
  }, [searchQuery, currentPage, activeTab, trendingCandidates, activeFeaturedIndex]);

  return (
    <div className="relative min-h-screen w-full bg-white selection:bg-zinc-200 selection:text-zinc-900 font-sans antialiased text-zinc-900 overflow-x-hidden flex flex-col justify-between">
      {/* Background theme keywords stuck on every page in white camouflaged text */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none p-6 sm:p-10 md:p-16 lg:p-20 text-white font-sans text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-tight leading-loose sm:leading-loose text-justify break-words fixed inset-0 -z-10 overflow-hidden"
        style={{ color: '#ffffff', backgroundColor: 'transparent' }}
      >
        {fullText}
      </div>

      {/* Main Website Structure */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Bar (Top Info Bar removed as requested in Req 10) */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onOpenHamburger={() => setIsHamburgerOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
          mediaTypeFilter={mediaTypeFilter}
          onSelectMediaTypeFilter={(type) => {
            setMediaTypeFilter(type);
            trackFilterSelect('mediaType', type);
            if (type === 'anime') {
              handleTabSelect('anime', 'Anime Trailers & Series');
            } else if (type === 'tv') {
              handleTabSelect('tv_shows', 'TV Shows (Talk & Reality)');
            } else if (type === 'movies') {
              handleTabSelect('popular', 'Popular Movies');
            } else if (type === 'all') {
              handleTabSelect('popular', 'Popular Movies');
            }
          }}
          ageRatingFilter={ageRatingFilter}
          onSelectAgeRatingFilter={(rating) => {
            setAgeRatingFilter(rating);
            trackFilterSelect('ageRating', rating);
          }}
        />

        {/* CONDITION 1: WATCH TRAILER FULL PAGE VIEW (No modal, no youtube redirect) */}
        {watchingMovieId ? (
          <MovieWatchPage
            movieId={watchingMovieId}
            initialMovie={watchingMovieInitial}
            onBack={handleCloseWatchPage}
            onSelectMovie={handleOpenWatchPage}
            genreMap={genreMap}
            currentLanguage={currentLanguage}
          />
        ) : (
          /* CONDITION 2: MAIN MULTI-API CATALOG & ENTERTAINMENT SECTIONS VIEW */
          <>
            {/* Featured Hero Banner with 12H Rotation */}
            {featuredMovie && !searchQuery && activeTab === 'popular' && (
              <section className="relative bg-zinc-950 text-white overflow-hidden border-b border-zinc-200">
                <div className="absolute inset-0 z-0 opacity-85">
                  <img
                    key={`backdrop-${featuredMovie.id}`}
                    src={getBackdropUrl(featuredMovie.backdrop_path, 'w1280')}
                    alt={featuredMovie.title}
                    className="w-full h-full object-cover object-center brightness-105 contrast-105 transition-opacity duration-700"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-2xl space-y-4 bg-zinc-950/70 backdrop-blur-xs p-6 sm:p-8 rounded-2xl border border-white/15 shadow-2xl">
                    {/* Header tags: 12H rotation status and countdown */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-amber-500/40">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {ui.featuredTrendingTrailer}
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/90 text-zinc-300 text-xs font-medium border border-zinc-700">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>12H Rotation ({activeFeaturedIndex + 1}/{trendingCandidates.length})</span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900/90 text-zinc-400 text-xs border border-zinc-800" title="Auto-rotates to the next trending movie every 12 hours">
                        <span>Rotates in {hoursRemaining12H}h {minutesRemaining12H}m</span>
                      </div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
                      {featuredMovie.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-200 font-medium">
                      <span className="flex items-center gap-1 bg-amber-500/25 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {typeof featuredMovie.vote_average === 'number'
                          ? featuredMovie.vote_average.toFixed(1)
                          : 'NR'}{' '}
                        / 10
                      </span>
                      {featuredMovie.release_date && (
                        <span className="flex items-center gap-1 text-zinc-200 bg-zinc-800/80 px-2.5 py-1 rounded border border-zinc-700">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {featuredMovie.release_date}
                        </span>
                      )}
                      {featuredMovie.genre_ids && featuredMovie.genre_ids.length > 0 && (
                        <span className="text-zinc-300">
                          {featuredMovie.genre_ids
                            .map((id) => genreMap.get(id))
                            .filter(Boolean)
                            .slice(0, 3)
                            .join(' • ')}
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base text-zinc-200 line-clamp-3 leading-relaxed max-w-xl">
                      {featuredMovie.overview}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleOpenWatchPage(featuredMovie)}
                          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-md flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-zinc-950" />
                          {ui.watchTrailerPage}
                        </button>
                        <button
                          onClick={() => setIsAboutOpen(true)}
                          className="px-4 py-2.5 bg-zinc-800/90 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm rounded-md border border-zinc-700 transition-colors cursor-pointer"
                        >
                          {ui.aboutEuroFilm}
                        </button>
                      </div>

                      {/* 12H Carousel Navigation & Dots */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTrendingIndexOffset((prev) => prev - 1)}
                          className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                          aria-label="Previous 12H Trending Trailer"
                          title="Previous 12H Trending Trailer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="hidden sm:flex items-center gap-1.5 px-2">
                          {trendingCandidates.slice(0, 8).map((c, idx) => (
                            <button
                              key={c.id}
                              onClick={() => {
                                const base = current12HSlot % trendingCandidates.length;
                                setTrendingIndexOffset(idx - base);
                              }}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                idx === activeFeaturedIndex % 8
                                  ? 'w-5 bg-amber-400'
                                  : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
                              }`}
                              aria-label={`Go to trending trailer ${idx + 1}`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => setTrendingIndexOffset((prev) => prev + 1)}
                          className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                          aria-label="Next 12H Trending Trailer"
                          title="Next 12H Trending Trailer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {trendingIndexOffset !== 0 && (
                          <button
                            onClick={() => setTrendingIndexOffset(0)}
                            className="text-[11px] text-amber-400 hover:underline ml-1 cursor-pointer font-semibold"
                            title="Reset to current 12-hour featured trailer"
                          >
                            Live 12H
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-12">
              {!pageHasOwnH1(activeTab) && (
                <header className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    {searchQuery ? `Search results for “${searchQuery}”` : (sectionForTab(activeTab) || SECTION_ROUTES[0]).h1}
                  </h1>
                  {!searchQuery && (
                    <p className="text-sm text-zinc-600 max-w-3xl">{(sectionForTab(activeTab) || SECTION_ROUTES[0]).intro}</p>
                  )}
                </header>
              )}
              {/* Top Global Sponsored Ad Banner */}
              <AdBanner
                variant="leaderboard"
                title="Sponsored"
                subtitle="Advertisement from our ad partner"
              />

              {/* SPECIAL TAB 1: ANIME (Jikan API v4, safe-for-work only, plus curated titles) */}
              {activeTab === 'anime' || mediaTypeFilter === 'anime' ? (
                <AnimeCatalogView
                  animeList={displayedAnime}
                  onWatchAnimeTrailer={handleWatchAnimeTrailer}
                  currentLanguage={currentLanguage}
                />
              ) : activeTab === 'tv_shows' ||
                activeTab === 'whats-on-tv-streaming' ||
                activeTab === 'top-250-tv-shows' ||
                activeTab === 'most-popular-tv-shows' ||
                activeTab === 'browse-tv-genre' ||
                mediaTypeFilter === 'tv' ? (
                /* SPECIAL TAB 2A: TV SHOWS (Watch What Happens Live with Andy Cohen, Tonight Show, SNL, etc.) */
                <TVShowsCatalogView
                  shows={displayedTVShows}
                  currentLanguage={currentLanguage}
                  onWatchShowTrailer={handleWatchShowTrailer}
                  title={
                    activeTab === 'whats-on-tv-streaming'
                      ? getHamburgerItemLabel('whats-on-tv-streaming', currentLanguage, "What's on TV & streaming")
                      : activeTab === 'top-250-tv-shows'
                      ? getHamburgerItemLabel('top-250-tv-shows', currentLanguage, "Top 250 TV shows")
                      : activeTab === 'most-popular-tv-shows'
                      ? getHamburgerItemLabel('most-popular-tv-shows', currentLanguage, "Most popular TV shows")
                      : activeTab === 'browse-tv-genre'
                      ? getHamburgerItemLabel('browse-tv-genre', currentLanguage, "Browse TV shows by genre")
                      : undefined
                  }
                  badge={
                    activeTab === 'whats-on-tv-streaming'
                      ? "On Air & Streaming"
                      : activeTab === 'top-250-tv-shows'
                      ? "Top 250 TV"
                      : activeTab === 'most-popular-tv-shows'
                      ? "Most Popular"
                      : activeTab === 'browse-tv-genre'
                      ? "By Genre"
                      : undefined
                  }
                  subtitle={
                    activeTab === 'whats-on-tv-streaming'
                      ? "Explore broadcasts, daily late-night shows, and streaming schedules"
                      : activeTab === 'top-250-tv-shows'
                      ? "Disordered rankings of the 250 most celebrated television programs and talk shows"
                      : activeTab === 'most-popular-tv-shows'
                      ? "Trending and high-engagement television broadcasts and reality shows"
                      : activeTab === 'browse-tv-genre'
                      ? "Television entertainment disordered and filtered across comedy, reality, and talk categories"
                      : undefined
                  }
                />
              ) : activeTab === 'tv-series' ? (
                /* SPECIAL TAB 2B: SCRIPTED TV SERIES (Game of Thrones, Breaking Bad, Stranger Things, etc.) */
                <TVShowsCatalogView
                  shows={tvShowsList}
                  currentLanguage={currentLanguage}
                  onWatchShowTrailer={handleWatchShowTrailer}
                  title="Scripted Dramatic TV Series"
                  badge="Drama Series"
                />
              ) : activeTab === 'trending-people' || activeTab === 'starmeter-awards' ? (
                /* SPECIAL TAB 3: TRENDING CELEBS & STARMETER */
                <TrendingPeopleView
                  people={trendingCelebs}
                  currentLanguage={currentLanguage}
                  onSearchCelebMovies={(name) => {
                    setSearchQuery(name);
                    loadDataForTab('popular', name, 1);
                  }}
                />
              ) : activeTab === 'born_today' || activeTab === 'born-today' ? (
                /* SPECIAL TAB 4: BORN TODAY */
                <div className="py-4">
                  <BornTodaySection currentLanguage={currentLanguage} />
                </div>
              ) : activeTab === 'top_news' || activeTab === 'movie-news' || activeTab === 'celebrity-news' || activeTab === 'tv-news' ? (
                /* SPECIAL TAB 5: TOP ENTERTAINMENT & CELEBRITY NEWS (+1000 ARTICLES, 10/PAGE PAGINATION, LIVE RSS) */
                <div className="py-4">
                  <EntertainmentNewsView
                    initialCategory={activeTab === 'celebrity-news' ? 'Celebrity News' : 'All'}
                    onBackToHome={() => handleTabSelect('popular', t.popular || 'Popular Movies')}
                    currentLanguage={currentLanguage}
                  />
                </div>
              ) : activeTab === 'oscars' ? (
                /* SPECIAL TAB 5B: OSCARS ACADEMY AWARD WINNERS (Requirement 5) */
                <div className="py-4">
                  <OscarsView
                    onWatchMovie={handleOpenWatchPage}
                    onBackToHome={() => handleTabSelect('popular', t.popular || 'Popular Movies')}
                    currentLanguage={currentLanguage}
                  />
                </div>
              ) : activeTab === 'eurofilm-blog' || activeTab === 'imdb-podcasts' ? (
                /* SPECIAL TAB 5C: EUROFILM BLOG (+10 CRITICAL FIRST-PERSON ESSAYS, STARS & COMMENTS - Requirement 8) */
                <div className="py-4">
                  <EuroFilmBlogView
                    onBackToHome={() => handleTabSelect('popular', t.popular || 'Popular Movies')}
                    currentLanguage={currentLanguage}
                  />
                </div>
              ) : activeTab === 'eurofilm-labs' ? (
                /* SPECIAL TAB 5D: EUROFILM LABS (Most Disliked & Controversial Films) */
                <div className="py-4">
                  <EuroFilmDislikedLabsView
                    movies={movies}
                    onWatchMovie={handleOpenWatchPage}
                    onBackToHome={() => handleTabSelect('popular', t.popular || 'Popular Movies')}
                    currentLanguage={currentLanguage}
                  />
                </div>
              ) : activeTab === 'top_box_office' || activeTab === 'top-box-office' ? (
                /* SPECIAL TAB 6: BOX OFFICE (US / India / UK) */
                <div className="py-4">
                  <BoxOfficeSection currentLanguage={currentLanguage} />
                </div>
              ) : activeTab === 'community-polls' || activeTab === 'polls' ? (
                /* SPECIAL TAB 7: COMMUNITY POLLS & FILM DEBATES */
                <div className="py-4">
                  <CommunityPollsAndDebatesView
                    onBackToHome={() => handleTabSelect('popular', t.popular || 'Popular Movies')}
                    currentLanguage={currentLanguage}
                  />
                </div>
              ) : activeTab === 'contributor-zone' ? (
                /* SPECIAL TAB 8: CONTRIBUTOR ZONE (Buy Me a Coffee, PayPal, Crypto) */
                <div className="py-4">
                  <ContributorZoneView
                    onBackToHome={() => handleTabSelect('popular', t.popular || 'Popular Movies')}
                    currentLanguage={currentLanguage}
                  />
                </div>
              ) : activeTab === 'help-center' ? (
                /* SPECIAL TAB 9: HELP CENTER (Free Movie & EuroFilm AI Chatbot) */
                <div className="py-4">
                  <HelpCenterChatView
                    onBackToHome={() => handleTabSelect('popular', t.popular || 'Popular Movies')}
                    onNavigateToTab={(tab, label) => handleTabSelect(tab, label)}
                    currentLanguage={currentLanguage}
                  />
                </div>
              ) : (
                /* REGULAR MOVIES / BOLLYWOOD / EUROFILM PICKS / DISCOVERY */
                <div className="space-y-10">
                  {/* Header Title & Controls */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-zinc-200 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight capitalize">
                          {searchQuery
                            ? `${ui.searchResultsFor} "${searchQuery}"`
                            : ageRatingFilter === 'under18'
                            ? ui.under18Heading
                            : ageRatingFilter === 'over18'
                            ? ui.over18Heading
                            : activeTab === 'indian_movies' || activeTab === 'india-movie-spotlight' || activeTab === 'bollywood-movie-spotlight'
                            ? ui.bollywoodHeading
                            : activeTab === 'eurofilm-picks' || activeTab === 'imdb-picks'
                            ? ui.eurofilmPicksHeading
                            : activeTab === 'browse-movies-genre'
                            ? ui.browseGenreHeading
                            : activeTab === 'top10_week'
                            ? t.top10ThisWeek || 'Top 10 on EuroFilm This Week'
                            : activeTab === 'fan_favorites'
                            ? t.fanFavorites || 'Fan Favorites'
                            : activeTab === 'top_rated_visitors'
                            ? t.topRatedVisitors || 'Top Rated by Visitors'
                            : activeTab === 'top_liked_visitors'
                            ? t.topLikedVisitors || 'Top Liked by Visitors'
                            : activeTab === 'popular'
                            ? t.popular || ui.mostPopular || 'Popular Movies'
                            : activeTab === 'now_playing'
                            ? t.nowPlaying || 'Now Playing in Theaters'
                            : activeTab === 'top_rated'
                            ? t.topRated || 'Top Rated Movies'
                            : activeTab === 'upcoming'
                            ? t.upcoming || 'Upcoming Releases'
                            : getHamburgerItemLabel(activeTab, currentLanguage, activeTabLabel)}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                        {searchQuery
                          ? `Found title(s) matching your inquiry`
                          : ageRatingFilter === 'under18'
                          ? ui.under18Subtext
                          : ageRatingFilter === 'over18'
                          ? ui.over18Subtext
                          : activeTab === 'indian_movies' || activeTab === 'india-movie-spotlight' || activeTab === 'bollywood-movie-spotlight'
                          ? ui.bollywoodSubtext
                          : activeTab === 'eurofilm-picks' || activeTab === 'imdb-picks'
                          ? ui.eurofilmPicksSubtext
                          : activeTab === 'browse-movies-genre'
                          ? ui.browseGenreSubtext
                          : ui.generalSubtext}
                      </p>
                    </div>

                    {/* Sort selector */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-700 bg-zinc-50 px-2.5 py-1.5 rounded-md border border-zinc-200">
                        <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="font-semibold text-zinc-600">{ui.sort}</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="bg-transparent text-zinc-900 font-medium focus:outline-none cursor-pointer"
                        >
                          <option value="popularity.desc">{ui.mostPopular}</option>
                          <option value="vote_average.desc">{ui.highestRated}</option>
                          <option value="primary_release_date.desc">{ui.newestReleases}</option>
                          <option value="revenue.desc">{ui.topBoxOfficeSort}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Genre Filter Chips (only when in general movies) */}
                  {activeTab !== 'indian_movies' && activeTab !== 'bollywood-movie-spotlight' && genres.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
                      <button
                        onClick={() => setSelectedGenre(null)}
                        className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0 text-xs font-medium cursor-pointer ${
                          selectedGenre === null
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {t.allGenres || ui.allGenres}
                      </button>
                      {genres.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() =>
                            setSelectedGenre(selectedGenre === genre.id ? null : genre.id)
                          }
                          className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0 text-xs font-medium cursor-pointer ${
                            selectedGenre === genre.id
                              ? 'bg-zinc-900 text-white'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {localizeGenre(genre.name, currentLanguage)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <div className="py-20 flex flex-col items-center justify-center text-zinc-500 space-y-3">
                      <div className="w-8 h-8 border-3 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                      <p className="text-xs font-medium">{ui.loadingMedia}</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !loading && (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center max-w-md mx-auto my-12 space-y-3">
                      <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                      <h3 className="font-bold text-red-900 text-sm">{ui.unableToRetrieve}</h3>
                      <p className="text-xs text-red-700">{error}</p>
                      <button
                        onClick={() =>
                          loadDataForTab(activeTab, searchQuery, 1, selectedGenre, sortBy)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {ui.retryRequest}
                      </button>
                    </div>
                  )}

                  {/* When filtered by -18 and all media: Display -18 Anime & Animations Spotlight */}
                  {!loading && !error && ageRatingFilter === 'under18' && displayedAnime.length > 0 && (
                    <div className="p-4 sm:p-5 bg-purple-50/70 rounded-xl border border-purple-200/90 mb-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <h3 className="text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-wide">
                            {ui.animeSpotlightHeading}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                            {ui.familySafe}
                          </span>
                        </div>
                        <button
                          onClick={() => handleTabSelect('anime', t.anime || 'Anime Trailers & Series')}
                          className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer hover:underline"
                        >
                          {ui.exploreAllAnime}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {displayedAnime.slice(0, 5).map((anime) => (
                          <div
                            key={anime.id}
                            onClick={() => handleWatchAnimeTrailer(anime)}
                            className="group cursor-pointer bg-white rounded-lg p-2 border border-purple-100 hover:border-purple-300 transition-all shadow-2xs flex flex-col justify-between"
                          >
                            <div className="relative aspect-3/4 rounded overflow-hidden bg-zinc-100 mb-2">
                              <img
                                src={anime.imageUrl}
                                alt={anime.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow">
                                  <Play className="w-3.5 h-3.5 ml-0.5 fill-zinc-900" />
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-zinc-950 line-clamp-1 group-hover:text-purple-700">
                                {anime.title}
                              </h4>
                              <span className="text-[10px] text-zinc-500 font-medium">
                                {anime.year || 2024} • {localizeGenre('Animation', currentLanguage)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media Grid (Using displayedMovies filtered by age rating) */}
                  {!loading && !error && displayedMovies.length > 0 && (
                    <div className="space-y-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayedMovies.map((movie, index) => {
                          const movieGenreNames = movie.genre_ids
                            ?.map((id) => genreMap.get(id))
                            .filter((name): name is string => typeof name === 'string');

                          return (
                            <React.Fragment key={movie.id}>
                              {index === 4 && (
                                <div className="col-span-1 sm:col-span-2 lg:col-span-4 my-2">
                                  <AdBanner
                                    variant="in-feed"
                                    title="Sponsored"
                                    subtitle="Advertisement from our ad partner"
                                  />
                                </div>
                              )}
                              <MovieCard
                                movie={movie}
                                currentLanguage={currentLanguage}
                                genreNames={movieGenreNames}
                                onWatchTrailer={(m) => handleOpenWatchPage(m)}
                              />
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Middle Leaderboard Ad */}
                      <AdBanner
                        variant="leaderboard"
                        className="my-6"
                        title="Sponsored"
                        subtitle="Advertisement from our ad partner"
                      />

                      {/* Pagination Controls */}
                      <div className="border-t border-zinc-200 pt-8 mt-10 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePageJump(currentPage - 1)}
                              disabled={currentPage <= 1 || loading}
                              className="px-3.5 py-2 bg-white border border-zinc-300 hover:border-zinc-900 rounded-md text-xs font-semibold flex items-center gap-1 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              {ui.prevPage}
                            </button>

                            <div className="hidden md:flex items-center gap-1 text-xs font-medium">
                              {[1, 10, 25, 50].map((pg) => (
                                <button
                                  key={pg}
                                  onClick={() => handlePageJump(pg)}
                                  className={`w-8 h-8 rounded-md transition-colors cursor-pointer ${
                                    currentPage === pg
                                      ? 'bg-zinc-950 text-white font-bold'
                                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                                  }`}
                                >
                                  {pg}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => handlePageJump(currentPage + 1)}
                              disabled={currentPage >= totalPages || loading}
                              className="px-3.5 py-2 bg-white border border-zinc-300 hover:border-zinc-900 rounded-md text-xs font-semibold flex items-center gap-1 text-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                            >
                              {ui.nextPage}
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          <form
                            onSubmit={handleJumpFormSubmit}
                            className="flex items-center gap-2 text-xs text-zinc-600"
                          >
                            <span>{ui.jumpToPage}</span>
                            <input
                              type="number"
                              min={1}
                              max={totalPages}
                              value={jumpPageInput}
                              onChange={(e) => setJumpPageInput(e.target.value)}
                              className="w-16 px-2 py-1.5 text-center text-xs bg-zinc-50 border border-zinc-300 rounded-md font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                            />
                            <span className="text-zinc-400">/ {totalPages}</span>
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                            >
                              {ui.go}
                            </button>
                          </form>
                        </div>

                        {currentPage < totalPages && (
                          <div className="flex justify-center pt-2">
                            <button
                              onClick={handleLoadMore}
                              disabled={loadingMore}
                              className="px-6 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-900 text-xs font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                              {loadingMore ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                                  <span>{ui.loadingMore}</span>
                                </>
                              ) : (
                                <span>{t.loadMore || ui.loadMore}</span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty Search State */}
                  {!loading && !error && movies.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-zinc-200 rounded-xl space-y-3">
                      <p className="text-sm font-medium text-zinc-900">
                        {ui.noTrailersFound}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedGenre(null);
                        }}
                        className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-md hover:bg-zinc-800 cursor-pointer"
                      >
                        {ui.clearFilter}
                      </button>
                    </div>
                  )}

                  {/* INLINE ENTERTAINMENT SECTIONS: Born Today, Box Office, Top News */}
                  {!searchQuery && activeTab === 'popular' && (
                    <div className="space-y-14 pt-8 border-t border-zinc-200">
                      <BornTodaySection currentLanguage={currentLanguage} />
                      <BoxOfficeSection currentLanguage={currentLanguage} />
                      <TopNewsSection currentLanguage={currentLanguage} />
                      <CommunityPollsSection currentLanguage={currentLanguage} />
                    </div>
                  )}
                </div>
              )}
            </main>
          </>
        )}

        {/* Footer */}
        <Footer
          onSelectTab={handleTabSelect}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          currentLanguage={currentLanguage}
        />
      </div>

      {/* Full Hamburger Drawer Menu */}
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        onSelectCategory={handleTabSelect}
        activeCategoryId={activeTab}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* About Section Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Sticky Bottom Ad Bar Across Entire Website */}
      <StickyAdBar />
    </div>
  );
}
