

# Correção do Gerador de Blog com IA

## Problemas Identificados

Após análise do código e pesquisa na documentação da API Perplexity, encontrei **3 problemas críticos**:

### 1. Campo `citations` Depreciado (Causa Principal de Falha)
A Perplexity **removeu completamente** o campo `citations` da resposta da API. Agora usa `search_results` (array de objetos com `title`, `url`, `date`, `snippet`). A função atual acessa `data.citations` que retorna `undefined`, causando falhas silenciosas e citações vazias.

### 2. CORS Headers Incompletos
A `generate-blog-content` usa headers CORS antigos (`authorization, x-client-info, apikey, content-type`), enquanto a `copy-blog-content` (mais recente) inclui headers adicionais do Supabase SDK (`x-supabase-client-platform`, etc.). Isso pode causar erros 4xx em alguns cenários.

### 3. Parsing de JSON Frágil (sem reparo de truncamento)
A `copy-blog-content` implementa lógica de reparo de JSON truncado, mas a `generate-blog-content` não. Quando a IA gera respostas longas que excedem o limite de tokens, o JSON fica cortado e o `JSON.parse` falha silenciosamente, retornando conteúdo raw sem estrutura.

---

## Correções

### Arquivo: `supabase/functions/generate-blog-content/index.ts`

1. **Atualizar CORS headers** — Alinhar com o padrão atual incluindo headers do Supabase SDK

2. **Migrar de `citations` para `search_results`** — Alterar o tipo `PerplexityResponse` para incluir `search_results: Array<{title, url, date?, snippet?}>` e mapear as URLs de fontes a partir desse novo campo em vez de `data.citations`

3. **Adicionar reparo de JSON truncado** — Copiar a lógica de `copy-blog-content` que detecta chaves não balanceadas, remove campos incompletos e fecha estruturas abertas antes do parsing

4. **Atualizar prompts para não pedir JSON com markdown** — Reforçar nos prompts de expert quotes, statistics e conteúdo principal para retornar JSON limpo sem code blocks

---

## Detalhes Técnicos

### Mudança no tipo PerplexityResponse:
```typescript
// Antes
interface PerplexityResponse {
  choices: Array<{ message: { content: string } }>;
  citations?: string[];
}

// Depois  
interface PerplexityResponse {
  choices: Array<{ message: { content: string } }>;
  citations?: string[]; // deprecated, mantido para fallback
  search_results?: Array<{ title: string; url: string; date?: string; snippet?: string }>;
}
```

### Extração de citações:
```typescript
// Antes
const citations = data.citations || [];

// Depois
const citations = data.search_results?.map(r => r.url) || data.citations || [];
```

### Função de reparo JSON (copiada de copy-blog-content):
Detecta `{` sem `}` correspondente, remove o último campo incompleto, e fecha as estruturas abertas.

**Arquivos:** 1 arquivo editado (`supabase/functions/generate-blog-content/index.ts`), redeploy automático.

