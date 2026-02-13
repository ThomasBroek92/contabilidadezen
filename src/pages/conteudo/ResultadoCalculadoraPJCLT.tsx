import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TrendingUp,
  Briefcase,
  Building2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Calculator,
  DollarSign,
} from "lucide-react";
import { getWhatsAppAnchorProps } from "@/lib/whatsapp";

interface ResultadoState {
  resultado: {
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
    faturamentoPJ: number;
    impostosPJ: number;
    inssPJ: number;
    contabilidade: number;
    salarioLiquidoPJ: number;
    totalAnualPJ: number;
    economiaMensal: number;
    economiaAnual: number;
    percentualEconomia: number;
  };
  nome: string;
  salarioBruto: string;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export default function ResultadoCalculadoraPJCLT() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultadoState | null;

  useEffect(() => {
    if (!state?.resultado) {
      navigate("/conteudo/calculadora-pj-clt", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.resultado) return null;

  const { resultado, nome, salarioBruto } = state;

  const whatsappMessage = `Olá! Meu nome é ${nome}. Fiz a simulação CLT x PJ no site com salário de ${salarioBruto} e vi uma economia potencial de ${formatCurrency(resultado.economiaAnual)}/ano. Gostaria de uma análise personalizada com um contador especialista.`;

  return (
    <>
      <SEOHead
        title="Resultado da Calculadora CLT x PJ | Contabilidade Zen"
        description="Veja o resultado completo da sua comparação CLT x PJ."
        canonical="/conteudo/calculadora-pj-clt/resultado"
        noindex={true}
      />

      <Header />

      <main id="main-content" className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-secondary">Início</Link>
            <span className="mx-2">{">"}</span>
            <Link to="/conteudo/calculadora-pj-clt" className="hover:text-secondary">Calculadora CLT x PJ</Link>
            <span className="mx-2">{">"}</span>
            <span className="text-foreground font-medium">Resultado</span>
          </nav>
        </div>

        {/* Header do resultado */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {nome ? `${nome}, aqui está` : "Aqui está"} seu resultado!
              </h1>
              <p className="text-muted-foreground text-lg">
                Comparação completa entre CLT e PJ com base no salário informado.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Cards de Comparação */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Coluna CLT */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Seu salário CLT</h2>
                      <p className="text-sm text-muted-foreground">Regime atual</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salário Bruto:</span>
                      <span className="font-medium">{formatCurrency(resultado.salarioBrutoCLT)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto INSS:</span>
                      <span className="font-medium text-destructive">-{formatCurrency(resultado.inssCLT)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto IRRF:</span>
                      <span className="font-medium text-destructive">-{formatCurrency(resultado.irrfCLT)}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salário Líquido:</span>
                      <span className="font-medium">{formatCurrency(resultado.salarioLiquidoCLT)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Férias (mensal):</span>
                      <span className="font-medium">+{formatCurrency(resultado.feriasMensal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">13º (mensal):</span>
                      <span className="font-medium">+{formatCurrency(resultado.decimoTerceiroMensal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FGTS (mensal):</span>
                      <span className="font-medium">+{formatCurrency(resultado.fgtsMensal)}</span>
                    </div>
                    {resultado.beneficiosTotais > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Benefícios:</span>
                        <span className="font-medium">+{formatCurrency(resultado.beneficiosTotais)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-4 bg-muted/50 -mx-6 px-6 py-3 rounded-b-2xl">
                      <span>Total Anual CLT:</span>
                      <span>{formatCurrency(resultado.totalAnualCLT)}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna PJ */}
                <div className="bg-card rounded-2xl p-6 border-2 border-secondary shadow-glow relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      <TrendingUp className="h-3 w-3" />
                      Recomendado
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Como PJ você receberia</h2>
                      <p className="text-sm text-muted-foreground">Simples Nacional</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Faturamento Bruto:</span>
                      <span className="font-bold text-secondary">{formatCurrency(resultado.faturamentoPJ)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impostos Simples (~6%):</span>
                      <span className="font-medium text-destructive">-{formatCurrency(resultado.impostosPJ)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">INSS (11% pró-labore):</span>
                      <span className="font-medium text-destructive">-{formatCurrency(resultado.inssPJ)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Contabilidade:</span>
                      <span className="font-medium text-destructive">-{formatCurrency(resultado.contabilidade)}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between font-bold pt-2">
                      <span>Salário Líquido PJ:</span>
                      <span className="text-secondary">{formatCurrency(resultado.salarioLiquidoPJ)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-4 bg-secondary/10 -mx-6 px-6 py-3 rounded-b-2xl">
                      <span>Ganho Anual Total:</span>
                      <span className="text-secondary">{formatCurrency(resultado.totalAnualPJ)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card de Economia */}
              {resultado.economiaMensal > 0 && (
                <div className="bg-gradient-to-r from-secondary to-zen-blue rounded-2xl p-8 text-center text-secondary-foreground">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8" />
                    <h3 className="text-2xl font-bold">Sua Economia como PJ</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-secondary-foreground/80 text-sm mb-1">Economia Anual</p>
                      <p className="text-4xl font-bold">{formatCurrency(resultado.economiaAnual)}</p>
                    </div>
                    <div>
                      <p className="text-secondary-foreground/80 text-sm mb-1">Você ganha a mais</p>
                      <p className="text-4xl font-bold">{resultado.percentualEconomia.toFixed(0)}%</p>
                    </div>
                  </div>
                  <p className="mt-4 text-secondary-foreground/90">
                    Isso equivale a <strong>{formatCurrency(resultado.economiaMensal)}</strong> a mais por mês!
                  </p>
                </div>
              )}

              {/* CTA Principal - WhatsApp */}
              <div className="bg-card rounded-2xl border-2 border-secondary p-6 lg:p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  Quer transformar essa economia em realidade?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Fale agora com um contador especialista da Contabilidade Zen e receba uma análise personalizada do seu caso.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="zen" size="xl" asChild>
                    <a {...getWhatsAppAnchorProps(whatsappMessage)}>
                      Falar com Contador Especialista
                      <MessageCircle className="h-5 w-5 ml-2" />
                    </a>
                  </Button>
                  <Button variant="zen-outline" size="xl" asChild>
                    <Link to="/abrir-empresa">
                      Abrir Minha Empresa
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Observações Importantes */}
              <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border">
                <AccordionItem value="observacoes" className="border-0">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-secondary" />
                      <span className="font-semibold">Observações Importantes</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Cálculo considera <strong>Simples Nacional Anexo III</strong> com Fator R otimizado (alíquota efetiva ~6%)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Como PJ, você pode <strong>deduzir despesas operacionais</strong> (contador, internet, equipamentos, etc.)</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>Benefícios CLT (férias, 13º, FGTS) foram <strong>convertidos para valor mensal equivalente</strong></span>
                      </li>
                      <li className="flex gap-3">
                        <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>Esses valores são <strong>estimativas</strong>. Consulte um contador para análise personalizada do seu caso</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Link para refazer */}
              <div className="text-center">
                <Button variant="ghost" asChild>
                  <Link to="/conteudo/calculadora-pj-clt">
                    <Calculator className="h-4 w-4 mr-2" />
                    Fazer novo cálculo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
