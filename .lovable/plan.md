
# Plano: Criar Pagina de Modelo de Contrato PJ

## Resumo

Criar uma nova landing page em `/conteudo/modelo-contrato-pj` para disponibilizar um modelo gratuito de contrato para prestadores de servicos PJ. A pagina seguira o padrao visual das outras ferramentas de conteudo (GeradorInvoice, AbrirEmpresa), com Hero de 2 colunas, carrossel de beneficios e secoes de conversao.

**Link do Google Docs fornecido pelo usuario:**
`https://docs.google.com/document/d/1umsJsgYNg56nZdjO9Ysg6YFjaudNFgHL/edit?usp=sharing&ouid=105128360076740347532&rtpof=true&sd=true`

---

## Arquivos a Criar/Modificar

### 1. CRIAR: `src/pages/conteudo/ModeloContratoPJ.tsx`

Pagina completa seguindo o padrao do GeradorInvoice com:

**Hero Section (2 colunas):**
- Badge: "Ferramenta 100% gratuita" com icone CheckCircle2
- H1: "Modelo de Contrato PJ Gratuito. **A burocracia** e por nossa conta."
- Subtitulo descritivo sobre seguranca juridica
- CTA: "Baixar Modelo Gratuito" (scroll para secao download)
- Google Reviews Badge (fetch GMB stats)
- Mockup visual de contrato (desktop only)
- Carrossel de 6 beneficios com Autoplay

**Secoes de Conteudo:**
- O que esta incluido (lista de clausulas + aviso importante)
- Formulario de captura de lead (nome, email, WhatsApp)
- Para quem e este contrato (3 cards: Saude, TI, Outros)
- Como usar este modelo (3 passos timeline)
- Servicos relacionados (Abertura, Planejamento, Migracao)
- Badges de confianca (100+ clientes, 10+ anos, Google rating, CRC)
- FAQ (4 perguntas)
- CTA Final com gradiente

**Componentes utilizados:**
- Header, Footer, ToolPageSEO
- Button, Input, Label, Checkbox, Badge
- Carousel, CarouselContent, CarouselItem
- motion (framer-motion)
- useLeadCapture hook
- useQuery para GMB stats

### 2. MODIFICAR: `src/App.tsx`

Adicionar import e rota:

```tsx
// Adicionar import (linha ~26)
import ModeloContratoPJ from "./pages/conteudo/ModeloContratoPJ";

// Adicionar rota (apos linha 70)
<Route path="/conteudo/modelo-contrato-pj" element={<ModeloContratoPJ />} />
```

---

## Estrutura Detalhada da Pagina

### Hero Section

```text
Layout 2 colunas (grid lg:grid-cols-2)

COLUNA ESQUERDA:
- Badge: "Ferramenta 100% gratuita"
- H1: Modelo de Contrato PJ Gratuito. A burocracia e por nossa conta.
- Subtitulo: Baixe gratuitamente um modelo completo...
- Button hero: "Baixar Modelo Gratuito" -> scroll #download-section
- Google Reviews Badge (link GMB)

COLUNA DIREITA (desktop):
- Card mockup contrato
- Header gradient (secondary->accent)
- Preview: Contratante, Contratado, Clausulas
- Footer: "Disponibilizado por Contabilidade Zen"
- Blur decorativo

CARROSSEL (full width):
- 6 beneficios com autoplay 3s
- Icones: CheckCircle2, FileDown, Edit, Shield, UserX, Globe
```

### Secao: O que esta incluido

```text
Grid 2 colunas

COLUNA 1 - Lista de Clausulas:
- Clausulas de objeto e escopo do servico
- Condicoes de pagamento e reajuste
- Prazo de vigencia e rescisao
- Responsabilidades das partes
- Confidencialidade e propriedade intelectual
- Foro e legislacao aplicavel
- Orientacoes para personalizacao

COLUNA 2 - Card de Aviso:
- Icone AlertTriangle (amber)
- Titulo: Importante
- Texto: Este modelo e um ponto de partida...
```

### Secao: Download (Lead Capture)

