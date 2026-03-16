import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, ShieldOff, Loader2, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string;
  blocked: boolean;
  created_at: string;
  roles: string[];
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Check if current user is admin
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .then(({ data }) => {
        if (!data || data.length === 0) {
          navigate("/", { replace: true });
          toast({ title: "Acesso negado", description: "Você não tem permissão de administrador.", variant: "destructive" });
        } else {
          setIsAdmin(true);
        }
      });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers();
  }, [isAdmin]);

  async function fetchUsers() {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, blocked, created_at");

    if (error) {
      toast({ title: "Erro", description: "Falha ao carregar usuários.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Fetch roles for all users
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    const usersWithRoles: UserProfile[] = (profiles || []).map((p: any) => ({
      ...p,
      roles: (roles || [])
        .filter((r: any) => r.user_id === p.id)
        .map((r: any) => r.role),
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  }

  async function toggleBlock(userId: string, currentlyBlocked: boolean) {
    setTogglingId(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ blocked: !currentlyBlocked })
      .eq("id", userId);

    if (error) {
      toast({ title: "Erro", description: "Falha ao atualizar status.", variant: "destructive" });
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked: !currentlyBlocked } : u))
      );
      toast({
        title: !currentlyBlocked ? "Usuário bloqueado" : "Usuário desbloqueado",
        description: `Acesso ${!currentlyBlocked ? "revogado" : "restaurado"} com sucesso.`,
      });
    }
    setTogglingId(null);
  }

  if (authLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b bg-surface px-6 py-3 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Users className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold text-foreground">
              Painel de Administração
            </span>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Gerenciamento de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum usuário cadastrado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const isCurrentUser = u.id === user?.id;
                    const isAdminUser = u.roles.includes("admin");
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.username}</TableCell>
                        <TableCell>
                          {isAdminUser ? (
                            <Badge className="gap-1">
                              <Shield className="h-3 w-3" /> Admin
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Usuário</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(u.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {u.blocked ? (
                            <Badge variant="destructive" className="gap-1">
                              <ShieldOff className="h-3 w-3" /> Bloqueado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-green-600 border-green-300">
                              Ativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isCurrentUser ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            <Switch
                              checked={!u.blocked}
                              disabled={togglingId === u.id}
                              onCheckedChange={() => toggleBlock(u.id, u.blocked)}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
