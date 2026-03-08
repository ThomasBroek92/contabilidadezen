import { lazy, Suspense, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
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
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
  HoverLift,
  AnimatedIcon,
} from "@/components/ui/scroll-animation";
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
  Loader2,
  Sparkles,
  Gift,
  ArrowLeftRight,
} from "lucide-react";
import { LeadGatedCalculator } from "@/components/sections/LeadGatedCalculator";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { citiesConfigMap, type CityConfig } from "@/lib/cities-config";

// Lazy load heavy sections
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

const SectionFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
  </div>
);

const localBenefits = [
  { icon: MapPin, title: "Foco Regional", description: "Especialistas na sua região" },
  { icon: Laptop, title: "100% Digital", description: "Atendimento online completo" },
  { icon: TrendingDown, title: "Economia Real", description: "Até 50% menos impostos" },
  { icon: Users, title: "Suporte Humano", description: "Contador dedicado" },
  { icon: Clock, title: "Resposta Rápida", description: "Até 2h via WhatsApp" },
  { icon: Shield, title: "Segurança", description: "Dados protegidos LGPD" },
];

export default function CidadeLandingPage() {
  const { "*": splatSlug } = useParams();
  const slug = splatSlug || "";
  const city = slug ? citiesConfigMap[slug] : undefined;

  if (!city) {
    return <Navigate to="/cidades-atendidas" replace />;
  }

  return <CidadeContent city={city} />;
}

