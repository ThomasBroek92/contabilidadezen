import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Headphones, 
  TrendingUp,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
    borderColor: "border-orange-500",
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
    borderColor: "border-violet-500",
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
    borderColor: "border-emerald-500",
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

function TimelineCard({ step, index, isLast }: { step: typeof journeySteps[0]; index: number; isLast: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative flex items-start gap-6 ${!isLast ? 'pb-12 md:pb-16' : ''}`}
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        {/* Icon circle */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 200 }}
          className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
        >
          <step.icon className="h-7 w-7 md:h-9 md:w-9 text-white" />
        </motion.div>
        
        {/* Vertical line */}
        {!isLast && (
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-1 flex-grow bg-gradient-to-b from-current to-border origin-top mt-4"
            style={{ color: index === 0 ? '#f97316' : index === 1 ? '#7c3aed' : '#059669' }}
          />
        )}
      </div>

      {/* Content card */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
      </motion.article>
    </motion.div>
  );
}

export function CustomerJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const progressHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  const whatsappMessage = encodeURIComponent(
    "Olá! Vim pelo site e gostaria de entender melhor como funciona a jornada de clientes na Contabilidade Zen. Podem me ajudar?"
  );

  return (
    <section ref={containerRef} className="py-20 lg:py-28 bg-background relative overflow-hidden">
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

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Background progress line */}
          <div className="absolute left-8 md:left-10 top-0 bottom-0 w-1 bg-border rounded-full">
            <motion.div
              className="w-full bg-gradient-to-b from-orange-500 via-violet-500 to-emerald-500 rounded-full origin-top"
              style={{ height: progressHeight }}
            />
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
