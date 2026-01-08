import { useState } from 'react';
import { useTasks, TaskStatus, TaskPriority, Task } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, GripVertical, Calendar, User, 
  MoreHorizontal, Trash2, Edit, LinkIcon 
} from 'lucide-react';
import { formatDistanceToNow, format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskDialog } from './TaskDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-muted' },
  { id: 'todo', title: 'A Fazer', color: 'bg-secondary' },
  { id: 'in_progress', title: 'Em Progresso', color: 'bg-primary/10' },
  { id: 'review', title: 'Revisão', color: 'bg-accent' },
  { id: 'done', title: 'Concluído', color: 'bg-primary/20' },
];

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; class: string }> = {
  low: { label: 'Baixa', class: 'bg-muted text-muted-foreground' },
  medium: { label: 'Média', class: 'bg-secondary text-secondary-foreground' },
  high: { label: 'Alta', class: 'bg-primary/20 text-primary' },
  urgent: { label: 'Urgente', class: 'bg-destructive/10 text-destructive' },
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'done';
  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="group bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {task.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Badge variant="outline" className={priority.class}>
          {priority.label}
        </Badge>
        
        {task.due_date && (
          <Badge 
            variant="outline" 
            className={
              isOverdue 
                ? 'bg-destructive/10 text-destructive border-destructive/20' 
                : isDueToday 
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : ''
            }
          >
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(task.due_date), 'dd/MM', { locale: ptBR })}
          </Badge>
        )}

        {task.notion_page_id && (
          <Badge variant="outline" className="bg-background">
            <LinkIcon className="h-3 w-3 mr-1" />
            Notion
          </Badge>
        )}
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  column: typeof COLUMNS[number];
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
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
}: KanbanColumnProps) {
  return (
    <div 
      className="flex-shrink-0 w-72"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className={`rounded-lg ${column.color} p-3`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {tasks.length}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => onAddTask(column.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-2 pr-2">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onDragStart={onDragStart}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhuma tarefa
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export function TaskKanban() {
  const { tasks, loading, createTask, updateTask, deleteTask, moveTask, getTasksByStatus } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleAddTask = (status: TaskStatus) => {
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
      await createTask({ ...data, status: defaultStatus });
    }
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    if (draggedTask.status !== newStatus) {
      const tasksInColumn = getTasksByStatus(newStatus);
      const newPosition = tasksInColumn.length;
      moveTask(draggedTask.id, newStatus, newPosition);
    }
    setDraggedTask(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => (
              <div key={col.id} className="w-72 flex-shrink-0">
                <Skeleton className="h-[400px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestão de Tarefas</CardTitle>
            <Button onClick={() => handleAddTask('todo')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </>
  );
}
