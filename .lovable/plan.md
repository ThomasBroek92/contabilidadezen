
# Plano: Landing Page para Representantes Comerciais

## Objetivo
Criar uma landing page completa e otimizada para SEO no submenu "Soluções" focada em **Representantes Comerciais**, seguindo o padrão de estrutura das páginas existentes (Médicos, Dentistas, Psicólogos) e o prompt detalhado de criação de landing pages nichadas fornecido.

---

## Estrutura de Arquivos a Criar

```text
src/
├── pages/segmentos/
│   └── ContabilidadeRepresentantes.tsx    # Nova página principal
└── components/segmentos/representantes/
    ├── RepresentantesHero.tsx             # Hero section
    ├── RepresentantesLeadForm.tsx         # Formulário de captura
    ├── RepresentantesBenefits.tsx         # Benefícios/soluções
    ├── RepresentantesProblems.tsx         # Dores do nicho
    ├── RepresentantesProcess.tsx          # Processo 4 etapas
    ├── RepresentantesTestimonials.tsx     # Depoimentos
    ├── RepresentantesFAQ.tsx              # Perguntas frequentes
    └── RepresentantesCTA.tsx              # Call-to-action final
```

---

## Detalhamento por Seção

### 1. Hero Section (`RepresentantesHero.tsx`)
- **Badge**: "Contabilidade para Representantes Comerciais"
- **Título H1**: "Reduza impostos e organize sua representação com contabilidade especializada para representantes comerciais!"
- **Subtítulo**: Foco na economia tributária (Simples Nacional vs Lucro Presumido)
- **CTAs duplos**: "Reduza seus impostos já" + "Agendar diagnóstico gratuito"
- **Trust indicators**: Menos impostos | Registro CORE | Mais tempo
- **Imagem**: Profissional de vendas/representante comercial
- **Floating card**: "+200 Representantes atendidos"

### 2. Formulário de Lead (`RepresentantesLeadForm.tsx`)
- Campos: Nome, E-mail, Telefone/WhatsApp, Profissão (livre)
- Selects específicos:
  - Atividade: Representante Autônomo, Representante PJ, Agência de Representação, Distribuidor
  - Tributação atual: Simples Nacional, Lucro Presumido, Pessoa Física, Não sei
  - Faturamento: faixas de R$
  - Cidade/Estado
  - Tem registro no CORE: Sim/Não
- Checkbox política de privacidade + Honeypot
- Integração com Supabase (tabela `leads`, segmento: 'representantes')
- Notificação WhatsApp automática
- Quadro de economia centralizado (Fator R, 6% a 15%, -50%, 100% legal)

### 3. Seção de Dores (`RepresentantesProblems.tsx`)
Problemas específicos do nicho:
1. **Impostos altos como autônomo** - Pagando até 27,5% de IR + INSS
2. **Gestão de múltiplas representadas** - Dificuldade de organizar comissões de várias empresas
3. **Obrigações CORE** - Medo de irregularidades com o Conselho Regional
4. **Falta de controle financeiro** - Comissões variáveis e fluxo de caixa instável

### 4. Seção de Benefícios (`RepresentantesBenefits.tsx`)
Soluções oferecidas:
1. **Planejamento Tributário** - Escolha ideal entre Simples Nacional e Lucro Presumido
2. **Burocracia Zero** - Cuidamos de DARF, GFIP, SPED e obrigações CORE
3. **Controle de Comissões** - Gestão organizada de múltiplas representadas
4. **Segurança e Conformidade** - Regularidade com Receita Federal e CORE
5. **Economia de Tempo** - Automatização de notas e obrigações
6. **Atendimento Humanizado** - Contador dedicado que entende vendas

### 5. Seção de Processo (`RepresentantesProcess.tsx`)
4 etapas:
1. Escolha nosso serviço
2. Preencha o formulário
3. Envie seus dados
4. Formalize a contratação

