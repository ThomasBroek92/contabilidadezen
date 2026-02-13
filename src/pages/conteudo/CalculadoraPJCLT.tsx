import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Link, useNavigate } from "react-router-dom";
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
  DollarSign,
  Building2,
  Briefcase,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Star,
  Percent,
  Zap,
  PiggyBank,
  Shield,
  Clock,
  MessageCircle,
  Users,
  AlertCircle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { trackFormSubmit } from "@/hooks/use-analytics";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getWhatsAppAnchorProps, getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";

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

// Tabela INSS 2024 (para cálculo CLT)
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
];

interface ResultadoCalculoCLT {
  // CLT
  salarioBrutoCLT: number;
  inssCLT: number;
  irrfCLT: number;
  salarioLiquidoCLT: number;
  feriasMensal: number;
  decimoTerceiroMensal: number;
  fgtsMensal: number;
  beneficiosTotais: number;
  totalMensalCLT: number;
  totalAnualCLT: number;
  
  // PJ
  faturamentoPJ: number;
  impostosPJ: number;
  inssPJ: number;
  contabilidade: number;
  salarioLiquidoPJ: number;
  totalAnualPJ: number;
  
  // Economia
  economiaMensal: number;
  economiaAnual: number;
  percentualEconomia: number;
}

export default function CalculadoraPJCLT() {
  const navigate = useNavigate();
  const [salarioBruto, setSalarioBruto] = useState("");
  const [valeRefeicao, setValeRefeicao] = useState("");
  const [valeTransporte, setValeTransporte] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");
  const [outrosBeneficios, setOutrosBeneficios] = useState("");
  const [resultado, setResultado] = useState<ResultadoCalculoCLT | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formError, setFormError] = useState("");
  
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
    setFormError("");
    const salario = parseCurrency(salarioBruto);
    
    // Validação: salário mínimo R$ 1.412
    if (salario < 1412) {
      setFormError("O salário bruto deve ser no mínimo R$ 1.412,00 (salário mínimo 2024)");
      return;
    }

    setIsCalculating(true);
    
    setTimeout(() => {
      const vr = parseCurrency(valeRefeicao);
      const vt = parseCurrency(valeTransporte);
      const ps = parseCurrency(planoSaude);
      const outros = parseCurrency(outrosBeneficios);

      // Cálculos CLT
      const inssCLT = calcularINSS(salario);
      const irrfCLT = calcularIRRF(salario, inssCLT);
      const salarioLiquidoCLT = salario - inssCLT - irrfCLT;
      
      // Benefícios CLT anualizados (divididos por 12 para mensal equivalente)
      const feriasMensal = (salario / 12) + (salario / 12 * 0.3333); // 1/12 férias + 1/3
      const decimoTerceiroMensal = salario / 12; // 1/12 do 13º
      const fgtsMensal = salario * 0.08; // 8% FGTS
      
      const beneficiosTotais = vr + vt + ps + outros;
      
      // Total mensal CLT = líquido + benefícios trabalhistas mensalizados + benefícios informados
      const totalMensalCLT = salarioLiquidoCLT + feriasMensal + decimoTerceiroMensal + fgtsMensal + beneficiosTotais;
      const totalAnualCLT = totalMensalCLT * 12;

      // Cálculos PJ - comparação justa (mesma base de faturamento)
      // Faturamento PJ = mesmo valor do salário bruto CLT informado
      const faturamentoPJ = salario;
      
      // Simples Nacional com Fator R (alíquota efetiva ~6%)
      const aliquotaSimples = 0.06;
      const proLabore = 1412; // 1 salário mínimo
      const inssPJ = proLabore * 0.11;
      const contabilidade = PLANOS_ZEN[0].price;
      
      const impostosPJ = faturamentoPJ * aliquotaSimples;
      const salarioLiquidoPJ = faturamentoPJ - impostosPJ - inssPJ - contabilidade;
      const totalAnualPJ = salarioLiquidoPJ * 12;

      // Economia ao migrar para PJ
      const economiaMensal = salarioLiquidoPJ - totalMensalCLT;
      const economiaAnual = totalAnualPJ - totalAnualCLT;
      const percentualEconomia = totalMensalCLT > 0 ? ((salarioLiquidoPJ / totalMensalCLT) - 1) * 100 : 0;

      setResultado({
        salarioBrutoCLT: salario,
        inssCLT,
        irrfCLT,
        salarioLiquidoCLT,
        feriasMensal,
        decimoTerceiroMensal,
        fgtsMensal,
        beneficiosTotais,
        totalMensalCLT,
        totalAnualCLT,
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
      
      setShowLeadForm(true);
      setIsCalculating(false);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById("resultado-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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
      segmento: "CLT x PJ",
      fonte: "Calculadora CLT x PJ",
      faturamento_mensal: salario,
      economia_anual: resultado?.economiaAnual,
    });

    if (saved && resultado) {
      // Track form submit
      trackFormSubmit("Calculadora CLT x PJ", {
        segmento: "CLT x PJ",
        fonte: "Calculadora CLT x PJ",
        economia: resultado.economiaAnual,
      });

      // Push GTM event for conversion tracking
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'ver_resultado_calculadora',
        calculator_type: 'CLT x PJ',
        economia_anual: resultado.economiaAnual,
        salario_bruto: salario,
        lead_nome: nome.trim(),
        lead_fonte: 'Calculadora CLT x PJ',
      });

      // Navigate to result page
      navigate("/conteudo/calculadora-pj-clt/resultado", {
        state: {
          resultado,
          nome: nome.trim(),
          salarioBruto,
        },
      });
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "A calculadora CLT x PJ é precisa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, mas os valores são estimativas genéricas. Cada caso é único e pode ter variações conforme município, atividade e regime tributário. Recomendamos consulta com contador para análise personalizada."
        }
      },
      {
        "@type": "Question",
        "name": "Posso ser CLT e PJ ao mesmo tempo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Não há impedimento legal, desde que não haja conflito de interesses com seu empregador CLT. Você pode manter seu emprego formal e ter uma empresa para prestar serviços extras."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto custa abrir um CNPJ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "As taxas variam por cidade (R$ 200 a R$ 800). Na Contabilidade Zen, a abertura é gratuita na contratação de 12 meses de contabilidade. Você só paga as taxas governamentais obrigatórias."
        }
      },
      {
        "@type": "Question",
        "name": "Preciso de contador obrigatoriamente como PJ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, empresas no Simples Nacional são obrigadas por lei a ter contabilidade profissional. O contador cuida de impostos, declarações e garante que sua empresa esteja em dia com o fisco."
        }
      }
    ]
  };

  return (
    <TooltipProvider>
      <SEOHead
        title="Calculadora CLT x PJ | Compare e Economize"
        description="Descubra quanto você pode ganhar a mais como PJ comparado ao CLT. Calculadora gratuita compara salário líquido, impostos e benefícios. Simule agora!"
        keywords="calculadora clt pj, clt x pj, quanto ganha pj, vale a pena ser pj, comparar clt pj, simples nacional"
        canonical="/conteudo/calculadora-pj-clt"
        pageType="tool"
        faqs={[
          { question: "A calculadora CLT x PJ é precisa?", answer: "Sim, mas os valores são estimativas. Recomendamos consulta com contador para análise personalizada." },
          { question: "Posso ser CLT e PJ ao mesmo tempo?", answer: "Sim! Não há impedimento legal, desde que não haja conflito de interesses." },
          { question: "Quanto custa abrir um CNPJ?", answer: "Taxas variam de R$ 200 a R$ 800. Na Contabilidade Zen, a abertura é gratuita na contratação de 12 meses." }
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
            <span className="text-foreground font-medium">Calculadora CLT x PJ</span>
          </nav>
        </div>

        {/* ========== SEÇÃO 1 - HERO (MANTIDO) ========== */}
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
                  <span className="text-gradient whitespace-nowrap">CLT x PJ</span> na prática.
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Descubra quanto você pode ganhar a mais como PJ comparado ao regime CLT. 
                  Compare impostos, benefícios e veja a economia real.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button 
                    size="xl" 
                    variant="hero"
                    onClick={() => document.getElementById("calculator-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Calcular Minha Economia
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
                          <p className="text-background/80 text-sm">CLT x PJ</p>
                        </div>
                      </div>
                      <Badge className="bg-background/20 text-background border-0">
                        Economia
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Salário */}
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <span className="text-muted-foreground text-sm">SALÁRIO BRUTO CLT</span>
                        <span className="font-bold text-lg text-foreground">R$ 10.000,00</span>
                      </div>

                      {/* Comparison */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-xl text-center">
                          <p className="text-xs text-muted-foreground mb-1">LÍQUIDO CLT</p>
                          <p className="text-muted-foreground font-bold text-xl">R$ 7.680</p>
                          <p className="text-xs text-muted-foreground">mensal equivalente</p>
                        </div>
                        <div className="p-4 bg-secondary/10 rounded-xl text-center">
                          <p className="text-xs text-muted-foreground mb-1">LÍQUIDO PJ</p>
                          <p className="text-secondary font-bold text-xl">R$ 12.760</p>
                          <p className="text-xs text-muted-foreground">mensal</p>
                        </div>
                      </div>

                      {/* Savings */}
                      <div className="bg-gradient-to-r from-zen-light-teal to-secondary/10 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-muted-foreground">ECONOMIA MENSAL</p>
                            <p className="text-secondary font-bold text-2xl">R$ 5.080</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">ECONOMIA ANUAL</p>
                            <p className="text-secondary font-bold text-2xl">R$ 60.960</p>
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
                    { icon: Percent, title: "Impostos a partir de 6%", subtitle: "vs 27,5% como CLT" },
                    { icon: PiggyBank, title: "Economia Real", subtitle: "Milhares por ano" },
                    { icon: Zap, title: "Cálculo Instantâneo", subtitle: "Resultado na hora" },
                    { icon: Shield, title: "Suporte Especializado", subtitle: "Contadores dedicados" },
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

        {/* ========== SEÇÃO 2 - FORMULÁRIO INTERATIVO ========== */}
        <section id="calculator-section" className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card relative">
                {isCalculating && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4" />
                      <p className="text-lg font-medium">Calculando...</p>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Preencha com seus dados CLT</h2>
                  <p className="text-muted-foreground">Informe seu salário e benefícios atuais para ver a comparação</p>
                </div>

                <div className="space-y-6">
                  {/* Salário Bruto - Campo Principal */}
                  <div className="space-y-2">
                    <Label htmlFor="salario" className="font-semibold text-base flex items-center gap-2">
                      Salário Bruto Mensal (CLT) *
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Valor antes dos descontos de INSS e IRRF</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="salario"
                      type="text"
                      placeholder="R$ 0,00"
                      value={salarioBruto}
                      onChange={(e) => handleInputChange(setSalarioBruto, e.target.value)}
                      className={`bg-background h-12 text-lg ${formError ? 'border-destructive' : ''}`}
                    />
                    {formError && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formError}
                      </p>
                    )}
                  </div>

                  {/* Benefícios - Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vr" className="font-medium">
                        Vale Refeição/Alimentação
                        <span className="text-muted-foreground text-sm ml-1">(opcional)</span>
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
                        Vale Transporte
                        <span className="text-muted-foreground text-sm ml-1">(opcional)</span>
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
                    <div className="space-y-2">
                      <Label htmlFor="ps" className="font-medium">
                        Plano de Saúde
                        <span className="text-muted-foreground text-sm ml-1">(opcional)</span>
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
                      <Label htmlFor="outros" className="font-medium flex items-center gap-1">
                        Outros Benefícios
                        <span className="text-muted-foreground text-sm">(opcional)</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>PLR, bônus, auxílio-creche, etc.</p>
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

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button
                      variant="zen"
                      size="xl"
                      className="w-full"
                      onClick={calcular}
                      disabled={!salarioBruto || isCalculating}
                    >
                      Calcular Minha Economia
                      <Calculator className="h-5 w-5 ml-2" />
                    </Button>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-muted-foreground text-center">
                    Ao clicar, você concorda com nossa{" "}
                    <Link to="/politica-privacidade" className="text-secondary hover:underline">
                      Política de Privacidade
                    </Link>{" "}
                    e{" "}
                    <Link to="/termos-uso" className="text-secondary hover:underline">
                      Termos de Uso
                    </Link>
                    . Esta ferramenta é para consultas genéricas e não dispensa avaliação contábil profissional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SEÇÃO 2.5 - LEAD CAPTURE FORM ========== */}
        {showLeadForm && !leadSaved && (
          <section id="resultado-section" className="py-12 lg:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-card"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Seu cálculo está pronto!</h2>
                    <p className="text-muted-foreground">
                      Preencha seus dados para ver o resultado completo e receber uma análise personalizada do nosso time.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead-nome" className="font-medium">Nome completo *</Label>
                      <Input
                        id="lead-nome"
                        type="text"
                        placeholder="Seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="bg-background h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lead-email" className="font-medium">E-mail *</Label>
                      <Input
                        id="lead-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lead-telefone" className="font-medium">WhatsApp *</Label>
                      <Input
                        id="lead-telefone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(formatPhone(e.target.value))}
                        className="bg-background h-12"
                      />
                    </div>

                    <Button
                      variant="zen"
                      size="xl"
                      className="w-full mt-4"
                      onClick={handleLeadSubmit}
                    >
                      Ver Meu Resultado
                    </Button>

                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Ao continuar, você concorda com nossa{" "}
                      <Link to="/politica-privacidade" className="text-secondary hover:underline">
                        Política de Privacidade
                      </Link>
                      . Seus dados estão protegidos.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}




        {/* ========== SEÇÃO 4 - CONTEÚDO EDUCATIVO (TABS) ========== */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Como calcular seu salário PJ ideal<span className="text-secondary">?</span>
              </h2>

              <Tabs defaultValue="clt" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="clt" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="hidden sm:inline">Entendendo o CLT</span>
                    <span className="sm:hidden">CLT</span>
                  </TabsTrigger>
                  <TabsTrigger value="pj" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span className="hidden sm:inline">Calculando o PJ</span>
                    <span className="sm:hidden">PJ</span>
                  </TabsTrigger>
                  <TabsTrigger value="diferencas" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Principais Diferenças</span>
                    <span className="sm:hidden">Diferenças</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="clt" className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold">Composição do Salário CLT</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Salário Líquido CLT</p>
                        <p className="text-sm text-muted-foreground">Salário bruto menos INSS (até 14%) e IRRF (até 27,5%)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">+ 1/12 de Férias + 33,33% (terço constitucional)</p>
                        <p className="text-sm text-muted-foreground">Direito a 30 dias de férias remuneradas por ano</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">+ 1/12 do 13º Salário</p>
                        <p className="text-sm text-muted-foreground">Salário extra pago em novembro/dezembro</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">+ 8% de FGTS sobre salário bruto</p>
                        <p className="text-sm text-muted-foreground">Depositado mensalmente pela empresa</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">+ Benefícios (VR, VT, plano de saúde)</p>
                        <p className="text-sm text-muted-foreground">Valores adicionais oferecidos pela empresa</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                      <span className="text-xl font-bold text-secondary">=</span>
                      <div>
                        <p className="font-bold text-secondary">Total Anual CLT</p>
                        <p className="text-sm text-muted-foreground">Some tudo para ter o valor real anual</p>
                      </div>
                    </li>
                  </ul>
                </TabsContent>

                <TabsContent value="pj" className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold">Composição do Salário PJ</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Faturamento Bruto Mensal</p>
                        <p className="text-sm text-muted-foreground">Valor total que você recebe do cliente por nota fiscal</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-3 bg-destructive/10 rounded-lg">
                      <span className="text-destructive font-bold">-</span>
                      <div>
                        <p className="font-medium">Impostos (6% a 33% conforme regime)</p>
                        <p className="text-sm text-muted-foreground">No Simples Nacional com Fator R: a partir de 6%</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-3 bg-destructive/10 rounded-lg">
                      <span className="text-destructive font-bold">-</span>
                      <div>
                        <p className="font-medium">INSS (11% sobre pró-labore)</p>
                        <p className="text-sm text-muted-foreground">Garante aposentadoria e benefícios previdenciários</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-3 bg-destructive/10 rounded-lg">
                      <span className="text-destructive font-bold">-</span>
                      <div>
                        <p className="font-medium">Custos Operacionais</p>
                        <p className="text-sm text-muted-foreground">Contabilidade, certificado digital, software, etc.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                      <span className="text-xl font-bold text-secondary">=</span>
                      <div>
                        <p className="font-bold text-secondary">Líquido PJ Mensal</p>
                        <p className="text-sm text-muted-foreground">O que sobra no seu bolso todo mês</p>
                      </div>
                    </li>
                  </ul>
                </TabsContent>

                <TabsContent value="diferencas" className="bg-card rounded-2xl border border-border p-6 overflow-x-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold">Comparativo CLT x PJ</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Aspecto</TableHead>
                        <TableHead>CLT</TableHead>
                        <TableHead>PJ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Vínculo</TableCell>
                        <TableCell>Empregatício (carteira assinada)</TableCell>
                        <TableCell>Contrato de prestação de serviço</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Férias</TableCell>
                        <TableCell>30 dias remunerados + 1/3</TableCell>
                        <TableCell>Conforme contrato (sem obrigatoriedade)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">13º Salário</TableCell>
                        <TableCell>Obrigatório</TableCell>
                        <TableCell>Não possui</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">FGTS</TableCell>
                        <TableCell>8% mensal depositado</TableCell>
                        <TableCell>Não possui</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Jornada</TableCell>
                        <TableCell>Fixa (44h semanais)</TableCell>
                        <TableCell>Flexível (acordo contratual)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Impostos</TableCell>
                        <TableCell>IRPF até 27,5% + INSS até 14%</TableCell>
                        <TableCell>Simples 6-33% ou outros regimes</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rescisão</TableCell>
                        <TableCell>Multa 40% FGTS + aviso prévio</TableCell>
                        <TableCell>Conforme contrato</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* ========== SEÇÃO 5 - CTA CONVERSÃO PRINCIPAL ========== */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-secondary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Quer pagar menos impostos de forma 100% legal<span className="text-secondary">?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Abra sua empresa em até 7 dias com a Contabilidade Zen
              </p>

              {/* 3 Colunas de Benefícios */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-card rounded-xl p-6 border border-border text-center">
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="font-bold mb-2">Planejamento Tributário</h3>
                  <p className="text-sm text-muted-foreground">
                    Análise personalizada para pagar o mínimo de impostos legalmente
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border text-center">
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="font-bold mb-2">Processo Simplificado</h3>
                  <p className="text-sm text-muted-foreground">
                    Abertura de empresa em até 7 dias úteis com suporte completo
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border text-center">
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="font-bold mb-2">Suporte via WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">
                    Atendimento humanizado sempre que você precisar
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="zen" size="xl" asChild>
                  <Link to="/abrir-empresa">
                    Abrir Minha Empresa
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="zen-outline" size="xl" asChild>
                  <a {...getWhatsAppAnchorPropsByKey("calculadoraCLTPJ")}>
                    Falar com Especialista
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SEÇÃO 6 - OBRIGAÇÕES PJ VS CLT (ACCORDION) ========== */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                O que você precisa saber antes de decidir<span className="text-secondary">.</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Entenda as obrigações de cada regime para tomar a melhor decisão.
              </p>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="pj" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Obrigações como PJ</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Abrir um CNPJ (com ajuda do contador)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Contratar contabilidade especializada</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Emitir notas fiscais mensalmente</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Pagar impostos (DAS, guias)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Cumprir acordo contratual com clientes</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="clt" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Obrigações como CLT</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Cumprir jornada de trabalho (44h semanais)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Exclusividade ao empregador (salvo exceções)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Exames admissional/demissional obrigatórios</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Justificar faltas e atrasos</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Seguir normas internas da empresa</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="quando-pj" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Quando vale a pena ser PJ?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Faturamento mensal superior a R$ 3.000</strong> - quanto maior, mais economia</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Autonomia para negociar valores</strong> - você define seu preço</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Múltiplos clientes/projetos</strong> - diversificar renda</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Não depende de estabilidade CLT</strong> - aceita riscos do empreendedorismo</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span><strong>Quer flexibilidade de horários</strong> - trabalhar quando e onde quiser</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* ========== SEÇÃO 7 - FAQ RÁPIDO ========== */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Dúvidas frequentes<span className="text-secondary">.</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Respostas rápidas para as principais dúvidas sobre CLT x PJ.
              </p>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="faq-1" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-left">A calculadora é precisa?</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                    Sim, mas os valores são estimativas genéricas. Cada caso é único e pode ter variações 
                    conforme município, atividade e regime tributário. Recomendamos consulta com contador 
                    para análise personalizada do seu caso.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-left">Posso ser CLT e PJ ao mesmo tempo?</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                    Sim! Não há impedimento legal, desde que não haja conflito de interesses com seu 
                    empregador CLT. Você pode manter seu emprego formal e ter uma empresa para prestar 
                    serviços extras a outros clientes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-left">Quanto custa abrir um CNPJ?</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                    As taxas variam por cidade (R$ 200 a R$ 800). Na Contabilidade Zen, a abertura é 
                    gratuita na contratação de 12 meses de contabilidade. Você só paga as taxas 
                    governamentais obrigatórias (Junta Comercial, Prefeitura, etc.).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="bg-card rounded-xl border border-border px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold text-left">Preciso de contador obrigatoriamente como PJ?</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                    Sim, empresas no Simples Nacional são obrigadas por lei a ter contabilidade profissional. 
                    O contador cuida de impostos, declarações, folha de pagamento e garante que sua empresa 
                    esteja em dia com o fisco. Na Contabilidade Zen, planos a partir de R$ 297,90/mês.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Schema FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </main>

      <Footer />
    </TooltipProvider>
  );
}
