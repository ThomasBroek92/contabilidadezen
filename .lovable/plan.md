
# Plano: Visual de Carrossel para "O que você ganha"

## Objetivo
Transformar a seção "O que você ganha" de grid estático (4 cards) para um carrossel animado no estilo do `RoutineCarousel`, **mantendo exatamente o mesmo conteúdo** dos 4 benefícios atuais.

---

## Conteúdo a Manter (sem alterações)

| # | Ícone | Título | Descrição |
|---|-------|--------|-----------|
| 01 | Gift | 100% da Primeira Mensalidade | Receba o valor integral da primeira mensalidade do seu indicado diretamente via PIX. Pagamento em até 5 dias úteis. |
| 02 | TrendingUp | 10% de Recorrência | Opte por receber 10% de todas as mensalidades enquanto o indicado permanecer cliente ativo. |
| 03 | Sparkles | Certificado Digital Grátis | A cada 3 indicações confirmadas, ganhe um Certificado Digital e-CPF ou e-CNPJ. |
| 04 | Shield | IRPF Gratuito | Clientes parceiros que indicam 5 ou mais empresas ganham declaração de IRPF grátis. |

---

## Mudança Visual

**De:** Grid estático com 4 cards (md:2 cols, lg:4 cols)

**Para:** Carrossel animado com:
- Cards numerados (01, 02, 03, 04)
- Ícones em caixas gradiente (estilo teal da marca)
- Animações de entrada com Framer Motion
- Autoplay com navegação por dots
- Responsivo (1 card mobile, 2 tablet, 3 desktop)

---

## Estrutura Visual Proposta

```text
┌─────────────────────────────────────────────────────────────────┐
│  [PROGRAMA DE PARCERIA]                                         │
│                                                                 │
│     O que você ganha                                            │
│     Escolha: 100% da 1ª mensalidade OU 10% de recorrência       │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ← carousel  │
│  │         01  │  │         02  │  │         03  │              │
│  │   [🎁]      │  │   [📈]      │  │   [✨]      │              │
│  │ 100% da 1ª  │  │ 10% de      │  │ Certificado │              │
│  │ Mensalidade │  │ Recorrência │  │ Digital     │              │
│  │ Descrição   │  │ Descrição   │  │ Descrição   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
│              ● ● ● ●    (navigation dots)                       │
│                                                                 │
│           [ Quero me cadastrar agora ]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementação Técnica

### Arquivo a criar:
`src/components/indique-ganhe/PartnerBenefitsCarousel.tsx`

### Estrutura do componente:

```typescript
interface BenefitStep {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const benefitSteps: BenefitStep[] = [
  {
    number: "01",
    title: "100% da Primeira Mensalidade",
    description: "Receba o valor integral da primeira mensalidade do seu indicado diretamente via PIX. Pagamento em até 5 dias úteis.",
    icon: Gift,
  },
  {
    number: "02",
    title: "10% de Recorrência",
    description: "Opte por receber 10% de todas as mensalidades enquanto o indicado permanecer cliente ativo.",
    icon: TrendingUp,
  },
  {
    number: "03",
    title: "Certificado Digital Grátis",
    description: "A cada 3 indicações confirmadas, ganhe um Certificado Digital e-CPF ou e-CNPJ.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "IRPF Gratuito",
    description: "Clientes parceiros que indicam 5 ou mais empresas ganham declaração de IRPF grátis.",
    icon: Shield,
  },
];
```

### Componentes reutilizados:
- `Carousel`, `CarouselContent`, `CarouselItem` (do Embla)
- `Autoplay` do embla-carousel-autoplay
- `motion` do framer-motion
- Cores: gradiente teal (secondary) da marca

### Características visuais (baseadas no RoutineCarousel):
- Cards com borda sutil e hover effect
- Número grande no canto superior direito
- Ícone em caixa gradiente teal
- Título em destaque
- Descrição em texto muted
- Elemento decorativo no canto inferior

---

## Destaque dos Modelos de Comissão

No subtítulo da seção, enfatizar claramente:
> "Escolha: **100% da 1ª mensalidade** OU **10% de recorrência**"

---

## Alterações em `src/pages/IndiqueGanhe.tsx`

1. **Importar** o novo componente `PartnerBenefitsCarousel`
2. **Substituir** a seção "Benefícios" (linhas 375-400) pelo novo componente
3. **Manter** o array `benefits` no arquivo (usado pelo novo componente)

---

## Resumo das Alterações

| Arquivo | Ação |
|---------|------|
| `src/components/indique-ganhe/PartnerBenefitsCarousel.tsx` | **Criar** - Carrossel estilo RoutineCarousel |
| `src/pages/IndiqueGanhe.tsx` | **Editar** - Substituir grid por novo componente |

---

## Diferença Visual: Antes vs Depois

| Característica | Antes | Depois |
|----------------|-------|--------|
| Layout | Grid 4 colunas | Carrossel animado |
| Numeração | Sem | Com (01, 02, 03, 04) |
| Ícones | Caixa simples | Caixa gradiente |
| Animação | Nenhuma | Entrada + autoplay |
| Navegação | Nenhuma | Dots clicáveis |
| Interatividade | Hover simples | Hover + scale |
| Responsividade | Grid adaptativo | 1/2/3 cards por viewport |

---

## Seção Técnica

### Dependências utilizadas (já instaladas):
- `embla-carousel-react`
- `embla-carousel-autoplay`
- `framer-motion`
- `lucide-react`

### Performance:
- Animações GPU-accelerated (transform, opacity)
- `once: true` no useInView
- Componente lazy-loadable se necessário

