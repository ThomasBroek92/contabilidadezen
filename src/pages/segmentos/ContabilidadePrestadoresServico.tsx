import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PrestadoresServicoHero } from "@/components/segmentos/prestadores-servico/PrestadoresServicoHero";
import { PrestadoresServicoLeadForm } from "@/components/segmentos/prestadores-servico/PrestadoresServicoLeadForm";
import { PrestadoresServicoBenefits } from "@/components/segmentos/prestadores-servico/PrestadoresServicoBenefits";
import { PrestadoresServicoProblems } from "@/components/segmentos/prestadores-servico/PrestadoresServicoProblems";
import { PrestadoresServicoProcess } from "@/components/segmentos/prestadores-servico/PrestadoresServicoProcess";
import { PrestadoresServicoTestimonials } from "@/components/segmentos/prestadores-servico/PrestadoresServicoTestimonials";
import { PrestadoresServicoFAQ, prestadoresServicoFaqs } from "@/components/segmentos/prestadores-servico/PrestadoresServicoFAQ";
import { PrestadoresServicoCTA } from "@/components/segmentos/prestadores-servico/PrestadoresServicoCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadePrestadoresServico() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Prestadores de Serviço | Reduza Impostos"
        description="Contabilidade especializada para consultores, freelancers e prestadores de serviço. Reduza impostos com Fator R, NFS-e automática e enquadramento tributário otimizado."
        keywords="contabilidade para prestadores de serviço, contabilidade para freelancer, contabilidade para consultor, NFS-e prestador"
        canonical="/segmentos/contabilidade-para-prestadores-de-servico"
        pageType="service"
        includeLocalBusiness
        faqs={prestadoresServicoFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Prestadores de Serviço", url: `${SITE_URL}/segmentos/contabilidade-para-prestadores-de-servico` },
        ]}
      />
      <Header />
      <main>
        <PrestadoresServicoHero />
        <PrestadoresServicoLeadForm />
        <TaxComparisonCalculator profession="prestador de serviço" accentColor="#D97706" />
        <PrestadoresServicoBenefits />
        <PrestadoresServicoProblems />
        <PrestadoresServicoProcess />
        <PrestadoresServicoTestimonials />
        <PrestadoresServicoFAQ />
        <PrestadoresServicoCTA />
      </main>
      <Footer />
    </>
  );
}
