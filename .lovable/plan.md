
# Plano: Otimizacao SEO do Blog - Hierarquia de Headings + Deep Links

## Objetivo
Corrigir a hierarquia de headings (H1/H2/H3) no conteudo do blog para que o Google interprete corretamente a estrutura semantica, e adicionar IDs automaticos nos headings para deep linking. Tambem adicionar essa regra a base de conhecimento do projeto.

## O que muda

### 1. Corrigir MarkdownRenderer (`src/components/blog/MarkdownRenderer.tsx`)

**Problema atual:** O componente rebaixa TODOS os headings em 1 nivel:
- `# Titulo` (H1 no Markdown) -> renderiza `<h2>` (correto, pois H1 e o titulo do post)
- `## Subtitulo` (H2 no Markdown) -> renderiza `<h3>` (ERRADO - deveria ser `<h2>`)
- `### Sub-sub` (H3 no Markdown) -> renderiza `<h4>` (ERRADO - deveria ser `<h3>`)

**Correcao:**
- `h1` no Markdown -> `<h2>` (manter, pois H1 ja existe no titulo do post)
- `h2` no Markdown -> `<h2>` (corrigir: era `<h3>`)
- `h3` no Markdown -> `<h3>` (corrigir: era `<h4>`)

**Adicionar IDs automaticos** em cada heading para deep linking:
- Texto "Como abrir empresa" -> `id="como-abrir-empresa"`
- Permite links diretos como `/blog/meu-post#como-abrir-empresa`
- Melhora crawlability e permite o Google exibir links de secao nos resultados

**Melhorar links internos:**
- Links para o proprio dominio (`contabilidadezen.com.br`) nao devem abrir em nova aba
- Apenas links externos usam `target="_blank"`

### 2. Adicionar regra a base de conhecimento

Adicionar ao Custom Knowledge a regra `#BLOG_HEADING_RULES` para que futuras alteracoes mantenham a hierarquia correta.

## Detalhes Tecnicos

### Arquivo: `src/components/blog/MarkdownRenderer.tsx`

Funcao helper para gerar slug do heading:
```text
function generateHeadingId(text: string): string
  - Converte children React para string
  - Remove acentos, lowercase, substitui espacos por hifens
  - Remove caracteres especiais
```

Mapeamento corrigido:
```text
h1 -> <h2 id="slug"> (Markdown # dentro do conteudo)
h2 -> <h2 id="slug"> (Markdown ## - CORRIGIDO de <h3>)
h3 -> <h3 id="slug"> (Markdown ### - CORRIGIDO de <h4>)
```

Links inteligentes:
```text
Se href contem "contabilidadezen.com.br" ou comeca com "/":
  -> sem target="_blank", sem rel="noopener noreferrer"
Senao:
  -> target="_blank" rel="noopener noreferrer"
```

### Nenhum outro arquivo precisa ser alterado

A pagina `BlogPost.tsx` ja possui:
- H1 correto no titulo do post (linha 250)
- Tag `<article>` semantica (linha 309)
- Breadcrumbs com schema (linha 206)
- SEO completo via `BlogPostSEO`

### Impacto esperado

- Google entende a hierarquia: H1 (titulo) > H2 (secoes) > H3 (subsecoes)
- Deep links permitem resultados com "jump to" no Google
- Links internos mantem o usuario no site (sem nova aba desnecessaria)
