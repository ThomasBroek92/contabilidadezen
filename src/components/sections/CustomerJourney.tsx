import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Headphones, 
  TrendingUp,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const journeySteps = [
  {
    id: 1,
    badge: "ONBOARDING",
    title: "Seja Bem-Vindo!",
    icon: Trophy,
    gradient: "from-orange-500 to-orange-400",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-600",
    description: "Todo novo cliente da Contabilidade Zen passa por um processo de onboarding completo que inclui:",
    benefits: [
      "Call de ativação com seu contador dedicado",
      "Orientações sobre rotina mensal e documentação",
      "Configuração da sua área do cliente",
      "Treinamento para emissão de notas fiscais",
    ],
    conclusion: "Isso garante que você esteja preparado(a) para administrar sua empresa de forma correta desde o primeiro dia.",
    step: "Primeiro Passo",
    stepLabel: "Iniciando a jornada Zen",
  },
  {
    id: 2,
    badge: "SUPORTE",
    title: "Atendimento!",
    icon: Headphones,
    gradient: "from-violet-600 to-violet-400",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-600",
    description: "Tanto no onboarding quanto no dia a dia operacional, sua empresa terá acesso ao nosso suporte ágil e humanizado:",
    benefits: [
      "WhatsApp direto com seu contador",
      "Horário comercial: Segunda a sexta, 9h às 18h",
      "Tempo médio de resposta: 2 horas",
      "Portal do cliente 24/7 com tutoriais",
    ],
    conclusion: "Nosso grande objetivo é garantir que suas demandas sejam supridas com rapidez, clareza e atenção.",
    step: "Segundo Passo",
    stepLabel: "Atendimento especializado",
  },
  {
    id: 3,
    badge: "CUSTOMER SUCCESS",
    title: "Sua experiência",
    icon: TrendingUp,
    gradient: "from-emerald-600 to-emerald-400",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-600",
    description: "Nosso time de sucesso do cliente vai constantemente avaliar seu atendimento e satisfação para garantir a melhor experiência:",
    benefits: [
      "Pesquisas de NPS trimestrais",
      "Reuniões de alinhamento semestrais",
      "Análise proativa de oportunidades de economia",
      "Relatórios mensais de desempenho fiscal",
    ],
    conclusion: "Não é à toa que temos uma das melhores taxas de satisfação do mercado contábil brasileiro: 4.9/5 no Google.",
    step: "Terceiro Passo",
    stepLabel: "Avaliação contínua dos serviços",
  },
];

function JourneyCard({ step, index }: { step: typeof journeySteps[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative bg-card rounded-2xl p-8 border border-border hover:border-secondary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
          <step.icon className="h-9 w-9 text-white" />
        </div>
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-4">
        <span className={`${step.badgeBg} ${step.badgeText} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider`}>
          {step.badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-foreground text-center mb-4">
        {step.title}
      </h3>

      {/* Description */}
      <div className="text-muted-foreground text-sm leading-relaxed flex-grow">
        <p className="mb-4">{step.description}</p>
        
        <ul className="space-y-2 mb-4">
          {step.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${step.badgeText}`} />
              <span className="text-foreground/80">{benefit}</span>
            </li>
          ))}
        </ul>
        
        <p className="text-foreground/70">{step.conclusion}</p>
      </div>

      {/* Step indicator */}
      <div className="mt-6 pt-4 border-t border-border text-center">
        <span className="text-secondary font-semibold text-sm block">{step.step}</span>
        <span className="text-muted-foreground text-xs">{step.stepLabel}</span>
      </div>
    </motion.article>
  );
}

export function CustomerJourney() {
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" });

  const whatsappMessage = encodeURIComponent(
    "Olá! Vim pelo site e gostaria de entender melhor como funciona a jornada de clientes na Contabilidade Zen. Podem me ajudar?"
  );

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-secondary/10 text-secondary px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
            Transparência e Cuidado
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Como será a sua jornada{" "}
            <span className="text-gradient">na Contabilidade Zen</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Do primeiro contato até o sucesso do seu negócio, você terá suporte 
            completo em cada etapa.
          </p>
        </div>

        {/* Timeline connector line (desktop only) */}
        <div ref={lineRef} className="hidden lg:block relative mb-8">
          <div className="absolute top-1/2 left-[15%] right-[15%] h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={lineInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-orange-500 via-violet-500 to-emerald-500 origin-left"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {journeySteps.map((step, index) => (
            <JourneyCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-8"
            asChild
          >
            <a 
              href={`https://wa.me/5519974158342?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
