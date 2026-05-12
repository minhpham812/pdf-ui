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

  const drawBtnClasses = `w-full px-3 py-2 text-sm rounded-md border cursor-pointer transition-all duration-150 hover:bg-social-bg ${
    activeTool === 'highlight'
      ? 'bg-accent-bg border-accent-border text-accent'
      : 'bg-transparent border-border'
  }`;

  return (
    <div className="border rounded-lg bg-surface border-border">
      <div className="px-3 py-2 text-xs font-semibold border-b text-text border-border">
        <span>Highlight Tool</span>
      </div>
      <div className="p-3">
        <div>
          <button
            className={drawBtnClasses}
            onClick={() => setActiveTool(activeTool === 'highlight' ? 'none' : 'highlight')}
          >
            🖍️ Draw Highlight
          </button>
        </div>
        <div className="mt-3">
          <span className="block mb-1.5 text-xs text-text">Color:</span>
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <button
                key={c.value}
                className={`w-7 h-7 rounded-md border-2 cursor-pointer transition-all duration-150 hover:scale-110 ${
                  highlightColor === c.value ? 'border-text-heading' : 'border-transparent'
                }`}
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
