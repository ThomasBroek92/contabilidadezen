import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PsicologosHero } from "@/components/segmentos/psicologos/PsicologosHero";
import { PsicologosLeadForm } from "@/components/segmentos/psicologos/PsicologosLeadForm";
import { PsicologosBenefits } from "@/components/segmentos/psicologos/PsicologosBenefits";
import { PsicologosProblems } from "@/components/segmentos/psicologos/PsicologosProblems";
import { PsicologosProcess } from "@/components/segmentos/psicologos/PsicologosProcess";
import { PsicologosTestimonials } from "@/components/segmentos/psicologos/PsicologosTestimonials";
import { PsicologosFAQ, psicologosFaqs } from "@/components/segmentos/psicologos/PsicologosFAQ";
import { PsicologosCTA } from "@/components/segmentos/psicologos/PsicologosCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadePsicologos() {
  return (
    <>
      <SEOHead
        title="Contabilidade para Psicólogos | Contabilidade Zen"
        description="Tributação otimizada para psicólogos PJ. Simples Nacional com Fator R, abertura de CNPJ e planejamento tributário especializado. 100% online. Orçamento grátis."
        keywords="contabilidade para psicólogos, contabilidade para clínicas de psicologia, psicólogo PJ contabilidade, planejamento tributário psicólogo, contabilidade online para psicólogos"
        canonical="/segmentos/contabilidade-para-psicologos"
        pageType="service"
        includeLocalBusiness
        faqs={psicologosFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "Contabilidade para Psicólogos", url: `${SITE_URL}/segmentos/contabilidade-para-psicologos` }
        ]}
      />
      
      <Header />
      
      <main>
        <PsicologosHero />
        <PsicologosLeadForm />
        <TaxComparisonCalculator profession="psicólogo" accentColor="#8B5CF6" />
        <PsicologosProblems />
        <PsicologosBenefits />

        {/* Card destaque: Guia Completo */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 lg:p-10 flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Guia Completo para Psicólogos PJ</h2>
              <p className="text-muted-foreground max-w-xl">
                Tudo sobre CNAE, Simples Nacional, Fator R e credenciamento em planos de saúde.
              </p>
              <Button asChild size="lg" className="mt-2">
                <Link to="/guia-contabilidade-psicologos">
                  Ler guia completo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <PsicologosProcess />
        <PsicologosTestimonials />
        <PsicologosFAQ />
        <PsicologosCTA />
      </main>
      
      <Footer />
    </>
  );
}
