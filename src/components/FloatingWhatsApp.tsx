import { MessageCircle, X } from "lucide-react";
import { m, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { trackWhatsAppClick } from "@/hooks/use-analytics";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES, getWhatsAppLink } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const [isEmphasized, setIsEmphasized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const controls = useAnimation();
  const whatsappUrl = getWhatsAppLink(WHATSAPP_MESSAGES.default);
  
  // Track WhatsApp click
  const handleWhatsAppClick = () => {
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
    <>
      {/* CTA Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && !tooltipDismissed && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[280px] sm:w-[300px]"
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
                  <MessageCircle className="h-5 w-5 text-white" fill="white" />
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
                {/* Message bubble */}
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
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 px-4 transition-colors text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Iniciar conversa
              </a>
            </div>

            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#25D366] transform rotate-45" />
          </m.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <m.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        aria-label="Fale conosco pelo WhatsApp"
        data-gtm-category="Conversão"
        data-gtm-action="contato_whatsapp"
        data-gtm-label="floating_button"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, ...controls }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        
        {/* Inner glow */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-40" />
        
        {/* Emphasis glow ring */}
        {isEmphasized && (
          <m.span
            className="absolute -inset-3 rounded-full border-2 border-[#25D366]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        {/* Subtle glowing border */}
        <span 
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: isEmphasized 
              ? '0 0 30px rgba(37, 211, 102, 0.7), 0 0 60px rgba(37, 211, 102, 0.4)' 
              : '0 0 20px rgba(37, 211, 102, 0.4)'
          }}
        />
        
        {/* Icon */}
        <MessageCircle className="h-8 w-8 relative z-10" fill="currentColor" />
        
        {/* Online badge */}
        <m.span 
          className="absolute -top-1 -right-1 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg bg-card text-foreground border border-border"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 500 }}
        >
          <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
          Online
        </m.span>
      </m.a>
    </>
  );
}

// Helper function to trigger emphasis from other components
export function triggerWhatsAppEmphasis(message?: string) {
  window.dispatchEvent(new CustomEvent('whatsapp-emphasis', { detail: { message } }));
}
