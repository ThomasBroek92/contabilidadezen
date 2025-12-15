import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWhatsAppNotification } from "@/hooks/use-whatsapp-notification";
import { Calculator, TrendingDown, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
});

interface TaxComparisonCalculatorProps {
  profession: "médico" | "dentista" | "psicólogo";
}

const faixasFaturamento = [
  { value: "10000", label: "R$ 10.000", autonomo: 27.5, pj: 6 },
  { value: "15000", label: "R$ 15.000", autonomo: 27.5, pj: 6 },
  { value: "20000", label: "R$ 20.000", autonomo: 27.5, pj: 7.5 },
  { value: "30000", label: "R$ 30.000", autonomo: 27.5, pj: 9 },
  { value: "50000", label: "R$ 50.000", autonomo: 27.5, pj: 11 },
  { value: "80000", label: "R$ 80.000", autonomo: 27.5, pj: 13.5 },
  { value: "100000", label: "R$ 100.000", autonomo: 27.5, pj: 15 },
];

export function TaxComparisonCalculator({ profession }: TaxComparisonCalculatorProps) {
  const { toast } = useToast();
  const { openWhatsAppNotification } = useWhatsAppNotification();
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faturamento, setFaturamento] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedFaixa = faixasFaturamento.find(f => f.value === faturamento);
  
  const calcularEconomia = () => {
    if (!selectedFaixa) return null;
    
    const faturamentoNum = parseFloat(faturamento);
    const impostoAutonomo = faturamentoNum * (selectedFaixa.autonomo / 100);
    const impostoPJ = faturamentoNum * (selectedFaixa.pj / 100);
    const economiaMensal = impostoAutonomo - impostoPJ;
    const economiaAnual = economiaMensal * 12;
    
    return {
      faturamento: faturamentoNum,
      impostoAutonomo,
      impostoPJ,
      economiaMensal,
      economiaAnual,
      aliquotaAutonomo: selectedFaixa.autonomo,
      aliquotaPJ: selectedFaixa.pj,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!faturamento) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione uma faixa de faturamento.",
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
      const economia = calcularEconomia();
      const { error } = await supabase.from('leads').insert({
        nome: result.data.nome,
        email: result.data.email,
        whatsapp: result.data.whatsapp,
        segmento: profession,
        fonte: 'calculadora_tributaria',
        faturamento_mensal: parseFloat(faturamento),
        economia_anual: economia?.economiaAnual || 0,
      });
      
      if (error) throw error;

      // Trigger WhatsApp notification for team
      openWhatsAppNotification({
        nome: result.data.nome,
        email: result.data.email,
        whatsapp: result.data.whatsapp,
        segmento: profession.charAt(0).toUpperCase() + profession.slice(1),
        fonte: 'Calculadora Tributária',
        faturamento: parseFloat(faturamento),
        economia: economia?.economiaAnual,
      });
      
      toast({
        title: "Dados enviados com sucesso!",
        description: "Veja abaixo sua simulação de economia.",
      });
      
      setShowResults(true);
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

  const economia = calcularEconomia();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Simulador de Economia
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Descubra quanto você pode economizar como PJ
          </h2>
          <p className="text-muted-foreground text-lg">
            Compare a tributação como autônomo (Pessoa Física) vs {profession} PJ e veja a economia que você pode ter
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <div className="bg-card rounded-2xl shadow-card p-8 lg:p-10 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Simule sua economia
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados abaixo para ver o resultado
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Qual seu faturamento mensal estimado?</Label>
                  <Select 
                    value={faturamento} 
                    onValueChange={setFaturamento}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione sua faixa de faturamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {faixasFaturamento.map((faixa) => (
                        <SelectItem key={faixa.value} value={faixa.value}>
                          {faixa.label} / mês
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Preencha para ver o resultado
                    </span>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input 
                        id="nome"
                        placeholder="Seu nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        className={errors.nome ? "border-destructive" : ""}
                      />
                      {errors.nome && (
                        <p className="text-xs text-destructive">{errors.nome}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input 
                        id="whatsapp"
                        placeholder="(00) 00000-0000"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        className={errors.whatsapp ? "border-destructive" : ""}
                      />
                      {errors.whatsapp && (
                        <p className="text-xs text-destructive">{errors.whatsapp}</p>
                      )}
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
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Calculando...</>
                  ) : (
                    <>
                      Ver minha economia
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Ao enviar, você concorda em receber contato sobre nossos serviços.
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="bg-secondary/10 rounded-2xl p-6 border border-secondary/20 text-center">
                <CheckCircle2 className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {formData.nome}, veja sua economia potencial!
                </h3>
                <p className="text-muted-foreground">
                  Com base no faturamento de {formatCurrency(economia?.faturamento || 0)}/mês
                </p>
              </div>

              {/* Comparison Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Autônomo Card */}
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">Autônomo (PF)</h4>
                    <span className="px-3 py-1 bg-destructive/10 text-destructive text-sm font-medium rounded-full">
                      Atual
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alíquota efetiva</span>
                      <span className="font-semibold text-foreground">{economia?.aliquotaAutonomo}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Imposto mensal</span>
                      <span className="font-semibold text-destructive">{formatCurrency(economia?.impostoAutonomo || 0)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-muted-foreground">Imposto anual</span>
                      <span className="font-semibold text-destructive">{formatCurrency((economia?.impostoAutonomo || 0) * 12)}</span>
                    </div>
                  </div>
                </div>

                {/* PJ Card */}
                <div className="bg-card rounded-xl p-6 border-2 border-secondary relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-sm font-bold rounded-full">
                    RECOMENDADO
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">{profession.charAt(0).toUpperCase() + profession.slice(1)} PJ</h4>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
                      Melhor opção
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alíquota efetiva</span>
                      <span className="font-semibold text-secondary">{economia?.aliquotaPJ}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Imposto mensal</span>
                      <span className="font-semibold text-secondary">{formatCurrency(economia?.impostoPJ || 0)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="text-muted-foreground">Imposto anual</span>
                      <span className="font-semibold text-secondary">{formatCurrency((economia?.impostoPJ || 0) * 12)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Summary */}
              <div className="bg-primary rounded-2xl p-8 text-center">
                <TrendingDown className="h-10 w-10 text-secondary mx-auto mb-4" />
                <p className="text-primary-foreground/80 mb-2">Sua economia estimada</p>
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold text-secondary">
                      {formatCurrency(economia?.economiaMensal || 0)}
                    </p>
                    <p className="text-sm text-primary-foreground/60">por mês</p>
                  </div>
                  <div className="hidden sm:block w-px h-16 bg-primary-foreground/20" />
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold text-secondary">
                      {formatCurrency(economia?.economiaAnual || 0)}
                    </p>
                    <p className="text-sm text-primary-foreground/60">por ano</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Quer começar a economizar agora? Fale com nossos especialistas!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Agendar consultoria gratuita
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    asChild
                  >
                    <a
                      href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Sou ${profession} e fiz a simulação no site. Gostaria de saber mais sobre como economizar impostos.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar pelo WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
                * Os valores apresentados são estimativas baseadas em alíquotas médias e podem variar de acordo com 
                a atividade específica, localização e outros fatores. Para uma análise precisa, consulte nossos especialistas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
