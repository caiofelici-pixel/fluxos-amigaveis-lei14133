import { useState } from "react";
import { INCISOS_ART18 } from "@/data/art18";
import { useDocumento } from "@/contexts/DocumentoContext";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface IncisoEditorProps {
  incisoNumero: string;
  onNavigate: (numero: string) => void;
}

export function IncisoEditor({ incisoNumero, onNavigate }: IncisoEditorProps) {
  const inciso = INCISOS_ART18.find((i) => i.numero === incisoNumero);
  const { documento, atualizarInciso } = useDocumento();
  const [valor, setValor] = useState(
    documento?.incisos[incisoNumero]?.conteudo || ""
  );
  const [gerando, setGerando] = useState(false);

  if (!inciso || !documento) return null;

  const idx = INCISOS_ART18.findIndex((i) => i.numero === incisoNumero);
  const anterior = idx > 0 ? INCISOS_ART18[idx - 1].numero : null;
  const proximo = idx < INCISOS_ART18.length - 1 ? INCISOS_ART18[idx + 1].numero : null;

  const handleChange = (val: string) => {
    setValor(val);
    atualizarInciso(incisoNumero, val);
  };

  const gerarComIA = async () => {
    setGerando(true);
    try {
      const { data, error } = await supabase.functions.invoke("gerar-inciso", {
        body: {
          objeto: documento.objeto,
          tipo: documento.tipo,
          nivelDetalhamento: documento.nivelDetalhamento,
          incisoNumero: inciso.numero,
          incisoTitulo: inciso.titulo,
          incisoDescricao: inciso.descricao,
          incisoTextoLegal: inciso.textoLegal,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const conteudo = data?.content || "";
      setValor(conteudo);
      atualizarInciso(incisoNumero, conteudo);
      toast({ title: "Conteúdo gerado", description: `Inciso ${inciso.numero} preenchido com IA.` });
    } catch (err: any) {
      console.error("Erro ao gerar:", err);
      toast({
        title: "Erro ao gerar conteúdo",
        description: err?.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            Inciso {inciso.numero}
          </span>
          {inciso.obrigatorio ? (
            <Badge variant="default" className="bg-primary text-primary-foreground text-[10px] uppercase tracking-wider">
              Obrigatório
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              Quando aplicável
            </Badge>
          )}
        </div>
        <h1 className="text-display text-foreground font-semibold">
          {inciso.titulo}
        </h1>
        <p className="text-body text-muted-foreground mt-2">
          {inciso.descricao}
        </p>
      </div>

      <div className="shadow-card rounded-lg bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-body font-medium text-foreground">
            Conteúdo
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={gerarComIA}
              disabled={gerando}
              className="gap-1.5 text-xs"
            >
              {gerando ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {gerando ? "Gerando..." : "Gerar com IA"}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  Texto da Lei
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-body" align="end">
                <p className="font-medium text-foreground mb-2">
                  Lei 14.133/2021
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {inciso.textoLegal}
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Textarea
          value={valor}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={gerando ? "Gerando conteúdo com IA..." : `Descreva aqui o conteúdo referente a "${inciso.titulo}" para o objeto definido...`}
          className="min-h-[200px] resize-y text-body leading-relaxed border-input bg-background"
          disabled={gerando}
        />

        {documento.incisos[incisoNumero]?.preenchido && (
          <p className="mt-3 text-xs text-success font-medium flex items-center gap-1.5">
            ✓ Inciso preenchido
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          size="sm"
          disabled={!anterior}
          onClick={() => anterior && onNavigate(anterior)}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!proximo}
          onClick={() => proximo && onNavigate(proximo)}
          className="gap-1.5"
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
