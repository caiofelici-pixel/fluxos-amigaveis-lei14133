import { useState, useEffect } from "react";
import { useDocumento } from "@/contexts/DocumentoContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Documento, INCISOS_ART18, NivelDetalhamento } from "@/data/art18";
import { FileText, Scale, Sparkles, Loader2, Shield, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

export function NovoDocumento() {
  const { criarDocumento, atualizarInciso } = useDocumento();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [objeto, setObjeto] = useState("");
  const [tipo, setTipo] = useState<Documento["tipo"]>("ETP");
  const [gerarAuto, setGerarAuto] = useState(true);
  const [criando, setCriando] = useState(false);
  const [progressoMsg, setProgressoMsg] = useState("");
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

  const handleCriar = async () => {
    if (!objeto.trim()) return;
    
    criarDocumento(objeto.trim(), tipo);

    if (gerarAuto) {
      setCriando(true);
      let preenchidos = 0;

      for (const inciso of INCISOS_ART18) {
        setProgressoMsg(`Gerando inciso ${inciso.numero} — ${inciso.titulo}...`);
        try {
          const { data, error } = await supabase.functions.invoke("gerar-inciso", {
            body: {
              objeto: objeto.trim(),
              tipo,
              incisoNumero: inciso.numero,
              incisoTitulo: inciso.titulo,
              incisoDescricao: inciso.descricao,
              incisoTextoLegal: inciso.textoLegal,
            },
          });

          if (!error && data?.content) {
            atualizarInciso(inciso.numero, data.content);
            preenchidos++;
          }
        } catch (err) {
          console.error(`Erro no inciso ${inciso.numero}:`, err);
        }
      }

      setCriando(false);
      setProgressoMsg("");
      toast({
        title: "Documento gerado!",
        description: `${preenchidos} de ${INCISOS_ART18.length} incisos preenchidos com IA.`,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4 flex items-center gap-1">
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
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground tracking-tight">
              Sistema Automatizado de Criação
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Nova Lei de Licitações
          </h1>
          <p className="text-body text-muted-foreground max-w-sm mx-auto">
            Descreva o objeto. O sistema estruturará os requisitos conforme o Art. 18.
          </p>
        </div>

        <div className="shadow-elevated rounded-lg bg-surface p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-body font-medium text-foreground mb-2">
                Objeto da Contratação
              </label>
              <Input
                value={objeto}
                onChange={(e) => setObjeto(e.target.value)}
                placeholder="Ex: Aquisição de merenda escolar para rede municipal"
                className="h-11"
                disabled={criando}
              />
            </div>

            <div>
              <label className="block text-body font-medium text-foreground mb-2">
                Tipo de Documento
              </label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as Documento["tipo"])} disabled={criando}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETP">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Estudo Técnico Preliminar (ETP)
                    </span>
                  </SelectItem>
                  <SelectItem value="TR" disabled>
                    <span className="flex items-center gap-2 opacity-50">
                      <FileText className="h-4 w-4" />
                      Termo de Referência (TR) — em breve
                    </span>
                  </SelectItem>
                  <SelectItem value="Matriz de Riscos" disabled>
                    <span className="flex items-center gap-2 opacity-50">
                      <FileText className="h-4 w-4" />
                      Matriz de Riscos — em breve
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-md border border-input px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-body font-medium text-foreground">
                  Gerar conteúdo com IA
                </span>
              </div>
              <Switch checked={gerarAuto} onCheckedChange={setGerarAuto} disabled={criando} />
            </div>

            <Button
              onClick={handleCriar}
              disabled={!objeto.trim() || criando}
              className="w-full h-11 font-medium transition-all duration-150 hover:-translate-y-px hover:shadow-elevated gap-2"
            >
              {criando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando documento...
                </>
              ) : (
                "Iniciar Fase Preparatória"
              )}
            </Button>

            {criando && progressoMsg && (
              <p className="text-xs text-muted-foreground text-center animate-pulse">
                {progressoMsg}
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By Skynet Tecnologia
        </p>
      </div>
    </div>
  );
}
