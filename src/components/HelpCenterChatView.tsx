import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Film,
  HelpCircle,
  RefreshCw,
  ShieldAlert,
  ArrowLeft,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface HelpCenterChatViewProps {
  onBackToHome?: () => void;
  onNavigateToTab?: (tab: string, label: string) => void;
  currentLanguage?: Language;
}

// Strictly movie & EuroFilm related keywords to detect domain
const MOVIE_AND_WEBSITE_KEYWORDS = [
  'movie', 'movies', 'film', 'films', 'cinema', 'trailer', 'trailers', 'actor', 'actors',
  'actress', 'director', 'directors', 'oscar', 'oscars', 'academy award', 'box office',
  'tmdb', 'imdb', 'eurofilm', 'stream', 'streaming', 'watch', 'genre', 'genres',
  'hollywood', 'bollywood', 'anime', 'animation', 'character', 'plot', 'sequel',
  'prequel', 'cast', 'rating', 'ratings', 'review', 'reviews', 'screenplay',
  'nolan', 'spielberg', 'tarantino', 'scorsese', 'marvel', 'dc', 'disney', 'pixar',
  'ghibli', 'warner', 'universal', 'paramount', 'cannes', 'festival', 'series',
  'tv show', 'filter', 'under 18', '-18', '+18', 'age rating', 'search', 'polls',
  'debate', 'debates', 'essay', 'blog', 'picks', 'labs', 'disliked', 'donate',
  'coffee', 'paypal', 'crypto', 'recommend', 'recommendation', 'recommendations',
  'horror', 'comedy', 'sci-fi', 'thriller', 'drama', 'action', 'romance', 'documentary',
  'soundtrack', 'score', 'composer', 'avatar', 'oppenheimer', 'interstellar', 'batman',
  'spiderman', 'godfather', 'titanic', 'star wars', 'superman', 'dune', 'matrix',
  'inception', 'fight club', 'pulp fiction', 'shawshank', 'jurassic', 'gladiator'
];

function isMovieOrWebsiteQuery(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  if (normalized.length < 2) return true;
  return MOVIE_AND_WEBSITE_KEYWORDS.some((kw) => normalized.includes(kw));
}

function generateLocalBotResponse(query: string, lang: Language): string {
  const q = query.toLowerCase();

  // Guardrail check
  if (!isMovieOrWebsiteQuery(q)) {
    return `⛔ **Notice from EuroFilm CineBot:**\n\nI am exclusively programmed and restricted to answer questions about **movies, cinema, actors, directors, trailers, and the EuroFilm website**.\n\nI cannot answer queries regarding homework, coding, math, general politics, medical, financial, or other non-cinema topics.\n\n💡 *Feel free to ask me about movie recommendations, director retrospectives, box office milestones, or how to navigate EuroFilm!*`;
  }

  // Domain knowledge answers
  if (q.includes('filter') || q.includes('-18') || q.includes('+18') || q.includes('age')) {
    return `🎯 **How to use EuroFilm Age & Media Filters:**\n\n• Look at the **Filters** button right next to the search bar in the head bar.\n• **Media Type:** Filter between All Media, Movies, TV Shows, Anime, and Series.\n• **Age Rating:**\n  - **Under 18 (-18):** Filters for family-safe, G/PG animated classics, Disney/Pixar, Studio Ghibli, and all-ages anime.\n  - **Over 18 (+18):** Filters for mature cinema, psychological thrillers, horror, and complex crime noir.`;
  }

  if (q.includes('trailer') || q.includes('watch') || q.includes('player') || q.includes('youtube')) {
    return `🎬 **Trailer Playback on EuroFilm:**\n\n• EuroFilm plays all official cinema trailers in **high definition inside a dedicated full cinema page**.\n• It **never redirects to YouTube** and never traps you in annoying pop-up modals.\n• When watching a trailer, you can cast 1-5 star ratings, submit emoji reactions (Like, Dislike, Love, Laugh, Surprise), and read an in-depth first-person critical essay!`;
  }

  if (q.includes('disliked') || q.includes('labs')) {
    return `🧪 **EuroFilm Labs (Most Disliked Films):**\n\n• Located in the **Menu → Watch → EuroFilm Labs**.\n• This section dynamically curates the most disliked and controversial cinema experiments based on real visitor reactions.\n• You can filter films by dislike thresholds (All Disliked, 50+ Dislikes, 100+ Dislikes).`;
  }

  if (q.includes('debate') || q.includes('poll')) {
    return `🗳️ **Community Polls & Film Debates:**\n\n• Head to **Menu → Community → Community Polls & Film Debates**.\n• Cast your live votes on trending cinematic debates, view real-time percentage graphs, and submit your written arguments to the cinephile discourse!`;
  }

  if (q.includes('donate') || q.includes('coffee') || q.includes('paypal') || q.includes('crypto')) {
    return `☕ **Contributor Zone & Donations:**\n\n• You can support EuroFilm's independent cinema platform in **Menu → Community → Contributor Zone**.\n• We support **Buy Me a Coffee**, **PayPal**, and **Cryptocurrency** (Bitcoin, Ethereum, USDT, Solana) with instant wallet address copy.`;
  }

  if (q.includes('recommend') || q.includes('suggestion') || q.includes('what should i watch')) {
    if (q.includes('sci-fi') || q.includes('science fiction')) {
      return `🚀 **Top Sci-Fi Recommendations on EuroFilm:**\n\n1. **Interstellar (2014)** – Christopher Nolan's cosmic odyssey on gravitational wormholes and love.\n2. **Dune: Part Two (2024)** – Denis Villeneuve's grand operatic sci-fi masterpiece.\n3. **Arrival (2016)** – A mind-bending inquiry into non-linear linguistics and alien communion.\n4. **Blade Runner 2049 (2017)** – Stunning neo-noir cyberpunk visuals by Roger Deakins.\n\n*Search for any of these titles in EuroFilm to watch their official HD trailers!*`;
    }
    if (q.includes('horror')) {
      return `👻 **Top Horror Recommendations on EuroFilm:**\n\n1. **Hereditary (2018)** – Ari Aster's terrifying descent into generational grief and occult horror.\n2. **The Shining (1980)** – Stanley Kubrick's psychological hotel isolation nightmare.\n3. **Alien (1979)** – Ridley Scott's timeless claustrophobic gothic sci-fi terror.\n4. **Sinners (2025)** – Ryan Coogler's upcoming period southern gothic horror thriller.`;
    }
    return `🍿 **Editor's Top Cinema Recommendations:**\n\n• **For Masterpiece Drama:** *The Godfather*, *Oppenheimer*, *Past Lives*\n• **For Visual Spectacle:** *Dune: Part Two*, *Avatar: Fire and Ash*, *Spider-Man: Across the Spider-Verse*\n• **For Anime Cinephiles:** *Spirited Away*, *Your Name*, *The Boy and the Heron*\n\nExplore our **EuroFilm Picks** tab in the menu to see titles with the highest visitor love!`;
  }

  if (q.includes('oscar') || q.includes('academy award')) {
    return `🏆 **Oscars & Academy Award Winners:**\n\n• Visit **Menu → Awards & Events → Oscars** to explore official Academy Award Best Picture and acting winners from the 2020s, 2010s, and classic eras.\n• Every Oscar winner features trailer links, ceremony notes, and director dossiers!`;
  }

  return `🎥 **EuroFilm CineBot:**\n\nRegarding *"${query}"*:\nEuroFilm tracks comprehensive TMDB cinema records, official trailers, box office numbers, and community reviews.\n\nYou can use our top search bar to immediately pull up cast credits, runtime, budget, revenue, and official trailers for this title. Is there a specific movie, director, or EuroFilm feature you would like to explore?`;
}

