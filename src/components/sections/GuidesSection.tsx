import { Link } from "react-router-dom";
import { Stethoscope, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Guias Especializados por Profissão
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conteúdo aprofundado e gratuito para profissionais de saúde que querem pagar menos impostos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              to={guide.href}
              className="group rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center gap-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <guide.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{guide.title}</h3>
              <p className="text-muted-foreground">{guide.description}</p>
              <Button variant="outline" size="sm" className="mt-auto" tabIndex={-1}>
                Ler guia completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
