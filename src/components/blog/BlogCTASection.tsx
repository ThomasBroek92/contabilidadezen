import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useHoneypot } from '@/hooks/use-honeypot';
import { useWhatsAppNotification } from '@/hooks/use-whatsapp-notification';
import { 
  MessageSquare, 
  Calculator, 
  Users, 
  Phone, 
  ArrowRight, 
  CheckCircle2,
  TrendingDown,
  Loader2,
  Send
} from 'lucide-react';
import { z } from 'zod';

interface CTASettings {
  cta_enabled: boolean;
  cta_type: string;
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_whatsapp_message: string;
  show_tax_calculator: boolean;
  show_pj_comparison: boolean;
  show_lead_form: boolean;
  lead_form_title: string;
  lead_form_description: string;
  cta_position: string;
}

const leadSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
});

const faixasFaturamento = [
  { value: "10000", label: "R$ 10.000", autonomo: 27.5, pj: 6 },
  { value: "15000", label: "R$ 15.000", autonomo: 27.5, pj: 6 },
  { value: "20000", label: "R$ 20.000", autonomo: 27.5, pj: 7.5 },
  { value: "30000", label: "R$ 30.000", autonomo: 27.5, pj: 9 },
  { value: "50000", label: "R$ 50.000", autonomo: 27.5, pj: 11 },
];

interface BlogCTASectionProps {
  position: 'mid' | 'end';
  postTitle?: string;
}

