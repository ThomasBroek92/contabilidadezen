import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotionPage {
  id: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
}

export interface NotionDatabase {
  id: string;
  title: Array<{ plain_text: string }>;
  properties: Record<string, { id: string; name: string; type: string; [key: string]: any }>;
}

export function useNotion() {
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [database, setDatabase] = useState<NotionDatabase | null>(null);
  const { toast } = useToast();

  const callNotionProxy = useCallback(async (action: string, pageId?: string, data?: any) => {
    const { data: result, error } = await supabase.functions.invoke('notion-proxy', {
      body: { action, pageId, data },
    });

    if (error) {
      console.error('Notion proxy error:', error);
      throw new Error(error.message || 'Erro ao conectar com Notion');
    }

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  }, []);

  const fetchDatabase = useCallback(async () => {
    setLoading(true);
    try {
      const result = await callNotionProxy('getDatabase');
      setDatabase(result);
      return result;
    } catch (error) {
      toast({
        title: 'Erro ao carregar database',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callNotionProxy, toast]);

  const fetchPages = useCallback(async (filter?: any, sorts?: any) => {
    setLoading(true);
    try {
      const result = await callNotionProxy('query', undefined, { filter, sorts });
      const pagesList = result.results || [];
      setPages(pagesList);
      return pagesList;
    } catch (error) {
      toast({
        title: 'Erro ao carregar páginas',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callNotionProxy, toast]);

  const createPage = useCallback(async (properties: Record<string, any>) => {
    setLoading(true);
    try {
      const result = await callNotionProxy('createPage', undefined, { properties });
      toast({
        title: 'Página criada!',
        description: 'Item adicionado ao Notion com sucesso.',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Erro ao criar página',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callNotionProxy, toast]);

  const updatePage = useCallback(async (pageId: string, properties: Record<string, any>) => {
    setLoading(true);
    try {
      const result = await callNotionProxy('updatePage', pageId, { properties });
      toast({
        title: 'Página atualizada!',
        description: 'Item atualizado no Notion com sucesso.',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Erro ao atualizar página',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callNotionProxy, toast]);

  const archivePage = useCallback(async (pageId: string) => {
    setLoading(true);
    try {
      const result = await callNotionProxy('archivePage', pageId);
      toast({
        title: 'Página arquivada!',
        description: 'Item removido do Notion com sucesso.',
      });
      return result;
    } catch (error) {
      toast({
        title: 'Erro ao arquivar página',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callNotionProxy, toast]);

  return {
    loading,
    pages,
    database,
    fetchDatabase,
    fetchPages,
    createPage,
    updatePage,
    archivePage,
  };
}
