import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Calculator, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export const CNAECTASection = () => {
  const whatsappLink = getWhatsAppLink(WHATSAPP_MESSAGES.tabelaCnaes);

  return (
    <section className="py-12">
      <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
        <CardContent className="p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Precisa de Ajuda com o Enquadramento?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa equipe especializada pode analisar seu caso e indicar o melhor 
              regime tributário para sua empresa, garantindo economia legal de impostos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Button
              asChild
              variant="zen"
              size="xl"
              className="h-auto py-4 flex-col gap-2"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-6 w-6" />
                <span className="font-semibold">Falar com Especialista</span>
                <span className="text-xs opacity-80">Resposta em até 2h</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="xl"
              className="h-auto py-4 flex-col gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <Link to="/conteudo/calculadora-pj-clt">
                <Calculator className="h-6 w-6" />
                <span className="font-semibold">Calcular Economia</span>
                <span className="text-xs opacity-80">PJ vs CLT</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="xl"
              className="h-auto py-4 flex-col gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <Link to="/abrir-empresa">
                <Building2 className="h-6 w-6" />
                <span className="font-semibold">Abrir Empresa</span>
                <span className="text-xs opacity-80">Grátis + rápido</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