export function BlogCTASection({ position, postTitle }: BlogCTASectionProps) {
  const { toast } = useToast();
  const { isBot, honeypotProps, reset: resetHoneypot } = useHoneypot();
  const { openWhatsAppNotification } = useWhatsAppNotification();
  
  const [settings, setSettings] = useState<CTASettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cta' | 'calculator' | 'form'>('cta');
  
  // Calculator state
  const [faturamento, setFaturamento] = useState('');
  const [showCalcResults, setShowCalcResults] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({ nome: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('geo_settings')
        .select('cta_enabled, cta_type, cta_title, cta_description, cta_button_text, cta_whatsapp_message, show_tax_calculator, show_pj_comparison, show_lead_form, lead_form_title, lead_form_description, cta_position')
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setSettings(data as unknown as CTASettings);
      }
    } catch (error) {
      console.error('Error fetching CTA settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if this CTA should be shown based on position setting
  const shouldShow = () => {
    if (!settings?.cta_enabled) return false;
    const ctaPosition = settings.cta_position || 'after_content';
    
    if (position === 'mid') {
      return ctaPosition === 'mid_content' || ctaPosition === 'both';
    }
    if (position === 'end') {
      return ctaPosition === 'after_content' || ctaPosition === 'both';
    }
    return false;
  };

  const calcularEconomia = () => {
    const selectedFaixa = faixasFaturamento.find(f => f.value === faturamento);
    if (!selectedFaixa) return null;
    
    const faturamentoNum = parseFloat(faturamento);
    const impostoAutonomo = faturamentoNum * (selectedFaixa.autonomo / 100);
    const impostoPJ = faturamentoNum * (selectedFaixa.pj / 100);
    const economiaMensal = impostoAutonomo - impostoPJ;
    const economiaAnual = economiaMensal * 12;
    
    return { economiaMensal, economiaAnual, aliquotaAutonomo: selectedFaixa.autonomo, aliquotaPJ: selectedFaixa.pj };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isBot()) {
      toast({ title: "Dados enviados!", description: "Entraremos em contato em breve." });
      return;
    }

    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        nome: result.data.nome,
        email: result.data.email,
        whatsapp: result.data.whatsapp,
        segmento: 'blog',
        fonte: `blog_cta_${postTitle?.substring(0, 50) || 'post'}`,
      });

      if (error) throw error;

      openWhatsAppNotification({
        nome: result.data.nome,
        email: result.data.email,
        whatsapp: result.data.whatsapp,
        segmento: 'Blog',
        fonte: 'CTA do Blog',
      });

      toast({ title: "Enviado com sucesso!", description: "Entraremos em contato em breve." });
      resetHoneypot();
      setFormSubmitted(true);
    } catch (error) {
      toast({ title: "Erro ao enviar", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculatorSubmit = () => {
    if (!faturamento) {
      toast({ title: "Selecione uma faixa", description: "Escolha seu faturamento mensal.", variant: "destructive" });
      return;
    }
    setShowCalcResults(true);
  };

  if (loading || !shouldShow()) return null;

  const economia = calcularEconomia();
  const whatsappLink = `https://wa.me/5519974158342?text=${encodeURIComponent(settings?.cta_whatsapp_message || 'Olá! Gostaria de mais informações.')}`;

  return (
    <section className="my-12 py-8 px-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl border border-primary/20">
      {/* Tools Tabs */}
      {(settings?.show_tax_calculator || settings?.show_pj_comparison || settings?.show_lead_form) && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <Button 
            variant={activeTab === 'cta' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('cta')}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Fale Conosco
          </Button>
          {settings?.show_tax_calculator && (
            <Button 
              variant={activeTab === 'calculator' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('calculator')}
              className="gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculadora
            </Button>
          )}
          {settings?.show_lead_form && (
            <Button 
              variant={activeTab === 'form' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('form')}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Análise Gratuita
            </Button>
          )}
        </div>
      )}

      {/* Main CTA */}
      {activeTab === 'cta' && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            {settings?.cta_title || 'Fale com um Especialista'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            {settings?.cta_description || 'Agende uma consultoria gratuita e tire suas dúvidas.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Phone className="h-5 w-5" />
                {settings?.cta_button_text || 'Agendar Consultoria'}
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contato" className="gap-2">
                <MessageSquare className="h-5 w-5" />
                Formulário de Contato
              </Link>
            </Button>
          </div>
          
          {settings?.show_pj_comparison && (
            <div className="mt-8 p-6 bg-card rounded-xl border border-border">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="h-6 w-6 text-secondary" />
                <h4 className="font-semibold text-foreground">Por que abrir uma empresa?</h4>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-secondary">Economia de até 70%</p>
                  <p className="text-muted-foreground">em impostos comparado ao autônomo</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-secondary">CNPJ em 24h</p>
                  <p className="text-muted-foreground">abertura rápida e sem burocracia</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-secondary">Suporte especializado</p>
                  <p className="text-muted-foreground">para profissionais da saúde</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && settings?.show_tax_calculator && (
        <div className="max-w-md mx-auto">
          {!showCalcResults ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Calculator className="h-5 w-5 text-secondary" />
                  Calculadora de Economia
                </CardTitle>
                <CardDescription>
                  Descubra quanto você pode economizar como PJ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Faturamento mensal estimado</Label>
                  <Select value={faturamento} onValueChange={setFaturamento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      {faixasFaturamento.map((faixa) => (
                        <SelectItem key={faixa.value} value={faixa.value}>
                          {faixa.label} / mês
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculatorSubmit} className="w-full gap-2">
                  Calcular Economia
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="bg-secondary/10 rounded-xl p-6 text-center border border-secondary/20">
                <TrendingDown className="h-10 w-10 text-secondary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Economia estimada por ano</p>
                <p className="text-3xl font-bold text-secondary">{formatCurrency(economia?.economiaAnual || 0)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  De {economia?.aliquotaAutonomo}% (autônomo) para apenas {economia?.aliquotaPJ}% (PJ)
                </p>
              </div>
              <Button asChild className="w-full gap-2">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" />
                  Falar com Especialista
                </a>
              </Button>
              <Button variant="outline" onClick={() => setShowCalcResults(false)} className="w-full">
                Calcular Novamente
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Lead Form Tab */}
      {activeTab === 'form' && settings?.show_lead_form && (
        <div className="max-w-md mx-auto">
          {!formSubmitted ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>{settings?.lead_form_title || 'Receba uma Análise Personalizada'}</CardTitle>
                <CardDescription>
                  {settings?.lead_form_description || 'Preencha o formulário e receba gratuitamente uma análise tributária.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className={errors.nome ? "border-destructive" : ""}
                    />
                    {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="(00) 00000-0000"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className={errors.whatsapp ? "border-destructive" : ""}
                    />
                    {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp}</p>}
                  </div>
                  <input {...honeypotProps} />
                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Solicitar Análise Gratuita
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Ao enviar, você concorda em receber contato sobre nossos serviços.
                  </p>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <CheckCircle2 className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Recebemos seus dados!</h3>
                <p className="text-muted-foreground mb-6">
                  Nossa equipe entrará em contato em breve com sua análise personalizada.
                </p>
                <Button variant="outline" onClick={() => setFormSubmitted(false)}>
                  Enviar outro
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  );
}
