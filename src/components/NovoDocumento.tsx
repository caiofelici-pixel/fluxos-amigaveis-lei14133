import { useState } from "react";
import { useDocumento } from "@/contexts/DocumentoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Documento } from "@/data/art18";
import { FileText, Scale } from "lucide-react";

export function NovoDocumento() {
  const { criarDocumento } = useDocumento();
  const [objeto, setObjeto] = useState("");
  const [tipo, setTipo] = useState<Documento["tipo"]>("ETP");

  const handleCriar = () => {
    if (!objeto.trim()) return;
    criarDocumento(objeto.trim(), tipo);
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
              />
            </div>

            <div>
              <label className="block text-body font-medium text-foreground mb-2">
                Tipo de Documento
              </label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as Documento["tipo"])}>
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
                  <SelectItem value="TR">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Termo de Referência (TR)
                    </span>
                  </SelectItem>
                  <SelectItem value="Matriz de Riscos">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Matriz de Riscos
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCriar}
              disabled={!objeto.trim()}
              className="w-full h-11 font-medium transition-all duration-150 hover:-translate-y-px hover:shadow-elevated"
            >
              Iniciar Fase Preparatória
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Conforme Lei nº 14.133/2021 — Art. 18
        </p>
      </div>
    </div>
  );
}
