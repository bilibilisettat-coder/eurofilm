import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigateHome?: () => void;
  currentLanguage?: Language;
}

export function Breadcrumbs({ items, onNavigateHome, currentLanguage = 'en' }: BreadcrumbsProps) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-zinc-500 overflow-x-auto whitespace-nowrap scrollbar-none"
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center gap-1.5"
      >
        {/* Home / Free Movie Stream Anchor */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center gap-1.5"
        >
          <a
            itemProp="item"
            href="/free-movie-stream"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 font-medium transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-zinc-500" />
            <span itemProp="name">{t.freeMovieStream || t.home || 'Free Movie Stream'}</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => {
          const position = index + 2;
          const isLast = index === items.length - 1;

          return (
            <li
              key={item.label + index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5"
            >
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              {isLast || !item.onClick ? (
                <span
                  itemProp="name"
                  className={isLast ? 'text-zinc-950 font-semibold' : 'text-zinc-600'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  itemProp="item"
                  onClick={item.onClick}
                  className="text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <span itemProp="name">{item.label}</span>
                </button>
              )}
              <meta itemProp="position" content={String(position)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
