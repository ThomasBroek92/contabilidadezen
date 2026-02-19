

# Plano: Limpar index.html e Remover Dependencia de Pre-rendering Externo

## Contexto

O site nao utilizara o servico LovableHTML. A estrategia de SEO sera 100% baseada no que ja temos:
- Conteudo estatico dentro do `#root` (crawlers de busca veem o HTML)
- `react-helmet-async` + `SEOHead` para meta tags dinamicas (usuarios com JS)
- `llm.html` para bots de IA
- `robots.txt` com permissoes para bots

## O que sera feito

### 1. Limpar meta tags conflitantes do `index.html`

Remover tags que o `SEOHead` ja gera por pagina, eliminando duplicatas:

**Remover (14 tags):**
- `<title>` (linha 18)
- `<meta name="description">` (linha 19)
- `<meta name="keywords">` (linha 20)
- `<meta name="author">` (linha 21)
- `<link rel="canonical">` (linha 22) -- **critico**, canonical duplicado confunde crawlers
- `<meta property="og:title">` (linha 24)
- `<meta property="og:description">` (linha 25)
- `<meta property="og:type">` (linha 26)
- `<meta property="og:url">` (linha 27)
- `<meta property="og:image">` (linha 28)
- `<meta name="twitter:card">` (linha 32)
- `<meta name="twitter:title">` (linha 33)
- `<meta name="twitter:description">` (linha 34)
- `<meta name="robots">` (linha 36)

**Manter:**
- `<meta charset>`, `<meta viewport>` -- essenciais
- `<meta property="og:locale">` -- sempre pt_BR, nao conflita
- `<meta property="og:site_name">` -- sempre "Contabilidade Zen", nao conflita
- `<meta name="theme-color">` -- global
- Preconnects, favicons, fontes, preload hero

### 2. Manter tudo que ja funciona sem servico externo

- Conteudo semantico dentro do `#root` (H1, H2, links, FAQs, NAP) -- crawlers de busca como o Googlebot (que executa JS parcialmente) e crawlers simples ja veem esse conteudo
- `public/llm.html` -- bots de IA acessam diretamente
- `public/robots.txt` -- permissoes para bots de IA ja configuradas
- `SEOHead` em todas as paginas -- usuarios e Googlebot (que executa JS) veem meta tags corretas

### 3. Limitacao conhecida (sem pre-rendering)

Bots de redes sociais (WhatsApp, Telegram, LinkedIn, Twitter) **nao executam JS**. Sem pre-rendering, eles verao apenas as tags estaticas do `index.html`. Como estamos removendo as tags estaticas, precisamos manter um **fallback minimo** para social previews.

**Solucao: manter `og:image` estatico como fallback**

Vamos manter **apenas** estas tags OG estaticas no `index.html` como fallback para bots sociais:
- `<meta property="og:image">` -- imagem padrao da marca
- `<meta property="og:site_name">` -- ja mantido
- `<meta property="og:locale">` -- ja mantido

O `SEOHead` sobrescrevera essas tags quando o JS executar (para Googlebot e usuarios reais). Para bots sociais, o preview mostrara a imagem da marca + o titulo/descricao que o `react-helmet-async` definir no `<head>` estatico (nao funciona para bots sem JS, mas e o melhor possivel sem pre-rendering).

## Detalhes Tecnicos

### Resultado final do `<head>` no `index.html`

```text
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!-- preconnects, dns-prefetch, preload -->
<!-- favicons -->
<meta property="og:image" content="https://www.contabilidadezen.com.br/og-image.png" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:site_name" content="Contabilidade Zen" />
<meta name="theme-color" content="#2d3748" />
<!-- font-face styles -->
```

### Arquivo alterado

- `index.html` -- remover 11 linhas de meta tags conflitantes (manter og:image como fallback social)

### Arquivos nao alterados (ja estao corretos)

- `public/llm.html` -- OK
- `public/robots.txt` -- OK (remover mencoes a LovableHTML na base de conhecimento)
- `src/components/SEOHead.tsx` -- OK
- Conteudo estatico dentro do `#root` -- OK

### Impacto

| Cenario | Resultado |
|---------|-----------|
| Googlebot (executa JS) | Meta tags corretas via SEOHead |
| Googlebot (HTML puro) | Conteudo semantico do #root visivel |
| Bots de IA (GPTBot, Claude) | llm.html + conteudo do #root |
| Bots sociais (WhatsApp, LinkedIn) | og:image da marca (generico) |
| Usuarios reais | React app completo com SEOHead |

