import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "Vale a pena abrir empresa (PJ) como médico?",
    answer: "Na maioria dos casos, sim! Como pessoa física, médicos podem pagar até 27,5% de Imposto de Renda. Como PJ, com planejamento tributário adequado, esse valor pode cair para 6% a 15%, dependendo do faturamento e regime escolhido. Fazemos uma análise personalizada para cada caso.",
  },
  {
    question: "Qual o melhor regime tributário para dentistas?",
    answer: "Depende do seu faturamento e estrutura de custos. Para dentistas com faturamento até R$ 81.000/ano, o MEI pode ser interessante. Acima disso, o Simples Nacional com otimização do Fator R geralmente é a melhor opção, permitindo pagar apenas 6% de impostos.",
  },
  {
    question: "O que é Fator R e como ele reduz meus impostos?",
    answer: "O Fator R é a razão entre a folha de pagamento (incluindo pró-labore) e a receita bruta dos últimos 12 meses. Se esse valor for maior que 28%, empresas no Simples Nacional pagam impostos pelo Anexo III (6%) ao invés do Anexo V (15,5%). Nós fazemos esse monitoramento mensalmente para garantir a menor tributação possível.",
  },
  {
    question: "Como funciona a contabilidade 100% online?",
    answer: "Todo o processo é digital: você envia documentos pelo nosso aplicativo ou WhatsApp, recebe guias de pagamento e relatórios no celular, e tem suporte via chat com especialistas. Você não precisa sair do consultório para nada relacionado à contabilidade.",
  },
  {
    question: "Posso migrar a contabilidade do meu consultório sem multa?",
    answer: "Sim! A migração é um direito seu. Nós cuidamos de todo o processo: entramos em contato com seu contador atual, solicitamos toda a documentação necessária e fazemos a transição sem que você precise se preocupar com nada.",
  },
  {
    question: "Quanto tempo leva para abrir uma empresa médica?",
    answer: "Com nosso processo 100% digital, a abertura de empresa é concluída em média em 7 a 15 dias úteis, incluindo CNPJ, Contrato Social, Inscrição Municipal, Alvará e registro no CRM. Fornecemos sede virtual gratuita para quem não tem endereço comercial.",
  },
  {
    question: "Vocês fazem a DMED e outras obrigações específicas da saúde?",
    answer: "Sim! Conhecemos todas as obrigações específicas dos profissionais da saúde: DMED, declarações aos conselhos de classe (CRM, CRO, CRP), REINF, eSocial e todas as demais. Você não precisa se preocupar com prazos - cuidamos de tudo.",
  },
  {
    question: "Atendem clínicas com funcionários?",
    answer: "Sim! Temos planos específicos para clínicas com funcionários, incluindo gestão completa de folha de pagamento, eSocial, admissões, rescisões e todas as obrigações trabalhistas. Nosso plano Empresarial inclui até 3 funcionários no valor mensal.",
  },
  {
    question: "O que está incluso na abertura de empresa gratuita?",
    answer: "Inclui: elaboração do Contrato Social (geralmente SLU), registro na Junta Comercial, obtenção do CNPJ, Inscrição Municipal, Alvará de funcionamento e auxílio no registro junto ao conselho de classe. Também oferecemos sede virtual gratuita.",
  },
  {
    question: "Como funciona o suporte ao cliente?",
    answer: "Você tem acesso a especialistas por WhatsApp, e-mail e nosso aplicativo. O tempo médio de resposta é de 2 horas em dias úteis. No plano Empresarial, você tem um gerente de conta dedicado com atendimento prioritário.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Header */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
              Perguntas{" "}
              <span className="text-gradient">frequentes</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tire suas dúvidas sobre contabilidade para profissionais da saúde. 
              Se não encontrar sua pergunta, entre em contato conosco.
            </p>

            <div className="bg-zen-light-teal rounded-2xl p-6 lg:p-8">
              <h3 className="font-semibold text-lg mb-3 text-foreground">
                Ainda tem dúvidas?
              </h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe de especialistas está pronta para ajudar você. 
                Agende uma consulta gratuita ou fale conosco pelo WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="zen" asChild>
                  <Link to="/contato">Agendar Consulta</Link>
                </Button>
                <Button variant="whatsapp" asChild>
                  <a
                    href="https://wa.me/5519974158342?text=Olá! Tenho uma dúvida sobre contabilidade para profissionais da saúde."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right - Accordion */}
          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-secondary/50 data-[state=open]:shadow-soft transition-all"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-secondary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
