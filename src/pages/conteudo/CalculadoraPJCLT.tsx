import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  CheckCircle, 
  FileText, 
  Calendar, 
  DollarSign,
  Building2,
  User,
  ArrowRight,
  Info,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { toast } from "sonner";

// Tabela INSS 2024
const INSS_FAIXAS = [
  { limite: 1412.00, aliquota: 0.075 },
  { limite: 2666.68, aliquota: 0.09 },
  { limite: 4000.03, aliquota: 0.12 },
  { limite: 7786.02, aliquota: 0.14 },
];

// Tabela IRRF 2024
const IRRF_FAIXAS = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

// Planos da Contabilidade Zen
const PLANOS_ZEN = [
  {
    name: "Profissional Liberal",
    price: 297.90,
    description: "Ideal para autônomos ou PJ sem funcionários",
    ideal: "Faturamento até R$ 15.000/mês",
  },
  {
    name: "Clínica / Consultório",
    price: 447.90,
    description: "Para clínicas físicas com necessidades específicas",
    ideal: "Faturamento até R$ 50.000/mês",
    popular: true,
  },
  {
    name: "Empresarial",
    price: 597.90,
    description: "Para clínicas maiores com funcionários",
    ideal: "Faturamento acima de R$ 50.000/mês",
  },
];

interface ResultadoCalculo {
  // Autônomo
  salarioBrutoAutonomo: number;
  inss: number;
  irrf: number;
  salarioLiquidoAutonomo: number;
  beneficiosTotais: number;
  totalAnualAutonomo: number;
  totalMensalEquivalenteAutonomo: number;
  
  // PJ
  faturamentoPJ: number;
  impostosPJ: number;
  inssPJ: number;
  contabilidade: number;
  salarioLiquidoPJ: number;
  totalAnualPJ: number;
  
  // Comparação - economia ao migrar para PJ
  economiaMensal: number;
  economiaAnual: number;
  percentualEconomia: number;
}

