import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, ChevronDown, Award } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const benefits = [
  { icon: Calculator, title: "Planejamento Tributário Digital", description: "Análise completa para escolher entre Anexo III e V do Simples Nacional, Lucro Presumido ou MEI. Garantimos a menor carga tributária legal para seu negócio digital." },
  { icon: FileCheck, title: "Nota Fiscal Automatizada", description: "Emissão automática de NFS-e para vendas em Hotmart, Eduzz, Monetizze e Kiwify. Sem burocracia, sem atrasos." },
  { icon: BarChart3, title: "Gestão Multi-Plataforma", description: "Controle organizado de receitas de múltiplas plataformas e fontes de renda. Saiba exatamente quanto fatura em cada canal." },
  { icon: Shield, title: "Compliance e Segurança", description: "Regularidade total com a Receita Federal. Evite malha fina, multas e problemas com plataformas que exigem nota fiscal." },
  { icon: Clock, title: "Economia de Tempo", description: "Automatizamos obrigações acessórias e declarações. Mais tempo para criar conteúdo e escalar suas vendas." },
  { icon: Users, title: "Atendimento Especializado", description: "Contador dedicado que entende o mercado digital, plataformas de infoprodutos e a realidade do produtor online." },
];

export function ProdutoresDigitaisBenefits() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  const toggle = (index: number) => { setOpenIndex((prev) => (prev === index ? null : index)); };

  return (
    <section className="py-16 lg:py-24 bg-[#FAF5FF]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#7E22CE] uppercase tracking-wider">Nossos Benefícios</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Como nossa contabilidade para produtores digitais escala seu negócio?</h2>
          <p className="text-muted-foreground text-lg">Clique em cada benefício para saber mais</p>
        </div>
        <div className="flex flex-col lg:flex-row items-start max-w-6xl mx-auto">
          <div className="w-full lg:w-[40%] flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24">
            <div className="mx-auto max-w-[320px] lg:max-w-none">
              <div className="relative rounded-[32px] rounded-bl-[80px] overflow-hidden shadow-lg">
                <img src="/images/hero-founder.webp" alt="Thomas Broek — Contador especializado em produtores digitais" width={480} height={600} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-[4/5]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <p className="font-bold text-lg leading-tight">Thomas Broek</p>
                  <p className="text-white/80 text-sm">CRC-SP 1SP337693/O-7</p>
                  <p className="text-white/70 text-xs mt-0.5">Contador especializado em produtores digitais</p>
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
                    <div className={`rounded-xl border bg-card transition-shadow duration-200 ${isOpen ? "border-[#9333EA]/40 shadow-md" : "border-border hover:shadow-sm"}`}>
                      <CollapsibleTrigger className="flex w-full items-center gap-3 p-5 text-left cursor-pointer">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#9333EA]/10"><benefit.icon className="h-5 w-5 text-[#9333EA]" /></div>
                        <span className="flex-1 font-semibold text-foreground">{benefit.title}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{benefit.description}</p>
                          <Button size="sm" variant="outline" className="border-[#9333EA]/30 text-[#9333EA] hover:bg-[#9333EA]/10 hover:text-[#7E22CE]" onClick={(e) => { e.stopPropagation(); scrollToForm(); }}>Quero esse benefício</Button>
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
          <Button size="lg" className="bg-[#9333EA] hover:bg-[#7E22CE] text-white" onClick={scrollToForm}>Escale seu negócio digital agora</Button>
        </div>
      </div>
    </section>
  );
}
