import { Button } from "@/components/ui/button";
import { Building2, TrendingDown, Shield, Clock, ArrowRight } from "lucide-react";
import clinicasConsultoriosBg from "@/assets/10-clinicas-consultorios-bg.webp";

export function ClinicasConsultoriosHero() {
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#ECFDF5] overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#D1FAE5] blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D1FAE5] border border-[#059669]/30">
              <Building2 className="h-4 w-4 text-[#047857]" />
              <span className="text-sm font-medium text-[#047857]">Contabilidade para Clínicas e Consultórios</span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
              Sua clínica com{" "}<span className="text-[#059669]">menos impostos e mais lucro!</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Equiparação hospitalar pode reduzir IR e CSLL de <strong className="text-[#047857]">32% para 8%</strong>. Folha de pagamento, convênios e sociedade médica.
            </p>
            <p className="text-base text-muted-foreground">Clínica médica, consultório odontológico, estética ou laboratório — temos a solução certa.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base font-semibold px-8 bg-[#059669] hover:bg-[#047857] text-white" onClick={scrollToForm}>
                Reduza seus impostos já<ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base border-secondary text-secondary hover:bg-secondary/10" onClick={scrollToForm}>
                Diagnóstico gratuito
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center"><TrendingDown className="h-6 w-6 text-[#059669] mx-auto mb-2" /><p className="text-sm text-muted-foreground">Equiparação hospitalar</p></div>
              <div className="text-center"><Shield className="h-6 w-6 text-secondary mx-auto mb-2" /><p className="text-sm text-muted-foreground">Folha completa</p></div>
              <div className="text-center"><Clock className="h-6 w-6 text-[#059669] mx-auto mb-2" /><p className="text-sm text-muted-foreground">Convênios</p></div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#059669]/20">
              <img src={clinicasConsultoriosBg} alt="Clínica médica moderna com equipe de saúde" width={665} height={735} loading="eager" fetchPriority="high" decoding="async" className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#059669]/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-[#059669]/30">
              <p className="text-3xl font-bold text-[#059669]">+150</p>
              <p className="text-sm text-muted-foreground">Clínicas atendidas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
