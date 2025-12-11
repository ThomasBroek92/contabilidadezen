import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MedicosHero } from "@/components/segmentos/medicos/MedicosHero";
import { MedicosLeadForm } from "@/components/segmentos/medicos/MedicosLeadForm";
import { MedicosBenefits } from "@/components/segmentos/medicos/MedicosBenefits";
import { MedicosProblems } from "@/components/segmentos/medicos/MedicosProblems";
import { MedicosProcess } from "@/components/segmentos/medicos/MedicosProcess";
import { MedicosTestimonials } from "@/components/segmentos/medicos/MedicosTestimonials";
import { MedicosFAQ } from "@/components/segmentos/medicos/MedicosFAQ";
import { MedicosCTA } from "@/components/segmentos/medicos/MedicosCTA";

export default function ContabilidadeMedicos() {
  return (
    <>
      <Helmet>
        <title>Contabilidade para Médicos e Clínicas Médicas | Reduza Impostos</title>
        <meta 
          name="description" 
          content="Contabilidade especializada para médicos e clínicas médicas. Reduza impostos, elimine burocracias e aumente seus lucros com planejamento tributário personalizado." 
        />
        <meta 
          name="keywords" 
          content="contabilidade para médicos, contabilidade para clínicas médicas, médico PJ contabilidade, planejamento tributário médico, contabilidade online para médicos" 
        />
        <link rel="canonical" href="/segmentos/contabilidade-para-medicos" />
      </Helmet>
      
      <Header />
      
      <main>
        <MedicosHero />
        <MedicosLeadForm />
        <MedicosProblems />
        <MedicosBenefits />
        <MedicosProcess />
        <MedicosTestimonials />
        <MedicosFAQ />
        <MedicosCTA />
      </main>
      
      <Footer />
    </>
  );
}
