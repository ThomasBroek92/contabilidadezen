import { motion } from "framer-motion";
import { UserPlus, Settings, Building2 } from "lucide-react";

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
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona em <span className="text-gradient">3 passos simples</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Abrir sua empresa nunca foi tão fácil. Deixe a burocracia com a gente.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary to-accent hidden md:block" />

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
