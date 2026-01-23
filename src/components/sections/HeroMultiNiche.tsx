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
import { Parallax, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";

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
      {/* Background pattern with parallax */}
      <Parallax speed={0.3} direction="down" className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </Parallax>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content - Left Side */}
          <StaggerContainer className="space-y-8 text-white" staggerDelay={0.15}>
            {/* Badge */}
            <StaggerItem type="slide">
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20"
                animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0.2)", "0 0 0 8px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Contabilidade Especializada e Humanizada
              </motion.div>
            </StaggerItem>

            {/* Headline */}
            <StaggerItem type="hybrid">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Economize até{" "}
                <span className="text-accent">50% em impostos</span>
                <br />
                com especialistas que entendem seu negócio
              </h1>
            </StaggerItem>

            {/* Subheadline */}
            <StaggerItem type="slide">
              <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                Mais de 500 profissionais e empresas em todo Brasil já reduziram sua carga tributária 
                com nossa contabilidade digital nichada.{" "}
                <span className="font-semibold text-white">100% online, 0% burocracia.</span>
              </p>
            </StaggerItem>

            {/* Stats */}
            <StaggerItem type="scale">
              <div className="flex items-center gap-8 py-4">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                    >
                      <stat.icon className="h-6 w-6 text-accent" />
                    </motion.div>
                    <div>
                      <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                      <p className="text-xs text-white/70">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </StaggerItem>

            {/* CTAs */}
            <StaggerItem type="hybrid">
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="xl" 
                  variant="cta-glow"
                  asChild
                >
                  <Link to="/calculadora-pj-clt">
                    <Calculator className="h-5 w-5" />
                    Calcular Minha Economia
                  </Link>
                </Button>
                <Button 
                  size="xl" 
                  variant="hero-outline"
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
            </StaggerItem>
          </StaggerContainer>

          {/* Right Side - Visual with Parallax */}
          <Parallax speed={0.2} className="relative hidden lg:block">
            <div className="relative w-full h-[600px]">
              {/* Central circle */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="text-center text-white">
                  <motion.div 
                    className="text-6xl font-bold mb-2"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Zen
                  </motion.div>
                  <div className="text-sm opacity-80">Contabilidade Digital</div>
                </div>
              </motion.div>
              
              {/* Floating profession icons with enhanced animations */}
              {[
                { emoji: "🩺", className: "top-10 left-10", delay: 0 },
                { emoji: "⚖️", className: "top-20 right-20", delay: 0.5 },
                { emoji: "💻", className: "bottom-32 left-16", delay: 1 },
                { emoji: "🎬", className: "bottom-20 right-10", delay: 1.5 },
                { emoji: "🛒", className: "top-40 left-1/2", delay: 2 },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className={`absolute ${item.className} w-16 h-16 bg-secondary/80 rounded-2xl flex items-center justify-center shadow-lg`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    scale: { delay: 0.5 + item.delay * 0.2, duration: 0.4 },
                    y: { delay: 1 + item.delay, duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                </motion.div>
              ))}
            </div>
          </Parallax>
        </div>

        {/* Benefit Cards - Bottom with stagger */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 lg:mt-0" staggerDelay={0.1}>
          {benefitCards.map((card, index) => (
            <StaggerItem key={index} type="scale">
              <motion.div
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all duration-300"
                whileHover={{ 
                  scale: 1.03, 
                  backgroundColor: "rgba(255,255,255,0.2)",
                  y: -4,
                }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <card.icon className="h-8 w-8 text-accent mb-3" />
                </motion.div>
                <h3 className="font-semibold text-white text-sm mb-1">{card.title}</h3>
                <p className="text-white/70 text-xs">{card.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
