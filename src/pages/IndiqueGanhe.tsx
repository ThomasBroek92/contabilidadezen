import { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { PartnerEarningsCalculator } from "@/components/indique-ganhe/PartnerEarningsCalculator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Gift, 
  Users, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  Star, 
  BadgeDollarSign,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  User,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const indicacaoSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20, "WhatsApp muito longo"),
});

const steps = [
  {
    icon: Users,
    title: "Cadastre-se",
    description: "Preencha o formulário simples e rápido para se tornar um parceiro embaixador."
  },
  {
    icon: Send,
    title: "Indique",
    description: "Compartilhe seu link exclusivo ou nos envie os dados do seu indicado via WhatsApp."
  },
  {
    icon: BadgeDollarSign,
    title: "Receba",
    description: "Após a primeira mensalidade paga, você recebe 100% do valor via PIX!"
  }
];

const benefits = [
  {
    icon: Gift,
    title: "100% da Primeira Mensalidade",
    description: "Receba o valor integral da primeira mensalidade do seu indicado diretamente via PIX."
  },
  {
    icon: TrendingUp,
    title: "Desconto Progressivo",
    description: "Acumule indicações e ganhe descontos crescentes na sua própria mensalidade contábil."
  },
  {
    icon: Sparkles,
    title: "Certificado Digital Grátis",
    description: "A cada 3 indicações confirmadas, ganhe um Certificado Digital e-CPF ou e-CNPJ."
  },
  {
    icon: Shield,
    title: "IRPF Gratuito",
    description: "Clientes parceiros que indicam 5 ou mais empresas ganham declaração de IRPF grátis."
  }
];

const testimonials = [
  {
    name: "Dr. Ricardo Mendes",
    role: "Médico Cardiologista",
    text: "Já indiquei 3 colegas e zersei minha mensalidade contábil. O processo é super simples!",
    rating: 5
  },
  {
    name: "Dra. Camila Torres",
    role: "Dentista",
    text: "Recebi R$ 997 via PIX em menos de 30 dias após minha indicação fechar contrato. Recomendo!",
    rating: 5
  },
  {
    name: "Lucas Oliveira",
    role: "Fisioterapeuta",
    text: "O programa é transparente e o suporte é excelente. Já ganhei meu certificado digital grátis!",
    rating: 5
  }
];

const faqs = [
  {
    question: "Quem pode participar do programa de indicação?",
    answer: "Qualquer pessoa pode participar! Não precisa ser cliente da Contabilidade Zen. Basta se cadastrar e começar a indicar."
  },
  {
    question: "Quando recebo o bônus pela indicação?",
    answer: "O bônus é pago via PIX em até 5 dias úteis após o pagamento da primeira mensalidade pelo indicado."
  },
  {
    question: "Qual o valor mínimo de faturamento do indicado?",
    answer: "Não há valor mínimo para indicados. Aceitamos empresas e profissionais de qualquer porte."
  },
  {
    question: "Posso indicar quantas empresas quiser?",
    answer: "Sim! Não há limite de indicações. Quanto mais você indica, mais você ganha."
  },
  {
    question: "O programa segue as normas éticas da contabilidade?",
    answer: "Absolutamente. Nosso programa está em total conformidade com o Código de Ética do Contador e todas as normas do CFC."
  },
  {
    question: "Como acompanho o status das minhas indicações?",
    answer: "Você receberá atualizações por WhatsApp sobre cada etapa: cadastro, proposta enviada, contrato assinado e pagamento realizado."
  }
];

