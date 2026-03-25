

# Limpar Testes + Otimizar e Publicar Drafts Prioritarios

## Escopo

### Acao 1: Deletar posts de teste (custo zero)
Remover 2 posts publicados que prejudicam o SEO:
- `teste` (id: `ab7ced98-...`, GEO 0)
- `teste 2` (id: `f293140b-...`, GEO 0)

Executar via insert tool com DELETE.

### Acao 2: Otimizar e publicar 4 drafts prioritarios

Os 4 posts que voce mencionou, todos com GEO 45 atualmente:

| Post | Slug | GEO Atual |
|------|------|-----------|
| Tributacao Plantao Medico 2025 | `tributacao-plantao-medico-2025-rpa-vs-clt-vs-pj-vs-coop` | 45 |
| Lucro Presumido vs Real para Dentistas 2026 | `lucro-presumido-vs-real-para-dentistas-2026-impostos` | 45 |
| Tributacao Telemedicina Medicos PJ 2025 | `tributacao-telemedicina-medicos-pj-2025-brasil` | 45 |
| Erros Contabeis em Saude 2025 | `erros-contabeis-em-saude-2025-multas-para-medicos-e-dentistas` | 45 |

Para cada post:
1. Chamar a edge function `optimize-content` para elevar o GEO score (meta: 70+)
2. Atualizar status para `published` e `editorial_status` para `published`
3. Definir `published_at` como agora
4. Isso dispara automaticamente o trigger `queue_indexing_request` para indexacao no Google

### Acao 3 (bonus): Publicar o melhor draft adicional
- "Abrindo Seu CNPJ em 2026" ja tem GEO 75 — pronto para publicar sem otimizacao

## Passos de implementacao

1. DELETE dos 2 posts de teste via insert tool
2. Invocar `optimize-content` para cada um dos 4 posts prioritarios via edge function
3. UPDATE status → published para os 4 posts otimizados + o post GEO 75
4. Confirmar que os 5 posts aparecem na fila de indexacao

## Resultado esperado
- 2 posts lixo removidos
- 5 novos posts publicados (4 otimizados + 1 ja pronto)
- Todos enviados automaticamente para indexacao no Google

