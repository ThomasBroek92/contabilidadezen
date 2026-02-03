import { Check } from "lucide-react";
import { INVOICE_THEMES, type ThemeId } from "./constants";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InvoiceThemeSelectorProps {
  value: ThemeId;
  onChange: (value: ThemeId) => void;
}

export function InvoiceThemeSelector({ value, onChange }: InvoiceThemeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {INVOICE_THEMES.map((theme) => (
        <Tooltip key={theme.id}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => onChange(theme.id)}
              className={cn(
                "relative w-10 h-10 rounded-full transition-all",
                value === theme.id 
                  ? "ring-2 ring-offset-2 ring-secondary scale-110" 
                  : "hover:scale-105"
              )}
              style={{ backgroundColor: theme.color }}
              aria-label={`Tema ${theme.name}`}
            >
              {value === theme.id && (
                <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{theme.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
