

## Diagnostico: Blog e Indexacao

### Status atual das paginas do blog

As paginas do blog sao **hibridas** — elas funcionam em 3 camadas:

| Camada | Como funciona | Status |
|--------|---------------|--------|
| **SPA (React)** | Blog.tsx e BlogPost.tsx buscam dados do banco em tempo real | OK — funciona para usuarios |
| **SSG (Puppeteer)** | prerender.mjs pre-renderiza posts durante deploy no GitHub Actions | OK — gera HTML estatico |
| **Edge Function prerender** | Serve HTML completo para bots com conteudo do blog | OK — injeta posts na listagem |
| **SEO4Ajax** | Cloudflare Worker serve HTML pre-renderizado para crawlers | Depende de configuracao externa |

**Resposta direta:** as paginas do blog sao **dinamicas no cliente** (React SPA) mas possuem **3 camadas de pre-rendering** para crawlers.

### Problemas identificados que afetam indexacao

**1. URLs erradas no bloco noscript e static-prerender do index.html**

As ferramentas estao com URLs quebradas (sem o prefixo `/conteudo/`):

```text
ERRADO (atual):     /calculadora-pj-vs-clt
CORRETO (real):     /conteudo/calculadora-pj-clt
```

Isso afeta 7 links que crawlers sem JS usam para descobrir paginas. Links quebrados prejudicam o crawl budget.

**2. Edge Function prerender sem 9 segmentos novos**

O objeto `STATIC_PAGES` no prerender tem apenas 4 segmentos originais. Faltam:
- Produtores Digitais, Profissionais de TI, Exportacao, Prestadores, PJ, E-commerce, Clinicas, YouTubers, Outros

Quando o SEO4Ajax ou SSG falha, crawlers recebem 404 da Edge Function para essas paginas.

**3. Nenhum link para posts do blog no index.html**

O bloco noscript/static-prerender tem `<a href="/blog">Blog</a>` mas nenhum link para posts individuais. Crawlers sem JS nao conseguem descobrir os posts.

**4. Blog listing depende de 3 camadas funcionando**

Se SEO4Ajax, SSG e prerender Edge Function falharem simultaneamente, o Google ve uma pagina vazia (SPA sem dados). A listagem do blog nao tem fallback local.

### Plano de melhorias (4 acoes)

**Acao 1: Corrigir URLs do noscript e static-prerender**

Arquivo: `index.html`
- Corrigir 7 URLs de ferramentas adicionando prefixo `/conteudo/`
- Impacto: crawlers param de seguir links quebrados

**Acao 2: Adicionar 9 segmentos ao prerender Edge Function**

Arquivo: `supabase/functions/prerender/index.ts`
- Adicionar entradas ao `STATIC_PAGES` para os 9 segmentos novos
- Cada entrada com title, description, h1 e content relevante
- Impacto: crawlers recebem HTML completo mesmo sem SEO4Ajax

**Acao 3: Adicionar links de blog posts ao index.html**

Arquivo: `index.html`
- Adicionar secao "Artigos Recentes" no bloco noscript com links para os posts publicados mais importantes
- Isso cria links internos que crawlers sem JS podem seguir
- Como os posts mudam, adicionar pelo menos 10-15 posts fixos + link para /blog

**Acao 4: Melhorar internal linking do blog**

Arquivo: `supabase/functions/prerender/index.ts`
- Na pagina `/blog` do prerender, aumentar o limite de posts listados de 20 para 50
- Adicionar links de categorias para facilitar crawling

### Acoes complementares (sem codigo)

1. **Verificar SEO4Ajax** — confirmar que o Cloudflare Worker esta ativo e servindo HTML para Googlebot. Testar com `curl -H "User-Agent: Googlebot"` no dominio de producao
2. **Forcar reindexacao** — apos deploy, acionar `queue-all-pages` para enviar todos os blog posts a fila de indexacao
3. **Google Search Console** — verificar se ha erros de cobertura especificos para URLs `/blog/*`

### Resumo de arquivos

| Arquivo | Alteracao |
|---------|-----------|
| `index.html` | Corrigir 7 URLs de ferramentas + adicionar links de blog posts |
| `supabase/functions/prerender/index.ts` | Adicionar 9 segmentos ao STATIC_PAGES + aumentar limite de posts no /blog |

