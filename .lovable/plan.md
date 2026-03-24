

# Adicionar Anthropic (Claude) como Provider Alternativo

## Resumo

Manter Lovable AI (Perplexity) funcionando como esta. Adicionar Claude como provider adicional, configuravel. As Edge Functions que geram conteudo terao suporte dual: Perplexity (busca web + citacoes) OU Claude (qualidade de escrita), selecionavel via parametro.

---

## O Que Muda

### 1. Adicionar secret ANTHROPIC_API_KEY
Solicitar a chave via ferramenta de secrets. Voce ja tem a chave paga da Anthropic.

### 2. Atualizar `generate-blog-content/index.ts` — Provider Dual

Adicionar uma funcao `callAI()` que abstrai o provider:

```text
Body request recebe: { ai_provider: "perplexity" | "claude" }
- Default: "perplexity" (mantém comportamento atual)
- Se "claude": usa api.anthropic.com/v1/messages com claude-sonnet-4-20250514
- Se "perplexity": mantém api.perplexity.ai (com search_results/citations)
```

Todas as 4 chamadas Perplexity (expert quotes, statistics, internal quotes, conteudo principal) passam a usar `callAI()`. Citacoes web so ficam disponiveis com Perplexity.

### 3. Atualizar `suggest-geo-topics/index.ts` — Mesmo padrao dual

A sugestao de topicos tambem ganha suporte a Claude como alternativa.

### 4. Atualizar UI do Blog Manager — Seletor de Provider

Adicionar um dropdown simples no painel de geracao de conteudo para escolher entre "Perplexity (com pesquisa web)" e "Claude (qualidade premium)".

---

## Detalhes Tecnicos

### Funcao abstrata de chamada AI:

```typescript
async function callAI(
  provider: 'perplexity' | 'claude',
  messages: Array<{role: string, content: string}>,
  apiKeys: { perplexity?: string, anthropic?: string }
): Promise<{ content: string; citations: string[] }>
```

- **Perplexity**: endpoint `api.perplexity.ai`, header `Authorization: Bearer`, resposta `choices[0].message.content`, citacoes de `search_results`
- **Claude**: endpoint `api.anthropic.com/v1/messages`, headers `x-api-key` + `anthropic-version`, resposta `content[0].text`, citacoes vazias

### Arquivos afetados:
1. **`supabase/functions/generate-blog-content/index.ts`** — Adicionar `callAI()`, parametro `ai_provider` no body
2. **`supabase/functions/suggest-geo-topics/index.ts`** — Mesmo padrao
3. **`src/components/admin/editorial/PostEditorDialog.tsx`** ou componente de geracao — Dropdown de provider
4. **1 secret novo**: `ANTHROPIC_API_KEY`

### Estimativa: 3 arquivos editados, 1 secret adicionado.

