import { useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { PdfViewerProvider } from './pdf-viewer-provider';
import { usePdfViewer } from './pdf-viewer-context';
import { PdfAnnotationLayer } from '../annotation-layer/pdf-annotation-layer';
import { PdfToolbar } from '../toolbar/pdf-toolbar';
import { PdfThumbnails } from '../thumbnails/pdf-thumbnails';
import type { PdfViewerState } from '../types/pdf-annotation';

// Worker setup for react-pdf v7+
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: string;
  className?: string;
  initialAnnotations?: PdfViewerState['annotations'];
}

function PdfViewerInner({ className = '' }: { className?: string }) {
  const { state } = usePdfViewer();
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new ResizeObserver(() => {
        // container size tracking for future features
      });
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div
      className={`flex flex-col h-full w-full overflow-hidden border rounded-lg bg-surface border-border ${className}`}
      ref={containerRef}
    >
      <PdfToolbar />
      <div className="flex flex-1 overflow-hidden">
        {state.showThumbnails && <PdfThumbnails />}
        <div className="flex flex-col items-center flex-1 p-4 overflow-auto bg-[#525659]">
          <PageRenderer
            pageNumber={state.currentPage}
            scale={state.scale}
            rotation={state.rotation}
          />
        </div>
      </div>
    </div>
  );
}

interface PageRendererProps {
  pageNumber: number;
  scale: number;
  rotation: number;
}

function PageRenderer({ pageNumber, scale, rotation }: PageRendererProps) {
  const { state, dispatch } = usePdfViewer();

  if (!state.file) return null;

  return (
    <Document
      file={state.file}
      onLoadSuccess={({ numPages }) => {
        dispatch({ type: 'SET_NUM_PAGES', payload: numPages });
        dispatch({ type: 'SET_LOADING', payload: false });
      }}
      onLoadError={(error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }}
      loading={<div className="flex items-center justify-center min-h-[200px] p-8 text-sm text-[#aaa]">Loading PDF...</div>}
      error={<div className="flex items-center justify-center min-h-[200px] p-8 text-sm text-red-400">Failed to load PDF</div>}
    >
      <div className="relative bg-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
        <Page
          pageNumber={pageNumber}
          scale={scale}
          rotate={rotation}
          renderAnnotationLayer={true}
          renderTextLayer={true}
          renderMode="canvas"
        />
        <PdfAnnotationLayer pageNumber={pageNumber} />
      </div>
    </Document>
  );
}

export function PdfViewer({
  file,
  className = '',
  initialAnnotations = [],
}: PdfViewerProps) {
  return (
    <PdfViewerProvider file={file} initialAnnotations={initialAnnotations}>
      <PdfViewerInner className={className} />
    </PdfViewerProvider>
  );
}

export default PdfViewer;