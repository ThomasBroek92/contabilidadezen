import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const produtoresDigitaisFaqs = [
  { question: "Qual o melhor regime tributário para produtor digital?", answer: "Depende do seu faturamento e estrutura. Geralmente, produtores digitais com faturamento acima de R$ 5.000/mês se beneficiam atuando como PJ no Simples Nacional (Anexo III com Fator R) ou Lucro Presumido. Nossa equipe faz uma análise personalizada." },
  { question: "Qual a diferença entre Anexo III e Anexo V do Simples?", answer: "O Anexo III tem alíquotas a partir de 6%, enquanto o Anexo V começa em 15,5%. Produtores digitais podem migrar do V para o III usando a estratégia do Fator R (relação folha/faturamento ≥ 28%). Isso pode reduzir seus impostos pela metade." },
  { question: "Preciso emitir nota fiscal para vendas na Hotmart?", answer: "Sim! A Hotmart e outras plataformas exigem nota fiscal para liberar saques. Nossa contabilidade automatiza a emissão de NFS-e para cada venda, sem que você precise se preocupar." },
  { question: "Produtor digital pode ser MEI?", answer: "Depende da atividade e do faturamento. O MEI tem limite de R$ 81.000/ano e nem todas as atividades digitais são permitidas. Para a maioria dos produtores com faturamento relevante, a ME no Simples Nacional é mais vantajosa." },
  { question: "Como funciona a tributação de vendas internacionais?", answer: "Vendas para o exterior (afiliados gringos, plataformas internacionais) têm particularidades como câmbio, ISS sobre exportação de serviços e tributação diferenciada. Orientamos para que você não pague impostos em duplicidade." },
  { question: "Afiliado digital precisa de CNPJ?", answer: "Não é obrigatório, mas é altamente recomendado. Como pessoa física, você paga até 27,5% de IR. Como PJ, pode pagar a partir de 6%. Além disso, o CNPJ traz mais credibilidade e facilita o relacionamento com plataformas." },
  { question: "Como funciona o Fator R para produtores digitais?", answer: "O Fator R é a relação entre folha de pagamento (incluindo pró-labore) e faturamento dos últimos 12 meses. Se for ≥ 28%, sua empresa é tributada no Anexo III (6%) em vez do Anexo V (15,5%). Otimizamos seu pró-labore para maximizar essa economia." },
  { question: "Quais CNAEs usar para infoprodutos?", answer: "Os principais CNAEs para produtores digitais são: 8599-6/04 (Treinamento em desenvolvimento profissional e gerencial), 6319-4/00 (Portais, provedores de conteúdo e outros serviços de informação). A escolha correta impacta diretamente nos impostos." },
];

export function ProdutoresDigitaisFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#F3E8FF]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#7E22CE] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas frequentes sobre contabilidade para produtores digitais</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre nossos serviços de contabilidade especializada</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {produtoresDigitaisFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#9333EA]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#7E22CE] py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
