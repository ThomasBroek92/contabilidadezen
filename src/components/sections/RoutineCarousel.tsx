import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { 
  FileText, 
  Upload, 
  Calculator, 
  FileCheck, 
  BarChart3, 
  ClipboardCheck,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface RoutineStep {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  owner: "client" | "zen";
}

const routineSteps: RoutineStep[] = [
  {
    number: "01",
    title: "Vendas e Notas Fiscais",
    description: "Você realiza suas vendas ou serviços e emite suas notas fiscais normalmente",
    icon: FileText,
    owner: "client",
  },
  {
    number: "02",
    title: "Envio de Documentos",
    description: "Envia suas despesas e notas fiscais recebidas durante o mês pelo nosso portal",
    icon: Upload,
    owner: "client",
  },
  {
    number: "03",
    title: "Processamento Contábil",
    description: "Nosso time de contadores especialistas processa todas as informações enviadas",
    icon: Calculator,
    owner: "zen",
  },
  {
    number: "04",
    title: "Impostos e Fechamentos",
    description: "Elaboramos e enviamos os seus impostos, taxas e fechamentos mensais",
    icon: FileCheck,
    owner: "zen",
  },
  {
    number: "05",
    title: "Obrigações Acessórias",
    description: "Entregamos todas as obrigações acessórias e declarações da sua empresa",
    icon: ClipboardCheck,
    owner: "zen",
  },
  {
    number: "06",
    title: "Demonstrativos Anuais",
    description: "Emitimos os demonstrativos contábeis anuais. Seu negócio 100% regular!",
    icon: BarChart3,
    owner: "zen",
  },
];

function StepCard({ step }: { step: RoutineStep }) {
  const Icon = step.icon;
  const isClient = step.owner === "client";

  return (
    <div
      className={`
        relative h-full rounded-2xl p-6 md:p-8 transition-all duration-300
        border-2 group hover:scale-[1.02] hover:shadow-xl
        ${isClient 
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 hover:border-amber-300" 
          : "bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 hover:border-secondary/40"
        }
      `}
    >
      {/* Owner Badge */}
      <div className="flex items-center justify-between mb-6">
        <span
          className={`
            text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full
            ${isClient 
              ? "bg-amber-100 text-amber-700" 
              : "bg-secondary/10 text-secondary"
            }
          `}
        >
          {isClient ? "Sua Parte" : "Contabilidade Zen"}
        </span>
        <span
          className={`
            text-3xl md:text-4xl font-black
            ${isClient ? "text-amber-300" : "text-secondary/20"}
          `}
        >
          {step.number}
        </span>
      </div>

      {/* Icon */}
      <div
        className={`
          w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-5
          transition-transform duration-300 group-hover:scale-110
          ${isClient 
            ? "bg-gradient-to-br from-amber-400 to-orange-500" 
            : "bg-gradient-to-br from-secondary to-accent"
          }
        `}
      >
        <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
      </div>

      {/* Content */}
      <h3
        className={`
          font-bold text-lg md:text-xl mb-3
          ${isClient ? "text-amber-900" : "text-foreground"}
        `}
      >
        {step.title}
      </h3>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
        {step.description}
      </p>

      {/* Decorative Element */}
      <div
        className={`
          absolute bottom-0 right-0 w-24 h-24 rounded-tl-[4rem] opacity-10
          ${isClient 
            ? "bg-gradient-to-br from-amber-400 to-orange-500" 
            : "bg-gradient-to-br from-secondary to-accent"
          }
        `}
      />
    </div>
  );
}

export function RoutineCarousel() {
  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  });

  const clientStepsCount = routineSteps.filter(s => s.owner === "client").length;
  const zenStepsCount = routineSteps.filter(s => s.owner === "zen").length;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Processo Simplificado
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Como funciona sua rotina<br className="hidden sm:block" /> 
            <span className="text-gradient">na Contabilidade Zen</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Você cuida apenas de <strong className="text-amber-600">{clientStepsCount} etapas simples</strong>, 
            nós cuidamos de <strong className="text-secondary">{zenStepsCount} processos complexos</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">Sua responsabilidade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-accent" />
            <span className="text-sm font-medium text-muted-foreground">Contabilidade Zen cuida</span>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {routineSteps.map((step) => (
              <CarouselItem 
                key={step.number} 
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <StepCard step={step} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-1/2 bg-background border-border hover:bg-muted" />
            <CarouselNext className="right-0 translate-x-1/2 bg-background border-border hover:bg-muted" />
          </div>
        </Carousel>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold gap-2"
            asChild
          >
            <Link to="/abrir-empresa">
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
