import { usePdfViewer } from '../viewer/pdf-viewer-context';

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
    setHighlightColor,
    toggleThumbnails,
  } = usePdfViewer();

  const { currentPage, numPages, scale, activeTool, highlightColor, showThumbnails } = state;
  const scalePercent = Math.round(scale * 100);

  return (
    <div className="flex items-center gap-1 p-2 px-3 border-b shrink-0 bg-surface border-border">
      <div className="flex items-center gap-1">
        <button
          className={`${BTN_BASE} ${BTN_IDLE}`}
          onClick={prevPage}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          ◀
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
          ▶
        </button>
      </div>

      <div className="w-px h-5 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <button className={`${BTN_BASE} ${BTN_IDLE}`} onClick={zoomOut} title="Zoom out">
          −
        </button>
        <span className="min-w-[48px] text-center text-sm text-text">{scalePercent}%</span>
        <button className={`${BTN_BASE} ${BTN_IDLE}`} onClick={zoomIn} title="Zoom in">
          +
        </button>
        <button className={`${BTN_BASE} ${BTN_IDLE}`} onClick={resetZoom} title="Reset zoom">
          ⟲
        </button>
      </div>

      <div className="w-px h-5 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <button
          className={`${BTN_BASE} ${activeTool === 'highlight' ? BTN_ACTIVE : BTN_IDLE}`}
          onClick={() => setActiveTool(activeTool === 'highlight' ? 'none' : 'highlight')}
          title="Highlight tool"
        >
          🖍️
        </button>
        {activeTool === 'highlight' && (
          <input
            type="color"
            className="p-0 bg-transparent border rounded cursor-pointer w-7 h-7 border-border"
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
            title="Highlight color"
          />
        )}
        <button
          className={`${BTN_BASE} ${activeTool === 'note' ? BTN_ACTIVE : BTN_IDLE}`}
          onClick={() => setActiveTool(activeTool === 'note' ? 'none' : 'note')}
          title="Note tool"
        >
          📝
        </button>
      </div>

      <div className="w-px h-5 mx-1 bg-border" />

      <div className="flex items-center gap-1">
        <button
          className={`${BTN_BASE} ${showThumbnails ? BTN_ACTIVE : BTN_IDLE}`}
          onClick={toggleThumbnails}
          title="Toggle thumbnails"
        >
          🖼️
        </button>
      </div>
    </div>
  );
}
