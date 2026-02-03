import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é o Simples Nacional?",
    answer: "O Simples Nacional é um regime tributário simplificado criado para micro e pequenas empresas com faturamento anual de até R$ 4,8 milhões. Ele unifica o pagamento de 8 tributos (IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP) em uma única guia mensal (DAS), facilitando a gestão fiscal e reduzindo a burocracia."
  },
  {
    question: "O que são os Anexos do Simples Nacional?",
    answer: "Os Anexos são tabelas que determinam as alíquotas de tributação conforme a atividade econômica da empresa. Existem 5 Anexos: I (Comércio), II (Indústria), III, IV e V (Serviços). Cada anexo possui faixas de alíquotas progressivas baseadas no faturamento bruto acumulado nos últimos 12 meses."
  },
  {
    question: "O que é o Fator R e como ele afeta minha empresa?",
    answer: "O Fator R é a proporção entre a folha de pagamento dos últimos 12 meses e o faturamento bruto do mesmo período. Se o Fator R for igual ou superior a 28%, a empresa que seria tributada pelo Anexo V pode migrar para o Anexo III, obtendo alíquotas menores. Isso beneficia empresas com alta despesa de pessoal."
  },
  {
    question: "Como encontro o CNAE da minha atividade?",
    answer: "O CNAE (Classificação Nacional de Atividades Econômicas) é um código de 7 dígitos que identifica sua atividade empresarial. Você pode usar a busca acima digitando palavras-chave da sua atividade ou o código diretamente. A tabela mostrará o anexo correspondente e a alíquota inicial aplicável."
  },
  {
    question: "Uma empresa pode ter CNAEs em anexos diferentes?",
    answer: "Sim, é comum empresas terem atividades secundárias em anexos diferentes da atividade principal. Nesse caso, cada receita será tributada conforme o anexo correspondente ao CNAE. Por exemplo, uma empresa de TI (Anexo III) que também vende produtos (Anexo I) terá tributações distintas para cada tipo de receita."
  },
];

export const CNAEFAQSection = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Perguntas Frequentes
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tire suas dúvidas sobre o Simples Nacional, anexos e tributação
        </p>
      </div>

      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium hover:text-secondary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
