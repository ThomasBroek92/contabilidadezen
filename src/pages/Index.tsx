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
          content="Contabilidade especializada para médicos, dentistas, psicólogos e profissionais da saúde. Reduza seus impostos legalmente. Abertura de empresa grátis, planejamento tributário e contabilidade 100% digital." 
        />
        <meta 
          name="keywords" 
          content="contabilidade para médicos, contabilidade para dentistas, contabilidade para psicólogos, contabilidade para profissionais da saúde, médico PJ, abertura de empresa médica, planejamento tributário saúde" 
        />
        <link rel="canonical" href="https://www.contabilidadezen.com.br" />
        <meta property="og:title" content="Contabilidade Zen - Especializada em Profissionais da Saúde" />
        <meta property="og:description" content="Contabilidade para médicos, dentistas e psicólogos. Economize em impostos de forma legal. Atendimento 100% digital." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.contabilidadezen.com.br" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Contabilidade Zen",
            "description": "Contabilidade especializada para profissionais da saúde: médicos, dentistas, psicólogos e clínicas.",
            "url": "https://www.contabilidadezen.com.br",
            "telephone": "+55-19-97415-8342",
            "email": "contato@contabilidadezen.com.br",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "São Paulo",
              "addressRegion": "SP",
              "addressCountry": "BR"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Brasil"
            },
            "priceRange": "$$",
            "openingHours": "Mo-Fr 09:00-18:00",
            "sameAs": [
              "https://www.instagram.com/contabilidadezen",
              "https://www.linkedin.com/company/contabilidadezen"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Serviços Contábeis",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Contabilidade para Médicos"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Contabilidade para Dentistas"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Contabilidade para Psicólogos"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Abertura de Empresa"
                  }
                }
              ]
            }
          })}
        </script>
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
