import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "Pagando IR/CSLL sobre 32% da receita", description: "Sem equiparação hospitalar, clínicas pagam impostos sobre 32% do faturamento quando poderiam pagar sobre apenas 8%." },
  { icon: FileWarning, title: "Folha de pagamento complexa", description: "Equipe médica, enfermeiros, recepcionistas — cada categoria tem regras trabalhistas e sindicais diferentes." },
  { icon: Clock, title: "Glosas de convênios sem controle", description: "Sem gestão fiscal adequada dos convênios, glosas viram prejuízo e a conciliação financeira vira um caos." },
  { icon: HelpCircle, title: "Sociedade médica mal estruturada", description: "Sem planejamento societário, sócios pagam mais impostos do que deveriam e correm riscos patrimoniais." },
];

export function ClinicasConsultoriosProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#D1FAE5]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão prejudicando sua clínica?</h2>
          <p className="text-muted-foreground text-lg">Se sim, você precisa de contabilidade especializada em clínicas e consultórios</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((p, i) => (
            <div key={i} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><p.icon className="h-6 w-6 text-destructive" /></div>
              <div><h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3><p className="text-muted-foreground">{p.description}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#A7F3D0] rounded-2xl border border-[#059669]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">A solução está aqui!</h3>
          <p className="text-muted-foreground">A Contabilidade Zen é especialista em clínicas e consultórios. Equiparação hospitalar, folha e convênios — tudo resolvido.</p>
        </div>
      </div>
    </section>
  );
}
