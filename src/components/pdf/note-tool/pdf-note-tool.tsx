import { usePdfViewer } from '../viewer/pdf-viewer-context';

export function PdfNoteTool() {
  const { state, setActiveTool } = usePdfViewer();
  const { activeTool } = state;

  const btnClasses = `w-full px-3 py-2 text-sm rounded-md border cursor-pointer transition-all duration-150 hover:bg-social-bg ${
    activeTool === 'note'
      ? 'bg-accent-bg border-accent-border text-accent'
      : 'bg-transparent border-border'
  }`;

  return (
    <div className="border rounded-lg bg-surface border-border">
      <div className="px-3 py-2 text-xs font-semibold border-b text-text border-border">
        <span>Note Tool</span>
      </div>
      <div className="p-3">
        <button
          className={btnClasses}
          onClick={() => setActiveTool(activeTool === 'note' ? 'none' : 'note')}
        >
          📝 Add Note
        </button>
        <p className="mt-2 text-xs leading-relaxed text-text">
          Click on the page to place a note marker
        </p>
      </div>
    </div>
  );
}
