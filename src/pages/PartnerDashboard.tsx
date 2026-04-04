import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Gift, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MessageCircle,
  Plus,
  TrendingUp,
  Loader2,
  LogOut,
  User,
  Phone,
  Mail,
  Building,
  Trophy,
  Star,
  Target,
  Zap,
  Award,
  Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getWhatsAppAnchorPropsByKey } from "@/lib/whatsapp";
import { z } from "zod";

const referralSchema = z.object({
  referred_name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  referred_email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo"),
  referred_whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20, "WhatsApp muito longo"),
  referred_empresa: z.string().trim().max(100, "Nome da empresa muito longo").optional(),
  referred_segmento: z.string().trim().max(50, "Segmento muito longo").optional(),
});

type Referral = {
  id: string;
  partner_email: string;
  partner_name: string;
  referred_name: string;
  referred_email: string;
  referred_whatsapp: string;
  referred_empresa: string | null;
  referred_segmento: string | null;
  status: string;
  commission_value: number;
  paid_at: string | null;
  created_at: string;
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pendente: { label: "Pendente", color: "bg-muted text-muted-foreground", icon: Clock },
  contatado: { label: "Contatado", color: "bg-accent/20 text-accent", icon: MessageCircle },
  proposta: { label: "Proposta Enviada", color: "bg-secondary/20 text-secondary", icon: TrendingUp },
  fechado: { label: "Fechado", color: "bg-secondary text-secondary-foreground", icon: CheckCircle2 },
  pago: { label: "Comissão Paga", color: "bg-primary text-primary-foreground", icon: DollarSign },
  cancelado: { label: "Cancelado", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReferral, setNewReferral] = useState({
    referred_name: "",
    referred_email: "",
    referred_whatsapp: "",
    referred_empresa: "",
    referred_segmento: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth?redirect=/parceiro/dashboard");
      return;
    }

    setUser({
      email: session.user.email || "",
      name: session.user.user_metadata?.nome || session.user.email?.split("@")[0] || "Parceiro"
    });

    fetchReferrals(session.user.email || "");
  };

  const fetchReferrals = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("partner_referrals")
        .select("*")
        .eq("partner_email", email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Erro ao carregar indicações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/indique-e-ganhe");
  };

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = referralSchema.safeParse(newReferral);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("partner_referrals").insert({
        partner_email: user.email,
        partner_name: user.name,
        referred_name: newReferral.referred_name.trim(),
        referred_email: newReferral.referred_email.trim(),
        referred_whatsapp: newReferral.referred_whatsapp.trim(),
        referred_empresa: newReferral.referred_empresa.trim() || null,
        referred_segmento: newReferral.referred_segmento.trim() || "Não informado",
      });

      if (error) throw error;

      toast.success("Indicação registrada com sucesso!");
      setIsDialogOpen(false);
      setNewReferral({
        referred_name: "",
        referred_email: "",
        referred_whatsapp: "",
        referred_empresa: "",
        referred_segmento: "",
      });
      fetchReferrals(user.email);
    } catch (error) {
      console.error("Error submitting referral:", error);
      toast.error("Erro ao registrar indicação");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const totalReferrals = referrals.length;
  const closedReferrals = referrals.filter(r => r.status === "fechado" || r.status === "pago").length;
  const paidReferrals = referrals.filter(r => r.status === "pago").length;
  const totalEarnings = referrals
    .filter(r => r.status === "pago")
    .reduce((sum, r) => sum + (r.commission_value || 0), 0);
  const pendingEarnings = referrals
    .filter(r => r.status === "fechado")
    .reduce((sum, r) => sum + (r.commission_value || 0), 0);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Dashboard do Parceiro | Contabilidade Zen"
        description="Acompanhe suas indicações e ganhos em tempo real no programa Indique e Ganhe."
        noindex={true}
        nofollow={true}
      />

      <Header />

      <main className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Olá, <span className="text-gradient">{user?.name}</span>!
              </h1>
              <p className="text-muted-foreground mt-1">
                Acompanhe suas indicações e ganhos em tempo real
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Nova Indicação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Registrar Nova Indicação</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitReferral} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="referred_name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-secondary" />
                        Nome do Indicado *
                      </Label>
                      <Input
                        id="referred_name"
                        value={newReferral.referred_name}
                        onChange={(e) => setNewReferral({ ...newReferral, referred_name: e.target.value })}
                        placeholder="Nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referred_email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-secondary" />
                        E-mail *
                      </Label>
                      <Input
                        id="referred_email"
                        type="email"
                        value={newReferral.referred_email}
                        onChange={(e) => setNewReferral({ ...newReferral, referred_email: e.target.value })}
                        placeholder="email@exemplo.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referred_whatsapp" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-secondary" />
                        WhatsApp *
                      </Label>
                      <Input
                        id="referred_whatsapp"
                        type="tel"
                        value={newReferral.referred_whatsapp}
                        onChange={(e) => setNewReferral({ ...newReferral, referred_whatsapp: e.target.value })}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referred_empresa" className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-secondary" />
                        Empresa (opcional)
                      </Label>
                      <Input
                        id="referred_empresa"
                        value={newReferral.referred_empresa}
                        onChange={(e) => setNewReferral({ ...newReferral, referred_empresa: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referred_segmento">Segmento (opcional)</Label>
                      <Input
                        id="referred_segmento"
                        value={newReferral.referred_segmento}
                        onChange={(e) => setNewReferral({ ...newReferral, referred_segmento: e.target.value })}
                        placeholder="Ex: Médico, Dentista, Psicólogo..."
                      />
                    </div>
                    <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        "Registrar Indicação"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Indicações</p>
                    <p className="text-2xl font-bold text-foreground">{totalReferrals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fechadas</p>
                    <p className="text-2xl font-bold text-foreground">{closedReferrals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Recebido</p>
                    <p className="text-2xl font-bold text-secondary">
                      R$ {totalEarnings.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">A Receber</p>
                    <p className="text-2xl font-bold text-accent">
                      R$ {pendingEarnings.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referrals List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-secondary" />
                Minhas Indicações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma indicação ainda
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Comece a indicar agora e ganhe comissões!
                  </p>
                  <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Fazer Primeira Indicação
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral) => {
                    const status = statusConfig[referral.status] || statusConfig.pendente;
                    const StatusIcon = status.icon;
                    
                    return (
                      <div 
                        key={referral.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border bg-background gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{referral.referred_name}</h4>
                            <p className="text-sm text-muted-foreground">{referral.referred_email}</p>
                            {referral.referred_empresa && (
                              <p className="text-sm text-muted-foreground">{referral.referred_empresa}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Indicado em {new Date(referral.created_at).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 md:gap-6">
                          {referral.commission_value > 0 && (
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Comissão</p>
                              <p className="font-bold text-secondary">
                                R$ {referral.commission_value.toLocaleString("pt-BR")}
                              </p>
                            </div>
                          )}
                          <Badge className={`${status.color} flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp CTA */}
          <Card className="mt-8 bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <MessageCircle className="h-12 w-12" />
                  <div>
                    <h3 className="text-xl font-bold">Tem uma indicação agora?</h3>
                    <p className="opacity-80">Envie diretamente pelo WhatsApp e nós registramos para você!</p>
                  </div>
                </div>
                <Button 
                  variant="zen" 
                  size="lg"
                  asChild
                >
                  <a {...getWhatsAppAnchorPropsByKey("parceiroIndicacao")}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Indicar via WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
