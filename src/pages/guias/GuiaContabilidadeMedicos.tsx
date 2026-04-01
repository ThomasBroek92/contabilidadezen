import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator, MessageCircle, BookOpen, Stethoscope, FileText, TrendingDown, Building2 } from "lucide-react";
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
    question: "Médico PJ paga menos imposto que pessoa física?",
    answer: "Sim. Um médico que fatura R$ 25.000/mês como pessoa física pode pagar até 27,5% de IRPF. Atuando como PJ no Lucro Presumido, a carga tributária efetiva pode ficar entre 11% e 14%, gerando economia de até 50% em impostos. O regime ideal depende do faturamento, despesas dedutíveis e estrutura societária."
  },
  {
    question: "Qual o melhor regime tributário para médicos: Simples Nacional ou Lucro Presumido?",
    answer: "Depende do faturamento. Para médicos que faturam até R$ 15.000/mês, o Simples Nacional no Anexo III (alíquota inicial de 6%) costuma ser mais vantajoso. Acima disso, o Lucro Presumido com alíquota efetiva entre 11,33% e 14,53% tende a ser mais econômico. Uma análise tributária personalizada é essencial para definir o melhor enquadramento."
  },
  {
    question: "Médico pode ter CNPJ e trabalhar em hospital ao mesmo tempo?",
    answer: "Sim. Médicos podem manter CNPJ ativo e prestar serviços para hospitais, clínicas e operadoras de saúde como pessoa jurídica. Muitos hospitais inclusive preferem contratar médicos PJ. É importante que o contrato de prestação de serviços esteja bem estruturado para evitar caracterização de vínculo empregatício."
  },
  {
    question: "Quais CNAEs são indicados para médicos PJ?",
    answer: "Os CNAEs mais utilizados por médicos são: 8630-5/03 (Atividade médica ambulatorial restrita a consultas), 8630-5/04 (Atividade odontológica — para dentistas), e 8630-5/99 (Atividades de atenção ambulatorial não especificadas). O CNAE correto impacta diretamente no enquadramento tributário e na alíquota do ISS municipal."
  },
  {
    question: "Quanto custa a contabilidade para médicos?",
    answer: "Na Contabilidade Zen, os planos para médicos começam a partir de R$ 297,90/mês, incluindo escrituração contábil e fiscal, emissão de guias de impostos, declaração de IRPJ, folha de pagamento (pró-labore) e suporte via WhatsApp. O valor exato depende do regime tributário, número de sócios e volume de notas fiscais."
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
  headline: "Guia Completo de Contabilidade para Médicos PJ em 2026",
  description: "Tudo que médicos precisam saber sobre tributação, abertura de CNPJ, regimes tributários e economia fiscal. Guia atualizado para 2026.",
  author: {
    "@type": "Organization",
    name: "Contabilidade Zen",
    url: SITE_URL
  },
  publisher: {
    "@type": "Organization",
    name: "Contabilidade Zen",
    url: SITE_URL
  },
  datePublished: "2025-01-15",
  dateModified: new Date().toISOString().split("T")[0],
  mainEntityOfPage: `${SITE_URL}/guia-contabilidade-medicos`
};

const tocItems = [
  { id: "por-que-medico-pj", label: "Por que médicos devem atuar como PJ?" },
  { id: "regimes-tributarios", label: "Regimes tributários para médicos" },
  { id: "como-abrir-cnpj-medico", label: "Como abrir CNPJ médico" },
  { id: "calculadora", label: "Calculadora PJ x CLT" },
  { id: "erros-comuns", label: "Erros comuns na tributação médica" },
  { id: "artigos-relacionados", label: "Artigos relacionados" },
  { id: "faq", label: "Perguntas frequentes" },
];

