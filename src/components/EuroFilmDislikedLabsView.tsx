import React, { useState, useMemo } from 'react';
import { Movie, getPosterUrl } from '../services/tmdb';
import { getMovieInteractions } from '../services/interactionStore';
import {
  ThumbsDown,
  ThumbsUp,
  Star,
  Play,
  FlaskConical,
  Filter,
  ArrowLeft,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';
import { AdBanner } from './AdBanner';

interface EuroFilmDislikedLabsViewProps {
  movies: Movie[];
  onWatchMovie: (movie: Movie) => void;
  onBackToHome?: () => void;
  currentLanguage?: Language;
}

export function EuroFilmDislikedLabsView({
  movies,
  onWatchMovie,
  onBackToHome,
  currentLanguage = 'en',
}: EuroFilmDislikedLabsViewProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  const [dislikeFilter, setDislikeFilter] = useState<'all' | 'high' | 'extreme'>('all');
  const [minDislikeCount, setMinDislikeCount] = useState<number>(0);

  // Compute and sort movies by dislikes
  const dislikedMovies = useMemo(() => {
    const listWithDislikes = movies.map((m) => {
      const interactions = getMovieInteractions(m.id);
      // Ensure synthetic interesting variation in dislikes for Labs
      const dislikes = interactions.reactions.dislike;
      const likes = interactions.reactions.like;
      const ratio = dislikes / (likes + dislikes || 1);
      return {
        movie: m,
        interactions,
        dislikes,
        likes,
        ratio,
      };
    });

    // Sort by total dislikes descending
    const sorted = listWithDislikes.sort((a, b) => b.dislikes - a.dislikes);

    if (dislikeFilter === 'high') {
      return sorted.filter((item) => item.dislikes >= 25);
    }
    if (dislikeFilter === 'extreme') {
      return sorted.filter((item) => item.dislikes >= 35);
    }
    return sorted;
  }, [movies, dislikeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-600 text-white rounded-lg">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                EuroFilm Labs: Most Disliked
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  Visitor Backlash Index
                </span>
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Curating the most controversial and heavily disliked films as voted by the global EuroFilm audience
              </p>
            </div>
          </div>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-300 hover:border-zinc-900 text-xs font-bold rounded-md transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.home || 'Back to Home'}</span>
          </button>
        )}
      </div>

      {/* Explanatory Banner */}
      <div className="p-5 bg-gradient-to-r from-zinc-900 to-zinc-950 text-white rounded-2xl border border-rose-900/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Unfiltered Audience Backlash</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Films in EuroFilm Labs accumulate significant 👎 Dislike votes from visitors tired of studio marketing, narrative bloat, or polarizing twists. Watch the trailers to evaluate whether the backlash is earned!
          </p>
        </div>
      </div>

      {/* Dislike Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-600" />
          <span className="text-xs font-bold text-zinc-800">Filter by Dislike Volume:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setDislikeFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              dislikeFilter === 'all'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            All Disliked Films ({movies.length})
          </button>
          <button
            onClick={() => setDislikeFilter('high')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              dislikeFilter === 'high'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <ThumbsDown className="w-3 h-3" />
            <span>High Dislikes (25+)</span>
          </button>
          <button
            onClick={() => setDislikeFilter('extreme')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              dislikeFilter === 'extreme'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Extreme Backlash (35+)</span>
          </button>
        </div>
      </div>

      <AdBanner
        variant="leaderboard"
        title="Sponsored Cinema Partner: Stream Full Movies & Uncut Releases Online"
        subtitle="Zero buffering • Complete trailer mirrors and uncut premieres"
      />

      {/* Grid of Disliked Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dislikedMovies.map(({ movie, dislikes, likes, interactions }) => (
          <article
            key={movie.id}
            className="group bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-rose-400 transition-all shadow-2xs hover:shadow-md"
          >
            <div className="relative aspect-2/3 bg-zinc-100 overflow-hidden">
              <img
                src={getPosterUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
              />

              {/* Red Dislike Badge on Top Right */}
              <div className="absolute top-2.5 right-2.5 bg-rose-600/95 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                <ThumbsDown className="w-3.5 h-3.5 fill-current" />
                <span>{dislikes} Dislikes</span>
              </div>

              {/* Play Overlay */}
              <button
                onClick={() => onWatchMovie(movie)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                aria-label={`Watch trailer for ${movie.title}`}
              >
                <span className="w-12 h-12 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-zinc-900" />
                </span>
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                  <span>{movie.release_date ? movie.release_date.split('-')[0] : '2024'}</span>
                  <span className="text-zinc-400 font-mono">
                    Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'} / 10
                  </span>
                </div>

                <h3 className="font-bold text-sm text-zinc-950 line-clamp-1 group-hover:text-rose-700 transition-colors">
                  {movie.title}
                </h3>

                <p className="text-xs text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
                  {movie.overview || 'No synopsis provided.'}
                </p>
              </div>

              {/* Dislike vs Like Comparison Bar */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3" /> {dislikes} Dislikes
                  </span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> {likes} Likes
                  </span>
                </div>

                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-rose-500"
                    style={{ width: `${Math.round((dislikes / (dislikes + likes)) * 100)}%` }}
                  />
                  <div
                    className="bg-blue-500"
                    style={{ width: `${Math.round((likes / (dislikes + likes)) * 100)}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onWatchMovie(movie)}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-zinc-950 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch &amp; Rate Trailer</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
