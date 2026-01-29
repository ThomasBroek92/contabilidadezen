const GA_MEASUREMENT_ID = "G-047LY0LSX2";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

let isInitialized = false;

// Função helper para requestIdleCallback com fallback
const scheduleIdleTask = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    // Fallback para navegadores sem suporte
    setTimeout(callback, 1);
  }
};

export function initializeGA() {
  if (isInitialized || typeof window === "undefined") return;

  // Inicializa apenas o dataLayer - GTM já carrega o GA4
  scheduleIdleTask(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    isInitialized = true;
    console.log("[Analytics] DataLayer initialized for GTM");
  });
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  
  // Garante que dataLayer existe
  window.dataLayer = window.dataLayer || [];
  
  // Push evento de page_view para o GTM (SPA History Change)
  window.dataLayer.push({
    event: 'page_view',
    page_path: path,
    page_location: window.location.href,
    page_title: document.title
  });
  
  // Também dispara via gtag se disponível (fallback)
  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === "undefined") return;

  // Push para dataLayer (GTM)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: action,
    event_category: category,
    event_label: label,
    event_value: value
  });

  // Também via gtag se disponível
  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Evento específico para conversão do WhatsApp
export function trackWhatsAppClick(source: string, message?: string) {
  if (typeof window === "undefined") return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'contato_whatsapp',
    whatsapp_source: source,
    whatsapp_message: message || 'Contato geral'
  });
  
  // Também via gtag
  if (window.gtag) {
    window.gtag("event", "contato_whatsapp", {
      event_category: "Conversão",
      event_label: source,
    });
  }
}

// Evento específico para envio de formulário de lead
export function trackFormSubmit(formName: string, formData?: {
  segmento?: string;
  fonte?: string;
  economia?: number;
}) {
  if (typeof window === "undefined") return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'envio_formulario',
    form_name: formName,
    form_segmento: formData?.segmento || 'Geral',
    form_fonte: formData?.fonte || formName,
    form_economia: formData?.economia || 0
  });
  
  // Também via gtag como evento de conversão
  if (window.gtag) {
    window.gtag("event", "generate_lead", {
      event_category: "Conversão",
      event_label: formName,
      value: formData?.economia || 0,
    });
  }
  
  console.log(`[Analytics] Form submitted: ${formName}`, formData);
}

// Evento para calculadora PJ/CLT
export function trackCalculatorUse(calculatorType: string, result?: {
  savings?: number;
  monthlyIncome?: number;
}) {
  if (typeof window === "undefined") return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'uso_calculadora',
    calculator_type: calculatorType,
    calculator_savings: result?.savings || 0,
    calculator_income: result?.monthlyIncome || 0
  });
  
  if (window.gtag) {
    window.gtag("event", "uso_calculadora", {
      event_category: "Engajamento",
      event_label: calculatorType,
      value: result?.savings || 0,
    });
  }
  
  console.log(`[Analytics] Calculator used: ${calculatorType}`, result);
}

export function useAnalytics() {
  return {
    initializeGA,
    trackPageView,
    trackEvent,
    trackWhatsAppClick,
    trackFormSubmit,
    trackCalculatorUse,
  };
}
