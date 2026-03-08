import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const advogadosFaqs = [
  { question: "Qual o melhor regime tributário para advogados?", answer: "O melhor regime depende do seu faturamento, estrutura de custos e forma de atuação. Geralmente, advogados com faturamento acima de R$ 5.000/mês se beneficiam ao atuar como PJ. O Simples Nacional (Anexo IV) é vantajoso para escritórios menores, enquanto o Lucro Presumido pode ser mais econômico para faturamentos maiores. Nossa equipe faz uma análise personalizada para identificar a melhor opção." },
  { question: "Vale a pena abrir uma sociedade de advogados?", answer: "Na maioria dos casos, sim! A sociedade de advogados registrada na OAB permite tributação diferenciada, com ISS fixo em muitos municípios e possibilidade de distribuição de lucros isenta de IR. Além disso, a estrutura societária facilita o planejamento tributário e a proteção patrimonial dos sócios." },
  { question: "Advogado pode ser Simples Nacional?", answer: "Sim! Desde 2015, advogados podem optar pelo Simples Nacional. Os escritórios de advocacia são enquadrados no Anexo IV, com alíquotas a partir de 4,5%. Porém, nem sempre o Simples é a melhor opção — para faturamentos maiores, o Lucro Presumido pode ser mais vantajoso. Fazemos uma simulação gratuita para comparar." },
  { question: "Vocês atendem advogados de todo o Brasil?", answer: "Sim! Trabalhamos 100% online e atendemos advogados, escritórios de advocacia e sociedades de advogados em todo o território nacional. Nossa estrutura digital permite suporte completo sem precisar sair do escritório." },
  { question: "Como funciona a distribuição de lucros para sócios advogados?", answer: "A distribuição de lucros para sócios de sociedade de advogados é isenta de Imposto de Renda, desde que respeitados os limites legais. Nosso time planeja o pró-labore mínimo ideal e maximiza a distribuição de lucros, garantindo a maior economia fiscal possível dentro da legalidade." },
  { question: "Quais obrigações fiscais um escritório de advocacia precisa cumprir?", answer: "As principais obrigações incluem: emissão de notas fiscais de serviço, recolhimento de ISS, IRPJ, CSLL, PIS, COFINS (se Lucro Presumido), entrega de DEFIS ou ECF conforme o regime, folha de pagamento (se houver funcionários) e declarações acessórias. Nossa equipe cuida de tudo para você." },
];

export function AdvogadosFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#E2E8F0]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#334155] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas frequentes sobre contabilidade para advogados</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre nossos serviços de contabilidade especializada</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {advogadosFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#334155]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#334155] py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}