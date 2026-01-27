import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AbrirEmpresaHero } from "@/components/abrir-empresa/AbrirEmpresaHero";
import { AbrirEmpresaVirtualOffice } from "@/components/abrir-empresa/AbrirEmpresaVirtualOffice";
import { AbrirEmpresaComparison } from "@/components/abrir-empresa/AbrirEmpresaComparison";
import { AbrirEmpresaLeadForm } from "@/components/abrir-empresa/AbrirEmpresaLeadForm";


import { AbrirEmpresaFinancialServices } from "@/components/abrir-empresa/AbrirEmpresaFinancialServices";
import { AbrirEmpresaFAQ } from "@/components/abrir-empresa/AbrirEmpresaFAQ";
import { CustomerJourney } from "@/components/sections/CustomerJourney";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto custa abrir uma empresa PJ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Na Contabilidade Zen, oferecemos planos a partir de R$ 297,90/mês com todo suporte necessário para abertura e gestão contábil da sua empresa."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto tempo leva para abrir a empresa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O processo completo leva em média 7 a 15 dias úteis, dependendo da prefeitura e do conselho profissional."
      }
    },
    {
      "@type": "Question",
      "name": "Quais documentos preciso para abrir uma empresa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "RG e CPF, comprovante de residência atualizado, registro no conselho profissional (CRM, CRO, CRP) e certificado digital."
      }
    }
  ]
};

export default function AbrirEmpresa() {
  return (
    <>
      <SEOHead
        title="Abrir Empresa | Abertura de CNPJ Simples"
        description="Abra sua empresa com a Contabilidade Zen. Processo 100% digital, sem burocracia. CNPJ em até 15 dias úteis. Contabilidade completa e humanizada."
        keywords="abrir empresa, abertura de CNPJ, abrir MEI, contabilidade online, abertura de empresa"
        canonical="/abrir-empresa"
        pageType="service"
        includeLocalBusiness
        faqs={[
          { question: "Quanto custa abrir uma empresa PJ?", answer: "Na Contabilidade Zen, oferecemos planos a partir de R$ 297,90/mês com todo suporte necessário para abertura e gestão contábil da sua empresa." },
          { question: "Quanto tempo leva para abrir a empresa?", answer: "O processo completo leva em média 7 a 15 dias úteis, dependendo da prefeitura e do conselho profissional." },
          { question: "Quais documentos preciso para abrir uma empresa?", answer: "RG e CPF, comprovante de residência atualizado, registro no conselho profissional (CRM, CRO, CRP) e certificado digital." }
        ]}
      />

      <Header />
      
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
