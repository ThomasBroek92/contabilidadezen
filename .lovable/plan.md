

# Auditoria de Aspect Ratio em Todas as Imagens + Regra na Base de Conhecimento

## Problema
O Lighthouse reporta erro quando os atributos `width` e `height` de uma `<img>` nao correspondem ao aspect ratio real da imagem. Isso causa CLS (Cumulative Layout Shift) e penaliza Best Practices.

## Auditoria Completa - Imagens Encontradas

### Grupo 1: Imagens com `width`/`height` que podem causar mismatch

| Arquivo | Imagem | width/height atuais | Dimensao real | Status |
|---------|--------|---------------------|---------------|--------|
| Footer.tsx | logo-full.webp | 1920x388 | 1920x388 | OK (corrigido) |
| Header.tsx | logo-full.webp | 240x48 | 1920x388 (ratio 4.95) | **ERRO** - 240/48=5.0 |
| HeroMultiNiche.tsx (desktop) | hero-founder.webp | 512x640 | Precisa verificar | Potencial risco |
| HeroMultiNiche.tsx (mobile) | hero-founder.webp | 288x360 | Mesmo ratio de 512/640=0.8 | OK se real=0.8 |
| FinalCTA.tsx | youtubers-bg.webp | 448x448 | Imagem nao e quadrada | **RISCO** |
| NichesCarousel.tsx | 12 backgrounds .webp | 400x420 | Todas 665x735 (ratio 0.905) | **RISCO** - 400/420=0.952 |
| ExitIntentPopup.tsx | exit-intent-support.jpg | 192x192 | Foto nao e quadrada | **RISCO** |
| Testimonials.tsx | Google photos | 40x40 | Avatares Google (quadrados) | OK |

### Grupo 2: Imagens SEM `width`/`height` (problema de CLS, mas nao de aspect ratio)

| Arquivo | Imagem | Acao |
|---------|--------|------|
| MedicosHero.tsx | Unsplash (800x?) | Adicionar width=800 height=600 |
| DentistasHero.tsx | Unsplash (800x?) | Adicionar width=800 height=600 |
| PsicologosHero.tsx | Unsplash (800x?) | Adicionar width=800 height=600 |
| RepresentantesHero.tsx | Unsplash (800x?) + bg local | Adicionar width/height |
| Auth.tsx | logo-full.webp | Adicionar width=1920 height=388 |
| MarkdownRenderer.tsx | Dinamico (blog) | Nao aplicavel |

## Plano de Implementacao

### Etapa 1: Corrigir imagens com atributos incorretos

1. **Header.tsx** - Logo: mudar para `width={1920} height={388}` (ratio real 4.95)
2. **NichesCarousel.tsx** - 12 cards: mudar de `400x420` para `665x735` (dimensao real dos WebP)
3. **FinalCTA.tsx** - youtubers-bg: verificar dimensao real e ajustar (imagem de nicho, provavelmente 665x735, nao 448x448)
4. **ExitIntentPopup.tsx** - support image: verificar dimensao real do exit-intent-support.jpg e ajustar

### Etapa 2: Adicionar width/height em imagens que nao tem

5. **MedicosHero.tsx** - Adicionar `width={800} height={1200}` + `loading="lazy"` + `decoding="async"`
6. **DentistasHero.tsx** - Mesma correcao
7. **PsicologosHero.tsx** - Mesma correcao
8. **RepresentantesHero.tsx** - Adicionar nos dois `<img>` (bg e unsplash)
9. **Auth.tsx** - Logo: adicionar `width={1920} height={388}` + `loading="lazy"` + `decoding="async"`

### Etapa 3: Atualizar Base de Conhecimento

Adicionar nova secao `#IMAGE_ASPECT_RATIO_RULES` no Custom Knowledge:

```
#IMAGE_ASPECT_RATIO_RULES

## Regras de Aspect Ratio para Imagens

1. **width e height DEVEM corresponder ao aspect ratio real da imagem**
   - NUNCA inventar valores de width/height
   - Usar as dimensoes reais do arquivo (ex: 1920x388 para o logo)
   - Se a imagem e exibida menor via CSS (h-12, w-auto), os atributos HTML ainda devem refletir o ratio real

2. **Toda <img> DEVE ter width e height explicitos**
   - Previne CLS (Cumulative Layout Shift)
   - Permite ao navegador reservar espaco antes do carregamento
   - Excecao: imagens dinamicas de blog/CMS onde dimensoes sao desconhecidas

3. **Dimensoes reais dos assets do projeto:**
   - logo-full.webp: 1920x388
   - hero-founder.webp: 512x640
   - Nichos (01 a 12): 665x735
   - exit-intent-support.jpg: verificar e documentar

4. **Para imagens externas (Unsplash, Google Photos):**
   - Usar as dimensoes do crop solicitado na URL (?w=800)
   - Se usando object-cover com altura fixa, usar width=800 height=1200 (retrato) ou width=800 height=533 (paisagem)

5. **Validacao:**
   - Rodar Lighthouse Best Practices antes de publicar
   - Verificar "Displays images with incorrect aspect ratio"
```

## Detalhes Tecnicos

- Nenhuma mudanca visual: `width`/`height` HTML sao apenas hints para o navegador; o CSS (`h-12 w-auto`, `object-cover`, etc.) continua controlando o tamanho renderizado
- As imagens Unsplash com `?w=800` retornam imagens em formato retrato (~800x1200) para fotos de pessoas
- Imagens dinamicas (blog, avatares) nao precisam de correcao pois suas dimensoes sao desconhecidas no build time
