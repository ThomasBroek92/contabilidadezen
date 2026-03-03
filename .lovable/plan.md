

## Plano: Layout 2 Colunas — Imagem de Autoridade + Sanfona de Beneficios

### Estrutura

Transformar a secao de beneficios em layout `lg:grid-cols-5` (ou similar):
- **Coluna esquerda (~40%)**: Imagem do Thomas Broek (hero-founder.webp da homepage), com card de autoridade flutuante sobrepondo levemente os acordeoes
- **Coluna direita (~60%)**: Os 6 acordeoes (sanfona) existentes, com leve sobreposicao negativa a esquerda (`-ml-8 lg:-ml-12`)

### Coluna Esquerda — Imagem + Autoridade

```text
┌──────────────────────┐
│                      │
│   [Foto Thomas]      │
│   rounded corners    │
│   gradient overlay   │
│   bottom card:       │
│   "Thomas Broek"     │
│   CRC-SP 337693/O-7  │
│                      │
├──────────────────────┤
│ ┌──────┐  ┌────────┐ │
│ │ 10+  │  │  200+  │ │
│ │ anos │  │clientes│ │
│ └──────┘  └────────┘ │
└──────────────────────┘
```

- Usar `/images/hero-founder.webp` (ja existe no public)
- Rounded corners estilo homepage (`rounded-[32px] rounded-bl-[80px]`)
- Gradient overlay na base com nome/CRC
- Abaixo da imagem: 2 mini-cards de autoridade lado a lado
  - "10+ Anos de Experiencia" com icone Award
  - "200+ Clientes Atendidos" com icone Users
- Cores: usar secondary/teal da marca nos cards de autoridade (contraste com laranja dos acordeoes)

### Coluna Direita — Sanfona

- Manter os 6 acordeoes exatamente como estao (Collapsible, ChevronDown, CTA interno)
- Layout single column (empilhados) em vez de grid 2 colunas, para caber melhor ao lado da imagem
- Leve margin-left negativa (`lg:-ml-6`) para criar sobreposicao sutil com a coluna da imagem
- Z-index maior que a imagem para ficar "por cima"

### Responsivo

- **Mobile**: imagem no topo (centralizada, menor) + acordeoes abaixo em coluna unica. Sem sobreposicao
- **Desktop (lg+)**: 2 colunas com sobreposicao

### Arquivo Alterado

**`RepresentantesBenefits.tsx`** — Reestruturar JSX:
- Adicionar coluna esquerda com imagem + cards de autoridade
- Mudar grid de `md:grid-cols-2` para layout 2 colunas (imagem | acordeoes)
- Acordeoes passam de grid 2col para stack vertical
- Adicionar sobreposicao via margin negativa e z-index
- Manter header, CTA final e logica de toggle inalterados

