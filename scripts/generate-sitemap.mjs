/**
 * Dynamic sitemap generator.
 * Runs after `vite build`, before `prerender`.
 * Outputs public/sitemap.xml with: static routes + 88 city pages + all published blog posts.
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { STATIC_ROUTES, SITEMAP_EXCLUDE, routePriority } from './routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://www.contabilidadezen.com.br';
const ROOT = resolve(__dirname, '..');
// After `vite build`, write to dist/ so the deployed file is up-to-date.
// Also always update public/ so local dev stays in sync.
const DIST_PATH   = resolve(ROOT, 'dist', 'sitemap.xml');
const PUBLIC_PATH = resolve(ROOT, 'public', 'sitemap.xml');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const today = new Date().toISOString().split('T')[0];

async function fetchPublishedPosts() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️  SUPABASE env vars not set — sitemap will not include blog posts');
    return [];
  }

  const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at,published_at&status=eq.published&order=published_at.desc`;
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      console.error(`❌ Failed to fetch blog posts: ${res.status} ${res.statusText}`);
      return [];
    }

    const posts = await res.json();
    console.log(`✅ Found ${posts.length} published blog posts for sitemap`);
    return posts;
  } catch (err) {
    console.error('❌ Error fetching blog posts:', err.message);
    return [];
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, lastmod, priority, changefreq) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  console.log('🗺️  Generating sitemap.xml...');

  const posts = await fetchPublishedPosts();
  const entries = [];

  // Static routes (excluding redirects and private pages)
  for (const route of STATIC_ROUTES) {
    if (SITEMAP_EXCLUDE.has(route)) continue;
    const { priority, changefreq } = routePriority(route);
    const loc = `${SITE_URL}${route}`;
    entries.push(urlEntry(loc, today, priority, changefreq));
  }

  // Blog post routes from Supabase
  for (const post of posts) {
    const lastmod = post.updated_at
      ? post.updated_at.split('T')[0]
      : (post.published_at ? post.published_at.split('T')[0] : today);
    const loc = `${SITE_URL}/blog/${post.slug}`;
    const { priority, changefreq } = routePriority('/blog/' + post.slug);
    entries.push(urlEntry(loc, lastmod, priority, changefreq));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  // Always update public/sitemap.xml (used by local dev + committed baseline)
  writeFileSync(PUBLIC_PATH, xml, 'utf-8');
  console.log(`✅ public/sitemap.xml written: ${entries.length} URLs`);

  // If dist/ exists (post-build), also update dist/sitemap.xml for deployment
  const { existsSync, mkdirSync } = await import('fs');
  const distDir = resolve(ROOT, 'dist');
  if (existsSync(distDir)) {
    writeFileSync(DIST_PATH, xml, 'utf-8');
    console.log(`✅ dist/sitemap.xml written: ${entries.length} URLs`);
  }

  console.log(`   Static: ${STATIC_ROUTES.length - SITEMAP_EXCLUDE.size} | Blog posts: ${posts.length}`);
}

generate().catch((err) => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});
