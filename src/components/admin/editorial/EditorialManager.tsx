import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CalendarDays, Columns3, BarChart3, FileText, Plus, Search, Sparkles, Edit, Trash2, Eye, ExternalLink, Loader2, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EditorialCalendar } from './EditorialCalendar';
import { EditorialKanban } from './EditorialKanban';
import { EditorialDashboard } from './EditorialDashboard';
import { PostEditorDialog } from './PostEditorDialog';
import { TopicDialog } from './TopicDialog';
import { useEditorialData, BlogPost, BlogTopic } from './useEditorialData';

export function EditorialManager() {
  const [activeTab, setActiveTab] = useState('posts');
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingTopic, setEditingTopic] = useState<BlogTopic | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  const { posts, topics, loading, fetchPosts, fetchTopics, fetchAll } = useEditorialData();

  const handleOpenPostDialog = (post?: BlogPost) => {
    setEditingPost(post || null);
    setPostDialogOpen(true);
  };

  const handleOpenTopicDialog = (topic?: BlogTopic) => {
    setEditingTopic(topic || null);
    setTopicDialogOpen(true);
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', deletePostId);
      if (error) throw error;
      toast({ title: 'Post excluído' });
      fetchPosts();
    } catch (error) {
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
    } catch (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } finally {
      setDeleteTopicId(null);
    }
  };

  const handleGenerateNow = async (topic: BlogTopic) => {
    setGeneratingId(topic.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { topic_id: topic.id },
      });
      if (error) throw error;
      if (data?.successful > 0) {
        toast({ title: 'Conteúdo gerado!', description: 'Post criado como rascunho.' });
      } else {
        toast({ title: 'Falha ao gerar', variant: 'destructive' });
      }
      fetchAll();
    } catch (error) {
      toast({ title: 'Erro ao gerar', variant: 'destructive' });
    } finally {
      setGeneratingId(null);
    }
  };

  const getPostStatusBadge = (status: string) => {
    const config = {
      draft: { label: 'Rascunho', variant: 'outline' as const, icon: FileText },
      scheduled: { label: 'Agendado', variant: 'secondary' as const, icon: Clock },
      published: { label: 'Publicado', variant: 'default' as const, icon: CheckCircle },
    };
    const { label, variant, icon: Icon } = config[status as keyof typeof config] || config.draft;
    return <Badge variant={variant} className="gap-1"><Icon className="h-3 w-3" />{label}</Badge>;
  };

  const getTopicStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'generating': return <Badge variant="outline" className="text-blue-600 border-blue-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Gerando</Badge>;
      case 'generated': return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Gerado</Badge>;
      case 'failed': return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Falhou</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const postStats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    draft: posts.filter(p => p.status === 'draft').length,
  };

  const topicStats = {
    total: topics.length,
    pending: topics.filter(t => t.status === 'pending').length,
    generated: topics.filter(t => t.status === 'generated').length,
    failed: topics.filter(t => t.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📅 Calendário Editorial Unificado</CardTitle>
          <CardDescription>
            Gerencie posts, tópicos IA, calendário e métricas em um só lugar. Integrado com Perplexity.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts" className="gap-2"><FileText className="h-4 w-4" /><span className="hidden sm:inline">Posts</span></TabsTrigger>
          <TabsTrigger value="ai" className="gap-2"><Sparkles className="h-4 w-4" /><span className="hidden sm:inline">IA</span></TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2"><CalendarDays className="h-4 w-4" /><span className="hidden sm:inline">Calendário</span></TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2"><Columns3 className="h-4 w-4" /><span className="hidden sm:inline">Kanban</span></TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2"><BarChart3 className="h-4 w-4" /><span className="hidden sm:inline">Métricas</span></TabsTrigger>
        </TabsList>

        {/* POSTS TAB */}
        <TabsContent value="posts" className="mt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{postStats.total}</div><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{postStats.published}</div><p className="text-xs text-muted-foreground">Publicados</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{postStats.scheduled}</div><p className="text-xs text-muted-foreground">Agendados</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-muted-foreground">{postStats.draft}</div><p className="text-xs text-muted-foreground">Rascunhos</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Posts do Blog</CardTitle>
                <Button onClick={() => handleOpenPostDialog()} className="gap-2"><Plus className="h-4 w-4" />Novo Post</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="published">Publicados</SelectItem>
                    <SelectItem value="scheduled">Agendados</SelectItem>
                    <SelectItem value="draft">Rascunhos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum post encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border hover:bg-muted/30">
                      {post.featured_image_url && (
                        <img src={post.featured_image_url} alt="" className="w-full md:w-24 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {getPostStatusBadge(post.status)}
                          <Badge variant="outline">{post.category}</Badge>
                          {post.etapa_funil && <Badge variant="secondary" className="text-xs">{post.etapa_funil}</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{post.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(post.created_at), "dd MMM yyyy", { locale: ptBR })} • {post.read_time_minutes || 5} min
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.status === 'published' && (
                          <Button variant="outline" size="sm" asChild><a href={`/blog/${post.slug}`} target="_blank"><Eye className="h-4 w-4" /></a></Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleOpenPostDialog(post)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setDeletePostId(post.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI TOPICS TAB */}
        <TabsContent value="ai" className="mt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{topicStats.total}</div><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{topicStats.pending}</div><p className="text-xs text-muted-foreground">Pendentes</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{topicStats.generated}</div><p className="text-xs text-muted-foreground">Gerados</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-destructive">{topicStats.failed}</div><p className="text-xs text-muted-foreground">Falhas</p></CardContent></Card>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5" />Tópicos para Geração IA (Perplexity)</h2>
            <Button onClick={() => handleOpenTopicDialog()} className="gap-2"><Plus className="h-4 w-4" />Novo Tópico</Button>
          </div>

          {topics.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">Nenhum tópico agendado. Crie tópicos para geração automática.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {topics.map((topic) => (
                <Card key={topic.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getTopicStatusBadge(topic.status)}
                          <Badge variant="outline">{topic.category}</Badge>
                        </div>
                        <h3 className="font-medium">{topic.topic}</h3>
                        {topic.search_query && <p className="text-sm text-muted-foreground">Query: {topic.search_query}</p>}
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(topic.scheduled_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                        {topic.error_message && <p className="text-sm text-destructive">Erro: {topic.error_message}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {topic.generated_post_id && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/blog`} target="_blank"><ExternalLink className="w-4 h-4 mr-1" />Ver</a>
                          </Button>
                        )}
                        {(topic.status === 'pending' || topic.status === 'failed') && (
                          <Button variant="secondary" size="sm" onClick={() => handleGenerateNow(topic)} disabled={generatingId === topic.id}>
                            {generatingId === topic.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                            Gerar
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleOpenTopicDialog(topic)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTopicId(topic.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* CALENDAR TAB */}
        <TabsContent value="calendar" className="mt-6">
          <EditorialCalendar onPostClick={(post) => handleOpenPostDialog(post as BlogPost)} />
        </TabsContent>

        {/* KANBAN TAB */}
        <TabsContent value="kanban" className="mt-6">
          <EditorialKanban onEditPost={(post) => handleOpenPostDialog(post as BlogPost)} onViewPost={(post) => window.open(`/blog/${post.slug}`, '_blank')} />
        </TabsContent>

        {/* DASHBOARD TAB */}
        <TabsContent value="dashboard" className="mt-6">
          <EditorialDashboard />
        </TabsContent>
      </Tabs>

      {/* Automation Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg"><Sparkles className="h-5 w-5 text-primary" /></div>
            <div>
              <h4 className="font-medium mb-1">🤖 Automação com Perplexity</h4>
              <p className="text-sm text-muted-foreground">
                Tópicos pendentes são processados diariamente às 9h UTC. Posts gerados ficam como rascunho para revisão.
              </p>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                <span>✅ Cron job ativo</span>
                <span>✅ Perplexity integrado</span>
                <span>✅ Publicação automática</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PostEditorDialog open={postDialogOpen} onOpenChange={setPostDialogOpen} editingPost={editingPost} onSave={fetchPosts} />
      <TopicDialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen} editingTopic={editingTopic} onSave={fetchTopics} />

      {/* Delete Post Confirmation */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Topic Confirmation */}
      <AlertDialog open={!!deleteTopicId} onOpenChange={() => setDeleteTopicId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tópico?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTopic} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
