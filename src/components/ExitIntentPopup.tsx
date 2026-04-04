import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Phone, CheckCircle2, Star, Shield } from "lucide-react";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { useHoneypot } from "@/hooks/use-honeypot";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { trackFormSubmit } from "@/hooks/use-analytics";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { saveLead, isSaving } = useLeadCapture();
  const { isBot, honeypotProps } = useHoneypot();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    nome: "",
    celular: "",
    email: "",
  });

  const showPopup = useCallback(() => {
    if (hasShown || sessionStorage.getItem("exitIntentShown")) return;
    setIsOpen(true);
    setHasShown(true);
    sessionStorage.setItem("exitIntentShown", "true");
  }, [hasShown]);

  useEffect(() => {
    const handleForceShow = () => setIsOpen(true);
    window.addEventListener("force-exit-intent-popup", handleForceShow);

    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return () => window.removeEventListener("force-exit-intent-popup", handleForceShow);
    }

    let desktopCleanup: (() => void) | undefined;
    let mobileTimeout: ReturnType<typeof setTimeout> | undefined;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;

    const activationDelay = setTimeout(() => {
      if (isMobile) {
        // Mobile: trigger after 30s of scroll inactivity
        let lastScroll = Date.now();
        const onScroll = () => { lastScroll = Date.now(); };
        window.addEventListener("scroll", onScroll, { passive: true });

        const checkIdle = () => {
          if (Date.now() - lastScroll > 30000) {
            showPopup();
          } else {
            scrollTimer = setTimeout(checkIdle, 5000);
          }
        };
        scrollTimer = setTimeout(checkIdle, 30000);

        desktopCleanup = () => {
          window.removeEventListener("scroll", onScroll);
          if (scrollTimer) clearTimeout(scrollTimer);
        };
      } else {
        // Desktop: trigger on mouse leaving top of viewport
        const handleMouseLeave = (e: MouseEvent) => {
          if (e.clientY <= 0) showPopup();
        };
        document.addEventListener("mouseleave", handleMouseLeave);
        desktopCleanup = () => document.removeEventListener("mouseleave", handleMouseLeave);
      }
    }, 5000);

    return () => {
      clearTimeout(activationDelay);
      if (mobileTimeout) clearTimeout(mobileTimeout);
      desktopCleanup?.();
      window.removeEventListener("force-exit-intent-popup", handleForceShow);
    };
  }, [hasShown, isMobile, showPopup]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (preferencia: "whatsapp" | "ligacao") => {
    if (isBot()) return;

    if (!formData.nome || !formData.celular || !formData.email) {
      toast.error("Preencha nome, celular e e-mail");
      return;
    }

    const fonte = `Exit Intent - ${preferencia === "whatsapp" ? "WhatsApp" : "Ligação"}`;

    const success = await saveLead({
      nome: formData.nome,
      email: formData.email,
      whatsapp: formData.celular,
      segmento: "Geral",
      fonte,
    });

    if (success) {
      try {
        trackFormSubmit("exit-intent-popup", { fonte });
      } catch { /* fire-and-forget */ }
      setSubmitted(true);
    } else {
      toast.error("Erro ao enviar. Tente novamente.");
    }
  };

  const whatsappUrl = getWhatsAppLink(
    `Olá! Sou ${formData.nome || "interessado"} e gostaria de mais informações sobre contabilidade.`
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Fale com um especialista</DialogTitle>

        {submitted ? (
          /* ── Success State ── */
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-[hsl(142_70%_30%)]/10 flex items-center justify-center animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="h-8 w-8 text-[hsl(142_70%_30%)]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Recebemos seu contato!</h2>
              <p className="text-muted-foreground">Entraremos em contato em até <strong>2 horas</strong> em horário comercial.</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-14 rounded-lg bg-[hsl(142_70%_30%)] text-primary-foreground font-semibold text-base hover:bg-[hsl(142_70%_25%)] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Falar agora no WhatsApp
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          /* ── Form State ── */
          <div className="grid md:grid-cols-5">
            {/* Left panel - desktop only */}
            <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex-col justify-center items-center text-center gap-6">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-primary">Espere!</h2>
                <p className="text-2xl font-bold text-foreground leading-tight">
                  Fale com um especialista agora
                </p>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                500+ empresas atendidas
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/60 rounded-full px-4 py-2">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Resposta em até 2h
              </div>
            </div>

            {/* Right panel - form */}
            <div className="md:col-span-3 p-6 md:p-8 space-y-5">
              {/* Mobile headline */}
              <div className="md:hidden space-y-1 text-center">
                <h2 className="text-xl font-bold text-foreground">
                  Espere! Fale com um especialista
                </h2>
                <p className="text-sm text-muted-foreground">
                  500+ empresas já reduziram impostos conosco
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exit-nome">Nome</Label>
                  <Input
                    id="exit-nome"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exit-celular">WhatsApp</Label>
                  <Input
                    id="exit-celular"
                    placeholder="(DDD) 00000-0000"
                    value={formData.celular}
                    onChange={(e) => setFormData({ ...formData, celular: formatPhone(e.target.value) })}
                    maxLength={16}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exit-email">E-mail</Label>
                  <Input
                    id="exit-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>

                {/* Honeypot */}
                <input {...honeypotProps} />
              </div>

              <div className="space-y-3 pt-1">
                <Button
                  variant="whatsapp"
                  size="xl"
                  className="w-full"
                  onClick={() => handleSubmit("whatsapp")}
                  disabled={isSaving}
                >
                  <MessageCircle className="h-5 w-5" />
                  QUERO FALAR NO WHATSAPP
                </Button>

                <button
                  onClick={() => handleSubmit("ligacao")}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  <Phone className="h-4 w-4" />
                  Prefiro receber uma ligação
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground/70 text-center">
                Seus dados estão seguros. Não enviamos spam.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
