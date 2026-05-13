import { PDFDocument, rgb, LineCapStyle } from 'pdf-lib';
import type { PdfAnnotation } from '../components/pdf/types/pdf-annotation';

/**
 * Saves PDF with annotations rendered on top of existing pages.
 * Returns a blob URL for download.
 */
export async function savePdfWithAnnotations(
  source: string | ArrayBuffer,
  annotations: PdfAnnotation[]
): Promise<string> {
  let arrayBuffer: ArrayBuffer;

  if (typeof source === 'string') {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    arrayBuffer = await response.arrayBuffer();
  } else {
    arrayBuffer = source;
  }

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (const annotation of annotations) {
    const pageIndex = annotation.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;

    const page = pages[pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    if (annotation.type === 'highlight') {
      const x = (annotation.x / 100) * pageWidth;
      const y = pageHeight - (annotation.y / 100) * pageHeight - (annotation.height / 100) * pageHeight;
      const w = (annotation.width / 100) * pageWidth;
      const h = (annotation.height / 100) * pageHeight;

      const hex = annotation.color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      page.drawRectangle({ x, y, width: w, height: h, color: rgb(r, g, b), opacity: 0.4 });
    }

    if (annotation.type === 'drawing' && annotation.points && annotation.points.length >= 2) {
      const hex = annotation.color.replace('#', '');
      const strokeR = parseInt(hex.substring(0, 2), 16) / 255;
      const strokeG = parseInt(hex.substring(2, 4), 16) / 255;
      const strokeB = parseInt(hex.substring(4, 6), 16) / 255;
      const lineWidth = Number(annotation.content) || 2;

      const points = annotation.points.map((p) => ({
        x: (p.x / 100) * pageWidth,
        y: pageHeight - (p.y / 100) * pageHeight,
      }));

      // Draw each line segment individually (pdf-lib path API)
      for (let i = 0; i < points.length - 1; i++) {
        page.drawLine({
          start: { x: points[i].x, y: points[i].y },
          end: { x: points[i + 1].x, y: points[i + 1].y },
          thickness: lineWidth,
          color: rgb(strokeR, strokeG, strokeB),
          lineCap: LineCapStyle.Round,
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

/**
 * Triggers browser download of a blob URL.
 */
export function downloadBlobUrl(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}