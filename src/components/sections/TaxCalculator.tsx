import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function TaxCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [result, setResult] = useState<{
    pfTax: number;
    pjTax: number;
    savings: number;
    savingsPercent: number;
  } | null>(null);

  const calculateSavings = () => {
    const income = parseFloat(monthlyIncome.replace(/\D/g, "")) / 100;
    if (isNaN(income) || income <= 0) return;

    const annualIncome = income * 12;
    
    // Cálculo simplificado - Pessoa Física (IRRF progressivo)
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

    // Cálculo simplificado - Pessoa Jurídica (Simples Nacional com Fator R otimizado)
    const pjTax = annualIncome * 0.06; // 6% com Fator R

    const savings = pfTax - pjTax;
    const savingsPercent = (savings / pfTax) * 100;

    setResult({
      pfTax,
      pjTax,
      savings: Math.max(0, savings),
      savingsPercent: Math.max(0, savingsPercent),
    });
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

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Calculadora
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
              Descubra quanto você pode{" "}
              <span className="text-gradient">economizar</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simule sua economia ao migrar de pessoa física para pessoa jurídica 
              com planejamento tributário especializado.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-card rounded-2xl border border-border p-6 lg:p-10 shadow-card">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Input */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Calcule sua economia</h3>
                    <p className="text-sm text-muted-foreground">Simulação rápida e gratuita</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="income" className="text-foreground">
                      Faturamento mensal estimado
                    </Label>
                    <Input
                      id="income"
                      type="text"
                      placeholder="R$ 0,00"
                      value={monthlyIncome}
                      onChange={handleInputChange}
                      className="mt-2 h-12 text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Inclua todos os seus rendimentos (plantões, consultas, etc.)
                    </p>
                  </div>

                  <Button 
                    variant="zen" 
                    className="w-full" 
                    size="lg"
                    onClick={calculateSavings}
                  >
                    Calcular economia
                    <TrendingDown className="h-5 w-5" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  * Simulação estimada com base no Simples Nacional com Fator R otimizado. 
                  O valor real pode variar de acordo com seu caso específico.
                </p>
              </div>

              {/* Result */}
              <div className="bg-muted/50 rounded-xl p-6">
                {result ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Economia anual estimada</p>
                      <p className="text-4xl lg:text-5xl font-bold text-secondary">
                        {formatCurrency(result.savings)}
                      </p>
                      <p className="text-sm text-secondary mt-2">
                        {result.savingsPercent.toFixed(0)}% de redução nos impostos
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Imposto como PF (anual)</span>
                        <span className="font-semibold text-destructive">{formatCurrency(result.pfTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Imposto como PJ (anual)</span>
                        <span className="font-semibold text-secondary">{formatCurrency(result.pjTax)}</span>
                      </div>
                    </div>

                    <Button variant="zen" className="w-full" asChild>
                      <Link to="/contato">
                        Quero economizar
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingDown className="h-8 w-8 text-secondary" />
                      </div>
                      <p className="text-muted-foreground">
                        Insira seu faturamento mensal para ver quanto você pode economizar em impostos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
