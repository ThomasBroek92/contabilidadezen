import { MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CitiesWordCloud } from "./CitiesWordCloud";
import { StaggerContainer, StaggerItem, AnimatedIcon } from "@/components/ui/scroll-animation";

export function CitiesSection() {
  const whatsappMessage = encodeURIComponent(
    "Olá! Vi que vocês atendem minha região. Gostaria de saber mais sobre os serviços de contabilidade."
  );
  const whatsappLink = `https://wa.me/5519974158342?text=${whatsappMessage}`;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <StaggerContainer className="text-center mb-12 md:mb-16">
          <StaggerItem type="slide">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <AnimatedIcon type="bounce">
                <MapPin className="h-4 w-4" />
              </AnimatedIcon>
              Atendimento Nacional
            </div>
          </StaggerItem>
          <StaggerItem type="hybrid">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Atendemos em todo o Brasil
            </h2>
          </StaggerItem>
          <StaggerItem type="slide">
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Com especialização nas regiões Sul e Sudeste, especialmente na{" "}
              <span className="text-primary font-medium">Região de Campinas</span> e cidades próximas
            </p>
          </StaggerItem>
        </StaggerContainer>

        {/* Word Cloud */}
        <StaggerItem type="scale">
          <CitiesWordCloud />
        </StaggerItem>

        {/* CTA WhatsApp */}
        <StaggerItem type="scale" className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            variant="cta-glow"
            className="gap-2 px-8 py-6 text-base"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Fale com um especialista da sua região
            </a>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Atendimento personalizado para sua cidade
          </p>
        </StaggerItem>
      </div>
    </section>
  );
}

export { CitiesWordCloud } from "./CitiesWordCloud";
