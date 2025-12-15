import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(10, "Telefone inválido").max(20),
});

export function PsicologosLeadForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    atividade: "",
    tributacao: "",
    faturamento: "",
    cidadeEstado: "",
    ehPsicologo: "",
    aceitaPolitica: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
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
        segmento: 'psicologos',
        fonte: 'lead_form',
      });

      if (error) throw error;
    
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Em breve um especialista entrará em contato.",
      });
    
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        atividade: "",
        tributacao: "",
        faturamento: "",
        cidadeEstado: "",
        ehPsicologo: "",
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

  return (
    <section id="lead-form" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="bg-card rounded-2xl shadow-card p-8 lg:p-10 border border-border order-2 lg:order-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Está pronto para aumentar seus lucros?
            </h2>
            <p className="text-muted-foreground mb-8">
              Não deixe a alta carga tributária prejudicar o potencial do seu consultório! 
              Preencha o formulário para uma análise gratuita.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input 
                    id="nome"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className={errors.nome ? "border-destructive" : ""}
                  />
                  {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
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
                <Label htmlFor="telefone">Telefone / WhatsApp</Label>
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
                  <Label>Qual é a atividade da sua empresa?</Label>
                  <Select 
                    value={formData.atividade} 
                    onValueChange={(value) => setFormData({...formData, atividade: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clinica-psicologia">Clínica de Psicologia</SelectItem>
                      <SelectItem value="consultorio">Consultório</SelectItem>
                      <SelectItem value="psicologo-autonomo">Psicólogo Autônomo</SelectItem>
                      <SelectItem value="psicologo-pj">Psicólogo PJ</SelectItem>
                      <SelectItem value="centro-terapeutico">Centro Terapêutico</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Qual o modelo de tributação?</Label>
                  <Select 
                    value={formData.tributacao} 
                    onValueChange={(value) => setFormData({...formData, tributacao: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simples-nacional">Simples Nacional</SelectItem>
                      <SelectItem value="lucro-presumido">Lucro Presumido</SelectItem>
                      <SelectItem value="lucro-real">Lucro Real</SelectItem>
                      <SelectItem value="pessoa-fisica">Pessoa Física</SelectItem>
                      <SelectItem value="nao-sei">Não sei informar</SelectItem>
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
              
              <div className="space-y-2">
                <Label>Você é psicólogo(a)?</Label>
                <Select 
                  value={formData.ehPsicologo} 
                  onValueChange={(value) => setFormData({...formData, ehPsicologo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não, sou gestor/administrador</SelectItem>
                  </SelectContent>
                </Select>
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
                    Enviar e receber diagnóstico gratuito
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Controle a saúde financeira do seu consultório e{" "}
                <span className="text-secondary">pague menos impostos!</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Seu consultório merece mais do que apenas acompanhamento. Assim como você cuida da saúde mental dos seus pacientes, 
                suas finanças exigem constante atenção.
              </p>
            </div>
            
            <p className="text-muted-foreground">
              Com o apoio da nossa equipe especializada, você terá a tranquilidade de ver suas finanças 
              organizadas e otimizadas, deixando a carga tributária mais leve e sua gestão mais eficiente.
            </p>
            
            <div className="space-y-4">
              {[
                "Planejamento tributário personalizado para psicólogos",
                "Redução legal de impostos comprovada",
                "Atendimento especializado em saúde mental",
                "Suporte contábil dedicado para sua rotina",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
              <p className="text-lg font-semibold text-foreground mb-2">
                Por que escolher contabilidade especializada?
              </p>
              <p className="text-muted-foreground">
                Psicólogos têm particularidades tributárias que a contabilidade genérica não 
                compreende. Nós falamos a sua língua e entendemos sua rotina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
