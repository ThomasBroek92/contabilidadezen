import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "Impostos altos como autônomo",
    description: "Você está pagando até 27,5% de IR + INSS e sente que está perdendo dinheiro que deveria estar no seu bolso?",
  },
  {
    icon: FileWarning,
    title: "Gestão de múltiplas representadas",
    description: "Dificuldade em organizar comissões de várias empresas diferentes? O controle financeiro está caótico?",
  },
  {
    icon: Clock,
    title: "Obrigações CORE",
    description: "Medo de irregularidades com o Conselho Regional dos Representantes Comerciais e não sabe como manter tudo em dia?",
  },
  {
    icon: HelpCircle,
    title: "Falta de controle financeiro",
    description: "Comissões variáveis e fluxo de caixa instável dificultam seu planejamento? Não sabe quanto realmente ganha?",
  },
];

export function RepresentantesProblems() {
  return (
    <section className="py-16 lg:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Esses problemas estão prejudicando suas vendas?
          </h2>
          <p className="text-muted-foreground text-lg">
            Se você se identifica com algum desses cenários, sua representação precisa de uma contabilidade especializada
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="flex gap-4 p-6 bg-card rounded-xl border border-border"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 p-8 bg-secondary/10 rounded-2xl border border-secondary/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Você não precisa mais passar por isso!
          </h3>
          <p className="text-muted-foreground">
            Com a Contabilidade Zen, você terá especialistas que entendem a rotina do representante comercial 
            e cuidam de toda a parte contábil para que você foque no que realmente importa: vender!
          </p>
        </div>
      </div>
    </section>
  );
}
