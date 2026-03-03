import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, FileCheck, BarChart3, Shield, Clock, Users, RotateCcw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const benefits = [
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    tagline: "Pague menos impostos legalmente",
    description: "Análise completa para escolher entre Simples Nacional e Lucro Presumido, garantindo a menor carga tributária legal para sua representação.",
    gradient: "from-[#E87C1E] to-[#F5A623]",
  },
  {
    icon: FileCheck,
    title: "Burocracia Zero",
    tagline: "Você vende, nós cuidamos do resto",
    description: "Cuidamos de DARF, GFIP, SPED e todas as obrigações junto ao CORE. Você foca nas vendas, nós na papelada.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: BarChart3,
    title: "Controle de Comissões",
    tagline: "Visão clara de cada representada",
    description: "Gestão organizada de comissões de múltiplas representadas. Saiba exatamente quanto você ganha de cada empresa.",
    gradient: "from-[#C4680F] to-[#E87C1E]",
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    tagline: "Fique 100% regular sem preocupação",
    description: "Mantenha regularidade total com a Receita Federal e o CORE. Evite multas, penalidades e dores de cabeça.",
    gradient: "from-accent to-secondary",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    tagline: "Mais tempo para fechar negócios",
    description: "Automatizamos a emissão de notas fiscais e obrigações acessórias. Mais tempo para prospectar e fechar negócios.",
    gradient: "from-[#E87C1E] via-[#F5A623] to-[#FDE8CC]",
  },
  {
    icon: Users,
    title: "Atendimento Humanizado",
    tagline: "Seu contador, sempre acessível",
    description: "Contador dedicado que entende a realidade do representante comercial e está sempre disponível para te ajudar.",
    gradient: "from-secondary via-accent to-emerald-400",
  },
];

function FlipCard({ benefit, index, isMobile }: { benefit: typeof benefits[0]; index: number; isMobile: boolean }) {
  const [flipped, setFlipped] = useState(false);

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick = () => {
    if (isMobile) setFlipped((f) => !f);
  };

  return (
    <div
      className="group"
      style={{ perspective: "1000px" }}
      onClick={handleClick}
    >
      <div
        className="relative w-full transition-transform duration-600 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : isMobile ? "rotateY(0deg)" : undefined,
          minHeight: "280px",
        }}
        {...(!isMobile && {
          onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "rotateY(180deg)"; },
          onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "rotateY(0deg)"; },
        })}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} p-6 flex flex-col items-center justify-center text-center`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <span className="absolute top-4 left-5 text-3xl font-black text-white/20 select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          {isMobile && (
            <RotateCcw className="absolute top-4 right-4 h-4 w-4 text-white/40" aria-hidden="true" />
          )}

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <benefit.icon className="h-8 w-8 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
          <p className="text-white/80 text-sm italic">"{benefit.tagline}"</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border border-border p-6 flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-muted-foreground leading-relaxed mb-6">
            {benefit.description}
          </p>
          <div className="w-12 h-px bg-border mb-6" />
          <Button
            size="sm"
            className="bg-[#E87C1E] hover:bg-[#C4680F] text-white"
            onClick={(e) => { e.stopPropagation(); scrollToForm(); }}
          >
            Quero esse benefício
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RepresentantesBenefits() {
  const isMobile = useIsMobile();

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-[#FFFBF5]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-[#C4680F] uppercase tracking-wider">
            Nossos Benefícios
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Como nossa contabilidade para representantes organiza suas finanças?
          </h2>
          <p className="text-muted-foreground text-lg">
            {isMobile ? "Toque nos cards para descobrir mais" : "Passe o mouse sobre os cards para descobrir mais"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <FlipCard key={index} benefit={benefit} index={index} isMobile={isMobile} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-[#E87C1E] hover:bg-[#C4680F] text-white" onClick={scrollToForm}>
            Elimine as burocracias ainda hoje
          </Button>
        </div>
      </div>
    </section>
  );
}
