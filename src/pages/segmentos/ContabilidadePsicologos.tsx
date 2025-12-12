import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PsicologosHero } from "@/components/segmentos/psicologos/PsicologosHero";
import { PsicologosLeadForm } from "@/components/segmentos/psicologos/PsicologosLeadForm";
import { PsicologosBenefits } from "@/components/segmentos/psicologos/PsicologosBenefits";
import { PsicologosProblems } from "@/components/segmentos/psicologos/PsicologosProblems";
import { PsicologosProcess } from "@/components/segmentos/psicologos/PsicologosProcess";
import { PsicologosTestimonials } from "@/components/segmentos/psicologos/PsicologosTestimonials";
import { PsicologosFAQ } from "@/components/segmentos/psicologos/PsicologosFAQ";
import { PsicologosCTA } from "@/components/segmentos/psicologos/PsicologosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

export default function ContabilidadePsicologos() {
  return (
    <>
      <Helmet>
        <title>Contabilidade para Psicólogos e Clínicas de Psicologia | Reduza Impostos</title>
        <meta 
          name="description" 
          content="Contabilidade especializada para psicólogos e clínicas de psicologia. Reduza impostos, elimine burocracias e aumente seus lucros com planejamento tributário personalizado." 
        />
        <meta 
          name="keywords" 
          content="contabilidade para psicólogos, contabilidade para clínicas de psicologia, psicólogo PJ contabilidade, planejamento tributário psicólogo, contabilidade online para psicólogos" 
        />
        <link rel="canonical" href="/segmentos/contabilidade-para-psicologos" />
      </Helmet>
      
      <Header />
      
      <main>
        <PsicologosHero />
        <PsicologosLeadForm />
        <TaxComparisonCalculator profession="psicólogo" />
        <PsicologosProblems />
        <PsicologosBenefits />
        <PsicologosProcess />
        <PsicologosTestimonials />
        <PsicologosFAQ />
        <PsicologosCTA />
      </main>
      
      <Footer />
    </>
  );
}
