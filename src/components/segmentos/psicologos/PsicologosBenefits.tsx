import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, ChevronDown, Award } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const benefits = [
  { icon: Calculator, title: "Planejamento Tributário", description: "Com o nosso planejamento tributário especializado, você vai pagar menos impostos e evitar surpresas fiscais, garantindo a melhor estratégia para o seu consultório." },
  { icon: FileCheck, title: "Burocracia Zero", description: "Esqueça a burocracia! Nossa equipe cuida de toda a parte fiscal e burocrática para você, liberando seu tempo para focar no que realmente importa: seus pacientes." },
  { icon: BarChart3, title: "Melhor Controle Financeiro", description: "Com o apoio de nossos especialistas, seu consultório terá controle total sobre as finanças. Evite juros, pendências e organize sua gestão para maximizar o lucro." },
  { icon: Shield, title: "Segurança e Conformidade", description: "Mantenha seu consultório em dia com todas as obrigações fiscais, CRP e evite multas e penalidades. Trabalhamos para garantir sua tranquilidade." },
  { icon: Clock, title: "Economia de Tempo", description: "Automatizamos processos e cuidamos de toda a papelada para que você possa dedicar mais tempo aos seus pacientes e menos às burocracias." },
  { icon: Users, title: "Atendimento Humanizado", description: "Você terá um contador dedicado que entende as particularidades da área de psicologia e está sempre disponível para esclarecer suas dúvidas." },
];

export function PsicologosBenefits() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  const toggle = (index: number) => { setOpenIndex((prev) => (prev === index ? null : index)); };

  return (
    <section className="py-16 lg:py-24 bg-[#F5F3FF]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#7C3AED] uppercase tracking-wider">Nossos Benefícios</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Como nossa contabilidade para psicólogos organiza suas finanças?</h2>
          <p className="text-muted-foreground text-lg">Clique em cada benefício para saber mais</p>
        </div>
        <div className="flex flex-col lg:flex-row items-start max-w-6xl mx-auto">
          <div className="w-full lg:w-[40%] flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24">
            <div className="mx-auto max-w-[320px] lg:max-w-none">
              <div className="relative rounded-[32px] rounded-bl-[80px] overflow-hidden shadow-lg">
                <img src="/images/hero-founder.webp" alt="Thomas Broek — Contador especializado em profissionais da saúde" width={480} height={600} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-[4/5]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <p className="font-bold text-lg leading-tight">Thomas Broek</p>
                  <p className="text-white/80 text-sm">CRC-SP 1SP337693/O-7</p>
                  <p className="text-white/70 text-xs mt-0.5">Contador especializado em profissionais da saúde</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Award className="h-4 w-4 text-secondary" /></div>
                  <div><p className="font-bold text-foreground text-sm leading-tight">10+</p><p className="text-muted-foreground text-xs">Anos de experiência</p></div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20"><Users className="h-4 w-4 text-secondary" /></div>
                  <div><p className="font-bold text-foreground text-sm leading-tight">200+</p><p className="text-muted-foreground text-xs">Psicólogos atendidos</p></div>
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
                    <div className={`rounded-xl border bg-card transition-shadow duration-200 ${isOpen ? "border-[#8B5CF6]/40 shadow-md" : "border-border hover:shadow-sm"}`}>
                      <CollapsibleTrigger className="flex w-full items-center gap-3 p-5 text-left cursor-pointer">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#8B5CF6]/10"><benefit.icon className="h-5 w-5 text-[#8B5CF6]" /></div>
                        <span className="flex-1 font-semibold text-foreground">{benefit.title}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{benefit.description}</p>
                          <Button size="sm" variant="outline" className="border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 hover:text-[#7C3AED]" onClick={(e) => { e.stopPropagation(); scrollToForm(); }}>Quero esse benefício</Button>
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
          <Button size="lg" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white" onClick={scrollToForm}>Elimine as burocracias ainda hoje</Button>
        </div>
      </div>
    </section>
  );
}
