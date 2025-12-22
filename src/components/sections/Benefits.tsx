import { 
  TrendingDown, 
  Shield, 
  Clock, 
  HeadphonesIcon, 
  FileCheck, 
  Calculator 
} from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Redução Legal de Impostos",
    description: "Economia de tributos através de planejamento tributário especializado para profissionais da saúde.",
  },
  {
    icon: Shield,
    title: "Segurança Fiscal Total",
    description: "Fique tranquilo com todas as obrigações em dia. Sem surpresas com o fisco ou conselhos de classe.",
  },
  {
    icon: Clock,
    title: "Zero Burocracia",
    description: "Processo 100% digital. Você não perde tempo com papelada, focando no que realmente importa: seus pacientes.",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Humanizado",
    description: "Atendimento por especialistas que entendem sua rotina e falam a linguagem dos profissionais da saúde.",
  },
  {
    icon: FileCheck,
    title: "Relatórios Claros",
    description: "Acompanhe a saúde financeira do seu consultório com relatórios simples e fáceis de entender.",
  },
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    description: "Análise personalizada do melhor regime tributário: Simples Nacional, Lucro Presumido ou MEI.",
  },
];

export function Benefits() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Por que escolher a Contabilidade Zen
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            Benefícios que fazem a{" "}
            <span className="text-gradient">diferença</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos uma contabilidade pensada especialmente para as necessidades 
            dos profissionais da saúde, com foco em economia, segurança e praticidade.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-secondary/50 hover:shadow-card transition-all duration-300"
            >
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <benefit.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
