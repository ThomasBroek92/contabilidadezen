import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

const challenges = [
  "Regime tributário inadequado que faz você pagar mais impostos",
  "Dificuldade em gerir plantões em múltiplos hospitais",
  "DMED e outras obrigações específicas da saúde",
  "Falta de planejamento para transição de PF para PJ",
  "Contador que não entende as particularidades da sua profissão",
];

const solutions = [
  "Fator R otimizado para pagar apenas 6% de impostos",
  "Gestão centralizada de todos os seus rendimentos",
  "Cumprimento de todas as obrigações legais específicas",
  "Planejamento tributário personalizado para seu perfil",
  "Especialistas que conhecem sua rotina e necessidades",
];

export function WhySpecialized() {
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Por que contabilidade especializada?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
              Profissionais da saúde têm{" "}
              <span className="text-secondary">necessidades únicas</span>
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              Sua rotina é diferente: plantões, múltiplos vínculos, convênios, DMED, 
              conselhos de classe. Uma contabilidade genérica não entende essas particularidades 
              e pode fazer você pagar mais impostos do que deveria.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-primary-foreground/10 rounded-xl p-5">
                <span className="text-4xl font-bold text-secondary">27,5%</span>
                <p className="text-sm text-primary-foreground/70 mt-1">
                  Imposto máximo como pessoa física
                </p>
              </div>
              <div className="bg-primary-foreground/10 rounded-xl p-5">
                <span className="text-4xl font-bold text-secondary">6%</span>
                <p className="text-sm text-primary-foreground/70 mt-1">
                  Imposto com planejamento tributário
                </p>
              </div>
            </div>

            <Button variant="hero" size="lg" asChild>
              <Link to="/contato">
                Quero economizar em impostos
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Comparison */}
          <div className="space-y-6">
            {/* Problems */}
            <div className="bg-destructive/10 rounded-2xl p-6 border border-destructive/20">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Sem contabilidade especializada
              </h3>
              <ul className="space-y-3">
                {challenges.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-primary-foreground/80">
                    <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="bg-secondary/10 rounded-2xl p-6 border border-secondary/20">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                Com a Contabilidade Zen
              </h3>
              <ul className="space-y-3">
                {solutions.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-primary-foreground/80">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
