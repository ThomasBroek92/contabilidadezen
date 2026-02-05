
# Plano: Limpeza de URLs Legadas e Redirects 301

## Contexto

As 37 URLs listadas no CSV são resquícios do site WordPress antigo. Elas não existem no sitemap atual, mas o Google continua tentando acessá-las (erro 403).

## Análise das URLs

### Categoria 1: Posts que têm equivalente no novo blog
| URL Antiga | Nova Rota Sugerida |
|------------|-------------------|
| `/contabilidade-para-youtuber/` | `/blog/contabilidade-para-youtubers-criadores-conteudo` |
| `/contabilidade-para-mei/` | (sem equivalente direto) |
| `/contabilidade-para-afiliados/` | `/blog/contabilidade-infoprodutores-produtores-digitais` |
| `/abertura-de-empresa-cnpj/` | `/abrir-empresa` |
| `/abertura-de-empresa/` | `/abrir-empresa` |

### Categoria 2: Páginas de contato antigas
| URL Antiga | Nova Rota |
|------------|-----------|
| `/fale-conosco/` | `/contato` |
| `/fale-conosco` | `/contato` |
| `/contato-contabilidadezen/` | `/contato` |
| `/contato` (trailing slash) | `/contato` |
| `/solicitar-proposta` | `/contato` |

### Categoria 3: URLs de arquivo WordPress (descartáveis)
- `/2022/04/27/`, `/2022/05/`, `/2023/09/`, etc.
- Sem equivalente - redirecionar para `/blog`

### Categoria 4: Páginas sem equivalente
| URL Antiga | Ação |
|------------|------|
| `/planos/` | Redirecionar para `/servicos` |
| `/blog/` (com trailing slash) | Redirecionar para `/blog` |
| `/contabilidade-em-jardim-colina-sp/` | Redirecionar para `/` ou `/cidades-atendidas` |
| `/contabilidade-para-prestadores-de-servicos-2/` | Redirecionar para `/servicos` |

---

## Implementação

### Etapa 1: Criar componente de Redirect Handler

Criar um novo componente `LegacyRedirects.tsx` que detecta URLs antigas e redireciona para as novas rotas correspondentes.

```
src/components/LegacyRedirects.tsx
```

### Etapa 2: Atualizar App.tsx

Adicionar rotas de redirect para as URLs mais importantes antes do `*` (NotFound).

### Etapa 3: Atualizar robots.txt

Adicionar regras de `Disallow` para as URLs de arquivo WordPress que não queremos mais indexar.

---

## Mapeamento Completo de Redirects

```text
# Contato
/fale-conosco           → /contato
/fale-conosco/          → /contato
/contato-contabilidadezen/ → /contato
/solicitar-proposta     → /contato

# Abertura
/abertura-de-empresa/   → /abrir-empresa
/abertura-de-empresa-cnpj/ → /abrir-empresa

# Blog
/blog/                  → /blog
/contabilidade-para-youtuber/ → /blog/contabilidade-para-youtubers-criadores-conteudo
/contabilidade-para-afiliados/ → /blog/contabilidade-infoprodutores-produtores-digitais
/contabilidade-para-mei/ → /blog
/afiliado-pode-ser-mei/ → /blog
/fim-do-limite-de-saque-para-pessoa-fisica-na-hotmart-entenda-como-agir/ → /blog
/como-abrir-empresa-para-afiliados/ → /abrir-empresa
/prestadores-de-servicos-eficiencia-e-produtividade-com-o-chat-gpt/ → /blog

# Arquivos de data (todos para /blog)
/2022/*                 → /blog
/2023/*                 → /blog
/2025/*                 → /blog

# Outras
/planos/                → /servicos
/contabilidade-em-jardim-colina-sp/ → /
/contabilidade-para-prestadores-de-servicos-2/ → /servicos
/politica-de-privacidade (com trailing slash variações) → /politica-de-privacidade
```

---

## Arquivos Modificados

| Arquivo | Ação |
|---------|------|
| `src/components/LegacyRedirects.tsx` | Criar (novo) |
| `src/App.tsx` | Adicionar rotas de redirect |
| `public/robots.txt` | Bloquear URLs de arquivo WordPress |

---

## Detalhes Técnicos

### LegacyRedirects.tsx

Componente React que:
1. Usa `useLocation` para detectar a rota atual
2. Verifica se a rota corresponde a um padrão legado
3. Redireciona com `Navigate` e `replace={true}` (equivalente a 301 no contexto SPA)

### Padrões de Redirect

```typescript
const legacyRedirects: Record<string, string> = {
  '/fale-conosco': '/contato',
  '/fale-conosco/': '/contato',
  '/contato-contabilidadezen/': '/contato',
  '/solicitar-proposta': '/contato',
  '/abertura-de-empresa/': '/abrir-empresa',
  '/abertura-de-empresa-cnpj/': '/abrir-empresa',
  '/contabilidade-para-youtuber/': '/blog/contabilidade-para-youtubers-criadores-conteudo',
  '/contabilidade-para-afiliados/': '/blog/contabilidade-infoprodutores-produtores-digitais',
  '/planos/': '/servicos',
  '/blog/': '/blog',
  // ... etc
};

// Para padrões dinâmicos (datas)
const dynamicRedirects = [
  { pattern: /^\/202\d\//, target: '/blog' },
];
```

---

## Impacto

- **SEO**: Preserva link juice das URLs antigas
- **UX**: Usuários com links antigos salvos são redirecionados corretamente
- **Google Search Console**: Erros 403 diminuirão gradualmente conforme o Google reprocessa as URLs

---

## Alternativa Simplificada

Se preferir não implementar redirects individuais, posso apenas:
1. Bloquear todas essas URLs no `robots.txt` com padrões específicos
2. Aguardar o Google parar de tentar acessá-las (2-3 meses)

Essa abordagem é mais simples mas não preserva autoridade de SEO e pode frustrar usuários com links antigos.
