import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, ChevronDown, Award } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const benefits = [
  { icon: Calculator, title: "Planejamento Tributário Tech", description: "Análise para escolher entre Simples Nacional (Anexo III com Fator R), Lucro Presumido ou MEI. Garantimos a menor carga tributária para devs." },
  { icon: FileCheck, title: "Contratos PJ Organizados", description: "Gestão contábil de múltiplos contratos PJ com empresas. Nota fiscal, impostos e obrigações sempre em dia." },
  { icon: BarChart3, title: "Recebimentos do Exterior", description: "Orientação para freelancers que recebem em dólar/euro. Câmbio, tributação e compliance sem dor de cabeça." },
  { icon: Shield, title: "Fator R Estratégico", description: "Otimizamos seu pró-labore para garantir enquadramento no Anexo III (6%) em vez do Anexo V (15,5%). Economia real." },
  { icon: Clock, title: "Burocracia Zero", description: "Cuidamos de DARF, SPED e todas as obrigações. Você foca em codar, nós na papelada." },
  { icon: Users, title: "Atendimento Especializado", description: "Contador dedicado que entende a realidade de devs, freelancers tech e profissionais de TI." },
];

export function ProfissionaisTIBenefits() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <section className="py-16 lg:py-24 bg-[#F0FDFA]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#0E7490] uppercase tracking-wider">Nossos Benefícios</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Como nossa contabilidade para TI otimiza suas finanças?</h2>
          <p className="text-muted-foreground text-lg">Clique em cada benefício para saber mais</p>
        </div>
        <div className="flex flex-col lg:flex-row items-start max-w-6xl mx-auto">
          <div className="w-full lg:w-[40%] flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24">
            <div className="mx-auto max-w-[320px] lg:max-w-none">
              <div className="relative rounded-[32px] rounded-bl-[80px] overflow-hidden shadow-lg">
                <img src="/images/hero-founder.webp" alt="Thomas Broek — Contador especializado em profissionais de TI" width={480} height={600} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-[4/5]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center"><p className="font-bold text-lg leading-tight">Thomas Broek</p><p className="text-white/80 text-sm">CRC-SP 1SP337693/O-7</p><p className="text-white/70 text-xs mt-0.5">Contador especializado em profissionais de TI</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Award className="h-4 w-4 text-secondary" /></div><div><p className="font-bold text-foreground text-sm leading-tight">10+</p><p className="text-muted-foreground text-xs">Anos de experiência</p></div></div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Users className="h-4 w-4 text-secondary" /></div><div><p className="font-bold text-foreground text-sm leading-tight">200+</p><p className="text-muted-foreground text-xs">Clientes atendidos</p></div></div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[65%] lg:-ml-8 relative z-10">
            <div className="space-y-3">
              {benefits.map((benefit, index) => {
                const isOpen = openIndex === index;
                return (
                  <Collapsible key={index} open={isOpen} onOpenChange={() => setOpenIndex(prev => prev === index ? null : index)}>
                    <div className={`rounded-xl border bg-card transition-shadow duration-200 ${isOpen ? "border-[#0891B2]/40 shadow-md" : "border-border hover:shadow-sm"}`}>
                      <CollapsibleTrigger className="flex w-full items-center gap-3 p-5 text-left cursor-pointer">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0891B2]/10"><benefit.icon className="h-5 w-5 text-[#0891B2]" /></div>
                        <span className="flex-1 font-semibold text-foreground">{benefit.title}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <div className="px-5 pb-5 pt-0"><p className="text-muted-foreground text-sm leading-relaxed mb-4">{benefit.description}</p><Button size="sm" variant="outline" className="border-[#0891B2]/30 text-[#0891B2] hover:bg-[#0891B2]/10 hover:text-[#0E7490]" onClick={(e) => { e.stopPropagation(); scrollToForm(); }}>Quero esse benefício</Button></div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-center mt-12"><Button size="lg" className="bg-[#0891B2] hover:bg-[#0E7490] text-white" onClick={scrollToForm}>Otimize seus impostos agora</Button></div>
      </div>
    </section>
  );
}
