import { AlertTriangle, TrendingDown, FileWarning, Clock, HelpCircle } from "lucide-react";

const problems = [
  { icon: TrendingDown, title: "Impostos altíssimos como PF", description: "Receber AdSense e publis como pessoa física significa pagar até 27,5% de IR. Como PJ, pode cair para 6%." },
  { icon: FileWarning, title: "Receitas internacionais sem controle", description: "Google, YouTube, Twitch pagam em dólar. Sem planejamento, você pode ter problemas com câmbio e Receita Federal." },
  { icon: Clock, title: "Contratos com marcas sem NF", description: "Marcas exigem nota fiscal para fechar publis e parcerias. Sem CNPJ, você perde oportunidades de monetização." },
  { icon: HelpCircle, title: "Direitos autorais mal declarados", description: "Licenciamento de conteúdo, royalties e cessão de direitos têm tratamento tributário específico que poucos contadores conhecem." },
];

export function YoutubersCreatorsProblems() {
  return (
    <section className="py-16 lg:py-24 bg-[#FEE2E2]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-sm font-medium text-destructive">Você se identifica?</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Esses problemas estão prejudicando seu canal?</h2>
          <p className="text-muted-foreground text-lg">Se sim, você precisa de contabilidade especializada para creators</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((p, i) => (
            <div key={i} className="flex gap-4 p-6 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"><p.icon className="h-6 w-6 text-destructive" /></div>
              <div><h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3><p className="text-muted-foreground">{p.description}</p></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 p-8 bg-[#FECACA] rounded-2xl border border-[#EF4444]/20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-3">A solução está aqui!</h3>
          <p className="text-muted-foreground">A Contabilidade Zen cuida dos impostos para você focar no que faz melhor: criar conteúdo.</p>
        </div>
      </div>
    </section>
  );
}
