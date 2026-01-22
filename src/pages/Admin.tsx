import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  LogOut, 
  Users, 
  FileText, 
  BarChart3, 
  PenTool, 
  Settings, 
  Search, 
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  MousePointerClick
} from 'lucide-react';
import logoIcon from '@/assets/logo-icon.png';
import { UserRolesManager } from '@/components/admin/UserRolesManager';
import { CRMPage } from '@/components/crm/CRMPage';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { ContentStudio } from '@/components/admin/ContentStudio';
import { GoogleIntegrationGuide } from '@/components/admin/GoogleIntegrationGuide';
import { SEOIndexingAuditor } from '@/components/admin/SEOIndexingAuditor';
import { NotionWidget } from '@/components/admin/NotionWidget';
import { TasksContainer } from '@/components/admin/tasks';
import { cn } from '@/lib/utils';

type TabId = 'analytics' | 'content' | 'tasks' | 'leads' | 'users' | 'seo' | 'integrations';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  requiresLeadAccess?: boolean;
}

const navItems: NavItem[] = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3, adminOnly: true },
  { id: 'content', label: 'Conteúdo', icon: PenTool, adminOnly: true },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare, requiresLeadAccess: true },
  { id: 'leads', label: 'Leads', icon: FileText, requiresLeadAccess: true },
  { id: 'users', label: 'Equipe', icon: Users, adminOnly: true },
  { id: 'seo', label: 'SEO', icon: Search, adminOnly: true },
  { id: 'integrations', label: 'Integrações', icon: Settings, adminOnly: true },
];

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, roles, signOut, isAdmin, canViewLeads } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    // Recuperar tab salva ou usar analytics como padrão
    const saved = sessionStorage.getItem('admin-active-tab');
    return (saved as TabId) || 'analytics';
  });

  // Persistir tab ativa
  useEffect(() => {
    sessionStorage.setItem('admin-active-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Set initial tab based on permissions
  useEffect(() => {
    if (!loading && user) {
      if (isAdmin()) {
        setActiveTab('analytics');
      } else if (canViewLeads()) {
        setActiveTab('leads');
      }
    }
  }, [loading, user, isAdmin, canViewLeads]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Até logo!',
      description: 'Você saiu da sua conta.',
    });
    navigate('/auth');
  };

  const handleTestExitIntent = () => {
    window.dispatchEvent(new CustomEvent('force-exit-intent-popup'));
    toast({
      title: 'Pop-up de Exit Intent',
      description: 'O pop-up foi exibido para teste.',
    });
  };

  const canAccessTab = (item: NavItem): boolean => {
    if (item.adminOnly && !isAdmin()) return false;
    if (item.requiresLeadAccess && !canViewLeads()) return false;
    return true;
  };

  const visibleNavItems = navItems.filter(canAccessTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Acesso Pendente</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Aguarde um administrador liberar seu acesso.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'content':
        return <ContentStudio />;
      case 'tasks':
        return <TasksContainer />;
      case 'leads':
        return <CRMPage />;
      case 'users':
        return <UserRolesManager />;
      case 'seo':
        return <SEOIndexingAuditor />;
      case 'integrations':
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <NotionWidget />
            <GoogleIntegrationGuide />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "h-screen sticky top-0 border-r bg-card flex flex-col transition-all duration-200",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b">
          {!collapsed && (
            <span className="font-medium text-sm truncate">Contabilidade Zen</span>
          )}
          <img 
            src={logoIcon} 
            alt="CZ" 
            className={cn("h-7 w-7", collapsed && "mx-auto")} 
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(item.id);
                }}
                type="button"
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                  isActive 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-2 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 mx-auto" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-medium">
              {visibleNavItems.find(i => i.id === activeTab)?.label}
            </h1>
            {roles.length > 0 && (
              <Badge variant="outline" className="text-xs font-normal">
                {roles.includes('admin') ? 'Admin' : roles.includes('sales_manager') ? 'Gerente' : 'Vendedor'}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleTestExitIntent}
              className="text-muted-foreground text-xs"
            >
              <MousePointerClick className="h-3.5 w-3.5 mr-1.5" />
              Exit Intent
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}