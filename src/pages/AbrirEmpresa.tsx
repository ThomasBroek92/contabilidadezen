import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AbrirEmpresaHero } from "@/components/abrir-empresa/AbrirEmpresaHero";
import { AbrirEmpresaComparison } from "@/components/abrir-empresa/AbrirEmpresaComparison";
import { AbrirEmpresaPricing } from "@/components/abrir-empresa/AbrirEmpresaPricing";
import { AbrirEmpresaBenefits } from "@/components/abrir-empresa/AbrirEmpresaBenefits";
import { AbrirEmpresaTimeline } from "@/components/abrir-empresa/AbrirEmpresaTimeline";
import { AbrirEmpresaCTA } from "@/components/abrir-empresa/AbrirEmpresaCTA";

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
      </Helmet>

      <Header />
      
      <main>
        <AbrirEmpresaHero />
        <AbrirEmpresaComparison />
        <AbrirEmpresaPricing />
        <AbrirEmpresaBenefits />
        <AbrirEmpresaTimeline />
        <AbrirEmpresaCTA />
      </main>

      <Footer />
    </>
  );
}
