import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <img src={logoFull} alt="Contabilidade Zen" className="h-12 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Contabilidade especializada para profissionais da saúde. 
              Você cuida da saúde dos seus pacientes, nós cuidamos da saúde financeira do seu negócio.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              {[
                { name: "Para Médicos", href: "/medicos" },
                { name: "Para Dentistas", href: "/servicos" },
                { name: "Para Psicólogos", href: "/servicos" },
                { name: "Abertura de Empresa", href: "/servicos" },
                { name: "Blog", href: "/blog" },
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

          {/* Serviços */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Serviços</h3>
            <ul className="space-y-3">
              {[
                "Contabilidade Mensal",
                "Planejamento Tributário",
                "Abertura de CNPJ",
                "Migração de Contabilidade",
                "Consultoria Fiscal",
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/servicos"
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {service}
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
                  <a href="tel:+5511999999999" className="hover:text-secondary transition-colors">
                    (11) 99999-9999
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

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Contabilidade Zen. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/privacidade" className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
