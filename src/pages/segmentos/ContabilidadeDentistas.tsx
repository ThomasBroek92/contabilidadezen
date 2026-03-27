import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { DentistasHero } from "@/components/segmentos/dentistas/DentistasHero";
import { DentistasLeadForm } from "@/components/segmentos/dentistas/DentistasLeadForm";
import { DentistasBenefits } from "@/components/segmentos/dentistas/DentistasBenefits";
import { DentistasProblems } from "@/components/segmentos/dentistas/DentistasProblems";
import { DentistasProcess } from "@/components/segmentos/dentistas/DentistasProcess";
import { DentistasTestimonials } from "@/components/segmentos/dentistas/DentistasTestimonials";
import { DentistasFAQ, dentistasFaqs } from "@/components/segmentos/dentistas/DentistasFAQ";
import { DentistasCTA } from "@/components/segmentos/dentistas/DentistasCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";
import { generateReviewSchema } from "@/lib/seo-schemas";

const SITE_URL = "https://www.contabilidadezen.com.br";

const reviewSchema = generateReviewSchema(
  "Contabilidade para Dentistas",
  `${SITE_URL}/segmentos/contabilidade-para-dentistas`,
  [
    { name: "Dr. Marcos Lima", role: "Ortodontista", content: "A economia nos impostos foi surpreendente. A equipe entende perfeitamente as necessidades dos consultórios odontológicos.", rating: 5 },
    { name: "Dra. Juliana Costa", role: "Endodontista", content: "Migrei para PJ com a Contabilidade Zen e foi a melhor decisão. Atendimento ágil e personalizado.", rating: 5 },
    { name: "Dr. Fernando Santos", role: "Proprietário de Clínica", content: "Gerenciam toda a contabilidade da minha clínica com múltiplos dentistas. Excelente organização e transparência.", rating: 5 },
  ]
);

export default function ContabilidadeDentistas() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Dentistas"
        description="Abra seu CNPJ odontológico e reduza impostos com gestão fiscal especializada para dentistas PJ. Simples Nacional, Lucro Presumido e abertura de empresa. Orçamento grátis."
        keywords="contabilidade para dentistas, contabilidade para clínicas odontológicas, dentista PJ contabilidade, planejamento tributário dentista, contabilidade online para dentistas"
        canonical="/segmentos/contabilidade-para-dentistas"
        pageType="service"
        priceRange="R$ 297,90 - R$ 697,90"
        includeLocalBusiness
        faqs={dentistasFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Dentistas", url: `${SITE_URL}/segmentos/contabilidade-para-dentistas` }
        ]}
        customSchema={reviewSchema}
      />
      
      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Segmentos", href: "/" },
        { label: "Contabilidade para Dentistas" }
      ]} />
      
      <main>
        <DentistasHero />
        <DentistasLeadForm />
        <TaxComparisonCalculator profession="dentista" accentColor="#10B981" />
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
