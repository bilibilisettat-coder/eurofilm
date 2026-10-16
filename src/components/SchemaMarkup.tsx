import React, { useEffect } from 'react';
import { BlogPost } from '../data/blogData';
import { Movie, MovieDetail } from '../services/tmdb';
import { BreadcrumbItem } from './Breadcrumbs';

interface SchemaMarkupProps {
  currentUrl: string;
  activeTabLabel: string;
  selectedBlog?: BlogPost | null;
  watchingMovie?: Movie | MovieDetail | null;
  breadcrumbs: BreadcrumbItem[];
}

export function SchemaMarkup({
  currentUrl,
  activeTabLabel,
  selectedBlog,
  watchingMovie,
  breadcrumbs,
}: SchemaMarkupProps) {
  useEffect(() => {
    // 1. Maintain self-referencing canonical tag to avoid Google Search Console non-canonical errors
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = currentUrl;

    // 2. Dynamic page title & OpenGraph update
    let pageTitle = 'EuroFilm | Free Movie Stream & Trailers';
    let pageDesc = 'Watch official movie trailers, stream free cinema previews, explore anime series, and read in-depth critical dissections on EuroFilm.';

    if (selectedBlog) {
      pageTitle = `${selectedBlog.title} | EuroFilm Critical Essay`;
      pageDesc = selectedBlog.excerpt;
    } else if (watchingMovie) {
      pageTitle = `Watch ${watchingMovie.title} Official Trailer | EuroFilm`;
      pageDesc = watchingMovie.overview || pageDesc;
    } else if (activeTabLabel && activeTabLabel !== 'Popular Movies') {
      pageTitle = `${activeTabLabel} | EuroFilm Free Movie Stream`;
    }

    document.title = pageTitle;

    const descMeta = document.querySelector("meta[name='description']");
    if (descMeta) descMeta.setAttribute('content', pageDesc);

    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector("meta[property='og:description']");
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    const ogUrl = document.querySelector("meta[property='og:url']");
    if (ogUrl) ogUrl.setAttribute('content', currentUrl);
  }, [currentUrl, activeTabLabel, selectedBlog, watchingMovie]);

  // Construct JSON-LD graph
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://eurofilm.app';

  // 1. WebSite Schema
  const websiteSchema = {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: `${baseUrl}/free-movie-stream`,
    name: 'EuroFilm',
    description: 'Premier Cinema Discovery, Official Trailers & Longform Film Analysis',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/free-movie-stream?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // 2. Organization Schema
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'EuroFilm',
    url: `${baseUrl}/free-movie-stream`,
    logo: `${baseUrl}/favicon.ico`,
    email: 'yourmovies@movies.com',
  };

  // 3. BreadcrumbList Schema
  const breadcrumbListSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Free Movie Stream',
        item: `${baseUrl}/free-movie-stream`,
      },
      ...breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: b.label,
        item: b.href ? `${baseUrl}${b.href}` : `${baseUrl}/free-movie-stream`,
      })),
    ],
  };

  // 4. Movie / VideoObject Schema (when watching a trailer)
  const movieSchema = watchingMovie
    ? {
        '@type': 'Movie',
        '@id': `${baseUrl}/free-movie-stream?watch=${watchingMovie.id}#movie`,
        name: watchingMovie.title,
        description: watchingMovie.overview,
        image: watchingMovie.poster_path ? `https://image.tmdb.org/t/p/w780${watchingMovie.poster_path}` : undefined,
        datePublished: watchingMovie.release_date,
        aggregateRating: watchingMovie.vote_average
          ? {
              '@type': 'AggregateRating',
              ratingValue: watchingMovie.vote_average,
              bestRating: 10,
              worstRating: 1,
              ratingCount: watchingMovie.vote_count || 100,
            }
          : undefined,
      }
    : null;

  // 5. BlogPosting Schema (when viewing blog post)
  const blogSchema = selectedBlog
    ? {
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/free-movie-stream?blog=${selectedBlog.slug}#article`,
        headline: selectedBlog.title,
        alternativeHeadline: selectedBlog.subtitle,
        description: selectedBlog.excerpt,
        image: selectedBlog.coverImage,
        author: {
          '@type': 'Person',
          name: selectedBlog.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'EuroFilm',
          url: `${baseUrl}/free-movie-stream`,
        },
        datePublished: '2026-10-01',
        dateModified: '2026-10-11',
        wordCount: selectedBlog.wordCount || 2650,
        articleSection: 'Film Criticism',
        keywords: selectedBlog.tags.join(', '),
      }
    : null;

  // 6. FAQPage Schema for Rich Snippets
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is EuroFilm a free movie streaming portal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, EuroFilm offers instant, free official movie trailers, HD cinema previews, anime series, and comprehensive film essays without requiring user signup.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I filter anime and cartoons on EuroFilm?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Select Anime Trailers & Top Series from the menu or header filter to view 100% curated anime and animation titles verified by our internal keyword filter.',
        },
      },
    ],
  };

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      websiteSchema,
      organizationSchema,
      breadcrumbListSchema,
      faqSchema,
      ...(movieSchema ? [movieSchema] : []),
      ...(blogSchema ? [blogSchema] : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
