/**
 * inject-blog-links.mjs
 * 
 * Runs in CI/CD after build. Fetches all published blog post slugs from
 * Supabase and injects them as static <a> links into dist/index.html
 * (both the <noscript> block and the #root fallback).
 * 
 * This ensures crawlers that don't execute JS can still discover every
 * blog post via internal links — a key Google indexing requirement.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const INDEX_PATH = resolve(__dirname, '..', 'dist', 'index.html');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function fetchAllBlogPosts() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️  SUPABASE env vars not set — skipping blog link injection');
    return [];
  }

  const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title&status=eq.published&order=published_at.desc`;
  try {
    console.log('📡 Fetching published blog posts...');
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      console.error(`❌ Failed to fetch blog posts: ${res.status}`);
      return [];
    }

    const posts = await res.json();
    console.log(`✅ Found ${posts.length} published blog posts`);
    return posts;
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error.message);
    return [];
  }
}

function generateBlogLinksHtml(posts) {
  return posts
    .map((p) => `          <li><a href="/blog/${p.slug}">${p.title}</a></li>`)
    .join('\n');
}

function injectLinks(html, posts) {
  if (posts.length === 0) return html;

  const linksHtml = generateBlogLinksHtml(posts);

  // 1. Replace the static blog links in the <noscript> block
  //    Match the section between "Artigos Recentes do Blog" heading and the next </ul>
  const noscriptPattern = /(<h2>Artigos Recentes do Blog<\/h2>\s*<ul>)([\s\S]*?)(<\/ul>)/;
  if (noscriptPattern.test(html)) {
    html = html.replace(noscriptPattern, `$1\n${linksHtml}\n        $3`);
    console.log(`✅ Injected ${posts.length} links into <noscript> block`);
  } else {
    console.warn('⚠️  Could not find noscript blog section marker');
  }

  // 2. Replace the blog links in the #root fallback
  //    The #root fallback has a "Conteúdo" section; add blog posts after it
  //    Look for the existing "Blog Contábil" link and add a full list after it
  const rootBlogMarker = /<li><a href="\/blog">Blog Contábil<\/a>[^<]*<\/li>/;
  if (rootBlogMarker.test(html)) {
    const blogListSection = `<li><a href="/blog">Blog Contábil</a> – Artigos sobre contabilidade, impostos e gestão empresarial</li>
        </ul>
        <h2>Todos os Artigos do Blog</h2>
        <ul>
${linksHtml}
        </ul>
        <ul style="display:none"><!-- keep existing structure -->`;
    
    // Replace the blog link + closing ul + reopen
    html = html.replace(
      /(<li><a href="\/blog">Blog Contábil<\/a>[^<]*<\/li>\s*<li><a href="\/sobre">)/,
      `${blogListSection}\n          <li><a href="/sobre">`
    );
    console.log(`✅ Injected ${posts.length} links into #root fallback`);
  } else {
    console.warn('⚠️  Could not find #root blog marker');
  }

  return html;
}

async function main() {
  const posts = await fetchAllBlogPosts();
  
  if (posts.length === 0) {
    console.log('ℹ️  No posts to inject, keeping index.html as-is');
    return;
  }

  let html;
  try {
    html = readFileSync(INDEX_PATH, 'utf-8');
  } catch {
    console.error('❌ dist/index.html not found. Run "npm run build" first.');
    process.exit(1);
  }

  const updatedHtml = injectLinks(html, posts);
  writeFileSync(INDEX_PATH, updatedHtml, 'utf-8');
  console.log(`🎉 Blog link injection complete! ${posts.length} posts injected.`);
}

main().catch((error) => {
  console.error('💥 Blog link injection failed:', error);
  process.exit(1);
});
