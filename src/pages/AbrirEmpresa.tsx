import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AbrirEmpresaHero } from "@/components/abrir-empresa/AbrirEmpresaHero";
import { AbrirEmpresaVirtualOffice } from "@/components/abrir-empresa/AbrirEmpresaVirtualOffice";
import { AbrirEmpresaComparison } from "@/components/abrir-empresa/AbrirEmpresaComparison";

import { AbrirEmpresaBenefits } from "@/components/abrir-empresa/AbrirEmpresaBenefits";

import { AbrirEmpresaLeadForm } from "@/components/abrir-empresa/AbrirEmpresaLeadForm";
import { AbrirEmpresaCTA } from "@/components/abrir-empresa/AbrirEmpresaCTA";
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto custa abrir uma empresa PJ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Na Contabilidade Zen, a abertura de empresa para profissionais da saúde é gratuita! Você só paga a mensalidade da contabilidade a partir de R$ 297,90/mês."
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
        <title>Abrir Empresa Grátis | Contabilidade Zen - Abertura de CNPJ Simples</title>
        <meta
          name="description"
          content="Abra sua empresa grátis com a Contabilidade Zen. Processo 100% digital, sem burocracia. CNPJ em até 15 dias úteis. Contabilidade completa e humanizada."
        />
        <meta
          name="keywords"
          content="abrir empresa, abertura de CNPJ, abrir MEI, abrir empresa grátis, contabilidade online, abertura de empresa"
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
        
        <AbrirEmpresaBenefits />
        
        <AbrirEmpresaCTA />
      </main>

      <Footer />
    </>
  );
}
