import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PsicologosHero } from "@/components/segmentos/psicologos/PsicologosHero";
import { PsicologosLeadForm } from "@/components/segmentos/psicologos/PsicologosLeadForm";
import { PsicologosBenefits } from "@/components/segmentos/psicologos/PsicologosBenefits";
import { PsicologosProblems } from "@/components/segmentos/psicologos/PsicologosProblems";
import { PsicologosProcess } from "@/components/segmentos/psicologos/PsicologosProcess";
import { PsicologosTestimonials } from "@/components/segmentos/psicologos/PsicologosTestimonials";
import { PsicologosFAQ, psicologosFaqs } from "@/components/segmentos/psicologos/PsicologosFAQ";
import { PsicologosCTA } from "@/components/segmentos/psicologos/PsicologosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadePsicologos() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Psicólogos e Clínicas de Psicologia | Reduza Impostos"
        description="Contabilidade especializada para psicólogos e clínicas de psicologia. Reduza impostos, elimine burocracias e aumente seus lucros com planejamento tributário personalizado."
        keywords="contabilidade para psicólogos, contabilidade para clínicas de psicologia, psicólogo PJ contabilidade, planejamento tributário psicólogo, contabilidade online para psicólogos"
        canonical="/segmentos/contabilidade-para-psicologos"
        pageType="service"
        includeLocalBusiness
        faqs={psicologosFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: `${SITE_URL}/servicos` },
          { name: "Contabilidade para Psicólogos", url: `${SITE_URL}/segmentos/contabilidade-para-psicologos` }
        ]}
      />
      
      <Header />
      
      <main>
        <PsicologosHero />
        <PsicologosLeadForm />
        <TaxComparisonCalculator profession="psicólogo" />
        <PsicologosProblems />
        <PsicologosBenefits />
        <PsicologosProcess />
        <PsicologosTestimonials />
        <PsicologosFAQ />
        <PsicologosCTA />
      </main>
      
      <Footer />
    </>
  );
}
