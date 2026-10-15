// Google Analytics (gtag.js) and EXIF / Semantic Metadata Utility

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-BC27NEFEGM';

/**
 * Send custom event to Google Tag Manager / GA4
 */
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Track virtual page views for SPA navigation
 */
export function trackPageView(pageTitle: string, pagePath: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: pageTitle,
      page_path: pagePath,
    });
  }
}

/**
 * Track movie trailer playback
 */
export function trackTrailerPlay(movieId: number, movieTitle: string, youtubeKey?: string) {
  trackEvent('play_trailer', 'Video', `${movieTitle} (${movieId})${youtubeKey ? ` - ${youtubeKey}` : ''}`);
}

/**
 * Track tab navigation / category selection
 */
export function trackCategorySelect(categoryId: string, categoryLabel: string) {
  trackEvent('select_category', 'Navigation', `${categoryLabel} [${categoryId}]`);
}

/**
 * Track filter interactions (media type, age rating)
 */
export function trackFilterSelect(filterType: string, filterValue: string) {
  trackEvent('apply_filter', 'Filter', `${filterType}: ${filterValue}`);
}

/**
 * Track user search queries
 */
export function trackSearchQuery(query: string) {
  if (query.trim()) {
    trackEvent('search', 'Search', query.trim());
  }
}

/**
 * Dynamic EXIF and Schema.org metadata updater for the active document head
 */
export function updateDynamicMediaMetadata(meta: {
  title: string;
  description?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  videoUrl?: string;
  releaseDate?: string;
  rating?: number;
  genre?: string[];
  director?: string;
}) {
  if (typeof document === 'undefined') return;

  // 1. Update Document Title
  document.title = meta.title ? `${meta.title} | EuroFilm` : 'EuroFilm - Premier Cinema Discovery';

  // 2. Helper to set or create meta tag
  const setMeta = (name: string, content: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      if (isProperty) el.setAttribute('property', name);
      else el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  if (meta.description) {
    setMeta('description', meta.description);
    setMeta('og:description', meta.description, true);
    setMeta('twitter:description', meta.description);
  }

  setMeta('og:title', meta.title, true);
  setMeta('twitter:title', meta.title);

  if (meta.imageUrl) {
    setMeta('og:image', meta.imageUrl, true);
    setMeta('og:image:secure_url', meta.imageUrl, true);
    setMeta('twitter:image', meta.imageUrl);
    setMeta('image:width', String(meta.imageWidth || 1200));
    setMeta('image:height', String(meta.imageHeight || 675));
    setMeta('og:image:width', String(meta.imageWidth || 1200), true);
    setMeta('og:image:height', String(meta.imageHeight || 675), true);
  }

  // 3. Inject Dynamic JSON-LD with EXIF photographic & movie structured attributes
  const jsonLdId = 'eurofilm-dynamic-exif-ld';
  let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = jsonLdId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const structuredData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: meta.title,
    description: meta.description || 'Premier cinema discovery and official HD trailer.',
    datePublished: meta.releaseDate || '2025',
    image: meta.imageUrl
      ? {
          '@type': 'ImageObject',
          contentUrl: meta.imageUrl,
          width: meta.imageWidth || 1200,
          height: meta.imageHeight || 675,
          encodingFormat: 'image/jpeg',
          caption: `${meta.title} - High Resolution Theatrical Artwork`,
          exifData: [
            { '@type': 'PropertyValue', name: 'ColorSpace', value: 'sRGB' },
            { '@type': 'PropertyValue', name: 'ImageOrientation', value: 'Landscape 16:9 / 2:3' },
            { '@type': 'PropertyValue', name: 'OriginalResolution', value: '3840x2160 UltraHD' },
            { '@type': 'PropertyValue', name: 'CapturePlatform', value: 'Digital Cinema Package' },
          ],
        }
      : undefined,
    aggregateRating: meta.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: meta.rating,
          bestRating: '10',
          worstRating: '1',
          ratingCount: 1500,
        }
      : undefined,
    genre: meta.genre || ['Cinema', 'Drama'],
    publisher: {
      '@type': 'Organization',
      name: 'EuroFilm',
      url: window.location.origin,
    },
  };

  if (meta.videoUrl) {
    structuredData.trailer = {
      '@type': 'VideoObject',
      name: `${meta.title} Official Trailer`,
      description: `Official HD Trailer and Preview for ${meta.title}`,
      thumbnailUrl: meta.imageUrl,
      uploadDate: meta.releaseDate || '2025-01-01',
      embedUrl: meta.videoUrl,
    };
  }

  scriptEl.textContent = JSON.stringify(structuredData);
}

/**
 * Reset document head metadata back to default EuroFilm global values
 */
export function resetGlobalMediaMetadata() {
  if (typeof document === 'undefined') return;
  document.title = 'EuroFilm - Free Movie Stream & Official Trailers';
  const jsonLdEl = document.getElementById('eurofilm-dynamic-exif-ld');
  if (jsonLdEl) {
    jsonLdEl.remove();
  }
}
