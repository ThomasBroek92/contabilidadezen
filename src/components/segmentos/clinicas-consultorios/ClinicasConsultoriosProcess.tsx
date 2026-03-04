import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CheckCircle, FileText, Send, Calculator, FileCheck, ClipboardCheck, BarChart3, Handshake, ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ProcessStep { number: string; title: string; description: string; icon: React.ElementType; owner: "client" | "zen"; }

const steps: ProcessStep[] = [
  { number: "01", title: "Escolha nosso serviço", description: "Decida contratar nossos serviços especializados para otimizar a contabilidade da sua clínica ou consultório.", icon: CheckCircle, owner: "client" },
  { number: "02", title: "Preencha o formulário", description: "Informe o tipo de estabelecimento, faturamento, número de funcionários e convênios atendidos.", icon: FileText, owner: "client" },
  { number: "03", title: "Envie os seus dados", description: "Envie suas informações. Nossa equipe agendará sua consultoria de planejamento tributário.", icon: Send, owner: "client" },
  { number: "04", title: "Planejamento Tributário", description: "Analisamos equiparação hospitalar, melhor regime tributário e estruturação societária ideal para sua clínica.", icon: Calculator, owner: "zen" },
  { number: "05", title: "Impostos e Fechamentos", description: "Elaboramos e enviamos os impostos, folha de pagamento e fechamentos mensais com total transparência.", icon: FileCheck, owner: "zen" },
  { number: "06", title: "Obrigações Acessórias", description: "Entregamos DMED, SPED, EFD-Contribuições e todas as obrigações da área de saúde nos prazos corretos.", icon: ClipboardCheck, owner: "zen" },
  { number: "07", title: "Demonstrativos Anuais", description: "Emitimos os demonstrativos contábeis anuais. Sua clínica 100% regular!", icon: BarChart3, owner: "zen" },
  { number: "08", title: "Formalize a contratação", description: "Aguarde o contato de um especialista para formalizar a contratação e começar a economizar.", icon: Handshake, owner: "client" },
];

function StepCard({ step, index }: { step: ProcessStep; index: number }) {
  const Icon = step.icon;
  const isClient = step.owner === "client";
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className={`relative h-full rounded-2xl p-6 md:p-8 transition-all duration-300 border-2 group hover:scale-[1.02] hover:shadow-xl ${isClient ? "bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] border-[#059669]/20 hover:border-[#059669]/40" : "bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 hover:border-secondary/40"}`} style={{ animationDelay: shouldReduceMotion ? "0ms" : `${index * 100}ms` }}>
      <div className="flex items-center justify-between mb-6">
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${isClient ? "bg-[#059669]/10 text-[#047857]" : "bg-secondary/10 text-secondary"}`}>{isClient ? "Sua Parte" : "Contabilidade Zen"}</span>
        <span className={`text-3xl md:text-4xl font-black ${isClient ? "text-[#059669]/20" : "text-secondary/20"}`}>{step.number}</span>
      </div>
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${isClient ? "bg-gradient-to-br from-[#059669] to-[#047857]" : "bg-gradient-to-br from-secondary to-accent"}`}><Icon className="h-7 w-7 md:h-8 md:w-8 text-white" /></div>
      <h3 className={`font-bold text-lg md:text-xl mb-3 ${isClient ? "text-[#064E3B]" : "text-foreground"}`}>{step.title}</h3>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{step.description}</p>
      <div className={`absolute bottom-0 right-0 w-24 h-24 rounded-tl-[4rem] opacity-10 ${isClient ? "bg-gradient-to-br from-[#059669] to-[#047857]" : "bg-gradient-to-br from-secondary to-accent"}`} />
    </div>
  );
}

export function ClinicasConsultoriosProcess() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoplayPlugin = Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true });
  useEffect(() => { if (!api) return; setCount(api.scrollSnapList().length); setCurrent(api.selectedScrollSnap()); api.on("select", () => setCurrent(api.selectedScrollSnap())); }, [api]);
  const clientCount = steps.filter((s) => s.owner === "client").length;
  const zenCount = steps.filter((s) => s.owner === "zen").length;
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <section className="py-16 md:py-24 bg-[#D1FAE5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block text-[#047857] font-semibold text-sm uppercase tracking-wider mb-3">Processo Simplificado</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Organize a contabilidade da sua{" "}<span className="text-[#059669]">clínica em 8 passos</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Você cuida apenas de{" "}<strong className="text-[#047857]">{clientCount} etapas simples</strong>, nós cuidamos de{" "}<strong className="text-secondary">{zenCount} processos complexos</strong></p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#059669] to-[#047857]" /><span className="text-sm font-medium text-muted-foreground">Sua responsabilidade</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-accent" /><span className="text-sm font-medium text-muted-foreground">Contabilidade Zen cuida</span></div>
        </div>
        <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} plugins={[autoplayPlugin]} className="w-full">
          <CarouselContent className="-ml-4">{steps.map((step, index) => (<CarouselItem key={step.number} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"><StepCard step={step} index={index} /></CarouselItem>))}</CarouselContent>
          <div className="hidden md:block"><CarouselPrevious className="left-0 -translate-x-1/2 bg-background border-border hover:bg-muted" /><CarouselNext className="right-0 translate-x-1/2 bg-background border-border hover:bg-muted" /></div>
        </Carousel>
        <div className="flex items-center justify-center gap-0 mt-8">{Array.from({ length: count }).map((_, index) => (<button key={index} onClick={() => api?.scrollTo(index)} className="p-[7px] cursor-pointer" aria-label={`Ir para slide ${index + 1}`}><span className={`block h-2.5 rounded-full transition-all duration-300 ${current === index ? "bg-[#059669] w-8" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`} /></button>))}</div>
        <div className="text-center mt-10"><Button size="lg" className="bg-[#059669] hover:bg-[#047857] text-white font-semibold gap-2" onClick={scrollToForm}>Comece agora<ArrowRight className="h-4 w-4" /></Button></div>
      </div>
    </section>
  );
}
