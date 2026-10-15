import { Mail, Shield, Info, FileText } from 'lucide-react';
import { EuroFilmLogo } from './EuroFilmLogo';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
  currentLanguage?: Language;
}

export function Footer({
  onSelectTab,
  onOpenAbout,
  onOpenPrivacy,
  onOpenContact,
  currentLanguage = 'en',
}: FooterProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <EuroFilmLogo size="sm" showSubtext={false} />
              <span className="font-extrabold text-base text-zinc-950 tracking-tight">
                EuroFilm
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {ui.generalSubtext || 'Global cinema portal delivering official high-definition movie trailers, comprehensive cast dossiers, and in-depth critical analyses.'}
            </p>
            <div className="pt-1">
              <a
                href="mailto:yourmovies@movies.com"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:underline"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                yourmovies@movies.com
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              {t.movies || 'Movies'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('popular')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.popular || 'Popular Movies'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('now_playing')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.nowPlaying || 'Now Playing in Theaters'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('top_rated')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topRated || 'Top Rated All Time'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('top10_week')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.top10ThisWeek || 'Top 10 This Week'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('fan_favorites')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.fanFavorites || 'Fan Favorites'}
                </button>
              </li>
            </ul>
          </div>

          {/* Editorial & Features */}
          <div>
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              {ui.awards || 'Cinephile Features'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('born_today')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.bornToday || 'Born Today'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('top_box_office')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topBoxOffice || 'Top Box Office'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('top_news')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topNews || 'Top Entertainment News'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('top_rated_visitors')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topRatedVisitors || 'Top Rated by Visitors'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('top_liked_visitors')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topLikedVisitors || 'Top Liked by Visitors'}
                </button>
              </li>
            </ul>
          </div>

          {/* Information & Legal */}
          <div>
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              {t.aboutUs || 'Company & Legal'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Info className="w-3 h-3 text-zinc-400" />
                  {t.aboutUs || 'About EuroFilm'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3 h-3 text-zinc-400" />
                  {t.contactUs || 'Contact Support'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3 h-3 text-zinc-400" />
                  {t.privacyPolicy || 'Privacy Policy'}
                </button>
              </li>
              <li>
                <a
                  href="/llm.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-zinc-400" />
                  llm.txt Manifest
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-zinc-500"
                >
                  robots.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} EuroFilm. All rights reserved. Inquiries to{' '}
            <a href="mailto:yourmovies@movies.com" className="text-zinc-600 underline">
              yourmovies@movies.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacy} className="hover:text-zinc-600 cursor-pointer">
              {t.privacyPolicy || 'Privacy'}
            </button>
            <span>•</span>
            <button onClick={onOpenContact} className="hover:text-zinc-600 cursor-pointer">
              {t.contactUs || 'Contact'}
            </button>
            <span>•</span>
            <a href="/robots.txt" className="hover:text-zinc-600">
              Robots
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
