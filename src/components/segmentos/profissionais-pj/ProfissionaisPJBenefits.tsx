import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, ChevronDown, Award } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const benefits = [
  { icon: Calculator, title: "Planejamento Tributário PJ", description: "Análise completa para escolher o melhor regime tributário na transição CLT→PJ. Simples Nacional, Lucro Presumido ou MEI — garantimos a maior economia legal." },
  { icon: FileCheck, title: "Abertura de Empresa Simplificada", description: "Cuidamos de toda a burocracia: CNPJ, Inscrição Municipal, alvará e registro na Junta Comercial. Você foca no trabalho." },
  { icon: BarChart3, title: "Pró-labore Otimizado", description: "Definimos o pró-labore ideal para maximizar sua economia via Fator R, reduzindo impostos de 15,5% para 6% no Simples Nacional." },
  { icon: Shield, title: "Segurança na Transição CLT→PJ", description: "Orientação completa sobre direitos, rescisão e planejamento financeiro para uma transição segura e vantajosa." },
  { icon: Clock, title: "Zero Burocracia", description: "Automatizamos NFS-e, impostos, declarações e obrigações acessórias. Mais tempo para entregar resultados no seu trabalho." },
  { icon: Users, title: "Contador Dedicado para PJs", description: "Atendimento com profissional que entende contratos PJ, múltiplas fontes de renda e a realidade do profissional que migrou de CLT." },
];

export function ProfissionaisPJBenefits() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  const toggle = (index: number) => { setOpenIndex((prev) => (prev === index ? null : index)); };

  return (
    <section className="py-16 lg:py-24 bg-[#EEF2FF]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#4338CA] uppercase tracking-wider">Nossos Benefícios</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Por que profissionais PJ escolhem a Contabilidade Zen?</h2>
          <p className="text-muted-foreground text-lg">Clique em cada benefício para saber mais</p>
        </div>
        <div className="flex flex-col lg:flex-row items-start max-w-6xl mx-auto">
          <div className="w-full lg:w-[40%] flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24">
            <div className="mx-auto max-w-[320px] lg:max-w-none">
              <div className="relative rounded-[32px] rounded-bl-[80px] overflow-hidden shadow-lg">
                <img src="/images/hero-founder.webp" alt="Thomas Broek — Contador especializado em profissionais PJ" width={480} height={600} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-[4/5]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <p className="font-bold text-lg leading-tight">Thomas Broek</p>
                  <p className="text-white/80 text-sm">CRC-SP 1SP337693/O-7</p>
                  <p className="text-white/70 text-xs mt-0.5">Contador especializado em profissionais PJ</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Award className="h-4 w-4 text-secondary" /></div>
                  <div><p className="font-bold text-foreground text-sm leading-tight">10+</p><p className="text-muted-foreground text-xs">Anos de experiência</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Users className="h-4 w-4 text-secondary" /></div>
                  <div><p className="font-bold text-foreground text-sm leading-tight">200+</p><p className="text-muted-foreground text-xs">Clientes atendidos</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[65%] lg:-ml-8 relative z-10">
            <div className="space-y-3">
              {benefits.map((benefit, index) => {
                const isOpen = openIndex === index;
                return (
                  <Collapsible key={index} open={isOpen} onOpenChange={() => toggle(index)}>
                    <div className={`rounded-xl border bg-card transition-shadow duration-200 ${isOpen ? "border-[#4F46E5]/40 shadow-md" : "border-border hover:shadow-sm"}`}>
                      <CollapsibleTrigger className="flex w-full items-center gap-3 p-5 text-left cursor-pointer">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5]/10"><benefit.icon className="h-5 w-5 text-[#4F46E5]" /></div>
                        <span className="flex-1 font-semibold text-foreground">{benefit.title}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{benefit.description}</p>
                          <Button size="sm" variant="outline" className="border-[#4F46E5]/30 text-[#4F46E5] hover:bg-[#4F46E5]/10 hover:text-[#4338CA]" onClick={(e) => { e.stopPropagation(); scrollToForm(); }}>Quero esse benefício</Button>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <Button size="lg" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white" onClick={scrollToForm}>Comece sua jornada PJ agora</Button>
        </div>
      </div>
    </section>
  );
}
