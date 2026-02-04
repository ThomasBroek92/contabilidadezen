import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import logoFull from "@/assets/logo-full.webp";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <img 
              src={logoFull} 
              alt="Contabilidade Zen" 
              className="h-12 w-auto brightness-0 invert" 
              width={240}
              height={48}
              loading="lazy"
              decoding="async"
            />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Mais de 100 profissionais e empresas em todo Brasil já reduziram sua carga tributária 
              com nossa contabilidade digital nichada. 100% online, 0% burocracia.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.linkedin.com/company/contabilidade-zen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/thomasbroek.contador/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Soluções */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Soluções</h3>
            <ul className="space-y-3">
              {[
                { name: "Para Médicos", href: "/segmentos/contabilidade-para-medicos" },
                { name: "Para Dentistas", href: "/segmentos/contabilidade-para-dentistas" },
                { name: "Para Psicólogos", href: "/segmentos/contabilidade-para-psicologos" },
                { name: "Para Representantes", href: "/segmentos/contabilidade-para-representantes-comerciais" },
                { name: "Todos os Serviços", href: "/servicos" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conteúdos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Conteúdos</h3>
            <ul className="space-y-3">
              {[
                { name: "Blog", href: "/blog" },
                { name: "Calculadora PJ x CLT", href: "/conteudo/calculadora-pj-clt" },
                { name: "Gerador de RPA", href: "/conteudo/gerador-rpa" },
                { name: "Gerador de Invoice", href: "/conteudo/gerador-invoice" },
                { name: "Modelo de Contrato PJ", href: "/conteudo/modelo-contrato-pj" },
                { name: "Tabela CNAEs", href: "/conteudo/tabela-simples-nacional" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
            <ul className="space-y-3">
              {[
                { name: "Sobre Nós", href: "/sobre" },
                { name: "Abrir Empresa", href: "/abrir-empresa" },
                { name: "Indique e Ganhe", href: "/indique-e-ganhe" },
                { name: "Contato", href: "/contato" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-secondary" />
                <div>
                  <p className="text-sm text-primary-foreground/80">Telefone</p>
                  <a href="tel:+5519974158342" className="hover:text-secondary transition-colors">
                    (19) 97415-8342
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-secondary" />
                <div>
                  <p className="text-sm text-primary-foreground/80">E-mail</p>
                  <a href="mailto:contato@contabilidadezen.com.br" className="hover:text-secondary transition-colors">
                    contato@contabilidadezen.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-secondary" />
                <div>
                  <p className="text-sm text-primary-foreground/80">Endereço</p>
                  <p>São Paulo, SP</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Info */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="text-center mb-6">
            <p className="text-sm text-primary-foreground/70">
              <strong>Contabilidade Zen</strong> — Contabilidade digital em todo o Brasil
            </p>
            <p className="text-xs text-primary-foreground/50 mt-2">
              CNPJ: 46.466.747/0001-30 • Responsável Técnico: CRC-SP 337693/O-7
            </p>
          </div>
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Contabilidade Zen. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/politica-de-privacidade" className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
