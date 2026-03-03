

## Plano: Estilizar overlay da imagem e accordions com identidade laranja

### Alteracoes em `RepresentantesBenefits.tsx`

**1. Overlay da imagem (nome/CRC) — tema laranja**
- Trocar gradient overlay de `from-black/70` para `from-[#E87C1E]/90 via-[#C4680F]/70`
- Adicionar sombra no container da imagem: `shadow-[0_8px_30px_-8px_rgba(232,124,30,0.4)]`
- Texto permanece branco (contraste garantido sobre laranja escuro)

**2. Cards de accordion — borda e sombra laranja sutil**
- Card fechado: `border-[#E87C1E]/15` + `shadow-[0_2px_8px_-2px_rgba(232,124,30,0.12)]` + hover com sombra laranja mais forte
- Card aberto: `border-[#E87C1E]/40` + `shadow-[0_4px_16px_-4px_rgba(232,124,30,0.25)]`
- Borda left accent: adicionar `border-l-3 border-l-[#E87C1E]` no card aberto para destaque lateral

**3. Mini-cards de autoridade — manter teal** (contraste visual com o laranja)

Apenas 1 arquivo alterado: `RepresentantesBenefits.tsx`

