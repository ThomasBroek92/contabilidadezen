

# Plano: Implementar Scroll to Top Automatico em Navegacao

## Problema Identificado

Quando o usuario clica em um link ou botao que navega para outra pagina do site, a nova pagina abre na mesma posicao de scroll da pagina anterior, em vez de abrir no topo. Isso acontece porque o React Router mantem a posicao de scroll entre navegacoes por padrao.

## Solucao

Criar um componente `ScrollToTop` que escuta mudancas de rota e automaticamente rola a pagina para o topo. Este componente sera adicionado ao `App.tsx` e funcionara globalmente para todas as rotas.

---

## Arquivos a Criar/Modificar

### 1. CRIAR: `src/components/ScrollToTop.tsx`

Componente simples que usa `useLocation` do React Router para detectar mudancas de rota e executar `window.scrollTo(0, 0)`.

```text
+------------------------------------------+
|  ScrollToTop Component                   |
+------------------------------------------+
|  - Importa useLocation e useEffect       |
|  - Escuta mudancas em location.pathname  |
|  - Executa window.scrollTo(0, 0)         |
|  - Retorna null (nao renderiza nada)     |
+------------------------------------------+
```

### 2. MODIFICAR: `src/App.tsx`

Importar e adicionar o componente `ScrollToTop` dentro do `BrowserRouter`, junto com o `AnalyticsTracker`.

```text
ANTES (linha 82-83):
          </Routes>
          <AnalyticsTracker />

DEPOIS:
          </Routes>
          <ScrollToTop />
          <AnalyticsTracker />
```

---

## Implementacao Tecnica

### Componente ScrollToTop

```typescript
// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll para o topo quando a rota mudar
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
```

### Consideracoes

1. **Comportamento padrao**: Scroll instantaneo para o topo (sem animacao), pois o usuario espera ver o inicio da nova pagina imediatamente.

2. **Excecao para hash links**: Se a URL contiver um hash (ex: `/pagina#secao`), o navegador cuida do scroll para o elemento. O componente nao interfere com esse comportamento nativo.

3. **Back/Forward do navegador**: O componente rola para o topo mesmo ao usar os botoes voltar/avancar. Se preferir manter a posicao ao voltar, podemos usar `scrollRestoration: 'manual'` do History API.

---

## Ordem de Implementacao

1. Criar arquivo `src/components/ScrollToTop.tsx`
2. Importar e adicionar ao `src/App.tsx`
3. Testar navegacao entre paginas

---

## Atualizacao do Custom Knowledge

Apos a implementacao, o seguinte sera adicionado ao Custom Knowledge do projeto para evitar que este problema ocorra novamente:

```text
#NAVIGATION_SCROLL_RULES

## Regras de Navegacao e Scroll

1. **Scroll to Top Automatico**
   - O componente ScrollToTop.tsx garante que toda navegacao inicia no topo da pagina
   - Localizado em: src/components/ScrollToTop.tsx
   - Adicionado ao App.tsx dentro do BrowserRouter

2. **NUNCA remover o ScrollToTop**
   - Este componente e essencial para UX
   - Sem ele, paginas abrem no meio do scroll

3. **Smooth scroll interno**
   - Para scroll dentro da mesma pagina, usar scrollIntoView({ behavior: "smooth" })
   - Exemplo: document.getElementById("secao")?.scrollIntoView({ behavior: "smooth" })

4. **Hash links**
   - Links com # (ex: /pagina#faq) funcionam normalmente
   - O navegador cuida do scroll para o elemento com id correspondente
```

---

## Resultado Esperado

- Todas as navegacoes via Link, navigate(), ou clique em botoes que mudam de rota iniciarao no topo da pagina
- Comportamento consistente em todo o site
- Diretriz documentada para manutencao futura

