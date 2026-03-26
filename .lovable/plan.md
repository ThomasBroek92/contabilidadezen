

# Correcoes SEO: Redirects + Domain Canonicalization

## Resumo

Duas acoes: (1) atualizar `_redirects` com trailing slash rule e flag force, (2) substituir todas as ocorrencias de `https://contabilidadezen.com.br` (sem www) por `https://www.contabilidadezen.com.br` em 7 arquivos, e (3) aplicar as melhorias do prerender e canonical do plano anterior.

---

## Arquivos a Editar

### 1. `public/_redirects` — Atualizar regras

Adicionar flag `!` (force) e regra de trailing slash:
```
https://contabilidadezen.com.br/*  https://www.contabilidadezen.com.br/:splat  301!
http://contabilidadezen.com.br/*  https://www.contabilidadezen.com.br/:splat  301!
https://www.contabilidadezen.com.br/*/  https://www.contabilidadezen.com.br/:splat  301!
```

### 2. Corrigir URLs sem www (7 arquivos)

| Arquivo | Linha | De | Para |
|---|---|---|---|
| `src/components/admin/geo/SchemaGenerator.tsx` | 43, 91 | `https://contabilidadezen.com.br` | `https://www.contabilidadezen.com.br` |
| `src/components/admin/geo/BlogGEODashboard.tsx` | 265 | `https://contabilidadezen.com.br` | `https://www.contabilidadezen.com.br` |
| `src/components/admin/SEOIndexingAuditor.tsx` | 209, 686 | `https://contabilidadezen.com.br` | `https://www.contabilidadezen.com.br` |
| `src/components/admin/IndexingHistoryReport.tsx` | 416 | `https://contabilidadezen.com.br` | `https://www.contabilidadezen.com.br` |
| `src/components/admin/geo/AIBrowserSimulator.tsx` | 120 | `https://contabilidadezen.com.br` | `https://www.contabilidadezen.com.br` |
| `supabase/functions/publish-scheduled-posts/index.ts` | 151 | `https://contabilidadezen.com.br` | `https://www.contabilidadezen.com.br` |
| `supabase/functions/publish-to-gmb/index.ts` | 93, 296 | `https://contabilidadezen.com.br` | `https://www.contabilidadezen.com.br` |

### 3. `scripts/prerender.mjs` — Melhorias de robustez

- Timeout `goto`: 30s → 60s
- Timeout `waitForFunction`: 15s → 20s
- Retry 3x com delay de 3s entre tentativas
- Validacao de conteudo: rejeitar HTML com < 500 chars de texto

### 4. `src/components/SEOHead.tsx` — Canonical sem trailing slash

Sanitizar canonical na linha 244:
```typescript
const rawCanonical = canonical?.startsWith("http") ? canonical : `${SITE_URL}${canonical || ""}`;
const fullCanonical = rawCanonical === SITE_URL || rawCanonical === `${SITE_URL}/`
  ? SITE_URL
  : rawCanonical.replace(/\/+$/, "");
```

### 5. `src/pages/Index.tsx` — Title mais curto

De (73 chars): `Contabilidade Zen | Economize até 50% em Impostos | Contabilidade Digital`
Para (52 chars): `Contabilidade Zen | Médicos, Dentistas e Psicólogos`

---

## Resultado

- 76 erros de redirect resolvidos (www + trailing slash)
- Domain canonicalization consistente em todo o codigo
- Prerender mais robusto (menos falhas de indexacao)
- Canonical tags limpas em todas as paginas

