

## Plano: Criar paginas de segmentos para E-commerce e Clinicas e Consultorios

Criar landing pages completas para **E-commerce** e **Clinicas e Consultorios**, seguindo o padrao de 8 componentes + pagina container ja estabelecido nos outros segmentos.

### Paleta de cores por segmento

| Segmento | Acento | Escuro | Fundo claro | Fundo medio | Fundo destaque |
|----------|--------|--------|-------------|-------------|----------------|
| E-commerce | #DB2777 | #BE185D | #FDF2F8 | #FCE7F3 | #FBCFE8 |
| Clinicas e Consultorios | #059669 | #047857 | #ECFDF5 | #D1FAE5 | #A7F3D0 |

### Imagens de fundo (ja existem em src/assets/)
- E-commerce: `09-ecommerce-bg.webp`
- Clinicas e Consultorios: `10-clinicas-consultorios-bg.webp`

### Arquivos a criar (18 arquivos)

**E-commerce (8 componentes + 1 pagina):**
- `src/components/segmentos/ecommerce/EcommerceHero.tsx`
- `src/components/segmentos/ecommerce/EcommerceLeadForm.tsx`
- `src/components/segmentos/ecommerce/EcommerceBenefits.tsx`
- `src/components/segmentos/ecommerce/EcommerceProblems.tsx`
- `src/components/segmentos/ecommerce/EcommerceProcess.tsx`
- `src/components/segmentos/ecommerce/EcommerceTestimonials.tsx`
- `src/components/segmentos/ecommerce/EcommerceFAQ.tsx`
- `src/components/segmentos/ecommerce/EcommerceCTA.tsx`
- `src/pages/segmentos/ContabilidadeEcommerce.tsx`

**Clinicas e Consultorios (8 componentes + 1 pagina):**
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosHero.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosLeadForm.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosBenefits.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosProblems.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosProcess.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosTestimonials.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosFAQ.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosCTA.tsx`
- `src/pages/segmentos/ContabilidadeClinicasConsultorios.tsx`

### Conteudo especifico por segmento

**E-commerce:**
- Mercado Livre, Shopee, Amazon, Magalu, Shopify
- Estoque, CMV e controle fiscal
- Dropshipping nacional e internacional
- Substituicao tributaria (ICMS-ST)
- Nota fiscal de venda e devoluções
- Select: Loja propria / Marketplace / Dropshipping / Infoproduto + Fisico

**Clinicas e Consultorios:**
- Equiparacao hospitalar (reducao de IR/CSLL)
- Folha de pagamento de equipe medica
- Gestao de convenios e glosas
- Sociedade medica e holding
- Alvara sanitario e obrigacoes ANVISA
- Select: Clinica Medica / Consultorio Odontologico / Clinica de Estetica / Laboratorio

### Alteracoes em arquivos existentes

1. **src/lib/whatsapp.ts** — Adicionar 2 novas mensagens: `ecommerce`, `clinicasConsultorios`

2. **src/App.tsx** — Adicionar 2 lazy imports + 2 rotas:
   - `/segmentos/contabilidade-para-ecommerce`
   - `/segmentos/contabilidade-para-clinicas-e-consultorios`

3. **src/components/sections/NichesCarousel.tsx** — Atualizar hrefs de E-commerce e Clinicas de `/contato` para as novas URLs

4. **src/components/segmentos/shared/TaxComparisonCalculator.tsx** — Adicionar 2 novas profissoes

5. **Sitemap e indexacao** — Migration SQL para page_metadata + atualizar google-search-console e prerender.mjs

### Estrategia de implementacao

Implementar em 2 lotes: primeiro E-commerce completo, depois Clinicas e Consultorios. Ao final, atualizar App.tsx, whatsapp.ts, NichesCarousel.tsx, sitemap e indexacao de uma vez.

