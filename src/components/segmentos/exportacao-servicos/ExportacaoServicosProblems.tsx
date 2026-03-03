import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";
const problems = [
  { icon: TrendingDown, title: "Pagando ISS desnecessariamente", description: "Exportação de serviços pode ter isenção de ISS pela LC 116/2003. Sem orientação, você paga imposto que não deveria." },
  { icon: FileWarning, title: "Câmbio e compliance", description: "Receber em dólar/euro sem estrutura contábil adequada pode gerar problemas com o Banco Central e a Receita Federal." },
  { icon: Clock, title: "Contratos internacionais", description: "Contratos mal estruturados com clientes estrangeiros podem gerar riscos tributários e trabalhistas significativos." },
  { icon: HelpCircle, title: "Dupla tributação", description: "Sem planejamento, você pode acabar pagando impostos tanto no Brasil quanto no país do cliente." },
];
export function ExportacaoServicosProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#DBEAFE]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Você se identifica?</span></div><h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão afetando sua exportação?</h2><p className="text-muted-foreground text-lg">Se sim, você precisa de contabilidade especializada em operações internacionais</p></div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">{problems.map((p, i) => (<div key={i} className="flex gap-4 p-6 bg-card rounded-xl border border-border"><div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><p.icon className="h-6 w-6 text-destructive" /></div><div><h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3><p className="text-muted-foreground">{p.description}</p></div></div>))}</div>
        <div className="text-center mt-12 p-8 bg-[#BFDBFE] rounded-2xl border border-[#2563EB]/20 max-w-3xl mx-auto"><h3 className="text-2xl font-bold text-foreground mb-3">Você não precisa mais passar por isso!</h3><p className="text-muted-foreground">Com a Contabilidade Zen, você terá especialistas em exportação de serviços cuidando de toda a parte fiscal e cambial.</p></div>
      </div>
    </section>
  );
}
