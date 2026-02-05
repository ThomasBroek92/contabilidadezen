
# Plano de Otimização de Responsividade Mobile

## Status de Implementação

✅ **Fase 1: CONCLUÍDA** - Correções críticas
✅ **Fase 2: CONCLUÍDA** - Carrosséis e navegação mobile
✅ **Fase 3: CONCLUÍDA** - Tipografia fluida, focus states, espaçamento
✅ **Fase 4: CONCLUÍDA** - Performance mobile (lazy loading implementado)
✅ **Auditoria: CONCLUÍDA** - Regras aplicadas em todo o site

---

## Auditoria de Conformidade (Fev/2026)

### Páginas Auditadas ✅
- Index.tsx - Lazy loading completo (11 componentes)
- AbrirEmpresa.tsx - Estrutura correta
- Servicos.tsx - Grids responsivos, CTAs WhatsApp corretos
- Contato.tsx - Forms com inputs h-11, labels corretos
- Blog.tsx - Grid responsivo, search correto
- Sobre.tsx - Corrigido padrão WhatsApp
- IndiqueGanhe.tsx - Hero responsivo, forms corretos
- ContabilidadeDentistas.tsx - Componentes modularizados

### Correções Aplicadas
- Sobre.tsx: Atualizado de getWhatsAppLink para getWhatsAppAnchorPropsByKey

### Componentes Globais ✅
- Header.tsx - Menu mobile com max-h e overflow
- Footer.tsx - Grid responsivo
- FloatingWhatsApp.tsx - Posição right-4 sm:right-6
- SkipLink.tsx - Acessibilidade keyboard navigation
- Input.tsx - altura h-11, text-base (16px)
- Carousel.tsx - CarouselDots, setas h-11 w-11

---

## Correções Implementadas

### Fase 1 - Correções Críticas ✅

1. **Breakpoint xs adicionado ao Tailwind** (`tailwind.config.ts`)
   - `xs: "375px"` para iPhone SE e telas muito pequenas

2. **HeroMultiNiche - Grid de Cards** 
   - Alterado de `grid-cols-2` para `grid-cols-1 xs:grid-cols-2` 
   - Agora empilha verticalmente em telas < 375px

3. **HeroMultiNiche - Stats Responsivos**
   - Adicionado `flex-wrap` e gaps responsivos
   - Ícones e textos menores em mobile

4. **HeroMultiNiche - CTAs Responsivos**
   - Botões com `size="lg"` em vez de `xl` para mobile
   - Largura `w-full sm:w-auto` para empilhar em telas pequenas

### Fase 2 - Carrosséis e Navegação ✅

1. **CarouselDots Component** (`carousel.tsx`)
   - Novo componente para indicadores de slide em mobile
   - Área de toque de 10x10px para cada dot

2. **Touch Targets 44x44px** (`carousel.tsx`)
   - Setas do carrossel aumentadas de 32x32px para 44x44px
   - Ícones internos aumentados para 20x20px
   - `aria-label` em português

3. **NichesCarousel** - Dots em mobile, setas em desktop
4. **Testimonials** - Dots em mobile, setas em desktop

5. **Header Menu Mobile** (`Header.tsx`)
   - Altura máxima `max-h-[calc(100vh-4rem)]`
   - `overflow-y-auto` para scroll interno

6. **FloatingWhatsApp Tooltip** (`FloatingWhatsApp.tsx`)
   - Posição ajustada `right-4 sm:right-6`
   - Largura máxima `max-w-[200px] sm:max-w-[220px]`

7. **Input Height** (`input.tsx`)
   - Altura aumentada para `h-11` (44px)
   - Font-size `text-base` (16px) para evitar zoom no iOS

---

## Fases Pendentes

### Fase 3: Correções de Média Prioridade

- [ ] Tipografia fluida com clamp() em index.css
- [ ] Focus states globais para acessibilidade
- [ ] Espaçamento lateral consistente (safe area)

### Fase 4: Performance Mobile

- [ ] Lazy loading em todas as imagens
- [ ] Critical CSS para above-the-fold
- [ ] Validação com Lighthouse (meta: 90+)

---

#MOBILE_RESPONSIVENESS_RULES

## Regras Obrigatórias de Responsividade Mobile

### 1. Breakpoints
- xs: 375px (iPhone SE, telas muito pequenas)
- sm: 640px (mobile landscape)
- md: 768px (tablet portrait)
- lg: 1024px (tablet landscape / desktop)
- xl: 1280px (desktop)
- 2xl: 1400px (desktop grande)

