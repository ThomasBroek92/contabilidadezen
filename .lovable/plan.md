
# Plano: Gerador de Invoice/Fatura Gratuito

## Visao Geral

Criacao de uma ferramenta web completa para geracao de invoices e faturas profissionais, 100% gratuita, integrada ao site da Contabilidade Zen. A ferramenta permitira operacoes nacionais e internacionais com suporte a 29 moedas, preview em tempo real e exportacao PDF.

---

## Arquitetura de Componentes

```text
src/
├── pages/conteudo/
│   └── GeradorInvoice.tsx          ← Pagina principal
│
├── components/gerador-invoice/
│   ├── InvoiceDocumentTypeSelector.tsx  ← Toggle Invoice/Fatura
│   ├── InvoiceProviderForm.tsx          ← Dados do prestador
│   ├── InvoiceClientForm.tsx            ← Dados do cliente
│   ├── InvoiceServiceForm.tsx           ← Detalhes financeiros
│   ├── InvoiceBankingForm.tsx           ← SWIFT/IBAN (condicional)
│   ├── InvoiceThemeSelector.tsx         ← Seletor de cores
│   ├── InvoicePreview.tsx               ← Preview em tempo real
│   ├── InvoiceCTASection.tsx            ← CTAs da Contabilidade Zen
│   └── constants.ts                      ← Moedas, temas, validacoes
│
└── lib/
    └── invoice-utils.ts                  ← Formatacao, mascaras, validacoes
```

---

## Funcionalidades Principais

### 1. Seletor de Tipo de Documento
- Toggle entre **Invoice** (operacoes internacionais) e **Fatura** (operacoes nacionais)
- Labels e campos dinamicos conforme selecao
- Secao de dados bancarios internacionais visivel apenas para Invoice

### 2. Formulario de Dados (Layout 2 colunas desktop)

**Secao 1: Dados do Prestador**
- Codigo da Invoice (opcional)
- Nome/Razao Social* (obrigatorio)
- CNPJ (mascara: XX.XXX.XXX/XXXX-XX)
- Endereco (opcional)
- Telefone (mascara dinamica)
- Email* (obrigatorio, validacao)

**Secao 2: Dados do Cliente**
- Nome do Cliente* (obrigatorio)
- CPF ou CNPJ (mascara inteligente)

**Secao 3: Informacoes Financeiras**
- Moeda* (dropdown com 29 moedas)
- Valor do Servico* (formatacao automatica)
- Data de Emissao* (datepicker, default: hoje)
- Data de Vencimento* (datepicker, validacao >= emissao)
- Titulo do Servico* (max 100 caracteres)
- Descricao* (textarea, 20-1000 caracteres, contador)

**Secao 4: Dados Bancarios (condicional - Invoice)**
- Codigo SWIFT/BIC (8-11 caracteres)
- Codigo IBAN (max 34 caracteres)

**Secao 5: Personalizacao Visual**
- 6 temas de cores (Verde Zen, Azul, Vermelho, Amarelo, Cinza, Padrao)
- Circulos coloridos clicaveis

### 3. Preview em Tempo Real
- Atualizacao com debounce 300ms
- Estrutura A4 simulada
- Aplicacao dinamica do tema selecionado
- Responsivo: coluna lateral desktop, collapsible mobile
- Marca d'agua "Gerado por Contabilidade Zen"

### 4. Geracao de PDF
- Biblioteca: jsPDF (ja instalado)
- Formato A4 (210x297mm)
- Elementos coloridos conforme tema
- Logo da Contabilidade Zen no rodape
- Nome do arquivo: `invoice-[codigo]-[cliente].pdf`

### 5. Lead Capture (Opcional)
- Checkbox: "Aceito receber informacoes sobre contabilidade"
- Integracao com hook `useLeadCapture` existente
- Tag: "Lead - Gerador Invoice"

---

## Detalhes Tecnicos

