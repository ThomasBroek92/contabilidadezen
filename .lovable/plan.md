

## Diagnostico: Por que o blog nao indexa no Google

### Resultados da inspecao (Google Search Console API)

| URL | Status Google |
|-----|---------------|
| `/blog` | **Crawled - currently not indexed** (rastreado em 02/mar, mas nao indexado) |
| `/blog/compliance-fiscal-...` | **Discovered - currently not indexed** (nunca rastreado) |
| `/blog/reforma-tributaria-...` | **URL is unknown to Google** (Google nem sabe que existe) |
| `/blog/malha-fina-...` | **Discovered - currently not indexed** (nunca rastreado) |
| `/blog/lucro-presumido-...` | **URL is unknown to Google** |

### Causa raiz: dominio errado na fila de indexacao

A Indexing API esta enviando URLs com o dominio **errado**. Verificacao:

```
URLs na fila:   https://contabilidadezen.com.br/blog/...  (SEM www)
URL canonica:   https://www.contabilidadezen.com.br/blog/... (COM www)
```

O codigo em `google-search-console/index.ts` linhas 502-505 extrai o dominio de `sc-domain:contabilidadezen.com.br` e gera `https://contabilidadezen.com.br` — sem `www`. O Google recebe a notificacao para a URL sem www, mas a canonical aponta para www, entao o Google ignora.

### Causa secundaria: conteudo vazio para crawlers

Ao fazer fetch de um blog post, o resultado foi apenas o widget do WhatsApp — zero conteudo do artigo. Isso indica que o SEO4Ajax (Cloudflare Worker) nao esta interceptando corretamente, e sem ele o Google ve uma SPA vazia.

A Edge Function `prerender` JA tem logica para servir blog posts (linhas 396-470), mas ela so funciona quando chamada diretamente via `?path=/blog/slug`. O SSG via Puppeteer tambem gera HTML, mas apenas durante deploy no GitHub Actions.

Se o Cloudflare Worker (SEO4Ajax) falhar para qualquer bot, o Google recebe HTML vazio.

### Plano de correcao (2 acoes)

**Acao 1: Corrigir dominio nas URLs da fila de indexacao**

Arquivo: `supabase/functions/google-search-console/index.ts`

Nas linhas 500-508, forcar `www.` no baseUrl:

```ts
let baseUrl: string;
if (siteUrl.startsWith('sc-domain:')) {
  const domain = siteUrl.replace('sc-domain:', '');
  // Always use www for canonical URLs
  baseUrl = domain.startsWith('www.') 
    ? `https://${domain}` 
    : `https://www.${domain}`;
} else {
  baseUrl = siteUrl.replace(/\/$/, '');
}
```

Mesma correcao na logica de sitemap submission (linhas 427-431).

**Acao 2: Reprocessar toda a fila com URLs corretas**

Apos o deploy da correcao, acionar `queue-all-pages` para recriar a fila inteira com URLs `www.contabilidadezen.com.br`. Isso envia as URLs corretas para a Google Indexing API no proximo CRON.

### Acao complementar recomendada (sem codigo)

Verificar se o Cloudflare Worker (SEO4Ajax) esta ativo e funcionando — testar com:
```
curl -H "User-Agent: Googlebot" https://www.contabilidadezen.com.br/blog/malha-fina-20262027-para-profissionais-de-saude
```
Se retornar HTML vazio, o problema esta no Worker e precisa ser corrigido no painel do Cloudflare.

### Resumo

| Problema | Impacto | Correcao |
|----------|---------|----------|
| URLs sem `www` na Indexing API | Google ignora as notificacoes | Forcar www no baseUrl |
| 352 URLs ja enviadas com dominio errado | Desperdicio de quota | Requeue com dominio correto |
| SEO4Ajax possivelmente falhando | Google ve SPA vazia | Verificar Cloudflare Worker |

### Arquivo a editar

| Arquivo | Alteracao |
|---------|-----------|
| `supabase/functions/google-search-console/index.ts` | Forcar `www.` no baseUrl (linhas 500-508 e 427-431) |

