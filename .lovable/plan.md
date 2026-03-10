

# Correção: Datas sempre atuais no Copiador de Blog

## Problema
O conteúdo gerado pela IA traz informações e referências de 2024 (provavelmente do artigo original), ao invés de usar o ano corrente.

## Solução
Adicionar regras explícitas no prompt do sistema (`systemPrompt`) e no prompt do usuário (`userPrompt`) na edge function `copy-blog-content/index.ts`:

1. **No `systemPrompt`** (após regra 7, linha 135): adicionar regra 8 instruindo a IA a usar o ano corrente dinamicamente via `new Date().getFullYear()`, e substituir qualquer referência a anos anteriores
2. **No `userPrompt`** (linha 154): informar explicitamente o ano atual para a IA ter contexto

### Mudanças concretas

**`supabase/functions/copy-blog-content/index.ts`**

- Regra nova no systemPrompt:
  ```
  8. ATUALIZAÇÃO TEMPORAL: O ano atual é ${currentYear}. Substitua TODAS as referências a anos anteriores (2023, 2024, 2025 etc.) pelo ano corrente ${currentYear}. Dados, legislação e exemplos devem refletir o cenário atual.
  ```
- No userPrompt, adicionar:
  ```
  IMPORTANTE: Estamos em ${currentYear}. Atualize todas as referências temporais.
  ```

| Arquivo | Mudança |
|---------|---------|
| `supabase/functions/copy-blog-content/index.ts` | Adicionar `currentYear` e regras de atualização temporal nos prompts |