export default function GuiaContabilidadeMedicos() {
  const [blogPosts, setBlogPosts] = useState<RelatedBlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt, read_time_minutes")
        .eq("status", "published")
        .or("category.ilike.%médico%,category.ilike.%medico%,category.ilike.%saúde%,category.ilike.%saude%")
        .order("views", { ascending: false })
        .limit(10);
      if (data) setBlogPosts(data as RelatedBlogPost[]);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <SEOHead
        title="Guia Completo de Contabilidade para Médicos PJ 2026 | Contabilidade Zen"
        description="Tudo sobre contabilidade para médicos: abertura de CNPJ, Simples Nacional vs Lucro Presumido, economia de até 50% em impostos. Guia atualizado 2026."
        keywords="contabilidade para médicos, médico PJ, CNPJ médico, tributação médica, Simples Nacional médico, Lucro Presumido médico"
        canonical="/guia-contabilidade-medicos"
        pageType="article"
        includeLocalBusiness
        faqs={faqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Guias", url: SITE_URL },
          { name: "Contabilidade para Médicos", url: `${SITE_URL}/guia-contabilidade-medicos` }
        ]}
        customSchema={[faqSchema, articleSchema]}
      />

      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Guias" },
        { label: "Contabilidade para Médicos" }
      ]} />

      <main className="bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-primary">Guia Completo</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Contabilidade para Médicos PJ: Guia Completo 2026
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              Tudo que você precisa saber sobre tributação, abertura de CNPJ, regimes tributários e como economizar
              até 50% em impostos atuando como pessoa jurídica. Guia elaborado por contadores especializados na área da saúde.
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

              {/* Section 1 */}
              <section id="por-que-medico-pj" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-primary shrink-0" />
                  Por que médicos devem atuar como PJ?
                </h2>
                <p>
                  A tributação sobre a renda de profissionais da saúde no Brasil é uma das mais altas do mundo. Um médico
                  que atua exclusivamente como pessoa física pode pagar até <strong>27,5% de Imposto de Renda</strong> sobre seus
                  rendimentos, além de contribuições previdenciárias que chegam ao teto do INSS. Em contrapartida, a atuação
                  como pessoa jurídica permite acessar regimes tributários significativamente mais econômicos.
                </p>
                <p>
                  De acordo com dados do <strong>Conselho Federal de Medicina (CFM)</strong>, o Brasil conta com mais de 550 mil médicos
                  ativos. Destes, estima-se que mais de 60% já atuam total ou parcialmente como pessoa jurídica — uma tendência
                  que se intensificou nos últimos anos com a crescente demanda de hospitais e operadoras por contratação PJ.
                </p>
                <p>
                  A economia tributária pode chegar a <strong>50% ou mais</strong> dependendo do faturamento, regime tributário escolhido e
                  estrutura societária. Por exemplo, um cardiologista com faturamento mensal de R$ 30.000 como pessoa física pagaria
                  aproximadamente R$ 7.500 em impostos. Como PJ no Lucro Presumido, esse valor pode cair para cerca de R$ 3.600 — uma
                  economia de R$ 3.900 por mês, ou <strong>R$ 46.800 por ano</strong>.
                </p>
                <p>
                  Além da economia fiscal, atuar como PJ oferece outros benefícios: possibilidade de deduzir despesas operacionais
                  (aluguel de consultório, equipamentos, materiais), acesso a linhas de crédito empresariais com juros menores,
                  separação entre patrimônio pessoal e empresarial, e maior profissionalismo na relação com contratantes.
                </p>
              </section>

              {/* Section 2 */}
              <section id="regimes-tributarios" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary shrink-0" />
                  Regimes tributários para médicos
                </h2>
                <p>
                  A escolha do regime tributário é a decisão fiscal mais importante para um médico PJ. Os três regimes disponíveis —
                  Simples Nacional, Lucro Presumido e Lucro Real — possuem características distintas que impactam diretamente
                  no valor dos impostos pagos mensalmente.
                </p>

                <h3 className="text-xl font-semibold mt-8">Simples Nacional (Anexo III ou V)</h3>
                <p>
                  O Simples Nacional é indicado para médicos com faturamento anual de até R$ 4,8 milhões. No Anexo III, a alíquota
                  inicial é de <strong>6% sobre o faturamento bruto</strong>, podendo chegar a 33% nas faixas superiores. Para se enquadrar
                  no Anexo III (mais vantajoso), a folha de pagamento (incluindo pró-labore) deve representar pelo menos 28% do
                  faturamento bruto — conhecido como <strong>Fator R</strong>.
                </p>
                <p>
                  Se o Fator R for inferior a 28%, a empresa médica cai no Anexo V, com alíquota inicial de 15,5%.
                  Por isso, o planejamento do pró-labore é fundamental para manter o enquadramento no Anexo III.
                </p>

                <h3 className="text-xl font-semibold mt-8">Lucro Presumido</h3>
                <p>
                  O Lucro Presumido é o regime mais utilizado por médicos com faturamento entre R$ 15.000 e R$ 80.000 mensais.
                  A carga tributária efetiva fica entre <strong>11,33% e 14,53%</strong>, dependendo da alíquota de ISS do município.
                  A base de cálculo do IRPJ e CSLL é presumida em 32% do faturamento para serviços médicos, o que resulta
                  em tributação menor do que a real na maioria dos casos.
                </p>

                <h3 className="text-xl font-semibold mt-8">Lucro Real</h3>
                <p>
                  Indicado apenas para clínicas com faturamento elevado e despesas operacionais significativas.
                  Exige escrituração contábil completa e apuração detalhada de receitas e despesas. Para a maioria
                  dos médicos que atuam como consultórios individuais ou sociedades limitadas, o Lucro Real não é a
                  melhor opção.
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6">
                  <p className="text-sm font-medium text-primary mb-2">💡 Dica da Contabilidade Zen</p>
                  <p className="text-sm">
                    Não existe regime tributário "melhor" de forma absoluta. A escolha ideal depende do seu faturamento mensal,
                    estrutura de despesas e número de sócios. Use nossa{" "}
                    <Link to="/conteudo/calculadora-pj-clt" className="text-primary font-medium hover:underline">
                      Calculadora PJ x CLT
                    </Link>{" "}
                    para uma estimativa inicial e solicite um <strong>diagnóstico tributário gratuito</strong> para uma análise completa.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="como-abrir-cnpj-medico" className="mb-12">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary shrink-0" />
                  Como abrir CNPJ médico
                </h2>
                <p>
                  O processo de abertura de CNPJ para médicos segue etapas bem definidas e pode ser concluído
                  em <strong>5 a 15 dias úteis</strong> quando conduzido por uma contabilidade especializada:
                </p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Diagnóstico tributário:</strong> análise do faturamento atual, despesas e definição do regime tributário
                    ideal (Simples Nacional ou Lucro Presumido).
                  </li>
                  <li>
                    <strong>Escolha do tipo societário:</strong> Sociedade Limitada Unipessoal (SLU), Sociedade Simples ou
                    Sociedade Empresária, conforme o perfil e objetivos do médico.
                  </li>
                  <li>
                    <strong>Registro na Junta Comercial ou Cartório:</strong> elaboração do contrato social e registro
                    nos órgãos competentes.
                  </li>
                  <li>
                    <strong>Inscrição na Receita Federal (CNPJ):</strong> obtenção do CNPJ com os CNAEs adequados
                    para atividade médica.
                  </li>
                  <li>
                    <strong>Inscrição Municipal e Alvará:</strong> registro na prefeitura para emissão de notas fiscais
                    e obtenção do alvará de funcionamento.
                  </li>
                  <li>
                    <strong>Registro no CRM-PJ:</strong> inscrição da pessoa jurídica no Conselho Regional de Medicina,
                    obrigatória para exercício da medicina como empresa.
                  </li>
                </ol>
                <p className="mt-4">
                  Na <Link to="/segmentos/contabilidade-para-medicos" className="text-primary font-medium hover:underline">
                  Contabilidade Zen</Link>, cuidamos de todo o processo de abertura de empresa para médicos, desde o diagnóstico
                  tributário até a emissão da primeira nota fiscal. O processo é <strong>100% digital</strong> — sem necessidade
                  de deslocamento a cartórios ou órgãos públicos.
                </p>
              </section>

              {/* Calculator Embed */}
              <section id="calculadora" className="mb-12">
                <h2 className="text-2xl font-bold">Calculadora PJ x CLT para Médicos</h2>
                <p>
                  Descubra quanto você pode economizar atuando como médico PJ. Nossa calculadora compara
                  a carga tributária como pessoa física (CLT) e pessoa jurídica nos regimes Simples Nacional
                  e Lucro Presumido.
                </p>
                <div className="bg-muted/30 border border-border rounded-xl p-8 text-center mt-6">
                  <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Calculadora PJ x CLT 2026</h3>
                  <p className="text-muted-foreground mb-6">
                    Compare sua renda líquida como CLT e como PJ. Resultado instantâneo.
                  </p>
                  <Button asChild size="lg">
                    <Link to="/conteudo/calculadora-pj-clt">
                      <Calculator className="h-5 w-5 mr-2" />
                      Acessar Calculadora
                    </Link>
                  </Button>
                </div>
              </section>

              {/* Section 5 */}
              <section id="erros-comuns" className="mb-12">
                <h2 className="text-2xl font-bold">Erros comuns na tributação médica</h2>
                <p>
                  Mesmo médicos que já atuam como PJ frequentemente cometem erros tributários que resultam em
                  pagamento excessivo de impostos ou em riscos fiscais. Os mais comuns são:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Pró-labore inadequado:</strong> definir um pró-labore muito baixo pode levar ao
                    desenquadramento do Anexo III do Simples Nacional (Fator R). Um pró-labore muito alto
                    aumenta a contribuição previdenciária sem necessidade.
                  </li>
                  <li>
                    <strong>CNAE incorreto:</strong> utilizar CNAEs genéricos pode resultar em alíquotas maiores
                    de ISS e até impedimentos para optar pelo Simples Nacional.
                  </li>
                  <li>
                    <strong>Não separar contas pessoais e empresariais:</strong> misturar finanças pessoais com
                    as da empresa dificulta o controle financeiro e pode gerar problemas na fiscalização.
                  </li>
                  <li>
                    <strong>Ignorar o planejamento tributário anual:</strong> as faixas do Simples Nacional são
                    progressivas e acumulativas. Sem revisão anual, o médico pode estar pagando mais do que deveria.
                  </li>
                  <li>
                    <strong>Não emitir todas as notas fiscais:</strong> além de ser uma obrigação legal, a emissão
                    correta de NFs é essencial para comprovar faturamento e acessar crédito empresarial.
                  </li>
                </ul>
              </section>

              {/* Related Blog Posts */}
              {blogPosts.length > 0 && (
                <section id="artigos-relacionados" className="mb-12">
                  <h2 className="text-2xl font-bold">Artigos sobre contabilidade médica</h2>
                  <p>
                    Confira nossos artigos mais recentes sobre tributação, gestão financeira e planejamento
                    para profissionais da saúde:
                  </p>
                  <ul className="space-y-3 mt-4 not-prose">
                    {blogPosts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors group"
                        >
                          <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {post.title}
                            </span>
                            {post.excerpt && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* FAQ */}
              <section id="faq" className="mb-12">
                <h2 className="text-2xl font-bold">Perguntas frequentes sobre contabilidade para médicos</h2>
              </section>
            </article>

            {/* FAQ Accordion (outside prose for better styling) */}
            <Accordion type="single" collapsible className="mb-12">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-foreground font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* CTA Final */}
            <section className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
                Fale com um contador especialista em médicos
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                Agende um diagnóstico tributário gratuito e descubra quanto você pode economizar.
                Atendimento 100% digital, sem burocracia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/contato">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Fale com um especialista
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <a {...getWhatsAppAnchorPropsByKey("medicos")}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp direto
                  </a>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
