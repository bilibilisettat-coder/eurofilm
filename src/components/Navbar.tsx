import { useState } from 'react';
import { Search, Menu, Mail, Info, Shield, Globe, SlidersHorizontal, Check, X, Home } from 'lucide-react';
import { EuroFilmLogo } from './EuroFilmLogo';
import { Language, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';

export type MediaTypeFilterType = 'all' | 'movies' | 'tv' | 'anime';
export type AgeRatingFilterType = 'all' | 'under18' | 'over18';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string, label?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onOpenHamburger: () => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  mediaTypeFilter: MediaTypeFilterType;
  onSelectMediaTypeFilter: (type: MediaTypeFilterType) => void;
  ageRatingFilter: AgeRatingFilterType;
  onSelectAgeRatingFilter: (rating: AgeRatingFilterType) => void;
}

export function Navbar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenHamburger,
  onOpenAbout,
  onOpenPrivacy,
  onOpenContact,
  currentLanguage,
  onSelectLanguage,
  mediaTypeFilter,
  onSelectMediaTypeFilter,
  ageRatingFilter,
  onSelectAgeRatingFilter,
}: NavbarProps) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  const isFilterActive = mediaTypeFilter !== 'all' || ageRatingFilter !== 'all';

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1.5 sm:gap-4">
          {/* Hamburger Menu Button & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={onOpenHamburger}
              className="p-1.5 sm:p-2 -ml-1 sm:-ml-2 rounded-md text-zinc-800 hover:text-black hover:bg-zinc-100 flex items-center gap-1.5 cursor-pointer"
              aria-label="Open navigation categories menu"
              title={t.menu || 'Menu'}
            >
              <Menu className="w-5 h-5 text-zinc-900" />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider text-zinc-800">
                {t.menu || 'Menu'}
              </span>
            </button>

            {/* Logo */}
            <div
              onClick={() => onSelectTab('popular', t.home || 'Home')}
              className="flex items-center cursor-pointer select-none py-1"
            >
              <EuroFilmLogo size="md" showSubtext={true} />
            </div>

            {/* Home button on head bar */}
            <button
              onClick={() => onSelectTab('popular', t.home || 'Home')}
              className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeTab === 'popular' && !searchQuery
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300 hover:border-zinc-400'
              }`}
              aria-label={t.home || 'Home'}
              title={t.home || 'Home'}
            >
              <Home className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline font-bold tracking-tight">{t.home || 'Home'}</span>
            </button>
          </div>

          {/* Search Bar & Filter Button (Cleaned Head Bar) */}
          <div className="flex-1 min-w-[70px] sm:max-w-md flex items-center gap-1 sm:gap-1.5 relative">
            <form onSubmit={onSearchSubmit} className="flex-1 relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder || 'Search...'}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-6.5 sm:pl-9 pr-2 sm:pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors"
              />
            </form>

            {/* Header Filter Button next to search bar */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer ${
                  isFilterActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}
                title={t.filterMediaAndAge || ui.filter}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {mediaTypeFilter !== 'all' || ageRatingFilter !== 'all' ? ui.filtered : ui.filter}
                </span>
                {isFilterActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>

              {/* Filter Popover Dropdown */}
              {filterMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-16px)] bg-white border border-zinc-200 rounded-xl shadow-2xl p-3.5 z-50 text-xs space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <span className="font-extrabold text-zinc-950 uppercase tracking-wider text-[11px]">
                      {t.filterMediaAndAge || 'Filter Media & Age'}
                    </span>
                    {isFilterActive && (
                      <button
                        onClick={() => {
                          onSelectMediaTypeFilter('all');
                          onSelectAgeRatingFilter('all');
                        }}
                        className="text-[10px] text-amber-700 font-bold hover:underline cursor-pointer"
                      >
                        {t.resetFilters || ui.resetAll}
                      </button>
                    )}
                  </div>

                  {/* Filter 1: Media Types (Movies, TV shows, Anime, Series) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                      {t.mediaType || 'Media Type'}:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'all', label: t.allMedia || 'All Media' },
                        { id: 'movies', label: t.movies || 'Movies' },
                        { id: 'tv', label: t.tvShows || 'TV Shows' },
                        { id: 'anime', label: t.anime || 'Anime' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelectMediaTypeFilter(item.id as MediaTypeFilterType);
                          }}
                          className={`px-2 py-1.5 text-left rounded-md font-medium text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                            mediaTypeFilter === item.id
                              ? 'bg-zinc-900 text-white font-bold'
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {mediaTypeFilter === item.id && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter 2: Age Rating (-18, +18) */}
                  <div className="space-y-1.5 pt-1 border-t border-zinc-100">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                      {t.ageRating || 'Age Rating'}:
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'all', label: t.allAges || 'All Ratings' },
                        { id: 'under18', label: t.under18 || '-18' },
                        { id: 'over18', label: t.over18 || '+18' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelectAgeRatingFilter(item.id as AgeRatingFilterType);
                          }}
                          className={`px-1.5 py-1.5 text-center rounded-md font-semibold text-[10px] transition-colors cursor-pointer truncate ${
                            ageRatingFilter === item.id
                              ? 'bg-zinc-900 text-white font-bold'
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFilterMenuOpen(false)}
                    className="w-full py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[11px] font-bold rounded-md transition-colors cursor-pointer text-center"
                  >
                    {ui.doneFiltering}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer shrink-0"
              title={ui.changeLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span className="uppercase font-mono text-[11px] sm:text-xs">{currentLanguage}</span>
              <span className="text-[10px] text-zinc-400">▼</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-zinc-200 rounded-lg shadow-xl py-1 z-50 text-xs">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-zinc-100 transition-colors cursor-pointer ${
                      currentLanguage === lang.code ? 'font-bold bg-zinc-50 text-zinc-950' : 'text-zinc-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions (Contact, About, Privacy) */}
          <div className="hidden md:flex items-center space-x-1 text-xs text-zinc-600 border-l border-zinc-200 pl-3">
            <button
              onClick={onOpenContact}
              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
              title={t.contactUs || 'Contact Us'}
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAbout}
              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
              title={t.aboutUs || 'About EuroFilm'}
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenPrivacy}
              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
              title={t.privacyPolicy || 'Privacy Policy'}
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
