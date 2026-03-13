import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Calculator, BarChart3, MessageCircle, TrendingUp } from 'lucide-react';
import { getWhatsAppLinkByKey } from '@/lib/whatsapp';
import { supabase } from '@/integrations/supabase/client';

interface PopularPost {
  title: string;
  slug: string;
  views: number | null;
}

export function BlogSidebar() {
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);

  useEffect(() => {
    const fetchPopular = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('title, slug, views')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(5);
      if (data) setPopularPosts(data as PopularPost[]);
    };
    fetchPopular();
  }, []);

  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* Popular Posts */}
        {popularPosts.length > 0 && (
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <h3 className="font-semibold text-sm">Mais Lidos</h3>
              </div>
              <ul className="space-y-2">
                {popularPosts.map((post, i) => (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      <span className="text-secondary font-bold shrink-0">{i + 1}.</span>
                      <span className="line-clamp-2">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Abrir Empresa</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Abra seu CNPJ com suporte completo. Processo 100% digital.
            </p>
            <Button asChild size="sm" className="w-full">
              <Link to="/abrir-empresa">Quero abrir minha empresa</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <Calculator className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold text-sm">Calculadora PJ x CLT</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Descubra quanto você ganha a mais como PJ.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/conteudo/calculadora-pj-clt">Calcular agora</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold text-sm">Comparativo Tributário</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Simples, Lucro Presumido ou Real? Compare os regimes.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/conteudo/comparativo-tributario">Comparar regimes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Fale com um Contador</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Tire suas dúvidas com a equipe da Contabilidade Zen.
            </p>
            <Button asChild variant="zen" size="sm" className="w-full">
              <a
                href={getWhatsAppLinkByKey('default')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
