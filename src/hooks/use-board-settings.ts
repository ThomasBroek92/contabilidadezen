import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface BoardSettings {
  columns: BoardColumn[];
  defaultView: 'kanban' | 'list';
}

// Notion-style pastel colors
export const PASTEL_COLORS = [
  { id: 'gray', bg: '#F1F1EF', text: '#787774', label: 'Cinza' },
  { id: 'brown', bg: '#EEE0DA', text: '#976D57', label: 'Marrom' },
  { id: 'orange', bg: '#FADEC9', text: '#D9730D', label: 'Laranja' },
  { id: 'yellow', bg: '#FBF3DB', text: '#C29343', label: 'Amarelo' },
  { id: 'green', bg: '#DBEDDB', text: '#448361', label: 'Verde' },
  { id: 'blue', bg: '#D3E5EF', text: '#2E7D9A', label: 'Azul' },
  { id: 'purple', bg: '#E8DEEE', text: '#9065B0', label: 'Roxo' },
  { id: 'pink', bg: '#F5E0E9', text: '#C14C8A', label: 'Rosa' },
  { id: 'red', bg: '#FFE2DD', text: '#E03E3E', label: 'Vermelho' },
];

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: 'backlog', title: 'Backlog', color: 'gray', order: 0 },
  { id: 'todo', title: 'A Fazer', color: 'blue', order: 1 },
  { id: 'in_progress', title: 'Em Progresso', color: 'yellow', order: 2 },
  { id: 'review', title: 'Revisão', color: 'purple', order: 3 },
  { id: 'done', title: 'Concluído', color: 'green', order: 4 },
];

export function useBoardSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['board-settings'],
    queryFn: async (): Promise<BoardSettings> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { columns: DEFAULT_COLUMNS, defaultView: 'kanban' };
      }

      const { data, error } = await supabase
        .from('task_board_settings')
        .select('columns, default_view')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return { columns: DEFAULT_COLUMNS, defaultView: 'kanban' };
      }

      const columns = Array.isArray(data.columns) 
        ? (data.columns as unknown as BoardColumn[]).sort((a, b) => a.order - b.order)
        : DEFAULT_COLUMNS;

      return {
        columns,
        defaultView: data.default_view as 'kanban' | 'list',
      };
    },
  });

  const saveSettings = useMutation({
    mutationFn: async (newSettings: BoardSettings) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Check if settings exist
      const { data: existing } = await supabase
        .from('task_board_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('task_board_settings')
          .update({
            columns: newSettings.columns as unknown as Json,
            default_view: newSettings.defaultView,
          })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('task_board_settings')
          .insert({
            user_id: user.id,
            columns: newSettings.columns as unknown as Json,
            default_view: newSettings.defaultView,
          });
        if (error) throw error;
      }

      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-settings'] });
      toast.success('Layout salvo com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar layout');
    },
  });

  return {
    columns: settings?.columns || DEFAULT_COLUMNS,
    defaultView: settings?.defaultView || 'kanban',
    isLoading,
    saveSettings: saveSettings.mutate,
    isSaving: saveSettings.isPending,
  };
}