### 6. Calculadora de Impostos
- Reutilizar componente existente: `TaxComparisonCalculator`
- Prop `profession="representante comercial"`

### 7. Depoimentos (`RepresentantesTestimonials.tsx`)
- 3 depoimentos fictícios de representantes comerciais
- Nome, profissão, foto, texto focado em economia e tranquilidade
- Tempo como cliente

### 8. FAQ (`RepresentantesFAQ.tsx`)
Perguntas específicas para representantes:
1. Qual o melhor regime tributário para representante comercial?
2. Preciso ter registro no CORE para atuar como PJ?
3. Como funciona a tributação de comissões de várias representadas?
4. Quais CNAEs são recomendados para representante comercial?
5. Posso ser MEI como representante comercial?
6. Como declarar comissões recebidas de empresas diferentes?
7. Qual a diferença entre representante autônomo e PJ?
8. Como funciona o Fator R para representantes?

### 9. CTA Final (`RepresentantesCTA.tsx`)
- Título: "Pare de perder dinheiro com impostos!"
- Subtítulo: "A Contabilidade Zen resolve isso agora."
- CTAs: "Agendar reunião e economizar" + "Falar no WhatsApp"

---

## Modificações em Arquivos Existentes

### 1. `src/components/Header.tsx`
Adicionar novo item no array `solucoesLinks`:
```typescript
{ name: "Contabilidade para Representantes Comerciais", href: "/segmentos/contabilidade-para-representantes-comerciais" }
```

### 2. `src/App.tsx`
Adicionar nova rota:
```typescript
import ContabilidadeRepresentantes from "./pages/segmentos/ContabilidadeRepresentantes";
// ...
<Route path="/segmentos/contabilidade-para-representantes-comerciais" element={<ContabilidadeRepresentantes />} />
```

### 3. `src/components/sections/NichesCarousel.tsx`
Atualizar o `href` do card "REPRESENTANTES COMERCIAIS" (linha 79):
```typescript
href: "/segmentos/contabilidade-para-representantes-comerciais"
```

---

## SEO e Schema

### Meta Tags (Helmet)
- **Title**: "Contabilidade para Representantes Comerciais | Reduza Impostos"
- **Description**: "Contabilidade especializada para representantes comerciais. Reduza impostos, organize comissões de múltiplas representadas e mantenha conformidade com o CORE."
- **Keywords**: contabilidade para representantes comerciais, representante comercial PJ, contabilidade para representação, planejamento tributário representante, CORE representante comercial
- **Canonical**: `https://www.contabilidadezen.com.br/segmentos/contabilidade-para-representantes-comerciais`
- **OG Tags**: title, description, url, type

### Schema Markup (futuro)
- FAQPage schema para rich snippets
- ProfessionalService schema

---

## Ordem das Seções na Página

```text
1. Header (existente)
2. RepresentantesHero
3. RepresentantesLeadForm
4. TaxComparisonCalculator (profession="representante comercial")
5. RepresentantesProblems
6. RepresentantesBenefits
7. RepresentantesProcess
8. RepresentantesTestimonials
9. RepresentantesFAQ
10. RepresentantesCTA
11. Footer (existente)
```

---

## Checklist de Implementação

- [ ] Criar pasta `src/components/segmentos/representantes/`
- [ ] Criar 8 componentes de seção
- [ ] Criar página principal `ContabilidadeRepresentantes.tsx`
- [ ] Adicionar rota no `App.tsx`
- [ ] Adicionar link no menu `Header.tsx`
- [ ] Atualizar href no `NichesCarousel.tsx`
- [ ] Testar formulário de lead (Supabase + WhatsApp)
- [ ] Validar SEO (title, meta, canonical)
- [ ] Testar responsividade mobile

---

## Estimativa de Esforço
- **9 novos arquivos** a criar
- **3 arquivos existentes** a modificar
- Estrutura 100% baseada no padrão de Médicos/Dentistas/Psicólogos
