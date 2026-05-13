import { useEffect, useRef, type ReactNode } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../../../utils/pdf-worker';
import { PdfViewerProvider } from './pdf-viewer-provider';
import { usePdfViewer } from './pdf-viewer-context';
import { PdfAnnotationLayer } from '../annotation-layer/pdf-annotation-layer';
import type { PdfAnnotation } from '../types/pdf-annotation';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface PdfViewerRootProps {
  url?: string | ArrayBuffer;
  file?: string | ArrayBuffer;
  initialScale?: number;
  initialAnnotations?: PdfAnnotation[];
  children?: ReactNode;
  className?: string;
}

function RootLayout({ children, className }: { children?: ReactNode; className: string }) {
  const { state, dispatch } = usePdfViewer();
  const { file } = state;

  if (!file) {
    return (
      <div className={`flex flex-col h-full w-full overflow-hidden border rounded-lg bg-surface border-border ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }) => {
        dispatch({ type: 'SET_NUM_PAGES', payload: numPages });
        dispatch({ type: 'SET_LOADING', payload: false });
      }}
      onLoadError={(error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }}
      loading={
        <div className="flex flex-col h-full w-full overflow-hidden border rounded-lg bg-surface border-border items-center justify-center text-sm text-[#aaa]">
          Loading PDF...
        </div>
      }
      error={
        <div className="flex flex-col h-full w-full overflow-hidden border rounded-lg bg-surface border-border items-center justify-center text-sm text-red-400">
          Failed to load PDF
        </div>
      }
    >
      <div className={`flex flex-col h-full w-full overflow-hidden border rounded-lg bg-surface border-border ${className}`}>
        {children}
      </div>
    </Document>
  );
}

export function PdfViewerRoot({
  url,
  file,
  initialScale = 1,
  initialAnnotations = [],
  children,
  className = '',
}: PdfViewerRootProps) {
  const source = url ?? file;
  if (!source) {
    throw new Error('PdfViewer.Root requires either `url` or `file` prop');
  }

  return (
    <PdfViewerProvider
      file={source}
      initialScale={initialScale}
      initialAnnotations={initialAnnotations}
    >
      <RootLayout className={className}>{children}</RootLayout>
    </PdfViewerProvider>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export interface PdfViewerPageProps {
  pageNumber: number;
  className?: string;
}

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

// ---------------------------------------------------------------------------
// Pages: convenience component that auto-renders every page
// Scrolls the active page into view whenever `currentPage` changes.
// ---------------------------------------------------------------------------

export function PdfViewerPages({ className = '' }: { className?: string }) {
  const { state } = usePdfViewer();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || state.numPages === 0) return;
    const target = container.querySelector<HTMLElement>(
      `[data-page-number="${state.currentPage}"]`
    );
    if (target) {
      // scroll within the closest scrollable ancestor
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.currentPage, state.numPages]);

  if (state.numPages === 0) return null;
  return (
    <div ref={containerRef} className="flex flex-col items-center w-full">
      {Array.from({ length: state.numPages }, (_, i) => i + 1).map((pageNum) => (
        <PdfViewerPage
          key={pageNum}
          pageNumber={pageNum}
          className={`mb-4 last:mb-0 ${className}`}
        />
      ))}
    </div>
  );
}
