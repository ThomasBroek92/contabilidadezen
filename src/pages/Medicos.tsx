import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  ArrowRight, 
  Stethoscope, 
  Clock, 
  Shield, 
  TrendingDown,
  Building2,
  FileCheck,
  Calculator,
  MessageCircle
} from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Redução de até 50% nos impostos",
    description: "Com planejamento tributário adequado, você pode pagar apenas 6% de impostos ao invés de 27,5%.",
  },
  {
    icon: Clock,
    title: "Gestão de múltiplos plantões",
    description: "Centralizamos todos os seus rendimentos em diferentes hospitais e clínicas de forma organizada.",
  },
  {
    icon: FileCheck,
    title: "DMED sempre em dia",
    description: "Cuidamos da declaração DMED e todas as obrigações específicas dos profissionais médicos.",
  },
  {
    icon: Shield,
    title: "Segurança com o CRM",
    description: "Garantimos que sua empresa esteja regularizada junto ao Conselho Regional de Medicina.",
  },
  {
    icon: Building2,
    title: "Abertura de empresa médica",
    description: "Processo 100% digital para você ter seu CNPJ médico em até 15 dias úteis.",
  },
  {
    icon: Calculator,
    title: "Fator R otimizado",
    description: "Monitoramento mensal para garantir que você pague a menor alíquota possível.",
  },
];

const services = [
  "Abertura de empresa médica (SLU, EIRELI, LTDA)",
  "Contabilidade mensal completa",
  "Cálculo de todos os impostos",
  "Declaração de DMED",
  "Gestão de folha de pagamento",
  "Entrega de obrigações acessórias",
  "Planejamento tributário personalizado",
  "Consultoria para médicos plantonistas",
  "Regularização junto ao CRM",
  "Sede virtual gratuita",
];

export default function Medicos() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Stethoscope className="h-4 w-4" />
                  Especialização em Médicos
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
                  Contabilidade especializada para{" "}
                  <span className="text-gradient">médicos</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  Somos especialistas em contabilidade para médicos. Clínicos, especialistas, 
                  plantonistas ou médicos PJ - entendemos sua rotina e suas necessidades específicas.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/contato">
                      Agendar Consulta Gratuita
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="whatsapp" size="xl" asChild>
                    <a
                      href="https://wa.me/5519974158342?text=Olá! Sou médico e gostaria de saber mais sobre contabilidade especializada."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-3xl font-bold text-secondary">200+</span>
                    <p className="text-sm text-muted-foreground">Médicos atendidos</p>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div>
                    <span className="text-3xl font-bold text-secondary">R$ 5M+</span>
                    <p className="text-sm text-muted-foreground">Economia gerada</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                  <h3 className="text-xl font-semibold mb-6 text-foreground">
                    Serviços inclusos para médicos
                  </h3>
                  <ul className="space-y-3">
                    {services.map((service, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{service}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">A partir de</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-foreground">R$</span>
                      <span className="text-4xl font-bold text-foreground">297,90</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Por que médicos escolhem a Contabilidade Zen?
              </h2>
              <p className="text-lg text-muted-foreground">
                Entendemos as particularidades da sua profissão: plantões em múltiplos locais, 
                DMED, CRM e a necessidade de reduzir a carga tributária de forma legal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-secondary/50 hover:shadow-card transition-all"
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Quanto você pode economizar?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-destructive/10 rounded-2xl p-8 border border-destructive/20">
                  <h3 className="text-xl font-semibold mb-4">Pessoa Física (CPF)</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">27,5%</span>
                    <span className="text-primary-foreground/70 ml-2">de imposto</span>
                  </div>
                  <p className="text-primary-foreground/80">
                    Médicos que recebem como pessoa física podem pagar até 27,5% de 
                    Imposto de Renda, além de INSS e outras contribuições.
                  </p>
                </div>

                <div className="bg-secondary/20 rounded-2xl p-8 border border-secondary/30">
                  <h3 className="text-xl font-semibold mb-4">Pessoa Jurídica (CNPJ)</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-secondary">6%</span>
                    <span className="text-primary-foreground/70 ml-2">de imposto</span>
                  </div>
                  <p className="text-primary-foreground/80">
                    Com planejamento tributário e Fator R otimizado, médicos PJ 
                    podem pagar apenas 6% de impostos no Simples Nacional.
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Button 
                  size="xl" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  asChild
                >
                  <Link to="/contato">
                    Quero pagar menos impostos
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Pronto para economizar em impostos?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Agende uma consulta gratuita com nossos especialistas em contabilidade 
              para médicos e descubra quanto você pode economizar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="zen" size="xl" asChild>
                <Link to="/contato">
                  Agendar Consulta Gratuita
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a
                  href="https://wa.me/5519974158342?text=Olá! Sou médico e gostaria de agendar uma consulta gratuita."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Fale pelo WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
