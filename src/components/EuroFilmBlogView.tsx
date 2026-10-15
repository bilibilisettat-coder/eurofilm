import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import {
  getBlogPostRating,
  recordBlogRating,
  getBlogComments,
  addBlogComment,
  BlogComment,
} from '../services/blogStore';
import {
  BookOpen,
  Star,
  MessageSquare,
  Send,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';
import { AdBanner } from './AdBanner';

interface EuroFilmBlogViewProps {
  onBackToHome?: () => void;
  currentLanguage?: Language;
}

export function EuroFilmBlogView({ onBackToHome, currentLanguage = 'en' }: EuroFilmBlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  // Comments & rating state for selected post
  const [commentName, setCommentName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [commentsList, setCommentsList] = useState<BlogComment[]>([]);
  const [userStars, setUserStars] = useState<number>(0);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [ratingStats, setRatingStats] = useState<{
    userRating: number;
    averageRating: number;
    totalRatings: number;
  }>({ userRating: 0, averageRating: 0, totalRatings: 0 });

  const allTags = ['All', 'the odyssey', 'project hail mary', 'sinners', 'superman', 'avatar fire and ash', 'movies in theaters'];

  const filteredPosts = activeTag === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.tags.some((tg) => tg.toLowerCase().includes(activeTag.toLowerCase())));

  const handleOpenArticle = (post: BlogPost) => {
    setSelectedPost(post);
    const stats = getBlogPostRating(post.id, post.verdictScore);
    setRatingStats(stats);
    setUserStars(stats.userRating);
    setCommentsList(getBlogComments(post.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRate = (stars: number) => {
    if (!selectedPost) return;
    setUserStars(stars);
    recordBlogRating(selectedPost.id, stars);
    const updated = getBlogPostRating(selectedPost.id, selectedPost.verdictScore);
    setRatingStats(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentText.trim()) return;

    const newComment = addBlogComment(selectedPost.id, commentName, commentText);
    setCommentsList((prev) => [newComment, ...prev]);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SINGLE ARTICLE DETAIL VIEW
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-black py-1.5 px-3 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToEssays || ui.backToMovies || 'Back to All Articles'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-black py-1.5 px-3 rounded-md border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? (t.copied || ui.copiedLink || 'Link Copied!') : (t.shareArticle || ui.shareTrailer || 'Share Article')}</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {selectedPost.tags?.slice(0, 2).map((tg, i) => (
              <span
                key={i}
                className="text-[11px] font-bold px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 uppercase tracking-wider font-mono"
              >
                {tg}
              </span>
            ))}
            <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {selectedPost.verdictScore.toFixed(1)} / 5 {ui.userRating || 'Rating'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
            {selectedPost.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 font-medium leading-relaxed">
            {selectedPost.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
            <span className="flex items-center gap-1.5 font-bold text-zinc-800">
              <User className="w-3.5 h-3.5 text-amber-600" />
              {selectedPost.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              {selectedPost.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {selectedPost.readTime?.split('(')[0]?.trim() || selectedPost.readTime}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden aspect-16/9 bg-zinc-100 border border-zinc-200 shadow-xs relative">
          <img
            src={selectedPost.coverImage}
            alt={selectedPost.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <article className="prose prose-zinc max-w-none text-zinc-850 space-y-5 text-sm sm:text-base leading-relaxed sm:leading-loose">
          {selectedPost.content.map((paragraph, idx) => (
            <React.Fragment key={idx}>
              <p
                className="font-normal text-zinc-800 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
              {idx === 2 && (
                <AdBanner
                  variant="inline"
                  title="Sponsored Cinema Partner: Stream 4K Movies Instantly"
                  subtitle="Support EuroFilm independent film criticism and access ultra-fast high bitrate streaming."
                />
              )}
              {idx === 6 && (
                <AdBanner
                  variant="leaderboard"
                  title="Official Streaming Sponsor: Watch Latest Premieres & Box Office Hits"
                  subtitle="Instant access to verified high-definition media partner servers."
                />
              )}
            </React.Fragment>
          ))}
        </article>

        <AdBanner
          variant="player-mirror"
          className="my-8"
          title="Sponsored Streaming Partner: Watch Full Releases Online"
          subtitle="Bufferless ultra HD streaming server with verified safe playback."
        />

        {/* SEO Keywords Cluster */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
            Keywords &amp; Related Tags:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedPost.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-zinc-200 text-zinc-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* USER RATING */}
        <section className="p-6 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                {t.rateReview || 'Rate This Article'}
              </h3>
              <p className="text-xs text-zinc-500">
                Share your reader rating for this critical analysis.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-zinc-950">
                {ratingStats.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-400">/ 5 ({ratingStats.totalRatings} votes)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700 mr-2">{ui.userRating || 'Your Rating'}:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverStars(star)}
                onMouseLeave={() => setHoverStars(0)}
                className="p-1 text-zinc-300 hover:scale-115 transition-transform cursor-pointer"
                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    (hoverStars || userStars) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-300'
                  }`}
                />
              </button>
            ))}
            {userStars > 0 && (
              <span className="text-xs font-bold text-emerald-600 ml-2">
                {userStars} ★
              </span>
            )}
          </div>
        </section>

        {/* COMMENTS SYSTEM */}
        <section className="p-6 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-zinc-950">
              {t.communityDiscussion || 'Community Discussion'} ({commentsList.length})
            </h3>
          </div>

          {/* New Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={t.yourName || 'Your Name'}
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 flex-1"
              />
            </div>
            <textarea
              rows={3}
              placeholder={t.yourComment || 'Share your feedback, thoughts, or comments...'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-semibold hover:bg-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.submitComment || 'Submit Comment'}</span>
              </button>
            </div>
          </form>

          {/* Render Comments */}
          <div className="space-y-4">
            {commentsList.map((c) => (
              <div key={c.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-900">{c.author}</span>
                  <span className="text-[11px] text-zinc-400">{c.date}</span>
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed">{c.text || (c as any).comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // BLOG DIRECTORY OVERVIEW LIST VIEW
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Blog Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              {t.eurofilmBlog || 'EuroFilm Critical Blog'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
            First-person, cynical, sarcastic, and unapologetic critical dissections of Hollywood blockbusters, upcoming festival premieres, and studio hype machines.
          </p>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-zinc-700 hover:text-black py-1.5 px-3 rounded-md border border-zinc-200 hover:bg-zinc-50 self-start sm:self-auto cursor-pointer"
          >
            ← {t.backToBrowse || ui.backToMovies || 'Back to Movies'}
          </button>
        )}
      </div>

      {/* Keyword Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTag === tag
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            {tag === 'All' ? ui.all : tag}
          </button>
        ))}
      </div>

      <AdBanner
        variant="leaderboard"
        title="Sponsored Streaming Partner: Watch Full HD Releases & Trailers Online"
        subtitle="Exclusive partner access for EuroFilm readers • Zero buffering"
      />

      {/* Grid of Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post, index) => (
          <React.Fragment key={post.id}>
            {index === 2 && (
              <AdBanner
                variant="in-feed"
                title="Watch Full HD Movies Online"
                subtitle="Exclusive Sponsor Streaming Access"
              />
            )}
            <article
              onClick={() => handleOpenArticle(post)}
              className="group bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-400 transition-all hover:shadow-md cursor-pointer"
            >
              <div className="aspect-16/10 bg-zinc-100 overflow-hidden relative">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-zinc-950/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {post.tags?.[0] || 'Film Essay'}
                </span>
                <span className="absolute bottom-2.5 right-2.5 bg-amber-400 text-zinc-950 text-xs font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-zinc-950" />
                  {post.verdictScore.toFixed(1)} / 5
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                    <span className="font-bold text-amber-700">{post.author}</span>
                    <span className="font-mono text-zinc-500 font-medium text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {post.readTime?.split('(')[0]?.trim() || '12 min read'}
                    </span>
                  </div>
                  <h2 className="font-bold text-sm sm:text-base text-zinc-950 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900 group-hover:underline flex items-center gap-1">
                    {t.readFullEssay || ui.readFullArticle || 'Read Article'} →
                  </span>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {t.communityDiscussion || 'Discuss'}
                  </span>
                </div>
              </div>
            </article>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
