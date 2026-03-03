

## Plano: Remover redirecionamento automatico e adicionar botao WhatsApp na economia

### Alteracoes em `src/components/segmentos/shared/TaxComparisonCalculator.tsx`

**1. Remover `openWhatsAppNotification()` (linhas 121-130)**
- Remover a chamada que abre WhatsApp automaticamente via `window.open` apos submit
- Remover imports de `useWhatsAppNotification`
- O lead continua sendo salvo no banco normalmente

**2. Adicionar botao WhatsApp verde dentro do bloco "Sua economia estimada" (linhas 354-373)**
- Apos os valores de economia mensal/anual, adicionar botao verde WhatsApp (`bg-[#25D366]`)
- Usar `<a>` com `getWhatsAppAnchorProps` (padrao seguro, sem `window.open`)
- Mensagem pre-preenchida com profissao e economia calculada

**3. Simplificar CTA abaixo (linhas 375-398)**
- Remover o botao "Falar pelo WhatsApp" duplicado da secao CTA inferior
- Manter apenas "Agendar consultoria gratuita" ou remover secao CTA inteira (ja tem o botao no bloco de economia)

### Resultado Visual

```text
┌─── Sua economia estimada ───────┐
│  R$ X.XXX/mês  |  R$ XX.XXX/ano │
│                                  │
│  [ 💬 Falar no WhatsApp ]        │
│  (botao verde #25D366, grande)   │
└──────────────────────────────────┘
```

O usuario ve primeiro os resultados da calculadora com destaque, e so depois decide clicar no WhatsApp.

