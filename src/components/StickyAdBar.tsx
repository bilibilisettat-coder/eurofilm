import React, { useState } from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { AD_LINK } from './AdBanner';

export const StickyAdBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Sponsored Announcement"
      className="fixed bottom-0 inset-x-0 z-40 bg-zinc-950/95 border-t border-amber-500/50 backdrop-blur-md shadow-2xl px-3 py-2.5 sm:px-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <a
          href={AD_LINK}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 flex items-center gap-3 overflow-hidden group cursor-pointer"
        >
          <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider">
            <span>AD</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">SPONSORED</span>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 hidden sm:block" />
            <p className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
              Sponsored · Advertisement
            </p>
          </div>

          <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black shadow-xs transition-colors">
            <span>Open Ad</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          className="shrink-0 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Dismiss ad"
          title="Dismiss ad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
