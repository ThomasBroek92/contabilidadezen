import { Button } from "@/components/ui/button";
import { MessageSquare, Search, FileCheck, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Contato Inicial",
    description: "Preencha o formulário e receba um diagnóstico gratuito da sua situação fiscal atual.",
  },
  {
    number: "02",
    icon: Search,
    title: "Análise Completa",
    description: "Nossa equipe analisa detalhadamente suas finanças e identifica oportunidades de economia.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Plano Personalizado",
    description: "Desenvolvemos um plano tributário sob medida para o seu consultório ou clínica.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Resultados",
    description: "Implantamos as estratégias e você começa a economizar já no primeiro mês.",
  },
];

export function DentistasProcess() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Como Funciona
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            4 passos para reduzir seus impostos
          </h2>
          <p className="text-muted-foreground text-lg">
            Um processo simples e transparente para você começar a economizar
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-border" />
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
