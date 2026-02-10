import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Shield, 
  MapPin, 
  Zap, 
  BadgeCheck,
  Calculator,
  MessageCircle,
  Users,
  Award,
  Star
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
const heroFounder = "/images/hero-founder.webp";
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const benefitCards = [
  {
    icon: Shield,
    title: "Planejamento Tributário Legal",
    description: "Reduza impostos dentro da lei",
  },
  {
    icon: MapPin,
    title: "Sede Virtual Gratuita",
    description: "Consulte disponibilidade",
  },
  {
    icon: Zap,
    title: "Atendimento Ágil",
    description: "Suporte por WhatsApp",
  },
  {
    icon: BadgeCheck,
    title: "Garantia de 30 Dias",
    description: "Satisfação garantida",
  },
];

const stats = [
  { icon: Users, value: "100+", label: "Clientes Ativos" },
  { icon: Award, value: "10+", label: "Anos no Mercado" },
  { icon: Star, value: "4.9⭐", label: "Avaliação Google" },
];

export function HeroMultiNiche() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/50 overflow-visible pb-12">
      {/* Background pattern - Static on mobile/reduced motion */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content - Left Side */}
          <StaggerContainer className="space-y-8" staggerDelay={0.15}>
            {/* Badge - CSS animation instead of Framer Motion infinite */}
            <StaggerItem type="slide">
              <div 
                className={`inline-flex items-center gap-2 bg-secondary/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-secondary/20 text-foreground ${!reduceMotion ? 'animate-pulse-ring' : ''}`}
              >
                <span className={`w-2 h-2 bg-accent rounded-full ${!reduceMotion ? 'animate-pulse' : ''}`} />
                Contabilidade Especializada e Humanizada
              </div>
            </StaggerItem>

            {/* Headline */}
            <StaggerItem type="hybrid">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Economize até{" "}
                <span className="text-secondary">50% em impostos</span>
                <br />
                com especialistas que entendem seu negócio
              </h1>
            </StaggerItem>

            {/* Subheadline */}
            <StaggerItem type="slide">
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Mais de 100 profissionais e empresas em todo Brasil já reduziram sua carga tributária 
                com nossa contabilidade digital nichada.{" "}
                <span className="font-semibold text-foreground">100% online, 0% burocracia.</span>
              </p>
            </StaggerItem>

            {/* Stats - Simplified animations */}
            <StaggerItem type="scale">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 py-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 sm:gap-3 transition-transform duration-300 hover:scale-105"
                  >
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                    <div>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</span>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </StaggerItem>

            {/* CTAs */}
            <StaggerItem type="hybrid">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="cta-glow"
                  className="w-full sm:w-auto sm:text-base"
                  asChild
                >
                  <Link to="/calculadora-pj-clt">
                    <Calculator className="h-5 w-5" />
                    Calcular Minha Economia
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary hover:text-white sm:text-base"
                  asChild
                >
                  <a {...getWhatsAppAnchorPropsByKey("heroMultiNiche")}>
                    <MessageCircle className="h-5 w-5" />
                    Falar com Especialista
                  </a>
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Right Side - Founder Image (Desktop) - Simplified, no Parallax on mobile */}
          <div className="relative hidden lg:flex items-center justify-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Glow effect behind the image - Static */}
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-75 translate-x-10" />
              
              {/* Main founder image with special border radius */}
              <div className="relative z-10 overflow-hidden rounded-[32px] rounded-bl-[80px] rounded-tr-[80px]">
                <img
                  src={heroFounder}
                  alt="Thomas Broek - Contador responsável da Contabilidade Zen"
                  width={512}
                  height={640}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full max-w-lg h-auto object-cover drop-shadow-2xl"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />

                {/* Name Card - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm p-5 text-center">
                  <p className="text-white font-bold text-lg">Thomas Broek</p>
                  <p className="text-white text-sm">Contador responsável e técnico</p>
                  <p className="text-white text-xs font-medium mt-1">CRC-SP 337693/O-7</p>
                </div>
              </div>
              
              {/* Subtle decorative elements - CSS animations */}
              <div className={`absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/40 rounded-full blur-xl ${!reduceMotion ? 'animate-subtle-pulse' : ''}`} />
              <div className={`absolute -top-4 -right-4 w-16 h-16 bg-accent/30 rounded-full blur-lg ${!reduceMotion ? 'animate-subtle-pulse' : ''}`} style={{ animationDelay: '0.5s' }} />
            </motion.div>
          </div>

          {/* Mobile: Founder image visible - Static, no motion */}
          <div className="relative lg:hidden flex justify-center animate-fade-up">
            <div className="relative overflow-hidden rounded-[24px] rounded-bl-[60px] rounded-tr-[60px]">
              <img
                src={heroFounder}
                alt="Thomas Broek - Contador responsável da Contabilidade Zen"
                width={288}
                height={360}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-72 h-auto object-cover drop-shadow-xl"
              />
              
              {/* Gradient overlay mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />

              {/* Name Card mobile - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm p-4 text-center">
                <p className="text-white font-bold text-sm">Thomas Broek</p>
                <p className="text-white text-xs">Contador responsável e técnico</p>
                <p className="text-white text-[10px] font-medium mt-0.5">CRC-SP 337693/O-7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefit Cards - Bottom with stagger - Simplified hover */}
        <StaggerContainer className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 mt-8 lg:mt-0" staggerDelay={0.1}>
          {benefitCards.map((card, index) => (
            <StaggerItem key={index} type="scale">
              <div
                className="bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-xl p-4 transition-all duration-300 hover:bg-secondary/15 hover:-translate-y-1"
              >
                <card.icon className="h-8 w-8 text-secondary mb-3" />
                <p className="font-semibold text-foreground text-sm mb-1">{card.title}</p>
                <p className="text-muted-foreground text-xs">{card.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
