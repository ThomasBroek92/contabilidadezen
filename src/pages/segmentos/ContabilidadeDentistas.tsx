import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DentistasHero } from "@/components/segmentos/dentistas/DentistasHero";
import { DentistasLeadForm } from "@/components/segmentos/dentistas/DentistasLeadForm";
import { DentistasBenefits } from "@/components/segmentos/dentistas/DentistasBenefits";
import { DentistasProblems } from "@/components/segmentos/dentistas/DentistasProblems";
import { DentistasProcess } from "@/components/segmentos/dentistas/DentistasProcess";
import { DentistasTestimonials } from "@/components/segmentos/dentistas/DentistasTestimonials";
import { DentistasFAQ, dentistasFaqs } from "@/components/segmentos/dentistas/DentistasFAQ";
import { DentistasCTA } from "@/components/segmentos/dentistas/DentistasCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeDentistas() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Dentistas e Clínicas Odontológicas | Reduza Impostos"
        description="Contabilidade especializada para dentistas e clínicas odontológicas. Reduza impostos, elimine burocracias e aumente seus lucros com planejamento tributário personalizado."
        keywords="contabilidade para dentistas, contabilidade para clínicas odontológicas, dentista PJ contabilidade, planejamento tributário dentista, contabilidade online para dentistas"
        canonical="/segmentos/contabilidade-para-dentistas"
        pageType="service"
        includeLocalBusiness
        faqs={dentistasFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: `${SITE_URL}/servicos` },
          { name: "Contabilidade para Dentistas", url: `${SITE_URL}/segmentos/contabilidade-para-dentistas` }
        ]}
      />
      
      <Header />
      
      <main>
        <DentistasHero />
        <DentistasLeadForm />
        <TaxComparisonCalculator profession="dentista" />
        <DentistasProblems />
        <DentistasBenefits />
        <DentistasProcess />
        <DentistasTestimonials />
        <DentistasFAQ />
        <DentistasCTA />
      </main>
      
      <Footer />
    </>
  );
}
