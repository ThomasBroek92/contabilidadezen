

## Plano: Aumentar espaçamento entre hero e cards na homepage

### Alteração em `src/components/sections/HeroMultiNiche.tsx`

O grid dos benefit cards usa `mt-8 lg:mt-0` (linha ~158). Trocar para `mt-12 lg:mt-8` para criar respiro visual entre a imagem do founder e os cards.

### Arquivo
- `src/components/sections/HeroMultiNiche.tsx` — ajustar margin-top do `StaggerContainer` dos benefit cards

