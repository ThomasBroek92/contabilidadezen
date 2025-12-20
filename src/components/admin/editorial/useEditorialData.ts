import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featured_image_url: string | null;
  author_id: string | null;
  status: 'draft' | 'scheduled' | 'published';
  editorial_status: string;
  published_at: string | null;
  scheduled_for: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  read_time_minutes: number | null;
  created_at: string;
  updated_at: string;
  persona_alvo: string | null;
  etapa_funil: string;
  objetivo: string;
  views: number;
  ctr: number;
  leads_gerados: number;
  roi: number;
}

export interface BlogTopic {
  id: string;
  topic: string;
  category: string;
  search_query: string | null;
  scheduled_date: string;
  status: string;
  generated_post_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES = [
  'Impostos',
  'Regime Tributário',
  'Dicas',
  'Abertura de Empresa',
  'Gestão Financeira',
  'Contabilidade',
  'Legislação',
  'Planejamento',
];

export const FUNNEL_STAGES = [
  { value: 'topo', label: 'Topo (Descoberta)' },
  { value: 'meio', label: 'Meio (Consideração)' },
  { value: 'fundo', label: 'Fundo (Decisão)' },
];

export const OBJECTIVES = [
  { value: 'trafego', label: '🚀 Tráfego', icon: '🚀' },
  { value: 'leads', label: '📧 Leads', icon: '📧' },
  { value: 'autoridade', label: '👑 Autoridade', icon: '👑' },
];

export function useEditorialData() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data as BlogPost[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Erro ao carregar posts',
        description: 'Não foi possível carregar os posts.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchTopics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_topics')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setTopics((data as BlogTopic[]) || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast({
        title: 'Erro ao carregar tópicos',
        description: 'Não foi possível carregar os tópicos.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPosts(), fetchTopics()]);
    setLoading(false);
  }, [fetchPosts, fetchTopics]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return {
    posts,
    topics,
    loading,
    fetchPosts,
    fetchTopics,
    fetchAll,
    generateSlug,
    calculateReadTime,
  };
}
