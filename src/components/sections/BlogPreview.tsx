import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const posts = [
  {
    title: "Guia Completo: Como Médico PJ Pode Pagar Menos Impostos Legalmente",
    excerpt: "Descubra as estratégias legais para reduzir sua carga tributária como médico pessoa jurídica, incluindo Fator R, regime tributário e mais.",
    category: "Impostos",
    readTime: "8 min",
    date: "28 Nov 2024",
    slug: "guia-medico-pj-impostos",
  },
  {
    title: "Simples Nacional vs Lucro Presumido: Qual o Melhor para Dentistas?",
    excerpt: "Entenda as diferenças entre os regimes tributários e descubra qual é o mais vantajoso para seu consultório odontológico.",
    category: "Regime Tributário",
    readTime: "6 min",
    date: "25 Nov 2024",
    slug: "simples-lucro-presumido-dentistas",
  },
  {
    title: "5 Erros Fiscais que Profissionais da Saúde Não Podem Cometer",
    excerpt: "Conheça os erros mais comuns que médicos, dentistas e psicólogos cometem e como evitá-los para não ter problemas com o fisco.",
    category: "Dicas",
    readTime: "5 min",
    date: "22 Nov 2024",
    slug: "erros-fiscais-profissionais-saude",
  },
];

export function BlogPreview() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Blog
            </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 text-foreground">
            Artigos que{" "}
            <span className="text-gradient">transformam e empoderam!</span>
          </h2>
          </div>
          <Button variant="zen-outline" asChild>
            <Link to="/blog">
              Ver todos os artigos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-card transition-all duration-300"
            >
              {/* Category Banner */}
              <div className="h-2 bg-gradient-to-r from-zen-teal to-zen-blue"></div>
              
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer */}
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
      </div>
    </section>
  );
}
