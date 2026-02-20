
# Corrigir Bug de Redirect no BlogPost.tsx

## Problema Encontrado

Ha um bug no fluxo de "post nao encontrado" em `BlogPost.tsx`. Quando o post nao existe no banco de dados:

1. Linha 113: `if (!data)` entra corretamente
2. Linhas 129-130: Define `setNotFound(true)` e `setLoading(false)`
3. **Bug**: Falta um `return` -- o codigo continua executando
4. Linha 133: Tenta `setPost(data)` onde `data` e null
5. Linha 140: Tenta acessar `data.category` que causa erro (TypeError)
6. Linha 145-147: O `catch` captura o erro e define `setNotFound(true)` novamente

O post 404 acaba funcionando "por acidente" (via catch), mas o fluxo e fragil e pode causar comportamentos inesperados dependendo do timing dos states do React.

## Diagnostico Completo

| Item | Status |
|------|--------|
| Sitemap (Edge Function) | OK - so inclui posts com status `published` |
| Pre-render (Edge Function) | OK - retorna 404 HTML para posts inexistentes |
| BlogPost.tsx (404 state) | Bug - falta `return` apos setNotFound |
| Posts publicados (banco) | OK - todos tem meta_title, meta_description, faq_schema |
| Posts draft (banco) | OK - 12 drafts corretamente excluidos do sitemap |

## Solucao

**Arquivo:** `src/pages/BlogPost.tsx`

Adicionar `return;` apos `setLoading(false)` na linha 131, dentro do bloco `if (!data)`:

```text
// ANTES (linhas 129-131):
        setNotFound(true);
        setLoading(false);
      }

// DEPOIS:
        setNotFound(true);
        setLoading(false);
        return;
      }
```

Isso garante que:
- O fluxo para imediatamente quando o post nao e encontrado
- Nao tenta acessar propriedades de `data` null
- O estado 404 e definido de forma limpa (nao via catch de erro)
- Todos os posts inexistentes mostram a pagina 404 com `noindex` corretamente
