import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  MessageCircle, 
  ChevronDown, 
  Gift, 
  MapPin, 
  Phone, 
  Mail, 
  Search,
  User,
  Instagram,
  Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import logoFull from "@/assets/logo-full.webp";
import { getWhatsAppLink, WHATSAPP_MESSAGES, WHATSAPP_NUMBER } from "@/lib/whatsapp";

// Navigation links configuration
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Abrir Empresa", href: "/abrir-empresa" },
];

const solucoesLinks = [
  { name: "Contabilidade para Médicos", href: "/segmentos/contabilidade-para-medicos" },
  { name: "Contabilidade para Dentistas", href: "/segmentos/contabilidade-para-dentistas" },
  { name: "Contabilidade para Psicólogos", href: "/segmentos/contabilidade-para-psicologos" },
  { name: "Contabilidade para Representantes Comerciais", href: "/segmentos/contabilidade-para-representantes-comerciais" },
  { name: "Todos os Serviços", href: "/servicos" },
];

const conteudoLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Calculadora PJ x CLT", href: "/conteudo/calculadora-pj-clt" },
  { name: "Gerador de RPA", href: "/conteudo/gerador-rpa" },
  { name: "Gerador de Invoice/Fatura", href: "/conteudo/gerador-invoice" },
  { name: "Modelo de Contrato PJ", href: "/conteudo/modelo-contrato-pj" },
  { name: "Tabela CNAEs Simples Nacional", href: "/conteudo/tabela-simples-nacional" },
];

// Contact info
const contactInfo = {
  address: "Rua Aster, 324 - Jardim das Tulipas, Holambra - SP",
  addressLink: "https://maps.google.com/?q=Rua+Aster+324+Jardim+das+Tulipas+Holambra+SP+13827-072",
  phone: "(19) 97415-8342",
  phoneLink: "tel:+5519974158342",
  email: "contato@contabilidadezen.com.br",
  emailLink: "mailto:contato@contabilidadezen.com.br",
};

// Social links
const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/thomasbroek.contador/" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/contabilidade-zen" },
  { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/${WHATSAPP_NUMBER}` },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolucoesOpen, setIsSolucoesOpen] = useState(false);
  const [isConteudoOpen, setIsConteudoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;
  const isSolucoesActive = () => solucoesLinks.some(link => location.pathname === link.href);
  const isConteudoActive = () => conteudoLinks.some(link => location.pathname === link.href);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to blog with search query
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Pre-header - Top bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs">
            {/* Left side - Contact info */}
            <div className="flex items-center gap-6">
              <a 
                href={contactInfo.addressLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{contactInfo.address}</span>
              </a>
              <a 
                href={contactInfo.phoneLink}
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{contactInfo.phone}</span>
              </a>
              <a 
                href={contactInfo.emailLink}
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{contactInfo.email}</span>
              </a>
            </div>

            {/* Right side - Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="hover:text-secondary transition-colors p-1"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img 
              src={logoFull} 
              alt="Contabilidade Zen" 
              className="h-10 lg:h-12 w-auto" 
              width={1920} 
              height={388} 
              loading="eager" 
              decoding="async" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {/* Home and Abrir Empresa */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary font-bold" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Soluções Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    isSolucoesActive() ? "text-primary font-bold" : "text-foreground/80"
                  }`}
                >
                  Soluções
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-card border-border z-[60]">
                {solucoesLinks.map((link) => (
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

            {/* Conteúdos Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    isConteudoActive() ? "text-primary font-bold" : "text-foreground/80"
                  }`}
                >
                  Conteúdos
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-card border-border z-[60]">
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

            {/* Contato */}
            <Link
              to="/contato"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contato") ? "text-primary font-bold" : "text-foreground/80"
              }`}
            >
              Contato
            </Link>
          </nav>

          {/* Desktop CTA Area */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* Search Button */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground/70 hover:text-secondary"
                  aria-label="Buscar"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Pesquisar no site</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="flex gap-2 mt-4">
                  <Input
                    placeholder="O que você procura?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" variant="secondary">
                    Buscar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Indique e Ganhe */}
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="border-primary text-primary hover:bg-secondary hover:text-secondary-foreground"
            >
              <Link to="/indique-e-ganhe">
                <Gift className="h-4 w-4 mr-1" />
                <span className="hidden xl:inline">Indique e Ganhe</span>
                <span className="xl:hidden">Indique</span>
              </Link>
            </Button>

            {/* Área do Cliente */}
            <Button 
              variant="default" 
              size="sm" 
              asChild
              className="bg-primary hover:bg-primary/90"
            >
              <a 
                href="https://app.contabilidadezen.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="hidden xl:inline">Área do Cliente</span>
                <span className="xl:hidden">Cliente</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-foreground" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background animate-slide-up max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {/* Search on mobile */}
              <form onSubmit={handleSearch} className="flex gap-2 pb-4 border-b border-border">
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Main nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-medium py-3 transition-colors ${
                    isActive(link.href) ? "text-secondary" : "text-foreground/80"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Soluções Accordion */}
              <div className="border-t border-border pt-2">
                <button
                  onClick={() => setIsSolucoesOpen(!isSolucoesOpen)}
                  className={`flex items-center justify-between w-full text-base font-medium py-3 transition-colors ${
                    isSolucoesActive() ? "text-secondary" : "text-foreground/80"
                  }`}
                >
                  Soluções
                  <ChevronDown className={`h-4 w-4 transition-transform ${isSolucoesOpen ? "rotate-180" : ""}`} />
                </button>
                {isSolucoesOpen && (
                  <div className="pl-4 space-y-1 pb-2">
                    {solucoesLinks.map((link) => (
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

              {/* Mobile Conteúdos Accordion */}
              <div className="border-t border-border pt-2">
                <button
                  onClick={() => setIsConteudoOpen(!isConteudoOpen)}
                  className={`flex items-center justify-between w-full text-base font-medium py-3 transition-colors ${
                    isConteudoActive() ? "text-secondary" : "text-foreground/80"
                  }`}
                >
                  Conteúdos
                  <ChevronDown className={`h-4 w-4 transition-transform ${isConteudoOpen ? "rotate-180" : ""}`} />
                </button>
                {isConteudoOpen && (
                  <div className="pl-4 space-y-1 pb-2">
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

              {/* Contato */}
              <Link
                to="/contato"
                className={`text-base font-medium py-3 border-t border-border transition-colors ${
                  isActive("/contato") ? "text-secondary" : "text-foreground/80"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>

              {/* Mobile CTAs */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button variant="outline" asChild className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Link to="/indique-e-ganhe" onClick={() => setIsMenuOpen(false)}>
                    <Gift className="h-4 w-4 mr-2" />
                    Indique e Ganhe
                  </Link>
                </Button>
                <Button variant="whatsapp" asChild>
                  <a 
                    href={getWhatsAppLink(WHATSAPP_MESSAGES.default)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Fale no WhatsApp
                  </a>
                </Button>
                <Button variant="default" asChild className="bg-primary hover:bg-primary/90">
                  <a 
                    href="https://app.contabilidadezen.com.br" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Área do Cliente
                  </a>
                </Button>
              </div>

              {/* Mobile contact info */}
              <div className="flex flex-col gap-2 pt-4 border-t border-border text-sm text-muted-foreground">
                <a 
                  href={contactInfo.phoneLink}
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {contactInfo.phone}
                </a>
                <a 
                  href={contactInfo.emailLink}
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {contactInfo.email}
                </a>
              </div>

              {/* Mobile social links */}
              <div className="flex items-center gap-4 pt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
