

# SEO Improvements -- Round 3 (Benchmark Conversion.com.br)

Comparando as melhores praticas tecnicas do benchmark com o estado atual do site, identifiquei 5 melhorias de alto impacto ainda nao implementadas:

---

## 1. HowTo Schema nas Paginas de Processo (Rich Snippets)

As paginas de servico (Abrir Empresa, segmentos) possuem timelines de "como funciona" mas nao geram schema `HowTo`. O Google exibe rich results para HowTo, aumentando CTR significativamente.

**Implementacao:** Criar um `generateHowToSchema()` em `seo-schemas.ts` e aplica-lo em `AbrirEmpresa.tsx` (3 passos) e nas paginas de segmento que possuem componentes `Process`.

**Arquivos:** `src/lib/seo-schemas.ts`, `src/pages/AbrirEmpresa.tsx`, paginas de segmento selecionadas.

---

## 2. Breadcrumbs Visuais em Todas as Paginas Internas

O blog ja tem breadcrumbs visuais com microdata, mas as paginas de servico e segmentos so possuem o schema JSON-LD (invisivel). Adicionar breadcrumbs visuais melhora UX, reduz bounce rate e reforça a estrutura hierarquica para o Google.

**Implementacao:** Criar um componente `VisualBreadcrumb` reutilizavel (usando os componentes shadcn/ui `breadcrumb.tsx` ja existentes) e inclui-lo nas paginas de servico/segmento.

**Arquivos:** Novo `src/components/VisualBreadcrumb.tsx`, paginas de segmento e servico.

---

## 3. Review/AggregateRating Schema nos Depoimentos de Segmento

O `localBusinessSchema` ja tem `aggregateRating`, mas as paginas de segmento com depoimentos especificos nao geram schema `Review` individual. Isso habilita estrelas nos resultados de busca para essas paginas.

**Implementacao:** Criar `generateReviewSchema()` em `seo-schemas.ts` que gera `AggregateRating` + array de `Review` a partir dos depoimentos. Aplica-lo nas paginas de segmento via `customSchema` no `SEOHead`.

**Arquivos:** `src/lib/seo-schemas.ts`, componentes de testimonials dos segmentos.

---

## 4. Service Schema Enriquecido com Offers nas Paginas de Segmento

As paginas de segmento geram `Service` schema basico via `pageType="service"`, mas sem `Offer` com preco. O benchmark usa `Service` + `Offer` com `priceRange`. Adicionar isso habilita rich results de servico com faixa de preco.

**Implementacao:** Estender a geracao automatica de `Service` schema no `SEOHead.tsx` para incluir `offers` com `priceRange` quando disponivel, e `hasOfferCatalog` linkando aos sub-servicos.

**Arquivo:** `src/components/SEOHead.tsx`

---

## 5. Meta Keywords Dinamicas no Blog + Open Graph Article Tags

O benchmark usa tags OG de artigo e keywords de forma sistematica. O blog ja passa `meta_keywords` do banco, mas nao gera `article:tag` OG para cada keyword individualmente (so quando tags sao passadas explicitamente). Garantir que `meta_keywords` do post sejam automaticamente mapeadas para OG tags.

**Implementacao:** No `BlogPost.tsx`, passar `meta_keywords` como prop `tags` para o `SEOHead`, garantindo geracao de `article:tag` OG.

**Arquivo:** `src/pages/BlogPost.tsx`

---

## Detalhes Tecnicos

### Arquivos a editar:
1. **`src/lib/seo-schemas.ts`** -- Adicionar `generateHowToSchema()` e `generateReviewSchema()`
2. **`src/components/SEOHead.tsx`** -- Enriquecer Service schema com Offers/priceRange
3. **`src/pages/AbrirEmpresa.tsx`** -- Incluir HowTo schema
4. **Novo `src/components/VisualBreadcrumb.tsx`** -- Componente reutilizavel de breadcrumbs visuais
5. **`src/pages/BlogPost.tsx`** -- Mapear meta_keywords para article:tag OG
6. **3-4 paginas de segmento** -- Adicionar breadcrumbs visuais e Review schema

### Estimativa: 1 arquivo novo, 5-8 arquivos editados.

