import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingDown, Shield, Clock, ArrowRight } from "lucide-react";
import ecommerceBg from "@/assets/09-ecommerce-bg.webp";

export function EcommerceHero() {
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FDF2F8] overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#FCE7F3] blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FCE7F3] border border-[#DB2777]/30">
              <ShoppingCart className="h-4 w-4 text-[#BE185D]" />
              <span className="text-sm font-medium text-[#BE185D]">Contabilidade para E-commerce</span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
              Venda mais e pague{" "}<span className="text-[#DB2777]">menos impostos!</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Contabilidade especializada em e-commerce: Mercado Livre, Shopee, Amazon, Magalu e Shopify. Controle fiscal de <strong className="text-[#BE185D]">estoque, CMV e ICMS-ST</strong>.
            </p>
            <p className="text-base text-muted-foreground">Dropshipping, marketplace ou loja própria — temos a solução certa para seu negócio.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base font-semibold px-8 bg-[#DB2777] hover:bg-[#BE185D] text-white" onClick={scrollToForm}>
                Reduza seus impostos já<ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base border-secondary text-secondary hover:bg-secondary/10" onClick={scrollToForm}>
                Diagnóstico gratuito
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center"><TrendingDown className="h-6 w-6 text-[#DB2777] mx-auto mb-2" /><p className="text-sm text-muted-foreground">Menos impostos</p></div>
              <div className="text-center"><Shield className="h-6 w-6 text-secondary mx-auto mb-2" /><p className="text-sm text-muted-foreground">ICMS-ST correto</p></div>
              <div className="text-center"><Clock className="h-6 w-6 text-[#DB2777] mx-auto mb-2" /><p className="text-sm text-muted-foreground">CMV automatizado</p></div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#DB2777]/20">
              <img src={ecommerceBg} alt="Profissional de e-commerce gerenciando loja online" width={665} height={735} loading="eager" fetchPriority="high" decoding="async" className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#DB2777]/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-[#DB2777]/30">
              <p className="text-3xl font-bold text-[#DB2777]">+200</p>
              <p className="text-sm text-muted-foreground">Lojas atendidas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
