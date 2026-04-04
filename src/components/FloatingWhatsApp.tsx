import { X } from "lucide-react";

const WhatsAppIcon = ({ className = "h-8 w-8", fill = "currentColor" }: { className?: string; fill?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={fill}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

import { m, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { trackWhatsAppClick } from "@/hooks/use-analytics";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES, getWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppQualifier } from "@/components/WhatsAppQualifier";

export function FloatingWhatsApp() {
  const [isEmphasized, setIsEmphasized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [qualifierOpen, setQualifierOpen] = useState(false);
  const controls = useAnimation();
  const whatsappUrl = getWhatsAppLink(WHATSAPP_MESSAGES.default);
  
  // Check if user already completed qualifier
  const isAlreadyQualified = () => {
    try { return sessionStorage.getItem("waq_done") === "1"; } catch { return false; }
  };

  // Track WhatsApp click
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!isAlreadyQualified()) {
      e.preventDefault();
      setShowTooltip(false);
      setTooltipDismissed(true);
      setQualifierOpen(true);
      return;
    }
    trackWhatsAppClick('floating_button', WHATSAPP_MESSAGES.default);
  };

  // Show tooltip after a short delay on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!tooltipDismissed) {
        setShowTooltip(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [tooltipDismissed]);

  // Listen for scroll-triggered emphasis event
  useEffect(() => {
    const handleEmphasis = (event: CustomEvent<{ message?: string }>) => {
      setIsEmphasized(true);
      setShowTooltip(true);
      setTooltipDismissed(false);
      
      // Trigger attention animation
      controls.start({
        scale: [1, 1.2, 1, 1.15, 1],
        rotate: [0, -10, 10, -5, 0],
        transition: { duration: 0.6, ease: "easeInOut" }
      });

      // Hide emphasis after 4 seconds
      setTimeout(() => {
        setIsEmphasized(false);
      }, 4000);
    };

    window.addEventListener('whatsapp-emphasis' as any, handleEmphasis);
    return () => window.removeEventListener('whatsapp-emphasis' as any, handleEmphasis);
  }, [controls]);

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[60]">
      {/* CTA Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && !tooltipDismissed && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-[72px] right-0 w-[280px] sm:w-[300px]"
          >
            <div className="rounded-2xl shadow-2xl overflow-hidden relative">
              {/* Close button */}
              <button
                onClick={handleDismissTooltip}
                className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>

              {/* WhatsApp-style header */}
              <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="h-5 w-5" fill="white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">
                    Contabilidade Zen
                  </p>
                  <p className="text-[11px] text-white/80">
                    Online agora
                  </p>
                </div>
              </div>

              {/* Chat body */}
              <div className="bg-[#ECE5DD] px-4 py-3">
                <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm max-w-[85%] relative">
                  <p className="text-sm text-[#303030] leading-snug">
                    Olá! 👋 Como posso te ajudar hoje?
                  </p>
                  <p className="text-[10px] text-[#999] text-right mt-1">
                    agora
                  </p>
                </div>
              </div>

              {/* CTA button area */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  handleWhatsAppClick(e);
                }}
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 px-4 transition-colors text-sm font-semibold"
              >
                <WhatsAppIcon className="h-4 w-4" fill="currentColor" />
                Iniciar conversa
              </a>
            </div>

            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#25D366] transform rotate-45" />
          </m.div>
        )}
      </AnimatePresence>

      {/* Main Button - always visible */}
      <m.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          handleWhatsAppClick(e);
        }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        aria-label="Fale conosco pelo WhatsApp"
        data-gtm-category="Conversão"
        data-gtm-action="contato_whatsapp"
        data-gtm-label="floating_button"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        
        {/* Emphasis glow ring */}
        {isEmphasized && (
          <m.span
            className="absolute -inset-3 rounded-full border-2 border-[#25D366]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        {/* Icon */}
        <WhatsAppIcon className="h-7 w-7 relative z-10" fill="currentColor" />
      </m.a>
    </div>
  );
}

// Helper function to trigger emphasis from other components
export function triggerWhatsAppEmphasis(message?: string) {
  window.dispatchEvent(new CustomEvent('whatsapp-emphasis', { detail: { message } }));
}
