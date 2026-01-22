import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { citiesData, rmcCities, sulSudesteCities, outrasCities, type FilterType, type CityData } from "./citiesData";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

const filters: { id: FilterType; label: string; icon?: boolean }[] = [
  { id: "todas", label: "Todas" },
  { id: "rmc", label: "Região de Campinas", icon: true },
  { id: "sul-sudeste", label: "Sul e Sudeste" },
  { id: "outras", label: "Outras Regiões" },
];

function getCitySize(city: CityData, filter: FilterType): string {
  if (filter === "rmc") {
    if (city.name === "Campinas") return "text-4xl md:text-6xl";
    if (["Americana", "Indaiatuba", "Sumaré", "Hortolândia"].includes(city.name)) return "text-2xl md:text-4xl";
    return "text-xl md:text-2xl";
  }

  switch (city.priority) {
    case "primary":
      if (city.name === "Campinas") return "text-3xl md:text-5xl";
      if (["Americana", "Indaiatuba"].includes(city.name)) return "text-xl md:text-3xl";
      return "text-lg md:text-2xl";
    case "secondary":
      if (["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"].includes(city.name)) {
        return "text-xl md:text-2xl";
      }
      return "text-base md:text-lg";
    case "tertiary":
      return "text-sm md:text-base";
  }
}

function getCityStyles(city: CityData, filter: FilterType): string {
  const isRMCFilter = filter === "rmc";
  
  switch (city.priority) {
    case "primary":
      return cn(
        "font-bold",
        city.name === "Campinas" 
          ? "bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent drop-shadow-sm" 
          : "text-primary hover:text-primary/80"
      );
    case "secondary":
      return "text-foreground/80 font-semibold hover:text-primary transition-colors";
    case "tertiary":
      return "text-muted-foreground font-medium hover:text-foreground/80 transition-colors";
  }
}

// Generate random but consistent animation properties for each city
function getRandomAnimationProps(index: number, cityName: string) {
  const seed = cityName.length + index;
  return {
    duration: 4 + (seed % 3),
    delay: (seed % 10) * 0.15,
    yOffset: 3 + (seed % 4),
    xOffset: (seed % 2 === 0 ? 1 : -1) * (1 + seed % 2),
  };
}

export function CitiesWordCloud() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todas");
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

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

  // Shuffle cities with consistent ordering
  const shuffledCities = useMemo(() => {
    return [...filteredCities].sort((a, b) => {
      if (a.name === "Campinas") return -1;
      if (b.name === "Campinas") return 1;
      if (a.priority === "primary" && b.priority !== "primary") return -1;
      if (b.priority === "primary" && a.priority !== "primary") return 1;
      if (a.priority === "secondary" && b.priority === "tertiary") return -1;
      if (b.priority === "secondary" && a.priority === "tertiary") return 1;
      return a.name.localeCompare(b.name);
    });
  }, [filteredCities]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.5, 
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-card border border-border hover:border-primary/50 hover:bg-muted text-foreground"
            )}
          >
            {filter.icon && <MapPin className="h-4 w-4" />}
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Word Cloud Container */}
      <div className="relative min-h-[350px] md:min-h-[450px] rounded-2xl bg-gradient-to-br from-muted/30 via-background to-muted/20 border border-border/50 p-6 md:p-10 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
        </div>

        {/* Cities */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-4"
          >
            {shuffledCities.map((city, index) => {
              const animProps = getRandomAnimationProps(index, city.name);
              const isHovered = hoveredCity === city.name;
              
              return (
                <motion.span
                  key={city.name}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredCity(city.name)}
                  onMouseLeave={() => setHoveredCity(null)}
                  animate={{
                    y: [0, -animProps.yOffset, 0, animProps.yOffset * 0.5, 0],
                    x: [0, animProps.xOffset, 0, -animProps.xOffset * 0.5, 0],
                    rotate: isHovered ? [0, -2, 2, 0] : 0,
                  }}
                  transition={{
                    y: {
                      duration: animProps.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    x: {
                      duration: animProps.duration * 1.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 0.3,
                    },
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  className={cn(
                    "cursor-default select-none transition-all duration-300 relative",
                    getCitySize(city, activeFilter),
                    getCityStyles(city, activeFilter),
                    isHovered && "z-20"
                  )}
                >
                  {city.name}
                  
                  {/* Glow effect on hover for primary cities */}
                  {city.priority === "primary" && isHovered && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 blur-lg bg-primary/20 -z-10"
                    />
                  )}
                </motion.span>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
