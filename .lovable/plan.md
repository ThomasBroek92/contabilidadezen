
# Plano de Exclusão de Imagens Não Utilizadas

## Diagnóstico

Após auditoria completa no código, identifiquei **2 imagens** que não são utilizadas em nenhum lugar do projeto:

| Arquivo | Tamanho Estimado | Motivo da Exclusão |
|---------|------------------|---------------------|
| `src/assets/hero-healthcare.jpg` | ~100-300 KB | Importada no `Hero.tsx`, mas esse componente foi substituído pelo `HeroMultiNiche.tsx` e não é usado em nenhuma página |
| `src/assets/thomas-broek-final-cta.png` | ~100-500 KB | Zero referências no código |

### Imagens que DEVEM ser mantidas:
- `exit-intent-support.jpg` - Usado em `ExitIntentPopup.tsx`
- `logo-icon.png` - Usado em `Admin.tsx`
- `hero-founder.webp` - Usado em `HeroMultiNiche.tsx`
- `logo-full.webp` - Usado no Header
- Todos os `*-bg.webp` - Usados no `NichesCarousel.tsx`

## Ações

### Etapa 1: Excluir imagens não utilizadas
Remover os seguintes arquivos:
- `src/assets/hero-healthcare.jpg`
- `src/assets/thomas-broek-final-cta.png`

### Etapa 2 (Opcional): Limpar componente órfão
O arquivo `src/components/sections/Hero.tsx` também não é utilizado (substituído por `HeroMultiNiche.tsx`). Posso excluí-lo também para manter o código limpo.

## Impacto

- **Redução do bundle**: Menos ~200-800 KB de assets não utilizados
- **Manutenção**: Código mais limpo e fácil de manter
- **Performance**: Potencial melhoria marginal no build time

## Nota sobre Formato

As imagens restantes que ainda estão em formato JPG/PNG (`exit-intent-support.jpg` e `logo-icon.png`) devem ser convertidas para WebP externamente para otimização de performance, conforme as regras de `#IMAGE_OPTIMIZATION_RULES`.
