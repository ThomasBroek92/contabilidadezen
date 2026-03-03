import { execSync } from 'child_process';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, '..', 'dist');
const PORT = 4173;

// Supabase config from env (available in GitHub Actions via secrets)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// All public routes to pre-render (static)
const STATIC_ROUTES = [
  '/',
  '/medicos',
  '/servicos',
  '/sobre',
  '/blog',
  '/contato',
  '/segmentos/contabilidade-para-medicos',
  '/segmentos/contabilidade-para-dentistas',
  '/segmentos/contabilidade-para-psicologos',
  '/segmentos/contabilidade-para-representantes-comerciais',
  '/segmentos/contabilidade-para-produtores-digitais',
  '/segmentos/contabilidade-para-profissionais-de-ti',
  '/segmentos/contabilidade-para-exportacao-de-servicos',
  '/segmentos/contabilidade-para-prestadores-de-servico',
  '/segmentos/contabilidade-para-profissionais-pj',
  '/conteudo/calculadora-pj-clt',
  '/conteudo/gerador-rpa',
  '/conteudo/gerador-invoice',
  '/conteudo/comparativo-tributario',
  '/conteudo/tabela-simples-nacional',
  '/conteudo/modelo-contrato-pj',
  '/abrir-empresa',
  '/cidades-atendidas',
  '/contabilidade-em-campinas',
  '/indique-e-ganhe',
  '/politica-de-privacidade',
  '/termos',
];

/**
 * Fetch published blog post slugs from Supabase REST API.
 */
async function fetchBlogSlugs() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️  SUPABASE env vars not set — skipping dynamic blog routes');
    return [];
  }

  const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=slug&status=eq.published`;
  try {
    console.log('📡 Fetching published blog slugs from database...');
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      console.error(`❌ Failed to fetch blog slugs: ${res.status} ${res.statusText}`);
      return [];
    }

    const posts = await res.json();
    const slugs = posts.map((p) => `/blog/${p.slug}`);
    console.log(`✅ Found ${slugs.length} published blog posts`);
    return slugs;
  } catch (error) {
    console.error('❌ Error fetching blog slugs:', error.message);
    return [];
  }
}

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/**
 * Start a simple static file server for the dist directory.
 * Falls back to index.html for SPA routing.
 */
function startServer() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

      // If path has no extension, serve index.html (SPA fallback)
      if (!extname(filePath)) {
        filePath = join(DIST_DIR, 'index.html');
      }

      // If file doesn't exist, serve index.html
      if (!existsSync(filePath)) {
        filePath = join(DIST_DIR, 'index.html');
      }

      try {
        const content = readFileSync(filePath);
        const ext = extname(filePath);
        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, () => {
      console.log(`📦 Static server running at http://localhost:${PORT}`);
      resolvePromise(server);
    });
  });
}

/**
 * Pre-render a single route using Puppeteer.
 */
async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `http://localhost:${PORT}${route}`;

  try {
    console.log(`🔄 Pre-rendering: ${route}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for React to render content inside #root
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return root && root.children.length > 0 && root.innerHTML.length > 100;
      },
      { timeout: 15000 }
    );

    // Small extra delay for async data to load
    await new Promise((r) => setTimeout(r, 2000));

    const html = await page.content();

    // Determine output path
    const outputDir = route === '/'
      ? DIST_DIR
      : join(DIST_DIR, ...route.split('/').filter(Boolean));

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(join(outputDir, 'index.html'), html, 'utf-8');

    console.log(`✅ Saved: ${route} → ${join(outputDir, 'index.html')}`);
  } catch (error) {
    console.error(`❌ Failed: ${route} — ${error.message}`);
  } finally {
    await page.close();
  }
}

/**
 * Main execution
 */
async function main() {
  // Build full route list: static + dynamic blog posts
  const blogRoutes = await fetchBlogSlugs();
  const ROUTES = [...STATIC_ROUTES, ...blogRoutes];

  console.log('🚀 Starting pre-rendering process...');
  console.log(`📁 dist directory: ${DIST_DIR}`);
  console.log(`📄 Routes to pre-render: ${ROUTES.length} (${STATIC_ROUTES.length} static + ${blogRoutes.length} blog posts)\n`);

  // Verify dist exists
  if (!existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Start local server
  const server = await startServer();

  // Import puppeteer dynamically
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    // Pre-render each route sequentially to avoid overwhelming the server
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }

    console.log(`\n🎉 Pre-rendering complete! ${ROUTES.length} routes processed.`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error('💥 Pre-rendering failed:', error);
  process.exit(1);
});
