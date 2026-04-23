/**
 * Shared route list used by prerender.mjs and generate-sitemap.mjs.
 * City pages (88 total) + core static routes.
 */
export const STATIC_ROUTES = [
  // Core pages
  '/',
  '/sobre',
  '/blog',
  '/contato',
  '/abrir-empresa',
  '/cidades-atendidas',
  '/indique-e-ganhe',
  '/politica-de-privacidade',
  '/termos',
  '/materiais',
  '/sede-virtual-gratuita',
  '/autor/thomas-broek',

  // Segment pages
  '/segmentos/contabilidade-para-medicos',
  '/segmentos/contabilidade-para-dentistas',
  '/segmentos/contabilidade-para-psicologos',
  '/segmentos/contabilidade-para-representantes-comerciais',
  '/segmentos/contabilidade-para-produtores-digitais',
  '/segmentos/contabilidade-para-profissionais-de-ti',
  '/segmentos/contabilidade-para-exportacao-de-servicos',
  '/segmentos/contabilidade-para-prestadores-de-servico',
  '/segmentos/contabilidade-para-profissionais-pj',
  '/segmentos/contabilidade-para-ecommerce',
  '/segmentos/contabilidade-para-clinicas-e-consultorios',
  '/segmentos/contabilidade-para-youtubers-e-creators',
  '/segmentos/contabilidade-para-outros-segmentos',

  // Tools / conteudo
  '/conteudo/calculadora-pj-clt',
  '/conteudo/gerador-rpa',
  '/conteudo/gerador-invoice',
  '/conteudo/comparativo-tributario',
  '/conteudo/tabela-simples-nacional',
  '/conteudo/modelo-contrato-pj',

  // Guides
  '/guia-contabilidade-medicos',
  '/guia-contabilidade-psicologos',

  // Redirect alias kept for prerender (redirects to segmentos/contabilidade-para-medicos)
  '/medicos',

  // City landing pages (88 total)

  // Campinas metropolitan region
  '/contabilidade-em-campinas',
  '/contabilidade-em-americana',
  '/contabilidade-em-indaiatuba',
  '/contabilidade-em-sumare',
  '/contabilidade-em-hortolandia',
  '/contabilidade-em-valinhos',
  '/contabilidade-em-vinhedo',
  '/contabilidade-em-santa-barbara-doeste',
  '/contabilidade-em-paulinia',
  '/contabilidade-em-jaguariuna',
  '/contabilidade-em-itatiba',
  '/contabilidade-em-pedreira',
  '/contabilidade-em-monte-mor',
  '/contabilidade-em-nova-odessa',
  '/contabilidade-em-artur-nogueira',
  '/contabilidade-em-cosmopolis',
  '/contabilidade-em-engenheiro-coelho',
  '/contabilidade-em-holambra',
  '/contabilidade-em-morungaba',
  '/contabilidade-em-santo-antonio-de-posse',

  // SP capital + interior
  '/contabilidade-em-sao-paulo',
  '/contabilidade-em-guarulhos',
  '/contabilidade-em-santos',
  '/contabilidade-em-sao-jose-dos-campos',
  '/contabilidade-em-sorocaba',
  '/contabilidade-em-ribeirao-preto',
  '/contabilidade-em-sao-bernardo-do-campo',
  '/contabilidade-em-santo-andre',
  '/contabilidade-em-osasco',
  '/contabilidade-em-maua',
  '/contabilidade-em-diadema',
  '/contabilidade-em-barueri',
  '/contabilidade-em-piracicaba',
  '/contabilidade-em-limeira',
  '/contabilidade-em-jundiai',
  '/contabilidade-em-bauru',
  '/contabilidade-em-sao-caetano-do-sul',
  '/contabilidade-em-jacarei',
  '/contabilidade-em-atibaia',
  '/contabilidade-em-cotia',
  '/contabilidade-em-embu-das-artes',
  '/contabilidade-em-marilia',
  '/contabilidade-em-mogi-das-cruzes',
  '/contabilidade-em-sao-carlos',
  '/contabilidade-em-ibitinga',
  '/contabilidade-em-santana-de-parnaiba',
  '/contabilidade-em-taboao-da-serra',
  '/contabilidade-em-sao-jose-do-rio-preto',

  // RJ
  '/contabilidade-em-rio-de-janeiro',
  '/contabilidade-em-duque-de-caxias',
  '/contabilidade-em-niteroi',
  '/contabilidade-em-nova-iguacu',

  // MG
  '/contabilidade-em-belo-horizonte',
  '/contabilidade-em-contagem',
  '/contabilidade-em-uberlandia',

  // ES
  '/contabilidade-em-vitoria',

  // PR
  '/contabilidade-em-curitiba',
  '/contabilidade-em-londrina',
  '/contabilidade-em-maringa',
  '/contabilidade-em-pinhais',

  // SC
  '/contabilidade-em-blumenau',
  '/contabilidade-em-florianopolis',

  // RS
  '/contabilidade-em-porto-alegre',

  // Nordeste
  '/contabilidade-em-salvador',
  '/contabilidade-em-fortaleza',
  '/contabilidade-em-recife',
  '/contabilidade-em-natal',
  '/contabilidade-em-joao-pessoa',
  '/contabilidade-em-maceio',
  '/contabilidade-em-aracaju',
  '/contabilidade-em-sao-luis',
  '/contabilidade-em-teresina',

  // Centro-Oeste
  '/contabilidade-em-brasilia',
  '/contabilidade-em-goiania',
  '/contabilidade-em-campo-grande',
  '/contabilidade-em-cuiaba',

  // Norte
  '/contabilidade-em-manaus',
  '/contabilidade-em-belem',
];

// Routes that should NOT appear in sitemap (redirects, auth, private)
export const SITEMAP_EXCLUDE = new Set([
  '/medicos', // 301 → /segmentos/contabilidade-para-medicos
  '/servicos', // 301 → /
  '/sede-virtual-gratuita', // thin landing, not prioritized for indexing
]);

// Priority config per route pattern
export function routePriority(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (route.startsWith('/segmentos/') || route === '/abrir-empresa' || route === '/blog') {
    return { priority: '0.9', changefreq: 'monthly' };
  }
  if (route.startsWith('/conteudo/') || route.startsWith('/guia-')) {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  if (route.startsWith('/contabilidade-em-')) {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  if (route.startsWith('/blog/')) {
    return { priority: '0.7', changefreq: 'weekly' };
  }
  return { priority: '0.6', changefreq: 'monthly' };
}
