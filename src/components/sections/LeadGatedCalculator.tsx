import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingDown, ArrowRight, Loader2, CheckCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot } from "@/hooks/use-honeypot";
import { trackFormSubmit, trackCalculatorUse } from "@/hooks/use-analytics";

const leadSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("Email inválido").max(255),
  whatsapp: z.string().min(10, "WhatsApp inválido").max(20),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadGatedCalculatorProps {
  variant?: "compact" | "full";
  source?: string;
}

export function LeadGatedCalculator({ variant = "full", source = "calculadora-servicos" }: LeadGatedCalculatorProps) {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [step, setStep] = useState<"input" | "lead-capture" | "result">("input");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    pfTax: number;
    pjTax: number;
    savings: number;
    savingsPercent: number;
    monthlyIncome: number;
  } | null>(null);
  
  const { toast } = useToast();
  const { isBot, honeypotProps } = useHoneypot();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: "",
      email: "",
      whatsapp: "",
    },
  });

  const calculateSavings = () => {
    const income = parseFloat(monthlyIncome.replace(/\D/g, "")) / 100;
    if (isNaN(income) || income <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira seu faturamento mensal.",
        variant: "destructive",
      });
      return;
    }

    const annualIncome = income * 12;
    
    // Cálculo - Pessoa Física (IRRF progressivo)
    let pfTax = 0;
    if (annualIncome <= 26823.84) {
      pfTax = 0;
    } else if (annualIncome <= 33920.76) {
      pfTax = annualIncome * 0.075;
    } else if (annualIncome <= 45013.56) {
      pfTax = annualIncome * 0.15;
    } else if (annualIncome <= 55979.04) {
      pfTax = annualIncome * 0.225;
    } else {
      pfTax = annualIncome * 0.275;
    }

    // Cálculo - Pessoa Jurídica (Simples Nacional com Fator R otimizado)
    const pjTax = annualIncome * 0.06;

    const savings = pfTax - pjTax;
    const savingsPercent = pfTax > 0 ? (savings / pfTax) * 100 : 0;

    setResult({
      pfTax,
      pjTax,
      savings: Math.max(0, savings),
      savingsPercent: Math.max(0, savingsPercent),
      monthlyIncome: income,
    });

    // Track calculator usage
    trackCalculatorUse("calculadora-pj-clt", {
      savings: Math.max(0, savings),
      monthlyIncome: income,
    });

    setStep("lead-capture");
  };

  const onSubmitLead = async (data: LeadFormData) => {
    if (isBot()) {
      toast({ title: "Sucesso!", description: "Dados enviados com sucesso." });
      setStep("result");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        segmento: "geral",
        fonte: source,
        faturamento_mensal: result?.monthlyIncome || 0,
        economia_anual: result?.savings || 0,
      });

      if (error) throw error;

      // Track form submission
      trackFormSubmit("calculadora-lead-form", {
        segmento: "geral",
        fonte: source,
        economia: result?.savings || 0,
      });

      toast({
        title: "Dados salvos!",
        description: "Veja abaixo sua economia estimada.",
      });

      setStep("result");
    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseInt(value || "0") / 100);
    setMonthlyIncome(formattedValue);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const resetCalculator = () => {
    setStep("input");
    setMonthlyIncome("");
    setResult(null);
    form.reset();
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
      {/* Step 1: Income Input */}
      {step === "input" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Calculator className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Calcule sua economia</h3>
              <p className="text-xs text-muted-foreground">Simulação rápida e gratuita</p>
            </div>
          </div>

          <div>
            <Label htmlFor="income" className="text-foreground text-sm">
              Faturamento mensal estimado
            </Label>
            <Input
              id="income"
              type="text"
              placeholder="R$ 0,00"
              value={monthlyIncome}
              onChange={handleInputChange}
              className="mt-1.5 h-11"
            />
          </div>

          <Button 
            variant="zen" 
            className="w-full" 
            onClick={calculateSavings}
          >
            Ver minha economia
            <TrendingDown className="h-4 w-4" />
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            * Simulação com Simples Nacional otimizado
          </p>
        </div>
      )}

      {/* Step 2: Lead Capture */}
      {step === "lead-capture" && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground">Quase lá!</h3>
            <p className="text-sm text-muted-foreground">
              Preencha seus dados para ver sua economia estimada
            </p>
          </div>

          {/* Preview blur */}
          <div className="relative bg-muted/50 rounded-xl p-4 mb-4">
            <div className="filter blur-sm pointer-events-none">
              <p className="text-xs text-muted-foreground text-center mb-1">Economia anual estimada</p>
              <p className="text-2xl font-bold text-secondary text-center">
                {formatCurrency(result?.savings || 0)}
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
              <span className="text-sm font-medium text-foreground">🔒 Preencha para liberar</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitLead)} className="space-y-3">
              {/* Honeypot field for bot protection */}
              <input {...honeypotProps} type="text" />
              
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">WhatsApp</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field}
                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                variant="zen" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Ver resultado
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <button 
            onClick={() => setStep("input")}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar e alterar valor
          </button>
        </div>
      )}

      {/* Step 3: Result */}
      {step === "result" && result && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Economia anual estimada</p>
            <p className="text-3xl font-bold text-secondary">
              {formatCurrency(result.savings)}
            </p>
            <p className="text-sm text-secondary mt-1">
              {result.savingsPercent.toFixed(0)}% menos impostos
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Como PF (anual)</span>
              <span className="font-medium text-destructive">{formatCurrency(result.pfTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Como PJ (anual)</span>
              <span className="font-medium text-secondary">{formatCurrency(result.pjTax)}</span>
            </div>
          </div>

          <Button variant="zen" className="w-full" asChild>
            <Link to="/abrir-empresa">
              Abrir minha empresa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <button 
            onClick={resetCalculator}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Fazer nova simulação
          </button>
        </div>
      )}
    </div>
  );
}
