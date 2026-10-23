import { X, Film, Globe, Users, HeartHandshake } from 'lucide-react';
import { EuroFilmLogo } from './EuroFilmLogo';
import { Language } from '../i18n/translations';
import { getModalStrings } from '../i18n/localize';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: Language;
}

export function AboutModal({ isOpen, onClose, currentLanguage = 'en' }: AboutModalProps) {
  if (!isOpen) return null;

  const m = getModalStrings(currentLanguage).about;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs"
    >
      <div className="bg-white border border-zinc-200 rounded-xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 rounded-md hover:bg-zinc-100 cursor-pointer"
          aria-label={m.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <EuroFilmLogo size="sm" showSubtext={false} />
          <h2 className="text-xl font-bold text-zinc-950">{m.title}</h2>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 mb-6 leading-relaxed">
          {m.intro}
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-700">
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-3">
            <Film className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 mb-0.5">{m.f1Title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {m.f1Desc}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-3">
            <Users className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 mb-0.5">{m.f2Title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {m.f2Desc}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-3">
            <Globe className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 mb-0.5">{m.f3Title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {m.f3Desc}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-zinc-900 mb-0.5">{m.f4Title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {m.f4Desc}{' '}
                <a href="mailto:contact@eurofilm.xyz" className="font-semibold underline text-zinc-900">
                  contact@eurofilm.xyz
                </a>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            {m.close}
          </button>
        </div>
      </div>
    </div>
  );
}
