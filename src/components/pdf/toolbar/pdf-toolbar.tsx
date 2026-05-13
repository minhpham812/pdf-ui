import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Highlighter,
  Pencil,
  Eraser,
  LayoutGrid,
  Download,
} from 'lucide-react';
import { useState } from 'react';
import { usePdfViewer } from '../viewer/pdf-viewer-context';
import { savePdfWithAnnotations, downloadBlobUrl } from '../../../utils/pdf-save-utils';

const BTN_BASE =
  'inline-flex items-center justify-center w-8 h-8 border rounded-md transition-all duration-150 hover:bg-social-bg hover:border-border disabled:opacity-40 disabled:cursor-not-allowed';
const BTN_IDLE = 'border-transparent text-text';
const BTN_ACTIVE = 'bg-accent-bg border-accent-border text-accent';

export function PdfToolbar() {
  const {
    state,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    resetZoom,
    setCurrentPage,
    setActiveTool,
    toggleThumbnails,
  } = usePdfViewer();

  const { currentPage, numPages, scale, activeTool, showThumbnails, file, annotations } = state;
  const scalePercent = Math.round(scale * 100);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!file || isSaving) return;
    setIsSaving(true);
    try {
      const url = await savePdfWithAnnotations(file, annotations);
      const filename = typeof file === 'string'
        ? file.split('/').pop()?.replace('.pdf', '-annotated.pdf') ?? 'document-annotated.pdf'
        : 'document-annotated.pdf';
      downloadBlobUrl(url, filename);
    } catch (err) {
      console.error('Failed to save PDF:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 px-3 border-b shrink-0 bg-surface border-border">
      <div className="flex items-center gap-1">
        <button
          className={`${BTN_BASE} ${BTN_IDLE}`}
          onClick={prevPage}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="flex items-center gap-1 text-sm text-text">
          <input
            type="number"
            className="w-12 text-center text-sm border rounded h-7 text-text-heading bg-surface border-border focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_var(--color-accent-bg)]"
            value={currentPage}
            min={1}
            max={numPages}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          />
          <span> / {numPages}</span>
        </span>
        <button
          className={`${BTN_BASE} ${BTN_IDLE}`}
          onClick={nextPage}
          disabled={currentPage >= numPages}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-5 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <button className={`${BTN_BASE} ${BTN_IDLE}`} onClick={zoomOut} title="Zoom out">
          <Minus className="w-4 h-4" />
        </button>
        <span className="min-w-[48px] text-center text-sm text-text">{scalePercent}%</span>
        <button className={`${BTN_BASE} ${BTN_IDLE}`} onClick={zoomIn} title="Zoom in">
          <Plus className="w-4 h-4" />
        </button>
        <button className={`${BTN_BASE} ${BTN_IDLE}`} onClick={resetZoom} title="Reset zoom">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-5 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <button
          className={`${BTN_BASE} ${activeTool === 'highlight' ? BTN_ACTIVE : BTN_IDLE}`}
          onClick={() => setActiveTool(activeTool === 'highlight' ? 'none' : 'highlight')}
          title="Highlight tool"
        >
          <Highlighter className="w-4 h-4" />
        </button>
        <button
          className={`${BTN_BASE} ${activeTool === 'draw' ? BTN_ACTIVE : BTN_IDLE}`}
          onClick={() => setActiveTool(activeTool === 'draw' ? 'none' : 'draw')}
          title="Drawing tool"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          className={`${BTN_BASE} ${activeTool === 'erase' ? BTN_ACTIVE : BTN_IDLE}`}
          onClick={() => setActiveTool(activeTool === 'erase' ? 'none' : 'erase')}
          title="Eraser"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-5 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <button
          className={`${BTN_BASE} ${showThumbnails ? BTN_ACTIVE : BTN_IDLE}`}
          onClick={toggleThumbnails}
          title="Toggle thumbnails"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          className={`${BTN_BASE} ${BTN_IDLE} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSave}
          disabled={!file || isSaving}
          title="Save PDF with annotations"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
