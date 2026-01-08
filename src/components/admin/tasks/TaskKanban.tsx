import { useState, useMemo, useEffect } from 'react';
import { useTasks, TaskStatus, TaskPriority, Task } from '@/hooks/use-tasks';
import { useBoardSettings, BoardColumn } from '@/hooks/use-board-settings';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, GripVertical, Calendar, 
  MoreHorizontal, Trash2, Edit, ExternalLink, Link2, Filter, X, User,
  Circle, AlertCircle, Flag, Zap, LayoutGrid, List, Settings
} from 'lucide-react';
import { format, isPast, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskDialog } from './TaskDialog';
import { TaskList } from './TaskList';
import { BoardSettingsDialog } from './BoardSettingsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

type ViewMode = 'kanban' | 'list';

// Notion-style pastel colors
const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: typeof Circle }> = {
  low: { label: 'Baixa', color: 'bg-[#E3E2E0] text-[#787774]', icon: Circle },
  medium: { label: 'Média', color: 'bg-[#D3E5EF] text-[#2E7D9A]', icon: Flag },
  high: { label: 'Alta', color: 'bg-[#FADEC9] text-[#D9730D]', icon: AlertCircle },
  urgent: { label: 'Urgente', color: 'bg-[#FFE2DD] text-[#E03E3E]', icon: Zap },
};

type DateFilter = 'all' | 'overdue' | 'today' | 'week' | 'month' | 'no_date';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  profiles: Record<string, { display_name: string | null; email: string | null }>;
}

