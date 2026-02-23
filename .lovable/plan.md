
# Integrar SEO4Ajax via Cloudflare Worker

## Visao Geral

O Cloudflare Worker vai interceptar todas as requisicoes ao site. Quando detectar que o User-Agent e um bot (Googlebot, Bingbot, etc.), ele busca o HTML pre-renderizado no SEO4Ajax e retorna ao bot. Para usuarios normais, a requisicao segue normalmente para o Lovable.

## Passo a Passo

### Etapa 1 -- Configurar o Cloudflare Worker (no painel do Cloudflare)

1. Acesse o painel do Cloudflare: **Workers & Pages > Create Worker**
2. De um nome ao Worker, por exemplo: `seo4ajax-prerender`
3. Cole o codigo abaixo (baseado no repositorio oficial do SEO4Ajax para Cloudflare):

```javascript
const S4A_TOKEN = "SEU_SITE_TOKEN_AQUI"; // Token do SEO4Ajax

const BOT_AGENTS = [
  "googlebot", "bingbot", "yandex", "baiduspider", "facebookexternalhit",
  "twitterbot", "rogerbot", "linkedinbot", "embedly", "quora link preview",
  "showyoubot", "outbrain", "pinterest", "slackbot", "vkShare",
  "W3C_Validator", "redditbot", "Applebot", "WhatsApp", "flipboard",
  "tumblr", "bitlybot", "SkypeUriPreview", "nuzzel", "Discordbot",
  "Google-PageRenderer", "Qwantify", "pinterestbot", "Bitrix link preview",
  "XING-contenttabreceiver", "Chrome-Lighthouse", "TelegramBot",
  "SeznamBot", "GPTBot", "PerplexityBot", "Claude-Web"
];

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = (request.headers.get("User-Agent") || "").toLowerCase();

  // Verificar se e um bot
  const isBot = BOT_AGENTS.some((bot) => userAgent.includes(bot.toLowerCase()));

  // Nao interceptar assets estaticos
  const isStaticAsset = /\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|woff2|svg|eot|webp|avif)$/i.test(url.pathname);

  if (!isBot || isStaticAsset) {
    // Usuario normal ou asset: passar direto para a origem
    return fetch(request);
  }

  // Bot detectado: buscar HTML pre-renderizado no SEO4Ajax
  const s4aUrl = `https://api.seo4ajax.com/${S4A_TOKEN}${url.pathname}${url.search}`;

  try {
    const s4aResponse = await fetch(s4aUrl, {
      headers: {
        "User-Agent": request.headers.get("User-Agent") || "",
        "Accept": "text/html",
        "X-Forwarded-For": request.headers.get("CF-Connecting-IP") || "",
      },
    });

    if (s4aResponse.ok) {
      // Retornar o HTML do SEO4Ajax com headers corretos
      const body = await s4aResponse.text();
      return new Response(body, {
        status: s4aResponse.status,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Powered-By": "SEO4Ajax",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Se SEO4Ajax falhar, servir da origem normalmente
    return fetch(request);
  } catch (error) {
    // Em caso de erro, servir da origem
    return fetch(request);
  }
}
```

4. Substitua `SEU_SITE_TOKEN_AQUI` pelo seu Site Token do SEO4Ajax
5. Clique em **Save and Deploy**

### Etapa 2 -- Associar o Worker ao dominio (no Cloudflare)

1. No painel do Cloudflare, va em **Workers Routes** (dentro do dominio contabilidadezen.com.br)
2. Clique em **Add Route**
3. Configure:
   - **Route**: `*contabilidadezen.com.br/*`
   - **Worker**: `seo4ajax-prerender`
4. Salve

### Etapa 3 -- Iniciar o primeiro crawl no SEO4Ajax

1. Acesse [console.seo4ajax.com](https://console.seo4ajax.com)
2. Va nas configuracoes do site `contabilidadezen.com.br`
3. Clique em **"Crawl site"** para iniciar a captura de todas as paginas
4. Aguarde o crawl completar (pode levar alguns minutos dependendo do numero de paginas)

### Etapa 4 -- Testar a integracao

Apos o crawl e o Worker ativo, teste com curl no terminal:

```bash
# Simular Googlebot
curl -H "User-Agent: Googlebot" -I https://www.contabilidadezen.com.br/

# Verificar se o header X-Powered-By: SEO4Ajax aparece
# Se aparecer, a integracao esta funcionando
```

Voce tambem pode testar paginas especificas:

```bash
curl -H "User-Agent: Googlebot" https://www.contabilidadezen.com.br/blog | head -50
curl -H "User-Agent: Googlebot" https://www.contabilidadezen.com.br/servicos | head -50
```

### Etapa 5 -- Configuracoes recomendadas no SEO4Ajax Console

1. **Crawl Frequency**: Configurar para recrawl automatico semanal (para pegar novos posts do blog)
2. **Sitemap URL**: Informar `https://www.contabilidadezen.com.br/sitemap.xml` para que o SEO4Ajax descubra todas as URLs
3. **Pages to ignore**: Adicionar `/admin/*`, `/auth/*`, `/parceiro/*` para nao capturar paginas privadas

## Observacoes Importantes

- **Nenhuma alteracao de codigo e necessaria** no projeto Lovable. Tudo e configurado no Cloudflare + SEO4Ajax.
- A Edge Function `prerender` existente no projeto pode continuar ativa como fallback, mas o SEO4Ajax via Cloudflare Worker tera prioridade (intercepta antes).
- O conteudo estatico no `index.html` (dentro do `<div id="root">`) continua util como fallback adicional.
- O `robots.txt` e o sitemap dinamico ja estao corretos e nao precisam de alteracao.

## Resumo

| Etapa | Onde | O que fazer |
|-------|------|-------------|
| 1 | Cloudflare Workers | Criar Worker com o codigo de proxy |
| 2 | Cloudflare Routes | Associar Worker ao dominio |
| 3 | SEO4Ajax Console | Iniciar primeiro crawl |
| 4 | Terminal | Testar com curl simulando bot |
| 5 | SEO4Ajax Console | Configurar recrawl e sitemap |
