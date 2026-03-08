

## Analise: Segmentos com e sem Landing Page Dedicada

### Segmentos no NichesCarousel (14 nichos)

| # | Segmento | Landing Page | Status |
|---|----------|-------------|--------|
| 1 | Medicos | `/segmentos/contabilidade-para-medicos` | OK |
| 2 | Dentistas | `/segmentos/contabilidade-para-dentistas` | OK |
| 3 | Psicologos | `/segmentos/contabilidade-para-psicologos` | OK |
| 4 | **Advogados** | **Aponta para `/contato`** | **FALTANDO** |
| 5 | Representantes Comerciais | `/segmentos/contabilidade-para-representantes-comerciais` | OK |
| 6 | Produtores Digitais | `/segmentos/contabilidade-para-produtores-digitais` | OK |
| 7 | Profissionais de TI | `/segmentos/contabilidade-para-profissionais-de-ti` | OK |
| 8 | Exportacao de Servicos | `/segmentos/contabilidade-para-exportacao-de-servicos` | OK |
| 9 | Prestadores de Servico | `/segmentos/contabilidade-para-prestadores-de-servico` | OK |
| 10 | Profissionais PJ | `/segmentos/contabilidade-para-profissionais-pj` | OK |
| 11 | E-commerce | `/segmentos/contabilidade-para-ecommerce` | OK |
| 12 | Clinicas e Consultorios | `/segmentos/contabilidade-para-clinicas-e-consultorios` | OK |
| 13 | YouTubers/Creators | `/segmentos/contabilidade-para-youtubers-e-creators` | OK |
| 14 | Outros Segmentos | `/segmentos/contabilidade-para-outros-segmentos` | OK |

### Resultado: **1 segmento faltando — Advogados**

Os 13 outros nichos ja possuem landing page dedicada com a arquitetura padrao de 8 componentes (Hero, LeadForm, Benefits, Problems, Process, Testimonials, FAQ, CTA).

---

## Plano de Acao: Criar Landing Page para Advogados

### Bloco 1 — Criar 8 componentes em `src/components/segmentos/advogados/`

Seguindo o padrao existente (ex: dentistas, medicos), criar:

- `AdvogadosHero.tsx` — Hero com cor slate (#334155), imagem `02-advogados-bg.webp` (ja existe em assets), CTA WhatsApp
- `AdvogadosLeadForm.tsx` — Formulario de lead com mascara de telefone e caixa de economia
- `AdvogadosBenefits.tsx` — Beneficios em duas colunas (autoridade + accordion)
- `AdvogadosProblems.tsx` — Dores especificas (OAB, sociedade de advogados, Simples vs Lucro Presumido)
- `AdvogadosProcess.tsx` — Carrossel 8 etapas (4 cliente + 4 Zen)
- `AdvogadosTestimonials.tsx` — Depoimentos dinamicos
- `AdvogadosFAQ.tsx` — 6-8 FAQs especificas (exportar array `advogadosFaqs` para schema)
- `AdvogadosCTA.tsx` — CTA final com gradiente slate

**Conteudo especifico do nicho:**
- Simples Nacional vs Lucro Presumido para escritorios
- Sociedade de advogados (registro OAB)
- Honorarios e provisionamento
- Distribuicao de lucros otimizada
- Obrigacoes acessorias (ISS, IRPJ)

### Bloco 2 — Criar pagina container `src/pages/segmentos/ContabilidadeAdvogados.tsx`

Seguindo o padrao dos outros segmentos: importar os 8 componentes + SEOHead + TaxComparisonCalculator com `accentColor="#334155"` e `profession="advogado"`.

URL canonica: `/segmentos/contabilidade-para-advogados`

### Bloco 3 — Registrar rota no App.tsx

- Adicionar lazy import de `ContabilidadeAdvogados`
- Adicionar `<Route path="/segmentos/contabilidade-para-advogados" ...>`

### Bloco 4 — Atualizar NichesCarousel

Mudar o `href` de Advogados de `/contato` para `/segmentos/contabilidade-para-advogados`.

### Bloco 5 — SEO infra

- Inserir `/segmentos/contabilidade-para-advogados` na tabela `page_metadata` (priority 0.8)
- Adicionar ao bloco `<noscript>` do `index.html`
- A edge function `queue-all-pages` pegara automaticamente do `page_metadata`

### Cores do segmento

Paleta: **Slate (#334155)** — ja usada no gradiente do carrossel (`from-slate-800 to-slate-700`). Accent color para calculadora e CTAs: `#334155`.

### Estimativa

- 8 componentes + 1 pagina + 3 atualizacoes (App.tsx, NichesCarousel, index.html) + 1 migration SQL
- Total: ~12 arquivos criados/editados