```text
Card central com max-w-xl

ESTADO INICIAL (formulario):
- Icone FileText grande
- Titulo: Baixe Seu Modelo de Contrato
- Campos: Nome, Email, WhatsApp (com mascara)
- Checkbox: Aceito Politica de Privacidade
- Button: Baixar Modelo Gratuito

ESTADO APOS SUBMIT (sucesso):
- Icone CheckCircle2 verde
- Titulo: Pronto! Seu modelo esta disponivel
- Button: Abrir Modelo no Google Docs (abre nova aba)
- Texto: O documento abrira em nova aba...
```

### Secao: Para quem e este contrato

```text
Grid 3 colunas (cards)

CARD 1 - Profissionais da Saude (Stethoscope):
- Medicos, Dentistas, Psicologos, Fisioterapeutas

CARD 2 - Profissionais de TI e Digital (Code):
- Desenvolvedores, Designers, Infoprodutores, Consultores digitais

CARD 3 - Outros Prestadores (Briefcase):
- Advogados, Arquitetos, Representantes Comerciais, Consultores
```

### Secao: Como usar este modelo

```text
Grid 3 colunas (timeline)

PASSO 1 (Download):
- Clique no botao e acesse o documento no Google Docs...

PASSO 2 (Edit):
- Preencha os campos com os dados da sua empresa...

PASSO 3 (FileCheck):
- Confira todos os dados, solicite revisao juridica...
```

### Secao: Servicos Relacionados

```text
Grid 3 colunas (cards clicaveis)

CARD 1 - Abertura de Empresa (Building2):
- CNPJ em ate 7 dias uteis
- Sede virtual gratuita
- Link: /abrir-empresa

CARD 2 - Planejamento Tributario (Calculator):
- Economize ate 50% em impostos
- Fator R otimizado
- Link: /contato

CARD 3 - Migracao de Contabilidade (RefreshCw):
- Sem burocracia
- 100% digital
- Link: /contato
```

### Secao: Badges de Confianca

```text
Grid 4 colunas

- 100+ Clientes Ativos
- 10+ Anos no Mercado
- 5.0 Avaliacao Google (dinamico)
- CRC-SP 337693/O-7

Texto de apoio sobre especializacao
```

### Secao: FAQ

```text
4 perguntas em cards

1. O modelo de contrato e realmente gratuito?
2. Preciso de advogado para usar este contrato?
3. Posso editar as clausulas do modelo?
4. O contrato serve para qualquer tipo de servico?
```

### CTA Final

```text
Fundo gradiente primary

Titulo: Pronto para formalizar seus contratos...
Subtitulo: Baixe o modelo gratuito e converse...

2 Buttons:
- Baixar Modelo Gratuito (scroll)
- Falar com Especialista (WhatsApp)

3 Bullet points:
- Analise gratuita do seu caso
- Sem compromisso
- Especialistas dedicados
```

---

## SEO e Metadados

```typescript
<ToolPageSEO
  title="Modelo de Contrato PJ Gratuito | Download em PDF/Word"
  description="Baixe gratuitamente um modelo de contrato para prestadores de servicos PJ. Clausulas completas, editavel e pronto para usar. Ideal para profissionais da saude, TI e consultores."
  canonical="/conteudo/modelo-contrato-pj"
  faqs={faqData}
/>
```

FAQ Schema automatico via ToolPageSEO com as 4 perguntas.

---

## Icones Lucide Utilizados

- Download, FileText, Edit, FileCheck
- CheckCircle2, AlertTriangle
- Stethoscope, Code, Briefcase
- Building2, Calculator, RefreshCw
- Star, ArrowRight, MessageCircle
- Shield, Zap, FileDown, UserX, Lock, Globe

---

## Fluxo de Captura de Lead

1. Usuario preenche nome, email, whatsapp
2. Aceita checkbox de privacidade
3. Clica em "Baixar Modelo Gratuito"
4. Sistema salva lead com fonte "Modelo Contrato PJ"
5. Mostra botao para abrir Google Docs
6. Google Docs abre em nova aba

---

## Estimativa

- Arquivo principal: ~800 linhas
- Estrutura similar ao GeradorInvoice
- Tempo de implementacao: 1 mensagem

---

## Atualizacoes Futuras (pos-implementacao)

1. Adicionar entrada na tabela `page_metadata` para sitemap
2. Incluir no array `staticPages` da Edge Function sitemap
3. Incluir no array `staticPages` do google-search-console (queue-all-pages)

