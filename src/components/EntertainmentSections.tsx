import { useState } from 'react';
import {
  BORN_TODAY_CELEBS,
  TOP_NEWS_ITEMS,
  BOX_OFFICE_REGIONS,
  SAMPLE_POLLS,
  CelebrityProfile,
  NewsItem,
} from '../data/entertainmentData';
import {
  Calendar,
  Newspaper,
  DollarSign,
  Vote,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';

interface BornTodayProps {
  currentLanguage?: Language;
  onSelectCelebrity?: (celeb: CelebrityProfile) => void;
}

export function BornTodaySection({ currentLanguage = 'en' }: BornTodayProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            {t.bornToday || 'Born Today'}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
            {ui.liveToday}
          </span>
        </div>
        <span className="text-xs text-zinc-500 hidden sm:inline">
          {ui.celebratingBirthdays}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {BORN_TODAY_CELEBS.map((celeb) => (
          <div
            key={celeb.id}
            className="group bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs hover:border-zinc-400 transition-colors flex flex-col justify-between"
          >
            <div className="aspect-square bg-zinc-100 overflow-hidden relative">
              <img
                src={celeb.imageUrl}
                alt={celeb.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute bottom-1.5 right-1.5 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                {ui.age} {celeb.age}
              </span>
            </div>
            <div className="p-2.5 space-y-1">
              <h3 className="font-bold text-xs text-zinc-950 truncate" title={celeb.name}>
                {celeb.name}
              </h3>
              <p className="text-[10px] text-zinc-500 truncate">{celeb.role}</p>
              <p className="text-[10px] text-zinc-400 line-clamp-1 italic" title={celeb.knownFor}>
                {celeb.knownFor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface TopNewsProps {
  currentLanguage?: Language;
}

export function TopNewsSection({ currentLanguage = 'en' }: TopNewsProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            {t.topNews || ui.topNewsTitle || 'Top Entertainment News'}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            {ui.updated}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOP_NEWS_ITEMS.map((news: NewsItem) => (
          <article
            key={news.id}
            className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs hover:border-zinc-400 transition-colors flex gap-4"
          >
            <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
              <img
                src={news.imageUrl}
                alt={news.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium mb-1">
                  <span className="font-bold text-amber-600 uppercase tracking-wider">
                    {news.category}
                  </span>
                  <span>•</span>
                  <span>{news.timeAgo}</span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-zinc-950 line-clamp-2 leading-snug">
                  {news.title}
                </h3>
                <p className="text-xs text-zinc-600 line-clamp-2 mt-1 leading-relaxed">
                  {news.summary}
                </p>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-2 block">
                {news.source}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

interface BoxOfficeProps {
  currentLanguage?: Language;
}

export function BoxOfficeSection({ currentLanguage = 'en' }: BoxOfficeProps) {
  const [region, setRegion] = useState<'US' | 'India' | 'UK'>('US');
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);
  const items = BOX_OFFICE_REGIONS[region];

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            {t.topBoxOffice || 'Top Box Office'}
          </h2>
        </div>

        {/* Region Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg text-xs font-semibold">
          {(['US', 'India', 'UK'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setRegion(reg)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                region === reg
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {reg === 'US' ? ui.unitedStates : reg === 'India' ? ui.india : ui.unitedKingdom}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-zinc-200 rounded-xl shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-4 w-14">{ui.rank}</th>
              <th className="py-2.5 px-4">{ui.title}</th>
              <th className="py-2.5 px-4 text-right">{ui.weekendGross}</th>
              <th className="py-2.5 px-4 text-right">{ui.totalGross}</th>
              <th className="py-2.5 px-4 text-right">{ui.weeks}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-medium">
            {items.map((item) => (
              <tr key={item.rank} className="hover:bg-zinc-50/70 transition-colors">
                <td className="py-2.5 px-4 font-bold text-zinc-900">#{item.rank}</td>
                <td className="py-2.5 px-4 font-bold text-zinc-950">{item.title}</td>
                <td className="py-2.5 px-4 text-right font-mono text-emerald-700">
                  {item.weekendGross}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-zinc-600">
                  {item.totalGross}
                </td>
                <td className="py-2.5 px-4 text-right text-zinc-400 font-mono">
                  {item.weeksOut} {ui.weeks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface CommunityPollsProps {
  currentLanguage?: Language;
}

export function CommunityPollsSection({ currentLanguage = 'en' }: CommunityPollsProps) {
  const ui = getUiStrings(currentLanguage);
  const [votedOption, setVotedOption] = useState<Record<string, number>>({});

  const handleVote = (pollId: string, optIdx: number) => {
    setVotedOption((prev) => ({ ...prev, [pollId]: optIdx }));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            {ui.communityPolls}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_POLLS.map((poll) => {
          const userVote = votedOption[poll.id];
          return (
            <div
              key={poll.id}
              className="p-5 bg-white border border-zinc-200 rounded-xl shadow-2xs space-y-3.5"
            >
              <h3 className="font-bold text-sm text-zinc-950 leading-snug">{poll.question}</h3>
              <div className="space-y-2">
                {poll.options.map((opt, idx) => {
                  const isSelected = userVote === idx;
                  const total = poll.totalVotes + (userVote !== undefined ? 1 : 0);
                  const votes = opt.votes + (isSelected ? 1 : 0);
                  const pct = Math.round((votes / total) * 100);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleVote(poll.id, idx)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-950'
                          : 'border-zinc-200 hover:border-zinc-300 text-zinc-800'
                      }`}
                    >
                      {userVote !== undefined && (
                        <div
                          className="absolute inset-y-0 left-0 bg-indigo-100/60 -z-10 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        {userVote !== undefined && (
                          <span className="font-mono text-[11px] font-semibold text-zinc-600">
                            {pct}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
                <span>{poll.totalVotes.toLocaleString()} votes</span>
                <span>EuroFilm Community</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
