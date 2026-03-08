import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle, Users } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "Impostos altos demais", description: "Você sente que está pagando mais impostos do que deveria e não sabe se Simples Nacional ou Lucro Presumido é a melhor opção para seu escritório?" },
  { icon: FileWarning, title: "Dúvidas sobre sociedade de advogados", description: "Não sabe como estruturar uma sociedade de advogados registrada na OAB de forma que otimize a tributação e proteja os sócios?" },
  { icon: Clock, title: "Sem tempo para burocracias", description: "Sua rotina de audiências, prazos processuais e atendimentos é tão intensa que não sobra tempo para lidar com obrigações contábeis?" },
  { icon: HelpCircle, title: "Contabilidade genérica", description: "Seu contador atual não entende as particularidades do setor jurídico e você sente que está perdendo oportunidades de economia tributária?" },
  { icon: Users, title: "Gestão de sócios complexa", description: "Dificuldade em definir pró-labore, distribuir lucros e organizar a retirada dos sócios de forma eficiente e legal?" },
];

export function AdvogadosProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#E2E8F0]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão prejudicando seu escritório?</h2>
          <p className="text-muted-foreground text-lg">Se você se identifica com algum desses cenários, seu escritório precisa de uma contabilidade especializada</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#CBD5E1] rounded-2xl border border-[#334155]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">Você não precisa mais passar por isso!</h3>
          <p className="text-muted-foreground">Com a Contabilidade Zen, você terá especialistas que entendem sua rotina jurídica e cuidam de toda a parte contábil para que você foque no que realmente importa: seus clientes e processos.</p>
        </div>
      </div>
    </section>
  );
}