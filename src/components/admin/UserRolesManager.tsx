import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, RefreshCw, UserPlus } from 'lucide-react';

interface UserWithRoles {
  user_id: string;
  email: string | null;
  display_name: string | null;
  roles: AppRole[];
}

export function UserRolesManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState<AppRole>('sales_rep');
  const [isAdding, setIsAdding] = useState(false);

  const fetchUsersWithRoles = async () => {
    setLoading(true);
    try {
      // Get all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get profiles for display names
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email, display_name');

      const profilesMap = new Map(
        profilesData?.map(p => [p.id, { email: p.email, display_name: p.display_name }]) || []
      );

      // Group roles by user_id
      const userRolesMap = new Map<string, AppRole[]>();
      rolesData?.forEach((item: { user_id: string; role: AppRole }) => {
        const existing = userRolesMap.get(item.user_id) || [];
        userRolesMap.set(item.user_id, [...existing, item.role]);
      });

      const usersWithRoles: UserWithRoles[] = Array.from(userRolesMap.entries()).map(
        ([user_id, roles]) => {
          const profile = profilesMap.get(user_id);
          return {
            user_id,
            email: profile?.email || null,
            display_name: profile?.display_name || null,
            roles,
          };
        }
      );

      setUsers(usersWithRoles);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar a lista de usuários.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  const handleAddRole = async () => {
    if (!newUserId.trim()) return;
    
    setIsAdding(true);
    try {
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', newUserId.trim())
        .eq('role', newRole)
        .maybeSingle();

      if (existingRole) {
        toast({
          title: 'Role já existe',
          description: 'Este usuário já possui esta permissão.',
          variant: 'destructive',
        });
        setIsAdding(false);
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: newUserId.trim(), role: newRole });

      if (error) throw error;

      toast({
        title: 'Permissão adicionada',
        description: `${getRoleLabel(newRole)} adicionado com sucesso.`,
      });

      setNewUserId('');
      fetchUsersWithRoles();
    } catch (err: any) {
      console.error('Error adding role:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível adicionar a permissão.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: 'Permissão removida',
        description: `${getRoleLabel(role)} removido.`,
      });

      fetchUsersWithRoles();
    } catch (err: any) {
      console.error('Error removing role:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Não foi possível remover a permissão.',
        variant: 'destructive',
      });
    }
  };

  const getRoleLabel = (role: AppRole): string => {
    const labels = {
      admin: 'Admin',
      sales_manager: 'Gerente',
      sales_rep: 'Vendedor',
    };
    return labels[role];
  };

  const getRoleVariant = (role: AppRole) => {
    const variants = {
      admin: 'default' as const,
      sales_manager: 'secondary' as const,
      sales_rep: 'outline' as const,
    };
    return variants[role];
  };

  return (
    <div className="space-y-6">
      {/* Add Role */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 border rounded-lg bg-card">
        <div className="flex-1">
          <Input
            placeholder="ID do usuário (UUID)"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            className="h-9"
          />
        </div>
        <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="sales_manager">Gerente</SelectItem>
            <SelectItem value="sales_rep">Vendedor</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAddRole} disabled={isAdding || !newUserId.trim()} size="sm" className="h-9">
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-1.5" />
              Adicionar
            </>
          )}
        </Button>
      </div>

      {/* Users List */}
      <div className="border rounded-lg divide-y">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
          <span className="text-sm font-medium">Equipe ({users.length})</span>
          <Button variant="ghost" size="sm" onClick={fetchUsersWithRoles} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhum usuário com permissões.
          </div>
        ) : (
          users.map((user) => (
            <div key={user.user_id} className="flex items-center justify-between px-4 py-3 gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {user.display_name || user.email || 'Usuário'}
                </p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {user.user_id.slice(0, 8)}...
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {user.roles.map((role) => (
                  <div key={role} className="flex items-center gap-1">
                    <Badge variant={getRoleVariant(role)} className="text-xs">
                      {getRoleLabel(role)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleRemoveRole(user.user_id, role)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}