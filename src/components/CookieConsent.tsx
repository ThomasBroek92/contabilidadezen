import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === null) {
      // Small delay to avoid showing immediately on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "false");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-5 duration-300">
      <div className="container mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="h-5 w-5 text-secondary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Utilizamos cookies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nosso site utiliza cookies essenciais para funcionamento e autenticação. 
                Ao continuar navegando, você concorda com nossa{" "}
                <Link 
                  to="/politica-de-privacidade" 
                  className="text-secondary hover:underline"
                >
                  Política de Privacidade
                </Link>{" "}
                e nossos{" "}
                <Link 
                  to="/termos" 
                  className="text-secondary hover:underline"
                >
                  Termos de Uso
                </Link>.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              className="flex-1 md:flex-none"
            >
              Recusar
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccept}
              className="flex-1 md:flex-none"
            >
              Aceitar
            </Button>
          </div>
          
          <button
            onClick={handleDecline}
            className="absolute top-2 right-2 md:hidden p-1 rounded-md hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
