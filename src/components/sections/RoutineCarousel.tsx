import { FileText, Upload, Calculator, FileCheck, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const clientSteps = [
  {
    number: "1º",
    description: "Você realiza suas vendas ou serviços e emite suas notas fiscais",
    icon: FileText,
  },
  {
    number: "2º",
    description: "Envia suas despesas e notas fiscais recebidas durante o mês",
    icon: Upload,
  },
];

const zenSteps = [
  {
    number: "3º",
    description: "Nosso time de contadores especialistas processam as informações enviadas",
    icon: Calculator,
  },
  {
    number: "4º",
    description: "Elaboramos e enviamos os seus impostos, taxas e fechamentos mensais",
    icon: FileCheck,
  },
  {
    number: "5º",
    description: "Entregamos todas as obrigações acessórias da sua empresa",
    icon: FileText,
  },
  {
    number: "6º",
    description: "Emitimos os demonstrativos contábeis anuais e pronto! Seu negócio 100% regular perante o fisco",
    icon: BarChart3,
  },
];

const StepCard = ({ 
  step, 
  index, 
  variant 
}: { 
  step: typeof clientSteps[0]; 
  index: number; 
  variant: "client" | "zen" 
}) => {
  const Icon = step.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-3 text-white/40">
        <Icon className="h-8 w-8" />
      </div>
      <div 
        className={`
          w-14 h-14 rounded-full flex items-center justify-center mb-4
          ${variant === "client" ? "bg-white/20" : "bg-white/25"}
        `}
      >
        <span className="text-white font-bold text-xl">{step.number}</span>
      </div>
      <p className="text-white text-sm md:text-base leading-relaxed max-w-[200px]">
        {step.description}
      </p>
    </motion.div>
  );
};

export function RoutineCarousel() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="inline-block bg-primary text-primary-foreground font-bold text-2xl md:text-4xl px-8 py-3 rounded-lg">
            Veja como funciona sua rotina<br className="hidden md:block" /> na Contabilidade Zen
          </h2>
        </div>

        {/* Responsibilities Split */}
        <div className="flex flex-col lg:flex-row min-h-[500px] rounded-2xl overflow-hidden">
          {/* Client Side - Purple */}
          <div className="flex-1 bg-gradient-to-br from-violet-700 to-purple-600 p-8 md:p-12">
            <div className="bg-violet-800/50 rounded-xl p-4 mb-8 text-center">
              <h3 className="text-white font-semibold text-lg md:text-xl">
                Únicas etapas que são sua responsabilidade
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              {clientSteps.map((step, index) => (
                <StepCard 
                  key={step.number} 
                  step={step} 
                  index={index} 
                  variant="client" 
                />
              ))}
            </div>
          </div>

          {/* Separator with Badge */}
          <div className="relative flex items-center justify-center py-6 lg:py-0 lg:px-4 bg-slate-800 lg:bg-transparent">
            <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10">
              <div className="bg-emerald-500 text-white text-center p-4 md:p-5 rounded-full shadow-lg shadow-emerald-500/40 max-w-[140px]">
                <span className="text-xs md:text-sm font-bold leading-tight block">
                  Todo o restante a Contabilidade Zen cuidará por você!
                </span>
              </div>
            </div>
            <div className="hidden lg:block absolute top-8 bottom-8 left-1/2 w-0.5 bg-white/20" />
          </div>

          {/* Zen Side - Orange */}
          <div className="flex-1 bg-gradient-to-br from-orange-600 to-amber-500 p-8 md:p-12">
            <div className="bg-orange-700/50 rounded-xl p-4 mb-8 text-center">
              <h3 className="text-white font-semibold text-lg md:text-xl">
                Todo o restante a Contabilidade Zen cuidará por você!
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {zenSteps.map((step, index) => (
                <StepCard 
                  key={step.number} 
                  step={step} 
                  index={index + 2} 
                  variant="zen" 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
