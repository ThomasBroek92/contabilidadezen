import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Building2,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Contabilidade para Médicos",
    description: "Especialização em todas as modalidades: clínicos, especialistas, plantonistas e médicos PJ.",
    features: [
      "Redução de carga tributária (até 50%)",
      "Gestão de múltiplos plantões",
      "Declaração de DMED",
      "Abertura de empresa médica",
    ],
    href: "/medicos",
    color: "secondary",
  },
  {
    icon: Heart,
    title: "Contabilidade para Dentistas",
    description: "Soluções completas para dentistas autônomos, clínicas odontológicas e consultórios.",
    features: [
      "Controle de custos com materiais",
      "Folha de pagamento (ASB)",
      "Gestão financeira da clínica",
      "Planejamento tributário",
    ],
    href: "/segmentos/contabilidade-para-dentistas",
    color: "accent",
  },
  {
    icon: Brain,
    title: "Contabilidade para Psicólogos",
    description: "Atendimento especializado para psicólogos, terapeutas e profissionais de saúde mental.",
    features: [
      "Análise Autônomo vs PJ",
      "Fator R otimizado (6% de imposto)",
      "Atendimento presencial e online",
      "Simplicidade tributária",
    ],
    href: "/segmentos/contabilidade-para-psicologos",
    color: "secondary",
  },
  {
    icon: Building2,
    title: "Clínicas e Consultórios",
    description: "Gestão contábil completa para clínicas médicas, laboratórios e centros de saúde.",
    features: [
      "Equiparação hospitalar",
      "Gestão de convênios",
      "Folha de pagamento completa",
      "Relatórios gerenciais",
    ],
    href: "/contato",
    color: "accent",
  },
];

export function Services() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Nossos Serviços
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            Soluções para cada{" "}
            <span className="text-gradient">profissional da saúde</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos serviços especializados para cada perfil de profissional, 
            com conhecimento profundo das particularidades de cada área.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-secondary/50 hover:shadow-card transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  service.color === "secondary" ? "bg-secondary/10" : "bg-accent/10"
                }`}>
                  <service.icon className={`h-7 w-7 ${
                    service.color === "secondary" ? "text-secondary" : "text-accent"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-2 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className={`h-5 w-5 flex-shrink-0 ${
                      service.color === "secondary" ? "text-secondary" : "text-accent"
                    }`} />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={service.color === "secondary" ? "zen-outline" : "outline"} 
                className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground"
                asChild
              >
                <Link to={service.href}>
                  Saiba mais
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="zen" size="lg" asChild>
            <Link to="/contato">
              Fale com um especialista
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
