

## Plano: Corrigir Erro ERR_BLOCKED_BY_RESPONSE nos Botoes WhatsApp

### Problema

O erro `ERR_BLOCKED_BY_RESPONSE` ocorre porque `window.open()` para URLs do WhatsApp e bloqueado dentro do iframe do Lovable. Isso afeta o `openWhatsAppNotification` chamado apos o envio do formulario de lead, que usa `window.open` internamente.

Os links `<a target="_blank">` com `getWhatsAppAnchorProps` (como no RepresentantesCTA) ja funcionam corretamente — o problema esta no `window.open` programatico.

### Causa Raiz

No `RepresentantesLeadForm.tsx` (linha 87), apos salvar o lead no banco, `openWhatsAppNotification()` chama `window.open()` que e bloqueado pelo iframe. O lead E salvo corretamente no banco, mas a navegacao para WhatsApp falha.

### Solucao

**1. Substituir `window.open` por redirecionamento via link clicavel no toast de sucesso**

No `RepresentantesLeadForm.tsx`:
- Remover a chamada `openWhatsAppNotification()` apos salvar o lead
- Apos salvar com sucesso, mostrar um toast com link clicavel para o WhatsApp (usando `<a target="_blank">`)
- O lead continua sendo salvo normalmente no banco de dados

**2. Criar padrao reutilizavel para todas as landing pages**

Atualizar `use-whatsapp-notification.ts`:
- Adicionar funcao `getNotificationLink()` que retorna apenas a URL (sem abrir)
- Manter `generateWhatsAppLink` existente para compatibilidade

**3. Arquivos alterados:**

- `src/components/segmentos/representantes/RepresentantesLeadForm.tsx` — substituir `openWhatsAppNotification()` por toast com link clicavel
- `src/hooks/use-whatsapp-notification.ts` — (opcional) manter como esta, o componente deixa de chamar `window.open`

### Padrao para Replicacao

Todas as landing pages de segmento (medicos, dentistas, psicologos, representantes) devem usar o mesmo padrao:
1. Salvar lead via `supabase.from('leads').insert()` (fire-and-forget, sem `.select()`)
2. Mostrar toast de sucesso com link `<a>` para WhatsApp usando `getWhatsAppLink()`
3. Nunca usar `window.open()` para WhatsApp

