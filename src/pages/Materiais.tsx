import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MaterialCard, type MaterialItem } from "@/components/materiais/MaterialCard";
import { MaterialGateForm } from "@/components/materiais/MaterialGateForm";
import { BookOpen } from "lucide-react";

const MATERIALS: MaterialItem[] = [
  {
    slug: "checklist-abrir-empresa-pj",
    title: "Checklist: Documentos para Abrir Empresa PJ",
    description: "Lista completa de documentos e etapas para abrir seu CNPJ sem surpresas. Ideal para quem está saindo da CLT.",
    type: "checklist",
    downloadUrl: "#", // Replace with actual URL when uploaded
  },
  {
    slug: "guia-clt-vs-pj",
    title: "Guia: CLT x PJ — Qual Compensa Mais?",
    description: "Comparativo detalhado entre CLT e PJ com simulações reais de impostos, benefícios e cenários para cada perfil.",
    type: "ebook",
    downloadUrl: "#",
  },
  {
    slug: "planilha-controle-financeiro-pj",
    title: "Planilha: Controle Financeiro para PJ",
    description: "Controle receitas, despesas, impostos e pró-labore em uma planilha pronta. Funciona no Google Sheets e Excel.",
    type: "planilha",
    downloadUrl: "#",
  },
  {
    slug: "ebook-tributacao-medicos-2026",
    title: "E-book: Tributação para Médicos 2026",
    description: "Guia completo sobre enquadramento tributário, equiparação hospitalar e estratégias fiscais para médicos PJ em 2026.",
    type: "ebook",
    downloadUrl: "#",
  },
];

export default function Materiais() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  const [gateOpen, setGateOpen] = useState(false);

  const handleDownload = (material: MaterialItem) => {
    // Check if user already unlocked this material
    try {
      if (sessionStorage.getItem(`mat_${material.slug}`)) {
        window.open(material.downloadUrl, "_blank", "noopener,noreferrer");
        return;
      }
    } catch {}

    setSelectedMaterial(material);
    setGateOpen(true);
  };

  return (
    <>
      <SEOHead
        title="Materiais Gratuitos | E-books, Checklists e Planilhas | Contabilidade Zen"
        description="Baixe gratuitamente e-books, checklists e planilhas sobre contabilidade, abertura de empresa, tributação e planejamento financeiro para profissionais PJ."
        canonicalUrl="https://www.contabilidadezen.com.br/materiais"
      />

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-muted/30 py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Materiais Gratuitos
            </h1>
            <p className="text-lg text-muted-foreground">
              E-books, checklists e planilhas para ajudar você a tomar as melhores decisões contábeis e tributárias.
            </p>
          </div>
        </section>

        {/* Materials Grid */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MATERIALS.map(material => (
                <MaterialCard
                  key={material.slug}
                  material={material}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <MaterialGateForm
        material={selectedMaterial}
        open={gateOpen}
        onOpenChange={setGateOpen}
      />

      <Footer />
    </>
  );
}
