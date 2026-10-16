import { X } from 'lucide-react';
import { EuroFilmLogo } from './EuroFilmLogo';
import { Language } from '../i18n/translations';
import { getModalStrings } from '../i18n/localize';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: Language;
}

export function PrivacyModal({ isOpen, onClose, currentLanguage = 'en' }: PrivacyModalProps) {
  if (!isOpen) return null;

  const m = getModalStrings(currentLanguage).privacy;

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

        <p className="text-xs text-zinc-500 mb-5">
          {m.lastUpdated}
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section>
            <h3 className="font-bold text-zinc-900 mb-1 text-sm">{m.s1Title}</h3>
            <p className="text-xs text-zinc-600">
              {m.s1Desc}
            </p>
          </section>

          <section>
            <h3 className="font-bold text-zinc-900 mb-1 text-sm">{m.s2Title}</h3>
            <p className="text-xs text-zinc-600">
              {m.s2Desc}
            </p>
          </section>

          <section>
            <h3 className="font-bold text-zinc-900 mb-1 text-sm">{m.s3Title}</h3>
            <p className="text-xs text-zinc-600">
              {m.s3Desc}
            </p>
          </section>

          <section>
            <h3 className="font-bold text-zinc-900 mb-1 text-sm">{m.s4Title}</h3>
            <p className="text-xs text-zinc-600">
              {m.s4Desc}
            </p>
          </section>
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
