import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const outrosSegmentosFaqs = [
  { question: "Qual o melhor regime tributário para profissionais autônomos?", answer: "Depende do faturamento, despesas e atividade. Para a maioria dos profissionais autônomos, o Simples Nacional no Anexo III (a partir de 6%) é a opção mais vantajosa. Analisamos seu caso específico para definir o melhor regime." },
  { question: "Preciso de CNPJ para emitir nota fiscal?", answer: "Sim. Para emitir NF-e de serviços, você precisa de CNPJ com inscrição municipal. Abrimos seu CNPJ em até 7 dias com todo o processo digital — contrato social, inscrições e cadastros inclusos." },
  { question: "O que é Fator R e como ele me ajuda?", answer: "O Fator R é a relação entre folha de pagamento (incluindo pró-labore) e receita bruta. Quando esse índice é ≥ 28%, sua empresa pode ser enquadrada no Anexo III do Simples (6%) em vez do Anexo V (15,5%). Otimizamos isso para você." },
  { question: "Vocês atendem minha profissão?", answer: "Sim! Atendemos arquitetos, engenheiros, designers, publicitários, coaches, mentores, fotógrafos, videomakers, consultores e muitas outras profissões. Cada uma tem particularidades tributárias que conhecemos bem." },
  { question: "Posso migrar de outro contador?", answer: "Sim! Fazemos toda a transição sem custo adicional. Solicitamos os dados do contador anterior, conferimos tudo e assumimos sua contabilidade com continuidade e segurança." },
  { question: "O atendimento é presencial ou online?", answer: "100% digital. Utilizamos plataformas modernas para comunicação, envio de documentos e acompanhamento. Atendemos clientes de todo o Brasil com a mesma qualidade." },
];

export function OutrosSegmentosFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#F1F5F9]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#334155] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas frequentes sobre contabilidade</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre contabilidade para profissionais</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {outrosSegmentosFaqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#475569]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#334155] py-5">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
