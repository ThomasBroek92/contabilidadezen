import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar } from "lucide-react";
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";

export function YoutubersCreatorsCTA() {
  const scrollToForm = () => { document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-[#DC2626] to-[#EF4444] relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-secondary blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">Crie conteúdo sem se preocupar com impostos!</h2>
          <p className="text-xl text-white/90 mb-4">A Contabilidade Zen cuida de tudo para você focar no que ama.</p>
          <p className="text-lg text-white/75 mb-8 max-w-2xl mx-auto">AdSense, publis, contratos com marcas e direitos autorais — tudo resolvido por especialistas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base font-semibold px-8 bg-white text-[#DC2626] hover:bg-white/90" onClick={scrollToForm}><Calendar className="h-5 w-5 mr-2" />Agendar reunião</Button>
            <Button size="lg" variant="outline" className="text-base border-white/40 text-white hover:bg-white/10" asChild><a {...getWhatsAppAnchorPropsByKey("youtubersCreators")}><MessageCircle className="h-5 w-5 mr-2" />Falar no WhatsApp</a></Button>
          </div>
          <p className="text-sm text-white/50 mt-8">Consulta gratuita e sem compromisso.</p>
        </div>
      </div>
    </section>
  );
}
