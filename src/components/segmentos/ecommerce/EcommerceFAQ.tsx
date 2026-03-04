import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const ecommerceFaqs = [
  { question: "Preciso de um contador especializado em e-commerce?", answer: "Sim. E-commerce tem particularidades como controle de estoque/CMV, ICMS-ST entre estados, emissão de NF para marketplaces e devoluções fiscais que contadores genéricos costumam errar, gerando multas e bloqueios." },
  { question: "Como funciona o ICMS-ST para e-commerce?", answer: "A substituição tributária (ICMS-ST) é um regime em que o imposto é recolhido antecipadamente. Cada estado tem regras e alíquotas diferentes. Calculamos corretamente o ICMS-ST para cada UF, evitando autuações e aproveitando créditos." },
  { question: "Como é feito o controle de estoque e CMV?", answer: "Implementamos o controle do Custo de Mercadoria Vendida (CMV) integrado à sua plataforma. Isso garante que você saiba o lucro real de cada venda e tribute sobre o valor correto, sem pagar impostos a mais." },
  { question: "Vocês atendem dropshipping?", answer: "Sim! Tanto dropshipping nacional quanto internacional. Estruturamos a operação dentro da legalidade, com enquadramento tributário correto, emissão de NF e compliance com ICMS e IPI quando aplicável." },
  { question: "Quais marketplaces vocês atendem?", answer: "Atendemos todos: Mercado Livre, Shopee, Amazon, Magalu, Shopify, WooCommerce, Nuvemshop e outros. Configuramos a emissão de NF-e correta para cada plataforma." },
  { question: "E-commerce pode ser Simples Nacional?", answer: "Sim, desde que o faturamento anual não ultrapasse R$ 4,8 milhões. O Simples Nacional é vantajoso para muitos e-commerces. Analisamos se é a melhor opção ou se Lucro Presumido seria mais econômico para seu caso." },
];

export function EcommerceFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#FCE7F3]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#BE185D] uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Perguntas sobre contabilidade para e-commerce</h2>
            <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre contabilidade para lojas online</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {ecommerceFaqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-[#DB2777]/50">
                <AccordionTrigger className="text-left text-foreground hover:text-[#BE185D] py-5">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
