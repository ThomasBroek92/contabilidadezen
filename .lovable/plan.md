

# Plano: Dados Estruturados JSON-LD Completos por Pagina + Regra na Base de Conhecimento

## Diagnostico Atual

### O que ja funciona bem
- **Home (Index)**: Organization + LocalBusiness + FAQPage via SEOHead
- **Blog Post (detalhe)**: BlogPosting + FAQPage (schema manual no componente)
- **Abrir Empresa**: FAQPage via SEOHead (faqs prop)
- **Cidades Atendidas**: FAQPage via SEOHead (faqs prop)
- **Indique e Ganhe**: FAQPage via SEOHead (faqs prop)
- **Ferramentas (Contrato PJ, Calculadora)**: WebApplication via ToolPageSEO

### Problemas identificados

1. **BlogPost.tsx tem schema duplicado**: Usa tanto o `generateStructuredData()` manual (com BlogPosting) quanto o `<Helmet>` direto. NAO usa o `<SEOHead>` nem o `BlogPostSEO` pre-configurado. Resultado: meta tags e schema injetados de forma inconsistente, sem BreadcrumbList no JSON-LD, e logo URL errada (`/logo.png` ao inves do logo real).

2. **Blog.tsx (listagem)**: Nao tem schema CollectionPage/ItemList para listar posts. Perde oportunidade de rich snippets na listagem.

3. **Paginas de segmento (Medicos, Dentistas, Psicologos, Representantes)**: Tem `pageType="service"` mas NAO passam `faqs` nem `breadcrumbs`. Os FAQs existem nos componentes filhos mas nao geram FAQPage schema.

4. **Servicos.tsx**: Nao tem FAQPage schema nem breadcrumbs.

5. **Sobre.tsx**: Nao tem breadcrumbs.

6. **Contato.tsx**: Tem Organization + LocalBusiness mas nao tem ContactPage schema nem breadcrumbs.

7. **Ferramentas (CalculadoraPJCLT, ComparativoTributario, GeradorRPA, TabelaSimplesNacional, GeradorInvoice)**: Precisam verificar se usam ToolPageSEO ou SEOHead generico.

8. **Pagina local (ContabilidadeCampinas)**: Precisa verificar schema LocalBusiness especifico.

---

## Plano de Implementacao

### Etapa 1: Enriquecer `seo-schemas.ts` com novos geradores

Adicionar ao arquivo `src/lib/seo-schemas.ts`:

- **`generateBlogListingSchema(posts)`**: Gera `CollectionPage` + `ItemList` com os posts publicados para a pagina `/blog`.
- **`generateContactPageSchema()`**: Gera schema `ContactPage` com dados de contato.
- **`generateAboutPageSchema()`**: Gera schema `AboutPage` para `/sobre`.
- Exportar os arrays de FAQs dos segmentos de forma reutilizavel.

### Etapa 2: Refatorar `BlogPost.tsx` para usar `BlogPostSEO`

- Remover o `<Helmet>` manual e o `generateStructuredData()`.
- Usar o componente `<BlogPostSEO>` ja existente em `SEOHead.tsx`, que ja gera Article schema, BreadcrumbList, OG tags e canonical de forma consistente.
- Corrigir a URL do logo no `SEOHead.tsx` (atualmente referencia o upload correto, manter).

### Etapa 3: Adicionar schema `CollectionPage` ao `Blog.tsx` (listagem)

- Passar `customSchema` com `CollectionPage` + `ItemList` dinamico baseado nos posts carregados.
- Adicionar breadcrumbs: Home > Blog.

### Etapa 4: Adicionar FAQs aos segmentos

Para cada pagina de segmento (Medicos, Dentistas, Psicologos, Representantes):
- Exportar o array `faqs` do componente FAQ correspondente.
- Importar no arquivo da pagina e passar via `faqs={...}` no `<SEOHead>`.
- Adicionar `breadcrumbs` especificos (Home > Segmentos > Nome).

### Etapa 5: Completar schemas nas paginas restantes

- **Servicos.tsx**: Adicionar breadcrumbs (Home > Servicos) e incluir servicesSchema como customSchema.
- **Sobre.tsx**: Adicionar breadcrumbs (Home > Sobre) e AboutPage schema.
- **Contato.tsx**: Adicionar breadcrumbs (Home > Contato).
- **Ferramentas**: Verificar e garantir que todas usam `ToolPageSEO` com FAQs quando aplicavel.

### Etapa 6: Validar e corrigir detalhes do BlogPosting schema

No `SEOHead.tsx`, enriquecer o schema Article/BlogPosting gerado para blog-post:
- Adicionar `image` (featured_image_url do post).
- Adicionar `wordCount` e `timeRequired` quando disponivel.
- Garantir que `@id` usa URL canonica (nao `window.location.href`).

### Etapa 7: Adicionar regra na Base de Conhecimento

Adicionar uma nova secao `#STRUCTURED_DATA_RULES` ao Custom Knowledge com as regras obrigatorias.

---

## Detalhes Tecnicos

