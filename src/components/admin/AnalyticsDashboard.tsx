import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Globe, 
  Monitor, 
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";

interface AnalyticsData {
  visitors: number;
  pageviews: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: { label: string; value: number }[];
  topCountries: { label: string; value: number }[];
  devices: { desktop: number; mobile: number };
}

// Country code to name mapping
const countryNames: Record<string, string> = {
  BR: "Brasil",
  US: "Estados Unidos",
  FR: "França",
  PT: "Portugal",
  AR: "Argentina",
  MX: "México",
  ES: "Espanha",
  DE: "Alemanha",
  UK: "Reino Unido",
  CA: "Canadá",
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulated analytics data based on actual Lovable analytics
    // In production, this would fetch from an API endpoint
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data based on actual analytics structure
        setData({
          visitors: 19,
          pageviews: 98,
          avgSessionDuration: 567,
          bounceRate: 34,
          topPages: [
            { label: "/", value: 19 },
            { label: "/contato", value: 6 },
            { label: "/servicos", value: 5 },
            { label: "/segmentos/contabilidade-para-medicos", value: 4 },
            { label: "/conteudo/calculadora-pj-clt", value: 4 },
          ],
          topCountries: [
            { label: "BR", value: 12 },
            { label: "US", value: 6 },
            { label: "FR", value: 1 },
          ],
          devices: { desktop: 15, mobile: 4 },
        });
      } catch (err) {
        setError("Erro ao carregar analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatPagePath = (path: string) => {
    if (path === "/") return "Página Inicial";
    return path
      .replace(/^\//, "")
      .replace(/-/g, " ")
      .replace(/\//g, " › ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{error || "Dados não disponíveis"}</p>
        </CardContent>
      </Card>
    );
  }

  const totalDevices = data.devices.desktop + data.devices.mobile;
  const desktopPercent = Math.round((data.devices.desktop / totalDevices) * 100);
  const mobilePercent = Math.round((data.devices.mobile / totalDevices) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Analytics (Últimos 7 dias)</h2>
        <span className="text-xs text-muted-foreground">Atualizado agora</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visitantes</p>
                <p className="text-2xl font-bold text-foreground">{data.visitors}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12% vs semana anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pageviews</p>
                <p className="text-2xl font-bold text-foreground">{data.pageviews}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+8% vs semana anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo médio</p>
                <p className="text-2xl font-bold text-foreground">{formatDuration(data.avgSessionDuration)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+5% vs semana anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de rejeição</p>
                <p className="text-2xl font-bold text-foreground">{data.bounceRate}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
              <ArrowDownRight className="h-3 w-3" />
              <span>-3% vs semana anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Páginas mais visitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPages.map((page, index) => (
                <div key={page.label} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {formatPagePath(page.label)}
                    </p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-secondary h-1.5 rounded-full" 
                        style={{ width: `${(page.value / data.topPages[0].value) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{page.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Countries & Devices */}
        <div className="space-y-6">
          {/* Countries */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Países
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.topCountries.map((country) => (
                  <div key={country.label} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      {countryNames[country.label] || country.label}
                    </span>
                    <span className="text-sm font-medium">{country.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Dispositivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Desktop</span>
                  </div>
                  <span className="text-sm font-medium">{desktopPercent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full" 
                    style={{ width: `${desktopPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Mobile</span>
                  </div>
                  <span className="text-sm font-medium">{mobilePercent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${mobilePercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
