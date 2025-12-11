import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Essencial",
    price: "89",
    description: "Para quem está começando",
    ideal: "Faturamento até R$ 15 mil/mês",
    features: [
      "Abertura de empresa grátis",
      "Contabilidade completa",
      "Emissão de notas fiscais",
      "Suporte por chat",
      "Dashboard financeiro",
    ],
    popular: false,
  },
  {
    name: "Zen",
    price: "149",
    description: "O mais escolhido",
    ideal: "Faturamento até R$ 50 mil/mês",
    features: [
      "Tudo do plano Essencial",
      "Consultoria tributária mensal",
      "Suporte prioritário",
      "Relatórios personalizados",
      "Gestão de funcionários (até 2)",
      "Integração bancária",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "249",
    description: "Para empresas em crescimento",
    ideal: "Faturamento até R$ 150 mil/mês",
    features: [
      "Tudo do plano Zen",
      "Contador dedicado",
      "Gestão de funcionários ilimitada",
      "Planejamento tributário avançado",
      "Reuniões mensais de acompanhamento",
      "Suporte telefônico 24/7",
    ],
    popular: false,
  },
];

export function AbrirEmpresaPricing() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planos transparentes. <span className="text-gradient">Sem surpresas.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio. Todos incluem abertura de empresa grátis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-2 border-transparent bg-clip-padding before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-secondary before:to-accent"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-zen-light-teal text-secondary border-0 px-4 py-1">
                      Escolha Zen
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-foreground">R$ {plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.ideal}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "hero" : "outline"}
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link to="/contato">
                      Começar Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
