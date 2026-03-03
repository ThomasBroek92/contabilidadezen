import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CheckCircle, FileText, Send, Calculator, FileCheck, ClipboardCheck, BarChart3, Handshake, ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
interface ProcessStep { number: string; title: string; description: string; icon: React.ElementType; owner: "client" | "zen"; }
const steps: ProcessStep[] = [
  { number: "01", title: "Escolha nosso serviço", description: "Decida contratar nossos serviços para otimizar a tributação da sua exportação de serviços.", icon: CheckCircle, owner: "client" },
  { number: "02", title: "Preencha o formulário", description: "Informe seus dados e detalhes da operação internacional.", icon: FileText, owner: "client" },
  { number: "03", title: "Envie os seus dados", description: "Nossa equipe agendará sua reunião rapidamente.", icon: Send, owner: "client" },
  { number: "04", title: "Processamento Contábil", description: "Analisamos sua operação e estruturamos a melhor tributação.", icon: Calculator, owner: "zen" },
  { number: "05", title: "Impostos e Fechamentos", description: "Calculamos impostos com todas as isenções aplicáveis.", icon: FileCheck, owner: "zen" },
  { number: "06", title: "Obrigações Acessórias", description: "Entregamos declarações e obrigações cambiais nos prazos.", icon: ClipboardCheck, owner: "zen" },
  { number: "07", title: "Demonstrativos Anuais", description: "Demonstrativos contábeis anuais. Negócio 100% regular!", icon: BarChart3, owner: "zen" },
  { number: "08", title: "Formalize a contratação", description: "Aguarde contato para formalizar e começar a economizar.", icon: Handshake, owner: "client" },
];
function StepCard({ step, index }: { step: ProcessStep; index: number }) {
  const Icon = step.icon; const isClient = step.owner === "client"; const rm = useReducedMotion();
  return (<div className={`relative h-full rounded-2xl p-6 md:p-8 transition-all duration-300 border-2 group hover:scale-[1.02] hover:shadow-xl ${isClient ? "bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] border-[#2563EB]/20 hover:border-[#2563EB]/40" : "bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 hover:border-secondary/40"}`} style={{ animationDelay: rm ? "0ms" : `${index * 100}ms` }}>
    <div className="flex items-center justify-between mb-6"><span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${isClient ? "bg-[#2563EB]/10 text-[#1D4ED8]" : "bg-secondary/10 text-secondary"}`}>{isClient ? "Sua Parte" : "Contabilidade Zen"}</span><span className={`text-3xl md:text-4xl font-black ${isClient ? "text-[#2563EB]/20" : "text-secondary/20"}`}>{step.number}</span></div>
    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${isClient ? "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]" : "bg-gradient-to-br from-secondary to-accent"}`}><Icon className="h-7 w-7 md:h-8 md:w-8 text-white" /></div>
    <h3 className={`font-bold text-lg md:text-xl mb-3 ${isClient ? "text-[#1E3A8A]" : "text-foreground"}`}>{step.title}</h3><p className="text-muted-foreground text-sm md:text-base leading-relaxed">{step.description}</p>
    <div className={`absolute bottom-0 right-0 w-24 h-24 rounded-tl-[4rem] opacity-10 ${isClient ? "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]" : "bg-gradient-to-br from-secondary to-accent"}`} />
  </div>);
}
export function ExportacaoServicosProcess() {
  const [api, setApi] = useState<CarouselApi>(); const [current, setCurrent] = useState(0); const [count, setCount] = useState(0);
  const ap = Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true });
  useEffect(() => { if (!api) return; setCount(api.scrollSnapList().length); setCurrent(api.selectedScrollSnap()); api.on("select", () => setCurrent(api.selectedScrollSnap())); }, [api]);
  const cc = steps.filter(s => s.owner === "client").length; const zc = steps.filter(s => s.owner === "zen").length;
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="py-16 md:py-24 bg-[#DBEAFE]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6"><span className="inline-block text-[#1D4ED8] font-semibold text-sm uppercase tracking-wider mb-3">Processo Simplificado</span><h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Exporte serviços com{" "}<span className="text-[#2563EB]">tranquilidade fiscal</span></h2><p className="text-muted-foreground text-lg max-w-2xl mx-auto">Você cuida de{" "}<strong className="text-[#1D4ED8]">{cc} etapas simples</strong>, nós de{" "}<strong className="text-secondary">{zc} processos complexos</strong></p></div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10"><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]" /><span className="text-sm font-medium text-muted-foreground">Sua responsabilidade</span></div><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-accent" /><span className="text-sm font-medium text-muted-foreground">Contabilidade Zen cuida</span></div></div>
        <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} plugins={[ap]} className="w-full"><CarouselContent className="-ml-4">{steps.map((s, i) => (<CarouselItem key={s.number} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"><StepCard step={s} index={i} /></CarouselItem>))}</CarouselContent><div className="hidden md:block"><CarouselPrevious className="left-0 -translate-x-1/2 bg-background border-border hover:bg-muted" /><CarouselNext className="right-0 translate-x-1/2 bg-background border-border hover:bg-muted" /></div></Carousel>
        <div className="flex items-center justify-center gap-0 mt-8">{Array.from({ length: count }).map((_, i) => (<button key={i} onClick={() => api?.scrollTo(i)} className="p-[7px] cursor-pointer" aria-label={`Slide ${i+1}`}><span className={`block h-2.5 rounded-full transition-all duration-300 ${current === i ? "bg-[#2563EB] w-8" : "w-2.5 bg-muted-foreground/30"}`} /></button>))}</div>
        <div className="text-center mt-10"><Button size="lg" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold gap-2" onClick={scrollToForm}>Comece agora<ArrowRight className="h-4 w-4" /></Button></div>
      </div>
    </section>
  );
}
