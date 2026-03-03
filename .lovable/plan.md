

## Plano: Mesclar RoutineCarousel + RepresentantesProcess em carrossel unificado

### Objetivo
Substituir o `RepresentantesProcess` atual (grid estático de 4 cards) por um carrossel no estilo do `RoutineCarousel` da homepage, mesclando os steps de ambos os componentes. O visual seguira o padrao da homepage: cards com badges "Sua Parte" (laranja/amber) vs "Contabilidade Zen" (teal/secondary), carousel com autoplay, dots de navegacao e setas.

### Conteudo Mesclado (8 etapas)

| # | Titulo | Owner | Origem |
|---|--------|-------|--------|
| 01 | Escolha nosso servico | client | Process |
| 02 | Preencha o formulario | client | Process |
| 03 | Envie os seus dados | client | Process |
| 04 | Processamento Contabil | zen | Routine |
| 05 | Impostos e Fechamentos | zen | Routine |
| 06 | Obrigacoes Acessorias | zen | Routine |
| 07 | Demonstrativos Anuais | zen | Routine |
| 08 | Formalize a contratacao | client | Process |

Na pratica: os 3 primeiros passos sao do cliente (onboarding), depois 4 passos da Zen (rotina contabil), e o ultimo e a formalizacao (cliente).

### Alteracao Unica

**`RepresentantesProcess.tsx`** — Reescrever completamente:
- Importar `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious` e `Autoplay`
- Usar `useState`/`useEffect` para controlar dots de navegacao (igual RoutineCarousel)
- Cards com o mesmo layout do `StepCard` da homepage:
  - Badge "Sua Parte" (amber/laranja) ou "Contabilidade Zen" (teal)
  - Numero grande no canto
  - Icone colorido por owner
  - Decorative corner element
- Cores do owner "client" usam a paleta laranja da pagina (`#E87C1E`, `#FDE8CC`)
- Cores do owner "zen" usam a paleta teal/secondary da marca
- Header com contagem: "Voce cuida de X etapas simples, nos cuidamos de Y processos complexos"
- Legenda com bolinhas coloridas
- Dots de navegacao + setas desktop
- CTA final com botao laranja
- Background da secao: `bg-[#FEF3E2]` (mantendo o tema laranja claro)
- Carousel com `basis-full sm:basis-1/2 lg:basis-1/3` para responsividade

### Nenhum outro arquivo alterado
A pagina `ContabilidadeRepresentantes.tsx` ja importa `RepresentantesProcess` — nao precisa mudar.

