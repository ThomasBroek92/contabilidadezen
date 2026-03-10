import { useEffect, useState } from 'react';
import { getWhatsAppLinkForPhone } from '@/lib/whatsapp';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, Clock, TrendingDown, CheckCircle2, 
  Calendar, Phone, MessageSquare, Bell, Target,
  ArrowRight, RefreshCw, Zap
} from 'lucide-react';
import { format, differenceInDays, isToday, isPast, addDays } from 'date-fns';
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
  gmv_total: number | null;
  qtd_compras: number | null;
  media_compra_mensal: number | null;
}

interface Task {
  id: string;
  lead_id: string;
  titulo: string;
  descricao: string | null;
  data_vencimento: string;
  concluida: boolean;
  prioridade: string;
  lead?: Lead;
}

interface AlertsDashboardProps {
  onSelectLead: (leadId: string) => void;
}

// Downward trend threshold
const ALPHA = 1.5;

export function AlertsDashboard({ onSelectLead }: AlertsDashboardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [churnRiskLeads, setChurnRiskLeads] = useState<Lead[]>([]);
  const [overdueFollowups, setOverdueFollowups] = useState<Lead[]>([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const calculateChurnScore = (lead: Lead): number => {
    const avgMonthly = lead.media_compra_mensal || 0;
    const totalGMV = lead.gmv_total || 0;
    const purchases = lead.qtd_compras || 1;
    
    if (avgMonthly === 0) return 0;
    
    const currentAvg = totalGMV / Math.max(purchases, 1);
    const stdDev = avgMonthly * 0.3;
    
    return (avgMonthly - currentAvg) / Math.max(stdDev, 1);
  };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const now = new Date();
      
      // Fetch all tasks with lead info
      const { data: tasks, error: tasksError } = await supabase
        .from('lead_tasks')
        .select('*')
        .eq('concluida', false)
        .order('data_vencimento', { ascending: true });

      if (tasksError) throw tasksError;

      // Fetch leads
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .not('pipeline_stage', 'eq', 'perdido')
        .not('pipeline_stage', 'eq', 'fechamento');

      if (leadsError) throw leadsError;

      // Map leads by ID
      const leadsMap = new Map(leads?.map(l => [l.id, l]));

      // Process tasks
      const processedTasks = tasks?.map(t => ({
        ...t,
        lead: leadsMap.get(t.lead_id),
      })) || [];

      // Separate overdue and today's tasks
      const overdue = processedTasks.filter(t => {
        const dueDate = new Date(t.data_vencimento);
        return isPast(dueDate) && !isToday(dueDate);
      });

      const today = processedTasks.filter(t => {
        const dueDate = new Date(t.data_vencimento);
        return isToday(dueDate);
      });

      setOverdueTasks(overdue);
      setTodayTasks(today);

      // Find churn risk leads (downward trend)
      const atRisk = leads?.filter(lead => {
        const score = calculateChurnScore(lead);
        return score > ALPHA;
      }) || [];

      setChurnRiskLeads(atRisk);

      // Find overdue follow-ups
      const sevenDaysAgo = addDays(now, -7);
      const overdueFollowupLeads = leads?.filter(lead => {
        if (lead.data_proximo_followup) {
          return isPast(new Date(lead.data_proximo_followup));
        }
        if (lead.data_ultimo_contato) {
          return new Date(lead.data_ultimo_contato) < sevenDaysAgo;
        }
        return differenceInDays(now, new Date(lead.created_at)) > 3;
      }) || [];

      setOverdueFollowups(overdueFollowupLeads);

    } catch (err) {
      console.error('Error fetching alerts:', err);
      toast({
        title: 'Erro ao carregar alertas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .update({ concluida: true })
        .eq('id', taskId);

      if (error) throw error;

      // Remove from lists
      setOverdueTasks(prev => prev.filter(t => t.id !== taskId));
      setTodayTasks(prev => prev.filter(t => t.id !== taskId));

      toast({ title: 'Tarefa concluída!' });
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const openWhatsApp = (whatsapp: string) => {
    const { getWhatsAppLinkForPhone } = require("@/lib/whatsapp");
    window.open(getWhatsAppLinkForPhone(whatsapp), '_blank');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-muted rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={overdueTasks.length > 0 ? 'border-destructive bg-destructive/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Atrasadas</p>
                <p className={`text-2xl font-bold ${overdueTasks.length > 0 ? 'text-destructive' : ''}`}>
                  {overdueTasks.length}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${overdueTasks.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Hoje</p>
                <p className="text-2xl font-bold">{todayTasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className={churnRiskLeads.length > 0 ? 'border-destructive bg-destructive/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risco de Churn</p>
                <p className={`text-2xl font-bold ${churnRiskLeads.length > 0 ? 'text-destructive' : ''}`}>
                  {churnRiskLeads.length}
                </p>
              </div>
              <TrendingDown className={`h-8 w-8 ${churnRiskLeads.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={overdueFollowups.length > 0 ? 'border-warning bg-warning/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Follow-ups Pendentes</p>
                <p className={`text-2xl font-bold ${overdueFollowups.length > 0 ? 'text-warning' : ''}`}>
                  {overdueFollowups.length}
                </p>
              </div>
              <Clock className={`h-8 w-8 ${overdueFollowups.length > 0 ? 'text-warning' : 'text-muted-foreground'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <Card className={overdueTasks.length > 0 ? 'border-destructive' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className={`h-5 w-5 ${overdueTasks.length > 0 ? 'text-destructive' : ''}`} />
              Tarefas Atrasadas
              {overdueTasks.length > 0 && (
                <Badge variant="destructive">{overdueTasks.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>Tarefas que passaram da data de vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {overdueTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>Nenhuma tarefa atrasada!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {overdueTasks.map(task => (
                    <div 
                      key={task.id}
                      className="p-3 rounded-lg border border-destructive/30 bg-destructive/5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.titulo}</p>
                          {task.lead && (
                            <p 
                              className="text-xs text-muted-foreground cursor-pointer hover:underline"
                              onClick={() => onSelectLead(task.lead_id)}
                            >
                              {task.lead.nome} {task.lead.empresa && `• ${task.lead.empresa}`}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getPriorityColor(task.prioridade)} className="text-xs">
                              {task.prioridade}
                            </Badge>
                            <span className="text-xs text-destructive">
                              {differenceInDays(new Date(), new Date(task.data_vencimento))} dias atrasada
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => completeTask(task.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Tarefas de Hoje
              {todayTasks.length > 0 && (
                <Badge variant="default">{todayTasks.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>Seu calendário de acompanhamento para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {todayTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2" />
                  <p>Nenhuma tarefa para hoje</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <div 
                      key={task.id}
                      className="p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.titulo}</p>
                          {task.lead && (
                            <p 
                              className="text-xs text-muted-foreground cursor-pointer hover:underline"
                              onClick={() => onSelectLead(task.lead_id)}
                            >
                              {task.lead.nome} {task.lead.empresa && `• ${task.lead.empresa}`}
                            </p>
                          )}
                          <Badge variant={getPriorityColor(task.prioridade)} className="text-xs mt-1">
                            {task.prioridade}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {task.lead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openWhatsApp(task.lead!.whatsapp)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => completeTask(task.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Churn Risk Alerts */}
        <Card className={churnRiskLeads.length > 0 ? 'border-destructive' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className={`h-5 w-5 ${churnRiskLeads.length > 0 ? 'text-destructive' : ''}`} />
              Clientes em Risco de Churn
              {churnRiskLeads.length > 0 && (
                <Badge variant="destructive">{churnRiskLeads.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>Queda detectada no volume de compras (μ - {ALPHA}σ)</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {churnRiskLeads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>Nenhum cliente em risco detectado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {churnRiskLeads.map(lead => {
                    const score = calculateChurnScore(lead);
                    return (
                      <div 
                        key={lead.id}
                        className="p-3 rounded-lg border border-destructive/30 bg-destructive/5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p 
                              className="font-medium text-sm cursor-pointer hover:underline"
                              onClick={() => onSelectLead(lead.id)}
                            >
                              {lead.nome}
                            </p>
                            {lead.empresa && (
                              <p className="text-xs text-muted-foreground">{lead.empresa}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-xs">
                              <span className="text-destructive font-medium">
                                Score: {score.toFixed(2)}
                              </span>
                              <span className="text-muted-foreground">
                                Média: R$ {lead.media_compra_mensal?.toLocaleString('pt-BR') || 0}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openWhatsApp(lead.whatsapp)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Resgate
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Overdue Follow-ups */}
        <Card className={overdueFollowups.length > 0 ? 'border-warning' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className={`h-5 w-5 ${overdueFollowups.length > 0 ? 'text-warning' : ''}`} />
              Follow-ups Pendentes
              {overdueFollowups.length > 0 && (
                <Badge className="bg-warning text-warning-foreground">{overdueFollowups.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>Leads aguardando contato há mais de 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {overdueFollowups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>Todos os follow-ups em dia!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {overdueFollowups.map(lead => {
                    const lastContact = lead.data_ultimo_contato 
                      ? new Date(lead.data_ultimo_contato)
                      : new Date(lead.created_at);
                    const daysSince = differenceInDays(new Date(), lastContact);
                    
                    return (
                      <div 
                        key={lead.id}
                        className="p-3 rounded-lg border border-warning/30 bg-warning/5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p 
                              className="font-medium text-sm cursor-pointer hover:underline"
                              onClick={() => onSelectLead(lead.id)}
                            >
                              {lead.nome}
                            </p>
                            {lead.empresa && (
                              <p className="text-xs text-muted-foreground">{lead.empresa}</p>
                            )}
                            <p className="text-xs text-warning mt-1">
                              {daysSince} dias sem contato
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openWhatsApp(lead.whatsapp)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onSelectLead(lead.id)}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={fetchAlerts}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar Alertas
        </Button>
      </div>
    </div>
  );
}
