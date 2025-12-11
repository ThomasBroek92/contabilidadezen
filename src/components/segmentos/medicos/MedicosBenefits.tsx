import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users } from "lucide-react";

const benefits = [
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    description: "Com o nosso planejamento tributário especializado, você vai pagar menos impostos e evitar surpresas fiscais, garantindo a melhor estratégia para a sua clínica.",
  },
  {
    icon: FileCheck,
    title: "Burocracia Zero",
    description: "Esqueça a burocracia! Nossa equipe cuida de toda a parte fiscal e burocrática para você, liberando seu tempo para focar no que realmente importa: seus pacientes.",
  },
  {
    icon: BarChart3,
    title: "Melhor Controle Financeiro",
    description: "Com o apoio de nossos especialistas, sua clínica terá controle total sobre as finanças. Evite juros, pendências e organize sua gestão para maximizar o lucro.",
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    description: "Mantenha sua clínica em dia com todas as obrigações fiscais e evite multas e penalidades. Trabalhamos para garantir sua tranquilidade.",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Automatizamos processos e cuidamos de toda a papelada para que você possa dedicar mais tempo aos seus pacientes e menos às burocracias.",
  },
  {
    icon: Users,
    title: "Atendimento Humanizado",
    description: "Você terá um contador dedicado que entende as particularidades da área médica e está sempre disponível para esclarecer suas dúvidas.",
  },
];

export function MedicosBenefits() {
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
            Como nossa contabilidade para médicos organiza suas finanças?
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja os benefícios que podem transformar a gestão financeira da sua clínica
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
