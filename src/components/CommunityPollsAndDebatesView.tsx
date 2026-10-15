import React, { useState } from 'react';
import {
  Vote,
  MessageSquare,
  Send,
  ThumbsUp,
  Sparkles,
  Flame,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_POLLS } from '../data/entertainmentData';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { getUiStrings } from '../i18n/localize';

interface DebateItem {
  id: string;
  title: string;
  description: string;
  sideA: string;
  sideB: string;
  votesA: number;
  votesB: number;
  arguments: {
    id: string;
    author: string;
    side: 'A' | 'B';
    text: string;
    upvotes: number;
    timeAgo: string;
  }[];
}

const INITIAL_DEBATES: DebateItem[] = [
  {
    id: 'debate-1',
    title: 'Christopher Nolan vs. Denis Villeneuve',
    description: 'Who is the premier contemporary visionary architect of modern large-format science fiction cinema?',
    sideA: 'Christopher Nolan (Interstellar, Oppenheimer, Tenet)',
    sideB: 'Denis Villeneuve (Dune, Arrival, Blade Runner 2049)',
    votesA: 842,
    votesB: 795,
    arguments: [
      {
        id: 'arg-1',
        author: 'Julian_Cinephile',
        side: 'A',
        text: 'Nolan commitment to in-camera practical effects, 70mm IMAX celluloid, and time dilation puzzles makes him the closest heir to Kubrick and Lean.',
        upvotes: 42,
        timeAgo: '2 hours ago',
      },
      {
        id: 'arg-2',
        author: 'Sarah_K',
        side: 'B',
        text: 'Villeneuve possesses vastly superior visual rhythm and sound design restraint. Dune Part Two proves he can adapt unfilmable literature with poetic gravity.',
        upvotes: 38,
        timeAgo: '4 hours ago',
      },
    ],
  },
  {
    id: 'debate-2',
    title: 'The Ending of Inception: Did the Totem Fall?',
    description: 'When the credits cut to black in Christopher Nolan 2010 masterpiece Inception, did the spinning top fall, or is Dom Cobb permanently asleep in limbo?',
    sideA: 'The Totem Wobbled & Fell (Reality)',
    sideB: 'Cobb is Still Trapped in Limbo (Dream)',
    votesA: 1250,
    votesB: 880,
    arguments: [
      {
        id: 'arg-3',
        author: 'Theo_Films',
        side: 'A',
        text: 'Michael Caine confirmed that any scene with his character Professor Miles is reality, and Cobb kids have visibly aged with different clothing.',
        upvotes: 65,
        timeAgo: '1 day ago',
      },
      {
        id: 'arg-4',
        author: 'DreamWeaver99',
        side: 'B',
        text: 'The true point Nolan makes is that Cobb walks away without looking. He no longer cares whether it is real—his emotional reality is with his children.',
        upvotes: 59,
        timeAgo: '1 day ago',
      },
    ],
  },
  {
    id: 'debate-3',
    title: 'Physical 4K Blu-ray vs. 4K Streaming',
    description: 'Does the 100 Mbps uncompressed audio and video bitrate of physical 4K disc justify collecting over convenient digital streaming?',
    sideA: 'Physical 4K Disc is Essential for Purists',
    sideB: 'Digital 4K Streaming is More Than Sufficient',
    votesA: 980,
    votesB: 430,
    arguments: [
      {
        id: 'arg-5',
        author: 'Audiophile_Dan',
        side: 'A',
        text: 'Lossless Dolby TrueHD and uncompressed HDR10+ luminance curves make physical discs an entirely different sensory experience for home cinema enthusiasts.',
        upvotes: 51,
        timeAgo: '3 hours ago',
      },
    ],
  },
];

interface CommunityPollsAndDebatesViewProps {
  onBackToHome?: () => void;
  currentLanguage?: Language;
}

