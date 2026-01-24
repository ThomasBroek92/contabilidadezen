import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { StaggerContainer, StaggerItem, Parallax } from "@/components/ui/scroll-animation";
import youtubersCreatorsBg from "@/assets/youtubers-creators-bg.jpg";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const whatsappNumber = "5519974158342";
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de falar com um especialista sobre contabilidade para minha empresa."
  );

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

            {/* Lista de Benefícios */}
            <StaggerItem type="slide">
              <ul className="space-y-3 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.2, backgroundColor: "hsl(var(--secondary) / 0.3)" }}
                    >
                      <Check className="w-4 h-4 text-secondary" />
                    </motion.div>
                    <span className="text-foreground/80">{benefit}</span>
                  </motion.li>
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
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
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

          {/* Coluna Direita: Imagem */}
          <Parallax speed={0.15} className="order-1 lg:order-2 relative">
            <motion.div 
              className="relative w-full aspect-square max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Container circular com sombra */}
              <motion.div 
                className="absolute inset-0 rounded-full overflow-hidden shadow-2xl border-4 border-secondary/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={youtubersCreatorsBg}
                  alt="Contabilidade para YouTubers e Criadores de Conteúdo"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
