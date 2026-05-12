import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { usePdfViewer } from '../viewer/pdf-viewer-context';
import './pdf-thumbnails.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfThumbnails() {
  const { state, setCurrentPage } = usePdfViewer();
  const { numPages, currentPage, file } = state;

  if (!file || numPages === 0) return null;

  return (
    <div className="pdf-thumbnails">
      <div className="pdf-thumbnails__header">
        <span>Pages</span>
      </div>
      <div className="pdf-thumbnails__list">
        <Document
          file={file}
          loading={<div className="pdf-thumbnails__loading">Loading...</div>}
        >
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={`pdf-thumbnails__item ${currentPage === pageNum ? 'pdf-thumbnails__item--active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
              title={`Page ${pageNum}`}
            >
              <Page
                pageNumber={pageNum}
                scale={0.15}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                renderMode="canvas"
              />
              <span className="pdf-thumbnails__label">{pageNum}</span>
            </button>
          ))}
        </Document>
      </div>
    </div>
  );
}