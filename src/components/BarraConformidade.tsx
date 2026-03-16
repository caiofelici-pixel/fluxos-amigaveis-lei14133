import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useDocumento } from "@/contexts/DocumentoContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BarraConformidade() {
  const { getProgresso, documento } = useDocumento();
  const { preenchidos, total, percentual } = getProgresso();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .then(({ data }) => setIsAdmin(!!data && data.length > 0));
  }, [user]);

  if (!documento) return null;

  return (
    <div className="sticky top-0 z-50 border-b bg-surface px-6 py-3 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-body font-medium text-foreground">
            Conformidade Art. 18
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {preenchidos}/{total} incisos obrigatórios
          </span>
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Progress value={percentual} className="h-2" />
          <span className="font-mono text-xs font-medium text-primary min-w-[3ch]">
            {percentual}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="gap-1.5 text-muted-foreground hover:text-foreground">
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
