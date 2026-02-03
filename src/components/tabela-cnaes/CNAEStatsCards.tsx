import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calculator, Users, TrendingDown } from "lucide-react";

interface CNAEStatsCardsProps {
  totalCNAEs: number;
  uniqueCNAEs: number;
}

export const CNAEStatsCards = ({ totalCNAEs, uniqueCNAEs }: CNAEStatsCardsProps) => {
  const stats = [
    {
      icon: FileText,
      value: `${totalCNAEs}+`,
      label: "CNAEs Cadastrados",
      description: "Atividades permitidas",
    },
    {
      icon: Calculator,
      value: "5",
      label: "Anexos Disponíveis",
      description: "Diferentes alíquotas",
    },
    {
      icon: Users,
      value: `${uniqueCNAEs}+`,
      label: "Atividades Únicas",
      description: "Códigos distintos",
    },
    {
      icon: TrendingDown,
      value: "4%",
      label: "Alíquota Mínima",
      description: "Menor tributação",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <stat.icon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