export default function IndiqueGanhe() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = indicacaoSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim(),
        fonte: "Programa Indique e Ganhe",
        segmento: "Parceiro Indicador",
        consentimento_lgpd: true,
        data_consentimento: new Date().toISOString()
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Cadastro realizado com sucesso! Entraremos em contato em breve.");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao enviar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Olá! Quero me tornar um parceiro embaixador do programa Indique e Ganhe da Contabilidade Zen!"
  );

  return (
    <>
      <SEOHead
        title="Indique e Ganhe | Programa de Parceria Contábil"
        description="Transforme suas indicações em renda extra! Ganhe 100% da primeira mensalidade via PIX ao indicar empresas para a Contabilidade Zen."
        keywords="programa de indicação, parceria contábil, ganhe dinheiro indicando, contabilidade, PIX"
        canonical="/indique-e-ganhe"
        pageType="service"
        faqs={faqs}
      />

      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2319a186%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-secondary">Programa de Parceria</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary leading-tight">
                  Transforme suas{" "}
                  <span className="text-gradient">indicações</span>{" "}
                  em renda extra
                </h1>
                
                <p className="text-lg lg:text-xl text-muted-foreground max-w-xl">
                  Ganhe <strong className="text-secondary">100% do valor da primeira mensalidade</strong> de cada 
                  empresa que você indicar. Pagamento rápido via PIX!
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="group"
                    onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Quero ser embaixador
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    variant="whatsapp" 
                    size="xl" 
                    asChild
                  >
                    <a 
                      href={`https://wa.me/5519974158342?text=${whatsappMessage}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Indicar via WhatsApp
                    </a>
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-background flex items-center justify-center"
                      >
                        <User className="h-5 w-5 text-secondary" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">+30 parceiros ativos</p>
                    <Link to="/parceiro/dashboard" className="text-xs text-secondary hover:underline mt-1 inline-block">
                      Já é parceiro? Acesse seu dashboard →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Formulário de Cadastro */}
              <Card className="shadow-card border-secondary/20" id="cadastro">
                <CardContent className="p-6 lg:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Tudo certo!</h3>
                      <p className="text-muted-foreground">
                        Logo você receberá as orientações por e-mail e WhatsApp.
                      </p>
                      <Button 
                        variant="whatsapp" 
                        size="lg" 
                        asChild
                        className="mt-4"
                      >
                        <a 
                          href={`https://wa.me/5519974158342?text=${whatsappMessage}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="mr-2 h-5 w-5" />
                          Já tenho uma indicação!
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground">Cadastre-se agora</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Em menos de 60 segundos você se torna um parceiro
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nome" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-secondary" />
                          Nome completo
                        </Label>
                        <Input
                          id="nome"
                          type="text"
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-secondary" />
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-secondary" />
                          WhatsApp
                        </Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        variant="hero" 
                        size="lg" 
                        className="w-full h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Cadastrando..." : "Quero ser um embaixador"}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Ao se cadastrar, você concorda com nossa{" "}
                        <a href="/politica-de-privacidade" className="text-secondary hover:underline">
                          Política de Privacidade
                        </a>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Calculadora de Ganhos */}
        <PartnerEarningsCalculator />

        {/* Como Funciona */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Como <span className="text-gradient">funciona</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Em apenas 3 passos simples você começa a ganhar
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute top-10 left-[60%] hidden md:block w-[calc(100%-60px)] h-0.5 bg-border -z-10" 
                       style={{ display: index === 2 ? 'none' : undefined }} />
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold mb-3">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                O que você <span className="text-gradient">ganha</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recompensas reais para quem indica
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border/50 hover:border-secondary/50 transition-colors hover:shadow-card">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                      <benefit.icon className="h-7 w-7 text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Parceiros que <span className="text-gradient">já ganharam</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Veja o que nossos embaixadores dizem
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Perguntas <span className="text-gradient">frequentes</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tire suas dúvidas sobre o programa
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:text-secondary hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 lg:py-24 bg-gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <Clock className="h-12 w-12 mx-auto text-primary-foreground/80" />
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
                Comece a ganhar hoje mesmo!
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
                Não perca tempo. Cadastre-se agora e transforme suas indicações em dinheiro.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button 
                  variant="zen" 
                  size="xl"
                  onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Quero me cadastrar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                  asChild
                >
                  <a 
                    href={`https://wa.me/5519974158342?text=${whatsappMessage}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Botão flutuante WhatsApp de indicação */}
      <a
        href={`https://wa.me/5519974158342?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 bg-gradient-primary text-primary-foreground p-4 rounded-full shadow-glow hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <Gift className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
          Indicar agora
        </span>
      </a>
    </>
  );
}
