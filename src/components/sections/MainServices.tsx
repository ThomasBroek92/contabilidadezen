import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  FileCheck,
  ArrowLeftRight,
  TrendingUp,
  Calculator,
  Building,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  Gift,
  Building2,
} from "lucide-react";
import { LeadGatedCalculator } from "./LeadGatedCalculator";

const otherServices = [
  {
    icon: TrendingUp,
    title: "Transformar MEI em ME",
    description: "Seu MEI estourou o limite ou precisa contratar funcionários? Regularize sem multas.",
    benefits: [
      "Desenquadramento automático",
      "Escolha do melhor regime",
      "Sem multas por estouro",
    ],
    price: "Consulta grátis",
    cta: "Quero Regularizar",
    href: "/contato",
  },
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    description: "Análise completa da sua situação fiscal com estratégias para reduzir impostos.",
    benefits: [
      "Simulação de cenários",
      "Fator R otimizado",
      "Economia garantida",
    ],
    price: "ROI de 10x+",
    cta: "Calcular Economia",
    href: "/calculadora-pj-clt",
  },
  {
    icon: Building,
    title: "BPO Financeiro",
    description: "Terceirize seu financeiro: contas a pagar, receber e relatórios gerenciais.",
    benefits: [
      "Gestão de contas completa",
      "Conciliação automática",
      "Dashboard em tempo real",
    ],
    price: "Sob consulta",
    cta: "Conhecer Serviço",
    href: "/contato",
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

        {/* Featured Service: Abertura de Empresa */}
        <div className="mb-10">
          <div className="relative bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Mais Popular
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Abertura de Empresa
                </h3>
                <p className="text-white/90 text-lg mb-6">
                  Abra seu CNPJ em até 7 dias úteis com todo suporte para escolher CNAE, 
                  regime tributário e estrutura societária ideais. Comece sua jornada empresarial 
                  com quem entende do assunto.
                </p>
                
                <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    "Análise gratuita de viabilidade",
                    "Registro na Junta Comercial",
                    "Inscrições municipais e estaduais",
                    "Alvará e licenças inclusos",
                    "Suporte especializado",
                    "Processo 100% digital",
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/90">
                      <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-secondary hover:bg-white/90 font-semibold"
                    asChild
                  >
                    <Link to="/abrir-empresa">
                      Abrir Minha Empresa
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <span className="text-white font-bold text-xl">
                    A partir de R$ 0*
                  </span>
                </div>
              </div>
              
              {/* Calculator - Lead Capture */}
              <div className="lg:block space-y-4">
                {/* Virtual Office Highlight */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center shrink-0 animate-pulse">
                    <Gift className="h-6 w-6 text-warning-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-white" />
                      <span className="font-bold text-white">Sede Virtual GRÁTIS!</span>
                    </div>
                    <p className="text-white/80 text-sm">
                      Endereço comercial completo incluído para nossos clientes.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white/60 text-xs line-through">R$ 99/mês</p>
                    <p className="text-white font-bold text-lg">R$ 0</p>
                  </div>
                </div>

                <LeadGatedCalculator source="abertura-empresa-hero" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Feature: Migração de Contabilidade */}
        <div className="mb-10">
          <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 lg:p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <ArrowLeftRight className="h-8 w-8 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">
                    Migração de Contabilidade
                  </h3>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Gratuito
                  </span>
                </div>
                <p className="text-white/90 mb-4 lg:mb-0 max-w-2xl">
                  Troque de contador sem dor de cabeça. Cuidamos de toda burocracia junto ao 
                  seu contador atual. Processo 100% digital, sem interrupção nas obrigações.
                </p>
              </div>
              
              {/* Benefits (hidden on mobile) */}
              <div className="hidden xl:flex items-center gap-4 shrink-0">
                {["100% Digital", "15 dias", "Sem interrupção"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                    <span className="text-white text-sm whitespace-nowrap">{item}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shrink-0"
                asChild
              >
                <Link to="/contato">
                  Migrar Agora
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Other Services Carousel */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center lg:text-left">
            Outros Serviços
          </h3>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {otherServices.map((service, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full bg-card rounded-2xl p-6 border border-border hover:border-secondary/50 hover:shadow-card transition-all duration-300 flex flex-col">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <service.icon className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">{service.title}</h4>
                        <span className="text-sm font-bold text-secondary">
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
                          <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                          <span className="text-foreground/80">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button 
                      variant="zen-outline" 
                      className="w-full mt-auto"
                      asChild
                    >
                      <Link to={service.href}>
                        {service.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-muted" />
            <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-muted" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
