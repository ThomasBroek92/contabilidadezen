import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, ChevronDown } from "lucide-react";
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

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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

        <div className="text-center mt-12">
          <Button size="lg" className="bg-[#E87C1E] hover:bg-[#C4680F] text-white" onClick={scrollToForm}>
            Elimine as burocracias ainda hoje
          </Button>
        </div>
      </div>
    </section>
  );
}
