import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Linkedin } from 'lucide-react';

export function AuthorBox() {
  return (
    <Card className="my-12 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="pt-6">
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Award className="h-8 w-8 text-primary" />
          </div>
          <div
            itemScope
            itemType="https://schema.org/Person"
            className="flex-1"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-foreground text-lg" itemProp="name">
                Thomas Broek
              </h3>
              <Badge variant="secondary" className="text-xs">
                Autor
              </Badge>
            </div>
            <p
              className="text-sm text-muted-foreground mb-3"
              itemProp="jobTitle"
            >
              Contador Especialista · CRC Ativo
            </p>
            <p
              className="text-sm text-muted-foreground leading-relaxed"
              itemProp="description"
            >
              Contador especializado em tributação para profissionais da saúde, e-commerce e prestadores de serviço, com mais de 15 anos de experiência em planejamento tributário e abertura de empresas. Fundador da Contabilidade Zen.
            </p>
            <div className="mt-3 flex gap-3">
              <a
                href="https://www.linkedin.com/company/contabilidade-zen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                aria-label="LinkedIn da Contabilidade Zen"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/thomasbroek.contador/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                aria-label="Instagram do Thomas Broek"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
