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
  Stethoscope,
  Scale,
  Briefcase,
  Play,
  Code,
  Store,
  Globe,
  Wrench,
  ShoppingCart,
  Building2,
  Video,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

const niches = [
  {
    icon: Stethoscope,
    title: "PROFISSIONAIS DA SAÚDE",
    subtitle: "Médicos, Dentistas e Psicólogos",
    features: [
      "Redução de 27,5% → 6% impostos",
      "Gestão de múltiplos plantões",
      "DMED e obrigações CRM/CRO/CRP",
      "Fator R otimizado",
    ],
    href: "/medicos",
    gradient: "from-secondary to-secondary/70",
  },
  {
    icon: Scale,
    title: "ADVOGADOS",
    subtitle: "Escritórios e Advogados Autônomos",
    features: [
      "Simples Nacional vs Lucro Presumido",
      "Sociedade de advogados (OAB)",
      "Gestão de honorários",
      "Planejamento sucessório",
    ],
    href: "/contato",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Briefcase,
    title: "REPRESENTANTES COMERCIAIS",
    subtitle: "Representação e Vendas",
    features: [
      "Registro no CORE",
      "Múltiplas representadas",
      "Comissões e reembolsos",
      "Lucro Presumido otimizado",
    ],
    href: "/contato",
    gradient: "from-emerald-600 to-emerald-600/70",
  },
  {
    icon: Play,
    title: "PRODUTORES DIGITAIS",
    subtitle: "Infoprodutores e Afiliados",
    features: [
      "Hotmart, Eduzz, Monetizze",
      "Nota fiscal automática",
      "Anexo III ou V do Simples",
      "Faturamento internacional",
    ],
    href: "/contato",
    gradient: "from-violet-600 to-violet-600/70",
  },
  {
    icon: Code,
    title: "PROFISSIONAIS DE TI",
    subtitle: "Desenvolvedores e Tech",
    features: [
      "PJ para empresas brasileiras",
      "Exportação de software",
      "Regime de caixa ou competência",
      "Startup e investimentos",
    ],
    href: "/contato",
    gradient: "from-cyan-600 to-cyan-600/70",
  },
  {
    icon: Store,
    title: "FRANQUIAS",
    subtitle: "Franqueados e Franqueadores",
    features: [
      "Controle de royalties",
      "Múltiplas unidades",
      "Fundo de marketing",
      "Análise de viabilidade",
    ],
    href: "/contato",
    gradient: "from-orange-500 to-orange-500/70",
  },
  {
    icon: Globe,
    title: "EXPORTAÇÃO DE SERVIÇOS",
    subtitle: "Serviços Internacionais",
    features: [
      "Isenção de impostos (LC 116)",
      "Remessa ao exterior",
      "Contratos internacionais",
      "Câmbio e compliance",
    ],
    href: "/contato",
    gradient: "from-blue-500 to-blue-500/70",
  },
  {
    icon: Wrench,
    title: "PRESTADORES DE SERVIÇOS",
    subtitle: "Consultores e Freelancers",
    features: [
      "Enquadramento correto (Anexo III/V)",
      "Fator R estratégico",
      "MEI, ME ou EPP",
      "Otimização de pró-labore",
    ],
    href: "/contato",
    gradient: "from-emerald-700 to-emerald-700/70",
  },
  {
    icon: ShoppingCart,
    title: "E-COMMERCE",
    subtitle: "Lojas Online e Marketplaces",
    features: [
      "Mercado Livre, Shopee, Amazon",
      "Estoque e CMV",
      "Dropshipping nacional/internacional",
      "Substituição tributária",
    ],
    href: "/contato",
    gradient: "from-pink-500 to-pink-500/70",
  },
  {
    icon: Building2,
    title: "CLÍNICAS E CONSULTÓRIOS",
    subtitle: "Estabelecimentos de Saúde",
    features: [
      "Equiparação hospitalar",
      "Folha de pagamento completa",
      "Gestão de convênios",
      "Sociedade médica",
    ],
    href: "/contato",
    gradient: "from-teal-500 to-teal-500/70",
  },
  {
    icon: Video,
    title: "YOUTUBERS E CREATORS",
    subtitle: "Criadores de Conteúdo",
    features: [
      "AdSense e monetização",
      "Contratos com marcas",
      "Pessoa física vs PJ",
      "Direitos autorais",
    ],
    href: "/contato",
    gradient: "from-red-500 to-red-500/70",
  },
  {
    icon: LayoutGrid,
    title: "OUTROS SEGMENTOS",
    subtitle: "Veja mais especialidades",
    features: [
      "Arquitetos e Engenheiros",
      "Designers e Publicitários",
      "Coaches e Mentores",
      "Fotógrafos e Videomakers",
    ],
    href: "/contato",
    gradient: "from-gray-600 to-gray-600/70",
  },
];

export function NichesCarousel() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            SOLUÇÕES ESPECIALIZADAS POR SEGMENTO
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            Encontre a contabilidade perfeita{" "}
            <span className="text-gradient">para o seu tipo de negócio</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cada profissão tem particularidades únicas. Nossa equipe de especialistas 
            entende as nuances tributárias e fiscais do seu segmento, garantindo 
            máxima economia e conformidade.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {niches.map((niche, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="h-full">
                  <div 
                    className={`group relative h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br ${niche.gradient} p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                  >
                    {/* Icon */}
                    <div>
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                        <niche.icon className="h-7 w-7 text-white" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-1">{niche.title}</h3>
                      <p className="text-white/80 text-sm mb-4">{niche.subtitle}</p>
                      
                      {/* Features */}
                      <ul className="space-y-2">
                        {niche.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                            <span className="text-white/60">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Button 
                      variant="secondary" 
                      className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/20"
                      asChild
                    >
                      <Link to={niche.href}>
                        Saiba mais
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-muted" />
          <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-muted" />
        </Carousel>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button variant="zen-outline" size="lg" asChild>
            <Link to="/servicos">
              Ver todos os segmentos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
