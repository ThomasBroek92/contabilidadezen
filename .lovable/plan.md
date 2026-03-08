

## Plano de Acao: Ativar Landing Pages para Todas as 88 Cidades

### Status Atual
- **Template dinamico funciona** (CatchAllHandler + CidadeLandingPage + cities-config.ts)
- **88 cidades** ja configuradas em `citiesConfig` com SEO, FAQs, WhatsApp, etc.
- **Roteamento OK**: qualquer `/contabilidade-em-{slug}` com slug valido renderiza automaticamente
- **O que falta**: SEO infra (sitemap, indexacao, noscript, page_metadata)

### O template ja cobre todas as cidades automaticamente

Como o CatchAllHandler faz lookup no `citiesConfigMap`, **todas as 88 cidades ja funcionam** — basta acessar `/contabilidade-em-americana`, `/contabilidade-em-salvador`, etc. Nao precisa criar componentes individuais.

### O que precisa ser implementado (4 blocos)

---

**Bloco 1 — Database: page_metadata para 88 cidades**

Criar uma migration SQL que insere as 88 cidades na tabela `page_metadata` com path, priority, changefreq e last_modified. Isso faz com que o sitemap automaticamente inclua todas as cidades.

```sql
INSERT INTO page_metadata (path, priority, changefreq, last_modified) VALUES
('/contabilidade-em-campinas', 0.8, 'monthly', NOW()),
('/contabilidade-em-americana', 0.7, 'monthly', NOW()),
-- ... todas as 88 cidades
ON CONFLICT (path) DO NOTHING;
```

Prioridades:
- RMC (20 cidades): 0.8
- Sudeste/Sul (48 cidades): 0.7
- Nacional (20 cidades): 0.6

---

**Bloco 2 — index.html: noscript com todas as 88 cidades**

Atualizar o bloco `<noscript>` no `index.html` para incluir links para todas as 88 cidades (atualmente tem apenas 15). Essencial para crawlers que nao executam JavaScript.

---

**Bloco 3 — google-search-console: queue-all-pages com cidades**

Atualizar o array `staticPages` na edge function `google-search-console/index.ts` (action `queue-all-pages`) para incluir as 88 URLs de cidades. Isso garante que o CRON semanal enfileira todas para indexacao.

---

**Bloco 4 — Sitemap dinâmico: incluir cidades via cities-config**

Atualizar a edge function `sitemap/index.ts` para, alem de ler `page_metadata`, tambem gerar URLs de cidades dinamicamente a partir do array de slugs (importando ou hardcoding a lista). Isso serve como fallback caso alguma cidade nao esteja no `page_metadata`.

---

### Resumo de entregas

| Bloco | Arquivo(s) | Impacto |
|-------|-----------|---------|
| 1 | Migration SQL (page_metadata) | Sitemap automatico |
| 2 | index.html (noscript) | Crawlers sem JS |
| 3 | google-search-console/index.ts | Indexacao automatica |
| 4 | sitemap/index.ts | Sitemap completo |

### Ordem recomendada
Bloco 1 → 4 → 2 → 3 (database primeiro, depois sitemap, depois crawler visibility, depois indexacao)

Posso implementar todos os 4 blocos de uma vez. Quer que eu va em frente?

