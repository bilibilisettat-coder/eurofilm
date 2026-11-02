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
import { BLOG_POSTS, LEGACY_BLOG_SLUGS, type BlogPost } from '../src/data/blogData';
import { OSCAR_WINNING_MOVIES } from '../src/data/oscarsData';
import { loadBuildData, loadMovies, type ListItem, type Headline } from './buildData';
import { esc, renderPage, type PageSpec } from '../src/seo/pageShell';
import { buildMoviePage, moviePath, movieSlug, type MovieData } from '../src/seo/movieSeo';
import { REVIEW_MOVIES, reviewSlugForMovie } from '../src/data/reviewMovies';
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
const DATA = await loadBuildData();
console.log(
  `prerender data: ${Object.entries(DATA.lists).map(([k, v]) => `${k}=${v.length}`).join(' ') || 'no lists'}, news=${DATA.news.length}`,
);

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

// ---------- movie pages: data for every movie in the current lists and every reviewed film ----------
const MOVIE_TABS = new Set(['popular', 'now_playing', 'upcoming', 'top_rated', 'indian_movies']);
const popularIds = new Set((DATA.lists.popular || []).map((it) => it.id));
const movieIds = new Set<number>([...MOVIE_TABS].flatMap((t) => (DATA.lists[t] || []).map((it) => it.id)));
for (const id of Object.values(REVIEW_MOVIES)) movieIds.add(id);
const MOVIES: Map<number, MovieData> = await loadMovies([...movieIds]);
// A movie page is indexable when it has a EuroFilm review or is in the current popular list; every other movie page is noindex,follow.
const isIndexable = (id: number) => popularIds.has(id) || reviewSlugForMovie(id) !== null;
const movieHref = (it: { id: number; title: string }) => (MOVIES.has(it.id) ? moviePath(MOVIES.get(it.id)!.title, it.id) : null);

// ---------- shared static chrome (only visible until React mounts) ----------
const nav = `<nav aria-label="Main"><a href="/"><strong>${SITE_NAME}</strong></a> ${SECTION_ROUTES.filter((s) => s.path !== '/')
  .map((s) => `<a href="${s.path}">${esc(s.label)}</a>`)
  .join(' ')}</nav>`;
const latestReviews = `<section><h2>Latest movie reviews</h2><ul>${BLOG_POSTS.map(
  (p) => `<li><a href="${blogPath(p.slug)}">${esc(p.title)}</a></li>`,
).join('')}</ul></section>`;
const footer = `<footer><p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. Contact: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p><p>Movie and TV data and images from <a href="https://www.themoviedb.org/" rel="noopener">TMDB</a>. This product uses the TMDB API but is not endorsed or certified by TMDB. Anime data from <a href="https://jikan.moe/" rel="noopener">Jikan</a> (MyAnimeList).</p></footer>`;
const shell = (main: string) => `${nav}<main>${main}</main>${footer}`;

// ---------- section data blocks ----------
function itemsHtml(items: ListItem[], linkBase: string | null, heading: string): string {
  if (!items.length) return '';
  return `<section><h2>${esc(heading)}</h2><ol>${items
    .map((it) => {
      const name = `${esc(it.title)}${it.year ? ` (${esc(it.year)})` : ''}`;
      const href = it.url ?? (linkBase !== null ? movieHref(it) : null);
      const titleHtml = href ? `<a href="${esc(href)}">${name}</a>` : name;
      const meta = it.rating !== null ? `<p>Rating: ${it.rating.toFixed(1)}/10</p>` : '';
      const img = it.image
        ? `<img src="${esc(it.image)}" alt="${esc(it.title)} poster" width="185" height="278" loading="lazy" decoding="async">`
        : '';
      return `<li>${img}<h3>${titleHtml}</h3>${meta}<p>${esc(it.overview)}</p></li>`;
    })
    .join('')}</ol></section>`;
}

function newsHtml(news: Headline[]): string {
  if (!news.length) return '';
  return `<section><h2>Latest headlines</h2><ul>${news
    .map(
      (h) =>
        `<li><a href="${esc(h.link)}" rel="noopener">${esc(h.title)}</a> <small>${esc(h.source)} · <time datetime="${h.date}">${h.date.slice(0, 10)}</time> · ${esc(h.category)}</small></li>`,
    )
    .join('')}</ul></section>`;
}

function oscarsHtml(): string {
  return `<section><h2>Best Picture winners</h2><ol>${OSCAR_WINNING_MOVIES.map(
    (m) =>
      `<li><h3>${esc(m.title)} (${m.year})</h3><p>${esc(m.ceremony)} · Directed by ${esc(m.director)}</p><p>Won: ${esc(m.awardsWon.join(', '))}</p><p>${esc(m.overview)}</p></li>`,
  ).join('')}</ol></section>`;
}

function sectionData(s: SectionRoute): { html: string; items: { name: string; url?: string }[] } {
  const base = s.path;
  switch (s.tab) {
    case 'oscars':
      return { html: oscarsHtml(), items: OSCAR_WINNING_MOVIES.map((m) => ({ name: m.title })) };
    case 'top_news':
      return { html: newsHtml(DATA.news), items: [] };
    case 'eurofilm-blog':
      return { html: '', items: [] };
    default: {
      const list = DATA.lists[s.tab] || [];
      const isAnime = s.tab === 'anime';
      const heading = isAnime ? 'Top rated anime right now' : s.tab === 'tv_shows' ? 'Popular TV shows this week' : `${s.label} this week`;
      return {
        html: itemsHtml(list, isAnime || s.tab === 'tv_shows' ? null : base, heading),
        items: list.map((it) => ({
          name: it.title,
          url: it.url ?? (isAnime || s.tab === 'tv_shows' ? undefined : movieHref(it) ? `${SITE_URL}${movieHref(it)}` : undefined),
        })),
      };
    }
  }
}

