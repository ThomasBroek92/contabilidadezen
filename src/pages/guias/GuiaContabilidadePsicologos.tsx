import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator, MessageCircle, BookOpen, Brain, FileText, TrendingDown, Building2, Heart, Shield } from "lucide-react";
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://www.contabilidadezen.com.br";

interface RelatedBlogPost {
  title: string;
  slug: string;
  excerpt: string | null;
  read_time_minutes: number | null;
}

const faqs = [
  {
    question: "Psicólogo pode ser MEI em 2026?",
    answer: "Não. Psicólogos não podem ser MEI porque a atividade de psicologia é regulamentada pelo Conselho Federal de Psicologia (CFP) e está vedada ao Microempreendedor Individual. O MEI é restrito a atividades de baixa complexidade regulatória. Para psicólogos, as opções corretas são Sociedade Limitada Unipessoal (SLU), Sociedade Simples ou Sociedade Limitada, conforme o perfil e o número de sócios."
  },
  {
    question: "Qual CNAE usar para psicólogo PJ?",
    answer: "O CNAE principal para psicólogos é o 8650-0/06 (Atividades de psicologia e psicanálise). Esse CNAE é compatível com o Simples Nacional e permite enquadramento no Anexo III, com alíquota inicial de 6% sobre o faturamento. É fundamental que o CNAE seja cadastrado corretamente na prefeitura para garantir a alíquota correta de ISS e evitar recolhimento indevido de impostos."
  },
  {
    question: "Psicólogo PJ pode ser credenciado em planos de saúde?",
    answer: "Sim. Psicólogos PJ podem e devem se credenciar em planos de saúde para ampliar sua base de clientes. O credenciamento é feito junto à operadora com apresentação do CNPJ ativo, alvará de funcionamento, inscrição no CRP (Conselho Regional de Psicologia) e documentação da empresa. O valor repassado pelos planos é emitido como nota fiscal de serviço pela pessoa jurídica, reduzindo a carga tributária."
  },
  {
    question: "Quanto economiza um psicólogo PJ em relação à pessoa física?",
    answer: "A economia varia conforme o faturamento. Um psicólogo que fatura R$ 12.000/mês como pessoa física paga aproximadamente 27,5% de IRPF + 11% de INSS (até o teto), totalizando carga próxima a 38,5%. Como PJ no Simples Nacional Anexo III, a carga cai para cerca de 6% a 10%, dependendo da faixa de faturamento e do pró-labore definido. A economia mensal pode superar R$ 3.000, ou seja, mais de R$ 36.000 por ano."
  },
  {
    question: "O que é o Fator R e como ele impacta o psicólogo PJ?",
    answer: "O Fator R é a relação entre a folha de pagamento (incluindo pró-labore dos sócios) e o faturamento bruto dos últimos 12 meses. Para psicólogos no Simples Nacional, se o Fator R for igual ou superior a 28%, a empresa se enquadra no Anexo III (alíquota inicial 6%). Se for inferior a 28%, cai no Anexo V (alíquota inicial 15,5%). Por isso, o valor do pró-labore deve ser planejado estrategicamente com o contador para manter o Fator R acima de 28%."
  },
  {
    question: "Qual o custo da contabilidade para psicólogos na Contabilidade Zen?",
    answer: "Na Contabilidade Zen, os planos para psicólogos começam a partir de R$ 297,90/mês, incluindo abertura de empresa (quando contratado junto), escrituração contábil e fiscal, emissão de guias de impostos, folha de pró-labore, declarações anuais e suporte via WhatsApp. O investimento mensal em contabilidade especializada é recuperado rapidamente com a economia tributária gerada pelo enquadramento correto como PJ."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Como Abrir Empresa para Psicólogo PJ em 2026: Guia Completo",
  description: "Guia completo para psicólogo abrir empresa PJ em 2026. CNAE, Simples Nacional, credenciamento em planos e economia de impostos.",
  author: {
    "@type": "Person",
    name: "Thomas Broek",
    url: `${SITE_URL}/autor/thomas-broek`,
    sameAs: "https://www.crc.org.br"
  },
  publisher: {
    "@type": "Organization",
    name: "Contabilidade Zen",
    url: SITE_URL
  },
  datePublished: "2026-04-09",
  dateModified: "2026-04-09",
  mainEntityOfPage: `${SITE_URL}/guia-contabilidade-psicologos`
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Contabilidade Zen — Especialistas em Psicólogos PJ",
  description: "Contabilidade especializada para psicólogos e profissionais de saúde mental. Simples Nacional, Fator R e credenciamento em planos.",
  url: `${SITE_URL}/segmentos/contabilidade-para-psicologos`,
  areaServed: "BR",
  serviceType: "Contabilidade para Psicólogos"
};

const tocItems = [
  { id: "por-que-pj", label: "Por que psicólogos devem atuar como PJ?" },
  { id: "tipo-juridico", label: "Qual tipo jurídico escolher?" },
  { id: "cnae-psicologos", label: "CNAE para psicólogos: 8650-0/06" },
  { id: "simples-nacional", label: "Simples Nacional Anexo III e o Fator R" },
  { id: "planos-de-saude", label: "Credenciamento em planos de saúde" },
  { id: "custos-abertura", label: "Custos e passo a passo para abrir empresa" },
  { id: "faq", label: "Perguntas frequentes" },
];

export default function GuiaContabilidadePsicologos() {
  const [blogPosts, setBlogPosts] = useState<RelatedBlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt, read_time_minutes")
        .eq("status", "published")
        .or("category.ilike.%psicólogo%,category.ilike.%psicologo%,category.ilike.%saúde%,category.ilike.%saude%")
        .order("views", { ascending: false })
        .limit(10);
      if (data) setBlogPosts(data as RelatedBlogPost[]);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <SEOHead
        title="Como Abrir Empresa para Psicólogo PJ 2026 | Guia Completo | Contabilidade Zen"
        description="Guia completo para psicólogo abrir empresa PJ em 2026. CNAE 8650-0/06, Simples Nacional Anexo III, Fator R, credenciamento em planos de saúde e economia de impostos."
        keywords="psicólogo pj 2026, contabilidade psicólogo, cnae psicólogo, simples nacional psicólogo, abrir empresa psicólogo, fator r psicólogo"
        canonical="/guia-contabilidade-psicologos"
        pageType="service"
        includeLocalBusiness
        faqs={faqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Guias", url: SITE_URL },
          { name: "Contabilidade para Psicólogos", url: `${SITE_URL}/guia-contabilidade-psicologos` }
        ]}
        customSchema={[faqSchema, articleSchema, professionalServiceSchema]}
      />

      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Guias" },
        { label: "Contabilidade para Psicólogos" }
      ]} />

      <main className="bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-primary">Guia Completo</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Como Abrir Empresa para Psicólogo PJ em 2026: Guia Completo
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              Tudo que psicólogos precisam saber para abrir CNPJ, pagar menos impostos no Simples Nacional
              e se credenciar em planos de saúde como pessoa jurídica. Guia atualizado para 2026 por contadores
              especializados em profissionais de saúde mental.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contato">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Fale com um especialista
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/conteudo/calculadora-pj-clt">
                  <Calculator className="h-5 w-5 mr-2" />
                  Calcular economia
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="py-8 bg-muted/30 border-y border-border" aria-label="Índice do guia">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Neste guia
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tocItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-start gap-2 py-1"
                  >
                    <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        {/* Content */}
        <div className="py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">

              {/* Section 1 — Por que PJ */}
              <section id="por-que-pj" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-primary shrink-0" />
                  Por que psicólogos devem atuar como PJ?
                </h2>
                <p>
                  A psicologia é uma das profissões que mais cresce no Brasil. Segundo dados do{" "}
                  <strong>Conselho Federal de Psicologia (CFP)</strong>, o país já conta com mais de 400 mil psicólogos
                  registrados — e essa base cresce cerca de 15% ao ano. Com a expansão dos atendimentos online e o
                  aumento da demanda por saúde mental pós-pandemia, cada vez mais psicólogos precisam estruturar
                  sua atuação profissional de forma sustentável e fiscalmente eficiente.
                </p>
                <p>
                  Um psicólogo que atua exclusivamente como pessoa física (CPF) está sujeito à tabela progressiva do
                  Imposto de Renda, podendo pagar até <strong>27,5% de IRPF</strong> sobre seus rendimentos, além do INSS
                  sobre o pró-labore como autônomo (carnê-leão). Já como pessoa jurídica no{" "}
                  <strong>Simples Nacional Anexo III</strong>, a alíquota efetiva começa em 6% sobre o faturamento bruto —
                  uma diferença que pode representar mais de R$ 3.000 por mês para quem fatura R$ 12.000 mensais.
                </p>
                <p>
                  Além da economia tributária, atuar como PJ permite ao psicólogo: emitir notas fiscais eletrônicas de
                  serviço (NFS-e), credenciar-se em operadoras de planos de saúde como pessoa jurídica, separar o patrimônio
                  pessoal do profissional, deduzir despesas operacionais como aluguel de consultório, supervisão e materiais,
                  e ter acesso a linhas de crédito empresariais com condições mais favoráveis que o crédito pessoal.
                </p>

                {/* CTA intermediário */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6 not-prose">
                  <p className="text-sm font-medium text-primary mb-2">💡 Simule sua economia agora</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use nossa calculadora para comparar o quanto você pagaria como pessoa física versus psicólogo PJ.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/conteudo/calculadora-pj-clt">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calcular grátis
                    </Link>
                  </Button>
                </div>
              </section>

              {/* Section 2 — Tipo jurídico */}
              <section id="tipo-juridico" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary shrink-0" />
                  Qual tipo jurídico escolher?
                </h2>
                <p>
                  Psicólogos não podem ser MEI — a atividade é regulamentada pelo CFP e está vetada ao Microempreendedor
                  Individual. As opções disponíveis para psicólogos são:
                </p>

                <h3 className="text-xl font-semibold mt-8">Sociedade Limitada Unipessoal (SLU)</h3>
                <p>
                  A SLU é a forma mais comum e recomendada para psicólogos que atuam sozinhos, sem sócios. Permite
                  a abertura de empresa com apenas um titular, oferece proteção patrimonial (separação entre bens
                  pessoais e empresariais) e pode se enquadrar no Simples Nacional. O capital social mínimo é livre,
                  e a responsabilidade do sócio é limitada ao valor do capital integralizado.
                </p>

                <h3 className="text-xl font-semibold mt-8">Sociedade Simples</h3>
                <p>
                  Indicada para psicólogos que atuam em parceria com outros profissionais de saúde (psiquiatras,
                  nutricionistas, etc.) ou que desejam estruturar uma clínica multiprofissional. Na Sociedade Simples,
                  os sócios exercem atividade intelectual regulamentada como objeto da empresa. O registro é feito
                  em Cartório de Registro de Pessoas Jurídicas, não na Junta Comercial.
                </p>

                <h3 className="text-xl font-semibold mt-8">Sociedade Limitada (Ltda.)</h3>
                <p>
                  Para psicólogos que pretendem escalar o negócio, ter múltiplos sócios com participações distintas,
                  ou captar investimento externo. A Ltda. oferece maior flexibilidade societária, mas exige mais
                  formalidades na sua estruturação e alterações contratuais.
                </p>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-sm border-collapse not-prose">
                    <thead>
                      <tr className="bg-primary/10">
                        <th className="text-left p-3 font-semibold text-foreground border border-border">Tipo</th>
                        <th className="text-left p-3 font-semibold text-foreground border border-border">Sócios</th>
                        <th className="text-left p-3 font-semibold text-foreground border border-border">Registro</th>
                        <th className="text-left p-3 font-semibold text-foreground border border-border">Indicado para</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="even:bg-muted/20">
                        <td className="p-3 border border-border text-muted-foreground font-medium">SLU</td>
                        <td className="p-3 border border-border text-muted-foreground">1 sócio</td>
                        <td className="p-3 border border-border text-muted-foreground">Junta Comercial</td>
                        <td className="p-3 border border-border text-muted-foreground">Psicólogo solo</td>
                      </tr>
                      <tr className="even:bg-muted/20">
                        <td className="p-3 border border-border text-muted-foreground font-medium">Soc. Simples</td>
                        <td className="p-3 border border-border text-muted-foreground">2+ sócios profissionais</td>
                        <td className="p-3 border border-border text-muted-foreground">Cartório RCPJ</td>
                        <td className="p-3 border border-border text-muted-foreground">Clínica multiprofissional</td>
                      </tr>
                      <tr className="even:bg-muted/20">
                        <td className="p-3 border border-border text-muted-foreground font-medium">Ltda.</td>
                        <td className="p-3 border border-border text-muted-foreground">2+ sócios</td>
                        <td className="p-3 border border-border text-muted-foreground">Junta Comercial</td>
                        <td className="p-3 border border-border text-muted-foreground">Negócio em expansão</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 3 — CNAE */}
              <section id="cnae-psicologos" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary shrink-0" />
                  CNAE para psicólogos: 8650-0/06
                </h2>
                <p>
                  O CNAE (Classificação Nacional de Atividades Econômicas) correto para psicólogos é o{" "}
                  <strong>8650-0/06 — Atividades de psicologia e psicanálise</strong>. Esse código classifica
                  corretamente a atividade profissional perante a Receita Federal, a prefeitura e o IBGE, e é
                  fundamental para garantir o enquadramento tributário adequado.
                </p>
                <p>
                  A escolha correta do CNAE impacta diretamente em:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Enquadramento no Simples Nacional:</strong> o CNAE 8650-0/06 é compatível com o Simples Nacional
                    e permite acesso ao Anexo III (alíquota inicial de 6%), desde que o Fator R seja respeitado.
                  </li>
                  <li>
                    <strong>Alíquota de ISS:</strong> a prefeitura usa o CNAE para definir a alíquota do Imposto Sobre
                    Serviços (ISS). Psicólogos geralmente têm ISS de 2% a 5%, variando por município.
                  </li>
                  <li>
                    <strong>Credenciamento em planos:</strong> operadoras de saúde consultam o CNAE para credenciar
                    prestadores. O CNAE errado pode bloquear o credenciamento.
                  </li>
                </ul>
                <p className="mt-4">
                  Para psicólogos que também realizam supervisão clínica, consultoria organizacional ou aplicação de
                  testes psicológicos, podem ser adicionados CNAEs secundários como o <strong>7020-4/00</strong>{" "}
                  (Atividades de consultoria em gestão empresarial) ou <strong>8599-6/04</strong> (Treinamento em
                  desenvolvimento profissional e gerencial).
                </p>
              </section>

              {/* Section 4 — Simples Nacional */}
              <section id="simples-nacional" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary shrink-0" />
                  Simples Nacional Anexo III e o Fator R
                </h2>
                <p>
                  O Simples Nacional é o regime tributário mais vantajoso para a maioria dos psicólogos PJ com
                  faturamento anual de até R$ 4,8 milhões. Para psicólogos com CNAE 8650-0/06, o enquadramento
                  pode ocorrer no <strong>Anexo III</strong> ou no <strong>Anexo V</strong>, dependendo do Fator R.
                </p>

                <h3 className="text-xl font-semibold mt-8">O que é o Fator R?</h3>
                <p>
                  O Fator R é o quociente entre a folha de salários (incluindo pró-labore dos sócios, encargos e
                  salários de funcionários) e o faturamento bruto acumulado dos últimos 12 meses. Se o resultado
                  for <strong>igual ou superior a 28%</strong>, a empresa se enquadra no Anexo III. Abaixo disso,
                  cai no Anexo V.
                </p>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm border-collapse not-prose">
                    <thead>
                      <tr className="bg-primary/10">
                        <th className="text-left p-3 font-semibold text-foreground border border-border">Faturamento anual</th>
                        <th className="text-left p-3 font-semibold text-foreground border border-border">Anexo III (Fator R ≥ 28%)</th>
                        <th className="text-left p-3 font-semibold text-foreground border border-border">Anexo V (Fator R &lt; 28%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="even:bg-muted/20">
                        <td className="p-3 border border-border text-muted-foreground">Até R$ 180 mil</td>
                        <td className="p-3 border border-border text-muted-foreground font-medium text-green-700">6,00%</td>
                        <td className="p-3 border border-border text-muted-foreground">15,50%</td>
                      </tr>
                      <tr className="even:bg-muted/20">
                        <td className="p-3 border border-border text-muted-foreground">R$ 180k – R$ 360k</td>
                        <td className="p-3 border border-border text-muted-foreground font-medium text-green-700">11,20%</td>
                        <td className="p-3 border border-border text-muted-foreground">18,00%</td>
                      </tr>
                      <tr className="even:bg-muted/20">
                        <td className="p-3 border border-border text-muted-foreground">R$ 360k – R$ 720k</td>
                        <td className="p-3 border border-border text-muted-foreground font-medium text-green-700">13,50%</td>
                        <td className="p-3 border border-border text-muted-foreground">19,50%</td>
                      </tr>
                      <tr className="even:bg-muted/20">
                        <td className="p-3 border border-border text-muted-foreground">R$ 720k – R$ 1,8M</td>
                        <td className="p-3 border border-border text-muted-foreground font-medium text-green-700">16,00%</td>
                        <td className="p-3 border border-border text-muted-foreground">20,50%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-4">
                  <strong>Exemplo prático:</strong> uma psicóloga que fatura R$ 10.000/mês (R$ 120.000/ano) e
                  define seu pró-labore em R$ 3.000/mês (R$ 36.000/ano) tem Fator R de 30% — acima dos 28%,
                  portanto enquadra no Anexo III com alíquota de 6%. Ela pagará R$ 600/mês em impostos. Como
                  pessoa física, pagaria entre R$ 2.000 e R$ 2.750 mensais — uma economia de mais de R$ 1.400/mês.
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6 not-prose">
                  <p className="text-sm font-medium text-primary mb-2">⚠️ Atenção ao Fator R</p>
                  <p className="text-sm text-muted-foreground">
                    O Fator R é recalculado mensalmente. Um planejamento inadequado do pró-labore pode fazer
                    sua empresa cair no Anexo V sem aviso prévio, aumentando a carga tributária em até 9,5 pontos
                    percentuais. Conte com um contador especializado para monitorar esse indicador continuamente.
                  </p>
                </div>
              </section>

              {/* Section 5 — Planos de saúde */}
              <section id="planos-de-saude" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary shrink-0" />
                  Credenciamento em planos de saúde
                </h2>
                <p>
                  Um dos grandes motivadores para psicólogos abrirem PJ é o <strong>credenciamento em operadoras
                  de planos de saúde</strong>. Muitas operadoras — como Unimed, Bradesco Saúde, SulAmérica e Amil —
                  exigem que o prestador atue como pessoa jurídica para emitir notas fiscais e receber os pagamentos
                  de forma regular.
                </p>
                <p>
                  O processo de credenciamento varia por operadora, mas geralmente inclui:
                </p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>CNPJ ativo com CNAE 8650-0/06:</strong> obrigatório para prestadores de serviços
                    de psicologia.
                  </li>
                  <li>
                    <strong>Inscrição no CRP (Conselho Regional de Psicologia):</strong> tanto a pessoa física quanto
                    a pessoa jurídica devem estar regulares no conselho profissional.
                  </li>
                  <li>
                    <strong>Alvará de funcionamento:</strong> emitido pela prefeitura do município onde os atendimentos
                    são realizados (incluindo consultórios compartilhados ou em regime de home office com CNPJ).
                  </li>
                  <li>
                    <strong>Certificado de Regularidade Fiscal (CRF/CND):</strong> certidões negativas de débitos
                    federais, estaduais e municipais.
                  </li>
                  <li>
                    <strong>Contrato com a operadora:</strong> após aprovação cadastral, a operadora envia o contrato
                    de credenciamento para assinatura.
                  </li>
                </ol>
                <p className="mt-4">
                  Uma vez credenciada como PJ, a psicóloga emite notas fiscais diretamente para a operadora referente
                  às sessões realizadas. O valor recebido entra no faturamento da empresa e é tributado conforme
                  o regime escolhido — em geral, entre 6% e 14,53% dependendo do Simples Nacional ou Lucro Presumido,
                  muito abaixo da tributação como autônoma (CPF).
                </p>
              </section>

              {/* Section 6 — Custos e passo a passo */}
              <section id="custos-abertura" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary shrink-0" />
                  Custos e passo a passo para abrir empresa
                </h2>
                <p>
                  Abrir empresa para psicólogo envolve alguns custos fixos e variáveis que diferem por município.
                  Em média, o processo custa entre <strong>R$ 500 e R$ 1.500</strong> em taxas governamentais, além
                  dos honorários da contabilidade responsável pela abertura.
                </p>

                <h3 className="text-xl font-semibold mt-8">Passo a passo completo</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Diagnóstico tributário e escolha do regime:</strong> análise do faturamento atual e projetado
                    para definir Simples Nacional (Anexo III) ou Lucro Presumido.
                  </li>
                  <li>
                    <strong>Definição do tipo societário:</strong> SLU (solo), Sociedade Simples (com sócios profissionais)
                    ou Ltda. conforme o projeto de atuação.
                  </li>
                  <li>
                    <strong>Elaboração do contrato social:</strong> definição do objeto social, capital social, endereço
                    e responsabilidades dos sócios.
                  </li>
                  <li>
                    <strong>Registro na Junta Comercial ou Cartório:</strong> para SLU e Ltda., registro na Junta;
                    para Sociedade Simples, em Cartório de RCPJ.
                  </li>
                  <li>
                    <strong>Obtenção do CNPJ na Receita Federal:</strong> com os CNAEs corretos e enquadramento tributário.
                  </li>
                  <li>
                    <strong>Inscrição municipal e emissão de alvará:</strong> necessário para emitir NFS-e e credenciar
                    em planos de saúde.
                  </li>
                  <li>
                    <strong>Abertura de conta bancária PJ:</strong> separação das finanças pessoais e empresariais.
                  </li>
                  <li>
                    <strong>Início das obrigações mensais:</strong> emissão de notas fiscais, recolhimento do DAS
                    (Simples Nacional), folha de pró-labore.
                  </li>
                </ol>

                <p className="mt-4">
                  Na{" "}
                  <Link to="/segmentos/contabilidade-para-psicologos" className="text-primary font-medium hover:underline">
                    Contabilidade Zen
                  </Link>
                  , cuidamos de todo o processo de abertura e manutenção contábil para psicólogos. O processo é{" "}
                  <strong>100% digital</strong>, sem necessidade de deslocamento a cartórios ou órgãos públicos,
                  e em média leva de 7 a 15 dias úteis.
                </p>

                {/* CTA final */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-8 mt-8 not-prose text-center">
                  <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Pronto para abrir sua empresa como psicólogo PJ?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Fale agora com um de nossos especialistas em contabilidade para profissionais de saúde mental
                    e descubra quanto você pode economizar em 2026.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button asChild size="lg">
                      <Link to="/contato">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Falar com especialista
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/abrir-empresa">
                        <Building2 className="h-5 w-5 mr-2" />
                        Abrir minha empresa
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>

              {/* Artigos Relacionados */}
              {blogPosts.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary shrink-0" />
                    Artigos relacionados
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
                    {blogPosts.map((post) => (
                      <Link
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className="block border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                      >
                        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        )}
                        {post.read_time_minutes && (
                          <p className="text-xs text-primary mt-2">{post.read_time_minutes} min de leitura</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Links internos satélites */}
              <section className="mb-12 not-prose">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary shrink-0" />
                  Aprofunde seu conhecimento
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { href: "/conteudo/calculadora-pj-clt", label: "Calculadora PJ x CLT" },
                    { href: "/conteudo/tabela-simples-nacional", label: "Tabela do Simples Nacional 2026" },
                    { href: "/segmentos/contabilidade-para-psicologos", label: "Contabilidade para Psicólogos" },
                    { href: "/segmentos/contabilidade-para-medicos", label: "Contabilidade para Médicos" },
                    { href: "/segmentos/contabilidade-para-clinicas-e-consultorios", label: "Contabilidade para Clínicas" },
                    { href: "/abrir-empresa", label: "Abrir Empresa Online" },
                    { href: "/conteudo/comparativo-tributario", label: "Comparativo Tributário" },
                    { href: "/guia-contabilidade-medicos", label: "Guia Completo para Médicos PJ" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5 transition-colors"
                    >
                      <span className="text-primary">→</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary shrink-0" />
                  Perguntas frequentes
                </h2>
                <Accordion type="single" collapsible className="not-prose">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left font-semibold text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
