import { Button } from "@/components/ui/button";
import { Globe, TrendingDown, Shield, Clock, ArrowRight } from "lucide-react";
import exportacaoServicosBg from "@/assets/06-exportacao-servicos-bg.webp";
export function ExportacaoServicosHero() {
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#EFF6FF] overflow-hidden">
      <div className="absolute inset-0 opacity-30"><div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#BFDBFE] blur-3xl" /><div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" /></div>
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DBEAFE] border border-[#2563EB]/30"><Globe className="h-4 w-4 text-[#1D4ED8]" /><span className="text-sm font-medium text-[#1D4ED8]">Contabilidade para Exportação de Serviços</span></div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">Exporte serviços e{" "}<span className="text-[#2563EB]">pague menos impostos!</span></h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">Sabia que exportação de serviços pode ter <strong className="text-[#1D4ED8]">isenção de ISS</strong>? Com planejamento correto, sua carga tributária cai drasticamente.</p>
            <p className="text-base text-muted-foreground">Recebimento em dólar/euro, contratos internacionais, câmbio e compliance fiscal.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base font-semibold px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={scrollToForm}>Reduza seus impostos já<ArrowRight className="h-5 w-5 ml-2" /></Button>
              <Button size="lg" variant="outline" className="text-base border-secondary text-secondary hover:bg-secondary/10" onClick={scrollToForm}>Agendar diagnóstico gratuito</Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center"><TrendingDown className="h-6 w-6 text-[#2563EB] mx-auto mb-2" /><p className="text-sm text-muted-foreground">Isenção ISS</p></div>
              <div className="text-center"><Shield className="h-6 w-6 text-secondary mx-auto mb-2" /><p className="text-sm text-muted-foreground">Compliance</p></div>
              <div className="text-center"><Clock className="h-6 w-6 text-[#2563EB] mx-auto mb-2" /><p className="text-sm text-muted-foreground">Câmbio seguro</p></div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2563EB]/20"><img src={exportacaoServicosBg} alt="Profissional trabalhando com exportação de serviços internacionais" width={665} height={735} loading="eager" fetchPriority="high" decoding="async" className="w-full h-[600px] object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#2563EB]/20 to-transparent" /></div>
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card border border-[#2563EB]/30"><p className="text-3xl font-bold text-[#2563EB]">+100</p><p className="text-sm text-muted-foreground">Exportadores atendidos</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
