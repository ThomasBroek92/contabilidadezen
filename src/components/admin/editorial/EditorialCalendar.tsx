import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Eye, Sparkles, CalendarPlus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPost, BlogTopic } from './useEditorialData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorialCalendarProps {
  onPostClick?: (post: BlogPost) => void;
  onCreatePost?: (date: Date) => void;
  onScheduleTopic?: (date: Date) => void;
  posts?: BlogPost[];
  topics?: BlogTopic[];
}

export function EditorialCalendar({ onPostClick, onCreatePost, onScheduleTopic, posts: externalPosts, topics: externalTopics }: EditorialCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (externalPosts) {
      setPosts(externalPosts);
      setLoading(false);
    } else {
      fetchPosts();
    }
  }, [currentMonth, externalPosts]);

  useEffect(() => {
    if (externalTopics) {
      setTopics(externalTopics);
    } else {
      fetchTopics();
    }
  }, [currentMonth, externalTopics]);

  const fetchPosts = async () => {
    setLoading(true);
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .or(`scheduled_for.gte.${start.toISOString()},published_at.gte.${start.toISOString()}`)
      .or(`scheduled_for.lte.${end.toISOString()},published_at.lte.${end.toISOString()}`);

    if (error) {
      toast({
        title: 'Erro ao carregar posts',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setPosts((data as BlogPost[]) || []);
    }
    setLoading(false);
  };

  const fetchTopics = async () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const { data } = await supabase
      .from('blog_topics')
      .select('*')
      .gte('scheduled_date', start.toISOString())
      .lte('scheduled_date', end.toISOString());
    
    if (data) setTopics(data as BlogTopic[]);
  };

  // Calcular dias do mês incluindo padding para semana completa
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      const postDate = post.scheduled_for || post.published_at;
      if (!postDate) return false;
      return isSameDay(new Date(postDate), day);
    });
  };

  const getTopicsForDay = (day: Date) => {
    return topics.filter((topic) => {
      return isSameDay(new Date(topic.scheduled_date), day);
    });
  };

  const getStatusColor = (status: string, editorialStatus?: string) => {
    const effectiveStatus = editorialStatus || status;
    switch (effectiveStatus) {
      case 'published':
        return 'bg-green-500/20 text-green-700 border-green-500/50';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/50';
      case 'review':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50';
      case 'writing':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/50';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTopicStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/50 border-dashed';
      case 'generating':
        return 'bg-purple-500/20 text-purple-700 border-purple-500/50';
      case 'generated':
        return 'bg-green-500/20 text-green-700 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-700 border-red-500/50';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === currentMonth.getMonth();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            📅 Calendário Editorial
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Posts agendados e tópicos na fila de geração
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[150px] text-center font-medium">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayPosts = getPostsForDay(day);
            const dayTopics = getTopicsForDay(day);
            const isToday = isSameDay(day, new Date());
            const inCurrentMonth = isCurrentMonth(day);

            return (
              <TooltipProvider key={day.toISOString()}>
                <div
                  className={`min-h-[100px] border rounded-md p-1 transition-colors group ${
                    isToday 
                      ? 'border-primary bg-primary/5' 
                      : inCurrentMonth 
                        ? 'border-border hover:bg-muted/50' 
                        : 'border-border/50 bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isToday 
                          ? 'text-primary' 
                          : inCurrentMonth 
                            ? 'text-foreground' 
                            : 'text-muted-foreground'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onCreatePost && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => onCreatePost(day)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Criar post</TooltipContent>
                        </Tooltip>
                      )}
                      {onScheduleTopic && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => onScheduleTopic(day)}
                            >
                              <Sparkles className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Agendar geração IA</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {/* Mostrar tópicos pendentes */}
                    {dayTopics.slice(0, 1).map((topic) => (
                      <Tooltip key={topic.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`text-xs p-1 rounded border cursor-pointer truncate ${getTopicStatusColor(topic.status)}`}
                            title={topic.topic}
                          >
                            <span className="mr-1">🤖</span>
                            {topic.topic.substring(0, 15)}...
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{topic.topic}</p>
                          <p className="text-xs text-muted-foreground">
                            Status: {topic.status === 'pending' ? 'Aguardando geração' : topic.status}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    
                    {/* Mostrar posts */}
                    {dayPosts.slice(0, 2 - Math.min(dayTopics.length, 1)).map((post) => (
                      <Tooltip key={post.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`text-xs p-1 rounded border cursor-pointer truncate ${getStatusColor(
                              post.status,
                              post.editorial_status
                            )}`}
                            onClick={() => onPostClick?.(post)}
                          >
                            {post.title.substring(0, 18)}...
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-xs text-muted-foreground">
                            GEO Score: {post.geo_score || 0}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    
                    {(dayPosts.length + dayTopics.length) > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayPosts.length + dayTopics.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
            <span className="text-xs text-muted-foreground">Publicado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50" />
            <span className="text-xs text-muted-foreground">Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/50" />
            <span className="text-xs text-muted-foreground">Em Revisão</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50 border-dashed" />
            <span className="text-xs text-muted-foreground">🤖 Tópico IA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted border" />
            <span className="text-xs text-muted-foreground">Rascunho</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
