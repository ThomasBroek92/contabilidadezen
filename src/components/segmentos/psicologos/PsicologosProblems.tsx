import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "Impostos altos demais", description: "Você sente que está pagando mais impostos do que deveria e não sabe como reduzir legalmente sua carga tributária?" },
  { icon: FileWarning, title: "Medo de fiscalização", description: "Preocupado com multas e penalidades por não estar em conformidade com as obrigações fiscais e o CRP?" },
  { icon: Clock, title: "Sem tempo para burocracias", description: "Sua rotina de atendimentos já é intensa e você não tem tempo para lidar com notas fiscais, declarações e obrigações contábeis?" },
  { icon: HelpCircle, title: "Contabilidade genérica", description: "Seu contador atual não entende as particularidades da psicologia e você sente que está perdendo oportunidades de economia?" },
];

export function PsicologosProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#EDE9FE]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão prejudicando seu consultório?</h2>
          <p className="text-muted-foreground text-lg">Se você se identifica com algum desses cenários, seu consultório precisa de uma contabilidade especializada</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><problem.icon className="h-6 w-6 text-destructive" /></div>
              <div><h3 className="text-lg font-bold text-foreground mb-2">{problem.title}</h3><p className="text-muted-foreground">{problem.description}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#DDD6FE] rounded-2xl border border-[#8B5CF6]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">Você não precisa mais passar por isso!</h3>
          <p className="text-muted-foreground">Com a Contabilidade Zen, você terá especialistas que entendem sua rotina de atendimentos e cuidam de toda a parte contábil para que você foque no que realmente importa: seus pacientes.</p>
        </div>
      </div>
    </section>
  );
}
