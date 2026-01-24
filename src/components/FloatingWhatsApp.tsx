import { MessageCircle, X } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "5519974158342";
const WHATSAPP_MESSAGE = "Olá! Gostaria de mais informações sobre os serviços de contabilidade.";

export function FloatingWhatsApp() {
  const [isEmphasized, setIsEmphasized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const controls = useAnimation();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

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
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 max-w-[220px]"
          >
            <div className="bg-card border border-border shadow-xl rounded-2xl p-4 relative">
              {/* Close button */}
              <button
                onClick={handleDismissTooltip}
                className="absolute -top-2 -left-2 bg-muted hover:bg-muted/80 rounded-full p-1 shadow-md transition-colors"
                aria-label="Fechar"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className="bg-[#25D366]/10 rounded-full p-2 shrink-0">
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    Fale com um especialista!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tire suas dúvidas agora mesmo pelo WhatsApp
                  </p>
                </div>
              </div>
              
              {/* Arrow pointing to button */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card border-r border-b border-border transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        aria-label="Fale conosco pelo WhatsApp"
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
          <motion.span
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
        <motion.span 
          className="absolute -top-1 -right-1 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg bg-card text-foreground border border-border"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 500 }}
        >
          <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
          Online
        </motion.span>
      </motion.a>
    </>
  );
}

// Helper function to trigger emphasis from other components
export function triggerWhatsAppEmphasis(message?: string) {
  window.dispatchEvent(new CustomEvent('whatsapp-emphasis', { detail: { message } }));
}
