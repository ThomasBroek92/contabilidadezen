

# Plano: Calculadora de Ganhos para Parceiros

## Objetivo
Criar uma calculadora interativa na página "Indique e Ganhe" posicionada logo abaixo do Hero, permitindo ao parceiro visualizar seus ganhos potenciais.

---

## Especificações da Calculadora

### 1. Campos de Entrada

**Campo 1: Valor da Mensalidade (Select)**
- Opções pré-definidas:
  - R$ 197/mês (MEI / Autônomo)
  - R$ 397/mês (Simples Nacional)
  - R$ 597/mês (Profissional Liberal)
  - R$ 997/mês (Empresas / Lucro Presumido)

**Campo 2: Número de Indicações**
- Input numérico livre (mínimo 1, sem limite máximo)
- Default: 3

**Campo 3: Período para cálculo recorrente (Slider)**
- Range: 6 a 36 meses
- Default: 12 meses

### 2. Modelos de Comissionamento (Tabs)

| Modelo | Descrição | Cálculo |
|--------|-----------|---------|
| **100% do 1º Honorário** | Recebe valor integral da primeira mensalidade | `mensalidade × qtd_clientes` |
| **10% Recorrente** | Recebe 10% enquanto o cliente permanecer ativo | `mensalidade × 10% × qtd_clientes × meses` |

### 3. Resultados Exibidos

- Ganho total (formatado em BRL)
- Descrição contextual do cálculo
- CTA para cadastro

---

## Posicionamento na Página

A calculadora será inserida como **nova seção logo após o Hero**, antes de "Como funciona".

---

## Implementação Técnica

### Arquivo a criar:
`src/components/indique-ganhe/PartnerEarningsCalculator.tsx`

### Estrutura do componente:

```text
┌─────────────────────────────────────────────────────────┐
│  💰 Calcule seus Ganhos                                 │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ 100% do 1º Mês  │  │ 10% Recorrente  │   ← Tabs    │
│  └─────────────────┘  └─────────────────┘              │
│                                                         │
│  Valor da mensalidade:  [Select dropdown]               │
│  Quantas indicações?    [Input number - livre]          │
│  Período (se recorrente): [Slider 6-36 meses]           │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │  🎉 Seu potencial: R$ X.XXX                         ││
│  │  Detalhamento do cálculo                            ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  [  Quero me cadastrar  ]                               │
└─────────────────────────────────────────────────────────┘
```

### Componentes UI utilizados:
- `Card` / `CardContent`
- `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent`
- `Select` / `SelectTrigger` / `SelectContent` / `SelectItem`
- `Input` (type="number", min=1, sem max)
- `Slider`
- `Button`
- `Label`

### Lógica de cálculo:

```typescript
const planos = [
  { valor: 197, label: "R$ 197/mês", descricao: "MEI / Autônomo" },
  { valor: 397, label: "R$ 397/mês", descricao: "Simples Nacional" },
  { valor: 597, label: "R$ 597/mês", descricao: "Profissional Liberal" },
  { valor: 997, label: "R$ 997/mês", descricao: "Empresas / Lucro Presumido" }
];

// Modelo 100% do 1º Honorário
const ganhoImediato = mensalidade * qtdIndicacoes;

// Modelo 10% Recorrente
const ganhoMensal = mensalidade * 0.10 * qtdIndicacoes;
const ganhoTotal = ganhoMensal * meses;
```

---

## Alterações em `src/pages/IndiqueGanhe.tsx`

1. Importar o novo componente `PartnerEarningsCalculator`
2. Adicionar nova seção **logo após o Hero** (antes de "Como Funciona")

---

## Resumo das Alterações

| Arquivo | Ação |
|---------|------|
| `src/components/indique-ganhe/PartnerEarningsCalculator.tsx` | **Criar** - Componente da calculadora |
| `src/pages/IndiqueGanhe.tsx` | **Editar** - Importar e adicionar seção após Hero |

---

## Características Técnicas

- **Input livre**: Número de indicações sem limite máximo (apenas mínimo 1)
- **Tempo real**: Resultados atualizam automaticamente ao alterar valores
- **Mobile-first**: Layout responsivo
- **Acessibilidade**: Labels associados, contraste adequado
- **Conversão**: CTA scroll para o formulário de cadastro

