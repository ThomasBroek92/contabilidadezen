

## Plano: Cards de Beneficios Interativos com Gradientes Vivos

### Problema Atual
Os cards sao estaticos — apenas borda e hover sutil. Nao chamam atencao nem convidam o usuario a explorar.

### Proposta: Cards com Flip 3D + Gradientes Vivos

Cada card tera **dois lados** (frente e verso) com efeito de flip no hover/tap:

- **Frente**: Icone grande com fundo gradiente vivo, titulo e uma frase curta de impacto
- **Verso**: Descricao completa + um mini-CTA "Saiba mais" que scrolla para o formulario

**Gradientes por card** (alternando laranja, teal e combinacoes):
1. Planejamento Tributario — `from-[#E87C1E] to-[#F5A623]` (laranja quente)
2. Burocracia Zero — `from-secondary to-accent` (teal da marca)
3. Controle de Comissoes — `from-[#C4680F] to-[#E87C1E]` (laranja profundo)
4. Seguranca e Conformidade — `from-accent to-secondary` (verde-azulado)
5. Economia de Tempo — `from-[#E87C1E] via-[#F5A623] to-[#FDE8CC]` (sunset)
6. Atendimento Humanizado — `from-secondary via-accent to-emerald-400` (teal vibrante)

### Interatividade

- **Flip 3D via CSS** (`perspective`, `rotateY`, `backface-visibility`) — sem Framer Motion, performatico
- **No mobile**: flip ativado por tap (toggle via state), nao hover
- **Indicador visual**: icone de "virar" sutil no canto do card
- **Numero sequencial** no canto superior (01-06) com opacidade baixa, estilo do ProcessCarousel

### Estrutura Visual (frente)

```text
┌─────────────────────────┐
│  01              ↻      │
│                         │
│   ┌──────────┐          │
│   │ ICONE    │  gradient │
│   │ GRANDE   │  bg      │
│   └──────────┘          │
│                         │
│   Planejamento          │
│   Tributário            │
│                         │
│   "Pague menos impostos │
│    legalmente"          │
└─────────────────────────┘
```

### Estrutura Visual (verso)

```text
┌─────────────────────────┐
│                         │
│  Descricao completa     │
│  do beneficio com       │
│  texto detalhado...     │
│                         │
│  ──────────────────     │
│  [Quero esse beneficio] │
│         CTA laranja     │
└─────────────────────────┘
```

### Arquivo Alterado

**`RepresentantesBenefits.tsx`** — Reescrever o grid de cards:
- Cada card vira um componente `FlipCard` com CSS 3D transform
- Estado `flipped` por card (para mobile tap)
- Frente: icone centralizado com fundo gradiente, numero, titulo, tagline curta
- Verso: fundo claro, descricao completa, mini-CTA
- CSS inline para `perspective: 1000px`, `transform-style: preserve-3d`, `backface-visibility: hidden`
- Transicao suave: `transition: transform 0.6s`
- Hover no desktop: `group-hover:[transform:rotateY(180deg)]`
- Mobile: onClick toggle
- Manter grid `md:grid-cols-2 lg:grid-cols-3 gap-8`
- Adicionar taglines curtas para cada card (frases de impacto de 1 linha)
- Botao CTA geral permanece abaixo do grid

### Taglines (frente dos cards)

1. "Pague menos impostos legalmente"
2. "Voce vende, nos cuidamos do resto"
3. "Visao clara de cada representada"
4. "Fique 100% regular sem preocupacao"
5. "Mais tempo para fechar negocios"
6. "Seu contador, sempre acessivel"

### Performance
- CSS puro para animacoes (transform + opacity apenas)
- Sem bibliotecas adicionais
- `will-change: transform` apenas nos cards ativos

