

# Criar 3 Artigos Pilares com Topic Clusters

## Estrategia

Gerar 3 artigos pilares (1500+ palavras cada) via script com IA e inserir no banco, depois vincular posts existentes como clusters apontando para cada pilar.

---

## Pilar 1: Contabilidade PJ para Profissionais da Saude

**Titulo:** "Guia Completo de Contabilidade PJ para Profissionais da Saúde em 2026"
**Cluster posts vinculados (cluster_id → ID do pilar):**
- Contabilidade para médicos, dentistas e psicólogos PJ em 2026
- Contabilidade para psicólogos e psiquiatras em 2026
- Abra seu CNPJ: A Escolha Estratégica da Contabilidade Online
- Pró-Labore Médico Sócio 2025: IR e Contabilidade
- Pró-Labore Médicos Coworking: Tributação 2026
- Planilha simples de impostos para médico, dentista e psicólogo 2026
- Checklist Obrigações Fiscais Clínicas Psicologia 2025
- Planejamento tributário 2026 para médicos e clínicas
- Holding Médica 2025: Tributação e Planejamento Sucessório

## Pilar 2: Simples Nacional para Profissionais da Saude

**Titulo:** "Simples Nacional para Profissionais da Saúde: Guia Definitivo 2026"
**Cluster posts vinculados:**
- Simples Nacional ou Lucro Presumido para médicos em 2025
- Simples Nacional vs Lucro Presumido para Psicólogos 2026
- Simples Nacional Psicólogos PJ 2026: Alíquotas e Limites
- Lucro Presumido x Lucro Real para clínicas em 2026
- Lucro Real vs Presumido: Dentistas 2025
- Carga tributária efetiva para médicos PJ em 2026
- CLT vs PJ Dentista Médico: Custos, Impostos e Contribuições 2025
- Médico CLT ou PJ em 2025? Comparação tributária completa
- como reduzir impostos médico pessoa jurídica

## Pilar 3: Como Abrir Empresa na Area da Saude

**Titulo:** "Como Abrir Empresa na Área da Saúde em 2026: Passo a Passo Completo"
**Cluster posts vinculados:**
- Como abrir empresa para médico, dentista e psicólogo em 2026
- Médico Recém-Formado: Abra CNPJ 2025 Passo a Passo
- Dicas para fisioterapeuta abrir empresa em 2026
- Melhor CNAE para médico, dentista e psicólogo em 2026
- Obrigações Acessórias 2025: Clínicas Médicas SP
- NFS-e nacional para profissionais de saúde: regras 2026-2027
- Tributação PJ médico 2025: Simples, Presumido ou Real?

---

## Execucao Tecnica

1. **Gerar conteudo via script** — Usar o AI Gateway (`lovable_ai.py`) para gerar cada artigo pilar com 1500+ palavras em markdown, incluindo FAQ schema, expert quotes, meta tags
2. **Inserir os 3 pilares no banco** — INSERT na tabela `blog_posts` com `is_pillar = true`, `status = 'published'`, conteudo completo
3. **Vincular clusters** — UPDATE dos posts existentes setando `cluster_id` = ID do pilar correspondente
4. **Total:** 3 INSERTs + ~25 UPDATEs

