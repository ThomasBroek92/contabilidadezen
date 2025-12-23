import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Plus, 
  Search, 
  Sparkles, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  CalendarDays,
  Columns3,
  BarChart3,
  TrendingUp,
  Zap,
  RefreshCw,
  Lightbulb,
  Settings,
  Quote,
  Check,
  Target,
  PenTool,
  Layers
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EditorialCalendar } from './editorial/EditorialCalendar';
import { EditorialKanban } from './editorial/EditorialKanban';
import { PostEditorDialog } from './editorial/PostEditorDialog';
import { TopicDialog } from './editorial/TopicDialog';
import { BatchGenerationDialog } from './editorial/BatchGenerationDialog';
import { RecurringSchedulesManager } from './editorial/RecurringSchedulesManager';
import { useEditorialData, BlogPost, BlogTopic } from './editorial/useEditorialData';
import { GEOAnalyticsDashboard } from './GEOAnalyticsDashboard';

// Tipos
interface GEOSettings {
  id: string;
  min_geo_score_publish: number;
  brand_name: string;
  target_personas: string[];
  brand_authority_keywords: string[];
}

interface TopicSuggestion {
  topic: string;
  category: string;
  search_query: string;
  geo_potential: 'alto' | 'medio' | 'baixo';
  reasoning: string;
}

