import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useWhatsAppNotification } from "@/hooks/use-whatsapp-notification";
import { useHoneypot } from "@/hooks/use-honeypot";
import { Send, CheckCircle2, Building2, Clock, FileCheck, Sparkles } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(10, "Telefone inválido").max(20),
});

export function AbrirEmpresaLeadForm() {
  const { toast } = useToast();
  const { openWhatsAppNotification } = useWhatsAppNotification();
  const { isBot, honeypotProps, reset: resetHoneypot } = useHoneypot();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    profissao: "",
    situacaoAtual: "",
    faturamento: "",
    cidadeEstado: "",
    aceitaPolitica: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Bot protection - silently fail for bots
    if (isBot()) {
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Em breve um especialista entrará em contato.",
      });
      return;
    }
    
    if (!formData.aceitaPolitica) {
      toast({
        title: "Atenção",
        description: "Por favor, aceite a política de privacidade para continuar.",
        variant: "destructive",
      });
      return;
    }

    const result = leadSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('leads').insert({
        nome: result.data.nome,
        email: result.data.email,
        whatsapp: result.data.telefone,
        segmento: formData.profissao || 'abertura-empresa',
        fonte: 'abertura_empresa_form',
      });

      if (error) throw error;

      // Trigger WhatsApp notification for team
      openWhatsAppNotification({
        nome: result.data.nome,
        email: result.data.email,
        whatsapp: result.data.telefone,
        segmento: 'Abertura de Empresa',
        fonte: 'Formulário Abertura Empresa',
      });
    
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Um especialista entrará em contato em até 24 horas.",
      });
    
      resetHoneypot();
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        profissao: "",
        situacaoAtual: "",
        faturamento: "",
        cidadeEstado: "",
        aceitaPolitica: false,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Sparkles,
      title: "Processo Simplificado",
      description: "Abertura ágil e sem complicações"
    },
    {
      icon: Clock,
      title: "CNPJ em até 15 dias",
      description: "Processo ágil e 100% digital"
    },
    {
      icon: FileCheck,
      title: "Documentação Completa",
      description: "Cuidamos de toda a burocracia"
    },
    {
      icon: Building2,
      title: "Suporte Especializado",
      description: "Contadores focados na área da saúde"
    }
  ];

  return (
    <section id="formulario-abertura" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Abra sua empresa com <span className="text-secondary">especialistas</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Preencha o formulário abaixo e nossa equipe entrará em contato para iniciar o processo de abertura da sua empresa.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Form */}
          <div className="bg-card rounded-2xl shadow-card p-8 lg:p-10 border border-border order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                <Building2 className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Solicitar Abertura</h3>
                <p className="text-sm text-muted-foreground">Processo 100% digital</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input 
                    id="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className={errors.nome ? "border-destructive" : ""}
                  />
                  {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                <Input 
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className={errors.telefone ? "border-destructive" : ""}
                />
                {errors.telefone && <p className="text-xs text-destructive">{errors.telefone}</p>}
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="profissao">Qual é sua profissão?</Label>
                  <Input 
                    id="profissao"
                    placeholder="Ex: Médico, Advogado, Desenvolvedor..."
                    value={formData.profissao}
                    onChange={(e) => setFormData({...formData, profissao: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Situação atual</Label>
                  <Select 
                    value={formData.situacaoAtual} 
                    onValueChange={(value) => setFormData({...formData, situacaoAtual: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pessoa-fisica">Pessoa Física (CPF)</SelectItem>
                      <SelectItem value="mei">MEI</SelectItem>
                      <SelectItem value="pj-outro-contador">PJ com outro contador</SelectItem>
                      <SelectItem value="ainda-nao-atuo">Ainda não atuo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Faturamento mensal estimado</Label>
                  <Select 
                    value={formData.faturamento} 
                    onValueChange={(value) => setFormData({...formData, faturamento: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate-10k">Até R$ 10.000</SelectItem>
                      <SelectItem value="10k-20k">R$ 10.000 a R$ 20.000</SelectItem>
                      <SelectItem value="20k-50k">R$ 20.000 a R$ 50.000</SelectItem>
                      <SelectItem value="50k-100k">R$ 50.000 a R$ 100.000</SelectItem>
                      <SelectItem value="acima-100k">Acima de R$ 100.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade / Estado</Label>
                  <Input 
                    id="cidade"
                    placeholder="São Paulo / SP"
                    value={formData.cidadeEstado}
                    onChange={(e) => setFormData({...formData, cidadeEstado: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="politica" 
                  checked={formData.aceitaPolitica}
                  onCheckedChange={(checked) => setFormData({...formData, aceitaPolitica: checked as boolean})}
                />
                <Label htmlFor="politica" className="text-sm text-muted-foreground leading-relaxed">
                  Li e concordo com a{" "}
                  <a href="/politica-de-privacidade" className="text-secondary hover:underline">
                    Política de Privacidade
                  </a>
                </Label>
              </div>

              {/* Honeypot field for bot protection */}
              <input {...honeypotProps} />
              
              <Button
                type="submit" 
                size="lg" 
                className="w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Solicitar Abertura
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Resposta garantida em até 24 horas úteis
              </p>
            </form>
          </div>
          
          {/* Benefits */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Por que abrir empresa com a{" "}
                <span className="text-secondary">Contabilidade Zen?</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Somos especialistas em profissionais da saúde e sabemos exatamente o que você precisa para iniciar sua jornada empresarial com tranquilidade.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="p-5 bg-card rounded-xl border border-border hover:border-secondary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <benefit.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <p className="font-medium text-foreground">O que está incluso:</p>
              {[
                "Abertura do CNPJ e Inscrição Municipal",
                "Escolha do melhor regime tributário",
                "Alvará de funcionamento",
                "Registro no conselho profissional (CRM, CRO, CRP...)",
                "Certificado digital incluso no 1º ano",
                "Suporte contábil completo após a abertura",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl border border-secondary/20 space-y-4 text-center">
              <p className="text-lg font-semibold text-foreground">
                💡 Economia garantida desde o primeiro mês
              </p>
              <p className="text-muted-foreground">
                Nossos clientes economizam em média <strong className="text-foreground">R$ 15.000 por ano</strong> em impostos 
                com nosso planejamento tributário especializado.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-xl font-bold text-secondary">Fator R</p>
                  <p className="text-xs text-muted-foreground">Pró-labore otimizado para pagar menos impostos</p>
                </div>
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-xl font-bold text-secondary">6% a 15%</p>
                  <p className="text-xs text-muted-foreground">Alíquota efetiva no Simples Nacional</p>
                </div>
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-xl font-bold text-secondary">-50%</p>
                  <p className="text-xs text-muted-foreground">Redução média vs. Pessoa Física</p>
                </div>
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-xl font-bold text-secondary">100%</p>
                  <p className="text-xs text-muted-foreground">Legal e dentro das normas fiscais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
