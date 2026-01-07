import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  ArrowRight, 
  Building, 
  Calculator, 
  FileText, 
  RefreshCw,
  Stethoscope,
  Brain,
  Heart,
  Activity,
  MessageCircle
} from "lucide-react";

const mainServices = [
  {
    icon: Building,
    title: "Abertura de Empresa (CNPJ)",
    description: "Processo 100% digital para obtenção de CNPJ médico, odontológico ou de outras áreas da saúde.",
    features: [
      "Contrato Social (SLU, EIRELI ou LTDA)",
      "Obtenção de CNPJ",
      "Inscrição Municipal",
      "Alvará de funcionamento",
      "Registro em conselhos de classe",
      "Sede virtual gratuita",
    ],
    price: "Gratuito",
    note: "Incluso em todos os planos mensais",
  },
  {
    icon: Calculator,
    title: "Contabilidade Mensal",
    description: "BPO contábil completo com foco em profissionais da saúde e suas particularidades.",
    features: [
      "Cálculo de todos os impostos",
      "Balancetes e DRE mensais",
      "Gestão de pró-labore",
      "Folha de pagamento",
      "Obrigações acessórias",
      "Suporte por WhatsApp",
    ],
    price: "A partir de R$ 297,90/mês",
    note: "Valor varia conforme faturamento",
  },
  {
    icon: RefreshCw,
    title: "Migração de Contabilidade",
    description: "Troca de contador sem dor de cabeça. Cuidamos de todo o processo para você.",
    features: [
      "Contato com contador anterior",
      "Solicitação de documentação",
      "Análise de pendências",
      "Regularização fiscal",
      "Transição sem interrupção",
      "Sem custo adicional",
    ],
    price: "Gratuito",
    note: "Sem multas ou taxas extras",
  },
  {
    icon: FileText,
    title: "Planejamento Tributário",
    description: "Análise personalizada para encontrar o regime tributário mais vantajoso para você.",
    features: [
      "Análise de Simples Nacional",
      "Avaliação de Lucro Presumido",
      "Otimização do Fator R",
      "Equiparação hospitalar",
      "Projeções de economia",
      "Consultoria estratégica",
    ],
    price: "Incluso nos planos",
    note: "Consultoria especializada",
  },
];

const specialties = [
  {
    icon: Stethoscope,
    title: "Médicos",
    description: "Clínicos, especialistas, plantonistas e médicos PJ. Gestão de múltiplos vínculos e DMED.",
    href: "/medicos",
  },
  {
    icon: Heart,
    title: "Dentistas",
    description: "Consultórios odontológicos e clínicas. Gestão de funcionários (ASB) e materiais.",
    href: "/servicos",
  },
  {
    icon: Brain,
    title: "Psicólogos",
    description: "Atendimento presencial e online. Foco em Fator R para menor tributação.",
    href: "/servicos",
  },
  {
    icon: Activity,
    title: "Fisioterapeutas e outros",
    description: "Nutricionistas, enfermeiros e demais profissionais da saúde.",
    href: "/servicos",
  },
];

export default function Servicos() {
  return (
    <>
      <Helmet>
        <title>Serviços de Contabilidade | Contabilidade Zen - Abertura de Empresa, Contabilidade Mensal</title>
        <meta 
          name="description" 
          content="Serviços de contabilidade para profissionais da saúde: abertura de empresa grátis, contabilidade mensal, migração de contabilidade e planejamento tributário. A partir de R$ 297,90/mês." 
        />
        <meta 
          name="keywords" 
          content="serviços contabilidade, abertura de empresa, contabilidade mensal, migração de contabilidade, planejamento tributário, contabilidade saúde" 
        />
        <link rel="canonical" href="https://www.contabilidadezen.com.br/servicos" />
        <meta property="og:title" content="Serviços de Contabilidade | Contabilidade Zen" />
        <meta property="og:description" content="Serviços completos de contabilidade para profissionais da saúde. Abertura de empresa grátis!" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
              Nossos{" "}
              <span className="text-gradient">Serviços</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Soluções completas de contabilidade para profissionais da saúde. 
              Da abertura de empresa à gestão contábil mensal, com foco em economia tributária.
            </p>
            <Button variant="zen" size="xl" asChild>
              <Link to="/contato">
                Falar com Especialista
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Specialties */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
              Atendemos todas as especialidades da saúde
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialties.map((specialty, index) => (
                <Link
                  key={index}
                  to={specialty.href}
                  className="group bg-card rounded-xl p-6 border border-border hover:border-secondary/50 hover:shadow-card transition-all"
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <specialty.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{specialty.title}</h3>
                  <p className="text-sm text-muted-foreground">{specialty.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Serviços principais
              </h2>
              <p className="text-lg text-muted-foreground">
                Tudo que você precisa para ter uma contabilidade eficiente, segura e econômica.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {mainServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-8 border border-border hover:border-secondary/50 hover:shadow-card transition-all"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-7 w-7 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-secondary">{service.price}</p>
                        <p className="text-xs text-muted-foreground">{service.note}</p>
                      </div>
                      <Button variant="zen-outline" size="sm" asChild>
                        <Link to="/contato">
                          Saiba mais
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-zen-teal to-zen-blue">
          <div className="container mx-auto px-4 text-center text-secondary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Agende uma consulta gratuita e descubra como podemos ajudar 
              na gestão contábil do seu consultório ou clínica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link to="/contato">
                  Agendar Consulta Gratuita
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a
                  href="https://wa.me/5519974158342?text=Olá! Gostaria de saber mais sobre os serviços de contabilidade."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </>
  );
}
