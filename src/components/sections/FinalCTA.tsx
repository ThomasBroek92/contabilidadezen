import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle } from "lucide-react";
import { useRef } from "react";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import youtubersCreatorsBg from "@/assets/11-youtubers-creators-bg.webp";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function FinalCTA() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  
  const whatsappLink = getWhatsAppLink(WHATSAPP_MESSAGES.default);

  const benefits = [
    "Análise gratuita do seu caso",
    "Sem compromisso",
    "Especialistas dedicados ao seu negócio",
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Coluna Esquerda: Conteúdo */}
          <StaggerContainer className="order-2 lg:order-1" staggerDelay={0.12}>
            {/* Título */}
            <StaggerItem type="hybrid">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                <span className="text-foreground">Pronto para pagar menos impostos</span>
                <br className="hidden lg:block" />
                <span className="text-secondary"> de forma legal?</span>
              </h2>
            </StaggerItem>

            {/* Subtítulo */}
            <StaggerItem type="slide">
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Faça seu cadastro digital ou converse com um dos nossos especialistas
                em contabilidade. Sem compromisso, 100% gratuito.
              </p>
            </StaggerItem>

            {/* Lista de Benefícios - CSS animations */}
            <StaggerItem type="slide">
              <ul className="space-y-3 mb-10">
                {benefits.map((benefit, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-3 animate-fade-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 hover:bg-secondary/20"
                    >
                      <Check className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-foreground/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* CTAs */}
            <StaggerItem type="scale">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="cta-glow" size="xl">
                  <Link to="/abrir-empresa">Abra sua empresa</Link>
                </Button>
                <Button asChild variant="zen-outline" size="xl">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Fale com um especialista
                  </a>
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Coluna Direita: Imagem - Static, no Parallax on mobile */}
          <div className="order-1 lg:order-2 relative">
            <div 
              className={`relative w-full aspect-square max-w-md mx-auto ${!reduceMotion ? 'animate-fade-up' : ''}`}
            >
              {/* Container circular com sombra - CSS hover */}
              <div 
                className="absolute inset-0 rounded-full overflow-hidden shadow-2xl border-4 border-secondary/20 transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={youtubersCreatorsBg}
                  alt="Contabilidade para YouTubers e Criadores de Conteúdo"
                  width={448}
                  height={448}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