function CidadeContent({ city }: { city: CityConfig }) {
  const { saveLead, isSaving } = useLeadCapture();
  const { isBot, honeypotProps, reset: resetHoneypot } = useHoneypot();
  const whatsappLink = getWhatsAppLink(city.whatsappMessage);

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
    if (isBot()) { toast.error("Erro ao enviar formulário"); return; }
    if (!formData.consentimento) { toast.error("Você precisa aceitar a política de privacidade"); return; }

    const success = await saveLead({
      nome: formData.nome,
      email: formData.email,
      whatsapp: formData.whatsapp,
      segmento: formData.profissao || "Não informado",
      fonte: city.leadSource,
      cargo: formData.necessidade,
    });

    if (success) {
      toast.success("Recebemos seu contato! Em breve um especialista entrará em contato.");
      setFormData({ nome: "", email: "", whatsapp: "", profissao: "", necessidade: "abrir_empresa", consentimento: false });
      resetHoneypot();
    } else {
      toast.error("Erro ao enviar. Tente novamente ou fale conosco pelo WhatsApp.");
    }
  };

  return (
    <>
      <SEOHead
        title={city.seoTitle}
        description={city.seoDescription}
        keywords={city.seoKeywords}
        canonical={`/contabilidade-em-${city.slug}`}
        pageType="service"
        includeLocalBusiness
        faqs={city.faqs}
        breadcrumbs={[
          { name: "Home", url: "https://www.contabilidadezen.com.br" },
          { name: "Cidades Atendidas", url: "https://www.contabilidadezen.com.br/cidades-atendidas" },
          { name: `Contabilidade em ${city.name}`, url: `https://www.contabilidadezen.com.br/contabilidade-em-${city.slug}` },
        ]}
      />

      <Header />

      <main id="main-content">
        {/* Hero + Form */}
        <section className="relative py-12 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="lg:pr-8">
                <Badge variant="secondary" className="mb-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  Contabilidade Digital em {city.name}
                </Badge>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Contabilidade em{" "}
                  <span className="text-gradient">{city.name}</span>
                </h1>

                <p
                  className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
                  dangerouslySetInnerHTML={{ __html: city.heroSubtitle }}
                />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-card rounded-xl border border-border">
                    <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{city.statsClientes}</div>
                    <div className="text-xs text-muted-foreground">{city.statsLabel}</div>
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

                <Button variant="whatsapp" size="lg" asChild className="w-full sm:w-auto">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>

              {/* Form */}
              <div className="lg:pl-4">
                <Card className="shadow-xl border-2 border-secondary/20">
                  <CardContent className="p-6 lg:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">Fale com um Especialista</h2>
                      <p className="text-sm text-muted-foreground">Preencha o formulário e retornamos em até 2 horas</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input {...honeypotProps} />

                      <div>
                        <Label htmlFor="nome">Nome completo *</Label>
                        <Input id="nome" type="text" placeholder="Seu nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input id="whatsapp" type="tel" placeholder={`(${city.ddd}) 99999-9999`} value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })} required maxLength={15} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="profissao">Qual sua profissão?</Label>
                        <Input id="profissao" type="text" placeholder="Ex: Médico, Advogado, Desenvolvedor..." value={formData.profissao} onChange={(e) => setFormData({ ...formData, profissao: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label className="mb-3 block">O que você precisa?</Label>
                        <RadioGroup value={formData.necessidade} onValueChange={(value) => setFormData({ ...formData, necessidade: value })} className="space-y-2">
                          <div className="flex items-center space-x-3"><RadioGroupItem value="abrir_empresa" id="abrir_empresa" /><Label htmlFor="abrir_empresa" className="font-normal cursor-pointer">Abrir empresa</Label></div>
                          <div className="flex items-center space-x-3"><RadioGroupItem value="trocar_contador" id="trocar_contador" /><Label htmlFor="trocar_contador" className="font-normal cursor-pointer">Trocar de contador</Label></div>
                          <div className="flex items-center space-x-3"><RadioGroupItem value="falar_especialista" id="falar_especialista" /><Label htmlFor="falar_especialista" className="font-normal cursor-pointer">Falar com especialista</Label></div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-start space-x-3 pt-2">
                        <Checkbox id="consentimento" checked={formData.consentimento} onCheckedChange={(checked) => setFormData({ ...formData, consentimento: checked as boolean })} />
                        <Label htmlFor="consentimento" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                          Li e concordo com a <Link to="/politica-de-privacidade" className="text-secondary hover:underline">Política de Privacidade</Link> e autorizo o contato.
                        </Label>
                      </div>
                      <Button type="submit" variant="zen" size="lg" className="w-full" disabled={isSaving}>
                        {isSaving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>) : "Solicitar Contato"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Por que escolher a Contabilidade Zen em {city.name}?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{city.benefitsSubtitle}</p>
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

        {/* Abertura de Empresa - Card Dinâmico */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="space-y-6 max-w-6xl mx-auto">
                <HoverLift lift={6} scale={1.005}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 p-8 lg:p-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-foreground/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-foreground/5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
                    <div className="relative z-10">
                      <Badge className="bg-secondary-foreground/20 text-secondary-foreground border-none mb-6">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Mais Popular
                      </Badge>
                      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-foreground mb-3">
                              Abertura de Empresa em {city.name}
                            </h2>
                            <p className="text-secondary-foreground/80 text-lg">
                              Abra seu CNPJ em até 7 dias úteis com todo suporte especializado.
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {city.aberturaItems.slice(0, 6).map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-secondary-foreground shrink-0" />
                                <span className="text-secondary-foreground/90 text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Button variant="outline" size="lg" asChild className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 border-none">
                              <Link to="/abrir-empresa">
                                Abrir minha empresa
                                <ArrowLeftRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                            <span className="text-secondary-foreground/70 text-sm">
                              A partir de <strong className="text-secondary-foreground">R$ 0*</strong>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-secondary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-secondary-foreground/20 flex items-center gap-4">
                            <AnimatedIcon type="bounce">
                              <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center shrink-0">
                                <Gift className="h-6 w-6 text-warning-foreground" />
                              </div>
                            </AnimatedIcon>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Building2 className="h-4 w-4 text-secondary-foreground" />
                                <span className="font-bold text-secondary-foreground text-sm">{city.sedeVirtual}</span>
                              </div>
                              <p className="text-secondary-foreground/70 text-xs">{city.sedeVirtualDetail}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-secondary-foreground/50 text-xs line-through">R$ 99/mês</p>
                              <p className="text-secondary-foreground font-bold text-lg">R$ 0</p>
                            </div>
                          </div>
                          <LeadGatedCalculator source={city.calculatorSource} variant="compact" />
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverLift>

                {/* Card Migração */}
                <HoverLift lift={4} scale={1.005}>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 lg:p-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
                      <AnimatedIcon type="pulse">
                        <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center shrink-0">
                          <ArrowLeftRight className="h-7 w-7 text-primary-foreground" />
                        </div>
                      </AnimatedIcon>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-primary-foreground">Migração de Contabilidade</h3>
                          <Badge className="bg-primary-foreground/20 text-primary-foreground border-none text-xs">Gratuito</Badge>
                        </div>
                        <p className="text-primary-foreground/80 text-sm mb-4 lg:mb-0">
                          Troque de contador sem dor de cabeça. Cuidamos de toda a comunicação com seu contador atual.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30">100% Digital</Badge>
                        <Badge variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30">15 dias</Badge>
                        <Badge variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30">Sem interrupção</Badge>
                        <Button variant="outline" size="sm" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-none">
                          <Link to="/contato">Migrar agora</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </HoverLift>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Shared sections */}
        <ScrollAnimation><Suspense fallback={<SectionFallback />}><CustomerJourney /></Suspense></ScrollAnimation>
        <ScrollAnimation><Suspense fallback={<SectionFallback />}><RoutineCarousel /></Suspense></ScrollAnimation>
        <ScrollAnimation><Suspense fallback={<SectionFallback />}><Testimonials /></Suspense></ScrollAnimation>
        <ScrollAnimation><Suspense fallback={<SectionFallback />}><PJCalculatorSection /></Suspense></ScrollAnimation>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <StaggerContainer className="lg:sticky lg:top-24 lg:self-start" staggerDelay={0.1}>
                <StaggerItem type="slide">
                  <span className="text-secondary font-semibold text-sm uppercase tracking-wider">FAQ {city.name}</span>
                </StaggerItem>
                <StaggerItem type="hybrid">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
                    Perguntas frequentes <span className="text-gradient">sobre {city.name}</span>
                  </h2>
                </StaggerItem>
                <StaggerItem type="slide">
                  <p className="text-lg text-muted-foreground mb-8">
                    Tire suas dúvidas sobre contabilidade digital em {city.name} e região.
                  </p>
                </StaggerItem>
                <StaggerItem type="scale">
                  <div className="bg-zen-light-teal rounded-2xl p-6 lg:p-8 transition-transform duration-200 hover:scale-[1.02]">
                    <h3 className="font-semibold text-lg mb-3 text-foreground">Ainda tem dúvidas?</h3>
                    <p className="text-muted-foreground mb-6">Fale com nossa equipe e tire todas as suas dúvidas sobre contabilidade em {city.name}.</p>
                    <Button variant="whatsapp" asChild className="w-full sm:w-auto">
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-2" />WhatsApp
                      </a>
                    </Button>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <div>
                <Accordion type="single" collapsible className="space-y-4">
                  {city.faqs.map((faq, index) => (
                    <div key={index} className="animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <AccordionItem
                        value={`item-${index}`}
                        className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-secondary/50 data-[state=open]:shadow-soft transition-all hover:border-secondary/30 hover:-translate-y-0.5"
                      >
                        <AccordionTrigger className="text-left font-semibold hover:text-secondary py-5">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">{faq.answer}</AccordionContent>
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
                Pronto para ter uma contabilidade de verdade em {city.name}?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Atendimento personalizado para você e sua empresa, sem compromisso.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />Falar com Especialista
                </a>
              </Button>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 text-primary-foreground/70 text-sm">
                <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Atendimento em até 2h</span>
                <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Sem compromisso</span>
                <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />100% digital</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
