

## Plano: Resultado da Calculadora com Comparativo Visual (Farol Verde/Vermelho)

### Problema Atual
No step "result" do `LeadGatedCalculator`, o resultado da economia e o botao de WhatsApp aparecem ao mesmo tempo, sem destaque visual claro entre "sem Zen" (ruim) e "com Zen" (bom).

### Solucao

Redesenhar o step "result" em 2 blocos visuais distintos + CTA separado:

```text
┌──────────────────────────────────┐
│  ✅ Sua economia foi calculada!  │
├──────────────────────────────────┤
│                                  │
│  ┌─── SEM Contabilidade Zen ───┐ │
│  │ 🔴  Impostos: R$ XX.XXX/ano │ │
│  │  bg vermelho claro, borda   │ │
│  │  vermelha, texto vermelho   │ │
│  └─────────────────────────────┘ │
│                                  │
│  ┌─── COM Contabilidade Zen ───┐ │
│  │ 🟢  Impostos: R$ X.XXX/ano  │ │
│  │  bg verde claro, borda      │ │
│  │  verde, texto verde         │ │
│  └─────────────────────────────┘ │
│                                  │
│  ┌─ ECONOMIA ANUAL ───────────┐  │
│  │  R$ XX.XXX  (XX% menos)   │  │
│  │  destaque grande, bold     │  │
│  └────────────────────────────┘  │
│                                  │
│  [  Falar com especialista →  ]  │
│  (botao WhatsApp verde)          │
│                                  │
│  Fazer nova simulacao            │
└──────────────────────────────────┘
```

### Detalhes Visuais

**Card "Sem Contabilidade Zen":**
- Background: `bg-red-50`, borda `border-red-200`
- Icone: circulo vermelho ou `AlertTriangle`
- Texto do valor: `text-red-600 font-bold text-xl`
- Label: "Sem a Contabilidade Zen" + "Você paga mais impostos"

**Card "Com Contabilidade Zen":**
- Background: `bg-green-50`, borda `border-green-200`
- Icone: `CheckCircle` verde ou circulo verde
- Texto do valor: `text-green-600 font-bold text-xl`
- Label: "Com a Contabilidade Zen" + "Impostos otimizados"

**Economia destaque:**
- Valor grande (`text-3xl font-bold text-secondary`)
- Percentual abaixo
- Separador visual acima

**CTA WhatsApp:**
- Botao verde WhatsApp (`bg-[#25D366]`) com texto "Falar com especialista"
- Link `<a target="_blank">` para evitar `ERR_BLOCKED_BY_RESPONSE`
- Gera link via `getWhatsAppLink`

### Arquivo Alterado

**`src/components/sections/LeadGatedCalculator.tsx`** — Reescrever apenas o bloco `step === "result"` (linhas 332-373):
- Adicionar 2 cards comparativos (vermelho vs verde)
- Economia em destaque
- CTA WhatsApp com `<a>` tag (padrao seguro)
- Importar `getWhatsAppLink`, `WHATSAPP_MESSAGES` de `@/lib/whatsapp`
- Importar `AlertTriangle` de lucide

