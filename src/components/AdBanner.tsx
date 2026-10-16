import React from 'react';
import { ExternalLink, Play, Sparkles, Tv, ShieldCheck } from 'lucide-react';

export const AD_LINK = 'https://uplcm.com/4/11998118';

interface AdBannerProps {
  variant?: 'leaderboard' | 'player-mirror' | 'in-feed' | 'inline' | 'compact';
  className?: string;
  title?: string;
  subtitle?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  variant = 'leaderboard',
  className = '',
  title,
  subtitle,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Allows default navigation to open in new tab
  };

  if (variant === 'player-mirror') {
    return (
      <aside aria-label="Sponsored Stream Partner" className={`w-full ${className}`}>
        <a
          href={AD_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="group block relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 p-4 sm:p-5 shadow-lg transition-all hover:border-amber-400 hover:shadow-amber-500/10 cursor-pointer"
        >
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-amber-400 text-zinc-950">
            <span>AD</span>
            <span className="text-zinc-700">•</span>
            <span>SPONSORED</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-zinc-950 ml-0.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {title || 'High-Speed 4K Stream Mirror (Sponsored Partner)'}
                  </h4>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Ultra HD Fast Load
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  {subtitle || 'Instant bufferless streaming server with unlimited cinema releases and 1080p/4K bitrate.'}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
              <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs sm:text-sm shadow-md transition-all group-hover:translate-x-0.5">
                <span>Play Full Stream</span>
                <ExternalLink className="w-4 h-4" />
              </span>
            </div>
          </div>
        </a>
      </aside>
    );
  }

  if (variant === 'in-feed') {
    return (
      <aside aria-label="Sponsored Cinema Offer" className={`group relative bg-zinc-900 border border-amber-500/30 rounded-xl overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all hover:shadow-lg cursor-pointer ${className}`}>
        <a
          href={AD_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="aspect-16/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            <span className="absolute top-2.5 left-2.5 bg-amber-400 text-zinc-950 text-[10px] font-mono font-black px-2 py-0.5 rounded shadow-xs">
              SPONSORED AD
            </span>
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Tv className="w-7 h-7" />
            </div>
            <span className="text-white font-bold text-sm sm:text-base leading-tight">
              {title || 'Unlimited Movie & TV Access'}
            </span>
            <span className="text-xs text-amber-300/80 mt-1">
              {subtitle || 'Zero Buffering • 4K Quality'}
            </span>
          </div>

          <div className="p-4 space-y-3 bg-zinc-950">
            <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
              Explore unlimited entertainment, direct downloads, and cinema perks through our verified sponsor partner.
            </p>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 group-hover:underline flex items-center gap-1">
                Explore Sponsor Offer →
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
        </a>
      </aside>
    );
  }

  if (variant === 'inline') {
    return (
      <aside aria-label="Sponsored Partner Article Ad" className={`my-8 p-4 sm:p-5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white shadow-md ${className}`}>
        <a
          href={AD_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider">
                AD SPONSOR
              </span>
              <h5 className="text-sm sm:text-base font-bold text-white hover:text-amber-300 transition-colors">
                {title || 'Exclusive Cinema Streaming & High-Speed Media Access'}
              </h5>
            </div>
            <p className="text-xs text-zinc-300">
              {subtitle || 'Support EuroFilm editorial by checking out our verified streaming and digital partner offer.'}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-xs transition-colors">
            <span>Learn More</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      </aside>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`p-2.5 rounded-lg border border-zinc-200 bg-amber-50/70 text-zinc-900 ${className}`}>
        <a
          href={AD_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:text-amber-800"
        >
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 text-[9px] font-bold uppercase font-mono">
              AD
            </span>
            <span className="font-semibold truncate">
              {title || 'Sponsored: Ultra HD Cinema & Streaming Server'}
            </span>
          </div>
          <span className="shrink-0 font-bold text-amber-700 flex items-center gap-1 text-[11px]">
            Watch <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      </div>
    );
  }

  // Default: Leaderboard
  return (
    <aside aria-label="Sponsored Ad Banner" className={`w-full ${className}`}>
      <a
        href={AD_LINK}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="group relative block overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/60 p-3.5 sm:p-4 text-white shadow-md transition-all hover:border-amber-400 hover:shadow-lg cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="shrink-0 px-2 py-0.5 rounded bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider">
              AD
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {title || 'Exclusive Streaming Offer: Fast 4K Cinema & Unlimited Releases'}
              </span>
              <span className="hidden md:inline text-xs text-zinc-300">
                {subtitle || 'Click to access our verified media partner'}
              </span>
            </div>
          </div>

          <span className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black shadow-xs transition-colors">
            <span>Explore Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>
    </aside>
  );
};
