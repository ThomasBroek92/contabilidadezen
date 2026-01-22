import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { MessageCircle, FileText, Upload, Calculator, FileCheck, BarChart3, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const clientSteps = [
  {
    number: "1º",
    description: "Você realiza suas vendas ou serviços e emite suas notas fiscais",
    icon: FileText,
  },
  {
    number: "2º",
    description: "Envia suas despesas e notas fiscais recebidas durante o mês",
    icon: Upload,
  },
];

const zenSteps = [
  {
    number: "3º",
    description: "Nosso time de contadores especialistas processam as informações enviadas",
    icon: Calculator,
  },
  {
    number: "4º",
    description: "Elaboramos e enviamos os seus impostos, taxas e fechamentos mensais",
    icon: FileCheck,
  },
  {
    number: "5º",
    description: "Entregamos todas as obrigações acessórias da sua empresa",
    icon: FileText,
  },
  {
    number: "6º",
    description: "Emitimos os demonstrativos contábeis anuais e pronto! Seu negócio 100% regular perante o fisco",
    icon: BarChart3,
  },
];

const StepCard = ({ 
  step, 
  index, 
  variant 
}: { 
  step: typeof clientSteps[0]; 
  index: number; 
  variant: "client" | "zen" 
}) => {
  const Icon = step.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-3 text-white/40">
        <Icon className="h-8 w-8" />
      </div>
      <div 
        className={`
          w-14 h-14 rounded-full flex items-center justify-center mb-4
          ${variant === "client" ? "bg-white/20" : "bg-white/25"}
        `}
      >
        <span className="text-white font-bold text-xl">{step.number}</span>
      </div>
      <p className="text-white text-sm md:text-base leading-relaxed max-w-[200px]">
        {step.description}
      </p>
    </motion.div>
  );
};

export function RoutineCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setProgress(0);
    });
  }, [api]);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [current]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <section className="py-16 md:py-24 bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="inline-block bg-primary text-primary-foreground font-bold text-2xl md:text-4xl px-8 py-3 rounded-lg">
            Veja como funciona sua rotina<br className="hidden md:block" /> na Contabilidade Zen
          </h2>
        </div>

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
          <CarouselContent>
            {/* Slide 1: Responsibilities Split */}
            <CarouselItem>
              <div className="flex flex-col lg:flex-row min-h-[500px] rounded-2xl overflow-hidden">
                {/* Client Side - Purple */}
                <div className="flex-1 bg-gradient-to-br from-violet-700 to-purple-600 p-8 md:p-12">
                  <div className="bg-violet-800/50 rounded-xl p-4 mb-8 text-center">
                    <h3 className="text-white font-semibold text-lg md:text-xl">
                      Únicas etapas que são sua responsabilidade
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                    {clientSteps.map((step, index) => (
                      <StepCard 
                        key={step.number} 
                        step={step} 
                        index={index} 
                        variant="client" 
                      />
                    ))}
                  </div>
                </div>

                {/* Separator with Badge */}
                <div className="relative flex items-center justify-center py-6 lg:py-0 lg:px-4 bg-slate-800 lg:bg-transparent">
                  <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10">
                    <div className="bg-emerald-500 text-white text-center p-4 md:p-5 rounded-full shadow-lg shadow-emerald-500/40 max-w-[140px]">
                      <span className="text-xs md:text-sm font-bold leading-tight block">
                        Todo o restante a Contabilidade Zen cuidará por você!
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:block absolute top-8 bottom-8 left-1/2 w-0.5 bg-white/20" />
                </div>

                {/* Zen Side - Orange */}
                <div className="flex-1 bg-gradient-to-br from-orange-600 to-amber-500 p-8 md:p-12">
                  <div className="bg-orange-700/50 rounded-xl p-4 mb-8 text-center">
                    <h3 className="text-white font-semibold text-lg md:text-xl">
                      Todo o restante a Contabilidade Zen cuidará por você!
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    {zenSteps.map((step, index) => (
                      <StepCard 
                        key={step.number} 
                        step={step} 
                        index={index + 2} 
                        variant="zen" 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2: Support */}
            <CarouselItem>
              <div className="min-h-[500px] bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl p-8 md:p-16 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl"
                >
                  {/* Badge */}
                  <span className="inline-block bg-white/20 text-white text-xs md:text-sm font-bold uppercase tracking-wider px-6 py-2 rounded-full mb-6">
                    Suporte Especializado
                  </span>

                  {/* Icon */}
                  <div className="mb-6">
                    <Headphones className="h-16 w-16 text-white mx-auto" />
                  </div>

                  {/* Headline */}
                  <h3 className="text-white font-bold text-2xl md:text-4xl leading-tight mb-6">
                    Acesso constante ao nosso suporte<br className="hidden md:block" /> online especializado em todas as etapas
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                    Na Contabilidade Zen você não contrata uma plataforma automatizada para processar suas informações.
                    <br /><br />
                    <strong>São pessoas de verdade</strong> que cuidam com total zelo das informações e obrigações contábeis enquanto você foca no crescimento da sua empresa.
                  </p>

                  {/* CTA */}
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-white/90 font-semibold text-base md:text-lg px-8 py-6 rounded-xl shadow-lg"
                    asChild
                  >
                    <a
                      href="https://wa.me/5519974158342?text=Olá!%20Quero%20saber%20mais%20sobre%20a%20Contabilidade%20Zen."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Fale com um especialista
                    </a>
                  </Button>
                </motion.div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* Navigation Dots & Progress */}
        <div className="flex flex-col items-center mt-8 gap-4">
          {/* Dots */}
          <div className="flex gap-3">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${current === index 
                    ? "bg-emerald-500 scale-125" 
                    : "bg-white/30 hover:bg-white/50"
                  }
                `}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
