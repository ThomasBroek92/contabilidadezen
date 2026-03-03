
## Plano: Aplicar padroes da pagina de Representantes na pagina de Medicos

A pagina de medicos sera atualizada para seguir os mesmos padroes visuais e estruturais da pagina de representantes. A cor de acento para medicos sera um azul medico `#0077B6` (azul saude), com variante escura `#005A8C`.

### Arquivos a criar/alterar

**1. MedicosHero.tsx** — Redesign completo
- Fundo claro `#F0F8FF` (azul-gelo) em vez de `bg-primary` escuro
- Imagem local `01-profissionais-saude-bg.webp` em vez de Unsplash
- Badge com icone azul medico
- CTA com `ArrowRight`, botao na cor de acento
- Floating card com borda na cor de acento
- Trust indicators com icones na cor de acento

**2. MedicosLeadForm.tsx** — Alinhar com representantes
- Fundo `#F0F8FF`, borda do card na cor de acento
- Mascara de telefone (formatacao automatica)
- Caixa de economia com stats (Fator R, 6%, 100% legal)
- Botao submit na cor de acento
- Segmento `fonte: 'landing-page-medicos'`

**3. MedicosBenefits.tsx** — Layout de autoridade + accordion
- Duas colunas: imagem Thomas Broek (esquerda) + Collapsible accordion (direita)
- Mini-cards de autoridade (10+ anos, 500+ clientes)
- Botao "Quero esse beneficio" em cada item

**4. MedicosProblems.tsx** — Fundo tematico
- Background `#E8F4FD` (azul claro)
- Box de reassurance com bg na cor de acento

**5. MedicosProcess.tsx** — Carousel com 8 etapas
- 8 steps (4 cliente + 4 Zen) com badges de responsabilidade
- Carousel com autoplay e dots
- Cards com gradiente azul medico (cliente) vs teal (Zen)

**6. MedicosTestimonials.tsx** — GMB reviews + carousel
- Integracao com tabela `gmb_reviews`
- Carousel com autoplay
- Fallback com depoimentos locais
- Cores de acento azul medico

**7. MedicosFAQ.tsx** — Tema azul medico
- Background `#E8F4FD`, borda de acento no accordion
- Hover na cor de acento
- Alterar R$ 15.000 para R$ 5.000

**8. MedicosCTA.tsx** — Gradiente azul medico
- `bg-gradient-to-r from-[#005A8C] to-[#0077B6]`
- Botoes brancos sobre fundo colorido

**9. ContabilidadeMedicos.tsx** — Passar accentColor
- `<TaxComparisonCalculator profession="médico" accentColor="#0077B6" />`

### Resumo de cor
| Elemento | Representantes | Medicos |
|----------|---------------|---------|
| Acento principal | #E87C1E | #0077B6 |
| Acento escuro | #C4680F | #005A8C |
| Fundo claro | #FFFBF5 | #F0F8FF |
| Fundo medio | #FEF3E2 | #E8F4FD |
| Fundo destaque | #FDE8CC | #CCE5F5 |
