import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale, LogIn, UserPlus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modo, setModo] = useState<"login" | "cadastro">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) return;

    setCarregando(true);
    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
        });
        if (error) throw error;
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu e-mail para confirmar a conta.",
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
              Licitador 14.133
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {modo === "login" ? "Acesso ao Sistema" : "Criar Conta"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {modo === "login"
              ? "Informe suas credenciais para acessar o sistema."
              : "Preencha os dados para criar sua conta."}
          </p>
        </div>

        <div className="shadow-elevated rounded-lg bg-surface p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Usuário (e-mail)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
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
              disabled={!email.trim() || !senha.trim() || carregando}
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
          Conforme Lei nº 14.133/2021 — Art. 18
        </p>
      </div>
    </div>
  );
}
