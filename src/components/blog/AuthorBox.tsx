import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Linkedin, Instagram, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthorBox() {
  return (
    <Card className="my-12 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6">
        <div className="flex items-start gap-5">

          {/* Avatar */}
          <Link to="/autor/thomas-broek" aria-label="Ver perfil do autor Thomas Broek">
            <div
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
              aria-hidden="true"
            >
              <span className="text-xl font-bold text-white">TB</span>
            </div>
          </Link>

          {/* Dados do autor com schema Person */}
          <div
            itemScope
            itemType="https://schema.org/Person"
            className="flex-1"
          >
            {/* Schema: URL do autor */}
            <meta itemProp="url" content="https://www.contabilidadezen.com.br/autor/thomas-broek" />
            {/* Schema: credencial CRC */}
            <meta itemProp="hasCredential" content="CRC-SP 337693/O-7" />
            <meta itemProp="worksFor" content="Contabilidade Zen" />

            {/* Nome + badges */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Link to="/autor/thomas-broek">
                <h3
                  className="font-bold text-foreground text-lg hover:text-primary transition-colors"
                  itemProp="name"
                >
                  Thomas Broek
                </h3>
              </Link>
              <Badge variant="secondary" className="text-xs">Autor</Badge>
              <Badge
                variant="outline"
                className="text-xs gap-1 border-primary/30 text-primary"
              >
                <Award className="h-3 w-3" />
                CRC-SP 337693/O-7
              </Badge>
            </div>

            {/* Cargo */}
            <p
              className="text-sm text-muted-foreground mb-3"
              itemProp="jobTitle"
            >
              Contador Especialista em Profissionais de Saúde · Fundador da Contabilidade Zen
            </p>

            {/* Bio */}
            <p
              className="text-sm text-muted-foreground leading-relaxed"
              itemProp="description"
            >
              Contador especializado em tributação para médicos, dentistas e psicólogos PJ. Registro ativo no CRC-SP (337693/O-7). Fundador da Contabilidade Zen, escritório 100% digital focado em planejamento tributário e abertura de empresa para profissionais de saúde.
            </p>

            {/* Links */}
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                to="/autor/thomas-broek"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver perfil completo
              </Link>
              <a
                href="https://www.linkedin.com/company/contabilidade-zen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn da Contabilidade Zen"
                itemProp="sameAs"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/thomasbroek.contador/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram do Thomas Broek"
                itemProp="sameAs"
              >
                <Instagram className="h-3.5 w-3.5" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
