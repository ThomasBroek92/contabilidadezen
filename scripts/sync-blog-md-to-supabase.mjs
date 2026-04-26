/**
 * sync-blog-md-to-supabase.mjs
 *
 * Roda no GitHub Actions ANTES do build.
 * Lê todos os arquivos src/content/blog/*.md, parseia o YAML frontmatter
 * e faz UPSERT na tabela blog_posts do Supabase (slug é a chave lógica).
 *
 * É idempotente — pode rodar a cada deploy sem duplicar.
 *
 * Env necessárias:
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_PUBLISHABLE_KEY  (anon key — RLS está desabilitado em blog_posts)
 *   - SUPABASE_SERVICE_ROLE_KEY     (opcional, fallback)
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const yamlStr = match[1];
  const content = match[2].trim();
  const data = {};
  let currentKey = null;
  let inArray = false;
  for (const line of yamlStr.split(/\r?\n/)) {
    const arrItem = line.match(/^\s+- (.+)$/);
    if (arrItem && inArray && currentKey) {
      data[currentKey].push(arrItem[1].trim());
      continue;
    }
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (!kv) continue;
    inArray = false;
    currentKey = kv[1];
    const val = kv[2].trim().replace(/^["']|["']$/g, '');
    if (val === '') { data[currentKey] = []; inArray = true; continue; }
    if (val === 'true') { data[currentKey] = true; continue; }
    if (val === 'false') { data[currentKey] = false; continue; }
    if (/^\d+$/.test(val)) { data[currentKey] = parseInt(val, 10); continue; }
    data[currentKey] = val;
  }
  return { data, content };
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BLOG_DIR = resolve(__dirname, '..', 'src', 'content', 'blog');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️  Supabase credentials not set — skipping blog MD sync');
  console.warn('    Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in GitHub Secrets.');
  process.exit(0);
}

function parseReadingTime(value) {
  if (!value) return 5;
  if (typeof value === 'number') return value;
  const match = String(value).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
}

function extractExcerpt(content, maxLen = 280) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('---')) continue;
    const cleaned = trimmed
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    if (cleaned.length < 40) continue;
    return cleaned.length > maxLen ? cleaned.slice(0, maxLen - 1) + '…' : cleaned;
  }
  return null;
}

function frontmatterToRow(fm, body) {
  if (!fm.slug) {
    throw new Error(`Missing slug in frontmatter for "${fm.title || 'unknown'}"`);
  }

  const publishedAt = fm.date
    ? new Date(fm.date).toISOString()
    : new Date().toISOString();

  return {
    title: fm.title,
    slug: fm.slug,
    content: body,
    excerpt: fm.excerpt || extractExcerpt(body),
    category: fm.category || 'geral',
    status: 'published',
    published_at: publishedAt,
    meta_title: fm.meta_title || fm.title,
    meta_description: fm.meta_description || null,
    meta_keywords: Array.isArray(fm.keywords) ? fm.keywords : null,
    read_time_minutes: parseReadingTime(fm.reading_time),
    freshness_date: fm.freshness_date || fm.date || null,
    etapa_funil: fm.etapa_funil || null,
    persona_alvo: fm.persona_alvo || null,
    is_pillar: fm.is_pillar === true,
    author_name: fm.author || null,
    cluster_id: fm.cluster_id || null,
    auto_published: true,
    editorial_status: 'published',
  };
}

async function upsertPost(row) {
  const url = `${SUPABASE_URL}/rest/v1/blog_posts?on_conflict=slug`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UPSERT failed for ${row.slug}: ${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  let files;
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  } catch (err) {
    console.error(`❌ Could not read ${BLOG_DIR}:`, err.message);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('ℹ️  No .md files in src/content/blog — nothing to sync');
    return;
  }

  console.log(`📚 Found ${files.length} blog markdown files`);

  let synced = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = join(BLOG_DIR, file);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const { data: fm, content: body } = parseFrontmatter(raw);
      const row = frontmatterToRow(fm, body);
      await upsertPost(row);
      console.log(`✅ ${row.slug}`);
      synced++;
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🎉 Sync complete: ${synced} synced, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('💥 Sync failed:', err);
  process.exit(1);
});
