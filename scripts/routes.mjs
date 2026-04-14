// Single source of truth for static public routes.
// Consumed by both scripts/prerender.mjs and scripts/generate-sitemap.mjs.

export const STATIC_ROUTES = [
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
  '/segmentos/contabilidade-para-ecommerce',
  '/segmentos/contabilidade-para-clinicas-e-consultorios',
  '/segmentos/contabilidade-para-youtubers-e-creators',
  '/segmentos/contabilidade-para-outros-segmentos',
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
  '/guia-contabilidade-medicos',
  '/guia-contabilidade-psicologos',
  '/politica-de-privacidade',
  '/termos',
  // Dynamic city landing pages
  '/contabilidade-em-americana', '/contabilidade-em-indaiatuba', '/contabilidade-em-sumare',
  '/contabilidade-em-hortolandia', '/contabilidade-em-valinhos', '/contabilidade-em-vinhedo',
  '/contabilidade-em-santa-barbara-doeste', '/contabilidade-em-paulinia', '/contabilidade-em-jaguariuna',
  '/contabilidade-em-itatiba', '/contabilidade-em-pedreira', '/contabilidade-em-monte-mor',
  '/contabilidade-em-nova-odessa', '/contabilidade-em-artur-nogueira', '/contabilidade-em-cosmopolis',
  '/contabilidade-em-engenheiro-coelho', '/contabilidade-em-holambra', '/contabilidade-em-morungaba',
  '/contabilidade-em-santo-antonio-de-posse',
  // SP capital + interior
  '/contabilidade-em-sao-paulo', '/contabilidade-em-guarulhos', '/contabilidade-em-santos',
  '/contabilidade-em-sao-jose-dos-campos', '/contabilidade-em-sorocaba', '/contabilidade-em-ribeirao-preto',
  '/contabilidade-em-sao-bernardo-do-campo', '/contabilidade-em-santo-andre', '/contabilidade-em-osasco',
  '/contabilidade-em-maua', '/contabilidade-em-diadema', '/contabilidade-em-barueri',
  '/contabilidade-em-piracicaba', '/contabilidade-em-limeira', '/contabilidade-em-jundiai',
  '/contabilidade-em-bauru', '/contabilidade-em-sao-caetano-do-sul', '/contabilidade-em-jacarei',
  '/contabilidade-em-atibaia', '/contabilidade-em-cotia', '/contabilidade-em-embu-das-artes',
  '/contabilidade-em-marilia', '/contabilidade-em-mogi-das-cruzes', '/contabilidade-em-sao-carlos',
  '/contabilidade-em-ibitinga', '/contabilidade-em-santana-de-parnaiba', '/contabilidade-em-taboao-da-serra',
  '/contabilidade-em-sao-jose-do-rio-preto',
  // RJ
  '/contabilidade-em-rio-de-janeiro', '/contabilidade-em-duque-de-caxias',
  '/contabilidade-em-niteroi', '/contabilidade-em-nova-iguacu',
  // MG
  '/contabilidade-em-belo-horizonte', '/contabilidade-em-contagem', '/contabilidade-em-uberlandia',
  // ES
  '/contabilidade-em-vitoria',
  // PR
  '/contabilidade-em-curitiba', '/contabilidade-em-londrina', '/contabilidade-em-maringa', '/contabilidade-em-pinhais',
  // SC
  '/contabilidade-em-blumenau', '/contabilidade-em-florianopolis',
  // RS
  '/contabilidade-em-porto-alegre',
  // Nordeste
  '/contabilidade-em-salvador', '/contabilidade-em-fortaleza', '/contabilidade-em-recife',
  '/contabilidade-em-natal', '/contabilidade-em-joao-pessoa', '/contabilidade-em-maceio',
  '/contabilidade-em-aracaju', '/contabilidade-em-sao-luis', '/contabilidade-em-teresina',
  // Centro-Oeste
  '/contabilidade-em-brasilia', '/contabilidade-em-goiania', '/contabilidade-em-campo-grande', '/contabilidade-em-cuiaba',
  // Norte
  '/contabilidade-em-manaus', '/contabilidade-em-belem',
];

// Per-route priority/changefreq for sitemap. Any route not listed uses defaults.
export const ROUTE_META = {
  '/': { priority: 1.0, changefreq: 'weekly' },
  '/blog': { priority: 0.9, changefreq: 'daily' },
  '/servicos': { priority: 0.9, changefreq: 'monthly' },
  '/abrir-empresa': { priority: 0.9, changefreq: 'monthly' },
  '/sobre': { priority: 0.7, changefreq: 'monthly' },
  '/contato': { priority: 0.7, changefreq: 'monthly' },
  '/cidades-atendidas': { priority: 0.8, changefreq: 'monthly' },
  '/indique-e-ganhe': { priority: 0.6, changefreq: 'monthly' },
  '/guia-contabilidade-medicos': { priority: 0.8, changefreq: 'monthly' },
  '/guia-contabilidade-psicologos': { priority: 0.8, changefreq: 'monthly' },
  '/politica-de-privacidade': { priority: 0.3, changefreq: 'yearly' },
  '/termos': { priority: 0.3, changefreq: 'yearly' },
};

export const DEFAULT_ROUTE_META = {
  segmentos: { priority: 0.8, changefreq: 'monthly' },
  conteudo: { priority: 0.8, changefreq: 'monthly' },
  cidade: { priority: 0.7, changefreq: 'monthly' },
  blogPost: { priority: 0.7, changefreq: 'weekly' },
  other: { priority: 0.6, changefreq: 'monthly' },
};

export function metaForRoute(route) {
  if (ROUTE_META[route]) return ROUTE_META[route];
  if (route.startsWith('/segmentos/')) return DEFAULT_ROUTE_META.segmentos;
  if (route.startsWith('/conteudo/')) return DEFAULT_ROUTE_META.conteudo;
  if (route.startsWith('/contabilidade-em-')) return DEFAULT_ROUTE_META.cidade;
  if (route.startsWith('/blog/')) return DEFAULT_ROUTE_META.blogPost;
  return DEFAULT_ROUTE_META.other;
}
