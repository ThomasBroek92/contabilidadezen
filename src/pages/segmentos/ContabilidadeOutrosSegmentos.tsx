import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OutrosSegmentosHero } from "@/components/segmentos/outros-segmentos/OutrosSegmentosHero";
import { OutrosSegmentosLeadForm } from "@/components/segmentos/outros-segmentos/OutrosSegmentosLeadForm";
import { OutrosSegmentosBenefits } from "@/components/segmentos/outros-segmentos/OutrosSegmentosBenefits";
import { OutrosSegmentosProblems } from "@/components/segmentos/outros-segmentos/OutrosSegmentosProblems";
import { OutrosSegmentosProcess } from "@/components/segmentos/outros-segmentos/OutrosSegmentosProcess";
import { OutrosSegmentosTestimonials } from "@/components/segmentos/outros-segmentos/OutrosSegmentosTestimonials";
import { OutrosSegmentosFAQ, outrosSegmentosFaqs } from "@/components/segmentos/outros-segmentos/OutrosSegmentosFAQ";
import { OutrosSegmentosCTA } from "@/components/segmentos/outros-segmentos/OutrosSegmentosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeOutrosSegmentos() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Profissionais | Arquitetos, Designers, Coaches e Mais"
        description="Contabilidade especializada para arquitetos, engenheiros, designers, coaches, fotógrafos e outros profissionais. Planejamento tributário personalizado. A partir de 6%."
        keywords="contabilidade para arquitetos, contabilidade para designers, contabilidade para coaches, contabilidade profissional liberal, contabilidade autônomo"
        canonical="/segmentos/contabilidade-para-outros-segmentos"
        pageType="service"
        includeLocalBusiness
        faqs={outrosSegmentosFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Outros Segmentos", url: `${SITE_URL}/segmentos/contabilidade-para-outros-segmentos` },
        ]}
      />
      <Header />
      <main>
        <OutrosSegmentosHero />
        <OutrosSegmentosLeadForm />
        <TaxComparisonCalculator profession="outro profissional" accentColor="#475569" />
        <OutrosSegmentosBenefits />
        <OutrosSegmentosProblems />
        <OutrosSegmentosProcess />
        <OutrosSegmentosTestimonials />
        <OutrosSegmentosFAQ />
        <OutrosSegmentosCTA />
      </main>
      <Footer />
    </>
  );
}
