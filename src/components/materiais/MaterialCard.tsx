import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Table2, BookOpen, Download } from "lucide-react";

export interface MaterialItem {
  slug: string;
  title: string;
  description: string;
  type: "ebook" | "checklist" | "planilha";
  downloadUrl: string;
}

const typeConfig = {
  ebook: { label: "E-book", icon: BookOpen, color: "bg-primary/10 text-primary" },
  checklist: { label: "Checklist", icon: FileText, color: "bg-secondary/10 text-secondary" },
  planilha: { label: "Planilha", icon: Table2, color: "bg-accent/10 text-accent" },
};

interface MaterialCardProps {
  material: MaterialItem;
  onDownload: (material: MaterialItem) => void;
}

export function MaterialCard({ material, onDownload }: MaterialCardProps) {
  const config = typeConfig[material.type];
  const Icon = config.icon;

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 border-border"
      onClick={() => onDownload(material)}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="outline" className={config.color}>
            {config.label}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
          {material.title}
        </h3>
        <p className="text-sm text-muted-foreground flex-1">{material.description}</p>
        <div className="mt-4 flex items-center gap-2 text-secondary text-sm font-medium">
          <Download className="h-4 w-4" />
          Baixar grátis
        </div>
      </CardContent>
    </Card>
  );
}
