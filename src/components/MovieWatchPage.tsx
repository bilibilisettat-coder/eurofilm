import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  Users,
  Film,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Share2,
  Check,
  Compass,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Smile,
  AlertCircle,
  Play,
  ExternalLink,
} from 'lucide-react';
import {
  Movie,
  MovieDetail,
  VideoResult,
  getMovieDetails,
  getPosterUrl,
  setTmdbLanguage,
} from '../services/tmdb';
import { MovieCard } from './MovieCard';
import { ALL_RAW_KEYWORDS } from '../data/keywords';
import { generateFilmEssay } from '../utils/filmEssayGenerator';
import {
  getMovieInteractions,
  recordUserRating,
  recordUserReaction,
  MovieInteractions,
  ReactionType,
} from '../services/interactionStore';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings, localizeGenre } from '../i18n/localize';
import { AdBanner } from './AdBanner';
import { updateDynamicMediaMetadata, resetGlobalMediaMetadata, trackTrailerPlay } from '../utils/analytics';

interface MovieWatchPageProps {
  movieId: number;
  initialMovie?: Movie | null;
  onBack: () => void;
  onSelectMovie: (movie: Movie) => void;
  genreMap: Map<number, string>;
  currentLanguage?: Language;
}

export function MovieWatchPage({
  movieId,
  initialMovie,
  onBack,
  onSelectMovie,
  genreMap,
  currentLanguage = 'en',
}: MovieWatchPageProps) {
  const fullText = ALL_RAW_KEYWORDS.join(', ');
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [availableVideos, setAvailableVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction State
  const [interactions, setInteractions] = useState<MovieInteractions>(() =>
    getMovieInteractions(movieId)
  );
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setSelectedVideo(null);
    setAvailableVideos([]);
    setInteractions(getMovieInteractions(movieId));

    // Scroll to top when opening watch page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTmdbLanguage(currentLanguage);
    getMovieDetails(movieId)
      .then((data) => {
        if (!isMounted) return;
        setMovie(data);
        const videos = data.videos?.results || [];
        setAvailableVideos(videos);

        const official = videos.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
        );
        const anyTrailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
        const anyTeaser = videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser');
        const anyYt = videos.find((v) => v.site === 'YouTube');
        const chosenVideo = official || anyTrailer || anyTeaser || anyYt || null;
        setSelectedVideo(chosenVideo);
        setLoading(false);

        // Update EXIF & Rich Video Metadata and track trailer play event
        updateDynamicMediaMetadata({
          title: data.title || 'Film Trailer',
          description: data.overview,
          imageUrl: data.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
            : getPosterUrl(data.poster_path, 'w500'),
          imageWidth: 1280,
          imageHeight: 720,
          videoUrl: chosenVideo ? `https://www.youtube.com/embed/${chosenVideo.key}` : undefined,
          releaseDate: data.release_date,
          rating: data.vote_average,
          genre: data.genres?.map((g) => g.name),
        });

        if (chosenVideo) {
          trackTrailerPlay(movieId, data.title, chosenVideo.key);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load movie details:', err);
        setError(err.message || 'Unable to retrieve trailer information.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      resetGlobalMediaMetadata();
    };
  }, [movieId, currentLanguage]);

  const displayMovie = movie || initialMovie;

  const currentGenreNames = useMemo(() => {
    let rawGenres: string[] = [];
    if (movie?.genres && movie.genres.length > 0) {
      rawGenres = movie.genres.map((g) => g.name);
    } else if (displayMovie?.genre_ids && displayMovie.genre_ids.length > 0) {
      rawGenres = displayMovie.genre_ids
        .map((id) => genreMap.get(id))
        .filter((g): g is string => typeof g === 'string');
    } else {
      rawGenres = ['Cinema', 'Drama'];
    }
    return rawGenres.map((name) => localizeGenre(name, currentLanguage));
  }, [movie, displayMovie, genreMap, currentLanguage]);

  // Generate +2500 word first-person film essay
  const essay = useMemo(() => {
    if (!displayMovie) return null;
    return generateFilmEssay(
      (movie || {
        ...displayMovie,
        credits: { cast: [] },
      }) as MovieDetail,
      currentGenreNames
    );
  }, [displayMovie, movie, currentGenreNames]);

  // Generate embedded video iframe source (NEVER redirects to YouTube)
  const videoEmbedSrc = selectedVideo?.key
    ? `https://www.youtube-nocookie.com/embed/${selectedVideo.key}?autoplay=1&rel=0&modestbranding=1`
    : displayMovie?.title
    ? `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
        `${displayMovie.title} official trailer`
      )}&autoplay=1&rel=0&modestbranding=1`
    : null;

  // Rating action handler
  const handleRate = (stars: number) => {
    const updated = recordUserRating(movieId, stars);
    setInteractions(updated);
  };

  // Reaction action handler (like, dislike, love, laugh, surprise)
  const handleReaction = (type: ReactionType) => {
    const updated = recordUserReaction(movieId, type);
    setInteractions(updated);
  };

  // Share action handler
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${displayMovie?.title || 'Movie'} Official Trailer | EuroFilm`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Watch the official trailer for ${displayMovie?.title} on EuroFilm`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="relative w-full bg-white text-zinc-900 pb-20 selection:bg-zinc-200 selection:text-zinc-900">
      {/* Background theme keywords stuck on this page in white camouflaged text */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none p-6 sm:p-10 md:p-16 lg:p-20 text-white font-sans text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-tight leading-loose sm:leading-loose text-justify break-words fixed inset-0 -z-10 overflow-hidden"
        style={{ color: '#ffffff', backgroundColor: 'transparent' }}
      >
        {fullText}
      </div>

      {/* Top Breadcrumb & Back Bar */}
      <div className="border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-xs sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-800 hover:text-zinc-950 bg-white border border-zinc-300 hover:border-zinc-900 px-3.5 py-1.5 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToBrowse || 'Back to Browse Movies'}</span>
          </button>

          {displayMovie && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-300 hover:border-zinc-900 text-xs font-semibold rounded-md shadow-2xs text-zinc-800 hover:text-zinc-950 transition-colors cursor-pointer"
                title="Share this trailer"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{t.copiedLink || 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{t.shareTrailer || 'Share Trailer'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Loading State */}
        {loading && !displayMovie && (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-500 font-medium">{ui.loadingTrailerPlayer}</p>
          </div>
        )}

        {/* Error State */}
        {error && !displayMovie && (
          <div className="p-8 max-w-lg mx-auto my-12 bg-red-50 border border-red-200 rounded-xl text-center space-y-3">
            <h3 className="font-bold text-red-900 text-sm">{ui.trailerUnavailable}</h3>
            <p className="text-xs text-red-700">{error}</p>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-red-800 text-white rounded text-xs font-semibold cursor-pointer"
            >
              {ui.returnToCatalog}
            </button>
          </div>
        )}

        {displayMovie && (
          <div className="space-y-10">
            {/* Movie Title Banner */}
            <div className="space-y-2 border-b border-zinc-200 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-zinc-900 text-white">
                  {ui.officialHdtrailer}
                </span>
                {movie?.status && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {movie.status}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight">
                {displayMovie.title}
                {displayMovie.release_date && (
                  <span className="text-zinc-400 font-normal ml-2 sm:ml-3 text-xl sm:text-2xl">
                    ({displayMovie.release_date.split('-')[0]})
                  </span>
                )}
              </h2>

              {movie?.tagline && (
                <p className="text-xs sm:text-sm text-zinc-600 italic font-serif">&ldquo;{movie.tagline}&rdquo;</p>
              )}
            </div>

            {/* Video Player Section - Full Cinema View Embedded Inside Site (NEVER leaves website) */}
            <div className="bg-zinc-950 rounded-2xl overflow-hidden shadow-xl border border-zinc-800">
              <div className="relative aspect-video w-full bg-black">
                {videoEmbedSrc ? (
                  <iframe
                    src={videoEmbedSrc}
                    title={`${displayMovie.title} Official Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-zinc-400">
                    <Film className="w-12 h-12 text-zinc-600 mb-2" />
                    <p className="text-sm font-medium">Trailer stream loading...</p>
                  </div>
                )}
              </div>

              {/* Video Selector Pills if multiple video clips exist */}
              {availableVideos.length > 1 && (
                <div className="bg-zinc-900/90 border-t border-zinc-800 px-4 py-3 flex items-center gap-2 overflow-x-auto text-xs">
                  <span className="text-zinc-400 font-medium shrink-0 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {ui.availableClips}
                  </span>
                  {availableVideos.slice(0, 6).map((vid) => (
                    <button
                      key={vid.id}
                      onClick={() => setSelectedVideo(vid)}
                      className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors font-medium shrink-0 cursor-pointer ${
                        selectedVideo?.id === vid.id
                          ? 'bg-white text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {vid.name.length > 32 ? vid.name.substring(0, 32) + '...' : vid.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sponsored Ultra HD Stream Mirror */}
            <AdBanner
              variant="player-mirror"
              title={`Play ${displayMovie.title} - Ultra HD Stream Mirror`}
              subtitle="Sponsored fast streaming partner • Bufferless 4K bitrate • Instant access"
            />

            {/* TRAILER INTERACTIONS BAR: Star Rating + Emoji Reactions + Share Button */}
            <div className="p-4 sm:p-5 bg-zinc-50 border border-zinc-200 rounded-xl shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* 1. Star Rating (1 to 5 Stars) */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                    {t.rateThisTrailer || 'Rate this Trailer:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-zinc-300 hover:scale-115 transition-transform cursor-pointer"
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || interactions.userRating || 0) >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-transparent text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-zinc-900 ml-2">
                      {interactions.averageRating} / 5
                    </span>
                    <span className="text-[11px] text-zinc-500 font-normal">
                      ({interactions.ratingCount.toLocaleString()} votes)
                    </span>
                  </div>
                </div>

                {/* 2. Emoji Reactions: Like, Dislike, Love, Laugh, Surprise */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                    {t.reactions || 'Trailer Reactions:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {/* 👍 Like */}
                    <button
                      onClick={() => handleReaction('like')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        interactions.userReaction === 'like'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                      }`}
                      title="Like"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{interactions.reactions.like.toLocaleString()}</span>
                    </button>

                    {/* 👎 Dislike */}
                    <button
                      onClick={() => handleReaction('dislike')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        interactions.userReaction === 'dislike'
                          ? 'bg-zinc-800 text-white border-zinc-800 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                      }`}
                      title="Dislike"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{interactions.reactions.dislike.toLocaleString()}</span>
                    </button>

                    {/* ❤️ Love */}
                    <button
                      onClick={() => handleReaction('love')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        interactions.userReaction === 'love'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                      }`}
                      title="Love"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>{interactions.reactions.love.toLocaleString()}</span>
                    </button>

                    {/* 😂 Laugh */}
                    <button
                      onClick={() => handleReaction('laugh')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        interactions.userReaction === 'laugh'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                      }`}
                      title="Laugh"
                    >
                      <Smile className="w-4 h-4" />
                      <span>{interactions.reactions.laugh.toLocaleString()}</span>
                    </button>

                    {/* 😮 Surprise */}
                    <button
                      onClick={() => handleReaction('surprise')}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        interactions.userReaction === 'surprise'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                      }`}
                      title="Surprise"
                    >
                      <span className="text-sm leading-none">😮</span>
                      <span>{interactions.reactions.surprise.toLocaleString()}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Share Button */}
                <div className="pt-2 md:pt-0">
                  <button
                    onClick={handleShare}
                    className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{t.copiedLink || 'Copied Link!'}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>{t.shareTrailer || 'Share Trailer'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Movie Overview & Technical Details Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
              {/* Left Column: Synopsis, Cast */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 uppercase tracking-wider text-xs mb-2">
                    {t.officialSynopsis || 'Official Synopsis'}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-sans">
                    {displayMovie.overview || 'No storyline synopsis currently recorded for this film.'}
                  </p>
                </div>

                {/* Cast Members */}
                {movie?.credits?.cast && movie.credits.cast.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-zinc-700" />
                      {t.featuredCast || 'Featured Cast'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {movie.credits.cast.slice(0, 6).map((actor) => (
                        <div
                          key={actor.id}
                          className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-2.5"
                        >
                          <div className="w-9 h-9 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                            {actor.profile_path ? (
                              <img
                                src={getPosterUrl(actor.profile_path, 'w185')}
                                alt={actor.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">
                                {actor.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-zinc-900 truncate">
                              {actor.name}
                            </div>
                            <div className="text-[11px] text-zinc-500 truncate">
                              {actor.character}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Metadata Card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4 self-start shadow-2xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-200 pb-2">
                  {t.filmSpecifications || 'Film Specifications'}
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">{t.userRating || 'User Rating'}</span>
                    <span className="font-bold text-zinc-950 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {displayMovie.vote_average ? displayMovie.vote_average.toFixed(1) : 'NR'} / 10
                      <span className="text-[10px] text-zinc-400 font-normal">
                        ({displayMovie.vote_count} reviews)
                      </span>
                    </span>
                  </div>

                  {displayMovie.release_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        {t.releaseDate || 'Release Date'}
                      </span>
                      <span className="font-semibold text-zinc-900">{displayMovie.release_date}</span>
                    </div>
                  )}

                  {movie?.runtime ? (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {t.runtime || 'Runtime'}
                      </span>
                      <span className="font-semibold text-zinc-900">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </div>
                  ) : null}

                  {movie?.budget && movie.budget > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                        {t.budget || 'Budget'}
                      </span>
                      <span className="font-semibold text-zinc-900">
                        ${(movie.budget / 1_000_000).toFixed(1)}M
                      </span>
                    </div>
                  ) : null}

                  {movie?.revenue && movie.revenue > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">{t.boxOffice || 'Box Office'}</span>
                      <span className="font-semibold text-zinc-900">
                        ${(movie.revenue / 1_000_000).toFixed(1)}M
                      </span>
                    </div>
                  ) : null}

                  {/* Genres */}
                  <div className="pt-2 border-t border-zinc-200">
                    <span className="text-zinc-500 block mb-1.5">{t.genres || 'Genres'}</span>
                    <div className="flex flex-wrap gap-1">
                      {currentGenreNames.map((name, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-800 text-[11px] font-medium"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Sponsored Ad */}
                  <div className="pt-3 border-t border-zinc-200">
                    <AdBanner
                      variant="compact"
                      title="Sponsor: Fast 4K Movie Streaming Access"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* +2500 WORD ESSAY WITH H1, H2 SUBTITLES AND H3 PARAGRAPHS - Clean, no metric tags */}
            {essay && (
              <article className="border border-zinc-200 rounded-2xl p-6 sm:p-10 lg:p-14 bg-white shadow-xs space-y-12">
                {/* Header Banner */}
                <div className="border-b border-zinc-200 pb-8 space-y-4">
                  {/* H1 Title as requested */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight leading-snug">
                    {essay.h1}
                  </h1>

                  <p className="text-sm text-zinc-600 leading-relaxed font-serif italic max-w-3xl">
                    An in-depth first-person cinematic inquiry exploring the narrative tensions, moral stakes, and complex climax of {displayMovie.title}.
                  </p>
                </div>

                {/* Essay Sections with H2 Subtitles and H3 Paragraphs */}
                <div className="space-y-14">
                  {essay.sections.map((section, sIdx) => (
                    <section key={sIdx} className="space-y-6">
                      {/* H2 Subtitle as requested */}
                      <div className="border-b border-zinc-200 pb-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono uppercase tracking-wider mb-1">
                          <Compass className="w-3.5 h-3.5" />
                          <span>Chapter 0{sIdx + 1}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                          {section.h2}
                        </h2>
                      </div>

                      {/* Subsections with H3 Titles and Paragraphs */}
                      <div className="space-y-8 pl-0 sm:pl-2">
                        {section.subsections.map((sub, subIdx) => (
                          <div key={subIdx} className="space-y-3.5">
                            {/* H3 Subtitle as requested */}
                            <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                              {sub.h3}
                            </h3>

                            {/* Paragraphs in First-Person voice (+2500 words total) */}
                            <div className="space-y-3.5 text-zinc-700 text-sm sm:text-base leading-relaxed text-justify font-sans">
                              {sub.paragraphs.map((p, pIdx) => (
                                <p key={pIdx} className="leading-relaxed sm:leading-loose">
                                  {p}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Clean Essay Footer Attribution: Author: EuroFilm */}
                <div className="border-t border-zinc-200 pt-6 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-800">{ui.authorAttribution}</span>
                  <span className="text-zinc-400">{ui.publishedOn}</span>
                </div>
              </article>
            )}

            {/* Sponsored Leaderboard Ad */}
            <AdBanner
              variant="leaderboard"
              title={`Watch ${displayMovie.title} & New Cinema Releases in HD`}
              subtitle="Official streaming partner offer • Unlimited movies & series"
            />

            {/* Related / Recommended Movies */}
            {movie?.recommendations?.results && movie.recommendations.results.length > 0 && (
              <section className="pt-8 border-t border-zinc-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                    {ui.moreTrailersYouMayLike}
                  </h2>
                  <span className="text-xs text-zinc-400">{ui.streamOnEurofilm}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.recommendations.results.slice(0, 5).map((recMovie) => (
                    <MovieCard
                      key={recMovie.id}
                      movie={recMovie}
                      currentLanguage={currentLanguage}
                      genreNames={recMovie.genre_ids?.map((id) => genreMap.get(id) || '').filter(Boolean)}
                      onWatchTrailer={(m) => onSelectMovie(m)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
