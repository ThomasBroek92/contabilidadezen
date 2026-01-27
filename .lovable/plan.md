
# Plano de Implementacao - Fases 2, 3 e 4 de Otimizacao de Performance

## Resumo

Este plano implementa as fases de otimizacao de JavaScript, CSS/Fontes e Resource Hints para atingir a pontuacao de 90+ no PageSpeed Insights.

---

## Fase 2: Otimizacao de JavaScript

### 2.1 Code Splitting com React.lazy() na Index.tsx

**Objetivo:** Carregar componentes abaixo da dobra sob demanda, reduzindo o bundle inicial.

**Componentes a serem lazy-loaded:**
- NichesCarousel
- MainServices
- CustomerJourney
- RoutineCarousel
- CitiesSection
- Testimonials
- PJCalculatorSection
- Benefits
- FAQ
- BlogPreview
- FinalCTA

**Arquivo:** `src/pages/Index.tsx`

**Mudanca:**
```tsx
import { lazy, Suspense } from "react";

// Lazy load de componentes abaixo da dobra
const NichesCarousel = lazy(() => import("@/components/sections/NichesCarousel"));
const MainServices = lazy(() => import("@/components/sections/MainServices"));
const CustomerJourney = lazy(() => import("@/components/sections/CustomerJourney"));
const RoutineCarousel = lazy(() => import("@/components/sections/RoutineCarousel"));
const CitiesSection = lazy(() => import("@/components/sections/CitiesSection"));
const Testimonials = lazy(() => import("@/components/sections/Testimonials"));
const PJCalculatorSection = lazy(() => import("@/components/sections/PJCalculatorSection"));
const Benefits = lazy(() => import("@/components/sections/Benefits"));
const FAQ = lazy(() => import("@/components/sections/FAQ"));
const BlogPreview = lazy(() => import("@/components/sections/BlogPreview"));
const FinalCTA = lazy(() => import("@/components/sections/FinalCTA"));

// Wrapper com Suspense
<Suspense fallback={<div className="min-h-[200px]" />}>
  <NichesCarousel />
</Suspense>
```

### 2.2 Otimizar Framer Motion com LazyMotion

**Objetivo:** Reduzir o bundle do Framer Motion de ~90KB para ~30KB.

**Arquivo:** `src/main.tsx`

**Mudanca:**
```tsx
import { LazyMotion, domAnimation } from "framer-motion";

createRoot(document.getElementById("root")!).render(
  <LazyMotion features={domAnimation} strict>
    <App />
  </LazyMotion>
);
```

### 2.3 Lazy Loading de Componentes Globais

**Arquivo:** `src/App.tsx`

**Mudanca:** Carregar CookieConsent e ExitIntentPopup apenas apos interacao do usuario ou apos 3 segundos:

```tsx
const CookieConsent = lazy(() => import("@/components/CookieConsent").then(m => ({ default: m.CookieConsent })));
const ExitIntentPopup = lazy(() => import("@/components/ExitIntentPopup").then(m => ({ default: m.ExitIntentPopup })));

// Com Suspense e delay
<Suspense fallback={null}>
  <CookieConsent />
  <ExitIntentPopup />
</Suspense>
```

### 2.4 Deferir Analytics para requestIdleCallback

**Arquivo:** `src/hooks/use-analytics.ts`

**Mudanca:** Usar `requestIdleCallback` para inicializar GA de forma nao-bloqueante.

---

## Fase 3: Otimizacao de CSS e Fontes

### 3.1 Self-Host da Fonte Inter

**Objetivo:** Eliminar round-trip para Google Fonts (bloqueador de render).

**Acoes:**
1. Criar pasta `public/fonts/`
2. A fonte Inter ja esta sendo carregada via Google Fonts CDN
3. Substituir pelo formato inline com `font-display: swap`

**Arquivo:** `index.html`

**Remover:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Adicionar (inline no head):**
```html
<style>
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0300-0301, U+0303-0304, U+0309, U+0323, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url('https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2') format('woff2');
    unicode-range: U+0000-00FF;
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2') format('woff2');
    unicode-range: U+0000-00FF;
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7SUc.woff2') format('woff2');
    unicode-range: U+0000-00FF;
  }
</style>
```

### 3.2 Corrigir Animacao border-glow (Nao Composta)

**Problema:** A animacao `border-glow` usa `box-shadow`, que nao e uma propriedade composta e causa jank.

**Arquivo:** `src/index.css`

