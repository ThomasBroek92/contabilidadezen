import { motion } from "framer-motion";
import { Building2, MapPin, Sparkles, Gift, CheckCircle2 } from "lucide-react";

export function AbrirEmpresaVirtualOffice() {
  return (
    <section className="py-12 bg-gradient-to-r from-secondary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main highlight card */}
          <div className="relative bg-card border-2 border-secondary/50 rounded-3xl p-8 md:p-10 shadow-card overflow-hidden">
            {/* Corner ribbon */}
            <div className="absolute -right-12 top-6 rotate-45 bg-secondary text-secondary-foreground px-12 py-2 text-sm font-bold shadow-lg">
              GRÁTIS!
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Icon with animation */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="shrink-0"
              >
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
                    <Building2 className="w-12 h-12 md:w-14 md:h-14 text-secondary-foreground" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 bg-warning text-warning-foreground rounded-full p-2 shadow-lg"
                  >
                    <Gift className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  <Sparkles className="w-4 h-4" />
                  Exclusivo para novos clientes
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                  Ganhe sua{" "}
                  <span className="text-gradient">Sede Virtual Gratuita!</span>
                </h2>

                <p className="text-muted-foreground text-base md:text-lg mb-6">
                  Ao abrir sua empresa conosco, você recebe um endereço comercial completo 
                  sem custo adicional. Ideal para quem trabalha de casa ou precisa de um 
                  endereço profissional.
                </p>

                {/* Benefits list */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Endereço comercial</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Recebimento de correspondências</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Uso no CNPJ</span>
                  </div>
                </div>
              </div>

              {/* Price highlight */}
              <div className="shrink-0 text-center">
                <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                  <p className="text-sm text-muted-foreground line-through mb-1">
                    R$ 99/mês
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-secondary">
                    R$ 0
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    para sempre*
                  </p>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>*Válido enquanto você for cliente Contabilidade Zen</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
