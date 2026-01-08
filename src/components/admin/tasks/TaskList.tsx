import { Task, TaskStatus, TaskPriority } from '@/hooks/use-tasks';
import { useBoardSettings, COLUMN_COLORS } from '@/hooks/use-board-settings';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreHorizontal, Trash2, Edit, ExternalLink, Link2, User,
  Circle, AlertCircle, Flag, Zap, Calendar, GripVertical,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

// Notion-style pastel colors
const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string; icon: typeof Circle }> = {
  low: { label: 'Baixa', color: '#787774', bgColor: '#E3E2E0', icon: Circle },
  medium: { label: 'Média', color: '#2E7D9A', bgColor: '#D3E5EF', icon: Flag },
  high: { label: 'Alta', color: '#D9730D', bgColor: '#FADEC9', icon: AlertCircle },
  urgent: { label: 'Urgente', color: '#E03E3E', bgColor: '#FFE2DD', icon: Zap },
};

function getColorStyle(colorId: string) {
  return COLUMN_COLORS.find(c => c.id === colorId) || COLUMN_COLORS[0];
}

interface ColumnConfig {
  id: string;
  title: string;
  color: string;
  order: number;
}

interface TaskListProps {
  tasks: Task[];
  profiles: Record<string, { display_name: string | null; email: string | null }>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  columns: ColumnConfig[];
}

interface TaskRowProps {
  task: Task;
  profiles: Record<string, { display_name: string | null; email: string | null }>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  columns: ColumnConfig[];
}

function TaskRow({ task, profiles, onEdit, onDelete, onStatusChange, columns }: TaskRowProps) {
  const priority = PRIORITY_CONFIG[task.priority];
  const column = columns.find(c => c.id === task.status) || { title: task.status, color: 'gray' };
  const colorStyle = getColorStyle(column.color);
  const PriorityIcon = priority.icon;
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'done';
  const isDueToday = task.due_date && isToday(new Date(task.due_date));
  
  const assigneeName = task.assignee_id 
    ? profiles[task.assignee_id]?.display_name || profiles[task.assignee_id]?.email?.split('@')[0] || 'Usuário'
    : null;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked && task.status !== 'done') {
      onStatusChange(task.id, 'done');
    } else if (!checked && task.status === 'done') {
      onStatusChange(task.id, 'todo');
    }
  };

  return (
    <div 
      className="group flex items-center gap-3 px-3 py-2 border-b border-[#E9E9E7] dark:border-[#2F2F2F] hover:bg-[#F7F7F5] dark:hover:bg-[#252525] transition-colors cursor-pointer"
      onClick={() => onEdit(task)}
    >
      {/* Drag handle */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripVertical className="h-3.5 w-3.5 text-[#B4B4B4]" />
      </div>

      {/* Checkbox */}
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={task.status === 'done'}
          onCheckedChange={handleCheckboxChange}
          className="h-4 w-4 rounded-sm border-[#D3D3D3] data-[state=checked]:bg-[#2383E2] data-[state=checked]:border-[#2383E2]"
        />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${task.status === 'done' ? 'line-through text-[#9B9A97]' : 'text-[#37352F] dark:text-[#FFFFFFCF]'}`}>
          {task.title}
        </span>
      </div>

      {/* Status */}
      <div className="w-28 flex-shrink-0">
        <span 
          className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md font-medium"
          style={{ backgroundColor: colorStyle.bg, color: colorStyle.text }}
        >
          {column.title}
        </span>
      </div>

      {/* Priority */}
      <div className="w-24 flex-shrink-0">
        <span 
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-medium"
          style={{ backgroundColor: priority.bgColor, color: priority.color }}
        >
          <PriorityIcon className="h-3 w-3" />
          {priority.label}
        </span>
      </div>

      {/* Due Date */}
      <div className="w-24 flex-shrink-0">
        {task.due_date ? (
          <span 
            className={`inline-flex items-center gap-1 text-xs ${
              isOverdue 
                ? 'text-[#E03E3E]' 
                : isDueToday 
                  ? 'text-[#D9730D]'
                  : 'text-[#9B9A97]'
            }`}
          >
            <Calendar className="h-3 w-3" />
            {format(new Date(task.due_date), 'dd MMM', { locale: ptBR })}
          </span>
        ) : (
          <span className="text-xs text-[#C7C7C5]">—</span>
        )}
      </div>

      {/* Assignee */}
      <div className="w-32 flex-shrink-0">
        {assigneeName ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#37352F] dark:text-[#FFFFFFCF]">
            <div className="w-5 h-5 rounded-full bg-[#DDEBF1] flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3 text-[#2E7D9A]" />
            </div>
            <span className="truncate">{assigneeName}</span>
          </span>
        ) : (
          <span className="text-xs text-[#C7C7C5]">—</span>
        )}
      </div>

      {/* Notion link indicator */}
      <div className="w-6 flex-shrink-0">
        {task.notion_page_id && (
          <Link2 className="h-3.5 w-3.5 text-[#9B9A97]" />
        )}
      </div>

      {/* Actions */}
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
  );
}

interface GroupedListProps {
  column: ColumnConfig;
  tasks: Task[];
  profiles: Record<string, { display_name: string | null; email: string | null }>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  columns: ColumnConfig[];
  defaultOpen?: boolean;
}

function GroupedList({ column, tasks, profiles, onEdit, onDelete, onStatusChange, columns, defaultOpen = true }: GroupedListProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colorStyle = getColorStyle(column.color);

  if (tasks.length === 0) return null;

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 w-full hover:bg-[#F7F7F5] dark:hover:bg-[#252525] rounded-sm transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-[#9B9A97]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-[#9B9A97]" />
        )}
        <span 
          className="text-sm font-medium px-2 py-0.5 rounded-md"
          style={{ backgroundColor: colorStyle.bg, color: colorStyle.text }}
        >
          {column.title}
        </span>
        <span className="text-xs text-[#9B9A97] bg-[#F1F1EF] dark:bg-[#2F2F2F] px-1.5 py-0.5 rounded-sm">
          {tasks.length}
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-1">
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              profiles={profiles}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              columns={columns}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskList({ tasks, profiles, onEdit, onDelete, onStatusChange, columns }: TaskListProps) {
  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Use columns order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white dark:bg-[#191919] rounded-sm border border-[#E9E9E7] dark:border-[#2F2F2F]">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-[#E9E9E7] dark:border-[#2F2F2F] bg-[#FBFBFA] dark:bg-[#1E1E1E]">
        <div className="w-[52px]" /> {/* Spacer for drag + checkbox */}
        <div className="flex-1 text-xs font-medium text-[#9B9A97] uppercase tracking-wide">Tarefa</div>
        <div className="w-28 text-xs font-medium text-[#9B9A97] uppercase tracking-wide">Status</div>
        <div className="w-24 text-xs font-medium text-[#9B9A97] uppercase tracking-wide">Prioridade</div>
        <div className="w-24 text-xs font-medium text-[#9B9A97] uppercase tracking-wide">Data</div>
        <div className="w-32 text-xs font-medium text-[#9B9A97] uppercase tracking-wide">Responsável</div>
        <div className="w-6" /> {/* Notion link */}
        <div className="w-6" /> {/* Actions */}
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="py-2">
          {sortedColumns.map(column => (
            <GroupedList
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id] || []}
              profiles={profiles}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              columns={columns}
              defaultOpen={column.id !== 'done'}
            />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-[#9B9A97] text-sm">
              Nenhuma tarefa encontrada
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}