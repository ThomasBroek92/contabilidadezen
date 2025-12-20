import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Send, ImagePlus, X, Sparkles, Wand2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MarkdownEditor } from '@/components/blog/MarkdownEditor';
import { BlogPost, CATEGORIES, FUNNEL_STAGES, OBJECTIVES } from './useEditorialData';

type PostStatus = 'draft' | 'scheduled' | 'published';

interface PostEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost: BlogPost | null;
  onSave: () => void;
}

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
  persona_alvo: '',
  etapa_funil: 'topo',
  objetivo: 'trafego',
};

export function PostEditorDialog({ open, onOpenChange, editingPost, onSave }: PostEditorDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const { toast } = useToast();

  // Initialize form when editing
  useState(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        excerpt: editingPost.excerpt || '',
        content: editingPost.content,
        category: editingPost.category,
        featured_image_url: editingPost.featured_image_url || '',
        meta_title: editingPost.meta_title || '',
        meta_description: editingPost.meta_description || '',
        meta_keywords: editingPost.meta_keywords?.join(', ') || '',
        status: editingPost.status,
        scheduled_for: editingPost.scheduled_for ? new Date(editingPost.scheduled_for).toISOString().slice(0, 16) : '',
        persona_alvo: editingPost.persona_alvo || '',
        etapa_funil: editingPost.etapa_funil || 'topo',
        objetivo: editingPost.objetivo || 'trafego',
      });
    } else {
      setFormData(initialFormData);
    }
  });

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

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Arquivo inválido', description: 'Selecione uma imagem.', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'Máximo 5MB.', variant: 'destructive' });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('blog-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      setFormData({ ...formData, featured_image_url: publicUrl });
      toast({ title: 'Imagem enviada!' });
    } catch (error: any) {
      toast({ title: 'Erro ao enviar imagem', description: error.message, variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Digite um título primeiro', variant: 'destructive' });
      return;
    }

    setGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-content', {
        body: { 
          inline: true,
          topic: formData.title,
          category: formData.category,
        },
      });

      if (error) throw error;

      if (data?.content) {
        setFormData({
          ...formData,
          content: data.content,
          excerpt: data.excerpt || formData.excerpt,
          meta_description: data.meta_description || formData.meta_description,
          meta_keywords: data.meta_keywords?.join(', ') || formData.meta_keywords,
        });
        toast({ title: 'Conteúdo gerado com IA!', description: 'Revise e edite conforme necessário.' });
      }
    } catch (error: any) {
      toast({ title: 'Erro ao gerar conteúdo', description: error.message, variant: 'destructive' });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (publishNow = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: 'Campos obrigatórios', description: 'Título e conteúdo são obrigatórios.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const slug = editingPost?.slug || generateSlug(formData.title);
      const readTime = calculateReadTime(formData.content);
      const keywords = formData.meta_keywords.split(',').map(k => k.trim()).filter(Boolean);

      let status = formData.status;
      let publishedAt = editingPost?.published_at;
      let scheduledFor = formData.scheduled_for || null;

      if (publishNow) {
        status = 'published';
        publishedAt = new Date().toISOString();
        scheduledFor = null;
      } else if (formData.status === 'scheduled' && formData.scheduled_for) {
        scheduledFor = new Date(formData.scheduled_for).toISOString();
      }

      // Map status to editorial_status
      type EditorialStatusType = 'draft' | 'published' | 'review' | 'scheduled' | 'writing';
      const editorialStatus: EditorialStatusType = status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'draft';

      type FunnelStageType = 'topo' | 'meio' | 'fundo';
      type ObjectiveType = 'trafego' | 'leads' | 'autoridade';

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
        editorial_status: editorialStatus,
        published_at: publishedAt,
        scheduled_for: scheduledFor,
        persona_alvo: formData.persona_alvo || null,
        etapa_funil: formData.etapa_funil as FunnelStageType,
        objetivo: formData.objetivo as ObjectiveType,
      };

      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', editingPost.id);
        if (error) throw error;
        toast({ title: 'Post atualizado!', description: publishNow ? 'Publicado com sucesso.' : 'Alterações salvas.' });
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);
        if (error) throw error;
        toast({ title: 'Post criado!', description: publishNow ? 'Publicado com sucesso.' : 'Salvo como rascunho.' });
      }

      onOpenChange(false);
      onSave();
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPost ? 'Editar Post' : 'Novo Post'}</DialogTitle>
          <DialogDescription>
            {editingPost ? 'Edite as informações do post.' : 'Crie um novo post para o blog.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="strategy">Estratégia</TabsTrigger>
            <TabsTrigger value="seo">SEO & Agenda</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <div className="flex gap-2">
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Digite o título do post"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateWithAI}
                  disabled={generatingAI || !formData.title.trim()}
                  className="gap-2"
                >
                  {generatingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Gerar com IA
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumo do post"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo * (Markdown)</Label>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Escreva o conteúdo usando Markdown..."
              />
              <p className="text-xs text-muted-foreground">
                Tempo de leitura: {calculateReadTime(formData.content)} min
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              {formData.featured_image_url ? (
                <div className="relative">
                  <img src={formData.featured_image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => setFormData({ ...formData, featured_image_url: '' })}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30">
                  {uploadingImage ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : <ImagePlus className="h-8 w-8 text-muted-foreground" />}
                  <p className="text-sm text-muted-foreground mt-2">{uploadingImage ? 'Enviando...' : 'Clique para enviar'}</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              )}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Planejamento Estratégico
                </CardTitle>
                <CardDescription>Configure a estratégia de conteúdo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="persona">Persona Alvo</Label>
                  <Input
                    id="persona"
                    value={formData.persona_alvo}
                    onChange={(e) => setFormData({ ...formData, persona_alvo: e.target.value })}
                    placeholder="Ex: Médicos recém-formados, Dentistas com clínica própria..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Etapa do Funil</Label>
                    <Select value={formData.etapa_funil} onValueChange={(value) => setFormData({ ...formData, etapa_funil: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FUNNEL_STAGES.map((stage) => <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Objetivo</Label>
                    <Select value={formData.objetivo} onValueChange={(value) => setFormData({ ...formData, objetivo: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OBJECTIVES.map((obj) => <SelectItem key={obj.value} value={obj.value}>{obj.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SEO</CardTitle>
                <CardDescription>Otimização para mecanismos de busca</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="Título SEO (máx. 60 caracteres)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_title.length}/60</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Descrição SEO (máx. 160 caracteres)"
                    maxLength={160}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_description.length}/160</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Palavras-chave</Label>
                  <Input
                    id="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="Separe por vírgulas"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: PostStatus) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.status === 'scheduled' && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_for">Data e hora</Label>
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
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancelar</Button>
          <Button variant="outline" onClick={() => handleSubmit(false)} disabled={saving} className="flex-1 gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Salvar
          </Button>
          <Button onClick={() => handleSubmit(true)} disabled={saving} className="flex-1 gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