### Lista de Moedas (29)
```text
BRL, USD, EUR, GBP, JPY, CNY, CHF, CAD, AUD, NZD,
INR, KRW, MXN, ARS, CLP, COP, PEN, UYU, ZAR, RUB,
TRY, SEK, NOK, DKK, PLN, SGD, HKD, THB, MYR
```

### Temas de Cores
| Tema      | Cor Principal |
|-----------|---------------|
| Verde Zen | #10B981       |
| Azul      | #3B82F6       |
| Vermelho  | #EF4444       |
| Amarelo   | #F59E0B       |
| Cinza     | #6B7280       |
| Padrao    | #1F3A55       |

### Validacoes
- Campos obrigatorios: indicador visual (asterisco)
- Validacao onBlur com mensagens especificas
- CNPJ: formato XX.XXX.XXX/XXXX-XX
- CPF: formato XXX.XXX.XXX-XX
- Email: regex padrao
- SWIFT: 8 ou 11 caracteres alfanumericos
- IBAN: max 34 caracteres
- Vencimento >= Emissao

### Responsividade
- Desktop (>= 1024px): 2 colunas (form + preview lado a lado)
- Tablet (768-1023px): 2 colunas ajustadas
- Mobile (< 768px): 1 coluna, preview em modal/drawer com botao flutuante

---

## SEO e Analytics

### Meta Tags
- Title: "Gerador de Invoice e Fatura Gratuito | Contabilidade Zen"
- Description: "Crie invoices e faturas profissionais gratuitamente..."
- Schema: WebApplication (gratis)

### Eventos de Analytics (dataLayer)
- `page_view`: Acesso a ferramenta
- `document_type_selected`: Invoice ou Fatura
- `currency_selected`: Moeda escolhida
- `pdf_generated`: Documento gerado
- `lead_captured`: Lead salvo (se aceitar comunicacoes)

---

## Integracao com Sistema Existente

1. **Roteamento**: Adicionar rota `/conteudo/gerador-invoice` em App.tsx
2. **Menu Header**: Adicionar link em `conteudoLinks`
3. **Sitemap**: Atualizar edge function com nova pagina
4. **page_metadata**: Inserir registro para SEO/indexacao

---

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/conteudo/GeradorInvoice.tsx` | Pagina principal com toda logica |
| `src/components/gerador-invoice/InvoicePreview.tsx` | Componente de preview A4 |
| `src/components/gerador-invoice/InvoiceDocumentTypeSelector.tsx` | Toggle Invoice/Fatura |
| `src/components/gerador-invoice/InvoiceThemeSelector.tsx` | Seletor de 6 temas |
| `src/components/gerador-invoice/constants.ts` | Moedas, temas, simbolos |

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/App.tsx` | Adicionar rota e import |
| `src/components/Header.tsx` | Adicionar link no menu Conteudos |
| `supabase/functions/sitemap/index.ts` | Adicionar URL nova pagina |

---

## Acessibilidade

- Labels associados a todos os inputs
- aria-labels para botoes de icone
- Focus visible em todos os elementos interativos
- Mensagens de erro com aria-describedby
- Contraste minimo 4.5:1
- Navegacao por teclado completa

---

## Estimativa de Complexidade

- **Pagina principal + forms**: Media-alta (reutiliza padroes do GeradorRPA)
- **Preview em tempo real**: Media (debounce + formatacao dinamica)
- **Geracao PDF**: Media (ja temos exemplo no GeradorRPA)
- **Responsividade mobile**: Media (drawer/modal para preview)

**Total estimado**: 1 arquivo principal (~800-1000 linhas) + 4-5 componentes auxiliares

---

## Diferenciais da Ferramenta Zen

1. Badge "100% Gratuito" destacado
2. Tooltips educativos (SWIFT, IBAN, etc.)
3. Link direto WhatsApp para duvidas
4. CTA para calculadora e abertura de empresa
5. Selo CRC-SP no rodape
6. Mensagens contextuais sobre economia tributaria
