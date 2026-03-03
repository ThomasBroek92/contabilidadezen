import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, ChevronDown, Award } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const benefits = [
  { icon: Calculator, title: "Planejamento Tributário Internacional", description: "Análise completa da tributação para exportação de serviços. Aproveitamos todas as isenções e benefícios fiscais disponíveis." },
  { icon: FileCheck, title: "Isenção de ISS", description: "Orientamos sobre a isenção de ISS prevista na LC 116/2003 para exportação de serviços, economizando até 5% do faturamento." },
  { icon: BarChart3, title: "Gestão de Câmbio", description: "Controle organizado de recebimentos em moeda estrangeira. Compliance com Banco Central e declarações obrigatórias." },
  { icon: Shield, title: "Contratos Internacionais", description: "Orientação contábil e fiscal para contratos com clientes no exterior. Evite riscos e maximize benefícios." },
  { icon: Clock, title: "Obrigações Simplificadas", description: "Cuidamos de DARF, SPED, declarações de câmbio e todas as obrigações. Você foca nos clientes internacionais." },
  { icon: Users, title: "Atendimento Especializado", description: "Contador dedicado que entende operações internacionais, câmbio e a realidade de quem exporta serviços." },
];
export function ExportacaoServicosBenefits() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="py-16 lg:py-24 bg-[#EFF6FF]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12"><span className="text-sm font-semibold text-[#1D4ED8] uppercase tracking-wider">Nossos Benefícios</span><h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Como nossa contabilidade otimiza sua exportação de serviços?</h2><p className="text-muted-foreground text-lg">Clique em cada benefício para saber mais</p></div>
        <div className="flex flex-col lg:flex-row items-start max-w-6xl mx-auto">
          <div className="w-full lg:w-[40%] flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24"><div className="mx-auto max-w-[320px] lg:max-w-none"><div className="relative rounded-[32px] rounded-bl-[80px] overflow-hidden shadow-lg"><img src="/images/hero-founder.webp" alt="Thomas Broek — Contador especializado em exportação de serviços" width={480} height={600} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-[4/5]" /><div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-4 left-4 right-4 text-white text-center"><p className="font-bold text-lg leading-tight">Thomas Broek</p><p className="text-white/80 text-sm">CRC-SP 1SP337693/O-7</p><p className="text-white/70 text-xs mt-0.5">Especialista em operações internacionais</p></div></div><div className="grid grid-cols-2 gap-3 mt-4"><div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Award className="h-4 w-4 text-secondary" /></div><div><p className="font-bold text-foreground text-sm leading-tight">10+</p><p className="text-muted-foreground text-xs">Anos de experiência</p></div></div><div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Users className="h-4 w-4 text-secondary" /></div><div><p className="font-bold text-foreground text-sm leading-tight">200+</p><p className="text-muted-foreground text-xs">Clientes atendidos</p></div></div></div></div></div>
          <div className="w-full lg:w-[65%] lg:-ml-8 relative z-10"><div className="space-y-3">{benefits.map((b, i) => { const isOpen = openIndex === i; return (<Collapsible key={i} open={isOpen} onOpenChange={() => setOpenIndex(prev => prev === i ? null : i)}><div className={`rounded-xl border bg-card transition-shadow duration-200 ${isOpen ? "border-[#2563EB]/40 shadow-md" : "border-border hover:shadow-sm"}`}><CollapsibleTrigger className="flex w-full items-center gap-3 p-5 text-left cursor-pointer"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10"><b.icon className="h-5 w-5 text-[#2563EB]" /></div><span className="flex-1 font-semibold text-foreground">{b.title}</span><ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} /></CollapsibleTrigger><CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"><div className="px-5 pb-5 pt-0"><p className="text-muted-foreground text-sm leading-relaxed mb-4">{b.description}</p><Button size="sm" variant="outline" className="border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB]/10" onClick={e => { e.stopPropagation(); scrollToForm(); }}>Quero esse benefício</Button></div></CollapsibleContent></div></Collapsible>); })}</div></div>
        </div>
        <div className="text-center mt-12"><Button size="lg" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={scrollToForm}>Otimize sua exportação agora</Button></div>
      </div>
    </section>
  );
}
