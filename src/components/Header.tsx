import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoFull from "@/assets/logo-full.png";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Para Médicos", href: "/medicos" },
  { name: "Serviços", href: "/servicos" },
  { name: "Blog", href: "/blog" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoFull} alt="Contabilidade Zen" className="h-10 lg:h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                isActive(link.href) ? "text-secondary" : "text-foreground/80"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="whatsapp" size="sm" asChild>
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre contabilidade para profissionais da saúde."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button variant="zen" size="sm" asChild>
            <Link to="/contato">Fale Conosco</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-base font-medium py-2 transition-colors ${
                  isActive(link.href) ? "text-secondary" : "text-foreground/80"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button variant="whatsapp" asChild>
                <a
                  href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre contabilidade para profissionais da saúde."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="zen" asChild>
                <Link to="/contato">Agendar Consulta Gratuita</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
