import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { ProfissionaisTIHero } from "@/components/segmentos/profissionais-ti/ProfissionaisTIHero";
import { ProfissionaisTILeadForm } from "@/components/segmentos/profissionais-ti/ProfissionaisTILeadForm";
import { ProfissionaisTIBenefits } from "@/components/segmentos/profissionais-ti/ProfissionaisTIBenefits";
import { ProfissionaisTIProblems } from "@/components/segmentos/profissionais-ti/ProfissionaisTIProblems";
import { ProfissionaisTIProcess } from "@/components/segmentos/profissionais-ti/ProfissionaisTIProcess";
import { ProfissionaisTITestimonials } from "@/components/segmentos/profissionais-ti/ProfissionaisTITestimonials";
import { ProfissionaisTIFAQ, profissionaisTIFaqs } from "@/components/segmentos/profissionais-ti/ProfissionaisTIFAQ";
import { ProfissionaisTICTA } from "@/components/segmentos/profissionais-ti/ProfissionaisTICTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";
import { generateReviewSchema } from "@/lib/seo-schemas";

const SITE_URL = "https://www.contabilidadezen.com.br";

const reviewSchema = generateReviewSchema(
  "Contabilidade para Profissionais de TI",
  `${SITE_URL}/segmentos/contabilidade-para-profissionais-de-ti`,
  [
    { name: "Lucas Ferreira", role: "Desenvolvedor Full-Stack", content: "A Contabilidade Zen entende perfeitamente a realidade de quem trabalha com TI como PJ. Economizei muito com o Fator R.", rating: 5 },
    { name: "Marina Souza", role: "DevOps Engineer", content: "Atendimento rápido pelo WhatsApp e tudo 100% digital. Perfeito para quem trabalha remoto.", rating: 5 },
    { name: "Rafael Costa", role: "Data Scientist", content: "Eles me ajudaram com a parte de recebimentos internacionais e câmbio. Muito competentes.", rating: 5 },
  ]
);

export default function ContabilidadeProfissionaisTI() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Profissionais de TI | Devs, DevOps, Data Science"
        description="Contabilidade especializada para desenvolvedores, DevOps e profissionais de TI. Reduza impostos com Fator R, contratos PJ organizados e suporte para recebimentos internacionais."
        keywords="contabilidade para desenvolvedores, contabilidade para programadores, dev PJ contabilidade, contabilidade para TI, fator r desenvolvedor"
        canonical="/segmentos/contabilidade-para-profissionais-de-ti"
        pageType="service"
        priceRange="R$ 297,90 - R$ 697,90"
        includeLocalBusiness
        faqs={profissionaisTIFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Profissionais de TI", url: `${SITE_URL}/segmentos/contabilidade-para-profissionais-de-ti` }
        ]}
        customSchema={reviewSchema}
      />
      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Segmentos", href: "/" },
        { label: "Contabilidade para TI" }
      ]} />
      <main>
        <ProfissionaisTIHero />
        <ProfissionaisTILeadForm />
        <TaxComparisonCalculator profession="profissional de TI" accentColor="#0891B2" />
        <ProfissionaisTIProblems />
        <ProfissionaisTIBenefits />
        <ProfissionaisTIProcess />
        <ProfissionaisTITestimonials />
        <ProfissionaisTIFAQ />
        <ProfissionaisTICTA />
      </main>
      <Footer />
    </>
  );
}
