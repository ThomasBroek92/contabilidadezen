import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const psicologosFaqs = [
  { question: "Qual o melhor regime tributário para psicólogos?", answer: "O melhor regime depende do seu faturamento, estrutura de custos e forma de atuação. Geralmente, psicólogos com faturamento acima de R$ 5.000/mês se beneficiam ao atuar como PJ no Simples Nacional ou Lucro Presumido. Nossa equipe faz uma análise personalizada para identificar a melhor opção para o seu caso." },
  { question: "Vale a pena abrir CNPJ sendo psicólogo?", answer: "Na maioria dos casos, sim! Psicólogos que atuam como Pessoa Física podem pagar até 27,5% de IR, enquanto como PJ a carga tributária pode cair para 6% a 15%, dependendo do regime escolhido. Fazemos uma simulação gratuita para você comparar os cenários." },
  { question: "Vocês atendem psicólogos de todo o Brasil?", answer: "Sim! Trabalhamos 100% online e atendemos psicólogos e clínicas em todo o território nacional. Nossa estrutura digital permite que você tenha suporte completo sem precisar sair do consultório." },
  { question: "Como funciona para psicólogos que atendem online?", answer: "Atendemos muitos psicólogos que trabalham com terapia online. As obrigações fiscais são as mesmas, mas temos experiência em orientar sobre questões específicas como emissão de notas para pacientes de outros estados e declaração correta dos rendimentos." },
  { question: "Quais serviços estão inclusos na mensalidade?", answer: "Nossa mensalidade inclui: escrituração contábil, emissão de guias de impostos, declarações fiscais, suporte ilimitado por WhatsApp e e-mail, além de orientação tributária contínua para otimizar seus resultados." },
  { question: "Como posso agendar uma consulta gratuita?", answer: "Basta preencher o formulário nesta página com seus dados. Um de nossos especialistas entrará em contato para agendar uma reunião e fazer uma análise gratuita da sua situação fiscal atual." },
];

export function PsicologosFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#EDE9FE]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#7C3AED] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas frequentes sobre contabilidade para psicólogos</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre nossos serviços de contabilidade especializada</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {psicologosFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#8B5CF6]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#7C3AED] py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
