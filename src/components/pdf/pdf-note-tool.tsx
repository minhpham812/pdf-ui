import { useState, useCallback, useEffect, useRef } from 'react';
import { usePdfViewer } from './viewer/pdf-viewer-context';

interface PdfNoteToolProps {
  defaultColor?: string;
}

/**
 * Tool for placing note markers on click.
 * When user clicks on a page while activeTool === 'note', this creates
 * a note annotation with the clicked position and opens an inline editor.
 */
export function PdfNoteTool({ defaultColor = '#facc15' }: PdfNoteToolProps) {
  const { state, addAnnotation, setActiveTool } = usePdfViewer();
  const { activeTool } = state;
  const [editorPos, setEditorPos] = useState<{ x: number; y: number } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePageClick = useCallback(
    (e: MouseEvent) => {
      if (activeTool !== 'note') return;

      // Find closest page container
      const target = e.target as HTMLElement;
      const pageContainer = target.closest('[data-page-number]') as HTMLElement | null;
      if (!pageContainer) return;

      e.preventDefault();
      e.stopPropagation();

      const pageAttr = pageContainer.getAttribute('data-page-number');
      if (!pageAttr) return;
      setPageNumber(Number(pageAttr));

      const rect = pageContainer.getBoundingClientRect();
      setEditorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [activeTool]
  );

  const saveNote = useCallback(() => {
    if (!editorPos || pageNumber === 0) return;

    addAnnotation({
      page: pageNumber,
      type: 'note',
      x: editorPos.x,
      y: editorPos.y,
      width: 3,
      height: 3,
      color: defaultColor,
      content: noteText,
    });

    setEditorPos(null);
    setNoteText('');
    setPageNumber(0);
    setActiveTool('none');
  }, [editorPos, pageNumber, noteText, addAnnotation, setActiveTool, defaultColor]);

  const cancelNote = useCallback(() => {
    setEditorPos(null);
    setNoteText('');
    setPageNumber(0);
    setActiveTool('none');
  }, [setActiveTool]);

  useEffect(() => {
    if (activeTool !== 'note') return;

    document.addEventListener('click', handlePageClick, { capture: true });
    return () => {
      document.removeEventListener('click', handlePageClick, { capture: true });
    };
  }, [activeTool, handlePageClick]);

  // Do not render anything when not placing a note
  if (!editorPos) return null;

  return (
    <div
      ref={containerRef}
      className="absolute z-50 pointer-events-none"
      style={{ left: editorPos.x, top: editorPos.y }}
    >
      <div
        className="pointer-events-auto rounded-lg border border-border bg-surface p-3 shadow-lg w-[260px]"
        style={{ transform: 'translate(-50%, -110%)' }}
      >
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-surface border-r border-b border-border" />
        <h4 className="text-sm font-semibold text-text-heading mb-2 relative">Add Note</h4>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note..."
          className="relative w-full min-h-[80px] p-2 mb-2 text-sm border rounded-md resize-y text-text-heading bg-surface border-border focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_var(--color-accent-bg)]"
          rows={3}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) saveNote();
          }}
        />
        <div className="relative flex justify-end gap-1.5">
          <button
            className="px-3 py-1.5 text-xs rounded-md border cursor-pointer transition-all duration-150 bg-transparent text-text border-border hover:bg-social-bg"
            onClick={cancelNote}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 text-xs rounded-md border cursor-pointer transition-all duration-150 bg-accent text-white border-accent hover:opacity-90"
            onClick={saveNote}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
