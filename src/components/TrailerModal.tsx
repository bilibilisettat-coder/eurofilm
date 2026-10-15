import { useEffect, useState } from 'react';
import { X, Play, Star, Calendar, Clock, Film, ExternalLink, Users } from 'lucide-react';
import { Movie, MovieDetail, VideoResult, getMovieDetails } from '../services/tmdb';

interface TrailerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export function TrailerModal({ movie, onClose }: TrailerModalProps) {
  const [details, setDetails] = useState<MovieDetail | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movie) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setSelectedVideo(null);

    getMovieDetails(movie.id)
      .then((data) => {
        if (!isMounted) return;
        setDetails(data);
        const videos = data.videos?.results || [];

        // Prioritize official trailer, then any trailer, then teaser
        const officialTrailer = videos.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
        );
        const anyTrailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
        const anyTeaser = videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser');
        const anyYouTube = videos.find((v) => v.site === 'YouTube');

        const bestVideo = officialTrailer || anyTrailer || anyTeaser || anyYouTube || null;
        setSelectedVideo(bestVideo);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Could not load trailer details');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [movie]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-zinc-950/80 backdrop-blur-xs"
    >
      <div className="bg-white border border-zinc-200 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2 truncate pr-4">
            <Film className="w-4 h-4 text-zinc-700 shrink-0" />
            <h2 id="modal-title" className="font-bold text-sm sm:text-base text-zinc-900 truncate">
              {movie.title}
              {movie.release_date && (
                <span className="font-normal text-zinc-500 text-xs sm:text-sm ml-2">
                  ({movie.release_date.split('-')[0]})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
            aria-label="Close trailer dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          {/* Video Player Section */}
          <div className="relative aspect-video w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900 shadow-inner">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 gap-2">
                <div className="w-8 h-8 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                <span className="text-xs">Fetching official trailer from TMDB...</span>
              </div>
            ) : selectedVideo ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.key}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-zinc-300 space-y-3">
                <Play className="w-10 h-10 text-zinc-500" />
                <p className="text-sm font-medium">No embedded video stream directly found in TMDB.</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    `${movie.title} official trailer`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Search & Watch on YouTube
                </a>
              </div>
            )}
          </div>

          {/* Details & Metadata Grid */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 pb-3 border-b border-zinc-100">
              <span className="flex items-center gap-1 font-semibold text-zinc-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'} / 10 ({movie.vote_count} votes)
              </span>

              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Released: {movie.release_date}
                </span>
              )}

              {details?.runtime ? (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  Runtime: {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </span>
              ) : null}

              {details?.genres && details.genres.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {details.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-medium"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Overview & Storyline
              </h4>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {movie.overview || 'No storyline details provided for this title.'}
              </p>
            </div>

            {/* Cast preview */}
            {details?.credits?.cast && details.credits.cast.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Top Cast
                </h4>
                <div className="flex flex-wrap gap-2">
                  {details.credits.cast.slice(0, 8).map((actor) => (
                    <span
                      key={actor.id}
                      className="text-xs px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded text-zinc-800"
                    >
                      <strong className="font-semibold">{actor.name}</strong> as {actor.character}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <span>Metadata powered by TMDB</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
