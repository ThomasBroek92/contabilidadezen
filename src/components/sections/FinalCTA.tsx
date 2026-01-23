import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, MessageCircle } from "lucide-react";

export function FinalCTA() {
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
    <section className="py-16 lg:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Coluna Esquerda: Conteúdo */}
          <div className="order-2 lg:order-1">
            {/* Título */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              <span className="text-foreground">Pronto para pagar menos impostos</span>
              <br className="hidden lg:block" />
              <span className="text-secondary"> de forma legal?</span>
            </h2>

            {/* Subtítulo */}
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Faça seu cadastro digital ou converse com um dos nossos especialistas
              em contabilidade. Sem compromisso, 100% gratuito.
            </p>

            {/* Lista de Benefícios */}
            <ul className="space-y-3 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="zen" size="xl">
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
          </div>

          {/* Coluna Direita: Imagem */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Container circular com sombra */}
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl border-4 border-secondary/20">
                <img
                  src="/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png"
                  alt="Especialista em Contabilidade Zen"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badge flutuante */}
              <div className="absolute bottom-8 right-0 lg:-right-4 bg-secondary text-secondary-foreground px-5 py-3 rounded-full shadow-xl flex items-center gap-2 animate-float">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold text-sm whitespace-nowrap">Atendimento Humanizado</span>
              </div>

              {/* Elemento decorativo de fundo */}
              <div className="absolute inset-0 -z-10 scale-110">
                <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
