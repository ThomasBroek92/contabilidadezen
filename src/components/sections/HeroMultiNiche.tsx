import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  { icon: Users, value: "500+", label: "Clientes Ativos" },
  { icon: Award, value: "10+", label: "Anos no Mercado" },
  { icon: Star, value: "4.9⭐", label: "Avaliação Google" },
];

export function HeroMultiNiche() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-secondary via-primary to-primary-foreground overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content - Left Side */}
          <div className="space-y-8 text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Contabilidade Especializada e Humanizada
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Economize até{" "}
              <span className="text-accent">50% em impostos</span>
              <br />
              com especialistas que entendem seu negócio
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
              Mais de 500 profissionais e empresas em todo Brasil já reduziram sua carga tributária 
              com nossa contabilidade digital nichada.{" "}
              <span className="font-semibold text-white">100% online, 0% burocracia.</span>
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 py-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <stat.icon className="h-6 w-6 text-accent" />
                  <div>
                    <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                    <p className="text-xs text-white/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="xl" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg"
                asChild
              >
                <Link to="/calculadora-pj-clt">
                  <Calculator className="h-5 w-5" />
                  Calcular Minha Economia
                </Link>
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <a 
                  href="https://wa.me/5519974158342?text=Olá! Gostaria de falar com um especialista sobre contabilidade." 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar com Especialista
                </a>
              </Button>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative hidden lg:block">
            {/* Main visual placeholder - gradient circles representing multiple professionals */}
            <div className="relative w-full h-[600px]">
              {/* Central circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl font-bold mb-2">Zen</div>
                  <div className="text-sm opacity-80">Contabilidade Digital</div>
                </div>
              </div>
              
              {/* Floating profession icons */}
              <div className="absolute top-10 left-10 w-16 h-16 bg-secondary/80 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <span className="text-2xl">🩺</span>
              </div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-accent/80 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                <span className="text-2xl">⚖️</span>
              </div>
              <div className="absolute bottom-32 left-16 w-16 h-16 bg-primary/80 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                <span className="text-2xl">💻</span>
              </div>
              <div className="absolute bottom-20 right-10 w-16 h-16 bg-warning/80 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "1.5s" }}>
                <span className="text-2xl">🎬</span>
              </div>
              <div className="absolute top-40 left-1/2 w-16 h-16 bg-destructive/80 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: "2s" }}>
                <span className="text-2xl">🛒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefit Cards - Bottom */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 lg:mt-0">
          {benefitCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
            >
              <card.icon className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold text-white text-sm mb-1">{card.title}</h3>
              <p className="text-white/70 text-xs">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
