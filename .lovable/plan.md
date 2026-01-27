
# Plano de Implementação - Fases 5 e 6: Redução de DOM e Virtualização

## Diagnóstico Atual

### Problema Identificado pelo PageSpeed
O relatório mostra **1.841 elementos DOM** na página, com destaque para:
- `CitiesWordCloud`: **78 filhos diretos** (todas as cidades renderizadas simultaneamente)
- Cada cidade tem animação Framer Motion individual (motion.span com variants)
- 44 animações não-compostas identificadas

### Contagem de Elementos Atual

| Componente | Elementos | Problema |
|------------|-----------|----------|
| CitiesWordCloud (filtro "todas") | 87 cidades | Renderiza TODAS simultaneamente |
| CitiesWordCloud (filtro "rmc") | 20 cidades | OK |
| CitiesWordCloud (filtro "sul-sudeste") | 59 cidades | Alto |
| CitiesWordCloud (filtro "outras") | 15 cidades | OK |
| FAQ | 9 itens | Cada item com motion.div |
| Testimonials | 6-10 cards | Usa Carousel (OK) |
| NichesCarousel | 12 cards | Usa Carousel (OK) |

---

## Fase 5: Otimização do CitiesWordCloud

### 5.1 Limitar Cidades Visíveis por Filtro

**Objetivo:** Reduzir de 87 para máximo 30 cidades visíveis no filtro "todas"

**Estratégia:**
- Filtro "todas": mostrar apenas as **30 cidades mais importantes** (primary + top secondary)
- Filtro "sul-sudeste": mostrar apenas **35 cidades** (RMC completa + capitais principais)
- Adicionar indicador "+X cidades" para comunicar que há mais

**Arquivo:** `src/components/sections/CitiesSection/CitiesWordCloud.tsx`

**Mudanças:**
```tsx
// Constantes de limite por filtro
const LIMITS = {
  todas: 30,
  rmc: 20, // já é o total
  "sul-sudeste": 35,
  outras: 15, // já é o total
};

// Aplicar limite nas cidades filtradas
const visibleCities = useMemo(() => {
  const limit = LIMITS[activeFilter];
  return shuffledCities.slice(0, limit);
}, [shuffledCities, activeFilter]);

// Calcular quantas cidades não estão visíveis
const hiddenCount = shuffledCities.length - visibleCities.length;
```

### 5.2 Remover Animações Individuais de Entrada

**Problema:** Cada cidade tem `motion.span` com `variants` que cria overhead de animação.

**Solução:** Substituir animação individual por animação CSS simples no container.

**Antes (pesado - 87 motion.span):**
```tsx
{shuffledCities.map((city) => (
  <motion.span
    key={city.name}
    variants={itemVariants}
    onMouseEnter={() => setHoveredCity(city.name)}
    onMouseLeave={() => setHoveredCity(null)}
    whileHover={{ scale: 1.1 }}
    className={...}
  >
    {city.name}
  </motion.span>
))}
```

**Depois (leve - spans simples com CSS):**
```tsx
{visibleCities.map((city) => (
  <span
    key={city.name}
    className={cn(
      "cursor-default select-none transition-transform duration-200 hover:scale-110",
      getCitySize(city, activeFilter),
      getCityStyles(city),
    )}
  >
    {city.name}
  </span>
))}

{hiddenCount > 0 && (
  <span className="text-sm text-muted-foreground ml-2">
    +{hiddenCount} cidades
  </span>
)}
```

### 5.3 Simplificar Container Animation

**Antes:** AnimatePresence com staggerChildren (pesado)
**Depois:** Transição simples de opacity no container

```tsx
// Remover staggerChildren e usar CSS transition
<div 
  key={activeFilter}
  className="relative z-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 md:gap-x-3 md:gap-y-2 animate-fade-in"
>
```

Adicionar ao CSS:
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

### 5.4 Remover Hover State Individual

**Problema:** `hoveredCity` state causa re-render a cada mouse move.

**Solução:** Usar apenas CSS para hover effects, remover state.

```tsx
// REMOVER
const [hoveredCity, setHoveredCity] = useState<string | null>(null);

// REMOVER dos spans
onMouseEnter={() => setHoveredCity(city.name)}
onMouseLeave={() => setHoveredCity(null)}
```

---

## Fase 6: Otimização do FAQ

### 6.1 Remover Animação Individual de Cada Item

**Problema:** Cada FAQ item tem `motion.div` com animação baseada em index.

**Arquivo:** `src/components/sections/FAQ.tsx`

**Antes (9 motion.div):**
```tsx
{faqs.map((faq, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: 20 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
    transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
  >
    <AccordionItem>...</AccordionItem>
  </motion.div>
))}
```

**Depois (div simples com CSS):**
```tsx
{faqs.map((faq, index) => (
  <div key={index} className="animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
    <AccordionItem>...</AccordionItem>
  </div>
))}
```

Adicionar ao CSS:
```css
@keyframes slide-in {
  from { 
    opacity: 0; 
    transform: translateX(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}
.animate-slide-in {
  animation: slide-in 0.4s ease-out forwards;
  opacity: 0; /* initial state */
}
```

---

## Fase 6: Otimização Adicional de DOM (Testimonials)

### 6.2 Limitar Fallback Testimonials

**Problema:** 6 testimonials de fallback sempre carregados, mesmo quando GMB reviews existem.

