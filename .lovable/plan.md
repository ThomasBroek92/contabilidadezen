

# Plano: Timeline Animada para "Como Funciona" no Indique e Ganhe

## Objetivo
Substituir a seção "Como Funciona" atual (layout de 3 cards horizontais) pelo mesmo layout de timeline vertical animada usado no `CustomerJourney` da homepage, adaptando o conteúdo para o programa de indicação.

---

## Componente de Referência

O componente `CustomerJourney` (`src/components/sections/CustomerJourney.tsx`) possui:

- **Timeline vertical** com linha de progresso animada pelo scroll
- **Cards com bordas coloridas** (laranja, violeta, verde)
- **Ícones em caixas gradiente** conectados pela linha
- **Animações de entrada** (fade + slide) usando Framer Motion
- **Badges** com cores correspondentes
- **Lista de benefícios** com checkmarks
- **CTA final** para WhatsApp

---

## Novo Componente a Criar

`src/components/indique-ganhe/PartnerJourney.tsx`

### Conteúdo Adaptado (3 passos do programa de indicação)

| Passo | Badge | Título | Ícone | Cor | Descrição | Benefícios |
|-------|-------|--------|-------|-----|-----------|------------|
| 1º | CADASTRO | Torne-se Embaixador! | Users | Laranja | Ao se cadastrar como parceiro, você terá acesso a: | • Link exclusivo de indicação • Materiais de divulgação • Dashboard para acompanhar indicações • Suporte dedicado via WhatsApp |
| 2º | INDICAÇÃO | Compartilhe! | Send | Violeta | Indique empresas e profissionais da sua rede: | • Envie seu link exclusivo • Ou passe os dados via WhatsApp • Acompanhe o status em tempo real • Receba notificações de cada etapa |
| 3º | RECEBIMENTO | Receba seu PIX! | BadgeDollarSign | Verde | Após a confirmação do pagamento da primeira mensalidade: | • Valor integral (100%) via PIX • Pagamento em até 5 dias úteis • Comprovante enviado por WhatsApp • Sem limite de indicações |

---

## Estrutura Visual (mantendo layout original)

```text
┌─────────────────────────────────────────────────────────────────┐
│  [PROGRAMA DE PARCERIA]                                         │
│                                                                 │
│     Como funciona o Indique e Ganhe                             │
│     Do cadastro ao seu PIX, em 3 passos simples.                │
│                                                                 │
│  ┌───┐                                                          │
│  │ 👥│─── [CADASTRO] Primeiro Passo ─────────────────────────┐ │
│  └─┬─┘    Torne-se Embaixador!                               │ │
│    │      • Link exclusivo                                    │ │
│    │      • Materiais de divulgação                          │ │
│    │      • Dashboard para acompanhar                        │ │
│    │      • Suporte dedicado                                 │ │
│    │      └──────────────────────────────────────────────────┘ │
│    │                                                            │
│  ┌─┴─┐                                                          │
│  │ 📤│─── [INDICAÇÃO] Segundo Passo ─────────────────────────┐ │
│  └─┬─┘    Compartilhe!                                       │ │
│    │      • Envie seu link                                    │ │
│    │      • Ou passe dados via WhatsApp                      │ │
│    │      • Acompanhe status                                 │ │
│    │      • Notificações em tempo real                       │ │
│    │      └──────────────────────────────────────────────────┘ │
│    │                                                            │
│  ┌─┴─┐                                                          │
│  │ 💰│─── [RECEBIMENTO] Terceiro Passo ──────────────────────┐ │
│  └───┘    Receba seu PIX!                                    │ │
│           • 100% da 1ª mensalidade                           │ │
│           • PIX em até 5 dias                                │ │
│           • Comprovante via WhatsApp                         │ │
│           • Sem limite de indicações                         │ │
│           └──────────────────────────────────────────────────┘ │
│                                                                 │
│           [ Quero me cadastrar agora ]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementação Técnica

### Arquivo a criar:
`src/components/indique-ganhe/PartnerJourney.tsx`

### Estrutura baseada no CustomerJourney:

```typescript
// Dados adaptados para o programa de indicação
const journeySteps = [
  {
    id: 1,
    badge: "CADASTRO",
    title: "Torne-se Embaixador!",
    icon: Users,
    gradient: "from-orange-500 to-orange-400",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-600",
    borderColor: "border-orange-500",
    description: "Ao se cadastrar como parceiro embaixador, você terá acesso a:",
    benefits: [
      "Link exclusivo de indicação personalizado",
      "Materiais de divulgação prontos para usar",
      "Dashboard para acompanhar suas indicações",
      "Suporte dedicado via WhatsApp",
    ],
    conclusion: "Em menos de 60 segundos você está pronto para começar a indicar e ganhar.",
    step: "Primeiro Passo",
    stepLabel: "Iniciando sua parceria",
  },
  // ... (demais passos)
];
```

### Componentes reutilizados:
- `TimelineCard` (mesma estrutura do CustomerJourney)
- Animações com `framer-motion` (useInView, useScroll, useTransform)
- Linha de progresso animada pelo scroll
- CTA scroll para seção de cadastro

---

## Alterações em `src/pages/IndiqueGanhe.tsx`

1. **Remover** a seção "Como Funciona" atual (linhas ~370-398)
2. **Importar** o novo componente `PartnerJourney`
3. **Adicionar** `<PartnerJourney />` no lugar da seção removida

---

## Resumo das Alterações

| Arquivo | Ação |
|---------|------|
| `src/components/indique-ganhe/PartnerJourney.tsx` | **Criar** - Timeline animada adaptada |
| `src/pages/IndiqueGanhe.tsx` | **Editar** - Substituir seção "Como Funciona" pelo novo componente |

---

## Características Mantidas do Original

| Característica | Descrição |
|----------------|-----------|
| Timeline vertical | Linha conectando os passos com progresso animado |
| Animação de scroll | Linha preenche conforme usuário rola a página |
| Animação de entrada | Cards entram com fade + slide ao entrar na viewport |
| Cores por etapa | Laranja → Violeta → Verde (mesma paleta) |
| Cards com borda | Borda colorida correspondente a cada etapa |
| Lista com checkmarks | Benefícios com ícone CheckCircle na cor da etapa |
| Responsivo | Layout adaptado para mobile e desktop |

---

## Seção Técnica

### Dependências utilizadas (já instaladas):
- `framer-motion` - Animações
- `lucide-react` - Ícones

### Hooks do Framer Motion:
- `useInView` - Detectar quando elemento entra na viewport
- `useScroll` - Acompanhar progresso do scroll
- `useTransform` - Transformar valores de scroll em animações

### Performance:
- Animações com `transform` e `opacity` apenas (GPU-accelerated)
- `once: true` no useInView para animar apenas uma vez
- Componente lazy-loadable se necessário

