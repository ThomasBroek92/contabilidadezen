import { LANGUAGES, type LanguageCode } from "./constants";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface InvoiceLanguageSelectorProps {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
}

export function InvoiceLanguageSelector({ value, onChange }: InvoiceLanguageSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Globe className="h-5 w-5 text-muted-foreground" />
      <div className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium",
              value === lang.code
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-border bg-card hover:border-secondary/50 text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={value === lang.code}
            aria-label={`Selecionar idioma ${lang.name}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
