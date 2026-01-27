import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RepresentantesHero } from "@/components/segmentos/representantes/RepresentantesHero";
import { RepresentantesLeadForm } from "@/components/segmentos/representantes/RepresentantesLeadForm";
import { RepresentantesBenefits } from "@/components/segmentos/representantes/RepresentantesBenefits";
import { RepresentantesProblems } from "@/components/segmentos/representantes/RepresentantesProblems";
import { RepresentantesProcess } from "@/components/segmentos/representantes/RepresentantesProcess";
import { RepresentantesTestimonials } from "@/components/segmentos/representantes/RepresentantesTestimonials";
import { RepresentantesFAQ } from "@/components/segmentos/representantes/RepresentantesFAQ";
import { RepresentantesCTA } from "@/components/segmentos/representantes/RepresentantesCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

export default function ContabilidadeRepresentantes() {
  return (
    <>
      <Helmet>
        <title>Contabilidade para Representantes Comerciais | Reduza Impostos</title>
        <meta 
          name="description" 
          content="Contabilidade especializada para representantes comerciais. Reduza impostos, organize comissões de múltiplas representadas e mantenha conformidade com o CORE." 
        />
        <meta 
          name="keywords" 
          content="contabilidade para representantes comerciais, representante comercial PJ, contabilidade para representação, planejamento tributário representante, CORE representante comercial" 
        />
        <link rel="canonical" href="https://www.contabilidadezen.com.br/segmentos/contabilidade-para-representantes-comerciais" />
        <meta property="og:title" content="Contabilidade para Representantes Comerciais | Reduza Impostos" />
        <meta property="og:description" content="Contabilidade especializada para representantes comerciais. Reduza até 50% dos impostos com planejamento tributário." />
        <meta property="og:url" content="https://www.contabilidadezen.com.br/segmentos/contabilidade-para-representantes-comerciais" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        <RepresentantesHero />
        <RepresentantesLeadForm />
        <TaxComparisonCalculator profession="representante comercial" />
        <RepresentantesProblems />
        <RepresentantesBenefits />
        <RepresentantesProcess />
        <RepresentantesTestimonials />
        <RepresentantesFAQ />
        <RepresentantesCTA />
      </main>
      
      <Footer />
    </>
  );
}