export function CommunityPollsAndDebatesView({
  onBackToHome,
  currentLanguage = 'en',
}: CommunityPollsAndDebatesViewProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const ui = getUiStrings(currentLanguage);

  // Poll state
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});

  // Debate state
  const [debates, setDebates] = useState<DebateItem[]>(INITIAL_DEBATES);
  const [userDebateChoices, setUserDebateChoices] = useState<Record<string, 'A' | 'B'>>({});
  const [argAuthor, setArgAuthor] = useState<string>('');
  const [argText, setArgText] = useState<string>('');
  const [activeDebateForArg, setActiveDebateForArg] = useState<string>('debate-1');
  const [selectedSideForArg, setSelectedSideForArg] = useState<'A' | 'B'>('A');

  const handleVotePoll = (pollId: string, optIdx: number) => {
    setPollVotes((prev) => ({ ...prev, [pollId]: optIdx }));
  };

  const handleVoteDebate = (debateId: string, side: 'A' | 'B') => {
    if (userDebateChoices[debateId]) return; // already voted
    setUserDebateChoices((prev) => ({ ...prev, [debateId]: side }));
    setDebates((prev) =>
      prev.map((d) => {
        if (d.id !== debateId) return d;
        return {
          ...d,
          votesA: side === 'A' ? d.votesA + 1 : d.votesA,
          votesB: side === 'B' ? d.votesB + 1 : d.votesB,
        };
      })
    );
  };

  const handleUpvoteArg = (debateId: string, argId: string) => {
    setDebates((prev) =>
      prev.map((d) => {
        if (d.id !== debateId) return d;
        return {
          ...d,
          arguments: d.arguments.map((a) =>
            a.id === argId ? { ...a, upvotes: a.upvotes + 1 } : a
          ),
        };
      })
    );
  };

  const handleAddArgument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!argText.trim()) return;

    const newArg = {
      id: `arg-${Date.now()}`,
      author: argAuthor.trim() || 'Anonymous Cinephile',
      side: selectedSideForArg,
      text: argText.trim(),
      upvotes: 1,
      timeAgo: 'Just now',
    };

    setDebates((prev) =>
      prev.map((d) => {
        if (d.id !== activeDebateForArg) return d;
        return {
          ...d,
          arguments: [newArg, ...d.arguments],
        };
      })
    );

    setArgText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                Community Polls &amp; Film Debates
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Live Cinephile Arena
                </span>
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Cast votes, view real-time voter statistics, and join contentious cinematic debates
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

      {/* SECTION 1: ACTIVE COMMUNITY POLLS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-lg font-bold text-zinc-950">Active Global Polls</h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">1 Vote per Visitor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SAMPLE_POLLS.map((poll) => {
            const userVote = pollVotes[poll.id];
            const hasVoted = userVote !== undefined;

            return (
              <div
                key={poll.id}
                className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-xs space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Cinema Poll
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-950 leading-snug">
                    {poll.question}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {poll.options.map((opt, idx) => {
                    const isSelected = userVote === idx;
                    const totalVotes = poll.totalVotes + (hasVoted ? 1 : 0);
                    const optionVotes = opt.votes + (isSelected ? 1 : 0);
                    const pct = Math.round((optionVotes / totalVotes) * 100);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleVotePoll(poll.id, idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all relative overflow-hidden cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 font-bold text-indigo-950 shadow-2xs'
                            : 'border-zinc-200 hover:border-zinc-400 text-zinc-800 bg-zinc-50/50'
                        }`}
                      >
                        {hasVoted && (
                          <div
                            className="absolute inset-y-0 left-0 bg-indigo-100/70 -z-10 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        )}
                        <div className="flex items-center justify-between relative z-10">
                          <span className="flex items-center gap-2">
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                            <span>{opt.label}</span>
                          </span>
                          {hasVoted && (
                            <span className="font-mono text-[11px] font-bold text-indigo-900">
                              {pct}% ({optionVotes.toLocaleString()})
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100">
                  <span>{(poll.totalVotes + (hasVoted ? 1 : 0)).toLocaleString()} total votes</span>
                  <span className="text-emerald-600 font-semibold">● Voting Live</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: CONTENTIOUS FILM DEBATES ARENA */}
      <section className="space-y-8 pt-6 border-t border-zinc-200">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-xl font-bold text-zinc-950">Film Debates &amp; Arguments</h2>
              <p className="text-xs text-zinc-500">Take a stance, cast your debate vote, and post your cinephile arguments</p>
            </div>
          </div>
        </div>

        {/* Debates Cards */}
        <div className="space-y-8">
          {debates.map((debate) => {
            const userChoice = userDebateChoices[debate.id];
            const total = debate.votesA + debate.votesB;
            const pctA = Math.round((debate.votesA / total) * 100);
            const pctB = 100 - pctA;

            return (
              <div
                key={debate.id}
                className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Debate Question */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">
                    {debate.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {debate.description}
                  </p>
                </div>

                {/* Stance Choice Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Side A */}
                  <button
                    onClick={() => handleVoteDebate(debate.id, 'A')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                      userChoice === 'A'
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20'
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        Stance A
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-900">{pctA}%</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                      {debate.sideA}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-mono block">
                      {debate.votesA.toLocaleString()} votes
                    </span>
                  </button>

                  {/* Side B */}
                  <button
                    onClick={() => handleVoteDebate(debate.id, 'B')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                      userChoice === 'B'
                        ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-500/20'
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                        Stance B
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-900">{pctB}%</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                      {debate.sideB}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-mono block">
                      {debate.votesB.toLocaleString()} votes
                    </span>
                  </button>
                </div>

                {/* Progress Visualizer */}
                <div className="h-3 bg-zinc-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 transition-all duration-500" style={{ width: `${pctA}%` }} />
                  <div className="bg-rose-600 transition-all duration-500" style={{ width: `${pctB}%` }} />
                </div>

                {/* Arguments Feed */}
                <div className="space-y-3 pt-3 border-t border-zinc-100">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                    Community Arguments ({debate.arguments.length})
                  </span>

                  <div className="space-y-3">
                    {debate.arguments.map((arg) => (
                      <div
                        key={arg.id}
                        className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900">{arg.author}</span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                arg.side === 'A'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              Team {arg.side}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400">{arg.timeAgo}</span>
                        </div>
                        <p className="text-xs text-zinc-700 leading-relaxed">{arg.text}</p>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleUpvoteArg(debate.id, arg.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 hover:text-black transition-colors cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3 text-zinc-500" />
                            <span>{arg.upvotes} Upvotes</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Debate Argument Form */}
        <section className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-zinc-950">Add Your Debate Argument</h3>
          </div>

          <form onSubmit={handleAddArgument} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">Select Topic:</label>
                <select
                  value={activeDebateForArg}
                  onChange={(e) => setActiveDebateForArg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  {debates.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">Your Side:</label>
                <select
                  value={selectedSideForArg}
                  onChange={(e) => setSelectedSideForArg(e.target.value as 'A' | 'B')}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="A">Side A</option>
                  <option value="B">Side B</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">Your Cinephile Alias:</label>
                <input
                  type="text"
                  placeholder="e.g. CinemaLover"
                  value={argAuthor}
                  onChange={(e) => setArgAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Present your cinematic rationale, evidence, or critical dissenting viewpoint..."
              value={argText}
              onChange={(e) => setArgText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-zinc-300 rounded-xl text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Debate Argument</span>
              </button>
            </div>
          </form>
        </section>
      </section>
    </div>
  );
}
