
# Plano: Sistema de Indexação Automatizada com Custom Knowledge

## Resumo Executivo

O projeto já possui infraestrutura sólida de indexação automatizada. Este plano vai **otimizar** o CRON job existente, adicionar **notificações de status**, e criar um **prompt padrão para Custom Knowledge** que garanta que o site esteja sempre em dia com a indexação do Google.

---

## Situação Atual (Diagnóstico)

### O que já existe e funciona:

| Componente | Status | Descrição |
|------------|--------|-----------|
| `indexing_queue` | Ativo | Tabela com 69 URLs pendentes |
| `process-indexing-queue` | CRON a cada 30min | Processa URLs pendentes automaticamente |
| `google-search-console` | Ativo | Edge Function com múltiplas ações |
| `SEOIndexingAuditor` | Ativo | Painel admin com auditoria e fila |
| Trigger no blog | Ativo | `queue_indexing_request` adiciona posts à fila automaticamente |

### Problema identificado:
- O CRON está configurado para rodar **a cada 30 minutos**, mas a quota do Google Indexing API é de **200 requisições/dia**
- Quando a quota acaba, as URLs ficam pendentes até o próximo dia
- Não há notificação quando a quota estoura ou quando há erros

---

## Implementação Proposta

### Fase 1: Otimizar o CRON Job

**Objetivo:** Ajustar o horário do CRON para rodar **1x ao dia às 6h (UTC)** quando a quota renova, em vez de a cada 30 minutos (que gasta tentativas desnecessárias).

**Ação:**
- Atualizar o CRON job `process-indexing-queue` de `*/30 * * * *` para `0 6 * * *`
- Isso processa a fila uma vez por dia às 3h da manhã (horário de Brasília)

### Fase 2: Adicionar Logging e Estatísticas

**Objetivo:** Registrar métricas de indexação para monitoramento.

**Ações:**
1. Criar tabela `indexing_stats` para registrar:
   - Data do processamento
   - Total de URLs processadas
   - Sucessos e falhas
   - Erros de quota

2. Atualizar a Edge Function `process-indexing-queue` para:
   - Detectar erro de quota e parar o processamento
   - Registrar estatísticas na nova tabela
   - Logar informações detalhadas

### Fase 3: Adicionar Ação de Requeue Semanal

**Objetivo:** Garantir que todas as páginas sejam reindexadas periodicamente.

**Ações:**
1. Criar CRON job semanal (`0 5 * * 1` - segundas às 2h BRT) para:
   - Chamar `google-search-console` com action `queue-all-pages`
   - Popular a fila com todas as URLs do site

### Fase 4: Melhorar Feedback no Painel Admin

**Objetivo:** Mostrar status da indexação de forma mais clara.

**Ações:**
1. Adicionar card de "Próximo Processamento" no SEOIndexingAuditor
2. Mostrar estatísticas do último processamento
3. Botão para forçar requeue de todas as páginas

---

## Custom Knowledge: Prompt Padrão para Indexação

```text
#GOOGLE_INDEXING_AUTOMATION

## Sistema de Indexação Automatizada

O projeto Contabilidade Zen possui um sistema automatizado de indexação no Google que funciona da seguinte forma:

### Arquitetura

1. **Tabela indexing_queue**
   - Armazena URLs pendentes de indexação
   - Status: pending, completed, failed
   - Retry automático até 3 tentativas

2. **Edge Functions**
   - `process-indexing-queue`: Processa a fila e envia URLs ao Google Indexing API
   - `google-search-console`: Funções de auditoria, sitemap e queue

3. **CRON Jobs Ativos**
   - `process-indexing-queue`: Diariamente às 6h UTC (3h BRT)
   - `queue-all-pages`: Semanalmente às segundas 5h UTC (2h BRT)

### Fluxo Automático

1. **Blog Posts**: Quando um post é publicado, o trigger `queue_indexing_request` adiciona automaticamente à fila
2. **Páginas Estáticas**: O CRON semanal repopula a fila com todas as páginas
3. **Processamento**: O CRON diário processa até 200 URLs (limite da API)

### Secrets Necessários

- `GOOGLE_SERVICE_ACCOUNT_JSON`: Credenciais da Service Account com permissão de Owner no Search Console
- `GOOGLE_SEARCH_CONSOLE_SITE_URL`: URL canônica do site (https://www.contabilidadezen.com.br)

### Monitoramento

- Painel Admin > Analytics > SEO & Indexação
- Tab "Fila Automática" mostra status de cada URL
- Tab "Relatório Histórico" mostra estatísticas

### Manutenção

Ao criar nova página pública:
1. Adicionar ao array `staticPages` em `supabase/functions/sitemap/index.ts`
2. Adicionar ao array `staticPages` em `supabase/functions/google-search-console/index.ts` (action queue-all-pages)
3. O CRON semanal incluirá automaticamente na próxima execução

Ao remover página:
1. Remover dos arrays acima
2. Chamar action `queue-all-pages` para recriar a fila sem a página removida

### Troubleshooting

**Erro "Permission denied"**
- Verificar se Service Account tem permissão de Owner no Google Search Console
- Verificar se `GOOGLE_SEARCH_CONSOLE_SITE_URL` está com o domínio correto (www vs non-www)

**Erro "Quota exceeded"**
- Normal quando ultrapassa 200 URLs/dia
- Aguardar renovação da quota no próximo dia
- URLs pendentes serão processadas automaticamente

**URLs não indexando**
- Verificar se URL está no sitemap
- Verificar se página não tem noindex
- Usar Tab "Auditoria Manual" para diagnóstico detalhado
```

---

## Arquivos a Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/functions/process-indexing-queue/index.ts` | Editar | Adicionar detecção de quota e logging melhorado |
| `src/components/admin/SEOIndexingAuditor.tsx` | Editar | Adicionar botão "Requeue All Pages" e estatísticas |
| Migração SQL | Criar | Atualizar CRON job para rodar 1x/dia + adicionar CRON semanal |
| Migração SQL | Criar | Tabela `indexing_stats` para métricas |

---

## Resumo de CRON Jobs Finais

| Job | Schedule | Descrição |
|-----|----------|-----------|
| `process-indexing-queue` | `0 6 * * *` | Processa fila diariamente às 3h BRT |
| `queue-all-pages-weekly` | `0 5 * * 1` | Repopula fila às segundas 2h BRT |
| `suggest-geo-topics-weekly` | `0 11 * * 1` | Sugere tópicos de blog (já existe) |
| `generate-geo-content-daily` | `0 9 * * *` | Gera conteúdo do blog (já existe) |
| `publish-scheduled-blog-posts` | `* * * * *` | Publica posts agendados (já existe) |

---

## Benefícios

1. **Menos desperdício de quota**: Processar 1x/dia em vez de a cada 30min
2. **Cobertura completa**: Requeue semanal garante que novas páginas sejam incluídas
3. **Visibilidade**: Estatísticas e logs para monitorar saúde da indexação
4. **Automação total**: Zero intervenção manual necessária para manter indexação em dia
5. **Custom Knowledge**: Documentação permanente para futuras manutenções
