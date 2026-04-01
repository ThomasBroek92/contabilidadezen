/**
 * Internal Linking Map
 * Maps keywords/phrases to internal URLs for automatic linking in blog content.
 * Order matters: longer phrases should come first to avoid partial matches.
 */

export interface InternalLink {
  keyword: string;
  url: string;
  title: string;
}

export const internalLinksMap: InternalLink[] = [
  // Segments (longer phrases first)
  { keyword: "contabilidade para médicos", url: "/segmentos/contabilidade-para-medicos", title: "Contabilidade para Médicos" },
  { keyword: "contabilidade para dentistas", url: "/segmentos/contabilidade-para-dentistas", title: "Contabilidade para Dentistas" },
  { keyword: "contabilidade para psicólogos", url: "/segmentos/contabilidade-para-psicologos", title: "Contabilidade para Psicólogos" },
  { keyword: "contabilidade para advogados", url: "/segmentos/contabilidade-para-advogados", title: "Contabilidade para Advogados" },
  { keyword: "contabilidade para representantes comerciais", url: "/segmentos/contabilidade-para-representantes-comerciais", title: "Contabilidade para Representantes Comerciais" },
  { keyword: "contabilidade para produtores digitais", url: "/segmentos/contabilidade-para-produtores-digitais", title: "Contabilidade para Produtores Digitais" },
  { keyword: "contabilidade para profissionais de TI", url: "/segmentos/contabilidade-para-profissionais-de-ti", title: "Contabilidade para Profissionais de TI" },
  { keyword: "contabilidade para e-commerce", url: "/segmentos/contabilidade-para-ecommerce", title: "Contabilidade para E-commerce" },
  { keyword: "contabilidade para ecommerce", url: "/segmentos/contabilidade-para-ecommerce", title: "Contabilidade para E-commerce" },
  { keyword: "contabilidade para clínicas", url: "/segmentos/contabilidade-para-clinicas-e-consultorios", title: "Contabilidade para Clínicas e Consultórios" },
  { keyword: "contabilidade para consultórios", url: "/segmentos/contabilidade-para-clinicas-e-consultorios", title: "Contabilidade para Clínicas e Consultórios" },
  { keyword: "contabilidade para youtubers", url: "/segmentos/contabilidade-para-youtubers-e-creators", title: "Contabilidade para YouTubers e Creators" },
  { keyword: "contabilidade para creators", url: "/segmentos/contabilidade-para-youtubers-e-creators", title: "Contabilidade para YouTubers e Creators" },
  { keyword: "exportação de serviços", url: "/segmentos/contabilidade-para-exportacao-de-servicos", title: "Contabilidade para Exportação de Serviços" },
  { keyword: "prestadores de serviço", url: "/segmentos/contabilidade-para-prestadores-de-servico", title: "Contabilidade para Prestadores de Serviço" },
  { keyword: "profissionais PJ", url: "/segmentos/contabilidade-para-profissionais-pj", title: "Contabilidade para Profissionais PJ" },
  
  // Tools
  { keyword: "calculadora PJ vs CLT", url: "/conteudo/calculadora-pj-clt", title: "Calculadora PJ vs CLT" },
  { keyword: "calculadora PJ CLT", url: "/conteudo/calculadora-pj-clt", title: "Calculadora PJ vs CLT" },
  { keyword: "comparativo tributário", url: "/conteudo/comparativo-tributario", title: "Comparativo Tributário" },
  { keyword: "tabela do Simples Nacional", url: "/conteudo/tabela-simples-nacional", title: "Tabela Simples Nacional" },
  { keyword: "Simples Nacional", url: "/conteudo/tabela-simples-nacional", title: "Tabela Simples Nacional" },
  { keyword: "gerador de invoice", url: "/conteudo/gerador-invoice", title: "Gerador de Invoice" },
  { keyword: "gerador de RPA", url: "/conteudo/gerador-rpa", title: "Gerador de RPA" },
  { keyword: "modelo de contrato PJ", url: "/conteudo/modelo-contrato-pj", title: "Modelo de Contrato PJ" },
  { keyword: "contrato PJ", url: "/conteudo/modelo-contrato-pj", title: "Modelo de Contrato PJ" },
  
  // Pillar pages
  { keyword: "guia contabilidade para médicos", url: "/guia-contabilidade-medicos", title: "Guia Completo de Contabilidade para Médicos" },
  { keyword: "guia contabilidade médicos", url: "/guia-contabilidade-medicos", title: "Guia Completo de Contabilidade para Médicos" },
  
  // Main pages
  { keyword: "abrir empresa", url: "/abrir-empresa", title: "Abrir Empresa" },
  { keyword: "abertura de empresa", url: "/abrir-empresa", title: "Abrir Empresa" },
  { keyword: "abrir CNPJ", url: "/abrir-empresa", title: "Abrir Empresa" },
];

/**
 * Preprocesses markdown content to automatically insert internal links.
 * Rules:
 * - Only links the FIRST occurrence of each keyword
 * - Case-insensitive matching
 * - Won't link inside existing markdown links or headings
 * - Won't link inside code blocks
 * - Max 7 auto-links per article (avoid over-optimization)
 */
export function injectInternalLinks(content: string): string {
  const MAX_LINKS = 7;
  let linksInserted = 0;
  let result = content;
  
  // Track which URLs we've already linked to (avoid duplicate destinations)
  const linkedUrls = new Set<string>();
  
  // Extract existing links to avoid double-linking
  const existingLinks = new Set<string>();
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    existingLinks.add(match[2]);
  }
  
  for (const link of internalLinksMap) {
    if (linksInserted >= MAX_LINKS) break;
    if (linkedUrls.has(link.url)) continue;
    if (existingLinks.has(link.url)) {
      linkedUrls.add(link.url);
      continue;
    }
    
    // Create case-insensitive regex that avoids:
    // - Inside markdown links [...](...) 
    // - Inside headings (lines starting with #)
    // - Inside code blocks (```)
    const escapedKeyword = link.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(?<!\\[)(?<!\\]\\()(?<!#+ )\\b(${escapedKeyword})\\b(?![^\\[]*\\])(?![^(]*\\))`,
      'i'
    );
    
    if (regex.test(result)) {
      // Only replace first occurrence
      result = result.replace(regex, `[$1](${link.url})`);
      linkedUrls.add(link.url);
      linksInserted++;
    }
  }
  
  return result;
}
