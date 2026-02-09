import { Navigate, useLocation } from "react-router-dom";

// Mapeamento de URLs legadas do WordPress para novas rotas
const legacyRedirects: Record<string, string> = {
  // === Contato ===
  '/fale-conosco': '/contato',
  '/fale-conosco/': '/contato',
  '/contato-contabilidadezen/': '/contato',
  '/solicitar-proposta': '/contato',
  '/solicitar-proposta/': '/contato',
  
  // === Abertura de empresa ===
  '/abertura-de-empresa': '/abrir-empresa',
  '/abertura-de-empresa/': '/abrir-empresa',
  '/abertura-de-empresa-cnpj': '/abrir-empresa',
  '/abertura-de-empresa-cnpj/': '/abrir-empresa',
  '/como-abrir-empresa-para-afiliados': '/abrir-empresa',
  '/como-abrir-empresa-para-afiliados/': '/abrir-empresa',
  '/abertura-de-empresa-para-influencer-digital': '/abrir-empresa',
  '/abertura-de-empresa-para-influencer-digital/': '/abrir-empresa',
  
  // === Blog posts com equivalentes ===
  '/contabilidade-para-youtuber': '/blog/contabilidade-para-youtubers-criadores-conteudo',
  '/contabilidade-para-youtuber/': '/blog/contabilidade-para-youtubers-criadores-conteudo',
  '/contabilidade-para-afiliados': '/blog/contabilidade-infoprodutores-produtores-digitais',
  '/contabilidade-para-afiliados/': '/blog/contabilidade-infoprodutores-produtores-digitais',
  
  // === Blog posts legados → /blog ===
  '/contabilidade-para-mei': '/blog',
  '/contabilidade-para-mei/': '/blog',
  '/afiliado-pode-ser-mei': '/blog',
  '/afiliado-pode-ser-mei/': '/blog',
  '/fim-do-limite-de-saque-para-pessoa-fisica-na-hotmart-entenda-como-agir': '/blog',
  '/fim-do-limite-de-saque-para-pessoa-fisica-na-hotmart-entenda-como-agir/': '/blog',
  '/prestadores-de-servicos-eficiencia-e-produtividade-com-o-chat-gpt': '/blog',
  '/prestadores-de-servicos-eficiencia-e-produtividade-com-o-chat-gpt/': '/blog',
  '/blog-impostos-para-infoprodutores-qual-o-melhor-regime-tributario': '/blog',
  '/blog-impostos-para-infoprodutores-qual-o-melhor-regime-tributario/': '/blog',
  '/beneficios-de-contratar-uma-contabilidade-digital': '/blog',
  '/beneficios-de-contratar-uma-contabilidade-digital/': '/blog',
  '/contabilidade-para-e-commerce': '/blog',
  '/contabilidade-para-e-commerce/': '/blog',
  '/vantagens-conta-pj-banco-digital': '/blog',
  '/vantagens-conta-pj-banco-digital/': '/blog',
  '/como-abrir-uma-empresa-de-social-media': '/blog',
  '/como-abrir-uma-empresa-de-social-media/': '/blog',
  '/mei': '/blog',
  '/mei/': '/blog',
  '/como-emitir-nota-fiscal-nas-vendas-internacionais-na-hotmart': '/blog',
  '/como-emitir-nota-fiscal-nas-vendas-internacionais-na-hotmart/': '/blog',
  '/a-importancia-de-regularizar-ganhos-no-onlyfans': '/blog',
  '/a-importancia-de-regularizar-ganhos-no-onlyfans/': '/blog',
  '/infoprodutor-deve-emitir-nota-fiscal': '/blog',
  '/infoprodutor-deve-emitir-nota-fiscal/': '/blog',
  '/sistema-de-gestao-financeiro': '/blog',
  '/sistema-de-gestao-financeiro/': '/blog',
  '/venda-sem-nota-fiscal-conheca-os-riscos-e-as-consequencias': '/blog',
  '/venda-sem-nota-fiscal-conheca-os-riscos-e-as-consequencias/': '/blog',
  '/programador-desenvolvedor-ser-mei': '/blog',
  '/programador-desenvolvedor-ser-mei/': '/blog',
  '/empresa-de-copywriting-como-abrir': '/blog',
  '/empresa-de-copywriting-como-abrir/': '/blog',
  '/contabilidade-para-gestor-de-trafego': '/blog',
  '/contabilidade-para-gestor-de-trafego/': '/blog',
  '/contabilidade-para-desenvolvedor-ti': '/blog',
  '/contabilidade-para-desenvolvedor-ti/': '/blog',
  '/infoprodutor-precisa-de-cnpj': '/blog',
  '/infoprodutor-precisa-de-cnpj/': '/blog',
  '/reducao-tributaria-para-e-book-saiba-como-fazer-da-maneira-correta': '/blog',
  '/reducao-tributaria-para-e-book-saiba-como-fazer-da-maneira-correta/': '/blog',
  '/planilha-gestao-fluxo-de-caixa': '/blog',
  '/planilha-gestao-fluxo-de-caixa/': '/blog',
  '/limite-de-faturamento-mei': '/blog',
  '/limite-de-faturamento-mei/': '/blog',
  '/gerenciar-o-fluxo-de-caixa-sucesso-financeiro': '/blog',
  '/gerenciar-o-fluxo-de-caixa-sucesso-financeiro/': '/blog',
  '/simples-nacional-com-novo-limite-de-faturamento-entenda': '/blog',
  '/simples-nacional-com-novo-limite-de-faturamento-entenda/': '/blog',
  '/guia-completo-para-iniciantes': '/blog',
  '/guia-completo-para-iniciantes/': '/blog',
  '/ir-a-falencia-saiba-como-evitar': '/blog',
  '/ir-a-falencia-saiba-como-evitar/': '/blog',
  '/gestor-de-trafego-pode-ser-mei': '/blog',
  '/gestor-de-trafego-pode-ser-mei/': '/blog',
  '/sede-virtual-gratuita': '/blog',
  '/sede-virtual-gratuita/': '/blog',
  '/impostos-na-venda-de-e-books-2': '/blog',
  '/impostos-na-venda-de-e-books-2/': '/blog',
  
  // === Serviços ===
  '/planos': '/servicos',
  '/planos/': '/servicos',
  '/contabilidade-para-prestadores-de-servicos-2': '/servicos',
  '/contabilidade-para-prestadores-de-servicos-2/': '/servicos',
  '/contabilidade-para-prestadores-de-servico': '/servicos',
  '/contabilidade-para-prestadores-de-servico/': '/servicos',
  '/planos-de-contabilidade-online': '/servicos',
  '/planos-de-contabilidade-online/': '/servicos',
  
  // === Sobre ===
  '/contabilidade-zen': '/sobre',
  '/contabilidade-zen/': '/sobre',
  
  // === Segmentos ===
  '/contabilidade-para-medico': '/segmentos/contabilidade-para-medicos',
  '/contabilidade-para-medico/': '/segmentos/contabilidade-para-medicos',
  
  // === Cidades ===
  '/contabilidade-em-jardim-colina-sp': '/cidades-atendidas',
  '/contabilidade-em-jardim-colina-sp/': '/cidades-atendidas',
  '/servicos-de-contabilidade-em-americana-sp': '/cidades-atendidas',
  '/servicos-de-contabilidade-em-americana-sp/': '/cidades-atendidas',
  
  // === Indique e Ganhe (parceiro) ===
  '/seja-parceiro-cz': '/indique-e-ganhe',
  '/seja-parceiro-cz/': '/indique-e-ganhe',
  '/seja-parceiro-cz-2': '/indique-e-ganhe',
  '/seja-parceiro-cz-2/': '/indique-e-ganhe',
  '/seja-parceiro-cz-3': '/indique-e-ganhe',
  '/seja-parceiro-cz-3/': '/indique-e-ganhe',
  
  // === URLs técnicas / lixo ===
  '/cdn-cgi/l/email-protection': '/',
  '/sdsdsd': '/',
  '/sdsdsd/': '/',
};

// Padrões dinâmicos para URLs legadas do WordPress
const dynamicRedirects = [
  { pattern: /^\/202\d\//, target: '/blog' },
  { pattern: /^\/201\d\//, target: '/blog' },
  { pattern: /^\/tags\//, target: '/blog' },
  { pattern: /^\/author\//, target: '/blog' },
  { pattern: /^\/search\//, target: '/blog' },
  { pattern: /^\/wp-login\.php/, target: '/' },
  { pattern: /\/feed\/?$/, target: '/blog' },
];

/**
 * Componente que detecta URLs legadas do WordPress e redireciona para as novas rotas.
 * Deve ser incluído no App.tsx para processar redirects antes do NotFound.
 */
export const LegacyRedirects = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Verifica mapeamento estático primeiro
  if (legacyRedirects[path]) {
    return <Navigate to={legacyRedirects[path]} replace />;
  }
  
  // Verifica padrões dinâmicos
  for (const { pattern, target } of dynamicRedirects) {
    if (pattern.test(path)) {
      return <Navigate to={target} replace />;
    }
  }
  
  // Não é uma URL legada - retorna null para continuar para NotFound
  return null;
};
