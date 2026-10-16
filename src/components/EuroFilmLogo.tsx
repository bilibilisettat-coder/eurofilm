import React, { useState } from 'react';

interface EuroFilmLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export function EuroFilmLogo({
  className = '',
  size = 'md',
  showSubtext = true,
}: EuroFilmLogoProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const candidates = ['/logo.png', '/logo.svg', '/logo.webp'];
  const hasFallback = candidateIndex >= candidates.length;
  const iconDimensions = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-10';

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* 1. Automatically load original logo from public/ folder (logo.png, logo.svg, logo.webp) */}
      {!hasFallback ? (
        <img
          src={candidates[candidateIndex]}
          alt="EuroFilm Logo"
          onError={() => setCandidateIndex((prev) => prev + 1)}
          className={`${iconDimensions} w-auto object-contain drop-shadow-xs`}
        />
      ) : (
        /* 2. Fallback SVG Vector Mark */
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconDimensions} w-auto object-contain drop-shadow-xs`}
          aria-label="EuroFilm Logo"
        >
        <defs>
          {/* Filmstrip Gradient */}
          <linearGradient id="filmstripGrad" x1="20" y1="90" x2="180" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0070f3" />
            <stop offset="50%" stopColor="#00c6ff" />
            <stop offset="100%" stopColor="#0072ff" />
          </linearGradient>

          {/* E Dark Upper Arm Gradient */}
          <linearGradient id="darkEGrad" x1="60" y1="20" x2="140" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>

          {/* E Lower Curve Gradient */}
          <linearGradient id="blueBaseGrad" x1="60" y1="90" x2="140" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Filmstrip Shadow */}
          <filter id="ribbonShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* --- Stylized "E" Glyph --- */}
        {/* Top Arc & Spine of E */}
        <path
          d="M 135 24 C 95 22, 68 40, 68 76 L 68 96 C 75 88, 92 84, 114 84 C 132 84, 142 88, 142 88 L 132 52 C 132 44, 126 40, 115 40 L 98 40 C 98 32, 108 32, 125 32 L 135 24 Z"
          fill="url(#darkEGrad)"
        />

        {/* Lower Sweeping Arm of E */}
        <path
          d="M 68 96 C 68 122, 90 136, 128 136 C 146 136, 158 130, 162 126 L 152 108 C 146 112, 136 116, 124 116 C 104 116, 92 108, 90 96 Z"
          fill="url(#blueBaseGrad)"
        />

        {/* --- Curved Cyan/Blue Filmstrip Ribbon Wrapping the E --- */}
        <g filter="url(#ribbonShadow)">
          <path
            d="M 45 106 C 58 64, 112 50, 168 56 L 165 74 C 118 68, 72 82, 60 118 Z"
            fill="url(#filmstripGrad)"
          />

          {/* Filmstrip Sprockets / Perforations */}
          <rect x="72" y="80" width="7" height="9" rx="1.5" transform="rotate(-18 72 80)" fill="#ffffff" opacity="0.95" />
          <rect x="90" y="74" width="7" height="9" rx="1.5" transform="rotate(-15 90 74)" fill="#ffffff" opacity="0.95" />
          <rect x="108" y="69" width="7" height="9" rx="1.5" transform="rotate(-11 108 69)" fill="#ffffff" opacity="0.95" />
          <rect x="126" y="65" width="7" height="9" rx="1.5" transform="rotate(-7 126 65)" fill="#ffffff" opacity="0.95" />
          <rect x="144" y="63" width="7" height="9" rx="1.5" transform="rotate(-3 144 63)" fill="#ffffff" opacity="0.95" />
        </g>

        {/* Front Curl of Ribbon with Dynamic Highlight */}
        <path
          d="M 45 106 C 42 116, 48 130, 68 134 C 84 137, 98 128, 102 118 C 86 122, 62 120, 52 108 Z"
          fill="#0284c7"
        />
        <path
          d="M 46 108 C 54 116, 76 120, 96 116 C 90 122, 78 126, 68 125 C 55 124, 48 116, 46 108 Z"
          fill="#38bdf8"
          opacity="0.8"
        />
      </svg>
      )}

      {/* Subtext directly under the logo */}
      {showSubtext && (
        <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-zinc-600 -mt-1 font-sans">
          trailers &amp; cinema
        </span>
      )}
    </div>
  );
}