export default function CalculadoraPJCLT() {
  const [salarioBruto, setSalarioBruto] = useState("");
  const [valeRefeicao, setValeRefeicao] = useState("");
  const [valeTransporte, setValeTransporte] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");
  const [outrosBeneficios, setOutrosBeneficios] = useState("");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Lead capture fields
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { saveLead, leadSaved } = useLeadCapture();

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const parseCurrency = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (numericValue === "") {
      setter("");
      return;
    }
    const number = parseInt(numericValue, 10) / 100;
    setter(
      number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  const calcularINSS = (salario: number): number => {
    let inss = 0;
    let salarioRestante = salario;
    let faixaAnterior = 0;

    for (const faixa of INSS_FAIXAS) {
      if (salarioRestante <= 0) break;
      const baseCalculo = Math.min(salarioRestante, faixa.limite - faixaAnterior);
      inss += baseCalculo * faixa.aliquota;
      salarioRestante -= baseCalculo;
      faixaAnterior = faixa.limite;
    }

    return inss;
  };

  const calcularIRRF = (salario: number, inss: number): number => {
    const baseCalculo = salario - inss;
    
    for (const faixa of IRRF_FAIXAS) {
      if (baseCalculo <= faixa.limite) {
        return Math.max(0, baseCalculo * faixa.aliquota - faixa.deducao);
      }
    }
    return 0;
  };

  const calcular = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const salario = parseCurrency(salarioBruto);
      const vr = parseCurrency(valeRefeicao);
      const vt = parseCurrency(valeTransporte);
      const ps = parseCurrency(planoSaude);
      const outros = parseCurrency(outrosBeneficios);

      if (salario <= 0) {
        setIsCalculating(false);
        return;
      }

      // Cálculos Autônomo (sem empresa)
      const inss = calcularINSS(salario);
      const irrf = calcularIRRF(salario, inss);
      const salarioLiquidoAutonomo = salario - inss - irrf;
      
      const beneficiosTotais = vr + vt + ps + outros;
      
      const totalMensalEquivalenteAutonomo = salarioLiquidoAutonomo + beneficiosTotais;
      const totalAnualAutonomo = totalMensalEquivalenteAutonomo * 12;

      // Cálculos PJ - com mesmo faturamento bruto
      // Usamos Simples Nacional com alíquota efetiva de ~6% (Fator R aplicável para serviços de saúde)
      const aliquotaSimples = 0.06;
      const proLabore = 1412; // 1 salário mínimo
      const inssPJ = proLabore * 0.11;
      const contabilidade = PLANOS_ZEN[0].price;
      
      // Faturamento PJ = mesmo valor bruto do autônomo
      const faturamentoPJ = salario;
      const impostosPJ = faturamentoPJ * aliquotaSimples;
      const salarioLiquidoPJ = faturamentoPJ - impostosPJ - inssPJ - contabilidade + beneficiosTotais;
      const totalAnualPJ = salarioLiquidoPJ * 12;

      // Economia ao migrar para PJ
      const economiaMensal = salarioLiquidoPJ - totalMensalEquivalenteAutonomo;
      const economiaAnual = totalAnualPJ - totalAnualAutonomo;
      const percentualEconomia = ((salarioLiquidoPJ / totalMensalEquivalenteAutonomo) - 1) * 100;

      setResultado({
        salarioBrutoAutonomo: salario,
        inss,
        irrf,
        salarioLiquidoAutonomo,
        beneficiosTotais,
        totalAnualAutonomo,
        totalMensalEquivalenteAutonomo,
        faturamentoPJ,
        impostosPJ,
        inssPJ,
        contabilidade,
        salarioLiquidoPJ,
        totalAnualPJ,
        economiaMensal,
        economiaAnual,
        percentualEconomia,
      });
      
      // Show lead capture form after calculation
      setShowLeadForm(true);
      setIsCalculating(false);
    }, 800);
  };

  const handleLeadSubmit = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      toast.error("Preencha todos os campos para receber a análise");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Informe um e-mail válido");
      return;
    }

    const salario = parseCurrency(salarioBruto);
    const saved = await saveLead({
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: telefone.trim(),
      segmento: "PJ x Autônomo",
      fonte: "Calculadora PJ x Autônomo",
      faturamento_mensal: salario,
      economia_anual: resultado?.economiaAnual,
    });

    if (saved) {
      toast.success("Dados salvos! Entraremos em contato em breve.");
    }
  };

  return (
    <TooltipProvider>
      <Helmet>
        <title>Calculadora PJ x Autônomo | Economize sendo PJ | Contabilidade Zen</title>
        <meta
          name="description"
          content="Descubra quanto você pode economizar migrando de Autônomo para PJ. Calculadora gratuita mostra a economia real com impostos reduzidos no Simples Nacional."
        />
        <meta
          name="keywords"
          content="calculadora pj x autonomo, economia pj, simples nacional, abrir empresa, contabilidade para médicos, reduzir impostos"
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-secondary">
              Materiais
            </Link>
            <span className="mx-2">{">"}</span>
            <span className="text-foreground font-medium">Calculadora</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div className="container mx-auto px-4 py-12 lg:py-16 relative">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Calculadora PJ x Autônomo
                  <span className="text-secondary">.</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Descubra <strong className="text-secondary">quanto você pode economizar</strong> migrando de 
                  autônomo para PJ. Nossa calculadora mostra a diferença real entre pagar impostos como 
                  pessoa física (até 27,5% de IR) e como PJ no Simples Nacional (a partir de 6%). 
                  Profissionais da saúde podem economizar <strong>milhares de reais por ano</strong> abrindo uma empresa!
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-3xl" />
                  <div className="relative bg-card rounded-2xl p-8 shadow-card">
                    <Calculator className="h-32 w-32 text-secondary mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card">
                {isCalculating && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4" />
                      <p className="text-lg font-medium">Calculando...</p>
                    </div>
                  </div>
                )}

                <h2 className="text-xl font-semibold text-center mb-8">
                  Informe seus rendimentos atuais como autônomo:
                </h2>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="salario" className="font-medium">
                      Faturamento mensal bruto:
                    </Label>
                    <Input
                      id="salario"
                      type="text"
                      placeholder="R$ 0,00"
                      value={salarioBruto}
                      onChange={(e) => handleInputChange(setSalarioBruto, e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vr" className="font-medium">
                      Vale-refeição/alimentação (opcional):
                    </Label>
                    <Input
                      id="vr"
                      type="text"
                      placeholder="R$ 0,00"
                      value={valeRefeicao}
                      onChange={(e) => handleInputChange(setValeRefeicao, e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vt" className="font-medium">
                      Vale-transporte (opcional):
                    </Label>
                    <Input
                      id="vt"
                      type="text"
                      placeholder="R$ 0,00"
                      value={valeTransporte}
                      onChange={(e) => handleInputChange(setValeTransporte, e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="space-y-2">
                    <Label htmlFor="ps" className="font-medium">
                      Plano de saúde (opcional):
                    </Label>
                    <Input
                      id="ps"
                      type="text"
                      placeholder="R$ 0,00"
                      value={planoSaude}
                      onChange={(e) => handleInputChange(setPlanoSaude, e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outros" className="font-medium flex items-center gap-2">
                      Outros benefícios (opcional):
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Inclua participação nos lucros, bônus, auxílio-creche, etc.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="outros"
                      type="text"
                      placeholder="R$ 0,00"
                      value={outrosBeneficios}
                      onChange={(e) => handleInputChange(setOutrosBeneficios, e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ao utilizar esta ferramenta, você declara estar ciente de que os valores apresentados são apenas estimativas e concorda com a nossa{" "}
                    <Link to="/politica-privacidade" className="text-secondary hover:underline">
                      Política de Privacidade
                    </Link>{" "}
                    e{" "}
                    <Link to="/termos-uso" className="text-secondary hover:underline">
                      Termos de Uso
                    </Link>
                    .
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Para saber mais sobre os critérios utilizados nos cálculos,{" "}
                    <button
                      type="button"
                      className="text-secondary hover:underline"
                      onClick={() => document.getElementById("criterios")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      clique aqui
                    </button>
                    .
                  </p>

                  <Button
                    variant="zen-outline"
                    size="lg"
                    className="w-full md:w-auto min-w-64"
                    onClick={calcular}
                    disabled={!salarioBruto || isCalculating}
                  >
                    VER RESULTADO
                  </Button>
                </div>
              </div>

              {/* Results Section */}
              {resultado && (
                <div className="mt-8 space-y-8 animate-fade-in">
                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl border border-secondary/20 p-6 lg:p-8">
                    {/* Highlight savings banner */}
                    {resultado.economiaMensal > 0 && (
                      <div className="bg-secondary text-secondary-foreground rounded-xl p-4 mb-6 text-center">
                        <p className="text-lg font-bold">
                          🎉 Sendo PJ você economiza {formatCurrency(resultado.economiaMensal)}/mês
                        </p>
                        <p className="text-sm opacity-90">
                          Isso equivale a {formatCurrency(resultado.economiaAnual)} por ano!
                        </p>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-center mb-6">
                      Resultado da Comparação
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Autônomo Box */}
                      <div className="bg-card rounded-xl p-6 border border-border opacity-75">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">Autônomo</h4>
                            <p className="text-sm text-muted-foreground">Pessoa Física</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Faturamento Bruto:</span>
                            <span className="font-medium">{formatCurrency(resultado.salarioBrutoAutonomo)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">INSS (até 14%):</span>
                            <span className="font-medium text-destructive">-{formatCurrency(resultado.inss)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">IRRF (até 27,5%):</span>
                            <span className="font-medium text-destructive">-{formatCurrency(resultado.irrf)}</span>
                          </div>
                          {resultado.beneficiosTotais > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Benefícios informados:</span>
                              <span className="font-medium text-secondary">+{formatCurrency(resultado.beneficiosTotais)}</span>
                            </div>
                          )}
                          <hr className="border-border" />
                          <div className="flex justify-between font-bold">
                            <span>Total Líquido/mês:</span>
                            <span className="text-muted-foreground">{formatCurrency(resultado.totalMensalEquivalenteAutonomo)}</span>
                          </div>
                        </div>
                      </div>

                      {/* PJ Box - Highlighted */}
                      <div className="bg-card rounded-xl p-6 border-2 border-secondary shadow-glow relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            <TrendingUp className="h-3 w-3" />
                            Recomendado
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">PJ</h4>
                            <p className="text-sm text-muted-foreground">Pessoa Jurídica</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mesmo Faturamento:</span>
                            <span className="font-bold text-secondary">{formatCurrency(resultado.faturamentoPJ)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Impostos Simples (~6%):</span>
                            <span className="font-medium text-destructive">-{formatCurrency(resultado.impostosPJ)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">INSS (pró-labore mínimo):</span>
                            <span className="font-medium text-destructive">-{formatCurrency(resultado.inssPJ)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Contabilidade:</span>
                            <span className="font-medium text-destructive">-{formatCurrency(resultado.contabilidade)}</span>
                          </div>
                          {resultado.beneficiosTotais > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Benefícios informados:</span>
                              <span className="font-medium text-secondary">+{formatCurrency(resultado.beneficiosTotais)}</span>
                            </div>
                          )}
                          <hr className="border-border" />
                          <div className="flex justify-between font-bold">
                            <span>Total Líquido PJ:</span>
                            <span className="text-secondary">{formatCurrency(resultado.salarioLiquidoPJ)}</span>
                          </div>
                        </div>

                        {resultado.economiaMensal > 0 && (
                          <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                            <p className="text-sm text-center">
                              Você ganha{" "}
                              <span className="font-bold text-secondary">
                                {resultado.percentualEconomia.toFixed(0)}% a mais
                              </span>{" "}
                              sendo PJ com o mesmo faturamento!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Annual Comparison */}
                    <div className="mt-8 grid md:grid-cols-3 gap-4">
                      <div className="bg-card rounded-xl p-4 text-center border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Total Anual Autônomo</p>
                        <p className="text-xl font-bold text-muted-foreground">{formatCurrency(resultado.totalAnualAutonomo)}</p>
                      </div>
                      <div className="bg-card rounded-xl p-4 text-center border-2 border-secondary">
                        <p className="text-sm text-muted-foreground mb-1">Total Anual PJ</p>
                        <p className="text-xl font-bold text-secondary">{formatCurrency(resultado.totalAnualPJ)}</p>
                      </div>
                      <div className="bg-secondary rounded-xl p-4 text-center">
                        <p className="text-sm text-secondary-foreground/80 mb-1">Sua Economia Anual</p>
                        <p className="text-xl font-bold text-secondary-foreground">+{formatCurrency(resultado.economiaAnual)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lead Capture CTA */}
                  <div className="bg-card rounded-2xl border-2 border-secondary p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-3 text-center">
                      {leadSaved ? "Obrigado! Entraremos em contato." : "Quer uma análise personalizada gratuita?"}
                    </h3>
                    
                    {!leadSaved ? (
                      <>
                        <p className="text-muted-foreground mb-6 text-center">
                          Deixe seus dados e nossos especialistas farão uma análise completa do seu caso.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="space-y-2">
                            <Label htmlFor="nome">Seu nome *</Label>
                            <Input
                              id="nome"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              placeholder="Nome completo"
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">E-mail *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="seu@email.com"
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefone">WhatsApp *</Label>
                            <Input
                              id="telefone"
                              value={telefone}
                              onChange={(e) => setTelefone(formatPhone(e.target.value))}
                              placeholder="(00) 00000-0000"
                              className="bg-background"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <Button variant="zen" size="lg" onClick={handleLeadSubmit}>
                            Quero análise gratuita
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          Em breve um especialista entrará em contato para discutir seu caso.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button variant="zen-outline" size="lg" asChild>
                            <a
                              href={`https://wa.me/5519974158342?text=Olá! Usei a calculadora PJ x Autônomo. Meu faturamento é ${salarioBruto} e gostaria de saber como economizar sendo PJ.`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Falar agora no WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How to Calculate Section */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Por que ser PJ vale a pena<span className="text-secondary">?</span>
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-6">
                  Profissionais autônomos pagam impostos altíssimos como pessoa física (INSS de até 14% + IRRF de até 27,5%). 
                  Ao abrir uma empresa no Simples Nacional, especialmente com o benefício do Fator R, 
                  você pode reduzir drasticamente essa carga tributária:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card rounded-xl p-6 border border-border opacity-75">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      Autônomo (Pessoa Física)
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="text-destructive">✗</span>
                        <span><strong>INSS progressivo:</strong> até 14% do rendimento bruto</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-destructive">✗</span>
                        <span><strong>IRRF progressivo:</strong> até 27,5% sobre o lucro</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-destructive">✗</span>
                        <span><strong>Carnê-leão:</strong> obrigação de pagar mensalmente</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-destructive">✗</span>
                        <span><strong>Menor credibilidade:</strong> clientes preferem NF de empresa</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card rounded-xl p-6 border-2 border-secondary">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-secondary" />
                      PJ (Pessoa Jurídica)
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Impostos reduzidos:</strong> a partir de 6% no Simples Nacional</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Fator R:</strong> profissionais de saúde podem pagar menos ainda</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Nota Fiscal:</strong> mais credibilidade com clientes e convênios</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Conta PJ:</strong> acesso a linhas de crédito melhores</span>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm">
                        💡 Com o <strong>Fator R</strong>, profissionais da saúde podem ter alíquota 
                        inicial de apenas <strong>6%</strong> sobre o faturamento!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/10 rounded-xl p-6 border border-secondary/20">
                  <p className="text-foreground font-medium">
                    ✅ Na prática, profissionais que faturam <strong>R$ 15.000/mês</strong> como autônomo 
                    podem economizar <strong>mais de R$ 2.000/mês</strong> ao migrar para PJ. 
                    Isso representa <strong>mais de R$ 24.000/ano</strong> no seu bolso!
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button variant="zen" size="lg" asChild>
                  <Link to="/abrir-empresa">
                    Quero abrir minha empresa
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Differences Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Vantagens de ser PJ<span className="text-secondary">.</span>
              </h2>

              <p className="text-muted-foreground mb-8">
                Migrar de autônomo para PJ não é apenas sobre economia de impostos. 
                Você ganha mais credibilidade, acesso a melhores oportunidades de negócio 
                e pode escalar seus rendimentos de forma profissional.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold mb-2">Economia Real</h3>
                  <p className="text-sm text-muted-foreground">
                    Pague menos impostos legalmente. Alíquota de 6% vs até 27,5% como autônomo.
                  </p>
                </div>

                <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold mb-2">Nota Fiscal</h3>
                  <p className="text-sm text-muted-foreground">
                    Emita NF para hospitais, clínicas e convênios. Mais credibilidade profissional.
                  </p>
                </div>

                <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold mb-2">Crescimento</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesso a crédito empresarial, conta PJ e possibilidade de contratar funcionários.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-card rounded-xl p-6 border-2 border-secondary">
                <h3 className="font-bold mb-4 text-center">Por que profissionais da saúde escolhem o PJ?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Fator R reduz impostos para serviços de saúde</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Atendimento em múltiplos locais sem restrições</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Flexibilidade para definir sua agenda</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Aposentadoria garantida via pró-labore</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Reinvestimento do dinheiro economizado</span>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Contabilidade especializada cuida de tudo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Information Accordions */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Outras informações importantes<span className="text-secondary">.</span>
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="contratacao" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Como é feita a contratação PJ e CLT?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-secondary">PJ</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Abrir uma empresa (CNPJ)</li>
                          <li>• Contrato de prestação de serviços</li>
                          <li>• Sem registro em carteira</li>
                          <li>• Responsabilidade pelos próprios impostos</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">CLT</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Vínculo empregatício formal</li>
                          <li>• Assinatura da carteira de trabalho</li>
                          <li>• Direitos trabalhistas garantidos</li>
                          <li>• Jornada de 44 horas semanais</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="obrigacoes" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Quais são as principais obrigações?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-secondary">PJ</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Abrir um CNPJ</li>
                          <li>• Contratar escritório de contabilidade</li>
                          <li>• Emitir notas fiscais</li>
                          <li>• Pagar impostos mensalmente</li>
                          <li>• Cumprir o contrato acordado</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">CLT</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Cumprir jornada de trabalho</li>
                          <li>• Obedecer normas internas</li>
                          <li>• Fazer exames médicos periódicos</li>
                          <li>• Não faltar sem justificativa</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="direitos" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Quais são os principais direitos?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-secondary">PJ</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Benefícios previdenciários via pró-labore</li>
                          <li>• Emitir NF para diversos clientes</li>
                          <li>• Liberdade para negociar condições</li>
                          <li>• Autonomia na rotina de trabalho</li>
                          <li>• Pode contratar funcionários</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">CLT</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Férias remuneradas</li>
                          <li>• Adicional por hora extra</li>
                          <li>• Licença-maternidade/paternidade</li>
                          <li>• Seguro-desemprego</li>
                          <li>• 13º salário</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="descontos" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Quais são os descontos?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-secondary">PJ</h4>
                        <p className="text-sm text-muted-foreground">
                          O valor recebido pelos serviços prestados não sofre nenhum desconto legal. 
                          O contratante paga somente o valor combinado em contrato. Porém, o pagamento 
                          dos impostos fica por conta do próprio PJ.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">CLT</h4>
                        <p className="text-sm text-muted-foreground">
                          Os descontos podem ser facultativos (vale-transporte, plano de saúde) ou 
                          obrigatórios por lei (INSS e IRRF), que são abatidos do salário bruto.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Criteria Section */}
        <section id="criterios" className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Critérios utilizados nos cálculos<span className="text-secondary">.</span>
              </h2>

              <div className="bg-card rounded-xl p-6 border border-border">
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Tabelas INSS e IRRF 2024:</strong> utilizamos as tabelas progressivas 
                      atualizadas para cálculo dos descontos CLT
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Simples Nacional com Fator R:</strong> para profissionais de saúde, 
                      aplicamos a alíquota efetiva de ~6% considerando o Fator R
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Pró-labore mínimo:</strong> consideramos 1 salário mínimo como pró-labore 
                      para cálculo do INSS do PJ
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Contabilidade:</strong> utilizamos o valor do plano mais acessível da 
                      Contabilidade Zen (R$ 297,90/mês)
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Estimativas:</strong> os valores apresentados são aproximados e podem 
                      variar conforme situação específica de cada profissional
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Confira nossos planos<span className="text-secondary">.</span>
                </h2>
                <p className="text-muted-foreground">
                  Contabilidade especializada para profissionais da saúde
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {PLANOS_ZEN.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-card rounded-2xl p-6 border-2 ${
                      plan.popular 
                        ? "border-secondary shadow-glow" 
                        : "border-border"
                    } transition-all duration-300 hover:shadow-card`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          <TrendingUp className="h-3 w-3" />
                          Mais Popular
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                    <div className="mb-4">
                      <span className="text-xs text-muted-foreground">A partir de</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-medium">R$</span>
                        <span className="text-3xl font-bold">{plan.price.toFixed(2).replace(".", ",")}</span>
                        <span className="text-muted-foreground text-sm">/mês</span>
                      </div>
                      <p className="text-xs text-secondary mt-1">{plan.ideal}</p>
                    </div>

                    <Button
                      variant={plan.popular ? "zen" : "zen-outline"}
                      className="w-full"
                      asChild
                    >
                      <Link to="/contato">
                        Começar agora
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-6">
              Abrir empresa é com a Contabilidade Zen
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Somos especialistas em contabilidade para profissionais da saúde. 
              Sua empresa fica 100% regularizada pagando o mínimo de impostos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/contato">
                  Abrir minha empresa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a
                  href="https://wa.me/5519974158342"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </TooltipProvider>
  );
}
