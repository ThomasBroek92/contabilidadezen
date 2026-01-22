import { motion } from "framer-motion";
import { CitiesWordCloud } from "./CitiesWordCloud";
import { CampinasHighlight } from "./CampinasHighlight";

export function CitiesSection() {
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

        {/* Word Cloud + Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CitiesWordCloud />
          <CampinasHighlight />
        </motion.div>
      </div>
    </section>
  );
}

export { CitiesWordCloud } from "./CitiesWordCloud";
export { CampinasHighlight } from "./CampinasHighlight";
