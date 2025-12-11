import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function AbrirEmpresaHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Badge variant="secondary" className="bg-zen-light-teal text-secondary px-4 py-2 text-sm font-medium">
              Sua contabilidade sem estresse
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Foque no seu negócio.{" "}
              <span className="text-gradient">A burocracia</span> é por nossa conta.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Contabilidade completa, humanizada e digital para sua empresa crescer com tranquilidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contato">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary to-accent border-2 border-background flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 text-secondary-foreground" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">
                Mais de <strong className="text-foreground">10.000 empresas</strong> em paz com o fisco
              </span>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card rounded-3xl shadow-card p-8 backdrop-blur border border-border/50">
              {/* Glass effect dashboard mockup */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                      <Shield className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Dashboard Zen</p>
                      <p className="text-sm text-muted-foreground">Tudo sob controle</p>
                    </div>
                  </div>
                  <Badge className="bg-secondary/10 text-secondary border-0">Ativo</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-2xl p-4">
                    <p className="text-sm text-muted-foreground">Impostos</p>
                    <p className="text-2xl font-bold text-foreground">R$ 0,00</p>
                    <p className="text-xs text-secondary">Em dia ✓</p>
                  </div>
                  <div className="bg-muted/50 rounded-2xl p-4">
                    <p className="text-sm text-muted-foreground">Documentos</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-secondary">Organizados ✓</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                    <Zap className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Próximo passo</p>
                    <p className="text-sm text-muted-foreground">Nenhuma pendência</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
