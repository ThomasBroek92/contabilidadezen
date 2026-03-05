import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, FileCheck, Globe, Shield, Zap, Users, ChevronDown, Award } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const benefits = [
  { icon: DollarSign, title: "AdSense e Monetização Otimizados", description: "Receba do Google, YouTube, Twitch e outras plataformas pelo CNPJ. Reduza impostos de 27,5% para até 6% no Simples Nacional." },
  { icon: FileCheck, title: "Nota Fiscal para Publis e Marcas", description: "Emissão de NF-e para contratos com marcas, agências e patrocinadores. Nunca mais perca uma parceria por falta de CNPJ." },
  { icon: Globe, title: "Receitas Internacionais Regularizadas", description: "Tratamos corretamente recebimentos em dólar/euro de plataformas internacionais. Câmbio, contrato de câmbio e declaração tudo em dia." },
  { icon: Shield, title: "Direitos Autorais e Licenciamento", description: "Enquadramento correto de royalties, cessão de direitos e licenciamento de conteúdo com tratamento tributário adequado." },
  { icon: Zap, title: "Abertura de CNPJ Rápida", description: "Abrimos seu CNPJ com o CNAE correto para criadores de conteúdo em até 7 dias. Tudo digital, sem burocracia." },
  { icon: Users, title: "Contador que Entende Creators", description: "Profissional especializado em economia criativa: YouTube, Instagram, TikTok, Twitch, podcasts e todas as plataformas." },
];

export function YoutubersCreatorsBenefits() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  const toggle = (index: number) => { setOpenIndex((prev) => (prev === index ? null : index)); };

  return (
    <section className="py-16 lg:py-24 bg-[#FEF2F2]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#DC2626] uppercase tracking-wider">Nossos Benefícios</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Por que creators escolhem a Contabilidade Zen?</h2>
          <p className="text-muted-foreground text-lg">Clique em cada benefício para saber mais</p>
        </div>
        <div className="flex flex-col lg:flex-row items-start max-w-6xl mx-auto">
          <div className="w-full lg:w-[40%] flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24">
            <div className="mx-auto max-w-[320px] lg:max-w-none">
              <div className="relative rounded-[32px] rounded-bl-[80px] overflow-hidden shadow-lg">
                <img src="/images/hero-founder.webp" alt="Thomas Broek — Contador especializado em criadores de conteúdo" width={480} height={600} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-[4/5]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <p className="font-bold text-lg leading-tight">Thomas Broek</p>
                  <p className="text-white/80 text-sm">CRC-SP 1SP337693/O-7</p>
                  <p className="text-white/70 text-xs mt-0.5">Contador especializado em creators</p>
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
                    <div className={`rounded-xl border bg-card transition-shadow duration-200 ${isOpen ? "border-[#EF4444]/40 shadow-md" : "border-border hover:shadow-sm"}`}>
                      <CollapsibleTrigger className="flex w-full items-center gap-3 p-5 text-left cursor-pointer">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EF4444]/10"><benefit.icon className="h-5 w-5 text-[#EF4444]" /></div>
                        <span className="flex-1 font-semibold text-foreground">{benefit.title}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{benefit.description}</p>
                          <Button size="sm" variant="outline" className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#DC2626]" onClick={(e) => { e.stopPropagation(); scrollToForm(); }}>Quero esse benefício</Button>
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
          <Button size="lg" className="bg-[#EF4444] hover:bg-[#DC2626] text-white" onClick={scrollToForm}>Comece a economizar agora</Button>
        </div>
      </div>
    </section>
  );
}
