# Plano de Otimização de Performance Mobile

## Status: ✅ IMPLEMENTADO (Site Completo)

## Resumo das Mudanças

### 1. Hook useReducedMotion ✅
- Criado `src/hooks/use-reduced-motion.ts`
- Detecta `prefers-reduced-motion` e dispositivos mobile
- Desabilita animações pesadas automaticamente

### 2. Componentes Otimizados (Site Completo) ✅

| Componente | Mudanças |
|------------|----------|
| HeroMultiNiche | CSS animations, removido Parallax mobile |
| NichesCarousel | CSS `animate-fade-up` com delay |
| FinalCTA | Removido Parallax, CSS animations |
| CustomerJourney | Removido scroll-based motion, CSS animations |
| PartnerJourney | CSS animations com delay |
| Testimonials | CSS transitions para hover |
| RoutineCarousel | CSS animations para cards |
| AbrirEmpresaHero | CSS `animate-fade-up` |
| AbrirEmpresaTimeline | CSS animations |
| AbrirEmpresaVirtualOffice | CSS `animate-float` e `animate-pulse-ring` |
| AbrirEmpresaPricing | CSS animations |
| AbrirEmpresaComparison | CSS animations |
| AbrirEmpresaCTA | CSS animations |
| scroll-animation.tsx | useReducedMotion em todos os componentes |

### 3. CSS Animations Adicionadas ✅
- `@keyframes pulse-ring` - substituindo animação de boxShadow
- `@keyframes subtle-pulse` - decorativos leves
- `.animate-pulse-ring` e `.animate-subtle-pulse`
- Media query `prefers-reduced-motion: reduce` desabilita todas as animações

### 4. Padrão Aplicado
- **Substituir** `motion.div` com `whileInView` por CSS `animate-fade-up`
- **Substituir** `whileHover` por CSS `hover:-translate-y-1 hover:shadow-card`
- **Usar** `useReducedMotion()` para desativar animações em mobile
- **Remover** Parallax e animações de scroll complexas em mobile

## Impacto Esperado

| Métrica | Antes | Depois Esperado |
|---------|-------|-----------------|
| Elementos Animados | 53+ | < 10 |
| JS Execution Time | 1,4s | < 0,5s |
| LCP | 9,9s | < 4s |
| Performance Score | 57 | 80+ |

## Regras para Novos Componentes

1. **NUNCA** usar `motion.div` com `whileInView` repetido em listas
2. **SEMPRE** usar CSS `animate-fade-up` com `animation-delay` inline
3. **SEMPRE** verificar `useReducedMotion()` antes de aplicar animações
4. **PROIBIDO** animações de `box-shadow` - usar `opacity` + pseudo-element
5. **PREFERIR** CSS transitions para hover states
