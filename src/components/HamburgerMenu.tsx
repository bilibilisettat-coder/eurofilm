import React from 'react';
import {
  X,
  Film,
  Tv,
  PlaySquare,
  Award,
  Users,
  MessageSquare,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { EuroFilmLogo } from './EuroFilmLogo';
import { Language, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { getHamburgerItemLabel, getUiStrings } from '../i18n/localize';

export interface CategoryPageItem {
  id: string;
  label: string;
  category: 'movies' | 'tv' | 'watch' | 'awards' | 'celebs' | 'community';
  icon?: React.ReactNode;
  badge?: string;
}

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string, label: string) => void;
  activeCategoryId: string;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export function HamburgerMenu({
  isOpen,
  onClose,
  onSelectCategory,
  activeCategoryId,
  currentLanguage,
  onSelectLanguage,
}: HamburgerMenuProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  if (!isOpen) return null;

  const rawSections: {
    title: string;
    icon: React.ReactNode;
    items: { id: string; defaultLabel: string; badge?: string }[];
  }[] = [
    {
      title: t.movies || 'Movies',
      icon: <Film className="w-5 h-5 text-amber-500" />,
      items: [
        { id: 'release-calendar', defaultLabel: 'Release calendar', badge: '2026' },
        { id: 'top-250-movies', defaultLabel: 'Top 250 movies' },
        { id: 'most-popular-movies', defaultLabel: 'Most popular movies', badge: 'Hot' },
        { id: 'browse-movies-genre', defaultLabel: 'Browse movies by genre' },
        { id: 'top-box-office', defaultLabel: 'Top box office' },
        { id: 'showtimes-tickets', defaultLabel: 'Showtimes & tickets' },
        { id: 'movie-news', defaultLabel: 'Top Entertainment News' },
        { id: 'india-movie-spotlight', defaultLabel: 'Bollywood Movie Spotlight', badge: 'Trending' },
      ],
    },
    {
      title: t.tvShows || 'TV shows',
      icon: <Tv className="w-5 h-5 text-sky-500" />,
      items: [
        { id: 'whats-on-tv-streaming', defaultLabel: "What's on TV & streaming" },
        { id: 'top-250-tv-shows', defaultLabel: 'Top 250 TV shows' },
        { id: 'most-popular-tv-shows', defaultLabel: 'Most popular TV shows' },
        { id: 'browse-tv-genre', defaultLabel: 'Browse TV shows by genre' },
        { id: 'tv-news', defaultLabel: 'TV news' },
      ],
    },
    {
      title: t.watch || 'Watch',
      icon: <PlaySquare className="w-5 h-5 text-emerald-500" />,
      items: [
        { id: 'eurofilm-picks', defaultLabel: 'EuroFilm Picks', badge: 'Top Liked' },
        { id: 'eurofilm-labs', defaultLabel: 'EuroFilm Labs (Most Disliked)', badge: 'Most Disliked' },
      ],
    },
    {
      title: t.awards || 'Awards & events',
      icon: <Award className="w-5 h-5 text-purple-500" />,
      items: [
        { id: 'oscars', defaultLabel: 'Oscars (Academy Award Winners)', badge: 'Official' },
        { id: 'starmeter-awards', defaultLabel: 'STARmeter Awards' },
      ],
    },
    {
      title: t.celebs || 'Celebs',
      icon: <Users className="w-5 h-5 text-rose-500" />,
      items: [
        { id: 'born-today', defaultLabel: 'Born today', badge: 'Live' },
        { id: 'trending-people', defaultLabel: 'Trending people' },
        { id: 'celebrity-news', defaultLabel: 'Celebrity news' },
      ],
    },
    {
      title: t.community || 'Community',
      icon: <MessageSquare className="w-5 h-5 text-indigo-500" />,
      items: [
        { id: 'eurofilm-blog', defaultLabel: 'EuroFilm Blog', badge: 'Essays' },
        { id: 'community-polls', defaultLabel: 'Community Polls & Film Debates', badge: 'Debates' },
        { id: 'contributor-zone', defaultLabel: 'Contributor Zone', badge: 'Donate' },
        { id: 'help-center', defaultLabel: 'Help Center (Movie AI Chat)', badge: 'AI Chat' },
      ],
    },
  ];

  const sections = rawSections.map((sec) => ({
    ...sec,
    items: sec.items.map((it) => ({
      ...it,
      label: getHamburgerItemLabel(it.id, currentLanguage, it.defaultLabel),
    })),
  }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex bg-zinc-950/70 backdrop-blur-xs transition-opacity"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden border-r border-zinc-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-2.5">
            <EuroFilmLogo size="sm" showSubtext={false} />
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                {t.menu || 'Menu'}
              </span>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">
                {t.siteName} • {ui.aboutEuroFilm}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label={t.close || 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Quick Selector in Drawer */}
        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-semibold">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span>{ui.changeLanguage}:</span>
          </div>
          <select
            value={currentLanguage}
            onChange={(e) => onSelectLanguage(e.target.value as Language)}
            className="text-xs bg-white border border-zinc-300 rounded px-2 py-1 font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-7 divide-y divide-zinc-100">
          {sections.map((sec, sIdx) => (
            <div key={sIdx} className={sIdx > 0 ? 'pt-6' : ''}>
              <div className="flex items-center gap-2.5 mb-3 text-zinc-950">
                {sec.icon}
                <h3 className="font-bold text-sm tracking-tight uppercase tracking-wider text-xs text-zinc-800">
                  {sec.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-1">
                {sec.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectCategory(item.id, item.label);
                      onClose();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      activeCategoryId === item.id
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-zinc-900"></span>
                      {item.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>EuroFilm • {t.tagline || 'Cinema Discovery'}</span>
          <span className="text-zinc-400">2026</span>
        </div>
      </div>

      {/* Backdrop Click */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />
    </div>
  );
}
