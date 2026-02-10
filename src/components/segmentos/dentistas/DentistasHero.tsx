import { Button } from "@/components/ui/button";
import { Smile, TrendingDown, Shield, Clock } from "lucide-react";

export function DentistasHero() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-accent blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30">
              <Smile className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">
                Contabilidade para Dentistas e Clínicas Odontológicas
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Reduza impostos e aumente seus lucros com uma{" "}
              <span className="text-secondary">contabilidade especializada para dentistas!</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-primary-foreground/80 leading-relaxed">
              Está pagando mais impostos do que deveria? Especialistas em contabilidade para dentistas 
              e clínicas odontológicas podem ajudar a reduzir seus custos tributários agora!
            </p>
            
            <p className="text-base text-primary-foreground/70">
              Aplique estratégias fiscais personalizadas para seu consultório e veja o impacto nos seus lucros.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-base font-semibold px-8"
                onClick={scrollToForm}
              >
                Reduza seus impostos já
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={scrollToForm}
              >
                Agendar diagnóstico gratuito
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/10">
              <div className="text-center">
                <TrendingDown className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-sm text-primary-foreground/70">Menos impostos</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-sm text-primary-foreground/70">Segurança fiscal</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-sm text-primary-foreground/70">Mais tempo</p>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80" 
                alt="Dentista profissional sorrindo em consultório odontológico"
                width={800}
                height={1200}
                loading="lazy"
                decoding="async"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-border">
              <p className="text-3xl font-bold text-secondary">+300</p>
              <p className="text-sm text-muted-foreground">Dentistas atendidos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
