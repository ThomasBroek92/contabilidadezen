import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RepresentantesHero } from "@/components/segmentos/representantes/RepresentantesHero";
import { RepresentantesLeadForm } from "@/components/segmentos/representantes/RepresentantesLeadForm";
import { RepresentantesBenefits } from "@/components/segmentos/representantes/RepresentantesBenefits";
import { RepresentantesProblems } from "@/components/segmentos/representantes/RepresentantesProblems";
import { RepresentantesProcess } from "@/components/segmentos/representantes/RepresentantesProcess";
import { RepresentantesTestimonials } from "@/components/segmentos/representantes/RepresentantesTestimonials";
import { RepresentantesFAQ } from "@/components/segmentos/representantes/RepresentantesFAQ";
import { RepresentantesCTA } from "@/components/segmentos/representantes/RepresentantesCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

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
      />
      
      <Header />
      
      <main>
        <RepresentantesHero />
        <RepresentantesLeadForm />
        <TaxComparisonCalculator profession="representante comercial" />
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
