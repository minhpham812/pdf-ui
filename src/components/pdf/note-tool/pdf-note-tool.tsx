import { usePdfViewer } from '../viewer/pdf-viewer-context';

export function PdfNoteTool() {
  const { state, setActiveTool } = usePdfViewer();
  const { activeTool } = state;

  return (
    <div className="pdf-note-tool">
      <div className="pdf-note-tool__header">
        <span>Note Tool</span>
      </div>
      <div className="pdf-note-tool__content">
        <button
          className={`pdf-note-tool__btn ${activeTool === 'note' ? 'pdf-note-tool__btn--active' : ''}`}
          onClick={() => setActiveTool(activeTool === 'note' ? 'none' : 'note')}
        >
          📝 Add Note
        </button>
        <p className="pdf-note-tool__hint">
          Click on the page to place a note marker
        </p>
      </div>
    </div>
  );
}