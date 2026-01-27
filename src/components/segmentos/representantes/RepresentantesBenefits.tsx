import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users } from "lucide-react";

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
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
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
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group p-6 bg-card rounded-xl border border-border hover:border-secondary/50 hover:shadow-card transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                <benefit.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" onClick={scrollToForm}>
            Elimine as burocracias ainda hoje
          </Button>
        </div>
      </div>
    </section>
  );
}
