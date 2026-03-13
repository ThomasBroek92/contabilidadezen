

# Insights do Playbook de SEO da Conversion vs. Implementação Atual

## O que o Playbook Recomenda vs. O que Temos

O Playbook da Conversion é um framework estratégico de SEO dividido em 4 pilares: Diagnóstico de Negócio, Topical Authority, Estratégia e Plano Tático. Abaixo, os gaps mais relevantes e ações implementáveis.

---

## 1. TOPICAL AUTHORITY (Topic Clusters) — Gap Crítico

**O que o Playbook diz:** Construir autoridade com "Post Pilar" + "Posts Cluster" interconectados por links internos, cobrindo topo, meio e fundo de funil.

**Nosso estado:** Os posts do blog são ilhas isoladas. Cada artigo tem links para "Artigos relacionados" (mesma categoria), mas não há:
- Posts pilares definidos (guias completos e profundos)
- Estrutura de cluster com links internos sistemáticos entre posts
- Conteúdo para cada estágio do funil (topo = educativo, meio = comparativo, fundo = conversão)

**Ação implementável:**
- Adicionar um campo `cluster_id` e `is_pillar` na tabela `blog_posts`
- Na página de um post pilar, listar automaticamente todos os posts do cluster
- Em cada post cluster, linkar de volta ao pilar ("Leia o guia completo sobre X")
- Isso cria o "grafo de conhecimento" que o Playbook descreve

---

## 2. INTERNAL LINKING AUTOMATIZADO — Gap Alto

**O que o Playbook diz:** Links internos são essenciais para rastreamento, indexação e distribuição de autoridade. O footer e a navegação devem conectar às páginas mais importantes.

**Nosso estado:**
- O Footer lista apenas 4 segmentos de 14
- Não há links para os "últimos artigos" no Footer
- Os posts do blog não linkam automaticamente para outros posts (exceto "relacionados" por categoria)
- A sidebar do blog tem CTAs fixos, mas zero links para posts populares

**Ações implementáveis:**
- Expandir o Footer com links para todos os 14 segmentos
- Adicionar seção "Artigos Populares" na BlogSidebar com links dinâmicos
- Implementar internal linking automático no conteúdo (substituir menções a termos-chave por links para posts/páginas relevantes)

---

## 3. ANÁLISE ON-PAGE — Gaps Moderados

**O que o Playbook recomenda revisar:** Title, Meta-description, URL, Heading Tags, Imagens, CTAs, Header, Footer.

**Nosso estado (o que está bom):**
- Title e Meta-description: otimizados via SEOHead
- URLs: limpas com slugs semânticos
- Heading Tags: hierarquia correta (h1 único, h2/h3 no conteúdo)
- CTAs: BlogCTASection no meio e fim do artigo
- Breadcrumbs: implementados com microdata

**O que falta:**
- **Imagens nos posts:** Não há `featured_image_url` renderizada no topo do artigo. O campo existe mas não é exibido. Imagens são fator de engajamento e rich results.
- **Escaneabilidade:** Não há Table of Contents (sumário) automático. O Playbook destaca "leiturabilidade/escaneabilidade". Um sumário com âncoras melhora a experiência e gera sitelinks no Google.

**Ações implementáveis:**
- Renderizar a imagem destacada no topo do BlogPost
- Gerar automaticamente um Table of Contents (TOC) a partir dos headings do Markdown

---

## 4. SEO TÉCNICO — Parcialmente Resolvido

**Os 5 pilares do Playbook:** Posicionamento, Indexação, Rastreabilidade, Renderização, Experiência.

**Nosso estado:**
- Renderização: 3 camadas (SEO4Ajax, SSG, Edge Function) — OK
- Indexação: Sitemap dinâmico + Google Indexing API — OK
- Rastreabilidade: robots.txt configurado, inject-blog-links — OK
- Experiência: Code-splitting, lazy loading — OK
- **Gap:** Não medimos Core Web Vitals sistematicamente, nem temos dashboard de performance

---

## 5. ESTRATÉGIA DE CONTEÚDO POR FUNIL — Gap Estratégico

**O que o Playbook diz:** Criar conteúdos para topo, meio e fundo de funil.

**Nosso estado:** O blog mistura tudo. Não há categorização por estágio do funil. Resultado: posts educativos ("o que é Simples Nacional") competem com posts de conversão ("como abrir empresa PJ").

**Ação implementável:**
- Adicionar campo `funnel_stage` (topo/meio/fundo) na tabela `blog_posts`
- Usar isso no editorial para garantir cobertura balanceada
- Na listagem do blog, permitir filtro por estágio

---

## 6. PRIORIZAÇÃO ICE — Metodologia para Aplicar

O Playbook usa ICE Score (Impacto + Confiança + Facilidade) para priorizar. Aplicando às ações acima:

```text
┌─────────────────────────────────┬─────────┬──────────┬───────────┬───────┐
│ Ação                            │ Impacto │ Confiança│ Facilidade│ TOTAL │
├─────────────────────────────────┼─────────┼──────────┼───────────┼───────┤
│ 1. Topic Clusters (DB + UI)     │    5    │    4     │     3     │  12