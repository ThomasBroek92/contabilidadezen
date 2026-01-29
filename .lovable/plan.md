
# Sitemap Dinâmico - Documentação

## Status: ✅ IMPLEMENTADO (2026-01-29)

---

## Arquitetura

```
+------------------+       +-------------------+       +------------------+
|  Blog Post       | ----> | Trigger PostgreSQL| ----> | page_metadata    |
|  Publicado/Edit  |       | blog_sitemap_     |       | (last_modified)  |
+------------------+       | trigger           |       +------------------+
                           +-------------------+               |
                                                               v
                           +-------------------+       +------------------+
                           | Edge Function     | <---- | blog_posts       |
                           | /sitemap          |       | (updated_at)     |
                           +-------------------+       +------------------+
                                    |
                                    v
                           +-------------------+
                           | XML com lastmod   |
                           | preciso para      |
                           | todas as URLs     |
                           +-------------------+
```

---

## Componentes

### 1. Tabela `page_metadata`
- **Propósito**: Armazena datas de modificação das 17 páginas estáticas
- **Colunas**: `path`, `last_modified`, `priority`, `changefreq`
- **RLS**: Leitura pública, escrita via service_role

### 2. Edge Function `/sitemap`
- **URL**: `https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/sitemap`
- **Funcionalidades**:
  - Gera XML dinâmico com lastmod preciso
  - Actions: `?action=update-page&path=/servicos` ou `?action=update-all`
- **Cache**: 1 hora (Cache-Control: public, max-age=3600)

### 3. Trigger `blog_sitemap_trigger`
- **Tabela**: `blog_posts`
- **Evento**: AFTER INSERT OR UPDATE (quando status = 'published')
- **Ação**: Atualiza `last_modified` de `/blog` na `page_metadata`

### 4. robots.txt
- **Sitemap dinâmico**: `https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/sitemap`
- **Sitemap estático** (fallback): `https://www.contabilidadezen.com.br/sitemap.xml`

---

## URLs do Sitemap

| Tipo | Quantidade | Fonte |
|------|------------|-------|
| Páginas estáticas | 17 | `page_metadata` |
| Blog posts | ~52+ | `blog_posts` (status=published) |
| **Total** | **69+** | — |

---

## Manutenção

### Adicionar nova página estática
```sql
INSERT INTO page_metadata (path, priority, changefreq) 
VALUES ('/nova-pagina', 0.8, 'monthly');
```

### Atualizar lastmod de uma página
```bash
curl "https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/sitemap?action=update-page&path=/servicos"
```

### Atualizar todas as páginas
```bash
curl "https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/sitemap?action=update-all"
```

---

## Google Search Console

O sitemap dinâmico deve ser submetido no GSC:
1. Acessar https://search.google.com/search-console
2. Ir em "Sitemaps"
3. Adicionar: `https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/sitemap`

---

## Notas Técnicas

- **Por que Edge Function?** O Google aceita sitemaps em qualquer URL, não apenas no domínio principal
- **Por que manter sitemap estático?** Fallback caso a Edge Function esteja indisponível
- **Automação**: O trigger garante que o `/blog` seja atualizado automaticamente quando posts são publicados/editados
