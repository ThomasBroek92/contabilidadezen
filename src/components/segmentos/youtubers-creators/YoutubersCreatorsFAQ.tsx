import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const youtubersCreatorsFaqs = [
  { question: "Preciso abrir CNPJ para receber do YouTube/AdSense?", answer: "Não é obrigatório, mas é altamente recomendado. Como pessoa física você paga até 27,5% de IR. Como PJ no Simples Nacional, pode pagar a partir de 6%. A economia é significativa a partir de R$ 3.000/mês de faturamento." },
  { question: "Qual o melhor CNAE para criador de conteúdo?", answer: "Depende da sua atividade principal. Para YouTubers e streamers, usamos CNAEs como 5911-1/99 (produção de conteúdo audiovisual) ou 7319-0/04 (marketing digital). Analisamos seu caso para definir o CNAE mais vantajoso tributariamente." },
  { question: "Como declarar receitas do AdSense e plataformas internacionais?", answer: "Receitas em dólar/euro precisam ser convertidas e declaradas corretamente. Cuidamos do contrato de câmbio, conversão pela taxa do dia e classificação correta na contabilidade. Plataformas como Google, Twitch e TikTok têm particularidades." },
  { question: "Posso emitir nota fiscal para publis e contratos com marcas?", answer: "Sim! Com CNPJ você emite NF-e para qualquer marca ou agência. Isso é essencial para fechar contratos maiores — muitas empresas só trabalham com creators que têm CNPJ e emitem nota." },
  { question: "Direitos autorais têm tratamento tributário diferente?", answer: "Sim. Receitas de cessão de direitos autorais, licenciamento de conteúdo e royalties podem ter tratamento tributário diferenciado. Analisamos cada caso para aplicar o enquadramento mais vantajoso." },
  { question: "Quanto tempo leva para abrir o CNPJ?", answer: "Em média 5 a 7 dias úteis. Todo o processo é digital — você não precisa ir a cartório ou junta comercial. Cuidamos de tudo: contrato social, inscrição municipal, estadual (quando necessário) e cadastro na Receita Federal." },
];

export function YoutubersCreatorsFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#FEE2E2]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#DC2626] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas sobre contabilidade para creators</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre impostos para criadores de conteúdo</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {youtubersCreatorsFaqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#EF4444]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#DC2626] py-5">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
