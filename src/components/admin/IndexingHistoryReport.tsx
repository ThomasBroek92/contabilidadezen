import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  Calendar,
  RefreshCw,
  Loader2,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface QueueItem {
  id: string;
  url: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  retry_count: number;
}

interface DailyStats {
  date: string;
  success: number;
  failed: number;
  pending: number;
  total: number;
}

interface OverallStats {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  successRate: number;
  avgRetries: number;
}

const COLORS = {
  success: 'hsl(var(--chart-2))',
  failed: 'hsl(var(--destructive))',
  pending: 'hsl(var(--muted-foreground))'
};

export function IndexingHistoryReport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('7');
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const daysAgo = parseInt(period);
      const startDate = startOfDay(subDays(new Date(), daysAgo));
      
      const { data, error } = await supabase
        .from('indexing_queue')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      const items = (data || []) as QueueItem[];
      setQueueItems(items);

      // Calculate overall stats
      const completed = items.filter(i => i.status === 'completed').length;
      const failed = items.filter(i => i.status === 'failed').length;
      const pending = items.filter(i => i.status === 'pending').length;
      const total = items.length;
      const avgRetries = total > 0 
        ? items.reduce((acc, i) => acc + i.retry_count, 0) / total 
        : 0;

      setOverallStats({
        total,
        completed,
        failed,
        pending,
        successRate: total > 0 ? (completed / (completed + failed)) * 100 : 0,
        avgRetries: Math.round(avgRetries * 100) / 100
      });

      // Calculate daily stats
      const days = eachDayOfInterval({
        start: startDate,
        end: endOfDay(new Date())
      });

      const daily: DailyStats[] = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        
        const dayItems = items.filter(item => {
          const createdAt = new Date(item.created_at);
          return createdAt >= dayStart && createdAt <= dayEnd;
        });

        return {
          date: format(day, 'dd/MM', { locale: ptBR }),
          success: dayItems.filter(i => i.status === 'completed').length,
          failed: dayItems.filter(i => i.status === 'failed').length,
          pending: dayItems.filter(i => i.status === 'pending').length,
          total: dayItems.length
        };
      });

      setDailyStats(daily);

    } catch (error) {
      console.error('Error fetching indexing history:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: error instanceof Error ? error.message : 'Falha ao buscar histórico',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const pieData = overallStats ? [
    { name: 'Sucesso', value: overallStats.completed, color: COLORS.success },
    { name: 'Falha', value: overallStats.failed, color: COLORS.failed },
    { name: 'Pendente', value: overallStats.pending, color: COLORS.pending }
  ].filter(d => d.value > 0) : [];

  const getSuccessRateTrend = () => {
    if (dailyStats.length < 2) return null;
    
    const recentDays = dailyStats.slice(-3);
    const olderDays = dailyStats.slice(0, Math.min(3, dailyStats.length - 3));
    
    if (olderDays.length === 0) return null;

    const recentRate = recentDays.reduce((acc, d) => acc + d.success, 0) / 
      Math.max(1, recentDays.reduce((acc, d) => acc + d.success + d.failed, 0));
    const olderRate = olderDays.reduce((acc, d) => acc + d.success, 0) / 
      Math.max(1, olderDays.reduce((acc, d) => acc + d.success + d.failed, 0));
    
    const diff = (recentRate - olderRate) * 100;
    return { value: Math.abs(diff).toFixed(1), isUp: diff >= 0 };
  };

  const trend = getSuccessRateTrend();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Relatório Histórico de Indexação
          </h3>
          <p className="text-sm text-muted-foreground">
            Métricas de sucesso/falha ao longo do tempo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="14">Últimos 14 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {overallStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <BarChart3 className="h-4 w-4" />
              Total
            </div>
            <p className="text-2xl font-bold">{overallStats.total}</p>
            <p className="text-xs text-muted-foreground">solicitações</p>
          </Card>
          
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
              <CheckCircle className="h-4 w-4" />
              Sucesso
            </div>
            <p className="text-2xl font-bold text-green-700">{overallStats.completed}</p>
            <p className="text-xs text-green-600">{overallStats.successRate.toFixed(1)}% taxa</p>
          </Card>
          
          <Card className="p-4 bg-red-500/10 border-red-500/20">
            <div className="flex items-center gap-2 text-red-700 text-sm mb-1">
              <XCircle className="h-4 w-4" />
              Falhas
            </div>
            <p className="text-2xl font-bold text-red-700">{overallStats.failed}</p>
            <p className="text-xs text-red-600">{overallStats.avgRetries} retentativas/item</p>
          </Card>
          
          <Card className="p-4 bg-amber-500/10 border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-700 text-sm mb-1">
              <Clock className="h-4 w-4" />
              Pendentes
            </div>
            <p className="text-2xl font-bold text-amber-700">{overallStats.pending}</p>
            <p className="text-xs text-amber-600">aguardando</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              {trend?.isUp ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              Tendência
            </div>
            {trend ? (
              <>
                <p className={`text-2xl font-bold ${trend.isUp ? 'text-green-700' : 'text-red-700'}`}>
                  {trend.isUp ? '+' : '-'}{trend.value}%
                </p>
                <p className="text-xs text-muted-foreground">vs período anterior</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Dados insuficientes</p>
            )}
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Bar Chart - Daily Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Atividade Diária</CardTitle>
            <CardDescription>Solicitações de indexação por dia</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="success" name="Sucesso" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" name="Falha" fill={COLORS.failed} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pendente" fill={COLORS.pending} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado no período selecionado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição</CardTitle>
            <CardDescription>Status das solicitações</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Success Rate Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Taxa de Sucesso ao Longo do Tempo</CardTitle>
          <CardDescription>Evolução da taxa de indexação bem-sucedida</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyStats.map(d => ({
                ...d,
                successRate: d.success + d.failed > 0 
                  ? Math.round((d.success / (d.success + d.failed)) * 100) 
                  : null
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Taxa de Sucesso']}
                />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke={COLORS.success}
                  strokeWidth={2}
                  dot={{ fill: COLORS.success, strokeWidth: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Nenhum dado no período selecionado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {queueItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atividade Recente</CardTitle>
            <CardDescription>Últimas 10 solicitações de indexação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {queueItems.slice(-10).reverse().map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {item.status === 'pending' && <Clock className="h-4 w-4 text-amber-600" />}
                  {item.status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.url.replace('https://www.contabilidadezen.com.br', '').replace('https://contabilidadezen.com.br', '')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Badge 
                    variant={item.status === 'completed' ? 'default' : item.status === 'failed' ? 'destructive' : 'secondary'}
                    className={item.status === 'completed' ? 'bg-green-600' : ''}
                  >
                    {item.status === 'completed' ? 'Sucesso' : item.status === 'failed' ? 'Falhou' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
