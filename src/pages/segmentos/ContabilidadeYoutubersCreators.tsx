import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YoutubersCreatorsHero } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsHero";
import { YoutubersCreatorsLeadForm } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsLeadForm";
import { YoutubersCreatorsBenefits } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsBenefits";
import { YoutubersCreatorsProblems } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsProblems";
import { YoutubersCreatorsProcess } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsProcess";
import { YoutubersCreatorsTestimonials } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsTestimonials";
import { YoutubersCreatorsFAQ, youtubersCreatorsFaqs } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsFAQ";
import { YoutubersCreatorsCTA } from "@/components/segmentos/youtubers-creators/YoutubersCreatorsCTA";
import { TaxComparisonCalculator } from "@/components/segmentos/shared/TaxComparisonCalculator";

const SITE_URL = "https://www.contabilidadezen.com.br";

export default function ContabilidadeYoutubersCreators() {
  return (
    <>
      <SEOHead
        title="Contabilidade para YouTubers e Creators | AdSense, Publis e Streaming"
        description="Contabilidade especializada para YouTubers, streamers e criadores de conteúdo. Reduza impostos do AdSense de 27,5% para 6%. CNPJ, NF para marcas e direitos autorais."
        keywords="contabilidade para youtubers, contabilidade criadores de conteúdo, contabilidade streamer, impostos adsense, CNPJ influenciador"
        canonical="/segmentos/contabilidade-para-youtubers-e-creators"
        pageType="service"
        includeLocalBusiness
        faqs={youtubersCreatorsFaqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Segmentos", url: SITE_URL },
          { name: "YouTubers e Creators", url: `${SITE_URL}/segmentos/contabilidade-para-youtubers-e-creators` },
        ]}
      />
      <Header />
      <main>
        <YoutubersCreatorsHero />
        <YoutubersCreatorsLeadForm />
        <TaxComparisonCalculator profession="youtuber/creator" accentColor="#EF4444" />
        <YoutubersCreatorsBenefits />
        <YoutubersCreatorsProblems />
        <YoutubersCreatorsProcess />
        <YoutubersCreatorsTestimonials />
        <YoutubersCreatorsFAQ />
        <YoutubersCreatorsCTA />
      </main>
      <Footer />
    </>
  );
}
