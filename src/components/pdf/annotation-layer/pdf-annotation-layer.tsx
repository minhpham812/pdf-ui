import { Popover } from '@base-ui/react/popover';
import { usePdfViewer } from '../viewer/pdf-viewer-context';
import { NotebookPen } from 'lucide-react';

interface PdfAnnotationLayerProps {
  pageNumber: number;
  tempStroke?: Array<{ x: number; y: number }> | null;
  strokeColor?: string;
  strokeWidth?: number;
}

/**
 * Absolute-positioned overlay that renders annotations for a single page.
 * - Drawings: freehand strokes as SVG polylines
 * - Highlights: semi-transparent colored rectangles
 * - Notes: clickable markers with @base-ui/react Popover for viewing text
 */
export function PdfAnnotationLayer({
  pageNumber,
  tempStroke,
  strokeColor = '#ef4444',
  strokeWidth = 2,
}: PdfAnnotationLayerProps) {
  const { state, removeAnnotation } = usePdfViewer();
  const { annotations } = state;

  const pageAnnotations = annotations.filter((a) => a.page === pageNumber);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Saved annotations */}
      {pageAnnotations.map((annotation) => {
        if (annotation.type === 'drawing') {
          const points = annotation.points ?? [];
          if (points.length < 2) return null;
          const pathD = points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');
          return (
            <div
              key={annotation.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ left: `${annotation.x}%`, top: `${annotation.y}%`, width: `${annotation.width}%`, height: `${annotation.height}%`, zIndex: 20 }}
              onClick={() => {
                if (state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              onMouseEnter={(e) => {
                if (e.buttons === 1 && state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              title="Eraser: click or drag to delete drawing"
            >
              <svg
                className="w-full h-full overflow-visible"
                viewBox={`${annotation.x} ${annotation.y} ${annotation.width} ${annotation.height}`}
                preserveAspectRatio="none"
              >
                <path
                  d={pathD}
                  fill="none"
                  stroke={annotation.color}
                  strokeWidth={Number(annotation.content) / 5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          );
        }

        if (annotation.type === 'highlight') {
          return (
            <div
              key={annotation.id}
              className="absolute pointer-events-auto cursor-pointer rounded-sm mix-blend-multiply hover:brightness-90 transition-all"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: `${annotation.width}%`,
                height: `${annotation.height}%`,
                backgroundColor: annotation.color + '66',
                borderColor: annotation.color,
                borderWidth: '2px',
                borderStyle: 'solid',
                zIndex: 15,
              }}
              onClick={() => {
                if (state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              onMouseEnter={(e) => {
                if (e.buttons === 1 && state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              title="Eraser: click or drag to delete highlight"
            />
          );
        }

        // Note annotation with Popover
        return (
          <Popover.Root key={annotation.id}>
            <Popover.Trigger
              className="absolute flex items-center justify-center w-6 h-6 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)] pointer-events-auto transition-transform hover:scale-110"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                backgroundColor: annotation.color,
                zIndex: 15,
              }}
            >
              <NotebookPen className="w-3.5 h-3.5 text-yellow-900" />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner align="center" side="top" sideOffset={8}>
                <Popover.Popup className="rounded-lg border border-border bg-surface p-3 shadow-lg max-w-xs z-50">
                  <Popover.Arrow className="fill-surface stroke-border" />
                  <p className="text-sm text-text whitespace-pre-wrap">
                    {annotation.content || 'No note text'}
                  </p>
                  <button
                    className="mt-2 text-xs text-red-500 hover:underline cursor-pointer"
                    onClick={() => removeAnnotation(annotation.id)}
                  >
                    Delete note
                  </button>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        );
      })}

      {/* Live stroke preview */}
      {tempStroke && tempStroke.length >= 2 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 25 }}
        >
          <path
            d={tempStroke.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth / 5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}