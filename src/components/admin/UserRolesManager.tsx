import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, UserPlus, Shield, ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import { z } from 'zod';

interface UserWithRoles {
  user_id: string;
  email: string;
  roles: AppRole[];
}

const emailSchema = z.string().trim().email('E-mail inválido');

export function UserRolesManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AppRole>('sales_rep');
  const [isAdding, setIsAdding] = useState(false);
  const [emailError, setEmailError] = useState('');

  const fetchUsersWithRoles = async () => {
    setLoading(true);
    try {
      const { data: rolesData, error } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (error) throw error;

      // Group roles by user_id
      const userRolesMap = new Map<string, AppRole[]>();
      rolesData?.forEach((item: { user_id: string; role: AppRole }) => {
        const existing = userRolesMap.get(item.user_id) || [];
        userRolesMap.set(item.user_id, [...existing, item.role]);
      });

      // We can't fetch emails from auth.users directly, so we'll display user_id
      // In a real app, you'd have a profiles table
      const usersWithRoles: UserWithRoles[] = Array.from(userRolesMap.entries()).map(
        ([user_id, roles]) => ({
          user_id,
          email: user_id, // Would be email from profiles table
          roles,
        })
      );

      setUsers(usersWithRoles);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({
        title: 'Erro ao carregar usuários',
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
    // Validate email
    const emailResult = emailSchema.safeParse(newEmail);
    if (!emailResult.success) {
      setEmailError(emailResult.error.errors[0].message);
      return;
    }
    setEmailError('');

    setIsAdding(true);
    try {
      // First, we need to find the user by email
      // Since we can't query auth.users, the admin needs to use the user_id directly
      // In a real app, you'd have a profiles table to look up the user
      
      // For now, we'll treat the input as a user_id
      const userId = newEmail.includes('@') 
        ? newEmail // If it looks like email, we need a profiles lookup
        : newEmail; // If it's a UUID, use directly

      // Check if user already has this role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', newRole)
        .maybeSingle();

      if (existingRole) {
        toast({
          title: 'Role já existe',
          description: 'Este usuário já possui esta role.',
          variant: 'destructive',
        });
        setIsAdding(false);
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast({
        title: 'Role adicionada!',
        description: `Role ${newRole} adicionada com sucesso.`,
      });

      setNewEmail('');
      fetchUsersWithRoles();
    } catch (err: any) {
      console.error('Error adding role:', err);
      toast({
        title: 'Erro ao adicionar role',
        description: err.message || 'Não foi possível adicionar a role.',
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
        title: 'Role removida!',
        description: `Role ${role} removida com sucesso.`,
      });

      fetchUsersWithRoles();
    } catch (err: any) {
      console.error('Error removing role:', err);
      toast({
        title: 'Erro ao remover role',
        description: err.message || 'Não foi possível remover a role.',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadge = (role: AppRole) => {
    const config = {
      admin: { label: 'Admin', icon: ShieldCheck, variant: 'default' as const },
      sales_manager: { label: 'Gerente', icon: Shield, variant: 'secondary' as const },
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
    <div className="space-y-6">
      {/* Add Role Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Role
          </CardTitle>
          <CardDescription>
            Adicione uma nova role a um usuário existente. Use o ID do usuário (UUID) para identificá-lo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="user-id">ID do Usuário (UUID)</Label>
              <Input
                id="user-id"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              {emailError && <p className="text-sm text-destructive">{emailError}</p>}
            </div>
            <div className="sm:w-48 space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="sales_manager">Gerente de Vendas</SelectItem>
                  <SelectItem value="sales_rep">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:self-end">
              <Button onClick={handleAddRole} disabled={isAdding || !newEmail}>
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuários com Roles</CardTitle>
              <CardDescription>
                Gerencie as roles dos usuários do sistema.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchUsersWithRoles} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum usuário com roles encontrado.</p>
              <p className="text-sm">Adicione roles usando o formulário acima.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Usuário</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-mono text-sm">
                      {user.user_id.slice(0, 8)}...{user.user_id.slice(-4)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                          <div key={role} className="flex items-center gap-1">
                            {getRoleBadge(role)}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemoveRole(user.user_id, role)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Additional actions could go here */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
