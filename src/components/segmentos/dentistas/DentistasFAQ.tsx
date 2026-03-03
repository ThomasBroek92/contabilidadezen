import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const dentistasFaqs = [
  { question: "Qual o melhor regime tributário para dentistas?", answer: "O melhor regime depende do seu faturamento, estrutura de custos e forma de atuação. Geralmente, dentistas com faturamento acima de R$ 5.000/mês se beneficiam ao atuar como PJ no Simples Nacional ou Lucro Presumido. Nossa equipe faz uma análise personalizada para identificar a melhor opção para o seu caso." },
  { question: "Vale a pena abrir CNPJ sendo dentista?", answer: "Na maioria dos casos, sim! Dentistas que atuam como Pessoa Física podem pagar até 27,5% de IR, enquanto como PJ a carga tributária pode cair para 6% a 15%, dependendo do regime escolhido. Fazemos uma simulação gratuita para você comparar os cenários." },
  { question: "Vocês atendem dentistas de todo o Brasil?", answer: "Sim! Trabalhamos 100% online e atendemos dentistas e clínicas odontológicas em todo o território nacional. Nossa estrutura digital permite que você tenha suporte completo sem precisar sair do consultório." },
  { question: "Como funciona o processo de migração de contabilidade?", answer: "O processo é simples e sem burocracia para você. Nossa equipe cuida de toda a transição, entrando em contato com seu contador atual para obter os documentos necessários. Você não precisa se preocupar com nada." },
  { question: "Quais serviços estão inclusos na mensalidade?", answer: "Nossa mensalidade inclui: escrituração contábil, folha de pagamento (quando aplicável), emissão de guias de impostos, declarações fiscais, suporte ilimitado por WhatsApp e e-mail, além de orientação tributária contínua para otimizar seus resultados." },
  { question: "Como posso agendar uma consulta gratuita?", answer: "Basta preencher o formulário nesta página com seus dados. Um de nossos especialistas entrará em contato para agendar uma reunião e fazer uma análise gratuita da sua situação fiscal atual." },
];

export function DentistasFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#D1FAE5]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#059669] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas frequentes sobre contabilidade para dentistas</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre nossos serviços de contabilidade especializada</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {dentistasFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#10B981]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#059669] py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
