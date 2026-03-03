import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const profissionaisTIFaqs = [
  { question: "Qual o melhor regime tributário para desenvolvedor PJ?", answer: "Depende do faturamento. Devs com faturamento acima de R$ 5.000/mês se beneficiam no Simples Nacional com Fator R (Anexo III, a partir de 6%) ou Lucro Presumido. Fazemos análise personalizada." },
  { question: "Como funciona o Fator R para profissionais de TI?", answer: "O Fator R é a relação folha/faturamento dos últimos 12 meses. Se ≥ 28%, você fica no Anexo III (6%) em vez do V (15,5%). Otimizamos seu pró-labore para maximizar essa economia." },
  { question: "Posso ser MEI como desenvolvedor?", answer: "Sim, se faturar até R$ 81.000/ano e a atividade permitir. Porém, para a maioria dos devs com contratos PJ relevantes, a ME no Simples é mais vantajosa pela possibilidade de usar o Fator R." },
  { question: "Como receber do exterior como dev PJ?", answer: "Orientamos sobre as melhores formas de receber em dólar/euro: contas internacionais, câmbio, tributação e compliance. Evitamos dupla tributação e garantimos regularidade." },
  { question: "Dev PJ precisa emitir nota fiscal?", answer: "Sim! Para cada contrato/pagamento, é necessário emitir NFS-e. Automatizamos esse processo para que você não precise se preocupar." },
  { question: "Qual CNAE usar para desenvolvedor de software?", answer: "Os principais CNAEs são 6201-5/01 (Desenvolvimento de software sob encomenda) e 6202-3/00 (Desenvolvimento e licenciamento de software customizável). A escolha impacta nos impostos." },
  { question: "CLT para PJ: vale a pena?", answer: "Na maioria dos casos, sim. Um dev CLT com salário de R$ 15.000 paga ~27,5% de IR. Como PJ com Fator R, pode pagar 6%. Mas é preciso análise caso a caso considerando benefícios CLT." },
  { question: "Como funciona contrato PJ com empresas?", answer: "Você emite nota fiscal, a empresa paga, e nós cuidamos dos impostos e obrigações. Orientamos sobre cláusulas contratuais, prazos e melhores práticas para evitar riscos trabalhistas." },
];

export function ProfissionaisTIFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#CFFAFE]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#0E7490] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas frequentes sobre contabilidade para TI</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre contabilidade especializada para profissionais de tecnologia</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {profissionaisTIFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#0891B2]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#0E7490] py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
