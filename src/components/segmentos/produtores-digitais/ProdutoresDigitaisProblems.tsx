import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "Impostos altos como pessoa física", description: "Está pagando até 27,5% de IR sobre seus ganhos com infoprodutos? A tributação errada consome boa parte do seu faturamento." },
  { icon: FileWarning, title: "Nota fiscal para plataformas", description: "Hotmart, Eduzz e outras plataformas exigem nota fiscal. Sem emissão correta, você pode ter problemas e até bloqueio de saques." },
  { icon: Clock, title: "Anexo III ou V do Simples?", description: "Não sabe se está no anexo correto? A diferença entre Anexo III (6%) e Anexo V (15,5%) pode custar milhares de reais por mês." },
  { icon: HelpCircle, title: "Faturamento internacional", description: "Recebe de afiliados internacionais ou vende para o exterior? Sem orientação, pode pagar impostos em duplicidade." },
];

export function ProdutoresDigitaisProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#F3E8FF]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão travando seu crescimento digital?</h2>
          <p className="text-muted-foreground text-lg">Se você se identifica com algum desses cenários, seu negócio digital precisa de contabilidade especializada</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><problem.icon className="h-6 w-6 text-destructive" /></div>
              <div><h3 className="text-lg font-bold text-foreground mb-2">{problem.title}</h3><p className="text-muted-foreground">{problem.description}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#E9D5FF] rounded-2xl border border-[#9333EA]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">Você não precisa mais passar por isso!</h3>
          <p className="text-muted-foreground">Com a Contabilidade Zen, você terá especialistas que entendem o mercado digital e cuidam de toda a parte contábil para que você foque no que realmente importa: criar e vender!</p>
        </div>
      </div>
    </section>
  );
}
