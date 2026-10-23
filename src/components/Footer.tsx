import type React from 'react';
import { Mail, Shield, Info } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { CONTACT_EMAIL, SECTION_ROUTES, blogPath, urlForTab } from '../data/routes';
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

  // Real <a href> links so crawlers can discover every section; plain clicks stay in the SPA.
  const go = (e: React.MouseEvent<HTMLAnchorElement>, tab: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onSelectTab(tab);
  };

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
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:underline"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              {t.movies || 'Movies'}
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href={urlForTab('popular')}
                  onClick={(e) => go(e, 'popular')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.popular || 'Popular Movies'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('now_playing')}
                  onClick={(e) => go(e, 'now_playing')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.nowPlaying || 'Now Playing in Theaters'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('top_rated')}
                  onClick={(e) => go(e, 'top_rated')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topRated || 'Top Rated All Time'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('top10_week')}
                  onClick={(e) => go(e, 'top10_week')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.top10ThisWeek || 'Top 10 This Week'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('fan_favorites')}
                  onClick={(e) => go(e, 'fan_favorites')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.fanFavorites || 'Fan Favorites'}
                </a>
              </li>
            </ul>
          </div>

          {/* Editorial & Features */}
          <div>
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              {ui.awards || 'Cinephile Features'}
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href={urlForTab('born_today')}
                  onClick={(e) => go(e, 'born_today')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.bornToday || 'Born Today'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('top_box_office')}
                  onClick={(e) => go(e, 'top_box_office')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topBoxOffice || 'Top Box Office'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('top_news')}
                  onClick={(e) => go(e, 'top_news')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topNews || 'Top Entertainment News'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('top_rated_visitors')}
                  onClick={(e) => go(e, 'top_rated_visitors')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topRatedVisitors || 'Top Rated by Visitors'}
                </a>
              </li>
              <li>
                <a
                  href={urlForTab('top_liked_visitors')}
                  onClick={(e) => go(e, 'top_liked_visitors')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  {t.topLikedVisitors || 'Top Liked by Visitors'}
                </a>
              </li>
            </ul>
          </div>

          {/* Information & Legal */}
          <div>
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              {t.aboutUs || 'Company & Legal'}
            </p>
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
            </ul>
          </div>
        </div>

        {/* Crawlable site map: every indexable section and every article */}
        <nav aria-label="Site sections" className="mb-8 border-t border-zinc-100 pt-6 space-y-4">
          <div>
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-2">Explore</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {SECTION_ROUTES.map((s) => (
                <li key={s.path}>
                  <a href={s.path} onClick={(e) => go(e, s.tab)} className="hover:text-zinc-950 transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-2">Latest reviews</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {BLOG_POSTS.map((post) => (
                <li key={post.slug}>
                  <a href={blogPath(post.slug)} className="hover:text-zinc-950 transition-colors line-clamp-1">
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <p className="text-[11px] text-zinc-400 mb-4">
          Movie and TV data and images from{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline">TMDB</a>. This product uses
          the TMDB API but is not endorsed or certified by TMDB. Anime data from{' '}
          <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer" className="underline">Jikan</a> (MyAnimeList). News
          headlines link to their original publishers.
        </p>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} EuroFilm. All rights reserved. Inquiries to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-zinc-600 underline">
              {CONTACT_EMAIL}
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
          </div>
        </div>
      </div>
    </footer>
  );
}
