import { Play, Star, Calendar, ThumbsUp, Heart } from 'lucide-react';
import { Movie, getPosterUrl } from '../services/tmdb';
import { getMovieInteractions } from '../services/interactionStore';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings, localizeGenre } from '../i18n/localize';

interface MovieCardProps {
  movie: Movie;
  onWatchTrailer: (movie: Movie) => void;
  genreNames?: string[];
  currentLanguage?: Language;
}

export function MovieCard({
  movie,
  onWatchTrailer,
  genreNames,
  currentLanguage = 'en',
}: MovieCardProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);
  const posterUrl = getPosterUrl(movie.poster_path, 'w342');
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const interactions = getMovieInteractions(movie.id);

  const localizedGenres = genreNames?.map((g) => localizeGenre(g, currentLanguage));

  return (
    <article
      className="group bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs"
      itemScope
      itemType="https://schema.org/Movie"
    >
      <meta itemProp="name" content={movie.title} />
      <meta itemProp="datePublished" content={movie.release_date || '2025'} />
      {/* Poster Container with EXIF ImageObject metadata */}
      <div
        className="relative aspect-2/3 bg-zinc-100 overflow-hidden"
        itemProp="image"
        itemScope
        itemType="https://schema.org/ImageObject"
      >
        <meta itemProp="contentUrl" content={posterUrl} />
        <meta itemProp="encodingFormat" content="image/jpeg" />
        <meta itemProp="width" content="342" />
        <meta itemProp="height" content="513" />
        <meta itemProp="caption" content={`${movie.title} theatrical artwork`} />
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          loading="lazy"
          decoding="async"
          width="342"
          height="513"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200 ease-out"
        />

        {/* Rating Score Badge */}
        <div className="absolute top-2.5 right-2.5 bg-zinc-950/85 backdrop-blur-xs text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 shadow-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{rating}</span>
        </div>

        {/* Community Likes Pill */}
        <div className="absolute top-2.5 left-2.5 bg-zinc-950/70 backdrop-blur-xs text-white text-[10px] font-mono font-medium px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
          <ThumbsUp className="w-2.5 h-2.5 text-blue-400" />
          <span>{interactions.reactions.like}</span>
        </div>

        {/* Play Overlay Button */}
        <button
          onClick={() => onWatchTrailer(movie)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label={`${t.watchTrailer || ui.watchTrailerPage}: ${movie.title}`}
        >
          <span className="w-12 h-12 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
            <Play className="w-5 h-5 ml-0.5 fill-zinc-900" />
          </span>
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-1">
            <Calendar className="w-3 h-3" />
            <span>{releaseYear}</span>
            {localizedGenres && localizedGenres.length > 0 && (
              <>
                <span>•</span>
                <span className="truncate">{localizedGenres.slice(0, 2).join(', ')}</span>
              </>
            )}
          </div>

          <h3
            className="font-bold text-sm text-zinc-950 line-clamp-1 group-hover:text-zinc-700 transition-colors"
            title={movie.title}
          >
            {movie.title}
          </h3>

          <p className="text-xs text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
            {movie.overview || ui.noSynopsis}
          </p>
        </div>

        {/* Community Star / Love preview & Action Button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-100 pt-2">
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {interactions.averageRating}★ {ui.visitor}
            </span>
            <span className="flex items-center gap-1 text-rose-600 font-medium">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              {interactions.reactions.love} {ui.loves}
            </span>
          </div>

          <button
            onClick={() => onWatchTrailer(movie)}
            className="w-full py-2 px-3 text-xs font-semibold rounded bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{t.watchTrailer || ui.watchTrailerPage}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
