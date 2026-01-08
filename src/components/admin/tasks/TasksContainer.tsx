import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { TaskKanban } from './TaskKanban';
import { ListChecks, RefreshCw } from 'lucide-react';

export function TasksContainer() {
  return (
    <Tabs defaultValue="non-recurring" className="space-y-4">
      <TabsList>
        <TabsTrigger value="non-recurring" className="gap-2">
          <ListChecks className="h-4 w-4" />
          Não Recorrentes
        </TabsTrigger>
        <TabsTrigger value="recurring" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Recorrentes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="non-recurring">
        <TaskKanban />
      </TabsContent>

      <TabsContent value="recurring">
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tarefas Recorrentes</h3>
            <p className="text-muted-foreground">
              Em breve você poderá configurar tarefas que se repetem automaticamente.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
