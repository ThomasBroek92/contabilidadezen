import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroMultiNiche } from "@/components/sections/HeroMultiNiche";
import { NichesCarousel } from "@/components/sections/NichesCarousel";
import { MainServices } from "@/components/sections/MainServices";
import { CustomerJourney } from "@/components/sections/CustomerJourney";
import { RoutineCarousel } from "@/components/sections/RoutineCarousel";
import { Benefits } from "@/components/sections/Benefits";
import { WhySpecialized } from "@/components/sections/WhySpecialized";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTA } from "@/components/sections/CTA";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { homePageSchema, generateFAQSchema, homeFAQs } from "@/lib/seo-schemas";
const Index = () => {
  // Combine all schemas for maximum rich snippet potential
  const combinedSchema = {
    ...homePageSchema,
    "@graph": [...homePageSchema["@graph"], generateFAQSchema(homeFAQs)]
  };
  return <>
      <Helmet>
        <title>Contabilidade Zen - Contabilidade Especializada para Profissionais e Empresas | Economize até 50% em Impostos</title>
        <meta name="description" content="Contabilidade digital nichada para médicos, advogados, TI, produtores digitais, e-commerce e mais. Reduza seus impostos legalmente em até 50%. 100% online, abertura de empresa grátis." />
        <meta name="keywords" content="contabilidade para médicos, contabilidade para advogados, contabilidade para TI, contabilidade para produtores digitais, contabilidade para e-commerce, contabilidade online, abertura de empresa, planejamento tributário" />
        <link rel="canonical" href="https://www.contabilidadezen.com.br" />
        <meta property="og:title" content="Contabilidade Zen - Economize até 50% em Impostos" />
        <meta property="og:description" content="Contabilidade digital especializada por nicho. Médicos, advogados, TI, produtores digitais e mais. 100% online, 0% burocracia." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.contabilidadezen.com.br" />
        <meta property="og:image" content="https://www.contabilidadezen.com.br/og-image.png" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Contabilidade Zen" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contabilidade Zen - Economize até 50% em Impostos" />
        <meta name="twitter:description" content="Contabilidade digital especializada por nicho. 100% online, máxima economia tributária." />
        <script type="application/ld+json">
          {JSON.stringify(combinedSchema)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroMultiNiche />
          
          <ScrollAnimation>
            <NichesCarousel />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <MainServices />
          </ScrollAnimation>
          
          <ScrollAnimation>
            <CustomerJourney />
          </ScrollAnimation>
          
          <ScrollAnimation>
            <RoutineCarousel />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Testimonials />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Benefits />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <FAQ />
          </ScrollAnimation>
          
          <ScrollAnimation>
            <BlogPreview />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <CTA />
          </ScrollAnimation>
        </main>
        <Footer />
      </div>
    </>;
};
export default Index;