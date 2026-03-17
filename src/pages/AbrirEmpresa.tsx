import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { AbrirEmpresaHero } from "@/components/abrir-empresa/AbrirEmpresaHero";
import { AbrirEmpresaVirtualOffice } from "@/components/abrir-empresa/AbrirEmpresaVirtualOffice";
import { AbrirEmpresaComparison } from "@/components/abrir-empresa/AbrirEmpresaComparison";
import { AbrirEmpresaLeadForm } from "@/components/abrir-empresa/AbrirEmpresaLeadForm";
import { AbrirEmpresaFinancialServices } from "@/components/abrir-empresa/AbrirEmpresaFinancialServices";
import { AbrirEmpresaFAQ } from "@/components/abrir-empresa/AbrirEmpresaFAQ";
import { CustomerJourney } from "@/components/sections/CustomerJourney";
import { generateHowToSchema } from "@/lib/seo-schemas";

const howToSchema = generateHowToSchema(
  "Como abrir empresa com a Contabilidade Zen",
  "Processo 100% digital para abertura de CNPJ em até 15 dias úteis, sem burocracia.",
  [
    {
      name: "Consulta inicial gratuita",
      text: "Fale com nosso especialista pelo WhatsApp. Analisamos seu perfil, atividade e faturamento para definir o melhor regime tributário e tipo societário."
    },
    {
      name: "Documentação e registro",
      text: "Enviamos a lista de documentos necessários. Cuidamos de todo o registro na Junta Comercial, CNPJ, inscrições municipais/estaduais e alvarás."
    },
    {
      name: "Empresa aberta e funcionando",
      text: "Você recebe seu CNPJ ativo, acesso ao portal do cliente e começa a operar com contabilidade completa e suporte dedicado."
    }
  ],
  "P15D"
);

export default function AbrirEmpresa() {
  return (
    <>
      <SEOHead
        title="Abrir Empresa | Abertura de CNPJ Simples"
        description="Abra sua empresa com a Contabilidade Zen. Processo 100% digital, sem burocracia. CNPJ em até 15 dias úteis. Contabilidade completa e humanizada."
        keywords="abrir empresa, abertura de CNPJ, abrir MEI, contabilidade online, abertura de empresa"
        canonical="/abrir-empresa"
        pageType="service"
        priceRange="R$ 297,90 - R$ 697,90"
        includeLocalBusiness
        breadcrumbs={[
          { name: "Home", url: "https://www.contabilidadezen.com.br" },
          { name: "Serviços", url: "https://www.contabilidadezen.com.br" },
          { name: "Abrir Empresa", url: "https://www.contabilidadezen.com.br/abrir-empresa" }
        ]}
        faqs={[
          { question: "Quanto custa abrir uma empresa PJ?", answer: "Na Contabilidade Zen, oferecemos planos a partir de R$ 297,90/mês com todo suporte necessário para abertura e gestão contábil da sua empresa." },
          { question: "Quanto tempo leva para abrir a empresa?", answer: "O processo completo leva em média 7 a 15 dias úteis, dependendo da prefeitura e do conselho profissional." },
          { question: "Quais documentos preciso para abrir uma empresa?", answer: "RG e CPF, comprovante de residência atualizado, registro no conselho profissional (CRM, CRO, CRP) e certificado digital." }
        ]}
        customSchema={howToSchema}
      />
      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Serviços", href: "/" },
        { label: "Abrir Empresa" }
      ]} />
      
      <main>
        <AbrirEmpresaHero />
        <AbrirEmpresaVirtualOffice />
        <AbrirEmpresaLeadForm />
        <AbrirEmpresaComparison />
        
        <AbrirEmpresaFinancialServices />
        <CustomerJourney />
        <AbrirEmpresaFAQ />
      </main>

      <Footer />
    </>
  );
}
