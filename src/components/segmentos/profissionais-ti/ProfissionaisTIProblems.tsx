import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "Impostos altos como PF ou CLT", description: "Pagando até 27,5% de IR no carnê-leão ou retido na fonte? Como PJ, pode pagar a partir de 6%." },
  { icon: FileWarning, title: "Contratos PJ mal estruturados", description: "Sem orientação contábil, contratos PJ podem gerar riscos trabalhistas e tributários para você e para a empresa contratante." },
  { icon: Clock, title: "Fator R não otimizado", description: "Não sabe se está no Anexo III ou V do Simples? A diferença pode ser de 6% vs 15,5% de impostos." },
  { icon: HelpCircle, title: "Recebimentos do exterior", description: "Freelancing para empresas de fora? Sem orientação, pode pagar impostos em duplicidade ou ter problemas com câmbio." },
];

export function ProfissionaisTIProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#CFFAFE]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Você se identifica?</span></div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão consumindo seus ganhos?</h2>
          <p className="text-muted-foreground text-lg">Se você se identifica, seu negócio precisa de contabilidade especializada em TI</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((p, i) => (<div key={i} className="flex gap-4 p-6 bg-card rounded-xl border border-border"><div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><p.icon className="h-6 w-6 text-destructive" /></div><div><h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3><p className="text-muted-foreground">{p.description}</p></div></div>))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#A5F3FC] rounded-2xl border border-[#0891B2]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">Você não precisa mais passar por isso!</h3>
          <p className="text-muted-foreground">Com a Contabilidade Zen, você terá especialistas que entendem a realidade de devs e profissionais de TI.</p>
        </div>
      </div>
    </section>
  );
}
