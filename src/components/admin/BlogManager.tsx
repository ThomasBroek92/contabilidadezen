import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MarkdownEditor } from '@/components/blog/MarkdownEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Edit, Trash2, Eye, Calendar, Clock, 
  FileText, Send, CalendarClock, Loader2, Search,
  CheckCircle, AlertCircle, ImagePlus, X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featured_image_url: string | null;
  author_id: string | null;
  status: 'draft' | 'scheduled' | 'published';
  published_at: string | null;
  scheduled_for: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  read_time_minutes: number | null;
  created_at: string;
  updated_at: string;
}

const categories = [
  'Impostos',
  'Regime Tributário',
  'Dicas',
  'Abertura de Empresa',
  'Gestão Financeira',
  'Contabilidade',
  'Legislação',
];

type PostStatus = 'draft' | 'scheduled' | 'published';

const initialFormData = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Dicas',
  featured_image_url: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  status: 'draft' as PostStatus,
  scheduled_for: '',
};

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data as BlogPost[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Erro ao carregar posts',
        description: 'Não foi possível carregar os posts do blog.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione uma imagem.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, featured_image_url: publicUrl });

      toast({
        title: 'Imagem enviada!',
        description: 'A imagem de capa foi carregada com sucesso.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erro ao enviar imagem',
        description: error.message || 'Não foi possível enviar a imagem.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, featured_image_url: '' });
  };

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        category: post.category,
        featured_image_url: post.featured_image_url || '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords?.join(', ') || '',
        status: post.status,
        scheduled_for: post.scheduled_for ? format(new Date(post.scheduled_for), "yyyy-MM-dd'T'HH:mm") : '',
      });
    } else {
      setEditingPost(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (publishNow = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Título e conteúdo são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const slug = editingPost?.slug || generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);
      const keywords = formData.meta_keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      let status = formData.status;
      let publishedAt = editingPost?.published_at;
      let scheduledFor = formData.scheduled_for || null;

      if (publishNow) {
        status = 'published';
        publishedAt = new Date().toISOString();
        scheduledFor = null;
      } else if (formData.status === 'scheduled' && formData.scheduled_for) {
        status = 'scheduled';
        scheduledFor = new Date(formData.scheduled_for).toISOString();
      }

      const postData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        category: formData.category,
        featured_image_url: formData.featured_image_url || null,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt || formData.title,
        meta_keywords: keywords.length > 0 ? keywords : null,
        read_time_minutes: readTime,
        status,
        published_at: publishedAt,
        scheduled_for: scheduledFor,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;

        toast({
          title: 'Post atualizado!',
          description: publishNow ? 'O post foi publicado com sucesso.' : 'As alterações foram salvas.',
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;

        toast({
          title: 'Post criado!',
          description: publishNow ? 'O post foi publicado com sucesso.' : 'O post foi salvo como rascunho.',
        });
      }

      handleCloseDialog();
      fetchPosts();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar o post.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePostId) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deletePostId);

      if (error) throw error;

      toast({
        title: 'Post excluído',
        description: 'O post foi removido com sucesso.',
      });

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o post.',
        variant: 'destructive',
      });
    } finally {
      setDeletePostId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { label: 'Rascunho', variant: 'outline' as const, icon: FileText },
      scheduled: { label: 'Agendado', variant: 'secondary' as const, icon: CalendarClock },
      published: { label: 'Publicado', variant: 'default' as const, icon: CheckCircle },
    };
    const { label, variant, icon: Icon } = config[status as keyof typeof config] || config.draft;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    draft: posts.filter(p => p.status === 'draft').length,
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
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total de posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Publicados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Agendados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Rascunhos</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gerenciar Posts do Blog
              </CardTitle>
              <CardDescription>
                Crie, edite e agende posts para o blog
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
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
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="scheduled">Agendados</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardContent className="pt-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {posts.length === 0 
                  ? 'Comece criando seu primeiro post do blog.'
                  : 'Nenhum post corresponde aos filtros selecionados.'}
              </p>
              {posts.length === 0 && (
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar primeiro post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  {post.featured_image_url && (
                    <div className="w-full md:w-32 h-24 flex-shrink-0">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(post.status)}
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.created_at), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.read_time_minutes || 5} min
                      </span>
                      {post.scheduled_for && post.status === 'scheduled' && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <CalendarClock className="h-3 w-3" />
                          Agendado: {format(new Date(post.scheduled_for), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletePostId(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Editar Post' : 'Novo Post'}
            </DialogTitle>
            <DialogDescription>
              {editingPost 
                ? 'Edite as informações do post abaixo.'
                : 'Preencha as informações para criar um novo post.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="seo">SEO & Agendamento</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Digite o título do post"
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
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Um breve resumo do post (aparece na listagem)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Conteúdo * (Markdown)</Label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Escreva o conteúdo do post usando Markdown..."
                />
                <p className="text-xs text-muted-foreground">
                  Tempo estimado de leitura: {calculateReadTime(formData.content)} min
                </p>
              </div>
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Imagem de Capa</Label>
                {formData.featured_image_url ? (
                  <div className="relative">
                    <img
                      src={formData.featured_image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingImage ? (
                        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-2" />
                      ) : (
                        <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                      )}
                      <p className="text-sm text-muted-foreground">
                        {uploadingImage ? 'Enviando...' : 'Clique para enviar uma imagem'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG ou WebP (máx. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Otimização para SEO</CardTitle>
                  <CardDescription>
                    Configure as meta tags para melhor ranqueamento no Google
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="Título para SEO (máx. 60 caracteres)"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.meta_title.length}/60 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="Descrição para SEO (máx. 160 caracteres)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.meta_description.length}/160 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_keywords">Palavras-chave</Label>
                    <Input
                      id="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                      placeholder="Separe por vírgulas: contabilidade, médicos, impostos"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Agendamento</CardTitle>
                  <CardDescription>
                    Agende a publicação do post para uma data futura
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'draft' | 'scheduled' | 'published') => 
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.status === 'scheduled' && (
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_for">Data e hora de publicação</Label>
                      <Input
                        id="scheduled_for"
                        type="datetime-local"
                        value={formData.scheduled_for}
                        onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col-reverse sm:flex-row gap-2 mt-6">
            <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="flex-1 gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Salvar rascunho
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="flex-1 gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publicar agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
