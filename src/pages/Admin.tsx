import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, Users, UserCog, FileText, Shield, ShieldCheck, ShieldAlert, BarChart3, CalendarDays, Sparkles } from 'lucide-react';
import logoFull from '@/assets/logo-full.png';
import { UserRolesManager } from '@/components/admin/UserRolesManager';
import { CRMPage } from '@/components/crm/CRMPage';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { EditorialManager } from '@/components/admin/editorial/EditorialManager';
import { GEOManager } from '@/components/admin/geo/GEOManager';

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading, roles, signOut, isAdmin, canViewLeads } = useAuth();
  const { toast } = useToast();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleBadge = (role: AppRole) => {
    const config = {
      admin: { label: 'Administrador', icon: ShieldCheck, variant: 'default' as const },
      sales_manager: { label: 'Gerente de Vendas', icon: Shield, variant: 'secondary' as const },
      sales_rep: { label: 'Vendedor', icon: ShieldAlert, variant: 'outline' as const },
    };
    const { label, icon: Icon, variant } = config[role];
    return (
      <Badge key={role} variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoFull} alt="Contabilidade Zen" className="h-8" />
            <span className="text-sm text-muted-foreground">Painel Administrativo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Suas Permissões
            </CardTitle>
            <CardDescription>
              Suas roles determinam o que você pode acessar no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">{roles.map(getRoleBadge)}</div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Você ainda não possui nenhuma role atribuída.
              </p>
            )}
          </CardContent>
        </Card>

        {roles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-muted-foreground">
                Você precisa de uma role atribuída por um administrador.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={isAdmin() ? 'analytics' : canViewLeads() ? 'leads' : 'users'} className="space-y-4">
            <TabsList>
              {isAdmin() && (
                <TabsTrigger value="analytics" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              )}
              {isAdmin() && (
                <TabsTrigger value="editorial" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Editorial
                </TabsTrigger>
              )}
              {isAdmin() && (
                <TabsTrigger value="geo" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  GEO
                </TabsTrigger>
              )}
              {canViewLeads() && (
                <TabsTrigger value="leads" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Leads
                </TabsTrigger>
              )}
              {isAdmin() && (
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  Usuários
                </TabsTrigger>
              )}
            </TabsList>

            {isAdmin() && (
              <TabsContent value="analytics">
                <AnalyticsDashboard />
              </TabsContent>
            )}

            {isAdmin() && (
              <TabsContent value="editorial">
                <EditorialManager />
              </TabsContent>
            )}

            {isAdmin() && (
              <TabsContent value="geo">
                <GEOManager />
              </TabsContent>
            )}

            {canViewLeads() && (
              <TabsContent value="leads">
                <CRMPage />
              </TabsContent>
            )}

            {isAdmin() && (
              <TabsContent value="users">
                <UserRolesManager />
              </TabsContent>
            )}
          </Tabs>
        )}
      </main>
    </div>
  );
}
