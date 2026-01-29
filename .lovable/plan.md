
# Plano: Sitemap Dinamico com Lastmod Preciso

## Status: ✅ CONCLUÍDO

---

## Implementação Realizada

### ✅ Etapa 1: Tabela `page_metadata` criada
- 17 páginas estáticas inseridas com `last_modified` de hoje
- RLS configurado (público para leitura, service_role para escrita)

### ✅ Etapa 2: Edge Function atualizada
- Busca datas de `page_metadata` para páginas estáticas
- Busca `updated_at` de `blog_posts` para posts
- Suporta actions: `update-page` e `update-all`

### ✅ Etapa 3: Trigger automático criado
- `blog_sitemap_trigger` atualiza `/blog` quando posts são publicados/editados

---

## URLs da Edge Function

- **Sitemap XML**: `https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/sitemap`
- **Atualizar página específica**: `?action=update-page&path=/servicos`
- **Atualizar todas as páginas**: `?action=update-all`

---

## Próximos Passos (Manual)

1. Configurar redirect de `/sitemap.xml` para a Edge Function no servidor de produção
2. OU atualizar o arquivo estático `public/sitemap.xml` manualmente após cada deploy
3. Submeter sitemap no Google Search Console
