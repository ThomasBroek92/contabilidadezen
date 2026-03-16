import { SEOHead } from "@/components/SEOHead";
import { generateBlogListingSchema } from "@/lib/seo-schemas";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Loader2, TrendingUp, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
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
  views: number | null;
  featured_image_url: string | null;
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

const POSTS_PER_PAGE = 12;
const SITE_URL = "https://www.contabilidadezen.com.br";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedFunnel, setSelectedFunnel] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") || searchParams.get("search") || "");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const funnelStages = [
    { value: "Todos", label: "Todos" },
    { value: "topo", label: "📘 Educativo" },
    { value: "meio", label: "🔍 Comparativo" },
    { value: "fundo", label: "🎯 Decisão" },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  // Sync search param from URL on mount
  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("search") || "";
    if (q && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, read_time_minutes, published_at, created_at, etapa_funil, views, featured_image_url')
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
  const remainingPosts = filteredPosts.slice(1);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(remainingPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedPosts = remainingPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    setSearchParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.delete("page");
    setSearchParams(params, { replace: true });
  };

  // Pagination SEO links
  const canonicalBase = `${SITE_URL}/blog`;
  const currentCanonical = safePage > 1 ? `${canonicalBase}?page=${safePage}` : canonicalBase;
  const prevPageUrl = safePage > 1 ? (safePage === 2 ? canonicalBase : `${canonicalBase}?page=${safePage - 1}`) : undefined;
  const nextPageUrl = safePage < totalPages ? `${canonicalBase}?page=${safePage + 1}` : undefined;

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("ellipsis");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  }, [safePage, totalPages]);

  return (
    <>
      <SEOHead
        title="Blog | Dicas de Contabilidade para Saúde"
        description="Blog com dicas de contabilidade, impostos e gestão financeira para médicos, dentistas e profissionais da saúde. Conteúdo especializado e atualizado."
        keywords="blog contabilidade, dicas impostos médicos, contabilidade saúde, tributação PJ, planejamento tributário"
        canonical={currentCanonical}
        pageType="blog"
        prevPageUrl={prevPageUrl}
        nextPageUrl={nextPageUrl}
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
        ) : featuredPost && safePage === 1 && (
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

        {/* Popular Posts - Mais Lidos */}
        {!loading && posts.length > 3 && safePage === 1 && (() => {
          const popularPosts = [...posts]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 4)
            .filter(p => (p.views || 0) > 0);
          
          if (popularPosts.length === 0) return null;
          
          return (
            <section className="py-10 bg-muted/20">
              <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Mais Lidos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group flex gap-3 p-4 bg-card rounded-xl border border-border hover:border-secondary/50 hover:shadow-card transition-all"
                    >
                      <span className="text-3xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Eye className="h-3 w-3" />
                          {post.views || 0} views
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* Filter & Search */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start">
            <div className="flex flex-col gap-4">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      goToPage(1);
                    }}
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

              {/* Funnel Stage Filter */}
              <div className="flex flex-wrap gap-2">
                {funnelStages.map((stage) => (
                  <button
                    key={stage.value}
                    onClick={() => {
                      setSelectedFunnel(stage.value);
                      goToPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selectedFunnel === stage.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

              {/* Search */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-card transition-all"
                >
                  {post.featured_image_url ? (
                    <Link to={`/blog/${post.slug}`}>
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-44 object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                  ) : (
                    <div className="h-2 bg-gradient-to-r from-zen-teal to-zen-blue" />
                  )}
                  
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

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Paginação do blog">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage <= 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-all"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {pageNumbers.map((page, i) =>
                  page === "ellipsis" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      aria-current={page === safePage ? "page" : undefined}
                      className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all ${
                        page === safePage
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-all"
                  aria-label="Próxima página"
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
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
