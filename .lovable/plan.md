
# Plano: Reformular Hero do Gerador de Invoice

## Objetivo
Transformar a seção hero do Gerador de Invoice para seguir o mesmo padrão visual da página de Abertura de Empresa, mantendo o layout em 2 colunas com visual mockup interativo à direita, benefícios em carrossel e badges de credibilidade.

---

## Mudanças Visuais

### Antes (Atual)
- Hero simples com fundo gradiente azul escuro
- Apenas badges e texto centralizado
- Sem visual interativo ou mockup

### Depois (Novo)
- Layout em 2 colunas (texto à esquerda, mockup à direita)
- Fundo gradiente suave (from-muted/50 to-background)
- Badge "Ferramenta gratuita" estilo Zen
- Mockup simulando uma invoice/fatura preenchida
- Carrossel de benefícios abaixo (autoplay)
- Badge de Google Reviews

---

## Estrutura do Novo Hero

```text
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  [Badge: Ferramenta gratuita]                                  │
│                                                                │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │                          │  │    INVOICE/FATURA        │   │
│  │  Crie invoices           │  │    ──────────────────    │   │
│  │  profissionais em        │  │    Prestador: Sua Empresa│   │
│  │  minutos.                │  │                          │   │
│  │                          │  │    Cliente: Acme Corp    │   │
│  │  Texto descritivo...     │  │                          │   │
│  │                          │  │    Valor: $1,500.00      │   │
│  │  [Começar Agora →]       │  │                          │   │
│  │                          │  │    Contabilidade Zen     │   │
│  │  ★★★★★ 5.0 - Google      │  └──────────────────────────┘   │
│  └──────────────────────────┘                                  │
│                                                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ 29      │ │ 100%    │ │ Bilíngue│ │ Download│              │
│  │ Moedas  │ │ Gratuito│ │ PT/EN   │ │ PDF     │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
└────────────────────────────────────────────────────────────────┘
```

---

## Elementos do Novo Hero

### 1. Badge Superior
- "Ferramenta 100% gratuita" com ícone de check
- Estilo: bg-zen-light-teal text-secondary

### 2. Título Principal (H1)
- "Crie invoices profissionais. **A burocracia** é por nossa conta."
- Texto gradient na palavra destacada

### 3. Subtítulo
- "Gere invoices e faturas em minutos para operações nacionais e internacionais. Suporte a 29 moedas, bilíngue (PT/EN) e download em PDF."

### 4. CTA Principal
- Botão "Começar Agora" com seta
- Scroll suave para o formulário (id="form-section")

### 5. Badge Google Reviews
- Mesmo componente usado na AbrirEmpresaHero
- Busca dados do GMB para exibir rating dinâmico

### 6. Mockup Visual (coluna direita)
- Card simulando uma invoice preenchida
- Elementos dinâmicos mostrando:
  - Header colorido "INVOICE"
  - Dados fictícios de prestador/cliente
  - Valor destacado em USD ($1,500.00)
  - Rodapé "Contabilidade Zen"
- Efeitos decorativos (blurs coloridos)

### 7. Carrossel de Benefícios
- 6 cards com autoplay (3s)
- Benefícios:
  1. 29 Moedas Suportadas
  2. 100% Gratuito
  3. Bilíngue (PT/EN)
  4. Download PDF Instantâneo
  5. Preview em Tempo Real
  6. Sem Cadastro

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/conteudo/GeradorInvoice.tsx` | Substituir seção hero atual pela nova estrutura com 2 colunas, mockup, carrossel e Google Reviews |

---

## Detalhes Técnicos

### Componentes Reutilizados
- `motion` do Framer Motion para animações de entrada
- `Badge` para labels
- `Button` com variant="hero" e size="xl"
- `Carousel` com Autoplay para benefícios
- Query ao GMB para rating dinâmico

### Layout Responsivo
- **Desktop (lg+)**: 2 colunas (50/50)
- **Mobile**: 1 coluna, mockup oculto ou simplificado, carrossel com 2 itens

### Acessibilidade
- H1 único na página
- Links e botões com foco visível
- Aria-labels apropriados

---

## Resultado Esperado
Uma hero section moderna, alinhada com o estilo visual da página de Abertura de Empresa, transmitindo profissionalismo e confiança, com destaque para os benefícios da ferramenta gratuita de geração de invoices.
