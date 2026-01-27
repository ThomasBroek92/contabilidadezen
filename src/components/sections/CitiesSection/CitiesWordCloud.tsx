import { useState, useMemo } from "react";
import { citiesData, rmcCities, sulSudesteCities, outrasCities, type FilterType, type CityData } from "./citiesData";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

const filters: { id: FilterType; label: string; icon?: boolean }[] = [
  { id: "todas", label: "Todas" },
  { id: "rmc", label: "Região de Campinas", icon: true },
  { id: "sul-sudeste", label: "Sul e Sudeste" },
  { id: "outras", label: "Outras Regiões" },
];

// Limites por filtro para reduzir DOM
const LIMITS: Record<FilterType, number> = {
  todas: 30,
  rmc: 20,
  "sul-sudeste": 35,
  outras: 15,
};

function getCitySize(city: CityData, filter: FilterType): string {
  // Compact sizes for "todas" filter
  if (filter === "todas") {
    switch (city.priority) {
      case "primary":
        if (city.name === "Campinas") return "text-lg md:text-2xl";
        return "text-base md:text-lg";
      case "secondary":
        return "text-sm md:text-base";
      case "tertiary":
        return "text-xs md:text-sm";
    }
  }

  // Larger sizes for filtered views
  if (filter === "rmc") {
    if (city.name === "Campinas") return "text-2xl md:text-4xl";
    if (["Americana", "Indaiatuba", "Sumaré", "Hortolândia"].includes(city.name)) return "text-lg md:text-2xl";
    return "text-base md:text-lg";
  }

  if (filter === "outras") {
    return "text-base md:text-lg";
  }

  // sul-sudeste
  switch (city.priority) {
    case "primary":
      if (city.name === "Campinas") return "text-xl md:text-3xl";
      return "text-base md:text-xl";
    case "secondary":
      if (["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"].includes(city.name)) {
        return "text-base md:text-xl";
      }
      return "text-sm md:text-base";
    case "tertiary":
      return "text-xs md:text-sm";
  }
}

function getCityStyles(city: CityData): string {
  switch (city.priority) {
    case "primary":
      return cn(
        "font-bold",
        city.name === "Campinas" 
          ? "bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent" 
          : "text-primary hover:text-primary/80"
      );
    case "secondary":
      return "text-foreground/80 font-semibold hover:text-primary transition-colors";
    case "tertiary":
      return "text-muted-foreground font-medium hover:text-foreground/80 transition-colors";
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

  // Sort cities with Campinas and primary first
  const sortedCities = useMemo(() => {
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

  // Aplicar limite por filtro
  const limit = LIMITS[activeFilter];
  const visibleCities = sortedCities.slice(0, limit);
  const hiddenCount = sortedCities.length - visibleCities.length;

  // Dynamic container height based on filter
  const getContainerClasses = () => {
    if (activeFilter === "todas") {
      return "max-h-[200px] md:max-h-[280px]";
    }
    if (activeFilter === "outras") {
      return "max-h-[150px] md:max-h-[200px]";
    }
    return "max-h-[180px] md:max-h-[250px]";
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs - botões simples sem motion */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.03] active:scale-[0.97]",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-card border border-border hover:border-primary/50 hover:bg-muted text-foreground"
            )}
          >
            {filter.icon && <MapPin className="h-3.5 w-3.5" />}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Word Cloud Container - sem AnimatePresence */}
      <div className={cn(
        "relative rounded-xl bg-gradient-to-br from-muted/20 via-background to-muted/10 border border-border/30 p-4 md:p-6 overflow-hidden",
        getContainerClasses()
      )}>
        {/* Background decorative elements - subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-5 left-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute bottom-5 right-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
        </div>

        {/* Cities - spans simples com CSS transitions */}
        <div 
          key={activeFilter}
          className="relative z-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 md:gap-x-3 md:gap-y-2 animate-fade-in"
        >
          {visibleCities.map((city) => (
            <span
              key={city.name}
              className={cn(
                "cursor-default select-none transition-transform duration-200 hover:scale-110 whitespace-nowrap",
                getCitySize(city, activeFilter),
                getCityStyles(city),
              )}
            >
              {city.name}
            </span>
          ))}
          
          {/* Indicador de cidades ocultas */}
          {hiddenCount > 0 && (
            <span className="text-xs md:text-sm text-muted-foreground/70 ml-1">
              +{hiddenCount} cidades
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
