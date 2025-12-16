import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Calendar, 
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppNotification } from "@/hooks/use-whatsapp-notification";
import { useHoneypot } from "@/hooks/use-honeypot";
import { z } from "zod";

const leadSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido").max(255),
  telefone: z.string().min(10, "Telefone inválido").max(20),
});

const contactInfo = [
  {
    icon: Phone,
    title: "Telefone",
    value: "(19) 97415-8342",
    href: "tel:+5519974158342",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: "contato@contabilidadezen.com.br",
    href: "mailto:contato@contabilidadezen.com.br",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "Seg - Sex: 9h às 18h",
    href: null,
  },
  {
    icon: MapPin,
    title: "Endereço",
    value: "São Paulo, SP (Atendimento 100% digital)",
    href: null,
  },
];

const services = [
  "Abertura de empresa (CNPJ)",
  "Contabilidade mensal",
  "Migração de contabilidade",
  "Planejamento tributário",
  "Consultoria fiscal",
  "Outro",
];

const professions = [
  "Médico(a)",
  "Dentista",
  "Psicólogo(a)",
  "Fisioterapeuta",
  "Nutricionista",
  "Enfermeiro(a)",
  "Outro profissional da saúde",
  "Clínica / Consultório",
];

export default function Contato() {
  const { toast } = useToast();
  const { openWhatsAppNotification } = useWhatsAppNotification();
  const { honeypotProps, isBot } = useHoneypot();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    service: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Bot protection
    if (isBot()) {
      toast({
        title: "Erro",
        description: "Formulário inválido.",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = leadSchema.safeParse({
      nome: formData.name,
      email: formData.email,
      telefone: formData.phone,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        nome: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        whatsapp: formData.phone.trim(),
        segmento: formData.profession || "Contato Geral",
        fonte: `Formulário de Contato - ${formData.service || "Não especificado"}`,
      });

      if (error) throw error;

      // Send WhatsApp notification
      openWhatsAppNotification({
        nome: formData.name,
        whatsapp: formData.phone,
        email: formData.email,
        segmento: formData.profession || "Contato Geral",
        fonte: `Formulário de Contato${formData.message ? ` - Msg: ${formData.message.substring(0, 50)}` : ""}`,
      });

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Nossa equipe entrará em contato em breve.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        profession: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar",
        description: "Por favor, tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Fale{" "}
              <span className="text-gradient">Conosco</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Agende uma consulta gratuita com nossos especialistas em contabilidade 
              para profissionais da saúde.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Agende sua consulta gratuita
                </h2>
                <p className="text-muted-foreground mb-8">
                  Preencha o formulário abaixo e nossa equipe entrará em contato 
                  para agendar uma consulta sem compromisso.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">WhatsApp *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profession">Profissão *</Label>
                      <Select
                        value={formData.profession}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, profession: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {professions.map((prof) => (
                            <SelectItem key={prof} value={prof}>
                              {prof}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service">Serviço de interesse</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, service: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Conte-nos mais sobre sua necessidade..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  {/* Honeypot field for bot protection */}
                  <input {...honeypotProps} />

                  <Button 
                    type="submit" 
                    variant="zen" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Ao enviar este formulário, você concorda com nossa{" "}
                    <a href="/politica-de-privacidade" className="text-secondary hover:underline">
                      Política de Privacidade
                    </a>{" "}
                    e nossos{" "}
                    <a href="/termos" className="text-secondary hover:underline">
                      Termos de Uso
                    </a>
                    .
                  </p>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                {/* Quick Actions */}
                <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    Atendimento rápido
                  </h3>
                  <div className="space-y-4">
                    <Button variant="whatsapp" size="lg" className="w-full" asChild>
                      <a
                        href="https://wa.me/5519974158342?text=Olá! Gostaria de agendar uma consulta gratuita sobre contabilidade."
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Falar pelo WhatsApp
                      </a>
                    </Button>
                    <Button variant="zen-outline" size="lg" className="w-full" asChild>
                      <a
                        href="https://calendly.com/contabilidadezen"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="h-5 w-5" />
                        Agendar reunião online
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Contact Info Cards */}
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 bg-muted/30 rounded-xl p-4"
                    >
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.title}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="font-medium text-foreground hover:text-secondary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="mt-8 bg-zen-light-teal rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    O que você ganha na consulta gratuita:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Análise do seu caso específico",
                      "Simulação de economia tributária",
                      "Orientação sobre melhor regime tributário",
                      "Esclarecimento de todas as dúvidas",
                      "Sem compromisso de contratação",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
