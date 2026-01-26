import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const faqs = [
  {
    question: "Como funciona o processo de abertura?",
    answer: "Todo o processo é conduzido 100% a distância. Após a contratação, preparamos os documentos e enviamos no seu e-mail para assinatura digital. Em poucos dias seu negócio estará legalizado.",
  },
  {
    question: "Preciso ir a algum órgão público?",
    answer: "Não! Nós cuidamos de todos os procedimentos para você. Todo o registro é feito remotamente, sem necessidade de deslocamento.",
  },
  {
    question: "Posso usar uma sede virtual?",
    answer: "Sim! Oferecemos sede virtual gratuita na maior parte dos negócios que atendemos. Consulte as regras específicas para sua atividade.",
  },
  {
    question: "Vocês atendem empresas de comércio?",
    answer: "Sim, atendemos empresas de comércio e também prestadores de serviços.",
  },
  {
    question: "Atendem quem é MEI?",
    answer: "Sim! Atendemos casos de transformação de MEI para Microempresa, especialmente quando você ultrapassa o limite de faturamento ou precisa exercer atividades que exigem o desenquadramento do MEI.",
  },
  {
    question: "Quando recebo acesso à Conta Digital PJ?",
    answer: "Assim que sua empresa estiver formalizada, você receberá as instruções para abrir sua conta digital PJ gratuita com nosso parceiro.",
  },
];

export function AbrirEmpresaFAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
              Dúvidas{" "}
              <span className="text-gradient">Frequentes</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tire suas dúvidas sobre o processo de abertura de empresa. 
              Se não encontrar sua pergunta, fale conosco.
            </p>

            <div className="bg-zen-light-teal rounded-2xl p-6 lg:p-8 mb-8">
              <h3 className="font-semibold text-lg mb-3 text-foreground">
                Ainda tem dúvidas?
              </h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe de especialistas está pronta para ajudar você 
                a abrir sua empresa sem complicações.
              </p>
              <Button variant="whatsapp" asChild>
                <a
                  href="https://wa.me/5519974158342?text=Olá! Tenho uma dúvida sobre abertura de empresa."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>

            {/* Credibilidade */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">
                Mais de 3.000 empresas abertas com sucesso
              </span>
            </div>
          </motion.div>

          {/* Right - Accordion */}
          <div>
            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-secondary/50 data-[state=open]:shadow-soft transition-all hover:border-secondary/30 hover:-translate-y-0.5"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:text-secondary py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
