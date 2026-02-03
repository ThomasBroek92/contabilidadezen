import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CNAE, ANEXO_COLORS } from "@/lib/cnaes-types";
import { CheckCircle2, XCircle } from "lucide-react";

interface CNAETableProps {
  data: CNAE[];
  isLoading?: boolean;
}

export const CNAETable = ({ data, isLoading }: CNAETableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Nenhum CNAE encontrado com os filtros aplicados.</p>
        <p className="text-sm text-muted-foreground mt-1">Tente ajustar sua busca ou remover os filtros.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[120px]">CNAE</TableHead>
              <TableHead className="font-semibold">Descrição da Atividade</TableHead>
              <TableHead className="font-semibold text-center w-[100px]">Anexo</TableHead>
              <TableHead className="font-semibold text-center w-[100px]">Fator R</TableHead>
              <TableHead className="font-semibold text-center w-[100px]">Alíquota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const colors = ANEXO_COLORS[item.anexo];
              
              return (
                <TableRow 
                  key={`${item.cnae}-${item.anexo}-${index}`}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono font-medium text-foreground">
                    {item.cnae}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {item.descricao}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`${colors.bg} ${colors.text} ${colors.border} font-medium`}
                    >
                      {item.anexo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.fator_r === 'Sim' ? (
                      <div className="flex items-center justify-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Sim</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">Não</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-secondary">
                    {item.aliquota}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
