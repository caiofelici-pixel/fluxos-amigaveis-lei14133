import { Button } from "@/components/ui/button";
import { useDocumento } from "@/contexts/DocumentoContext";
import { INCISOS_ART18 } from "@/data/art18";
import { FileDown, FileText, RotateCcw } from "lucide-react";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

export function ExportarDocumento() {
  const { documento, getProgresso, resetDocumento } = useDocumento();

  if (!documento) return null;

  const { preenchidos, total, percentual } = getProgresso();

  const incisosPreenchidos = INCISOS_ART18.filter(
    (i) => documento.incisos[i.numero]?.preenchido
  );

  const exportarPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
    };

    // Header
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Sistema Automatizado de Criação — By Skynet Tecnologia", margin, y);
    y += 8;

    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(documento.tipo, margin, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const objetoLines = doc.splitTextToSize(documento.objeto, contentWidth);
    doc.text(objetoLines, margin, y);
    y += objetoLines.length * 6 + 4;

    // Metadata
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Data: ${new Date(documento.dataCriacao).toLocaleDateString("pt-BR")}`, margin, y);
    doc.text(`Conformidade: ${preenchidos}/${total} incisos (${percentual}%)`, margin + 80, y);
    y += 10;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Incisos
    for (const inciso of INCISOS_ART18) {
      const dados = documento.incisos[inciso.numero];
      if (!dados?.preenchido) continue;

      checkPage(30);

      // Inciso header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(`Inciso ${inciso.numero} — ${inciso.titulo}`, margin, y);
      y += 6;

      // Legal reference
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(148, 163, 184);
      const legalLines = doc.splitTextToSize(inciso.textoLegal, contentWidth);
      doc.text(legalLines, margin, y);
      y += legalLines.length * 4 + 4;

      // Content
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);
      const contentLines = doc.splitTextToSize(dados.conteudo, contentWidth);

      for (const line of contentLines) {
        checkPage(6);
        doc.text(line, margin, y);
        y += 5;
      }

      y += 8;

      checkPage(2);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.1);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }

    // Footer on last page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Página ${i} de ${pageCount} — Gerado pelo Sistema Automatizado de Criação`,
        margin,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    const nomeArquivo = `${documento.tipo}_${documento.objeto.slice(0, 30).replace(/\s+/g, "_")}.pdf`;
    doc.save(nomeArquivo);
  };

  const exportarWord = async () => {
    const children: any[] = [];

    // Title
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Sistema Automatizado de Criação — By Skynet Tecnologia",
            size: 18,
            color: "94A3B8",
            font: "Arial",
          }),
        ],
        spacing: { after: 200 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: documento.tipo,
            bold: true,
            size: 36,
            color: "0F172A",
            font: "Arial",
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: documento.objeto,
            size: 24,
            color: "334155",
            font: "Arial",
          }),
        ],
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Data: ${new Date(documento.dataCriacao).toLocaleDateString("pt-BR")}    |    Conformidade: ${preenchidos}/${total} incisos (${percentual}%)`,
            size: 18,
            color: "64748B",
            font: "Arial",
          }),
        ],
        spacing: { after: 300 },
      })
    );

    // Separator
    children.push(
      new Paragraph({
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
        },
        spacing: { after: 300 },
      })
    );

    // Incisos
    for (const inciso of INCISOS_ART18) {
      const dados = documento.incisos[inciso.numero];
      if (!dados?.preenchido) continue;

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Inciso ${inciso.numero} — ${inciso.titulo}`,
              bold: true,
              size: 24,
              color: "1E40AF",
              font: "Arial",
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 80 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: inciso.textoLegal,
              italics: true,
              size: 16,
              color: "94A3B8",
              font: "Arial",
            }),
          ],
          spacing: { after: 120 },
        })
      );

      // Split content by paragraphs
      const paragraphs = dados.conteudo.split("\n").filter((p) => p.trim());
      for (const p of paragraphs) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: p,
                size: 22,
                color: "1E293B",
                font: "Arial",
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 80 },
          })
        );
      }

      children.push(
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
          },
          spacing: { after: 200 },
        })
      );
    }

    // Footer
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Gerado pelo Sistema Automatizado de Criação — By Skynet Tecnologia",
            size: 16,
            color: "94A3B8",
            font: "Arial",
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
      })
    );

    const docx = new Document({
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(docx);
    const nomeArquivo = `${documento.tipo}_${documento.objeto.slice(0, 30).replace(/\s+/g, "_")}.docx`;
    saveAs(blob, nomeArquivo);
  };

  return (
    <div className="border-t bg-surface px-8 py-5">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-body font-semibold text-foreground">
              Exportar Documento
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {incisosPreenchidos.length} de {INCISOS_ART18.length} incisos preenchidos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportarPDF}
              disabled={incisosPreenchidos.length === 0}
              className="gap-1.5"
            >
              <FileDown className="h-4 w-4" />
              Baixar PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportarWord}
              disabled={incisosPreenchidos.length === 0}
              className="gap-1.5"
            >
              <FileText className="h-4 w-4" />
              Baixar Word
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
