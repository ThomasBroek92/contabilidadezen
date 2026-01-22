import { motion } from "framer-motion";
import { MapPin, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rmcCities } from "./citiesData";

export function CampinasHighlight() {
  const whatsappMessage = encodeURIComponent(
    "Olá! Vi que vocês atendem minha região (Campinas/RMC). Gostaria de saber mais sobre os serviços de contabilidade."
  );
  const whatsappLink = `https://wa.me/5519982535858?text=${whatsappMessage}`;

  // Split cities into columns for display
  const columns = 3;
  const citiesPerColumn = Math.ceil(rmcCities.length / columns);
  const cityColumns = Array.from({ length: columns }, (_, i) =>
    rmcCities.slice(i * citiesPerColumn, (i + 1) * citiesPerColumn)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="mt-8 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 md:p-8 text-primary-foreground shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-6 w-6" />
        <h3 className="text-xl md:text-2xl font-bold">
          Especialização: Região de Campinas
        </h3>
      </div>

      <p className="text-primary-foreground/90 mb-6">
        Atendemos todas as 20 cidades da Região Metropolitana de Campinas com 
        equipe dedicada e conhecimento local das particularidades fiscais.
      </p>

      {/* Cities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mb-6">
        {rmcCities.slice(0, 12).map((city) => (
          <div key={city.name} className="flex items-center gap-1.5 text-sm">
            <Check className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{city.name}</span>
          </div>
        ))}
        {rmcCities.length > 12 && (
          <div className="flex items-center gap-1.5 text-sm text-primary-foreground/80">
            <span>+{rmcCities.length - 12} cidades</span>
          </div>
        )}
      </div>

      <Button
        asChild
        size="lg"
        variant="secondary"
        className="w-full md:w-auto"
      >
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-5 w-5" />
          Ver planos para sua cidade
        </a>
      </Button>
    </motion.div>
  );
}
