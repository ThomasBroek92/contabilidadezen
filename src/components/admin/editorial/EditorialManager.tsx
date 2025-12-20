import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Columns3, BarChart3, Settings } from 'lucide-react';
import { EditorialCalendar } from './EditorialCalendar';
import { EditorialKanban } from './EditorialKanban';
import { EditorialDashboard } from './EditorialDashboard';
import { useNavigate } from 'react-router-dom';

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
  persona_alvo?: string | null;
}

export function EditorialManager() {
  const [activeTab, setActiveTab] = useState('calendar');
  const navigate = useNavigate();

  const handleViewPost = (post: BlogPost) => {
    if (post.status === 'published') {
      window.open(`/blog/${post.slug}`, '_blank');
    }
  };

  const handleEditPost = (post: BlogPost) => {
    // For now, we'll show a toast - in a full implementation, 
    // this would open the blog editor with the post loaded
    console.log('Edit post:', post.id);
  };

  const handleCreatePost = (date: Date) => {
    // In a full implementation, this would open the blog editor
    // with the date pre-filled for scheduling
    console.log('Create post for date:', date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Calendário Editorial
          </CardTitle>
          <CardDescription>
            Gerencie seu conteúdo com visões de calendário, Kanban e métricas de performance.
            A publicação automática está configurada para posts agendados.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <Columns3 className="h-4 w-4" />
            <span className="hidden sm:inline">Kanban</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <EditorialCalendar
            onPostClick={handleViewPost}
            onCreatePost={handleCreatePost}
          />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <EditorialKanban
            onEditPost={handleEditPost}
            onViewPost={handleViewPost}
          />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <EditorialDashboard />
        </TabsContent>
      </Tabs>

      {/* Automation Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">🤖 Automação Ativa</h4>
              <p className="text-sm text-muted-foreground">
                Posts com status <strong>"Agendado"</strong> serão publicados automaticamente 
                quando o horário agendado for atingido. O sistema verifica diariamente às 9h UTC.
              </p>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span>✅ Cron job configurado</span>
                <span>✅ Publicação automática ativa</span>
                <span>✅ Geração de conteúdo IA disponível</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
