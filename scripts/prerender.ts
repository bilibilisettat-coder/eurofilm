/**
 * Post-build step (runs after `vite build`):
 *  1. Writes a real HTML file for every indexable URL, with its own <title>, description,
 *     canonical, Open Graph, JSON-LD and readable content inside #root.
 *     React's createRoot replaces that content once the app loads, so users see the app
 *     and crawlers see real pages without needing to run JavaScript.
 *  2. Generates sitemap.xml + sitemap_index.xml from the same route list.
 *  3. Writes 404.html (served with a real 404 status by Cloudflare) and _redirects.
 *
 * Files are written as /anime.html, /blog/<slug>.html etc. Cloudflare's default
 * "auto-trailing-slash" serves them at /anime and /blog/<slug> with no redirect.
 */
import fs from 'node:fs';
import path from 'node:path';
import { BLOG_POSTS, type BlogPost } from '../src/data/blogData';
import {
  CONTACT_EMAIL,
  DEFAULT_OG_IMAGE,
  SECTION_ROUTES,
  SITE_NAME,
  SITE_URL,
  blogPath,
  blogSeoTitle,
  type SectionRoute,
} from '../src/data/routes';

const DIST = path.resolve('dist');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s: string) => s.replace(/<[^>]+>/g, '');

function isoDate(human: string): string {
  const d = new Date(human);
  return Number.isNaN(d.getTime()) ? BUILD_DATE : d.toISOString().slice(0, 10);
}

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
  email: CONTACT_EMAIL,
};
const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

interface PageSpec {
  url: string; // absolute canonical URL
  title: string;
  description: string;
  ogType: 'website' | 'article';
  image: string;
  imageAlt: string;
  jsonLd: object[];
  body: string; // HTML placed inside #root
  robots?: string;
}

function setMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const re = new RegExp(`<meta ${attr}="${key.replace(/[:.]/g, '\\$&')}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function renderPage(spec: PageSpec): string {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(spec.title)}</title>`);
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
    html = html.replace('</head>', `    <link rel="canonical" href="${spec.url}" />\n  </head>`);
  }
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': spec.jsonLd }).replace(/</g, '\\u003c');
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${ld}</script>`,
  );
  const rootAttrs = spec.robots?.includes('noindex') ? ' data-page="404" class="max-w-3xl mx-auto p-6 space-y-4 text-zinc-800"' : '';
  html = html.replace('<div id="root"></div>', `<div id="root"${rootAttrs}>${spec.body}</div>`);
  return html;
}

// ---------- shared static chrome (only visible until React mounts) ----------
const nav = `<nav aria-label="Main"><a href="/"><strong>${SITE_NAME}</strong></a> ${SECTION_ROUTES.filter((s) => s.path !== '/')
  .map((s) => `<a href="${s.path}">${esc(s.label)}</a>`)
  .join(' ')}</nav>`;
const latestReviews = `<section><h2>Latest movie reviews</h2><ul>${BLOG_POSTS.map(
  (p) => `<li><a href="${blogPath(p.slug)}">${esc(p.title)}</a></li>`,
).join('')}</ul></section>`;
const footer = `<footer><p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. Contact: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p></footer>`;
const shell = (main: string) => `${nav}<main>${main}</main>${footer}`;

// ---------- section pages ----------
function sectionPage(s: SectionRoute): PageSpec {
  const url = s.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${s.path}`;
  const others = SECTION_ROUTES.filter((o) => o.path !== s.path)
    .map((o) => `<li><a href="${o.path}">${esc(o.h1)}</a></li>`)
    .join('');
  const blogList =
    s.tab === 'eurofilm-blog'
      ? `<section><h2>All reviews</h2>${BLOG_POSTS.map(
          (p) =>
            `<article><h3><a href="${blogPath(p.slug)}">${esc(p.title)}</a></h3><p>${esc(p.excerpt)}</p></article>`,
        ).join('')}</section>`
      : latestReviews;
  const jsonLd: object[] =
    s.path === '/'
      ? [WEBSITE, ORGANIZATION]
      : [
          WEBSITE,
          ORGANIZATION,
          {
            '@type': 'CollectionPage',
            '@id': `${url}#page`,
            url,
            name: s.h1,
            description: s.description,
            isPartOf: { '@id': `${SITE_URL}/#website` },
          },
          breadcrumbs([
            { name: SITE_NAME, url: `${SITE_URL}/` },
            { name: s.label, url },
          ]),
        ];
  return {
    url,
    title: s.title,
    description: s.description,
    ogType: 'website',
    image: DEFAULT_OG_IMAGE,
    imageAlt: `${SITE_NAME} – ${s.h1}`,
    jsonLd,
    body: shell(
      `<h1>${esc(s.h1)}</h1><p>${esc(s.intro)}</p>${blogList}<section><h2>Explore EuroFilm</h2><ul>${others}</ul></section>`,
    ),
  };
}

