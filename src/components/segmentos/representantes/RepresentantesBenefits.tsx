import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, ChevronDown, Award } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const benefits = [
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    description: "Análise completa para escolher entre Simples Nacional e Lucro Presumido, garantindo a menor carga tributária legal para sua representação.",
  },
  {
    icon: FileCheck,
    title: "Burocracia Zero",
    description: "Cuidamos de DARF, GFIP, SPED e todas as obrigações junto ao CORE. Você foca nas vendas, nós na papelada.",
  },
  {
    icon: BarChart3,
    title: "Controle de Comissões",
    description: "Gestão organizada de comissões de múltiplas representadas. Saiba exatamente quanto você ganha de cada empresa.",
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    description: "Mantenha regularidade total com a Receita Federal e o CORE. Evite multas, penalidades e dores de cabeça.",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Automatizamos a emissão de notas fiscais e obrigações acessórias. Mais tempo para prospectar e fechar negócios.",
  },
  {
    icon: Users,
    title: "Atendimento Humanizado",
    description: "Contador dedicado que entende a realidade do representante comercial e está sempre disponível para te ajudar.",
  },
];

export function RepresentantesBenefits() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 lg:py-24 bg-[#FFFBF5]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#C4680F] uppercase tracking-wider">
            Nossos Benefícios
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Como nossa contabilidade para representantes organiza suas finanças?
          </h2>
          <p className="text-muted-foreground text-lg">
            Clique em cada benefício para saber mais
          </p>
        </div>

        {/* Layout 2 colunas: Imagem + Sanfona */}
        <div className="flex flex-col lg:flex-row items-start max-w-6xl mx-auto">
          
          {/* Coluna Esquerda — Imagem de Autoridade */}
          <div className="w-full lg:w-[40%] flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24">
            <div className="mx-auto max-w-[320px] lg:max-w-none">
              {/* Imagem com overlay */}
              <div className="relative rounded-[32px] rounded-bl-[80px] overflow-hidden shadow-lg">
                <img
                  src="/images/hero-founder.webp"
                  alt="Thomas Broek — Contador especializado em representantes comerciais"
                  width={480}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
                {/* Gradient overlay na base */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                {/* Nome + CRC */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-bold text-lg leading-tight">Thomas Broek</p>
                  <p className="text-white/80 text-sm">CRC-SP 1SP337693/O-7</p>
                  <p className="text-white/70 text-xs mt-0.5">Contador especializado em representantes comerciais</p>
                </div>
              </div>

              {/* Mini-cards de autoridade */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20">
                    <Award className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight">10+</p>
                    <p className="text-muted-foreground text-xs">Anos de experiência</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/10 border border-secondary/20 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20">
                    <Users className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight">200+</p>
                    <p className="text-muted-foreground text-xs">Clientes atendidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita — Sanfona com sobreposição */}
          <div className="w-full lg:w-[65%] lg:-ml-8 relative z-10">
            <div className="space-y-3">
              {benefits.map((benefit, index) => {
                const isOpen = openIndex === index;
                return (
                  <Collapsible key={index} open={isOpen} onOpenChange={() => toggle(index)}>
                    <div
                      className={`rounded-xl border bg-card transition-shadow duration-200 ${
                        isOpen ? "border-[#E87C1E]/40 shadow-md" : "border-border hover:shadow-sm"
                      }`}
                    >
                      <CollapsibleTrigger className="flex w-full items-center gap-3 p-5 text-left cursor-pointer">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E87C1E]/10">
                          <benefit.icon className="h-5 w-5 text-[#E87C1E]" />
                        </div>
                        <span className="flex-1 font-semibold text-foreground">{benefit.title}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {benefit.description}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#E87C1E]/30 text-[#E87C1E] hover:bg-[#E87C1E]/10 hover:text-[#C4680F]"
                            onClick={(e) => { e.stopPropagation(); scrollToForm(); }}
                          >
                            Quero esse benefício
                          </Button>
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
          <Button size="lg" className="bg-[#E87C1E] hover:bg-[#C4680F] text-white" onClick={scrollToForm}>
            Elimine as burocracias ainda hoje
          </Button>
        </div>
      </div>
    </section>
  );
}