function TaskCard({ task, onEdit, onDelete, onDragStart, profiles }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'done';
  const isDueToday = task.due_date && isToday(new Date(task.due_date));
  const PriorityIcon = priority.icon;
  
  const assigneeName = task.assignee_id 
    ? profiles[task.assignee_id]?.display_name || profiles[task.assignee_id]?.email?.split('@')[0] || 'Usuário'
    : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onEdit(task)}
      className="group bg-white dark:bg-[#191919] border border-[#E9E9E7] dark:border-[#2F2F2F] rounded-sm p-2.5 cursor-pointer hover:bg-[#F7F7F5] dark:hover:bg-[#252525] transition-colors shadow-none"
    >
      <div className="flex items-start gap-2">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pt-0.5">
          <GripVertical className="h-3.5 w-3.5 text-[#B4B4B4]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#37352F] dark:text-[#FFFFFFCF] font-normal leading-relaxed">
            {task.title}
          </p>
          
          {task.description && (
            <p className="text-xs text-[#9B9A97] dark:text-[#FFFFFF52] line-clamp-2 mt-1">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-medium ${priority.color}`}>
              <PriorityIcon className="h-3 w-3" />
              {priority.label}
            </span>
            
            {task.due_date && (
              <span 
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-medium ${
                  isOverdue 
                    ? 'bg-[#FFE2DD] text-[#E03E3E]' 
                    : isDueToday 
                      ? 'bg-[#FADEC9] text-[#D9730D]'
                      : 'bg-[#E3E2E0] text-[#787774]'
                }`}
              >
                <Calendar className="h-3 w-3" />
                {format(new Date(task.due_date), 'dd MMM', { locale: ptBR })}
              </span>
            )}

            {task.notion_page_id && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-medium bg-[#E3E2E0] text-[#787774]">
                <Link2 className="h-3 w-3" />
              </span>
            )}

            {assigneeName && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-medium bg-[#DDEBF1] text-[#2E7D9A]">
                <User className="h-3 w-3" />
                {assigneeName}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center rounded-sm hover:bg-[#E9E9E7] dark:hover:bg-[#3F3F3F]">
              <MoreHorizontal className="h-4 w-4 text-[#9B9A97]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F] shadow-lg">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="text-[#37352F] dark:text-[#FFFFFFCF] hover:bg-[#F7F7F5] dark:hover:bg-[#3F3F3F]">
              <Edit className="h-4 w-4 mr-2 text-[#9B9A97]" />
              Editar
            </DropdownMenuItem>
            {task.notion_page_id && (
              <DropdownMenuItem asChild className="text-[#37352F] dark:text-[#FFFFFFCF] hover:bg-[#F7F7F5] dark:hover:bg-[#3F3F3F]">
                <a 
                  href={`https://notion.so/${task.notion_page_id.replace(/-/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4 mr-2 text-[#9B9A97]" />
                  Abrir no Notion
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#E9E9E7] dark:bg-[#3F3F3F]" />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="text-[#E03E3E] hover:bg-[#FFE2DD] dark:hover:bg-[#3F3F3F]"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  column: BoardColumn;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  profiles: Record<string, { display_name: string | null; email: string | null }>;
}

function KanbanColumn({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  profiles,
}: KanbanColumnProps) {
  return (
    <div 
      className="flex-shrink-0 w-72"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="rounded-sm">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">{column.emoji}</span>
            <h3 className="text-sm font-medium text-[#37352F] dark:text-[#FFFFFFCF]">{column.title}</h3>
            <span className="text-xs text-[#9B9A97] dark:text-[#FFFFFF52] bg-[#F1F1EF] dark:bg-[#2F2F2F] px-1.5 py-0.5 rounded-sm">
              {tasks.length}
            </span>
          </div>
          <button 
            onClick={() => onAddTask(column.id)}
            className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-[#E9E9E7] dark:hover:bg-[#3F3F3F] transition-colors"
          >
            <Plus className="h-4 w-4 text-[#9B9A97]" />
          </button>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-1.5 pr-2">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onDragStart={onDragStart}
                profiles={profiles}
              />
            ))}
            
            <button
              onClick={() => onAddTask(column.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-[#9B9A97] hover:bg-[#F7F7F5] dark:hover:bg-[#252525] rounded-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nova tarefa</span>
            </button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export function TaskKanban() {
  const { tasks, loading, createTask, updateTask, deleteTask, moveTask, getTasksByStatus } = useTasks();
  const { columns, defaultView, saveSettings, isSaving, isLoading: isLoadingSettings } = useBoardSettings();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<string>('todo');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  
  // Set initial view mode from settings
  useEffect(() => {
    if (defaultView) {
      setViewMode(defaultView);
    }
  }, [defaultView]);
  
  // Filters
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  // Fetch profiles for assignee names
  const { data: profiles = {} } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email');
      
      if (error) throw error;
      
      const profilesMap: Record<string, { display_name: string | null; email: string | null }> = {};
      data?.forEach(p => {
        profilesMap[p.id] = { display_name: p.display_name, email: p.email };
      });
      return profilesMap;
    },
  });

  // Get unique assignees from tasks
  const assignees = useMemo(() => {
    const ids = new Set<string>();
    tasks.forEach(t => {
      if (t.assignee_id) ids.add(t.assignee_id);
    });
    return Array.from(ids);
  }, [tasks]);

  // Filter tasks
  const filterTasks = (tasksToFilter: Task[]): Task[] => {
    return tasksToFilter.filter(task => {
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      
      if (assigneeFilter !== 'all') {
        if (assigneeFilter === 'unassigned' && task.assignee_id) return false;
        if (assigneeFilter !== 'unassigned' && task.assignee_id !== assigneeFilter) return false;
      }
      
      if (dateFilter !== 'all') {
        const dueDate = task.due_date ? new Date(task.due_date) : null;
        
        switch (dateFilter) {
          case 'overdue':
            if (!dueDate || !isPast(dueDate) || task.status === 'done') return false;
            break;
          case 'today':
            if (!dueDate || !isToday(dueDate)) return false;
            break;
          case 'week':
            if (!dueDate || !isThisWeek(dueDate, { locale: ptBR })) return false;
            break;
          case 'month':
            if (!dueDate || !isThisMonth(dueDate)) return false;
            break;
          case 'no_date':
            if (dueDate) return false;
            break;
        }
      }
      
      return true;
    });
  };

  const getFilteredTasksByColumn = (columnId: string) => {
    // Map column ID to task status (for backward compatibility)
    const status = columnId as TaskStatus;
    return filterTasks(getTasksByStatus(status));
  };

  const filteredTasks = useMemo(() => filterTasks(tasks), [tasks, priorityFilter, assigneeFilter, dateFilter]);

  const hasActiveFilters = priorityFilter !== 'all' || assigneeFilter !== 'all' || dateFilter !== 'all';

  const clearFilters = () => {
    setPriorityFilter('all');
    setAssigneeFilter('all');
    setDateFilter('all');
  };

  const handleAddTask = (status: string) => {
    setDefaultStatus(status);
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    await deleteTask(id);
  };

  const handleSaveTask = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask({ ...data, status: defaultStatus as TaskStatus });
    }
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleSaveSettings = (newColumns: BoardColumn[]) => {
    saveSettings({ columns: newColumns, defaultView: viewMode });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    saveSettings({ columns, defaultView: mode });
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    if (draggedTask.status !== newStatus) {
      const tasksInColumn = getTasksByStatus(newStatus as TaskStatus);
      const newPosition = tasksInColumn.length;
      moveTask(draggedTask.id, newStatus as TaskStatus, newPosition);
    }
    setDraggedTask(null);
  };

  if (loading || isLoadingSettings) {
    return (
      <Card className="border-[#E9E9E7] dark:border-[#2F2F2F] shadow-none bg-white dark:bg-[#191919]">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48 bg-[#F1F1EF]" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-72 flex-shrink-0">
                <Skeleton className="h-[400px] w-full rounded-sm bg-[#F1F1EF]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-[#E9E9E7] dark:border-[#2F2F2F] shadow-none bg-white dark:bg-[#191919]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#37352F] dark:text-[#FFFFFFCF]">Tarefas</h2>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center bg-[#F1F1EF] dark:bg-[#2F2F2F] rounded-sm p-0.5">
                <button
                  onClick={() => handleViewModeChange('kanban')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium transition-colors ${
                    viewMode === 'kanban' 
                      ? 'bg-white dark:bg-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-sm' 
                      : 'text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#FFFFFFCF]'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Board
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-sm' 
                      : 'text-[#9B9A97] hover:text-[#37352F] dark:hover:text-[#FFFFFFCF]'
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  Lista
                </button>
              </div>

              {/* Settings button */}
              <button
                onClick={() => setSettingsOpen(true)}
                className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-[#F7F7F5] dark:hover:bg-[#3F3F3F] transition-colors"
                title="Personalizar colunas"
              >
                <Settings className="h-4 w-4 text-[#9B9A97]" />
              </button>

              <Button 
                onClick={() => handleAddTask('todo')}
                className="bg-[#2383E2] hover:bg-[#1B6EC2] text-white shadow-none h-8 text-sm font-normal"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Nova Tarefa
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-[#9B9A97]">
              <Filter className="h-3.5 w-3.5" />
              Filtrar:
            </div>
            
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TaskPriority | 'all')}>
              <SelectTrigger className="w-[130px] h-7 text-xs bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-none">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F]">
                <SelectItem value="all" className="text-xs">Todas</SelectItem>
                <SelectItem value="urgent" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E03E3E]" />
                    Urgente
                  </span>
                </SelectItem>
                <SelectItem value="high" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D9730D]" />
                    Alta
                  </span>
                </SelectItem>
                <SelectItem value="medium" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D9A]" />
                    Média
                  </span>
                </SelectItem>
                <SelectItem value="low" className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#787774]" />
                    Baixa
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[150px] h-7 text-xs bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-none">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F]">
                <SelectItem value="all" className="text-xs">Todos</SelectItem>
                <SelectItem value="unassigned" className="text-xs">Sem responsável</SelectItem>
                {assignees.map(id => (
                  <SelectItem key={id} value={id} className="text-xs">
                    {profiles[id]?.display_name || profiles[id]?.email?.split('@')[0] || id.substring(0, 8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
              <SelectTrigger className="w-[130px] h-7 text-xs bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F] text-[#37352F] dark:text-[#FFFFFFCF] shadow-none">
                <SelectValue placeholder="Data" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#252526] border-[#E9E9E7] dark:border-[#3F3F3F]">
                <SelectItem value="all" className="text-xs">Todas</SelectItem>
                <SelectItem value="overdue" className="text-xs">Atrasadas</SelectItem>
                <SelectItem value="today" className="text-xs">Hoje</SelectItem>
                <SelectItem value="week" className="text-xs">Esta semana</SelectItem>
                <SelectItem value="month" className="text-xs">Este mês</SelectItem>
                <SelectItem value="no_date" className="text-xs">Sem data</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <button 
                onClick={clearFilters} 
                className="h-7 px-2 flex items-center gap-1 text-xs text-[#9B9A97] hover:bg-[#F7F7F5] dark:hover:bg-[#3F3F3F] rounded-sm transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {viewMode === 'kanban' ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getFilteredTasksByColumn(column.id)}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  profiles={profiles}
                />
              ))}
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              profiles={profiles}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <BoardSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        columns={columns}
        onSave={handleSaveSettings}
        isSaving={isSaving}
      />
    </>
  );
}