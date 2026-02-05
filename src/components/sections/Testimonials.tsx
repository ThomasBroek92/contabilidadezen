import { Star, Quote, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";

// Fallback testimonials for when no GMB reviews are available
const fallbackTestimonials = [
  {
    name: "Dr. Ricardo Mendes",
    role: "Cardiologista",
    location: "São Paulo, SP",
    content: "Economizei mais de R$ 30.000 por ano com o planejamento tributário da Contabilidade Zen. Além disso, não preciso mais me preocupar com a burocracia dos plantões.",
    rating: 5,
    savings: "R$ 30.000/ano",
  },
  {
    name: "Dra. Carolina Silva",
    role: "Dentista",
    location: "Rio de Janeiro, RJ",
    content: "Finalmente encontrei uma contabilidade que entende as particularidades do meu consultório odontológico. O suporte é excepcional e sempre respondem rápido.",
    rating: 5,
    savings: "R$ 18.000/ano",
  },
  {
    name: "Dr. Fernando Costa",
    role: "Psicólogo",
    location: "Belo Horizonte, MG",
    content: "Tinha medo de abrir empresa, mas a equipe me explicou tudo de forma simples. Hoje pago 6% de imposto ao invés dos 27,5% que pagava como autônomo.",
    rating: 5,
    savings: "R$ 22.000/ano",
  },
  {
    name: "Dra. Ana Beatriz",
    role: "Dermatologista",
    location: "Curitiba, PR",
    content: "A migração da minha contabilidade foi super tranquila. Eles cuidaram de todo o processo e eu não precisei fazer nada. Muito profissionais!",
    rating: 5,
    savings: "R$ 25.000/ano",
  },
  {
    name: "Dr. Marcos Oliveira",
    role: "Fisioterapeuta",
    location: "Porto Alegre, RS",
    content: "O aplicativo facilita muito minha vida. Consigo ver todas as guias de pagamento e relatórios direto no celular. Recomendo demais!",
    rating: 5,
    savings: "R$ 15.000/ano",
  },
  {
    name: "Dra. Juliana Rocha",
    role: "Nutricionista",
    location: "Brasília, DF",
    content: "Atendimento humanizado de verdade. Sempre que tenho dúvidas, eles explicam com paciência e clareza. Vale cada centavo investido.",
    rating: 5,
    savings: "R$ 12.000/ano",
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

interface GMBReview {
  id: string;
  google_review_id: string;
  reviewer_name: string;
  reviewer_photo_url: string | null;
  rating: number;
  comment: string | null;
  review_time: string;
}

interface GMBStats {
  average_rating: number;
  total_reviews: number;
  synced_at: string;
}

export function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // Autoplay plugin ref
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  // Fetch GMB reviews
  const { data: gmbReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['gmb-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gmb_reviews')
        .select('*')
        .gte('rating', 4)
        .eq('is_visible', true)
        .order('review_time', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching GMB reviews:', error);
        return null;
      }
      return data as GMBReview[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch GMB stats
  const { data: gmbStats } = useQuery({
    queryKey: ['gmb-stats'],
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
      return data as GMBStats | null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Determine which testimonials to show
  const hasGMBReviews = gmbReviews && gmbReviews.length > 0;
  const displayFallback = !hasGMBReviews || reviewsLoading;

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return '';
    }
  };

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
    <section ref={sectionRef} className="py-16 lg:py-24 bg-background overflow-visible relative">
      <div className="container mx-auto px-4 overflow-visible">
        {/* Header */}
        <StaggerContainer className="text-center max-w-3xl mx-auto mb-12 lg:mb-16" staggerDelay={0.1}>
          <StaggerItem type="slide">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Depoimentos
            </span>
          </StaggerItem>
          <StaggerItem type="hybrid">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
              O que nossos clientes{" "}
              <span className="text-gradient">dizem</span>
            </h2>
          </StaggerItem>
          <StaggerItem type="slide">
            <p className="text-lg text-muted-foreground">
              {hasGMBReviews 
                ? "Veja o que nossos clientes estão dizendo sobre a Contabilidade Zen no Google."
                : "Mais de 500 profissionais da saúde já confiam na Contabilidade Zen. Veja o que eles têm a dizer sobre nossa parceria."}
            </p>
          </StaggerItem>

          {/* Google Reviews Badge */}
          {gmbStats && (
            <StaggerItem type="scale">
              <motion.a
                href="https://g.page/r/CSe4RMezF61hEAI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 mt-6 px-5 py-3 bg-card border border-border rounded-xl hover:border-secondary/50 hover:shadow-card transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <GoogleLogo className="h-6 w-6" />
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {renderStars(Math.round(gmbStats.average_rating))}
                  </div>
                  <span className="font-bold text-foreground text-lg">
                    {gmbStats.average_rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {gmbStats.total_reviews} avaliações
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
              </motion.a>
            </StaggerItem>
          )}
        </StaggerContainer>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.5 }}
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
              {displayFallback ? (
                // Fallback testimonials
                fallbackTestimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div 
                      className="bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-secondary/50 transition-all duration-300 h-full"
                      whileHover={{ y: -4, boxShadow: "var(--shadow-card)" }}
                    >
                      {/* Quote Icon */}
                      <motion.div
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <Quote className="h-8 w-8 text-secondary/30 mb-4" />
                      </motion.div>

                      {/* Content */}
                      <p className="text-foreground/80 leading-relaxed mb-6 line-clamp-4">
                        "{testimonial.content}"
                      </p>

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Economia</p>
                          <p className="font-bold text-secondary">{testimonial.savings}</p>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))
              ) : (
                // GMB Reviews
                gmbReviews?.map((review) => (
                  <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div 
                      className="bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-secondary/50 transition-all duration-300 relative h-full"
                      whileHover={{ y: -4, boxShadow: "var(--shadow-card)" }}
                    >
                      {/* Google Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                        <GoogleLogo className="h-3.5 w-3.5" />
                        <span>Google</span>
                      </div>

                      {/* Quote Icon */}
                      <Quote className="h-8 w-8 text-secondary/30 mb-4" />

                      {/* Content */}
                      <p className="text-foreground/80 leading-relaxed mb-6 line-clamp-4">
                        "{review.comment || 'Excelente serviço!'}"
                      </p>

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {renderStars(review.rating)}
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        {review.reviewer_photo_url ? (
                          <img 
                            src={review.reviewer_photo_url} 
                            alt={review.reviewer_name}
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <span className="text-secondary font-semibold text-sm">
                              {review.reviewer_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{review.reviewer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(review.review_time)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <div className="hidden sm:flex justify-center gap-2 mt-8">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
            <CarouselDots className="sm:hidden" />
          </Carousel>
        </motion.div>

        {/* View all reviews link */}
        {hasGMBReviews && (
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="https://g.page/r/CSe4RMezF61hEAI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              Ver todas as avaliações no Google
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
