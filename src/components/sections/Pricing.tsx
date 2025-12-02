import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Star } from "lucide-react";

const plans = [
  {
    name: "Profissional Liberal",
    price: "297,90",
    description: "Ideal para autônomos ou PJ sem funcionários",
    features: [
      "Contabilidade mensal completa",
      "Cálculo de todos os impostos",
      "Aplicativo para acompanhamento",
      "Suporte por WhatsApp",
      "Obrigações acessórias",
      "Relatórios mensais",
    ],
    ideal: "Faturamento até R$ 15.000/mês",
    popular: false,
  },
  {
    name: "Clínica / Consultório",
    price: "447,90",
    description: "Para clínicas físicas com necessidades específicas",
    features: [
      "Tudo do plano Profissional",
      "Conciliação bancária",
      "Gestão de pró-labore",
      "Suporte prioritário",
      "Relatórios detalhados",
      "Consultoria tributária",
    ],
    ideal: "Faturamento até R$ 50.000/mês",
    popular: true,
  },
  {
    name: "Empresarial",
    price: "597,90",
    description: "Para clínicas maiores com funcionários",
    features: [
      "Tudo do plano Clínica",
      "Folha de pagamento (até 3 func.)",
      "Consultoria tributária estratégica",
      "Gerente de conta dedicado",
      "Equiparação hospitalar",
      "Planejamento fiscal avançado",
    ],
    ideal: "Faturamento acima de R$ 50.000/mês",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Planos e Preços
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            Escolha o plano{" "}
            <span className="text-gradient">ideal para você</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Planos transparentes e sem surpresas. Todos incluem abertura de empresa gratuita
            e sede virtual sem custo adicional.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-6 lg:p-8 border-2 ${
                plan.popular 
                  ? "border-secondary shadow-glow" 
                  : "border-border"
              } transition-all duration-300 hover:shadow-card`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                    <Star className="h-4 w-4" />
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-sm text-muted-foreground">A partir de</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-foreground">R$</span>
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-xs text-secondary mt-2">{plan.ideal}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "zen" : "zen-outline"}
                className="w-full"
                asChild
              >
                <Link to="/contato">
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Todos os planos incluem: <span className="font-semibold text-foreground">Abertura de empresa gratuita</span> + 
            <span className="font-semibold text-foreground"> Sede virtual gratuita</span> + 
            <span className="font-semibold text-foreground"> 30 dias de garantia</span>
          </p>
        </div>
      </div>
    </section>
  );
}
