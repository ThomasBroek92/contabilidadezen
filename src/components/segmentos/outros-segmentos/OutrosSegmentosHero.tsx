import { Button } from "@/components/ui/button";
import { Video, TrendingDown, Shield, Clock, ArrowRight } from "lucide-react";
import outrosSegmentosBg from "@/assets/12-outros-segmentos-bg.webp";

export function OutrosSegmentosHero() {
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#F8FAFC] overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#F1F5F9] blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F1F5F9] border border-[#475569]/30">
              <Video className="h-4 w-4 text-[#334155]" />
              <span className="text-sm font-medium text-[#334155]">Contabilidade para Outros Segmentos</span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
              Contabilidade sob medida{" "}<span className="text-[#475569]">para seu negócio!</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Arquitetos, engenheiros, designers, coaches, fotógrafos e muitos outros. <strong className="text-[#334155]">Planejamento tributário personalizado</strong> para cada profissão.
            </p>
            <p className="text-base text-muted-foreground">Reduza seus impostos com um enquadramento inteligente e 100% legal.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base font-semibold px-8 bg-[#475569] hover:bg-[#334155] text-white" onClick={scrollToForm}>
                Reduza seus impostos já<ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base border-secondary text-secondary hover:bg-secondary/10" onClick={scrollToForm}>
                Diagnóstico gratuito
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center"><TrendingDown className="h-6 w-6 text-[#475569] mx-auto mb-2" /><p className="text-sm text-muted-foreground">Menos impostos</p></div>
              <div className="text-center"><Shield className="h-6 w-6 text-secondary mx-auto mb-2" /><p className="text-sm text-muted-foreground">100% legal</p></div>
              <div className="text-center"><Clock className="h-6 w-6 text-[#475569] mx-auto mb-2" /><p className="text-sm text-muted-foreground">Suporte ágil</p></div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#475569]/20">
              <img src={outrosSegmentosBg} alt="Profissional em ambiente de trabalho moderno" width={665} height={735} loading="eager" fetchPriority="high" decoding="async" className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#475569]/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-[#475569]/30">
              <p className="text-3xl font-bold text-[#475569]">6%</p>
              <p className="text-sm text-muted-foreground">A partir de impostos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