// Componente principal
export function ContentStudio() {
  const { toast } = useToast();
  const { posts, topics, loading, fetchPosts, fetchTopics, fetchAll } = useEditorialData();
  
  // Estados de UI
  const [activeView, setActiveView] = useState<'overview' | 'create' | 'manage' | 'calendar' | 'kanban' | 'analytics'>('overview');
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingTopic, setEditingTopic] = useState<BlogTopic | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);
  
  // Estados de busca/filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Estados de operações
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [suggestingTopics, setSuggestingTopics] = useState(false);
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  
  // Estados de configurações GEO
  const [geoSettings, setGeoSettings] = useState<GEOSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Carrega configurações GEO
  useEffect(() => {
    fetchGeoSettings();
  }, []);

  const fetchGeoSettings = async () => {
    const { data } = await supabase
      .from('geo_settings')
      .select('id, min_geo_score_publish, brand_name, target_personas, brand_authority_keywords')
      .limit(1)
      .single();
    if (data) setGeoSettings(data as GEOSettings);
  };

  // Handlers de diálogos
  const handleOpenPostDialog = (post?: BlogPost) => {
    setEditingPost(post || null);
    setPostDialogOpen(true);
  };

  const handleOpenTopicDialog = (topic?: BlogTopic) => {
    setEditingTopic(topic || null);
    setTopicDialogOpen(true);
  };

  // Handler de exclusão
  const handleDeletePost = async () => {
    if (!deletePostId) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', deletePostId);
      if (error) throw error;
      toast({ title: 'Post excluído com sucesso' });
      fetchPosts();
    } catch {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } finally {
      setDeletePostId(null);
    }
  };

  const handleDeleteTopic = async () => {
    if (!deleteTopicId) return;
    try {
      const { error } = await supabase.from('blog_topics').delete().eq('id', deleteTopicId);
      if (error) throw error;
      toast({ title: 'Tópico excluído' });
      fetchTopics();
    } catch {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } finally {
      setDeleteTopicId(null);
    }
  };

  // Geração de conteúdo
  const handleGenerateNow = async (topic: BlogTopic) => {
    setGeneratingId(topic.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { topic_id: topic.id },
      });
      if (error) throw error;
      if (data?.successful > 0) {
        toast({ title: 'Conteúdo gerado!', description: 'O post foi criado como rascunho.' });
      } else {
        toast({ title: 'Falha ao gerar', variant: 'destructive' });
      }
      fetchAll();
    } catch {
      toast({ title: 'Erro ao gerar', variant: 'destructive' });
    } finally {
      setGeneratingId(null);
    }
  };

  // Sugestão de tópicos GEO
  const handleSuggestTopics = async () => {
    setSuggestingTopics(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-geo-topics', {
        body: { num_suggestions: 10, auto_schedule: false }
      });
      if (error) throw error;
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        toast({ title: `${data.suggestions.length} tópicos encontrados!` });
      }
    } catch {
      toast({ title: 'Erro ao sugerir tópicos', variant: 'destructive' });
    } finally {
      setSuggestingTopics(false);
    }
  };

  // Agendar sugestão
  const handleScheduleSuggestion = async (suggestion: TopicSuggestion) => {
    try {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      
      const { error } = await supabase.from('blog_topics').insert({
        topic: suggestion.topic,
        category: suggestion.category,
        search_query: suggestion.search_query,
        scheduled_date: scheduledDate.toISOString(),
        status: 'pending'
      });
      if (error) throw error;
      
      setSuggestions(prev => prev.filter(s => s.topic !== suggestion.topic));
      fetchTopics();
      toast({ title: 'Tópico adicionado à fila!' });
    } catch {
      toast({ title: 'Erro ao agendar', variant: 'destructive' });
    }
  };

  // Salvar configurações
  const handleSaveSettings = async () => {
    if (!geoSettings) return;
    setSavingSettings(true);
    try {
      const { error } = await supabase.from('geo_settings')
        .update({
          min_geo_score_publish: geoSettings.min_geo_score_publish,
          brand_name: geoSettings.brand_name,
          target_personas: geoSettings.target_personas,
          brand_authority_keywords: geoSettings.brand_authority_keywords
        })
        .eq('id', geoSettings.id);
      if (error) throw error;
      toast({ title: 'Configurações salvas!' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setSavingSettings(false);
    }
  };

  // Helpers
  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; icon: React.ElementType }> = {
      draft: { label: 'Rascunho', variant: 'outline', icon: FileText },
      scheduled: { label: 'Agendado', variant: 'secondary', icon: Clock },
      published: { label: 'Publicado', variant: 'default', icon: CheckCircle },
    };
    const { label, variant, icon: Icon } = config[status] || config.draft;
    return <Badge variant={variant} className="gap-1"><Icon className="h-3 w-3" />{label}</Badge>;
  };

  const getTopicStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pendente</Badge>;
      case 'generating': return <Badge variant="outline" className="text-blue-600 border-blue-600 gap-1"><Loader2 className="w-3 h-3 animate-spin" />Gerando</Badge>;
      case 'generated': return <Badge className="bg-green-600 gap-1"><CheckCircle className="w-3 h-3" />Gerado</Badge>;
      case 'failed': return <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" />Falhou</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGEOScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'alto': return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'medio': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Filtros e estatísticas
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingTopics = topics.filter(t => t.status === 'pending' || t.status === 'generating');
  
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    avgGeoScore: posts.length > 0 
      ? Math.round(posts.reduce((acc, p) => acc + (p.geo_score || 0), 0) / posts.length) 
      : 0,
    highScorePosts: posts.filter(p => (p.geo_score || 0) >= 80).length,
    queueSize: pendingTopics.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando Content Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com hierarquia visual clara */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl shadow-lg">
                <PenTool className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Content Studio</CardTitle>
                <CardDescription className="text-base">
                  Crie, gerencie e otimize conteúdo para IA e SEO em um só lugar
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => handleOpenPostDialog()} size="lg" className="gap-2 shadow-md">
              <Plus className="h-5 w-5" />
              Criar Post
            </Button>
          </div>
        </CardHeader>
        
        {/* KPIs com feedback visual imediato */}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-3 rounded-lg bg-background border">
              <p className="text-xs text-muted-foreground font-medium">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-700 font-medium">Publicados</p>
              <p className="text-2xl font-bold text-green-700">{stats.published}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-700 font-medium">Agendados</p>
              <p className="text-2xl font-bold text-blue-700">{stats.scheduled}</p>
            </div>
            <div className="p-3 rounded-lg bg-background border">
              <p className="text-xs text-muted-foreground font-medium">Rascunhos</p>
              <p className="text-2xl font-bold">{stats.drafts}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary font-medium">Score GEO</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${getGEOScoreColor(stats.avgGeoScore)}`}>{stats.avgGeoScore}</p>
                <Progress value={stats.avgGeoScore} className="flex-1 h-2" />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-700 font-medium">Score 80+</p>
              <p className="text-2xl font-bold text-green-700">{stats.highScorePosts}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-700 font-medium">Na Fila</p>
              <p className="text-2xl font-bold text-amber-700">{stats.queueSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegação simplificada com ícones claros */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)}>
        <TabsList className="grid w-full grid-cols-6 h-12">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden md:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden md:inline">Gerar com IA</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden md:inline">Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <Columns3 className="h-4 w-4" />
            <span className="hidden md:inline">Kanban</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Métricas</span>
          </TabsTrigger>
        </TabsList>

        {/* VISÃO GERAL - Ação principal visível */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>Comece a criar conteúdo em poucos cliques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => handleOpenPostDialog()} 
                  className="w-full justify-start gap-3 h-12"
                  variant="outline"
                >
                  <Plus className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Criar Post Manual</p>
                    <p className="text-xs text-muted-foreground">Escreva ou cole seu conteúdo</p>
                  </div>
                </Button>
                
                <Button 
                  onClick={handleSuggestTopics}
                  disabled={suggestingTopics}
                  className="w-full justify-start gap-3 h-12"
                  variant="outline"
                >
                  {suggestingTopics ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Lightbulb className="h-5 w-5" />
                  )}
                  <div className="text-left">
                    <p className="font-medium">Buscar Tópicos GEO</p>
                    <p className="text-xs text-muted-foreground">IA sugere temas com alto potencial</p>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => handleOpenTopicDialog()}
                  className="w-full justify-start gap-3 h-12"
                  variant="outline"
                >
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Agendar Tópico IA</p>
                    <p className="text-xs text-muted-foreground">Adicione à fila de geração automática</p>
                  </div>
                </Button>

                <Button 
                  onClick={() => setBatchDialogOpen(true)}
                  className="w-full justify-start gap-3 h-12 bg-primary/10 border-primary/30 hover:bg-primary/20"
                  variant="outline"
                >
                  <Layers className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-primary">Gerar em Lote</p>
                    <p className="text-xs text-muted-foreground">Múltiplos posts com datas sequenciais</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Fila de Geração */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Fila de Geração
                  </CardTitle>
                  <CardDescription>Tópicos aguardando geração automática</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-3">{pendingTopics.length}</Badge>
              </CardHeader>
              <CardContent>
                {pendingTopics.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p>Fila vazia</p>
                    <p className="text-sm">Adicione tópicos para geração automática</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {pendingTopics.slice(0, 5).map((topic) => (
                        <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{topic.topic}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(topic.scheduled_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleGenerateNow(topic)}
                            disabled={generatingId === topic.id}
                          >
                            {generatingId === topic.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Zap className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sugestões de Tópicos */}
          {suggestions.length > 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Tópicos Sugeridos pela IA
                </CardTitle>
                <CardDescription>Clique para adicionar à fila de geração</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border bg-background hover:border-primary/50 transition-all cursor-pointer group"
                      onClick={() => handleScheduleSuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{suggestion.category}</Badge>
                            <Badge className={`text-xs ${getPotentialColor(suggestion.geo_potential)}`}>
                              {suggestion.geo_potential === 'alto' ? '🔥 Alto' : suggestion.geo_potential === 'medio' ? '⭐ Médio' : 'Baixo'}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm mb-1">{suggestion.topic}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.reasoning}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts Recentes com Score GEO */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Posts Recentes</CardTitle>
                <CardDescription>Últimos conteúdos criados com score GEO</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setActiveView('manage')}>
                Ver Todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                        (post.geo_score || 0) >= 80 ? 'bg-green-500/20 text-green-700' :
                        (post.geo_score || 0) >= 60 ? 'bg-yellow-500/20 text-yellow-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {post.geo_score || 0}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(post.status)}
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        </div>
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), "dd MMM yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === 'published' && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/blog/${post.slug}`} target="_blank"><Eye className="h-4 w-4" /></a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleOpenPostDialog(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agendamentos Recorrentes */}
          <RecurringSchedulesManager />
        </TabsContent>

        {/* GERAR COM IA */}
        <TabsContent value="create" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sugerir Tópicos */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Sugestões Inteligentes
                    </CardTitle>
                    <CardDescription>Tópicos com alto potencial de citação por IAs</CardDescription>
                  </div>
                  <Button onClick={handleSuggestTopics} disabled={suggestingTopics} className="gap-2">
                    {suggestingTopics ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Buscar Tópicos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {suggestions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="font-medium">Nenhuma sugestão ainda</p>
                    <p className="text-sm">Clique em "Buscar Tópicos" para obter ideias com potencial GEO</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{suggestion.category}</Badge>
                                <Badge className={getPotentialColor(suggestion.geo_potential)}>
                                  Potencial {suggestion.geo_potential}
                                </Badge>
                              </div>
                              <h4 className="font-medium mb-1">{suggestion.topic}</h4>
                              <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                            </div>
                            <Button size="sm" onClick={() => handleScheduleSuggestion(suggestion)}>
                              Agendar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Fila + Configurações */}
            <div className="space-y-6">
              {/* Fila */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Fila de Geração
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingTopics.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Fila vazia</p>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {pendingTopics.map((topic) => (
                          <div key={topic.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              {getTopicStatusBadge(topic.status)}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleGenerateNow(topic)}
                                disabled={generatingId === topic.id}
                              >
                                {generatingId === topic.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                              </Button>
                            </div>
                            <p className="text-sm font-medium truncate">{topic.topic}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Configurações GEO */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Config GEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {geoSettings && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs">Score Mínimo Auto-Publicar</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            min={0}
                            max={100}
                            value={geoSettings.min_geo_score_publish}
                            onChange={(e) => setGeoSettings({ ...geoSettings, min_geo_score_publish: parseInt(e.target.value) || 80 })}
                            className="w-20"
                          />
                          <span className="text-xs text-muted-foreground">/ 100</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={handleSaveSettings} 
                        disabled={savingSettings}
                        className="w-full gap-2"
                      >
                        {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Salvar
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* GERENCIAR POSTS */}
        <TabsContent value="manage" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Todos os Posts
                </CardTitle>
                <Button onClick={() => handleOpenPostDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar posts..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="published">Publicados</SelectItem>
                    <SelectItem value="scheduled">Agendados</SelectItem>
                    <SelectItem value="draft">Rascunhos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista */}
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum post encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg font-bold shrink-0 ${
                        (post.geo_score || 0) >= 80 ? 'bg-green-500/20 text-green-700' :
                        (post.geo_score || 0) >= 60 ? 'bg-yellow-500/20 text-yellow-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {post.geo_score || 0}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {getStatusBadge(post.status)}
                          <Badge variant="outline">{post.category}</Badge>
                          {post.etapa_funil && <Badge variant="secondary" className="text-xs">{post.etapa_funil}</Badge>}
                          {post.auto_published && <Badge className="bg-purple-500/20 text-purple-700 gap-1"><Zap className="h-3 w-3" />Auto</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{post.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{format(new Date(post.created_at), "dd MMM yyyy", { locale: ptBR })}</span>
                          <span>•</span>
                          <span>{post.read_time_minutes || 5} min</span>
                          {post.expert_quotes && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Quote className="h-3 w-3" />{(post.expert_quotes as any[]).length} citações</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.status === 'published' && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank"><Eye className="h-4 w-4" /></a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleOpenPostDialog(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeletePostId(post.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CALENDÁRIO */}
        <TabsContent value="calendar" className="mt-6">
          <EditorialCalendar 
            posts={posts}
            topics={topics}
            onPostClick={(post) => handleOpenPostDialog(post as BlogPost)}
            onCreatePost={(date) => {
              setEditingPost(null);
              setPostDialogOpen(true);
            }}
            onScheduleTopic={(date) => handleOpenTopicDialog()}
          />
        </TabsContent>

        {/* KANBAN */}
        <TabsContent value="kanban" className="mt-6">
          <EditorialKanban 
            posts={posts}
            onEditPost={(post) => handleOpenPostDialog(post as BlogPost)} 
            onViewPost={(post) => window.open(`/blog/${post.slug}`, '_blank')}
            onRefresh={fetchAll}
          />
        </TabsContent>

        {/* MÉTRICAS */}
        <TabsContent value="analytics" className="mt-6">
          <GEOAnalyticsDashboard posts={posts} stats={stats} getGEOScoreColor={getGEOScoreColor} getStatusBadge={getStatusBadge} />
        </TabsContent>
      </Tabs>

      {/* Status da Automação */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Automação ativa</span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
              <span>✅ Geração diária às 9h UTC</span>
              <span>✅ Sugestões semanais</span>
              <span>✅ Auto-publicação score ≥{geoSettings?.min_geo_score_publish || 80}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PostEditorDialog 
        open={postDialogOpen} 
        onOpenChange={setPostDialogOpen} 
        editingPost={editingPost} 
        onSave={fetchPosts} 
      />
      <TopicDialog 
        open={topicDialogOpen} 
        onOpenChange={setTopicDialogOpen} 
        editingTopic={editingTopic} 
        onSave={fetchTopics} 
      />
      <BatchGenerationDialog
        open={batchDialogOpen}
        onOpenChange={setBatchDialogOpen}
        onComplete={fetchAll}
      />

      {/* Delete Confirmations */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O post será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTopicId} onOpenChange={() => setDeleteTopicId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tópico?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O tópico será removido da fila.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTopic} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
