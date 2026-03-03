

## Plano: Criar 5 novas paginas de segmentos

Criar landing pages completas para **Produtores Digitais**, **Profissionais de TI**, **Exportacao de Servicos**, **Prestadores de Servico** e **Profissionais PJs**, seguindo o padrao visual e funcional estabelecido (Representantes/Medicos/Dentistas/Psicologos).

### Paleta de cores por segmento

| Segmento | Acento | Escuro | Fundo claro | Fundo medio | Fundo destaque |
|----------|--------|--------|-------------|-------------|----------------|
| Produtores Digitais | #9333EA | #7E22CE | #FAF5FF | #F3E8FF | #E9D5FF |
| Profissionais de TI | #0891B2 | #0E7490 | #F0FDFA | #CFFAFE | #A5F3FC |
| Exportacao de Servicos | #2563EB | #1D4ED8 | #EFF6FF | #DBEAFE | #BFDBFE |
| Prestadores de Servico | #D97706 | #B45309 | #FFFBEB | #FEF3C7 | #FDE68A |
| Profissionais PJs | #4F46E5 | #4338CA | #EEF2FF | #E0E7FF | #C7D2FE |

### Imagens de fundo (ja existem em src/assets/)
- Produtores Digitais: `04-produtores-digitais-bg.webp`
- Profissionais de TI: `05-profissionais-ti-bg.webp`
- Exportacao de Servicos: `06-exportacao-servicos-bg.webp`
- Prestadores de Servico: `07-prestadores-servico-bg.webp`
- Profissionais PJs: `08-profissionais-pj-bg.webp`

### Arquivos a criar (45 arquivos)

**Para cada segmento (8 componentes + 1 pagina):**

1. **Hero** — Fundo claro, imagem local, badge tematico, floating card, trust indicators
2. **LeadForm** — Mascara de telefone, campo profissao, selects especificos do segmento, caixa de economia (Fator R/6%), success view com WhatsApp
3. **Benefits** — Layout 2 colunas: imagem Thomas Broek + Collapsible accordion tematico
4. **Problems** — Fundo medio, grid 2 colunas, box reassurance tematico
5. **Process** — Carousel 8 etapas (4 cliente + 4 Zen), autoplay, dots
6. **Testimonials** — GMB reviews via Supabase, carousel, fallback especifico
7. **FAQ** — 6-8 perguntas especificas, accordion tematico, fundo medio
8. **CTA** — Gradiente tematico, botoes brancos, WhatsApp key

**Pastas:**
- `src/components/segmentos/produtores-digitais/` (8 arquivos)
- `src/components/segmentos/profissionais-ti/` (8 arquivos)
- `src/components/segmentos/exportacao-servicos/` (8 arquivos)
- `src/components/segmentos/prestadores-servico/` (8 arquivos)
- `src/components/segmentos/profissionais-pj/` (8 arquivos)

**Paginas container (5 arquivos):**
- `src/pages/segmentos/ContabilidadeProdutoresDigitais.tsx`
- `src/pages/segmentos/ContabilidadeProfissionaisTI.tsx`
- `src/pages/segmentos/ContabilidadeExportacaoServicos.tsx`
- `src/pages/segmentos/ContabilidadePrestadoresServico.tsx`
- `src/pages/segmentos/ContabilidadeProfissionaisPJ.tsx`

### Conteudo especifico por segmento

**Produtores Digitais:**
- Hotmart, Eduzz, Monetizze, Kiwify
- Nota fiscal para infoprodutos
- Anexo III vs V do Simples
- Faturamento internacional (afiliados gringos)
- Select: Infoprodutor / Afiliado / Coprodutor / Gestor de trafego

**Profissionais de TI:**
- Desenvolvedores, DevOps, Data Scientists
- Contratos PJ com empresas
- Fator R estrategico para dev
- Recebimento do exterior (freelancer)
- Select: Desenvolvedor / DevOps / Data Science / Product Manager / Designer

**Exportacao de Servicos:**
- Isencao de ISS (LC 116/2003)
- Recebimento em dolar/euro
- Contratos internacionais
- Cambio e compliance
- Select: Consultoria / Tecnologia / Design / Marketing / Outros

**Prestadores de Servico:**
- Consultores, freelancers, autonomos
- Enquadramento correto (Simples/LP)
- Emissao de NFS-e
- Fator R para reducao
- Select: Consultor / Freelancer / Autonomo / Agencia

**Profissionais PJs:**
- Transicao CLT para PJ
- Planejamento tributario PJ
- Pro-labore otimizado
- Beneficios vs economia PJ
- Select: CLT migrando para PJ / Ja sou PJ / Autonomo querendo formalizar

### Alteracoes em arquivos existentes

1. **src/lib/whatsapp.ts** — Adicionar 5 novas mensagens: `produtoresDigitais`, `profissionaisTI`, `exportacaoServicos`, `prestadoresServico`, `profissionaisPJ`

2. **src/App.tsx** — Adicionar 5 lazy imports + 5 rotas:
   - `/segmentos/contabilidade-para-produtores-digitais`
   - `/segmentos/contabilidade-para-profissionais-de-ti`
   - `/segmentos/contabilidade-para-exportacao-de-servicos`
   - `/segmentos/contabilidade-para-prestadores-de-servico`
   - `/segmentos/contabilidade-para-profissionais-pj`

3. **src/components/sections/NichesCarousel.tsx** — Atualizar hrefs dos 5 nichos de `/contato` para as novas URLs de segmento

### Estrategia de implementacao

Devido ao volume (45+ arquivos), implementarei em 5 lotes sequenciais — um segmento por vez, cada lote criando os 8 componentes + pagina container. Apos os 5 segmentos, atualizo App.tsx, whatsapp.ts e NichesCarousel.tsx de uma vez.

