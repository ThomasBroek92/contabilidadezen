import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "Pagando impostos demais como PF", description: "Muitos profissionais autônomos pagam até 27,5% de IR. Com CNPJ e planejamento, é possível reduzir para 6% a 15%." },
  { icon: FileWarning, title: "CNAE errado gera problemas", description: "O código de atividade errado pode enquadrar sua empresa em anexo tributário mais caro ou impedir a emissão de notas fiscais." },
  { icon: Clock, title: "Sem planejamento tributário", description: "Sem analisar Fator R, pró-labore e regime tributário ideal, você perde dinheiro todo mês pagando impostos acima do necessário." },
  { icon: HelpCircle, title: "Contador genérico não entende", description: "Cada profissão tem regras específicas de ISS, INSS e obrigações acessórias. Contadores genéricos costumam aplicar a mesma fórmula para todos." },
];

export function OutrosSegmentosProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#F1F5F9]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão prejudicando seu negócio?</h2>
          <p className="text-muted-foreground text-lg">Se sim, você precisa de contabilidade personalizada</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((p, i) => (
            <div key={i} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><p.icon className="h-6 w-6 text-destructive" /></div>
              <div><h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3><p className="text-muted-foreground">{p.description}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#E2E8F0] rounded-2xl border border-[#475569]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">A solução está aqui!</h3>
          <p className="text-muted-foreground">A Contabilidade Zen analisa sua profissão e encontra o melhor enquadramento tributário para você.</p>
        </div>
      </div>
    </section>
  );
}
