import { useState, useEffect } from "react";
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
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CachedAnalytics {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: { path: string; views: number }[];
  topCountries: { label: string; value: number }[];
  devices: { desktop: number; mobile: number };
  lastUpdated: string;
}

// Mock data - in production this would come from a cached table
const getMockAnalytics = (): CachedAnalytics => ({
  visitors: 1247,
  pageviews: 3892,
  bounceRate: 42.5,
  avgSessionDuration: "2m 34s",
  topPages: [
    { path: "/", views: 892 },
    { path: "/blog", views: 456 },
    { path: "/servicos", views: 312 },
    { path: "/segmentos/contabilidade-para-medicos", views: 287 },
    { path: "/contato", views: 198 },
  ],
  topCountries: [
    { label: "Brasil", value: 1089 },
    { label: "Portugal", value: 78 },
    { label: "Estados Unidos", value: 45 },
  ],
  devices: { desktop: 58, mobile: 42 },
  lastUpdated: new Date().toISOString(),
});

export function AnalyticsDashboard() {
  const [data, setData] = useState<CachedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading cached data
    const loadCachedData = async () => {
      setLoading(true);
      // In production, this would fetch from a cached table
      // that's updated daily at 3 AM via cron job
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(getMockAnalytics());
      setLoading(false);
    };

    loadCachedData();
  }, []);

  const handleRefresh = () => {
    toast.info("Os dados são atualizados automaticamente às 3h da manhã.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Dados de analytics não disponíveis.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Last Updated */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Última atualização: {format(new Date(data.lastUpdated), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Atualização diária às 3h
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Visitantes"
            value={data.visitors.toLocaleString('pt-BR')}
            icon={Users}
            tooltip="Número de visitantes únicos nos últimos 30 dias"
          />
          <MetricCard
            title="Pageviews"
            value={data.pageviews.toLocaleString('pt-BR')}
            icon={Eye}
            tooltip="Total de páginas visualizadas nos últimos 30 dias"
          />
          <MetricCard
            title="Taxa de Rejeição"
            value={`${data.bounceRate}%`}
            icon={TrendingUp}
            tooltip="Porcentagem de visitantes que saem sem interagir"
          />
          <MetricCard
            title="Tempo Médio"
            value={data.avgSessionDuration}
            icon={Clock}
            tooltip="Duração média de uma sessão no site"
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
              {data.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                    <span className="text-sm truncate max-w-[200px]">{page.path}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{page.views}</span>
                </div>
              ))}
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
                {data.topCountries.map((country) => (
                  <div key={country.label} className="flex items-center justify-between">
                    <span className="text-sm">{country.label}</span>
                    <span className="text-sm font-medium tabular-nums">{country.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Devices */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Desktop</span>
                    <Badge variant="secondary" className="text-xs">{data.devices.desktop}%</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Mobile</span>
                    <Badge variant="secondary" className="text-xs">{data.devices.mobile}%</Badge>
                  </div>
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
  icon: React.ElementType;
  tooltip: string;
}

function MetricCard({ title, value, icon: Icon, tooltip }: MetricCardProps) {
  return (
    <Card>
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