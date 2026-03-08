

## Diagnóstico Definitivo

**Causa raiz confirmada**: React Router v6 converte `/contabilidade-em-*` para `/contabilidade-em-/*` (exige `/` antes de `*`). Isso significa que a rota só faz match em `/contabilidade-em-/americana` (com barra extra), **nunca** em `/contabilidade-em-americana`.

O console log confirma:
```
Route path "/contabilidade-em-*" will be treated as if it were "/contabilidade-em-/*"
```

A abordagem anterior com `useLocation()` no componente CidadeLandingPage funciona para extrair o slug, **mas o componente nunca é montado** porque o React Router nunca faz match na rota.

## Solução: Catch-All Inteligente

Remover a rota `/contabilidade-em-*` e mover a lógica para o catch-all `*`, criando um componente `CatchAllHandler` que decide entre: cidade, redirect legado, ou 404.

### Alteração 1: `src/App.tsx`

- Remover linha 107: `<Route path="/contabilidade-em-*" element={<CidadeLandingPage />} />`
- Substituir as duas rotas catch-all (linhas 116-117) por uma única:
```tsx
<Route path="*" element={<CatchAllHandler />} />
```
- Criar/importar `CatchAllHandler` como lazy component

### Alteração 2: Criar `src/components/CatchAllHandler.tsx`

Componente que usa `useLocation()` para decidir:

```tsx
export default function CatchAllHandler() {
  const location = useLocation();
  const path = location.pathname;

  // 1. Verifica se é rota de cidade
  const cityMatch = path.match(/^\/contabilidade-em-(.+)$/);
  if (cityMatch) {
    const slug = cityMatch[1];
    const city = citiesConfigMap[slug];
    if (city) return <CidadeLandingPage />;
  }

  // 2. Verifica se é redirect legado
  const legacyTarget = getLegacyRedirect(path);
  if (legacyTarget) return <Navigate to={legacyTarget} replace />;

  // 3. Senão, 404
  return <NotFound />;
}
```

### Alteração 3: `src/components/LegacyRedirects.tsx`

Exportar a função de lookup como `getLegacyRedirect(path): string | null` para ser usada pelo CatchAllHandler. O componente `LegacyRedirects` em si deixa de ser necessário como Route.

### Arquivos alterados
| Arquivo | O que muda |
|---------|-----------|
| `src/components/CatchAllHandler.tsx` | Novo componente |
| `src/App.tsx` | Remove rota `contabilidade-em-*`, substitui 2 catch-alls por 1 |
| `src/components/LegacyRedirects.tsx` | Exporta `getLegacyRedirect()` |
| `src/pages/cidades/CidadeLandingPage.tsx` | Nenhuma mudança necessária (já usa `useLocation`) |

### Resultado esperado
- `/contabilidade-em-americana` renderiza corretamente com Header, Form, FAQs, etc.
- Redirects legados continuam funcionando
- 404 continua funcionando para URLs inválidas
- Zero impacto em SEO, sitemap ou prerender

