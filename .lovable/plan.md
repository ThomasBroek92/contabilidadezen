

## Plano: Usar foto do dentista no Hero e no Carrossel de Nichos

### O que sera feito

1. **Copiar imagem** do upload para `src/assets/dentistas-bg.webp`

2. **DentistasHero.tsx** — Trocar `profissionaisSaudeBg` pela nova imagem `dentistas-bg.webp`, com alt text atualizado

3. **NichesCarousel.tsx** — Adicionar card separado para "DENTISTAS" (como os outros segmentos tem card proprio), usando a nova imagem. O card atual "Profissionais da Saude" sera ajustado para nao duplicar dentistas no subtitulo.

### Detalhes tecnicos

- Imagem sera importada como ES6 module via `src/assets/`
- Dimensoes do `<img>` serao ajustadas para o aspect ratio real da foto (portrait ~2:3)
- O novo card de Dentistas no carousel tera: icone `Smile`, cor verde esmeralda (`from-emerald-600 to-emerald-500`), link `/segmentos/contabilidade-para-dentistas`, features especificas (CRO, clinicas odontologicas, Fator R)

