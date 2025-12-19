import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Sparkles, Trash2, Edit, ExternalLink, RefreshCw, Calendar, AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogTopic {
  id: string;
  topic: string;
  category: string;
  search_query: string | null;
  scheduled_date: string;
  status: string;
  generated_post_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  'Impostos',
  'Regime Tributário',
  'Dicas',
  'Legislação',
  'Planejamento',
  'Abertura de Empresa',
  'Gestão Financeira',
];

export function BlogTopicsManager() {
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<BlogTopic | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'Dicas',
    search_query: '',
    scheduled_date: '',
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_topics')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setTopics((data as BlogTopic[]) || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Erro ao carregar tópicos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (topic?: BlogTopic) => {
    if (topic) {
      setSelectedTopic(topic);
      setFormData({
        topic: topic.topic,
        category: topic.category,
        search_query: topic.search_query || '',
        scheduled_date: topic.scheduled_date.split('T')[0],
      });
    } else {
      setSelectedTopic(null);
      setFormData({
        topic: '',
        category: 'Dicas',
        search_query: '',
        scheduled_date: new Date().toISOString().split('T')[0],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTopic(null);
    setFormData({ topic: '', category: 'Dicas', search_query: '', scheduled_date: '' });
  };

  const handleSubmit = async () => {
    if (!formData.topic.trim() || !formData.scheduled_date) {
      toast.error('Preencha o tópico e a data de agendamento');
      return;
    }

    try {
      const payload = {
        topic: formData.topic.trim(),
        category: formData.category,
        search_query: formData.search_query.trim() || null,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
      };

      if (selectedTopic) {
        const { error } = await supabase
          .from('blog_topics')
          .update(payload)
          .eq('id', selectedTopic.id);
        if (error) throw error;
        toast.success('Tópico atualizado');
      } else {
        const { error } = await supabase
          .from('blog_topics')
          .insert(payload);
        if (error) throw error;
        toast.success('Tópico criado');
      }

      handleCloseDialog();
      fetchTopics();
    } catch (error) {
      console.error('Error saving topic:', error);
      toast.error('Erro ao salvar tópico');
    }
  };

  const handleDelete = async () => {
    if (!selectedTopic) return;

    try {
      const { error } = await supabase
        .from('blog_topics')
        .delete()
        .eq('id', selectedTopic.id);
      if (error) throw error;
      toast.success('Tópico excluído');
      setDeleteDialogOpen(false);
      setSelectedTopic(null);
      fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Erro ao excluir tópico');
    }
  };

  const handleGenerateNow = async (topic: BlogTopic) => {
    setGeneratingId(topic.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { topic_id: topic.id },
      });

      if (error) throw error;

      if (data.successful > 0) {
        toast.success('Conteúdo gerado com sucesso!');
      } else {
        toast.error('Falha ao gerar conteúdo');
      }

      fetchTopics();
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Erro ao gerar conteúdo');
    } finally {
      setGeneratingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'generating':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Gerando</Badge>;
      case 'generated':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Gerado</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Falhou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: topics.length,
    pending: topics.filter(t => t.status === 'pending').length,
    generated: topics.filter(t => t.status === 'generated').length,
    failed: topics.filter(t => t.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pendentes</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gerados</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.generated}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Falhas</CardDescription>
            <CardTitle className="text-2xl text-destructive">{stats.failed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tópicos Agendados</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Tópico
        </Button>
      </div>

      {/* Topics List */}
      {topics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum tópico agendado.<br />
              Crie seu primeiro tópico para gerar conteúdo automaticamente.
            </p>
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
                      {getStatusBadge(topic.status)}
                      <Badge variant="outline">{topic.category}</Badge>
                    </div>
                    <h3 className="font-medium">{topic.topic}</h3>
                    {topic.search_query && (
                      <p className="text-sm text-muted-foreground">
                        Query: {topic.search_query}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(topic.scheduled_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    {topic.error_message && (
                      <p className="text-sm text-destructive mt-2">
                        Erro: {topic.error_message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {topic.generated_post_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${topic.generated_post_id}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ver Post
                      </Button>
                    )}
                    {(topic.status === 'pending' || topic.status === 'failed') && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerateNow(topic)}
                        disabled={generatingId === topic.id}
                      >
                        {generatingId === topic.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-1" />
                        )}
                        Gerar Agora
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(topic)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTopic(topic);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTopic ? 'Editar Tópico' : 'Novo Tópico'}
            </DialogTitle>
            <DialogDescription>
              Configure o tópico para geração automática de conteúdo com IA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Tópico *</Label>
              <Textarea
                id="topic"
                placeholder="Ex: Como médicos podem reduzir impostos em 2025"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search_query">Query de Pesquisa (opcional)</Label>
              <Input
                id="search_query"
                placeholder="Query customizada para o Perplexity"
                value={formData.search_query}
                onChange={(e) => setFormData({ ...formData, search_query: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Se vazio, usa o tópico como query de pesquisa.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Data de Agendamento *</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {selectedTopic ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tópico</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
