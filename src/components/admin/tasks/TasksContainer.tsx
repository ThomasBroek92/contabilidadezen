import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskKanban } from './TaskKanban';
import { RecurringTasksManager } from './RecurringTasksManager';
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
        <RecurringTasksManager />
      </TabsContent>
    </Tabs>
  );
}
