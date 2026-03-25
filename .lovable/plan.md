

# Correcoes de SEO e Indexacao — Google Search Console

## Analise do Estado Atual

Apos inspecionar o codigo, varias correcoes ja estao implementadas:
- **CORRECAO 6 (posts de teste)**: Ja deletados na sessao anterior.
- **CORRECAO 7 (noindex em Admin/Auth/Partner)**: Ja implementado nos 3 arquivos.
- **Schema JSON-LD (CORRECAO 3)**: Os schemas `Organization`, `LocalBusiness`, `WebSite` e `SiteNavigation` ja estao corretos e completos em `seo-schemas.ts`. Nao ha `@type: null`.

Restam **4 correcoes reais** a implementar:

---

## Correcao 1 — Atualizar `public/_redirects`

O arquivo existe mas falta a regra de trailing slash e o flag `!` (force).

**De:**
```
https://contabilidadezen.com.br/* https://www.contabilidadezen.com.br/:splat 301
http://contabilidadezen.com.br/* https://www.contabilidadezen.com.br/:splat 301
```

**Para:**
```
https://contabilidadezen.com.br/* https://www.contabilidadezen.com.br/:splat 301!
http://contabilidadezen.com.br/* https://www.contabilidadezen.com.br/:splat 301!
https://www.contabilidadezen.com.br/*/ https://www.contabilidadezen.com.br/:splat 301!
```

---

## Correcao 2 — Melhorar `scripts/prerender.mjs`

Tres alteracoes:
1. **Timeout**: `goto` de 30s para 60s, `waitForFunction` de 15s para 20s
2. **Retry 3x**: Loop com 3 tentativas por rota, com delay de 3s entre falhas
3. **Validacao de conteudo**: Rejeitar HTML com menos de 500 chars de texto (indicativo de tela de loading)

---

## Correcao 3 — Reduzir Title da Homepage

No `src/pages/Index.tsx`, o titulo atual tem 73 caracteres:
```
Contabilidade Zen | Economize até 50% em Impostos | Contabilidade Digital
```

Substituir por (52 chars):
```
Contabilidade Zen | Médicos, Dentistas e Psicólogos
```

---

## Correcao 4 — Canonical sem trailing slash no `SEOHead.tsx`

A linha 244 gera o canonical mas nao remove trailing slashes. Adicionar sanitizacao:

```typescript
// Antes:
const fullCanonical = canonical?.startsWith("http") ? canonical : `${SITE_URL}${canonical || ""}`;

// Depois:
const rawCanonical = canonical?.startsWith("http") ? canonical : `${SITE_URL}${canonical || ""}`;
const fullCanonical = rawCanonical === SITE_URL || rawCanonical === `${SITE_URL}/`
  ? SITE_URL
  : rawCanonical.replace(/\/+$/, "");
```

Isso garante que a homepage usa `https://www.contabilidadezen.com.br` (sem barra) e paginas internas nunca terminam com `/`.

---

## Arquivos Afetados

| Arquivo | Acao |
|---|---|
| `public/_redirects` | Adicionar trailing slash rule + flag `!` |
| `scripts/prerender.mjs` | Timeout 60s + retry 3x + validacao |
| `src/pages/Index.tsx` | Reduzir title para 52 chars |
| `src/components/SEOHead.tsx` | Sanitizar canonical (remover trailing slash) |

4 arquivos editados. Nenhuma alteracao de banco de dados.

