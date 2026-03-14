import { Progress } from "@/components/ui/progress";
import { useDocumento } from "@/contexts/DocumentoContext";

export function BarraConformidade() {
  const { getProgresso, documento } = useDocumento();
  const { preenchidos, total, percentual } = getProgresso();

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
      </div>
    </div>
  );
}
