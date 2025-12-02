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
  );
};

export default Index;
