

# Plano: Auditar e Completar o Sitemap

## Diagnostico

O sitemap ja e gerado de forma confiavel via Edge Function que consulta o banco de dados (tabela `page_metadata` para rotas estaticas e `blog_posts` para posts). Nao ha risco de "URLs fantasma" porque o conteudo vem do banco, nao de listas hardcoded.

Porem, ao comparar as 22 rotas publicas do `App.tsx` com as 21 entradas na tabela `page_metadata`, foram encontradas **3 paginas publicas ausentes** do sitemap.

## O que sera feito

### Inserir 3 rotas faltantes na tabela `page_metadata`

| Rota | Prioridade | Frequencia | Justificativa |
|------|-----------|------------|---------------|
| `/cidades-atendidas` | 0.7 | monthly | Pagina de SEO local com lista de cidades |
| `/contabilidade-em-campinas` | 0.8 | monthly | Landing page de cidade (SEO local) |
| `/conteudo/calculadora-pj-clt/resultado` | 0.6 | monthly | Pagina de resultado da calculadora |

### Nenhuma alteracao de codigo necessaria

A Edge Function `sitemap/index.ts` ja esta correta e robusta:
- Consulta `page_metadata` para rotas estaticas
- Consulta `blog_posts` para posts publicados
- Gera XML valido com `lastmod`, `changefreq` e `priority`
- Suporta acoes administrativas (`update-page`, `update-all`)
- Cache de 1 hora

O unico ajuste e popular o banco com as rotas faltantes.

## Detalhes Tecnicos

### SQL a executar (migration)

```sql
INSERT INTO page_metadata (path, priority, changefreq, last_modified)
VALUES 
  ('/cidades-atendidas', 0.7, 'monthly', NOW()),
  ('/contabilidade-em-campinas', 0.8, 'monthly', NOW()),
  ('/conteudo/calculadora-pj-clt/resultado', 0.6, 'monthly', NOW());
```

### Resultado apos a correcao

O sitemap passara de 21 para 24 rotas estaticas (+ todos os blog posts publicados), cobrindo 100% das paginas publicas do site.

### Arquitetura existente (ja confiavel)

O sistema atual ja segue a melhor pratica recomendada pelo guia:

- Fonte de verdade: banco de dados (`page_metadata` + `blog_posts`)
- Gerador: Edge Function server-side (sem risco de alucinacao)
- Atualizacao automatica: trigger no banco atualiza `/blog` quando posts mudam
- Acoes administrativas: `?action=update-all` para forcar refresh de datas
- CRON semanal: repopula fila de indexacao automaticamente

Nenhuma mudanca de arquitetura e necessaria. Apenas o preenchimento das 3 rotas faltantes.

