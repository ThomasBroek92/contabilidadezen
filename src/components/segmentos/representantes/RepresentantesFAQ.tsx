import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const representantesFaqs = [
  {
    question: "Qual o melhor regime tributário para representante comercial?",
    answer: "O melhor regime depende do seu faturamento e estrutura de custos. Geralmente, representantes com faturamento mensal acima de R$ 5.000 se beneficiam atuando como PJ no Simples Nacional (usando o Fator R para enquadramento no Anexo III) ou Lucro Presumido. Nossa equipe faz uma análise personalizada para identificar a melhor opção.",
  },
  {
    question: "Preciso ter registro no CORE para atuar como PJ?",
    answer: "Sim! Todo representante comercial, seja autônomo ou PJ, precisa ter registro no CORE (Conselho Regional dos Representantes Comerciais) do seu estado. Nossa equipe auxilia em todo o processo de regularização junto ao conselho.",
  },
  {
    question: "Como funciona a tributação de comissões de várias representadas?",
    answer: "Todas as comissões recebidas de diferentes empresas são somadas para compor o faturamento mensal da sua empresa. A nota fiscal é emitida para cada representada separadamente, mas a tributação é calculada sobre o total. Nosso sistema organiza tudo automaticamente.",
  },
  {
    question: "Quais CNAEs são recomendados para representante comercial?",
    answer: "Os principais CNAEs são: 4612-5/00 (Representantes comerciais e agentes do comércio de combustíveis), 4617-6/00 (Representantes comerciais e agentes do comércio de matérias-primas agrícolas), 4618-4/99 (Outros representantes comerciais e agentes do comércio de jornais). A escolha correta depende dos produtos que você representa.",
  },
  {
    question: "Posso ser MEI como representante comercial?",
    answer: "Não! Representante comercial não pode ser MEI, pois a atividade não está entre as permitidas para este regime. A alternativa é abrir uma ME (Microempresa) no Simples Nacional ou outro regime tributário adequado.",
  },
  {
    question: "Como declarar comissões recebidas de empresas diferentes?",
    answer: "Como PJ, você emite notas fiscais para cada representada conforme recebe as comissões. Mantemos controle detalhado de todas as notas, facilitando a gestão e o cálculo correto dos impostos. Você tem visibilidade total de quanto ganha de cada empresa.",
  },
  {
    question: "Qual a diferença entre representante autônomo e PJ?",
    answer: "O autônomo atua como pessoa física, pagando IR de até 27,5% + INSS de 20%. O representante PJ pode pagar de 6% a 15% de impostos totais (dependendo do regime), além de ter maior credibilidade no mercado e facilidade de formalizar contratos.",
  },
  {
    question: "Como funciona o Fator R para representantes?",
    answer: "O Fator R é a relação entre folha de pagamento (incluindo pró-labore) e faturamento dos últimos 12 meses. Se for igual ou superior a 28%, sua empresa pode ser tributada no Anexo III do Simples Nacional (alíquotas a partir de 6%) em vez do Anexo V (alíquotas a partir de 15,5%). Otimizamos seu pró-labore para maximizar essa economia.",
  },
];

export function RepresentantesFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#FEF3E2]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#C4680F] uppercase tracking-wider">
              Dúvidas Frequentes
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
              Perguntas frequentes sobre contabilidade para representantes
            </h2>
            <p className="text-muted-foreground text-lg">
              Tire suas dúvidas sobre nossos serviços de contabilidade especializada
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {representantesFaqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#E87C1E]/50"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-[#C4680F] py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
