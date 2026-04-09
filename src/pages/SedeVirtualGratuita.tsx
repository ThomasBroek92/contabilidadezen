import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VisualBreadcrumb } from "@/components/VisualBreadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, CheckCircle, Building2, MessageCircle, FileText, Shield, Clock, Zap } from "lucide-react";
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";

const SITE_URL = "https://www.contabilidadezen.com.br";

const faqs = [
  {
    question: "O que é endereço fiscal gratuito?",
    answer: "Endereço fiscal gratuito é um endereço comercial fornecido pela contabilidade que você pode usar como domicílio tributário do seu CNPJ, sem pagar mensalidade separada pelo serviço. Na Contabilidade Zen, o endereço fiscal em São Paulo está incluído nos planos de contabilidade, sem custo adicional."
  },
  {
    question: "Posso usar o endereço fiscal para abrir meu CNPJ?",
    answer: "Sim. O endereço fiscal pode ser usado como sede da empresa para fins cadastrais na Receita Federal, na prefeitura (inscrição municipal) e nos contratos com clientes. É a solução ideal para profissionais que trabalham em casa ou em consultórios compartilhados e precisam de um endereço comercial regularizado."
  },
  {
    question: "Qual a diferença entre endereço fiscal e sede virtual?",
    answer: "O endereço fiscal é o domicílio tributário da empresa — usado para CNPJ, alvará e correspondências oficiais da Receita Federal e prefeitura. A sede virtual é o serviço mais amplo que inclui endereço fiscal + recebimento de correspondências + sala de reunião eventual. Na Contabilidade Zen, o endereço fiscal já está incluso nos planos de contabilidade."
  },
  {
    question: "Preciso ir pessoalmente ao endereço para receber correspondências?",
    answer: "Não. Todas as correspondências recebidas no endereço fiscal são digitalizadas e encaminhadas a você por e-mail ou WhatsApp. Você nunca precisa comparecer fisicamente ao local para receber documentos da Receita Federal, prefeitura ou outros órgãos."
  },
  {
    question: "O endereço fiscal é aceito pela prefeitura para emissão de alvará?",
    answer: "Sim, desde que a atividade não exija espaço físico específico (como clínicas ou laboratórios). Para profissionais que prestam serviços de forma remota ou em domicílio do cliente — como psicólogos online, desenvolvedores, consultores e representantes — o endereço fiscal é plenamente aceito para emissão do alvará de funcionamento e inscrição municipal."
  },
  {
    question: "Quais profissões podem usar endereço fiscal gratuito?",
    answer: "Praticamente qualquer profissional que preste serviços remotamente ou no endereço do cliente: psicólogos (atendimento online), desenvolvedores, consultores, representantes comerciais, contadores, advogados, produtores digitais, gestores de tráfego, youtubers e criadores de conteúdo, nutricionistas com atendimento remoto, entre outros."
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

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Endereço Fiscal Gratuito em São Paulo",
  description: "Endereço fiscal para MEI e PJ em São Paulo incluso nos planos de contabilidade da Contabilidade Zen. Receba correspondências sem mensalidade adicional.",
  provider: {
    "@type": "AccountingService",
    name: "Contabilidade Zen",
    url: SITE_URL
  },
  areaServed: {
    "@type": "City",
    name: "São Paulo"
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    description: "Incluso nos planos de contabilidade a partir de R$ 297,90/mês"
  }
};

const beneficios = [
  {
    icon: MapPin,
    titulo: "Endereço em São Paulo",
    descricao: "Endereço comercial na cidade de São Paulo, aceito pela Receita Federal e pela maioria das prefeituras para registro de CNPJ e alvará."
  },
  {
    icon: FileText,
    titulo: "Correspondências digitalizadas",
    descricao: "Cartas da Receita Federal, prefeitura e outros órgãos recebidas, digitalizadas e enviadas para você por WhatsApp ou e-mail."
  },
  {
    icon: Shield,
    titulo: "Regularidade fiscal garantida",
    descricao: "Endereço aceito para inscrição municipal, abertura de CNPJ e emissão de notas fiscais. Sem risco de irregularidade cadastral."
  },
  {
    icon: Zap,
    titulo: "Sem burocracia adicional",
    descricao: "Incluso nos planos de contabilidade. Não é um serviço avulso — você não paga mensalidade separada pelo endereço fiscal."
  },
  {
    icon: Clock,
    titulo: "Ativação em 24 horas",
    descricao: "Após assinar o plano de contabilidade, o endereço fiscal já está disponível para uso no mesmo dia útil."
  },
  {
    icon: Building2,
    titulo: "Válido para empresa nova ou migração",
    descricao: "Use para abrir sua empresa do zero ou para migrar o endereço de uma empresa já existente para São Paulo."
  }
];

export default function SedeVirtualGratuita() {
  return (
    <>
      <SEOHead
        title="Endereço Fiscal Gratuito em São Paulo | Contabilidade Zen"
        description="Endereço fiscal gratuito para MEI e PJ em São Paulo. Receba correspondências da Receita Federal, abra seu CNPJ e emita notas fiscais com sede virtual regularizada. Incluso nos planos de contabilidade."
        keywords="endereço fiscal gratuito, sede virtual gratuita, endereço virtual para cnpj, endereço fiscal são paulo, sede virtual são paulo, domicílio fiscal gratuito"
        canonical="/sede-virtual-gratuita"
        pageType="service"
        includeLocalBusiness
        faqs={faqs}
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Serviços", url: SITE_URL },
          { name: "Endereço Fiscal Gratuito", url: `${SITE_URL}/sede-virtual-gratuita` }
        ]}
        customSchema={[faqSchema, serviceSchema]}
      />

      <Header />
      <VisualBreadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Serviços" },
        { label: "Endereço Fiscal Gratuito" }
      ]} />

      <main className="bg-background">

        {/* Hero */}
        <section className="py-16 lg:py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-primary">Incluso nos planos de contabilidade</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Endereço Fiscal Gratuito em São Paulo para CNPJ
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              Use um endereço comercial em São Paulo para registrar seu CNPJ, emitir notas fiscais e
              receber correspondências da Receita Federal — sem pagar mensalidade adicional. Incluso
              nos planos de contabilidade da Contabilidade Zen.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {["Aceito pela Receita Federal", "Aceito na maioria das prefeituras", "Correspondências por WhatsApp", "Sem mensalidade extra"].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contato">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Quero meu endereço fiscal
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/abrir-empresa">
                  <Building2 className="h-5 w-5 mr-2" />
                  Abrir empresa com endereço incluso
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* O que inclui */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                O que está incluso no endereço fiscal gratuito
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Não é um serviço separado com contrato extra. O endereço fiscal faz parte da sua
                contabilidade na Contabilidade Zen, sem custo adicional.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {beneficios.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.titulo} className="bg-background rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{b.titulo}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.descricao}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Para quem é */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Para quem é o endereço fiscal gratuito?
            </h2>
            <p className="text-muted-foreground mb-8">
              Ideal para profissionais que prestam serviços remotamente ou no endereço do cliente e não
              têm (ou não querem pagar por) um espaço comercial próprio:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Psicólogos e terapeutas online",
                "Desenvolvedores e profissionais de TI",
                "Representantes comerciais",
                "Produtores digitais e influencers",
                "Consultores e coaches",
                "Gestores de tráfego e social media",
                "Nutricionistas com atendimento remoto",
                "Advogados e profissionais liberais",
                "Contadores e financeiros autônomos",
                "Arquitetos e designers remotos",
                "Youtubers e criadores de conteúdo",
                "Outros prestadores de serviço PJ",
              ].map(item => (
                <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Como funciona na prática
            </h2>
            <ol className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Contrate um plano de contabilidade",
                  desc: "O endereço fiscal está incluso em todos os planos da Contabilidade Zen, a partir de R$ 297,90/mês. Não é necessário contratar nenhum serviço adicional."
                },
                {
                  step: "02",
                  title: "Use o endereço no seu CNPJ",
                  desc: "Após a contratação, você recebe o endereço completo para usar no registro da empresa na Junta Comercial, Receita Federal, prefeitura e nos seus contratos com clientes."
                },
                {
                  step: "03",
                  title: "Receba correspondências por WhatsApp",
                  desc: "Todas as correspondências chegadas ao endereço — cartas da Receita Federal, intimações, avisos de prefeitura — são fotografadas e enviadas para você no mesmo dia via WhatsApp ou e-mail."
                },
                {
                  step: "04",
                  title: "Emita notas fiscais sem preocupação",
                  desc: "Com o endereço regularizado e a inscrição municipal ativa, você emite NFS-e (nota fiscal de serviço eletrônica) normalmente, sem risco de bloqueio por endereço irregular."
                }
              ].map(item => (
                <li key={item.step} className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-10">
              <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Endereço fiscal + contabilidade completa
              </h2>
              <p className="text-muted-foreground mb-6">
                A partir de R$ 297,90/mês você tem contabilidade especializada, endereço fiscal em São Paulo
                e suporte via WhatsApp. Sem taxa de adesão, sem fidelidade mínima.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/contato">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Falar com especialista
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/abrir-empresa">
                    Ver planos e preços
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Perguntas frequentes sobre endereço fiscal
            </h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Links internos */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">Veja também</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/abrir-empresa", label: "Abrir Empresa Online" },
                { href: "/segmentos/contabilidade-para-psicologos", label: "Contabilidade para Psicólogos" },
                { href: "/segmentos/contabilidade-para-profissionais-de-ti", label: "Contabilidade para TI" },
                { href: "/segmentos/contabilidade-para-representantes-comerciais", label: "Contabilidade para Representantes" },
                { href: "/segmentos/contabilidade-para-produtores-digitais", label: "Contabilidade para Produtores Digitais" },
                { href: "/conteudo/calculadora-pj-clt", label: "Calculadora PJ x CLT" },
              ].map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-primary hover:underline px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
