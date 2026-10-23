import React from 'react';
import { AnimeItem, TVShowItem, CelebPerson } from '../services/externalApis';
import { Star, Play, Calendar, Tv, Sparkles, Flame } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';
import { AdBanner } from './AdBanner';

// 1. Anime Catalog View (Anime Movies & Series with interactive filtering)
interface AnimeViewProps {
  animeList: AnimeItem[];
  onWatchAnimeTrailer: (anime: AnimeItem) => void;
  currentLanguage?: Language;
}

export function AnimeCatalogView({
  animeList,
  onWatchAnimeTrailer,
  currentLanguage = 'en',
}: AnimeViewProps) {
  const ui = getUiStrings(currentLanguage);
  const [filterType, setFilterType] = React.useState<'all' | 'movies' | 'series'>('all');

  const filteredList = React.useMemo(() => {
    if (filterType === 'movies') {
      return animeList.filter(
        (a) =>
          a.episodes === 1 ||
          a.genres.some((g) => g.toLowerCase().includes('movie')) ||
          a.status === 'Released in Theaters'
      );
    }
    if (filterType === 'series') {
      return animeList.filter(
        (a) =>
          (a.episodes && a.episodes > 1) ||
          a.genres.some((g) => !g.toLowerCase().includes('movie'))
      );
    }
    return animeList;
  }, [animeList, filterType]);

  const moviesCount = React.useMemo(
    () =>
      animeList.filter(
        (a) =>
          a.episodes === 1 ||
          a.genres.some((g) => g.toLowerCase().includes('movie')) ||
          a.status === 'Released in Theaters'
      ).length,
    [animeList]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
              {ui.animeSpotlightHeading || 'Anime Trailers, Movies & Series'}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
              {ui.liveAnimeFeed}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Official theatrical anime movies, classic animation, and top streaming series
          </p>
        </div>

        {/* Anime Filter Pills: All / Anime Movies / Anime Series */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            All Anime ({animeList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('movies')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'movies'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
            }`}
          >
            <span>🎬 Anime Movies ({moviesCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('series')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'series'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <span>📺 Anime Series</span>
          </button>
        </div>
      </div>

      <AdBanner
        variant="leaderboard"
        title="Sponsored"
        subtitle="Advertisement from our ad partner"
      />

      {/* 4 in every horizontal line on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredList.map((anime) => {
          const isMovie =
            anime.episodes === 1 ||
            anime.genres.some((g) => g.toLowerCase().includes('movie')) ||
            anime.status === 'Released in Theaters';

          return (
            <article
              key={anime.id}
              className="group bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs"
            >
              <div className="relative aspect-2/3 bg-zinc-100 overflow-hidden">
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                />
                <div className="absolute top-2.5 right-2.5 bg-zinc-950/85 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{anime.score ? anime.score.toFixed(1) : '8.5'}</span>
                </div>
                {isMovie && (
                  <div className="absolute top-2.5 left-2.5 bg-purple-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs tracking-wider uppercase">
                    🎬 Movie
                  </div>
                )}
                <button
                  onClick={() => onWatchAnimeTrailer(anime)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  aria-label={`${ui.watchAnimeTrailer}: ${anime.title}`}
                >
                  <span className="w-12 h-12 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-zinc-900" />
                  </span>
                </button>
              </div>

              <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{anime.year || '2024'}</span>
                    <span>•</span>
                    <span className="font-semibold text-purple-700">
                      {isMovie ? 'Theatrical Film' : `${anime.episodes || 12} eps`}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-zinc-950 line-clamp-1" title={anime.title}>
                    {anime.title}
                  </h3>
                  <p className="text-xs text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
                    {anime.synopsis || ui.noSynopsis}
                  </p>
                </div>

                <button
                  onClick={() => onWatchAnimeTrailer(anime)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isMovie ? 'Watch Movie Trailer' : ui.watchAnimeTrailer}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// 2. TV Shows View (Talk Shows, Reality, Broadcast Variety - NOT scripted series or movies)
interface TVShowsViewProps {
  shows: TVShowItem[];
  onWatchShowTrailer: (show: TVShowItem) => void;
  title?: string;
  subtitle?: string;
  badge?: string;
  currentLanguage?: Language;
}

export function TVShowsCatalogView({
  shows,
  onWatchShowTrailer,
  title,
  subtitle,
  badge,
  currentLanguage = 'en',
}: TVShowsViewProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  const [tvCategory, setTvCategory] = React.useState<'all' | 'talk' | 'reality' | 'broadcast'>('all');

  const filteredShows = React.useMemo(() => {
    if (tvCategory === 'talk') {
      return shows.filter(
        (s) =>
          s.genres?.some((g) => g.toLowerCase().includes('talk') || g.toLowerCase().includes('late')) ||
          s.title.toLowerCase().includes('show') ||
          s.title.toLowerCase().includes('live') ||
          s.overview.toLowerCase().includes('host')
      );
    }
    if (tvCategory === 'reality') {
      return shows.filter(
        (s) =>
          s.genres?.some((g) => g.toLowerCase().includes('reality') || g.toLowerCase().includes('competition')) ||
          s.overview.toLowerCase().includes('reality') ||
          s.overview.toLowerCase().includes('contest')
      );
    }
    if (tvCategory === 'broadcast') {
      return shows.filter(
        (s) =>
          s.genres?.some((g) => g.toLowerCase().includes('broadcast') || g.toLowerCase().includes('news') || g.toLowerCase().includes('variety')) ||
          s.overview.toLowerCase().includes('broadcast')
      );
    }
    return shows;
  }, [shows, tvCategory]);

  const displayTitle = title || t.tvShows || 'TV Shows (Talk & Broadcast)';
  const displaySubtitle = subtitle || 'Popular television broadcasts, late-night talk shows, and reality TV entertainment';
  const displayBadge = badge || 'TV Broadcasts';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
              {displayTitle}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
              {displayBadge}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {displaySubtitle}
          </p>
        </div>

        {/* TV Show Sub-filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTvCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              tvCategory === 'all'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            All Shows ({shows.length})
          </button>
          <button
            type="button"
            onClick={() => setTvCategory('talk')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              tvCategory === 'talk'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
            }`}
          >
            🎤 Talk & Late Night
          </button>
          <button
            type="button"
            onClick={() => setTvCategory('reality')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              tvCategory === 'reality'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
            }`}
          >
            ✨ Reality TV
          </button>
        </div>
      </div>

      <AdBanner
        variant="leaderboard"
        title="Sponsored"
        subtitle="Advertisement from our ad partner"
      />

      {/* 4 in every horizontal line on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredShows.map((show) => (
          <article
            key={show.id}
            className="group bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs"
          >
            <div className="relative aspect-2/3 bg-zinc-100 overflow-hidden">
              <img
                src={show.imageUrl}
                alt={show.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
              />
              <div className="absolute top-2.5 right-2.5 bg-zinc-950/85 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 shadow-xs">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{show.voteAverage.toFixed(1)}</span>
              </div>
              <div className="absolute top-2.5 left-2.5 bg-sky-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs tracking-wider uppercase">
                TV Show
              </div>
              <button
                onClick={() => onWatchShowTrailer(show)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                aria-label={`${ui.watchSeriesTrailer}: ${show.title}`}
              >
                <span className="w-12 h-12 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-zinc-900" />
                </span>
              </button>
            </div>

            <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
                  <Tv className="w-3 h-3" />
                  <span>TV Show</span>
                  {show.firstAirDate && (
                    <>
                      <span>•</span>
                      <span>{show.firstAirDate.split('-')[0]}</span>
                    </>
                  )}
                </div>
                <h3 className="font-bold text-sm text-zinc-950 line-clamp-1" title={show.title}>
                  {show.title}
                </h3>
                <p className="text-xs text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
                  {show.overview || ui.noSynopsis}
                </p>
              </div>

              <button
                onClick={() => onWatchShowTrailer(show)}
                className="w-full py-2 px-3 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch TV Show Preview</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// 3. Trending People & Celebs View
interface CelebsViewProps {
  people: CelebPerson[];
  onSearchCelebMovies: (name: string) => void;
  currentLanguage?: Language;
}

export function TrendingPeopleView({
  people,
  onSearchCelebMovies,
  currentLanguage = 'en',
}: CelebsViewProps) {
  const ui = getUiStrings(currentLanguage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
              {ui.celebrityNews || 'Trending Celebrities & STARmeter'}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
              {ui.globalRanks}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {ui.topNewsSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {people.map((person, idx) => (
          <div
            key={person.id}
            onClick={() => onSearchCelebMovies(person.name)}
            className="group bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs hover:border-zinc-900 transition-colors flex flex-col justify-between cursor-pointer"
          >
            <div className="aspect-square bg-zinc-100 overflow-hidden relative">
              {person.profilePath ? (
                <img
                  src={person.profilePath}
                  alt={person.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400 text-lg">
                  {person.name.charAt(0)}
                </div>
              )}
              <span className="absolute top-1.5 left-1.5 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                #{idx + 1}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h3 className="font-bold text-xs sm:text-sm text-zinc-950 truncate group-hover:text-amber-600 transition-colors">
                {person.name}
              </h3>
              <p className="text-[11px] text-zinc-500 truncate">{person.knownForDepartment}</p>
              {person.knownFor.length > 0 && (
                <p className="text-[10px] text-zinc-400 line-clamp-1 italic">
                  {person.knownFor.slice(0, 2).join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
