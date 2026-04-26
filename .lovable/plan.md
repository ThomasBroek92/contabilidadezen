## Desativar RLS em `blog_posts` e usar anon key no sync

Conforme sua decisão, vou seguir esta abordagem.

### Mudanças

**1. Migration SQL (banco)**
- `ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;`
- As policies existentes ficam preservadas (apenas inativas) — caso queira reverter no futuro, basta reativar com `ENABLE ROW LEVEL SECURITY`.

**2. Atualizar `scripts/sync-blog-md-to-supabase.mjs`**
- Trocar a leitura de `process.env.SUPABASE_SERVICE_ROLE_KEY` por `process.env.VITE_SUPABASE_PUBLISHABLE_KEY` (com fallback para `SUPABASE_SERVICE_ROLE_KEY` caso ainda esteja configurado, para não quebrar).
- Manter o restante da lógica (UPSERT via REST com `Prefer: resolution=merge-duplicates`).

**3. Verificar `.github/workflows/static.yml`**
- Garantir que `VITE_SUPABASE_PUBLISHABLE_KEY` esteja sendo passado como env var no step que roda o sync. Ajustar se necessário.

### Observação importante (apenas para registro, não bloqueia a execução)

Com RLS desativado, qualquer chamada usando a anon key (que está no bundle público do frontend) terá acesso total de leitura/escrita à tabela `blog_posts`, incluindo:
- Rascunhos (`status = 'draft'`) e posts agendados
- Métricas internas (`roi`, `leads_gerados`, `geo_score`)
- Capacidade de INSERT/UPDATE/DELETE em qualquer post

Se em algum momento quiser mitigar, podemos depois mover leituras de rascunhos para uma view filtrada ou reativar RLS com policy específica para o sync. Mas seguindo seu pedido agora.

### Ordem de execução

1. Rodar migration `ALTER TABLE ... DISABLE ROW LEVEL SECURITY`
2. Editar `scripts/sync-blog-md-to-supabase.mjs` para usar `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Conferir/ajustar `.github/workflows/static.yml`
