// Generate sitemap.xml at build time from:
// - STATIC_ROUTES (shared with prerender)
// - published blog posts fetched from Supabase (when env vars present)
//
// Output: public/sitemap.xml (overwritten).
// Run via "prebuild" npm script before `vite build`.

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { STATIC_ROUTES, metaForRoute } from './routes.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');
const OUT_PATH = resolve(PUBLIC_DIR, 'sitemap.xml');
const SITE_URL = 'https://www.contabilidadezen.com.br';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const today = new Date().toISOString().slice(0, 10);

async function fetchBlogPosts() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[sitemap] Supabase env vars not set — skipping blog posts.');
    return [];
  }
  const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at,published_at&status=eq.published`;
  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      console.error(`[sitemap] Failed to fetch blog posts: ${res.status}`);
      return [];
    }
    const posts = await res.json();
    console.log(`[sitemap] Found ${posts.length} published blog posts.`);
    return posts;
  } catch (err) {
    console.error('[sitemap] Error fetching blog posts:', err.message);
    return [];
  }
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

async function main() {
  const posts = await fetchBlogPosts();

  const entries = [];

  for (const route of STATIC_ROUTES) {
    const meta = metaForRoute(route);
    const loc = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    entries.push(
      urlEntry({
        loc,
        lastmod: today,
        changefreq: meta.changefreq,
        priority: meta.priority,
      })
    );
  }

  for (const post of posts) {
    const route = `/blog/${post.slug}`;
    const meta = metaForRoute(route);
    const rawDate = post.updated_at || post.published_at;
    const lastmod = rawDate ? new Date(rawDate).toISOString().slice(0, 10) : today;
    entries.push(
      urlEntry({
        loc: `${SITE_URL}${route}`,
        lastmod,
        changefreq: meta.changefreq,
        priority: meta.priority,
      })
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(OUT_PATH, xml, 'utf-8');
  console.log(`[sitemap] Wrote ${entries.length} URLs to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('[sitemap] Fatal error:', err);
  process.exit(1);
});
