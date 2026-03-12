

# Correção do Formulário de Contato

## Problema Identificado

Dois problemas causam o erro:

1. **`window.open` dentro do `try` principal**: O `openWhatsAppNotification` chama `window.open` que pode falhar/ser bloqueado no iframe. Como está no mesmo `try` do insert, o catch mostra "Erro ao enviar" mesmo que o lead tenha sido salvo com sucesso.

2. **Campos CRM ausentes**: O insert não inclui `consentimento_lgpd`, `data_consentimento`, nem salva a mensagem do usuário em `observacoes`.

## Correção

**`src/pages/Contato.tsx`** - Dentro do `handleSubmit`:

1. Adicionar ao insert: `consentimento_lgpd: true`, `data_consentimento: new Date().toISOString()`, `observacoes: formData.message?.trim() || null`
2. Envolver `trackFormSubmit` e `openWhatsAppNotification` em `try/catch` individuais (fire-and-forget), para que falhas de analytics ou WhatsApp nunca bloqueiem o fluxo principal
3. Mover o toast de sucesso e o reset do formulário para depois dos blocos fire-and-forget

Resultado: o lead sempre é salvo no CRM com dados completos, e erros secundarios (analytics, WhatsApp popup) não afetam a experiencia do usuario.

