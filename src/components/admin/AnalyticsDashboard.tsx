import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Eye, 
  Globe, 
  Monitor, 
  Smartphone,
  TrendingUp,
  RefreshCw,
  Clock,
  Tablet
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnalyticsMetric {
  metric_name: string;
  metric_value: Record<string, unknown>;
  updated_at: string;
}

export function AnalyticsDashboard() {
  const { data: cache, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['analytics-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_cache')
        .select('*');
      
      if (error) throw error;
      
      const metrics: Record<string, AnalyticsMetric> = {};
      (data as AnalyticsMetric[])?.forEach(item => {
        metrics[item.metric_name] = item;
      });
      return metrics;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const lastSync = cache?.last_sync?.metric_value as { timestamp?: string; status?: string } | undefined;
  const visitors = cache?.visitors?.metric_value as { total?: number; trend?: number } | undefined;
  const pageviews = cache?.pageviews?.metric_value as { total?: number; trend?: number } | undefined;
  const avgSession = cache?.avg_session?.metric_value as { formatted?: string } | undefined;
  const bounceRate = cache?.bounce_rate?.metric_value as { rate?: number; trend?: number } | undefined;
  const topPages = cache?.top_pages?.metric_value as unknown as Array<{ page: string; views: number }> | undefined;
  const topCountries = cache?.top_countries?.metric_value as unknown as Array<{ country: string; visitors: number; flag: string }> | undefined;
  const devices = cache?.devices?.metric_value as { desktop?: number; mobile?: number; tablet?: number } | undefined;

  const handleManualSync = async () => {
    await supabase.functions.invoke('sync-analytics');
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Last Updated */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {lastSync?.timestamp 
              ? `Última atualização: ${format(new Date(lastSync.timestamp), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}`
              : 'Aguardando primeira sincronização'
            }
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleManualSync} 
          disabled={isFetching}
          className="text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Sincronizando...' : 'Sincronizar agora'}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Visitantes"
          value={(visitors?.total || 0).toLocaleString('pt-BR')}
          icon={Users}
        />
        <MetricCard
          title="Pageviews"
          value={(pageviews?.total || 0).toLocaleString('pt-BR')}
          icon={Eye}
        />
        <MetricCard
          title="Taxa de Rejeição"
          value={`${bounceRate?.rate || 0}%`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Tempo Médio"
          value={avgSession?.formatted || '0:00'}
          icon={Clock}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Páginas Mais Visitadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(topPages || []).slice(0, 5).map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                  <span className="text-sm truncate max-w-[200px]">{page.page}</span>
                </div>
                <span className="text-sm font-medium tabular-nums">{page.views}</span>
              </div>
            ))}
            {(!topPages || topPages.length === 0) && (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Countries & Devices */}
        <div className="space-y-6">
          {/* Countries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Países
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(topCountries || []).map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <span className="text-sm">{country.flag} {country.country}</span>
                  <span className="text-sm font-medium tabular-nums">{country.visitors}</span>
                </div>
              ))}
              {(!topCountries || topCountries.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
              )}
            </CardContent>
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Desktop</span>
                  <Badge variant="secondary" className="text-xs">{devices?.desktop || 0}%</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Mobile</span>
                  <Badge variant="secondary" className="text-xs">{devices?.mobile || 0}%</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Tablet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tablet</span>
                  <Badge variant="secondary" className="text-xs">{devices?.tablet || 0}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        Os dados são atualizados automaticamente às 3h da manhã (horário de Brasília)
      </p>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-muted-foreground">{title}</span>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
