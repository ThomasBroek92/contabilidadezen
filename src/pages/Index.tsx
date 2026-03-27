import { lazy, Suspense } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroMultiNiche } from "@/components/sections/HeroMultiNiche";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { homeFAQs, webSiteSchema, siteNavigationSchema } from "@/lib/seo-schemas";

// Lazy load de componentes abaixo da dobra para reduzir bundle inicial
const NichesCarousel = lazy(() => 
  import("@/components/sections/NichesCarousel").then(m => ({ default: m.NichesCarousel }))
);
const MainServices = lazy(() => 
  import("@/components/sections/MainServices").then(m => ({ default: m.MainServices }))
);
const CustomerJourney = lazy(() => 
  import("@/components/sections/CustomerJourney").then(m => ({ default: m.CustomerJourney }))
);
const RoutineCarousel = lazy(() => 
  import("@/components/sections/RoutineCarousel").then(m => ({ default: m.RoutineCarousel }))
);
const CitiesSection = lazy(() => 
  import("@/components/sections/CitiesSection").then(m => ({ default: m.CitiesSection }))
);
const Testimonials = lazy(() => 
  import("@/components/sections/Testimonials").then(m => ({ default: m.Testimonials }))
);
const PJCalculatorSection = lazy(() => 
  import("@/components/sections/PJCalculatorSection").then(m => ({ default: m.PJCalculatorSection }))
);
const Benefits = lazy(() => 
  import("@/components/sections/Benefits").then(m => ({ default: m.Benefits }))
);
const FAQ = lazy(() => 
  import("@/components/sections/FAQ").then(m => ({ default: m.FAQ }))
);
const BlogPreview = lazy(() => 
  import("@/components/sections/BlogPreview").then(m => ({ default: m.BlogPreview }))
);
const FinalCTA = lazy(() => 
  import("@/components/sections/FinalCTA").then(m => ({ default: m.FinalCTA }))
);

// Fallback minimalista para Suspense
const SectionFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <>
      <SEOHead
        title="Contabilidade Zen | Especialistas em Médicos, Dentistas e Psicólogos"
        description="Contabilidade digital especializada para profissionais da saúde. Reduza impostos com especialistas em Simples Nacional e Lucro Presumido. 100% online."
        keywords="contabilidade digital, redução de impostos, planejamento tributário, contabilidade online, abrir empresa, MEI, Simples Nacional, contabilidade para médicos, contabilidade para advogados"
        canonical="/"
        pageType="home"
        includeOrganization
        includeLocalBusiness
        faqs={homeFAQs}
        customSchema={[webSiteSchema, siteNavigationSchema]}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroMultiNiche />
          
          <ScrollAnimation>
            <Suspense fallback={<SectionFallback />}>
              <NichesCarousel />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Suspense fallback={<SectionFallback />}>
              <MainServices />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation>
            <Suspense fallback={<SectionFallback />}>
              <CustomerJourney />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation>
            <Suspense fallback={<SectionFallback />}>
              <RoutineCarousel />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation>
            <Suspense fallback={<SectionFallback />}>
              <CitiesSection />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Suspense fallback={<SectionFallback />}>
              <Testimonials />
            </Suspense>
          </ScrollAnimation>

          <ScrollAnimation delay={0.1}>
            <Suspense fallback={<SectionFallback />}>
              <PJCalculatorSection />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Suspense fallback={<SectionFallback />}>
              <Benefits />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Suspense fallback={<SectionFallback />}>
              <FAQ />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation>
            <Suspense fallback={<SectionFallback />}>
              <BlogPreview />
            </Suspense>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Suspense fallback={<SectionFallback />}>
              <FinalCTA />
            </Suspense>
          </ScrollAnimation>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
