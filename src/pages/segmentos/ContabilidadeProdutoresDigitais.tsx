import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProdutoresDigitaisHero } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisHero";
import { ProdutoresDigitaisLeadForm } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisLeadForm";
import { ProdutoresDigitaisBenefits } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisBenefits";
import { ProdutoresDigitaisProblems } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisProblems";
import { ProdutoresDigitaisProcess } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisProcess";
import { ProdutoresDigitaisTestimonials } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisTestimonials";
import { ProdutoresDigitaisFAQ, produtoresDigitaisFaqs } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisFAQ";
import { ProdutoresDigitaisCTA } from "@/components/segmentos/produtores-digitais/ProdutoresDigitaisCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeProdutoresDigitais() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Produtores Digitais | Hotmart, Eduzz, Kiwify"
        description="Contabilidade especializada para produtores digitais, infoprodutores e afiliados. Reduza impostos de 27,5% para 6% com planejamento tributário. Nota fiscal automática."
        keywords="contabilidade para produtores digitais, contabilidade para infoprodutores, contabilidade hotmart, contabilidade eduzz, afiliado digital contabilidade, nota fiscal infoproduto"
        canonical="/segmentos/contabilidade-para-produtores-digitais"
        pageType="service"
        includeLocalBusiness
        faqs={produtoresDigitaisFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Produtores Digitais", url: `${SITE_URL}/segmentos/contabilidade-para-produtores-digitais` }
        ]}
      />
      <Header />
      <main>
        <ProdutoresDigitaisHero />
        <ProdutoresDigitaisLeadForm />
        <TaxComparisonCalculator profession="produtor digital" accentColor="#9333EA" />
        <ProdutoresDigitaisProblems />
        <ProdutoresDigitaisBenefits />
        <ProdutoresDigitaisProcess />
        <ProdutoresDigitaisTestimonials />
        <ProdutoresDigitaisFAQ />
        <ProdutoresDigitaisCTA />
      </main>
      <Footer />
    </>
  );
}
