import { FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceDocumentTypeSelectorProps {
  value: "invoice" | "fatura";
  onChange: (value: "invoice" | "fatura") => void;
}

export function InvoiceDocumentTypeSelector({ value, onChange }: InvoiceDocumentTypeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        type="button"
        onClick={() => onChange("invoice")}
        className={cn(
          "flex-1 flex items-center gap-4 p-4 rounded-lg border-2 transition-all",
          value === "invoice"
            ? "border-secondary bg-secondary/5"
            : "border-border hover:border-secondary/50"
        )}
      >
        <div className={cn(
          "p-3 rounded-full",
          value === "invoice" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <Globe className="h-6 w-6" />
        </div>
        <div className="text-left">
          <p className={cn(
            "font-semibold",
            value === "invoice" ? "text-secondary" : "text-foreground"
          )}>
            Invoice
          </p>
          <p className="text-sm text-muted-foreground">
            Para operações internacionais
          </p>
        </div>
      </button>
      
      <button
        type="button"
        onClick={() => onChange("fatura")}
        className={cn(
          "flex-1 flex items-center gap-4 p-4 rounded-lg border-2 transition-all",
          value === "fatura"
            ? "border-secondary bg-secondary/5"
            : "border-border hover:border-secondary/50"
        )}
      >
        <div className={cn(
          "p-3 rounded-full",
          value === "fatura" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <FileText className="h-6 w-6" />
        </div>
        <div className="text-left">
          <p className={cn(
            "font-semibold",
            value === "fatura" ? "text-secondary" : "text-foreground"
          )}>
            Fatura
          </p>
          <p className="text-sm text-muted-foreground">
            Para pagamentos nacionais
          </p>
        </div>
      </button>
    </div>
  );
}
