import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EcommerceHero } from "@/components/segmentos/ecommerce/EcommerceHero";
import { EcommerceLeadForm } from "@/components/segmentos/ecommerce/EcommerceLeadForm";
import { EcommerceBenefits } from "@/components/segmentos/ecommerce/EcommerceBenefits";
import { EcommerceProblems } from "@/components/segmentos/ecommerce/EcommerceProblems";
import { EcommerceProcess } from "@/components/segmentos/ecommerce/EcommerceProcess";
import { EcommerceTestimonials } from "@/components/segmentos/ecommerce/EcommerceTestimonials";
import { EcommerceFAQ, ecommerceFaqs } from "@/components/segmentos/ecommerce/EcommerceFAQ";
import { EcommerceCTA } from "@/components/segmentos/ecommerce/EcommerceCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeEcommerce() {
  return (
    <>
      <SEOHead
        title="Contabilidade para E-commerce | Marketplace, Dropshipping e Loja Online"
        description="Contabilidade especializada em e-commerce: Mercado Livre, Shopee, Amazon, Shopify. Controle de estoque, CMV, ICMS-ST e NF de marketplace. A partir de 6%."
        keywords="contabilidade para e-commerce, contabilidade marketplace, contabilidade dropshipping, ICMS-ST e-commerce, CMV controle estoque"
        canonical="/segmentos/contabilidade-para-ecommerce"
        pageType="service"
        includeLocalBusiness
        faqs={ecommerceFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "E-commerce", url: `${SITE_URL}/segmentos/contabilidade-para-ecommerce` },
        ]}
      />
      <Header />
      <main>
        <EcommerceHero />
        <EcommerceLeadForm />
        <TaxComparisonCalculator profession="e-commerce" accentColor="#DB2777" />
        <EcommerceBenefits />
        <EcommerceProblems />
        <EcommerceProcess />
        <EcommerceTestimonials />
        <EcommerceFAQ />
        <EcommerceCTA />
      </main>
      <Footer />
    </>
  );
}
