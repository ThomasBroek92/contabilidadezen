import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Eye, 
  Globe, 
  Monitor, 
  Smartphone,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const avgSession = cache?.avg_session?.metric_value as { seconds?: number; formatted?: string } | undefined;
  const bounceRate = cache?.bounce_rate?.metric_value as { rate?: number; trend?: number } | undefined;
  const topPages = cache?.top_pages?.metric_value as unknown as Array<{ page: string; views: number }> | undefined;
  const topCountries = cache?.top_countries?.metric_value as unknown as Array<{ country: string; visitors: number; flag: string }> | undefined;
  const devices = cache?.devices?.metric_value as { desktop?: number; mobile?: number; tablet?: number } | undefined;

  const handleManualSync = async () => {
    await supabase.functions.invoke('sync-analytics');
    refetch();
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null;
    if (trend > 0) return <ArrowUpRight className="h-3 w-3 text-green-600" />;
    if (trend < 0) return <ArrowDownRight className="h-3 w-3 text-red-600" />;
    return null;
  };

  const getTrendColor = (trend?: number) => {
    if (!trend) return 'text-muted-foreground';
    if (trend > 0) return 'text-green-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {lastSync?.timestamp 
                  ? `Última atualização: ${format(new Date(lastSync.timestamp), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}`
                  : 'Aguardando primeira sincronização'
                }
              </span>
            </div>
            <p className="text-xs text-muted-foreground/60">
              Sincronização automática às 3h da manhã (horário de Brasília)
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualSync} 
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Visitantes"
            value={(visitors?.total || 0).toLocaleString('pt-BR')}
            trend={visitors?.trend}
            icon={Users}
            tooltip="Número de visitantes únicos nos últimos 30 dias"
          />
          <MetricCard
            title="Pageviews"
            value={(pageviews?.total || 0).toLocaleString('pt-BR')}
            trend={pageviews?.trend}
            icon={Eye}
            tooltip="Total de páginas visualizadas nos últimos 30 dias"
          />
          <MetricCard
            title="Taxa de Rejeição"
            value={`${bounceRate?.rate || 0}%`}
            trend={bounceRate?.trend ? -bounceRate.trend : undefined} // Inverted: lower is better
            icon={TrendingDown}
            tooltip="Porcentagem de visitantes que saem sem interagir"
          />
          <MetricCard
            title="Tempo Médio"
            value={avgSession?.formatted || '0:00'}
            icon={Clock}
            tooltip="Duração média de uma sessão no site"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card className="border-[#E9E9E7] dark:border-[#2F2F2F] shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Páginas Mais Visitadas
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground/50" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Top 5 páginas com mais visualizações</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(topPages || []).length > 0 ? (
                topPages?.slice(0, 5).map((page, index) => {
                  const maxViews = Math.max(...(topPages?.map(p => p.views) || [1]));
                  const percentage = (page.views / maxViews) * 100;
                  
                  return (
                    <div key={page.page} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                          <span className="truncate max-w-[180px]">{page.page}</span>
                        </div>
                        <span className="font-medium tabular-nums">{page.views}</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Nenhum dado disponível
                </p>
              )}
            </CardContent>
          </Card>

          {/* Right Column: Countries & Devices */}
          <div className="space-y-6">
            {/* Countries */}
            <Card className="border-[#E9E9E7] dark:border-[#2F2F2F] shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Países
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground/50" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Distribuição geográfica dos visitantes</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(topCountries || []).length > 0 ? (
                  topCountries?.map((country) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <span className="text-sm">{country.flag} {country.country}</span>
                      <span className="text-sm font-medium tabular-nums">{country.visitors}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-2 text-center">
                    Nenhum dado disponível
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Devices */}
            <Card className="border-[#E9E9E7] dark:border-[#2F2F2F] shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  Dispositivos
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground/50" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Tipo de dispositivo usado para acessar o site</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <DeviceRow 
                    icon={Monitor} 
                    label="Desktop" 
                    value={devices?.desktop || 0} 
                    color="hsl(var(--primary))"
                  />
                  <DeviceRow 
                    icon={Smartphone} 
                    label="Mobile" 
                    value={devices?.mobile || 0} 
                    color="hsl(221, 83%, 53%)"
                  />
                  <DeviceRow 
                    icon={Tablet} 
                    label="Tablet" 
                    value={devices?.tablet || 0} 
                    color="hsl(142, 71%, 45%)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ElementType;
  tooltip: string;
}

function MetricCard({ title, value, trend, icon: Icon, tooltip }: MetricCardProps) {
  const getTrendColor = (t?: number) => {
    if (!t) return 'text-muted-foreground';
    if (t > 0) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-[#E9E9E7] dark:border-[#2F2F2F] shadow-none">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs text-muted-foreground">{title}</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
              {trend !== undefined && trend !== 0 && (
                <span className={`flex items-center text-xs ${getTrendColor(trend)}`}>
                  {trend > 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
          </div>
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DeviceRowProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

function DeviceRow({ icon: Icon, label, value, color }: DeviceRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span className="font-medium">{value}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all" 
            style={{ width: `${value}%`, backgroundColor: color }} 
          />
        </div>
      </div>
    </div>
  );
}
