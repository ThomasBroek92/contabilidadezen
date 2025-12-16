import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, ArrowRight } from "lucide-react";

export function MedicosCTA() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-accent blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-foreground mb-6">
            Pare de perder dinheiro com impostos!
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-4">
            A Contabilidade Zen resolve isso agora.
          </p>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
            Está cansado de ver seus lucros escorrendo pelos impostos? Chegou a hora de tomar controle 
            das finanças da sua clínica! Nossa contabilidade especializada vai cortar sua carga tributária, 
            eliminar a burocracia e te dar mais tempo para crescer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-base font-semibold px-8"
              onClick={scrollToForm}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Agendar reunião e economizar
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a 
                href="https://wa.me/5519974158342?text=Olá! Sou médico e gostaria de saber mais sobre contabilidade especializada."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
          
          <p className="text-sm text-primary-foreground/50 mt-8">
            Consulta gratuita e sem compromisso. Descubra quanto você pode economizar!
          </p>
        </div>
      </div>
    </section>
  );
}