### 2. Grids e Layouts
- Em telas < 480px: preferir grid-cols-1 (stack vertical)
- Usar flex-wrap quando há múltiplos itens lado a lado
- Testar em viewport 320px, 375px e 414px
- Padrão: `grid-cols-1 xs:grid-cols-2 lg:grid-cols-4`

### 3. Touch Targets (WCAG)
- Área mínima de toque: 44x44px (h-11 w-11)
- Botões e links devem ter padding adequado
- Espaço mínimo entre elementos interativos: 8px
- Setas de carrossel: sempre h-11 w-11

### 4. Tipografia Fluida
- Usar classes utilitárias com clamp():
  - `.text-hero`: clamp(1.75rem, 5vw + 1rem, 3.75rem)
  - `.text-section`: clamp(1.5rem, 4vw + 0.5rem, 3rem)
  - `.text-subsection`: clamp(1.25rem, 3vw + 0.5rem, 2rem)
- Nunca usar font-size < 16px em inputs (evita zoom no iOS)
- Line-height mínimo 1.5 para texto corrido

### 5. Focus States (Acessibilidade)
- Todos elementos interativos têm focus-visible global
- Outline: 2px solid secondary com offset de 2px
- Nunca usar outline: none sem alternativa visual
- Testar navegação completa com Tab

### 6. Carrosséis
- Sempre mostrar CarouselDots em mobile (hidden md:flex para setas)
- Setas devem ter área de toque 44x44px (h-11 w-11)
- Suportar swipe gesture (Embla já faz isso)
- aria-labels em português para acessibilidade

### 7. Imagens (Performance)
- SEMPRE usar loading="lazy" em imagens abaixo da dobra
- SEMPRE usar decoding="async"
- Definir width e height explícitos (evita CLS)
- Hero: loading="eager" + fetchPriority="high"
- Formato WebP obrigatório, max 200KB

### 8. Espaçamento Consistente
- Padding lateral mínimo: 16px em mobile (px-4)
- Gap entre elementos: 8-12px em mobile, 16-24px em desktop
- Usar `.px-safe` para safe-area-inset em notches
- Container padrão: `container mx-auto px-4 sm:px-6 lg:px-8`

### 9. Componentes UI
- Inputs: altura h-11 (44px), text-base (16px)
- Botões em mobile: size="lg", w-full sm:w-auto
- Menu mobile: max-h-[calc(100vh-4rem)] overflow-y-auto
- FloatingWhatsApp: right-4 sm:right-6, max-w-[200px]

### 10. Testes Obrigatórios
- Testar em Chrome DevTools (320px, 375px, 414px, 768px)
- Testar em dispositivo real (iOS Safari, Android Chrome)
- Verificar com Lighthouse (meta: Performance > 90)
- Testar navegação por teclado (Tab)
- Verificar contraste (4.5:1 mínimo)

---

#WHATSAPP_LINK_STANDARDS

## Regras de Links WhatsApp (Prevenção de ERR_BLOCKED_BY_RESPONSE)

### Regra 1 — Proibição total de hardcode
- ❌ Proibido: `href="https://wa.me/..."`, `window.open("https://wa.me/...")`
- ✅ Obrigatório: usar **somente** `src/lib/whatsapp.ts`

### Regra 2 — Nunca encode manual fora da lib
- ❌ Proibido: `encodeURIComponent` no template do link
- ✅ A lib já codifica a mensagem internamente

### Regra 3 — Sempre abrir fora do iframe
- Todo link de WhatsApp deve abrir em nova aba
- Usar `getWhatsAppAnchorProps*` (retorna href + target + rel)
- Ou usar `openWhatsApp*` em handlers de clique

### Snippets Padrão

```tsx
// Mensagem por key (recomendado)
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";
<a {...getWhatsAppAnchorPropsByKey("abrirEmpresa")}>Falar no WhatsApp</a>

// Mensagem customizada
import { getWhatsAppAnchorProps } from "@/lib/whatsapp";
<a {...getWhatsAppAnchorProps("Olá! Vim da página X...")}>WhatsApp</a>

// Para leads/CRM (número variável)
import { openWhatsAppForPhone } from "@/lib/whatsapp";
openWhatsAppForPhone(lead.whatsapp, "Olá! Entrando em contato sobre...")
```
