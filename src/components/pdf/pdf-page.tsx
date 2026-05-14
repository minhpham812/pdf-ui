import { Page } from 'react-pdf';
import { usePdfViewer } from './viewer/pdf-viewer-context';
import { PdfAnnotationLayer } from './annotation-layer/pdf-annotation-layer';

export interface PdfViewerPageProps {
  pageNumber: number;
  className?: string;
}

/**
 * Renders a single PDF page with annotation overlay
 */
export function PdfViewerPage({ pageNumber, className = '' }: PdfViewerPageProps) {
  const { state } = usePdfViewer();
  return (
    <div
      data-page-number={pageNumber}
      className={`relative bg-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${className}`}
    >
      <Page
        pageNumber={pageNumber}
        scale={state.scale}
        rotate={state.rotation}
        renderAnnotationLayer={true}
        renderTextLayer={true}
        renderMode="canvas"
      />
      <PdfAnnotationLayer pageNumber={pageNumber} />
    </div>
  );
}