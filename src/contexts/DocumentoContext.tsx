import React, { createContext, useContext, useState, useCallback } from "react";
import { Documento, INCISOS_ART18, NivelDetalhamento } from "@/data/art18";

interface DocumentoContextType {
  documento: Documento | null;
  resetDocumento: () => void;
  criarDocumento: (objeto: string, tipo: Documento["tipo"], nivelDetalhamento?: NivelDetalhamento) => void;
  atualizarInciso: (numero: string, conteudo: string) => void;
  getProgresso: () => { total: number; preenchidos: number; percentual: number };
}

const DocumentoContext = createContext<DocumentoContextType | null>(null);

export function DocumentoProvider({ children }: { children: React.ReactNode }) {
  const [documento, setDocumento] = useState<Documento | null>(null);

  const criarDocumento = useCallback((objeto: string, tipo: Documento["tipo"], nivelDetalhamento: NivelDetalhamento = "medio") => {
    const incisos: Documento["incisos"] = {};
    INCISOS_ART18.forEach((inc) => {
      incisos[inc.numero] = { preenchido: false, conteudo: "" };
    });

    setDocumento({
      id: crypto.randomUUID(),
      objeto,
      tipo,
      nivelDetalhamento,
      dataCriacao: new Date().toISOString(),
      status: "rascunho",
      incisos,
    });
  }, []);

  const resetDocumento = useCallback(() => {
    setDocumento(null);
  }, []);

  const atualizarInciso = useCallback((numero: string, conteudo: string) => {
    setDocumento((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        incisos: {
          ...prev.incisos,
          [numero]: { preenchido: conteudo.trim().length > 0, conteudo },
        },
      };
    });
  }, []);

  const getProgresso = useCallback(() => {
    if (!documento) return { total: 0, preenchidos: 0, percentual: 0 };
    const obrigatorios = INCISOS_ART18.filter((i) => i.obrigatorio);
    const total = obrigatorios.length;
    const preenchidos = obrigatorios.filter(
      (i) => documento.incisos[i.numero]?.preenchido
    ).length;
    return { total, preenchidos, percentual: total > 0 ? Math.round((preenchidos / total) * 100) : 0 };
  }, [documento]);

  return (
    <DocumentoContext.Provider value={{ documento, resetDocumento, criarDocumento, atualizarInciso, getProgresso }}>
      {children}
    </DocumentoContext.Provider>
  );
}

export function useDocumento() {
  const ctx = useContext(DocumentoContext);
  if (!ctx) throw new Error("useDocumento must be used within DocumentoProvider");
  return ctx;
}
