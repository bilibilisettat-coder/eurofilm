import React, { useState, useEffect, useMemo } from 'react';
import type { NewsArticleItem } from '../data/newsCatalog';
import { loadNews, timeAgo } from '../services/newsFeed';
import { fetchLiveMovieNews } from '../services/externalApis';
import {
  Newspaper,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';

interface EntertainmentNewsViewProps {
  initialCategory?: 'All' | 'Film News' | 'Celebrity News' | 'Box Office' | 'Streaming';
  onBackToHome?: () => void;
  currentLanguage?: Language;
}

export function EntertainmentNewsView({
  initialCategory = 'All',
  onBackToHome,
  currentLanguage = 'en',
}: EntertainmentNewsViewProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  const [allNews, setAllNews] = useState<NewsArticleItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');
  const [, setLoadingLive] = useState<boolean>(false);

  // Real headlines: build-time feed (/news.json), falling back to the live Deadline feed.
  useEffect(() => {
    let isMounted = true;
    setLoadingLive(true);
    loadNews()
      .then(async (feed) => {
        if (feed.length) {
          return feed.map<NewsArticleItem>((item, index) => ({
            id: `news-${index}`,
            title: item.title,
            summary: '',
            source: item.source,
            timeAgo: timeAgo(item.date),
            imageUrl: '',
            category: item.category === 'Reviews' ? 'Film News' : item.category,
            link: item.link,
          }));
        }
        const live = await fetchLiveMovieNews();
        return live.map<NewsArticleItem>((item, index) => ({
          id: `live-${index}`,
          title: item.title,
          summary: '',
          source: item.source || 'Deadline',
          timeAgo: item.pubDate || '',
          imageUrl: '',
          category: 'Film News',
          link: item.link,
        }));
      })
      .then((items) => isMounted && setAllNews(items))
      .catch((err) => console.warn('Could not load news:', err))
      .finally(() => {
        if (isMounted) setLoadingLive(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const categoryList: { id: string; label: string }[] = [
    { id: 'All', label: ui.all },
    { id: 'Film News', label: ui.filmNews },
    { id: 'Celebrity News', label: ui.celebrityNews },
    { id: 'Box Office', label: ui.boxOffice },
    { id: 'Streaming', label: ui.streaming },
    { id: 'Casting', label: ui.casting },
    { id: 'Awards', label: ui.awards },
  ];

  // Filtered news
  const filteredArticles = useMemo(() => {
    return allNews.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [allNews, selectedCategory, searchQuery]);

  // PAGINATION: EXACTLY 10 PER PAGE
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));

  // Current page items
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArticles.slice(start, start + pageSize);
  }, [filteredArticles, currentPage, pageSize]);

  const handlePageChange = (p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    setCurrentPage(target);
    setJumpPageInput(String(target));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p)) {
      handlePageChange(p);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              {ui.topNewsTitle}
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-amber-400">
              +{allNews.length} {ui.articles}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
            {ui.topNewsSubtitle}
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

      {/* Controls Bar: Category Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
                setJumpPageInput('1');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-950 text-white'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder || 'Search...'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
              setJumpPageInput('1');
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      {/* Results Count & Current Page Info */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          Showing <strong className="text-zinc-900">{paginatedArticles.length}</strong> of{' '}
          <strong className="text-zinc-900">{filteredArticles.length}</strong> (10 / page)
        </span>
        <span>
          {t.page || 'Page'} <strong className="text-zinc-900">{currentPage}</strong> /{' '}
          <strong className="text-zinc-900">{totalPages}</strong>
        </span>
      </div>

      {/* LIST OF 10 ARTICLES ON CURRENT PAGE */}
      <div className="space-y-4">
        {paginatedArticles.map((article, idx) => (
          <article
            key={article.id}
            className="p-4 sm:p-5 bg-white border border-zinc-200 rounded-xl shadow-2xs hover:border-zinc-400 transition-colors flex flex-col sm:flex-row gap-4 sm:gap-5"
          >
            {article.imageUrl && (
              <div className="w-full sm:w-44 md:w-52 h-40 sm:h-32 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                <img src={article.imageUrl} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium mb-1.5">
                  <span className="font-bold text-amber-700">{article.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {article.timeAgo}
                  </span>
                  <span className="text-[10px] text-zinc-400 ml-auto font-mono">
                    #{(currentPage - 1) * pageSize + idx + 1}
                  </span>
                </div>

                <h2 className="font-bold text-sm sm:text-base text-zinc-950 leading-snug">
                  {article.link ? (
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {article.title}
                    </a>
                  ) : (
                    article.title
                  )}
                </h2>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono">
                  {article.category}
                </span>
                {article.summary && (
                  <p className="text-xs text-zinc-600 line-clamp-2 mt-1.5 leading-relaxed">{article.summary}</p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <span className="text-[11px] font-medium text-zinc-400">
                  {article.timeAgo}
                </span>

                {article.link ? (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    <span>{ui.readFullArticle}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-zinc-800">
                    {ui.readFullArticle}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* EXACT 10/PAGE NUMBERED PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-zinc-300 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{ui.prevPage}</span>
            </button>

            {/* Quick Page Jump Buttons */}
            <div className="flex items-center gap-1">
              {[currentPage - 1, currentPage, currentPage + 1]
                .filter((p) => p >= 1 && p <= totalPages)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      currentPage === p
                        ? 'bg-zinc-950 text-white'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              {currentPage + 2 < totalPages && (
                <span className="text-zinc-400 text-xs px-1">...</span>
              )}
              {currentPage + 1 < totalPages && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-2 h-8 text-xs font-semibold rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-zinc-300 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>{ui.nextPage}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jump to Page Form */}
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-2 text-xs">
            <span className="text-zinc-600">{ui.jumpToPage}</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-16 px-2 py-1 text-xs text-center border border-zinc-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
            <span className="text-zinc-400">/ {totalPages}</span>
            <button
              type="submit"
              className="px-2.5 py-1 bg-zinc-900 text-white rounded-md font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {ui.go}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
