import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { MedicosHero } from "@/components/segmentos/medicos/MedicosHero";
import { MedicosLeadForm } from "@/components/segmentos/medicos/MedicosLeadForm";
import { MedicosBenefits } from "@/components/segmentos/medicos/MedicosBenefits";
import { MedicosProblems } from "@/components/segmentos/medicos/MedicosProblems";
import { MedicosProcess } from "@/components/segmentos/medicos/MedicosProcess";
import { MedicosTestimonials } from "@/components/segmentos/medicos/MedicosTestimonials";
import { MedicosFAQ, medicosFaqs } from "@/components/segmentos/medicos/MedicosFAQ";
import { MedicosCTA } from "@/components/segmentos/medicos/MedicosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";
import { generateReviewSchema, generateHowToSchema } from "@/lib/seo-schemas";

const SITE_URL = "https://www.contabilidadezen.com.br";

const reviewSchema = generateReviewSchema(
  "Contabilidade para Médicos",
  `${SITE_URL}/segmentos/contabilidade-para-medicos`,
  [
    { name: "Dr. Carlos Mendes", role: "Cardiologista", content: "Desde que contratei a Contabilidade Zen, consegui reduzir mais de 30% dos meus impostos. Finalmente tenho tranquilidade para focar nos meus pacientes.", rating: 5 },
    { name: "Dra. Ana Paula Silva", role: "Proprietária de Clínica", content: "A equipe é extremamente atenciosa e entende perfeitamente as necessidades da área médica. Recomendo para todos os colegas de profissão!", rating: 5 },
    { name: "Dr. Roberto Almeida", role: "Cirurgião Plástico", content: "Migrei de Pessoa Física para PJ com a orientação deles e a economia foi impressionante. Atendimento impecável do início ao fim.", rating: 5 },
  ]
);

const howToSchema = generateHowToSchema(
  "Como contratar contabilidade para médicos",
  "Processo simples e 100% digital para médicos que querem reduzir impostos e ter contabilidade especializada.",
  [
    { name: "Diagnóstico tributário gratuito", text: "Analisamos sua situação fiscal atual, faturamento e regime tributário para identificar oportunidades de economia." },
    { name: "Proposta personalizada", text: "Elaboramos um plano contábil sob medida para médicos, com planejamento tributário e projeção de economia." },
    { name: "Migração e início", text: "Cuidamos de toda a migração do seu contador atual. Em até 15 dias você já está operando com a Contabilidade Zen." },
  ]
);

export default function ContabilidadeMedicos() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Médicos PJ | Contabilidade Zen"
        description="Abra seu CNPJ médico e pague até 50% menos impostos. Especialistas em Simples Nacional, Lucro Presumido e planejamento tributário. Orçamento grátis."
        keywords="contabilidade para médicos, contabilidade para clínicas médicas, médico PJ contabilidade, planejamento tributário médico, contabilidade online para médicos"
        canonical="/segmentos/contabilidade-para-medicos"
        pageType="service"
        priceRange="R$ 297,90 - R$ 697,90"
        includeLocalBusiness
        faqs={medicosFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Médicos", url: `${SITE_URL}/segmentos/contabilidade-para-medicos` }
        ]}
        customSchema={[reviewSchema, howToSchema]}
      />
      
      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Segmentos", href: "/" },
        { label: "Contabilidade para Médicos" }
      ]} />
      
      <main>
        <MedicosHero />
        <MedicosLeadForm />
        <TaxComparisonCalculator profession="médico" accentColor="#0077B6" />
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
