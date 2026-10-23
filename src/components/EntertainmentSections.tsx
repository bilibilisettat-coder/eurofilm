import { useEffect, useState } from 'react';
import { BORN_TODAY_CELEBS, SAMPLE_POLLS, CelebrityProfile } from '../data/entertainmentData';
import { Calendar, Newspaper, DollarSign, Vote, ExternalLink } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';
import { loadNews, timeAgo, type NewsHeadline } from '../services/newsFeed';

interface BornTodayProps {
  currentLanguage?: Language;
  onSelectCelebrity?: (celeb: CelebrityProfile) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Only people whose birthday really is today; ages are calculated, not hard-coded. */
function celebsBornToday(now = new Date()): (CelebrityProfile & { currentAge: number })[] {
  return BORN_TODAY_CELEBS.flatMap((c) => {
    const d = new Date(c.birthDate);
    if (Number.isNaN(d.getTime()) || d.getMonth() !== now.getMonth() || d.getDate() !== now.getDate()) return [];
    return [{ ...c, currentAge: now.getFullYear() - d.getFullYear() }];
  });
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function BornTodaySection({ currentLanguage = 'en' }: BornTodayProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);
  const today = new Date();
  const celebs = celebsBornToday(today);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            {t.bornToday || 'Born Today'}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
            {today.getDate()} {MONTHS[today.getMonth()]}
          </span>
        </div>
      </div>

      {celebs.length === 0 ? (
        <p className="text-sm text-zinc-500">No featured film birthdays today.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
          {celebs.map((celeb) => (
            <div key={celeb.id} className="bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs flex flex-col items-center text-center gap-2">
              <div aria-hidden="true" className="w-14 h-14 rounded-full bg-rose-100 text-rose-800 font-black flex items-center justify-center">
                {initials(celeb.name)}
              </div>
              <h3 className="font-bold text-xs text-zinc-950">{celeb.name}</h3>
              <p className="text-[10px] text-zinc-500">
                {celeb.role} · {ui.age} {celeb.currentAge}
              </p>
              <p className="text-[10px] text-zinc-400 italic line-clamp-2">{celeb.knownFor}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface TopNewsProps {
  currentLanguage?: Language;
}

export function TopNewsSection({ currentLanguage = 'en' }: TopNewsProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);
  const [items, setItems] = useState<NewsHeadline[]>([]);

  useEffect(() => {
    let alive = true;
    loadNews().then((n) => alive && setItems(n.slice(0, 6)));
    return () => {
      alive = false;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
            {t.topNews || ui.topNewsTitle || 'Top Entertainment News'}
          </h2>
        </div>
        <a href="/news" className="text-xs font-semibold text-amber-700 hover:underline">
          All news
        </a>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((news) => (
          <li key={news.link} className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs hover:border-zinc-400 transition-colors">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium mb-1">
              <span className="font-bold text-amber-600 uppercase tracking-wider">{news.category}</span>
              <span>•</span>
              <span>{timeAgo(news.date)}</span>
            </div>
            <h3 className="font-bold text-sm text-zinc-950 leading-snug">
              <a href={news.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {news.title}
              </a>
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono mt-2 block">{news.source}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface BoxOfficeProps {
  currentLanguage?: Language;
}

/** Weekend grosses change every week and we have no licensed live feed, so link to the sources that do. */
export function BoxOfficeSection({ currentLanguage = 'en' }: BoxOfficeProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const links = [
    { label: 'Box Office Mojo – weekend box office', href: 'https://www.boxofficemojo.com/weekend/' },
    { label: 'The Numbers – weekend box office chart', href: 'https://www.the-numbers.com/weekend-box-office-chart' },
  ];
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
        <DollarSign className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">{t.topBoxOffice || 'Top Box Office'}</h2>
      </div>
      <p className="text-sm text-zinc-600">
        Weekend box office results update every Sunday. For the latest official figures see the charts below, or browse the{' '}
        <a href="/now-playing" className="text-amber-700 underline font-semibold">movies in theaters now</a>.
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:underline">
              <ExternalLink className="w-3.5 h-3.5" />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
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
