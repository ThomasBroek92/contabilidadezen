import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Send, Handshake } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: CheckCircle,
    title: "Escolha nosso serviço",
    description: "Primeiro, decida contratar nossos serviços especializados para reduzir seus impostos e otimizar as finanças da sua clínica com soluções fiscais personalizadas.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Preencha o formulário",
    description: "Em seguida, preencha o formulário com suas informações. Verifique tudo cuidadosamente para garantir que os dados estão corretos.",
  },
  {
    number: "03",
    icon: Send,
    title: "Envie os seus dados",
    description: "Depois, envie suas informações preenchidas. Nossa equipe receberá os dados e agendará rapidamente sua reunião.",
  },
  {
    number: "04",
    icon: Handshake,
    title: "Formalize a contratação",
    description: "Por fim, aguarde o contato de um especialista para formalizar a contratação e otimizar as finanças da sua clínica.",
  },
];

export function MedicosProcess() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Dê o próximo passo para pagar menos impostos!
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Comece a <span className="text-secondary">otimizar as finanças</span> da sua clínica agora!
          </h2>
          <p className="text-muted-foreground text-lg">
            Com nossas soluções, você paga menos impostos e tem mais controle sobre as finanças da sua clínica.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative p-6 bg-card rounded-xl border border-border text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                {step.number}
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mt-4 mb-5">
                <step.icon className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" onClick={scrollToForm}>
            Comece agora e reduza impostos
          </Button>
        </div>
      </div>
    </section>
  );
}
