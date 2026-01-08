import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotion, NotionDatabase } from '@/hooks/use-notion';
import { useAuth } from '@/hooks/useAuth';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assignee_id: string | null;
  lead_id: string | null;
  notion_page_id: string | null;
  position: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  assignee_id?: string;
  lead_id?: string;
}

// Map local status to common Notion status variations
const STATUS_VARIATIONS: Record<string, string[]> = {
  backlog: ['Backlog', 'backlog', 'A Fazer', 'Not Started'],
  todo: ['To Do', 'Todo', 'A Fazer', 'Not Started', 'Pendente'],
  in_progress: ['In Progress', 'Em Progresso', 'Doing', 'In progress', 'Em Andamento'],
  review: ['Review', 'Revisão', 'Em Revisão', 'In Review'],
  done: ['Done', 'Concluído', 'Feito', 'Complete', 'Completed'],
};

const PRIORITY_VARIATIONS: Record<string, string[]> = {
  low: ['Low', 'Baixa', 'low'],
  medium: ['Medium', 'Média', 'medium', 'Normal'],
  high: ['High', 'Alta', 'high'],
  urgent: ['Urgent', 'Urgente', 'urgent', 'Critical'],
};

interface NotionPropertyMapping {
  title: string | null;
  status: string | null;
  priority: string | null;
  description: string | null;
  dueDate: string | null;
}

// Find the best matching property name from Notion schema
function findPropertyByType(
  schema: NotionDatabase['properties'],
  type: string,
  hints: string[] = []
): string | null {
  // First try to match by type and hints
  for (const [name, prop] of Object.entries(schema)) {
    if (prop.type === type) {
      const lowerName = name.toLowerCase();
      if (hints.some(h => lowerName.includes(h.toLowerCase()))) {
        return name;
      }
    }
  }
  // Fall back to first property of that type
  for (const [name, prop] of Object.entries(schema)) {
    if (prop.type === type) {
      return name;
    }
  }
  return null;
}

function buildPropertyMapping(schema: NotionDatabase['properties'] | undefined): NotionPropertyMapping {
  if (!schema) {
    return { title: null, status: null, priority: null, description: null, dueDate: null };
  }
  
  return {
    title: findPropertyByType(schema, 'title', ['name', 'title', 'tarefa', 'task', 'título']),
    status: findPropertyByType(schema, 'status', ['status', 'estado']) || 
            findPropertyByType(schema, 'select', ['status', 'estado', 'etapa']),
    priority: findPropertyByType(schema, 'select', ['priority', 'prioridade']) ||
              findPropertyByType(schema, 'multi_select', ['priority', 'prioridade']),
    description: findPropertyByType(schema, 'rich_text', ['description', 'descrição', 'desc', 'notes', 'notas']),
    dueDate: findPropertyByType(schema, 'date', ['due', 'date', 'data', 'prazo', 'deadline', 'vencimento']),
  };
}

function getNotionStatusValue(status: TaskStatus, availableOptions?: string[]): string {
  const variations = STATUS_VARIATIONS[status] || ['To Do'];
  if (availableOptions) {
    const match = variations.find(v => availableOptions.includes(v));
    if (match) return match;
  }
  return variations[0];
}

