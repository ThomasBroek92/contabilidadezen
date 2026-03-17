import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { AdvogadosHero } from "@/components/segmentos/advogados/AdvogadosHero";
import { AdvogadosLeadForm } from "@/components/segmentos/advogados/AdvogadosLeadForm";
import { AdvogadosBenefits } from "@/components/segmentos/advogados/AdvogadosBenefits";
import { AdvogadosProblems } from "@/components/segmentos/advogados/AdvogadosProblems";
import { AdvogadosProcess } from "@/components/segmentos/advogados/AdvogadosProcess";
import { AdvogadosTestimonials } from "@/components/segmentos/advogados/AdvogadosTestimonials";
import { AdvogadosFAQ, advogadosFaqs } from "@/components/segmentos/advogados/AdvogadosFAQ";
import { AdvogadosCTA } from "@/components/segmentos/advogados/AdvogadosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";
import { generateReviewSchema } from "@/lib/seo-schemas";

const SITE_URL = "https://www.contabilidadezen.com.br";

const reviewSchema = generateReviewSchema(
  "Contabilidade para Advogados",
  `${SITE_URL}/segmentos/contabilidade-para-advogados`,
  [
    { name: "Dr. Ricardo Moreira", role: "Advogado Tributarista", content: "Excelente assessoria contábil. Entenderam a complexidade da sociedade de advogados e otimizaram nosso regime tributário.", rating: 5 },
    { name: "Dra. Beatriz Santos", role: "Advogada Trabalhista", content: "A migração para PJ foi tranquila e a economia significativa. Recomendo para todos os colegas da OAB.", rating: 5 },
    { name: "Dr. André Oliveira", role: "Sócio de Escritório", content: "Atendimento personalizado e ágil. Finalmente tenho uma contabilidade que entende as particularidades do direito.", rating: 5 },
  ]
);

export default function ContabilidadeAdvogados() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Advogados e Escritórios de Advocacia | Reduza Impostos"
        description="Contabilidade especializada para advogados e escritórios de advocacia. Simples Nacional vs Lucro Presumido, sociedade de advogados OAB, distribuição de lucros e planejamento tributário personalizado."
        keywords="contabilidade para advogados, contabilidade para escritório de advocacia, advogado PJ contabilidade, sociedade de advogados OAB, planejamento tributário advogado, contabilidade online para advogados"
        canonical="/segmentos/contabilidade-para-advogados"
        pageType="service"
        priceRange="R$ 297,90 - R$ 697,90"
        includeLocalBusiness
        faqs={advogadosFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Advogados", url: `${SITE_URL}/segmentos/contabilidade-para-advogados` }
        ]}
        customSchema={reviewSchema}
      />
      
      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Segmentos", href: "/" },
        { label: "Contabilidade para Advogados" }
      ]} />
      
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
