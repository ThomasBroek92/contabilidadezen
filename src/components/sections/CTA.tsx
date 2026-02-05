import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, CheckCircle } from "lucide-react";
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";

export function CTA() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-secondary-foreground">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Pronto para pagar menos impostos de forma legal?
          </h2>
          <p className="text-lg lg:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Agende uma consulta gratuita com nossos especialistas e descubra quanto você pode economizar. 
            Sem compromisso, sem pegadinhas.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              "Análise gratuita do seu caso",
              "Sem compromisso",
              "Especialistas em saúde",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-card"
              asChild
            >
              <Link to="/contato">
                Agendar Consulta Gratuita
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="whatsapp"
              asChild
            >
              <a {...getWhatsAppAnchorPropsByKey("saude")}>
                <MessageCircle className="h-5 w-5" />
                Fale pelo WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
