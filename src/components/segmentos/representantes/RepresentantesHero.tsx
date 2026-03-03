import { Button } from "@/components/ui/button";
import { Briefcase, TrendingDown, Shield, Clock, ArrowRight } from "lucide-react";
import representanteComercialBg from "@/assets/03-representante-comercial-bg.webp";

export function RepresentantesHero() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FFFBF5] overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#FDE8CC] blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3E2] border border-[#E87C1E]/30">
              <Briefcase className="h-4 w-4 text-[#C4680F]" />
              <span className="text-sm font-medium text-[#C4680F]">
                Contabilidade para Representantes Comerciais
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
              Reduza impostos e organize sua representação com{" "}
              <span className="text-[#E87C1E]">contabilidade especializada!</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Está pagando até 27,5% de IR como autônomo? Representantes comerciais PJ podem 
              pagar de <strong className="text-[#C4680F]">6%</strong> de impostos com o planejamento tributário correto!
            </p>
            
            <p className="text-base text-muted-foreground">
              Gestão de múltiplas representadas, conformidade com CORE e economia tributária real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-base font-semibold px-8 bg-[#E87C1E] hover:bg-[#C4680F] text-white"
                onClick={scrollToForm}
              >
                Reduza seus impostos já
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base border-secondary text-secondary hover:bg-secondary/10"
                onClick={scrollToForm}
              >
                Agendar diagnóstico gratuito
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <TrendingDown className="h-6 w-6 text-[#E87C1E] mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Menos impostos</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Registro CORE</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 text-[#E87C1E] mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Mais tempo</p>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#E87C1E]/20">
              <img 
                src={representanteComercialBg} 
                alt="Representante comercial profissional em reunião de negócios"
                width={665}
                height={735}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#E87C1E]/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-[#E87C1E]/30">
              <p className="text-3xl font-bold text-[#E87C1E]">+200</p>
              <p className="text-sm text-muted-foreground">Representantes atendidos</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
