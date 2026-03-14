import { useState } from "react";
import { useDocumento } from "@/contexts/DocumentoContext";
import { BarraConformidade } from "@/components/BarraConformidade";
import { SidebarNav } from "@/components/SidebarNav";
import { IncisoEditor } from "@/components/IncisoEditor";
import { NovoDocumento } from "@/components/NovoDocumento";
import { Scale } from "lucide-react";

const Index = () => {
  const { documento } = useDocumento();
  const [incisoAtivo, setIncisoAtivo] = useState("I");

  if (!documento) {
    return <NovoDocumento />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BarraConformidade />
      <div className="flex flex-1">
        <SidebarNav incisoAtivo={incisoAtivo} onSelect={setIncisoAtivo} />
        <main className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="border-b bg-surface px-8 py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs">{documento.tipo}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-body font-medium text-foreground truncate">
                  {documento.objeto}
                </span>
              </div>
            </div>
            <IncisoEditor
              key={incisoAtivo}
              incisoNumero={incisoAtivo}
              onNavigate={setIncisoAtivo}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