### Arquivos a modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/lib/seo-schemas.ts` | Adicionar geradores: `generateBlogListingSchema`, `generateContactPageSchema`, `generateAboutPageSchema` |
| `src/components/SEOHead.tsx` | Enriquecer Article schema com `image`, `wordCount`; aceitar novas props opcionais |
| `src/pages/BlogPost.tsx` | Substituir Helmet manual por `BlogPostSEO` (ou SEOHead com props completas) |
| `src/pages/Blog.tsx` | Adicionar CollectionPage schema + breadcrumbs |
| `src/pages/segmentos/ContabilidadeMedicos.tsx` | Importar FAQs + passar faqs/breadcrumbs |
| `src/pages/segmentos/ContabilidadeDentistas.tsx` | Importar FAQs + passar faqs/breadcrumbs |
| `src/pages/segmentos/ContabilidadePsicologos.tsx` | Importar FAQs + passar faqs/breadcrumbs |
| `src/pages/segmentos/ContabilidadeRepresentantes.tsx` | Importar FAQs + passar faqs/breadcrumbs |
| `src/components/segmentos/medicos/MedicosFAQ.tsx` | Exportar array `faqs` |
| `src/components/segmentos/dentistas/DentistasFAQ.tsx` | Exportar array `faqs` |
| `src/components/segmentos/psicologos/PsicologosFAQ.tsx` | Exportar array `faqs` |
| `src/components/segmentos/representantes/RepresentantesFAQ.tsx` | Exportar array `faqs` |
| `src/pages/Servicos.tsx` | Adicionar breadcrumbs + servicesSchema |
| `src/pages/Sobre.tsx` | Adicionar breadcrumbs + AboutPage schema |
| `src/pages/Contato.tsx` | Adicionar breadcrumbs |

### Exemplo: BlogPost.tsx refatorado (trecho)

```tsx
// Antes: Helmet manual + generateStructuredData()
// Depois: usar BlogPostSEO ou SEOHead com props completas

<SEOHead
  title={post.meta_title || post.title}
  description={post.meta_description || post.excerpt || post.title}
  canonical={`/blog/${post.slug}`}
  ogType="article"
  ogImage={post.featured_image_url || undefined}
  publishedTime={post.published_at || post.created_at}
  modifiedTime={post.freshness_date || post.published_at || post.created_at}
  section={post.category}
  tags={post.meta_keywords || undefined}
  pageType="blog-post"
  keywords={post.meta_keywords?.join(', ')}
  faqs={post.faq_schema?.mainEntity}
  breadcrumbs={[
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` }
  ]}
/>
```

### Regra para Base de Conhecimento

```text
#STRUCTURED_DATA_RULES

## Regras Obrigatorias de Dados Estruturados (JSON-LD)

1. **Toda pagina publica DEVE ter JSON-LD**
   - Usar o componente SEOHead (ou variantes BlogPostSEO, ToolPageSEO, ServicePageSEO)
   - NUNCA injetar JSON-LD manualmente via <Helmet> quando SEOHead ja resolve

2. **Schemas por tipo de pagina**
   - Home: Organization + AccountingService + WebSite + WebPage + FAQPage + ServicesSchema
   - Servicos: Service + BreadcrumbList + FAQPage (se houver FAQs)
   - Segmentos: Service + AccountingService + BreadcrumbList + FAQPage
   - Blog (listagem): CollectionPage + ItemList + BreadcrumbList
   - Blog Post: BlogPosting + BreadcrumbList + FAQPage (se houver)
   - Ferramentas: WebApplication + BreadcrumbList + FAQPage (se houver)
   - Contato: Organization + AccountingService + BreadcrumbList
   - Sobre: AboutPage + Organization + BreadcrumbList
   - Paginas locais (cidades): AccountingService (local) + Service + FAQPage + BreadcrumbList

3. **BreadcrumbList obrigatorio**
   - Toda pagina (exceto Home) DEVE ter breadcrumbs no SEOHead
   - Formato: Home > Secao > Pagina

4. **FAQPage obrigatorio quando houver FAQ visivel**
   - Se a pagina renderiza um componente de FAQ, o array de perguntas DEVE ser passado ao SEOHead
   - Exportar arrays de FAQ dos componentes para reutilizacao

5. **BlogPosting**
   - Usar pageType="blog-post" no SEOHead
   - Sempre incluir: headline, description, datePublished, dateModified, image, author, publisher
   - NUNCA usar window.location.href no schema; usar canonical URL
   - Logo do publisher: usar URL absoluta do logo real do projeto

6. **Validacao**
   - Testar schemas no Google Rich Results Test antes de publicar
   - Garantir que nenhum campo obrigatorio esta undefined/null
   - Nao duplicar @context dentro de @graph

7. **Ao criar nova pagina publica**
   - Definir pageType no SEOHead
   - Adicionar breadcrumbs
   - Se tiver FAQ: exportar e passar ao SEOHead
   - Se for ferramenta: usar ToolPageSEO
   - Se for segmento: usar ServicePageSEO ou SEOHead com pageType="service"
```

---

## Resumo de Impacto

| Item | Antes | Depois |
|------|-------|--------|
| BlogPost schema | Manual, URL errada, sem breadcrumbs | Centralizado via SEOHead, URL correta, com breadcrumbs |
| Blog listagem | Sem schema | CollectionPage + ItemList |
| Segmentos (4 paginas) | Sem FAQPage, sem breadcrumbs | FAQPage + BreadcrumbList |
| Servicos | Sem breadcrumbs | + BreadcrumbList + ServicesSchema |
| Sobre | Sem breadcrumbs | + BreadcrumbList + AboutPage |
| Contato | Sem breadcrumbs | + BreadcrumbList |
| Base de Conhecimento | Sem regra de schema | Nova secao #STRUCTURED_DATA_RULES |