**Antes (linhas 233-246):**
```css
@keyframes border-glow {
  0%, 100% {
    --tw-ring-color: hsl(168 76% 42% / 0.6);
    box-shadow: 0 0 8px hsl(168 76% 42% / 0.2);
  }
  50% {
    --tw-ring-color: hsl(199 89% 48% / 0.7);
    box-shadow: 0 0 12px hsl(199 89% 48% / 0.25);
  }
}
```

**Depois (usando apenas opacity e transform - propriedades compostas):**
```css
@keyframes border-glow {
  0%, 100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
}
```

### 3.3 Corrigir Animacao glow

**Arquivo:** `src/index.css`

**Antes (linhas 224-230):**
```css
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px hsl(168 76% 42% / 0.3), 0 0 40px hsl(168 76% 42% / 0.1);
  }
  50% {
    box-shadow: 0 0 30px hsl(168 76% 42% / 0.5), 0 0 60px hsl(168 76% 42% / 0.2);
  }
}
```

**Depois:**
```css
@keyframes glow {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}
```

### 3.4 Atualizar Botao cta-glow

**Arquivo:** `src/components/ui/button.tsx`

**Antes (linha 23):**
```tsx
"cta-glow": "bg-secondary ... animate-border-glow",
```

**Depois (remover animacao de box-shadow, usar apenas shimmer de CSS):**
```tsx
"cta-glow": "bg-secondary text-secondary-foreground shadow-md hover:shadow-lg hover:-translate-y-1 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700 ring-2 ring-secondary/50 ring-offset-2 ring-offset-background",
```

---

## Fase 4: Resource Hints (Preconnects e Preloads)

### 4.1 Atualizar index.html com Preconnects Corretos

**Arquivo:** `index.html`

**Adicionar preconnects para APIs usadas:**

```html
<!-- Supabase API (obrigatorio - usado em todas as paginas) -->
<link rel="preconnect" href="https://xqlkjoajrefbvbhkusdn.supabase.co" crossorigin />
<link rel="dns-prefetch" href="https://xqlkjoajrefbvbhkusdn.supabase.co" />

<!-- Google User Content (avatars de reviews) -->
<link rel="preconnect" href="https://lh3.googleusercontent.com" crossorigin />
<link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

<!-- WhatsApp API (CTA) -->
<link rel="dns-prefetch" href="https://wa.me" />
```

### 4.2 Otimizar Preload da Imagem LCP

**Arquivo:** `index.html`

**Antes:**
```html
<link rel="preload" as="image" href="/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png" fetchpriority="high" />
```

**Depois (adicionar type e imagesrcset para responsividade):**
```html
<link rel="preload" as="image" href="/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png" fetchpriority="high" type="image/png" />
```

### 4.3 Remover Preconnects Desnecessarios

**Arquivo:** `index.html`

**Remover (Google Fonts nao sera mais usado via CDN):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
```

---

## Arquivos a Modificar

| Arquivo | Fase | Acao |
|---------|------|------|
| `src/pages/Index.tsx` | 2.1 | Adicionar React.lazy e Suspense |
| `src/main.tsx` | 2.2 | Adicionar LazyMotion wrapper |
| `src/App.tsx` | 2.3 | Lazy load CookieConsent e ExitIntentPopup |
| `index.html` | 3.1, 4.1, 4.2, 4.3 | Self-host fonts, preconnects |
| `src/index.css` | 3.2, 3.3 | Corrigir animacoes nao compostas |
| `src/components/ui/button.tsx` | 3.4 | Remover animate-border-glow |

---

## Impacto Esperado

| Metrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| TBT (Total Blocking Time) | 170ms | ~80ms | -53% |
| JS Bundle Inicial | ~550KB | ~250KB | -55% |
| Render-blocking Resources | 2 | 0 | -100% |
| Non-composited Animations | 44 | 0 | -100% |
| Performance Score | 61 | ~80 | +19 |

---

## Observacoes Tecnicas

1. **Framer Motion LazyMotion:** A opcao `strict` garante que apenas as features de `domAnimation` sejam usadas, reduzindo o bundle.

2. **React.lazy:** Cada componente lazy-loaded cria um chunk separado que so e carregado quando necessario.

3. **Font-display: swap:** Garante que o texto seja exibido imediatamente com uma fonte de fallback enquanto a Inter carrega.

4. **Animacoes Compostas:** Apenas `transform`, `opacity` e `filter` sao animadas na GPU sem causar reflow/repaint.

5. **Preconnects:** Estabelecem conexao TCP/TLS antecipadamente, economizando ~100-300ms por recurso.
