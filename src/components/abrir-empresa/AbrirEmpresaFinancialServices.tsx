import { 
  FileText, 
  ArrowLeftRight, 
  Wallet, 
  CircleDollarSign, 
  CreditCard, 
  Receipt, 
  Building2, 
  Cloud 
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: FileText,
    title: "Emissão de Boletos",
    description: "Grátis e ilimitados pelo app",
  },
  {
    icon: ArrowLeftRight,
    title: "Transferências TED",
    description: "Envios gratuitos e ilimitados",
  },
  {
    icon: Wallet,
    title: "PIX Gratuito",
    description: "Totalmente gratuito e ilimitado",
  },
  {
    icon: CircleDollarSign,
    title: "Receber Transferências",
    description: "Sem custos para receber",
  },
  {
    icon: CreditCard,
    title: "Cartão de Débito",
    description: "Cartão Visa para sua empresa",
  },
  {
    icon: Receipt,
    title: "Pagamento de Contas",
    description: "Contas e impostos ilimitados",
  },
  {
    icon: Building2,
    title: "Agência e Conta",
    description: "Números próprios de agência e conta",
  },
  {
    icon: Cloud,
    title: "100% Digital",
    description: "Acesso pelo app, sem ir ao banco",
  },
];

export function AbrirEmpresaFinancialServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Serviços Financeiros Inclusos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-4">
            Poderosamente simples e{" "}
            <span className="text-gradient">sem burocracia</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo que sua empresa precisa para operar financeiramente, incluso na sua conta digital PJ.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            >
              <Card className="h-full text-center hover:shadow-card hover:-translate-y-1 transition-all duration-300 border-border/50">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/10 text-secondary mb-4">
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
