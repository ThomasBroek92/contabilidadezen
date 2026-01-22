import { motion } from "framer-motion";
import { BrazilMap } from "./BrazilMap";
import { CitiesWordCloud } from "./CitiesWordCloud";
import { CampinasHighlight } from "./CampinasHighlight";

export function CitiesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
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

        {/* Main Content - 2 Columns */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Column - Map (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <BrazilMap />
          </motion.div>

          {/* Right Column - Word Cloud + Highlight (3/5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <CitiesWordCloud />
            <CampinasHighlight />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { BrazilMap } from "./BrazilMap";
export { CitiesWordCloud } from "./CitiesWordCloud";
export { CampinasHighlight } from "./CampinasHighlight";
