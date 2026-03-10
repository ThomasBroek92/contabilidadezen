

# Correção End-to-End: Copiador de Blog

## Problemas Identificados

1. **Edge Function não registrada no config.toml** -- A função `copy-blog-content` nunca foi adicionada ao `supabase/config.toml`, então ela nunca foi deployada. Por isso não há logs e nada funciona quando você clica "Processar URLs".

2. **Posts salvos como `draft`, nunca como `published`** -- O botão "Salvar" no `BlogCopierTab.tsx` insere com `status: 'draft'` (linha 113). A página `BlogPost.tsx` filtra por `status: 'published'` (linha 109). Resultado: o post é salvo mas nunca aparece no blog.

3. **Falta `published_at`** -- Mesmo se mudasse para `published`, falta o campo `published_at` no insert, e o BlogPost também valida `published_at <= now()`.

## Correções

### 1. Registrar a Edge Function no config.toml
Adicionar `[functions.copy-blog-content]` com `verify_jwt = false` (a autenticação é feita manualmente dentro da função).

### 2. Alterar BlogCopierTab para publicar diretamente
- Trocar `status: 'draft'` por `status: 'published'`
- Adicionar `published_at: new Date().toISOString()`
- Renomear botão de "Salvar" para "Publicar"
- Adicionar opção de "Salvar Rascunho" como secundária
- Após publicar, mostrar feedback com link para o post

### 3. Deploy da Edge Function
Após registrar no config.toml, deployar a função para que fique disponível.

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `supabase/config.toml` | Adicionar `[functions.copy-blog-content]` |
| `src/components/admin/editorial/BlogCopierTab.tsx` | Publicar ao invés de salvar como rascunho, adicionar `published_at` |

