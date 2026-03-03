import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfissionaisTIHero } from "@/components/segmentos/profissionais-ti/ProfissionaisTIHero";
import { ProfissionaisTILeadForm } from "@/components/segmentos/profissionais-ti/ProfissionaisTILeadForm";
import { ProfissionaisTIBenefits } from "@/components/segmentos/profissionais-ti/ProfissionaisTIBenefits";
import { ProfissionaisTIProblems } from "@/components/segmentos/profissionais-ti/ProfissionaisTIProblems";
import { ProfissionaisTIProcess } from "@/components/segmentos/profissionais-ti/ProfissionaisTIProcess";
import { ProfissionaisTITestimonials } from "@/components/segmentos/profissionais-ti/ProfissionaisTITestimonials";
import { ProfissionaisTIFAQ, profissionaisTIFaqs } from "@/components/segmentos/profissionais-ti/ProfissionaisTIFAQ";
import { ProfissionaisTICTA } from "@/components/segmentos/profissionais-ti/ProfissionaisTICTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeProfissionaisTI() {
  return (
    <>
      <SEOHead title="Contabilidade para Profissionais de TI | Devs, DevOps, Data Science" description="Contabilidade especializada para desenvolvedores, DevOps e profissionais de TI. Reduza impostos com Fator R, contratos PJ organizados e suporte para recebimentos internacionais." keywords="contabilidade para desenvolvedores, contabilidade para programadores, dev PJ contabilidade, contabilidade para TI, fator r desenvolvedor" canonical="/segmentos/contabilidade-para-profissionais-de-ti" pageType="service" includeLocalBusiness faqs={profissionaisTIFaqs} breadcrumbs={[{ name: "Home", url: SITE_URL }, { name: "Segmentos", url: SITE_URL }, { name: "Contabilidade para Profissionais de TI", url: `${SITE_URL}/segmentos/contabilidade-para-profissionais-de-ti` }]} />
      <Header />
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
