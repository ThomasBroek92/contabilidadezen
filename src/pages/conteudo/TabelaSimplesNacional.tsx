import { useState, useMemo } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { CNAEStatsCards } from "@/components/tabela-cnaes/CNAEStatsCards";
import { CNAESearchFilters } from "@/components/tabela-cnaes/CNAESearchFilters";
import { CNAETable } from "@/components/tabela-cnaes/CNAETable";
import { CNAEFAQSection } from "@/components/tabela-cnaes/CNAEFAQSection";
import { CNAECTASection } from "@/components/tabela-cnaes/CNAECTASection";
import { CNAE, AnexoType } from "@/lib/cnaes-types";
import cnaesData from "@/lib/cnaes-data.json";
import { FileSpreadsheet } from "lucide-react";

const TabelaSimplesNacional = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnexo, setSelectedAnexo] = useState<AnexoType | null>(null);

  const allCNAEs = cnaesData as CNAE[];
  
  // Estatísticas
  const totalCNAEs = allCNAEs.length;
  const uniqueCNAEs = new Set(allCNAEs.map(c => c.cnae)).size;

  // Filtragem
  const filteredCNAEs = useMemo(() => {
    return allCNAEs.filter((cnae) => {
      const matchesSearch =
        searchTerm === "" ||
        cnae.cnae.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cnae.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAnexo =
        selectedAnexo === null || cnae.anexo === selectedAnexo;

      return matchesSearch && matchesAnexo;
    });
  }, [allCNAEs, searchTerm, selectedAnexo]);

  // FAQs para schema
  const faqs = [
    {
      question: "O que é o Simples Nacional?",
      answer: "O Simples Nacional é um regime tributário simplificado criado para micro e pequenas empresas com faturamento anual de até R$ 4,8 milhões."
    },
    {
      question: "O que são os Anexos do Simples Nacional?",
      answer: "Os Anexos são tabelas que determinam as alíquotas de tributação conforme a atividade econômica da empresa. Existem 5 Anexos: I (Comércio), II (Indústria), III, IV e V (Serviços)."
    },
    {
      question: "O que é o Fator R?",
      answer: "O Fator R é a proporção entre a folha de pagamento dos últimos 12 meses e o faturamento bruto do mesmo período. Se igual ou superior a 28%, permite migrar do Anexo V para o III."
    },
  ];

  return (
    <>
      <SEOHead
        title="Tabela CNAE Simples Nacional 2026 | Consulte Anexos e Alíquotas"
        description="Consulte a tabela completa de CNAEs do Simples Nacional 2026. Mais de 400 atividades com anexos, alíquotas e Fator R. Busca rápida por código ou descrição."
        keywords="tabela CNAE simples nacional, anexos simples nacional 2026, alíquotas simples nacional, fator R, CNAE serviços, CNAE comércio"
        canonical="/conteudo/tabela-simples-nacional"
        pageType="tool"
        faqs={faqs}
      />

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-secondary/5 via-background to-secondary/5 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-4">
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  Simples Nacional 2026
                </Badge>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Tabela Completa de CNAEs do{" "}
                  <span className="text-secondary">Simples Nacional</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Consulte mais de 400 atividades econômicas com seus respectivos anexos, 
                  alíquotas e indicação de Fator R. Encontre rapidamente o enquadramento 
                  tributário da sua empresa.
                </p>
              </div>
            </div>
          </section>

          {/* Conteúdo Principal */}
          <section className="container mx-auto px-4 py-8">
            <CNAEStatsCards totalCNAEs={totalCNAEs} uniqueCNAEs={uniqueCNAEs} />
            
            <CNAESearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedAnexo={selectedAnexo}
              onAnexoChange={setSelectedAnexo}
              resultCount={filteredCNAEs.length}
            />

            <CNAETable data={filteredCNAEs} />

            {/* Nota explicativa */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <p>
                <strong>Nota:</strong> As alíquotas apresentadas são as iniciais de cada anexo, 
                aplicáveis à primeira faixa de faturamento (até R$ 180.000,00/ano). 
                Alíquotas efetivas podem variar conforme o faturamento acumulado dos últimos 12 meses.
                Para análise personalizada, consulte um contador especializado.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4">
            <CNAECTASection />
          </section>

          {/* FAQ Section */}
          <section className="container mx-auto px-4">
            <CNAEFAQSection />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TabelaSimplesNacional;
