

# Plano Completo de Limpeza de Indexacao - Google Search Console

## Resumo do Diagnostico

O relatorio mostra **~170 URLs com problemas**, divididas em 8 categorias. A maioria sao resquicios do site WordPress antigo. Abaixo, o plano detalhado para resolver cada categoria.

---

## Categoria 1: Pagina com redirecionamento (59 URLs)

**O que sao:** Versoes non-www (contabilidadezen.com.br) que redirecionam para www. Isso e comportamento correto de SEO.

**Acao:** Nenhuma mudanca no codigo. Essas URLs vao desaparecer do relatorio conforme o Google consolida a indexacao no dominio www. Para acelerar, configurar redirect 301 de non-www para www no provedor de DNS/hosting.

---

## Categoria 2: Excluida pela tag noindex (24 URLs)

**O que sao:** Paginas do WordPress antigo (/tags/, /author/, /search/, /wp-login.php) e /parceiro/dashboard.

**Acao no codigo:**
- Adicionar essas URLs ao LegacyRedirects.tsx para redirecionar em vez de mostrar noindex
- Adicionar bloqueios no robots.txt para /tags/, /author/, /search/, /wp-login.php
- A URL `/gestor-de-trafego-pode-ser-mei/`, `/sede-virtual-gratuita/`, `/impostos-na-venda-de-e-books-2/` serao redirecionadas para /blog

---

## Categoria 3: Bloqueada por 403 (37 URLs)

**O que sao:** Mix de URLs legadas do WordPress e URLs atuais acessadas via non-www. As legadas ja estao parcialmente cobertas pelo LegacyRedirects, mas faltam algumas.

**Acao no codigo:** Adicionar ao LegacyRedirects.tsx as URLs faltantes:
- `/contato` (sem trailing slash, versao non-www) - ja funciona no SPA
- `/blog/` (com trailing slash) - adicionar redirect
- `/politica-de-privacidade` (versao non-www) - ja funciona no SPA

---

## Categoria 4: Erro soft 404 (8 URLs)

**O que sao:** URLs legadas do WordPress que carregam o SPA mas mostram a pagina NotFound. O Google detecta que e um 404 disfarçado.

**Acao no codigo:** Adicionar TODAS ao LegacyRedirects.tsx:

| URL Legada | Redirecionar para |
|------------|-------------------|
| `/blog-impostos-para-infoprodutores-qual-o-melhor-regime-tributario/` | `/blog` |
| `/beneficios-de-contratar-uma-contabilidade-digital/` | `/blog` |
| `/contabilidade-para-e-commerce/` | `/blog` |
| `/vantagens-conta-pj-banco-digital/` | `/blog` |
| `/como-abrir-uma-empresa-de-social-media/` | `/blog` |
| `/seja-parceiro-cz/` | `/indique-e-ganhe` |
| `/mei/` | `/blog` |
| `/como-emitir-nota-fiscal-nas-vendas-internacionais-na-hotmart/` | `/blog` |

---

## Categoria 5: Nao encontrado 404 (3 URLs)

**Acao no codigo:** Adicionar ao LegacyRedirects.tsx:

| URL Legada | Redirecionar para |
|------------|-------------------|
| `/servicos-de-contabilidade-em-americana-sp/` | `/cidades-atendidas` |
| `/seja-parceiro-cz-3/` | `/indique-e-ganhe` |
| `/cdn-cgi/l/email-protection` | `/` |

---

## Categoria 6: Rastreada mas nao indexada (37 URLs)

**O que sao:** Mix de conteudo WordPress antigo e feeds RSS.

**Acao no codigo:** Adicionar ao LegacyRedirects.tsx:

