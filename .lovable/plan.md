

## Plano: Repaginar layout da página Representantes Comerciais com tema laranja

### Visao Geral
Redesign completo da pagina de segmento Representantes Comerciais, usando a imagem da mulher (asset `03-representante-comercial-bg.webp`) como hero principal, com paleta tematica laranja sobre fundo claro, mantendo contraste e acessibilidade.

### Paleta de Cores Tematica (inline, scoped a esta pagina)
- **Laranja principal**: `#E87C1E` (botoes, CTAs, destaques)
- **Laranja escuro**: `#C4680F` (hover, badges)
- **Laranja claro**: `#FEF3E2` (backgrounds de secoes alternadas)
- **Laranja suave**: `#FDE8CC` (cards, boxes de destaque)
- **Texto escuro**: `#1A1A2E` (foreground, ja existente como primary)
- **Fundo claro**: `#FFFBF5` (fundo geral das secoes)

As cores serao aplicadas com classes Tailwind inline (nao alteramos o design system global).

### Componentes a Alterar (8 arquivos)

**1. RepresentantesHero.tsx** — Redesign completo
- Fundo claro (`bg-[#FFFBF5]`) em vez do dark primary atual
- Layout 2 colunas: texto a esquerda, imagem da mulher (`03-representante-comercial-bg.webp`) a direita como foto principal visivel (nao como background opaco)
- Textos em cor escura, span de destaque em laranja
- Botoes em laranja (`bg-[#E87C1E]`)
- Badge superior em laranja
- Trust indicators com icones laranja
- Imagem com rounded, shadow e overlay gradient sutil laranja

**2. RepresentantesLeadForm.tsx** — Tema laranja
- Trocar todas as referencias `text-secondary`, `bg-secondary` por laranja inline
- Botao submit em laranja
- Box de economia com fundo laranja claro e bordas laranja
- Icones CheckCircle, TrendingDown, etc em laranja

**3. RepresentantesProblems.tsx** — Ajuste sutil
- Background da secao em `bg-[#FEF3E2]` (laranja claro)
- Box inferior de CTA com fundo laranja suave em vez de secondary
- Manter icones de problema em destructive (vermelho, faz sentido semantico)

**4. RepresentantesBenefits.tsx** — Cards com acentos laranja
- Icones em laranja (`text-[#E87C1E]`)
- Hover dos cards com borda laranja
- Fundo dos icones em `bg-[#FDE8CC]`
- Botao CTA em laranja
- Label "Nossos Beneficios" em laranja

**5. RepresentantesProcess.tsx** — Steps em laranja
- Numeros dos steps com fundo laranja
- Icones em laranja
- Fundo dos icones em laranja claro
- Connector lines mantidas
- Background secao em `bg-[#FEF3E2]`
- Botao CTA em laranja
- Span "otimizar" em laranja

**6. RepresentantesTestimonials.tsx** — Estrelas e acentos laranja
- Estrelas `fill-[#E87C1E]` em vez de secondary
- Avatar iniciais em laranja
- Quote icon em laranja
- Botao CTA em laranja
- Label "Depoimentos" em laranja

**7. RepresentantesFAQ.tsx** — Accordion com acentos laranja
- Borda do item aberto em laranja
- Hover do trigger em laranja
- Label "Duvidas Frequentes" em laranja
- Background secao em `bg-[#FEF3E2]`

**8. RepresentantesCTA.tsx** — Secao final em laranja
- Fundo em gradiente laranja escuro (`bg-gradient-to-r from-[#C4680F] to-[#E87C1E]`)
- Texto branco sobre fundo laranja
- Botoes: principal branco, outline com borda branca
- Blur decorativos em tons laranja

### TaxComparisonCalculator — Nao sera alterado
Este componente e compartilhado entre segmentos; nao recebera tema laranja para nao afetar outras paginas.

### Acessibilidade
- Laranja `#E87C1E` sobre branco = ratio 3.1:1 (OK para texto grande/botoes com foreground branco)
- Para texto pequeno, usar laranja escuro `#C4680F` (ratio 4.6:1)
- Botoes terao texto branco sobre laranja, que passa contraste

### SEO
- Nenhuma alteracao em SEOHead, meta tags ou schema — apenas visual

