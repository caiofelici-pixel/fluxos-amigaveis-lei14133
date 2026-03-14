import { INCISOS_ART18 } from "@/data/art18";
import { useDocumento } from "@/contexts/DocumentoContext";
import { cn } from "@/lib/utils";
import { Check, Circle, AlertCircle } from "lucide-react";

interface SidebarNavProps {
  incisoAtivo: string;
  onSelect: (numero: string) => void;
}

export function SidebarNav({ incisoAtivo, onSelect }: SidebarNavProps) {
  const { documento } = useDocumento();

  return (
    <aside className="w-[280px] shrink-0 border-r bg-surface overflow-y-auto h-[calc(100vh-49px)]">
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Incisos do Art. 18
        </h2>
        <nav className="space-y-1">
          {INCISOS_ART18.map((inciso) => {
            const preenchido = documento?.incisos[inciso.numero]?.preenchido;
            const ativo = incisoAtivo === inciso.numero;

            return (
              <button
                key={inciso.numero}
                onClick={() => onSelect(inciso.numero)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors duration-150",
                  ativo
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                )}
              >
                <span className="shrink-0">
                  {preenchido ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : inciso.obrigatorio ? (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="font-mono text-xs text-muted-foreground">
                    Inciso {inciso.numero}
                  </span>
                  <span className="text-body truncate font-medium">
                    {inciso.titulo}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
