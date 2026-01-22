import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { citiesData, rmcCities, sulSudesteCities, outrasCities, type FilterType, type CityData } from "./citiesData";
import { cn } from "@/lib/utils";

const filters: { id: FilterType; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "rmc", label: "Região de Campinas" },
  { id: "sul-sudeste", label: "Sul e Sudeste" },
  { id: "outras", label: "Outras Regiões" },
];

function getCitySize(city: CityData, filter: FilterType): string {
  // When filtering by RMC, make all RMC cities larger
  if (filter === "rmc") {
    if (city.name === "Campinas") return "text-4xl md:text-5xl";
    return "text-2xl md:text-3xl";
  }

  // Default sizing based on priority
  switch (city.priority) {
    case "primary":
      if (city.name === "Campinas") return "text-2xl md:text-4xl";
      if (["Americana", "Indaiatuba"].includes(city.name)) return "text-xl md:text-3xl";
      return "text-lg md:text-2xl";
    case "secondary":
      if (["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"].includes(city.name)) {
        return "text-lg md:text-2xl";
      }
      return "text-base md:text-xl";
    case "tertiary":
      return "text-sm md:text-base";
  }
}

function getCityColor(city: CityData): string {
  switch (city.priority) {
    case "primary":
      return "text-primary font-bold hover:text-primary/80";
    case "secondary":
      return "text-accent-foreground font-semibold hover:text-accent-foreground/80";
    case "tertiary":
      return "text-muted-foreground font-medium hover:text-foreground";
  }
}

export function CitiesWordCloud() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todas");

  const getFilteredCities = (): CityData[] => {
    switch (activeFilter) {
      case "rmc":
        return rmcCities;
      case "sul-sudeste":
        return sulSudesteCities;
      case "outras":
        return outrasCities;
      default:
        return citiesData;
    }
  };

  const filteredCities = getFilteredCities();

  // Shuffle cities for organic look but keep Campinas prominent
  const shuffledCities = [...filteredCities].sort((a, b) => {
    if (a.name === "Campinas") return -1;
    if (b.name === "Campinas") return 1;
    if (a.priority === "primary" && b.priority !== "primary") return -1;
    if (b.priority === "primary" && a.priority !== "primary") return 1;
    return Math.random() - 0.5;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border hover:bg-muted text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Word Cloud */}
      <div className="min-h-[300px] md:min-h-[400px] flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-4 md:gap-y-3 p-4">
        <AnimatePresence mode="popLayout">
          {shuffledCities.map((city, index) => (
            <motion.span
              key={city.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -2, 0, 2, 0],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                y: {
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ scale: 1.1 }}
              className={cn(
                "cursor-default transition-all duration-200",
                getCitySize(city, activeFilter),
                getCityColor(city)
              )}
            >
              {city.name}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 text-center">
        <div>
          <p className="text-2xl md:text-3xl font-bold text-primary">{filteredCities.length}+</p>
          <p className="text-xs md:text-sm text-muted-foreground">cidades</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-2xl md:text-3xl font-bold text-primary">
            {activeFilter === "rmc" ? "20" : activeFilter === "sul-sudeste" ? "65" : "75"}+
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            {activeFilter === "rmc" ? "na RMC" : "atendidas"}
          </p>
        </div>
      </div>
    </div>
  );
}
