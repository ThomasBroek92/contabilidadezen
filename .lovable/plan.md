

## Plano de Execução: 4 Tarefas Pendentes (em ordem)

### Tarefa 1: Atualizar Edge Function `prerender` para cidades dinâmicas

**Problema**: O `STATIC_PAGES` só tem `/contabilidade-em-campinas`. As outras 87 cidades retornam 404 para crawlers.

**Solução**: Antes do check de `STATIC_PAGES`, adicionar lógica dinâmica para rotas `/contabilidade-em-*`:

```ts
// Between blog check (line 497) and static pages check (line 499)
if (normalizedPath.startsWith("/contabilidade-em-")) {
  const slug = normalizedPath.replace("/contabilidade-em-", "");
  const cityData = CITIES_PRERENDER[slug]; // inline map with all 88 cities
  if (cityData) {
    // Build HTML with city-specific title, description, h1, FAQs, content
    // Add FAQPage schema + LocalBusiness schema
    // Return cached response
  }
}
```

**Dados**: Criar um map `CITIES_PRERENDER` inline na Edge Function (não pode importar de `src/`) com as 88 cidades contendo: `name`, `state`, `seoTitle`, `seoDescription`, `faqs` (6 cada). Gerado programaticamente a partir dos 3 factory patterns (RMC/Regional/National).

**Schemas incluídos**: FAQPage + AccountingService (LocalBusiness) + BreadcrumbList + Organization.

**Arquivo**: `supabase/functions/prerender/index.ts`
- Remover entrada estática `/contabilidade-em-campinas` do `STATIC_PAGES`
- Adicionar bloco dinâmico de cidades entre blog e static pages check (~linhas 498-499)
- Adicionar `CITIES_PRERENDER` map com dados das 88 cidades

### Tarefa 2: Atualizar `index.html` noscript com links de cidades

**Arquivo**: `index.html`

Adicionar seção no bloco `<noscript>` (após "Ferramentas Gratuitas") e no `#root .static-prerender`:

```html
<h2>Contabilidade por Cidade</h2>
<ul>
  <li><a href="/contabilidade-em-campinas">Contabilidade em Campinas</a></li>
  <li><a href="/contabilidade-em-sao-paulo">Contabilidade em São Paulo</a></li>
  <!-- top 15 cidades -->
</ul>
```

Incluir as 15 cidades mais relevantes (Campinas, SP, Rio, BH, Curitiba, Porto Alegre, Brasília, Salvador, Fortaleza, Recife, Americana, Indaiatuba, Guarulhos, Santos, Sorocaba).

### Tarefa 3: Atualizar `scripts/prerender.mjs` com rotas de cidades

Adicionar as 88 rotas `/contabilidade-em-*` ao array `STATIC_ROUTES` para que o SSG via Puppeteer gere HTML estático no deploy.

### Tarefa 4: Acionar `queue-all-pages`

Chamar a Edge Function `google-search-console` com action `queue-all-pages` para popular a fila de indexação com todas as 88 novas URLs `www`.

### Ordem e estimativa

| # | Tarefa | Complexidade |
|---|--------|-------------|
| 1 | Prerender Edge Function (88 cidades) | Alta (~200 linhas) |
| 2 | index.html noscript (15 cidades) | Baixa |
| 3 | prerender.mjs (88 rotas) | Baixa |
| 4 | queue-all-pages | Invoke only |

