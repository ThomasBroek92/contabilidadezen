import { Navigate, useLocation } from "react-router-dom";

// Mapeamento de URLs legadas do WordPress para novas rotas
const legacyRedirects: Record<string, string> = {
  // Contato
  '/fale-conosco': '/contato',
  '/fale-conosco/': '/contato',
  '/contato-contabilidadezen/': '/contato',
  '/solicitar-proposta': '/contato',
  '/solicitar-proposta/': '/contato',
  
  // Abertura de empresa
  '/abertura-de-empresa': '/abrir-empresa',
  '/abertura-de-empresa/': '/abrir-empresa',
  '/abertura-de-empresa-cnpj': '/abrir-empresa',
  '/abertura-de-empresa-cnpj/': '/abrir-empresa',
  '/como-abrir-empresa-para-afiliados': '/abrir-empresa',
  '/como-abrir-empresa-para-afiliados/': '/abrir-empresa',
  
  // Blog posts com equivalentes
  '/contabilidade-para-youtuber': '/blog/contabilidade-para-youtubers-criadores-conteudo',
  '/contabilidade-para-youtuber/': '/blog/contabilidade-para-youtubers-criadores-conteudo',
  '/contabilidade-para-afiliados': '/blog/contabilidade-infoprodutores-produtores-digitais',
  '/contabilidade-para-afiliados/': '/blog/contabilidade-infoprodutores-produtores-digitais',
  
  // Blog posts sem equivalente direto → /blog
  '/contabilidade-para-mei': '/blog',
  '/contabilidade-para-mei/': '/blog',
  '/afiliado-pode-ser-mei': '/blog',
  '/afiliado-pode-ser-mei/': '/blog',
  '/fim-do-limite-de-saque-para-pessoa-fisica-na-hotmart-entenda-como-agir': '/blog',
  '/fim-do-limite-de-saque-para-pessoa-fisica-na-hotmart-entenda-como-agir/': '/blog',
  '/prestadores-de-servicos-eficiencia-e-produtividade-com-o-chat-gpt': '/blog',
  '/prestadores-de-servicos-eficiencia-e-produtividade-com-o-chat-gpt/': '/blog',
  
  // Outras páginas
  '/planos': '/servicos',
  '/planos/': '/servicos',
  '/contabilidade-para-prestadores-de-servicos-2': '/servicos',
  '/contabilidade-para-prestadores-de-servicos-2/': '/servicos',
  '/contabilidade-em-jardim-colina-sp': '/cidades-atendidas',
  '/contabilidade-em-jardim-colina-sp/': '/cidades-atendidas',
};

// Padrões dinâmicos para URLs de arquivo WordPress (datas)
const dynamicRedirects = [
  { pattern: /^\/202\d\//, target: '/blog' },
  { pattern: /^\/201\d\//, target: '/blog' },
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
  
  // Verifica padrões dinâmicos (datas do WordPress)
  for (const { pattern, target } of dynamicRedirects) {
    if (pattern.test(path)) {
      return <Navigate to={target} replace />;
    }
  }
  
  // Não é uma URL legada - retorna null para continuar para NotFound
  return null;
};
