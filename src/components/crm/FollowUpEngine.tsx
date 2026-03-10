import { useEffect, useState } from 'react';
import { getWhatsAppLinkForPhone } from '@/lib/whatsapp';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, Mail, MessageSquare, Calendar, Clock, 
  AlertTriangle, TrendingDown, Bell, Plus, Check,
  ArrowRight, Zap, Target
} from 'lucide-react';
import { format, addDays, differenceInDays, isAfter, isBefore, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string | null;
  pipeline_stage: string | null;
  created_at: string;
  data_ultimo_contato: string | null;
  data_proximo_followup: string | null;
  consentimento_lgpd: boolean | null;
  gmv_total: number | null;
  qtd_compras: number | null;
  media_compra_mensal: number | null;
}

interface FollowUpSuggestion {
  leadId: string;
  leadName: string;
  empresa: string | null;
  type: 'proactive' | 'predictive';
  priority: 'high' | 'medium' | 'low';
  daysSinceCreation?: number;
  daysSinceContact?: number;
  suggestedChannel: 'email' | 'whatsapp' | 'phone';
  suggestedAction: string;
  churnScore?: number;
  whatsapp: string;
  email: string;
}

interface FollowUpEngineProps {
  onSelectLead: (leadId: string) => void;
}

// Cadence configuration (D+1, D+3, D+7, D+14, D+30)
const CADENCE_DAYS = [1, 3, 7, 14, 30];
const CADENCE_CHANNELS: Record<number, 'email' | 'whatsapp' | 'phone'> = {
  1: 'whatsapp',
  3: 'email',
  7: 'phone',
  14: 'email',
  30: 'phone',
};

// Downward trend threshold (α = 1.5 standard deviations)
const ALPHA = 1.5;

