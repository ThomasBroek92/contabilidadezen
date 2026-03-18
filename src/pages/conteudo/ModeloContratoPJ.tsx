import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolPageSEO } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Download,
  FileText,
  Edit,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Code,
  Briefcase,
  Building2,
  Calculator,
  RefreshCw,
  Star,
  ArrowRight,
  MessageCircle,
  Shield,
  FileDown,
  UserX,
  Globe,
  ExternalLink,
  Users,
  Award,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useLeadCapture } from "@/hooks/use-lead-capture";
import { Link } from "react-router-dom";

// Link do Google Docs do contrato
const GOOGLE_DOCS_URL = "https://docs.google.com/document/d/1umsJsgYNg56nZdjO9Ysg6YFjaudNFgHL/edit?usp=sharing&ouid=105128360076740347532&rtpof=true&sd=true";

// FAQ data para schema
const faqData = [
  {
    question: "O modelo de contrato é realmente gratuito?",
    answer: "Sim, 100% gratuito. Você pode baixar, editar e usar quantas vezes quiser sem nenhum custo."
  },
  {
    question: "Preciso de advogado para usar este contrato?",
    answer: "O modelo é um ponto de partida completo com as cláusulas essenciais. Para casos específicos ou situações mais complexas, recomendamos revisão jurídica."
  },
  {
    question: "Posso editar as cláusulas do modelo?",
    answer: "Sim! O documento está em formato editável no Google Docs. Você pode fazer uma cópia e personalizar conforme sua necessidade."
  },
  {
    question: "O contrato serve para qualquer tipo de serviço?",
    answer: "O modelo é genérico e cobre a maioria dos casos de prestação de serviços PJ. Ele inclui cláusulas de objeto, pagamento, prazo, rescisão e confidencialidade."
  }
];

// Benefícios para o carrossel
const contractBenefits = [
  {
    icon: CheckCircle2,
    title: "100% Gratuito",
    description: "Sem custo para download ou uso.",
  },
  {
    icon: FileCheck,
    title: "Pronto para Usar",
    description: "Modelo profissional completo.",
  },
  {
    icon: Edit,
    title: "Editável",
    description: "Fácil personalização no Google Docs.",
  },
  {
    icon: Shield,
    title: "Segurança Jurídica",
    description: "Cláusulas essenciais inclusas.",
  },
  {
    icon: UserX,
    title: "Sem Cadastro",
    description: "Nenhuma conta necessária.",
  },
  {
    icon: Globe,
    title: "Formato Universal",
    description: "Compatível com qualquer editor.",
  },
];

// Cláusulas incluídas
const includedClauses = [
  "Objeto e escopo do serviço",
  "Condições de pagamento e reajuste",
  "Prazo de vigência e rescisão",
  "Responsabilidades das partes",
  "Confidencialidade e propriedade intelectual",
  "Foro e legislação aplicável",
  "Orientações para personalização"
];

// Target audiences
const targetAudiences = [
  {
    icon: Stethoscope,
    title: "Profissionais da Saúde",
    items: ["Médicos", "Dentistas", "Psicólogos", "Fisioterapeutas"]
  },
  {
    icon: Code,
    title: "Profissionais de TI e Digital",
    items: ["Desenvolvedores", "Designers", "Infoprodutores", "Consultores digitais"]
  },
  {
    icon: Briefcase,
    title: "Outros Prestadores",
    items: ["Advogados", "Arquitetos", "Representantes Comerciais", "Consultores"]
  }
];

// Passos de uso
const usageSteps = [
  {
    icon: Download,
    title: "Baixe o modelo",
    description: "Clique no botão e acesse o documento no Google Docs. Você pode visualizar e fazer uma cópia para editar."
  },
  {
    icon: Edit,
    title: "Personalize as informações",
    description: "Preencha os campos com os dados da sua empresa, do cliente e as condições específicas do serviço."
  },
  {
    icon: FileCheck,
    title: "Revise e assine",
    description: "Confira todos os dados, solicite revisão jurídica se necessário e colete as assinaturas digitais."
  }
];

// Serviços relacionados
const relatedServices = [
  {
    icon: Building2,
    title: "Abertura de Empresa",
    features: ["CNPJ em até 7 dias úteis", "Sede virtual gratuita"],
    link: "/abrir-empresa",
    cta: "Saiba mais"
  },
  {
    icon: Calculator,
    title: "Planejamento Tributário",
    features: ["Economize até 50% em impostos", "Fator R otimizado"],
    link: "/contato",
    cta: "Fale conosco"
  },
  {
    icon: RefreshCw,
    title: "Migração de Contabilidade",
    features: ["Sem burocracia", "100% digital"],
    link: "/contato",
    cta: "Fale conosco"
  }
];

