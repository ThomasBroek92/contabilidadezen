import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoFull from "@/assets/logo-full.png";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Serviços", href: "/servicos" },
  { name: "Blog", href: "/blog" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
];

const segmentosLinks = [
  { name: "Contabilidade para Médicos", href: "/segmentos/contabilidade-para-medicos" },
];

const conteudoLinks = [
  { name: "Calculadora Salário PJ x CLT", href: "/conteudo/calculadora-pj-clt" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSegmentosOpen, setIsSegmentosOpen] = useState(false);
  const [isConteudoOpen, setIsConteudoOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;
  const isSegmentoActive = () => segmentosLinks.some(link => location.pathname === link.href);
  const isConteudoActive = () => conteudoLinks.some(link => location.pathname === link.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoFull} alt="Contabilidade Zen" className="h-10 lg:h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.slice(0, 2).map((link) => (
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
          
          {/* Segmentos Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-secondary ${
                  isSegmentoActive() ? "text-secondary" : "text-foreground/80"
                }`}
              >
                Segmentos
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-card border-border">
              {segmentosLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    to={link.href}
                    className={`w-full cursor-pointer ${
                      isActive(link.href) ? "text-secondary" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Conteúdo Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-secondary ${
                  isConteudoActive() ? "text-secondary" : "text-foreground/80"
                }`}
              >
                Conteúdo
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-card border-border">
              {conteudoLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    to={link.href}
                    className={`w-full cursor-pointer ${
                      isActive(link.href) ? "text-secondary" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {navLinks.slice(2).map((link) => (
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
          <Button variant="hero" size="sm" asChild>
            <Link to="/abrir-empresa">Abrir Empresa Grátis</Link>
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
            {navLinks.slice(0, 2).map((link) => (
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
            
            {/* Mobile Segmentos Accordion */}
            <div className="border-t border-border pt-2">
              <button
                onClick={() => setIsSegmentosOpen(!isSegmentosOpen)}
                className={`flex items-center justify-between w-full text-base font-medium py-2 transition-colors ${
                  isSegmentoActive() ? "text-secondary" : "text-foreground/80"
                }`}
              >
                Segmentos
                <ChevronDown className={`h-4 w-4 transition-transform ${isSegmentosOpen ? "rotate-180" : ""}`} />
              </button>
              {isSegmentosOpen && (
                <div className="pl-4 space-y-2 pb-2">
                  {segmentosLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`block text-sm py-2 transition-colors ${
                        isActive(link.href) ? "text-secondary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Conteúdo Accordion */}
            <div className="border-t border-border pt-2">
              <button
                onClick={() => setIsConteudoOpen(!isConteudoOpen)}
                className={`flex items-center justify-between w-full text-base font-medium py-2 transition-colors ${
                  isConteudoActive() ? "text-secondary" : "text-foreground/80"
                }`}
              >
                Conteúdo
                <ChevronDown className={`h-4 w-4 transition-transform ${isConteudoOpen ? "rotate-180" : ""}`} />
              </button>
              {isConteudoOpen && (
                <div className="pl-4 space-y-2 pb-2">
                  {conteudoLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`block text-sm py-2 transition-colors ${
                        isActive(link.href) ? "text-secondary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {navLinks.slice(2).map((link) => (
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
              <Button variant="hero" asChild>
                <Link to="/abrir-empresa">Abrir Empresa Grátis</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
