import { Button } from "@/components/ui/button";
import { 
  Users, 
  Send, 
  BadgeDollarSign,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const journeySteps = [
  {
    id: 1,
    badge: "CADASTRO",
    title: "Torne-se Embaixador!",
    icon: Users,
    gradient: "from-orange-500 to-orange-400",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-600",
    borderColor: "border-orange-500",
    description: "Ao se cadastrar como parceiro embaixador, você terá acesso a:",
    benefits: [
      "Link exclusivo de indicação personalizado",
      "Materiais de divulgação prontos para usar",
      "Dashboard para acompanhar suas indicações",
      "Suporte dedicado via WhatsApp",
    ],
    conclusion: "Em menos de 60 segundos você está pronto para começar a indicar e ganhar.",
    step: "Primeiro Passo",
    stepLabel: "Iniciando sua parceria",
  },
  {
    id: 2,
    badge: "INDICAÇÃO",
    title: "Compartilhe!",
    icon: Send,
    gradient: "from-violet-600 to-violet-400",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-600",
    borderColor: "border-violet-500",
    description: "Indique empresas e profissionais da sua rede de forma simples:",
    benefits: [
      "Envie seu link exclusivo por WhatsApp ou e-mail",
      "Ou passe os dados diretamente para nosso time",
      "Acompanhe o status em tempo real no dashboard",
      "Receba notificações de cada etapa da indicação",
    ],
    conclusion: "Você será informado sobre cada avanço do seu indicado no processo.",
    step: "Segundo Passo",
    stepLabel: "Indicando sua rede",
  },
  {
    id: 3,
    badge: "RECEBIMENTO",
    title: "Receba seu PIX!",
    icon: BadgeDollarSign,
    gradient: "from-emerald-600 to-emerald-400",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-600",
    borderColor: "border-emerald-500",
    description: "Após a confirmação do pagamento da primeira mensalidade pelo indicado:",
    benefits: [
      "Valor integral (100%) depositado via PIX",
      "Pagamento em até 5 dias úteis",
      "Comprovante enviado por WhatsApp",
      "Sem limite de indicações — ganhe sempre!",
    ],
    conclusion: "Programa transparente e em conformidade com o Código de Ética do Contador.",
    step: "Terceiro Passo",
    stepLabel: "Recebendo sua recompensa",
  },
];

function TimelineCard({ step, index, isLast }: { step: typeof journeySteps[0]; index: number; isLast: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative flex items-start gap-6 ${!isLast ? 'pb-12 md:pb-16' : ''} animate-fade-up`}
      style={{ animationDelay: shouldReduceMotion ? '0ms' : `${(index + 1) * 200}ms` }}
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        {/* Icon circle */}
        <div 
          className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg animate-scale-in`}
          style={{ animationDelay: shouldReduceMotion ? '0ms' : `${(index + 1) * 300}ms` }}
        >
          <step.icon className="h-7 w-7 md:h-9 md:w-9 text-white" />
        </div>
        
        {/* Vertical line */}
        {!isLast && (
          <div 
            className="w-1 flex-grow bg-gradient-to-b from-current to-border mt-4 origin-top"
            style={{ color: index === 0 ? '#f97316' : index === 1 ? '#7c3aed' : '#059669' }}
          />
        )}
      </div>

      {/* Content card */}
      <article
        className={`flex-1 bg-card rounded-2xl p-6 md:p-8 border-2 ${step.borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`${step.badgeBg} ${step.badgeText} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider`}>
            {step.badge}
          </span>
          <span className="text-muted-foreground text-sm">
            {step.step}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
          {step.title}
        </h3>

        {/* Description */}
        <div className="text-muted-foreground text-sm leading-relaxed">
          <p className="mb-4">{step.description}</p>
          
          <ul className="space-y-2 mb-4">
            {step.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${step.badgeText}`} />
                <span className="text-foreground/80">{benefit}</span>
              </li>
            ))}
          </ul>
          
          <p className="text-foreground/70 font-medium">{step.conclusion}</p>
        </div>

        {/* Step label */}
        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-secondary font-semibold text-sm">{step.stepLabel}</span>
        </div>
      </article>
    </div>
  );
}

export function PartnerJourney() {
  const containerRef = useRef(null);

  const handleScrollToCadastro = () => {
    document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <span className="inline-block bg-secondary/10 text-secondary px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
            Programa de Parceria
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Como funciona o{" "}
            <span className="text-gradient">Indique e Ganhe</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Do cadastro ao seu PIX, em 3 passos simples e transparentes.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Background progress line */}
          <div className="absolute left-8 md:left-10 top-0 bottom-0 w-1 bg-border rounded-full">
            <div className="w-full h-full bg-gradient-to-b from-orange-500 via-violet-500 to-emerald-500 rounded-full" />
          </div>

          {/* Timeline cards */}
          <div className="relative">
            {journeySteps.map((step, index) => (
              <TimelineCard 
                key={step.id} 
                step={step} 
                index={index} 
                isLast={index === journeySteps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            variant="hero"
            className="font-semibold px-8"
            onClick={handleScrollToCadastro}
          >
            Quero me cadastrar agora
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
