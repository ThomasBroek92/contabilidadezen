# Conectar o site Contabilidade Zen ao Netlify

## Contexto

O projeto usa Lovable Cloud como backend (banco de dados, edge functions, autenticação). A ideia é hospedar apenas o **frontend** no Netlify, mantendo o backend no Lovable Cloud.

## Passo a passo

### 1. Conectar o repositório ao GitHub (pré-requisito)

Se ainda não fez, vá em **Settings → GitHub** no Lovable e conecte o projeto ao seu repositório GitHub. Isso sincroniza o código automaticamente.

### 2. Criar o site no Netlify

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em **"Add new site" → "Import an existing project"**
3. Selecione o repositório GitHub do projeto

### 3. Configurar o build no Netlify


| Campo             | Valor                                                                                |
| ----------------- | ------------------------------------------------------------------------------------ |
| Build command     | `npm run build`                                                                      |
| Publish directory | `dist`                                                                               |
| Node version      | `22` (configurar em **Site settings → Build & Deploy → Environment → Node version**) |


### 4. Configurar variáveis de ambiente no Netlify

Em **Site settings → Environment variables**, adicione estas 3 variáveis:


| Variável                        | Valor                                      |
| ------------------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`             | `https://xqlkjoajrefbvbhkusdn.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | A anon key do projeto (está no `.env`)     |
| `VITE_SUPABASE_PROJECT_ID`      | `xqlkjoajrefbvbhkusdn`                     |


Essas variáveis conectam o frontend ao backend do Lovable Cloud.

### 5. Configurar SPA routing (evitar 404 em rotas diretas)

Criar um arquivo `public/_redirects` com o conteúdo:

```text
/*    /index.html   200
```

Isso garante que URLs como `/abrir-empresa` ou `/blog/meu-post` funcionem ao acessar diretamente (sem passar pela homepage primeiro). Sem isso, o Netlify retorna 404 para qualquer rota que não seja `/`.

### 6. Conectar domínio customizado (opcional)

Se quiser usar `www.contabilidadezen.com.br` no Netlify:

1. No Netlify: **Domain settings → Add custom domain**
2. Configurar DNS (CNAME ou Netlify DNS)
3. O Netlify provisiona SSL automaticamente

**Importante**: Se o domínio já aponta para o Lovable, será necessário atualizar o DNS para o Netlify.

### 7. Deploy

Cada push ao GitHub dispara um deploy automático no Netlify.

## Arquivo a ser criado


| Arquivo             | Conteúdo             |
| ------------------- | -------------------- |
| `public/_redirects` | `/* /index.html 200` |


## O que NÃO muda

- Backend (banco de dados, edge functions, autenticação) continua no Lovable Cloud
- Desenvolvimento e preview continuam no Lovable
- Nenhuma alteração de código necessária (apenas o arquivo `_redirects`)

## Observações importantes

- O Netlify serve apenas o frontend estático (HTML/CSS/JS)
- Edge Functions do backend continuam rodando no Lovable Cloud automaticamente
- Se usar Google Sign-In ou OAuth, adicione o novo domínio do Netlify nas URLs de redirect permitidas do provider