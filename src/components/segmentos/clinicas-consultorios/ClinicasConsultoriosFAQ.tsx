import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const clinicasConsultoriosFaqs = [
  { question: "O que é equiparação hospitalar e como minha clínica pode se beneficiar?", answer: "A equiparação hospitalar permite que clínicas que atendem requisitos da ANVISA (como registro no CNES e alvará sanitário) reduzam a base de cálculo de IR e CSLL de 32% para 8% do faturamento. Isso pode representar uma economia de mais de 60% nos impostos federais." },
  { question: "Quais tipos de clínicas podem ter equiparação hospitalar?", answer: "Clínicas médicas, odontológicas, de estética, laboratórios e outros estabelecimentos de saúde que prestem serviços sob supervisão médica, tenham registro no CNES e alvará sanitário vigente. Analisamos caso a caso para verificar a elegibilidade." },
  { question: "Como funciona a gestão de folha para clínicas?", answer: "Gerenciamos a folha completa: médicos (pessoa física ou jurídica), enfermeiros, técnicos, recepcionistas e administrativos. Cada categoria tem convenção coletiva, encargos e benefícios específicos que controlamos rigorosamente." },
  { question: "Como vocês lidam com convênios e glosas?", answer: "Fazemos a conciliação fiscal dos recebimentos de cada operadora, tratamos as glosas contabilmente e emitimos NF correta para cada convênio. Você tem visibilidade total do que recebe vs o que foi faturado." },
  { question: "Vale a pena criar uma holding para clínica?", answer: "Para clínicas com múltiplos sócios e patrimônio relevante, sim. A holding patrimonial protege bens pessoais, facilita planejamento sucessório e pode otimizar a tributação sobre distribuição de lucros." },
  { question: "Quais obrigações da ANVISA vocês cuidam?", answer: "Orientamos sobre alvará sanitário, registro no CNES, licenças específicas e obrigações acessórias como DMED. Não substituímos consultoria técnica sanitária, mas garantimos que a parte fiscal e contábil esteja 100% em conformidade." },
];

export function ClinicasConsultoriosFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#D1FAE5]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#047857] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas sobre contabilidade para clínicas</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre contabilidade para estabelecimentos de saúde</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {clinicasConsultoriosFaqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#059669]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#047857] py-5">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
