import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { 
  Gift, 
  TrendingUp, 
  Sparkles, 
  Shield,
  ArrowRight
} from "lucide-react";

interface BenefitStep {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const benefitSteps: BenefitStep[] = [
  {
    number: "01",
    title: "100% da Primeira Mensalidade",
    description: "Receba o valor integral da primeira mensalidade do seu indicado diretamente via PIX. Pagamento em até 5 dias úteis.",
    icon: Gift,
  },
  {
    number: "02",
    title: "10% de Recorrência",
    description: "Opte por receber 10% de todas as mensalidades enquanto o indicado permanecer cliente ativo.",
    icon: TrendingUp,
  },
  {
    number: "03",
    title: "Certificado Digital Grátis",
    description: "A cada 3 indicações confirmadas, ganhe um Certificado Digital e-CPF ou e-CNPJ.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "IRPF Gratuito",
    description: "Clientes parceiros que indicam 5 ou mais empresas ganham declaração de IRPF grátis.",
    icon: Shield,
  },
];

function BenefitCard({ step, index }: { step: BenefitStep; index: number }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="relative h-full rounded-2xl p-6 md:p-8 transition-all duration-300
        border-2 group hover:scale-[1.02] hover:shadow-xl
        bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 hover:border-secondary/40"
    >
      {/* Badge + Number */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-secondary/10 text-secondary">
          Benefício
        </span>
        <span className="text-3xl md:text-4xl font-black text-secondary/20">
          {step.number}
        </span>
      </div>

      {/* Icon */}
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-5
        transition-transform duration-300 group-hover:scale-110
        bg-gradient-to-br from-secondary to-accent"
      >
        <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
      </div>

      {/* Content */}
      <h3 className="font-bold text-lg md:text-xl mb-3 text-foreground">
        {step.title}
      </h3>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
        {step.description}
      </p>

      {/* Decorative Element */}
      <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-[4rem] opacity-10
        bg-gradient-to-br from-secondary to-accent"
      />
    </motion.div>
  );
}

export function PartnerBenefitsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Programa de Parceria
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O que você <span className="text-gradient">ganha</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha: <strong className="text-secondary">100% da 1ª mensalidade</strong> OU{" "}
            <strong className="text-secondary">10% de recorrência</strong>
          </p>
        </motion.div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 items-stretch">
            {benefitSteps.map((step, index) => (
              <CarouselItem 
                key={step.number} 
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 relative"
              >
                <BenefitCard step={step} index={index} />
                
                {/* "OU" indicator between first two cards */}
                {index === 0 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex">
                    <div className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      OU
                    </div>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-1/2 bg-background border-border hover:bg-muted" />
            <CarouselNext className="right-0 translate-x-1/2 bg-background border-border hover:bg-muted" />
          </div>
        </Carousel>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300
                ${current === index 
                  ? "bg-secondary w-8" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }
              `}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10"
        >
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold gap-2"
            onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Quero me cadastrar agora
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
