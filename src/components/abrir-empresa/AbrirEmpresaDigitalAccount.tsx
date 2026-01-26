import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function AbrirEmpresaDigitalAccount() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-gradient-to-br from-zen-light-teal/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Benefício Exclusivo</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sua Empresa com{" "}
            <span className="text-gradient">Conta Digital PJ Gratuita</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-4">
            Clientes Contabilidade Zen têm acesso a uma Conta Digital PJ completa,{" "}
            <strong className="text-foreground">sem mensalidades e sem asteriscos!</strong>
          </p>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Oferecemos parceria com banco digital para você ter acesso a todos os serviços 
            financeiros que sua empresa precisa. É digital, sem burocracia e 100% gratuito.
          </p>

          <Button variant="hero" size="xl" asChild>
            <a
              href="https://wa.me/5519974158342?text=Olá! Quero abrir minha empresa e ter acesso à Conta Digital PJ gratuita."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              Abra sua empresa agora
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
