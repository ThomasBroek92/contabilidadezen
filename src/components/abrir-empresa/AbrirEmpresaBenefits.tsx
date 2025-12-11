import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Smartphone,
  Zap,
  HeadphonesIcon,
  TrendingUp,
  FileText,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Segurança Total",
    description: "Seus dados protegidos com criptografia de ponta e backup automático.",
  },
  {
    icon: Smartphone,
    title: "100% Digital",
    description: "Gerencie sua empresa de qualquer lugar, a qualquer momento.",
  },
  {
    icon: Zap,
    title: "Rápido e Eficiente",
    description: "Processos automatizados para você focar no que importa.",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Humanizado",
    description: "Atendimento real com pessoas que entendem suas necessidades.",
  },
  {
    icon: TrendingUp,
    title: "Economia de Impostos",
    description: "Planejamento tributário para pagar menos impostos legalmente.",
  },
  {
    icon: FileText,
    title: "Documentos Organizados",
    description: "Todos os seus documentos em um só lugar, sempre acessíveis.",
  },
];

export function AbrirEmpresaBenefits() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Benefícios que fazem a <span className="text-gradient">diferença</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra por que milhares de empreendedores escolhem a Contabilidade Zen.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