| URL Legada | Redirecionar para |
|------------|-------------------|
| `/a-importancia-de-regularizar-ganhos-no-onlyfans/` | `/blog` |
| `/infoprodutor-deve-emitir-nota-fiscal/` | `/blog` |
| `/contabilidade-para-prestadores-de-servico/` | `/servicos` |
| `/sistema-de-gestao-financeiro/` | `/blog` |
| `/venda-sem-nota-fiscal-conheca-os-riscos-e-as-consequencias/` | `/blog` |
| `/contabilidade-zen/` | `/sobre` |
| `/programador-desenvolvedor-ser-mei/` | `/blog` |
| `/empresa-de-copywriting-como-abrir/` | `/blog` |
| `/planos-de-contabilidade-online/` | `/servicos` |
| `/contabilidade-para-gestor-de-trafego/` | `/blog` |
| `/contabilidade-para-desenvolvedor-ti/` | `/blog` |
| `/seja-parceiro-cz-2/` | `/indique-e-ganhe` |
| `/infoprodutor-precisa-de-cnpj/` | `/blog` |
| `/contabilidade-para-medico/` | `/segmentos/contabilidade-para-medicos` |
| `/reducao-tributaria-para-e-book-saiba-como-fazer-da-maneira-correta/` | `/blog` |
| `/planilha-gestao-fluxo-de-caixa/` | `/blog` |
| `/sdsdsd/` | `/` |
| `/limite-de-faturamento-mei/` | `/blog` |
| `/gerenciar-o-fluxo-de-caixa-sucesso-financeiro/` | `/blog` |
| `/simples-nacional-com-novo-limite-de-faturamento-entenda/` | `/blog` |
| `/guia-completo-para-iniciantes/` | `/blog` |
| `/abertura-de-empresa-para-influencer-digital/` | `/abrir-empresa` |
| `/ir-a-falencia-saiba-como-evitar/` | `/blog` |

**Feeds e URLs tecnicas** - bloquear no robots.txt:
- `/author/*/feed/`
- `/tags/*/feed/`
- Datas do WordPress (ja bloqueadas)

---

## Categoria 7: Detectada mas nao indexada (36 URLs www)

**O que sao:** Paginas REAIS do site atual (blog posts, segmentos, servicos, contato). O Google encontrou via sitemap mas ainda nao indexou.

**Acao:** Disparar reindexacao via a Edge Function `process-indexing-queue` para forcar o envio dessas URLs ao Google Indexing API. Nenhuma mudanca de codigo necessaria.

---

## Categoria 8: Canonical duplicado (1 URL)

**URL:** `/conteudo/calculadora-pj-clt` - "Copia sem pagina canonica selecionada pelo usuario"

**Acao:** Ja possui canonical correto no codigo. Pode ser necessario inspecionar a URL manualmente no Search Console para forcar reprocessamento.

---

## Resumo de Alteracoes no Codigo

### Arquivo 1: `src/components/LegacyRedirects.tsx`

Adicionar ~40 novos mapeamentos de redirect cobrindo todas as URLs legadas do WordPress que estao gerando erros 403, soft 404, 404, e "rastreada mas nao indexada".

### Arquivo 2: `public/robots.txt`

Adicionar bloqueios para:
- `/tags/`
- `/author/`
- `/search/`
- `/wp-login.php`
- `/cdn-cgi/`
- `*/feed/`
- `/sede-virtual-gratuita/`
- `/gestor-de-trafego-pode-ser-mei/`
- `/impostos-na-venda-de-e-books-2/`

### Arquivo 3: Nenhum outro arquivo precisa ser alterado

---

## Acao Pos-Deploy

1. Disparar reindexacao das paginas www via Edge Function
2. Aguardar 2-4 semanas para o Google reprocessar as URLs redirecionadas
3. Monitorar no Search Console se os erros diminuem

---

## Impacto Esperado

| Metrica | Antes | Depois (estimativa) |
|---------|-------|---------------------|
| URLs com erro 403 | 37 | 0 (redirecionadas) |
| Soft 404 | 8 | 0 (redirecionadas) |
| 404 real | 3 | 0 (redirecionadas) |
| Rastreada mas nao indexada (legadas) | ~25 | 0 (redirecionadas) |
| Paginas com redirecionamento (www/non-www) | 59 | 59 (resolve com DNS) |
| Paginas reais detectadas mas nao indexadas | 36 | Indexadas (com reindexacao) |

