import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "ICMS-ST mal calculado", description: "Substituição tributária errada gera multas pesadas e problemas com o Fisco estadual. Cada estado tem regras diferentes." },
  { icon: FileWarning, title: "Estoque sem controle fiscal", description: "Sem CMV correto, você não sabe o lucro real e pode pagar impostos sobre valores errados." },
  { icon: Clock, title: "Notas fiscais de marketplace", description: "Mercado Livre, Shopee e Amazon exigem NF-e correta. Erros causam bloqueios na plataforma e perda de vendas." },
  { icon: HelpCircle, title: "Dropshipping sem compliance", description: "Importação sem planejamento tributário gera autuações. Dropshipping internacional tem regras específicas de ICMS e IPI." },
];

export function EcommerceProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#FCE7F3]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão prejudicando seu e-commerce?</h2>
          <p className="text-muted-foreground text-lg">Se sim, você precisa de contabilidade especializada em e-commerce</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((p, i) => (
            <div key={i} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><p.icon className="h-6 w-6 text-destructive" /></div>
              <div><h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3><p className="text-muted-foreground">{p.description}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#FBCFE8] rounded-2xl border border-[#DB2777]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">A solução está aqui!</h3>
          <p className="text-muted-foreground">A Contabilidade Zen cuida do fiscal do seu e-commerce para você vender sem preocupação.</p>
        </div>
      </div>
    </section>
  );
}