function getNotionPriorityValue(priority: TaskPriority, availableOptions?: string[]): string {
  const variations = PRIORITY_VARIATIONS[priority] || ['Medium'];
  if (availableOptions) {
    const match = variations.find(v => availableOptions.includes(v));
    if (match) return match;
  }
  return variations[0];
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { createPage: createNotionPage, updatePage: updateNotionPage, archivePage: archiveNotionPage, fetchDatabase, database } = useNotion();
  const { user } = useAuth();
  const propertyMapping = useRef<NotionPropertyMapping>({ title: null, status: null, priority: null, description: null, dueDate: null });
  const schemaFetched = useRef(false);

  // Fetch Notion schema once
  useEffect(() => {
    if (!schemaFetched.current) {
      schemaFetched.current = true;
      fetchDatabase()
        .then(db => {
          if (db?.properties) {
            propertyMapping.current = buildPropertyMapping(db.properties);
            console.log('Notion property mapping:', propertyMapping.current);
          }
        })
        .catch(err => {
          console.error('Failed to fetch Notion schema:', err);
        });
    }
  }, [fetchDatabase]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setTasks((data as Task[]) || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Erro ao carregar tarefas',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const syncTaskToNotion = useCallback(async (task: Task) => {
    const mapping = propertyMapping.current;
    
    // If no title property found, we can't create the page
    if (!mapping.title) {
      console.warn('No title property found in Notion schema, skipping sync');
      return null;
    }

    try {
      const properties: Record<string, any> = {
        [mapping.title]: {
          title: [{ text: { content: task.title } }],
        },
      };

      if (mapping.status) {
        properties[mapping.status] = {
          select: { name: getNotionStatusValue(task.status) },
        };
      }

      if (mapping.priority) {
        properties[mapping.priority] = {
          select: { name: getNotionPriorityValue(task.priority) },
        };
      }

      if (mapping.description && task.description) {
        properties[mapping.description] = {
          rich_text: [{ text: { content: task.description } }],
        };
      }

      if (mapping.dueDate && task.due_date) {
        properties[mapping.dueDate] = {
          date: { start: task.due_date.split('T')[0] },
        };
      }

      console.log('Creating Notion page with properties:', Object.keys(properties));
      const notionPage = await createNotionPage(properties);

      // Update task with Notion page ID
      if (notionPage?.id) {
        await supabase
          .from('tasks')
          .update({ notion_page_id: notionPage.id })
          .eq('id', task.id);
        
        setTasks(prev => prev.map(t => 
          t.id === task.id ? { ...t, notion_page_id: notionPage.id } : t
        ));
      }

      console.log('Task synced to Notion:', notionPage?.id);
      return notionPage;
    } catch (error) {
      console.error('Error syncing task to Notion:', error);
      // Don't throw - Notion sync is optional
      return null;
    }
  }, [createNotionPage]);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    try {
      // Get max position for the status column
      const { data: maxPosData } = await supabase
        .from('tasks')
        .select('position')
        .eq('status', input.status || 'todo')
        .order('position', { ascending: false })
        .limit(1);

      const maxPosition = maxPosData?.[0]?.position ?? -1;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...input,
          position: maxPosition + 1,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask = data as Task;
      setTasks(prev => [...prev, newTask]);
      
      toast({
        title: 'Tarefa criada!',
        description: `"${input.title}" foi adicionada.`,
      });

      // Sync to Notion in background (non-blocking)
      syncTaskToNotion(newTask).then(notionPage => {
        if (notionPage) {
          toast({
            title: 'Sincronizado com Notion',
            description: 'Tarefa também criada no database Notion.',
          });
        }
      });

      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Erro ao criar tarefa',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, toast, syncTaskToNotion]);

  const syncUpdateToNotion = useCallback(async (task: Task, updates: Partial<Task>) => {
    if (!task.notion_page_id) return null;
    const mapping = propertyMapping.current;

    try {
      const properties: Record<string, any> = {};

      if (updates.title !== undefined && mapping.title) {
        properties[mapping.title] = {
          title: [{ text: { content: updates.title } }],
        };
      }

      if (updates.status !== undefined && mapping.status) {
        properties[mapping.status] = {
          select: { name: getNotionStatusValue(updates.status) },
        };
      }

      if (updates.priority !== undefined && mapping.priority) {
        properties[mapping.priority] = {
          select: { name: getNotionPriorityValue(updates.priority) },
        };
      }

      if (updates.description !== undefined && mapping.description) {
        properties[mapping.description] = {
          rich_text: updates.description ? [{ text: { content: updates.description } }] : [],
        };
      }

      if (updates.due_date !== undefined && mapping.dueDate) {
        properties[mapping.dueDate] = updates.due_date 
          ? { date: { start: updates.due_date.split('T')[0] } }
          : { date: null };
      }

      if (Object.keys(properties).length > 0) {
        await updateNotionPage(task.notion_page_id, properties);
        console.log('Task update synced to Notion:', task.notion_page_id);
      }
    } catch (error) {
      console.error('Error syncing update to Notion:', error);
      // Don't throw - Notion sync is optional
    }
  }, [updateNotionPage]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const currentTask = tasks.find(t => t.id === id);
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = data as Task;
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

      // Sync to Notion in background if task is linked
      if (currentTask?.notion_page_id) {
        syncUpdateToNotion({ ...currentTask, ...updatedTask }, updates);
      }

      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, tasks, syncUpdateToNotion]);

  const deleteTask = useCallback(async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Tarefa excluída',
        description: 'A tarefa foi removida.',
      });

      // Archive in Notion if synced (non-blocking)
      if (taskToDelete?.notion_page_id) {
        archiveNotionPage(taskToDelete.notion_page_id).catch(err => {
          console.error('Error archiving Notion page:', err);
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Erro ao excluir tarefa',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, tasks, archiveNotionPage]);

  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus, newPosition: number) => {
    const currentTask = tasks.find(t => t.id === taskId);
    
    // Optimistic update
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;

      const updated = prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status: newStatus, position: newPosition };
        }
        // Shift other tasks in the same column
        if (t.status === newStatus && t.position >= newPosition && t.id !== taskId) {
          return { ...t, position: t.position + 1 };
        }
        return t;
      });

      return updated.sort((a, b) => a.position - b.position);
    });

    try {
      await supabase
        .from('tasks')
        .update({ status: newStatus, position: newPosition })
        .eq('id', taskId);

      // Sync status change to Notion
      if (currentTask?.notion_page_id) {
        syncUpdateToNotion(currentTask, { status: newStatus });
      }
    } catch (error) {
      console.error('Error moving task:', error);
      // Revert on error
      fetchTasks();
    }
  }, [fetchTasks, tasks, syncUpdateToNotion]);

  // Subscribe to realtime changes
  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks
      .filter(t => t.status === status)
      .sort((a, b) => a.position - b.position);
  }, [tasks]);

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
  };
}
