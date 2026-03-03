import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
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
  UserCheck,
  Smile,
  Brain,
} from "lucide-react";
import { StaggerContainer, StaggerItem, HoverLift } from "@/components/ui/scroll-animation";
import profissionaisSaudeBg from "@/assets/01-profissionais-saude-bg.webp";
import dentistasBg from "@/assets/dentistas-bg.webp";
import psicologosBg from "@/assets/psicologos-bg.webp";
import advogadosBg from "@/assets/02-advogados-bg.webp";
import representanteComercialBg from "@/assets/03-representante-comercial-bg.webp";
import produtoresDigitaisBg from "@/assets/04-produtores-digitais-bg.webp";
import profissionaisTiBg from "@/assets/05-profissionais-ti-bg.webp";
import exportacaoServicosBg from "@/assets/06-exportacao-servicos-bg.webp";
import prestadoresServicoBg from "@/assets/07-prestadores-servico-bg.webp";
import profissionaisPjBg from "@/assets/08-profissionais-pj-bg.webp";
import ecommerceBg from "@/assets/09-ecommerce-bg.webp";
import clinicasConsultoriosBg from "@/assets/10-clinicas-consultorios-bg.webp";
import youtubersBg from "@/assets/11-youtubers-creators-bg.webp";
import outrosSegmentosBg from "@/assets/12-outros-segmentos-bg.webp";

const niches = [
  {
    icon: Stethoscope,
    title: "PROFISSIONAIS DA SAÚDE",
    subtitle: "Médicos e Profissionais da Saúde",
    features: [
      "Redução de 27,5% → 6% impostos",
      "Gestão de múltiplos plantões",
      "DMED e obrigações CRM",
      "Fator R otimizado",
    ],
    href: "/segmentos/contabilidade-para-medicos",
    gradient: "from-teal-600 to-teal-500",
    backgroundImage: profissionaisSaudeBg,
  },
  {
    icon: Smile,
    title: "DENTISTAS",
    subtitle: "Dentistas e Clínicas Odontológicas",
    features: [
      "Redução de 27,5% → 6% impostos",
      "Obrigações CRO e DMED",
      "Clínicas e consultórios",
      "Fator R otimizado",
    ],
    href: "/segmentos/contabilidade-para-dentistas",
    gradient: "from-emerald-600 to-emerald-500",
    backgroundImage: dentistasBg,
  },
  {
    icon: Brain,
    title: "PSICÓLOGOS",
    subtitle: "Psicólogos e Terapeutas",
    features: [
      "Redução de 27,5% → 6% impostos",
      "Obrigações CRP e fiscais",
      "Atendimento online e presencial",
      "Fator R otimizado",
    ],
    href: "/segmentos/contabilidade-para-psicologos",
    gradient: "from-purple-600 to-purple-500",
    backgroundImage: psicologosBg,
  },
  {
    icon: Scale,
    title: "ADVOGADOS",
    subtitle: "Escritórios e Advogados Autônomos",
    features: [
      "Simples Nacional vs Lucro Presumido",
      "Sociedade de advogados (OAB)",
    ],
    href: "/contato",
    gradient: "from-slate-800 to-slate-700",
    backgroundImage: advogadosBg,
  },
  {
    icon: Briefcase,
    title: "REPRESENTANTES COMERCIAIS",
    subtitle: "Representação e Vendas",
    features: [
      "Registro no CORE",
      "Múltiplas representadas",
    ],
    href: "/segmentos/contabilidade-para-representantes-comerciais",
    gradient: "from-orange-500 to-orange-400",
    backgroundImage: representanteComercialBg,
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
    gradient: "from-purple-600 to-purple-500",
    backgroundImage: produtoresDigitaisBg,
  },
  {
    icon: Code,
    title: "PROFISSIONAIS DE TI",
    subtitle: "Desenvolvedores e Tech",
    features: [
      "Enquadramento correto",
      "Fator R estratégico",
      "Otimização de pró-labore",
    ],
    href: "/contato",
    gradient: "from-cyan-600 to-cyan-500",
    backgroundImage: profissionaisTiBg,
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
    gradient: "from-blue-600 to-blue-500",
    backgroundImage: exportacaoServicosBg,
  },
  {
    icon: Wrench,
    title: "PRESTADORES DE SERVIÇOS",
    subtitle: "Consultores e Freelancers",
    features: [
      "Enquadramento correto",
      "Fator R estratégico",
      "Otimização de pró-labore",
    ],
    href: "/contato",
    gradient: "from-amber-600 to-amber-500",
    backgroundImage: prestadoresServicoBg,
  },
  {
    icon: UserCheck,
    title: "PROFISSIONAIS PJs",
    subtitle: "Trabalhadores PJ e CLT→PJ",
    features: [
      "Enquadramento correto",
      "Fator R estratégico",
      "Planejamento tributário PJ",
    ],
    href: "/contato",
    gradient: "from-indigo-600 to-indigo-500",
    backgroundImage: profissionaisPjBg,
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
    gradient: "from-pink-600 to-pink-500",
    backgroundImage: ecommerceBg,
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
    gradient: "from-emerald-600 to-emerald-500",
    backgroundImage: clinicasConsultoriosBg,
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
    gradient: "from-red-600 to-red-500",
    backgroundImage: youtubersBg,
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
    gradient: "from-slate-600 to-slate-500",
    backgroundImage: outrosSegmentosBg,
  },
];