**Arquivo:** `src/components/sections/Testimonials.tsx`

**Solução:** Já usa Carousel com limit(10) do banco. OK, não precisa mudança.

---

## Arquivos a Modificar

| Arquivo | Ação | Impacto |
|---------|------|---------|
| `src/components/sections/CitiesSection/CitiesWordCloud.tsx` | Limitar cidades, remover motion.span | **Alto** |
| `src/components/sections/FAQ.tsx` | Substituir motion.div por CSS | **Médio** |
| `src/index.css` | Adicionar animações CSS leves | **Baixo** |

---

## Código Final Proposto

### CitiesWordCloud.tsx (versão otimizada)

```tsx
import { useState, useMemo } from "react";
import { citiesData, rmcCities, sulSudesteCities, outrasCities, type FilterType, type CityData } from "./citiesData";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

const filters: { id: FilterType; label: string; icon?: boolean }[] = [
  { id: "todas", label: "Todas" },
  { id: "rmc", label: "Região de Campinas", icon: true },
  { id: "sul-sudeste", label: "Sul e Sudeste" },
  { id: "outras", label: "Outras Regiões" },
];

// Limites por filtro para reduzir DOM
const LIMITS: Record<FilterType, number> = {
  todas: 30,
  rmc: 20,
  "sul-sudeste": 35,
  outras: 15,
};

function getCitySize(city: CityData, filter: FilterType): string {
  // ... (manter lógica existente)
}

function getCityStyles(city: CityData): string {
  // ... (manter lógica existente)
}

export function CitiesWordCloud() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todas");

  const getFilteredCities = (): CityData[] => {
    switch (activeFilter) {
      case "rmc": return rmcCities;
      case "sul-sudeste": return sulSudesteCities;
      case "outras": return outrasCities;
      default: return citiesData;
    }
  };

  const filteredCities = getFilteredCities();

  const sortedCities = useMemo(() => {
    return [...filteredCities].sort((a, b) => {
      if (a.name === "Campinas") return -1;
      if (b.name === "Campinas") return 1;
      if (a.priority === "primary" && b.priority !== "primary") return -1;
      if (b.priority === "primary" && a.priority !== "primary") return 1;
      if (a.priority === "secondary" && b.priority === "tertiary") return -1;
      if (b.priority === "secondary" && a.priority === "tertiary") return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filteredCities]);

  // Aplicar limite
  const limit = LIMITS[activeFilter];
  const visibleCities = sortedCities.slice(0, limit);
  const hiddenCount = sortedCities.length - visibleCities.length;

  const getContainerClasses = () => {
    if (activeFilter === "todas") return "max-h-[200px] md:max-h-[280px]";
    if (activeFilter === "outras") return "max-h-[150px] md:max-h-[200px]";
    return "max-h-[180px] md:max-h-[250px]";
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs - botões simples sem motion */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 hover:scale-103 active:scale-97",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-card border border-border hover:border-primary/50 hover:bg-muted text-foreground"
            )}
          >
            {filter.icon && <MapPin className="h-3.5 w-3.5" />}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Word Cloud Container - sem AnimatePresence */}
      <div className={cn(
        "relative rounded-xl bg-gradient-to-br from-muted/20 via-background to-muted/10 border border-border/30 p-4 md:p-6 overflow-hidden",
        getContainerClasses()
      )}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-5 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute bottom-5 right-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
        </div>

        {/* Cities - spans simples com CSS transitions */}
        <div 
          key={activeFilter}
          className="relative z-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 md:gap-x-3 md:gap-y-2 animate-fade-in"
        >
          {visibleCities.map((city) => (
            <span
              key={city.name}
              className={cn(
                "cursor-default select-none transition-transform duration-200 hover:scale-110 whitespace-nowrap",
                getCitySize(city, activeFilter),
                getCityStyles(city),
              )}
            >
              {city.name}
            </span>
          ))}
          
          {/* Indicador de cidades ocultas */}
          {hiddenCount > 0 && (
            <span className="text-xs md:text-sm text-muted-foreground/70 ml-1">
              +{hiddenCount} cidades
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Impacto Esperado

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Elementos DOM (CitiesWordCloud) | 87 spans | 30 spans | **-65%** |
| motion.span components | 87 | 0 | **-100%** |
| Elementos DOM (FAQ) | 9 motion.div | 9 div | ~igual mas mais leve |
| Re-renders por hover | ~87/section | 0 | **-100%** |
| Animações Framer Motion | ~100 | ~20 | **-80%** |
| DOM Total Estimado | 1.841 | ~1.450 | **-21%** |

---

## Observações Técnicas

1. **CSS vs Framer Motion:** Animações CSS são processadas diretamente pelo browser (compositor), enquanto Framer Motion adiciona overhead de JavaScript e virtual DOM.

2. **Hover com CSS:** `transition-transform` + `hover:scale-110` é processado na GPU, sem re-renders React.

3. **Limites de Cidades:** 30 cidades no filtro "todas" é suficiente para transmitir cobertura nacional sem sobrecarregar o DOM.

4. **Indicador "+X cidades":** Mantém transparência com o usuário sobre a quantidade total de cidades atendidas.

5. **animate-fade-in:** Uma única animação CSS no container é muito mais eficiente que staggerChildren em 87 elementos.
