import { CheckCircle2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const comparisonData = [
  { feature: "Abertura de empresa", traditional: "R$ 500 a R$ 1.500", zen: "Incluso no plano" },
  { feature: "Tempo para abrir CNPJ", traditional: "30 a 60 dias", zen: "Até 15 dias úteis" },
  { feature: "Atendimento", traditional: "Horário comercial", zen: "100% digital 24/7" },
  { feature: "Plataforma online", traditional: false, zen: true },
  { feature: "Suporte humanizado", traditional: false, zen: true },
  { feature: "Consultoria tributária", traditional: "Cobrado à parte", zen: "Incluso" },
];

export function AbrirEmpresaComparison() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher a <span className="text-gradient">Contabilidade Zen</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare e descubra as vantagens de ter uma contabilidade moderna e digital ao seu lado.
          </p>
        </div>

        <div 
          className="overflow-x-auto animate-fade-up"
          style={{ animationDelay: shouldReduceMotion ? '0ms' : '200ms' }}
        >
          <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="w-[40%] text-foreground font-semibold">Recurso</TableHead>
                  <TableHead className="text-center text-muted-foreground font-medium">Contabilidade Tradicional</TableHead>
                  <TableHead className="text-center relative">
                    <div className="absolute inset-x-0 -top-4 h-1 bg-gradient-to-r from-secondary to-accent rounded-t-full" />
                    <div className="bg-zen-light-teal/50 rounded-t-2xl py-4 -mx-4 px-4">
                      <span className="text-foreground font-bold">Contabilidade Zen</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index} className="border-border/50">
                    <TableCell className="font-medium text-foreground">{row.feature}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {typeof row.traditional === "boolean" ? (
                        row.traditional ? <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                      ) : row.traditional}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="bg-zen-light-teal/30 -mx-4 px-4 py-2">
                        {typeof row.zen === "boolean" ? (
                          row.zen ? <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
                        ) : <span className="font-semibold text-secondary">{row.zen}</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
