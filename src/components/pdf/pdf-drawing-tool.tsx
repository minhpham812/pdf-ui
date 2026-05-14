import { useEffect, useCallback, useRef } from 'react';
import { usePdfViewer } from './viewer/pdf-viewer-context';
import { useDrawing } from './drawing-tool/use-drawing';

const DRAW_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#000000', // black
] as const;

const STROKE_WIDTHS = [2, 4, 6, 8] as const;

/**
 * Freehand drawing tool on PDF pages.
 * User drags to draw strokes on the active page.
 * Strokes are stored as percentage-based point arrays.
 */
export function PdfDrawingTool() {
  const { state, addAnnotation } = usePdfViewer();
  const { activeTool } = state;
  const { setTempStroke, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, setActiveDrawingPage } = useDrawing();

  const isDrawingRef = useRef(false);
  const pageContainerRef = useRef<HTMLElement | null>(null);
  const currentStrokeRef = useRef<Array<{ x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLocalPosition = useCallback((e: MouseEvent, container: HTMLElement) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  }, []);

  useEffect(() => {
    if (activeTool !== 'draw') return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const container = target.closest('[data-page-number]') as HTMLElement | null;
      if (!container) return;

      e.preventDefault();
      pageContainerRef.current = container;
      isDrawingRef.current = true;
      const pos = getLocalPosition(e, container);
      currentStrokeRef.current = [pos];
      setTempStroke([pos]);

      const pageAttr = container.getAttribute('data-page-number');
      if (pageAttr) {
        setActiveDrawingPage(Number(pageAttr));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current || !pageContainerRef.current) return;
      e.preventDefault();

      const pos = getLocalPosition(e, pageContainerRef.current);
      currentStrokeRef.current.push(pos);
      setTempStroke([...currentStrokeRef.current]);
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current || !pageContainerRef.current) return;
      isDrawingRef.current = false;

      const points = currentStrokeRef.current;
      if (points.length < 2) {
        setTempStroke(null);
        return;
      }

      const container = pageContainerRef.current;
      const pageAttr = container.getAttribute('data-page-number');
      if (!pageAttr) {
        setTempStroke(null);
        return;
      }
      const pageNumber = Number(pageAttr);

      // Calculate bounding box with a small padding so perfectly
      // horizontal/vertical strokes still have a visible container
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const padding = 1;
      const minX = Math.max(0, Math.min(...xs) - padding);
      const minY = Math.max(0, Math.min(...ys) - padding);
      const maxX = Math.min(100, Math.max(...xs) + padding);
      const maxY = Math.min(100, Math.max(...ys) + padding);

      addAnnotation({
        page: pageNumber,
        type: 'drawing',
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        color: strokeColor,
        content: String(strokeWidth),
        points,
      });

      currentStrokeRef.current = [];
      setTempStroke(null);
      setActiveDrawingPage(null);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeTool, getLocalPosition, addAnnotation, strokeColor, strokeWidth, setTempStroke]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none">
      {activeTool === 'draw' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-surface border border-border rounded-lg shadow-lg pointer-events-auto w-max">
          <div className="flex items-center gap-1">
            {DRAW_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  strokeColor === color ? 'border-text-heading scale-125' : 'border-transparent hover:border-border'
                }`}
                style={{ backgroundColor: color }}
                title={`Draw color ${color}`}
              />
            ))}
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              title="Custom color"
            />
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-1">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                  strokeWidth === w ? 'bg-accent-bg border border-accent-border' : 'hover:bg-social-bg'
                }`}
                title={`Stroke width ${w}`}
              >
                <div
                  className="rounded-full bg-text-heading"
                  style={{ width: w * 2, height: w * 2 }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
