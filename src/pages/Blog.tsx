import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const categories = [
  "Todos",
  "Impostos",
  "Regime Tributário",
  "Dicas",
  "Abertura de Empresa",
  "Gestão Financeira",
];

const posts = [
  {
    title: "Guia Completo: Como Médico PJ Pode Pagar Menos Impostos Legalmente",
    excerpt: "Descubra as estratégias legais para reduzir sua carga tributária como médico pessoa jurídica, incluindo Fator R, regime tributário e planejamento fiscal completo.",
    category: "Impostos",
    readTime: "8 min",
    date: "28 Nov 2024",
    slug: "guia-medico-pj-impostos",
    featured: true,
  },
  {
    title: "Simples Nacional vs Lucro Presumido: Qual o Melhor para Dentistas?",
    excerpt: "Entenda as diferenças entre os regimes tributários e descubra qual é o mais vantajoso para seu consultório odontológico baseado no seu faturamento.",
    category: "Regime Tributário",
    readTime: "6 min",
    date: "25 Nov 2024",
    slug: "simples-lucro-presumido-dentistas",
    featured: false,
  },
  {
    title: "5 Erros Fiscais que Profissionais da Saúde Não Podem Cometer",
    excerpt: "Conheça os erros mais comuns que médicos, dentistas e psicólogos cometem e como evitá-los para não ter problemas com o fisco.",
    category: "Dicas",
    readTime: "5 min",
    date: "22 Nov 2024",
    slug: "erros-fiscais-profissionais-saude",
    featured: false,
  },
  {
    title: "O que é Fator R e Como Ele Pode Reduzir Seus Impostos",
    excerpt: "Entenda o conceito de Fator R, como ele funciona no Simples Nacional e como otimizá-lo para pagar apenas 6% de impostos.",
    category: "Impostos",
    readTime: "7 min",
    date: "18 Nov 2024",
    slug: "fator-r-reducao-impostos",
    featured: false,
  },
  {
    title: "Passo a Passo: Como Abrir Empresa Médica em 2024",
    excerpt: "Tutorial completo para abrir sua empresa médica, desde a escolha do tipo societário até o registro no CRM.",
    category: "Abertura de Empresa",
    readTime: "10 min",
    date: "15 Nov 2024",
    slug: "como-abrir-empresa-medica",
    featured: false,
  },
  {
    title: "Gestão Financeira para Clínicas: O Guia Definitivo",
    excerpt: "Aprenda a organizar as finanças da sua clínica, controlar custos e aumentar a lucratividade do seu negócio na área da saúde.",
    category: "Gestão Financeira",
    readTime: "12 min",
    date: "12 Nov 2024",
    slug: "gestao-financeira-clinicas",
    featured: false,
  },
  {
    title: "DMED: Tudo que Médicos Precisam Saber Sobre Esta Declaração",
    excerpt: "Guia completo sobre a Declaração de Serviços Médicos (DMED), quem deve entregar, prazos e como evitar multas.",
    category: "Impostos",
    readTime: "6 min",
    date: "8 Nov 2024",
    slug: "dmed-declaracao-servicos-medicos",
    featured: false,
  },
  {
    title: "Psicólogo PJ: Vale a Pena Abrir Empresa?",
    excerpt: "Análise completa para psicólogos sobre quando vale a pena abrir uma empresa e quanto podem economizar em impostos.",
    category: "Abertura de Empresa",
    readTime: "7 min",
    date: "5 Nov 2024",
    slug: "psicologo-pj-abrir-empresa",
    featured: false,
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find((p) => p.featured);

  return (
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
        {featuredPost && (
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
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
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
              {filteredPosts.filter(p => !p.featured).map((post, index) => (
                <article
                  key={index}
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
                        {post.readTime}
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
                        {post.date}
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

            {filteredPosts.length === 0 && (
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
  );
}
