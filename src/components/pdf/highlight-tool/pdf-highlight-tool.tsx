import { usePdfViewer } from '../viewer/pdf-viewer-context';

export function PdfHighlightTool() {
  const { state, setActiveTool, setHighlightColor } = usePdfViewer();
  const { activeTool, highlightColor } = state;

  const colors = [
    { name: 'Yellow', value: '#ffe066' },
    { name: 'Green', value: '#66e0a3' },
    { name: 'Blue', value: '#66b3ff' },
    { name: 'Pink', value: '#ff99cc' },
    { name: 'Orange', value: '#ffb366' },
  ];

  return (
    <div className="pdf-highlight-tool">
      <div className="pdf-highlight-tool__header">
        <span>Highlight Tool</span>
      </div>
      <div className="pdf-highlight-tool__content">
        <div className="pdf-highlight-tool__mode">
          <button
            className={`pdf-highlight-tool__btn ${activeTool === 'highlight' ? 'pdf-highlight-tool__btn--active' : ''}`}
            onClick={() => setActiveTool(activeTool === 'highlight' ? 'none' : 'highlight')}
          >
            🖍️ Draw Highlight
          </button>
        </div>
        <div className="pdf-highlight-tool__colors">
          <span className="pdf-highlight-tool__label">Color:</span>
          <div className="pdf-highlight-tool__color-grid">
            {colors.map((c) => (
              <button
                key={c.value}
                className={`pdf-highlight-tool__color ${highlightColor === c.value ? 'pdf-highlight-tool__color--active' : ''}`}
                style={{ backgroundColor: c.value }}
                onClick={() => setHighlightColor(c.value)}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}