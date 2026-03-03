import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users } from "lucide-react";

const benefits = [
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    description: "Análise completa para escolher entre Simples Nacional e Lucro Presumido, garantindo a menor carga tributária legal para sua representação.",
    accent: "orange" as const,
  },
  {
    icon: FileCheck,
    title: "Burocracia Zero",
    description: "Cuidamos de DARF, GFIP, SPED e todas as obrigações junto ao CORE. Você foca nas vendas, nós na papelada.",
    accent: "teal" as const,
  },
  {
    icon: BarChart3,
    title: "Controle de Comissões",
    description: "Gestão organizada de comissões de múltiplas representadas. Saiba exatamente quanto você ganha de cada empresa.",
    accent: "orange" as const,
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    description: "Mantenha regularidade total com a Receita Federal e o CORE. Evite multas, penalidades e dores de cabeça.",
    accent: "teal" as const,
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Automatizamos a emissão de notas fiscais e obrigações acessórias. Mais tempo para prospectar e fechar negócios.",
    accent: "orange" as const,
  },
  {
    icon: Users,
    title: "Atendimento Humanizado",
    description: "Contador dedicado que entende a realidade do representante comercial e está sempre disponível para te ajudar.",
    accent: "teal" as const,
  },
];

export function RepresentantesBenefits() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
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
            Veja os benefícios que podem transformar a gestão financeira da sua representação
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const isOrange = benefit.accent === "orange";
            return (
              <div 
                key={index}
                className={`group p-6 bg-card rounded-xl border transition-all duration-300 ${
                  isOrange 
                    ? "border-[#E87C1E]/15 hover:border-[#E87C1E]/50 hover:shadow-lg" 
                    : "border-secondary/15 hover:border-secondary/50 hover:shadow-lg"
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                  isOrange 
                    ? "bg-[#FDE8CC] group-hover:bg-[#FDE8CC]" 
                    : "bg-secondary/10 group-hover:bg-secondary/20"
                }`}>
                  <benefit.icon className={`h-7 w-7 ${isOrange ? "text-[#E87C1E]" : "text-secondary"}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
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
