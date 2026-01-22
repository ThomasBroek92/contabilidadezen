import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CitiesWordCloud } from "./CitiesWordCloud";

export function CitiesSection() {
  const whatsappMessage = encodeURIComponent(
    "Olá! Vi que vocês atendem minha região. Gostaria de saber mais sobre os serviços de contabilidade."
  );
  const whatsappLink = `https://wa.me/5519974158342?text=${whatsappMessage}`;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Atendemos em todo o Brasil
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Com especialização nas regiões Sul e Sudeste, especialmente na{" "}
            <span className="text-primary font-medium">Região de Campinas</span> e cidades próximas
          </p>
        </motion.div>

        {/* Word Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CitiesWordCloud />
        </motion.div>

        {/* CTA WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 text-center"
        >
          <Button
            asChild
            size="lg"
            className="gap-2 px-8 py-6 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Fale com um especialista da sua região
            </a>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            Atendimento personalizado para sua cidade
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export { CitiesWordCloud } from "./CitiesWordCloud";
