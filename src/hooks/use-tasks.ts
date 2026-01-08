import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotion } from '@/hooks/use-notion';
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

// Map local status to Notion status
const STATUS_TO_NOTION: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

const PRIORITY_TO_NOTION: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { createPage: createNotionPage } = useNotion();
  const { user } = useAuth();

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
    try {
      // Build Notion properties based on typical task database schema
      const properties: Record<string, any> = {
        Name: {
          title: [{ text: { content: task.title } }],
        },
        Status: {
          select: { name: STATUS_TO_NOTION[task.status] || 'To Do' },
        },
        Priority: {
          select: { name: PRIORITY_TO_NOTION[task.priority] || 'Medium' },
        },
      };

      if (task.description) {
        properties['Description'] = {
          rich_text: [{ text: { content: task.description } }],
        };
      }

      if (task.due_date) {
        properties['Due Date'] = {
          date: { start: task.due_date.split('T')[0] },
        };
      }

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

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(t => t.id === id ? (data as Task) : t));
      return data as Task;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const deleteTask = useCallback(async (id: string) => {
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
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Erro ao excluir tarefa',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus, newPosition: number) => {
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
    } catch (error) {
      console.error('Error moving task:', error);
      // Revert on error
      fetchTasks();
    }
  }, [fetchTasks]);

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
