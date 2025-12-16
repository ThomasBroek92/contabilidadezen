import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export function DentistasCTA() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-foreground mb-6">
            Pronto para pagar menos impostos e ter mais tranquilidade?
          </h2>
          <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de dentistas que já otimizaram suas finanças com a Contabilidade Zen. 
            Comece hoje mesmo com uma análise gratuita!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-base font-semibold px-8"
              onClick={scrollToForm}
            >
              Agendar reunião gratuita
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a
                href="https://wa.me/5519974158342?text=Olá! Sou dentista e gostaria de saber mais sobre contabilidade especializada."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Falar pelo WhatsApp
              </a>
            </Button>
          </div>
          
          <p className="text-sm text-primary-foreground/60 mt-6">
            Sem compromisso. Análise 100% gratuita.
          </p>
        </div>
      </div>
    </section>
  );
}
