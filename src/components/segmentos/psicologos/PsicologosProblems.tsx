import { AlertTriangle, Clock, DollarSign, FileQuestion, Users } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    title: "Impostos altos demais",
    description: "Você sente que está pagando mais impostos do que deveria enquanto vê colegas com cargas tributárias menores.",
  },
  {
    icon: Clock,
    title: "Tempo perdido com burocracia",
    description: "Horas preciosas gastas com papelada, notas fiscais e obrigações fiscais que poderiam ser investidas em atendimentos.",
  },
  {
    icon: FileQuestion,
    title: "Contador que não entende sua área",
    description: "Seu contador atual não compreende as particularidades da psicologia e oferece orientações genéricas.",
  },
  {
    icon: AlertTriangle,
    title: "Medo de problemas fiscais",
    description: "Preocupação constante com possíveis erros tributários, multas ou inconsistências com o CRP.",
  },
  {
    icon: Users,
    title: "Dificuldade na precificação",
    description: "Incerteza sobre como precificar sessões considerando todos os custos, impostos e margem de lucro adequada.",
  },
];

export function PsicologosProblems() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Identificamos seus desafios
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Você se identifica com algum desses problemas?
          </h2>
          <p className="text-muted-foreground text-lg">
            Esses são os principais desafios que psicólogos enfrentam diariamente e que impactam diretamente seus resultados
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="p-6 bg-card rounded-xl border border-border hover:border-destructive/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-foreground">
            Se você se identificou com algum desses problemas,{" "}
            <span className="text-secondary font-semibold">nós temos a solução!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
