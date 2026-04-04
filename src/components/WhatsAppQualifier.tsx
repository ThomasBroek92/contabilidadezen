import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, ArrowRight, ArrowLeft, User, Phone, SkipForward } from "lucide-react";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { useHoneypot } from "@/hooks/use-honeypot";
import { getWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/hooks/use-analytics";

const SEGMENTS = [
  "Médico", "Dentista", "Psicólogo", "Advogado",
  "Profissional de TI", "Produtor Digital", "Representante Comercial",
  "E-commerce", "Prestador de Serviço", "Outro"
];

const REVENUE_RANGES = [
  { label: "Até R$ 5.000", value: 5000 },
  { label: "R$ 5.000 – R$ 15.000", value: 10000 },
  { label: "R$ 15.000 – R$ 30.000", value: 22500 },
  { label: "R$ 30.000 – R$ 80.000", value: 55000 },
  { label: "Acima de R$ 80.000", value: 100000 },
];

const NEEDS = [
  "Abrir empresa (CNPJ)",
  "Trocar de contador",
  "Reduzir impostos",
  "Declaração de IR",
  "BPO Financeiro",
  "Outro",
];

interface WhatsAppQualifierProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsAppQualifier({ open, onOpenChange }: WhatsAppQualifierProps) {
  const [step, setStep] = useState(0);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [segmento, setSegmento] = useState("");
  const [faturamento, setFaturamento] = useState<number | null>(null);
  const [necessidade, setNecessidade] = useState("");
  const { saveLead } = useLeadCapture();
  const { isBot, honeypotProps, reset: resetHoneypot } = useHoneypot();

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const skipToWhatsApp = () => {
    trackWhatsAppClick("qualifier_skip", "");
    const url = getWhatsAppLink("Olá! Gostaria de mais informações sobre os serviços de contabilidade.");
    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(0);
    setNome("");
    setWhatsapp("");
    setSegmento("");
    setFaturamento(null);
    setNecessidade("");
    resetHoneypot();
  };

  const handleFinish = async () => {
    if (isBot()) return;

    const message = `Olá! Sou ${nome}, ${segmento}. Faturamento: ${REVENUE_RANGES.find(r => r.value === faturamento)?.label || "Não informado"}. Preciso de: ${necessidade}.`;

    // Fire-and-forget lead save
    try {
      await saveLead({
        nome,
        whatsapp,
        email: `${whatsapp.replace(/\D/g, "")}@qualificador.lead`,
        segmento,
        fonte: "qualificador_whatsapp",
        faturamento_mensal: faturamento || undefined,
      });
    } catch (e) {
      console.warn("Lead save failed:", e);
    }

    // Mark as already qualified in this session
    try { sessionStorage.setItem("waq_done", "1"); } catch {}

    trackWhatsAppClick("qualifier_complete", message);
    const url = getWhatsAppLink(message);
    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
    resetForm();
  };

  const canAdvance = () => {
    if (step === 0) return nome.trim().length >= 2 && whatsapp.trim().length >= 10;
    if (step === 1) return !!segmento;
    if (step === 2) return faturamento !== null;
    if (step === 3) return !!necessidade;
    return false;
  };

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else handleFinish();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-[#075E54] px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-semibold text-white leading-tight">
              Fale com um especialista
            </DialogTitle>
            <p className="text-[11px] text-white/80">Responda rápido e vá direto ao WhatsApp</p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            Passo {step + 1} de {totalSteps}
          </p>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 min-h-[220px] flex flex-col">
          {/* Honeypot */}
          <input {...honeypotProps} />

          {step === 0 && (
            <div className="space-y-4 flex-1">
              <h3 className="text-lg font-semibold text-foreground">Como podemos te chamar?</h3>
              <div className="space-y-2">
                <Label htmlFor="q-nome" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" /> Nome
                </Label>
                <Input id="q-nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q-whatsapp" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-secondary" /> WhatsApp
                </Label>
                <Input id="q-whatsapp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-semibold text-foreground">Qual é o seu segmento?</h3>
              <div className="grid grid-cols-2 gap-2">
                {SEGMENTS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSegmento(s)}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left ${
                      segmento === s
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border hover:border-secondary/50 text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-semibold text-foreground">Faturamento mensal estimado?</h3>
              <div className="space-y-2">
                {REVENUE_RANGES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setFaturamento(r.value)}
                    className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-colors text-left ${
                      faturamento === r.value
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border hover:border-secondary/50 text-foreground"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-semibold text-foreground">O que você mais precisa?</h3>
              <div className="space-y-2">
                {NEEDS.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNecessidade(n)}
                    className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-colors text-left ${
                      necessidade === n
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border hover:border-secondary/50 text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-5 gap-2">
            {step > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={next}
              disabled={!canAdvance()}
              className={step === totalSteps - 1
                ? "bg-[#25D366] hover:bg-[#20BD5A] text-white"
                : ""
              }
            >
              {step === totalSteps - 1 ? (
                <>
                  <MessageCircle className="h-4 w-4 mr-1" /> Ir ao WhatsApp
                </>
              ) : (
                <>
                  Próximo <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {/* Skip link */}
          <button
            type="button"
            onClick={skipToWhatsApp}
            className="text-xs text-muted-foreground hover:text-foreground mt-3 mx-auto flex items-center gap-1 transition-colors"
          >
            <SkipForward className="h-3 w-3" /> Pular e ir direto ao WhatsApp
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
