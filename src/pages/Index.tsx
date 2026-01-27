import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroMultiNiche } from "@/components/sections/HeroMultiNiche";
import { NichesCarousel } from "@/components/sections/NichesCarousel";
import { MainServices } from "@/components/sections/MainServices";
import { CustomerJourney } from "@/components/sections/CustomerJourney";
import { RoutineCarousel } from "@/components/sections/RoutineCarousel";
import { CitiesSection } from "@/components/sections/CitiesSection";
import { Benefits } from "@/components/sections/Benefits";
import { WhySpecialized } from "@/components/sections/WhySpecialized";
import { Testimonials } from "@/components/sections/Testimonials";
import { PJCalculatorSection } from "@/components/sections/PJCalculatorSection";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { homeFAQs } from "@/lib/seo-schemas";

const Index = () => {
  return <>
      <SEOHead
        title="Contabilidade Zen - Contabilidade Especializada para Profissionais e Empresas | Economize até 50% em Impostos"
        description="Contabilidade digital nichada para médicos, advogados, TI, produtores digitais, e-commerce e mais. Reduza seus impostos legalmente em até 50%. 100% online."
        keywords="contabilidade para médicos, contabilidade para advogados, contabilidade para TI, contabilidade para produtores digitais, contabilidade para e-commerce, contabilidade online, abertura de empresa, planejamento tributário"
        canonical="/"
        pageType="home"
        includeOrganization
        includeLocalBusiness
        faqs={homeFAQs}
      />
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
          
          <ScrollAnimation>
            <CitiesSection />
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.1}>
            <Testimonials />
          </ScrollAnimation>

          <ScrollAnimation delay={0.1}>
            <PJCalculatorSection />
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
            <FinalCTA />
          </ScrollAnimation>
        </main>
        <Footer />
      </div>
    </>;
};
export default Index;