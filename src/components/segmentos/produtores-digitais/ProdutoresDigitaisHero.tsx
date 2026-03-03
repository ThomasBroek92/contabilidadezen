import { Button } from "@/components/ui/button";
import { Play, TrendingDown, Shield, Clock, ArrowRight } from "lucide-react";
import produtoresDigitaisBg from "@/assets/04-produtores-digitais-bg.webp";

export function ProdutoresDigitaisHero() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FAF5FF] overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#E9D5FF] blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3E8FF] border border-[#9333EA]/30">
              <Play className="h-4 w-4 text-[#7E22CE]" />
              <span className="text-sm font-medium text-[#7E22CE]">
                Contabilidade para Produtores Digitais
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
              Venda infoprodutos e pague{" "}
              <span className="text-[#9333EA]">menos impostos legalmente!</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Está pagando até 27,5% de IR como pessoa física? Produtores digitais PJ podem 
              pagar a partir de <strong className="text-[#7E22CE]">6%</strong> de impostos com o planejamento tributário correto!
            </p>
            
            <p className="text-base text-muted-foreground">
              Hotmart, Eduzz, Monetizze, Kiwify — nota fiscal automatizada e enquadramento tributário otimizado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-base font-semibold px-8 bg-[#9333EA] hover:bg-[#7E22CE] text-white"
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
            
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <TrendingDown className="h-6 w-6 text-[#9333EA] mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Menos impostos</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">NF automática</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 text-[#9333EA] mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Mais tempo</p>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#9333EA]/20">
              <img 
                src={produtoresDigitaisBg} 
                alt="Produtor digital trabalhando com infoprodutos e plataformas online"
                width={665}
                height={735}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#9333EA]/20 to-transparent" />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-[#9333EA]/30">
              <p className="text-3xl font-bold text-[#9333EA]">+150</p>
              <p className="text-sm text-muted-foreground">Produtores atendidos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