export function FollowUpEngine({ onSelectLead }: FollowUpEngineProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<FollowUpSuggestion[]>([]);
  const [filter, setFilter] = useState<'all' | 'proactive' | 'predictive'>('all');

  useEffect(() => {
    generateSuggestions();
  }, []);

  const calculateChurnScore = (lead: Lead): number => {
    // Statistical analysis for downward trend detection
    // Using simplified formula: score = (average - current) / std_dev
    const avgMonthly = lead.media_compra_mensal || 0;
    const totalGMV = lead.gmv_total || 0;
    const purchases = lead.qtd_compras || 1;
    
    if (avgMonthly === 0) return 0;
    
    const currentAvg = totalGMV / Math.max(purchases, 1);
    
    // Calculate approximate standard deviation (simplified)
    const stdDev = avgMonthly * 0.3; // Assume 30% variance
    
    // Z-score calculation
    const zScore = (avgMonthly - currentAvg) / Math.max(stdDev, 1);
    
    // If z-score > ALPHA, client is at risk
    return zScore;
  };

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .not('pipeline_stage', 'eq', 'perdido')
        .not('pipeline_stage', 'eq', 'fechamento');

      if (error) throw error;

      const now = new Date();
      const newSuggestions: FollowUpSuggestion[] = [];

      leads?.forEach(lead => {
        // Check LGPD consent before suggesting contact
        if (lead.consentimento_lgpd === false) return;

        const createdAt = new Date(lead.created_at);
        const lastContact = lead.data_ultimo_contato 
          ? new Date(lead.data_ultimo_contato) 
          : createdAt;
        
        const daysSinceCreation = differenceInDays(now, createdAt);
        const daysSinceContact = differenceInDays(now, lastContact);

        // PROACTIVE FLOW: New leads cadence
        if (daysSinceCreation <= 30) {
          // Find the next cadence step
          for (const cadenceDay of CADENCE_DAYS) {
            if (daysSinceContact >= cadenceDay - 1 && daysSinceContact <= cadenceDay + 2) {
              const channel = CADENCE_CHANNELS[cadenceDay];
              const actions: Record<number, string> = {
                1: 'Primeiro contato de boas-vindas',
                3: 'Enviar material educativo ou estudo de caso',
                7: 'Agendar demonstração ou reunião',
                14: 'Apresentar proposta comercial',
                30: 'Reativação ou fechamento',
              };

              newSuggestions.push({
                leadId: lead.id,
                leadName: lead.nome,
                empresa: lead.empresa,
                type: 'proactive',
                priority: cadenceDay <= 3 ? 'high' : cadenceDay <= 7 ? 'medium' : 'low',
                daysSinceCreation,
                daysSinceContact,
                suggestedChannel: channel,
                suggestedAction: actions[cadenceDay],
                whatsapp: lead.whatsapp,
                email: lead.email,
              });
              break;
            }
          }
        }

        // PREDICTIVE FLOW: Downward trend detection
        const churnScore = calculateChurnScore(lead);
        
        if (churnScore > ALPHA) {
          newSuggestions.push({
            leadId: lead.id,
            leadName: lead.nome,
            empresa: lead.empresa,
            type: 'predictive',
            priority: churnScore > 2 ? 'high' : 'medium',
            daysSinceContact,
            suggestedChannel: 'phone',
            suggestedAction: 'Mensagem de resgate - oferecer condição especial',
            churnScore,
            whatsapp: lead.whatsapp,
            email: lead.email,
          });
        }

        // Also flag leads without contact for 7+ days
        if (daysSinceContact >= 7 && !newSuggestions.find(s => s.leadId === lead.id)) {
          newSuggestions.push({
            leadId: lead.id,
            leadName: lead.nome,
            empresa: lead.empresa,
            type: 'proactive',
            priority: daysSinceContact >= 14 ? 'high' : 'medium',
            daysSinceContact,
            suggestedChannel: daysSinceContact >= 14 ? 'phone' : 'whatsapp',
            suggestedAction: `Reativar contato - ${daysSinceContact} dias sem interação`,
            whatsapp: lead.whatsapp,
            email: lead.email,
          });
        }
      });

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      newSuggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Error generating suggestions:', err);
      toast({
        title: 'Erro ao gerar sugestões',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createFollowUpTask = async (suggestion: FollowUpSuggestion) => {
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .insert({
          lead_id: suggestion.leadId,
          titulo: `Follow-up: ${suggestion.suggestedAction}`,
          descricao: `Canal sugerido: ${getChannelLabel(suggestion.suggestedChannel)}`,
          data_vencimento: new Date().toISOString(),
          prioridade: suggestion.priority === 'high' ? 'alta' : suggestion.priority === 'medium' ? 'media' : 'baixa',
        });

      if (error) throw error;

      toast({ title: 'Tarefa de follow-up criada!' });
      
      // Update next follow-up date
      await supabase
        .from('leads')
        .update({ data_proximo_followup: addDays(new Date(), 3).toISOString() })
        .eq('id', suggestion.leadId);

    } catch (err) {
      console.error('Error creating task:', err);
      toast({
        title: 'Erro ao criar tarefa',
        variant: 'destructive',
      });
    }
  };

  const openChannel = (suggestion: FollowUpSuggestion) => {
    if (suggestion.suggestedChannel === 'whatsapp') {
      const { getWhatsAppLinkForPhone } = require("@/lib/whatsapp");
      window.open(getWhatsAppLinkForPhone(suggestion.whatsapp), '_blank');
    } else if (suggestion.suggestedChannel === 'email') {
      window.open(`mailto:${suggestion.email}`, '_blank');
    }
  };

  const getChannelLabel = (channel: string) => {
    const labels: Record<string, string> = {
      email: 'E-mail',
      whatsapp: 'WhatsApp',
      phone: 'Telefone',
    };
    return labels[channel] || channel;
  };

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, typeof Mail> = {
      email: Mail,
      whatsapp: MessageSquare,
      phone: Phone,
    };
    return icons[channel] || Mail;
  };

  const filteredSuggestions = suggestions.filter(s => 
    filter === 'all' || s.type === filter
  );

  const proactiveCount = suggestions.filter(s => s.type === 'proactive').length;
  const predictiveCount = suggestions.filter(s => s.type === 'predictive').length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Total de Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestions.length}</div>
            <p className="text-xs text-muted-foreground">ações sugeridas</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all border-l-4 border-l-warning ${filter === 'proactive' ? 'ring-2 ring-warning' : ''}`}
          onClick={() => setFilter('proactive')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Cadência Proativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{proactiveCount}</div>
            <p className="text-xs text-muted-foreground">leads novos para contato</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all border-l-4 border-l-destructive ${filter === 'predictive' ? 'ring-2 ring-destructive' : ''}`}
          onClick={() => setFilter('predictive')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Alerta de Churn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{predictiveCount}</div>
            <p className="text-xs text-muted-foreground">clientes em risco</p>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {filteredSuggestions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-lg font-medium">Tudo em dia!</p>
              <p className="text-muted-foreground">Nenhum follow-up pendente nesta categoria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const ChannelIcon = getChannelIcon(suggestion.suggestedChannel);
            const isHighPriority = suggestion.priority === 'high';
            const isPredictive = suggestion.type === 'predictive';

            return (
              <Card 
                key={`${suggestion.leadId}-${suggestion.type}`}
                className={`transition-all hover:shadow-md ${
                  isPredictive 
                    ? 'border-l-4 border-l-destructive bg-destructive/5' 
                    : isHighPriority 
                      ? 'border-l-4 border-l-warning bg-warning/5'
                      : 'border-l-4 border-l-muted'
                }`}
              >
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 
                          className="font-semibold cursor-pointer hover:underline"
                          onClick={() => onSelectLead(suggestion.leadId)}
                        >
                          {suggestion.leadName}
                        </h3>
                        {suggestion.empresa && (
                          <span className="text-sm text-muted-foreground">
                            • {suggestion.empresa}
                          </span>
                        )}
                        <Badge 
                          variant={isPredictive ? 'destructive' : isHighPriority ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {isPredictive ? (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Churn Risk
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              {suggestion.priority === 'high' ? 'Urgente' : suggestion.priority === 'medium' ? 'Médio' : 'Baixo'}
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {suggestion.suggestedAction}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ChannelIcon className="h-3 w-3" />
                          Canal: {getChannelLabel(suggestion.suggestedChannel)}
                        </span>
                        {suggestion.daysSinceContact !== undefined && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {suggestion.daysSinceContact} dias sem contato
                          </span>
                        )}
                        {suggestion.churnScore !== undefined && (
                          <span className="flex items-center gap-1 text-destructive">
                            <TrendingDown className="h-3 w-3" />
                            Score: {suggestion.churnScore.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openChannel(suggestion)}
                        disabled={suggestion.suggestedChannel === 'phone'}
                      >
                        <ChannelIcon className="h-4 w-4 mr-2" />
                        {isPredictive ? 'Enviar Resgate' : 'Contatar'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => createFollowUpTask(suggestion)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Tarefa
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectLead(suggestion.leadId)}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
