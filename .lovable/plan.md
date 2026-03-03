

## Plano: Aplicar padrao visual de Representantes/Medicos para Dentistas e Psicologos

Ambas as paginas serao atualizadas para seguir o mesmo padrao: hero com fundo claro e imagem local, lead form com mascara de telefone e caixa de economia, benefits com accordion + imagem de autoridade, problems com fundo tematico e box de reassurance, process com carousel de 8 etapas, testimonials com GMB reviews e carousel, FAQ e CTA com cores tematicas.

### Paleta de cores por segmento

| Elemento | Dentistas | Psicologos |
|----------|-----------|------------|
| Acento principal | #10B981 (verde esmeralda) | #8B5CF6 (roxo) |
| Acento escuro | #059669 | #7C3AED |
| Fundo claro | #F0FDF9 | #F5F3FF |
| Fundo medio | #D1FAE5 | #EDE9FE |
| Fundo destaque | #A7F3D0 | #DDD6FE |

### Imagens locais
- Dentistas: `src/assets/01-profissionais-saude-bg.webp` (mesma de medicos, ou criar uma especifica se disponivel)
- Psicologos: `src/assets/01-profissionais-saude-bg.webp` (idem)

### Arquivos a alterar (16 arquivos)

**Dentistas (8 arquivos):**

1. **DentistasHero.tsx** — Fundo `#F0FDF9`, imagem local, badge verde, floating card com borda verde, trust indicators com icone verde, ArrowRight no CTA
2. **DentistasLeadForm.tsx** — Fundo `#F0FDF9`, borda card verde, mascara de telefone, campo profissao, caixa de economia (Fator R, 6%, 100% legal), botao verde, fonte `landing-page-dentistas`, salvar info adicionais em observacoes
3. **DentistasBenefits.tsx** — Layout 2 colunas: imagem Thomas Broek (esquerda) + Collapsible accordion (direita) com cores verdes, mini-cards autoridade (10+ anos, 300+ clientes), botao "Quero esse beneficio"
4. **DentistasProblems.tsx** — Fundo `#D1FAE5`, layout 2 colunas (md:grid-cols-2), box reassurance `#A7F3D0` com borda verde
5. **DentistasProcess.tsx** — Carousel 8 etapas (4 cliente verde + 4 Zen teal), autoplay, dots, badges de responsabilidade
6. **DentistasTestimonials.tsx** — GMB reviews via Supabase, carousel com autoplay, fallback com depoimentos locais, estrelas verdes
7. **DentistasFAQ.tsx** — Fundo `#D1FAE5`, borda accordion verde no open, hover verde, alterar R$15.000 para R$5.000
8. **DentistasCTA.tsx** — Gradiente `from-[#059669] to-[#10B981]`, botoes brancos, usar `getWhatsAppAnchorPropsByKey("dentistas")`

**Psicologos (8 arquivos):**

1. **PsicologosHero.tsx** — Fundo `#F5F3FF`, imagem local, badge roxo, floating card com borda roxa, trust indicators
2. **PsicologosLeadForm.tsx** — Fundo `#F5F3FF`, borda card roxa, mascara de telefone, campo profissao, caixa de economia, botao roxo, fonte `landing-page-psicologos`
3. **PsicologosBenefits.tsx** — Layout accordion + imagem autoridade, cores roxas
4. **PsicologosProblems.tsx** — Fundo `#EDE9FE`, layout 2 colunas, box reassurance `#DDD6FE`
5. **PsicologosProcess.tsx** — Carousel 8 etapas, cores roxas (cliente) + teal (Zen)
6. **PsicologosTestimonials.tsx** — GMB reviews, carousel, fallback, estrelas roxas
7. **PsicologosFAQ.tsx** — Fundo `#EDE9FE`, borda roxa, alterar R$10.000 para R$5.000
8. **PsicologosCTA.tsx** — Gradiente `from-[#7C3AED] to-[#8B5CF6]`, botoes brancos, usar `getWhatsAppAnchorPropsByKey("psicologos")`

**Paginas container (2 arquivos):**

9. **ContabilidadeDentistas.tsx** — Passar `accentColor="#10B981"` ao TaxComparisonCalculator
10. **ContabilidadePsicologos.tsx** — Passar `accentColor="#8B5CF6"` ao TaxComparisonCalculator

### Conteudo especifico mantido
- Dentistas: CRO (nao CRP/CORE), depoimentos de dentistas, atividades odontologicas no form
- Psicologos: CRP (nao CRO/CORE), depoimentos de psicologos, atividades de psicologia no form, pergunta "atende online" na FAQ

### Padrao seguido fielmente
Cada componente sera uma copia funcional do equivalente em Medicos/Representantes, com substituicao de:
- Cores (hex)
- Textos especificos do segmento
- Icone do badge (Smile para dentistas, Brain para psicologos)
- Fallback testimonials especificos
- Campos do formulario especificos

