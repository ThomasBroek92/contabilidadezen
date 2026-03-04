import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { useHoneypot } from "@/hooks/use-honeypot";
import { Send, CheckCircle2, TrendingDown, Percent, Shield } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const leadSchema = z.object({ nome: z.string().trim().min(2).max(100), email: z.string().trim().email().max(255), telefone: z.string().trim().min(10).max(20) });

export function ClinicasConsultoriosLeadForm() {
  const { toast } = useToast();
  const { isBot, honeypotProps, reset: resetHoneypot } = useHoneypot();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", tipoEstabelecimento: "", faturamento: "", cidadeEstado: "", aceitaPolitica: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({});
    if (isBot()) { toast({ title: "Enviado!" }); return; }
    if (!formData.aceitaPolitica) { toast({ title: "Atenção", description: "Aceite a política.", variant: "destructive" }); return; }
    const result = leadSchema.safeParse(formData);
    if (!result.success) { const fe: Record<string, string> = {}; result.error.errors.forEach(err => { if (err.path[0]) fe[err.path[0] as string] = err.message; }); setErrors(fe); return; }
    setIsSubmitting(true);
    try {
      const info: string[] = [];
      if (formData.tipoEstabelecimento) info.push(`Tipo: ${formData.tipoEstabelecimento}`);
      if (formData.faturamento) info.push(`Faturamento: ${formData.faturamento}`);
      if (formData.cidadeEstado) info.push(`Cidade: ${formData.cidadeEstado}`);
      const { error } = await supabase.from('leads').insert({ nome: result.data.nome, email: result.data.email, whatsapp: result.data.telefone, segmento: 'clinicas-consultorios', fonte: 'landing-page-clinicas-consultorios', cargo: formData.tipoEstabelecimento || null, observacoes: info.length > 0 ? info.join(' | ') : null });
      if (error) throw error;
      setSubmittedWhatsAppUrl(getWhatsAppLink(WHATSAPP_MESSAGES.clinicasConsultorios));
      setIsSubmitted(true);
      toast({ title: "Enviado!", description: "Em breve entraremos em contato." });
      resetHoneypot();
      setFormData({ nome: "", email: "", telefone: "", tipoEstabelecimento: "", faturamento: "", cidadeEstado: "", aceitaPolitica: false });
    } catch { toast({ title: "Erro", variant: "destructive" }); } finally { setIsSubmitting(false); }
  };

  return (
    <section id="lead-form" className="py-16 lg:py-24 bg-[#ECFDF5]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="bg-card rounded-2xl shadow-card p-8 lg:p-10 border border-[#059669]/20 order-2 lg:order-1">
            {isSubmitted ? (
              <div className="text-center space-y-6 py-8">
                <CheckCircle2 className="h-16 w-16 text-secondary mx-auto" />
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Enviado com sucesso!</h2>
                <p className="text-muted-foreground">Em breve entraremos em contato.</p>
                <a href={submittedWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 text-lg font-semibold text-white hover:bg-[#1da851]"><Send className="h-5 w-5" />Falar no WhatsApp</a>
              </div>
            ) : (
              <>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Sua clínica com contabilidade certa</h2>
                <p className="text-muted-foreground mb-8">Preencha para análise tributária gratuita.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2"><Label htmlFor="nome">Nome completo</Label><Input id="nome" placeholder="Seu nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className={errors.nome ? "border-destructive" : ""} />{errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}</div>
                    <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={errors.email ? "border-destructive" : ""} />{errors.email && <p className="text-xs text-destructive">{errors.email}</p>}</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2"><Label htmlFor="telefone">WhatsApp</Label><Input id="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={e => { const v = e.target.value.replace(/\D/g, ""); let f = ""; if (v.length <= 2) f = v.length > 0 ? `(${v}` : ""; else if (v.length <= 6) f = `(${v.slice(0,2)}) ${v.slice(2)}`; else if (v.length <= 10) f = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`; else f = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7,11)}`; setFormData({...formData, telefone: f}); }} maxLength={16} className={errors.telefone ? "border-destructive" : ""} />{errors.telefone && <p className="text-xs text-destructive">{errors.telefone}</p>}</div>
                    <div className="space-y-2"><Label>Tipo de estabelecimento</Label><Select value={formData.tipoEstabelecimento} onValueChange={v => setFormData({...formData, tipoEstabelecimento: v})}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="clinica-medica">Clínica Médica</SelectItem><SelectItem value="consultorio-odontologico">Consultório Odontológico</SelectItem><SelectItem value="clinica-estetica">Clínica de Estética</SelectItem><SelectItem value="laboratorio">Laboratório</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2"><Label>Faturamento mensal</Label><Select value={formData.faturamento} onValueChange={v => setFormData({...formData, faturamento: v})}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="ate-50k">Até R$ 50.000</SelectItem><SelectItem value="50k-100k">R$ 50.000 a R$ 100.000</SelectItem><SelectItem value="100k-300k">R$ 100.000 a R$ 300.000</SelectItem><SelectItem value="acima-300k">Acima de R$ 300.000</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label htmlFor="cidade">Cidade / Estado</Label><Input id="cidade" placeholder="São Paulo / SP" value={formData.cidadeEstado} onChange={e => setFormData({...formData, cidadeEstado: e.target.value})} /></div>
                  </div>
                  <div className="flex items-start space-x-3 pt-2"><Checkbox id="politica" checked={formData.aceitaPolitica} onCheckedChange={c => setFormData({...formData, aceitaPolitica: c as boolean})} /><Label htmlFor="politica" className="text-sm text-muted-foreground leading-relaxed">Li e concordo com a <a href="/politica-de-privacidade" className="text-secondary hover:underline">Política de Privacidade</a></Label></div>
                  <input {...honeypotProps} />
                  <Button type="submit" size="lg" className="w-full mt-4 bg-[#059669] hover:bg-[#047857] text-white" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : <><Send className="h-4 w-4 mr-2" />Enviar diagnóstico gratuito</>}</Button>
                </form>
              </>
            )}
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Sua clínica com{" "}<span className="text-[#059669]">contabilidade especializada!</span></h2>
              <p className="text-lg text-muted-foreground leading-relaxed">Equiparação hospitalar, folha de pagamento completa, gestão de convênios e sociedade médica.</p>
            </div>
            <div className="space-y-4">
              {["Equiparação hospitalar (IR/CSLL de 32% → 8%)", "Folha de pagamento de equipe médica", "Gestão fiscal de convênios e glosas", "Sociedade médica e holding patrimonial"].map((item, i) => (
                <div key={i} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" /><span className="text-foreground">{item}</span></div>
              ))}
            </div>
            <div className="p-6 bg-[#D1FAE5] rounded-xl border border-[#059669]/20">
              <p className="text-lg font-semibold text-foreground mb-4">Quanto você pode economizar?</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-card rounded-lg border border-[#059669]/15"><TrendingDown className="h-6 w-6 text-[#059669] mx-auto mb-2" /><p className="text-2xl font-bold text-[#047857]">8%</p><p className="text-xs text-muted-foreground">Base IR/CSLL</p></div>
                <div className="p-4 bg-card rounded-lg border border-[#059669]/15"><Percent className="h-6 w-6 text-[#059669] mx-auto mb-2" /><p className="text-2xl font-bold text-[#047857]">6%</p><p className="text-xs text-muted-foreground">A partir de</p></div>
                <div className="p-4 bg-card rounded-lg border border-secondary/30"><Shield className="h-6 w-6 text-secondary mx-auto mb-2" /><p className="text-2xl font-bold text-secondary">100%</p><p className="text-xs text-muted-foreground">Legal</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
