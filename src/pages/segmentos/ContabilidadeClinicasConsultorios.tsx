import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClinicasConsultoriosHero } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosHero";
import { ClinicasConsultoriosLeadForm } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosLeadForm";
import { ClinicasConsultoriosBenefits } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosBenefits";
import { ClinicasConsultoriosProblems } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosProblems";
import { ClinicasConsultoriosProcess } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosProcess";
import { ClinicasConsultoriosTestimonials } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosTestimonials";
import { ClinicasConsultoriosFAQ, clinicasConsultoriosFaqs } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosFAQ";
import { ClinicasConsultoriosCTA } from "@/components/segmentos/clinicas-consultorios/ClinicasConsultoriosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeClinicasConsultorios() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Clínicas e Consultórios | Equiparação Hospitalar"
        description="Contabilidade especializada em clínicas e consultórios. Equiparação hospitalar (IR/CSLL de 32% → 8%), folha de pagamento, convênios e sociedade médica."
        keywords="contabilidade para clínicas, contabilidade consultório médico, equiparação hospitalar, contabilidade clínica odontológica, contabilidade laboratório"
        canonical="/segmentos/contabilidade-para-clinicas-e-consultorios"
        pageType="service"
        includeLocalBusiness
        faqs={clinicasConsultoriosFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Clínicas e Consultórios", url: `${SITE_URL}/segmentos/contabilidade-para-clinicas-e-consultorios` },
        ]}
      />
      <Header />
      <main>
        <ClinicasConsultoriosHero />
        <ClinicasConsultoriosLeadForm />
        <TaxComparisonCalculator profession="clínica/consultório" accentColor="#059669" />
        <ClinicasConsultoriosBenefits />
        <ClinicasConsultoriosProblems />
        <ClinicasConsultoriosProcess />
        <ClinicasConsultoriosTestimonials />
        <ClinicasConsultoriosFAQ />
        <ClinicasConsultoriosCTA />
      </main>
      <Footer />
    </>
  );
}
