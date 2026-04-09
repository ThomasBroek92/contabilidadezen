import { Link } from "react-router-dom";
import { Stethoscope, Brain, ArrowRight } from "lucide-react";

const guides = [
  {
    icon: Stethoscope,
    title: "Guia Médicos PJ",
    description: "Tudo sobre abertura de CNPJ, regimes tributários, CNAE e planejamento fiscal para médicos.",
    href: "/guia-contabilidade-medicos",
  },
  {
    icon: Brain,
    title: "Guia Psicólogos PJ",
    description: "CNAE, Simples Nacional, Fator R e credenciamento em planos de saúde para psicólogos.",
    href: "/guia-contabilidade-psicologos",
  },
];

export const GuidesSection = () => {
  return (
    <section className="py-10 lg:py-14 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Guias Especializados por Profissão
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Conteúdo gratuito para profissionais de saúde que querem pagar menos impostos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              to={guide.href}
              className="group rounded-xl border border-border/60 bg-card px-5 py-5 flex items-center gap-4 transition-all duration-300 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-2.5 shrink-0">
                <guide.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{guide.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{guide.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary shrink-0 ml-auto transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
