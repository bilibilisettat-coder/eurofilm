import React, { useState } from 'react';
import { OSCAR_WINNING_MOVIES, OscarMovie } from '../data/oscarsData';
import { Movie } from '../services/tmdb';
import { Award, Star, Play, Trophy, Filter } from 'lucide-react';
import { Language } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';

interface OscarsViewProps {
  onWatchMovie: (movie: Movie) => void;
  onBackToHome?: () => void;
  currentLanguage?: Language;
}

export function OscarsView({
  onWatchMovie,
  onBackToHome,
  currentLanguage = 'en',
}: OscarsViewProps) {
  const ui = getUiStrings(currentLanguage);
  const [filterBestPictureOnly, setFilterBestPictureOnly] = useState<boolean>(false);
  const [selectedDecade, setSelectedDecade] = useState<string>('All');

  const decades = [
    { id: 'All', label: ui.all },
    { id: '2020s', label: '2020s' },
    { id: '2010s', label: '2010s' },
    { id: '2000s & Classic', label: '2000s & Classic' },
  ];

  const filteredMovies = OSCAR_WINNING_MOVIES.filter((m) => {
    if (filterBestPictureOnly && !m.bestPicture) return false;
    if (selectedDecade === '2020s') return m.year >= 2020;
    if (selectedDecade === '2010s') return m.year >= 2010 && m.year < 2020;
    if (selectedDecade === '2000s & Classic') return m.year < 2010;
    return true;
  });

  const handleLaunchWatch = (oscar: OscarMovie) => {
    const movieObj: Movie = {
      id: oscar.tmdbId,
      title: oscar.title,
      original_title: oscar.title,
      overview: `${oscar.ceremony} - Winner of: ${oscar.awardsWon.join(', ')}. Directed by ${oscar.director}. ${oscar.overview}`,
      poster_path: oscar.posterUrl ? oscar.posterUrl.replace('https://image.tmdb.org/t/p/w500', '') : null,
      backdrop_path: oscar.backdropUrl ? oscar.backdropUrl.replace('https://image.tmdb.org/t/p/w1280', '') : null,
      release_date: `${oscar.year}-01-01`,
      vote_average: oscar.rating,
      vote_count: 8500,
      popularity: 200,
      genre_ids: [18, 36],
    };
    onWatchMovie(movieObj);
  };

  return (
    <div className="space-y-6">
      {/* Oscars Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              {ui.oscarsTitle}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              {ui.officialWinners}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
            {ui.oscarsSubtitle}
          </p>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-zinc-700 hover:text-black py-1.5 px-3 rounded-md border border-zinc-200 hover:bg-zinc-50 self-start sm:self-auto cursor-pointer"
          >
            {ui.backToMovies}
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-bold text-zinc-700">{ui.decade}:</span>
          <div className="flex gap-1">
            {decades.map((dec) => (
              <button
                key={dec.id}
                onClick={() => setSelectedDecade(dec.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedDecade === dec.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {dec.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filterBestPictureOnly}
            onChange={(e) => setFilterBestPictureOnly(e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span>{ui.bestPictureOnly}</span>
        </label>
      </div>

      {/* Grid of Oscar Winners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.map((oscar) => (
          <article
            key={oscar.id}
            className="group bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-colors shadow-2xs"
          >
            <div className="relative aspect-2/3 bg-zinc-100 overflow-hidden">
              <img
                src={oscar.posterUrl}
                alt={oscar.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
              />
              <div className="absolute top-2.5 right-2.5 bg-zinc-950/85 text-amber-300 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-xs border border-amber-500/30">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{oscar.rating.toFixed(1)}</span>
              </div>
              <div className="absolute top-2.5 left-2.5 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>{ui.officialWinners}</span>
              </div>
              <button
                onClick={() => handleLaunchWatch(oscar)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                aria-label={`${ui.watchOscarMovie}: ${oscar.title}`}
              >
                <span className="w-12 h-12 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-zinc-900" />
                </span>
              </button>
            </div>

            <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                  <Award className="w-3 h-3" />
                  <span>{oscar.ceremony}</span>
                </div>
                <h2 className="font-bold text-sm sm:text-base text-zinc-950 line-clamp-1" title={oscar.title}>
                  {oscar.title} ({oscar.year})
                </h2>
                <p className="text-[11px] font-semibold text-zinc-600">
                  Dir: {oscar.director}
                </p>

                {/* Awards won chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {oscar.awardsWon.slice(0, 2).map((aw, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-medium"
                    >
                      {aw}
                    </span>
                  ))}
                  {oscar.awardsWon.length > 2 && (
                    <span className="text-[10px] text-zinc-400 font-mono">
                      +{oscar.awardsWon.length - 2} more
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-600 line-clamp-2 pt-1 leading-relaxed">
                  {oscar.overview}
                </p>
              </div>

              <button
                onClick={() => handleLaunchWatch(oscar)}
                className="w-full py-2 px-3 text-xs font-semibold rounded bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{ui.watchOscarMovie}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
