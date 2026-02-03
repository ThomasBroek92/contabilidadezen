

# Plano: Otimizacao do LCP com Imagens WebP

## Objetivo
Substituir as imagens JPG/PNG criticas por WebP e otimizar elementos que impactam o LCP (Largest Contentful Paint), visando score abaixo de 2.5 segundos.

## Arquivos Recebidos

| Arquivo Upload | Destino | Uso |
|----------------|---------|-----|
| `Thomas-Broek.webp` | `src/assets/hero-founder.webp` | Imagem principal do Hero |
| `Cont-Zen-LOGO-01-2.webp` | `src/assets/logo-full.webp` | Logo do Header |

## Etapas de Implementacao

### Etapa 1: Copiar Imagens WebP para src/assets/
- Copiar `user-uploads://Thomas-Broek.webp` para `src/assets/hero-founder.webp`
- Copiar `user-uploads://Cont-Zen-LOGO-01-2.webp` para `src/assets/logo-full.webp`

### Etapa 2: Atualizar Imports nos Componentes

**HeroMultiNiche.tsx (linha 16)**
```text
// Antes
import heroFounder from "@/assets/hero-founder.jpg";

// Depois
import heroFounder from "@/assets/hero-founder.webp";
```

**Header.tsx (linha 32)**
```text
// Antes
import logoFull from "@/assets/logo-full.png";

// Depois
import logoFull from "@/assets/logo-full.webp";
```

### Etapa 3: Remover Preload Incorreto do index.html
A linha 46 do index.html faz preload de uma imagem errada (`/lovable-uploads/...`). Como a imagem hero e importada via Vite (com hash no build), o preload estatico nao funciona. Remover essa linha.

### Etapa 4: Cleanup - Remover Arquivos Antigos
- Deletar `src/assets/hero-founder.jpg`
- Deletar `src/assets/logo-full.png`

## Impacto Esperado

| Metrica | Antes | Depois (Estimado) |
|---------|-------|-------------------|
| Tamanho hero-founder | ~180KB (JPG) | ~50-80KB (WebP) |
| Tamanho logo | ~30KB (PNG) | ~10KB (WebP) |
| LCP | ~3.5-4.5s | < 2.5s |

## Arquivos Modificados

| Arquivo | Tipo de Modificacao |
|---------|---------------------|
| `src/assets/hero-founder.webp` | Novo arquivo (copia) |
| `src/assets/logo-full.webp` | Novo arquivo (copia) |
| `src/components/sections/HeroMultiNiche.tsx` | Alterar import (linha 16) |
| `src/components/Header.tsx` | Alterar import (linha 32) |
| `index.html` | Remover preload incorreto (linha 46) |
| `src/assets/hero-founder.jpg` | Deletar |
| `src/assets/logo-full.png` | Deletar |

## Secao Tecnica

### Por que remover o preload estatico?
O preload atual aponta para `/lovable-uploads/b2fc5c22...png`, mas a imagem LCP real e `hero-founder.jpg` importada via ES module. O Vite processa a imagem e gera um hash (ex: `hero-founder-abc123.webp`), tornando o preload estatico inutilizado. O atributo `fetchPriority="high"` na tag `<img>` ja garante priorizacao adequada.

### Otimizacoes ja implementadas no componente Hero
- `loading="eager"` na imagem hero
- `fetchPriority="high"` na imagem hero
- `decoding="async"` na imagem hero
- Fonte Inter self-hosted com `font-display: swap`

