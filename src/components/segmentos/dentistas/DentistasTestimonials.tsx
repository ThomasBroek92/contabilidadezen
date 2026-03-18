import { Star, Quote, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";

const fallbackTestimonials = [
  { name: "Dr. Fernando Lima", role: "Ortodontista", location: "São Paulo, SP", content: "Desde que contratei a Contabilidade Zen, consegui reduzir mais de 35% dos meus impostos. Finalmente tenho tranquilidade para focar nos meus pacientes.", rating: 5 },
  { name: "Dra. Juliana Costa", role: "Proprietária de Clínica", location: "Curitiba, PR", content: "A equipe é extremamente atenciosa e entende perfeitamente as necessidades da área odontológica. Recomendo para todos os colegas de profissão!", rating: 5 },
  { name: "Dr. Marcos Oliveira", role: "Implantodontista", location: "Belo Horizonte, MG", content: "Migrei de Pessoa Física para PJ com a orientação deles e a economia foi impressionante. Atendimento impecável do início ao fim.", rating: 5 },
];

function GoogleLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);
}

interface GMBReview { id: string; google_review_id: string; reviewer_name: string; reviewer_photo_url: string | null; rating: number; comment: string | null; review_time: string; }
interface GMBStats { average_rating: number; total_reviews: number; synced_at: string; }

export function DentistasTestimonials() {
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }));

  const { data: gmbReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['gmb-reviews'], queryFn: async () => {
      const { data, error } = await supabase.from('gmb_reviews').select('*').gte('rating', 4).eq('is_visible', true).order('review_time', { ascending: false }).limit(10);
      if (error) return null; return data as GMBReview[];
    }, staleTime: 1000 * 60 * 5,
  });

  const { data: gmbStats } = useQuery({
    queryKey: ['gmb-stats'], queryFn: async () => {
      const { data, error } = await supabase.from('gmb_stats').select('*').order('synced_at', { ascending: false }).limit(1).maybeSingle();
      if (error) return null; return data as GMBStats | null;
    }, staleTime: 1000 * 60 * 5,
  });

  const hasGMBReviews = gmbReviews && gmbReviews.length > 0;
  const displayFallback = !hasGMBReviews || reviewsLoading;
  const formatRelativeTime = (dateString: string) => { try { return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR }); } catch { return ''; } };
  const renderStars = (rating: number) => [...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-[#10B981] text-[#10B981]' : 'text-muted-foreground/30'}`} />));
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <section className="py-16 lg:py-24 bg-[#F0FDF9]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#059669] uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Eles podem dizer melhor sobre nossos serviços do que nós!</h2>
          <p className="text-muted-foreground text-lg">{hasGMBReviews ? "Veja o que nossos clientes estão dizendo sobre a Contabilidade Zen no Google." : "Confira os resultados que nossos clientes dentistas estão tendo com nosso apoio"}</p>
          {gmbStats && (
            <a href="https://g.page/r/CSe4RMezF61hEAI/review" target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-3 mt-6 px-5 py-3 bg-card border border-border rounded-xl hover:border-[#10B981]/50 hover:shadow-card transition-all duration-300 group hover:-translate-y-0.5">
              <GoogleLogo className="h-6 w-6" />
              <div className="flex items-center gap-2"><div className="flex gap-0.5">{renderStars(Math.round(gmbStats.average_rating))}</div><span className="font-bold text-foreground text-lg">{gmbStats.average_rating.toFixed(1)}</span></div>
              <span className="text-muted-foreground">•</span><span className="text-muted-foreground">{gmbStats.total_reviews} avaliações</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#10B981] transition-colors" />
            </a>
          )}
        </div>
        <Carousel opts={{ align: "start", loop: true }} plugins={[autoplayPlugin.current]} className="w-full">
          <CarouselContent className="-ml-4">
            {displayFallback
              ? fallbackTestimonials.map((t, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="bg-card rounded-2xl p-6 lg:p-8 border border-[#10B981]/15 hover:border-[#10B981]/40 transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-card relative">
                      <Quote className="absolute top-4 right-4 h-8 w-8 text-[#10B981]/20" />
                      <div className="flex gap-1 mb-4">{renderStars(t.rating)}</div>
                      <p className="text-foreground/80 leading-relaxed mb-6 line-clamp-4">"{t.content}"</p>
                      <div className="flex items-center gap-4 pt-4 border-t border-border">
                        <div className="w-12 h-12 rounded-full bg-[#A7F3D0] flex items-center justify-center"><span className="text-lg font-bold text-[#059669]">{t.name.split(" ").map(n => n[0]).join("")}</span></div>
                        <div><p className="font-semibold text-foreground">{t.name}</p><p className="text-sm text-muted-foreground">{t.role} • {t.location}</p></div>
                      </div>
                    </div>
                  </CarouselItem>
                ))
              : gmbReviews?.map((review) => (
                  <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="bg-card rounded-2xl p-6 lg:p-8 border border-[#10B981]/15 hover:border-[#10B981]/40 transition-all duration-300 relative h-full hover:-translate-y-1 hover:shadow-card">
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full"><GoogleLogo className="h-3.5 w-3.5" /><span>Google</span></div>
                      <Quote className="h-8 w-8 text-[#10B981]/30 mb-4" />
                      <p className="text-foreground/80 leading-relaxed mb-6 line-clamp-4">"{review.comment || 'Excelente serviço!'}"</p>
                      <div className="flex gap-1 mb-4">{renderStars(review.rating)}</div>
                      <div className="flex items-center gap-3">
                        {review.reviewer_photo_url ? (<img src={review.reviewer_photo_url} alt={review.reviewer_name} width={40} height={40} loading="lazy" decoding="async" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />) : (<div className="w-10 h-10 rounded-full bg-[#A7F3D0] flex items-center justify-center"><span className="text-[#059669] font-semibold text-sm">{review.reviewer_name.charAt(0).toUpperCase()}</span></div>)}
                        <div><p className="font-semibold text-foreground">{review.reviewer_name}</p><p className="text-xs text-muted-foreground">{formatRelativeTime(review.review_time)}</p></div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>
          <div className="hidden sm:flex justify-center gap-2 mt-8"><CarouselPrevious className="static translate-y-0" /><CarouselNext className="static translate-y-0" /></div>
          <CarouselDots className="sm:hidden" />
        </Carousel>
        <div className="text-center mt-10">
          {hasGMBReviews ? (
            <a href="https://g.page/r/CSe4RMezF61hEAI/review" target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-2 text-[#059669] hover:text-[#10B981] font-medium transition-colors">Ver todas as avaliações no Google<ExternalLink className="h-4 w-4" /></a>
          ) : (<Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10" onClick={scrollToForm}>Fale com um especialista</Button>)}
        </div>
      </div>
    </section>
  );
}
