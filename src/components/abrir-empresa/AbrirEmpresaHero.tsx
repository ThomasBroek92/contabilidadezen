import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Shield, Zap, ShieldCheck, Smartphone, HeadphonesIcon, TrendingUp, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Segurança Total",
    description: "Seus dados protegidos com criptografia de ponta.",
  },
  {
    icon: Smartphone,
    title: "100% Digital",
    description: "Gerencie sua empresa de qualquer lugar.",
  },
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Processos automatizados para você focar no que importa.",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Humanizado",
    description: "Atendimento real com pessoas que entendem você.",
  },
  {
    icon: TrendingUp,
    title: "Economia de Impostos",
    description: "Pague menos impostos legalmente.",
  },
  {
    icon: FileText,
    title: "Documentos Organizados",
    description: "Tudo em um só lugar, sempre acessível.",
  },
];

// Google logo SVG component
function GoogleLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function AbrirEmpresaHero() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // Fetch GMB stats
  const { data: gmbStats } = useQuery({
    queryKey: ['gmb-stats-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gmb_stats')
        .select('*')
        .order('synced_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching GMB stats:', error);
        return null;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Render stars
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} 
      />
    ));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10">
          {/* Main Hero Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge variant="secondary" className="bg-zen-light-teal text-secondary px-4 py-2 text-sm font-medium">
                Sua contabilidade sem estresse
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Foque no seu negócio.{" "}
                <span className="text-gradient">A burocracia</span> é por nossa conta.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Contabilidade completa, humanizada e digital para sua empresa crescer com tranquilidade.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/contato">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Google Reviews Badge */}
              <a
                href="https://g.page/r/CSe4RMezF61hEAI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl hover:border-secondary/50 hover:shadow-card transition-all duration-300 group"
              >
                <GoogleLogo className="h-6 w-6" />
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {renderStars(Math.round(gmbStats?.average_rating || 5))}
                  </div>
                  <span className="font-bold text-foreground text-lg">
                    {gmbStats?.average_rating?.toFixed(1) || '5.0'}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {gmbStats?.total_reviews || 0} avaliações no Google
                </span>
              </a>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-card rounded-3xl shadow-card p-8 backdrop-blur border border-border/50">
                {/* Glass effect dashboard mockup */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                        <Shield className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Dashboard Zen</p>
                        <p className="text-sm text-muted-foreground">Tudo sob controle</p>
                      </div>
                    </div>
                    <Badge className="bg-secondary/10 text-secondary border-0">Ativo</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground">Impostos</p>
                      <p className="text-2xl font-bold text-foreground">R$ 0,00</p>
                      <p className="text-xs text-secondary">Em dia ✓</p>
                    </div>
                    <div className="bg-muted/50 rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground">Documentos</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                      <p className="text-xs text-secondary">Organizados ✓</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                      <Zap className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Próximo passo</p>
                      <p className="text-sm text-muted-foreground">Nenhuma pendência</p>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>

          {/* Benefits Carousel - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {benefits.map((benefit, index) => (
                  <CarouselItem key={index} className="pl-4 basis-1/2 lg:basis-1/3">
                    <div className="flex items-center gap-4 bg-card border border-border/50 rounded-xl p-4 shadow-soft h-full">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center shrink-0">
                        <benefit.icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-foreground">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}