export function NichesCarousel() {
  return (
    <section className="py-20 lg:py-28 pb-28 lg:pb-36 bg-background relative z-10 overflow-visible -mt-8 pt-28">
      <div className="container mx-auto px-4 overflow-visible py-4">
        {/* Header */}
        <StaggerContainer className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <StaggerItem type="slide">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              SOLUÇÕES ESPECIALIZADAS POR SEGMENTO
            </span>
          </StaggerItem>
          <StaggerItem type="hybrid">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
              Encontre a contabilidade perfeita{" "}
              <span className="text-gradient">para o seu tipo de negócio</span>
            </h2>
          </StaggerItem>
          <StaggerItem type="slide">
            <p className="text-lg text-muted-foreground">
              Cada profissão tem particularidades únicas. Nossa equipe de especialistas 
              entende as nuances tributárias e fiscais do seu segmento, garantindo 
              máxima economia e conformidade.
            </p>
          </StaggerItem>
        </StaggerContainer>

        {/* Carousel */}
        <StaggerItem type="scale">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {niches.map((niche, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  {/* Removed motion.div with whileInView - using CSS animations */}
                  <div 
                    className="h-full animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <HoverLift className="h-full">
                      <div 
                        className={`group relative h-[420px] rounded-2xl overflow-hidden ${!niche.backgroundImage ? `bg-gradient-to-br ${niche.gradient}` : ''} p-6 flex flex-col justify-between transition-all duration-300`}
                        style={{ isolation: 'isolate' }}
                      >
                        {/* Background Image with Gradient Overlay from bottom */}
                        {niche.backgroundImage && (
                          <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <img 
                              src={niche.backgroundImage} 
                              alt="" 
                              width={665}
                              height={735}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${niche.title === "ADVOGADOS" ? "from-slate-800 via-slate-700/60" : niche.title === "PROFISSIONAIS DA SAÚDE" ? "from-teal-600 via-teal-500/60" : niche.title === "DENTISTAS" ? "from-emerald-600 via-emerald-500/60" : niche.title === "PSICÓLOGOS" ? "from-purple-600 via-purple-500/60" : niche.title === "OUTROS SEGMENTOS" ? "from-slate-600 via-slate-500/60" : niche.title === "YOUTUBERS E CREATORS" ? "from-red-600 via-red-500/60" : niche.title === "CLÍNICAS E CONSULTÓRIOS" ? "from-emerald-600 via-emerald-500/60" : niche.title === "E-COMMERCE" ? "from-pink-600 via-pink-500/60" : niche.title === "PRESTADORES DE SERVIÇOS" ? "from-amber-600 via-amber-500/60" : niche.title === "PROFISSIONAIS PJs" ? "from-indigo-600 via-indigo-500/60" : niche.title === "PRODUTORES DIGITAIS" ? "from-purple-600 via-purple-500/60" : niche.title === "PROFISSIONAIS DE TI" ? "from-cyan-600 via-cyan-500/60" : niche.title === "EXPORTAÇÃO DE SERVIÇOS" ? "from-blue-600 via-blue-500/60" : "from-orange-600 via-orange-500/60"} to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300`} />
                          </div>
                        )}
                        
                        {/* Icon - always at top */}
                        <div className="relative z-10">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <niche.icon className="h-7 w-7 text-white" />
                          </div>
                        </div>

                        {/* Content - at bottom for cards with background image */}
                        <div className="relative z-10">
                          {/* Title */}
                          <h3 className="text-lg font-bold text-white mb-1">{niche.title}</h3>
                          <p className="text-white/80 text-sm mb-4">{niche.subtitle}</p>
                          
                          {/* Features - only show if features exist */}
                          {niche.features.length > 0 && (
                            <ul className="space-y-2 mb-4">
                              {niche.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-white/90 text-sm">
                                  <span className="text-white/60">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* CTA */}
                          <Button 
                            variant="secondary" 
                            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 group-hover:bg-white/30"
                            asChild
                          >
                            <Link to={niche.href}>
                              Saiba mais
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </HoverLift>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-muted" />
            <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-muted" />
            <CarouselDots className="md:hidden" />
          </Carousel>
        </StaggerItem>

        {/* View All CTA */}
        <StaggerItem type="scale" className="text-center mt-12">
          <Button variant="cta-glow" size="lg" asChild>
            <Link to="/contato">
              Fale com um especialista
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </StaggerItem>
      </div>
    </section>
  );
}
