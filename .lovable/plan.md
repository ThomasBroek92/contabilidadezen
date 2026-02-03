
# Plano: Criar Pagina de Modelo de Contrato PJ

## Resumo

Criar uma nova landing page em `/conteudo/modelo-contrato-pj` para disponibilizar um modelo gratuito de contrato para prestadores de servicos PJ. A pagina seguira o padrao visual das outras ferramentas de conteudo (GeradorInvoice, AbrirEmpresa), com Hero de 2 colunas, carrossel de beneficios e secoes de conversao.

**Link do Google Docs fornecido:**
`https://docs.google.com/document/d/1umsJsgYNg56nZdjO9Ysg6YFjaudNFgHL/edit?usp=sharing...`

---

## Arquivos a Criar/Modificar

### 1. CRIAR: `src/pages/conteudo/ModeloContratoPJ.tsx`

Pagina completa (~800 linhas) seguindo o padrao do GeradorInvoice/AbrirEmpresa.

### 2. MODIFICAR: `src/App.tsx`

Adicionar import e rota `/conteudo/modelo-contrato-pj`.

---

## Estrutura da Pagina

### Hero Section (Padrao GeradorInvoice)

```text
+--------------------------------------------------+
|  GRID 2 COLUNAS                                  |
+--------------------------------------------------+
| COLUNA ESQUERDA:              | COLUNA DIREITA:  |
| - Badge "100% gratuita"       | - Card mockup    |
| - H1 com gradiente            |   contrato       |
| - Subtitulo                   | - Header gradient|
| - CTA "Baixar Modelo"         | - Preview dados  |
| - Google Reviews Badge        | - Footer Zen     |
+--------------------------------------------------+
|  CARROSSEL DE BENEFICIOS (6 itens, autoplay)     |
+--------------------------------------------------+
```

**6 Beneficios do Carrossel:**
1. 100% Gratuito - Sem custo para download
2. Pronto para Usar - Modelo profissional completo
3. Editavel - Facil personalizacao no Google Docs
4. Seguranca Juridica - Clausulas essenciais inclusas
5. Sem Cadastro - Nenhuma conta necessaria
6. Formato Universal - Compativel com qualquer editor

---

### Secao: O que esta incluido

| Clausulas (lista)                     | Aviso Importante (card amber)         |
|---------------------------------------|---------------------------------------|
| - Objeto e escopo do servico          | Este modelo e um ponto de partida.    |
| - Condicoes de pagamento              | Recomendamos revisao juridica para    |
| - Prazo de vigencia e rescisao        | adequacao ao seu caso especifico.     |
| - Responsabilidades das partes        |                                       |
| - Confidencialidade                   |                                       |
| - Foro e legislacao aplicavel         |                                       |
| - Orientacoes para personalizacao     |                                       |

---

### Secao: Download (Lead Capture)

```text
+------------------------------------------+
|  CARD CENTRAL (max-w-xl)                 |
+------------------------------------------+
|  [Icone FileText]                        |
|  Baixe Seu Modelo de Contrato            |
|                                          |
|  Nome: [________________]                |
|  Email: [________________]               |
|  WhatsApp: [(00) 00000-0000]             |
|                                          |
|  [ ] Aceito a Politica de Privacidade    |
|                                          |
|  [  BAIXAR MODELO GRATUITO  ]            |
+------------------------------------------+

APOS SUBMIT:
+------------------------------------------+
|  [Icone CheckCircle verde]               |
|  Pronto! Seu modelo esta disponivel      |
|                                          |
|  [ ABRIR MODELO NO GOOGLE DOCS ]         |
|                                          |
|  O documento abrira em nova aba.         |
+------------------------------------------+
```

---

### Secao: Para quem e este contrato

| Profissionais da Saude | Profissionais de TI    | Outros Prestadores     |
|------------------------|------------------------|------------------------|
| - Medicos              | - Desenvolvedores      | - Advogados            |
| - Dentistas            | - Designers            | - Arquitetos           |
| - Psicologos           | - Infoprodutores       | - Representantes       |
| - Fisioterapeutas      | - Consultores digitais | - Consultores          |

---

### Secao: Como usar este modelo

```text
   [1]                    [2]                    [3]
   BAIXE              PERSONALIZE           REVISE E ASSINE
   
   Clique e acesse    Preencha os dados     Confira tudo e
   o Google Docs      da sua empresa        colete assinaturas
```

---

### Secao: Servicos Relacionados

| Abertura de Empresa     | Planejamento Tributario | Migracao de Contabilidade |
|-------------------------|-------------------------|---------------------------|
| CNPJ em 7 dias uteis    | Economize ate 50%       | Sem burocracia            |
| Sede virtual gratuita   | Fator R otimizado       | 100% digital              |
| -> /abrir-empresa       | -> /contato             | -> /contato               |

---

### Secao: Badges de Confianca

| 100+ Clientes | 10+ Anos | 5.0 Google | CRC-SP 337693/O-7 |

---

### Secao: FAQ

1. **O modelo de contrato e realmente gratuito?**
   Sim, 100% gratuito. Voce pode baixar, editar e usar quantas vezes quiser.

2. **Preciso de advogado para usar este contrato?**
   O modelo e um ponto de partida completo. Para casos especificos, recomendamos revisao juridica.

3. **Posso editar as clausulas do modelo?**
   Sim! O documento esta em formato editavel no Google Docs.

4. **O contrato serve para qualquer tipo de servico?**
   O modelo e generico e cobre a maioria dos casos de prestacao de servicos.

---

### CTA Final

```text
+--------------------------------------------------+
|  FUNDO GRADIENTE PRIMARY                         |
|                                                  |
|  Pronto para formalizar seus contratos?          |
|                                                  |
|  [ BAIXAR MODELO ]  [ FALAR COM ESPECIALISTA ]   |
|                                                  |
|  - Analise gratuita do seu caso                  |
|  - Sem compromisso                               |
|  - Especialistas dedicados                       |
+--------------------------------------------------+
```

---

## Detalhes Tecnicos

### SEO

```typescript
<ToolPageSEO
  title="Modelo de Contrato PJ Gratuito | Download em PDF/Word"
  description="Baixe gratuitamente um modelo de contrato para prestadores de servicos PJ..."
  canonical="/conteudo/modelo-contrato-pj"
  faqs={faqData}
/>
```

### Componentes Reutilizados

- Header, Footer, ToolPageSEO
- Button, Input, Label, Checkbox, Badge
- Carousel, CarouselContent, CarouselItem
- motion (framer-motion) + Autoplay
- useLeadCapture hook
- useQuery (GMB stats)

### Icones Lucide

Download, FileText, Edit, FileCheck, CheckCircle2, AlertTriangle, Stethoscope, Code, Briefcase, Building2, Calculator, RefreshCw, Star, ArrowRight, MessageCircle, Shield, FileDown, UserX, Globe

---

## Fluxo de Captura de Lead

1. Usuario preenche nome, email, whatsapp
2. Aceita checkbox de privacidade
3. Clica em "Baixar Modelo Gratuito"
4. Sistema salva lead com fonte "Modelo Contrato PJ"
5. Mostra botao para abrir Google Docs
6. Google Docs abre em nova aba

---

## Atualizacoes Pos-Implementacao

1. Adicionar entrada na tabela `page_metadata` para sitemap
2. Incluir no array `staticPages` da Edge Function sitemap
3. Incluir no array `staticPages` do google-search-console

