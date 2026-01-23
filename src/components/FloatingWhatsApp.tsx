import { MessageCircle, Sparkles } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "5519974158342";
const WHATSAPP_MESSAGE = "Olá! Gostaria de mais informações sobre os serviços de contabilidade.";

export function FloatingWhatsApp() {
  const [isEmphasized, setIsEmphasized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const controls = useAnimation();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  // Listen for scroll-triggered emphasis event
  useEffect(() => {
    const handleEmphasis = (event: CustomEvent<{ message?: string }>) => {
      setIsEmphasized(true);
      setShowTooltip(true);
      
      // Trigger attention animation
      controls.start({
        scale: [1, 1.2, 1, 1.15, 1],
        rotate: [0, -10, 10, -5, 0],
        transition: { duration: 0.6, ease: "easeInOut" }
      });

      // Hide emphasis after 4 seconds
      setTimeout(() => {
        setIsEmphasized(false);
        setShowTooltip(false);
      }, 4000);
    };

    window.addEventListener('whatsapp-emphasis' as any, handleEmphasis);
    return () => window.removeEventListener('whatsapp-emphasis' as any, handleEmphasis);
  }, [controls]);

  return (
    <>
      {/* Emphasis Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 max-w-[200px]"
          >
            <div className="bg-card border border-secondary/50 rounded-xl p-3 shadow-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Quer economizar?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fale com um especialista agora!
                  </p>
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-secondary/50 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-shadow ${
          isEmphasized ? 'shadow-[0_0_30px_rgba(37,211,102,0.6)]' : ''
        }`}
        aria-label="Fale conosco pelo WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={controls}
        transition={{ delay: 1, duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse ring animation */}
        <span className={`absolute inset-0 rounded-full bg-[#25D366] animate-ping ${isEmphasized ? 'opacity-50' : 'opacity-30'}`} />
        <span className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-pulse" />
        
        {/* Emphasis glow ring */}
        {isEmphasized && (
          <motion.span
            className="absolute -inset-2 rounded-full border-2 border-[#25D366]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        {/* Icon */}
        <MessageCircle className="h-7 w-7 relative z-10" />
        
        {/* Badge de urgência */}
        <motion.span 
          className={`absolute -top-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md ${
            isEmphasized 
              ? 'bg-secondary text-secondary-foreground' 
              : 'bg-destructive text-destructive-foreground'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 500 }}
        >
          {isEmphasized ? '💬' : 'Online'}
        </motion.span>
      </motion.a>
    </>
  );
}

// Helper function to trigger emphasis from other components
export function triggerWhatsAppEmphasis(message?: string) {
  window.dispatchEvent(new CustomEvent('whatsapp-emphasis', { detail: { message } }));
}
