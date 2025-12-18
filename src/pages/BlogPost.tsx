import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featured_image_url: string | null;
  status: string;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  read_time_minutes: number | null;
  created_at: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  read_time_minutes: number | null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/blog', { replace: true });
        return;
      }

      setPost(data as BlogPost);

      // Fetch related posts
      const { data: related } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, read_time_minutes')
        .eq('status', 'published')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(3);

      setRelatedPosts((related as RelatedPost[]) || []);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.title || 'Blog Contabilidade Zen';

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para a área de transferência.',
      });
    }
  };

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    if (!post) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.meta_description || post.excerpt || post.title,
      datePublished: post.published_at || post.created_at,
      dateModified: post.published_at || post.created_at,
      author: {
        '@type': 'Organization',
        name: 'Contabilidade Zen',
        url: 'https://contabilidadezen.com.br',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Contabilidade Zen',
        logo: {
          '@type': 'ImageObject',
          url: 'https://contabilidadezen.com.br/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': window.location.href,
      },
      keywords: post.meta_keywords?.join(', '),
      articleSection: post.category,
      wordCount: post.content.split(/\s+/).length,
      timeRequired: `PT${post.read_time_minutes || 5}M`,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const structuredData = generateStructuredData();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.meta_title || post.title} | Blog Contabilidade Zen</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.title} />
        {post.meta_keywords && (
          <meta name="keywords" content={post.meta_keywords.join(', ')} />
        )}
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        <meta property="article:section" content={post.category} />
        {post.meta_keywords?.map((keyword, i) => (
          <meta key={i} property="article:tag" content={keyword} />
        ))}
        <link rel="canonical" href={window.location.href} />
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <Header />

      <main>
        {/* Breadcrumb */}
        <nav className="bg-muted/30 py-4" aria-label="Breadcrumb">
          <div className="container mx-auto px-4">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" className="hover:text-foreground transition-colors" itemProp="item">
                  <span itemProp="name">Início</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span>/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/blog" className="hover:text-foreground transition-colors" itemProp="item">
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <span>/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-foreground truncate max-w-xs">
                <span itemProp="name">{post.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </div>
        </nav>

        {/* Article Header */}
        <header className="bg-gradient-hero py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {post.read_time_minutes || 5} min de leitura
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.published_at || post.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-secondary prose-strong:text-foreground"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">{paragraph.slice(2)}</h2>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{paragraph.slice(3)}</h3>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h4 key={index} className="text-lg font-semibold mt-4 mb-2 text-foreground">{paragraph.slice(4)}</h4>;
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                  return (
                    <ul key={index} className="list-disc pl-6 my-4 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-muted-foreground">{item.slice(2)}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d+\. /)) {
                  const items = paragraph.split('\n').filter(line => line.match(/^\d+\. /));
                  return (
                    <ol key={index} className="list-decimal pl-6 my-4 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-muted-foreground">{item.replace(/^\d+\. /, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return <p key={index} className="text-muted-foreground mb-4 leading-relaxed">{paragraph}</p>;
              })}
            </div>

            {/* Tags */}
            {post.meta_keywords && post.meta_keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.meta_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 lg:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Artigos relacionados
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <article
                    key={related.id}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-card transition-all"
                  >
                    <div className="h-2 bg-gradient-to-r from-zen-teal to-zen-blue"></div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <Badge variant="secondary" className="font-medium">
                          {related.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {related.read_time_minutes || 5} min
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                        <Link to={`/blog/${related.slug}`}>
                          {related.title}
                        </Link>
                      </h3>
                      {related.excerpt && (
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {related.excerpt}
                        </p>
                      )}
                      <Link
                        to={`/blog/${related.slug}`}
                        className="inline-flex items-center gap-1 text-secondary font-medium text-sm mt-4 hover:gap-2 transition-all"
                      >
                        Ler mais
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <Button variant="outline" asChild>
              <Link to="/blog" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o Blog
              </Link>
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Quer saber mais sobre contabilidade para profissionais da saúde?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Entre em contato conosco e descubra como podemos ajudar você a pagar menos impostos de forma legal.
            </p>
            <Button variant="zen" size="lg" asChild>
              <Link to="/contato">
                Fale com um especialista
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
