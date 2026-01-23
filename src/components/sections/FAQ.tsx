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
  // BLOCO 1 - CONTABILIDADE DIGITAL
  {
    question: "O que é contabilidade digital e como ela funciona?",
    answer: "Contabilidade digital é um modelo 100% online onde você gerencia toda a contabilidade da sua empresa pela internet, sem precisar ir ao escritório. Através de uma plataforma exclusiva, você envia documentos, acompanha impostos, emite notas fiscais e recebe atendimento especializado via WhatsApp. É mais ágil, econômico e transparente que a contabilidade tradicional.",
  },
  {
    question: "Por que escolher uma contabilidade online?",
    answer: "A contabilidade online oferece mais agilidade, economia e transparência. Você tem acesso 24/7 aos seus dados, suporte rápido por WhatsApp, economia de até 40% comparado a escritórios tradicionais, e tudo sem burocracia de deslocamento. Ideal para empreendedores modernos que precisam de soluções práticas e eficientes.",
  },
  {
    question: "Como funciona o atendimento na contabilidade digital?",
    answer: "Nosso atendimento é feito principalmente via WhatsApp durante horário comercial (9h-18h, seg-sex), com tempo médio de resposta de 2 horas. Você terá um contador dedicado que conhece seu negócio, acesso ao portal do cliente 24/7 e pode agendar reuniões online sempre que precisar. Simples, rápido e humanizado.",
  },
  // BLOCO 2 - ABERTURA E MIGRAÇÃO
  {
    question: "Quanto tempo leva para abrir uma empresa?",
    answer: "O processo completo leva de 5 a 10 dias úteis, dependendo da cidade e tipo de empresa. Cuidamos de tudo: análise de viabilidade, registro na Junta Comercial, CNPJ, inscrições municipais e estaduais, alvarás e licenças. Tudo 100% digital e você acompanha cada etapa pelo nosso sistema.",
  },
  {
    question: "Posso migrar minha contabilidade sem problemas?",
    answer: "Sim! A migração é 100% gratuita e sem complicações. Cuidamos de toda a comunicação com seu contador atual, solicitamos os documentos necessários e fazemos a transição sem interromper suas operações. O processo leva em média 15 dias e você não precisa se preocupar com nada.",
  },
  {
    question: "Precisarei abrir conta bancária específica?",
    answer: "Não é obrigatório abrir uma nova conta, mas recomendamos ter uma conta PJ separada da pessoa física para melhor organização financeira e controle contábil. Isso facilita a gestão, evita mistura de patrimônios e simplifica a prestação de contas. Podemos orientar sobre as melhores opções do mercado.",
  },
  // BLOCO 3 - TRIBUTAÇÃO E ECONOMIA
  {
    question: "Como vocês ajudam a reduzir impostos legalmente?",
    answer: "Fazemos um planejamento tributário estratégico analisando seu faturamento, atividades e despesas. Identificamos o melhor regime tributário (Simples Nacional, Lucro Presumido ou Real), aplicamos o Fator R quando vantajoso, otimizamos o pró-labore e aproveitamos todos os benefícios fiscais legais. A economia pode chegar a 50% em impostos.",
  },
  {
    question: "Atendem empresas de Lucro Presumido e Real?",
    answer: "Sim! Atendemos empresas em todos os regimes tributários: Simples Nacional, Lucro Presumido e Lucro Real. Nossa equipe é especializada em cada modalidade e faz a análise completa para indicar qual é mais vantajoso para o seu negócio. Também cuidamos de todas as obrigações acessórias específicas de cada regime.",
  },
  // BLOCO 4 - SERVIÇOS E DIFERENCIAIS
  {
    question: "A sede virtual é gratuita?",
    answer: "Sim! Oferecemos sede virtual gratuita para nossos clientes (consulte disponibilidade por cidade). Você usa nosso endereço comercial para registrar sua empresa, recebe correspondências e tem um espaço profissional sem custos de aluguel. Perfeito para quem trabalha home office ou não precisa de espaço físico.",
  },
  {
    question: "Vocês fazem gestão financeira além da contabilidade?",
    answer: "Sim! Oferecemos serviço de BPO Financeiro completo: gestão de contas a pagar e receber, conciliação bancária, relatórios gerenciais, fluxo de caixa e dashboard em tempo real. Assim você tem uma visão 360° das finanças da sua empresa e pode tomar decisões estratégicas baseadas em dados reais.",
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
              Tire suas dúvidas sobre contabilidade digital. 
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
