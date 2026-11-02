// HTML shell helpers shared by the build-time prerenderer (scripts/prerender.ts, Node) and the Worker (src/worker.ts).
// Pure string functions only: no Node or browser APIs, so they run in both.

export const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface PageSpec {
  url: string; // absolute canonical URL
  title: string;
  description: string;
  ogType: 'website' | 'article' | 'video.movie';
  image: string;
  imageAlt: string;
  jsonLd: object[];
  body: string; // HTML placed inside #root
  robots?: string;
}

export function setMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const re = new RegExp(`<meta ${attr}="${key.replace(/[:.]/g, '\\$&')}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  // a replacer function keeps "$" in titles and descriptions literal
  return re.test(html) ? html.replace(re, () => tag) : html.replace('</head>', () => `    ${tag}\n  </head>`);
}

/** Fills the built index.html (the React shell) with one page's head tags, JSON-LD and readable content. */
export function renderPage(template: string, spec: PageSpec): string {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(spec.title)}</title>`);
  html = setMeta(html, 'name', 'description', spec.description);
  html = setMeta(html, 'property', 'og:title', spec.title);
  html = setMeta(html, 'property', 'og:description', spec.description);
  html = setMeta(html, 'property', 'og:url', spec.url);
  html = setMeta(html, 'property', 'og:type', spec.ogType);
  html = setMeta(html, 'property', 'og:image', spec.image);
  html = setMeta(html, 'property', 'og:image:alt', spec.imageAlt);
  html = setMeta(html, 'name', 'twitter:title', spec.title);
  html = setMeta(html, 'name', 'twitter:description', spec.description);
  html = setMeta(html, 'name', 'twitter:image', spec.image);
  if (spec.robots) html = setMeta(html, 'name', 'robots', spec.robots);
  html = html.replace(/\s*<link rel="canonical"[^>]*>/, '');
  if (!spec.robots?.includes('noindex')) {
    html = html.replace('</head>', () => `    <link rel="canonical" href="${spec.url}" />\n  </head>`);
  }
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': spec.jsonLd }).replace(/</g, '\\u003c');
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">${ld}</script>`);
  const rootAttrs = spec.robots?.includes('noindex') && spec.url.endsWith('/404') ? ' data-page="404" class="max-w-3xl mx-auto p-6 space-y-4 text-zinc-800"' : '';
  html = html.replace('<div id="root"></div>', () => `<div id="root"${rootAttrs}>${spec.body}</div>`);
  return html;
}
