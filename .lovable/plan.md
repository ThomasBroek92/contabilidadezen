

## Plano: Destacar calculadora com cor do nicho

### Alteracoes em `src/components/segmentos/shared/TaxComparisonCalculator.tsx`

**1. Adicionar prop `accentColor` ao componente** (interface + prop)
- Nova prop opcional `accentColor?: string` (default: `secondary`)
- Na pagina de representantes, passar `accentColor="#E87C1E"`

**2. Header "Simule sua economia" mais impactante** (linhas 166-178)
- Icone maior com fundo na cor do nicho (`bg-[#E87C1E]/10`, icone `text-[#E87C1E]`)
- Titulo maior (`text-2xl lg:text-3xl font-bold`)
- Subtitulo com mais destaque
- Borda do card com cor do nicho (`border-[accentColor]/30`)

**3. Botao "Ver minha economia" na cor do nicho** (linhas 255-270)
- Trocar de `Button` default para estilo customizado com `bg-[accentColor]`
- Tamanho `xl`, texto maior, mais visivel

**4. Alteracao em `ContabilidadeRepresentantes.tsx`**
- Passar `accentColor="#E87C1E"` no `<TaxComparisonCalculator>`

### Resultado Visual

```text
┌─────────────────────────────────────────┐
│  ┌──────┐                               │
│  │ 🧮   │  Simule sua economia          │  ← icone laranja, titulo grande
│  │laranja│  Preencha para ver resultado  │
│  └──────┘                               │
│                                         │
│  [Faturamento ▼]                        │
│  [Nome] [WhatsApp] [Email]              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │   VER MINHA ECONOMIA  →         │    │  ← botao laranja grande
│  └─────────────────────────────────┘    │
│                                         │
│  borda do card laranja sutil            │
└─────────────────────────────────────────┘
```

### Arquivos Alterados
- `src/components/segmentos/shared/TaxComparisonCalculator.tsx` — props + styling
- `src/pages/segmentos/ContabilidadeRepresentantes.tsx` — passar accentColor

