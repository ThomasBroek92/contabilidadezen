

# Pre-rendering no Build via GitHub Actions

## Objetivo

Gerar HTML estático completo para cada rota pública durante o build, usando GitHub Actions + Puppeteer. O React ainda "hidrata" no browser para interatividade, mas crawlers recebem HTML completo sem JavaScript.

## Arquitetura

```text
GitHub push → Actions workflow:
  1. npm install
  2. npm run build (gera dist/ com SPA)
  3. Node script com Puppeteer visita cada rota
  4. Salva HTML renderizado em dist/rota/index.html
  5. Deploy para Netlify (via CLI)
```

## Rotas a pre-renderizar (25 rotas públicas)

```text
/
/medicos
/servicos
/sobre
/blog
/contato
/segmentos/contabilidade-para-medicos
/segmentos/contabilidade-para-dentistas
/segmentos/contabilidade-para-psicologos
/segmentos/contabilidade-para-representantes-comerciais
/conteudo/calculadora-pj-clt
/conteudo/gerador-rpa
/conteudo/gerador-invoice
/conteudo/comparativo-tributario
/conteudo/tabela-simples-nacional
/conteudo/modelo-contrato-pj
/abrir-empresa
/cidades-atendidas
/contabilidade-em-campinas
/indique-e-ganhe
/politica-de-privacidade
/termos
```

Rotas excluídas (admin/auth/dinâmicas): `/admin`, `/auth`, `/parceiro/dashboard`, `/blog/:slug`

## Arquivos a criar/modificar

### 1. `scripts/prerender.mjs` (novo)
Script Node.js que:
- Inicia um servidor local servindo `dist/`
- Usa Puppeteer para visitar cada rota
- Aguarda React renderizar (espera `#root` ter conteúdo)
- Salva o HTML completo em `dist/[rota]/index.html`
- Lista de rotas centralizada no próprio script

### 2. `.github/workflows/static.yml` (reescrever)
Novo workflow:
- Checkout do código
- Setup Node 22
- `npm ci`
- `npm run build` (com variáveis de ambiente do Supabase via GitHub Secrets)
- Instala Puppeteer
- Executa `node scripts/prerender.mjs`
- Deploy para Netlify via `netlify-cli` (usando `NETLIFY_AUTH_TOKEN` e `NETLIFY_SITE_ID` como secrets)

### 3. `package.json` (adicionar script)
- Novo script: `"prerender": "node scripts/prerender.mjs"`

## Secrets necessários no GitHub

| Secret | Descrição |
|--------|-----------|
| `VITE_SUPABASE_URL` | URL do backend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key |
| `NETLIFY_AUTH_TOKEN` | Token de deploy do Netlify |
| `NETLIFY_SITE_ID` | ID do site no Netlify |

## Resultado final

Cada rota gera um `index.html` com HTML completo (metatags, conteúdo, structured data). O React hidrata no browser para interatividade. Crawlers recebem HTML sem precisar de JavaScript, SEO4Ajax, ou qualquer proxy externo.

## Limitação importante

Rotas dinâmicas como `/blog/:slug` não são pre-renderizadas (dependem de dados do banco). Para essas, o SEO4Ajax ou a Edge Function `prerender` continuam sendo a solução.