export function HelpCenterChatView({
  onBackToHome,
  onNavigateToTab,
  currentLanguage = 'en',
}: HelpCenterChatViewProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `👋 **Welcome to EuroFilm Help Center & CineBot!**\n\nI am your dedicated cinema AI assistant. You can ask me anything about **movies, actors, directors, recommendations, trailers, and how to use the EuroFilm website**.\n\n*(Note: I am strictly restricted to cinema and EuroFilm platform questions and will decline unrelated topics).*`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateLocalBotResponse(q, currentLanguage);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const quickPrompts = [
    'How do I use the -18 and +18 age rating filter?',
    'Recommend a mind-bending sci-fi movie',
    'Where is EuroFilm Labs (Most Disliked films)?',
    'How can I vote in Community Polls & Debates?',
    'How do I donate via Buy Me a Coffee or Crypto?',
    'Tell me about the highest rated anime movies',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-950 text-white rounded-lg">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                Help Center &amp; CineBot
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Free AI
                </span>
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Restricted to Cinema &amp; EuroFilm Platform Knowledge
              </p>
            </div>
          </div>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-300 hover:border-zinc-900 text-xs font-bold rounded-md transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.home || 'Back to Home'}</span>
          </button>
        )}
      </div>

      {/* Domain restriction banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Strict Domain Policy:</span> This AI assistant is strictly programmed to answer cinema, film recommendations, cast/director trivia, box office facts, and EuroFilm website features. Queries outside this domain will be declined.
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider block">
          Frequent Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer text-left"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="border border-zinc-200 rounded-2xl bg-zinc-50 overflow-hidden shadow-xs flex flex-col h-[520px]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-amber-400 text-zinc-950'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1.5 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-zinc-950 text-white rounded-tr-none'
                    : 'bg-white text-zinc-900 border border-zinc-200 rounded-tl-none'
                }`}
              >
                <div
                  className="whitespace-pre-line font-normal"
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                  }}
                />
                <span
                  className={`text-[10px] block text-right ${
                    msg.sender === 'user' ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 italic">
              <Bot className="w-4 h-4 text-amber-500 animate-spin" />
              <span>CineBot is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about any movie, trailer, director, or EuroFilm feature..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-zinc-100 border border-zinc-300 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Website Guide Quick Accordion */}
      <div className="border border-zinc-200 rounded-xl bg-white p-5 space-y-4">
        <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
          <Info className="w-4 h-4 text-zinc-600" />
          EuroFilm Website Features Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-600">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 space-y-1">
            <span className="font-bold text-zinc-900 block">🎥 HD In-Page Trailer Player</span>
            <p>Every trailer plays on a high-definition cinema page without YouTube redirects or annoying pop-ups.</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 space-y-1">
            <span className="font-bold text-zinc-900 block">🔞 Smart Age Rating Filters</span>
            <p>Toggle between -18 (family-safe animations, Disney, Ghibli) and +18 (mature horror & crime noir).</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 space-y-1">
            <span className="font-bold text-zinc-900 block">🧪 EuroFilm Labs (Most Disliked)</span>
            <p>Explore controversial cinema experiments and filter films by community dislike metrics.</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 space-y-1">
            <span className="font-bold text-zinc-900 block">🗳️ Community Polls &amp; Film Debates</span>
            <p>Cast your vote on ongoing cinema debates and contribute arguments to the cinephile discourse.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
