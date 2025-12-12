import { Button } from "@/components/ui/button";
import { TrendingDown, Shield, Clock, Headphones, FileCheck, PiggyBank } from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Redução de Impostos",
    description: "Estratégias legais para pagar menos tributos e aumentar sua margem de lucro mensal.",
  },
  {
    icon: Shield,
    title: "Segurança Fiscal Total",
    description: "Fique tranquilo com todas as obrigações fiscais e CRO sempre em dia e corretas.",
  },
  {
    icon: Clock,
    title: "Mais Tempo para Pacientes",
    description: "Deixe a burocracia conosco e foque no que realmente importa: seus atendimentos.",
  },
  {
    icon: Headphones,
    title: "Suporte Especializado",
    description: "Equipe que entende odontologia e está sempre disponível para tirar suas dúvidas.",
  },
  {
    icon: FileCheck,
    title: "Documentação Organizada",
    description: "Toda a sua contabilidade organizada e acessível a qualquer momento.",
  },
  {
    icon: PiggyBank,
    title: "Economia Comprovada",
    description: "Nossos clientes economizam em média 30% em impostos após nossa consultoria.",
  },
];

export function DentistasBenefits() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Nossos Benefícios
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            O que você ganha com a Contabilidade Zen
          </h2>
          <p className="text-muted-foreground text-lg">
            Especialização em odontologia para resultados que fazem a diferença no seu consultório
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="p-6 bg-card rounded-xl border border-border hover:border-secondary/30 hover:shadow-card transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
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
