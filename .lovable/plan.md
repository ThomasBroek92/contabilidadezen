

# Plano: Implementar Correcoes de Visibilidade + Regra na Base de Conhecimento

## O que sera feito

### 1. Corrigir `index.html`

**Adicionar `og:site_name`:**
- `<meta property="og:site_name" content="Contabilidade Zen" />`

**Adicionar bloco `<noscript>`** dentro do `<body>`, antes do `<div id="root">`:
- Conteudo semantico com H1, descricao dos servicos, links internos para as paginas principais
- Informacoes de contato (NAP para SEO local)
- Invisivel para usuarios com JavaScript habilitado

### 2. Adicionar regra `#CRAWLER_VISIBILITY_RULES` a base de conhecimento

Nova secao no Custom Knowledge com as seguintes regras obrigatorias:

- Toda nova pagina publica deve ser adicionada ao bloco `<noscript>` do `index.html`
- O `index.html` deve sempre conter `og:site_name`
- Tags OG no `index.html` servem como fallback para crawlers sem JS
- O bloco `<noscript>` deve listar todas as rotas publicas com links
- Nunca remover o conteudo `<noscript>` (e o unico conteudo visivel para crawlers que nao executam JavaScript)

### Nenhum outro arquivo e alterado

Apenas `index.html` recebe as correcoes de codigo. A base de conhecimento e atualizada via Custom Knowledge do projeto.

