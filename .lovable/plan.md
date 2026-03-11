

# Comparativo: Padrões Google vs. Implementação do Blog

## Resumo dos 3 Estágios do Google

Segundo a documentação oficial, o Google funciona em 3 etapas:
1. **Rastreamento** — Descoberta de URLs via links internos e sitemaps; executa JavaScript para renderizar
2. **Indexação** — Análise de conteúdo, `<title>`, metas, imagens; seleção de página canônica; descarte de conteúdo duplicado ou de baixa qualidade
3. **Exibição** — Ranqueamento baseado em relevância, qualidade, localização, dispositivo

## Diagnóstico: O que pode estar impedindo a indexação

### 1. CONTEÚDO DUPLICADO / BAIXA ORIGINALIDADE (Problema Crítico)

**O que o Google diz:** "Durante a indexação, o Google determina se uma página é canônica ou uma cópia de outra na Internet." Conteúdo duplicado é agrupado em clusters e apenas a canônica aparece.

**Nosso problema:** O Blog Copier copia artigos de concorrentes e reescreve com IA. O Google é extremamente bom em detectar conteúdo derivativo/reformulado. Se o conteúdo não adicionar valor substancial em relação à fonte original, o Google pode:
- Considerar o post como "cópia" e não indexar
- Selecionar o artigo original do concorrente como canônico
- Classificar como "conteúdo de baixa qualidade"

**Evidência:** A documentação afirma explicitamente: "Baixa qualidade do conteúdo na página" é um dos motivos de não-indexação.

### 2. RENDERIZAÇÃO JAVASCRIPT / SPA (Parcialmente Resolvido)

**O que o Google diz:** "O Google renderiza a página e executa JavaScript... A renderização é importante porque os sites dependem do JavaScript para exibir conteúdo."

**Nosso estado:** Temos 3 camadas de pre-rendering (SEO4Ajax, SSG com Puppeteer, fallback estático). Isso está bem coberto. No entanto, o SSG do blog depende de o Puppeteer aguardar dados assíncronos do banco — se a query falhar ou demorar, o HTML pré-renderizado pode ficar vazio.

### 3. LINKS INTERNOS PARA POSTS (Problema Moderado)

**O que o Google diz:** "Páginas são descobertas quando o Google extrai um link de uma página conhecida para uma nova." A homepage e a navegação são fundamentais.

**Nosso problema:** 
- A página `/blog` lista posts dinamicamente via JS. Se o Googlebot não renderizar JS (primeira passada), não vê nenhum link para posts individuais
- O `index.html` tem apenas 12 links estáticos de blog no `<noscript>` — se temos dezenas de posts, a maioria não tem caminho de descoberta estático
- O Footer e o Header não linkam para posts específicos
- Não há paginação estática — é uma lista "infinita" carregada via JS

### 4. SITEMAP (OK, mas com ressalvas)

**O que o Google diz:** Sitemaps ajudam na descoberta mas não garantem indexação.

**Nosso estado:** Sitemap dinâmico com todos os posts publicados. Está correto. Mas o Google usa o sitemap como sugestão, não obrigação. Se ao visitar a URL o conteúdo for fraco, não indexa.

### 5. CANONICALS (OK)

Posts têm canonical correto via SEOHead apontando para `www.contabilidadezen.com.br`.

### 6. CRAWL BUDGET / VOLUME DE PÁGINAS (Problema Potencial)

**O que o Google diz:** "O Googlebot usa algoritmos para determinar quais sites rastrear, com que frequência e quantas páginas."

**Nosso problema:** O site tem ~130+ rotas estáticas (cidades, segmentos, ferramentas) + posts de blog. Para um site relativamente novo/pequeno, esse volume pode diluir o crawl budget. O Google pode priorizar páginas "mais importantes" e ignorar posts de blog.

---

## Tabela Comparativa

```text
┌──────────────────────────┬────────────────────────────┬────────────────────┐
│ Requisito Google         │ Estado Atual               │ Risco              │
├──────────────────────────┼────────────────────────────┼────────────────────┤
│ Conteúdo original/útil   │ Reescrita IA de concorrente│ CRÍTICO            │
│ Renderização JS          │ 3 camadas pre-render       │ Baixo              │
│ Links internos estáticos │ Apenas 12 no noscript      │ ALTO               │
│ Sitemap com posts        │ Dinâmico e atualizado      │ Baixo              │
│ Canonical correto        │ Sim (www)                  │ Baixo              │
│ Meta title/description   │ Sim, gerados por IA        │ Baixo              │
│ Structured Data          │ BlogPosting + FAQPage      │ Baixo              │
│ Mobile-friendly          │ Sim (responsive)           │ Baixo              │
│ Velocidade/Core Vitals   │ Code-split + lazy load     │ Médio              │
│ Crawl budget             │ 130+ rotas + blog          │ Médio              │
│ Freshness signals        │ freshness_date presente    │ Baixo              │
│ Link /blog → posts       │ Só via JS (sem HTML)       │ ALTO               │
└──────────────────────────┴────────────────────────────┴────────────────────┘
```

## Plano de Correção (3 ações de impacto)

### Ação 1: Melhorar links internos estáticos no `index.html`
Aumentar o bloco `<noscript>` e o fallback dentro do `#root` para incluir mais posts do blog com links diretos. Atualizar via script no CI/CD.

### Ação 2: Página `/blog` com HTML estático de fallback
O pre-render via Puppeteer já cobre isso, mas garantir que o HTML gerado contenha `<a href>` para cada post visível. Verificar que o SSG está produzindo HTML com links reais.

### Ação 3: Qualidade do conteúdo (mais importante, mas não é código)
O Google não indexa conteúdo que considera cópia ou sem valor adicional. As ações técnicas acima ajudam na **descoberta**, mas o **ranqueamento** depende da qualidade real do conteúdo. Recomendações:
- Adicionar dados proprietários (calculadoras, tabelas, exemplos reais)
- Incluir internal linking entre posts (cada post linka 2-3 outros)
- Garantir que cada post tenha perspectiva única, não apenas reformulação

---

**As ações 1 e 2 são implementáveis em código. A ação 3 é estratégica/editorial.**

Deseja que eu implemente as ações 1 e 2?

