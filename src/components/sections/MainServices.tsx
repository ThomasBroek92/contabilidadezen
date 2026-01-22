import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  ArrowLeftRight,
  TrendingUp,
  Calculator,
  Building,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: FileCheck,
    title: "Abertura de Empresa",
    description: "Abra seu CNPJ em até 7 dias úteis com todo suporte para escolher CNAE, regime tributário e estrutura societária ideais.",
    benefits: [
      "Análise gratuita de viabilidade",
      "Registro na Junta Comercial",
      "Inscrições municipais e estaduais",
      "Alvará e licenças",
    ],
    price: "A partir de R$ 0*",
    cta: "Abrir Minha Empresa",
    href: "/abrir-empresa",
    color: "secondary",
  },
  {
    icon: ArrowLeftRight,
    title: "Migração de Contabilidade",
    description: "Troque de contador sem dor de cabeça. Cuidamos de toda burocracia junto ao seu contador atual.",
    benefits: [
      "Processo 100% digital",
      "Sem interrupção nas obrigações",
      "Análise de pendências",
      "Migração em até 15 dias",
    ],
    price: "Gratuito",
    cta: "Migrar Agora",
    href: "/contato",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Transformar MEI em ME",
    description: "Seu MEI estourou o limite ou precisa contratar funcionários? Regularize sem multas e sem complicação.",
    benefits: [
      "Desenquadramento automático",
      "Escolha do melhor regime",
      "Sem multas por estouro",
      "Manutenção dos benefícios",
    ],
    price: "Consulta grátis",
    cta: "Quero Regularizar",
    href: "/contato",
    color: "accent",
  },
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    description: "Análise completa da sua situação fiscal atual com estratégias legais para reduzir impostos em até 50%.",
    benefits: [
      "Simulação de cenários",
      "Fator R otimizado",
      "Comparação Simples/Presumido/Real",
      "Economia garantida",
    ],
    price: "ROI de 10x+",
    cta: "Calcular Economia",
    href: "/calculadora-pj-clt",
    color: "secondary",
  },
  {
    icon: Building,
    title: "BPO Financeiro",
    description: "Terceirize todo seu financeiro: contas a pagar, a receber, conciliação bancária e relatórios gerenciais.",
    benefits: [
      "Gestão de contas completa",
      "Conciliação automática",
      "Relatórios mensais",
      "Dashboard em tempo real",
    ],
    price: "Sob consulta",
    cta: "Conhecer Serviço",
    href: "/contato",
    color: "primary",
  },
];

export function MainServices() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            NOSSOS SERVIÇOS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            Serviços que resolvem{" "}
            <span className="text-gradient">seus problemas fiscais</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Do início ao crescimento do seu negócio, oferecemos soluções completas 
            para você focar no que realmente importa.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-secondary/50 hover:shadow-card transition-all duration-300 flex flex-col"
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  service.color === "secondary" 
                    ? "bg-secondary/10" 
                    : service.color === "accent"
                    ? "bg-accent/10"
                    : "bg-primary/10"
                }`}>
                  <service.icon className={`h-6 w-6 ${
                    service.color === "secondary" 
                      ? "text-secondary" 
                      : service.color === "accent"
                      ? "text-accent"
                      : "text-primary"
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                  <span className={`text-sm font-bold ${
                    service.color === "secondary" 
                      ? "text-secondary" 
                      : service.color === "accent"
                      ? "text-accent"
                      : "text-primary"
                  }`}>
                    {service.price}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4 flex-grow">
                {service.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 flex-shrink-0 ${
                      service.color === "secondary" 
                        ? "text-secondary" 
                        : service.color === "accent"
                        ? "text-accent"
                        : "text-primary"
                    }`} />
                    <span className="text-foreground/80">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button 
                variant="zen-outline" 
                className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground mt-auto"
                asChild
              >
                <Link to={service.href}>
                  {service.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
