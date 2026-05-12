import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { usePdfViewer } from '../viewer/pdf-viewer-context';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfThumbnails() {
  const { state, setCurrentPage } = usePdfViewer();
  const { numPages, currentPage, file } = state;

  if (!file || numPages === 0) return null;

  return (
    <div className="w-[160px] flex flex-col shrink-0 bg-surface border-r border-border">
      <div className="p-[10px] pb-2 text-xs font-semibold uppercase tracking-wide text-text border-b border-border">
        <span>Pages</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        <Document
          file={file}
          loading={<div className="p-5 text-center text-xs text-text">Loading...</div>}
        >
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={`relative flex flex-col items-center gap-1 p-2 border-2 border-transparent rounded-md transition-all duration-150 cursor-pointer hover:bg-social-bg ${currentPage === pageNum ? 'border-accent bg-accent-bg' : 'bg-transparent'}`}
              onClick={() => setCurrentPage(pageNum)}
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
        </Document>
      </div>
    </div>
  );
}
