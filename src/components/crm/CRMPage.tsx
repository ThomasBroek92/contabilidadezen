import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRMDashboard } from './CRMDashboard';
import { CRMKanban } from './CRMKanban';
import { LeadDetail } from './LeadDetail';
import { LeadsTable } from './LeadsTableEnhanced';
import { FollowUpEngine } from './FollowUpEngine';
import { AlertsDashboard } from './AlertsDashboard';
import { CadenceManager } from './CadenceManager';
import { LayoutDashboard, Kanban, Table2, Bell, Zap, Settings } from 'lucide-react';

export function CRMPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const handleCloseLead = () => {
    setSelectedLeadId(null);
  };

  const handleLeadUpdate = () => {
    // Refresh data when lead is updated
    // The child components will handle their own refresh
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">CRM</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e acompanhe o funil de vendas
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="followup" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Follow-up</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            <span className="hidden sm:inline">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table2 className="h-4 w-4" />
            <span className="hidden sm:inline">Lista</span>
          </TabsTrigger>
          <TabsTrigger value="cadences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Cadências</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <CRMDashboard />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertsDashboard onSelectLead={handleSelectLead} />
        </TabsContent>

        <TabsContent value="followup" className="mt-6">
          <FollowUpEngine onSelectLead={handleSelectLead} />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <CRMKanban onSelectLead={handleSelectLead} />
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <LeadsTable onSelectLead={handleSelectLead} />
        </TabsContent>

        <TabsContent value="cadences" className="mt-6">
          <CadenceManager />
        </TabsContent>
      </Tabs>

      {/* Lead Detail Modal */}
      {selectedLeadId && (
        <LeadDetail
          leadId={selectedLeadId}
          onClose={handleCloseLead}
          onUpdate={handleLeadUpdate}
        />
      )}
    </div>
  );
}
