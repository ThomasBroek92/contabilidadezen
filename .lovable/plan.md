

# Plano: Blog Copier + Sidebar de CTAs

## O que será construído

1. **Edge Function `copy-blog-content`** -- Usa Firecrawl para scraping e Perplexity para reescrever o conteúdo de forma original, substituindo entidades (especialista, empresa)
2. **Aba "Copiar Blog" no Content Studio** -- Interface para colar URLs, configurar mapeamento de entidades, processar em lote e pré-visualizar antes de salvar
3. **Sidebar de CTAs no BlogPost** -- Coluna lateral sticky no desktop com cards para Abrir Empresa, Calculadora PJ x CLT, Comparativo Tributário e WhatsApp

---

## Parte 1: Edge Function `copy-blog-content`

**Arquivo:** `supabase/functions/copy-blog-content/index.ts`

**Fluxo:**
1. Recebe URL + mapeamento de entidades (sourceExpert, targetExpert, sourceCompany, targetCompany)
2. Chama Firecrawl (`FIRECRAWL_API_KEY`) para extrair conteúdo em markdown
3. Envia para Perplexity (`PERPLEXITY_API_KEY`) com prompt que instrui a **reescrever completamente** o conteúdo -- mesmo tema, estrutura similar, mas texto 100% diferente, substituindo entidades
4. Retorna: título, slug, content (markdown), excerpt, meta_title, meta_description, meta_keywords, faq_schema
5. Autenticação admin obrigatória (mesma `verifyAdminAuth` do generate-blog-content)

**Prompt de reescrita (conceito):**
- "Use este artigo como **inspiração**. Reescreva completamente com palavras e frases diferentes. Mantenha o tema e informações factuais, mas mude a estrutura, exemplos e abordagem."
- Substituir [sourceExpert] por [targetExpert] e [sourceCompany] por "Contabilidade Zen"
- Gerar FAQs originais, meta SEO e expert quotes

---

## Parte 2: Interface no Content Studio

**Arquivo:** `src/components/admin/editorial/BlogCopierTab.tsx`

**Interface:**
- Textarea para colar 1+ URLs (uma por linha)
- Formulário de mapeamento: Especialista Origem, Especialista Destino (default: "Thomas Broek" da geo_settings), Empresa Origem, Empresa Destino (default: "Contabilidade Zen")
- Botão "Processar" com progresso por URL
- Preview do conteúdo gerado (MarkdownRenderer)
- Botão "Salvar como Rascunho" que insere no `blog_posts`

**Modificação em `ContentStudio.tsx`:**
- Adicionar nova aba "Copiar Blog" no TabsList (7 abas total)

---

## Parte 3: Sidebar de CTAs no BlogPost

**Arquivo:** `src/components/blog/BlogSidebar.tsx`

**Cards sticky no desktop (lg+):**
- Abrir Empresa → `/abrir-empresa`
- Calculadora PJ x CLT → `/conteudo/calculadora-pj-clt`
- Comparativo Tributário → `/conteudo/comparativo-tributario`
- WhatsApp → click-to-chat

**Modificação em `BlogPost.tsx`:**
- Layout do article passa de `max-w-4xl` para `flex gap-8` com sidebar `w-80` hidden no mobile

---

## Arquivos

| Ação | Arquivo |
|------|---------|
| Criar | `supabase/functions/copy-blog-content/index.ts` |
| Criar | `src/components/admin/editorial/BlogCopierTab.tsx` |
| Criar | `src/components/blog/BlogSidebar.tsx` |
| Criar | `src/lib/api/firecrawl.ts` |
| Modificar | `src/components/admin/ContentStudio.tsx` |
| Modificar | `src/pages/BlogPost.tsx` |
| Modificar | `supabase/config.toml` (add copy-blog-content) |

Nenhuma migração de banco necessária -- os posts copiados usam a tabela `blog_posts` existente.

