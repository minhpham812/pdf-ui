import { usePdfViewer } from '../viewer/pdf-viewer-context';

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
    <div className="pdf-toolbar">
      <div className="pdf-toolbar__group">
        <button
          className="pdf-toolbar__btn"
          onClick={prevPage}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          ◀
        </button>
        <span className="pdf-toolbar__page-info">
          <input
            type="number"
            className="pdf-toolbar__page-input"
            value={currentPage}
            min={1}
            max={numPages}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          />
          <span className="pdf-toolbar__page-total"> / {numPages}</span>
        </span>
        <button
          className="pdf-toolbar__btn"
          onClick={nextPage}
          disabled={currentPage >= numPages}
          title="Next page"
        >
          ▶
        </button>
      </div>

      <div className="pdf-toolbar__divider" />

      <div className="pdf-toolbar__group">
        <button className="pdf-toolbar__btn" onClick={zoomOut} title="Zoom out">
          −
        </button>
        <span className="pdf-toolbar__scale">{scalePercent}%</span>
        <button className="pdf-toolbar__btn" onClick={zoomIn} title="Zoom in">
          +
        </button>
        <button className="pdf-toolbar__btn" onClick={resetZoom} title="Reset zoom">
          ⟲
        </button>
      </div>

      <div className="pdf-toolbar__divider" />

      <div className="pdf-toolbar__group">
        <button
          className={`pdf-toolbar__btn ${activeTool === 'highlight' ? 'pdf-toolbar__btn--active' : ''}`}
          onClick={() => setActiveTool(activeTool === 'highlight' ? 'none' : 'highlight')}
          title="Highlight tool"
        >
          🖍️
        </button>
        {activeTool === 'highlight' && (
          <input
            type="color"
            className="pdf-toolbar__color-picker"
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
            title="Highlight color"
          />
        )}
        <button
          className={`pdf-toolbar__btn ${activeTool === 'note' ? 'pdf-toolbar__btn--active' : ''}`}
          onClick={() => setActiveTool(activeTool === 'note' ? 'none' : 'note')}
          title="Note tool"
        >
          📝
        </button>
      </div>

      <div className="pdf-toolbar__divider" />

      <div className="pdf-toolbar__group">
        <button
          className={`pdf-toolbar__btn ${showThumbnails ? 'pdf-toolbar__btn--active' : ''}`}
          onClick={toggleThumbnails}
          title="Toggle thumbnails"
        >
          🖼️
        </button>
      </div>
    </div>
  );
}
