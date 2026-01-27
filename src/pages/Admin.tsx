import { useEffect, useState, useTransition, Suspense, lazy } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/SEOHead';
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
  ChevronDown,
  MousePointerClick,
  Sparkles,
  StickyNote,
  Chrome
} from 'lucide-react';
import logoIcon from '@/assets/logo-icon.png';
// Lazy load components for better performance
const UserRolesManager = lazy(() => import('@/components/admin/UserRolesManager').then(m => ({ default: m.UserRolesManager })));
const CRMPage = lazy(() => import('@/components/crm/CRMPage').then(m => ({ default: m.CRMPage })));
const AnalyticsDashboard = lazy(() => import('@/components/admin/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const ContentStudio = lazy(() => import('@/components/admin/ContentStudio').then(m => ({ default: m.ContentStudio })));
const GoogleIntegrationGuide = lazy(() => import('@/components/admin/GoogleIntegrationGuide').then(m => ({ default: m.GoogleIntegrationGuide })));
const SEOIndexingAuditor = lazy(() => import('@/components/admin/SEOIndexingAuditor').then(m => ({ default: m.SEOIndexingAuditor })));
const GEOManager = lazy(() => import('@/components/admin/geo/GEOManager').then(m => ({ default: m.GEOManager })));
const NotionWidget = lazy(() => import('@/components/admin/NotionWidget').then(m => ({ default: m.NotionWidget })));
const TasksContainer = lazy(() => import('@/components/admin/tasks').then(m => ({ default: m.TasksContainer })));
import { cn } from '@/lib/utils';

type TabId = 'analytics' | 'content' | 'tasks' | 'leads' | 'users' | 'seo' | 'geo' | 'integrations' | 'notion' | 'google';

interface SubNavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  requiresLeadAccess?: boolean;
  subItems?: SubNavItem[];
}

const navItems: NavItem[] = [
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    adminOnly: true,
    subItems: [
      { id: 'seo', label: 'SEO & Indexação', icon: Search },
      { id: 'geo', label: 'GEO Manager', icon: Sparkles },
    ]
  },
  { id: 'content', label: 'Conteúdo', icon: PenTool, adminOnly: true },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare, requiresLeadAccess: true },
  { id: 'leads', label: 'Leads', icon: FileText, requiresLeadAccess: true },
  { id: 'users', label: 'Equipe', icon: Users, adminOnly: true },
  { 
    id: 'integrations', 
    label: 'Integrações', 
    icon: Settings, 
    adminOnly: true,
    subItems: [
      { id: 'notion', label: 'Notion', icon: StickyNote },
      { id: 'google', label: 'Google', icon: Chrome },
    ]
  },
];

export default function Admin() {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const { user, loading, roles, signOut, isAdmin, canViewLeads } = useAuth();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [expandedMenus, setExpandedMenus] = useState<Set<TabId>>(new Set(['analytics']));
  
  // Determinar tab ativa baseada na URL
  const validTabs: TabId[] = ['analytics', 'content', 'tasks', 'leads', 'users', 'seo', 'geo', 'integrations', 'notion', 'google'];
  const activeTab: TabId = (tab && validTabs.includes(tab as TabId)) ? (tab as TabId) : 'analytics';

  // Auto-expand parent menu if a sub-item is active
  useEffect(() => {
    navItems.forEach(item => {
      if (item.subItems?.some(sub => sub.id === activeTab)) {
        setExpandedMenus(prev => new Set([...prev, item.id]));
      }
    });
  }, [activeTab]);

  const toggleMenu = (id: TabId) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleTabChange = (tabId: TabId) => {
    startTransition(() => {
      navigate(`/admin/${tabId}`, { replace: false });
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Redirecionar para tab correta baseado em permissões
  useEffect(() => {
    if (!loading && user && !tab) {
      if (isAdmin()) {
        navigate('/admin/analytics', { replace: true });
      } else if (canViewLeads()) {
        navigate('/admin/leads', { replace: true });
      }
    }
  }, [loading, user, isAdmin, canViewLeads, tab, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
      case 'geo':
        return <GEOManager />;
      case 'integrations':
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <NotionWidget />
            <GoogleIntegrationGuide />
          </div>
        );
      case 'notion':
        return <NotionWidget />;
      case 'google':
        return <GoogleIntegrationGuide />;
      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead
        title="Painel Administrativo | Contabilidade Zen"
        description="Área administrativa restrita da Contabilidade Zen."
        noindex={true}
        nofollow={true}
      />
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
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.has(item.id);
            const hasActiveSubItem = item.subItems?.some(sub => sub.id === activeTab);
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasSubItems && !collapsed) {
                      toggleMenu(item.id);
                    }
                    handleTabChange(item.id);
                  }}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                    (isActive || hasActiveSubItem) 
                      ? "bg-muted font-medium text-foreground" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {isPending && activeTab !== item.id && item.id === activeTab ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4 shrink-0" />
                  )}
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      {hasSubItems && (
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform",
                            isExpanded && "rotate-180"
                          )} 
                        />
                      )}
                    </>
                  )}
                </button>
                
                {/* Sub Items */}
                {hasSubItems && isExpanded && !collapsed && (
                  <div className="ml-4 mt-1 space-y-1 border-l pl-2">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeTab === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleTabChange(subItem.id)}
                          type="button"
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                            isSubActive 
                              ? "bg-muted font-medium text-foreground" 
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          <SubIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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
        <main className="flex-1 p-6 overflow-auto relative">
          {isPending && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Carregando...</span>
              </div>
            </div>
          )}
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }>
            {renderContent()}
          </Suspense>
        </main>
      </div>
      </div>
    </>
  );
}