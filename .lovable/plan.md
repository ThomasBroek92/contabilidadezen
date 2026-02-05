# Plano do Projeto - Contabilidade Zen

## ✅ CONCLUÍDO: Migração WhatsApp Centralizada

### Status: COMPLETO ✅

Todos os links de WhatsApp foram migrados para usar o sistema centralizado em `src/lib/whatsapp.ts`.

---

## 📋 Regras Obrigatórias para Links de WhatsApp

### Regra 1 — Proibição Total de Hardcode
- ❌ **PROIBIDO**: `href="https://wa.me/..."`, `window.open("https://wa.me/...")`, `api.whatsapp.com`
- ✅ **OBRIGATÓRIO**: usar **somente** `src/lib/whatsapp.ts`

### Regra 2 — Nunca Encode Manual Fora da Lib
- ❌ **PROIBIDO**: `encodeURIComponent` no template do link
- ✅ A lib já codifica a mensagem automaticamente

### Regra 3 — Sempre Abrir Fora do Iframe
- Todo link de WhatsApp DEVE abrir em nova aba para evitar ERR_BLOCKED_BY_RESPONSE
- ✅ Usar `getWhatsAppAnchorProps*` para elementos `<a>` (recomendado)
- ✅ Usar `openWhatsApp*` para handlers de clique

---

## 📝 Snippets Padrão (Copiar/Colar)

### Para CTAs com mensagem pré-definida (mais comum):
```tsx
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";

<a {...getWhatsAppAnchorPropsByKey("abrirEmpresa")}>
  Falar no WhatsApp
</a>
```

### Para mensagem customizada:
```tsx
import { getWhatsAppAnchorProps } from "@/lib/whatsapp";

<a {...getWhatsAppAnchorProps("Olá! Vim da página X...")}>
  WhatsApp
</a>
```

### Para CRM/Leads (número variável):
```tsx
import { openWhatsAppForPhone, getWhatsAppAnchorPropsForPhone } from "@/lib/whatsapp";

// Em handler de clique:
openWhatsAppForPhone(lead.whatsapp, "Olá! ...");

// Em elemento <a>:
<a {...getWhatsAppAnchorPropsForPhone(lead.whatsapp, "Mensagem opcional")}>
  Contatar Lead
</a>
```

---

## 🔑 Mensagens Disponíveis (WHATSAPP_MESSAGES)

| Key | Uso |
|-----|-----|
| `default` | Mensagem genérica padrão |
| `abrirEmpresa` | Página de abertura de empresa |
| `abrirEmpresaDuvida` | FAQ de abertura de empresa |
| `campinas` | Página de Campinas |
| `cidadesAtendidas` | Página de cidades atendidas |
| `migracao` | Migração de contabilidade |
| `medicos` | Página de médicos |
| `medicosConsulta` | Consulta para médicos |
| `dentistas` | Página de dentistas |
| `psicologos` | Página de psicólogos |
| `representantes` | Página de representantes |
| `calculadora` | Calculadora de economia |
| `parceiro` | Tornar-se parceiro |
| `parceiroIndicacao` | Parceiro fazendo indicação |
| `contato` | Página de contato |
| `servicos` | Página de serviços |
| `saude` | CTAs para profissionais da saúde |
| `jornada` | CustomerJourney |
| `comparativo` | Comparativo tributário |
| `calculadoraCLTPJ` | Calculadora CLT x PJ |
| `heroMultiNiche` | Hero principal |
| `notFound` | Página 404 |

---

## ⚠️ Arquivos Migrados (Referência)

Todos os seguintes arquivos foram migrados para usar o sistema centralizado:

- `src/pages/Contato.tsx`
- `src/pages/Servicos.tsx`
- `src/pages/NotFound.tsx`
- `src/pages/PartnerDashboard.tsx`
- `src/pages/conteudo/CalculadoraPJCLT.tsx`
- `src/pages/conteudo/ComparativoTributario.tsx`
- `src/components/abrir-empresa/AbrirEmpresaFAQ.tsx`
- `src/components/sections/HeroMultiNiche.tsx`
- `src/components/sections/CTA.tsx`
- `src/components/sections/CustomerJourney.tsx`
- `src/components/segmentos/representantes/RepresentantesCTA.tsx`
- `src/components/segmentos/shared/TaxComparisonCalculator.tsx`
- `src/components/crm/LeadDetail.tsx`
- `src/components/crm/LeadsTableEnhanced.tsx`

---

## 📌 Para Adicionar Nova Mensagem

1. Abrir `src/lib/whatsapp.ts`
2. Adicionar nova key em `WHATSAPP_MESSAGES`
3. Usar `getWhatsAppAnchorPropsByKey("novaKey")` no componente
