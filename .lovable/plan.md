

## Implementação: Opção B — Wildcard Route para Cidades

### Alteração 1: `src/App.tsx`

Linha ~107, mudar de:
```tsx
<Route path="/contabilidade-em-:slug" element={<CidadeLandingPage />} />
```
Para:
```tsx
<Route path="/contabilidade-em-*" element={<CidadeLandingPage />} />
```

### Alteração 2: `src/pages/cidades/CidadeLandingPage.tsx`

Mudar extração do slug de `useParams<{ slug: string }>()` para:
```tsx
const { "*": splatSlug } = useParams();
const slug = splatSlug || "";
```

O resto do componente permanece igual — `citiesConfigMap[slug]` continua funcionando.

### Resultado
- URLs mantidas: `/contabilidade-em-americana`, `/contabilidade-em-campinas`, etc.
- Template renderiza corretamente com Header, Form, FAQs
- Zero impacto em SEO, sitemap ou prerender

