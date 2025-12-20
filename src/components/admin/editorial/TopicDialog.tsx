import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BlogTopic, CATEGORIES } from './useEditorialData';

interface TopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTopic: BlogTopic | null;
  onSave: () => void;
}

const initialFormData = {
  topic: '',
  category: 'Dicas',
  search_query: '',
  scheduled_date: new Date().toISOString().split('T')[0],
};

export function TopicDialog({ open, onOpenChange, editingTopic, onSave }: TopicDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Initialize form when editing
  useState(() => {
    if (editingTopic) {
      setFormData({
        topic: editingTopic.topic,
        category: editingTopic.category,
        search_query: editingTopic.search_query || '',
        scheduled_date: editingTopic.scheduled_date.split('T')[0],
      });
    } else {
      setFormData(initialFormData);
    }
  });

  const handleSubmit = async () => {
    if (!formData.topic.trim() || !formData.scheduled_date) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha o tópico e a data.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        topic: formData.topic.trim(),
        category: formData.category,
        search_query: formData.search_query.trim() || null,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
      };

      if (editingTopic) {
        const { error } = await supabase.from('blog_topics').update(payload).eq('id', editingTopic.id);
        if (error) throw error;
        toast({ title: 'Tópico atualizado!' });
      } else {
        const { error } = await supabase.from('blog_topics').insert(payload);
        if (error) throw error;
        toast({ title: 'Tópico criado!' });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {editingTopic ? 'Editar Tópico IA' : 'Novo Tópico IA'}
          </DialogTitle>
          <DialogDescription>
            Configure um tópico para geração automática com Perplexity.
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
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingTopic ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
