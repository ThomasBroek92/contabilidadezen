import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { COLUMN_COLORS } from './use-board-settings';

export interface CategoryOption {
  id: string;
  title: string;
  color: string;
  order: number;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'vendas', title: 'Vendas', color: 'blue', order: 0 },
  { id: 'financeiro', title: 'Financeiro', color: 'green', order: 1 },
  { id: 'marketing', title: 'Marketing', color: 'purple', order: 2 },
  { id: 'operacional', title: 'Operacional', color: 'orange', order: 3 },
  { id: 'administrativo', title: 'Administrativo', color: 'gray', order: 4 },
  { id: 'suporte', title: 'Suporte', color: 'yellow', order: 5 },
  { id: 'desenvolvimento', title: 'Desenvolvimento', color: 'pink', order: 6 },
  { id: 'rh', title: 'RH', color: 'red', order: 7 },
];

export { COLUMN_COLORS };

export function useCategorySettings() {
  const queryClient = useQueryClient();

  const { data: categories = DEFAULT_CATEGORIES, isLoading } = useQuery({
    queryKey: ['category-settings'],
    queryFn: async (): Promise<CategoryOption[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return DEFAULT_CATEGORIES;
      }

      const { data, error } = await supabase
        .from('task_board_settings')
        .select('categories')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data || !data.categories) {
        return DEFAULT_CATEGORIES;
      }

      const cats = Array.isArray(data.categories)
        ? (data.categories as unknown as CategoryOption[]).sort((a, b) => a.order - b.order)
        : DEFAULT_CATEGORIES;

      return cats;
    },
  });

  const saveCategories = useMutation({
    mutationFn: async (newCategories: CategoryOption[]) => {
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
            categories: newCategories as unknown as Json,
          })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('task_board_settings')
          .insert({
            user_id: user.id,
            categories: newCategories as unknown as Json,
          });
        if (error) throw error;
      }

      return newCategories;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-settings'] });
      toast.success('Setores salvos com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar setores');
    },
  });

  return {
    categories,
    isLoading,
    saveCategories: saveCategories.mutate,
    isSaving: saveCategories.isPending,
  };
}
