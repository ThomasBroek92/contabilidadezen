import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RepresentantesHero } from "@/components/segmentos/representantes/RepresentantesHero";
import { RepresentantesLeadForm } from "@/components/segmentos/representantes/RepresentantesLeadForm";
import { RepresentantesBenefits } from "@/components/segmentos/representantes/RepresentantesBenefits";
import { RepresentantesProblems } from "@/components/segmentos/representantes/RepresentantesProblems";
import { RepresentantesProcess } from "@/components/segmentos/representantes/RepresentantesProcess";
import { RepresentantesTestimonials } from "@/components/segmentos/representantes/RepresentantesTestimonials";
import { RepresentantesFAQ, representantesFaqs } from "@/components/segmentos/representantes/RepresentantesFAQ";
import { RepresentantesCTA } from "@/components/segmentos/representantes/RepresentantesCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeRepresentantes() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Representantes Comerciais | Reduza Impostos"
        description="Contabilidade especializada para representantes comerciais. Reduza impostos, organize comissões de múltiplas representadas e mantenha conformidade com o CORE."
        keywords="contabilidade para representantes comerciais, representante comercial PJ, contabilidade para representação, planejamento tributário representante, CORE representante comercial"
        canonical="/segmentos/contabilidade-para-representantes-comerciais"
        pageType="service"
        includeLocalBusiness
        faqs={representantesFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Representantes", url: `${SITE_URL}/segmentos/contabilidade-para-representantes-comerciais` }
        ]}
      />
      
      <Header />
      
      <main>
        <RepresentantesHero />
        <RepresentantesLeadForm />
        <TaxComparisonCalculator profession="representante comercial" accentColor="#E87C1E" />
        <RepresentantesProblems />
        <RepresentantesBenefits />
        <RepresentantesProcess />
        <RepresentantesTestimonials />
        <RepresentantesFAQ />
        <RepresentantesCTA />
      </main>
      
      <Footer />
    </>
  );
}
