import { useEffect, useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/hooks/use-tasks';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, User, Calendar, Flag, Circle, AlertCircle, Zap, ListTodo, CheckCircle2, Eye, RotateCcw, Archive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (data: Partial<Task>) => Promise<void>;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string; icon: typeof ListTodo }[] = [
  { value: 'backlog', label: 'Backlog', icon: Archive },
  { value: 'todo', label: 'A Fazer', icon: ListTodo },
  { value: 'in_progress', label: 'Em Progresso', icon: RotateCcw },
  { value: 'review', label: 'Revisão', icon: Eye },
  { value: 'done', label: 'Concluído', icon: CheckCircle2 },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string; icon: typeof Circle }[] = [
  { value: 'low', label: 'Baixa', color: '#787774', icon: Circle },
  { value: 'medium', label: 'Média', color: '#2E7D9A', icon: Flag },
  { value: 'high', label: 'Alta', color: '#D9730D', icon: AlertCircle },
  { value: 'urgent', label: 'Urgente', color: '#E03E3E', icon: Zap },
];

export function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Fetch profiles for assignee selection
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles-for-select'],
    queryFn: async () => {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .order('role');
      
      if (rolesError) throw rolesError;
      
      const uniqueUserIds = Array.from(new Set(rolesData.map(u => u.user_id)));
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .in('id', uniqueUserIds);
      
      if (profilesError) throw profilesError;
      
      return uniqueUserIds.map(userId => {
        const profile = profilesData?.find(p => p.id === userId);
        const roleInfo = rolesData.find(r => r.user_id === userId);
        return {
          user_id: userId,
          role: roleInfo?.role || 'user',
          display_name: profile?.display_name,
          email: profile?.email,
        };
      });
    },
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
      setAssigneeId(task.assignee_id || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setAssigneeId('');
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        assignee_id: assigneeId || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      sales_manager: 'Gerente',
      sales_rep: 'Vendedor',
    };
    return labels[role] || role;
  };

  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority);
  const selectedStatus = STATUS_OPTIONS.find(s => s.value === status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-white dark:bg-[#191919] border-[#E9E9E7] dark:border-[#2F2F2F] shadow-xl p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-5 pb-0">
            <DialogTitle className="text-base font-semibold text-[#37352F] dark:text-[#FFFFFFCF]">
              {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            {/* Title input - Notion style */}
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da tarefa..."
                required
                className="border-0 bg-transparent text-lg font-medium text-[#37352F] dark:text-[#FFFFFFCF] placeholder:text-[#B4B4B4] focus-visible:ring-0 px-0 h-auto py-1"
              />
            </div>

            {/* Description - Notion style */}
            <div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicionar descrição..."
                rows={3}
                className="border-0 bg-transparent text-sm text-[#37352F] dark:text-[#FFFFFFCF] placeholder:text-[#B4B4B4] focus-visible:ring-0 px-0 resize-none"
              />
            </div>

            {/* Properties grid - Notion style */}
            <div className="space-y-2 pt-2 border-t border-[#E9E9E7] dark:border-[#2F2F2F]">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9B9A97] w-24 flex-shrink-0">Status</span>
                <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                  <SelectTrigger className="flex-1 h-8 text-xs bg-transparent border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-none hover:bg-[#F7F7F5] dark:hover:bg-[#252525]">
                    <SelectValue>
                      {selectedStatus && (
                        <span className="flex items-center gap-2">
                          <selectedStatus.icon className="h-3.5 w-3.5 text-[#9B9A97]" />
                          {selectedStatus.label}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F]">
                    {STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        <span className="flex items-center gap-2">
                          <opt.icon className="h-3.5 w-3.5 text-[#9B9A97]" />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9B9A97] w-24 flex-shrink-0">Prioridade</span>
                <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                  <SelectTrigger className="flex-1 h-8 text-xs bg-transparent border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-none hover:bg-[#F7F7F5] dark:hover:bg-[#252525]">
                    <SelectValue>
                      {selectedPriority && (
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedPriority.color }} />
                          {selectedPriority.label}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F]">
                    {PRIORITY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9B9A97] w-24 flex-shrink-0 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Data
                </span>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="flex-1 h-8 text-xs bg-transparent border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-none hover:bg-[#F7F7F5] dark:hover:bg-[#252525]"
                />
              </div>

              {/* Assignee */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9B9A97] w-24 flex-shrink-0 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Responsável
                </span>
                <Select value={assigneeId || 'none'} onValueChange={(v) => setAssigneeId(v === 'none' ? '' : v)}>
                  <SelectTrigger className="flex-1 h-8 text-xs bg-transparent border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-none hover:bg-[#F7F7F5] dark:hover:bg-[#252525]">
                    <SelectValue>
                      {assigneeId ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#DDEBF1] flex items-center justify-center">
                            <User className="h-3 w-3 text-[#2E7D9A]" />
                          </div>
                          {profiles.find(p => p.user_id === assigneeId)?.display_name || 
                           profiles.find(p => p.user_id === assigneeId)?.email?.split('@')[0] || 
                           'Usuário'}
                        </span>
                      ) : (
                        <span className="text-[#9B9A97]">Sem responsável</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F]">
                    <SelectItem value="none" className="text-xs">
                      <span className="text-[#9B9A97]">Sem responsável</span>
                    </SelectItem>
                    {profiles.map(profile => (
                      <SelectItem key={profile.user_id} value={profile.user_id} className="text-xs">
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#DDEBF1] flex items-center justify-center">
                            <User className="h-3 w-3 text-[#2E7D9A]" />
                          </div>
                          {profile.display_name || profile.email?.split('@')[0] || 'Usuário'}
                          <span className="text-[#9B9A97]">({getRoleLabel(profile.role)})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-[#E9E9E7] dark:border-[#2F2F2F] bg-[#FBFBFA] dark:bg-[#1E1E1E]">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-[#37352F] dark:text-[#FFFFFFCF] hover:bg-[#E9E9E7] dark:hover:bg-[#3F3F3F] shadow-none"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving || !title.trim()}
              className="bg-[#2383E2] hover:bg-[#1B6EC2] text-white shadow-none"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {task ? 'Salvar' : 'Criar tarefa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}