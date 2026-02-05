
# Plano de Otimização de Responsividade Mobile

## Status de Implementação

✅ **Fase 1: CONCLUÍDA** - Correções críticas
✅ **Fase 2: CONCLUÍDA** - Carrosséis e navegação mobile
✅ **Fase 3: CONCLUÍDA** - Tipografia fluida, focus states, espaçamento
✅ **Fase 4: CONCLUÍDA** - Performance mobile (lazy loading implementado)

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

### 3. Touch Targets
- Área mínima de toque: 44x44px (WCAG)
- Botões e links devem ter padding adequado
- Espaço mínimo entre elementos interativos: 8px

### 4. Tipografia
- Nunca usar font-size < 16px em inputs (evita zoom no iOS)
- Usar clamp() para tipografia fluida
- Line-height mínimo 1.5 para texto corrido

### 5. Carrosséis
- Sempre mostrar indicadores (dots) em mobile via CarouselDots
- Setas devem ter área de toque 44x44px (h-11 w-11)
- Suportar swipe gesture (Embla já faz isso)

### 6. Imagens
- Sempre usar loading="lazy" em imagens abaixo da dobra
- Definir width e height explícitos
- Usar srcset/picture para imagens responsivas

### 7. Espaçamento
- Padding lateral mínimo: 16px em mobile (px-4)
- Gap entre elementos: 8-12px em mobile, 16-24px em desktop

### 8. Testes Obrigatórios
- Testar em Chrome DevTools (320px, 375px, 414px, 768px)
- Testar em dispositivo real (iOS Safari, Android Chrome)
- Verificar com Lighthouse (meta: Performance > 90)

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
