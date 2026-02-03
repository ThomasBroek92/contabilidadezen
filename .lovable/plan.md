
# Plano: Migração de Imagens JPG para WebP no NichesCarousel

## Objetivo
Substituir as 12 imagens de background do carrossel de nichos de JPG para WebP, reduzindo significativamente o tamanho dos arquivos e melhorando o LCP (Largest Contentful Paint).

## Impacto Esperado
- **Redução de payload**: ~60-80% menor (WebP vs JPG)
- **Melhoria no LCP**: Impacto direto no PageSpeed Score
- **Carregamento mais rápido**: Especialmente em dispositivos móveis

## Mapeamento Completo das Imagens

| # | Arquivo Original (upload) | Destino | Segmento |
|---|---|---|---|
| 1 | `gynecologist-getting-ready-appointment-2.webp` | `profissionais-saude-bg.webp` | Profissionais da Saúde |
| 2 | `serious-mature-male-lawyer-working-office-2.webp` | `advogados-bg.webp` | Advogados |
| 3 | `medium-shot-woman-with-smartphone-2.webp` | `representante-comercial-bg.webp` | Representantes Comerciais |
| 4 | `representation-user-experience-interface-design-2.webp` | `produtores-digitais-bg.webp` | Produtores Digitais |
| 5 | `cheerful-man-server-hub-facility-inspecting-server-units-2.webp` | `profissionais-ti-bg.webp` | Profissionais de TI |
| 6 | `car-mechanic-with-tablet-near-car-work-clothes-2.webp` | `exportacao-servicos-bg.webp` | Exportacao de Servicos |
| 7 | `young-co-worker-spending-time-office.webp` | `prestadores-servico-bg.webp` | Prestadores de Servico |
| 8 | `hacker-frowning-after-being-unable-phishing-attacks-trick-users-2.webp` | `profissionais-pj-bg.webp` | Profissionais PJs |
| 9 | `front-view-woman-holding-smartphone-2.webp` | `ecommerce-bg.webp` | E-commerce |
| 10 | `side-view-people-working-clinic-2.webp` | `clinicas-consultorios-bg.webp` | Clinicas e Consultorios |
| 11 | `cheerful-small-girl-shooting-video-social-media-platform-using-cellphone-2.webp` | `youtubers-creators-bg.webp` | YouTubers/Creators |
| 12 | `elegant-man-office-businessman-white-shirt-man-works-with-documents-2.webp` | `outros-segmentos-bg.webp` | Outros Segmentos |

## Etapas de Implementacao

### Etapa 1: Copiar Imagens WebP para src/assets/
Copiar cada uma das 12 imagens enviadas para a pasta `src/assets/` com os nomes padronizados.

### Etapa 2: Atualizar Imports no NichesCarousel.tsx
Alterar as linhas 29-40 do arquivo para usar a extensao `.webp`:

```text
// Antes:
import representanteComercialBg from "@/assets/representante-comercial-bg.jpg";

// Depois:
import representanteComercialBg from "@/assets/representante-comercial-bg.webp";
```

### Etapa 3: Remover Arquivos JPG Antigos (Opcional)
Os seguintes arquivos JPG podem ser removidos apos a migracao:
- `advogados-bg.jpg`
- `clinicas-consultorios-bg.jpg`
- `ecommerce-bg.jpg`
- `exportacao-servicos-bg.jpg`
- `outros-segmentos-bg.jpg`
- `prestadores-servico-bg.jpg`
- `produtores-digitais-bg.jpg`
- `profissionais-pj-bg.jpg`
- `profissionais-saude-bg.jpg`
- `profissionais-ti-bg.jpg`
- `representante-comercial-bg.jpg`
- `youtubers-creators-bg.jpg`

**Nota**: Arquivos nao relacionados ao carrossel (`hero-founder.jpg`, `hero-healthcare.jpg`, `exit-intent-support.jpg`) serao migrados em uma etapa futura.

## Arquivo Modificado
- `src/components/sections/NichesCarousel.tsx` (linhas 29-40: alteracao de extensao)

## Validacao Pos-Implementacao
1. Verificar se o carrossel exibe todas as imagens corretamente
2. Inspecionar Network tab para confirmar que WebP esta sendo carregado
3. Rodar PageSpeed Insights para medir melhoria no LCP
