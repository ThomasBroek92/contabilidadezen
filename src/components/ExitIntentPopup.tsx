import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Phone, X } from "lucide-react";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { toast } from "sonner";
import supportImage from "@/assets/exit-intent-support.jpg";
import { trackFormSubmit } from "@/hooks/use-analytics";

const cidades = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Brasília",
  "Salvador",
  "Curitiba",
  "Fortaleza",
  "Recife",
  "Porto Alegre",
  "Manaus",
  "Goiânia",
  "Belém",
  "Campinas",
  "Guarulhos",
  "São Bernardo do Campo",
  "Outra",
];

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { saveLead, isSaving } = useLeadCapture();
  
  const [formData, setFormData] = useState({
    nome: "",
    celular: "",
    email: "",
    cidade: "",
    atividade: "",
    preferencia_contato: "",
  });

  useEffect(() => {
    // Listen for custom event to force show popup (for testing)
    const handleForceShow = () => {
      setIsOpen(true);
    };

    window.addEventListener('force-exit-intent-popup', handleForceShow);

    // Check if popup was already shown in this session
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return () => {
        window.removeEventListener('force-exit-intent-popup', handleForceShow);
      };
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top of the page
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Add delay before enabling exit intent
    const timeout = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener('force-exit-intent-popup', handleForceShow);
    };
  }, [hasShown]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (preferencia: "whatsapp" | "ligacao") => {
    if (!formData.nome || !formData.celular || !formData.email) {
      toast.error("Preencha nome, celular e e-mail");
      return;
    }

    const fonte = `Exit Intent - Preferência: ${preferencia === "whatsapp" ? "WhatsApp" : "Ligação"} - Cidade: ${formData.cidade}`;

    const success = await saveLead({
      nome: formData.nome,
      email: formData.email,
      whatsapp: formData.celular,
      segmento: formData.atividade || "Geral",
      fonte,
    });

    if (success) {
      // Track form submission
      trackFormSubmit("exit-intent-popup", {
        segmento: formData.atividade || "Geral",
        fonte,
      });

      toast.success("Obrigado! Entraremos em contato em breve.");
      setIsOpen(false);
    } else {
      toast.error("Erro ao enviar. Tente novamente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          aria-label="Fechar popup"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="grid md:grid-cols-2">
          {/* Left side */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col justify-center relative overflow-hidden">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Ficou com alguma dúvida?
            </h2>
            <p className="text-muted-foreground mb-6">
              Preencha as informações ao lado que em breve entraremos em contato com você.
            </p>
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full" />
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-primary/20">
                <img 
                  src={supportImage} 
                  alt="Atendimento Contabilidade Zen"
                  width={192}
                  height={192}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    placeholder="(DDD) 00000-0000"
                    value={formData.celular}
                    onChange={(e) => setFormData({ ...formData, celular: formatPhone(e.target.value) })}
                    maxLength={16}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Qual é o seu e-mail?</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu_email@mail.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Em qual cidade sua empresa está situada?</Label>
                <Select
                  value={formData.cidade}
                  onValueChange={(value) => setFormData({ ...formData, cidade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ex: São Paulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cidades.map((cidade) => (
                      <SelectItem key={cidade} value={cidade}>
                        {cidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="atividade">Descrição da atividade que você exercerá na empresa</Label>
                <Input
                  id="atividade"
                  placeholder="Ex.: programador, consultor de marketing"
                  value={formData.atividade}
                  onChange={(e) => setFormData({ ...formData, atividade: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Como prefere que entremos em contato com você?</Label>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleSubmit("whatsapp")}
                    disabled={isSaving}
                  >
                    <MessageCircle className="h-4 w-4" />
                    VIA WHATSAPP
                  </Button>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => handleSubmit("ligacao")}
                    disabled={isSaving}
                  >
                    <Phone className="h-4 w-4" />
                    VIA LIGAÇÃO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
