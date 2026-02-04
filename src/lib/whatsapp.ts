/**
 * WhatsApp Configuration
 * 
 * Centralized configuration for all WhatsApp links across the site.
 * 
 * IMPORTANT: Always use this configuration for WhatsApp links to ensure consistency.
 * Never hardcode WhatsApp numbers or messages directly in components.
 */

// Official WhatsApp number for Contabilidade Zen
export const WHATSAPP_NUMBER = "5519974158342";

// Default message templates
export const WHATSAPP_MESSAGES = {
  default: "Olá! Gostaria de mais informações sobre os serviços de contabilidade.",
  abrirEmpresa: "Olá! Gostaria de abrir minha empresa com a Contabilidade Zen.",
  campinas: "Olá! Vim pela página de Contabilidade em Campinas e gostaria de saber mais sobre os serviços.",
  cidadesAtendidas: "Olá! Vim pela página de cidades atendidas e gostaria de saber mais sobre os serviços da Contabilidade Zen.",
  migracao: "Olá! Gostaria de migrar minha contabilidade para a Contabilidade Zen.",
  medicos: "Olá! Sou médico e gostaria de saber mais sobre contabilidade especializada.",
  medicosConsulta: "Olá! Sou médico e gostaria de agendar uma consulta gratuita.",
  dentistas: "Olá! Sou dentista e gostaria de saber mais sobre contabilidade especializada.",
  psicologos: "Olá! Sou psicólogo(a) e gostaria de saber mais sobre contabilidade especializada.",
  representantes: "Olá! Sou representante comercial e gostaria de saber mais sobre contabilidade especializada.",
  calculadora: "Olá! Fiz a simulação no site e gostaria de saber mais sobre como economizar impostos.",
  parceiro: "Olá! Quero me tornar um parceiro embaixador do programa Indique e Ganhe da Contabilidade Zen!",
  duvida: "Olá! Tenho uma dúvida sobre contabilidade para profissionais da saúde.",
  hero: "Olá! Gostaria de saber mais sobre contabilidade para profissionais da saúde.",
  sobre: "Olá! Gostaria de conhecer melhor a Contabilidade Zen.",
  cidadesRegiao: "Olá! Vi que vocês atendem minha região. Gostaria de saber mais sobre os serviços de contabilidade.",
  invoice: "Olá! Vim do gerador de invoice e gostaria de saber mais sobre contabilidade para operações internacionais.",
  tabelaCnaes: "Olá! Vim da página de Tabela do Simples Nacional e gostaria de uma consultoria sobre o enquadramento tributário da minha empresa.",
} as const;

export type WhatsAppMessageKey = keyof typeof WHATSAPP_MESSAGES;

/**
 * Generates a properly formatted WhatsApp link
 * 
 * @param message - The message to be pre-filled (will be URL-encoded)
 * @returns The complete WhatsApp URL
 * 
 * @example
 * // Using default message
 * getWhatsAppLink(WHATSAPP_MESSAGES.default)
 * 
 * @example
 * // Using custom message
 * getWhatsAppLink("Olá! Vim pelo blog e gostaria de saber mais.")
 */
export function getWhatsAppLink(message: string = WHATSAPP_MESSAGES.default): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp link using a predefined message key
 * 
 * @param key - The key from WHATSAPP_MESSAGES
 * @returns The complete WhatsApp URL
 */
export function getWhatsAppLinkByKey(key: WhatsAppMessageKey): string {
  return getWhatsAppLink(WHATSAPP_MESSAGES[key]);
}

/**
 * Opens WhatsApp in a new tab with the specified message
 * 
 * @param message - The message to be pre-filled
 */
export function openWhatsApp(message: string = WHATSAPP_MESSAGES.default): void {
  window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
}

/**
 * Generates a WhatsApp link for contacting a specific phone number (for CRM/leads)
 * 
 * @param phone - The phone number (will be cleaned of non-numeric characters)
 * @param message - Optional message to pre-fill
 * @returns The complete WhatsApp URL
 */
export function getWhatsAppLinkForPhone(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  // Add 55 prefix if not present and phone has 10-11 digits (Brazilian format)
  const formattedPhone = cleanPhone.length >= 10 && cleanPhone.length <= 11 
    ? `55${cleanPhone}` 
    : cleanPhone;
  
  if (message) {
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${formattedPhone}`;
}
