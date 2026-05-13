import { useEffect, useRef, type ReactNode } from 'react';
import { Document } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../../../utils/pdf-worker';
import { PdfViewerProvider } from './pdf-viewer-provider';
import { usePdfViewer } from './pdf-viewer-context';
import { PdfViewerPage } from '../pdf-page';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface PdfViewerRootProps {
  url?: string | ArrayBuffer;
  file?: string | ArrayBuffer;
  initialScale?: number;
  initialAnnotations?: import('../types/pdf-annotation').PdfAnnotation[];
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
// Pages: convenience component that auto-renders every page
// Scrolls the active page into view whenever `currentPage` changes.
// ---------------------------------------------------------------------------

export function PdfViewerPages({ className = '' }: { className?: string }) {
  const { state, setCurrentPage } = usePdfViewer();
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextScrollRef = useRef(false);
  const isUserScrolling = useRef(false);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageRatiosRef = useRef<Map<number, number>>(new Map());
  const currentPageRef = useRef(state.currentPage);

  // Keep ref in sync with state for observer callback
  useEffect(() => {
    currentPageRef.current = state.currentPage;
  }, [state.currentPage]);

  // Scroll viewer to currentPage when it changes from external source (e.g., thumbnail click)
  useEffect(() => {
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }

    const container = containerRef.current;
    if (!container || state.numPages === 0) return;
    const target = container.querySelector<HTMLElement>(
      `[data-page-number="${state.currentPage}"]`
    );
    if (target) {
      isProgrammaticScroll.current = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.currentPage, state.numPages]);

  // IntersectionObserver to detect most-visible page during user scroll
  useEffect(() => {
    if (state.numPages === 0) return;

    const container = containerRef.current;
    if (!container) return;
    const scrollParent = container.parentElement;
    if (!scrollParent) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
        isUserScrolling.current = false;
        return;
      }
      isUserScrolling.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 150);
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!isUserScrolling.current) return;

        entries.forEach((entry) => {
          const pageNum = Number(
            (entry.target as HTMLElement).getAttribute('data-page-number')
          );
          if (entry.isIntersecting) {
            pageRatiosRef.current.set(pageNum, entry.intersectionRatio);
          } else {
            pageRatiosRef.current.delete(pageNum);
          }
        });

        let bestPage = currentPageRef.current;
        let bestRatio = 0;
        pageRatiosRef.current.forEach((ratio, pageNum) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestPage = pageNum;
          }
        });

        if (bestPage !== currentPageRef.current && bestRatio > 0) {
          skipNextScrollRef.current = true;
          setCurrentPage(bestPage);
        }
      },
      {
        root: scrollParent,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    const pages = container.querySelectorAll<HTMLElement>('[data-page-number]');
    pages.forEach((page) => observer.observe(page));

    const pageRatios = pageRatiosRef.current;
    return () => {
      observer.disconnect();
      pageRatios.clear();
      scrollParent.removeEventListener('scroll', handleScroll);
    };
  }, [state.numPages, setCurrentPage]);

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