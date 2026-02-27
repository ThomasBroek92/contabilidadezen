

# Migrar Deploy para Cloudflare Pages

## Mudança

Substituir o deploy para Netlify/GitHub Pages por **Cloudflare Pages** no workflow do GitHub Actions.

## Arquivos a modificar

### 1. `.github/workflows/static.yml`
- Remover o step de deploy para Netlify (`netlify-cli`)
- Adicionar deploy via `cloudflare/wrangler-action@v3` com:
  - `command: pages deploy dist --project-name=contabilidade-zen`
  - Secrets: `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`
- Manter todos os steps de build e pre-rendering inalterados

### 2. `public/_redirects` → remover
- Cloudflare Pages não usa esse formato (usa `_headers` e `_redirects` próprio, mas o pre-rendering já gera os HTMLs)

### 3. `.lovable/plan.md` → atualizar referência de Netlify para Cloudflare Pages

## Secrets necessários no GitHub

| Secret | Onde obter |
|--------|-----------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Pages" |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → canto inferior direito de qualquer página |

## Setup no Cloudflare (manual, uma vez)

1. Cloudflare Dashboard → Pages → Create a project → Direct Upload
2. Nome do projeto: `contabilidade-zen`
3. Domínio customizado: `www.contabilidadezen.com.br` em Pages → Custom domains
4. O deploy real será feito pelo GitHub Actions, não pelo Cloudflare build

## SPA Fallback

Cloudflare Pages serve automaticamente `404.html` para rotas não encontradas. O `public/404.html` existente já funciona como fallback SPA para rotas dinâmicas como `/blog/:slug`.

## Resultado

- Build + pre-rendering: GitHub Actions (Puppeteer)
- Hosting: Cloudflare Pages (gratuito, CDN global, SSL automático)
- Domínio customizado com SSL: configurável direto no Cloudflare

