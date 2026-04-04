import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, User, Mail, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { useHoneypot } from "@/hooks/use-honeypot";
import type { MaterialItem } from "./MaterialCard";

interface MaterialGateFormProps {
  material: MaterialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialGateForm({ material, open, onOpenChange }: MaterialGateFormProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [success, setSuccess] = useState(false);
  const { saveLead, isSaving } = useLeadCapture();
  const { isBot, honeypotProps, reset: resetHoneypot } = useHoneypot();

  const resetForm = () => {
    setNome("");
    setEmail("");
    setWhatsapp("");
    setSuccess(false);
    resetHoneypot();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBot() || !material) return;

    const saved = await saveLead({
      nome,
      email,
      whatsapp,
      segmento: "Geral",
      fonte: `material_${material.slug}`,
    });

    if (saved) {
      setSuccess(true);
      try { sessionStorage.setItem(`mat_${material.slug}`, "1"); } catch {}
    }
  };

  const handleDownload = () => {
    if (material?.downloadUrl) {
      window.open(material.downloadUrl, "_blank", "noopener,noreferrer");
    }
    onOpenChange(false);
    resetForm();
  };

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Material liberado!</h3>
            <p className="text-muted-foreground text-sm">
              Clique abaixo para baixar "{material.title}"
            </p>
            <Button onClick={handleDownload} variant="hero" className="w-full">
              <Download className="h-5 w-5 mr-2" />
              Baixar agora
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">Baixar: {material.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Preencha seus dados para liberar o download gratuito.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <input {...honeypotProps} />
              <div className="space-y-2">
                <Label htmlFor="gate-nome" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" /> Nome
                </Label>
                <Input id="gate-nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" required minLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gate-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-secondary" /> E-mail
                </Label>
                <Input id="gate-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gate-whatsapp" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-secondary" /> WhatsApp
                </Label>
                <Input id="gate-whatsapp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" required minLength={10} />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Ao baixar, você concorda com nossa <a href="/politica-de-privacidade" className="underline" target="_blank">Política de Privacidade</a>.
              </p>
              <Button type="submit" variant="hero" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processando...</>
                ) : (
                  <><Download className="h-5 w-5 mr-2" /> Liberar Download</>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
