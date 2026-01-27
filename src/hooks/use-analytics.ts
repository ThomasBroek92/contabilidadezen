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

  // Usar requestIdleCallback para não bloquear a thread principal
  scheduleIdleTask(() => {
    // Load the GA4 script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true, // LGPD compliance
      cookie_flags: "SameSite=None;Secure",
    });

    isInitialized = true;
  });
}

export function trackPageView(path: string) {
  if (!isInitialized || typeof window === "undefined") return;
  
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!isInitialized || typeof window === "undefined") return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

export function useAnalytics() {
  return {
    initializeGA,
    trackPageView,
    trackEvent,
  };
}
