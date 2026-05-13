import { Page } from 'react-pdf';
import { useEffect, useRef } from 'react';
import { usePdfViewer } from '../viewer/pdf-viewer-context';

export function PdfThumbnails() {
  const { state, setCurrentPage } = usePdfViewer();
  const { numPages, currentPage, file, showThumbnails } = state;
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const skipScrollRef = useRef(false);

  // Scroll active thumbnail into view when currentPage changes from scrolling PDF
  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentPage]);

  if (!showThumbnails || !file || numPages === 0) return null;

  return (
    <div className="w-[160px] flex flex-col shrink-0 bg-surface border-r border-border">
      <div className="p-[10px] pb-2 text-xs font-semibold uppercase tracking-wide text-text border-b border-border">
        <span>Pages</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            ref={currentPage === pageNum ? activeThumbRef : null}
            className={`relative flex flex-col items-center gap-1 p-2 border-2 border-transparent rounded-md transition-all duration-150 cursor-pointer hover:bg-social-bg ${
              currentPage === pageNum ? 'border-accent bg-accent-bg' : 'bg-transparent'
            }`}
            onClick={() => {
              skipScrollRef.current = true;
              setCurrentPage(pageNum);
            }}
            title={`Page ${pageNum}`}
          >
            <Page
              pageNumber={pageNum}
              scale={0.15}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              renderMode="canvas"
              className="max-w-full"
            />
            <span className="text-[11px] text-text">{pageNum}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
