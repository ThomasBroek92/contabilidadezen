import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { AnexoType, ANEXO_BUTTON_COLORS } from "@/lib/cnaes-types";

interface CNAESearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAnexo: AnexoType | null;
  onAnexoChange: (anexo: AnexoType | null) => void;
  resultCount: number;
}

const anexos: AnexoType[] = ['I', 'II', 'III', 'IV', 'V'];

export const CNAESearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedAnexo,
  onAnexoChange,
  resultCount,
}: CNAESearchFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por código CNAE ou descrição da atividade..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filtros por Anexo */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Filtrar por Anexo:</span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAnexoChange(null)}
          className={`${
            selectedAnexo === null
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted/50 hover:bg-muted"
          }`}
        >
          Todos
        </Button>

        {anexos.map((anexo) => {
          const colors = ANEXO_BUTTON_COLORS[anexo];
          const isActive = selectedAnexo === anexo;
          
          return (
            <Button
              key={anexo}
              variant="outline"
              size="sm"
              onClick={() => onAnexoChange(isActive ? null : anexo)}
              className={`border-0 ${isActive ? colors.active : colors.inactive}`}
            >
              Anexo {anexo}
            </Button>
          );
        })}
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultCount === 0 
            ? "Nenhum resultado encontrado" 
            : `${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'} encontrado${resultCount === 1 ? '' : 's'}`
          }
        </span>
        {(searchTerm || selectedAnexo) && (
          <button
            onClick={() => {
              onSearchChange("");
              onAnexoChange(null);
            }}
            className="text-secondary hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
};
