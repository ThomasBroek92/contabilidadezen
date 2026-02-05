
# Plano de Substituição de Imagens dos Segmentos

## Status: Todas as 12 Imagens Recebidas ✅

| # | Arquivo Recebido | Segmento |
|---|------------------|----------|
| 01 | `01-profissionais-saude-bg.webp` | Profissionais da Saúde |
| 02 | `02-advogados-bg.webp` | Advogados |
| 03 | `03-representante-comercial-bg.webp` | Representantes Comerciais |
| 04 | `04-produtores-digitais-bg.webp` | Produtores Digitais |
| 05 | `05-profissionais-ti-bg.webp.webp` | Profissionais de TI |
| 06 | `06-exportacao-servicos-bg.webp` | Exportação de Serviços |
| 07 | `07-prestadores-servico-bg.webp` | Prestadores de Serviços |
| 08 | `08-profissionais-pj-bg.webp` | Profissionais PJs |
| 09 | `09-ecommerce-bg.webp` | E-commerce |
| 10 | `10-clinicas-consultorios-bg.webp` | Clínicas e Consultórios |
| 11 | `11-youtubers-creators-bg.webp` | YouTubers e Creators |
| 12 | `12-outros-segmentos-bg.webp` | Outros Segmentos |

---

## Ações a Executar

### Etapa 1: Copiar novas imagens para `src/assets/`
Copiar todas as 12 imagens do upload para a pasta de assets do projeto.

### Etapa 2: Excluir imagens antigas
Remover os arquivos antigos:
- `profissionais-saude-bg.webp`
- `advogados-bg.webp`
- `representante-comercial-bg.webp`
- `produtores-digitais-bg.webp`
- `profissionais-ti-bg.webp`
- `exportacao-servicos-bg.webp`
- `prestadores-servico-bg.webp`
- `profissionais-pj-bg.webp`
- `ecommerce-bg.webp`
- `clinicas-consultorios-bg.webp`
- `youtubers-creators-bg.webp`
- `outros-segmentos-bg.webp`

### Etapa 3: Atualizar imports em `NichesCarousel.tsx`
Atualizar as linhas 29-40 com os novos nomes de arquivo:

```typescript
import profissionaisSaudeBg from "@/assets/01-profissionais-saude-bg.webp";
import advogadosBg from "@/assets/02-advogados-bg.webp";
import representanteComercialBg from "@/assets/03-representante-comercial-bg.webp";
import produtoresDigitaisBg from "@/assets/04-produtores-digitais-bg.webp";
import profissionaisTiBg from "@/assets/05-profissionais-ti-bg.webp.webp";
import exportacaoServicosBg from "@/assets/06-exportacao-servicos-bg.webp";
import prestadoresServicoBg from "@/assets/07-prestadores-servico-bg.webp";
import profissionaisPjBg from "@/assets/08-profissionais-pj-bg.webp";
import ecommerceBg from "@/assets/09-ecommerce-bg.webp";
import clinicasConsultoriosBg from "@/assets/10-clinicas-consultorios-bg.webp";
import youtubersBg from "@/assets/11-youtubers-creators-bg.webp";
import outrosSegmentosBg from "@/assets/12-outros-segmentos-bg.webp";
```

### Etapa 4: Atualizar import em `FinalCTA.tsx`
Atualizar a linha 6 para usar a nova imagem 11:

```typescript
import youtubersCreatorsBg from "@/assets/11-youtubers-creators-bg.webp";
```

---

## Arquivos Modificados

| Arquivo | Ação |
|---------|------|
| `src/assets/01-profissionais-saude-bg.webp` | Criar (novo) |
| `src/assets/02-advogados-bg.webp` | Criar (novo) |
| `src/assets/03-representante-comercial-bg.webp` | Criar (novo) |
| `src/assets/04-produtores-digitais-bg.webp` | Criar (novo) |
| `src/assets/05-profissionais-ti-bg.webp.webp` | Criar (novo) |
| `src/assets/06-exportacao-servicos-bg.webp` | Criar (novo) |
| `src/assets/07-prestadores-servico-bg.webp` | Criar (novo) |
| `src/assets/08-profissionais-pj-bg.webp` | Criar (novo) |
| `src/assets/09-ecommerce-bg.webp` | Criar (novo) |
| `src/assets/10-clinicas-consultorios-bg.webp` | Criar (novo) |
| `src/assets/11-youtubers-creators-bg.webp` | Criar (novo) |
| `src/assets/12-outros-segmentos-bg.webp` | Criar (novo) |
| `src/assets/*-bg.webp` (12 antigos) | Excluir |
| `src/components/sections/NichesCarousel.tsx` | Atualizar imports |
| `src/components/sections/FinalCTA.tsx` | Atualizar import |

---

## Impacto

- **Zero downtime**: Os nomes das variáveis de import permanecem os mesmos, apenas os caminhos mudam
- **Imagens otimizadas**: Novas imagens em WebP conforme #IMAGE_OPTIMIZATION_RULES
- **Carrossel de nichos**: Atualizado com as novas fotos
- **FinalCTA**: Imagem de YouTubers atualizada
