import { useState } from "react";
import { SEOHead, ToolPageSEO } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  HelpCircle,
  Star,
  Percent,
  Zap,
  PiggyBank,
  Shield,
  Clock
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Google Reviews Badge Component
function GoogleReviewsBadge() {
  const { data: gmbStats } = useQuery({
    queryKey: ['gmb-stats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('gmb_stats')
        .select('average_rating, total_reviews')
        .order('synced_at', { ascending: false })
        .limit(1)
        .single();
      return data;
    },
  });

  const rating = gmbStats?.average_rating || 5.0;
  const reviews = gmbStats?.total_reviews || 64;

  return (
    <a
      href="https://g.page/r/CSe4RMezF61hEAI/review"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:shadow-card transition-all duration-300 group"
    >
      <div className="flex items-center gap-2">
        <svg className="h-6 w-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-muted'}`}
            />
          ))}
        </div>
      </div>
      <div className="text-sm">
        <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground"> • {reviews} avaliações no Google</span>
      </div>
    </a>
  );
}

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quanto custa abrir uma empresa PJ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Na Contabilidade Zen, a abertura de empresa para profissionais da saúde é gratuita! Você só paga a mensalidade da contabilidade a partir de R$ 297,90/mês. Os únicos custos iniciais são taxas governamentais (aproximadamente R$ 200-400), que variam conforme o estado e município."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto tempo leva para abrir a empresa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O processo completo leva em média 7 a 15 dias úteis, dependendo da prefeitura e do conselho profissional da sua área. CNPJ: 1-3 dias úteis, Inscrição Municipal: 3-7 dias úteis, Alvará de Funcionamento: 3-10 dias úteis."
        }
      },
      {
        "@type": "Question",
        "name": "Quais documentos preciso para abrir uma empresa PJ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Você vai precisar de: RG e CPF, Comprovante de residência atualizado, Registro no conselho profissional (CRM, CRO, CRP, etc.) e Certificado digital."
        }
      },
      {
        "@type": "Question",
        "name": "O que é o Fator R e como me beneficia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Fator R é um cálculo que permite que profissionais de serviços (como médicos, dentistas e psicólogos) paguem impostos muito menores no Simples Nacional. Se a folha de pagamento for igual ou maior que 28% do faturamento, você é tributado pelo Anexo III (a partir de 6%) ao invés do Anexo V (a partir de 15,5%)."
        }
      },
      {
        "@type": "Question",
        "name": "Posso continuar atendendo nos mesmos lugares sendo PJ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Ao abrir sua empresa PJ, você continua atendendo exatamente onde já atende. A diferença é que agora você emite nota fiscal pela sua empresa. Ter CNPJ pode abrir mais portas: muitos hospitais e convênios preferem contratar profissionais PJ."
        }
      },
      {
        "@type": "Question",
        "name": "E a aposentadoria? Como fica o INSS sendo PJ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Você continua contribuindo para o INSS através do pró-labore, que é a retirada mensal obrigatória do sócio. Isso garante todos os benefícios previdenciários: aposentadoria, auxílio-doença, licença-maternidade e pensão por morte."
        }
      },
      {
        "@type": "Question",
        "name": "Preciso de contador? O que a contabilidade faz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, toda empresa precisa de um contador responsável. A contabilidade cuida de: abertura e regularização da empresa, cálculo e pagamento de impostos, emissão de guias, declarações obrigatórias, planejamento tributário e suporte para dúvidas fiscais."
        }
      }
    ]
  };

  return (
    <TooltipProvider>
      <SEOHead
        title="Calculadora PJ x Autônomo | Economize sendo PJ"
        description="Descubra quanto você pode economizar migrando de Autônomo para PJ. Calculadora gratuita mostra a economia real com impostos reduzidos no Simples Nacional."
        keywords="calculadora pj x autonomo, economia pj, simples nacional, abrir empresa, contabilidade para médicos, reduzir impostos"
        canonical="/conteudo/calculadora-pj-clt"
        pageType="tool"
        faqs={[
          { question: "Quanto tempo leva para abrir a empresa?", answer: "O processo completo leva em média 7 a 15 dias úteis." },
          { question: "O que é o Fator R e como me beneficia?", answer: "O Fator R permite que profissionais paguem impostos menores no Simples Nacional se a folha de pagamento for 28% ou mais do faturamento." },
          { question: "Posso continuar atendendo nos mesmos lugares sendo PJ?", answer: "Sim! A diferença é que você emite nota fiscal pela empresa." }
        ]}
      />

      <Header />

      <main id="main-content" className="min-h-screen bg-background">
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

        {/* Hero Section - Same style as GeradorInvoice */}
        <section className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-background py-12 lg:py-20">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Badge className="bg-zen-light-teal text-secondary border-0 px-4 py-1.5">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ferramenta 100% gratuita
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  Calcule sua economia.{" "}
                  <span className="text-gradient whitespace-nowrap">PJ x Autônomo</span> na prática.
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Descubra quanto você pode economizar migrando de autônomo para PJ. 
                  Compare impostos de pessoa física (até 27,5%) com o Simples Nacional (a partir de 6%).
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button 
                    size="xl" 
                    variant="hero"
                    onClick={() => document.getElementById("calculator-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Calcular Economia
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>

                {/* Google Reviews Badge */}
                <GoogleReviewsBadge />
              </motion.div>

              {/* Right Column - Calculator Mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block relative"
              >
                <div className="relative">
                  {/* Decorative blurs */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
                  
                  {/* Calculator Mockup Card */}
                  <div className="relative bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-secondary to-zen-blue p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background/20 rounded-lg flex items-center justify-center">
                          <Calculator className="h-5 w-5 text-background" />
                        </div>
                        <div>
                          <p className="text-background font-bold text-lg">COMPARATIVO</p>
                          <p className="text-background/80 text-sm">PJ x Autônomo</p>
                        </div>
                      </div>
                      <Badge className="bg-background/20 text-background border-0">
                        Economia
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Faturamento */}
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-muted-foreground text-sm">FATURAMENTO MENSAL</span>
                        <span className="font-bold text-lg text-foreground">R$ 15.000,00</span>
                      </div>

                      {/* Comparison */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-destructive/10 rounded-xl text-center">
                          <p className="text-xs text-muted-foreground mb-1">AUTÔNOMO (PF)</p>
                          <p className="text-destructive font-bold text-xl">R$ 3.127</p>
                          <p className="text-xs text-muted-foreground">impostos/mês</p>
                        </div>
                        <div className="p-4 bg-secondary/10 rounded-xl text-center">
                          <p className="text-xs text-muted-foreground mb-1">EMPRESA (PJ)</p>
                          <p className="text-secondary font-bold text-xl">R$ 900</p>
                          <p className="text-xs text-muted-foreground">impostos/mês</p>
                        </div>
                      </div>

                      {/* Savings */}
                      <div className="bg-gradient-to-r from-zen-light-teal to-secondary/10 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-muted-foreground">ECONOMIA MENSAL</p>
                            <p className="text-secondary font-bold text-2xl">R$ 2.227,00</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">ECONOMIA ANUAL</p>
                            <p className="text-secondary font-bold text-2xl">R$ 26.724</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-center pt-2">
                        <p className="text-xs text-muted-foreground">Calculado por</p>
                        <p className="text-secondary font-semibold">Contabilidade Zen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Benefits Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 lg:mt-16"
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 3000,
                    stopOnInteraction: false,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4 justify-center">
                  {[
                    { icon: Percent, title: "Impostos a partir de 6%", subtitle: "vs 27,5% como autônomo" },
                    { icon: PiggyBank, title: "Economia Real", subtitle: "Milhares por ano" },
                    { icon: Zap, title: "Cálculo Instantâneo", subtitle: "Resultado na hora" },
                    { icon: Shield, title: "Fator R Aplicado", subtitle: "Menor tributação" },
                    { icon: CheckCircle, title: "100% Gratuito", subtitle: "Sem cadastro" },
                  ].map((benefit, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                      <div className="bg-card border border-border rounded-xl p-4 text-center h-full">
                        <benefit.icon className="h-8 w-8 text-secondary mx-auto mb-2" />
                        <p className="font-semibold text-sm text-foreground">{benefit.title}</p>
                        <p className="text-xs text-muted-foreground">{benefit.subtitle}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculator-section" className="py-12 lg:py-16">
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

        {/* FAQ Section - Abertura de Empresa PJ */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Dúvidas frequentes sobre abertura de empresa PJ<span className="text-secondary">.</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Tudo o que você precisa saber para migrar de autônomo para PJ e começar a economizar.
              </p>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="quanto-custa" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Quanto custa abrir uma empresa PJ?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Na Contabilidade Zen, a abertura de empresa para profissionais da saúde é <strong className="text-secondary">gratuita</strong>! 
                      Você só paga a mensalidade da contabilidade a partir de R$ 297,90/mês.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Os únicos custos iniciais são taxas governamentais (aproximadamente R$ 200-400), que variam conforme 
                      o estado e município. Nós cuidamos de toda a burocracia para você.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="quanto-tempo" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Quanto tempo leva para abrir a empresa?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      O processo completo leva em média <strong className="text-secondary">7 a 15 dias úteis</strong>, dependendo 
                      da prefeitura e do conselho profissional da sua área.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>CNPJ:</strong> 1-3 dias úteis</li>
                      <li>• <strong>Inscrição Municipal:</strong> 3-7 dias úteis</li>
                      <li>• <strong>Alvará de Funcionamento:</strong> 3-10 dias úteis</li>
                      <li>• <strong>Registro no Conselho:</strong> varia por categoria</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="documentos" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Quais documentos preciso para abrir?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      A documentação é simples. Você vai precisar de:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• RG e CPF</li>
                      <li>• Comprovante de residência atualizado</li>
                      <li>• Registro no conselho profissional (CRM, CRO, CRP, etc.)</li>
                      <li>• Certificado digital (nós orientamos como obter)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Nossa equipe te guia em cada etapa do processo!
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fator-r" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">O que é o Fator R e como me beneficia?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      O Fator R é um cálculo que permite que profissionais de serviços (como médicos, dentistas e psicólogos) 
                      paguem <strong className="text-secondary">impostos muito menores</strong> no Simples Nacional.
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Se a folha de pagamento (pró-labore + funcionários) for igual ou maior que 28% do faturamento, 
                      você é tributado pelo Anexo III (a partir de 6%) ao invés do Anexo V (a partir de 15,5%).
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nós fazemos o planejamento tributário para você sempre pagar o menor imposto possível!
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="posso-continuar" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Posso continuar atendendo nos mesmos lugares?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-secondary">Sim!</strong> Ao abrir sua empresa PJ, você continua atendendo exatamente 
                      onde já atende. A diferença é que agora você emite nota fiscal pela sua empresa.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Na verdade, ter CNPJ pode abrir mais portas: muitos hospitais e convênios preferem 
                      contratar profissionais PJ, e você pode atender em quantos locais quiser.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="aposentadoria" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">E a aposentadoria? Como fica o INSS?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Você continua contribuindo para o INSS através do <strong>pró-labore</strong>, que é a 
                      retirada mensal obrigatória do sócio. Isso garante todos os benefícios previdenciários:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Aposentadoria</li>
                      <li>• Auxílio-doença</li>
                      <li>• Licença-maternidade</li>
                      <li>• Pensão por morte</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      A vantagem é que você pode definir o valor do pró-labore de forma estratégica, 
                      pagando menos INSS que como autônomo.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contabilidade" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Preciso de contador? O que a contabilidade faz?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Sim, toda empresa precisa de um contador responsável. A boa notícia é que a contabilidade 
                      cuida de <strong className="text-secondary">tudo</strong> para você:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Abertura e regularização da empresa</li>
                      <li>• Cálculo e pagamento de impostos</li>
                      <li>• Emissão de guias (DAS, INSS, etc.)</li>
                      <li>• Declarações obrigatórias</li>
                      <li>• Planejamento tributário para pagar menos</li>
                      <li>• Suporte para dúvidas fiscais</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Você foca no que faz de melhor: atender seus pacientes. Nós cuidamos do resto!
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8 text-center">
                <Button variant="zen" size="lg" asChild>
                  <Link to="/abrir-empresa">
                    Quero abrir minha empresa agora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
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
