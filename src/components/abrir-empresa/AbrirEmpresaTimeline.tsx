import { UserPlus, Settings, Building2 } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const steps = [
  {
    icon: UserPlus,
    title: "Cadastro Zen",
    description: "Preencha um formulário simples em menos de 5 minutos com seus dados.",
  },
  {
    icon: Settings,
    title: "Nós Resolvemos",
    description: "Nossa equipe cuida de toda a burocracia, documentação e registros.",
  },
  {
    icon: Building2,
    title: "Empresa Aberta",
    description: "Receba seu CNPJ e comece a operar com total tranquilidade.",
  },
];

export function AbrirEmpresaTimeline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona em <span className="text-gradient">3 passos simples</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Abrir sua empresa nunca foi tão fácil. Deixe a burocracia com a gente.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary to-accent hidden md:block" />

            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`relative flex items-center gap-8 mb-12 last:mb-0 animate-fade-up ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ animationDelay: shouldReduceMotion ? '0ms' : `${index * 200}ms` }}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="bg-card p-6 rounded-2xl shadow-card border border-border/50">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center shadow-glow">
                    <step.icon className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-secondary md:hidden">
                    {index + 1}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
