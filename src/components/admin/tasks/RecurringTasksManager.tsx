import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, RefreshCw, Calendar, Clock, User, Trash2, Edit2,
  CalendarDays, CalendarRange, Repeat
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RecurringTaskDialog } from './RecurringTaskDialog';

type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface RecurringTemplate {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  assignee_id: string | null;
  frequency: RecurrenceFrequency;
  day_of_week: number | null;
  day_of_month: number | null;
  time_of_day: string;
  is_active: boolean;
  next_run_at: string | null;
  last_run_at: string | null;
  created_at: string;
}

const FREQUENCY_LABELS: Record<RecurrenceFrequency, { label: string; icon: React.ElementType }> = {
  daily: { label: 'Diário', icon: Repeat },
  weekly: { label: 'Semanal', icon: CalendarDays },
  monthly: { label: 'Mensal', icon: CalendarRange },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Baixa', color: 'bg-slate-500' },
  medium: { label: 'Média', color: 'bg-blue-500' },
  high: { label: 'Alta', color: 'bg-orange-500' },
  urgent: { label: 'Urgente', color: 'bg-red-500' },
};

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function RecurringTasksManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RecurringTemplate | null>(null);

  // Fetch templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['recurring-task-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring_task_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RecurringTemplate[];
    },
  });

  // Fetch profiles for assignee names
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email');
      if (error) throw error;
      return data;
    },
  });

  // Toggle active mutation
  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('recurring_task_templates')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-task-templates'] });
      toast.success('Status atualizado');
    },
    onError: () => toast.error('Erro ao atualizar status'),
  });

  // Delete mutation
  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recurring_task_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-task-templates'] });
      toast.success('Template excluído');
    },
    onError: () => toast.error('Erro ao excluir template'),
  });

  // Run now mutation
  const runNow = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('process-recurring-tasks');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recurring-task-templates'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(`Processado: ${data.results?.created || 0} tarefa(s) criada(s)`);
    },
    onError: () => toast.error('Erro ao processar tarefas recorrentes'),
  });

  const getAssigneeName = (assigneeId: string | null) => {
    if (!assigneeId || !profiles) return null;
    const profile = profiles.find(p => p.id === assigneeId);
    return profile?.display_name || profile?.email?.split('@')[0];
  };

  const getScheduleDescription = (template: RecurringTemplate) => {
    const time = template.time_of_day.substring(0, 5);
    
    switch (template.frequency) {
      case 'daily':
        return `Todos os dias às ${time}`;
      case 'weekly':
        return `${DAY_NAMES[template.day_of_week || 0]}s às ${time}`;
      case 'monthly':
        return `Dia ${template.day_of_month} de cada mês às ${time}`;
      default:
        return '';
    }
  };

  const handleEdit = (template: RecurringTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Templates de Tarefas Recorrentes</h3>
          <p className="text-sm text-muted-foreground">
            Configure tarefas que se repetem automaticamente
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => runNow.mutate()}
            disabled={runNow.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${runNow.isPending ? 'animate-spin' : ''}`} />
            Processar Agora
          </Button>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </div>
      </div>

      {/* Templates List */}
      {templates && templates.length > 0 ? (
        <div className="grid gap-4">
          {templates.map((template) => {
            const FrequencyIcon = FREQUENCY_LABELS[template.frequency].icon;
            const priorityConfig = PRIORITY_CONFIG[template.priority];
            
            return (
              <Card key={template.id} className={!template.is_active ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {/* Title and Priority */}
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{template.title}</h4>
                        <Badge variant="outline" className="gap-1">
                          <div className={`w-2 h-2 rounded-full ${priorityConfig.color}`} />
                          {priorityConfig.label}
                        </Badge>
                      </div>

                      {/* Description */}
                      {template.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      )}

                      {/* Schedule Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FrequencyIcon className="h-4 w-4" />
                          {getScheduleDescription(template)}
                        </span>
                        
                        {template.assignee_id && (
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {getAssigneeName(template.assignee_id)}
                          </span>
                        )}

                        {template.next_run_at && template.is_active && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Próxima: {format(new Date(template.next_run_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </span>
                        )}

                        {template.last_run_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Última: {format(new Date(template.last_run_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.is_active}
                        onCheckedChange={(checked) => 
                          toggleActive.mutate({ id: template.id, isActive: checked })
                        }
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          if (confirm('Excluir este template?')) {
                            deleteTemplate.mutate(template.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum template criado</h3>
            <p className="text-muted-foreground mb-4">
              Crie templates para gerar tarefas automaticamente
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <RecurringTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
      />
    </div>
  );
}
