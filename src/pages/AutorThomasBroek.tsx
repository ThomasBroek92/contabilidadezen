import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, BookOpen, ArrowRight, FileText } from "lucide-react";
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Thomas Broek",
  "hasCredential": "CRC-SP 337693/O-7",
  "url": "https://www.contabilidadezen.com.br/autor/thomas-broek",
  "jobTitle": "Contador",
  "description": "Contador especialista em profissionais da saúde. Fundador da Contabilidade Zen, escritório 100% digital especializado em médicos, dentistas e psicólogos PJ.",
  "worksFor": {
    "@type": "Organization",
    "name": "Contabilidade Zen",
    "url": "https://www.contabilidadezen.com.br"
  },
  "knowsAbout": [
    "Simples Nacional",
    "Lucro Presumido",
    "Planejamento tributário para médicos",
    "Abertura de empresa para profissionais de saúde",
    "Contabilidade digital"
  ]
};

const recentArticles = [
  {
    title: "Como abrir empresa no Simples Nacional em 2026: guia completo para médicos, dentistas e psicólogos",
    slug: "como-abrir-empresa-simples-nacional-2026-medicos-dentistas-psicologos",
    category: "Abertura de Empresa",
    date: "Abril 2026",
  },
  {
    title: "Calculadora de Impostos para Médico PJ 2026: Simples Nacional vs Lucro Presumido",
    slug: "calculadora-impostos-medico-pj-2026-simples-vs-presumido",
    category: "Tributação",
    date: "Abril 2026",
  },
  {
    title: "CNAE para Médicos, Dentistas e Psicólogos: Lista Completa e Atualizada 2026",
    slug: "cnae-medicos-dentistas-psicologos-2026-lista-completa",
    category: "Fiscal",
    date: "Abril 2026",
  },
];

const expertise = [
  "Planejamento tributário para médicos, dentistas e psicólogos PJ",
  "Abertura de empresa e enquadramento no Simples Nacional",
  "Gestão de pró-labore e distribuição de lucros",
  "Obrigações acessórias: eSocial, SPED, EFD-Reinf",
  "Credenciamento em planos de saúde via CNPJ",
  "Contabilidade digital 100% online",
];

export default function AutorThomasBroek() {
  return (
    <>
      <SEOHead
        title="Thomas Broek | CRC-SP 337693/O-7 — Contador Especialista em Saúde"
        description="Thomas Broek, contador CRC-SP 337693/O-7, especialista em médicos, dentistas e psicólogos PJ. Fundador da Contabilidade Zen, escritório digital focado em profissionais de saúde."
        keywords="thomas broek contador, crc-sp 337693, contabilidade para médicos, contabilidade zen autor"
        canonical="/autor/thomas-broek"
        pageType="service"
        ogType="article"
        customSchema={authorSchema}
        breadcrumbs={[
          { name: "Home", url: "https://www.contabilidadezen.com.br" },
          { name: "Blog", url: "https://www.contabilidadezen.com.br/blog" },
          { name: "Thomas Broek", url: "https://www.contabilidadezen.com.br/autor/thomas-broek" },
        ]}
      />
      <Header />

      <main className="min-h-screen bg-background">

        {/* Hero do autor */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-10">

              {/* Avatar / iniciais */}
              <div className="flex-shrink-0">
                <div className="w-36 h-36 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-5xl font-bold text-white">TB</span>
                </div>
              </div>

              {/* Info principal */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-secondary/20 text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    <Award className="w-3.5 h-3.5" />
                    CRC-SP 337693/O-7
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                    Especialista em Saúde
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Thomas Broek
                </h1>
                <p className="text-lg text-muted-foreground mb-2">
                  Contador • Fundador da Contabilidade Zen
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Especialista em tributação para profissionais da saúde. Ajudo médicos, dentistas e psicólogos a abrirem empresa, reduzirem impostos e manterem a contabilidade em dia — tudo 100% digital.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre + Áreas de atuação */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Sobre</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Sou contador registrado no CRC-SP (337693/O-7) e fundador da Contabilidade Zen, escritório digital especializado em profissionais de saúde PJ. Minha atuação é focada em um único nicho — médicos, dentistas e psicólogos — o que nos permite ir fundo nas particularidades tributárias de cada especialidade.
                  </p>
                  <p>
                    Ao longo da minha carreira, percebi que a maioria dos profissionais de saúde paga impostos em excesso por trabalhar como autônomo ou por ter aberto empresa no regime errado. Cada artigo que escrevo neste blog nasce da experiência prática com clientes reais — não são apenas conceitos teóricos.
                  </p>
                  <p>
                    Todo o conteúdo publicado aqui é revisado com base na legislação vigente e atualizado sempre que há mudanças tributárias relevantes para profissionais de saúde.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Áreas de especialização</h2>
                <ul className="space-y-3">
                  {expertise.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-4 bg-muted/50 rounded-xl border">
                  <p className="text-sm font-semibold text-foreground mb-1">Registro profissional</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    CRC-SP 337693/O-7 — Conselho Regional de Contabilidade de São Paulo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Artigos recentes */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Artigos recentes</h2>
            </div>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="group flex items-start gap-4 p-5 bg-background rounded-xl border hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/blog">
                <Button variant="outline">
                  Ver todos os artigos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Quer falar diretamente com o autor?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Se você é médico, dentista ou psicólogo e tem dúvidas sobre abertura de empresa, regime tributário ou planejamento fiscal, posso te ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a {...getWhatsAppAnchorPropsByKey("default")}>
                <Button size="lg" className="w-full sm:w-auto">
                  Falar no WhatsApp
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Link to="/contato">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Solicitar consulta gratuita
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
