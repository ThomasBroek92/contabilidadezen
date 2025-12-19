import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, TrendingUp, DollarSign, AlertTriangle, 
  Phone, Clock, Target, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

interface DashboardMetrics {
  totalLeads: number;
  leadsThisMonth: number;
  pipelineValue: number;
  conversionRate: number;
  pendingFollowups: number;
  overdueTasks: number;
  avgDealValue: number;
  leadsByStage: Record<string, number>;
}

export function CRMDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    leadsThisMonth: 0,
    pipelineValue: 0,
    conversionRate: 0,
    pendingFollowups: 0,
    overdueTasks: 0,
    avgDealValue: 0,
    leadsByStage: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Fetch all leads
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');

      if (error) throw error;

      // Calculate metrics
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const leadsThisMonth = leads?.filter(
        l => new Date(l.created_at) >= startOfMonth
      ).length || 0;

      const pipelineValue = leads?.reduce(
        (sum, l) => sum + (l.valor_negocio || 0), 0
      ) || 0;

      const closedDeals = leads?.filter(
        l => l.pipeline_stage === 'fechamento'
      ).length || 0;

      const lostDeals = leads?.filter(
        l => l.pipeline_stage === 'perdido'
      ).length || 0;

      const totalDeals = closedDeals + lostDeals;
      const conversionRate = totalDeals > 0 
        ? (closedDeals / totalDeals) * 100 
        : 0;

      const avgDealValue = closedDeals > 0
        ? leads?.filter(l => l.pipeline_stage === 'fechamento')
            .reduce((sum, l) => sum + (l.valor_negocio || 0), 0) / closedDeals
        : 0;

      // Count leads by stage
      const leadsByStage: Record<string, number> = {};
      leads?.forEach(lead => {
        const stage = lead.pipeline_stage || 'primeiro_contato';
        leadsByStage[stage] = (leadsByStage[stage] || 0) + 1;
      });

      // Fetch pending tasks
      const { data: tasks } = await supabase
        .from('lead_tasks')
        .select('*')
        .eq('concluida', false);

      const overdueTasks = tasks?.filter(
        t => new Date(t.data_vencimento) < now
      ).length || 0;

      // Pending follow-ups (leads without contact in last 7 days)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const pendingFollowups = leads?.filter(l => {
        if (!l.data_ultimo_contato) return true;
        return new Date(l.data_ultimo_contato) < sevenDaysAgo;
      }).length || 0;

      setMetrics({
        totalLeads: leads?.length || 0,
        leadsThisMonth,
        pipelineValue,
        conversionRate,
        pendingFollowups,
        overdueTasks,
        avgDealValue,
        leadsByStage,
      });
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const stageLabels: Record<string, string> = {
    primeiro_contato: 'Primeiro Contato',
    qualificacao: 'Qualificação',
    proposta: 'Proposta',
    negociacao: 'Negociação',
    fechamento: 'Fechamento',
    perdido: 'Perdido',
  };

  const stageColors: Record<string, string> = {
    primeiro_contato: 'bg-blue-500',
    qualificacao: 'bg-yellow-500',
    proposta: 'bg-purple-500',
    negociacao: 'bg-orange-500',
    fechamento: 'bg-green-500',
    perdido: 'bg-red-500',
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Leads
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +{metrics.leadsThisMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor do Pipeline
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.pipelineValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Média: {formatCurrency(metrics.avgDealValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.leadsByStage.fechamento || 0} fechados
            </p>
          </CardContent>
        </Card>

        <Card className={metrics.overdueTasks > 0 ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tarefas Atrasadas
            </CardTitle>
            <AlertTriangle className={`h-4 w-4 ${metrics.overdueTasks > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.overdueTasks > 0 ? 'text-destructive' : ''}`}>
              {metrics.overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.pendingFollowups} follow-ups pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Funil de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stageLabels).map(([stage, label]) => {
              const count = metrics.leadsByStage[stage] || 0;
              const percentage = metrics.totalLeads > 0 
                ? (count / metrics.totalLeads) * 100 
                : 0;
              
              return (
                <div key={stage} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{count} leads ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stageColors[stage]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
