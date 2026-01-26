import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AbrirEmpresaHero } from "@/components/abrir-empresa/AbrirEmpresaHero";
import { AbrirEmpresaVirtualOffice } from "@/components/abrir-empresa/AbrirEmpresaVirtualOffice";
import { AbrirEmpresaComparison } from "@/components/abrir-empresa/AbrirEmpresaComparison";
import { AbrirEmpresaLeadForm } from "@/components/abrir-empresa/AbrirEmpresaLeadForm";
import { AbrirEmpresaCTA } from "@/components/abrir-empresa/AbrirEmpresaCTA";

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
      <Helmet>
        <title>Abrir Empresa | Contabilidade Zen - Abertura de CNPJ Simples</title>
        <meta
          name="description"
          content="Abra sua empresa com a Contabilidade Zen. Processo 100% digital, sem burocracia. CNPJ em até 15 dias úteis. Contabilidade completa e humanizada."
        />
        <meta
          name="keywords"
          content="abrir empresa, abertura de CNPJ, abrir MEI, contabilidade online, abertura de empresa"
        />
        <link rel="canonical" href="https://www.contabilidadezen.com.br/abrir-empresa" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <Header />
      
      <main>
        <AbrirEmpresaHero />
        <AbrirEmpresaVirtualOffice />
        <AbrirEmpresaLeadForm />
        <AbrirEmpresaComparison />
        
        <AbrirEmpresaFinancialServices />
        <CustomerJourney />
        <AbrirEmpresaCTA />
        <AbrirEmpresaFAQ />
      </main>

      <Footer />
    </>
  );
}
