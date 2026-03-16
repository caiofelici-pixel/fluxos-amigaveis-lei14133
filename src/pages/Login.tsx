import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale, LogIn, UserPlus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function usernameToEmail(username: string) {
  return `${username.toLowerCase().trim()}@licitador.local`;
}

export default function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modo, setModo] = useState<"login" | "cadastro">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !senha.trim()) return;

    const email = usernameToEmail(usuario);
    setCarregando(true);

    try {
      if (modo === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;

        // Check if user is blocked
        const { data: profile } = await supabase
          .from("profiles")
          .select("blocked")
          .eq("id", data.user.id)
          .single();

        if (profile?.blocked) {
          await supabase.auth.signOut();
          throw new Error("Seu acesso foi bloqueado. Contate o administrador.");
        }

        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        });
        if (error) throw error;
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login.",
        });
        setModo("login");
      }
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Falha na autenticação.",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground tracking-tight">
              Sistema Automatizado de Criação
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {modo === "login" ? "Bem Vindo ao Sistema" : "Criar Conta"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {modo === "login"
              ? "Informe suas credenciais para acessar o sistema."
              : "Escolha um nome de usuário e uma senha."}
          </p>
        </div>

        <div className="shadow-elevated rounded-lg bg-surface p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Usuário
              </label>
              <Input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu nome de usuário"
                className="h-11"
                disabled={carregando}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="h-11"
                disabled={carregando}
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={!usuario.trim() || !senha.trim() || carregando}
              className="w-full h-11 font-medium transition-all duration-150 hover:-translate-y-px hover:shadow-elevated gap-2"
            >
              {carregando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : modo === "login" ? (
                <>
                  <LogIn className="h-4 w-4" />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Cadastrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setModo(modo === "login" ? "cadastro" : "login")}
              className="text-sm text-primary hover:underline"
              disabled={carregando}
            >
              {modo === "login"
                ? "Não tem conta? Cadastre-se"
                : "Já tem conta? Faça login"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By Skynet Tecnologia
        </p>
      </div>
    </div>
  );
}
