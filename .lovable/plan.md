

# Diagnostico do Blog: Por que nao esta ranqueando bem

## O Problema Central

O blog tem **duas camadas** com problemas distintos:

### 1. Posts individuais (`/blog/:slug`) sao 100% dinamicos — sem HTML estatico

A pagina `/blog` (listagem) esta no script de pre-rendering e na Edge Function `prerender`, mas os **posts individuais** (`/blog/:slug`) **NAO estao sendo pre-renderizados** pelo Puppeteer no GitHub Actions. Eles dependem de:

- **SEO4Ajax** (Cloudflare Worker) — se estiver ativo e funcionando, crawlers recebem HTML
- **Edge Function `prerender`** — serve HTML estatico para bots, MAS so funciona se o bot acessar via essa rota especifica
- **React client-side** — para usuarios normais, o conteudo so aparece apos o JavaScript carregar e buscar dados do banco

Se o SEO4Ajax nao estiver interceptando corretamente os crawlers do Google, o Googlebot ve apenas o `index.html` vazio (SPA shell) e nao indexa o conteudo do post.

### 2. A listagem `/blog` e pre-renderizada, mas sem conteudo real

O Puppeteer pre-renderiza `/blog`, porem o conteudo depende de uma chamada ao banco de dados. Se a chamada falhar no momento do pre-rendering (ex: variavel de ambiente incorreta, timeout), o HTML salvo tera apenas o loading spinner ou nenhum post listado.

### 3. Posts nao estao no pre-rendering do GitHub Actions

O `scripts/prerender.mjs` tem uma lista fixa de 22 rotas. Nenhuma rota `/blog/:slug` esta incluida porque os slugs sao dinamicos e vivem no banco de dados.

## Solucao Proposta: Pre-renderizar posts do blog no GitHub Actions

### Mudanca principal: buscar slugs publicados durante o build e pre-renderizar cada um

Modificar o `scripts/prerender.mjs` para:

1. **Antes de iniciar o Puppeteer**, fazer uma chamada HTTP a API publica do banco para buscar todos os slugs de posts publicados
2. **Adicionar cada `/blog/:slug` a lista de rotas** dinamicamente
3. **Pre-renderizar cada post** — o Puppeteer visita a pagina, o React carrega os dados do banco e renderiza o conteudo completo, que e salvo como HTML estatico

### Arquivos a modificar

**1. `scripts/prerender.mjs`**
- Adicionar funcao `fetchBlogSlugs()` que faz `fetch` a API REST do banco usando as variaveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`
- Query: `GET /rest/v1/blog_posts?select=slug&status=eq.published`
- Mapear resultados para rotas `/blog/${slug}`
- Concatenar com a lista de rotas estaticas existente

**2. `.github/workflows/static.yml`**
- Nenhuma mudanca necessaria — as variaveis de ambiente do Supabase ja estao disponiveis no build

### Resultado esperado

- Cada post publicado gera um `dist/blog/{slug}/index.html` com HTML completo (titulo, meta tags, conteudo, schema JSON-LD)
- O Google indexa o conteudo diretamente do HTML estatico, sem depender de JavaScript ou SEO4Ajax
- Posts novos sao incluidos automaticamente no proximo deploy (cada push para main)
- A listagem `/blog` tambem tera os posts renderizados no HTML

### Limitacao

Posts publicados **apos** o ultimo deploy nao terao HTML estatico ate o proximo push/deploy. Para esses, o SEO4Ajax e a Edge Function `prerender` continuam funcionando como fallback.

