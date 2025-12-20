import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  editorial_status: string;
  scheduled_for: string | null;
  published_at: string | null;
  etapa_funil: string;
  objetivo: string;
  category: string;
}

interface EditorialCalendarProps {
  onPostClick?: (post: BlogPost) => void;
  onCreatePost?: (date: Date) => void;
}

export function EditorialCalendar({ onPostClick, onCreatePost }: EditorialCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [currentMonth]);

  const fetchPosts = async () => {
    setLoading(true);
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, editorial_status, scheduled_for, published_at, etapa_funil, objetivo, category')
      .or(`scheduled_for.gte.${start.toISOString()},published_at.gte.${start.toISOString()}`)
      .or(`scheduled_for.lte.${end.toISOString()},published_at.lte.${end.toISOString()}`);

    if (error) {
      toast({
        title: 'Erro ao carregar posts',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      const postDate = post.scheduled_for || post.published_at;
      if (!postDate) return false;
      return isSameDay(new Date(postDate), day);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getFunnelBadge = (etapa: string) => {
    switch (etapa) {
      case 'topo':
        return <Badge variant="outline" className="text-xs">Topo</Badge>;
      case 'meio':
        return <Badge variant="secondary" className="text-xs">Meio</Badge>;
      case 'fundo':
        return <Badge className="text-xs">Fundo</Badge>;
      default:
        return null;
    }
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate start padding for the first week
  const startDay = startOfMonth(currentMonth).getDay();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          📅 Calendário Editorial
        </CardTitle>
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
          {/* Empty cells for start padding */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] bg-muted/30 rounded-md" />
          ))}

          {/* Day cells */}
          {days.map((day) => {
            const dayPosts = getPostsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] border rounded-md p-1 transition-colors ${
                  isToday ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isToday ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {onCreatePost && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100"
                      onClick={() => onCreatePost(day)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="space-y-1">
                  {dayPosts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className={`text-xs p-1 rounded cursor-pointer truncate ${getStatusColor(
                        post.editorial_status || post.status
                      )}`}
                      onClick={() => onPostClick?.(post)}
                      title={post.title}
                    >
                      {post.title}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayPosts.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
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
            <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/50" />
            <span className="text-xs text-muted-foreground">Em Redação</span>
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
