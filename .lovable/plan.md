# Base de Conhecimento: Sistema Centralizado de WhatsApp

## REGRA OBRIGATÓRIA

**NUNCA** hardcode links de WhatsApp diretamente em componentes. 

### Uso Correto

Sempre importar e usar as funções centralizadas:

```typescript
import { getWhatsAppLink, WHATSAPP_MESSAGES, getWhatsAppLinkByKey } from "@/lib/whatsapp";

// Usando mensagem pré-definida
const whatsappLink = getWhatsAppLink(WHATSAPP_MESSAGES.campinas);

// Usando chave direta
const link = getWhatsAppLinkByKey("abrirEmpresa");

// Para contatos do CRM (números de leads)
import { getWhatsAppLinkForPhone } from "@/lib/whatsapp";
const leadLink = getWhatsAppLinkForPhone(lead.whatsapp);
```

### Mensagens Disponíveis

- `default` - Mensagem genérica
- `abrirEmpresa` - Para página de abertura de empresa
- `campinas` - Para landing page de Campinas
- `migracao` - Para migração de contabilidade
- `medicos`, `dentistas`, `psicologos`, `representantes` - Para páginas de segmento
- `calculadora` - Após usar calculadora
- `parceiro` - Para parceiros embaixadores
- `duvida` - Dúvidas gerais

### Número Oficial

O número oficial é `5519974158342` e está centralizado em `src/lib/whatsapp.ts`.

### Por que isso importa

1. **Evita encoding quebrado** - `encodeURIComponent` é aplicado automaticamente
2. **Manutenção fácil** - Mudar número/mensagem em um lugar só
3. **Consistência** - Mesma estrutura em todo o site
4. **Rastreabilidade** - Mensagens padronizadas facilitam análise
