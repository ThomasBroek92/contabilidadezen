/**
 * WhatsApp Configuration
 * 
 * Centralized configuration for all WhatsApp links across the site.
 * 
 * IMPORTANT: Always use this configuration for WhatsApp links to ensure consistency.
 * Never hardcode WhatsApp numbers or messages directly in components.
 * 
 * RULES:
 * 1. NEVER hardcode wa.me or api.whatsapp.com URLs outside this file
 * 2. NEVER use encodeURIComponent manually - the lib handles encoding
 * 3. ALWAYS open WhatsApp in a new tab to avoid iframe blocking (ERR_BLOCKED_BY_RESPONSE)
 * 4. Use getWhatsAppAnchorProps* for <a> elements (recommended)
 * 5. Use openWhatsApp* for click handlers
 */

// Official WhatsApp number for Contabilidade Zen
export const WHATSAPP_NUMBER = "5519974158342";

// Default message templates
export const WHATSAPP_MESSAGES = {
  default: "Olá! Gostaria de mais informações sobre os serviços de contabilidade.",
  abrirEmpresa: "Olá! Gostaria de abrir minha empresa com a Contabilidade Zen.",
  abrirEmpresaDuvida: "Olá! Tenho uma dúvida sobre abertura de empresa.",
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
  parceiroIndicacao: "Olá! Sou parceiro embaixador e tenho uma nova indicação!",
  duvida: "Olá! Tenho uma dúvida sobre contabilidade para profissionais da saúde.",
  hero: "Olá! Gostaria de saber mais sobre contabilidade para profissionais da saúde.",
  heroMultiNiche: "Olá! Gostaria de falar com um especialista sobre contabilidade.",
  sobre: "Olá! Gostaria de conhecer melhor a Contabilidade Zen.",
  cidadesRegiao: "Olá! Vi que vocês atendem minha região. Gostaria de saber mais sobre os serviços de contabilidade.",
  invoice: "Olá! Vim do gerador de invoice e gostaria de saber mais sobre contabilidade para operações internacionais.",
  tabelaCnaes: "Olá! Vim da página de Tabela do Simples Nacional e gostaria de uma consultoria sobre o enquadramento tributário da minha empresa.",
  contato: "Olá! Gostaria de agendar uma consulta gratuita sobre contabilidade.",
  servicos: "Olá! Gostaria de saber mais sobre os serviços de contabilidade.",
  saude: "Olá! Gostaria de agendar uma consulta gratuita sobre contabilidade para profissionais da saúde.",
  jornada: "Olá! Vim pelo site e gostaria de entender melhor como funciona a jornada de clientes na Contabilidade Zen. Podem me ajudar?",
  comparativo: "Olá! Fiz a simulação no comparativo tributário e gostaria de uma análise personalizada.",
  calculadoraCLTPJ: "Olá! Quero saber mais sobre como abrir uma empresa PJ.",
  resultadoCalculadora: "Olá! Fiz a simulação CLT x PJ no site e gostaria de uma análise personalizada com um contador especialista.",
  notFound: "Olá! Encontrei um erro ao acessar uma página no site.",
  produtoresDigitais: "Olá! Sou produtor digital e gostaria de saber mais sobre contabilidade especializada para infoprodutores.",
  profissionaisTI: "Olá! Sou profissional de TI e gostaria de saber mais sobre contabilidade especializada.",
  exportacaoServicos: "Olá! Trabalho com exportação de serviços e gostaria de saber mais sobre contabilidade especializada.",
  prestadoresServico: "Olá! Sou prestador de serviços e gostaria de saber mais sobre contabilidade especializada.",
  profissionaisPJ: "Olá! Sou profissional PJ e gostaria de saber mais sobre contabilidade especializada e planejamento tributário.",
  ecommerce: "Olá! Tenho um e-commerce e gostaria de saber mais sobre contabilidade especializada para lojas online e marketplaces.",
  clinicasConsultorios: "Olá! Tenho uma clínica/consultório e gostaria de saber mais sobre contabilidade especializada e equiparação hospitalar.",
} as const;

export type WhatsAppMessageKey = keyof typeof WHATSAPP_MESSAGES;

/**
 * Standard anchor props that ensure WhatsApp links open correctly
 * Prevents ERR_BLOCKED_BY_RESPONSE errors in iframes
 */
interface WhatsAppAnchorProps {
  href: string;
  target: "_blank";
  rel: "noopener noreferrer";
}

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
 * Returns anchor props for WhatsApp links with proper target and rel attributes
 * This ensures links open in a new tab and prevents iframe blocking
 * 
 * @param message - The message to be pre-filled
 * @returns Object with href, target="_blank", and rel="noopener noreferrer"
 * 
 * @example
 * <a {...getWhatsAppAnchorProps("Olá! Vim do site.")}>WhatsApp</a>
 */
export function getWhatsAppAnchorProps(message: string = WHATSAPP_MESSAGES.default): WhatsAppAnchorProps {
  return {
    href: getWhatsAppLink(message),
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

/**
 * Returns anchor props for WhatsApp links using a predefined message key
 * 
 * @param key - The key from WHATSAPP_MESSAGES
 * @returns Object with href, target="_blank", and rel="noopener noreferrer"
 * 
 * @example
 * <a {...getWhatsAppAnchorPropsByKey("abrirEmpresa")}>WhatsApp</a>
 */
export function getWhatsAppAnchorPropsByKey(key: WhatsAppMessageKey): WhatsAppAnchorProps {
  return getWhatsAppAnchorProps(WHATSAPP_MESSAGES[key]);
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
 * Opens WhatsApp in a new tab using a predefined message key
 * 
 * @param key - The key from WHATSAPP_MESSAGES
 */
export function openWhatsAppByKey(key: WhatsAppMessageKey): void {
  openWhatsApp(WHATSAPP_MESSAGES[key]);
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

/**
 * Returns anchor props for WhatsApp links to a specific phone number
 * 
 * @param phone - The phone number (will be cleaned of non-numeric characters)
 * @param message - Optional message to pre-fill
 * @returns Object with href, target="_blank", and rel="noopener noreferrer"
 */
export function getWhatsAppAnchorPropsForPhone(phone: string, message?: string): WhatsAppAnchorProps {
  return {
    href: getWhatsAppLinkForPhone(phone, message),
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

/**
 * Opens WhatsApp in a new tab for a specific phone number (for CRM/leads)
 * 
 * @param phone - The phone number (will be cleaned of non-numeric characters)
 * @param message - Optional message to pre-fill
 */
export function openWhatsAppForPhone(phone: string, message?: string): void {
  window.open(getWhatsAppLinkForPhone(phone, message), "_blank", "noopener,noreferrer");
}
