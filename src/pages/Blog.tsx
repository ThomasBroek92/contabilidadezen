import { SEOHead } from "@/components/SEOHead";
import { generateBlogListingSchema } from "@/lib/seo-schemas";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  read_time_minutes: number | null;
  published_at: string | null;
  created_at: string;
  etapa_funil: string | null;
}

const categories = [
  "Todos",
  "Impostos",
  "Regime Tributário",
  "Dicas",
  "Abertura de Empresa",
  "Gestão Financeira",
  "Contabilidade",
  "Legislação",
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedFunnel, setSelectedFunnel] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const funnelStages = [
    { value: "Todos", label: "Todos" },
    { value: "topo", label: "📘 Educativo" },
    { value: "meio", label: "🔍 Comparativo" },
    { value: "fundo", label: "🎯 Decisão" },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, read_time_minutes, published_at, created_at, etapa_funil')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts((data as BlogPost[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesFunnel = selectedFunnel === "Todos" || post.etapa_funil === selectedFunnel;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesFunnel && matchesSearch;
  });

  const featuredPost = filteredPosts[0];

  const SITE_URL = "https://www.contabilidadezen.com.br";

  return (
    <>
      <SEOHead
        title="Blog | Dicas de Contabilidade para Saúde"
        description="Blog com dicas de contabilidade, impostos e gestão financeira para médicos, dentistas e profissionais da saúde. Conteúdo especializado e atualizado."
        keywords="blog contabilidade, dicas impostos médicos, contabilidade saúde, tributação PJ, planejamento tributário"
        canonical="/blog"
        pageType="blog"
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` }
        ]}
        customSchema={posts.length > 0 ? generateBlogListingSchema(posts) : undefined}
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog{" "}
              <span className="text-gradient">Contabilidade Zen</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conteúdo especializado sobre contabilidade, impostos e gestão financeira 
              para profissionais da saúde.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredPost && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card transition-all">
                <div className="h-2 bg-gradient-to-r from-zen-teal to-zen-blue"></div>
                <div className="p-8 lg:p-12">
                  <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    ⭐ Destaque
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    <Link to={`/blog/${featuredPost.slug}`} className="hover:text-secondary transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-3xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 flex-wrap">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(featuredPost.published_at || featuredPost.created_at), "dd MMM yyyy", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {featuredPost.read_time_minutes || 5} min
                    </span>
                    <Button variant="zen" size="sm" asChild>
                      <Link to={`/blog/${featuredPost.slug}`}>
                        Ler artigo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter & Search */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredPosts.slice(1).map((post) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-card transition-all"
                >
                  <div className="h-2 bg-gradient-to-r from-zen-teal to-zen-blue"></div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.read_time_minutes || 5} min
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.published_at || post.created_at), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-secondary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Ler mais
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Receba conteúdos exclusivos
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Cadastre-se para receber dicas, novidades e conteúdos exclusivos 
              sobre contabilidade para profissionais da saúde.
            </p>
            <Button variant="zen" size="lg" asChild>
              <Link to="/contato">
                Quero receber novidades
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </>
  );
}
