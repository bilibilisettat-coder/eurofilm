import { useState } from 'react';
import {
  Coffee,
  Heart,
  Copy,
  Check,
  CreditCard,
  QrCode,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface ContributorZoneViewProps {
  onBackToHome?: () => void;
  currentLanguage?: Language;
}

export function ContributorZoneView({
  onBackToHome,
  currentLanguage = 'en',
}: ContributorZoneViewProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Buy Me a Coffee state
  const [coffeeCount, setCoffeeCount] = useState<number>(3);
  const [coffeeName, setCoffeeName] = useState<string>('');
  const [coffeeMessage, setCoffeeMessage] = useState<string>('');
  const [coffeeSubmitted, setCoffeeSubmitted] = useState<boolean>(false);

  // PayPal state
  const [paypalAmount, setPaypalAmount] = useState<number>(25);
  const [customPaypalAmount, setCustomPaypalAmount] = useState<string>('');
  const [paypalSubmitted, setPaypalSubmitted] = useState<boolean>(false);

  // Crypto copied state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const cryptoWallets = [
    {
      name: 'Bitcoin (BTC)',
      network: 'Bitcoin Native (SegWit)',
      address: 'bc1qeurofilmcine8942km7zpx9a42llnx8c5film',
      icon: '₿',
      color: 'bg-amber-500/10 text-amber-600 border-amber-300',
    },
    {
      name: 'Ethereum (ETH)',
      network: 'ERC-20',
      address: '0x71C93aC3454A789B880b91d3A849c4E75c49EFILM',
      icon: 'Ξ',
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-300',
    },
    {
      name: 'Tether (USDT)',
      network: 'TRC-20 / ERC-20',
      address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjEuroFilm99',
      icon: '₮',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-300',
    },
    {
      name: 'Solana (SOL)',
      network: 'Solana Mainnet',
      address: 'EuroFilmCine774xY9BqVpLnx88KmZz4aSol999',
      icon: '◎',
      color: 'bg-purple-500/10 text-purple-600 border-purple-300',
    },
  ];

  const handleCopy = (key: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleCoffeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCoffeeSubmitted(true);
    setTimeout(() => setCoffeeSubmitted(false), 4000);
  };

  const handlePaypalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaypalSubmitted(true);
    setTimeout(() => setPaypalSubmitted(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                Contributor Zone
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Support Us
                </span>
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Support Independent Cinema Discovery, High-Speed Trailer Mirrors &amp; Unfiltered Film Essays
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

      {/* Mission Banner */}
      <div className="p-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 text-white rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Independent &amp; Free For All Movie Lovers</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-2xl">
          EuroFilm operates without mandatory paywalls or video subscription fees. Your contributions fund our high-definition trailer video servers, real-time TMDB indexing, and first-person cinematic critiques.
        </p>
      </div>

      {/* METHOD 1: BUY ME A COFFEE PLACEHOLDER */}
      <section className="bg-white border border-amber-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black shadow-xs">
              ☕
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-950">Buy Me a Coffee</h2>
              <p className="text-xs text-zinc-500">Quick, friendly support for our editorial and engineering team</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            $5 per coffee
          </span>
        </div>

        <form onSubmit={handleCoffeeSubmit} className="space-y-5">
          {/* Coffee quantity selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 block">Select Coffees:</label>
            <div className="flex flex-wrap items-center gap-2.5">
              {[1, 3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCoffeeCount(num)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    coffeeCount === num
                      ? 'bg-amber-400 text-zinc-950 border-amber-500 shadow-xs scale-102'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                  }`}
                >
                  <span>☕ × {num}</span>
                  <span className="font-mono text-zinc-600">(${num * 5})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your Name or Cinephile Alias (optional)"
              value={coffeeName}
              onChange={(e) => setCoffeeName(e.target.value)}
              className="px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Leave a short note or movie request"
              value={coffeeMessage}
              onChange={(e) => setCoffeeMessage(e.target.value)}
              className="px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {coffeeSubmitted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your generosity keeps EuroFilm thriving!</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Coffee className="w-4 h-4" />
              <span>Support with {coffeeCount} Coffee{coffeeCount > 1 ? 's' : ''} (${coffeeCount * 5})</span>
            </button>
          )}
        </form>
      </section>

      {/* METHOD 2: PAYPAL PAYMENT METHOD */}
      <section className="bg-white border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-blue-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-950">PayPal Payment</h2>
              <p className="text-xs text-zinc-500">Secure one-time contribution via PayPal balance, debit, or credit card</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            Instant &amp; Verified
          </span>
        </div>

        <form onSubmit={handlePaypalSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 block">Choose Amount:</label>
            <div className="flex flex-wrap items-center gap-2.5">
              {[10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setPaypalAmount(amt);
                    setCustomPaypalAmount('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    paypalAmount === amt && !customPaypalAmount
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                  }`}
                >
                  ${amt} USD
                </button>
              ))}
              <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1">
                <span className="text-xs text-zinc-500 font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  placeholder="Custom"
                  value={customPaypalAmount}
                  onChange={(e) => {
                    setCustomPaypalAmount(e.target.value);
                    if (e.target.value) setPaypalAmount(Number(e.target.value));
                  }}
                  className="w-16 bg-transparent text-xs text-zinc-900 font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {paypalSubmitted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>PayPal donation simulation recorded. Thank you for your support!</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Donate ${customPaypalAmount || paypalAmount} with PayPal</span>
            </button>
          )}
        </form>
      </section>

      {/* METHOD 3: CRYPTOCURRENCY PAYMENT METHODS */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-black shadow-xs">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-950">Cryptocurrency Payment Methods</h2>
              <p className="text-xs text-zinc-500">Decentralized, borderless donations with zero intermediary fees</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
            Web3 Supported
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cryptoWallets.map((wallet) => (
            <div
              key={wallet.name}
              className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-sm border ${wallet.color}`}>
                    {wallet.icon}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-950">{wallet.name}</h3>
                    <span className="text-[10px] text-zinc-400">{wallet.network}</span>
                  </div>
                </div>
                <QrCode className="w-4 h-4 text-zinc-400" />
              </div>

              <div className="bg-white border border-zinc-200 p-2.5 rounded-lg flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-zinc-700 truncate select-all">
                  {wallet.address}
                </span>
                <button
                  onClick={() => handleCopy(wallet.name, wallet.address)}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-800 text-[10px] font-bold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy address"
                >
                  {copiedKey === wallet.name ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recognition & Security Note */}
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3 text-xs text-zinc-500">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          All contributions go 100% directly towards maintaining EuroFilm independent cinema infrastructure, bandwidth, and open-access critical analysis.
        </span>
      </div>
    </div>
  );
}
