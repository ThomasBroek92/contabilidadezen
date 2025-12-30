import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Loader2, Quote, BarChart2, ExternalLink, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { BlogCTASection } from '@/components/blog/BlogCTASection';

interface ExpertQuote {
  quote: string;
  author: string;
  title: string;
  source_url?: string;
}

interface Statistic {
  value: string;
  description: string;
  source: string;
  source_url?: string;
  year?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogPostData {
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
  geo_score: number | null;
  expert_quotes: ExpertQuote[] | null;
  statistics: Statistic[] | null;
  authority_citations: string[] | null;
  faq_schema: { mainEntity: FAQItem[] } | null;
  freshness_date: string | null;
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
  const [post, setPost] = useState<BlogPostData | null>(null);
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

      setPost(data as unknown as BlogPostData);

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

  // Generate JSON-LD structured data for SEO (Article + FAQPage)
  const generateStructuredData = () => {
    if (!post) return null;

    const schemas: object[] = [];

    // Article Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.meta_description || post.excerpt || post.title,
      datePublished: post.published_at || post.created_at,
      dateModified: post.freshness_date || post.published_at || post.created_at,
      author: {
        '@type': 'Organization',
        name: 'Contabilidade Zona Sul',
        url: 'https://contabilidadezonasul.com.br',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Contabilidade Zona Sul',
        logo: {
          '@type': 'ImageObject',
          url: 'https://contabilidadezonasul.com.br/logo.png',
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
    });

    // FAQPage Schema (if FAQ data exists)
    if (post.faq_schema?.mainEntity && post.faq_schema.mainEntity.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq_schema.mainEntity.map((item: FAQItem) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }

    return schemas;
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
  const expertQuotes = post.expert_quotes || [];
  const statistics = post.statistics || [];
  const authorityCitations = post.authority_citations || [];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.meta_title || post.title} | Blog Contabilidade Zona Sul</title>
        <meta name="description" content={post.meta_description || post.excerpt || post.title} />
        {post.meta_keywords && (
          <meta name="keywords" content={post.meta_keywords.join(', ')} />
        )}
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        <meta property="article:modified_time" content={post.freshness_date || post.published_at || post.created_at} />
        <meta property="article:section" content={post.category} />
        {post.meta_keywords?.map((keyword, i) => (
          <meta key={i} property="article:tag" content={keyword} />
        ))}
        <link rel="canonical" href={window.location.href} />
        {structuredData && structuredData.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
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
              {post.geo_score && post.geo_score >= 80 && (
                <Badge variant="outline" className="gap-1 text-green-600 border-green-500/30">
                  <BarChart2 className="h-3 w-3" />
                  GEO {post.geo_score}
                </Badge>
              )}
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
                {post.freshness_date && (
                  <span className="flex items-center gap-2 text-primary">
                    <RefreshCw className="h-4 w-4" />
                    Atualizado em {format(new Date(post.freshness_date), "MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </header>

        {/* Key Statistics Highlight (GEO-friendly) */}
        {statistics.length > 0 && (
          <section className="py-8 bg-primary/5 border-y border-primary/10">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Dados em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statistics.slice(0, 3).map((stat, index) => (
                  <Card key={index} className="bg-background/50 border-primary/20">
                    <CardContent className="pt-4">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {stat.source} {stat.year && `(${stat.year})`}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <article className="py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <MarkdownRenderer content={post.content} />

            {/* Mid-Content CTA */}
            <BlogCTASection position="mid" postTitle={post.title} />

            {/* Expert Quotes Section (GEO-friendly) */}
            {expertQuotes.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Quote className="h-5 w-5 text-primary" />
                  O que dizem os especialistas
                </h3>
                <div className="space-y-6">
                  {expertQuotes.map((quote, index) => (
                    <blockquote 
                      key={index}
                      className="border-l-4 border-primary pl-6 py-4 bg-muted/30 rounded-r-lg"
                      itemScope 
                      itemType="https://schema.org/Quotation"
                    >
                      <p 
                        className="text-lg italic text-foreground mb-3"
                        itemProp="text"
                      >
                        "{quote.quote}"
                      </p>
                      <footer className="flex items-center gap-2">
                        <cite 
                          className="text-sm font-medium text-foreground not-italic"
                          itemProp="author"
                          itemScope
                          itemType="https://schema.org/Person"
                        >
                          <span itemProp="name">{quote.author}</span>
                        </cite>
                        <span className="text-muted-foreground">—</span>
                        <span className="text-sm text-muted-foreground">{quote.title}</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            )}

            {/* Sources Section (GEO-friendly) */}
            {authorityCitations.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Fontes e Referências
                </h3>
                <ul className="space-y-2 text-sm">
                  {authorityCitations.map((citation, index) => (
                    <li key={index} className="text-muted-foreground hover:text-foreground transition-colors">
                      <a 
                        href={citation} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-start gap-2"
                      >
                        <span className="text-primary">{index + 1}.</span>
                        <span className="break-all">{citation}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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

            {/* Freshness Footer (GEO-friendly) */}
            <div className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Última atualização:</strong>{' '}
                {format(new Date(post.freshness_date || post.published_at || post.created_at), "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Revisado por: <strong>Equipe Contabilidade Zona Sul</strong>
              </p>
            </div>

            {/* End-Content CTA */}
            <BlogCTASection position="end" postTitle={post.title} />
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
