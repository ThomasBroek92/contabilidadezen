import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, GripVertical, Eye, Edit, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from './useEditorialData';

type KanbanColumn = 'draft' | 'writing' | 'review' | 'scheduled' | 'published';

const COLUMNS: { id: KanbanColumn; title: string; color: string; description: string }[] = [
  { id: 'draft', title: 'Rascunho', color: 'bg-muted', description: 'Posts salvos ou gerados' },
  { id: 'writing', title: 'Em Redação', color: 'bg-orange-500/20', description: 'Em edição ativa' },
  { id: 'review', title: 'Em Revisão', color: 'bg-yellow-500/20', description: 'Aguardando aprovação' },
  { id: 'scheduled', title: 'Agendado', color: 'bg-blue-500/20', description: 'Publicação programada' },
  { id: 'published', title: 'Publicado', color: 'bg-green-500/20', description: 'Disponível no blog' },
];

interface EditorialKanbanProps {
  onEditPost?: (post: BlogPost) => void;
  onViewPost?: (post: BlogPost) => void;
  posts?: BlogPost[];
  onRefresh?: () => void;
}

export function EditorialKanban({ onEditPost, onViewPost, posts: externalPosts, onRefresh }: EditorialKanbanProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedPost, setDraggedPost] = useState<BlogPost | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (externalPosts) {
      setPosts(externalPosts);
      setLoading(false);
    } else {
      fetchPosts();
    }
  }, [externalPosts]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });

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

  const handleDragStart = (e: React.DragEvent, post: BlogPost) => {
    setDraggedPost(post);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: KanbanColumn) => {
    e.preventDefault();
    if (!draggedPost) return;

    const currentStatus = draggedPost.editorial_status || mapStatusToEditorial(draggedPost.status);
    if (currentStatus === targetColumn) {
      setDraggedPost(null);
      return;
    }

    setUpdatingId(draggedPost.id);

    // Update local state optimistically
    const updatedPosts = posts.map((p) =>
      p.id === draggedPost.id ? { ...p, editorial_status: targetColumn } : p
    );
    setPosts(updatedPosts);

    // Update in database
    const updateData: Record<string, unknown> = {
      editorial_status: targetColumn,
      updated_at: new Date().toISOString(),
    };

    // Sync with legacy status field
    if (targetColumn === 'published') {
      updateData.status = 'published';
      updateData.published_at = new Date().toISOString();
    } else if (targetColumn === 'scheduled') {
      updateData.status = 'scheduled';
    } else {
      updateData.status = 'draft';
    }

    const { error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', draggedPost.id);

    if (error) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
      // Revert optimistic update
      if (externalPosts) {
        setPosts(externalPosts);
      } else {
        fetchPosts();
      }
    } else {
      toast({
        title: 'Status atualizado',
        description: `Post movido para "${COLUMNS.find((c) => c.id === targetColumn)?.title}"`,
      });
      onRefresh?.();
    }

    setDraggedPost(null);
    setUpdatingId(null);
  };

  const mapStatusToEditorial = (status: string): KanbanColumn => {
    switch (status) {
      case 'published':
        return 'published';
      case 'scheduled':
        return 'scheduled';
      default:
        return 'draft';
    }
  };

  const getPostsForColumn = (columnId: KanbanColumn) => {
    return posts.filter((post) => {
      const editorialStatus = post.editorial_status || mapStatusToEditorial(post.status);
      return editorialStatus === columnId;
    });
  };

  const getGeoScoreColor = (score: number | null) => {
    if (!score) return 'bg-muted text-muted-foreground';
    if (score >= 80) return 'bg-green-500/20 text-green-700';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-700';
    return 'bg-red-500/20 text-red-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Arraste os posts entre as colunas para atualizar o status
        </p>
        <Badge variant="outline">{posts.length} posts</Badge>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnPosts = getPostsForColumn(column.id);
          return (
            <Card
              key={column.id}
              className={`flex-shrink-0 w-[280px] ${column.color}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div>
                    <span>{column.title}</span>
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">
                      {column.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {columnPosts.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px] pr-2">
                  <div className="space-y-2">
                    {columnPosts.map((post) => (
                      <Card
                        key={post.id}
                        className={`cursor-grab active:cursor-grabbing bg-background transition-all ${
                          updatingId === post.id ? 'opacity-50' : ''
                        } ${draggedPost?.id === post.id ? 'ring-2 ring-primary' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, post)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-2 mb-2">
                                {post.title}
                              </p>
                              
                              <div className="flex flex-wrap gap-1 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {post.category}
                                </Badge>
                                {post.geo_score !== null && post.geo_score !== undefined && (
                                  <Badge className={`text-xs gap-1 ${getGeoScoreColor(post.geo_score)}`}>
                                    <TrendingUp className="h-3 w-3" />
                                    {post.geo_score}
                                  </Badge>
                                )}
                              </div>
                              
                              {post.scheduled_for && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(post.scheduled_for), "dd/MM 'às' HH:mm", {
                                    locale: ptBR,
                                  })}
                                </div>
                              )}
                              
                              {post.auto_published && (
                                <Badge className="text-xs mt-1 bg-purple-500/20 text-purple-700">
                                  🤖 Auto-publicado
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-1 mt-2 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs flex-1"
                              onClick={() => onViewPost?.(post)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs flex-1"
                              onClick={() => onEditPost?.(post)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {columnPosts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        <p>Nenhum post</p>
                        <p className="text-xs mt-1">Arraste posts para cá</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
