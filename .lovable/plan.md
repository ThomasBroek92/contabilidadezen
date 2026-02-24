

# Esconder HTML Estatico do Usuario (Manter para Crawlers)

## Problema

O conteudo HTML estatico dentro do `<div id="root">` no `index.html` pode aparecer brevemente para o usuario antes do React montar e substituir o conteudo (flash of unstyled content). Esse conteudo existe apenas para crawlers que nao executam JavaScript.

## Solucao

Adicionar um bloco CSS inline no `<head>` do `index.html` que esconde visualmente o conteudo estatico do `#root` ate que o React monte. A tecnica usa `visibility: hidden` + `opacity: 0` para que:

- O usuario **nunca veja** o HTML estatico (invisivel desde o primeiro frame)
- Os **crawlers sem JS** continuem lendo o conteudo normalmente (crawlers ignoram CSS visual)
- O **React**, ao montar, substitui todo o conteudo do `#root` e o CSS deixa de se aplicar

## Implementacao

### Arquivo: `index.html`

Adicionar um `<style>` no `<head>` com a seguinte regra:

```css
#root:not(:empty) {
  visibility: hidden;
  opacity: 0;
  height: 0;
  overflow: hidden;
}
#root[data-reactroot],
#root > [data-reactroot] {
  visibility: visible;
  opacity: 1;
  height: auto;
  overflow: visible;
}
```

**Abordagem alternativa mais simples e confiavel:** Como o React ao montar substitui todo o innerHTML do `#root`, podemos usar uma classe CSS que e removida via JavaScript inline minimo logo apos o React iniciar:

```text
1. No <style> do <head>:
   .static-prerender { visibility: hidden; height: 0; overflow: hidden; }

2. No conteudo estatico do #root:
   Envolver tudo em <div class="static-prerender">

3. O React, ao montar via createRoot().render(), substitui 
   automaticamente todo o conteudo, eliminando a classe.
```

Esta segunda abordagem e a mais segura porque:
- Nao depende de atributos internos do React (`data-reactroot`)
- Funciona com `createRoot` (React 18+)
- Zero risco de o conteudo piscar

## Detalhes Tecnicos

- **Apenas 1 arquivo alterado**: `index.html`
- **Mudancas**:
  1. Adicionar 1 regra CSS no bloco `<style>` existente no `<head>`
  2. Adicionar `class="static-prerender"` nos elementos estaticos dentro do `#root` (header, main, footer)
- **Sem impacto em performance**: CSS inline, zero JS adicional
- **Crawlers nao afetados**: bots como Googlebot ignoram `visibility: hidden` e leem o DOM normalmente

