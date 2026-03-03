import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExportacaoServicosHero } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosHero";
import { ExportacaoServicosLeadForm } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosLeadForm";
import { ExportacaoServicosBenefits } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosBenefits";
import { ExportacaoServicosProblems } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosProblems";
import { ExportacaoServicosProcess } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosProcess";
import { ExportacaoServicosTestimonials } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosTestimonials";
import { ExportacaoServicosFAQ, exportacaoServicosFaqs } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosFAQ";
import { ExportacaoServicosCTA } from "@/components/segmentos/exportacao-servicos/ExportacaoServicosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";
const SITE_URL = "https://www.contabilidadezen.com.br";
export default function ContabilidadeExportacaoServicos() {
  return (<><SEOHead title="Contabilidade para Exportação de Serviços | Isenção ISS" description="Contabilidade especializada em exportação de serviços. Isenção de ISS, câmbio, contratos internacionais e compliance. Receba em dólar/euro com segurança." keywords="contabilidade exportação serviços, isenção ISS exportação, contabilidade para freelancer internacional, receber dólar PJ" canonical="/segmentos/contabilidade-para-exportacao-de-servicos" pageType="service" includeLocalBusiness faqs={exportacaoServicosFaqs} breadcrumbs={[{ name: "Home", url: SITE_URL }, { name: "Segmentos", url: SITE_URL }, { name: "Exportação de Serviços", url: `${SITE_URL}/segmentos/contabilidade-para-exportacao-de-servicos` }]} />
    <Header /><main><ExportacaoServicosHero /><ExportacaoServicosLeadForm /><TaxComparisonCalculator profession="exportador de serviços" accentColor="#2563EB" /><ExportacaoServicosProblems /><ExportacaoServicosBenefits /><ExportacaoServicosProcess /><ExportacaoServicosTestimonials /><ExportacaoServicosFAQ /><ExportacaoServicosCTA /></main><Footer /></>);
}
