import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { useHoneypot } from "@/hooks/use-honeypot";
import { toast } from "sonner";
import {
  MapPin,
  MessageCircle,
  Users,
  Award,
  Star,
  Building2,
  Laptop,
  TrendingDown,
  Clock,
  Shield,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";

// Lazy load de componentes pesados
const CustomerJourney = lazy(() =>
  import("@/components/sections/CustomerJourney").then((m) => ({ default: m.CustomerJourney }))
);
const RoutineCarousel = lazy(() =>
  import("@/components/sections/RoutineCarousel").then((m) => ({ default: m.RoutineCarousel }))
);
const Testimonials = lazy(() =>
  import("@/components/sections/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const PJCalculatorSection = lazy(() =>
  import("@/components/sections/PJCalculatorSection").then((m) => ({ default: m.PJCalculatorSection }))
);

// Fallback minimalista para Suspense
const SectionFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
  </div>
);

// FAQ específico para Campinas
const campinasXFAQs = [
  {
    question: "Vocês atendem presencialmente em Campinas?",
    answer:
      "Nosso atendimento é 100% digital, via WhatsApp, e-mail e videoconferência. Você não precisa se deslocar para nenhum escritório. Nosso foco é agilidade e praticidade para profissionais e empresas de Campinas e região.",
  },
  {
    question: "Como funciona a abertura de empresa em Campinas?",
    answer:
      "Cuidamos de todo o processo: análise de viabilidade na prefeitura de Campinas, registro na Junta Comercial, CNPJ, Inscrição Municipal e alvarás necessários. Prazo médio de 5 a 10 dias úteis, dependendo do tipo de atividade.",
  },
  {
    question: "A sede virtual é em Campinas?",
    answer:
      "Nossa sede virtual gratuita está localizada em Holambra (RMC). Para endereço comercial em Campinas, temos opções com parceiros locais (custo adicional). Consulte-nos para mais detalhes.",
  },
  {
    question: "Qual o custo da contabilidade para empresas em Campinas?",
    answer:
      "Planos a partir de R$ 297,90/mês com contabilidade completa, planejamento tributário e suporte dedicado. Fazemos uma análise personalizada para sua empresa e indicamos o melhor plano.",
  },
  {
    question: "Posso migrar minha contabilidade de outro escritório em Campinas?",
    answer:
      "Sim! A migração é 100% gratuita. Cuidamos de toda a comunicação com seu contador atual e fazemos a transição sem interromper suas operações. O processo leva em média 15 dias.",
  },
  {
    question: "Atendem empresas do Simples Nacional em Campinas?",
    answer:
      "Sim, atendemos Simples Nacional, Lucro Presumido e Lucro Real. Fazemos análise completa para indicar o melhor regime tributário para sua empresa em Campinas.",
  },
];

// Benefícios locais
const localBenefits = [
  {
    icon: MapPin,
    title: "Foco na RMC",
    description: "Especialistas na região de Campinas",
  },
  {
    icon: Laptop,
    title: "100% Digital",
    description: "Atendimento online completo",
  },
  {
    icon: TrendingDown,
    title: "Economia Real",
    description: "Até 50% menos impostos",
  },
  {
    icon: Users,
    title: "Suporte Humano",
    description: "Contador dedicado",
  },
  {
    icon: Clock,
    title: "Resposta Rápida",
    description: "Até 2h via WhatsApp",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Dados protegidos LGPD",
  },
];

// Inclusões abertura de empresa
const aberturaInclusions = [
  "Análise de viabilidade na Prefeitura de Campinas",
  "Registro na Junta Comercial de SP",
  "Obtenção do CNPJ",
  "Inscrição Municipal em Campinas",
  "Alvará de funcionamento",
  "Certificado Digital e-CNPJ",
  "Enquadramento no Simples Nacional",
  "Sede virtual gratuita em Holambra (RMC)",
];

const whatsappLink =
  "https://wa.me/5519974158342?text=Ol%C3%A1%21%20Vim%20pela%20p%C3%A1gina%20de%20Contabilidade%20em%20Campinas%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.";

export default function ContabilidadeCampinas() {
  const { saveLead, isSaving } = useLeadCapture();
  const { isBot, honeypotProps, reset: resetHoneypot } = useHoneypot();
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    profissao: "",
    necessidade: "abrir_empresa",
    consentimento: false,
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBot()) {
      toast.error("Erro ao enviar formulário");
      return;
    }

    if (!formData.consentimento) {
      toast.error("Você precisa aceitar a política de privacidade");
      return;
    }

    const success = await saveLead({
      nome: formData.nome,
      email: formData.email,
      whatsapp: formData.whatsapp,
      segmento: formData.profissao || "Não informado",
      fonte: "landing_campinas",
      cargo: formData.necessidade,
    });

    if (success) {
      toast.success("Recebemos seu contato! Em breve um especialista entrará em contato.");
      setFormData({
        nome: "",
        email: "",
        whatsapp: "",
        profissao: "",
        necessidade: "abrir_empresa",
        consentimento: false,
      });
      resetHoneypot();
    } else {
      toast.error("Erro ao enviar. Tente novamente ou fale conosco pelo WhatsApp.");
    }
  };

  return (
    <>
      <SEOHead
        title="Contabilidade em Campinas | Contador Digital Especializado"
        description="Contabilidade digital em Campinas para profissionais e empresas. Economize até 50% em impostos. 100% online, atendimento humanizado. Fale com um especialista!"
        keywords="contabilidade campinas, contador campinas, abertura empresa campinas, contabilidade digital campinas, contador online campinas, contabilidade RMC"
        canonical="/contabilidade-em-campinas"
        pageType="service"
        includeLocalBusiness
        faqs={campinasXFAQs}
      />

      <Header />

      <main id="main-content">
        {/* Hero Section com Formulário */}
        <section className="relative py-12 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Coluna Esquerda - Conteúdo */}
              <div className="lg:pr-8">
                <Badge variant="secondary" className="mb-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  Contabilidade Digital em Campinas
                </Badge>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Contabilidade em{" "}
                  <span className="text-gradient">Campinas</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                  Mais de <strong className="text-foreground">50 clientes</strong> na região de Campinas já
                  reduziram sua carga tributária com nossa contabilidade digital nichada.{" "}
                  <span className="text-secondary font-medium">100% online, 0% burocracia.</span>
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-card rounded-xl border border-border">
                    <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">50+</div>
                    <div className="text-xs text-muted-foreground">Clientes RMC</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-xl border border-border">
                    <Award className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">10+</div>
                    <div className="text-xs text-muted-foreground">Anos Experiência</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-xl border border-border">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">4.9</div>
                    <div className="text-xs text-muted-foreground">Google Reviews</div>
                  </div>
                </div>

                {/* CTA WhatsApp */}
                <Button variant="whatsapp" size="lg" asChild className="w-full sm:w-auto">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>

              {/* Coluna Direita - Formulário */}
              <div className="lg:pl-4">
                <Card className="shadow-xl border-2 border-secondary/20">
                  <CardContent className="p-6 lg:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Fale com um Especialista
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Preencha o formulário e retornamos em até 2 horas
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Honeypot */}
                      <input {...honeypotProps} />

                      <div>
                        <Label htmlFor="nome">Nome completo *</Label>
                        <Input
                          id="nome"
                          type="text"
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="(19) 99999-9999"
                          value={formData.whatsapp}
                          onChange={(e) =>
                            setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })
                          }
                          required
                          maxLength={15}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profissao">Qual sua profissão?</Label>
                        <Input
                          id="profissao"
                          type="text"
                          placeholder="Ex: Médico, Advogado, Desenvolvedor..."
                          value={formData.profissao}
                          onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">O que você precisa?</Label>
                        <RadioGroup
                          value={formData.necessidade}
                          onValueChange={(value) => setFormData({ ...formData, necessidade: value })}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="abrir_empresa" id="abrir_empresa" />
                            <Label htmlFor="abrir_empresa" className="font-normal cursor-pointer">
                              Abrir empresa
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="trocar_contador" id="trocar_contador" />
                            <Label htmlFor="trocar_contador" className="font-normal cursor-pointer">
                              Trocar de contador
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="falar_especialista" id="falar_especialista" />
                            <Label htmlFor="falar_especialista" className="font-normal cursor-pointer">
                              Falar com especialista
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-start space-x-3 pt-2">
                        <Checkbox
                          id="consentimento"
                          checked={formData.consentimento}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, consentimento: checked as boolean })
                          }
                        />
                        <Label htmlFor="consentimento" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                          Li e concordo com a{" "}
                          <Link to="/politica-de-privacidade" className="text-secondary hover:underline">
                            Política de Privacidade
                          </Link>{" "}
                          e autorizo o contato.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        variant="zen"
                        size="lg"
                        className="w-full"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          "Solicitar Contato"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios Locais */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Por que escolher a Contabilidade Zen em Campinas?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Especialistas na região metropolitana de Campinas, oferecemos atendimento digital
                completo com foco em economia tributária.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
              {localBenefits.map((benefit) => (
                <Card key={benefit.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 pb-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <benefit.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Abertura de Empresa em Campinas */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">
                  <Building2 className="w-4 h-4 mr-2" />
                  Abertura de Empresa
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Abra sua empresa em Campinas em até 10 dias
                </h2>
                <p className="text-muted-foreground">
                  Cuidamos de todo o processo burocrático para você focar no que importa: seu negócio.
                </p>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="font-semibold text-lg mb-4 text-foreground">O que está incluso:</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {aberturaInclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <FileText className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Sobre a Sede Virtual</h4>
                      <p className="text-sm text-muted-foreground">
                        A sede virtual <strong>gratuita</strong> está disponível em{" "}
                        <strong>Holambra (RMC)</strong>. Para endereço comercial em Campinas, temos
                        opções com parceiros locais por custo adicional. Consulte-nos para mais
                        detalhes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Jornada do Cliente */}
        <ScrollAnimation>
          <Suspense fallback={<SectionFallback />}>
            <CustomerJourney />
          </Suspense>
        </ScrollAnimation>

        {/* Rotina */}
        <ScrollAnimation>
          <Suspense fallback={<SectionFallback />}>
            <RoutineCarousel />
          </Suspense>
        </ScrollAnimation>

        {/* Depoimentos */}
        <ScrollAnimation>
          <Suspense fallback={<SectionFallback />}>
            <Testimonials />
          </Suspense>
        </ScrollAnimation>

        {/* Calculadora CLT x PJ */}
        <ScrollAnimation>
          <Suspense fallback={<SectionFallback />}>
            <PJCalculatorSection />
          </Suspense>
        </ScrollAnimation>

        {/* FAQ Campinas */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left - Header */}
              <StaggerContainer className="lg:sticky lg:top-24 lg:self-start" staggerDelay={0.1}>
                <StaggerItem type="slide">
                  <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
                    FAQ Campinas
                  </span>
                </StaggerItem>
                <StaggerItem type="hybrid">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
                    Perguntas frequentes{" "}
                    <span className="text-gradient">sobre Campinas</span>
                  </h2>
                </StaggerItem>
                <StaggerItem type="slide">
                  <p className="text-lg text-muted-foreground mb-8">
                    Tire suas dúvidas sobre contabilidade digital em Campinas e região.
                  </p>
                </StaggerItem>

                <StaggerItem type="scale">
                  <div className="bg-zen-light-teal rounded-2xl p-6 lg:p-8 transition-transform duration-200 hover:scale-[1.02]">
                    <h3 className="font-semibold text-lg mb-3 text-foreground">
                      Ainda tem dúvidas?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Fale com nossa equipe e tire todas as suas dúvidas sobre contabilidade em
                      Campinas.
                    </p>
                    <Button variant="whatsapp" asChild className="w-full sm:w-auto">
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              {/* Right - Accordion */}
              <div>
                <Accordion type="single" collapsible className="space-y-4">
                  {campinasXFAQs.map((faq, index) => (
                    <div
                      key={index}
                      className="animate-slide-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <AccordionItem
                        value={`item-${index}`}
                        className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-secondary/50 data-[state=open]:shadow-soft transition-all hover:border-secondary/30 hover:-translate-y-0.5"
                      >
                        <AccordionTrigger className="text-left font-semibold hover:text-secondary py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Pronto para ter uma contabilidade de verdade em Campinas?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Atendimento personalizado para você e sua empresa, sem compromisso.
              </p>

              <Button size="lg" variant="secondary" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar com Especialista
                </a>
              </Button>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 text-primary-foreground/70 text-sm">
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Atendimento em até 2h
                </span>
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Sem compromisso
                </span>
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  100% digital
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
