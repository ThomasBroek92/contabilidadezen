import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdvogadosHero } from "@/components/segmentos/advogados/AdvogadosHero";
import { AdvogadosLeadForm } from "@/components/segmentos/advogados/AdvogadosLeadForm";
import { AdvogadosBenefits } from "@/components/segmentos/advogados/AdvogadosBenefits";
import { AdvogadosProblems } from "@/components/segmentos/advogados/AdvogadosProblems";
import { AdvogadosProcess } from "@/components/segmentos/advogados/AdvogadosProcess";
import { AdvogadosTestimonials } from "@/components/segmentos/advogados/AdvogadosTestimonials";
import { AdvogadosFAQ, advogadosFaqs } from "@/components/segmentos/advogados/AdvogadosFAQ";
import { AdvogadosCTA } from "@/components/segmentos/advogados/AdvogadosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeAdvogados() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Advogados e Escritórios de Advocacia | Reduza Impostos"
        description="Contabilidade especializada para advogados e escritórios de advocacia. Simples Nacional vs Lucro Presumido, sociedade de advogados OAB, distribuição de lucros e planejamento tributário personalizado."
        keywords="contabilidade para advogados, contabilidade para escritório de advocacia, advogado PJ contabilidade, sociedade de advogados OAB, planejamento tributário advogado, contabilidade online para advogados"
        canonical="/segmentos/contabilidade-para-advogados"
        pageType="service"
        includeLocalBusiness
        faqs={advogadosFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Advogados", url: `${SITE_URL}/segmentos/contabilidade-para-advogados` }
        ]}
      />
      
      <Header />
      
      <main>
        <AdvogadosHero />
        <AdvogadosLeadForm />
        <TaxComparisonCalculator profession="advogado" accentColor="#334155" />
        <AdvogadosProblems />
        <AdvogadosBenefits />
        <AdvogadosProcess />
        <AdvogadosTestimonials />
        <AdvogadosFAQ />
        <AdvogadosCTA />
      </main>
      
      <Footer />
    </>
  );
}