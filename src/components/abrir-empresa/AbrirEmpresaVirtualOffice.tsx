import { motion } from "framer-motion";
import { Building2, MapPin, Sparkles, Gift, CheckCircle2, CreditCard, ShieldCheck, Smartphone, Zap, HeadphonesIcon, TrendingUp, FileText } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Segurança Total",
    description: "Seus dados protegidos com criptografia de ponta e backup automático.",
  },
  {
    icon: Smartphone,
    title: "100% Digital",
    description: "Gerencie sua empresa de qualquer lugar, a qualquer momento.",
  },
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Processos automatizados para você focar no que importa.",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Humanizado",
    description: "Atendimento real com pessoas que entendem suas necessidades.",
  },
  {
    icon: TrendingUp,
    title: "Economia de Impostos",
    description: "Planejamento tributário para pagar menos impostos legalmente.",
  },
  {
    icon: FileText,
    title: "Documentos Organizados",
    description: "Todos os seus documentos em um só lugar, sempre acessíveis.",
  },
];

export function AbrirEmpresaVirtualOffice() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section className="py-12 bg-gradient-to-r from-secondary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Main highlight card */}
          <div className="relative bg-card border-2 border-secondary/50 rounded-3xl p-8 md:p-10 shadow-card overflow-hidden">
            {/* Corner ribbon */}
            <div className="absolute -right-12 top-6 rotate-45 bg-secondary text-secondary-foreground px-12 py-2 text-sm font-bold shadow-lg">
              GRÁTIS!
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
              {/* Left side - Main benefits info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-6">
                  {/* Icon with animation */}
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <div className="relative flex gap-3">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
                        <Building2 className="w-8 h-8 md:w-10 md:h-10 text-secondary-foreground" />
                      </div>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg">
                        <CreditCard className="w-8 h-8 md:w-10 md:h-10 text-secondary-foreground" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 bg-warning text-warning-foreground rounded-full p-1.5 shadow-lg"
                      >
                        <Gift className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
                      <Sparkles className="w-4 h-4" />
                      Exclusivo para novos clientes
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Ganhe{" "}
                      <span className="text-gradient">Sede Virtual + Conta PJ!</span>
                    </h2>

                    <p className="text-muted-foreground text-sm md:text-base mb-4">
                      Ao abrir sua empresa conosco, você recebe um endereço comercial completo 
                      e uma conta digital PJ 100% gratuita, sem mensalidade.
                    </p>
                  </div>
                </div>

                {/* Benefits lists */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {/* Benefits list - Sede Virtual */}
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-secondary" />
                      Sede Virtual:
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>Endereço comercial</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>Correspondências</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>Uso no CNPJ</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits list - Conta PJ */}
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-secondary" />
                      Conta Digital PJ:
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>PIX ilimitado</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>TED gratuito</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>Boletos sem custo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price highlight */}
                <div className="flex items-center justify-between bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">*Válido enquanto você for cliente</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground line-through">R$ 200/mês</p>
                    <p className="text-2xl font-bold text-secondary">R$ 0</p>
                  </div>
                </div>
              </div>

              {/* Right side - Benefits Carousel */}
              <div className="w-full lg:w-72 shrink-0">
                <p className="text-sm font-semibold text-foreground mb-3 text-center lg:text-left">
                  Benefícios que fazem a <span className="text-gradient">diferença</span>
                </p>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[autoplayPlugin.current]}
                  className="w-full"
                >
                  <CarouselContent>
                    {benefits.map((benefit, index) => (
                      <CarouselItem key={index} className="basis-full">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-background border border-border/50 rounded-2xl p-5 shadow-soft h-full"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center mb-3">
                            <benefit.icon className="w-5 h-5 text-secondary-foreground" />
                          </div>
                          <h3 className="text-base font-semibold text-foreground mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {benefit.description}
                          </p>
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                {/* Carousel indicators */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {benefits.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-secondary/30" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}