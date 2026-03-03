

## Plano: Beneficios com Efeito Sanfona Sutil

### Problema
Os flip cards 3D com gradientes vivos ficaram visualmente exagerados e estranhos. O usuario quer algo mais simples e sutil.

### Proposta: Accordion (Sanfona) Limpo

Substituir os flip cards por uma lista/grid de cards com efeito sanfona (expand/collapse). Ao clicar, o card expande suavemente revelando a descricao e o CTA.

**Visual:**
```text
┌─────────────────────────────────┐
│  🧮  Planejamento Tributário   ▼│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  📋  Burocracia Zero           ▲│
│─────────────────────────────────│
│  Cuidamos de DARF, GFIP, SPED  │
│  e todas as obrigações...       │
│                                 │
│  [Quero esse benefício]         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  📊  Controle de Comissões     ▼│
└─────────────────────────────────┘
```

### Detalhes

- Layout: grid `md:grid-cols-2 gap-4` com cards clicaveis
- Card fechado: icone + titulo + chevron, fundo branco, borda sutil, hover com sombra leve
- Card aberto: expande com transicao CSS (`max-height` ou Radix Collapsible) mostrando descricao + CTA
- Cores: neutras (branco/cinza), com acento laranja sutil apenas no icone e no CTA
- Sem gradientes vivos, sem 3D, sem flip
- Transicao suave: `transition: max-height 0.3s ease`
- Usar Radix Collapsible (ja instalado) para acessibilidade

### Arquivo Alterado

**`RepresentantesBenefits.tsx`** — Reescrever:
- Remover FlipCard, gradientes, CSS 3D
- Usar `Collapsible` do Radix para cada card
- Estado `openIndex` (um card aberto por vez, ou multiplos)
- Icone do beneficio com cor laranja sutil (`text-[#E87C1E]`)
- ChevronDown que rotaciona quando aberto
- Descricao + mini-CTA dentro do conteudo colapsavel
- Background da secao: `bg-[#FFFBF5]` (manter)
- Manter CTA geral no final