// Google logo SVG component
function GoogleLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function ModeloContratoPJ() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    acceptPrivacy: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const { saveLead, isSaving } = useLeadCapture();
  
  // Autoplay para carrossel
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // Fetch GMB stats
  const { data: gmbStats } = useQuery({
    queryKey: ['gmb-stats-contract-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gmb_stats')
        .select('average_rating, total_reviews')
        .order('synced_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching GMB stats:', error);
        return null;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Render stars
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} 
      />
    ));
  };

  // Scroll suave para o formulário
  const scrollToForm = () => {
    document.getElementById("download-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Formatar WhatsApp
  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.whatsapp) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!formData.acceptPrivacy) {
      toast.error("Você precisa aceitar a Política de Privacidade.");
      return;
    }

    // Salvar lead
    const success = await saveLead({
      nome: formData.nome,
      email: formData.email,
      whatsapp: formData.whatsapp,
      fonte: "Modelo Contrato PJ",
      segmento: "Geral"
    });

    if (success) {
      setFormSubmitted(true);
      toast.success("Pronto! Seu modelo está disponível.");
      
      // Analytics
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "lead_captured",
          lead_source: "Modelo Contrato PJ",
        });
      }
    } else {
      // Mesmo se falhar o lead, liberar o acesso (melhor UX)
      setFormSubmitted(true);
    }
  };

  // Abrir Google Docs
  const openGoogleDocs = () => {
    window.open(GOOGLE_DOCS_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <ToolPageSEO
        title="Modelo de Contrato PJ Gratuito | Download em PDF/Word"
        description="Baixe gratuitamente um modelo de contrato para prestadores de serviços PJ. Cláusulas completas, editável e pronto para usar. Ideal para profissionais da saúde, TI e consultores."
        canonical="/conteudo/modelo-contrato-pj"
        faqs={faqData}
      />
      
      <Header />
      
      <main id="main-content" className="min-h-screen bg-muted/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-10">
              {/* Main Hero Grid */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <Badge variant="secondary" className="bg-zen-light-teal text-secondary px-4 py-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Ferramenta 100% gratuita
                  </Badge>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                    Modelo de Contrato PJ Gratuito.{" "}
                    <span className="text-gradient whitespace-nowrap">A burocracia</span> é por nossa conta.
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                    Baixe gratuitamente um modelo completo de contrato para prestadores de serviços. 
                    Proteja sua empresa e formalize suas relações comerciais com segurança jurídica.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="hero" size="xl" onClick={scrollToForm}>
                      Baixar Modelo Gratuito
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  {/* Google Reviews Badge */}
                  <a
                    href="https://g.page/r/CSe4RMezF61hEAI/review"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl hover:border-secondary/50 hover:shadow-card transition-all duration-300 group"
                  >
                    <GoogleLogo className="h-6 w-6" />
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {renderStars(Math.round(gmbStats?.average_rating || 5))}
                      </div>
                      <span className="font-bold text-foreground text-lg">
                        {gmbStats?.average_rating?.toFixed(1) || '5.0'}
                      </span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {gmbStats?.total_reviews || 0} avaliações no Google
                    </span>
                  </a>
                </motion.div>

                {/* Visual Mockup - Contract Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative bg-card rounded-3xl shadow-card p-8 backdrop-blur border border-border/50">
                    {/* Contract Header */}
                    <div className="bg-gradient-to-r from-secondary to-accent rounded-2xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-secondary-foreground" />
                          <div>
                            <p className="font-bold text-secondary-foreground text-lg">CONTRATO PJ</p>
                            <p className="text-sm text-secondary-foreground/80">Prestação de Serviços</p>
                          </div>
                        </div>
                        <Badge className="bg-secondary-foreground/20 text-secondary-foreground border-0">
                          Editável
                        </Badge>
                      </div>
                    </div>

                    {/* Contract Preview */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Contratante</p>
                          <p className="font-semibold text-foreground">Empresa ABC Ltda</p>
                          <p className="text-sm text-muted-foreground">CNPJ: 00.000.000/0001-00</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground uppercase">Contratado</p>
                          <p className="font-semibold text-foreground">Seu Nome PJ</p>
                          <p className="text-sm text-muted-foreground">CNPJ: 00.000.000/0001-00</p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground uppercase mb-2">Cláusulas Incluídas</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                            <p className="text-sm text-foreground">Objeto e escopo do serviço</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                            <p className="text-sm text-foreground">Condições de pagamento</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                            <p className="text-sm text-foreground">Prazo e rescisão</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t border-border/50 text-center">
                        <p className="text-xs text-muted-foreground">Disponibilizado por</p>
                        <p className="text-sm font-semibold text-secondary">Contabilidade Zen</p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                  </div>
                </motion.div>
              </div>

              {/* Benefits Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full"
              >
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[autoplayPlugin.current]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {contractBenefits.map((benefit, index) => (
                      <CarouselItem key={index} className="pl-4 basis-1/2 lg:basis-1/3">
                        <div className="flex items-center gap-4 bg-card border border-border/50 rounded-xl p-4 shadow-soft h-full">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center shrink-0">
                            <benefit.icon className="w-6 h-6 text-secondary-foreground" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-foreground">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </motion.div>
            </div>
          </div>
        </section>

        {/* O que está incluído */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                O que está incluído no modelo?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um contrato completo pensado para prestadores de serviços PJ
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
              {/* Lista de Cláusulas */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-soft"
              >
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  Cláusulas Incluídas
                </h3>
                <ul className="space-y-3">
                  {includedClauses.map((clause, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-foreground">{clause}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Aviso Importante */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-800"
              >
                <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Importante
                </h3>
                <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                  Este modelo é um <strong>ponto de partida</strong> para formalizar suas relações comerciais. 
                  Recomendamos que você faça uma <strong>revisão jurídica</strong> para adequação ao seu caso específico, 
                  especialmente em situações mais complexas ou contratos de alto valor.
                </p>
                <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    💡 A Contabilidade Zen pode indicar parceiros jurídicos especializados. Fale conosco!
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Download Section - Lead Capture */}
        <section id="download-section" className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-card rounded-3xl p-8 border border-border shadow-card">
                {!formSubmitted ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center mx-auto mb-4">
                        <FileDown className="w-8 h-8 text-secondary-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Baixe Seu Modelo de Contrato
                      </h2>
                      <p className="text-muted-foreground">
                        Preencha seus dados para acessar o modelo gratuito no Google Docs
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome completo *</Label>
                        <Input
                          id="nome"
                          type="text"
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                          maxLength={100}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          maxLength={255}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                          required
                          maxLength={15}
                        />
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="privacy"
                          checked={formData.acceptPrivacy}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, acceptPrivacy: checked as boolean })
                          }
                        />
                        <Label htmlFor="privacy" className="text-sm text-muted-foreground font-normal leading-relaxed">
                          Aceito a{" "}
                          <Link to="/politica-de-privacidade" className="text-secondary hover:underline" target="_blank">
                            Política de Privacidade
                          </Link>
                          {" "}e autorizo o contato da Contabilidade Zen.
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        variant="hero" 
                        size="lg" 
                        className="w-full"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Baixar Modelo Gratuito
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Pronto! Seu modelo está disponível
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Clique no botão abaixo para abrir o documento no Google Docs.
                      Você pode fazer uma cópia para editar.
                    </p>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      onClick={openGoogleDocs}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Abrir Modelo no Google Docs
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      O documento abrirá em uma nova aba.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Para quem é este contrato */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Para quem é este contrato?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ideal para profissionais PJ e empresas prestadoras de serviços
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {targetAudiences.map((audience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-soft"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center mb-4">
                    <audience.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {audience.title}
                  </h3>
                  <ul className="space-y-2">
                    {audience.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Como usar este modelo */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Como usar este modelo
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                3 passos simples para ter seu contrato pronto
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {usageSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Serviços Relacionados */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Mais do que um modelo de contrato
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A Contabilidade Zen cuida de toda a parte burocrática da sua PJ
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:border-secondary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary to-accent flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={service.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Badges de Confiança */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Por que confiar na Contabilidade Zen?
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-card rounded-xl p-4 border border-border text-center"
              >
                <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">100+</p>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-card rounded-xl p-4 border border-border text-center"
              >
                <Award className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">10+</p>
                <p className="text-sm text-muted-foreground">Anos no Mercado</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-card rounded-xl p-4 border border-border text-center"
              >
                <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {gmbStats?.average_rating?.toFixed(1) || '5.0'}
                </p>
                <p className="text-sm text-muted-foreground">Avaliação Google</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-card rounded-xl p-4 border border-border text-center"
              >
                <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-sm font-bold text-foreground">CRC-SP</p>
                <p className="text-sm text-muted-foreground">337693/O-7</p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center text-muted-foreground max-w-2xl mx-auto"
            >
              Somos especialistas em contabilidade digital para prestadores de serviços. 
              Nosso time de contadores experientes entende as particularidades do seu segmento 
              e oferece suporte humanizado com foco em resultados.
            </motion.p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Perguntas Frequentes
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-card rounded-xl border border-border px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-secondary to-accent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
                Pronto para formalizar seus contratos e economizar em impostos?
              </h2>
              <p className="text-lg text-secondary-foreground/80 mb-8">
                Baixe o modelo gratuito e converse com nossos especialistas sobre como podemos ajudar sua empresa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 border-0"
                  onClick={scrollToForm}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Modelo
                </Button>
                <a 
                  href="https://wa.me/5519974158342?text=Ol%C3%A1!%20Baixei%20o%20modelo%20de%20contrato%20PJ%20e%20gostaria%20de%20falar%20com%20um%20especialista."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    size="xl"
                    className="bg-transparent text-secondary-foreground border-secondary-foreground/50 hover:bg-secondary-foreground/10 w-full"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar com Especialista
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-secondary-foreground/80">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Análise gratuita do seu caso
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Sem compromisso
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Especialistas dedicados
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
