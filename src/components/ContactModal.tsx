import { useState } from 'react';
import { X, Mail, Send, CheckCircle2 } from 'lucide-react';
import { EuroFilmLogo } from './EuroFilmLogo';
import { Language } from '../i18n/translations';
import { getModalStrings } from '../i18n/localize';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: Language;
}

export function ContactModal({ isOpen, onClose, currentLanguage = 'en' }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  if (!isOpen) return null;

  const m = getModalStrings(currentLanguage).contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs"
    >
      <div className="bg-white border border-zinc-200 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
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

        <p className="text-xs sm:text-sm text-zinc-600 mb-5 leading-relaxed">
          {m.description.split('contact@eurofilm.xyz')[0]}
          <a
            href="mailto:contact@eurofilm.xyz"
            className="font-semibold text-zinc-950 underline hover:text-zinc-700"
          >
            contact@eurofilm.xyz
          </a>
          {m.description.split('contact@eurofilm.xyz')[1] || '.'}
        </p>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-emerald-950 text-sm">{m.successMessage}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                {m.nameLabel}
              </label>
              <input
                type="text"
                required
                placeholder={m.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                {m.emailLabel}
              </label>
              <input
                type="email"
                required
                placeholder={m.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                {m.subjectLabel}
              </label>
              <input
                type="text"
                required
                placeholder={m.subjectPlaceholder}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">
                {m.messageLabel}
              </label>
              <textarea
                required
                rows={3}
                placeholder={m.messagePlaceholder}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer"
              >
                {m.close}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{m.sendButton}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
