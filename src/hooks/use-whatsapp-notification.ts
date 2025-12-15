// WhatsApp notification hook for lead capture
// Configure your team's WhatsApp number here
const TEAM_WHATSAPP_NUMBER = "5511999999999"; // Replace with your actual number

interface LeadData {
  nome: string;
  email: string;
  whatsapp: string;
  segmento: string;
  fonte: string;
  faturamento?: number;
  economia?: number;
}

export function useWhatsAppNotification() {
  const generateWhatsAppLink = (lead: LeadData) => {
    const message = `🔔 *Novo Lead Capturado!*

📋 *Dados do Lead:*
• Nome: ${lead.nome}
• E-mail: ${lead.email}
• WhatsApp: ${lead.whatsapp}
• Segmento: ${lead.segmento}
• Origem: ${lead.fonte}
${lead.faturamento ? `• Faturamento: R$ ${lead.faturamento.toLocaleString('pt-BR')}/mês` : ''}
${lead.economia ? `• Economia potencial: R$ ${lead.economia.toLocaleString('pt-BR')}/ano` : ''}

⏰ Capturado em: ${new Date().toLocaleString('pt-BR')}`;

    return `https://wa.me/${TEAM_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const openWhatsAppNotification = (lead: LeadData) => {
    const link = generateWhatsAppLink(lead);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return { generateWhatsAppLink, openWhatsAppNotification };
}
