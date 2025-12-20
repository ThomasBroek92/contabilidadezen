import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Users, MousePointerClick, DollarSign, Eye, FileText, Calendar, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface BlogPost {
  id: string;
  title: string;
  views: number;
  ctr: number;
  leads_gerados: number;
  roi: number;
  etapa_funil: string;
  objetivo: string;
  status: string;
  editorial_status: string;
  published_at: string | null;
  category: string;
}

interface Stats {
  totalPosts: number;
  totalViews: number;
  avgCtr: number;
  totalLeads: number;
  totalRoi: number;
  publishedCount: number;
  scheduledCount: number;
  draftCount: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function EditorialDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, views, ctr, leads_gerados, roi, etapa_funil, objetivo, status, editorial_status, published_at, category');

    if (error) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      const postsData = data || [];
      setPosts(postsData);
      
      // Calculate stats
      const totalViews = postsData.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalCtr = postsData.reduce((sum, p) => sum + (p.ctr || 0), 0);
      const totalLeads = postsData.reduce((sum, p) => sum + (p.leads_gerados || 0), 0);
      const totalRoi = postsData.reduce((sum, p) => sum + (p.roi || 0), 0);
      
      setStats({
        totalPosts: postsData.length,
        totalViews,
        avgCtr: postsData.length > 0 ? totalCtr / postsData.length : 0,
        totalLeads,
        totalRoi,
        publishedCount: postsData.filter(p => p.status === 'published').length,
        scheduledCount: postsData.filter(p => p.status === 'scheduled').length,
        draftCount: postsData.filter(p => p.status === 'draft').length,
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prepare chart data
  const funnelData = [
    { name: 'Topo', value: posts.filter(p => p.etapa_funil === 'topo').length },
    { name: 'Meio', value: posts.filter(p => p.etapa_funil === 'meio').length },
    { name: 'Fundo', value: posts.filter(p => p.etapa_funil === 'fundo').length },
  ];

  const objectiveData = [
    { name: 'Tráfego', value: posts.filter(p => p.objetivo === 'trafego').length },
    { name: 'Leads', value: posts.filter(p => p.objetivo === 'leads').length },
    { name: 'Autoridade', value: posts.filter(p => p.objetivo === 'autoridade').length },
  ];

  const categoryData = posts.reduce((acc: Record<string, number>, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Top performing posts
  const topPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="default" className="text-xs">{stats?.publishedCount} pub.</Badge>
              <Badge variant="secondary" className="text-xs">{stats?.scheduledCount} agend.</Badge>
              <Badge variant="outline" className="text-xs">{stats?.draftCount} rasc.</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.totalViews || 0).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR Médio</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.avgCtr || 0).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taxa de cliques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.totalLeads || 0).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Via blog posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(stats?.totalRoi || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Retorno estimado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Distribuição por Funil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={funnelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {funnelData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Objective Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Objetivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={objectiveData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">🏆 Top 5 Posts por Visualizações</CardTitle>
        </CardHeader>
        <CardContent>
          {topPosts.length > 0 ? (
            <div className="space-y-3">
              {topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.etapa_funil && `Funil: ${post.etapa_funil}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-medium">{(post.views || 0).toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{(post.ctr || 0).toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">CTR</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{post.leads_gerados || 0}</p>
                        <p className="text-xs text-muted-foreground">leads</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum post com métricas disponíveis
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
