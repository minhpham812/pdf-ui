import { useEffect, useCallback } from 'react';
import { usePdfViewer } from './viewer/pdf-viewer-context';

const HIGHLIGHT_COLORS = [
  '#fef08a', // yellow-200
  '#86efac', // green-300
  '#93c5fd', // blue-300
  '#fda4af', // rose-300
  '#fdba74', // orange-300
] as const;

interface PdfHighlightToolProps {
  defaultColor?: string;
}

/**
 * Tool that creates highlight annotations from text selection.
 * Must be rendered inside the page viewport area to receive events.
 */
export function PdfHighlightTool({ defaultColor = '#fef08a' }: PdfHighlightToolProps) {
  const { state, addAnnotation, setHighlightColor } = usePdfViewer();
  const { activeTool, highlightColor } = state;

  const handleSelection = useCallback(() => {
    if (activeTool !== 'highlight') return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    if (rects.length === 0) return;

    // Find the closest page container for the selection
    const commonAncestor = range.commonAncestorContainer as HTMLElement;
    const ancestorEl =
      commonAncestor.nodeType === Node.TEXT_NODE
        ? commonAncestor.parentElement
        : commonAncestor;
    const pageContainer = ancestorEl?.closest('[data-page-number]') as HTMLElement | null;

    if (!pageContainer) return;

    const pageAttr = pageContainer.getAttribute('data-page-number');
    if (!pageAttr) return;
    const pageNumber = Number(pageAttr);

    const containerRect = pageContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Create a highlight annotation for each rect in the selection
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      const x = ((rect.left - containerRect.left) / containerWidth) * 100;
      const y = ((rect.top - containerRect.top) / containerHeight) * 100;
      const width = (rect.width / containerWidth) * 100;
      const height = (rect.height / containerHeight) * 100;

      addAnnotation({
        page: pageNumber,
        type: 'highlight',
        x,
        y,
        width,
        height,
        color: highlightColor || defaultColor,
        content: '',
      });
    }

    // Clear selection after creating highlights
    selection.removeAllRanges();
  }, [activeTool, addAnnotation, highlightColor, defaultColor]);

  useEffect(() => {
    if (activeTool !== 'highlight') return;

    const handleMouseUp = () => {
      // Use setTimeout to let selection finalize
      setTimeout(handleSelection, 0);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeTool, handleSelection]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {activeTool === 'highlight' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1.5 bg-surface border border-border rounded-lg shadow-lg pointer-events-auto w-max">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setHighlightColor(color)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                highlightColor === color ? 'border-text-heading scale-110' : 'border-transparent hover:border-border'
              }`}
              style={{ backgroundColor: color }}
              title={`Highlight color ${color}`}
            />
          ))}
          <input
            type="color"
            value={highlightColor || defaultColor}
            onChange={(e) => setHighlightColor(e.target.value)}
            className="w-6 h-6 p-0 bg-transparent border-0 cursor-pointer"
            title="Custom highlight color"
          />
        </div>
      )}
    </div>
  );
}
