

# Plano: Conteudo HTML Visivel para Crawlers (Dentro do #root)

## Problema Real

O bloco `<noscript>` so e exibido quando o navegador tem JavaScript **desabilitado**. Crawlers como Googlebot, bots de redes sociais e simuladores de crawl **nao ativam** `<noscript>` -- eles simplesmente nao executam o JS, mas o HTML dentro de `<noscript>` continua oculto. Por isso o simulador mostra "0 words visible".

## Solucao

Mover o conteudo semantico para **dentro do `<div id="root">`** como HTML real. Quando o React monta, ele substitui automaticamente todo o conteudo do `#root` pelo app renderizado. Crawlers que nao executam JS verao o HTML estatico; usuarios reais verao o React normalmente.

## O que sera feito

### 1. Alterar `index.html`

**Dentro de `<div id="root">`**, inserir conteudo semantico completo:

```text
<div id="root">
  <!-- Conteudo estatico para crawlers - React substitui ao montar -->
  <header>...</header>
  <main>
    <h1>Contabilidade Zen - Contabilidade Digital Especializada</h1>
    <p>Descricao dos servicos...</p>
    <h2>Servicos</h2>
    <ul>links internos...</ul>
    <h2>Segmentos</h2>
    <ul>links internos...</ul>
    <h2>Ferramentas Gratuitas</h2>
    <ul>links internos...</ul>
    <h2>FAQ</h2>
    <details>perguntas e respostas...</details>
    <h2>Contato</h2>
    <p>NAP + WhatsApp</p>
  </main>
  <footer>...</footer>
</div>
```

O conteudo incluira:
- H1 com nome da empresa e proposta de valor
- Paragrafo descritivo (rich snippet friendly)
- Lista de servicos com links internos
- Lista de segmentos com links internos
- Ferramentas gratuitas com links
- 6 FAQs com `<details>/<summary>` (escaneavel por crawlers)
- Informacoes de contato (NAP para SEO local)
- Links para redes sociais (Instagram, LinkedIn)
- Links legais (politica de privacidade, termos)

### 2. Manter o `<noscript>` existente

O bloco `<noscript>` permanece como fallback adicional para navegadores com JS desabilitado.

### 3. Atualizar a regra na base de conhecimento

Atualizar `#CRAWLER_VISIBILITY_RULES` para incluir:
- Toda nova pagina publica deve ter seus links adicionados ao HTML estatico dentro do `#root`
- O conteudo dentro do `#root` e substituido pelo React ao montar -- nao afeta usuarios
- Manter sincronizado com as rotas do `App.tsx`

## Detalhes Tecnicos

### Por que funciona

React usa `createRoot(document.getElementById("root")!).render(...)` que **substitui** todo o conteudo HTML filho do `#root` pelo virtual DOM. Isso significa:

1. Crawler chega, nao executa JS -> ve o HTML estatico dentro do `#root`
2. Usuario chega, JS executa -> React substitui pelo app completo
3. Zero impacto na performance ou UX

### Arquivos alterados

- `index.html` -- conteudo semantico dentro do `#root`

### Impacto esperado

- De 0 palavras visiveis para ~200+ palavras
- Headings detectaveis (H1, H2)
- Links internos descobriveis por crawlers
- FAQs visiveis para extração de rich snippets
- NAP visivel para SEO local
- Score SEO deve subir significativamente no crawler simulator

