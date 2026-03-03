import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export const exportacaoServicosFaqs = [
  { question: "Exportação de serviços tem isenção de ISS?", answer: "Sim! A Lei Complementar 116/2003 prevê isenção de ISS para serviços exportados, ou seja, cujo resultado é verificado no exterior. Isso pode representar economia de 2% a 5% do faturamento." },
  { question: "Como receber em dólar/euro de forma legal?", answer: "Existem várias formas: conta em banco brasileiro com câmbio, plataformas internacionais (Wise, Payoneer) e contratos de câmbio. Orientamos a melhor opção para cada caso." },
  { question: "Preciso emitir nota fiscal para exportação de serviços?", answer: "Sim! A nota fiscal de serviço deve ser emitida normalmente, com observação de que se trata de exportação. Isso é importante para comprovar a isenção de ISS." },
  { question: "Qual regime tributário é melhor para exportadores?", answer: "Depende do volume e tipo de serviço. Simples Nacional com Fator R (6%), Lucro Presumido ou até Lucro Real podem ser vantajosos. Fazemos análise personalizada." },
  { question: "Existe risco de dupla tributação?", answer: "Sim, se não houver planejamento adequado. O Brasil tem acordos de bitributação com alguns países. Orientamos para evitar pagar impostos em duplicidade." },
  { question: "Quais obrigações tenho com o Banco Central?", answer: "Operações de câmbio acima de determinados valores exigem declarações ao Banco Central. Cuidamos de toda a documentação e compliance cambial." },
];
export function ExportacaoServicosFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#DBEAFE]">
      <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto">
        <div className="text-center mb-12"><span className="text-sm font-semibold text-[#1D4ED8] uppercase tracking-wider">Dúvidas Frequentes</span><h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas frequentes sobre exportação de serviços</h2><p className="text-muted-foreground text-lg">Tire suas dúvidas sobre contabilidade para operações internacionais</p></div>
        <Accordion type="single" collapsible className="space-y-4">{exportacaoServicosFaqs.map((f, i) => (<AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#2563EB]/50"><AccordionTrigger className="text-left text-foreground hover:text-[#1D4ED8] py-5">{f.question}</AccordionTrigger><AccordionContent className="text-muted-foreground pb-5">{f.answer}</AccordionContent></AccordionItem>))}</Accordion>
      </div></div>
    </section>
  );
}