// ---------- section pages ----------
function sectionPage(s: SectionRoute): PageSpec {
  const data = sectionData(s);
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
  if (data.items.length) {
    jsonLd.push({
      '@type': 'ItemList',
      '@id': `${url}#list`,
      name: s.h1,
      numberOfItems: data.items.length,
      itemListElement: data.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        ...(it.url ? { url: it.url } : {}),
      })),
    });
  }
  return {
    url,
    title: s.title,
    description: s.description,
    ogType: 'website',
    image: DEFAULT_OG_IMAGE,
    imageAlt: `${SITE_NAME} – ${s.h1}`,
    jsonLd,
    body: shell(
      `<h1>${esc(s.h1)}</h1><p>${esc(s.intro)}</p>${data.html}${blogList}<section><h2>Explore EuroFilm</h2><ul>${others}</ul></section>`,
    ),
  };
}

// ---------- blog posts ----------
const factsHtml = (p: BlogPost) =>
  p.facts?.length
    ? `<section><h2>Quick facts</h2><dl>${p.facts.map((f) => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd>`).join('')}</dl></section>`
    : '';
const sourcesHtml = (p: BlogPost) =>
  p.sources?.length
    ? `<section><h2>Sources</h2><ul>${p.sources
        .map((src) => `<li><a href="${esc(src.url)}" rel="noopener">${esc(src.title)}</a></li>`)
        .join('')}</ul></section>`
    : '';

function blogPage(p: BlogPost): PageSpec {
  const url = `${SITE_URL}${blogPath(p.slug)}`;
  const published = isoDate(p.date);
  const related = BLOG_POSTS.filter((o) => o.slug !== p.slug)
    .slice(0, 6)
    .map((o) => `<li><a href="${blogPath(o.slug)}">${esc(o.title)}</a></li>`)
    .join('');
  const words = stripTags(p.content.join(' ')).split(/\s+/).filter(Boolean).length;
  const movie = REVIEW_MOVIES[p.slug] ? MOVIES.get(REVIEW_MOVIES[p.slug]) : undefined;
  const movieLink = movie ? `<p>Movie page with the official trailer: <a href="${moviePath(movie.title, movie.id)}">${esc(movie.title)}</a></p>` : '';
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
        author: { '@type': 'Organization', name: p.author, url: `${SITE_URL}/blog` },
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
      )}" width="800" height="450" loading="eager">${factsHtml(p)}${p.content
        .map((block) => (block.startsWith('## ') ? `<h2>${esc(block.slice(3))}</h2>` : `<p>${block}</p>`))
        .join('')}${sourcesHtml(p)}${movieLink}</article><section><h2>More reviews</h2><ul>${related}</ul></section>`,
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
  write(s.path === '/' ? 'index.html' : `${s.path.slice(1)}.html`, renderPage(template, spec));
  sitemapEntries.push({ loc: spec.url, lastmod: BUILD_DATE, priority: s.path === '/' ? '1.0' : '0.8' });
}
for (const p of BLOG_POSTS) {
  const spec = blogPage(p);
  write(`blog/${p.slug}.html`, renderPage(template, spec));
  sitemapEntries.push({ loc: spec.url, lastmod: isoDate(p.date), priority: '0.7' });
}

write(
  '404.html',
  renderPage(template, {
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

const movieMap: Record<string, string> = {};
let indexableMovies = 0;
for (const [id, movie] of MOVIES) {
  const reviewSlug = reviewSlugForMovie(id);
  const review = reviewSlug ? BLOG_POSTS.find((b) => b.slug === reviewSlug) : undefined;
  const indexable = isIndexable(id);
  const spec = buildMoviePage(movie, { indexable, review: review ? { slug: review.slug, title: review.title } : null, shell });
  write(`movie/${movieSlug(movie.title, id)}.html`, renderPage(template, spec));
  movieMap[String(id)] = movieSlug(movie.title, id);
  if (indexable) {
    indexableMovies++;
    sitemapEntries.push({ loc: spec.url, lastmod: BUILD_DATE, priority: '0.6' });
  }
}
// The Worker (src/worker.ts) uses these: id -> slug for 301s from ?watch=<id>, and the shell for movies that were not prerendered.
write('_movies.json', JSON.stringify(movieMap));
write('_shell.html', template);

write('news.json', JSON.stringify(DATA.news));

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
  [
    ...Object.entries(LEGACY_BLOG_SLUGS).map(([oldSlug, newSlug]) => `${blogPath(oldSlug)} ${blogPath(newSlug)} 301`),
    '/free-movie-stream / 301', '/free-movie-stream/ / 301', '/films / 301', '/films/ / 301', '/llm.txt /llms.txt 301', ''].join('\n'),
);

console.log(`prerender: ${SECTION_ROUTES.length} sections, ${BLOG_POSTS.length} articles, ${MOVIES.size} movie pages (${indexableMovies} indexable, ${MOVIES.size - indexableMovies} noindex), 404, sitemap (${sitemapEntries.length} URLs)`);
