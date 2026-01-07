import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Benefits } from "@/components/sections/Benefits";
import { Services } from "@/components/sections/Services";
import { WhySpecialized } from "@/components/sections/WhySpecialized";
import { TaxCalculator } from "@/components/sections/TaxCalculator";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTA } from "@/components/sections/CTA";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Contabilidade Zen - Contabilidade para Profissionais da Saúde | Médicos, Dentistas, Psicólogos</title>
        <meta 
          name="description" 
          content="Contabilidade especializada para médicos, dentistas, psicólogos e profissionais da saúde. Reduza até 50% dos seus impostos legalmente. Abertura de empresa grátis, planejamento tributário e contabilidade 100% digital." 
        />
        <meta 
          name="keywords" 
          content="contabilidade para médicos, contabilidade para dentistas, contabilidade para psicólogos, contabilidade para profissionais da saúde, médico PJ, abertura de empresa médica, planejamento tributário saúde" 
        />
        <link rel="canonical" href="https://www.contabilidadezen.com.br" />
        <meta property="og:title" content="Contabilidade Zen - Especializada em Profissionais da Saúde" />
        <meta property="og:description" content="Contabilidade para médicos, dentistas e psicólogos. Economize até 50% em impostos de forma legal. Atendimento 100% digital." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.contabilidadezen.com.br" />
      </Helmet>
      <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Services />
        <WhySpecialized />
        <TaxCalculator />
        <Testimonials />
        <Pricing />
        <FAQ />
        <BlogPreview />
        <CTA />
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Index;
