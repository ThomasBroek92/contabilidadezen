import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Home, MessageCircle, Search } from "lucide-react";
import { getWhatsAppAnchorProps } from "@/lib/whatsapp";

const popularPages = [
  { label: "Serviços", href: "/servicos" },
  { label: "Abrir Empresa", href: "/abrir-empresa" },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
  { label: "Para Médicos", href: "/segmentos/contabilidade-para-medicos" },
  { label: "Para Dentistas", href: "/segmentos/contabilidade-para-dentistas" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const whatsappMessage = (
    `Olá! Encontrei um erro ao acessar a página ${location.pathname} no site.`
  );

  return (
    <>
      <SEOHead
        title="Página não encontrada | Contabilidade Zen"
        description="A página que você procura não foi encontrada. Volte para a página inicial da Contabilidade Zen."
        canonical="https://www.contabilidadezen.com.br/"
        noindex={true}
        nofollow={true}
      />
      
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="text-center max-w-lg">
          {/* Error Code */}
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Página não encontrada
          </h1>
          
          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Voltar para a Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a {...getWhatsAppAnchorProps(whatsappMessage)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>

          {/* Popular Pages */}
          <div className="border-t pt-8">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Search className="h-4 w-4" />
              <span>Páginas populares</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularPages.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