// ---------- blog posts ----------
function blogPage(p: BlogPost): PageSpec {
  const url = `${SITE_URL}${blogPath(p.slug)}`;
  const published = isoDate(p.date);
  const related = BLOG_POSTS.filter((o) => o.slug !== p.slug)
    .slice(0, 6)
    .map((o) => `<li><a href="${blogPath(o.slug)}">${esc(o.title)}</a></li>`)
    .join('');
  const words = stripTags(p.content.join(' ')).split(/\s+/).filter(Boolean).length;
  return {
    url,
    title: blogSeoTitle(p.title),
    description: p.excerpt,
    ogType: 'article',
    image: p.coverImage,
    imageAlt: p.title,
    jsonLd: [
      WEBSITE,
      ORGANIZATION,
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: url,
        headline: p.title.slice(0, 110),
        alternativeHeadline: p.subtitle,
        description: p.excerpt,
        image: [p.coverImage],
        datePublished: published,
        dateModified: published,
        author: { '@type': 'Person', name: p.author },
        publisher: { '@id': `${SITE_URL}/#organization` },
        wordCount: words,
        keywords: p.tags.join(', '),
        articleSection: 'Movie Reviews',
        inLanguage: 'en',
      },
      breadcrumbs([
        { name: SITE_NAME, url: `${SITE_URL}/` },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: p.title, url },
      ]),
    ],
    body: shell(
      `<article><h1>${esc(p.title)}</h1><p><em>${esc(p.subtitle)}</em></p><p>By ${esc(p.author)} · <time datetime="${published}">${esc(
        p.date,
      )}</time> · ${esc(p.readTime)}</p><img src="${esc(p.coverImage)}" alt="${esc(
        p.title,
      )}" width="800" height="450" loading="eager">${p.content.map((para) => `<p>${para}</p>`).join('')}</article><section><h2>More reviews</h2><ul>${related}</ul></section>`,
    ),
  };
}

// ---------- write everything ----------
function write(relFile: string, contents: string) {
  const file = path.join(DIST, relFile);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

const sitemapEntries: { loc: string; lastmod: string; priority: string }[] = [];

for (const s of SECTION_ROUTES) {
  const spec = sectionPage(s);
  write(s.path === '/' ? 'index.html' : `${s.path.slice(1)}.html`, renderPage(spec));
  sitemapEntries.push({ loc: spec.url, lastmod: BUILD_DATE, priority: s.path === '/' ? '1.0' : '0.8' });
}
for (const p of BLOG_POSTS) {
  const spec = blogPage(p);
  write(`blog/${p.slug}.html`, renderPage(spec));
  sitemapEntries.push({ loc: spec.url, lastmod: isoDate(p.date), priority: '0.7' });
}

write(
  '404.html',
  renderPage({
    url: `${SITE_URL}/404`,
    title: `Page not found | ${SITE_NAME}`,
    description: 'This page does not exist. Browse movie trailers and reviews on EuroFilm instead.',
    ogType: 'website',
    image: DEFAULT_OG_IMAGE,
    imageAlt: SITE_NAME,
    jsonLd: [WEBSITE, ORGANIZATION],
    robots: 'noindex, follow',
    body: shell(`<h1>Page not found</h1><p>The page you were looking for does not exist or has moved.</p><p><a href="/">Go to the EuroFilm home page</a></p>${latestReviews}`),
  }),
);

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries
    .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`,
);
write(
  'sitemap_index.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${SITE_URL}/sitemap.xml</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </sitemap>\n</sitemapindex>\n`,
);

// Permanent redirects for retired duplicate URLs. Query strings are kept by Cloudflare,
// and the app upgrades legacy ?blog= / ?tab= links to their clean paths.
write(
  '_redirects',
  ['/free-movie-stream / 301', '/free-movie-stream/ / 301', '/films / 301', '/films/ / 301', '/llm.txt /llms.txt 301', ''].join('\n'),
);

console.log(`prerender: ${SECTION_ROUTES.length} sections, ${BLOG_POSTS.length} articles, 404, sitemap (${sitemapEntries.length} URLs)`);
